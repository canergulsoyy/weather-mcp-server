# 🌤️ MCP Weather Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.18.0+-green.svg)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-1.3.0-orange.svg)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-gpt--oss--20b:free-purple.svg)](https://openrouter.ai/)

> **Model Context Protocol (MCP)** kullanarak hava durumu verilerini LLM istemcilerine sunan kapsamlı bir sistem. Hem standalone MCP server hem de akıllı LLM client içerir.

## 📋 **İçindekiler**

- [Özellikler](#-özellikler)
- [Hızlı Başlangıç](#-hızlı-başlangıç)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

## ✨ **Özellikler**

### 🔧 **MCP Server**
- **`get_weather_by_date`** - Belirli şehir ve tarih için hava durumu
- **`health_check`** - Sunucu sağlık kontrolü
- **Stdio Transport** - Cursor, Claude Code vb. ile uyumlu
- **Open-Meteo Integration** - Gerçek zamanlı hava durumu verisi

### 🤖 **LLM Client**
- **Doğal Dil Desteği** - Türkçe soru-cevap
- **OpenRouter Integration** - gpt-oss-20b:free (ücretsiz)
- **Akıllı Tool Seçimi** - Otomatik MCP tool discovery
- **Interactive CLI** - Kullanıcı dostu arayüz

### 🌍 **Weather API**
- **Geocoding** - Şehir isimlerini koordinatlara çevirme
- **Daily Forecast** - Günlük hava durumu tahmini
- **Multi-language** - Türkçe dil desteği
- **Free Tier** - Tamamen ücretsiz API

## 🚀 **Hızlı Başlangıç**

### **Gereksinimler**
- Node.js 18.18.0+
- npm veya yarn
- OpenRouter API Key (ücretsiz)

### **1. Repository'yi Klonlayın**
```bash
git clone https://github.com/canergulsoy/mcp-weather-server.git
cd mcp-weather-server
```

### **2. Bağımlılıkları Yükleyin**
```bash
npm install
```

### **3. MCP Server'ı Derleyin**
```bash
npm run build
```

### **4. Environment Variables Ayarlayın**
```bash
# .env dosyası oluşturun
cp env.example .env

# OpenRouter API key'inizi ekleyin
echo "OPENROUTER_API_KEY=your_actual_api_key" >> .env
```

### **5. LLM Client'ı Çalıştırın**
```bash
npm run client:dev
```

## 🔑 **OpenRouter API Key Alımı**

1. [OpenRouter](https://openrouter.ai/keys) sitesine gidin
2. Ücretsiz hesap oluşturun
3. API key alın (günlük 10M token ücretsiz)
4. `.env` dosyasına ekleyin

**💡 Avantajlar:**
- ✅ **Tamamen ücretsiz** (günlük 10M token)
- ✅ **GPT-4 kalitesinde** yanıtlar
- ✅ **Hızlı response time**
- ✅ **OpenAI uyumlu API**

## 📦 **Kurulum**

### **Development Mode**
```bash
# Build olmadan çalıştırma
npm run dev
```

### **Production Mode**
```bash
# Derlenmiş versiyon
npm run start
```

### **Client Development**
```bash
# LLM Client development
npm run client:dev

# Client build
npm run client:build

# Client production
npm run client:start
```

## 🎯 **Kullanım**

### **MCP Server (Standalone)**
```bash
# Server'ı başlatın
node dist/index.js

# Başka bir MCP client ile bağlanın
# (Cursor, Claude Code, vb.)
```

### **LLM Client (Interactive)**
```bash
# Interactive CLI başlatın
npm run client:dev

# Örnek soru:
🤔 Sorunuz: 29.08.2025 tarihinde İstanbul'da hava nasıl olacak?
```

### **Programmatic Usage**
```typescript
import { WeatherLLMClient } from './dist/client/weather-client.js';

const client = new WeatherLLMClient('./dist/index.js');
await client.initialize();

const response = await client.processQuestion(
    "Yarın Berlin'de hava nasıl olacak?"
);
console.log(response);
```

## 🔌 **Cursor/Claude Entegrasyonu**

### **MCP Server Konfigürasyonu**
```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/abs/path/to/dist/index.js"]
    }
  }
}
```

### **Development Mode (Build olmadan)**
```json
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "tsx", "/abs/path/to/src/index.ts"]
    }
  }
}
```

## 📚 **API Dokümantasyonu**

### **Tool: `get_weather_by_date`**

Belirli bir şehir ve tarih için günlük hava durumu bilgisi döndürür.

**Parametreler:**
- `city` (string, **zorunlu**): Şehir adı (örn: "İstanbul")
- `country` (string, *opsiyonel*): Ülke kodu (örn: "TR")
- `date` (string, **zorunlu**): Tarih (YYYY-MM-DD formatında)

**Örnek Kullanım:**
```typescript
// MCP Client
const result = await mcpClient.callTool({
    name: "get_weather_by_date",
    arguments: {
        city: "İstanbul",
        country: "TR",
        date: "2025-08-29"
    }
});
```

**Response Format:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Şehir: İstanbul\nTarih: 2025-08-29\nEn yüksek: 28.1°C\nEn düşük: 21.6°C\nYağış toplamı: 0 mm\nKod: 2"
    }
  ]
}
```

### **Tool: `health_check`**

Sunucunun çalışır durumda olduğunu doğrular.

**Parametreler:** Yok

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "OK"
    }
  ]
}
```

