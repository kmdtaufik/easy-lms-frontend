"use client";
import axios from "axios";
export const fetchSession = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/me", {
      withCredentials: true, // important to send cookies
    });

    console.log("Session:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to get session:",
      error.response?.data || error.message || error
    );
    return null;
  }
};
