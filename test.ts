/**
 * Touch tests
 */

makerbit.onTouch(TouchSensor.Any, TouchAction.Touched, () => {});
const touchSensor: number = makerbit.touchSensor();
const isTouched: boolean = makerbit.isTouched(5);
const wasTouched: boolean = makerbit.wasTouched();
const index: number = makerbit.touchSensorIndex(TouchSensor.T5);
