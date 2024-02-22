export function timeSince(timestamp: string) {
	const diff = Date.now() - Date.parse(timestamp);

	const seconds = diff / 1000;

	let interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " day" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " hour" + (Math.floor(interval) > 1 ? "s" : "") + " ago ";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " min" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
	}
	if (Math.floor(seconds) < 2) {
		return "just now";
	}
	return Math.floor(seconds) + " sec" + (Math.floor(seconds) > 1 ? "s" : "") + " ago";
}

export function dateTimePretty(dt: string) {
	const x = new Date(dt);
	const dd = x.getDate();
	const yy = x.getFullYear();
	return (
		yy +
		"/" +
		("0" + (x.getMonth() + 1)).slice(-2) +
		"/" +
		("0" + dd).slice(-2) +
		" at " +
		("0" + (x.getHours() > 12 ? x.getHours() - 12 : x.getHours())).slice(-2) +
		":" +
		("0" + x.getMinutes()).slice(-2) +
		" " +
		(x.getHours() > 12 ? "pm" : "am")
	);
}

export function datePretty(dt: string) {
	const x = new Date(dt);
	const dd = x.getDate();
	const yy = x.getFullYear();
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	return monthNames[x.getMonth()] + " " + dd + ", " + yy;
}

export function monthYear(dt: string) {
	// 2022-11-02T23:15:14.327407Z
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const x = new Date(dt);
	// let dd = x.getDate();
	const mm = monthNames[x.getMonth()];
	const yy = x.getFullYear();
	return mm + " " + yy;
}
