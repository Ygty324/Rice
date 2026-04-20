import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Recipes.css';

const Recipes = () => {
  const { t } = useLanguage();
  const { recipes: recipesT } = t;

  const ALL_KEY = 'all';
  const [selectedRiceType, setSelectedRiceType] = useState<string>(ALL_KEY);

  const riceTypeKeys = [ALL_KEY, 'Arborio', 'Basmati', 'Ipsala', 'Jasmine', 'Karacadag'];

  const filteredRecipes = selectedRiceType === ALL_KEY
    ? recipesT.recipes
    : recipesT.recipes.filter(recipe => recipe.riceType === selectedRiceType);

  return (
    <div className="recipes-container">
      <div className="recipes-hero">
        <h1>{recipesT.hero.title}</h1>
        <p>{recipesT.hero.subtitle}</p>
      </div>

      <div className="recipes-content">
        <div className="filter-section">
          <h3>{recipesT.filterLabel}</h3>
          <div className="filter-buttons">
            {riceTypeKeys.map((key) => (
              <button
                key={key}
                className={`filter-button ${selectedRiceType === key ? 'active' : ''}`}
                onClick={() => setSelectedRiceType(key)}
              >
                {key === ALL_KEY ? recipesT.filterAll : key}
              </button>
            ))}
          </div>
        </div>

        <div className="recipes-grid">
          {filteredRecipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <div className="recipe-header">
                <h2>{recipe.name}</h2>
                <span className="rice-badge">{recipe.riceType}</span>
              </div>

              <div className="recipe-meta">
                <span>⏱️ {recipe.prepTime}</span>
                <span>👥 {recipe.servings}</span>
              </div>

              <div className="recipe-section">
                <h3>{recipesT.ingredientsLabel}</h3>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="recipe-section">
                <h3>{recipesT.instructionsLabel}</h3>
                <ol className="instructions-list">
                  {recipe.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
              </div>

              <div className="recipe-image-container">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="recipe-image"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const placeholder = target.nextElementSibling as HTMLElement;
                    target.style.display = 'none';
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div className="recipe-image-placeholder" style={{display: 'none'}}>
                  <div className="placeholder-content">
                    <span>📸</span>
                    <p>{recipesT.imagePlaceholder}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
