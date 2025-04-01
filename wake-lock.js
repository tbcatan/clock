let wakeLock;
const acquireWakeLock = async () => {
  if (document.visibilityState === "visible" && (wakeLock == null || wakeLock.released)) {
    wakeLock = await navigator.wakeLock.request("screen");
  }
};
acquireWakeLock();
document.addEventListener("visibilitychange", acquireWakeLock);
document.addEventListener("click", acquireWakeLock);
