/**
 * Touch tests
 */

makerbit.onTouch(TouchSensor.Any, TouchAction.Touched, () => {});
let touchSensor: number = makerbit.touchSensor();
let isTouched: boolean = makerbit.isTouched(5);
const index: number = makerbit.touchSensorIndex(TouchSensor.T5);
