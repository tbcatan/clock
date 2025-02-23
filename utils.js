const sleep = (durationMs) => new Promise((resolve) => setTimeout(resolve, durationMs));

const retry = (request, options) => {
  let { condition, wait, maxRetries } = options ?? {};

  condition = condition ?? (() => true);
  wait = wait ?? ((attempt) => 1000 * 1.5 ** attempt);
  maxRetries = maxRetries ?? 15;

  let attempt = 0;
  const retryRequest = () =>
    request().catch((e) =>
      attempt < maxRetries && condition(e) ? sleep(wait(attempt++)).then(retryRequest) : Promise.reject(e)
    );
  return retryRequest();
};