## 🏗️ **Proje Yapısı**

```
mcp-weather-server/
├── src/
│   ├── index.ts              # MCP Server ana dosyası
│   ├── openmeteo.ts         # Weather API entegrasyonu
│   └── client/
│       ├── index.ts         # Interactive CLI
│       └── weather-client.ts # LLM Client sınıfı
├── dist/                    # Derlenmiş dosyalar
├── docs/                    # Dokümantasyon
├── examples/                # Kullanım örnekleri
├── tests/                   # Test dosyaları
├── package.json            # Proje konfigürasyonu
├── tsconfig.json          # TypeScript konfigürasyonu
├── .env.example           # Environment variables örneği
├── README.md              # Bu dosya
└── LICENSE                # MIT Lisansı
```

## 🧪 **Test ve Geliştirme**

### **Test Script'leri**
```bash
# Type checking
npm run typecheck

# Client test
npm run test:client

# Build test
npm run build
```

### **Development Workflow**
```bash
# 1. Code değişiklikleri
# 2. Type checking
npm run typecheck

# 3. Build
npm run build

# 4. Test
npm run test:client

# 5. Commit & Push
git add .
git commit -m "feat: yeni özellik eklendi"
git push origin main
```

## 🔧 **Environment Variables**

| Variable | Açıklama | Varsayılan | Zorunlu |
|----------|----------|------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key | - | ✅ |
| `OPENROUTER_BASE_URL` | OpenRouter API endpoint | `https://openrouter.ai/api/v1` | ❌ |
| `MCP_SERVER_PATH` | MCP Server dosya yolu | `./dist/index.js` | ❌ |

## 📊 **Performance Metrikleri**

- **Tool Discovery**: ~50ms
- **Weather API Call**: ~200-500ms
- **LLM Processing**: ~1-3s
- **Total Response**: ~2-4s
- **Memory Usage**: ~50-100MB
- **Daily Token Limit**: 10M (ücretsiz)

## 🚀 **Gelecek Geliştirmeler**

### **Kısa Vadeli**
- [ ] Caching mekanizması
- [ ] Rate limiting
- [ ] Daha fazla hava durumu tool'u
- [ ] Batch processing

### **Orta Vadeli**
- [ ] Web interface
- [ ] Database integration
- [ ] User preferences
- [ ] Historical data

### **Uzun Vadeli**
- [ ] Machine learning predictions
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app

## 🤝 **Katkıda Bulunma**

Bu projeye katkıda bulunmak istiyorsanız:

1. **Fork** yapın
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** yapın (`git commit -m 'feat: amazing feature'`)
4. **Push** yapın (`git push origin feature/amazing-feature`)
5. **Pull Request** oluşturun

### **Geliştirme Kuralları**
- TypeScript strict mode kullanın
- ESLint kurallarına uyun
- Test coverage'ı koruyun
- Commit message'ları conventional commits formatında yazın

### **Kod Standartları**
```typescript
// ✅ Doğru
export class WeatherClient {
    private readonly apiKey: string;
    
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }
}

// ❌ Yanlış
export class weatherclient {
    private apikey: string;
    
    constructor(apikey: string) {
        this.apikey = apikey;
    }
}
```

## 📄 **Lisans**

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 👨‍💻 **Geliştirici**

**Caner Gülsoy** tarafından geliştirilmiştir.

- **GitHub**: [@canergulsoy](https://github.com/canergulsoy)
- **LinkedIn**: [Caner Gülsoy](https://linkedin.com/in/canergulsoy)
- **Website**: [canergulsoy.com](https://canergulsoy.com)

## 🙏 **Teşekkürler**

- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP protokolü
- [Open-Meteo](https://open-meteo.com/) - Ücretsiz hava durumu API'si
- [OpenRouter](https://openrouter.ai/) - Ücretsiz LLM API'si
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği
- [Zod](https://zod.dev/) - Schema validation

## 📞 **İletişim**

- **Issues**: [GitHub Issues](https://github.com/canergulsoy/mcp-weather-server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/canergulsoy/mcp-weather-server/discussions)
- **Email**: caner@canergulsoy.com

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

[![GitHub stars](https://img.shields.io/github/stars/canergulsoy/mcp-weather-server?style=social)](https://github.com/canergulsoy/mcp-weather-server)
[![GitHub forks](https://img.shields.io/github/forks/canergulsoy/mcp-weather-server?style=social)](https://github.com/canergulsoy/mcp-weather-server)
[![GitHub issues](https://img.shields.io/github/issues/canergulsoy/mcp-weather-server)](https://github.com/canergulsoy/mcp-weather-server/issues)

</div> 