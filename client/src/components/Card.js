import React from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import Cookies from "js-cookie";


const Card = ({
  dateId,
  date,
  startTime,
  endTime,
  dayOfWeek,
  colorClass,
  maxWidth,
  additionalClass,
  removeDate,
  includeDelete,
}) => {
  const formattedDate = new Date(date).toLocaleDateString();
  const { user } = useContext(AuthContext);
  const userId = user?.userId;
  const token = Cookies.get("authToken");

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://sched-origin-api.onrender.com/api/availabilities/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deleteAvailableDates: [dateId],
            deleteUnavailableDates: [dateId],
          }),
        }
      );
      if (response.ok) {
        console.log("Date removed successfully");
        removeDate();
      } else {
        console.error("Failed to remove date");
      }
    } catch (error) {
      console.error("Error removing date:", error.message);
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md p-6 m-2 ${colorClass} ${additionalClass}`}
      style={{ maxWidth: maxWidth || "45%" }}
    >
      <h3 className="text-xl font-semibold mb-2">{dayOfWeek}</h3>
      <p>{formattedDate}</p>
      {startTime && endTime && (
        <>
          <p>Start Time: {startTime}</p>
          <p>End Time: {endTime}</p>
        </>
      )}
      {includeDelete && (
        <button
          onClick={() => handleDelete()}
          className="bg-red-400 text-white px-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default Card;
