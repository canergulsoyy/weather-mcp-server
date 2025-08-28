#!/usr/bin/env node

import { WeatherLLMClient } from './dist/client/weather-client.js';

async function testClient() {
    console.log('🧪 MCP Weather LLM Client Test Başlatılıyor...\n');
    console.log('🤖 OpenRouter gpt-oss-20b:free modeli kullanılıyor (ücretsiz)\n');

    try {
        // Client'ı başlat
        const client = new WeatherLLMClient('./dist/index.js');
        await client.initialize();

        console.log('✅ MCP Server bağlantısı başarılı!');
        console.log('✅ OpenRouter LLM bağlantısı başarılı!');

        // Mevcut tool'ları listele
        const tools = await client.listTools();
        console.log('🔧 Mevcut araçlar:', tools.map(t => t.name).join(', '));

        // Test sorusu
        const testQuestion = "29.08.2025 tarihinde İstanbul'da hava nasıl olacak?";
        console.log('\n🤔 Test sorusu:', testQuestion);

        console.log('\n🔄 İşleniyor...\n');
        const response = await client.processQuestion(testQuestion);

        console.log('🌤️  Cevap:', response);

        // Temizlik
        await client.cleanup();
        console.log('\n✅ Test başarıyla tamamlandı!');

    } catch (error) {
        console.error('❌ Test hatası:', error.message);
        process.exit(1);
    }
}

testClient(); 