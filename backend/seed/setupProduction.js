require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const { connectDB, disconnectDB } = require('../config/db');

const data = {
  "Resistors": [
    "Resistors – 102, 222, 472, 1000", "2200 resistor", "3300 resistor", "4702 resistor", "1ΚΩ resistor", "2.2ΚΩ resistor", "4.7ΚΩ resistor", "10ΚΩ resistor", "22ΚΩ resistor", "47ΚΩ resistor", "100ΚΩ resistor", "1ΜΩ resistor", "Potentiometer", "Rheostat", "LDR", "Thermistor - NTC", "Thermistor - PTC"
  ],
  "Capacitors": [
    "Ceramic capacitor", "Electrolytic capacitor", "Tantalum capacitor", "Film capacitor", "Polyester capacitor", "Mylar capacitor", "Mica capacitor", "SMD capacitor", "Variable capacitor", "Super capacitor", "1µF capacitor", "10µF capacitor", "22µF capacitor", "47µF capacitor", "100µF capacitor", "220µF capacitor", "470µF capacitor", "1000µF capacitor", "2200µF capacitor"
  ],
  "Inductors & Magnetic Components": [
    "Inductor", "SMD inductor", "Ferrite-core inductor", "Toroidal inductor", "Choke coil", "Ferrite bead", "Transformer", "Current transformer", "Flyback transformer"
  ],
  "Diodes": [
    "General-purpose diode", "1N4001", "1N4004", "1N4007", "1N4148", "Zener diode", "Schottky diode", "TVS diode", "Bridge rectifier", "Fast-recovery diode", "Photodiode", "IR diode", "Laser diode", "Varactor diode", "Tunnel diode", "PIN diode"
  ],
  "LEDs & Indicators": [
    "Red LED", "Green LED", "Blue LED", "Yellow LED", "White LED", "Orange LED", "RGB LED", "SMD LED", "High-power LED", "LED strip", "LED indicator module", "7-segment display", "4-digit 7-segment display", "LED matrix", "Dot-matrix display"
  ],
  "ICS": [
    "555 Timer IC", "741 Op-Amp", "LM358", "LM324", "LM393", "LM317", "7805", "7809", "7812", "7905", "7912", "ULN2003", "ULN2803", "L293D", "L298N", "CD4017", "CD4026", "EEPROM IC", "ADC IC", "DAC IC", "RTC IC", "Memory IC", "Audio amplifier IC", "Voltage regulator IC", "Battery charger IC"
  ],
  "Power Supply Components": [
    "AA battery", "AAA battery", "9V battery", "12V battery", "Li-ion battery", "18650 battery", "Li-Po battery", "Lead-acid battery", "Battery holder", "18650 battery holder", "Battery connector", "Battery charging module", "TP4056 charging module", "BMS", "1S BMS", "2S BMS", "3S BMS", "Fuse", "Fuse holder", "Resettable fuse", "Power switch", "Toggle switch", "Rocker switch", "Slide switch", "Push-button switch", "Emergency stop switch", "DC-DC converter", "Buck converter", "Boost converter", "Buck-boost converter", "AC-DC adapter", "SMPS", "5V power supply", "12V power supply", "USB power module", "Solar panel", "Solar charge controller", "Power bank module"
  ],
  "Microcontrollers & Development Boards": [
    "Arduino Uno", "Arduino Nano", "Arduino Mega", "Arduino Micro", "ESP8266", "NodeMCU", "ESP32", "ESP32-CAM", "Raspberry Pi Pico", "Raspberry Pi Zero", "Raspberry Pi 3", "Raspberry Pi 4", "Raspberry Pi 5", "PIC microcontroller", "8051 microcontroller"
  ],
  "Sensors - Temperature": [
    "LM35 temperature sensor", "DHT11", "DHT22"
  ],
  "Sensors - Humidity": [
    "DHT11 humidity", "DHT22 humidity"
  ],
  "Sensors - Pressure": [
    "BMP180", "BMP280", "BME280", "Barometric pressure sensor"
  ],
  "Sensors - Gas": [
    "MQ-2", "MQ-3", "MQ-4", "MQ-5", "MQ-6", "MQ-7", "MQ-9", "MQ-135", "LPG sensor", "CO sensor", "Smoke sensor"
  ],
  "Sensors - Light": [
    "LDR sensor", "Photodiode sensor", "Phototransistor", "BH1750", "TSL2561", "Ambient light sensor"
  ],
  "Sensors - Motion": [
    "PIR sensor", "MPU6050", "MPU9250"
  ],
  "Sensors - Distance": [
    "HC-SR04 ultrasonic sensor", "JSN-SR04T waterproof ultrasonic sensor"
  ],
  "Sensors - Other": [
    "Flame sensor", "Sound sensor", "Vibration sensor", "Tilt sensor", "Touch sensor", "Capacitive touch sensor", "Soil-moisture sensor", "Rain sensor", "Water-level sensor", "Flow sensor", "Current sensor", "Voltage sensor", "Hall-effect sensor", "Magnetic sensor", "Flex sensor", "Force sensor", "Load cell", "HX711 load-cell amplifier", "Color sensor", "TCS3200", "TCS34725", "Fingerprint sensor", "Heart-rate sensor", "Pulse sensor", "MAX30100", "MAX30102", "Air-quality sensor", "UV sensor"
  ],
  "Communication Modules": [
    "HC-05 Bluetooth", "HC-06 Bluetooth", "HM-10 Bluetooth BLE", "ESP8266 Wi-Fi", "ESP32 Wi-Fi/Bluetooth", "NRF24L01", "433-MHz RF transmitter", "433-MHz RF receiver", "315-MHz RF module", "LoRa module", "LoRa SX1278", "Zigbee module", "GSM module", "SIM800L", "SIM900", "4G LTE module", "GPS module", "NEO-6M GPS", "RFID module", "RC522 RFID", "NFC module", "CAN module", "RS485 module", "Ethernet module"
  ],
  "Displays": [
    "16x2 LCD", "20x4 LCD", "I2C LCD", "0.96-inch OLED", "1.3-inch OLED", "1.54-inch OLED", "TFT display", "2.4-inch TFT", "2.8-inch TFT", "3.5-inch TFT", "7-segment display", "8x8 LED matrix", "OLED display", "E-paper display", "Touchscreen display"
  ],
  "Sound Components": [
    "Buzzer", "Active buzzer", "Passive buzzer", "Piezo buzzer", "Speaker", "Microphone", "Electret microphone", "Microphone module", "Audio amplifier module"
  ],
  "Motors & Actuators": [
    "DC motor", "Gear motor", "BO motor", "N20 gear motor", "High-torque DC motor", "Servo motor", "SG90 servo", "MG90S servo", "MG995 servo", "MG996R servo", "Stepper motor", "NEMA 17 stepper motor", "NEMA 23 stepper motor", "Stepper motor driver", "Vibration motor"
  ],
  "Robotics Components": [
    "Robot chassis", "2-wheel chassis", "4-wheel chassis"
  ],
  "Breadboard & Prototyping": [
    "Full-size breadboard", "Half-size breadboard", "Mini breadboard", "Solderless breadboard", "Perfboard", "Vero board", "Prototype PCB", "Universal PCB", "Dot PCB", "Jumper wires", "Male-to-male jumper", "Male-to-female jumper", "Female-to-female jumper", "Dupont connectors", "Pin headers", "Female headers", "USB connector", "Micro-USB connector", "USB-C connector"
  ],
  "Switches & Relays": [
    "Push button", "Tactile switch", "Toggle switch", "Rocker switch", "Slide switch", "Rotary switch", "DIP switch", "Limit switch", "Reed switch", "Relay", "5V relay", "12V relay", "24V relay", "Single-channel relay module", "2-channel relay module", "4-channel relay module", "8-channel relay module", "Solid-state relay"
  ],
  "Identification & Security": [
    "RFID card", "RFID key tag", "RC522 RFID reader", "NFC reader", "Fingerprint module", "Keypad", "4x4 matrix keypad", "4x3 keypad", "RFID antenna", "Biometric module"
  ],
  "Timing & Clock": [
    "RTC module", "DS1307", "DS3231", "Crystal oscillator", "32.768-kHz crystal", "Ceramic resonator", "Clock module"
  ],
  "Logic & Interface Modules": [
    "Logic-level converter", "5V-to-3.3V converter", "I2C multiplexer", "I/O expander", "MCP23017", "PCF8574", "ADC module", "DAC module", "PWM module", "Relay interface module", "MOSFET driver module", "Optocoupler module"
  ],
  "Protection Components": [
    "Fuse module", "Resettable fuse", "TVS diode", "Zener diode (protection)", "MOV", "ESD protection diode", "Reverse-polarity protection", "Over-current protection", "Over-voltage protection", "Thermal fuse", "Heat sink", "Thermal pad", "Cooling fan"
  ],
  "Connectors & Mechanical Parts": [
    "DC jack", "AC plug", "Terminal block", "JST connector", "Molex connector", "Dupont connector", "Header pins", "PCB screw terminal", "Alligator clips", "Crocodile clips", "Wires", "Jumper wire set", "Ribbon cable", "Heat-shrink tubing", "Cable ties", "Screws", "Nuts", "Bolts", "Spacers", "Standoffs", "Project enclosure", "Plastic box", "Acrylic sheet"
  ],
  "Tools for B.Tech Projects": [
    "Digital multimeter", "Analog multimeter", "Soldering iron", "Soldering station", "Solder wire", "Flux", "Desoldering pump", "Solder wick", "Hot-glue gun", "Hot glue sticks", "Wire stripper", "Wire cutter", "Nose plier", "Screwdriver set", "Tweezers", "PCB holder", "Bench power supply", "Oscilloscope", "Function generator", "Logic analyzer", "LCR meter", "Crimping tool"
  ],
  "IoT & Smart Project Components": [
    "Wi-Fi module", "Bluetooth module", "GSM module (IoT)", "GPS module (IoT)", "LoRa module (IoT)", "MQTT-compatible controller", "ESP8266 (IoT)", "ESP32 (IoT)", "ESP32-CAM (IoT)", "Raspberry Pi (IoT)", "SD-card module", "MicroSD card", "Ethernet module (IoT)", "Camera module", "Relay module (IoT)", "Smart energy meter module"
  ],
  "Camera & Vision": [
    "OV7670 camera", "OV2640 camera", "ESP32-CAM module", "Raspberry Pi camera", "USB webcam", "IR camera module", "Camera lens", "IR LED array"
  ],
  "Industrial & Advanced Components": [
    "PLC", "HMI", "VFD", "Industrial relay", "Contactor", "Proximity switch", "Inductive proximity sensor", "Capacitive proximity sensor", "Photoelectric sensor", "Industrial temperature sensor", "RTD", "PT100", "Thermocouple", "Pressure transmitter", "Industrial flow sensor", "Level sensor", "Solenoid valve", "Pneumatic solenoid", "Industrial encoder"
  ],
  "Common B.Tech Project Modules": [
    "Automatic street-light module", "Line-following module", "Obstacle-avoidance module", "Bluetooth control module", "Wi-Fi control module", "RFID access-control module", "Fingerprint door-lock module", "GSM alert module", "GPS tracking module", "Weather-monitoring module", "Home-automation module", "Smart irrigation module", "Water-level controller", "Gas-leak detector", "Fire-alarm module", "Smart energy-meter module", "Solar monitoring module", "Battery monitoring module", "IoT monitoring module", "Motor-control module"
  ]
};

