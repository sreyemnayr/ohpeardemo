'use client'
import { FamilyProvider } from '@/context'
import Chat from "@/components/Chat";

export default function ChatPage() {
  return (
    <FamilyProvider>
      <Chat />
    </FamilyProvider>
  );
}
