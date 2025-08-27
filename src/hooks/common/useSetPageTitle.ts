import { useContext, useEffect } from "react";
import { PageTitleContext } from "@/contexts/PageTitleContext";

export const useSetPageTitle = (title: string) => {
  const context = useContext(PageTitleContext);
  if (!context) return;

  useEffect(() => {
    context.setTitle(title);
    return () => context.setTitle(""); // 언마운트 시 초기화
  }, [title]);
};