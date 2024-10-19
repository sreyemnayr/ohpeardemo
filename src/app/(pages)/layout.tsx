import { FamilyProvider } from "@/context";

export default function ContextLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <FamilyProvider>
        {children}
      </FamilyProvider>
        
    );
  }