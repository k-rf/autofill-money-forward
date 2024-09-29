import { useState } from "react";

import { Layout } from "./components/layout";
import { Button } from "./components/ui/button";

export const App = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((current) => current + 1);
  };

  return (
    <Layout>
      <Button onClick={handleClick}>Hello Chrome Extension</Button>
      <div className="m-4" />
      <div>Click count: {count}</div>
    </Layout>
  );
};
