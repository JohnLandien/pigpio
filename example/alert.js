'use strict';

// Assumption: the LED is off when the program is started

const Gpio = require('../').Gpio;

const led = new Gpio(14, {
  mode: Gpio.INPUT,
  alert: true
});

const watchLed = () => {
  let startTick1, startTick2,diff1,diff2;

  // Use alerts to determine how long the LED was turned on
  led.on('alert', (level, tick) => {
    if (level === 1) {
      startTick1 = tick;
      diff2 = (tick >> 0) - (startTick2 >> 0); // Unsigned 32 bit arithmetic
      //console.log(diff2);
    } else {
      startTick2 = tick;
      diff1 = (tick >> 0) - (startTick1 >> 0); // Unsigned 32 bit arithmetic
      //console.log(diff1);
    }
    if (diff1 >> 0 && diff2 >> 0) { console.log( "dutycycle = ", diff1/(diff1 + diff2)) }
    
  });
};

watchLed();

// Turn the LED on for 15 microseconds once per second


