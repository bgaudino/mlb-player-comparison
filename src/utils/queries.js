import { playerIdUrl, hittingUrl, playerSearchUrl } from "./urls";

export async function getPlayerById(playerId) {
  const res = await fetch(
    playerIdUrl + `?sport_code='mlb'&player_id='${playerId}'`
  );
  const data = await res.json();
  return data;
}

export async function getStats(playerId) {
  const queryParams = `?league_list_id='mlb'&game_type='R'&player_id='${playerId}'`;
  const res = await fetch(hittingUrl + queryParams);
  const data = await res.json();
  return data.sport_career_hitting.queryResults.row;
}

export async function getPlayersByName(namePart) {
  if (namePart.split(" ").length < 2) namePart = namePart + "%25";
  const queryString = `?sport_code='mlb'&name_part='${namePart}'`;
  const res = await fetch(playerSearchUrl + queryString);
  const data = await res.json();
  return {
    totalResults: Number(data.search_player_all.queryResults.totalSize),
    queryResults: data.search_player_all.queryResults.row,
  };
}
