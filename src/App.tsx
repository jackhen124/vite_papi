import { Component} from 'react'
import {motion, useMotionValue, useSpring, useTransform} from 'framer-motion'
import './App.css'

import axios, { AxiosRequestConfig } from 'axios';
import { Buffer } from 'buffer';
import { useEffect, useState } from 'react';
//import { render } from 'react-dom';
//import fs from 'fs';
import { mockData } from './mockData';
import { setDefaultAutoSelectFamilyAttemptTimeout } from 'net';
import { get } from 'http';




async function getBlizzardAccessToken() {
  console.log('Fetching access token...')
  try {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
    //const clientId = process.env.VITE_CLIENT_ID;
    //const clientSecret = process.env.VITE_CLIENT_SECRET ?? '';
    console.log('clientId = ', clientId)
    console.log('clientSecret = ', clientId)
    const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const headers = {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = 'grant_type=client_credentials';

    const response = await axios.post('https://oauth.battle.net/token', data, { headers });

    if (response.status === 200) {
      //console.log('Access token:', response.data.access_token);
      console.log("Get access token successful")
      return response.data.access_token;
    } else {
      throw new Error(`Failed to retrieve access token: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error; // Re-throw for handling in the calling component
  }
}



function cardTypeAsWord(cardType: string, isPlural: boolean = false) {  
  //console.log("cardTypeIdToWords = ", cardTypeId)
  let result = cardType.charAt(0).toUpperCase() + cardType.slice(1);

  
  if (isPlural) {
    if (result === 'Hero') {
      result += 'e';
    }
    result += 's';
  }
  return result;

}



function tribeIdsToWords(minionIds: number[]) {
  //console.log("minionTypeIdsToWords = ", minionIds)
  const result: string[] = [];
  const conversionDict: { [key: number]: string } = {
    11: 'Undead',
    14: 'Murloc',
    15: 'Demon',
    17: 'Mech',
    18: 'Elemental',
    20: 'Beast',
    23: 'Pirate',
    24: 'Dragon',
    43: 'Quilboar',
    92: 'Naga'
  };
  if (minionIds) {
    minionIds.forEach((minionId) => {
      if (conversionDict[minionId] !== undefined) {
        //console.log("minionTypeWords[minionId] = ", conversionDict[minionId])
        result.push(conversionDict[minionId]);
      }else{
        result.push(conversionDict[minionId]);
      }
    });
  }
  
  //console.log("minionTypeIdsToWords = ", result)
  return result
}

function cardGroupDisplay(cards) {
  if (cards === undefined) {  
    return (
      <p>Loading cards...</p>
    );
  }
  return (
    
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {cards.map((card: BlizzardCard) => (
        CardDisplay(card)
      ))}
    </div>
    
  )
  
}

const CardDisplay = (card: BlizzardCard) => {

  //const [count, setCount ] = useState(0);
  //const x = useMotionValue(0);
  //const y = useMotionValue(0);
  //const mouseXSpring = useSpring(x);
  //const mouseYSpring = useSpring(y);

  //const rotateX = useTransform(mouseYSpring, [-.5, .5], ["17.5deg", "-17.5deg"]);
  //const rotateYSpring = useSpring(y)
  const handleMouseMove = (event) => {
    const rect =  event.target.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const valFromTutorial = .5
    const xPercent = mouseX / width - valFromTutorial;
    const yPercent = mouseY / height - valFromTutorial;
    //console.log('w = ', mouseX, ' h = ', mouseY)
    //x.set(xPercent);
    //y.set(yPercent);
  }
  return(
    <motion.div key={card.id} style={{ width: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
      <div 
        style={{ position: 'relative',transformStyle: "preserve-3d",}}
        onMouseMove = {handleMouseMove}
      >
        <img src={card.image} alt={card.name} style={{ transformStyle: "preserve-3d", width: '100%', height: 'auto' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
          {card.name}
      </div>
      <div style={{ textAlign: 'center' }}>
        {tribeIdsToWords(card.tribeIds.toString().split(',').map(Number))}
      </div>
      
      
    </motion.div>
  );
  
}



function cardTypeTabClicked(type: string){
  console.log('cardTypeTabClicked = ', type)
  //this.setState({ curCardTypeId: type });

}

function cardTypeTab(type: string, isSelected: boolean = false){
  let borderSize = '2.5px'
  let offset = '0px';
  let tabClass = "tab";
  let color = 'white'; // default color
  let textColor = ''
  
  let b = `${borderSize} solid ${color}`;
  let style = { 
    margin: '4px', 
    padding: '10px', 
    width: '125px', 
    border: 'none', 
    position: 'relative', 
    color: 'white',
    backgroundColor: 'rgba(1,1,1,1)',
    borderBottom: b,
  }
  if (isSelected){
    
    style.borderBottom = 'none';
    style.borderTop = b
    style.borderRight = b;
    style.borderLeft = b;
    style.backgroundColor = 'rgba(1,1,1,0)';
    
    
  }
  return (
    <button 
      onClick={() => cardTypeTabClicked(type)}
      className = "tab"
      style={style}
    >
      {cardTypeAsWord(type, true)}
    </button>
  );
}

async function getMockData(){
    const result = mockData;
    console.log('Getting mock data ', result)
    
    return result;
    
}

function typeIdToString(typeId: number){
  let result = 'other';
  const conversionDict: { [key: number]: string } = {
    4: 'minion',
    5: 'quest',
    40: 'reward',
    42: 'spell',
    43: 'reward',
    3: 'hero',
  };
  result = conversionDict[typeId] || 'Other';
  return result;
}

async function fetchDataOld() {

  
    
  const cardsByType: { [key: string]: [] } = {};
  
  console.log('Fetching data...')
    
  let apiData = null;
  let useLocalData = false;

  useLocalData = import.meta.env.VITE_USE_MOCK_DATA !== undefined ? Boolean(import.meta.env.VITE_USE_MOCK_DATA) : false;
  useLocalData = false;
  console.log('use local Data = ', useLocalData);
  
  if (!useLocalData){
    console.log('fetching data from api')
    
      
    const accessToken = await getBlizzardAccessToken();
    
    console.log('accessToken = ', accessToken)
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    let url = 'https://us.api.blizzard.com/hearthstone/cards?locale=en_US&gameMode=battlegrounds';
    //url += '&pageSize=1000'
    //const url = 'https://us.api.blizzard.com/hearthstone/cards?gameMode=battlegrounds';

   
    try{
      //const response = await axios.get(url, { headers });
      
      //console.log('API request status:', response.status);
      apiData = await getDataFromApi(accessToken);
      console.log('apiData = ', apiData)
    }catch(error){
      console.error('API GET CARDS error = ', error)
    }
    
    
    
  }
  if (useLocalData){
    console.log('fetching local data')
    apiData = await getMockData();
    //console.log("local api data = ", apiData)
  
  }
  if (apiData) {
    return filterApiData(apiData);
    
    
  } 
}



function filterApiData(apiData){
  console.log('filtering data...')
  if (!apiData || !apiData.cards) {
    console.error('No cards found in API data');
    return {};
  }
  const cardsByType: { [key: string]: [] } = {};
  
  apiData.cards.forEach((cardData: any) => {
      
    //const type = this.getCardTypeFromData(cardData);
    
    let tribeIds = []
    
    tribeIds.push(cardData.minionTypeId)
    cardData.multiClassIds.forEach((id) => {
      //console.log("ADDITIONAL  id = ", id)
      tribeIds.push(id)
    });
    let cardTypeId = cardData.cardTypeId;
    if (cardTypeId === 43){ // do this because 43 and 40 are both rewards so we just use rewards
      cardTypeId = 40;
      //console.log('cardTypeId = ', cardTypeId);
    }
    const typeKey = typeIdToString(cardData.cardTypeId);
    const newCard = {
      id: cardData.id,
      name: cardData.name,
      tier: cardData.battlegrounds.tier ?? 0,
      image: cardData.battlegrounds.image,
      text: cardData.text,
      //type: type,
      tribeIds: tribeIds,
      cardType: typeKey,
    };
   
    
    if (cardsByType[typeKey] === undefined) {
      cardsByType[typeKey] = [];
    }
    
    cardsByType[typeKey].push(newCard);
    
      
    
  });
  
  for (const type in cardsByType) {
    console.log(`${type} count = ${cardsByType[type].length}`)
    if (cardsByType[type].length === 0){
      continue;
    }
    const exampleCard = cardsByType[type][0];
    if (exampleCard.tier){
      if (exampleCard.tier !== undefined) {
     
        console.log(`${type} has tier! sorting... `)
        cardsByType[type] = cardsByType[type].sort((a: BlizzardCard, b: BlizzardCard) => a.tier - b.tier);
      }
    }
    
  }
  console.log('done filtering data')
  return cardsByType;
}


interface BlizzardCard {
  id: string;
  name: string;
  tier: number;
  image: string;
  text: string;
  tribeIds: number[];
  cardType: string;
}





async function fetchData(){
  const accessToken = await getBlizzardAccessToken();
  const cardsUrl = 'https://us.api.blizzard.com/hearthstone/cards?locale=en_US&gameMode=battlegrounds&pageSize=1000';
  let useLocalData = false;

  useLocalData = import.meta.env.VITE_USE_MOCK_DATA !== undefined ? Boolean(import.meta.env.VITE_USE_MOCK_DATA) : false;
  useLocalData = false;
  let apiData = {};
  if (useLocalData){
    apiData = await getMockData();
  }else{
    apiData = await getDataFromApi(cardsUrl, accessToken);
  }
  
  const cardData = filterApiData(apiData);
  return cardData;
}

async function getDataFromApi(url:string, access_token: string = ''){

  console.log('getting data from url: ', url)
  console.log('access_token = ', access_token)
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: { 
     
      'Authorization': `Bearer ${access_token}`
    }
  };
  
  axios.request(config)
  //axios.get(url, { headers: { 'Authorization': `Bearer ${access_token}` } })
  .then((response) => {
    console.log('attempting to print response')
    console.log(JSON.stringify(response));
    return response.data;
    
  })
  .catch(error => {
    console.log('Error Response = ' , error.response)
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.log('Error response:', error.response);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.log('Error message:', error.message);
    }
    return null;
  });
}




function testCatFactApi(){
 getDataFromApi('https://catfact.ninja/fact')

}



function App() {
  
  console.log('App')
  //testCatFactApi()
  const [cardData, setCardData] = useState({});
  const [curCardType, setCurCardType] = useState('minion');
  fetchData()
  //useEffect(() => {
  //  fetchData().then((res) => {
  //    console.log('fetchData res = ', res)
  //    setCardData(res);
  //  });
  //}, []);
  
  console.log('cardData = ', cardData)
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
     
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '50%' }}>
        {Object.keys(cardData).map((key) => (
          <div key={key} onClick={() => setCurCardType(key)}>
            {cardTypeTab(key, key === curCardType)}
          </div>
        ))}
      </div>
      <div>
        {cardGroupDisplay(cardData[curCardType])}
      </div>
    </div>
  );
}



export default App;