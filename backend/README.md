# Backend - Rice Classification API

FastAPI ile yazılmış pirinç sınıflandırma backend servisi.

## 🚀 Kurulum

### 1. Python Sanal Ortamı Oluşturma

```bash
cd backend

# Python sanal ortamı oluştur
python -m venv venv

# Sanal ortamı aktifleştir
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 2. Bağımlılıkları Yükleme

```bash
pip install -r requirements.txt
```

### 3. Model Dosyasını Ekleme

`rice.h5` modelinizi `backend/models/` klasörüne kopyalayın:

```bash
# Modelinizi kopyalayın
cp /path/to/your/rice.h5 models/rice.h5
```

### 4. Sunucuyu Başlatma

```bash
# Backend klasöründeyken
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Sunucu başarıyla başladığında:
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📡 API Endpoints

### GET `/`
API durumunu kontrol eder.

**Response:**
```json
{
  "message": "Rice Classification API",
  "status": "running",
  "model_loaded": true,
  "classes": ["Arborio", "Basmati", "Ipsala", "Jasmine", "Karacadag"]
}
```

### GET `/health`
Sağlık kontrolü.

**Response:**
```json
{
  "status": "healthy",
  "model_status": "loaded"
}
```

### POST `/predict`
Pirinç görselini sınıflandırır.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "success": true,
  "prediction": "Basmati",
  "confidence": 95.67,
  "all_predictions": {
    "Arborio": 1.23,
    "Basmati": 95.67,
    "Ipsala": 0.89,
    "Jasmine": 1.45,
    "Karacadag": 0.76
  }
}
```

### POST `/predict-debug`
Debug için detaylı bilgi döner.

## 🔧 Yapılandırma

### Model Input Size
Eğer modeliniz 224x224'den farklı bir input size kullanıyorsa, `app/main.py` dosyasında `preprocess_image` fonksiyonundaki `target_size` parametresini güncelleyin:

```python
def preprocess_image(image: Image.Image, target_size=(150, 150)):  # Örnek: 150x150
    ...
```

### CORS Ayarları
Frontend'inizin farklı bir port'ta çalışıyorsa, `app/main.py` dosyasındaki CORS ayarlarını güncelleyin:

```python
allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:YOUR_PORT"]
```

## 📋 Gereksinimler

- Python 3.8+
- TensorFlow 2.15.0
- FastAPI 0.104.1
- Uvicorn 0.24.0
- Pillow 10.1.0

## 🧪 Test Etme

### cURL ile Test

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/rice_image.jpg"
```

### Python ile Test

```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("rice_image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

## 🐛 Sorun Giderme

### Model yüklenmiyor
- `rice.h5` dosyasının `backend/models/` klasöründe olduğundan emin olun
- Model dosyasının bozuk olmadığını kontrol edin
- TensorFlow versiyonunuzun modelle uyumlu olduğunu kontrol edin

### CORS hatası alıyorum
- `app/main.py` dosyasındaki `allow_origins` listesine frontend URL'inizi ekleyin
- Tarayıcı konsolunda detaylı hata mesajını kontrol edin

### Import hatası alıyorum
- Sanal ortamın aktif olduğundan emin olun
- Tüm bağımlılıkları yüklediğinizden emin olun: `pip install -r requirements.txt`

## 📝 Notlar

- Model ilk istekte değil, sunucu başlangıcında yüklenir (daha hızlı response)
- Görsel preprocessing otomatik olarak yapılır
- CORS middleware production'da güvenlik için kısıtlanabilir
