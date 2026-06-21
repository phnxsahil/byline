import React from "react";
import { DashboardLayout } from "./dashboard/DashboardLayout";

export function DashboardSection() {
  return <DashboardLayout onLandingClick={() => window.location.hash = ""} />;
}
