// MakerBit touch blocks

const enum TouchSensor {
  T5 = 0b100000000000,
  T6 = 0b010000000000,
  T7 = 0b001000000000,
  T8 = 0b000100000000,
  T9 = 0b000010000000,
  T10 = 0b000001000000,
  T11 = 0b000000100000,
  T12 = 0b000000010000,
  T13 = 0b000000001000,
  T14 = 0b000000000100,
  T15 = 0b000000000010,
  T16 = 0b000000000001,
  //% block="any"
  Any = 1 << 30,
}

const enum TouchAction {
  //% block="touched"
  Touched = 0,
  //% block="released"
  Released = 1,
}

namespace makerbit {
  const MPR121_ADDRESS = 0x5A;
  const TOUCH_STATUS_PAUSE_BETWEEN_READ = 50;

  interface TouchState {
    touchStatus: number;
    eventValue: number;
    hasNewTouchedEvent: boolean;
  }

  let touchState: TouchState;

  const MICROBIT_MAKERBIT_TOUCH_SENSOR_TOUCHED_ID = 2148;
  const MICROBIT_MAKERBIT_TOUCH_SENSOR_RELEASED_ID = 2149;

  /**
   * Initialize the touch controller.
   */
  //% subcategory="Touch"
  //% blockId="makerbit_touch_init" block="initialize touch"
  //% weight=70
  function initTouchController(): void {
    if (!!touchState) {
      return;
    }

    touchState = {
      touchStatus: 0,
      eventValue: 0,
      hasNewTouchedEvent: false,
    };

    const addr = MPR121_ADDRESS;
    mpr121.reset(addr);

    // Stop capture
    mpr121.stop(addr);

    // Input filter for rising state
    mpr121.configure(addr, mpr121.Config.MHDR, 0x01);
    mpr121.configure(addr, mpr121.Config.NHDR, 0x01);
    mpr121.configure(addr, mpr121.Config.NCLR, 0x10);
    mpr121.configure(addr, mpr121.Config.FDLR, 0x20);

    // Input filter for falling state
    mpr121.configure(addr, mpr121.Config.MHDF, 0x01);
    mpr121.configure(addr, mpr121.Config.NHDF, 0x01);
    mpr121.configure(addr, mpr121.Config.NCLF, 0x10);
    mpr121.configure(addr, mpr121.Config.FDLF, 0x20);

    // Input filter for touched state
    mpr121.configure(addr, mpr121.Config.NHDT, 0x01);
    mpr121.configure(addr, mpr121.Config.NCLT, 0x10);
    mpr121.configure(addr, mpr121.Config.FDLT, 0xff);

    // Unused proximity sensor filter
    mpr121.configure(addr, mpr121.Config.MHDPROXR, 0x0f);
    mpr121.configure(addr, mpr121.Config.NHDPROXR, 0x0f);
    mpr121.configure(addr, mpr121.Config.NCLPROXR, 0x00);
    mpr121.configure(addr, mpr121.Config.FDLPROXR, 0x00);
    mpr121.configure(addr, mpr121.Config.MHDPROXF, 0x01);
    mpr121.configure(addr, mpr121.Config.NHDPROXF, 0x01);
    mpr121.configure(addr, mpr121.Config.NCLPROXF, 0xff);
    mpr121.configure(addr, mpr121.Config.FDLPROXF, 0xff);
    mpr121.configure(addr, mpr121.Config.NHDPROXT, 0x00);
    mpr121.configure(addr, mpr121.Config.NCLPROXT, 0x00);
    mpr121.configure(addr, mpr121.Config.FDLPROXT, 0x00);

    // Debounce configuration (used primarily for interrupts)
    mpr121.configure(addr, mpr121.Config.DTR, 0x11);

    // Electrode clock frequency etc
    mpr121.configure(addr, mpr121.Config.AFE1, 0xff);
    mpr121.configure(addr, mpr121.Config.AFE2, 0x30);

    // Enable autoconfiguration / calibration
    mpr121.configure(addr, mpr121.Config.AUTO_CONFIG_0, 0x00);
    mpr121.configure(addr, mpr121.Config.AUTO_CONFIG_1, 0x00);

    // Tuning parameters for the autocalibration algorithm
    mpr121.configure(addr, mpr121.Config.AUTO_CONFIG_USL, 0x00);
    mpr121.configure(addr, mpr121.Config.AUTO_CONFIG_LSL, 0x00);
    mpr121.configure(addr, mpr121.Config.AUTO_CONFIG_TL, 0x00);

    // Default sensitivity thresholds
    mpr121.configureThresholds(addr, 60, 20);

    // Restart capture and stop repeated writing
    mpr121.start(addr);

    control.inBackground(detectAndNotifyTouchEvents);
  }

