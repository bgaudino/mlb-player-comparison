const hittingCategories = ["avg", "hr", "rbi", "r", "sb", "obp", "slg", "ops"];
const pitchingCategories = ["w", "l", "era", "whip", "so", "cg", "sv", "k9"];

export default function Stats({ player, comp, type }) {
  const { playerInfo, stats, pitchingStats } = player;
  const statCategories =
    type === "pitching" ? pitchingCategories : hittingCategories;
  const statValues = type === "pitching" ? pitchingStats : stats;

  function getColor(stat, opponent, category) {
    const lowIsBetter = ["era", "whip"];
    stat = Number(stat);
    opponent = Number(opponent);
    const green = {
      background: "#77c66e",
      color: "black",
    };
    const red = {
      background: "#f44336",
      color: "white",
    };
    const blue = { background: "#b4d0e2", color: "black" };
    let style = {};
    if (stat > opponent) {
      style = lowIsBetter.includes(category) ? red : green;
    } else if (stat < opponent) {
      style = lowIsBetter.includes(category) ? green : red;
    } else if (stat === opponent) {
      style = blue;
    }
    return style;
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
        {statValues && (
          <table style={{ width: "100%" }}>
            <tbody>
              {statCategories.map((stat) => (
                <tr
                  key={stat}
                  style={
                    !comp
                      ? {}
                      : {
                          backgroundColor: getColor(
                            statValues?.[stat],
                            comp?.[stat],
                            stat
                          ).background,
                          color: getColor(
                            statValues?.[stat],
                            comp?.[stat],
                            stat
                          ).color,
                        }
                  }
                >
                  <td style={{ fontWeight: "bold", padding: 20 }}>
                    {stat.toUpperCase()}
                  </td>
                  <td>{statValues?.[stat]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
