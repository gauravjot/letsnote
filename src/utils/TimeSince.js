export function timeSince(epoch) {
  var date = parseInt(String(epoch).split(".")[0]) * 1000;
  date = Date.now() - date;

  var seconds = date / 1000;

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago ";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " mins ago";
  }
  return Math.floor(seconds) + " secs ago";
}

export function dateTimePretty(dt) {
  // 2022-11-02T23:15:14.327407Z
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var x = new Date(dt);
  var dd = x.getDate();
  var mm = monthNames[x.getMonth()];
  var yy = x.getFullYear();
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

export function monthYear(dt) {
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
  var x = new Date(dt);
  var dd = x.getDate();
  var mm = monthNames[x.getMonth()];
  var yy = x.getFullYear();
  return mm + " " + yy;
}
