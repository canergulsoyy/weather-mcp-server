import { WeatherLLMClient } from './weather-client.js';
import * as readline from 'readline';
import dotenv from 'dotenv';

// Environment variables yükle
dotenv.config();

// OpenRouter API key kontrolü
if (!process.env.OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY environment variable bulunamadı!');
    console.log('📝 .env dosyasına OPENROUTER_API_KEY=your_openrouter_api_key_here ekleyin');
    console.log('🔗 OpenRouter API key almak için: https://openrouter.ai/keys');
    process.exit(1);
}

// MCP Server path kontrolü
const mcpServerPath = process.env.MCP_SERVER_PATH || './dist/index.js';
if (!mcpServerPath) {
    console.error('❌ MCP_SERVER_PATH environment variable bulunamadı!');
    console.log('📝 .env dosyasına MCP_SERVER_PATH=./dist/index.js ekleyin');
    process.exit(1);
}

async function main() {
    console.log('🌤️  MCP Weather LLM Client Başlatılıyor...\n');
    console.log('🤖 OpenRouter gpt-oss-20b:free modeli kullanılıyor (ücretsiz)\n');

    try {
        // LLM Client'ı başlat
        const client = new WeatherLLMClient(mcpServerPath);
        await client.initialize();

        console.log('✅ MCP Server bağlantısı başarılı!');
        console.log('🔧 Mevcut araçlar:', (await client.listTools()).map((t: any) => t.name).join(', '));
        console.log('\n💬 Hava durumu hakkında soru sorun (çıkmak için "quit" yazın):\n');

        // Interactive CLI
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const askQuestion = () => {
            rl.question('🤔 Sorunuz: ', async (question: string) => {
                if (question.toLowerCase() === 'quit') {
                    console.log('👋 Görüşürüz!');
                    rl.close();
                    await client.cleanup();
                    process.exit(0);
                }

                try {
                    console.log('\n🔄 İşleniyor...\n');
                    const response = await client.processQuestion(question);
                    console.log('🌤️  Cevap:', response);
                } catch (error) {
                    console.error('❌ Hata:', error instanceof Error ? error.message : error);
                }

                console.log('\n' + '─'.repeat(50) + '\n');
                askQuestion();
            });
        };

        askQuestion();

    } catch (error) {
        console.error('❌ Client başlatılamadı:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n🔄 Kapatılıyor...');
    process.exit(0);
});

main().catch(console.error); 