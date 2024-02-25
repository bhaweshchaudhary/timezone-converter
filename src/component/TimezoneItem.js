import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import moment from "moment-timezone";

const TimezoneItem = ({
  timezone,
  selectedDate,
  sliderValue,
  formattedTime,
}) => {
  const utcTime = selectedDate.clone().utc().add(sliderValue, "hours");
  const gmtTime = selectedDate.clone().tz("GMT").add(sliderValue, "hours");

  return (
    <div className="timezone-section">
      <h2>{timezone}</h2>
      <div>
        <p>UTC: {utcTime.format("YYYY-MM-DD HH:mm:ss")}</p>
        <Slider
          min={-12}
          max={12}
          value={sliderValue}
          onChange={() => {}}
          tipFormatter={(value) =>
            moment().startOf("day").add(value, "hours").format("h A")
          }
        />
      </div>
      <div>
        <p>GMT: {gmtTime.format("YYYY-MM-DD HH:mm:ss")}</p>
      </div>
      <div>
        <p>
          {timezone}: {formattedTime}
        </p>
        <Slider
          min={-12}
          max={12}
          value={sliderValue}
          onChange={() => {}}
          tipFormatter={(value) =>
            moment().startOf("day").add(value, "hours").format("h A")
          }
        />
      </div>
    </div>
  );
};

export default TimezoneItem;
