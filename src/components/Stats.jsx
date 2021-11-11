const statCategories = ["avg", "hr", "rbi", "r", "sb", "obp", "slg", "ops"];

export default function Stats({ player, comp }) {
  const { playerInfo, stats } = player;

  function getColor(stat, opponent) {
    stat = Number(stat);
    opponent = Number(opponent);
    if (stat > opponent) {
      return {
        background: "#77c66e",
        color: "black",
      };
    } else if (stat < opponent) {
      return {
        background: "#f44336",
        color: "white",
      };
    } else {
      return { background: "#b4d0e2", color: "black" };
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="player-stats">
        <h3 className="name">{playerInfo?.name_display_first_last}</h3>
        {stats && (
          <table style={{ width: "100%" }}>
            <tbody>
              {statCategories.map((stat) => (
                <tr
                  key={stat}
                  style={
                    !comp
                      ? {}
                      : {
                          backgroundColor: getColor(stats?.[stat], comp?.[stat])
                            .background,
                          color: getColor(stats?.[stat], comp?.[stat]).color,
                        }
                  }
                >
                  <td style={{ fontWeight: "bold", padding: 20 }}>
                    {stat.toUpperCase()}
                  </td>
                  <td>{stats?.[stat]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
