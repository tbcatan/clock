let wakeLock;
navigator.wakeLock.request("screen").then((wl) => {
  wakeLock = wl;
});
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible" && (wakeLock == null || wakeLock.released)) {
    wakeLock = await navigator.wakeLock.request("screen");
  }
});
