//% deprecated
namespace makerbit {

}

namespace modules {
    /**
     * MakerBit touch pad 5 client
     */
    //% fixedInstance whenUsed block="makerbit touch5"
    export const makerbitTouch5 = new ButtonClient("makerbit touch5?dev=self&srvo=0&name=T5")
    /**
     * MakerBit touch pad 6 client
     */
    //% fixedInstance whenUsed block="makerbit touch6"
    export const makerbitTouch6 = new ButtonClient("makerbit touch6?dev=self&srvo=1&name=T6")
    /**
     * MakerBit touch pad 7 client
     */
    //% fixedInstance whenUsed block="makerbit touch7"
    export const makerbitTouch7 = new ButtonClient("makerbit touch7?dev=self&srvo=2&name=T7")
    /**
     * MakerBit touch pad 8 client
     */
    //% fixedInstance whenUsed block="makerbit touch8"
    export const makerbitTouch8 = new ButtonClient("makerbit touch8?dev=self&srvo=3&name=T8")
    /**
     * MakerBit touch pad 9 client
     */
    //% fixedInstance whenUsed block="makerbit touch9"
    export const makerbitTouch9 = new ButtonClient("makerbit touch9?dev=self&srvo=4&name=T9")
    /**
     * MakerBit touch pad 10 client
     */
    //% fixedInstance whenUsed block="makerbit touch10"
    export const makerbitTouch10 = new ButtonClient("makerbit touch10?dev=self&srvo=5&name=T10")
    /**
     * MakerBit touch pad 11 client
     */
    //% fixedInstance whenUsed block="makerbit touch11"
    export const makerbitTouch11 = new ButtonClient("makerbit touch11?dev=self&srvo=6&name=T11")
    /**
     * MakerBit touch pad 12 client
     */
    //% fixedInstance whenUsed block="makerbit touch12"
    export const makerbitTouch12 = new ButtonClient("makerbit touch12?dev=self&srvo=7&name=T12")
    /**
     * MakerBit touch pad 13 client
     */
    //% fixedInstance whenUsed block="makerbit touch13"
    export const makerbitTouch13 = new ButtonClient("makerbit touch13?dev=self&srvo=8&name=T13")
    /**
     * MakerBit touch pad 14 client
     */
    //% fixedInstance whenUsed block="makerbit touch14"
    export const makerbitTouch14 = new ButtonClient("makerbit touch14?dev=self&srvo=9&name=T14")
    /**
     * MakerBit touch pad 15 client
     */
    //% fixedInstance whenUsed block="makerbit touch15"
    export const makerbitTouch15 = new ButtonClient("makerbit touch15?dev=self&srvo=10&name=T15")
    /**
     * MakerBit touch pad 16 client
     */
    //% fixedInstance whenUsed block="makerbit touch16"
    export const makerbitTouch16 = new ButtonClient("makerbit touch16?dev=self&srvo=11&name=T16")
}

namespace servers {
    class TouchButtonServer extends jacdac.SimpleSensorServer {
        sensor: TouchSensor
        downTime: number

        constructor(sensorName: string, sensor: TouchSensor) {
            super(jacdac.SRV_BUTTON,
                jacdac.ButtonRegPack.Pressure,
                () => this.pressure(),
                {
                    instanceName: sensorName
                })
            this.sensor = sensor
            this.downTime = -1

            makerbit.onTouch(
                this.sensor,
                TouchAction.Touched,
                () => {
                    this.downTime = control.millis()
                    this.sendEvent(jacdac.ButtonEvent.Down)
                }
            )
            makerbit.onTouch(this.sensor, TouchAction.Released,
                () => {
                    const now = control.millis()
                    const duration = now - this.downTime
                    this.downTime = -1
                    this.sendEvent(jacdac.ButtonEvent.Up,
                        jacdac.jdpack(jacdac.ButtonEventPack.Up, [duration]))
                })
        }

        pressure() {
            return makerbit.isSensorTouched(this.sensor) ? 1 : 0
        }
    }

    function start() {
        jacdac.productIdentifier = 0x36ca9905
        jacdac.deviceDescription = "MakerBit Touch"
        jacdac.startSelfServers(() => [
            new TouchButtonServer("T5", TouchSensor.T5),
            new TouchButtonServer("T6", TouchSensor.T6),
            new TouchButtonServer("T7", TouchSensor.T7),
            new TouchButtonServer("T8", TouchSensor.T8),
            new TouchButtonServer("T9", TouchSensor.T9),
            new TouchButtonServer("T10", TouchSensor.T10),
            new TouchButtonServer("T11", TouchSensor.T11),
            new TouchButtonServer("T12", TouchSensor.T12),
            new TouchButtonServer("T13", TouchSensor.T13),
            new TouchButtonServer("T14", TouchSensor.T14),
            new TouchButtonServer("T15", TouchSensor.T15),
            new TouchButtonServer("T16", TouchSensor.T16),
        ])
    }
    start()
}