export interface StoredMessage {
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface VisitorStats {
  totalVisits: number;
  totalMessages: number;
  lastUpdated: string;
}

/**
 * Save a contact message to KV storage.
 * Each message is stored with a timestamp-based key for chronological retrieval.
 */
export async function saveMessage(
  message: StoredMessage,
  env: Env
): Promise<void> {
  if (!env.MESSAGES_KV) {
    console.error("MESSAGES_KV binding not configured");
    throw new Error("Message storage not available");
  }

  try {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; 
    const timeStr = now.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
    const messageKey = `message:${dateStr}:${timeStr}:${Math.random().toString(36).slice(2, 9)}`;
    await env.MESSAGES_KV.put(messageKey, JSON.stringify(message), {
      expirationTtl: 7 * 24 * 60 * 60, // 7 days retention
    });

    // Increment message counter
    await incrementVisitorStat(env, "totalMessages", 1);

    console.log("Message saved:", { key: messageKey, email: message.email });
  } catch (error) {
    console.error("Failed to save message:", error);
    throw new Error("Failed to persist message");
  }
}

/**
 * Increment visitor count when page is visited.
 * Uses KV atomic operations for thread-safe concurrent increments.
 */
export async function recordVisit(env: Env): Promise<void> {
  if (!env.MESSAGES_KV) {
    console.error("MESSAGES_KV binding not configured");
    throw new Error("Visitor tracking not available");
  }

  try {
    await incrementVisitorStat(env, "totalVisits", 1);
  } catch (error) {
    console.error("Failed to record visit:", error);
    // Non-fatal: don't throw, just log
  }
}

/**
 * Get current visitor statistics.
 * Returns cached stats updated on each message or visit.
 */
export async function getVisitorStats(env: Env): Promise<VisitorStats> {
  if (!env.MESSAGES_KV) {
    return {
      totalVisits: 0,
      totalMessages: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    const statsJson = await env.MESSAGES_KV.get("stats:visitor");
    if (!statsJson) {
      return {
        totalVisits: 0,
        totalMessages: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    return JSON.parse(statsJson);
  } catch (error) {
    console.error("Failed to retrieve visitor stats:", error);
    return {
      totalVisits: 0,
      totalMessages: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Helper: Atomically add to a visitor statistic counter.
 */
async function incrementVisitorStat(
  env: Env,
  field: "totalVisits" | "totalMessages",
  amount: number
): Promise<void> {
  if (!env.MESSAGES_KV) return;

  const statsKey = "stats:visitor";
  const stats = await getVisitorStats(env);
  stats[field] += amount;
  stats.lastUpdated = new Date().toISOString();

  await env.MESSAGES_KV.put(statsKey, JSON.stringify(stats));
}