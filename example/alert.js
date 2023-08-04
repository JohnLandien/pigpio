
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

const pwmInput = {
  collector1: new Gpio(14, { mode: Gpio.INPUT, alert: true }),
  collector2: new Gpio(15, { mode: Gpio.INPUT, alert: true }),
  collector3: new Gpio(16, { mode: Gpio.INPUT, alert: true }),
  collector4: new Gpio(17, { mode: Gpio.INPUT, alert: true }),
  collector5: new Gpio(18, { mode: Gpio.INPUT, alert: true })
};

function DuCy2Grundfoss(pwmSignal) {

  if (pwmSignal <= 10) {

    return "pump is running on max speed"

  } else if ((pwmSignal > 10) && (pwmSignal <= 84)) {

    return "pump is running on ", Math.floor((pwmSignal - 10) / 0.74) + " % of max speed"

  } else if ((pwmSignal > 84) && (pwmSignal <= 91)) {

    return "pump is running on lowest speed"

  } else if ((pwmSignal > 91) && (pwmSignal <= 95)) {

    return "pump is switchting on / off"

  } else if ((pwmSignal > 95) && (pwmSignal <= 100)) {

    return "pump is standby and not working"

  } else {

    return "pump gives no valid pwm signal"

  }
}



const watchPWM = (pwmSource) => {

  let startTick1, startTick2, diff1, diff2, pwmSignal, pwmSignalValues
  let index = 0;

  pwmInput[pwmSource].on('alert', (level, tick) => {

    if (level === 1) {

      startTick1 = tick; // save start time of rising edge of signal
      diff2 = (tick >> 0) - (startTick2 >> 0); // calculate time between falling and rising edge of signal

    } else if (level === 0) {

      startTick2 = tick;// save start time of falling edge of signal
      diff1 = (tick >> 0) - (startTick1 >> 0); // calculate time between rising and falling edge of signal

    }
    if (diff1 >> 0 && diff2 >> 0) { // both timelengths of signal are present
      

      if (index < 5) { // store as dutycycle between 0 - 100

        pwmSignalValues.push(
          Math.floor(100 * diff1 / (diff1 + diff2))
        );
        index++;

        diff1 = diff2 = 0;

      }
      if (index >= 5) { // we have 5 values calculate average

        pwmInput[pwmSource].disableAlert();

        pwmSignal = 0;

        for (const pwmvalue of pwmSignalValues) {
          pwmSignal += pwmvalue;
        }
        index = 0;

        return Math.floor(pwmSignal / 5)

      }

    }
  });

};

console.log(DuCy2Grundfoss(watchPWM('collector1')));

