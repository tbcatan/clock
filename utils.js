const sleep = (durationMs) => new Promise((resolve) => setTimeout(resolve, durationMs));

const retry = (request, options) => {
  let { condition, wait, maxRetries } = options ?? {};

  condition = condition ?? (() => true);
  wait = wait ?? ((attempt) => 1000 * 1.5 ** attempt);
  maxRetries = maxRetries ?? 15;

  let attempt = 0;
  const retryRequest = () =>
    request().catch((e) => {
      if (attempt < maxRetries && condition(e)) {
        console.error(e);
        return sleep(wait(attempt++)).then(retryRequest);
      } else {
        return Promise.reject(e);
      }
    });
  return retryRequest();
};

const base64UrlSafeEncode = (uint8Array) => {
  const string = String.fromCharCode(...uint8Array);
  const base64 = btoa(string);
  const base64UrlSafe = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return base64UrlSafe;
};

const isBase64UrlSafe = (string) => /^[a-zA-Z0-9_\-]+$/.test(string);
