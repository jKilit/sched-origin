import React, { useState, useEffect, useContext } from "react";
import MenuAppBar from "./components/Menubar";
import { AuthContext } from "./components/AuthContext";
import Calender from "./components/Calender";
import Card from "./components/Card";
import { fetchAvailability } from "./api";
import MenuBarOwner from "./components/MenuAppBar";
import Cookies from "js-cookie";

function HomePage() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const token = Cookies.get('authToken');
  const [availability, setAvailability] = useState({
    availableDates: [],
    unavailableDates: [],
  });
  const [refreshAvailability, setRefreshAvailability] = useState(false);
  const { user } = useContext(AuthContext);
  const userId = user?.userId;
  let username = user?.username;

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && userId) {
        const availabilityData = await fetchAvailability(userId);
        if (availabilityData) setAvailability(availabilityData);
      }
    };

    loadData();
  }, [isAuthenticated, refreshAvailability]);

  const refreshAvailabilityfunc = () => {
    setRefreshAvailability((prev) => !prev);
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", { weekday: "long" });
  };

  const formatTime = (timeString) => {
    if (timeString === "late" || !timeString) {
      return "Late";
    }

    const [hours, minutes] = timeString.split(":");
    if (!hours || !minutes) {
      return "Late";
    }

    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE");
  };

  const handleDeleteAvilableDates = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/availabilities/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            deleteAvailableDates: availability.availableDates.map(
              (date) => date._id
            ),
          }),
        }
      );
      if (response.ok) {
        console.log("Dates removed successfully");
        refreshAvailabilityfunc();
      } else {
        console.error("Failed to remove dates");
      }
    } catch (error) {
      console.error("Error removing dates:", error.message);
    }
  };
  const handleDeleteUnavilableDates = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/availabilities/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            deleteUnavailableDates: availability.unavailableDates.map(
              (date) => date._id
            ),
          }),
        }
      );
      if (response.ok) {
        console.log("Dates removed successfully");
        refreshAvailabilityfunc();
      } else {
        console.error("Failed to remove dates");
      }
    } catch (error) {
      console.error("Error removing dates:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      {user.role === "owner" ? (
        <MenuBarOwner inOwnerPage={false} />
      ) : (
        <MenuAppBar />
      )}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {isAuthenticated && (
          <div className="flex justify-end mb-8">
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-5 rounded-md shadow-sm"
            >
              Logout
            </button>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-8 lg:p-12">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 lg:mb-8">
            Welcome, {username}!
          </h2>
          <div className="mb-12 lg:mb-16">
            <Calender onDatesUpdated={refreshAvailabilityfunc} />
          </div>
          <div className="space-y-10 lg:space-y-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 lg:mb-6 bg-blue-100 p-3 border-l-4 border-blue-500">
                Jag är också tillgänglig:
              </h3>
              <div className="flex flex-wrap justify-center">
                {availability.availableDates &&
                  availability.availableDates.map((date) => (
                    <Card
                      dateId={date._id}
                      key={date._id}
                      date={formatDate(date.date)}
                      dayOfWeek={getDayOfWeek(date.date)}
                      colorClass="bg-green-50 border border-green-200 text-green-800 hover:bg-green-100 transition duration-200"
                      startTime={formatTime(date.startTime)}
                      endTime={formatTime(date.endTime)}
                      additionalClass="p-4 rounded-md m-2 shadow-lg hover:shadow-xl transition duration-200"
                      removeDate={refreshAvailabilityfunc}
                      includeDelete={true}
                    />
                  ))}
              </div>
              {availability.availableDates.length > 0 && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow-md transition duration-200"
                  onClick={handleDeleteAvilableDates}
                >
                  Delete all available dates
                </button>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 lg:mb-6 bg-red-100 p-3 border-l-4 border-red-500">
                Jag kan inte jobba:
              </h3>
              <div className="flex flex-wrap justify-center">
                {availability.unavailableDates &&
                  availability.unavailableDates.map((date) => (
                    <Card
                      dateId={date._id}
                      key={date._id}
                      date={formatDate(date.date)}
                      dayOfWeek={getDayOfWeek(date.date)}
                      colorClass="bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 transition duration-200"
                      startTime={formatTime(date.startTime)}
                      endTime={formatTime(date.endTime)}
                      additionalClass="p-4 rounded-md m-2 shadow-lg hover:shadow-xl transition duration-200"
                      removeDate={refreshAvailabilityfunc}
                      includeDelete={true}
                    />
                  ))}
              </div>
              {availability.unavailableDates.length > 0 && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow-md transition duration-200"
                  onClick={handleDeleteUnavilableDates}
                >
                  Delete all unavailable dates
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
