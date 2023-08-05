
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

const Dc2Gf = (Dc) => {
  if (Dc <= 10) { return 100 }
  else if ((Dc > 10) && (Dc <= 84)) { 
    return Math.round((Dc-10)/0.74)
  }
  else if ((Dc > 84) && (Dc <= 91)) { 
    return 1
  }
  else if ((Dc > 91) && (Dc <= 100)) { 
    return 0
  }
  else {
    return false
  }

}


let pwmSignalValues = [];

const watchPWM = ( pwmSource, amount_iterations) => {
  let startTick1, startTick2,diff1,diff2,pwmSignal;

  pwminput.on('alert', (level, tick) => {
    if (level === 1) {
      startTick1 = tick;
      diff2 = (tick >> 0) - (startTick2 >> 0); // Unsigned 32 bit arithmetic
    } else if (level === 0){
      startTick2 = tick;
      diff1 = (tick >> 0) - (startTick1 >> 0); // Unsigned 32 bit arithmetic
    }
    if (diff1 >> 0 && diff2 >> 0) {
      if (pwmSignalValues.length < amount_iterations) {
        pwmSignalValues.push(Math.floor(100*diff1/(diff1 + diff2)));
        diff1 = diff2 = 0;
      }
      if (pwmSignalValues.length >= amount_iterations) {
        pwmSignal = 0;
        for (const obj of pwmSignalValues) {
          pwmSignal += obj;
        }
        return pwmSignalValues 
        pwminput.disableAlert();
      }
     
    }
  });
    
};

let xx = Dc2Gf(watchPWM('funky'));

