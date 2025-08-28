# 🌤️ MCP Weather LLM Client Demo

## 🚀 **Hızlı Başlangıç**

### **1. Kurulum**
```bash
# Gerekli paketleri yükle
npm install

# MCP Server'ı derle
npm run build

# .env dosyası oluştur (OpenRouter API key ile)
echo "OPENROUTER_API_KEY=your_openrouter_api_key" > .env
```

### **2. OpenRouter API Key Alımı**
1. [OpenRouter](https://openrouter.ai/keys) sitesine git
2. Ücretsiz hesap oluştur
3. API key al (günlük 10M token ücretsiz)
4. `.env` dosyasına ekle

### **3. Çalıştırma**
```bash
# LLM Client'ı başlat
npm run client:dev
```

### **4. Demo Senaryosu**

#### **Senaryo 1: Basit Hava Durumu Sorusu**
```
🤔 Sorunuz: 29.08.2025 tarihinde İstanbul'da hava nasıl olacak?

🔄 İşleniyor...

🌤️  Cevap: 29 Ağustos 2025 tarihinde İstanbul'da hava durumu şu şekilde olacak:
        En yüksek sıcaklık: 28°C
        En düşük sıcaklık: 22°C
        Yağış toplamı: 0 mm
        Genel olarak güneşli ve sıcak bir gün bekleniyor.
```

#### **Senaryo 2: Farklı Şehir ve Tarih**
```
🤔 Sorunuz: Yarın Berlin'de hava nasıl olacak?

🔄 İşleniyor...

🌤️  Cevap: Yarın Berlin'de hava durumu şu şekilde olacak:
        En yüksek sıcaklık: 18°C
        En düşük sıcaklık: 12°C
        Yağış toplamı: 5 mm
        Hafif yağmurlu ve serin bir gün bekleniyor.
```

#### **Senaryo 3: Ülke Kodu ile**
```
🤔 Sorunuz: 15.09.2025 tarihinde Paris, Fransa'da hava nasıl olacak?

🔄 İşleniyor...

🌤️  Cevap: 15 Eylül 2025 tarihinde Paris'te hava durumu şu şekilde olacak:
        En yüksek sıcaklık: 22°C
        En düşük sıcaklık: 15°C
        Yağış toplamı: 2 mm
        Güzel ve ılık bir sonbahar günü bekleniyor.
```

## 🔧 **Teknik Detaylar**

### **Veri Akışı**
1. **User Input**: Doğal dilde soru
2. **LLM Analysis**: OpenRouter gpt-oss-20b:free ile tool seçimi ve parametre çıkarma
3. **MCP Call**: MCP Server'a tool çağrısı
4. **Weather API**: Open-Meteo'dan veri çekme
5. **Response Generation**: OpenRouter ile doğal dil yanıtı oluşturma

### **Tool Mapping**
- **Input**: "29.08.2025 tarihinde İstanbul'da hava nasıl olacak?"
- **LLM Output**: 
  ```json
  {
    "toolName": "get_weather_by_date",
    "parameters": {
      "city": "İstanbul",
      "country": "TR",
      "date": "2025-08-29"
    }
  }
  ```
- **MCP Call**: `get_weather_by_date("İstanbul", "TR", "2025-08-29")`

## 🎯 **Test Senaryoları**

### **Başarılı Senaryolar**
- ✅ "Yarın İstanbul'da hava nasıl olacak?"
- ✅ "15.09.2025 tarihinde Berlin'de hava durumu"
- ✅ "Gelecek hafta Paris'te hava nasıl olacak?"

### **Hata Senaryoları**
- ❌ "Dün hava nasıldı?" (Geçmiş tarih)
- ❌ "Bilinmeyen şehirde hava nasıl?" (Geçersiz şehir)
- ❌ "Hava nasıl?" (Şehir belirtilmemiş)

## 🚀 **Geliştirme İpuçları**

### **Yeni Tool Ekleme**
1. `src/index.ts`'de tool'u kaydet
2. `src/client/weather-client.ts`'de schema'yı güncelle
3. LLM prompt'larını güncelle

### **Hata Yönetimi**
- Network hataları için retry mekanizması
- Rate limiting için delay ekleme
- Fallback response'lar

### **Performance**
- Tool result caching
- Batch tool calls
- Async processing

## 📊 **Monitoring ve Logging**

### **Log Seviyeleri**
- 🔍 DEBUG: Tool seçimi, parametre çıkarma
- ℹ️ INFO: MCP calls, API responses
- ⚠️ WARN: Rate limits, fallbacks
- ❌ ERROR: Network failures, parsing errors

### **Metrics**
- Tool call success rate
- Response time
- OpenRouter token usage
- Error frequency

## 💰 **Maliyet Optimizasyonu**

### **OpenRouter Ücretsiz Plan**
- **Günlük Limit**: 10M token
- **Model**: gpt-oss-20b:free
- **Kalite**: GPT-4 seviyesinde
- **Hız**: Hızlı response time

### **Token Kullanımı**
- **Tool Selection**: ~200-300 token
- **Response Generation**: ~150-250 token
- **Toplam/Soru**: ~350-550 token
- **Günlük Kapasite**: ~18,000-28,000 soru

## 🔒 **Güvenlik**

### **API Key Yönetimi**
- Environment variables kullanımı
- `.env` dosyası `.gitignore`'da
- OpenRouter güvenli API

### **Rate Limiting**
- OpenRouter günlük limitleri
- MCP Server rate limiting
- Error handling ve retry logic 