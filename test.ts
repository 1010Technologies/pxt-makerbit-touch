/**
 * Touch tests
 */

makerbit.onTouchSensorTouched(TouchSensor.T5, () => { })
makerbit.onTouchSensorReleased(TouchSensor.T16, () => { })
makerbit.onAnyTouchSensorTouched(() => { })
makerbit.onAnyTouchSensorReleased(() => { })
let touchSensor: number = makerbit.touchSensor()
let isTouched: boolean = makerbit.isTouched(TouchSensor.T5)
