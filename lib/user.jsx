"use client";
import axios from "axios";
export const fetchSession = async () => {
  try {
    const response = await axios.get(
      "https://easy-lms-backend.onrender.com/api/me",
      {
        withCredentials: true, // important to send cookies
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Failed to get session:",
      error.response?.data || error.message || error,
    );
    return null;
  }
};

export async function isAdmin() {
  const session = await fetchSession();
  return session?.user?.role === "admin" && session ? true : false;
}
