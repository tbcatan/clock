let wakeLock;
const reacquireWakeLock = async () => {
  if (document.visibilityState === "visible" && (wakeLock == null || wakeLock.released)) {
    wakeLock = await navigator.wakeLock.request("screen");
  }
};
reacquireWakeLock();
document.addEventListener("visibilitychange", reacquireWakeLock);
document.addEventListener("click", reacquireWakeLock);
