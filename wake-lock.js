let wakeLock;
const reacquireWakeLock = async () => {
  if (document.visibilityState === "visible" && (wakeLock == null || wakeLock.released)) {
    wakeLock = await navigator.wakeLock?.request("screen");
  }
};

let isScreenLocked = false;
const updateScreenLockIcon = () => {
  const isScreenLockedNow = wakeLock != null && !wakeLock.released;
  if (isScreenLockedNow === isScreenLocked) {
    return;
  }
  if (isScreenLockedNow) {
    element("screen-unlocked").classList.add("hidden");
    element("screen-locked").classList.remove("hidden");
  } else {
    element("screen-locked").classList.add("hidden");
    element("screen-unlocked").classList.remove("hidden");
  }
  isScreenLocked = isScreenLockedNow;
};

const checkWakeLock = () => reacquireWakeLock().finally(updateScreenLockIcon);

checkWakeLock();
document.addEventListener("visibilitychange", checkWakeLock);
document.addEventListener("click", checkWakeLock);
