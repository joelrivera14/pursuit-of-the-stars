import { setMonth } from "date-fns";
import React from "react";

const DateForm = ({ currentDate, setCurrentDate }) => {
  // const month = date.getMonth();
  // const day = date.getDay();
  // const year = date.getYear();
  const [month, setMonth] = React.useState(
    currentDate ? currentDate.getMonth() + 1 : ""
  );
  const [day, setDay] = React.useState(
    currentDate ? currentDate.getDate() : ""
  );
  const [year, setYear] = React.useState(
    currentDate ? currentDate.getFullYear() : ""
  );
  console.log(currentDate);
  const handleDateChange = (e) => {
    e.preventDefault();

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      console.error("Invalid date input");
      return;
    }

    const newDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    if (newDate.toString() === "Invalid Date") {
      console.error("Invalid date");
      return;
    }

    setCurrentDate(newDate);
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1500 && Number(value) <= 2024)) {
      setYear(value);
    }
  };
  const handleDayChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 31)) {
      setDay(value);
    }
  };
  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 12)) {
      setMonth(value);
    }
  };

  return (
    <form
      style={{ display: "flex", flexWrap: "wrap", width: "50%" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div style={{ display: "flex", flexBasis: "51%" }}>
        <div>
          <label htmlFor="month">Month:</label>
          <input
            type="number"
            id="month"
            name="month"
            min="1"
            max="12"
            placeholder="MM"
            value={month}
            style={{ appearance: "textfield !important" }}
            onChange={(e) => {
              handleMonthChange(e);
            }}
          />
        </div>
        <div>
          <label htmlFor="day">Day:</label>
          <input
            type="number"
            id="day"
            name="day"
            min="1"
            max="31"
            placeholder="DD"
            value={day}
            onChange={(e) => {
              handleDayChange(e);
            }}
          />
        </div>
        <div>
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            min="1500"
            max="2024"
            value={year}
            onChange={(e) => handleYearChange(e)}
            placeholder="YYYY"
          />
        </div>
      </div>
      <button
        style={{ flexBasis: "50%" }}
        type="submit"
        onClick={(e) => handleDateChange(e)}
      >
        Jump to Date
      </button>
    </form>
  );
};

export default DateForm;
