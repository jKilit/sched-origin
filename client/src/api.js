import Cookies from "js-cookie";
export const fetchShifts = async () => {
  try {
    const token = Cookies.get("authToken");
    const response = await fetch("https://sched-origin-api.onrender.com/api/shifts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.text();
      console.error("Failed to fetch shifts:", errorData);
      return null;
    }
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return null;
  }
};

export const fetchAvailability = async (userId) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await fetch(
      `https://sched-origin-api.onrender.com/api/availabilities/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.text();
      console.error("Failed to fetch availability:", errorData);
      return null;
    }
  } catch (error) {
    console.error("Error fetching availability:", error);
    return null;
  }
};

export const fetchUsers = async () => {
  try {
    const token = Cookies.get("authToken");
    const response = await fetch("https://sched-origin-api.onrender.com/api/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    console.log("Fetched users:", data);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
