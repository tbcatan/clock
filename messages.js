const messageServer = "https://messages-lwz6.onrender.com";

const messageStream = new EventSource(`${messageServer}/messages`);

const sendMessage = (key, version, message) =>
  fetch(`${messageServer}/message/${key}/${version}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  }).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw response;
    }
  });

const message = (() => {
  const messageStates = new Map();
  const messageVersions = new Map();
  const messageListeners = new Map();

  messageStream.addEventListener("message", (event) => {
    const id = JSON.parse(event.lastEventId);
    const data = JSON.parse(event.data);
    messageStates.set(id.key, data);
    messageVersions.set(id.key, id.version);
    messageListeners.get(id.key)?.forEach((listener) => listener());
  });

  return (key) => {
    const state = () => messageStates.get(key);
    const version = () => messageVersions.get(key);

    const subscribe = (subscriber) => {
      const listener = () => {
        try {
          subscriber(state(), version());
        } catch (e) {
          console.error(e);
        }
      };

      if (!messageListeners.has(key)) {
        messageListeners.set(key, new Set());
      }
      messageListeners.get(key).add(listener);

      if (messageStates.has(key)) {
        listener();
      }

      return {
        unsubscribe: () => messageListeners.get(key).delete(listener),
      };
    };

    const send = (data) => sendMessage(key, (version() ?? 0) + 1, data);

    return { key, state, version, subscribe, send };
  };
})();
