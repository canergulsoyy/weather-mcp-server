# 📋 Changelog

Bu dosya, MCP Weather Server projesindeki tüm önemli değişiklikleri içerir.

## [Unreleased]

### 🚀 **Yakında Gelecek**
- [ ] Caching mekanizması
- [ ] Rate limiting
- [ ] Daha fazla hava durumu tool'u
- [ ] Batch processing

## [1.0.0] - 2025-01-XX

### ✨ **Yeni Özellikler**
- **MCP Server**: Model Context Protocol uyumlu hava durumu sunucusu
- **LLM Client**: OpenRouter gpt-oss-20b:free entegrasyonu ile akıllı client
- **Weather API Integration**: Open-Meteo API entegrasyonu
- **Natural Language Processing**: Türkçe doğal dil desteği
- **Interactive CLI**: Kullanıcı dostu komut satırı arayüzü

### 🔧 **Teknik Özellikler**
- **TypeScript**: Modern ES2022 modül sistemi
- **Zod Validation**: Güçlü schema validation
- **MCP Protocol**: v1.3.0 protokol desteği
- **Stdio Transport**: Standart giriş/çıkış iletişimi
- **Error Handling**: Kapsamlı hata yönetimi

### 🛠️ **Tools**
- **`get_weather_by_date`**: Belirli şehir ve tarih için hava durumu
- **`health_check`**: Sunucu sağlık kontrolü

### 🌍 **API Entegrasyonları**
- **Open-Meteo Geocoding**: Şehir isimlerini koordinatlara çevirme
- **Open-Meteo Weather**: Günlük hava durumu verisi
- **OpenRouter**: Ücretsiz LLM API entegrasyonu

### 📚 **Dokümantasyon**
- **README.md**: Kapsamlı proje dokümantasyonu
- **CONTRIBUTING.md**: Katkıda bulunma rehberi
- **SECURITY.md**: Güvenlik politikası
- **CHANGELOG.md**: Değişiklik geçmişi
- **API Documentation**: Tool kullanım rehberi

### 🔒 **Güvenlik**
- **Input Validation**: Zod schema validation
- **Type Safety**: TypeScript strict mode
- **Environment Variables**: API key koruması
- **Error Handling**: Güvenli hata mesajları

### 🧪 **Test ve Quality**
- **Type Checking**: TypeScript strict mode
- **Build System**: Production-ready build
- **Error Handling**: Comprehensive error handling
- **Code Quality**: Professional coding standards

### 📦 **Dependencies**
- **@modelcontextprotocol/sdk**: ^1.3.0
- **undici**: ^7.15.0
- **zod**: ^3.23.8
- **openai**: ^4.28.0
- **dotenv**: ^16.4.1
- **typescript**: ^5.6.3

### 🚀 **Performance**
- **Tool Discovery**: ~50ms
- **Weather API Call**: ~200-500ms
- **LLM Processing**: ~1-3s
- **Total Response**: ~2-4s
- **Memory Usage**: ~50-100MB

### 💰 **Maliyet**
- **OpenRouter**: Tamamen ücretsiz (günlük 10M token)
- **Weather API**: Tamamen ücretsiz
- **Total**: Neredeyse sıfır maliyet

## [0.1.0] - 2025-01-XX

### 🎯 **İlk Sürüm**
- **MCP Server**: Temel hava durumu tool'ları
- **Weather Integration**: Open-Meteo API entegrasyonu
- **Basic CLI**: Basit komut satırı arayüzü

---

## 📝 **Changelog Format**

Bu proje [Keep a Changelog](https://keepachangelog.com/) formatını takip eder.

### **Değişiklik Türleri**
- **Added**: Yeni özellikler
- **Changed**: Mevcut özelliklerde değişiklikler
- **Deprecated**: Kullanımdan kaldırılan özellikler
- **Removed**: Kaldırılan özellikler
- **Fixed**: Bug düzeltmeleri
- **Security**: Güvenlik güncellemeleri

### **Versiyon Formatı**
- **Major.Minor.Patch** (örn: 1.0.0)
- **Major**: Breaking changes
- **Minor**: Yeni özellikler (backward compatible)
- **Patch**: Bug fixes ve küçük güncellemeler

---

## 🙏 **Teşekkürler**

Bu projeye katkıda bulunan herkese teşekkürler:

- **Geliştirici**: Caner Gülsoy
- **MCP Protocol**: Model Context Protocol ekibi
- **Open-Meteo**: Ücretsiz hava durumu API'si
- **OpenRouter**: Ücretsiz LLM API'si
- **TypeScript**: Tip güvenliği için
- **Zod**: Schema validation için

---

**Not**: Bu changelog sürekli güncellenir. Son değişiklikler için [GitHub repository](https://github.com/canergulsoy/mcp-weather-server) takip edin. 