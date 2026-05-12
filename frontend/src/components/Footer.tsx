import { Heart } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  checkHealth,
  getVisitorStats,
  type VisitorStats,
} from "../services/api";

interface HealthStatus {
  status: "ok" | "error";
  timestamp: string;
}

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const lastHealthCheckRef = useRef<number>(0);
  const HEALTH_CACHE_TTL = 60_000; // 60 seconds

  // Health check without state dependencies
  const fetchHealth = useCallback(async () => {
    try {
      const health = await checkHealth();
      setHealthStatus({ status: "ok", timestamp: health.timestamp });
      lastHealthCheckRef.current = Date.now();
    } catch (error) {
      console.error("Health check failed:", error);
      setHealthStatus({ status: "error", timestamp: new Date().toISOString() });
    }
  }, []);

  // Health check with caching: Only fetch once per 60 seconds
  const fetchHealthWithCache = useCallback(async () => {
    const now = Date.now();

    if (
      lastHealthCheckRef.current &&
      now - lastHealthCheckRef.current < HEALTH_CACHE_TTL
    ) {
      return; // Use cached result
    }

    await fetchHealth();
  }, [fetchHealth]);

  // Fetch visitor stats on mount
  const fetchVisitorStats = useCallback(async () => {
    try {
      const stats = await getVisitorStats();
      setVisitorStats(stats);
    } catch (error) {
      console.error("Failed to fetch visitor stats:", error);
    }
  }, []);

  useEffect(() => {
    // Use IIFE to properly handle async operations in effect
    (async () => {
      // Fetch health and stats on mount
      await fetchHealthWithCache();
      await fetchVisitorStats();
    })();

    // Refresh health every 5 minutes
    const healthInterval = setInterval(() => {
      fetchHealthWithCache();
    }, 5 * 60_000);

    return () => clearInterval(healthInterval);
  }, [fetchHealthWithCache, fetchVisitorStats]);

  return (
    <footer className="py-8 border-t border-border/40 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          {/* Copyright & Attribution */}
          <p>
            © {currentYear}{" "}
            <span className="text-foreground font-medium">Rui Zeng</span>. All
            rights reserved.
          </p>

          {/* Designer Credit & Stats */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex items-center gap-1">
              <span>Designed & Engineered with</span>
              <Heart size={14} className="text-primary fill-primary/20" />
              <span>by</span>
              <a
                href="#hero"
                className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 transition-all"
              >
                Rui Zeng
              </a>
            </div>

            {/* Visitor Stats Badge */}
            {visitorStats && (
              <div className="flex items-center gap-1 text-xs bg-primary/10 px-2 py-1 rounded">
                <span className="text-primary font-semibold">
                  {visitorStats.totalVisits.toLocaleString()}
                </span>
                <span>visits</span>
              </div>
            )}
          </div>

          {/* Health Status & License */}
          <div className="flex items-center gap-4">
            {/* Health Status Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  healthStatus?.status === "ok"
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500"
                }`}
                title={healthStatus?.timestamp || "Checking..."}
              />
              <span className="text-foreground font-medium">
                {healthStatus?.status === "ok" ? "Live" : "Offline"}
              </span>
            </div>

            <a
              href="/LICENSE"
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              License
            </a>
            <span className="text-border">|</span>
            <span className="italic opacity-70 select-none">
              AI & Data Specialist
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
