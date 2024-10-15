'use client'

import Dashboard from "@/components/Dashboard";
import { FamilyProvider } from "@/context";
export default function DashboardPage() {
  return (
    <FamilyProvider>
      <Dashboard />
    </FamilyProvider>
  );
}