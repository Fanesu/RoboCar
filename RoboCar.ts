//% color="#0c6333" weight=20 icon="\uf135"
namespace RoboCar {
    const PCA9685_ADD = 0x40
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04

    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09

    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD

    const PRESCALE = 0xFE
    let initialized = false
    let yahStrip: neopixel.Strip;

    export enum enMusic {

        dadadum = 0,
        entertainer,
        prelude,
        ode,
        nyan,
        ringtone,
        funk,
        blues,

        birthday,
        wedding,
        funereal,
        punchline,
        baddy,
        chase,
        ba_ding,
        wawawawaa,
        jump_up,
        jump_down,
        power_up,
        power_down
    }

    export enum enServo {
        S1 = 2,
        S2 = 3,
        S3 = 4,
        S4 = 5,
    }
    
    export enum enMotors {
        M1 = 8,
        M2 = 1,
        M3 = 9,
        M4 = 0
    }

    export enum enMovement{
        forward = 0, 
        backward = 1,
        leftSide = 2,
        rightSide =3
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADD, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }
    function stopMotor(index: enMotors) {
        setPwm(index, 0, 0);
    }

    function forward(RoboCarSpeed : number){
        setPwm(enMotors.M1, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P13, 1)
        pins.digitalWritePin(DigitalPin.P14, 0)
        setPwm(enMotors.M2, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P16, 0)
        setPwm(enMotors.M3, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P9, 1)
        pins.digitalWritePin(DigitalPin.P10, 0)
        setPwm(enMotors.M4, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P11, 1)
        pins.digitalWritePin(DigitalPin.P12, 0)
    }
    function backward(RoboCarSpeed: number) {
        setPwm(enMotors.M1, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 1)
        setPwm(enMotors.M2, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 1)
        setPwm(enMotors.M3, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P9, 0)
        pins.digitalWritePin(DigitalPin.P10, 1)
        setPwm(enMotors.M4, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P11, 0)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }
    function rightSide(RoboCarSpeed: number) {
        setPwm(enMotors.M1, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P13, 1)
        pins.digitalWritePin(DigitalPin.P14, 0)
        setPwm(enMotors.M2, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 1)
        setPwm(enMotors.M3, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P9, 0)
        pins.digitalWritePin(DigitalPin.P10, 1)
        setPwm(enMotors.M4, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P11, 1)
        pins.digitalWritePin(DigitalPin.P12, 0)
    }
    function leftSide(RoboCarSpeed: number) {
        setPwm(enMotors.M1, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 1)
        setPwm(enMotors.M2, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P16, 0)
        setPwm(enMotors.M3, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P9, 1)
        pins.digitalWritePin(DigitalPin.P10, 0)
        setPwm(enMotors.M4, 0, RoboCarSpeed)
        pins.digitalWritePin(DigitalPin.P11, 0)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
    * *****************************************************************
     * @param index
     */
    //% blockId=RoboCar_RGB_Program block="RGB_Program"
    //% weight=99
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Program(): neopixel.Strip {

        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P2, 4, NeoPixelMode.RGB);
        }
        return yahStrip;
    }

    //% blockId=SuperBit_Music block="Music|%index"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Music(index: enMusic): void {
        switch (index) {
            case enMusic.dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case enMusic.birthday: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case enMusic.entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case enMusic.prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case enMusic.ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case enMusic.nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case enMusic.ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case enMusic.funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case enMusic.blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case enMusic.wedding: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case enMusic.funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case enMusic.punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case enMusic.baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case enMusic.chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case enMusic.ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case enMusic.wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case enMusic.jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case enMusic.jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case enMusic.power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case enMusic.power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }

    //% blockId=RoboCar_Servo block="Servo(180°)|%num|degree %value"
    //% weight=97
    //% blockGap=10
    //% num.min=1 num.max=4 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo(num: enServo, value: number): void {
        // 50hz: 20,000 us
        let us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);
    }

    //% blockId=RoboCar_Servo2 block="Servo(270°)|%num|degree %value"
    //% weight=96
    //% blockGap=10
    //% num.min=1 num.max=4 value.min=0 value.max=270
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo2(num: enServo, value: number): void {
        // 50hz: 20,000 us
        let newvalue = Math.map(value, 0, 270, 0, 180);
        let us = (newvalue * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);
    }

    //% blockId=RoboCar_MotorRun block="Motor|%index|speed %speed"
    //% weight=93
    //% speed.min=-255 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function MotorRun(index: enMotors, speed: number): void {
        if (!initialized) {
            initPCA9685()
        }
        setFreq(1000)
        led.enable(false)
        speed = speed * 16; // map 255 to 4096
        if (speed >= 4000) {
            speed = 4000
        }
        if (speed <= -4000) {
            speed = -4000
        }
        if (index == 0) {
            if (speed > 0) {
                setPwm(index, 0, speed)
                pins.digitalWritePin(DigitalPin.P13, 1)
                pins.digitalWritePin(DigitalPin.P14, 0)
            } else if (speed < 0) {
                setPwm(index, 0, -speed)
                pins.digitalWritePin(DigitalPin.P13, 0)
                pins.digitalWritePin(DigitalPin.P14, 1)
            } else {
                setPwm(index, 0, speed)
                pins.digitalWritePin(DigitalPin.P13, 0)
                pins.digitalWritePin(DigitalPin.P14, 0)
            }
        }

        if (index == 1) {
            if (speed > 0) {
                setPwm(index, 0, speed)
                pins.digitalWritePin(DigitalPin.P15, 1)
                pins.digitalWritePin(DigitalPin.P16, 0)
            } else if (speed < 0) {
                setPwm(index, 0, -speed)
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 1)
            } else {
                setPwm(index, 0, speed)
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 0)
            }
        }

        if (index == 8) {
            if (speed > 0) {
                setPwm(index, 0, speed)
                pins.digitalWritePin(DigitalPin.P9, 0)
                pins.digitalWritePin(DigitalPin.P10, 1)
            } else if (speed < 0) {
                setPwm(index, 0, -speed)
                pins.digitalWritePin(DigitalPin.P9, 1)
                pins.digitalWritePin(DigitalPin.P10, 0)
            } else {
                setPwm(index, 0, speed)
                pins.digitalWritePin(DigitalPin.P9, 0)
                pins.digitalWritePin(DigitalPin.P10, 0)
            }
        }

        if (index == 9) {
            if (speed > 0) {
                setPwm(index, 0, speed)
                pins.digitalWritePin(DigitalPin.P11, 0)
                pins.digitalWritePin(DigitalPin.P12, 1)
            } else if (speed < 0) {
                setPwm(index, 0, -speed)
                pins.digitalWritePin(DigitalPin.P11, 1)
                pins.digitalWritePin(DigitalPin.P12, 0)
            } else {
                setPwm(index, 0, speed)
                pins.digitalWritePin(DigitalPin.P11, 0)
                pins.digitalWritePin(DigitalPin.P12, 0)
            }
        }
    }

    //% blockId=RoboCar_MotorStopAll block="Motor Stop All"
    //% weight=91
    //% blockGap=50
    export function MotorStopAll(): void {
        if (!initialized) {
            initPCA9685()
        }
        stopMotor(enMotors.M1);
        stopMotor(enMotors.M2);
        stopMotor(enMotors.M3);
        stopMotor(enMotors.M4);

    }

    //% blockId=RoboCar_Movement block="RoboCar|%index|speed %speed"
    //% weight=93
    //% speed.min=0 speed.max=255
    // % name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RoboCar_Movement(index : enMovement, speed : number): void{
        if (!initialized) {
            initPCA9685()
        }
        led.enable(false)
        setFreq(1000)
        speed = speed * 16; // map 255 to 4096
        if (speed >= 4000) {
            speed = 4000
            
        }
        if (index == 0){
            forward(speed)
        } else if (index == 1){
            backward(speed)
        } else if (index == 2) {
            leftSide(speed)
        } else if (index == 3) {
            rightSide(speed)
        }
    }

    //% blockId=RoboCar_AllMotorRun block="AllMotor|Motor1 speed %speed1|Motor2 speed %speed2|Motor3 speed %speed3|Motor4 speed %speed4"
    //% weight=92
    //% blockGap=50
    //% speed1.min=-255 speed1.max=255
    //% speed2.min=-255 speed2.max=255
    //% speed3.min=-255 speed3.max=255
    //% speed4.min=-255 speed4.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function AllMotorRun(speed1: number, speed2: number, speed3: number, speed4: number): void {
        MotorRun(enMotors.M1, speed1);
        MotorRun(enMotors.M2, speed2);
        MotorRun(enMotors.M3, speed3);
        MotorRun(enMotors.M4, speed4);
    }
}