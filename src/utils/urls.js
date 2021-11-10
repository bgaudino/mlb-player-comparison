export const baseUrl = "https://lookup-service-prod.mlb.com";
export const playerSearchUrl = baseUrl + "/json/named.search_player_all.bam";
export const playerIdUrl = baseUrl + "/json/named.player_info.bam";
export const hittingUrl = baseUrl + "/json/named.sport_career_hitting.bam";
export const pitchingUrl = baseUrl + "/json/named.sport_career_pitching.bam";

export const getPhotoUrl = (playerId) => {
  return `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_426,q_auto:best/v1/people/${playerId}/headshot/67/current`;
};
