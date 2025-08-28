# 🤝 Katkıda Bulunma

Bu projeye katkıda bulunmak istediğiniz için teşekkürler! Bu belge, katkı sürecinizi kolaylaştırmak için hazırlanmıştır.

## 📋 **İçindekiler**

- [Nasıl Katkıda Bulunulur](#nasıl-katkıda-bulunulur)
- [Geliştirme Ortamı](#geliştirme-ortamı)
- [Kod Standartları](#kod-standartları)
- [Test Etme](#test-etme)
- [Pull Request Süreci](#pull-request-süreci)
- [Commit Mesajları](#commit-mesajları)

## 🚀 **Nasıl Katkıda Bulunulur**

### **1. Repository'yi Fork Edin**
1. [GitHub repository](https://github.com/canergulsoy/mcp-weather-server) sayfasına gidin
2. Sağ üst köşedeki "Fork" butonuna tıklayın
3. Kendi GitHub hesabınızda fork oluşturun

### **2. Local Clone Yapın**
```bash
git clone https://github.com/YOUR_USERNAME/mcp-weather-server.git
cd mcp-weather-server
```

### **3. Upstream Remote Ekleyin**
```bash
git remote add upstream https://github.com/canergulsoy/mcp-weather-server.git
git fetch upstream
```

### **4. Feature Branch Oluşturun**
```bash
git checkout -b feature/amazing-feature
```

### **5. Değişiklikleri Yapın**
- Kodunuzu yazın
- Testleri ekleyin
- Dokümantasyonu güncelleyin

### **6. Commit ve Push Yapın**
```bash
git add .
git commit -m "feat: amazing feature added"
git push origin feature/amazing-feature
```

### **7. Pull Request Oluşturun**
1. GitHub'da fork'unuza gidin
2. "Compare & pull request" butonuna tıklayın
3. Açıklayıcı başlık ve açıklama yazın
4. Pull request'i gönderin

## 🛠️ **Geliştirme Ortamı**

### **Gereksinimler**
- Node.js 18.18.0+
- npm veya yarn
- Git
- Code editor (VS Code önerilir)

### **Kurulum**
```bash
# Bağımlılıkları yükleyin
npm install

# Development mode'da çalıştırın
npm run dev

# Type checking
npm run typecheck

# Build
npm run build
```

### **Environment Variables**
```bash
# .env dosyası oluşturun
cp env.example .env

# OpenRouter API key ekleyin
echo "OPENROUTER_API_KEY=your_key" >> .env
```

## 📝 **Kod Standartları**

### **TypeScript Kuralları**
- **Strict Mode**: Her zaman strict mode kullanın
- **Type Annotations**: Explicit type annotations ekleyin
- **Interfaces**: Object shapes için interface kullanın
- **Generics**: Uygun yerlerde generic types kullanın

### **Naming Conventions**
```typescript
// ✅ Doğru
export class WeatherClient {
    private readonly apiKey: string;
    
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }
    
    async getWeather(city: string): Promise<WeatherData> {
        // implementation
    }
}

// ❌ Yanlış
export class weatherclient {
    private apikey: string;
    
    constructor(apikey: string) {
        this.apikey = apikey;
    }
    
    async getweather(city: string) {
        // implementation
    }
}
```

### **File Organization**
```
src/
├── index.ts              # Main entry point
├── openmeteo.ts         # Weather API integration
├── client/              # Client-side code
│   ├── index.ts         # Client entry point
│   └── weather-client.ts # Main client class
├── types/               # Type definitions
├── utils/               # Utility functions
└── constants/           # Constants
```

### **Import/Export Kuralları**
```typescript
// ✅ Doğru
import { WeatherClient } from './weather-client.js';
import type { WeatherData } from './types/weather.js';
import { WEATHER_CONSTANTS } from './constants/weather.js';

// ❌ Yanlış
import * as WeatherClient from './weather-client.js';
import { WeatherData } from './types/weather.js';
```

## 🧪 **Test Etme**

### **Test Çalıştırma**
```bash
# Type checking
npm run typecheck

# Client test
npm run test:client

# Build test
npm run build

# All tests
npm test
```

### **Test Yazma**
```typescript
// weather-client.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { WeatherLLMClient } from './weather-client.js';

describe('WeatherLLMClient', () => {
    let client: WeatherLLMClient;

    beforeEach(() => {
        client = new WeatherLLMClient('./dist/index.js');
    });

    it('should initialize successfully', async () => {
        await expect(client.initialize()).resolves.not.toThrow();
    });

    it('should process weather questions', async () => {
        await client.initialize();
        const response = await client.processQuestion(
            "Yarın İstanbul'da hava nasıl olacak?"
        );
        expect(response).toBeDefined();
        expect(typeof response).toBe('string');
    });
});
```

### **Test Coverage**
- **Unit Tests**: %80+ coverage hedefi
- **Integration Tests**: API entegrasyonları için
- **E2E Tests**: Tam kullanıcı akışı için

## 🔄 **Pull Request Süreci**

### **PR Checklist**
- [ ] Feature branch'te çalışıyorum
- [ ] Kod standartlarına uyuyorum
- [ ] Testleri ekledim ve geçiyor
- [ ] Dokümantasyonu güncelledim
- [ ] Commit mesajları conventional format'ta
- [ ] Conflict yok

### **PR Template**
```markdown
## 📝 Açıklama
Bu PR'ın ne yaptığını açıklayın.

## 🔧 Değişiklikler
- [ ] Yeni özellik eklendi
- [ ] Bug fix
- [ ] Dokümantasyon güncellendi
- [ ] Test eklendi

## 🧪 Test
- [ ] Unit testler geçiyor
- [ ] Integration testler geçiyor
- [ ] Manuel test yapıldı

## 📸 Screenshots (varsa)
Eğer UI değişikliği varsa screenshot ekleyin.

## 📋 Checklist
- [ ] Kod standartlarına uyuldu
- [ ] Self-review yapıldı
- [ ] Comment'lar temizlendi
- [ ] Conflict yok
```

## 💬 **Commit Mesajları**

### **Conventional Commits Format**
```bash
# Format
<type>[optional scope]: <description>

# Examples
feat: add new weather tool
fix: resolve geocoding API error
docs: update README with new features
test: add unit tests for weather client
refactor: improve error handling
style: fix code formatting
perf: optimize API calls
chore: update dependencies
```

### **Commit Types**
- **feat**: Yeni özellik
- **fix**: Bug fix
- **docs**: Dokümantasyon değişiklikleri
- **style**: Kod formatı (white-space, formatting, etc.)
- **refactor**: Kod refactoring
- **test**: Test ekleme veya düzenleme
- **chore**: Build process, tooling değişiklikleri

### **Commit Scope (Opsiyonel)**
```bash
feat(client): add natural language processing
fix(server): resolve MCP protocol error
docs(api): update tool documentation
test(utils): add validation tests
```

## 🐛 **Bug Report**

### **Bug Report Template**
```markdown
## 🐛 Bug Açıklaması
Bug'ın ne olduğunu açık bir şekilde açıklayın.

## 🔄 Tekrarlama Adımları
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## 📱 Beklenen Davranış
Ne olması gerektiğini açıklayın.

## 💻 Environment
- OS: [e.g. Ubuntu 22.04]
- Node.js: [e.g. 18.18.0]
- npm: [e.g. 9.8.1]

## 📋 Additional Context
Ek bilgi, screenshot, log dosyaları ekleyin.
```

## 💡 **Feature Request**

### **Feature Request Template**
```markdown
## 💡 Feature Açıklaması
Yeni özelliğin ne olduğunu açıklayın.

## 🎯 Problem
Bu özelliğin hangi problemi çözeceğini açıklayın.

## 💭 Önerilen Çözüm
Nasıl implement edilebileceğini açıklayın.

## 🔄 Alternatifler
Düşündüğünüz alternatif çözümler.

## 📋 Additional Context
Ek bilgi, örnekler, screenshot'lar.
```

## 📞 **İletişim**

- **Issues**: [GitHub Issues](https://github.com/canergulsoy/mcp-weather-server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/canergulsoy/mcp-weather-server/discussions)
- **Email**: caner@canergulsoy.com

## 🙏 **Teşekkürler**

Katkıda bulunduğunuz için teşekkürler! Her katkı bu projeyi daha iyi hale getiriyor.

---

**Not**: Bu proje [MIT License](LICENSE) altında lisanslanmıştır. Katkıda bulunarak bu lisansı kabul etmiş olursunuz. 