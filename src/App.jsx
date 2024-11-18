import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [cocktail, setCocktail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Fetch a random cocktail on component mount
  useEffect(() => {
    getRandomCocktail();
  }, []);

  // Function to fetch a random cocktail
  async function getRandomCocktail() {
    try {
      const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      setCocktail(response.data.drinks[0]);
    } catch (error) {
      console.error('Error fetching random cocktail:', error);
    }
  }

  // Function to search for cocktails by name
  async function searchCocktail() {
    try {
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      setSearchResults(response.data.drinks || []);
    } catch (error) {
      console.error('Error searching for cocktails:', error);
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Cocktail Recipe Finder</h1>
      
      {/* Random Cocktail Section */}
      <section>
        <h2>Random Cocktail</h2>
        <button onClick={getRandomCocktail}>Get Another Random Cocktail</button>
        {cocktail && (
          <div style={{ marginTop: '20px' }}>
            <h3>{cocktail.strDrink}</h3>
            <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} style={{ width: '200px', borderRadius: '8px' }} />
            <h4>Ingredients:</h4>
            <ul>
              {Object.keys(cocktail).filter(key => key.startsWith('strIngredient') && cocktail[key]).map((key, index) => (
                <li key={index}>
                  {cocktail[key]} - {cocktail[`strMeasure${key.match(/\d+/)[0]}`] || 'to taste'}
                </li>
              ))}
            </ul>
            <p><strong>Instructions:</strong> {cocktail.strInstructions}</p>
          </div>
        )}
      </section>

      {/* Search Section */}
      <section style={{ marginTop: '40px' }}>
        <h2>Search Cocktails</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Enter cocktail name"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button onClick={searchCocktail}>Search</button>
        <div style={{ marginTop: '20px' }}>
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map(result => (
                <li key={result.idDrink}>
                  <h3>{result.strDrink}</h3>
                  <img src={result.strDrinkThumb} alt={result.strDrink} style={{ width: '100px', borderRadius: '5px' }} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;

