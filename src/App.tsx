import { Component} from 'react'
import {motion, useMotionValue, useSpring, useTransform} from 'framer-motion'
import './App.css'

import axios from 'axios';
import { Buffer } from 'buffer';
import { useEffect, useState } from 'react';
//import { render } from 'react-dom';
//import fs from 'fs';
import { mockData } from './mockData';
import { setDefaultAutoSelectFamilyAttemptTimeout } from 'net';





async function getBlizzardAccessToken() {
  console.log('Fetching access token...')
  try {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
    //const clientId = process.env.VITE_CLIENT_ID;
    //const clientSecret = process.env.VITE_CLIENT_SECRET ?? '';
    //console.log('clientId = ', clientId)
    //console.log('clientSecret = ', clientId)
    const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const headers = {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = 'grant_type=client_credentials';

    const response = await axios.post('https://oauth.battle.net/token', data, { headers });

    if (response.status === 200) {
      //console.log('Access token:', response.data.access_token);
      return response.data.access_token;
    } else {
      throw new Error(`Failed to retrieve access token: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error; // Re-throw for handling in the calling component
  }
}



function cardTypeIdToWords(cardTypeId: number, isPlural: boolean = false) {  
  //console.log("cardTypeIdToWords = ", cardTypeId)
  let result = '';
  const conversionDict: { [key: number]: string } = {
     
    4: 'Minion',
    5: 'Quest',
    40: 'Reward',
    42: 'Spell',
    
    3: 'Hero',
    
  };

  
  result = conversionDict[cardTypeId] || 'Other';
  if (isPlural){
    if (result == 'Hero'){
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

function cardGroupDisplay(cards: BlizzardCard[]) {
  return (
    
    <div>
      {cards.length > 0 ? (
        <ul>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {cards.map((card: BlizzardCard) => (
              CardDisplay(card)
            ))}
          </div>
        </ul>
      ) : (
        <p>Loading cards...</p>
      )}
    </div>
    
  )
}





function CardDisplayOld(card: BlizzardCard){

  let result = null;
  
  result =
  <div key={card.id} style={{ width: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
    <img src={card.image} alt={card.name} style={{ width: '100%', height: 'auto' }} />
    
    <div style={{ textAlign: 'center' }}>
        {card.name}
    </div>
    <div style={{ textAlign: 'center' }}>
      {tribeIdsToWords(card.tribeIds.toString().split(',').map(Number))}
    </div>
    
  </div>
  
  return result;

}

const CardDisplay = (card: BlizzardCard) => {

  const [count, setCount ] = useState(0);
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
    console.log('w = ', mouseX, ' h = ', mouseY)
    x.set(xPercent);
    y.set(yPercent);
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
      <div style={{ textAlign: 'center' }}>
        {count}
      </div>
      
    </motion.div>
  );
  
}



function cardTypeTabClicked(type: string){
  console.log('cardTypeTabClicked = ', type)
  //this.setState({ curCardTypeId: type });

}

function cardTypeTab(type: string){
  let borderSize = '0px'
  
  return (
    <button 
      onClick={() => cardTypeTabClicked(type)}
      style={{ margin: '4px', padding: '10px', width: '100px', border: 'none', borderRadius: '4px'}}
    >
      {cardTypeIdToWords(type, true)}
    </button>
  );
}

async function getMockData(){
    const result = mockData;
    //console.log('Getting mock data ', result)
    
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

const useFetchDataOld() => {

  
    
  //const cardsByType: { [key: string]: [] } = {};
  const [state, setState] = useState({
    loading:true,
    data: null,
    error: null

  });
    
  console.log('Fetching data...')
    
  let apiData = null;
  let useLocalData = false;

  useLocalData = import.meta.env.VITE_USE_MOCK_DATA !== undefined ? Boolean(import.meta.env.VITE_USE_MOCK_DATA) : false;
  console.log('use local Data = ', useLocalData);
  if (useLocalData){
    console.log('fetching local data')
    apiData = await getMockData();
    //console.log("local api data = ", apiData)
  
  }else{
    try{
      console.log('fetching data from api')
      const accessToken = await getBlizzardAccessToken();

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      let url = 'https://us.api.blizzard.com/hearthstone/cards?locale=en_US&gameMode=battlegrounds';
      url += '&pageSize=1000'
      //const url = 'https://us.api.blizzard.com/hearthstone/cards?gameMode=battlegrounds';

      const response = await axios.get(url, { headers });
      apiData = response.data;
    }catch(error){
      console.error('Error fetching data from api:', error);
    }
    
  }
  if (apiData) {
    
    apiData.cards.forEach((cardData: any) => {
      
      //const type = this.getCardTypeFromData(cardData);
      
      let tribeIds = []
      
      tribeIds.push(cardData.minionTypeId)
      cardData.multiClassIds.forEach((id) => {
        console.log("ADDITIONAL  id = ", id)
        tribeIds.push(id)
      });
      let cardTypeId = cardData.cardTypeId;
      if (cardTypeId === 43){ // do this because 43 and 40 are both rewards so we just use rewards
        cardTypeId = 40;
        console.log('cardTypeId = ', cardTypeId);
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
    setState(prevState => ({
      data: cardsByType
    )
    return cardsByType;
    
  } 
}


const useFetchData() => {

  
    
  //const cardsByType: { [key: string]: [] } = {};
  const [state, setState] = useState({
    loading:true,
    data: null,
    error: null

  });
    
  console.log('Fetching data...')
    
  let apiData = null;
  let useLocalData = false;

  useLocalData = import.meta.env.VITE_USE_MOCK_DATA !== undefined ? Boolean(import.meta.env.VITE_USE_MOCK_DATA) : false;
  console.log('use local Data = ', useLocalData);
  if (useLocalData){
    console.log('fetching local data')
    
    apiData = await getMockData();
    //console.log("local api data = ", apiData)
  
  }else{
    try{
      console.log('fetching data from api')
      const accessToken = await getBlizzardAccessToken();

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      let url = 'https://us.api.blizzard.com/hearthstone/cards?locale=en_US&gameMode=battlegrounds';
      url += '&pageSize=1000'
      //const url = 'https://us.api.blizzard.com/hearthstone/cards?gameMode=battlegrounds';

      const response = await axios.get(url, { headers });
      apiData = response.data;
    }catch(error){
      console.error('Error fetching data from api:', error);
    }
    
  }
  
    
    
  setState(prevState => ({
    data: cardsByType
  }));
  return state;
    
  
}

const convertApiDataToCardsByType = (apiData: any) => {
  const cardsByType: { [key: string]: [] } = {};
  apiData.cards.forEach((cardData: any) => {
      
    //const type = this.getCardTypeFromData(cardData);
    
    let tribeIds = []
    
    tribeIds.push(cardData.minionTypeId)
    cardData.multiClassIds.forEach((id) => {
      console.log("ADDITIONAL  id = ", id)
      tribeIds.push(id)
    });
    let cardTypeId = cardData.cardTypeId;
    if (cardTypeId === 43){ // do this because 43 and 40 are both rewards so we just use rewards
      cardTypeId = 40;
      console.log('cardTypeId = ', cardTypeId);
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
  return cardsByType

}

const useFetchDataFromTutorial() => { 
  const localRequestConfig = requestConfig || {};
  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null,
  });
  if (!localRequestConfig?.method) {
    localRequestConfig.method = 'GET';
  }
  useEffect(() => {
    if (localRequestConfig.url) {
      axios(localRequestConfig)
        .then((res) => {
          setState(prevState => ({
            ...prevState,
            data: res.data,
          }))
        })
        .catch((err) => {
          setState(prevState => ({
            ...prevState,
            error: err,
          }))
        })
        .finally(() => {
          setState(prevState => ({
            ...prevState,
            loading: false,
          }))
        });
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: new Error('No URL provided!'),
      }));
    }
    return state;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestConfig]);
}

function App() {
  console.log('App')
  const curCardType = 'minion'
  //const [cardsByType, setCardsByType] = {curCardType:[]}
  const {
    data: cardsByType,
    loading: cardsLoading,
    error: cardsError,
  } = useFetchData();
  //const [count, setCount] = useState(0)
  //const curCardGroup = this.state.cards[this.state.curCardTypeId];
  
  //const curCardGroup = cardsByType[curCardType];
  //console.log('curCardGroup = ', curCardGroup)
  //console.log('curCardGroup  size = ', curCardGroup.length);
  return (
    <div className="App">
      {cardsLoading ? (
        <p>Data is currently loading...</p>
      ) : cardsError ? (
        <p>There was an issue loading the cards.</p>
      ) : (
        {cardsGroupDisplay(cardsByType[curCardType])}
        
      )}
    </div>
  )
}



export default App;