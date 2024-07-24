import React, { useState, useContext } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AuthContext } from "./AuthContext";
import Cookies from "js-cookie";

function Calender({ onDatesUpdated }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);
  const [shiftType, setShiftType] = useState("");
  const [customShift, setCustomShift] = useState({ start: "", end: "" });
  const { user } = useContext(AuthContext);
  const userId = user?.userId;
  const token = Cookies.get('authToken');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleShiftTypeChange = (event) => {
    setShiftType(event.target.value);
  };

  const handleCustomShiftChange = (event) => {
    const { name, value } = event.target;
    setCustomShift((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const confirmDate = async (isAvailable) => {
    if (!selectedDate || !userId || !shiftType) return;
    let startTime, endTime;

    switch (shiftType) {
      case "lunch":
        startTime = "11:00";
        endTime = "15:00";
        break;
      case "night":
        startTime = "17:00";
        endTime = "late";
        break;
        case "Whole day":
          startTime = "11:00";
          endTime = "late";
          break;
      case "custom":
        startTime = customShift.start;
        endTime = customShift.end;
        break;
      default:
        return;
    }

    try {
      const localDate = new Date(selectedDate);
      localDate.setMinutes(
        localDate.getMinutes() - localDate.getTimezoneOffset()
      );
      const localISOString = localDate.toISOString();

      const shiftData = {
        date: localISOString,
        startTime,
        endTime,
      };

      const bodyData = {
        userId: userId,
      };

      if (isAvailable) {
        bodyData.availableDates = [shiftData];
        bodyData.unavailableDates = [];
      } else {
        bodyData.unavailableDates = [shiftData];
        bodyData.availableDates = [];

      }

      const response = await fetch("https://sched-origin-api.onrender.com/api/availabilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        onDatesUpdated();
      } else {
        console.error("Failed to set availability");
      }
    } catch (error) {
      console.error("Error setting availability:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          onChange={handleDateChange}
          className="bg-blue-100 mb-4"
        />
        <div className="flex flex-col items-center mb-4">
          <select
            value={shiftType}
            onChange={handleShiftTypeChange}
            className="mb-2 p-2 border border-gray-300 rounded w-full m-2"
          >
            <option value="">Select Shift Type</option>
            <option value="Whole day">Hela dagen (11:00 - sent)</option>
            <option value="lunch">Lunch (11:00 - 15:00)</option>
            <option value="night">Night (17:00 - sent)</option>
            <option value="custom">Custom</option>
          </select>
          {shiftType === "custom" && (
            <div className="mb-2 flex space-x-2 w-full">
              <input
                type="time"
                name="start"
                value={customShift.start}
                onChange={handleCustomShiftChange}
                className="p-2 border border-gray-300 rounded flex-1"
              />
              <input
                type="time"
                name="end"
                value={customShift.end}
                onChange={handleCustomShiftChange}
                className="p-2 border border-gray-300 rounded flex-1"
              />
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => confirmDate(true)}
          >
            Confirm Available
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => confirmDate(false)}
          >
            Confirm Unavailable
          </button>
        </div>
      </LocalizationProvider>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}

export default Calender;