const run = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to DB.');

    // 1. Clear old data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing products and categories.');

    // 2. Create admin account
    const adminEmail = 'veerapaneniyaswanth5@gmail.com';
    const adminPassword = 'Yashking606171';
    
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      // Update password if admin already exists
      const passwordHash = await Admin.hashPassword(adminPassword);
      await Admin.findOneAndUpdate({ email: adminEmail }, { passwordHash, name: 'IoT Garage Admin' });
      console.log(`✏️  Updated admin: ${adminEmail}`);
    } else {
      const passwordHash = await Admin.hashPassword(adminPassword);
      await Admin.create({
        name: 'IoT Garage Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });
      console.log(`👤 Created admin: ${adminEmail}`);
    }

    // 3. Remove old default admin if different
    await Admin.deleteMany({ email: 'admin@corex.com' });
    console.log('🗑️  Removed old default admin account.');

    // 4. Update store settings name
    await Settings.findOneAndUpdate(
      {},
      { storeName: 'IoT Garage', tagline: 'Electronics Components & WhatsApp Ordering' },
      { upsert: false }
    );
    console.log('⚙️  Updated store name to IoT Garage.');

    // 5. Import all categories and products
    let totalProducts = 0;
    for (const [categoryName, products] of Object.entries(data)) {
      const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const category = await Category.create({
        name: categoryName,
        slug,
        description: `All items related to ${categoryName}`,
        icon: 'Box'
      });

      const productsToInsert = products.map(productName => ({
        name: productName,
        description: `${productName} — quality electronic component for your projects`,
        price: Math.floor(Math.random() * 490) + 10,
        category: category._id,
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        specifications: [],
        featured: Math.random() > 0.85,
        inStock: true,
        isActive: true,
      }));

      await Product.insertMany(productsToInsert);
      totalProducts += productsToInsert.length;
      console.log(`  ✅ ${categoryName}: ${productsToInsert.length} products`);
    }

    console.log(`\n🎉 Import complete! ${totalProducts} products across ${Object.keys(data).length} categories.`);
    console.log(`\n🔐 Admin credentials:`);
    console.log(`   Email: veerapaneniyaswanth5@gmail.com`);
    console.log(`   Password: Yashking606171`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

run();