  function detectAndNotifyTouchEvents() {
    let previousTouchStatus = 0;

    while (true) {
      const touchStatus = mpr121.readTouchStatus(MPR121_ADDRESS);

      if (touchStatus != touchState.touchStatus) {
        touchState.touchStatus = touchStatus;

        for (
          let touchSensorBit = 1;
          touchSensorBit <= 2048;
          touchSensorBit <<= 1
        ) {
          // Raise event when touch ends
          if ((touchSensorBit & touchStatus) === 0) {
            if (!((touchSensorBit & previousTouchStatus) === 0)) {
              control.raiseEvent(
                MICROBIT_MAKERBIT_TOUCH_SENSOR_RELEASED_ID,
                touchSensorBit
              );
              touchState.eventValue = touchSensorBit;
            }
          }

          // Raise event when touch starts
          if ((touchSensorBit & touchStatus) !== 0) {
            if (!((touchSensorBit & previousTouchStatus) !== 0)) {
              control.raiseEvent(
                MICROBIT_MAKERBIT_TOUCH_SENSOR_TOUCHED_ID,
                touchSensorBit
              );
              touchState.eventValue = touchSensorBit;
              touchState.hasNewTouchedEvent = true;
            }
          }
        }

        previousTouchStatus = touchStatus;
      }
      basic.pause(TOUCH_STATUS_PAUSE_BETWEEN_READ);
    }
  }

  /**
   * Do something when a touch sensor is touched or released.
   * @param sensor the touch sensor to be checked, eg: TouchSensor.T5
   * @param action the trigger action
   * @param handler body code to run when the event is raised
   */
  //% subcategory="Touch"
  //% blockId=makerbit_touch_on_touch_sensor
  //% block="on touch sensor | %sensor | %action"
  //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=6
  //% sensor.fieldOptions.tooltips="false"
  //% weight=65
  export function onTouch(
    sensor: TouchSensor,
    action: TouchAction,
    handler: () => void
  ) {
    initTouchController();

    control.onEvent(
      action === TouchAction.Touched
        ? MICROBIT_MAKERBIT_TOUCH_SENSOR_TOUCHED_ID
        : MICROBIT_MAKERBIT_TOUCH_SENSOR_RELEASED_ID,
      sensor === TouchSensor.Any ? EventBusValue.MICROBIT_EVT_ANY : sensor,
      () => {
        touchState.eventValue = control.eventValue();
        handler();
      }
    );
  }

  /**
   * Returns the sensor index of the last touch event that was received.
   * It could be either a sensor touched or released event.
   */
  //% subcategory="Touch"
  //% blockId=makerbit_touch_current_touch_sensor
  //% block="touch sensor"
  //% weight=50
  export function touchSensor(): number {
    initTouchController();
    if (touchState.eventValue !== 0) {
      return getSensorIndexFromSensorBitField(touchState.eventValue);
    } else {
      return 0;
    }
  }

  function getSensorIndexFromSensorBitField(touchSensorBit: TouchSensor) {
    if (touchSensorBit === TouchSensor.Any) {
      return TouchSensor.Any;
    }

    let bit = TouchSensor.T5;
    for (let sensorIndex = 5; sensorIndex <= 16; sensorIndex++) {
      if ((bit & touchSensorBit) !== 0) {
        return sensorIndex; // return first hit
      }
      bit >>= 1;
    }
    return 0;
  }

  function getTouchSensorFromIndex(index: number): TouchSensor {
    if (5 <= index && index <= 16) {
      return TouchSensor.T5 >> (index - 5);
    } else if (index === TouchSensor.Any) {
      return TouchSensor.Any;
    } else {
      return 0;
    }
  }

