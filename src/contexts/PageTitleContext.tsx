import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface PageTitleContextProps {
  title: string;
  setTitle: (title: string) => void;
}

export const PageTitleContext = createContext<PageTitleContextProps | null>(null);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("");

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}