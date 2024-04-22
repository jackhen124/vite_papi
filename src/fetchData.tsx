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