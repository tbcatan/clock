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

  const updateMessage = (key, version, data) => {
    messageStates.set(key, data);
    messageVersions.set(key, version);
    messageListeners.get(key)?.forEach((listener) => listener());
  };

  messageStream.addEventListener("message", (event) => {
    const id = JSON.parse(event.lastEventId);
    const data = JSON.parse(event.data);
    updateMessage(id.key, id.version, data);
  });

  return (key) => {
    const state = () => messageStates.get(key) ?? null;
    const version = () => messageVersions.get(key) ?? 0;

    const subscribe = (subscriber) => {
      let lastVersion = 0;
      const listener = () => {
        if (version() > lastVersion) {
          lastVersion = version();
          queueMicrotask(() => subscriber(state(), version()));
        }
      };

      if (!messageListeners.has(key)) {
        messageListeners.set(key, new Set());
      }
      messageListeners.get(key).add(listener);
      listener();

      return {
        unsubscribe: () => messageListeners.get(key).delete(listener),
      };
    };

    const send = (data) => {
      const nextVersion = version() + 1;
      return sendMessage(key, nextVersion, data).then((response) => {
        updateMessage(key, nextVersion, data);
        return response;
      });
    };

    return { key, state, version, subscribe, send };
  };
})();
