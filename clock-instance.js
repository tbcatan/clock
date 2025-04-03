let clock = null;

const getClock = (instance) => message(`clock.instance.${instance}`);

const updateClockInstance = (instance) => {
  clock = instance ? getClock(instance) : null;

  const url = new URL(window.location);
  if (instance) {
    url.searchParams.set("instance", instance);
  } else {
    url.searchParams.delete("instance");
  }
  window.history.replaceState(null, "", url);
};

const generateClockInstance = () => base64UrlSafeEncode(crypto.getRandomValues(new Uint8Array(8)));

const latestClockInstance = message("clock.current");

if (true) {
  let queryInstance = new URLSearchParams(window.location.search).get("instance");
  queryInstance = isBase64UrlSafe(queryInstance) ? queryInstance : null;
  updateClockInstance(queryInstance);
}
