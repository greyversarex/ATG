import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | ATG.TJ` : "ATG.TJ - AMIR TECH GROUP";
    return () => {
      document.title = prev;
    };
  }, [title]);
}
