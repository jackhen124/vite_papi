import { useState } from 'react'

import './App.css'

import axios from 'axios';
import { Buffer } from 'buffer';

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


function cardComponent(card) { 
  return (
    <div className="card bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-2">Card Name</h2>
    </div>
  );

}

function cardsComponent(){
  return 
}
import { useEffect } from 'react';

async function fetchData() {
  console.log('Fetching data...');
  try {
    const accessToken = await getBlizzardAccessToken();
    // Use the access token in your API calls here
  } catch (error) {
    console.error('Error fetching access token:', error);
    // Handle errors appropriately
  }
}

function App() {
  
  
  fetchData();
}

export default App;
