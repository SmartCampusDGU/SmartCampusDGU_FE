import { createContext, useState } from "react";
import type { ReactNode } from "react";

type ActiveNav = { group?: string; item?: string };
type Ctx = ActiveNav & { setActiveNav: (next: ActiveNav) => void };

export const ActiveNavContext = createContext<Ctx | null>(null);

export function ActiveNavProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ActiveNav>({});
  return (
    <ActiveNavContext.Provider value={{ ...state, setActiveNav: setState }}>
      {children}
    </ActiveNavContext.Provider>
  );
}