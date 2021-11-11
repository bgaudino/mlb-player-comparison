const listStyles = {
  listStyle: "none",
  overflow: "scroll",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  margin: "0.5rem",
};

export default function SearchResults({
  noResults,
  results,
  playerKey,
  selectPlayer,
}) {
  return (
    <div className="search-results">
      <h3>Search Results</h3>
      {noResults && "No results"}
      {results.length > 0 && (
        <div>
          <ul style={listStyles}>
            {results.map((player) => (
              <li
                key={player.player_id}
                onClick={() => selectPlayer(player, playerKey)}
              >
                <span>{player.name_display_first_last}</span>
                <span>{player.position}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
