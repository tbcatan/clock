const clock = message("clock");

let connected = false;

sleep(250).then(() => {
  if (!connected) {
    document.querySelector("#content").classList.add("hidden");
    document.querySelector("#connecting").classList.remove("hidden");
  }
});

clock.init().then(() => {
  connected = true;
  document.querySelector("#connecting").classList.add("hidden");
  document.querySelector("#content").classList.remove("hidden");

  renderLoop(clock.state, clock.publish);
  if (!clock.state()) {
    openEditMenu((createClockMenu) => {
      createClockMenu
        .querySelector("#create-clock-controls")
        .removeChild(createClockMenu.querySelector("#cancel-create-clock"));
    });
    const subscription = clock.subscribe((clockState) => {
      if (clockState?.clocks.length > 0) {
        stopEditing();
        subscription.unsubscribe();
      }
    });
  }
});
