// src/components/Layout/PublicLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { OrangeNavBar } from "../Core/Navbar";

export function PublicLayout() {
  const [isWakingServer, setIsWakingServer] = useState(true);
  const API_URL =
    "https://fit-plan-hub.onrender.com";

  useEffect(() => {
    const wakeServer = async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await fetch(`${API_URL}/ping`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          console.log(`✅ Ping ${i + 1} successful`);
        } catch (error) {
          console.log(
            `⚠️ Ping ${i + 1} failed (normal on cold start):`,
            error.message
          );
        }

        if (i < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5s between pings
        }
      }
      setIsWakingServer(false);
    };

    wakeServer();
  }, []);

 

  return (
    <>
      <OrangeNavBar />
      <Outlet />
    </>
  );
}
