# 🚀 Hızlı Başlangıç Rehberi

Bu rehber projeyi 5 dakikada çalıştırmanızı sağlar.

## ✅ Önkoşullar

- Node.js 18+ kurulu olmalı
- Python 3.8+ kurulu olmalı
- `rice.h5` model dosyanız hazır olmalı

## 📝 Adım Adım Kurulum

### 1️⃣ Backend Kurulumu (Terminal 1)

```bash
# Backend klasörüne git
cd backend

# Python sanal ortamı oluştur
python -m venv venv

# Sanal ortamı aktifleştir
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Bağımlılıkları yükle
pip install -r requirements.txt

# Model dosyanızı kopyalayın
cp /path/to/your/rice.h5 models/rice.h5

# Backend'i başlat
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend hazır: `http://localhost:8000`

### 2️⃣ Frontend Kurulumu (Terminal 2)

```bash
# Frontend klasörüne git
cd frontend

# Bağımlılıkları yükle
npm install

# Frontend'i başlat
npm run dev
```

✅ Frontend hazır: `http://localhost:5173`

### 3️⃣ Görselleri Ekle

```bash
# Frontend klasöründeyken
cd public/images

# Görsellerinizi buraya kopyalayın
# 1.png, 2.png, ..., 11.png
```

## 🎯 Test Etme

1. Tarayıcıda `http://localhost:5173` aç
2. Bir pirinç fotoğrafı yükle
3. "Analiz Et" butonuna tıkla
4. Sonucu gör!

## 📸 Görsel Çekme İpuçları

- **Tek pirinç tanesi** çekin
- **Yakın çekim** yapın
- **Net ve odaklanmış** olsun
- **Beyaz zemin** kullanın
- **Bol ışık** altında çekin

## ❓ Sorun Giderme

### Backend çalışmıyor
```bash
# Model dosyasını kontrol et
ls backend/models/rice.h5

# Python versiyonunu kontrol et
python --version  # 3.8+ olmalı

# Port kullanımda mı?
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

### Frontend çalışmıyor
```bash
# Node versiyonunu kontrol et
node --version  # 18+ olmalı

# node_modules'u sil ve tekrar yükle
rm -rf node_modules package-lock.json
npm install
```

### CORS hatası
Backend'in çalıştığından emin olun:
```bash
curl http://localhost:8000/health
```

### Model yüklenmiyor
Model dosyasının doğru yerde olduğunu kontrol edin:
```bash
ls -lh backend/models/rice.h5
```

## 🔗 Önemli URL'ler

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📚 Daha Fazla Bilgi

- [Ana README](README.md) - Detaylı dokümantasyon
- [Backend README](backend/README.md) - Backend detayları
- [IMAGE_PROMPTS.md](IMAGE_PROMPTS.md) - Görsel promptları

## 💡 İpuçları

1. **Her iki terminal açık kalmalı** - Backend ve Frontend aynı anda çalışmalı
2. **Model dosyası önemli** - rice.h5 olmadan tahmin çalışmaz
3. **Port çakışması** - 8000 ve 5173 portları boş olmalı
4. **Görseller opsiyonel** - Görsel olmadan da site çalışır, sadece placeholder gösterilir

---

Başarılar! 🎉
