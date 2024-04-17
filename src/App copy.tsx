import { useState } from 'react'

import './App.css'

import axios from 'axios';
import { Buffer } from 'buffer';
import { useEffect } from 'react';
import { render } from 'react-dom';


const clientId = process.env.VITE_CLIENT_ID ?? '';
const clientSecret = process.env.VITE_CLIENT_SECRET ?? '';



async function getBlizzardAccessToken() {
  console.log('Fetching access token...')
  try {
    

    const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const headers = {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = 'grant_type=client_credentials';

    const response = await axios.post('https://oauth.battle.net/token', data, { headers });

    if (response.status === 200) {
      console.log('Access token:', response.data.access_token);
      return response.data.access_token;
    } else {
      throw new Error(`Failed to retrieve access token: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error; // Re-throw for handling in the calling component
  }
}



interface BlizzardCard {
  // Define the expected structure of a Hearthstone card from the API
  id: number;
  name: string;
  type: string;
  // Add other relevant card properties based on the API response
}



function App(): JSX.Element{
  const [cards, setCards] = useState<BlizzardCard[]>([]); // Initialize cards state

  async function fetchData() {
    try {
      const accessToken = await getBlizzardAccessToken();

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const url = 'https://us.api.blizzard.com/hearthstone/cards?locale=en_US&gameMode=battlegrounds';
      const response = await axios.get(url, { headers });
      
      if (response.status === 200) {
        
        const first10Cards = response.data.cards.slice(0, 10);
        setCards(first10Cards); // Update state with the first 10 cards
      } else {
        throw new Error(`Failed to fetch cards: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      // Handle errors appropriately in your component
    }
  }

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures fetchData runs only once

  return (
    <div>
      {cards.length > 0 ? (
        <ul>
          {cards.map((card: BlizzardCard) => (
            <li key={card.id}>
              {/* Display card information here using card.name, card.type, etc. */}
              {card.name} ({card.type})
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading cards...</p>
      )}
    </div>
  );
}

export default App;
