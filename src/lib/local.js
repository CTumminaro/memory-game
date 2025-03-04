import ls from 'localstorage-slim';

const DEFAULT_TTL = null;

export async function persistValue(key, value, ttl = DEFAULT_TTL) {
	try {
		if (value === null) {
			let result = await clearValue(key);
			return result;
		} else {
			const result = await ls.set(key, value, { ttl });
			return result;
		}
	} catch (ex) {
		return false;
	}
}

export function retrieveValue(key) {
	try {
		const value = ls.get(key);
		return value || null;
	} catch (ex) {
		return null;
	}
}

export async function clearValue(key) {
	try {
		const result = await ls.remove(key);
		return result;
	} catch (ex) {
		return false;
	}
}

export async function clearCache() {
	await ls.flush(true);
	return ls.clear();
}
