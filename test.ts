/**
 * Touch tests
 */

makerbit.onTouchSensorTouched(TouchSensor.T5, () => {});
makerbit.onTouchSensorReleased(TouchSensor.Any, () => {});
let touchSensor: number = makerbit.touchSensor();
let isTouched: boolean = makerbit.isTouched(TouchSensor.T5);
