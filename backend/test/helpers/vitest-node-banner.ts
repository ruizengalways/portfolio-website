const bannerKey = '__backendVitestNodeBannerShown';
const bannerState = globalThis as typeof globalThis & Record<string, unknown>;

if (!bannerState[bannerKey]) {
	bannerState[bannerKey] = true;
	console.info('[vitest:config] Running backend Node test config (vitest.config.mts)');
}

export {};
