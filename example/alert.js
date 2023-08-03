'use strict';

// Assumption: the LED is off when the program is started

const Gpio = require('../').Gpio;

const led = new Gpio(14, {
  mode: Gpio.INPUT,
  alert: true
});

const watchLed = () => {
  let startTick;

  // Use alerts to determine how long the LED was turned on
  led.on('alert', (level, tick) => {
    if (level === 1) {
      startTick1 = tick;
      const endTick2 = tick;
      const diff2 = (endTick2 >> 0) - (startTick2 >> 0); // Unsigned 32 bit arithmetic
      console.log(diff2);
    } else {
      startTick2 = tick;
      const endTick1 = tick;
      const diff1 = (endTick1 >> 0) - (startTick1 >> 0); // Unsigned 32 bit arithmetic
      console.log(diff1);
    }
  });
};

watchLed();

// Turn the LED on for 15 microseconds once per second


