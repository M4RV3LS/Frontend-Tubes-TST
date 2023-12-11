"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type Session = {
  id: string;
  host_name: string;
  studio_name: string;
  session_time: string;
  genre: string;
  theme: string;
  max_participants: number;
  downpayment: number;
  participants: string[];
};

const TableHistory: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.sub;
        console.log(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const username = getUsernameFromToken();
    const token = localStorage.getItem("token");

    if (username && token) {
      // Set up Axios headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      // Make Axios call using the username and headers
      axios
        .get(`http://localhost:8000/sessions/user/${username}`, config)
        .then((response) => {
          setSessions(response.data);
        })
        .catch((error) => console.error("Error fetching session data:", error));
    }
  }, []);

  return (
    <div className="overflow-x-auto relative mt-20 p-4">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className=" text-xl font-bold py-3 px-6">
              Studio Name
            </th>
            <th scope="col" className="text-xl font-bold py-3 px-6">
              Session Time
            </th>
            <th scope="col" className="text-xl font-bold py-3 px-6">
              Genre
            </th>
            <th scope="col" className="text-xl font-bold py-3 px-6">
              Theme
            </th>
            <th scope="col" className="text-xl font-bold py-3 px-6">
              Participants
            </th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr
              key={session.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="py-4 px-6">{session.studio_name}</td>
              <td className="py-4 px-6">{session.session_time}</td>
              <td className="py-4 px-6">{session.genre}</td>
              <td className="py-4 px-6">{session.theme}</td>
              <td className="py-4 px-6">{session.participants.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableHistory;
