// src/components/Layout/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { OrangeNavBar } from "../Core/Navbar";

export function PublicLayout() {
  return (
    <>
      <OrangeNavBar />
      <Outlet />
    </>
  );
}
