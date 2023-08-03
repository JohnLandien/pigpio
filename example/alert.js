
'use strict';

/*Read Incoming PWM signal from Grundfoss UPM 3 pump 
  Signal is from an optocoupler limitted to 36V with a zenerdiode and a 470 Ohm resistor is between collector and output signal.

  PWM 
         =< 10% pump is running om maximum speed
  > 10 / =< 84 % Variable speed from maximum speed to minimum speed
  > 84 / =< 91 % Minimum speed
  > 91 / =< 95 % Hysteresis area on/off
  > 95 / =< 100 % Standby mode => off
  

*/

const Gpio = require('../').Gpio;

const pwminput = new Gpio(14, {
  mode: Gpio.INPUT,
  alert: true
});

let pwmSignalValues = [];

const watchPWM = ( pwmSource) => {
  let startTick1, startTick2,diff1,diff2,pwmSignal;

  // Use alerts to determine how long the LED was turned on
  pwminput.on('alert', (level, tick) => {
    if (level === 1) {
      startTick1 = tick;
      diff2 = (tick >> 0) - (startTick2 >> 0); // Unsigned 32 bit arithmetic
      //console.log(diff2);
    } else {
      startTick2 = tick;
      diff1 = (tick >> 0) - (startTick1 >> 0); // Unsigned 32 bit arithmetic
      //console.log(diff1);
    }
    if (diff1 >> 0 && diff2 >> 0) {
      if (pwmSignalValues.length < 5) {
        pwmSignalValues.push(Math.floor(100*diff1/(diff1 + diff2)));
      }
      if (pwmSignalValues.length >= 5) {
        pwmSignal = 0;
        for (const obj of pwmSignalValues) {
          pwmSignal += obj;
        }
        pwmSignal = Math.floor(pwmSignal/5);
      }
      if ( pwmSignal <= 10 ) { console.log("pump is running on max speed")}
      else if ( (pwmSignal > 10) && (pwmSignal <= 84) ) { console.log("pump is running on " ,  Math.floor((pwmSignal-10)/0.74) + " % of max speed")}
      else if ( (pwmSignal > 84) && (pwmSignal <= 91) ) { console.log("pump is running on lowest speed")}
      else if ( (pwmSignal > 91) && (pwmSignal <= 95) ) { console.log("pump is switchting on / off")}
      else if ( (pwmSignal > 95) && (pwmSignal <= 100) ) { console.log("pump is standby and not working")}
      else { console.log("pump has no pwm signal")}
      pwminput.disableAlert();
    }
  });
    
};

watchPWM('funky');

