# MakerBit Touch

[![Build Status](https://travis-ci.org/1010Technologies/pxt-makerbit-touch.svg?branch=master)](https://travis-ci.org/1010Technologies/pxt-makerbit-touch)

MakeCode package for touch sensing with the capacitive touch sensor controller MPR121.

## MakerBit Board

The MakerBit connects to the BBC micro:bit to provide easy connections to a wide variety of sensors, actuators and other components. Among other things, it features a MPR121 controller.

http://makerbit.com/

| ![MakerBit](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit.png "MakerBit") | ![MakerBit+R](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit+R.png "MakerBit+R") |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                                            _MakerBit_                                            |                                   _MakerBit+R with motor controller_                                   |

# MakeCode Touch Blocks

MakerBit offers built-in support for up to 12 touch sensors via the proximity capacitive touch sensor controller MPR121.

## makerbit.onTouch

Do something when a touch sensor is touched or released.

```sig
makerbit.onTouch(TouchSensor.T5, TouchAction.Pressed, () => {})
```

### Parameters

- `sensor` - the touch sensor to be checked
- `action`- the trigger action
- `handler` - body code to run when the event is raised

## makerbit.touchSensor

Returns the sensor index of the last touch event that was received. It could be either a sensor touched or released event.

```sig
makerbit.touchSensor()
```

## makerbit.isTouched

Returns true if a specific touch sensor is currently touched. False otherwise.

```sig
makerbit.isTouched(TouchSensor.T5)
```

### Parameters

- `sensor` - the touch sensor to be checked

## makerbit.wasTouched

Returns true if any sensor was touched since the last call of this function. False otherwise.

```sig
makerbit.wasTouched()
```

## License

Licensed under the MIT License (MIT). See LICENSE file for more details.

## Supported targets

- for PXT/microbit
- for PXT/calliope
