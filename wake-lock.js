let wakeLock;
if (document.visibilityState === "visible") {
  navigator.wakeLock.request("screen").then((screenWakeLock) => {
    wakeLock = screenWakeLock;
  });
}
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible" && (wakeLock == null || wakeLock.released)) {
    wakeLock = await navigator.wakeLock.request("screen");
  }
});
document.addEventListener("click", async () => {
  if (document.visibilityState === "visible" && (wakeLock == null || wakeLock.released)) {
    wakeLock = await navigator.wakeLock.request("screen");
  }
});
