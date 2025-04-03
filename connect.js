let connected = false;

sleep(250).then(() => {
  if (!connected) {
    document.querySelector("#content").classList.add("hidden");
    document.querySelector("#connecting").classList.remove("hidden");
  }
});

initMessages().then(() => {
  connected = true;
  document.querySelector("#connecting").classList.add("hidden");
  document.querySelector("#content").classList.remove("hidden");

  if (!clock?.state()) {
    updateClockInstance(
      latestClockInstance.state()?.created < 8 * 60 * 60 * 1000 ? latestClockInstance.state()?.key : null
    );
  }

  renderLoop(
    () => clock?.state() ?? null,
    () => clock?.version() ?? 0,
    (data, version) => clock?.publish(data, version)
  );

  if (!clock?.state()) {
    let clockSubscription;
    const instanceSubscription = latestClockInstance.subscribe((instance) => {
      clockSubscription?.unsubscribe();
      if (!instance?.key) {
        return;
      }
      clockSubscription = getClock(instance.key).subscribe((clockState) => {
        if (clockState?.clocks.length > 0) {
          updateClockInstance(instance.key);
          closeEditMenu();
          clockSubscription.unsubscribe();
          instanceSubscription.unsubscribe();
        }
      });
    });

    openEditMenu((createClockMenu) => {
      const cancel = createClockMenu.querySelector("#cancel-create-clock");
      const submit = createClockMenu.querySelector("#submit-create-clock");
      cancel.parentElement.removeChild(cancel);
      submit.removeAttribute("onclick");
      submit.addEventListener("click", () =>
        createNewClock().then(() => {
          clockSubscription?.unsubscribe();
          instanceSubscription.unsubscribe();
        })
      );
    });
  }
});
