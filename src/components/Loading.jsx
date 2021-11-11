import { useEffect, useState } from "react";

export default function Loading() {
  const [loadingBar, setLoadingBar] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingBar((prevState) => {
        if (prevState === 100) {
          return 0;
        }
        return prevState + 1;
      });
    }, 300);

    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  let bar = "";
  for (let i = 0; i < loadingBar; i++) {
    bar += "⚾";
  }

  return (
    <div
      style={{
        fontSize: 20,
      }}
    >
      <h4>Loading...</h4>
      <div>{bar}</div>
    </div>
  );
}
