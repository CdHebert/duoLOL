require('dotenv').config();
//import packages
const TeemoJS = require('teemojs');
const axios = require('axios');

//riot api key 
//! will be saved to an .env when we go to production 
const key = process.env.RIOT_KEY
//set key for all axios calls 

axios.defaults.headers.common["X-Riot-Token"] = key;
axios.defaults.headers.common["Origin"] = 'localhost:3000';
//set api key for riot api wrapper
let api = TeemoJS(key)

//automatically check the patch version to be passed to the other axios functions 
async function getCurrentPatch() {

    const url = 'http://ddragon.leagueoflegends.com/api/versions.json';
    const { data } = await axios.get(url)
    const currentPatch = data[0]
    return currentPatch;
}
//? (regions: BR1,EUN1,EUW1,JP1,KR,LA1,LA2,NA1,OC1,TR1,RU)()
//gather riot info on sign up
async function riotDataSignUp(sumName, region = 'na1') {
    // will take the puuid and the riot id

    const userData = await api.get(region, 'summoner.getBySummonerName', sumName)
    // console.log(userData);
    const riotId = userData.id;
    const puuid = userData.puuid
    const lolData = await riotDataUpdata(riotId, region)

    return { ...userData, ...lolData, riotId, puuid }
}
//update riot info on login
async function riotDataUpdata(riotId, region = 'na1') {
    //solo que data
    const lolData = await api.get(region, 'league.getLeagueEntriesForSummoner', riotId)
    //return first slot in array because that is solo que data
    return lolData[0]
}
//!get mastery for all champs for a user 
async function champMasteryData(region, riotId) {
    //return user top 20 champion (most played) 
    const userChampionsMastery = await api.get(region, 'championMastery.getAllChampionMasteries', riotId)

    //return top 
    return userChampionsMastery;
}

//! get all match info for the last 20 matches 
//? (regions: americas asia or europe)(puuid)(ranked or normal)
async function matchHistoryData(region, type = 'rank', puuid) {
    const link = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?type=${type}&start=0&count=20`
    const matchIds = await axios.get(link)

    let matchHistoryData = []

    matchIds.map(async function (match) {
        const link = `https://${region}.api.riotgames.com/lol/match/v5/matches/${match}`
        const matchData = await axios.get(link)

        matchHistoryData.push(matchData)
    });

    return matchHistoryData
}


//Data for champlist component  of current champions
async function getChampions(_patch) {
    let patch = _patch ? _patch : await getCurrentPatch()
    let champList = []

    //grab list of all champs and put in array of object with name and square img 
    const link = `http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`
    try {
        const data = await axios.get(link)

        for (const [key, value] of Object.entries(data.data.data)) {
            champList.push({
                name: key,
                blurb: value.blurb,
                icon: {
                    url: `http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${key}.png`
                }
            })
        }
    }
    catch (err) {
        console.error(err)
    }
    return champList
}

/**
 * gets champion data by name
 * @param {String} champName 
 * @param {String} patch 
 * @returns 
 */
async function getChampionByName(champName, _patch) {
    //check current patch
    let patch = _patch ? _patch : await getCurrentPatch()
    // const patch = await setPatch();


    //link to specific champdata
    const link = `http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${champName}.json`;

    const { data } = await axios.get(link)

    //navigate down into the obj with the data we want 
    const champ = data.data[champName];
    let champInfo = { ...champ }
    //set up out champInfo with the data we want returned

    champInfo.images = [];
    //store all images in obj with titles
    champInfo.skins.map(skin =>
        champInfo.images.push({
            name: skin.name,
            url: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champName}_${skin.num}.jpg`
        }));

    champInfo.passive = {
        name: champInfo.passive.name,
        description: champInfo.passive.description,
        icon: {
            url: `http://ddragon.leagueoflegends.com/cdn/${patch}/img/passive/${champInfo.passive.image.full}`
        }
    };

    champInfo.abilities = [];
    //store all skins in obj with titles/img/descriptions
    champInfo.spells.map(spell =>
        champInfo.abilities.push({
            name: spell.name,
            description: spell.description,
            icon: {
                url: `http://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${spell.image.full}`
            }
        }));


    return champInfo

}



module.exports = { getChampions, getChampionByName, riotDataUpdata, getCurrentPatch, riotDataSignUp, matchHistoryData, champMasteryData }