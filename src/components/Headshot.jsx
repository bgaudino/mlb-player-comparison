import { getPhotoUrl } from "../utils/queries";

export default function Headshot({ player }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
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
        src={getPhotoUrl(player?.player_id || "")}
        alt={player?.name_display_first_last || "Blank headshot"}
      />
    </div>
  );
}
