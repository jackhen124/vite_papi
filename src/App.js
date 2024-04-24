import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './App.css';
import { Buffer } from 'buffer';
import { useEffect, useState } from 'react';
import { mockData } from './mockData';
import axios from 'axios';
import { Tilt } from "react-tilt";
const getBlizzardAccessToken = () => {
    return new Promise((resolve, reject) => {
        console.log('Fetching access token...');
        try {
            const clientId = import.meta.env.VITE_CLIENT_ID;
            const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
            //console.log('clientId = ', clientId)
            //console.log('clientSecret = ', clientId)
            const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
            const headers = {
                Authorization: `Basic ${authorization}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            };
            //console.log('auth: ', headers.Authorization)
            const data = 'grant_type=client_credentials';
            axios.post('https://oauth.battle.net/token', data, { headers })
                //axios.post('https://us.battle.net/oauth/token?grant_type=client_credentials&client_id=421d99830f0447cc888e5a2889dd3bc1&client_secret=G2MukytybhQmFP50M4FOY3fZ8MQbCpf6')
                .then(response => {
                if (response.status === 200) {
                    console.log("Get access token successful");
                    //console.log("access token: " , response.data.access_token)
                    resolve(response.data.access_token);
                }
                else {
                    reject(new Error(`Failed to retrieve access token: ${response.statusText}`));
                }
            })
                .catch(error => {
                console.error('Error fetching access token:', error);
                reject(error);
            });
        }
        catch (error) {
            console.error('Error fetching access token:', error);
            reject(error);
        }
    });
};
function cardTypeAsWord(cardType, isPlural = false) {
    //console.log("cardTypeIdToWords = ", cardTypeId)
    let result = cardType;
    if (isPlural) {
        if (cardType === 'hero') {
            result += 'e';
        }
        if (cardType != 'other') {
            result += 's';
        }
    }
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
}
function tribeIdsToWords(minionIds) {
    //console.log("minionTypeIdsToWords = ", minionIds)
    const result = [];
    const conversionDict = {
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
            }
            else {
                result.push(conversionDict[minionId]);
            }
        });
    }
    //console.log("minionTypeIdsToWords = ", result)
    return result;
}
function cardGroupDisplay(cards) {
    if (cards === undefined) {
        return (_jsx("p", { children: "Loading cards...." }));
    }
    return (_jsx("div", { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }, children: cards.map((card) => (CardDisplay(card))) }));
}
const CardDisplay = (card) => {
    const tiltOptions = {
        reverse: false, // reverse the tilt direction
        max: 35, // max tilt rotation (degrees)
        perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1.2, // 2 = 200%, 1.5 = 150%, etc..
        speed: 1000, // Speed of the enter/exit transition
        transition: true, // Set a transition on enter/exit.
        axis: null, // What axis should be disabled. Can be X or Y.
        reset: true, // If the tilt effect has to be reset on exit.
        easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
    };
    return (_jsxs("div", { style: {
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '10px'
        }, children: [_jsx(Tilt, { options: tiltOptions, style: { transform: "translateZ(105px)" }, children: _jsx("img", { src: card.image, alt: card.name, style: { width: '100%', height: 'auto' } }) }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { children: card.name }), _jsx("div", { children: tribeIdsToWords(card.tribeIds.toString().split(',').map(Number)) })] }), _jsx("script", { type: "text/javascript", src: "vanilla-tilt.js" })] }, card.id));
};
function cardTypeTab(type, isSelected = false) {
    const borderSize = '2.5px';
    const b = `${borderSize} solid`;
    const style = {
        margin: '4px',
        padding: '10px',
        width: '125px',
        color: 'white',
        backgroundColor: 'rgba(1,1,1,1)',
        borderBottom: b,
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
    };
    if (isSelected) {
        style.borderBottom = 'none';
        style.borderTop = b;
        style.borderRight = b;
        style.borderLeft = b;
        style.backgroundColor = 'rgba(1,1,1,0)';
    }
    return (_jsx("button", { className: "tab", style: style, children: cardTypeAsWord(type, true) }));
}
const getMockData = () => {
    return new Promise((resolve) => {
        console.log('starting delay...');
        setTimeout(() => {
            // Start the timer
            const result = mockData;
            console.log('Getting mock data ', result);
            resolve(result);
        }, 1000);
    });
};
function typeIdToString(typeId) {
    let result = 'other';
    const conversionDict = {
        4: 'minion',
        5: 'quest',
        40: 'reward',
        42: 'spell',
        43: 'other',
        3: 'hero',
    };
    result = conversionDict[typeId] || 'Other';
    return result;
}
const filterApiData = (allCardData) => {
    console.log('filtering data...');
    if (!allCardData) {
        console.error('No cards found in API data');
        return {};
    }
    const cardsByType = {};
    allCardData.cards.forEach((cardData) => {
        //const type = this.getCardTypeFromData(cardData);
        const tribeIds = [];
        tribeIds.push(cardData.minionTypeId);
        cardData.multiClassIds.forEach((id) => {
            //console.log("ADDITIONAL  id = ", id)
            tribeIds.push(id);
        });
        let cardTypeId = cardData.cardTypeId;
        if (cardTypeId === 43) { // do this because 43 and 40 are both rewards so we just use rewards
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
        console.log(`${type} count = ${cardsByType[type].length}`);
        if (cardsByType[type].length === 0) {
            continue;
        }
        const exampleCard = cardsByType[type][0];
        if (exampleCard.tier) {
            if (exampleCard.tier !== undefined) {
                console.log(`${type} has tier! sorting... `);
                cardsByType[type] = cardsByType[type].sort((a, b) => a.tier - b.tier);
            }
        }
    }
    console.log('done filtering data');
    return cardsByType;
};
const fetchData = async () => {
    let cardsUrl = 'https://us.api.blizzard.com/hearthstone/cards?locale=en_US&gameMode=battlegrounds';
    cardsUrl += '&pageSize=1000';
    cardsUrl = 'https://us.api.blizzard.com/hearthstone/cards/52119-arch-villain-rafaam';
    let useLocalData = false;
    let message = '';
    useLocalData = import.meta.env.VITE_USE_MOCK_DATA !== undefined ? Boolean(import.meta.env.VITE_USE_MOCK_DATA) : false;
    useLocalData = false;
    let apiData = {};
    if (useLocalData) {
        message = 'mock data override';
        apiData = await getMockData();
    }
    else {
        const accessToken = await getBlizzardAccessToken();
        apiData = await getDataFromApi(cardsUrl, accessToken);
        console.log("api data after getting from api: ", apiData);
        if (apiData == undefined) {
            message = 'api failed, using mock data instead';
            apiData = await getMockData();
        }
    }
    const cardData = filterApiData(apiData);
    const result = { cards: cardData, done: true, message: message };
    return result;
};
const getDataFromApi = async (url, access_token = '') => {
    return new Promise((resolve) => {
        console.log('getting data from url: ', url);
        //console.log('access_token = ', access_token)
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
            console.log('attempting to print response');
            console.log(JSON.stringify(response));
            resolve(response.data); //.data;
        })
            .catch(error => {
            console.log('Error Response = ', error.response);
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                console.log('Error response:', error.response);
            }
            else if (error.request) {
                // The request was made but no response was received
                console.log('Error request:', error.request);
            }
            else {
                // Something happened in setting up the request that triggered an error
                console.log('Error message:', error.message);
            }
            resolve(undefined);
        });
    });
};
function App() {
    console.log('App    ');
    //tiltCard('tes')
    const [apiData, setApiData] = useState({
        cards: {},
        done: false,
        message: 'default message'
    });
    const [curCardType, setCurCardType] = useState('minion');
    useEffect(() => {
        fetchData().then((res) => {
            console.log('fetchData res = ', res);
            setApiData(res);
        });
    }, []);
    let disclaimer = "This website is not affiliated with Blizzard Entertainment.";
    return (_jsxs("div", { className: "App", style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }, children: [_jsx("div", { style: { display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '50%' }, children: Object.keys(apiData.cards).map((key) => (_jsx("div", { onClick: () => setCurCardType(key), children: cardTypeTab(key, key === curCardType) }, key))) }), _jsx("div", { children: cardGroupDisplay(apiData.cards[curCardType]) }), _jsx("div", { className: "footer", children: _jsx("p", { children: disclaimer }) })] }));
}
export default App;
