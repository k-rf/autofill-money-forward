import { useEffect, useState } from "react";

import { Layout } from "./components/layout";
import { Button } from "./components/ui/button";

export const App = () => {
  const [port, setPort] = useState<chrome.runtime.Port>();

  const handleClick = async () => {
    // TODO: テストデータ
    port?.postMessage([
      { date: "2024/09/01", amount: 1000, memo: "Hello Chrome Extension" },
      { date: "2024/09/01", amount: 1000, memo: "Hello Chrome Extension" },
    ]);
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
      if (tab?.id === undefined) return;

      const port = chrome.tabs.connect(tab.id);
      setPort(port);

      port.onMessage.addListener((message) => {
        console.log(message);
      });
    });

    return () => {
      port?.disconnect();
    };
  }, [port]);

  return (
    <Layout>
      <Button onClick={() => void handleClick()}>Autofill</Button>
      <div className="m-4" />
    </Layout>
  );
};
