import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRecordVisit } from "./useRecordVisit";
import { recordVisit } from "../services/api";

// Mock the API
vi.mock("../services/api", () => ({
  recordVisit: vi.fn(),
}));

describe("useRecordVisit hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call recordVisit on mount", async () => {
    vi.mocked(recordVisit).mockResolvedValue({
      totalVisits: 0,
      totalMessages: 0,
      lastUpdated: "",
    });

    renderHook(() => useRecordVisit());

    await waitFor(() => {
      expect(recordVisit).toHaveBeenCalledTimes(1);
    });
  });

  it("should handle API errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    vi.mocked(recordVisit).mockRejectedValue(new Error("API error"));

    renderHook(() => useRecordVisit());

    await waitFor(() => {
      expect(recordVisit).toHaveBeenCalledTimes(1);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Visit logging (non-critical):",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("should not call recordVisit multiple times on re-renders", () => {
    vi.mocked(recordVisit).mockResolvedValue({
      totalVisits: 0,
      totalMessages: 0,
      lastUpdated: "",
    });

    const { rerender } = renderHook(() => useRecordVisit());

    rerender();

    expect(recordVisit).toHaveBeenCalledTimes(1);
  });
});
