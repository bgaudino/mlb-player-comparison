import { useEffect, useState } from "react";
import Player from "./components/Player";
import "./css/normalize.css";
import "./css/skeleton.css";
import "./css/custom.css";
import {
  getPhotoUrl,
  hittingUrl,
  playerIdUrl,
  playerSearchUrl,
} from "./utils/urls";

const listStyles = {
  listStyle: "none",
  overflow: "scroll",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  margin: "0.5rem",
};

const playerIDs = [
  "121578",
  "111188",
  "124341",
  "110001",
  "112431",
  "114680",
  "119602",
  "545361",
  "118258",
  "405395",
  "121314",
  "113376",
  "121347",
  "121836",
  "121311",
  "115749",
  "116156",
  "115270",
  "110849",
  "112391",
  "116539",
  "400085",
  "110925",
  "110533",
  "124650",
  "111437",
  "111986",
  "120117",
  "118743",
  "122544",
];

function App() {
  const [players, setPlayers] = useState({
    player1: {
      playerInfo: null,
      stats: null,
    },
    player2: {
      playerInfo: null,
      stats: null,
    },
  });
  const [query, setQuery] = useState({
    player1: "",
    player2: "",
  });
  const [results, setResults] = useState({
    player1: [],
    player2: [],
  });
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const queryString = new URLSearchParams(window.location.search);
    const player1Id =
      queryString.get("player1") ||
      playerIDs[Math.floor(Math.random() * playerIDs.length)];
    const player2Id =
      queryString.get("player2") ||
      playerIDs[Math.floor(Math.random() * playerIDs.length)];
    if (player1Id) {
      getPlayerById(player1Id).then((res) => {
        const playerInfo = res.player_info.queryResults.row;
        setPlayers((prevState) => ({
          ...prevState,
          player1: {
            ...prevState.player1,
            playerInfo: playerInfo,
          },
        }));
      });
      getStats(player1Id).then((res) => {
        setPlayers((prevState) => ({
          ...prevState,
          player1: {
            ...prevState.player1,
            stats: res,
          },
        }));
      });
    }
    if (player2Id) {
      getPlayerById(player2Id).then((res) => {
        const playerInfo = res.player_info.queryResults.row;
        setPlayers((prevState) => ({
          ...prevState,
          player2: {
            ...prevState.player2,
            playerInfo: playerInfo,
          },
        }));
      });
      getStats(player2Id).then((res) => {
        setPlayers((prevState) => ({
          ...prevState,
          player2: {
            ...prevState.player2,
            stats: res,
          },
        }));
      });
    }
  }, []);

  async function findPlayer(e, namePart, key) {
    e.preventDefault();
    setNoResults(false);
    setPlayers({
      ...players,
      [key]: {
        playerInfo: null,
        stats: null,
      },
    });
    if (namePart.split(" ").length < 2) namePart = namePart + "%25";
    setQuery({ ...query, [key]: "" });
    const queryString = `?sport_code='mlb'&name_part='${namePart}'`;
    const res = await fetch(playerSearchUrl + queryString);
    const data = await res.json();
    const totalResults = Number(data.search_player_all.queryResults.totalSize);
    const queryResults = data.search_player_all.queryResults.row;
    if (totalResults === 0) {
      setNoResults(true);
      setResults({
        ...results,
        [key]: [],
      });
      setPlayers({
        ...players,
        [key]: {
          playerInfo: null,
          stats: null,
        },
      });
    } else if (totalResults === 1) {
      setNoResults(false);
      const stats = await getStats(queryResults.player_id);
      setResults({ ...results, [key]: [] });
      setPlayers({
        ...players,
        [key]: {
          playerInfo: queryResults,
          stats: stats,
        },
      });
      const queryString = new URLSearchParams(window.location.search);
      queryString.set(key, queryResults.player_id);
      window.history.pushState(null, null, `?${queryString.toString()}`);
    } else if (totalResults > 1) {
      setNoResults(false);
      setResults({
        ...results,
        [key]: queryResults,
      });
    }
  }

  async function getPlayerById(playerId) {
    const res = await fetch(
      playerIdUrl + `?sport_code='mlb'&player_id='${playerId}'`
    );
    const data = await res.json();
    return data;
  }

  async function getStats(playerId) {
    const queryParams = `?league_list_id='mlb'&game_type='R'&player_id='${playerId}'`;
    const res = await fetch(hittingUrl + queryParams);
    const data = await res.json();
    return data.sport_career_hitting.queryResults.row;
  }

  async function selectPlayer(player, key) {
    const stats = await getStats(player.player_id);
    setResults({ ...results, [key]: [] });
    setPlayers({
      ...players,
      [key]: {
        playerInfo: player,
        stats: stats,
      },
    });
    const queryString = new URLSearchParams(window.location.search);
    queryString.set(key, player.player_id);
    window.history.pushState(null, null, `?${queryString.toString()}`);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="twelve columns">
          <h1
            style={{
              marginTop: "2rem",
              textAlign: "center",
            }}
          >
            MLB Player Comparison
          </h1>
        </div>
      </div>
      {/* Player One */}
      <div className="row">
        <div className="six columns">
          <form onSubmit={(e) => findPlayer(e, query.player1, "player1")}>
            <div>
              <input
                value={query.player1}
                onChange={(e) =>
                  setQuery({ ...query, player1: e.target.value })
                }
                type="text"
                placeholder="Player 1"
                style={{ width: "100%" }}
              />
              <button
                className={query.player1 ? "button-primary" : ""}
                disabled={!query.player1}
                style={{ width: "100%" }}
                type="submit"
              >
                Search
              </button>
            </div>
          </form>
          {players.player1.playerInfo ? (
            <Player
              player={players.player1}
              comp={players.player2.stats}
              fallback="Player 1"
            />
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    backgroundColor: "white",
                    width: "200px",
                    padding: "8px",
                    minHeight: "300px",
                    border: "1px solid black",
                    boxShadow: "0px 0px 10px #585858",
                    marginBottom: "2rem",
                  }}
                  src={getPhotoUrl()}
                  alt="blank headshot"
                />
              </div>
              <div className="search-results">
                <h3>Search Results</h3>
                {noResults && "No results"}
                {results.player1.length > 0 && (
                  <div>
                    <ul style={listStyles}>
                      {results.player1.map((player) => (
                        <li
                          key={player.player_id}
                          onClick={() => selectPlayer(player, "player1")}
                        >
                          <span>{player.name_display_first_last}</span>
                          <span>{player.position}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* Player Two */}
        <div className="six columns">
          <form onSubmit={(e) => findPlayer(e, query.player2, "player2")}>
            <div>
              <input
                value={query.player2}
                onChange={(e) =>
                  setQuery({ ...query, player2: e.target.value })
                }
                type="text"
                placeholder="Player 2"
                style={{ width: "100%" }}
              />
              <button
                className={query.player2 ? "button-primary" : ""}
                disabled={!query.player2}
                style={{ width: "100%" }}
                type="submit"
              >
                Search
              </button>
            </div>
          </form>
          {players.player2.playerInfo ? (
            <Player
              player={players.player2}
              comp={players.player1.stats}
              fallback="Player 2"
            />
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    backgroundColor: "white",
                    width: "200px",
                    padding: "8px",
                    minHeight: "300px",
                    border: "1px solid black",
                    boxShadow: "0px 0px 10px #585858",
                    marginBottom: "2rem",
                  }}
                  src={getPhotoUrl()}
                  alt="blank headshot"
                />
              </div>
              <div className="search-results">
                <h3>Search Results</h3>
                {noResults && "No results"}
                {results.player2.length > 0 && (
                  <div>
                    <ul style={listStyles}>
                      {results.player2.map((player) => (
                        <li
                          key={player.player_id}
                          onClick={() => selectPlayer(player, "player2")}
                        >
                          <span>{player.name_display_first_last}</span>
                          <span>{player.position}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
