import { Component} from 'react'

import './App.css'

import axios from 'axios';
import { Buffer } from 'buffer';
//import { useEffect } from 'react';
//import { render } from 'react-dom';
//import fs from 'fs';
import { mockData } from './mockData';





async function getBlizzardAccessToken() {
  console.log('Fetching access token...')
  try {
    const clientId = process.env.VITE_CLIENT_ID ?? '';
    const clientSecret = process.env.VITE_CLIENT_SECRET ?? '';
    console.log('clientId = ', clientId)
    console.log('clientSecret = ', clientSecret)
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
  tier: string;
  image: string;
  text: string;
  tribeIds: number[];
  type: string;
  // Add other relevant card properties based on the API response
}



interface AppState {
  cards: {
    "minion": BlizzardCard[],
    "hero": BlizzardCard[],
    "spell": BlizzardCard[],
    "other": BlizzardCard[]
  };
  curCardType: string;
}

function tribeIdsToWords(minionIds: number[]) {
  //console.log("minionTypeIdsToWords = ", minionIds)
  const result: string[] = [];
  const conversionDict: { [key: number]: string } = {
    11: 'Undead',
    14: 'Murloc',
    15: 'Demon',
    17: 'Mech',
    23: 'pirate',
    24: 'Dragon',
    43: 'Quilboar',
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
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {cards.map((card: BlizzardCard) => (
        cardDisplay(card)
      ))}
    </div>
  )
}



function cardDisplay(card: BlizzardCard){

    let result = null;
    
    result =
    <div key={card.id} style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
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

class App extends Component<object, AppState> {
  
  state: AppState = {
    cards: {
      "minion": [],
      "hero": [],
      "spell": [],
      "other": [],
    },
    curCardType: "minion",
  };

  async getMockData(){
    const result = mockData;
    //console.log('Getting mock data ', result)
    
    return result;
    
  }
  cardTypeTab(type: string){

    return (
      <button 
        onClick={() => this.cardTypeTabClicked(type)}
        style={{ margin: '10px', padding: '10px' }}
      >
        {type}
      </button>
    );
  }
  cardTypeTabClicked(type: string){
    
    this.setState({ curCardType: type });
  
  }
  componentDidMount() {
    console.log('Component did mount')
    this.fetchData();
  }

  getCardTypeFromData(cardData: any) {
    let result = "minion";
    if (cardData.battlegrounds.hero == true) {
      result = 'hero';
    } else if (cardData.battlegrounds.quest == true) {
      result = 'quest';
    } else if ("spellSchoolId" in cardData) {
      result = 'spell';
    }

    return result;
  }

  async fetchData() {
    console.log('Fetching data...')
    
    
    
    
    const tempCards: { [key: string]: BlizzardCard[] } = {};

    Object.keys(this.state.cards).forEach((type) => {
      
      tempCards[type] = [];

    });
    console.log('tempCards = ', tempCards);
    
    let apiData = null;
    const useLocalData = true;
    if (useLocalData){
      
      apiData = await this.getMockData();
      console.log("local api data = ", apiData)
    
    }else{
      try{
        const accessToken = await getBlizzardAccessToken();

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        let url = 'https://us.api.blizzard.com/hearthstone/cards?locale=en_US&gameMode=battlegrounds';
        url += '&pageSize=100'
        //const url = 'https://us.api.blizzard.com/hearthstone/cards?gameMode=battlegrounds';
  
        const response = await axios.get(url, { headers });
        apiData = response.data;
      }catch(error){
        console.error('Error fetching data from api:', error);
      }
      
    }
    if (apiData) {
      
      apiData.cards.forEach((cardData: any) => {
        
        const type = this.getCardTypeFromData(cardData);
        let tribeIds = []
        
        tribeIds.push(cardData.minionTypeId)
        cardData.multiClassIds.forEach((id: any) => {
          console.log("ADDITIONAL  id = ", id)
          tribeIds.push(id)
        });
        
        const newCard: BlizzardCard = {
          id: cardData.id,
          name: cardData.name,
          tier: cardData.battlegrounds.tier,
          image: cardData.battlegrounds.image,
          text: cardData.text,
          type: type,
          tribeIds: tribeIds
        };
        
        try{
          tempCards[type].push(newCard);
        }catch(error){
          console.error('Error adding ',type,' card to tempCards:', tempCards);
        }
        
          
        
      });
      //const sortedMinions = minions.sort((a, b) => a.tier - b.tier);
      for (const type in tempCards) {
        console.log(`${type} size = ${tempCards[type].length}`)
      }
      this.setState({
        cards: {
          "minion": tempCards.minion,
          "hero": tempCards.hero,
          "spell": tempCards.spell,
          "other": tempCards.other,
        }
      });
      
    } 
    
  }
  

  render() {
    const curCardGroup = this.state.cards[this.state.curCardType as keyof typeof this.state.cards];
    console.log('curCardGroup  size = ', curCardGroup.length);
    return (
      <>
        {Object.keys(this.state.cards).map((cardType: string) => this.cardTypeTab(cardType))}
        <div>
          {curCardGroup.length > 0 ? (
            <ul>
              {cardGroupDisplay(curCardGroup)}
            </ul>
          ) : (
            <p>Loading cards...</p>
          )}
        </div>
      </>
    );
  }
}

export default App;
