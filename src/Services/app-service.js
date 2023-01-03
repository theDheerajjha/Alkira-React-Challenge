import axios from "axios";

const _baseUrl = "https://www.balldontlie.io/api/v1/";


export async function getListOfTeams() {
  const response = await axios.get(`${_baseUrl}teams/`);
  return response.data;
}

export async function getSpecificTeamDetails(id) {
  const response = await axios.get(`${_baseUrl}teams/${id}`);
  return response;
}

//To get details of games of a specific teams for a particular session
export async function getSpecificTeamGameDetails(season, id) {
  const seasons = [];
  const team_ids =[];
  seasons.push(season);
  team_ids.push(id);
  const response = await axios.get(`${_baseUrl}games/?seasons[]=${seasons}&ids[]=${team_ids}`);
  return response.data;
}
