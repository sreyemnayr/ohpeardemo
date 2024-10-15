'use client'

import Dashboard from "@/components/Dashboard";
import { FamilyProvider } from "@/context";

export default function Home() {
  return (
    <FamilyProvider>
      <Dashboard />
    </FamilyProvider>
  );
}
