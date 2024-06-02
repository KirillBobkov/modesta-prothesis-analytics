import React from "react";
import { Observable, Subscription, interval } from "rxjs";

import { Navigation } from "./Navigation";
import TwoColumnLayout from "./TwoColumsLayout";

const App: React.FC = () => {


  return (
    <>
      <Navigation />
      <TwoColumnLayout />

    </>
  );
};
export default App;
