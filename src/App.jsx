import { useState } from "react";
import Player from "./components/Player";
import "./css/normalize.css";
import "./css/skeleton.css";
import "./css/custom.css";
import { hittingUrl, playerUrl } from "./utils/urls";

const listStyles = {
  listStyle: "none",
  maxHeight: "50rem",
  overflow: "scroll",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  margin: "0.5rem",
};

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
    const res = await fetch(playerUrl + queryString);
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
    } else if (totalResults > 1) {
      setNoResults(false);
      setResults({
        ...results,
        [key]: queryResults,
      });
    }
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
            <div>
              {(results.player1.length > 0 || noResults) && (
                <h3>Search Results</h3>
              )}
              {noResults && "No results"}
              {results.player1.length > 0 && (
                <div>
                  <ul style={listStyles}>
                    {results.player1.map((player) => (
                      <li
                        key={player.player_id}
                        onClick={() => selectPlayer(player, "player1")}
                      >
                        {player.name_display_first_last}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
            <div>
              {(results.player2.length > 0 || noResults) && (
                <h3>Search Results</h3>
              )}
              {noResults && "No results"}
              {results.player2.length > 0 && (
                <div>
                  <ul style={listStyles}>
                    {results.player2.map((player) => (
                      <li
                        key={player.player_id}
                        onClick={() => selectPlayer(player, "player2")}
                        style={{
                          cursor: "pointer",
                          "&:hover": {
                            background: "#efefef",
                          },
                        }}
                      >
                        {player.name_display_first_last}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
