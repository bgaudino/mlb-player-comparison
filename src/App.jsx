import { useEffect, useState } from "react";
import Stats from "./components/Stats";
import Headshot from "./components/Headshot";
import Loading from "./components/Loading";
import Searchbar from "./components/Searchbar";
import SearchResults from "./components/SearchResults";
import { hitterIDs, pitcherIDs } from "./utils/playerIDs";
import { getPlayerById, getPlayersByName, getStats } from "./utils/queries";
import "./css/normalize.css";
import "./css/skeleton.css";
import "./css/custom.css";

function App() {
  const [players, setPlayers] = useState({
    player1: {
      playerInfo: null,
      stats: null,
      pitchingStats: null,
    },
    player2: {
      playerInfo: null,
      stats: null,
      pitchingStats: null,
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
  const [loading, setLoading] = useState({
    player1: true,
    player2: true,
  });
  const [statType, setStatType] = useState(
    new URLSearchParams(window.location.search).get("stat_type") || "hitting"
  );

  useEffect(() => {
    alert(
      "Lookup Service Unavailable during database migration. Service expected to be restored by 11/18/2021."
    );
    const playerIDs = statType === "pitching" ? pitcherIDs : hitterIDs;
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
      getStats(player1Id, "pitching").then((res) => {
        setPlayers((prevState) => ({
          ...prevState,
          player1: {
            ...prevState.player1,
            pitchingStats: res,
          },
        }));
        setLoading((prevState) => ({
          ...prevState,
          player1: false,
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
      getStats(player2Id, "pitching").then((res) => {
        setPlayers((prevState) => ({
          ...prevState,
          player2: {
            ...prevState.player2,
            pitchingStats: res,
          },
        }));
        setLoading((prevState) => ({
          ...prevState,
          player2: false,
        }));
      });
    }
  }, [statType]);
  async function handleSearch(e, namePart, key) {
    e.preventDefault();
    setLoading((prevState) => ({
      ...prevState,
      [key]: true,
    }));
    // setNoResults(false);
    setPlayers({
      ...players,
      [key]: {
        playerInfo: null,
        stats: null,
      },
    });
    setQuery({ ...query, [key]: "" });
    const { totalResults, queryResults } = await getPlayersByName(namePart);
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
      const pitchingStats = await getStats(queryResults.player_id, "pitching");
      setResults({ ...results, [key]: [] });
      setPlayers({
        ...players,
        [key]: {
          playerInfo: queryResults,
          stats: stats,
          pitchingStats: pitchingStats,
        },
      });
      handleParams(key, queryResults.player_id);
    } else if (totalResults > 1) {
      setNoResults(false);
      setResults({
        ...results,
        [key]: queryResults,
      });
    }
    setLoading((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  }
  async function selectPlayer(player, key) {
    setLoading((prevState) => ({
      ...prevState,
      [key]: true,
    }));
    const stats = await getStats(player.player_id);
    const pitchingStats = await getStats(player.player_id, "pitching");
    setResults({ ...results, [key]: [] });
    setPlayers({
      ...players,
      [key]: {
        playerInfo: player,
        stats: stats,
        pitchingStats: pitchingStats,
      },
    });
    const queryString = new URLSearchParams(window.location.search);
    queryString.set(key, player.player_id);
    window.history.pushState(null, null, `?${queryString.toString()}`);
    setLoading((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  }

  function handleParams(key, value) {
    const queryString = new URLSearchParams(window.location.search);
    queryString.set(key, value);
    window.history.replaceState(null, null, `?${queryString.toString()}`);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="twelve columns">
          <h1
            style={{
              cursor: "pointer",
            }}
            onClick={() => (window.location.href = "/")}
          >
            MLB Player Comparison
          </h1>
        </div>
      </div>
      <div className="row">
        <div
          className="twelve columns"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
          }}
        >
          <input
            id="hitting"
            type="radio"
            name="statType"
            value="hitting"
            checked={statType === "hitting"}
            onChange={() => {
              setStatType("hitting");
              handleParams("stat_type", "hitting");
            }}
          />
          &nbsp;
          <label for="hitting">Hitting</label>
          <div style={{ width: "10px" }}></div>
          <input
            id="pitching"
            type="radio"
            name="statType"
            value="pitching"
            checked={statType === "pitching"}
            onChange={() => {
              setStatType("pitching");
              handleParams("stat_type", "pitching");
            }}
          />
          &nbsp;
          <label for="pitching">Pitching</label>
        </div>
      </div>
      {/* Player One */}
      <div className="row">
        <div className="six columns">
          <Searchbar
            playerKey="player1"
            query={query.player1}
            setQuery={setQuery}
            handleSearch={handleSearch}
          />
          {loading.player1 ? (
            <Loading />
          ) : (
            <>
              <Headshot player={players.player1.playerInfo} />
              {players.player1.playerInfo ? (
                <Stats
                  player={players.player1}
                  comp={
                    statType === "hitting"
                      ? players.player2.stats
                      : players.player2.pitchingStats
                  }
                  fallback="Player 1"
                  type={statType}
                />
              ) : (
                <SearchResults
                  results={results.player1}
                  selectPlayer={selectPlayer}
                  noResults={noResults}
                  playerKey="player1"
                />
              )}
            </>
          )}
        </div>
        {/* Player Two */}
        <div className="six columns">
          <Searchbar
            playerKey="player2"
            query={query.player2}
            setQuery={setQuery}
            handleSearch={handleSearch}
          />
          {loading.player2 ? (
            <Loading />
          ) : (
            <>
              <Headshot player={players.player2.playerInfo} />
              {players.player2.playerInfo ? (
                <Stats
                  player={players.player2}
                  comp={
                    statType === "hitting"
                      ? players.player1.stats
                      : players.player1.pitchingStats
                  }
                  fallback="Player 2"
                  type={statType}
                />
              ) : (
                <SearchResults
                  results={results.player2}
                  selectPlayer={selectPlayer}
                  noResults={noResults}
                  playerKey="player2"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
