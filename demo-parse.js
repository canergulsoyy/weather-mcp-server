#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 MCP Server Parse Süreci Demo\n');

// MCP Server'ı başlat
const mcpServer = spawn('node', [join(__dirname, 'dist', 'index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
});

// Test verisi hazırla
const testData = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
        name: "get_weather_by_date",
        arguments: {
            city: "İstanbul",
            country: "TR",
            date: "2025-08-29"
        }
    }
};

console.log('📤 MCP Server\'a gönderilen test verisi:');
console.log(JSON.stringify(testData, null, 2));
console.log('\n' + '─'.repeat(60) + '\n');

// MCP Server'dan gelen yanıtları dinle
mcpServer.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('📥 MCP Server Output:');
    console.log(output);
});

mcpServer.stderr.on('data', (data) => {
    const error = data.toString();
    console.log('⚠️  MCP Server Error:');
    console.log(error);
});

// Test verisini gönder
mcpServer.stdin.write(JSON.stringify(testData) + '\n');

// 5 saniye sonra kapat
setTimeout(() => {
    console.log('\n🔄 Demo tamamlanıyor...');
    mcpServer.kill();
    process.exit(0);
}, 5000);

// Hata durumunda
mcpServer.on('error', (error) => {
    console.error('❌ MCP Server hatası:', error);
    process.exit(1);
});

mcpServer.on('close', (code) => {
    console.log(`\n✅ MCP Server kapatıldı (exit code: ${code})`);
}); 