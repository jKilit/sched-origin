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
      className={`rounded-lg shadow-md p-4 sm:p-6 m-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${colorClass} ${additionalClass}`}
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
        {dayOfWeek}
      </h3>
      <p className="text-sm sm:text-base">{formattedDate}</p>
      {startTime && endTime && (
        <>
          <p className="text-sm sm:text-base">Start Time: {startTime}</p>
          <p className="text-sm sm:text-base">End Time: {endTime}</p>
        </>
      )}
      {includeDelete && (
        <button
          onClick={() => handleDelete()}
          className="mt-2 bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600 text-sm sm:text-base"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default Card;
