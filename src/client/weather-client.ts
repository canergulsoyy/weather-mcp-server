import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import { z } from "zod";

// Tool tanımları
const WEATHER_TOOL_SCHEMA = z.object({
    city: z.string().describe("Şehir adı"),
    country: z.string().optional().describe("Ülke kodu (opsiyonel)"),
    date: z.string().describe("Tarih (YYYY-MM-DD formatında)")
});

export class WeatherLLMClient {
    private mcpClient: Client;
    private openai: OpenAI;
    private transport?: StdioClientTransport;
    private isInitialized = false;

    constructor(private mcpServerPath: string) {
        this.mcpClient = new Client({
            name: "weather-llm-client",
            version: "1.0.0"
        });

        // OpenRouter konfigürasyonu
        const openrouterApiKey = process.env.OPENROUTER_API_KEY;
        const openrouterBaseUrl = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

        if (!openrouterApiKey) {
            throw new Error("OPENROUTER_API_KEY environment variable bulunamadı!");
        }

        this.openai = new OpenAI({
            apiKey: openrouterApiKey,
            baseURL: openrouterBaseUrl,
            defaultHeaders: {
                "HTTP-Referer": "https://github.com/your-repo/mcp-weather-server",
                "X-Title": "MCP Weather Server"
            }
        });
    }

    async initialize(): Promise<void> {
        try {
            // MCP Server'a bağlan
            this.transport = new StdioClientTransport({
                command: "node",
                args: [this.mcpServerPath]
            });

            await this.mcpClient.connect(this.transport);
            this.isInitialized = true;

            console.log('🔗 MCP Server bağlantısı kuruldu');
            console.log('🤖 OpenRouter LLM bağlantısı kuruldu (gpt-oss-20b:free)');
        } catch (error) {
            throw new Error(`MCP Server bağlantısı başarısız: ${error instanceof Error ? error.message : error}`);
        }
    }

    async listTools(): Promise<any[]> {
        if (!this.isInitialized) {
            throw new Error("Client henüz başlatılmadı");
        }

        try {
            const tools = await this.mcpClient.listTools();
            return tools.tools || [];
        } catch (error) {
            throw new Error(`Araçlar listelenemedi: ${error instanceof Error ? error.message : error}`);
        }
    }

    async processQuestion(question: string): Promise<string> {
        if (!this.isInitialized) {
            throw new Error("Client henüz başlatılmadı");
        }

        try {
            // 1. OpenRouter ile soruyu analiz et ve uygun tool'u seç
            const toolSelection = await this.analyzeQuestionWithLLM(question);

            // 2. MCP Server'dan tool'u çağır
            const toolResult = await this.callMCPTool(toolSelection);

            // 3. Sonucu OpenRouter ile yorumla ve Türkçe doğal dil yanıtı oluştur
            const finalResponse = await this.generateNaturalLanguageResponse(question, toolResult);

            return finalResponse;

        } catch (error) {
            throw new Error(`Soru işlenemedi: ${error instanceof Error ? error.message : error}`);
        }
    }

