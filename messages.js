const messageServer = "https://messages-lwz6.onrender.com";

const messageStream = new EventSource(`${messageServer}/messages`);

const getMessageSnapshots = () =>
  fetch(`${messageServer}/messages/snapshot`).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  });

const sendMessage = (key, version, message) =>
  fetch(`${messageServer}/message/${key}/${version}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  }).then((response) => {
    if (response.ok) {
      return response;
    } else {
      return Promise.reject(response);
    }
  });

const message = (() => {
  const messageStates = new Map();
  const messageVersions = new Map();
  const messageListeners = new Map();

  const updateMessage = (key, version, data) => {
    const currentVersion = messageVersions.get(key);
    if (currentVersion == undefined || version > currentVersion) {
      messageStates.set(key, data);
      messageVersions.set(key, version);
      messageListeners.get(key)?.forEach((listener) => listener());
    }
  };

  messageStream.addEventListener("message", (event) => {
    const id = JSON.parse(event.lastEventId);
    const data = JSON.parse(event.data);
    updateMessage(id.key, id.version, data);
  });

  const initSnapshots = getMessageSnapshots().then((snapshots) =>
    snapshots?.forEach((snapshot) => updateMessage(snapshot.id.key, snapshot.id.version, snapshot.data))
  );

  return (key) => {
    const state = () => messageStates.get(key);
    const version = () => messageVersions.get(key);

    const subscribe = (subscriber) => {
      const listener = () => {
        queueMicrotask(() => subscriber(state(), version()));
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

    const publish = async (data) => {
      const nextVersion = version() + 1;
      const response = await sendMessage(key, nextVersion, data);
      updateMessage(key, nextVersion, data);
      return response;
    };

    const init = async () => {
      await initSnapshots;
    };

    return { key, state, version, subscribe, publish, init };
  };
})();
