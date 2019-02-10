/**
 * Touch tests
 */

makerbit.onTouch(TouchSensor.Any, TouchAction.Pressed, () => {});
let touchSensor: number = makerbit.touchSensor();
let isTouched: boolean = makerbit.isTouched(TouchSensor.T5);
