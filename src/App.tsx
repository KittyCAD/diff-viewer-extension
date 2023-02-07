import React, { useEffect, useState } from "react";
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

  const sendChromeMessage = () => {
    const message: any = {
      message: "Hello from React",
    };
    if (chrome.tabs) {
      const queryInfo: chrome.tabs.QueryInfo = {
        active: true,
        currentWindow: true,
      };
      chrome.tabs.query(queryInfo, tabs => {
        const tabId = tabs[0].id;
        if (tabId) {
          chrome.tabs.sendMessage(tabId, message, response => { console.log(response) });
        }
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={() => sendChromeMessage()}>
          Current URL: {url}
        </p>
      </header>
    </div>
  );
}

export default App;
