require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { connectDB, disconnectDB } = require('../config/db');

const RAW_DATA = {
  "Resistors": [
    "Resistors – 102, 222, 472, 1000",
    "2200 resistor",
    "3300 resistor",
    "4702 resistor",
    "1ΚΩ resistor",
    "2.2ΚΩ resistor",
    "4.7ΚΩ resistor",
    "10ΚΩ resistor",
    "22ΚΩ resistor",
    "47ΚΩ resistor",
    "100ΚΩ resistor",
    "1ΜΩ resistor",
    "Carbon-film resistor",
    "Metal-film resistor",
    "Wire-wound resistor",
    "Power resistor",
    "SMD resistors",
    "Resistor networks",
    "Potentiometer",
    "Preset/trimmer potentiometer",
    "Rheostat",
    "LDR",
    "Thermistor - NTC",
    "Thermistor - PTC"
  ],
  "Capacitors": [
    "Ceramic capacitor",
    "Electrolytic capacitor",
    "Tantalum capacitor",
    "Film capacitor",
    "Polyester capacitor",
    "Mylar capacitor",
    "Mica capacitor",
    "SMD capacitor",
    "Variable capacitor",
    "Super capacitor",
    "1µF capacitor",
    "10µF capacitor",
    "22µF capacitor",
    "47µF capacitor",
    "100µF capacitor",
    "220µF capacitor",
    "470µF capacitor",
    "1000µF capacitor",
    "2200µF capacitor"
  ],
  "Inductors & Magnetic Components": [
    "Inductor",
    "SMD inductor",
    "Ferrite-core inductor",
    "Toroidal inductor",
    "Choke coil",
    "Ferrite bead",
    "Transformer",
    "Current transformer",
    "Flyback transformer"
  ],
  "Diodes": [
    "General-purpose diode",
    "1N4001",
    "1N4004",
    "1N4007",
    "1N4148",
    "Zener diode",
    "Schottky diode",
    "TVS diode",
    "Bridge rectifier",
    "Fast-recovery diode",
    "Photodiode",
    "IR diode",
    "Laser diode",
    "Varactor diode",
    "Tunnel diode",
    "PIN diode"
  ],
  "LEDs & Indicators": [
    "Red LED",
    "Green LED",
    "Blue LED",
    "Yellow LED",
    "White LED",
    "Orange LED",
    "RGB LED",
    "SMD LED",
    "High-power LED",
    "LED strip",
    "LED indicator module",
    "7-segment display",
    "4-digit 7-segment display",
    "LED matrix",
    "Dot-matrix display"
  ],
  "Transistors": [
    "BC547",
    "BC548",
    "BC557",
    "BC558",
    "2N2222",
    "2N3904",
    "2N3906",
    "TIP31",
    "TIP32",
    "TIP41",
    "TIP42",
    "Power transistor",
    "MOSFET",
    "IRFZ44N",
    "IRF540",
    "IRF9540",
    "Logic-level MOSFET",
    "JFET",
    "IGBT",
    "Darlington transistor",
    "Phototransistor"
  ],
  "Thyristors": [
    "SCR",
    "TRIAC",
    "DIAC",
    "UJT",
    "Optocoupler"
  ],
  "ICS": [
    "555 Timer IC",
    "741 Op-Amp",
    "LM358",
    "LM324",
    "LM393",
    "LM317",
    "7805",
    "7809",
    "7812",
    "7905",
    "7912",
    "ULN2003",
    "ULN2803",
    "L293D",
    "L298N",
    "CD4017",
    "CD4026",
    "74HC595",
    "74HC00",
    "74HC04",
    "74HC08",
    "74HC32",
    "74HC86",
    "EEPROM IC",
    "ADC IC",
    "DAC IC",
    "RTC IC",
    "Memory IC",
    "Audio amplifier IC",
    "Voltage regulator IC",
    "Battery charger IC"
  ],
  "Power Supply Components": [
    "AA battery",
    "AAA battery",
    "9V battery",
    "12V battery",
    "Li-ion battery",
    "18650 battery",
    "Li-Po battery",
    "Lead-acid battery",
    "Battery holder",
    "18650 battery holder",
    "Battery connector",
    "Battery charging module",
    "TP4056 charging module",
    "BMS",
    "1S BMS",
    "2S BMS",
    "3S BMS",
    "Fuse",
    "Fuse holder",
    "Resettable fuse",
    "Power switch",
    "Toggle switch",
    "Rocker switch",
    "Slide switch",
    "Push-button switch",
    "Emergency stop switch",
    "DC-DC converter",
    "Buck converter",
    "Boost converter",
    "Buck-boost converter",
    "AC-DC adapter",
    "SMPS",
    "5V power supply",
    "12V power supply",
    "USB power module",
    "Solar panel",
    "Solar charge controller",
    "Power bank module"
  ],
  "Microcontrollers & Development Boards": [
    "Arduino Uno",
    "Arduino Nano",
    "Arduino Mega",
    "Arduino Micro",
    "Arduino Pro Mini",
    "Arduino Leonardo",
    "ESP8266",
    "NodeMCU",
    "ESP32",
    "ESP32-CAM",
    "STM32 development board",
    "STM32 Blue Pill",
    "Raspberry Pi Pico",
    "Raspberry Pi Zero",
    "Raspberry Pi 3",
    "Raspberry Pi 4",
    "Raspberry Pi 5",
    "PIC microcontroller",
    "8051 microcontroller",
    "ATmega328P",
    "Teensy",
    "BeagleBone",
    "FPGA development board"
  ],
  "Sensors - Temperature": [
    "LM35 temperature sensor",
    "DHT11",
    "DHT22",
    "DS18B20",
    "Thermistor",
    "MAX6675 thermocouple module",
    "MAX31855 thermocouple module"
  ],
  "Sensors - Humidity": [
    "DHT11",
    "DHT22",
    "SHT30",
    "SHT31"
  ],
  "Sensors - Pressure": [
    "BMP180",
    "BMP280",
    "BME280",
    "Barometric pressure sensor"
  ],
  "Sensors - Gas": [
    "MQ-2",
    "MQ-3",
    "MQ-4",
    "MQ-5",
    "MQ-6",
    "MQ-7",
    "MQ-9",
    "MQ-135",
    "LPG sensor",
    "CO sensor",
    "Smoke sensor"
  ],
  "Sensors - Light": [
    "LDR",
    "Photodiode",
    "Phototransistor",
    "BH1750",
    "TSL2561",
    "Ambient light sensor"
  ],
  "Sensors - Motion": [
    "PIR sensor",
    "MPU6050",
    "MPU9250",
    "Accelerometer",
    "Gyroscope",
    "6-axis IMU",
    "9-axis IMU"
  ],
  "Sensors - Distance": [
    "HC-SR04 ultrasonic sensor",
    "JSN-SR04T waterproof ultrasonic sensor",
    "IR proximity sensor",
    "ToF distance sensor",
    "VL53LOX",
    "VL53L1X"
  ],
  "Sensors - Other": [
    "Flame sensor",
    "Sound sensor",
    "Vibration sensor",
    "Tilt sensor",
    "Touch sensor",
    "Capacitive touch sensor",
    "Soil-moisture sensor",
    "Rain sensor",
    "Water-level sensor",
    "Flow sensor",
    "Current sensor",
    "Voltage sensor",
    "Hall-effect sensor",
    "Magnetic sensor",
    "Flex sensor",
    "Force sensor",
    "Load cell",
    "HX711 load-cell amplifier",
    "Color sensor",
    "TCS3200",
    "TCS34725",
    "Fingerprint sensor",
    "Heart-rate sensor",
    "Pulse sensor",
    "MAX30100",
    "MAX30102",
    "Air-quality sensor",
    "UV sensor"
  ],
  "Communication Modules": [
    "HC-05 Bluetooth",
    "HC-06 Bluetooth",
    "HM-10 Bluetooth BLE",
    "ESP8266 Wi-Fi",
    "ESP32 Wi-Fi/Bluetooth",
    "NRF24L01",
    "433-MHz RF transmitter",
    "433-MHz RF receiver",
    "315-MHz RF module",
    "LoRa module",
    "LoRa SX1278",
    "Zigbee module",
    "GSM module",
    "SIM800L",
    "SIM900",
    "4G LTE module",
    "GPS module",
    "NEO-6M GPS",
    "RFID module",
    "RC522 RFID",
    "NFC module",
    "CAN module",
    "RS485 module",
    "Ethernet module"
  ],
  "Displays": [
    "16x2 LCD",
    "20x4 LCD",
    "I2C LCD",
    "0.96-inch OLED",
    "1.3-inch OLED",
    "1.54-inch OLED",
    "TFT display",
    "2.4-inch TFT",
    "2.8-inch TFT",
    "3.5-inch TFT",
    "7-segment display",
    "8x8 LED matrix",
    "OLED display",
    "E-paper display",
    "Touchscreen display"
  ],
  "Sound Components": [
    "Buzzer",
    "Active buzzer",
    "Passive buzzer",
    "Piezo buzzer",
    "Speaker",
    "Microphone",
    "Electret microphone",
    "Microphone module",
    "Audio amplifier module",
    "PAM8403",
    "MAX98357A"
  ],
  "Motors & Actuators": [
    "DC motor",
    "Gear motor",
    "BO motor",
    "N20 gear motor",
    "High-torque DC motor",
    "Servo motor",
    "SG90 servo",
    "MG90S servo",
    "MG995 servo",
    "MG996R servo",
    "Stepper motor",
    "NEMA 17 stepper motor",
    "NEMA 23 stepper motor",
    "Stepper motor driver",
    "A4988 driver",
    "DRV8825 driver",
    "ТВ6600 driver",
    "Motor driver module",
    "L298N motor driver",
    "L293D motor driver",
    "BTS7960 motor driver",
    "TB6612FNG driver",
    "Vibration motor",
    "Solenoid",
    "Linear actuator",
    "Electromagnetic actuator"
  ],
  "Robotics Components": [
    "Robot chassis",
    "2-wheel chassis",
    "4-wheel chassis",
    "Robot wheels",
    "Caster wheel",
    "Rubber wheels",
    "Motor brackets",
    "Servo brackets",
    "Robotic arm",
    "Gripper",
    "Robotic claw",
    "Line-following sensor array",
    "Obstacle-avoidance module",
    "Encoder",
    "Wheel encoder",
    "Encoder disc",
    "Robot battery pack",
    "Robot switch",
    "Robot chassis screws",
    "Motor couplers"
  ],
  "Breadboard & Prototyping": [
    "Full-size breadboard",
    "Half-size breadboard",
    "Mini breadboard",
    "Solderless breadboard",
    "Perfboard",
    "Vero board",
    "Prototype PCB",
    "Universal PCB",
    "Dot PCB",
    "Jumper wires",
    "Male-to-male jumper",
    "Male-to-female jumper",
    "Female-to-female jumper",
    "Dupont connectors",
    "Pin headers",
    "Female headers",
    "Screw terminals",
    "Terminal blocks",
    "JST connectors",
    "DC barrel connector",
    "USB connector",
    "Micro-USB connector",
    "USB-C connector"
  ],
  "Switches & Relays": [
    "Push button",
    "Tactile switch",
    "Toggle switch",
    "Rocker switch",
    "Slide switch",
    "Rotary switch",
    "DIP switch",
    "Limit switch",
    "Reed switch",
    "Relay",
    "5V relay",
    "12V relay",
    "24V relay",
    "Single-channel relay module",
    "2-channel relay module",
    "4-channel relay module",
    "8-channel relay module",
    "Solid-state relay"
  ],
  "Identification & Security": [
    "RFID card",
    "RFID key tag",
    "RC522 RFID reader",
    "NFC reader",
    "Fingerprint module",
    "Keypad",
    "4x4 matrix keypad",
    "4x3 keypad",
    "RFID antenna",
    "Biometric module"
  ],
  "Timing & Clock": [
    "RTC module",
    "DS1307",
    "DS3231",
    "Crystal oscillator",
    "32.768-kHz crystal",
    "Ceramic resonator",
    "Clock module"
  ],
  "Logic & Interface Modules": [
    "Logic-level converter",
    "5V-to-3.3V converter",
    "I2C multiplexer",
    "I/O expander",
    "MCP23017",
    "PCF8574",
    "ADC module",
    "DAC module",
    "PWM module",
    "Relay interface module",
    "MOSFET driver module",
    "Optocoupler module"
  ],
  "Protection Components": [
    "Fuse",
    "Resettable fuse",
    "TVS diode",
    "Zener diode",
    "MOV",
    "ESD protection diode",
    "Reverse-polarity protection",
    "Over-current protection",
    "Over-voltage protection",
    "Thermal fuse",
    "Heat sink",
    "Thermal pad",
    "Cooling fan"
  ],
  "Connectors & Mechanical Parts": [
    "DC jack",
    "AC plug",
    "Terminal block",
    "JST connector",
    "Molex connector",
    "Dupont connector",
    "Header pins",
    "PCB screw terminal",
    "Alligator clips",
    "Crocodile clips",
    "Wires",
    "Jumper wires",
    "Ribbon cable",
    "Heat-shrink tubing",
    "Cable ties",
    "Screws",
    "Nuts",
    "Bolts",
    "Spacers",
    "Standoffs",
    "Project enclosure",
    "Plastic box",
    "Acrylic sheet"
  ],
  "Tools for B.Tech Projects": [
    "Digital multimeter",
    "Analog multimeter",
    "Soldering iron",
    "Soldering station",
    "Solder wire",
    "Flux",
    "Desoldering pump",
    "Solder wick",
    "Hot-glue gun",
    "Hot glue sticks",
    "Wire stripper",
    "Wire cutter",
    "Nose plier",
    "Screwdriver set",
    "Tweezers",
    "PCB holder",
    "Bench power supply",
    "Oscilloscope",
    "Function generator",
    "Logic analyzer",
    "LCR meter",
    "Crimping tool"
  ],
  "IoT / Smart Project Components": [
    "Wi-Fi module",
    "Bluetooth module",
    "GSM module",
    "GPS module",
    "LoRa module",
    "MQTT-compatible controller",
    "ESP8266",
    "ESP32",
    "ESP32-CAM",
    "Raspberry Pi",
    "Cloud/loT gateway",
    "SD-card module",
    "MicroSD card",
    "Ethernet module",
    "Camera module",
    "OLED display",
    "Relay module",
    "Smart energy meter module"
  ],
  "Camera & Vision": [
    "OV7670 camera",
    "OV2640 camera",
    "ESP32-CAM",
    "Raspberry Pi camera",
    "USB webcam",
    "IR camera module",
    "Camera lens",
    "IR LED array"
  ],
  "Industrial / Advanced B.Tech Components": [
    "PLC",
    "HMI",
    "VFD",
    "Industrial relay",
    "Contactor",
    "Current transformer",
    "Proximity switch",
    "Inductive proximity sensor",
    "Capacitive proximity sensor",
    "Photoelectric sensor",
    "Industrial temperature sensor",
    "RTD",
    "PT100",
    "Thermocouple",
    "Pressure transmitter",
    "Flow sensor",
    "Level sensor",
    "Solenoid valve",
    "Pneumatic solenoid",
    "Industrial encoder"
  ],
  "Common B.Tech Project Modules": [
    "Automatic street-light module",
    "Line-following module",
    "Obstacle-avoidance module",
    "Bluetooth control module",
    "Wi-Fi control module",
    "RFID access-control module",
    "Fingerprint door-lock module",
    "GSM alert module",
    "GPS tracking module",
    "Weather-monitoring module",
    "Home-automation module",
    "Smart irrigation module",
    "Water-level controller",
    "Gas-leak detector",
    "Fire-alarm module",
    "Smart energy-meter module",
    "Solar monitoring module",
    "Battery monitoring module",
    "IoT monitoring module",
    "Motor-control module"
  ]
};

