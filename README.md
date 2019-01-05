# MakerBit Touch

[![Build Status](https://travis-ci.org/1010Technologies/pxt-makerbit-touch.svg?branch=master)](https://travis-ci.org/1010Technologies/pxt-makerbit-touch)

MakeCode package for touch sensing with the capacitive touch sensor controller MPR121.

## MakerBit Board
The MakerBit connects to the BBC micro:bit to provide easy connections to a wide variety of sensors, actuators and other components. Among other things, it features a MPR121 controller.

http://makerbit.com/

| ![MakerBit](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit.png "MakerBit") | ![MakerBit+R](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit+R.png "MakerBit+R")  |
|:--:|:--:|
| *MakerBit* | *MakerBit+R with motor controller* |

## Touch Blocks
MakerBit offers built-in support for up to 12 touch sensors via the proximity capacitive touch sensor controller MPR121.

### MakerBit onTouchDetected
Do something when a specific sensor is touched. This touch event is notified once at the beginning of a touch operation.
```sig
makerbit.onTouchSensorTouched(TouchSensor.T5, () => {})
```

### MakerBit onTouchSensorReleased
Do something when a specific sensor is released. A touch release event is notified once at the end of a touch operation.
```sig
makerbit.onTouchSensorReleased(TouchSensor.T5, () => {})
```

### MakerBit onAnyTouchSensorTouched
Do something when the beginning of a touch event is detected.
```sig
makerbit.onAnyTouchSensorTouched(() => {})
```

### MakerBit onAnyTouchSensorReleased
o something when the end of a touch operation is detected.
```sig
makerbit.onAnyTouchSensorReleased(() => {})
```

### MakerBit touchSensor
Returns the sensor index of the last touch event that was received. It could be either a sensor touched or released event. This block is intended to be used inside of touch event handlers.
```sig
makerbit.touchSensor()
```

### MakerBit isTouched
Returns true if a specific touch sensor is currently touched. False otherwise.
```sig
makerbit.isTouched(TouchSensor.T1)
```

## License

Licensed under the MIT License (MIT). See LICENSE file for more details.

## Supported targets

* for PXT/microbit
* for PXT/calliope
