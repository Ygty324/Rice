from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

# Rate limiter kurulumu
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Rice Classification API")

# Rate limiter'ı app'e ekle
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS ayarları - Environment variable'dan al veya default kullan
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sabitler
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "rice.h5")
RICE_CLASSES = ['Arborio', 'Basmati', 'Ipsala', 'Jasmine', 'Karacadag']
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Model global değişkeni
model = None

@app.on_event("startup")
async def load_model():
    """Uygulama başlarken modeli yükle"""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f"Model basariyla yuklendi: {MODEL_PATH}")
            print(f"Model input shape: {model.input_shape}")
        else:
            print(f"Model dosyasi bulunamadi: {MODEL_PATH}")
            print(f"Lutfen rice.h5 dosyasini backend/models/ klasorune ekleyin")
    except Exception as e:
        print(f"Model yuklenirken hata: {str(e)}")

def preprocess_image(image: Image.Image, target_size=(224, 224)) -> np.ndarray:
    """Görseli model için hazırla"""
    # RGB'ye çevir
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Boyutlandır
    image = image.resize(target_size, Image.Resampling.LANCZOS)

    # NumPy array'e çevir ve normalize et
    img_array = np.array(image, dtype=np.float32)
    img_array = img_array / 255.0

    # Batch boyutu ekle
    img_array = np.expand_dims(img_array, axis=0)

    return img_array

@app.get("/")
async def root():
    """API durumunu kontrol et"""
    return {
        "message": "Rice Classification API",
        "status": "running",
        "model_loaded": model is not None,
        "classes": RICE_CLASSES
    }

@app.get("/health")
async def health_check():
    """Sağlık kontrolü"""
    return {
        "status": "healthy",
        "model_status": "loaded" if model is not None else "not loaded"
    }

@app.post("/predict")
@limiter.limit("10/minute")
async def predict_rice(request: Request, file: UploadFile = File(...)):
    """Pirinç görselini sınıflandır"""

    # Dosyayı oku ve boyut kontrolü yap
    file_content = await file.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"Dosya boyutu cok buyuk. Maksimum {MAX_FILE_SIZE // (1024*1024)}MB yuklenebilir."
        )

    # Model yüklü mü kontrol et
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model henuz yuklenmedi. Lutfen rice.h5 dosyasini backend/models/ klasorune ekleyin."
        )

    # Dosya formatını kontrol et
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="Lutfen gecerli bir gorsel dosyasi yukleyin (JPG, PNG, vb.)"
        )

    try:
        # Görseli oku (zaten okunan content'i kullan)
        image = Image.open(io.BytesIO(file_content))

        # Görseli işle
        processed_image = preprocess_image(image)

        # Tahmin yap
        predictions = model.predict(processed_image, verbose=0)

        # En yüksek olasılığı bul
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_index])
        predicted_class = RICE_CLASSES[predicted_class_index]

        # Tüm tahminleri hazırla
        all_predictions = {
            RICE_CLASSES[i]: float(predictions[0][i])
            for i in range(len(RICE_CLASSES))
        }

        return JSONResponse(content={
            "success": True,
            "prediction": predicted_class,
            "confidence": round(confidence * 100, 2),
            "all_predictions": all_predictions
        })

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Gorsel islenirken hata olustu. Lutfen gecerli bir gorsel yukleyin."
        )

@app.post("/predict-debug")
async def predict_debug(file: UploadFile = File(...)):
    """Debug için detaylı tahmin endpoint'i"""

    try:
        # Görseli oku
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        return {
            "file_name": file.filename,
            "content_type": file.content_type,
            "image_size": image.size,
            "image_mode": image.mode,
            "model_loaded": model is not None,
            "model_input_shape": str(model.input_shape) if model else None
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