// Helper to create URL-friendly slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Category metadata: icons and image palettes
const CATEGORY_META = {
  "Resistors": { icon: "Zap", desc: "Fixed, variable, SMD, power and precision resistor networks." },
  "Capacitors": { icon: "Zap", desc: "Ceramic, electrolytic, tantalum, polyester, and super capacitors." },
  "Inductors & Magnetic Components": { icon: "Zap", desc: "Coils, chokes, ferrite beads, toroidal inductors, and transformers." },
  "Diodes": { icon: "Zap", desc: "Rectifiers, Zeners, Schottkys, TVS, and optoelectronic diodes." },
  "LEDs & Indicators": { icon: "Tv", desc: "Discrete LEDs, RGB, matrix displays, and 7-segment modules." },
  "Transistors": { icon: "Cpu", desc: "NPN/PNP BJTs, power MOSFETs, JFETs, and Darlington pairs." },
  "Thyristors": { icon: "Zap", desc: "SCRs, TRIACs, DIACs, and optocouplers for AC power switching." },
  "ICS": { icon: "Cpu", desc: "Timers, op-amps, motor drivers, shift registers, and regulator ICs." },
  "Power Supply Components": { icon: "BatteryCharging", desc: "Batteries, holders, TP4056 chargers, BMS boards, converters, and SMPS." },
  "Microcontrollers & Development Boards": { icon: "Cpu", desc: "Arduino, ESP32, STM32, Raspberry Pi, and embedded hardware platforms." },
  "Sensors - Temperature": { icon: "Activity", desc: "LM35, DS18B20, DHT series, and thermocouple temperature sensing." },
  "Sensors - Humidity": { icon: "Activity", desc: "Relative humidity and ambient environmental monitoring sensors." },
  "Sensors - Pressure": { icon: "Activity", desc: "Barometric and atmospheric pressure sensing modules." },
  "Sensors - Gas": { icon: "Activity", desc: "MQ series air quality, gas leakage, smoke, and LPG detection." },
  "Sensors - Light": { icon: "Activity", desc: "LDRs, photodiodes, ambient light sensors, and optical detectors." },
  "Sensors - Motion": { icon: "Activity", desc: "PIR motion sensors, accelerometers, gyroscopes, and 6/9-axis IMUs." },
  "Sensors - Distance": { icon: "Activity", desc: "Ultrasonic HC-SR04, ToF laser, and infrared distance transducers." },
  "Sensors - Other": { icon: "Activity", desc: "Touch, flame, soil, water level, load cells, biometric, and pulse sensors." },
  "Communication Modules": { icon: "Cpu", desc: "Bluetooth, Wi-Fi, LoRa, RF, GSM/4G, GPS, CAN, and RS485 transceivers." },
  "Displays": { icon: "Tv", desc: "Alphanumeric LCDs, graphic OLEDs, TFT screens, and e-paper modules." },
  "Sound Components": { icon: "Activity", desc: "Buzzers, speakers, electret mics, and audio amplifier modules." },
  "Motors & Actuators": { icon: "Wrench", desc: "DC gear motors, servos, steppers, solenoids, and motor drivers." },
  "Robotics Components": { icon: "Wrench", desc: "Chassis kits, robot wheels, encoders, arms, grippers, and brackets." },
  "Breadboard & Prototyping": { icon: "Wrench", desc: "Solderless breadboards, perfboards, jumper wires, and terminal blocks." },
  "Switches & Relays": { icon: "Zap", desc: "Tactile buttons, toggles, rockers, and electromechanical relay modules." },
  "Identification & Security": { icon: "Cpu", desc: "RFID tags, RC522 readers, keypads, and fingerprint scanners." },
  "Timing & Clock": { icon: "Cpu", desc: "DS3231/DS1307 real-time clocks, quartz crystals, and oscillators." },
  "Logic & Interface Modules": { icon: "Cpu", desc: "Level shifters, I2C expanders, ADC/DAC modules, and driver boards." },
  "Protection Components": { icon: "Zap", desc: "Fuses, resettable PPTCs, MOVs, heat sinks, and thermal fuses." },
  "Connectors & Mechanical Parts": { icon: "Wrench", desc: "DC jacks, headers, terminal blocks, standoffs, and project boxes." },
  "Tools for B.Tech Projects": { icon: "Wrench", desc: "Soldering stations, multimeters, wire strippers, and lab equipment." },
  "IoT / Smart Project Components": { icon: "Cpu", desc: "Connected gateways, smart relays, camera nodes, and energy monitors." },
  "Camera & Vision": { icon: "Tv", desc: "OV7670, OV2640, ESP32-CAM, and Pi camera modules for computer vision." },
  "Industrial / Advanced B.Tech Components": { icon: "Wrench", desc: "PLCs, contactors, RTDs, proximity switches, and solenoid valves." },
  "Common B.Tech Project Modules": { icon: "Cpu", desc: "Ready-to-use application modules for engineering college projects." }
};

