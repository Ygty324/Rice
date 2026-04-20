import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import { useLanguage } from '../contexts/LanguageContext';
import './Home.css';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { t } = useLanguage();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const riceTypes = ['Arborio', 'Basmati', 'Ipsala', 'Jasmine', 'Karacadag'];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setPrediction('');
        setConfidence(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile || !selectedImage) {
      showToast(t.home.toast.noImage, 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t.home.toast.error);
      }

      const data = await response.json();

      if (data.success) {
        setPrediction(data.prediction);
        setConfidence(data.confidence);
        const msg = t.home.toast.success
          .replace('{type}', data.prediction)
          .replace('{confidence}', data.confidence);
        showToast(msg, 'success');
      } else {
        throw new Error(t.home.toast.predictionFailed);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t.home.toast.unknownError;
      showToast(errorMessage, 'error');
    }

    setIsLoading(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">{t.home.title}</h1>
        <p className="home-description">{t.home.description}</p>

        <div className="instructions-box">
          <h3>{t.home.instructions.title}</h3>
          <ul className="instructions-list">
            {t.home.instructions.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button onClick={handleButtonClick} className="upload-button">
            {t.home.uploadButton}
          </button>
        </div>

        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt={t.home.imageAlt} />
          </div>
        )}

        {selectedImage && (
          <button
            onClick={handlePredict}
            className="predict-button"
            disabled={isLoading}
          >
            {isLoading ? t.home.analyzing : t.home.analyzeButton}
          </button>
        )}

        {prediction && (
          <div className="result-section">
            <h2>{t.home.result.title}</h2>
            <p className="prediction-result">
              <strong>{t.home.result.prediction.replace('{type}', prediction)}</strong>
            </p>
            <p className="confidence">
              {t.home.result.confidence.replace('{value}', String(confidence))}
            </p>
          </div>
        )}

        <div className="info-box">
          <h3>{t.home.supportedTypes}</h3>
          <div className="rice-types">
            {riceTypes.map((type) => (
              <span key={type} className="rice-type-badge">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
