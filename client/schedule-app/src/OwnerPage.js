import React, { useState, useEffect } from "react";
import { fetchAvailability, fetchUsers } from "./api";
import MenuBarOwner from "./components/MenuAppBar";
import Cookies from "js-cookie";

function OwnerPage() {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [numberOfDays, setNumberOfDays] = useState(60);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await fetchUsers();
        if (users) {
          const usernamesObj = {};
          users.forEach((user) => {
            usernamesObj[user._id] = user.username;
          });
          setUsernames(usernamesObj);

          const availabilityData = await Promise.all(
            users.map(async (user) => {
              const availability = await fetchAvailability(user._id);
              return { userId: user._id, availability };
            })
          );
          setAvailabilityData(availabilityData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const handleRegister = async () => {
    setRegisterMessage(""); // Clear previous message
    try {
      const response = await fetch("http://localhost:3002/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role: "employee" }),
      });

      if (response.ok) {
        setRegisterMessage("Registration successful!");
        setShowRegisterModal(false); // Close modal on success
      } else {
        const errorData = await response.json();
        setRegisterMessage(errorData.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setRegisterMessage(
        "An error occurred during registration. Please try again."
      );
    }
  };

  const getUserIdFromUsername = (username) => {
    for (let userId in usernames) {
      if (usernames[userId] === username) {
        return userId;
      }
    }
    return null;
  };

  const handleDeleteUser = async (username) => {
    const token = Cookies.get("authToken");
    setDeleteMessage(""); // Clear previous message
    const userId = getUserIdFromUsername(username);
    if (userId) {
      try {
        const response = await fetch(
          `http://localhost:3002/api/users/delete/${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,

            },
          }
        );
        if (response.ok) {
          setDeleteMessage("Delete successful!");
          setShowDeleteModal(false); // Close modal on success
        } else {
          const errorData = await response.json();
          setDeleteMessage(errorData.message || "Delete failed!");
        }
      } catch (error) {
        console.error("Error deleting:", error);
        setDeleteMessage(
          "An error occurred during deletion. Please try again."
        );
      }
    } else {
      setDeleteMessage("User not found!");
    }
  };

  useEffect(() => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    setDaysOfWeek(days);
  }, [numberOfDays]);

  const formatDateTime = (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toLocaleDateString("sv-SE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getWeekNumber = (date) => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const jan4 = new Date(target.getFullYear(), 0, 4);
    const dayDiff = (target - jan4) / 86400000;
    const weekNr = 1 + Math.ceil(dayDiff / 7);
    return weekNr;
  };

  const formatTimeRange = (startTime, endTime) => {
    return `${startTime} - ${endTime}`;
  };

  const handleNumberOfDaysChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setNumberOfDays(value);
    } else {
      console.error("Invalid input. Please enter a valid number.");
    }
  };

  const checkAvailability = (userId, date, type) => {
    const userAvailability = availabilityData.find(
      (data) => data.userId === userId
    );
    if (userAvailability && userAvailability.availability) {
      const dates = userAvailability.availability[type];
      if (dates) {
        return dates.filter(
          (availabilityDate) =>
            new Date(availabilityDate.date).toDateString() ===
            date.toDateString()
        );
      }
    }
    return [];
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <MenuBarOwner inOwnerPage={true} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Owner Page</h1>
        <div className="space-y-6">
          <label
            htmlFor="numberOfDaysInput"
            className="block mb-2 text-lg text-gray-800 font-semibold"
          >
            Number of days to view:
          </label>
          <input
            id="numberOfDaysInput"
            type="number"
            value={numberOfDays}
            placeholder="Enter number of days"
            onChange={handleNumberOfDaysChange}
            className="mb-2 p-2 border border-gray-300 rounded w-full sm:w-24"
          />

          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Date</th>
                  {Object.keys(usernames).map((userId) => (
                    <th
                      key={userId}
                      className="border border-gray-400 px-2 py-3 whitespace-nowrap overflow-hidden text-overflow-ellipsis"
                    >
                      {usernames[userId]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day, index) => {
                  const isStartOfWeek = day.getDay() === 1;
                  return (
                    <React.Fragment key={index}>
                      {isStartOfWeek && index !== 0 && (
                        <tr
                          key={`week-divider-${index}`}
                          className="bg-gray-100"
                        >
                          <td
                            colSpan={Object.keys(usernames).length + 1}
                            className="border border-gray-400 px-4 py-2"
                          >
                            <div className="text-center font-bold">
                              Week {getWeekNumber(day)}
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr key={index}>
                        <td className="border border-gray-400 px-4 py-2">
                          {formatDateTime(day)}
                        </td>
                        {Object.keys(usernames).map((userId) => (
                          <td
                            key={userId}
                            className={`border border-gray-400 px-4 py-2 ${
                              checkAvailability(userId, day, "availableDates")
                                .length
                                ? "bg-green-200 text-green-800"
                                : checkAvailability(
                                    userId,
                                    day,
                                    "unavailableDates"
                                  ).length
                                ? "bg-red-200 text-red-800"
                                : ""
                            }`}
                          >
                            {checkAvailability(
                              userId,
                              day,
                              "availableDates"
                            ).map((date, index) => (
                              <div key={index} className="text-green-600">
                                {formatTimeRange(date.startTime, date.endTime)}
                              </div>
                            ))}
                            {checkAvailability(
                              userId,
                              day,
                              "unavailableDates"
                            ).map((date, index) => (
                              <div key={index}>
                                <span className="text-red-600">
                                  {formatTimeRange(
                                    date.startTime,
                                    date.endTime
                                  )}
                                </span>
                              </div>
                            ))}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded shadow-md w-64">
            <h2 className="text-xl font-bold mb-3 text-gray-700">Register</h2>
            {registerMessage && (
              <p className="text-red-500 mb-2">{registerMessage}</p>
            )}
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-2 p-1 border border-gray-300 rounded w-full text-sm"
              placeholder="Username"
              autoComplete="username"
            />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2 p-1 border border-gray-300 rounded w-full text-sm"
              placeholder="Password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => {
                handleRegister();
              }}
              className="w-full bg-green-500 text-white mt-1 text-sm px-2 py-1 rounded hover:bg-green-700"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="w-full bg-red-500 text-white mt-1 text-sm px-2 py-1 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded shadow-md w-64">
            <h2 className="text-xl font-bold mb-3 text-gray-700">
              Delete User
            </h2>
            {deleteMessage && (
              <p className="text-red-500 mb-2">{deleteMessage}</p>
            )}
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-2 p-1 border border-gray-300 rounded w-full text-sm"
              placeholder="Username"
              autoComplete="new-username"
            />
            <button
              type="button"
              onClick={() => {
                handleDeleteUser(username);
              }}
              className="w-full bg-red-500 text-white mt-1 text-sm px-2 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="w-full bg-gray-500 text-white mt-1 text-sm px-2 py-1 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="ml-[210px] mb-5 space-x-4">
        <button
          onClick={() => setShowRegisterModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register a worker
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Delete a worker
        </button>
      </div>
    </div>
  );
}

export default OwnerPage;