// Default high-quality hardware stock photos
const CATEGORY_IMAGE_POOLS = {
  "Resistors": "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=800&auto=format&fit=crop&q=80",
  "Capacitors": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  "Inductors & Magnetic Components": "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80",
  "Diodes": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  "LEDs & Indicators": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80",
  "Transistors": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80",
  "Thyristors": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  "ICS": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  "Power Supply Components": "https://images.unsplash.com/photo-1608562092523-289569806411?w=800&auto=format&fit=crop&q=80",
  "Microcontrollers & Development Boards": "https://images.unsplash.com/photo-1608562092523-289569806411?w=800&auto=format&fit=crop&q=80",
  "Sensors": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
  "Communication Modules": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
  "Displays": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80",
  "Sound Components": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
  "Motors & Actuators": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  "Robotics Components": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
  "Breadboard & Prototyping": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
  "Switches & Relays": "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80",
  "Identification & Security": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
  "Timing & Clock": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  "Logic & Interface Modules": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  "Protection Components": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  "Connectors & Mechanical Parts": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
  "Tools for B.Tech Projects": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  "IoT / Smart Project Components": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  "Camera & Vision": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
  "Industrial / Advanced B.Tech Components": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
  "Common B.Tech Project Modules": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80"
};

function getCategoryImg(categoryName) {
  if (CATEGORY_IMAGE_POOLS[categoryName]) return CATEGORY_IMAGE_POOLS[categoryName];
  if (categoryName.startsWith("Sensors")) return CATEGORY_IMAGE_POOLS["Sensors"];
  return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80";
}

