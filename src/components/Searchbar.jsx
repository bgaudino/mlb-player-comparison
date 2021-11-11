export default function Searchbar({
  query,
  playerKey,
  setQuery,
  handleSearch,
}) {
  return (
    <form onSubmit={(e) => handleSearch(e, query, playerKey)}>
      <div>
        <input
          value={query}
          onChange={(e) =>
            setQuery((prevState) => {
              return { ...prevState, [playerKey]: e.target.value };
            })
          }
          type="text"
          placeholder="Search for a player..."
          style={{ width: "100%" }}
        />
        <button
          className={query ? "button-primary" : ""}
          disabled={!query}
          style={{ width: "100%" }}
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}
