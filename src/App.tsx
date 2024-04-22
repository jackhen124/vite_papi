import { Component} from 'react'
import {motion, useMotionValue, useSpring, useTransform} from 'framer-motion'
import './App.css'

import axios from 'axios';
import { Buffer } from 'buffer';
import { useState } from 'react';
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



interface BlizzardCard {
  // Define the expected structure of a Hearthstone card from the API
  id: number;
  name: string;
  tier: number;
  image: string;
  text: string;
  tribeIds: number[];
  type: string;
  cardTypeId: number;
  // Add other relevant card properties based on the API response
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



function cardTypeTabClicked(type: number){
  
  this.setState({ curCardTypeId: type });

}

function cardTypeTab(typeId: number){
  let borderSize = '0px'
  if (this.state.curCardTypeId == typeId){
    borderSize = '4px'
  }
  return (
    <button 
      onClick={() => this.cardTypeTabClicked(typeId)}
      style={{ margin: '4px', padding: '10px', width: '100px', border: 'none', borderRadius: '4px'}}
    >
      {cardTypeIdToWords(typeId, true)}
    </button>
  );
}

async function getMockData(){
    const result = mockData;
    //console.log('Getting mock data ', result)
    
    return result;
    
}

async function fetchData() {

  
    
  const cards = {}
    
  
  console.log('Fetching data...')
  
  
  
  
  const tempCards: { [key: string]: BlizzardCard[] } = {};

 
    
  console.log('tempCards = ', tempCards);
  
  let apiData = null;
  let useLocalData = false;

  useLocalData = import.meta.env.VITE_USE_MOCK_DATA !== undefined ? Boolean(import.meta.env.VITE_USE_MOCK_DATA) : false;
  console.log('use mock Data = ', useLocalData);
  if (useLocalData){
    console.log('fetching local data')
    apiData = await this.getMockData();
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
      cardData.multiClassIds.forEach((id: any) => {
        console.log("ADDITIONAL  id = ", id)
        tribeIds.push(id)
      });
      let cardTypeId = cardData.cardTypeId;
      if (cardTypeId === 43){ // do this because 43 and 40 are both rewards so we just use rewards
        cardTypeId = 40;
        console.log('cardTypeId = ', cardTypeId);
      }
      const newCard: BlizzardCard = {
        id: cardData.id,
        name: cardData.name,
        tier: cardData.battlegrounds.tier ?? 0,
        image: cardData.battlegrounds.image,
        text: cardData.text,
        //type: type,
        tribeIds: tribeIds,
        cardTypeId: cardTypeId,
      };
     

      if (tempCards[newCard.cardTypeId] === undefined) {
        tempCards[newCard.cardTypeId] = [];
      }
    
      tempCards[newCard.cardTypeId].push(newCard);
      
        
      
    });
    
    //tempCards.minion = tempCards.minion.sort((a: BlizzardCard, b: BlizzardCard) => a.tier as number - b.tier as number);
    //tempCards.spell = tempCards.spell.sort((a: BlizzardCard, b: BlizzardCard) => a.tier as number - b.tier as number);
    for (const type in tempCards) {
      console.log(`${type} size = ${tempCards[type].length}`)
      if (tempCards[type].length === 0){
        continue;
      }
      const exampleCard = tempCards[type][0];
      if (exampleCard.tier){
        if (exampleCard.tier !== undefined) {
       
          console.log(`${type} has tier! sorting... `)
          tempCards[type] = tempCards[type].sort((a: BlizzardCard, b: BlizzardCard) => a.tier - b.tier);
        }
      }
      
    }
   
    this.setState({ cards: tempCards });
    
  } 

function App() {
  
  const cards = await fetchData();
  const [count, setCount] = useState(0)
  const curCardGroup = this.state.cards[this.state.curCardTypeId];
  //console.log('curCardGroup = ', curCardGroup)
  console.log('curCardGroup  size = ', curCardGroup.length);
  return (
    <>
        {Object.keys(cards).map((cardTypeId: number) => this.cardTypeTab(cardTypeId))}
        {cardGroupDisplay(curCardGroup)}
    </>
  )
}



export default App;
