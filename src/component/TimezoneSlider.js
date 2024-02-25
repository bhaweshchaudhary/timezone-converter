import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import moment from "moment-timezone";
import Select from "react-select";
import "./TimezoneSlider.css";
import { Table } from "antd";

const getTimezoneListFromStorage = () => {
  const storedTimezones = localStorage.getItem("timezoneList");
  return storedTimezones ? JSON.parse(storedTimezones) : [];
};

const TimezoneTimeDisplay = ({
  label,
  selectedDate,
  sliderValue,
  handleSliderChange,
  onDelete,
  selectedTimezones, // Pass selectedTimezones as a prop
}) => {
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    const updatedDate = selectedDate.clone().set({
      hour: moment(selectedTime, "HH:mm").hours(),
      minute: moment(selectedTime, "HH:mm").minutes(),
      second: 0,
    });
    handleSliderChange(sliderValue, updatedDate);
  };

  return (
    <div className="timezone-section border border-2 px-4 py-4">
      <div className="flex flex-col items-center justify-center space-x-4">
        <div className="my-5">
          <h2 className="text-3xl">{label}</h2>
        </div>
        <div className="relative my-3 flex w-full flex-row">
          <div className="absolute left-1">
            <p className="text-xl">Date: {selectedDate.format("YYYY-MM-DD")}</p>
          </div>
          <div className="ml-auto mr-8 flex">
            <input
              type="time"
              value={selectedDate.format("HH:mm")}
              onChange={handleTimeChange}
              className="rounded border px-2 py-1 text-xl"
            />
          </div>
        </div>
      </div>
      <div className="mx-5 my-8 flex justify-center">
        <Slider
          min={-12}
          max={12}
          step={1} // Set step for granularity
          marks={{}}
          value={sliderValue}
          onChange={handleSliderChange}
          included={false}
          railStyle={{
            backgroundColor: "#a0aec0",
            height: 10,
            borderRadius: 5,
          }}
          trackStyle={{
            backgroundColor: "#4299e1",
            height: 10,
            borderRadius: 5,
          }}
          handleStyle={{
            borderColor: "#4299e1",
            height: 20,
            width: 20,
            marginLeft: -10,
            marginTop: -5,
            backgroundColor: "white",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      {onDelete && (
        <div className="flex justify-center">
          <button
            className="rounded bg-red-500 px-2 py-1 text-white"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const TimezoneTable = ({ selectedTimezones }) => {
  const columns = [
    {
      title: "UTC",
      dataIndex: "utc",
      key: "utc",
      render: (text) => <span>{text}</span>,
    },
    ...selectedTimezones.map((timezone, index) => ({
      title: timezone.timezone,
      dataIndex: `timezone${index}`,
      key: `timezone${index}`,
      render: (text) => <span>{text}</span>,
    })),
  ];

  const utcISTTable = [];

  for (let hour = 0; hour < 24; hour++) {
    const row = {
      key: hour,
      utc: moment().startOf("day").add(hour, "hours").utc().format("hh:mm A"),
    };

    selectedTimezones.forEach((timezone, index) => {
      row[`timezone${index}`] = moment()
        .startOf("day")
        .add(hour, "hours")
        .tz(timezone.timezone)
        .format("hh:mm A");
    });

    utcISTTable.push(row);
  }
  return (
    <div className="mt-8">
      <h2 className="text-2xl my-10 text-left underline">
        Time Comparison Table
      </h2>
      <Table
        dataSource={utcISTTable}
        columns={columns}
        pagination={false}
        bordered
        size="middle"
      />
    </div>
  );
};

const TimezoneSlider = () => {
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [selectedDate, setSelectedDate] = useState(moment());
  const [sliderValue, setSliderValue] = useState(0);
  const [timezoneList, setTimezoneList] = useState(getTimezoneListFromStorage);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const timezoneData = moment.tz.names().map((name) => ({
      value: name,
      label: name,
    }));
    setTimezones(timezoneData);
  }, []);

  useEffect(() => {
    // Save timezoneList to localStorage whenever it changes
    localStorage.setItem("timezoneList", JSON.stringify(timezoneList));
  }, [timezoneList]);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleTimezoneChange = () => {
    if (selectedOption) {
      // Clone the current selectedDate before modifying
      const currentTime = selectedDate.clone();

      // Set the time zone for the cloned date
      const updatedDate = currentTime.tz(selectedOption.value);

      setSelectedDate(updatedDate);
      setTimezoneList([
        ...timezoneList,
        { timezone: selectedOption.value, id: timezoneList.length },
      ]);
    }
  };

  const handleDateChange = (date) => {
    const currentTime = selectedDate.clone().set({
      date: moment(date).date(),
      month: moment(date).month(),
      year: moment(date).year(),
    });
    setSelectedDate(currentTime);
  };

  const handleSliderChange = (value, updatedDate = null) => {
    if (updatedDate) {
      setSelectedDate(updatedDate);
    } else {
      setSelectedDate(moment().add(value, "hours"));
    }
    setSliderValue(value);
  };

  const getFormattedTime = (timezone) => {
    return selectedDate.clone().tz(timezone).format("YYYY-MM-DD HH:mm:ss");
  };

  const removeTimezoneSection = (id) => {
    const updatedTimezones = timezoneList.filter(
      (timezone) => timezone.id !== id,
    );
    setTimezoneList(
      updatedTimezones.map((timezone, index) => ({
        ...timezone,
        id: index + 2,
      })),
    );
  };

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex flex-row items-center space-x-4">
        <Select
          className="flex-grow"
          placeholder="Select timezone"
          value={selectedOption}
          onChange={handleSelectChange}
          options={timezones}
        />

        <input
          type="date"
          className="rounded border border-2 px-2 py-1"
          onChange={(e) => handleDateChange(e.target.value)}
        />

        <button
          className="ml-auto rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleTimezoneChange}
        >
          Add Timezone
        </button>
      </div>

      <TimezoneTimeDisplay
        label="UTC"
        selectedDate={selectedDate.clone().utc()}
        sliderValue={sliderValue}
        handleSliderChange={handleSliderChange}
        selectedTimezones={timezoneList} // Pass selectedTimezones
      />

      <TimezoneTimeDisplay
        label="IST"
        selectedDate={selectedDate.clone().tz("Asia/Kolkata")}
        sliderValue={sliderValue}
        handleSliderChange={handleSliderChange}
        selectedTimezones={timezoneList} // Pass selectedTimezones
      />

      {timezoneList.map((timezone, index) => (
        <TimezoneTimeDisplay
          key={timezone.id}
          label={timezone.timezone}
          selectedDate={selectedDate.clone().tz(timezone.timezone)}
          sliderValue={sliderValue}
          handleSliderChange={(value, updatedDate) =>
            handleSliderChange(value, updatedDate)
          }
          onDelete={() => removeTimezoneSection(index + 2)}
          selectedTimezones={timezoneList} // Pass selectedTimezones
        />
      ))}

      <TimezoneTable selectedTimezones={timezoneList} />
    </div>
  );
};

export default TimezoneSlider;
