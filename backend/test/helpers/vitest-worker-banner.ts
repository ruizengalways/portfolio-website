const bannerKey = '__backendVitestWorkerBannerShown';
const bannerState = globalThis as typeof globalThis & Record<string, unknown>;

if (!bannerState[bannerKey]) {
	bannerState[bannerKey] = true;
	console.info('[vitest:config] Running backend Worker test config (vitest.worker.config.mts)');
}

export {};
