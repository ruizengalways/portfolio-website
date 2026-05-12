import { useEffect } from "react";
import { recordVisit } from "../services/api";

/**
 * Hook to record a page visit when component mounts.
 * Non-blocking: errors are logged but don't affect the page.
 */
export const useRecordVisit = () => {
  useEffect(() => {
    const logVisit = async () => {
      try {
        await recordVisit();
      } catch (error) {
        console.debug("Visit logging (non-critical):", error);
      }
    };

    logVisit();
  }, []);
};
