# 🌾 Pirinç Tanıma Sistemi / Rice Recognition System

> **TR** | [EN](#english)

---

## 🇹🇷 Türkçe

### Proje Hakkında

Pirinç Tanıma Sistemi, yapay zeka kullanarak pirinç türlerini görüntüden tanımlayan bir web uygulamasıdır. React tabanlı modern bir arayüz ve FastAPI ile geliştirilmiş bir yapay zeka arka ucu içermektedir.

Uygulama 5 farklı pirinç türünü tanıyabilir:
- **Arborio** – İtalyan risotto pirinci
- **Basmati** – Hint aromatik pirinci
- **Ipsala** – Türkiye Trakya pirinci
- **Jasmine** – Tayland pirinci
- **Karacadağ** – Türkiye Güneydoğu Anadolu pirinci

### Özellikler

- 🤖 **AI Tabanlı Tanıma** – TensorFlow/Keras CNN modeli ile yüksek doğruluk
- 🌙 **Karanlık/Aydınlık Tema** – localStorage'a kaydedilen tema tercihi
- 🌐 **TR/EN Dil Desteği** – Türkçe ve İngilizce arayüz, anında geçiş
- 🔔 **Toast Bildirimleri** – Alert yerine modern bildirim sistemi
- 📱 **Responsive Tasarım** – Tüm ekran boyutlarına uyumlu
- 🔒 **Rate Limiting** – Dakikada 10 istek sınırı (spam koruması)
- 📏 **Dosya Boyutu Limiti** – Maksimum 5MB yükleme
- 📖 **Tarif Sayfası** – Her pirinç türü için 2'şer özel tarif (toplam 10)
- 📚 **Tarihçe Sayfası** – Pirinç hakkında detaylı bilgi ve pirinç türleri

### Teknoloji Stack

#### Frontend
| Teknoloji | Versiyon | Amaç |
|-----------|----------|-------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Tip güvenliği |
| Vite | 7.x | Build aracı |
| React Router DOM | 7.x | Sayfa yönlendirme |

#### Backend
| Teknoloji | Versiyon | Amaç |
|-----------|----------|-------|
| Python | 3.9+ | Ana dil |
| FastAPI | 0.104.x | API framework |
| TensorFlow | 2.15.x | Derin öğrenme |
| Uvicorn | 0.24.x | ASGI sunucusu |
| slowapi | 0.1.9 | Rate limiting |
| Pillow | 10.1.x | Görüntü işleme |

### Kurulum

#### Gereksinimler
- Node.js 18+
- Python 3.9+
- pip

#### 1. Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacak.

#### 2. Backend Kurulumu

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API `http://localhost:8000` adresinde çalışacak.

#### 3. Model Kurulumu

AI modelini (`rice.h5`) `backend/models/` klasörüne yerleştirin:

```
backend/
└── models/
    └── rice.h5   ← Buraya yerleştirin
```

> **Not:** Model dosyası olmadan backend çalışır ancak `/predict` endpoint'i 503 hatası döner.

### Kullanım

1. Uygulamayı tarayıcıda açın (`http://localhost:5173`)
2. **"Görsel Yükle"** butonuna tıklayın
3. Bir pirinç fotoğrafı seçin (JPG, PNG – maks 5MB)
4. **"Analiz Et"** butonuna tıklayın
5. Sonucu ve güven oranını görüntüleyin

**İyi fotoğraf için ipuçları:**
- Tek bir pirinç tanesinin yakın çekimini yapın
- Beyaz veya nötr zemin kullanın
- İyi aydınlatılmış ortamda çekim yapın
- Pirinç tanesinin odakta ve net olduğundan emin olun

### API Endpoint'leri

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/` | GET | API durum bilgisi ve model durumu |
| `/health` | GET | Sağlık kontrolü |
| `/predict` | POST | Pirinç türü tahmini (rate limited: 10/dk) |
| `/predict-debug` | POST | Debug bilgisi |

#### `/predict` İstek Formatı

```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@pirinc.jpg"
```

#### Başarılı Yanıt

```json
{
  "success": true,
  "prediction": "Basmati",
  "confidence": 94.37,
  "all_predictions": {
    "Arborio": 0.01,
    "Basmati": 0.9437,
    "Ipsala": 0.02,
    "Jasmine": 0.02,
    "Karacadag": 0.01
  }
}
```

#### Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 400 | Geçersiz dosya formatı |
| 413 | Dosya boyutu 5MB'ı aşıyor |
| 429 | Rate limit aşıldı (10 istek/dk) |
| 503 | AI modeli yüklenmemiş |
| 500 | Sunucu hatası |

### Proje Yapısı

```
pirinc/
├── frontend/
│   ├── public/
│   │   └── images/              # Tarif görselleri (1-11.png)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # Navigasyon + tema/dil toggle
│   │   │   ├── Navbar.css
│   │   │   ├── Toast.tsx         # Bildirim sistemi
│   │   │   └── Toast.css
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx   # Karanlık/aydınlık tema yönetimi
│   │   │   └── LanguageContext.tsx # TR/EN dil yönetimi
│   │   ├── i18n/
│   │   │   └── translations.ts   # Tüm TR/EN çeviriler
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Ana sayfa (görsel yükleme + tahmin)
│   │   │   ├── Home.css
│   │   │   ├── History.tsx       # Pirinç tarihçesi ve türleri
│   │   │   ├── History.css
│   │   │   ├── Recipes.tsx       # Tarifler (10 tarif, filtrelenebilir)
│   │   │   └── Recipes.css
│   │   ├── App.tsx               # Provider'lar ve routing
│   │   ├── App.css
│   │   └── index.css             # Global stiller ve CSS değişkenleri
│   ├── .env                      # API URL konfigürasyonu
│   └── package.json
├── backend/
│   ├── app/
│   │   └── main.py               # FastAPI uygulaması
│   ├── models/
│   │   └── rice.h5               # TensorFlow model dosyası
│   └── requirements.txt
└── README.md
```

### Çevre Değişkenleri

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

**Backend** (ortam değişkeni olarak ayarlanır):
```bash
export ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

---

## English <a name="english"></a>

### About the Project

The Rice Recognition System is a web application that identifies rice types from images using artificial intelligence. It features a modern React-based interface and an AI backend developed with FastAPI.

The application can recognize 5 different rice types:
- **Arborio** – Italian risotto rice
- **Basmati** – Indian aromatic rice
- **Ipsala** – Turkish Thrace rice
- **Jasmine** – Thai rice
- **Karacadag** – Turkish Southeast Anatolian rice

### Features

- 🤖 **AI-Based Recognition** – TensorFlow/Keras CNN model with high accuracy
- 🌙 **Dark/Light Theme** – Theme preference saved to localStorage
- 🌐 **TR/EN Language Support** – Turkish and English interface with instant switching
- 🔔 **Toast Notifications** – Modern notification system instead of alerts
- 📱 **Responsive Design** – Compatible with all screen sizes
- 🔒 **Rate Limiting** – 10 requests per minute limit (spam protection)
- 📏 **File Size Limit** – Maximum 5MB upload
- 📖 **Recipes Page** – 2 special recipes per rice type (10 total)
- 📚 **History Page** – Detailed rice history and rice type information

### Technology Stack

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 7.x | Build tool |
| React Router DOM | 7.x | Page routing |

#### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.9+ | Main language |
| FastAPI | 0.104.x | API framework |
| TensorFlow | 2.15.x | Deep learning |
| Uvicorn | 0.24.x | ASGI server |
| slowapi | 0.1.9 | Rate limiting |
| Pillow | 10.1.x | Image processing |

### Installation

#### Prerequisites
- Node.js 18+
- Python 3.9+
- pip

#### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will run at `http://localhost:5173`.

#### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API will run at `http://localhost:8000`.

#### 3. Model Setup

Place the AI model (`rice.h5`) in the `backend/models/` directory:

```
backend/
└── models/
    └── rice.h5   ← Place here
```

> **Note:** The backend runs without the model file, but the `/predict` endpoint returns a 503 error.

### Usage

1. Open the application in your browser (`http://localhost:5173`)
2. Click the **"Upload Image"** button
3. Select a rice photo (JPG, PNG – max 5MB)
4. Click the **"Analyze"** button
5. View the result and confidence rate

**Tips for a good photo:**
- Take a close-up of a single rice grain
- Use a white or neutral background
- Shoot in a well-lit environment
- Make sure the rice grain is in focus and sharp

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API status info and model status |
| `/health` | GET | Health check |
| `/predict` | POST | Rice type prediction (rate limited: 10/min) |
| `/predict-debug` | POST | Debug information |

#### `/predict` Request Format

```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@rice.jpg"
```

#### Successful Response

```json
{
  "success": true,
  "prediction": "Basmati",
  "confidence": 94.37,
  "all_predictions": {
    "Arborio": 0.01,
    "Basmati": 0.9437,
    "Ipsala": 0.02,
    "Jasmine": 0.02,
    "Karacadag": 0.01
  }
}
```

#### Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid file format |
| 413 | File size exceeds 5MB |
| 429 | Rate limit exceeded (10 req/min) |
| 503 | AI model not loaded |
| 500 | Internal server error |

### Project Structure

```
pirinc/
├── frontend/
│   ├── public/
│   │   └── images/              # Recipe images (1-11.png)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # Navigation + theme/language toggle
│   │   │   ├── Navbar.css
│   │   │   ├── Toast.tsx         # Notification system
│   │   │   └── Toast.css
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx   # Dark/light theme management
│   │   │   └── LanguageContext.tsx # TR/EN language management
│   │   ├── i18n/
│   │   │   └── translations.ts   # All TR/EN translations
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Home page (image upload + prediction)
│   │   │   ├── Home.css
│   │   │   ├── History.tsx       # Rice history and types
│   │   │   ├── History.css
│   │   │   ├── Recipes.tsx       # Recipes (10 recipes, filterable)
│   │   │   └── Recipes.css
│   │   ├── App.tsx               # Providers and routing
│   │   ├── App.css
│   │   └── index.css             # Global styles and CSS variables
│   ├── .env                      # API URL configuration
│   └── package.json
├── backend/
│   ├── app/
│   │   └── main.py               # FastAPI application
│   ├── models/
│   │   └── rice.h5               # TensorFlow model file
│   └── requirements.txt
└── README.md
```

### Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

**Backend** (set as environment variable):
```bash
export ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

---

*Built with React + FastAPI + TensorFlow*
