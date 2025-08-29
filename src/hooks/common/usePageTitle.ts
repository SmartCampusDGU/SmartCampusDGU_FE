import { useContext } from "react";
import { PageTitleContext } from "@/contexts/PageTitleContext";

export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (!context) throw new Error("PageTitleContext를 Layout 외부에서 사용했습니다.");
  return context.title;
};