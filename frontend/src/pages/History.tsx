import { useLanguage } from '../contexts/LanguageContext';
import './History.css';

const History = () => {
  const { t } = useLanguage();
  const { history } = t;

  return (
    <div className="history-container">
      <div className="history-hero">
        <h1>{history.hero.title}</h1>
        <p className="hero-description">{history.hero.description}</p>
      </div>

      <div className="history-content">
        <section className="history-section">
          <h2>{history.worldJourney.title}</h2>
          <p>{history.worldJourney.p1}</p>
          <p>{history.worldJourney.p2}</p>
        </section>

        <section className="rice-types-section">
          <h2>{history.riceTypesTitle}</h2>

          {history.riceTypes.map((rice, index) => (
            <div key={index} className="rice-card">
              <div className="rice-header">
                <h3>{rice.name}</h3>
                <span className="origin-badge">📍 {rice.origin}</span>
              </div>
              <p className="rice-description">{rice.description}</p>
              <div className="characteristics">
                <h4>{history.characteristicsLabel}</h4>
                <ul>
                  {rice.characteristics.map((char, i) => (
                    <li key={i}>✓ {char}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        <section className="history-section">
          <h2>{history.turkeySection.title}</h2>
          <p>{history.turkeySection.p}</p>
        </section>
      </div>
    </div>
  );
};

export default History;
