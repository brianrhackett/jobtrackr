const getCookie = (name) => {
	const match = document.cookie.match(
		new RegExp("(^|;\\s*)" + name + "=([^;]*)")
	);
	return match ? match[2] : null;
};

export async function csrf() {
	await fetch("/sanctum/csrf-cookie", { credentials: "include" });
}

export async function api(url, options = {}) {
	const xsrf = getCookie("XSRF-TOKEN");

	const res = await fetch(url, {
		...options,
		credentials: "include",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"X-Requested-With": "XMLHttpRequest",
			...(xsrf ? { "X-XSRF-TOKEN": decodeURIComponent(xsrf) } : {}),
			...(options.headers || {}),
	},
});

if (!res.ok) {
	let errBody;
	try {
		errBody = await res.json();
	} catch {
		errBody = { message: await res.text() };
	}
		throw errBody;
	}

	if (res.status === 204) return null;
	return res.json();
}
