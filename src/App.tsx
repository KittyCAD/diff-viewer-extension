import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };
    if (chrome.tabs) {
      chrome.tabs.query(queryInfo, tabs => {
        const url = tabs[0].url;
        if (url) {
          setUrl(url!);
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Current URL: {url}
        </p>
      </header>
    </div>
  );
}

export default App;