  /**
   * Returns true if a specific touch sensor is currently touched. False otherwise.
   * @param sensor the touch sensor to be checked, eg: TouchSensor.T5
   */
  //% subcategory="Touch"
  //% blockId=makerbit_touch_is_touch_sensor_touched
  //% block="touch sensor | %sensor | is touched"
  //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=6
  //% sensor.fieldOptions.tooltips="false"
  //% weight=40
  //% blockHidden=true
  export function isSensorTouched(sensor: TouchSensor): boolean {
    initTouchController();
    if (sensor === TouchSensor.Any) {
      return touchState.touchStatus !== 0;
    } else {
      return (touchState.touchStatus & sensor) !== 0;
    }
  }

  /**
   * Turns a TouchSensor into its index value.
   * @param sensor the touch sensor, eg: TouchSensor.T5
   */
  //% subcategory="Touch"
  //% blockId=makerbit_touch_sensor_index
  //% block="%touchSensorIndex"
  //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=6
  //% sensor.fieldOptions.tooltips="false"
  //% blockHidden=true
  export function touchSensorIndex(sensor: TouchSensor): number {
    return getSensorIndexFromSensorBitField(sensor);
  }

  /**
   * Returns true if a specific touch sensor is currently touched. False otherwise.
   * @param sensorIndex the touch sensor index to be checked
   */
  //% subcategory="Touch"
  //% blockId="makerbit_touch_is_touch_sensor_index_touched"
  //% block="touch sensor | %sensorIndex=makerbit_touch_sensor_index | is touched"
  //% weight=42
  export function isTouched(sensorIndex: number): boolean {
    return isSensorTouched(getTouchSensorFromIndex(sensorIndex));
  }

  /**
   * Returns true if any sensor was touched since the last call of this function. False otherwise.
   */
  //% subcategory="Touch"
  //% blockId=makerbit_touch_was_any_sensor_touched
  //% block="any touch sensor was touched"
  //% weight=41
  export function wasTouched(): boolean {
    initTouchController();
    if (touchState.hasNewTouchedEvent) {
      touchState.hasNewTouchedEvent = false;
      return true;
    } else {
      return false;
    }
  }

  // Communication module for MPR121 capacitive touch sensor controller
  // https://www.sparkfun.com/datasheets/Components/MPR121.pdf
  export namespace mpr121 {
    /*
    export const enum CalibrationLock {
      BaselineTrackingOn = 0b00,
      BaselineTrackingOff = 0b01,
      BaselineTrackingAndInitializeFirst5MSB = 0b10,
      BaselineTrackingAndInitialize = 0b11,
    }
    */
    const CalibrationLock_BaselineTrackingAndInitialize = 0b11;

    /*
    export const enum Proximity {
      DISABLED = 0b00,
      ELE0_TO_1 = 0b01,
      ELE_0_TO_3 = 0b10,
      ELE_0_TO_11 = 0b11,
    }
    */
    const Proximity_DISABLED = 0b00;

    /*
    export const enum Touch {
      DISABLED = 0b0000,
      ELE_0 = 0b0001,
      ELE_0_TO_1 = 0b0010,
      ELE_0_TO_2 = 0b0011,
      ELE_0_TO_3 = 0b0100,
      ELE_0_TO_4 = 0b0101,
      ELE_0_TO_5 = 0b0110,
      ELE_0_TO_6 = 0b0111,
      ELE_0_TO_7 = 0b1000,
      ELE_0_TO_8 = 0b1001,
      ELE_0_TO_9 = 0b1010,
      ELE_0_TO_10 = 0b1011,
      ELE_0_TO_11 = 0b1100,
    }
    */
    const Touch_ELE_0_TO_11 = 0b1100;

