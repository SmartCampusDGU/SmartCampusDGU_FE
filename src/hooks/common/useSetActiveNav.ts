import { useContext, useEffect } from "react";
import { ActiveNavContext } from "@/contexts/ActiveNavContext";

export function useSetActiveNav(group?: string, item?: string) {
  const ctx = useContext(ActiveNavContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.setActiveNav({ group, item });
    return () => ctx.setActiveNav({});
  }, [group, item]);
}