// Calculate realistic price in INR based on component type and name
function calculatePrice(categoryName, itemName) {
  const name = itemName.toLowerCase();

  // Microcontrollers
  if (name.includes('raspberry pi 5')) return 6800;
  if (name.includes('raspberry pi 4')) return 5200;
  if (name.includes('raspberry pi 3')) return 3600;
  if (name.includes('raspberry pi zero')) return 1450;
  if (name.includes('raspberry pi pico')) return 399;
  if (name.includes('beaglebone') || name.includes('fpga')) return 3400;
  if (name.includes('teensy')) return 1850;
  if (name.includes('arduino mega')) return 980;
  if (name.includes('arduino uno')) return 549;
  if (name.includes('arduino nano')) return 299;
  if (name.includes('arduino')) return 340;
  if (name.includes('esp32-cam')) return 499;
  if (name.includes('esp32')) return 389;
  if (name.includes('esp8266') || name.includes('nodemcu')) return 249;
  if (name.includes('stm32')) return 290;

  // Resistors
  if (categoryName === 'Resistors') {
    if (name.includes('potentiometer') || name.includes('rheostat')) return 35;
    if (name.includes('ldr') || name.includes('thermistor')) return 15;
    if (name.includes('resistor network') || name.includes('wire-wound') || name.includes('power resistor')) return 25;
    return 5; // standard resistor packs
  }

  // Capacitors
  if (categoryName === 'Capacitors') {
    if (name.includes('super capacitor')) return 180;
    if (name.includes('variable capacitor')) return 65;
    if (name.includes('2200µf') || name.includes('1000µf')) return 35;
    if (name.includes('tantalum')) return 25;
    return 10;
  }

  // Inductors
  if (categoryName.includes('Inductor')) {
    if (name.includes('flyback') || name.includes('current transformer')) return 180;
    if (name.includes('transformer')) return 140;
    return 30;
  }

  // Diodes
  if (categoryName === 'Diodes') {
    if (name.includes('laser')) return 85;
    if (name.includes('bridge rectifier')) return 40;
    return 10;
  }

  // LEDs
  if (categoryName.includes('LEDs')) {
    if (name.includes('matrix') || name.includes('4-digit')) return 160;
    if (name.includes('7-segment')) return 45;
    if (name.includes('strip')) return 220;
    if (name.includes('high-power') || name.includes('rgb')) return 35;
    return 8;
  }

  // Transistors & Thyristors
  if (categoryName === 'Transistors' || categoryName === 'Thyristors') {
    if (name.includes('igbt') || name.includes('darlington') || name.includes('power transistor')) return 85;
    if (name.includes('mosfet') || name.includes('irf')) return 45;
    if (name.includes('triac') || name.includes('scr')) return 35;
    return 12;
  }

  // ICs
  if (categoryName === 'ICS') {
    if (name.includes('l298n')) return 160;
    if (name.includes('l293d')) return 55;
    if (name.includes('74hc') || name.includes('cd40')) return 30;
    if (name.includes('555') || name.includes('741') || name.includes('lm358')) return 20;
    return 40;
  }

  // Power Supply
  if (categoryName.includes('Power Supply')) {
    if (name.includes('solar panel') || name.includes('solar charge')) return 450;
    if (name.includes('smps') || name.includes('adapter')) return 350;
    if (name.includes('18650 battery')) return 180;
    if (name.includes('converter')) return 85;
    if (name.includes('tp4056')) return 45;
    if (name.includes('bms')) return 95;
    return 65;
  }

  // Sensors
  if (categoryName.startsWith('Sensors')) {
    if (name.includes('fingerprint')) return 850;
    if (name.includes('tof') || name.includes('vl53')) return 380;
    if (name.includes('bme280')) return 320;
    if (name.includes('waterproof ultrasonic') || name.includes('jsn-sr04t')) return 390;
    if (name.includes('max3010') || name.includes('pulse') || name.includes('heart')) return 280;
    if (name.includes('load cell') || name.includes('hx711')) return 240;
    if (name.includes('mq-')) return 140;
    if (name.includes('dht22')) return 220;
    if (name.includes('dht11')) return 95;
    if (name.includes('hc-sr04')) return 95;
    if (name.includes('pir')) return 120;
    if (name.includes('mpu6050')) return 160;
    return 120;
  }

  // Communication
  if (categoryName.includes('Communication')) {
    if (name.includes('4g') || name.includes('lte')) return 1250;
    if (name.includes('sim800') || name.includes('sim900') || name.includes('gsm')) return 650;
    if (name.includes('gps') || name.includes('neo-6m')) return 420;
    if (name.includes('lora')) return 450;
    if (name.includes('zigbee')) return 550;
    if (name.includes('bluetooth') || name.includes('hc-05')) return 240;
    if (name.includes('rfid') || name.includes('rc522')) return 180;
    if (name.includes('nrf24l01')) return 95;
    return 220;
  }

  // Displays
  if (categoryName === 'Displays') {
    if (name.includes('touchscreen') || name.includes('3.5-inch tft')) return 780;
    if (name.includes('tft')) return 450;
    if (name.includes('oled')) return 240;
    if (name.includes('20x4 lcd')) return 320;
    if (name.includes('16x2 lcd')) return 160;
    return 250;
  }

  // Motors
  if (categoryName.includes('Motors')) {
    if (name.includes('nema 23')) return 1450;
    if (name.includes('nema 17')) return 750;
    if (name.includes('linear actuator')) return 1200;
    if (name.includes('mg996r') || name.includes('mg995')) return 320;
    if (name.includes('sg90')) return 110;
    if (name.includes('bo motor')) return 65;
    if (name.includes('l298n')) return 160;
    return 180;
  }

  // Tools
  if (categoryName.includes('Tools')) {
    if (name.includes('oscilloscope')) return 4500;
    if (name.includes('function generator') || name.includes('bench power supply')) return 3200;
    if (name.includes('soldering station')) return 1800;
    if (name.includes('multimeter')) return 450;
    if (name.includes('soldering iron')) return 220;
    return 180;
  }

  // Common modules & IoT
  if (categoryName.includes('Project Modules') || categoryName.includes('IoT')) {
    return 250;
  }

  return 99;
}