    export const enum Config {
      MHDR = 0x2b,
      NHDR = 0x2c,
      NCLR = 0x2d,
      FDLR = 0x2e,
      MHDF = 0x2f,
      NHDF = 0x30,
      NCLF = 0x31,
      FDLF = 0x32,
      NHDT = 0x33,
      NCLT = 0x34,
      FDLT = 0x35,
      MHDPROXR = 0x36,
      NHDPROXR = 0x37,
      NCLPROXR = 0x38,
      FDLPROXR = 0x39,
      MHDPROXF = 0x3a,
      NHDPROXF = 0x3b,
      NCLPROXF = 0x3c,
      FDLPROXF = 0x3d,
      NHDPROXT = 0x3e,
      NCLPROXT = 0x3f,
      FDLPROXT = 0x40,
      E0TTH = 0x41,
      E0RTH = 0x42,
      // E1TTH = 0x43,
      // E1RTH = 0x44,
      // E2TTH = 0x45,
      // E2RTH = 0x46,
      // E3TTH = 0x47,
      // E3RTH = 0x48,
      // E4TTH = 0x49,
      // E4RTH = 0x4a,
      // E5TTH = 0x4b,
      // E5RTH = 0x4c,
      // E6TTH = 0x4d,
      // E6RTH = 0x4e,
      // E7TTH = 0x4f,
      // E7RTH = 0x50,
      // E8TTH = 0x51,
      // E8RTH = 0x52,
      // E9TTH = 0x53,
      // E9RTH = 0x54,
      // E10TTH = 0x55,
      // E10RTH = 0x56,
      // E11TTH = 0x57,
      // E11RTH = 0x58,
      // E12TTH = 0x59,
      // E12RTH = 0x5a,
      DTR = 0x5b,
      AFE1 = 0x5c,
      AFE2 = 0x5d,
      ECR = 0x5e,
      // CDC0 = 0x5f,
      // CDC1 = 0x60,
      // CDC2 = 0x62,
      // CDC4 = 0x63,
      // CDC5 = 0x64,
      // CDC6 = 0x65,
      // CDC7 = 0x66,
      // CDC8 = 0x67,
      // CDC9 = 0x68,
      // CDC10 = 0x69,
      // CDC11 = 0x6a,
      // CDC12 = 0x6b,
      // CDT_0_1 = 0x6c,
      // CDT_2_3 = 0x6d,
      // CDT_4_5 = 0x6e,
      // CDT_6_7 = 0x6f,
      // CDT_8_9 = 0x70,
      // CDT_10_11 = 0x71,
      // CDT_12 = 0x72,
      // GPIO_CTL0 = 0x73,
      // GPIO_CTL1 = 0x74,
      // GPIO_DIR = 0x76,
      // GPIO_EN = 0x77,
      // GPIO_SET = 0x78,
      // GPIO_CLR = 0x79,
      // GPIO_TOG = 0x7a,
      AUTO_CONFIG_0 = 0x7b,
      AUTO_CONFIG_1 = 0x7c,
      AUTO_CONFIG_USL = 0x7d,
      AUTO_CONFIG_LSL = 0x7e,
      AUTO_CONFIG_TL = 0x7f,
    }

    function writeCommandData(
      address: number,
      command: number,
      data: number
    ): void {
      const commandDataBuffer = pins.createBuffer(
        pins.sizeOf(NumberFormat.UInt16BE)
      );
      commandDataBuffer.setNumber(
        NumberFormat.UInt16BE,
        0,
        (command << 8) | data
      );
      pins.i2cWriteBuffer(address, commandDataBuffer);
    }

    function writeCommand(address: number, command: number): void {
      const commandBuffer = pins.createBuffer(pins.sizeOf(NumberFormat.UInt8BE));
      commandBuffer.setNumber(NumberFormat.UInt8BE, 0, command);
      pins.i2cWriteBuffer(address, commandBuffer);
    }

    export function configure(
      address: number,
      register: Config,
      value: number
    ): void {
      writeCommandData(address, register, value);
    }

    export function configureThresholds(
      address: number,
      touch: number,
      release: number,
    ): void {
      for (let i = 0; i < 12; i++) {
        configure(address, Config.E0TTH + i * 2, touch);
        configure(address, Config.E0RTH + i * 2, release);
      }
    }

    export function reset(address: number): void {
      writeCommandData(address, 0x80, 0x63);
      basic.pause(30);
    }

    export function stop(address: number): void {
      writeCommandData(address, Config.ECR, 0x0);
    }

    export function start(
      address: number
    ): void {
      writeCommandData(
        address,
        Config.ECR,
        (CalibrationLock_BaselineTrackingAndInitialize << 6) | (Proximity_DISABLED << 4) | Touch_ELE_0_TO_11);
    }

    export function readTouchStatus(address: number): number {
      writeCommand(address, 0x0);
      return pins.i2cReadNumber(address, NumberFormat.UInt16LE);
    }
  }
}
