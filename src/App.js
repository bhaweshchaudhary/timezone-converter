import React, { useState } from "react";
import "./App.css";
import TimezoneSlider from "./component/TimezoneSlider";

function App() {
  const [timezones, setTimezones] = useState([
    { id: "UTC", label: "UTC" },
    { id: "IST", label: "IST" },
    // Add more initial timezones as needed
  ]);

  const addTimezone = (timezone) => {
    setTimezones([...timezones, timezone]);
  };

  const removeTimezone = (timezoneId) => {
    setTimezones(timezones.filter((tz) => tz.id !== timezoneId));
  };

  const reorderTimezones = (newOrder) => {
    setTimezones(newOrder);
  };

  return (
    <div className="App">
      <h1 className="py-4 text-3xl">Timezone Converter</h1>
      <TimezoneSlider
        timezones={timezones}
        addTimezone={addTimezone}
        removeTimezone={removeTimezone}
        reorderTimezones={reorderTimezones}
      />
    </div>
  );
}

export default App;