async function populateAll() {
  try {
    console.log('🔄 Connecting to MongoDB database...');
    await connectDB();

    console.log('📦 Starting massive component & category import into MongoDB...');

    let totalCategoriesAdded = 0;
    let totalProductsAdded = 0;

    const categoryKeys = Object.keys(RAW_DATA);

    for (const catName of categoryKeys) {
      const slug = slugify(catName);
      const meta = CATEGORY_META[catName] || { icon: 'Cpu', desc: `${catName} for electronics, robotics and IoT prototyping.` };

      // Upsert Category
      const categoryDoc = await Category.findOneAndUpdate(
        { slug: slug },
        {
          name: catName,
          slug: slug,
          description: meta.desc,
          icon: meta.icon,
        },
        { upsert: true, new: true }
      );
      totalCategoriesAdded++;

      const items = RAW_DATA[catName];
      const imageUrl = getCategoryImg(catName);

      for (const itemName of items) {
        const cleanName = itemName.trim();
        const price = calculatePrice(catName, cleanName);

        const specs = [
          `Category: ${catName}`,
          `Genuine Tested Quality`,
          `Ready for instant dispatch`,
          `Student & DIY Friendly`
        ];

        // Upsert Product by name and category
        await Product.findOneAndUpdate(
          { name: cleanName, category: categoryDoc._id },
          {
            name: cleanName,
            description: `${cleanName} - High-grade verified electronics component for engineering lab experiments, academic projects, robotics, and commercial prototyping.`,
            price: price,
            category: categoryDoc._id,
            imageUrl: imageUrl,
            isActive: true,
            inStock: true,
            specifications: specs,
            featured: items.indexOf(itemName) === 0 // Mark first in each category as featured
          },
          { upsert: true, new: true }
        );
        totalProductsAdded++;
      }
      console.log(`  ✓ Synced Category: "${catName}" with ${items.length} components`);
    }

    console.log('\n======================================================');
    console.log(`🎉 SUCCESS: Fully seeded ${totalCategoriesAdded} Categories and ${totalProductsAdded} Products!`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to populate components:', err);
    process.exit(1);
  }
}

populateAll();