    private async analyzeQuestionWithLLM(question: string): Promise<{
        toolName: string;
        parameters: any;
    }> {
        console.log('\n🔍 **LLM Parse Süreci Başlıyor**');
        console.log('📝 Kullanıcı sorusu:', question);

        const prompt = `
        Sen bir hava durumu asistanısın. Kullanıcının sorusunu analiz et ve uygun MCP tool'unu seç.
        
        Mevcut tool'lar:
        - get_weather_by_date: Belirli bir şehir ve tarih için hava durumu
        
        Kullanıcı sorusu: "${question}"
        
        Yanıtını şu JSON formatında ver:
        {
            "toolName": "get_weather_by_date",
            "parameters": {
                "city": "şehir adı",
                "country": "ülke kodu (opsiyonel)",
                "date": "YYYY-MM-DD formatında tarih"
            }
        }
        
        Önemli:
        - Tarihi mutlaka YYYY-MM-DD formatına çevir
        - Şehir adını Türkçe olarak kullan
        - Ülke kodu varsa ekle (TR, US, DE gibi)
        - Sadece JSON formatında yanıt ver, başka açıklama ekleme
        `;

        console.log('🤖 OpenRouter\'a gönderilen prompt:');
        console.log(prompt);

        const completion = await this.openai.chat.completions.create({
            model: "gpt-oss-20b:free",
            messages: [
                {
                    role: "system",
                    content: "Sen bir hava durumu asistanısın. Sadece JSON formatında yanıt ver."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 500
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("OpenRouter'dan yanıt alınamadı");
        }

        console.log('🤖 OpenRouter\'dan gelen ham yanıt:');
        console.log(response);

        try {
            // JSON parse et
            console.log('\n🔧 **JSON Parse Süreci**');
            const parsed = JSON.parse(response);
            console.log('✅ JSON parse başarılı:');
            console.log('   Tool Name:', parsed.toolName);
            console.log('   Parameters:', parsed.parameters);

            // Schema validation
            console.log('\n🔍 **Schema Validation**');
            console.log('   City:', parsed.parameters?.city);
            console.log('   Country:', parsed.parameters?.country || 'Belirtilmemiş');
            console.log('   Date:', parsed.parameters?.date);

            const validated = WEATHER_TOOL_SCHEMA.parse(parsed.parameters);
            console.log('✅ Schema validation başarılı:');
            console.log('   Validated city:', validated.city);
            console.log('   Validated country:', validated.country || 'Belirtilmemiş');
            console.log('   Validated date:', validated.date);

            return {
                toolName: parsed.toolName,
                parameters: validated
            };
        } catch (error) {
            console.error('❌ Parse hatası:', error);
            throw new Error(`Tool seçimi parse edilemedi: ${error instanceof Error ? error.message : error}`);
        }
    }

    private async callMCPTool(toolSelection: {
        toolName: string;
        parameters: any;
    }): Promise<any> {
        console.log('\n🚀 **MCP Tool Call Süreci**');
        console.log('   Tool Name:', toolSelection.toolName);
        console.log('   Parameters:', toolSelection.parameters);

        try {
            console.log('📡 MCP Server\'a tool çağrısı yapılıyor...');
            const result = await this.mcpClient.callTool({
                name: toolSelection.toolName,
                arguments: toolSelection.parameters
            });

            console.log('✅ MCP Tool call başarılı:');
            console.log('   Result:', JSON.stringify(result, null, 2));

            return result;
        } catch (error) {
            console.error('❌ MCP Tool call hatası:', error);
            throw new Error(`MCP Tool çağrısı başarısız: ${error instanceof Error ? error.message : error}`);
        }
    }

    private async generateNaturalLanguageResponse(
        originalQuestion: string,
        toolResult: any
    ): Promise<string> {
        console.log('\n🎨 **Natural Language Response Generation**');
        console.log('   Original Question:', originalQuestion);
        console.log('   Tool Result:', JSON.stringify(toolResult, null, 2));

        const prompt = `
        Sen bir hava durumu asistanısın. MCP tool'undan gelen teknik veriyi kullanarak, 
        kullanıcının orijinal sorusuna Türkçe doğal dilde yanıt ver.
        
        Kullanıcının orijinal sorusu: "${originalQuestion}"
        
        Tool'dan gelen veri: ${JSON.stringify(toolResult, null, 2)}
        
        Lütfen:
        1. Veriyi anlaşılır Türkçe ile açıkla
        2. Sıcaklık, yağış gibi bilgileri kullanıcı dostu şekilde sun
        3. Gerekirse ek bilgiler ekle (ör: "Bu tarihte hava güzel görünüyor")
        4. Sadece Türkçe yanıt ver, JSON formatında değil
        5. Yanıtı kısa ve öz tut
        
        Yanıt:
        `;

        console.log('🤖 OpenRouter\'a gönderilen response generation prompt:');
        console.log(prompt);

        const completion = await this.openai.chat.completions.create({
            model: "gpt-oss-20b:free",
            messages: [
                {
                    role: "system",
                    content: "Sen bir hava durumu asistanısın. Sadece Türkçe doğal dilde yanıt ver."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 300
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("Doğal dil yanıtı oluşturulamadı");
        }

        console.log('✅ Natural language response oluşturuldu:');
        console.log('   Response:', response);

        return response;
    }

    async cleanup(): Promise<void> {
        if (this.isInitialized) {
            try {
                await this.mcpClient.close();
                if (this.transport) {
                    this.transport.close();
                }
                this.isInitialized = false;
                console.log('🧹 Client temizlendi');
            } catch (error) {
                console.error('Temizlik hatası:', error);
            }
        }
    }
} 