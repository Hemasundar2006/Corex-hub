const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');
const Discount = require('../models/Discount');
const Settings = require('../models/Settings');
const { connectDB, disconnectDB } = require('../config/db');

const initialCategories = [
  {
    name: 'Microcontrollers & Dev Boards',
    slug: 'microcontrollers',
    description: 'Arduino, ESP32, Raspberry Pi Pico, and embedded development platforms.',
    icon: 'Cpu',
  },
  {
    name: 'Sensors & Modules',
    slug: 'sensors-modules',
    description: 'Environmental, motion, distance, biometric, and optical sensor modules.',
    icon: 'Activity',
  },
  {
    name: 'Passives & ICs',
    slug: 'passives-ics',
    description: 'Resistors, capacitors, diodes, transistors, logic gates, and op-amps.',
    icon: 'Zap',
  },
  {
    name: 'Displays & LEDs',
    slug: 'displays-leds',
    description: 'OLED, LCD, TFT displays, 7-segment displays, and LED matrix modules.',
    icon: 'Tv',
  },
  {
    name: 'Power & Battery',
    slug: 'power-battery',
    description: 'Li-ion battery chargers, step-down converters, adapters, and power modules.',
    icon: 'BatteryCharging',
  },
  {
    name: 'Tools & Prototyping',
    slug: 'tools-prototyping',
    description: 'Breadboards, jumper wires, soldering stations, multimeters, and test clips.',
    icon: 'Wrench',
  },
];

const initialProducts = [
  {
    name: 'Arduino Uno R3 Compatible Board (ATmega328P)',
    description: 'The standard development board for hobbyists, students and engineers. Features 14 digital I/O pins, 6 analog inputs, 16 MHz quartz crystal, USB connection, and power jack.',
    price: 549,
    categorySlug: 'microcontrollers',
    imageUrl: 'https://images.unsplash.com/photo-1608562092523-289569806411?w=800&auto=format&fit=crop&q=80',
    specifications: ['Microcontroller: ATmega328P', 'Operating Voltage: 5V', 'Input Voltage: 7-12V', 'Flash Memory: 32 KB', 'SRAM: 2 KB'],
    featured: true,
  },
  {
    name: 'ESP32 NodeMCU WiFi + Bluetooth Dev Board',
    description: 'Powerful dual-core 240MHz microcontroller with integrated Wi-Fi and Bluetooth BLE. Ideal for Internet of Things (IoT), smart home automation, and wireless sensor nodes.',
    price: 389,
    categorySlug: 'microcontrollers',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    specifications: ['Processor: Xtensa Dual-Core 32-bit LX6', 'Clock Speed: 240 MHz', 'Wi-Fi: 802.11 b/g/n', 'Bluetooth: v4.2 BR/EDR & BLE', 'GPIOs: 30 pins'],
    featured: true,
  },
  {
    name: 'Raspberry Pi Pico W with Pre-Soldered Headers',
    description: 'Official Raspberry Pi microcontroller board powered by the RP2040 chip with onboard 2.4GHz single-band wireless LAN. Supports MicroPython and C/C++.',
    price: 620,
    categorySlug: 'microcontrollers',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    specifications: ['Chip: RP2040 Dual-core Arm Cortex M0+', 'RAM: 264KB', 'On-board Flash: 2MB', 'Wireless: 2.4GHz 802.11n WiFi', 'Headers: Pre-soldered male pins'],
    featured: true,
  },
  {
    name: 'Arduino Nano V3 (CH340G + ATmega328P)',
    description: 'Breadboard-friendly mini microcontroller board. Ideal for compact robotics, wearable electronics, and lightweight embedded prototypes.',
    price: 299,
    categorySlug: 'microcontrollers',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    specifications: ['Microcontroller: ATmega328P', 'USB Driver: CH340G', 'Input Voltage: 5-12V', 'Dimensions: 18 x 45 mm'],
    featured: false,
  },
  {
    name: 'Ultrasonic Distance Sensor Module (HC-SR04)',
    description: 'Accurate non-contact distance measuring module providing 2cm to 400cm measurement range with ranging accuracy up to 3mm. Perfect for obstacle avoidance robots.',
    price: 89,
    categorySlug: 'sensors-modules',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    specifications: ['Operating Voltage: 5V DC', 'Measuring Range: 2cm - 400cm', 'Measuring Angle: 15 degrees', 'Trigger Input: 10µs TTL pulse'],
    featured: true,
  },
  {
    name: 'DHT11 Digital Temperature & Humidity Sensor',
    description: 'Calibrated digital signal output temperature and humidity composite sensor. Extremely reliable for weather stations and greenhouse monitoring.',
    price: 99,
    categorySlug: 'sensors-modules',
    imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80',
    specifications: ['Humidity Range: 20-90% RH', 'Temperature Range: 0-50 °C', 'Sampling Period: 1 second', 'Output: 1-wire digital'],
    featured: true,
  },
  {
    name: 'PIR Motion Sensor Module (HC-SR501)',
    description: 'Pyroelectric infrared passive motion detection module with adjustable sensitivity and delay time. Widely used for automatic lighting and burglar alarm systems.',
    price: 110,
    categorySlug: 'sensors-modules',
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=80',
    specifications: ['Detection Range: Up to 7 meters', 'Detection Angle: < 120 degrees cone', 'Output: High 3.3V / Low 0V', 'Delay Time: 0.3s - 200s adjustable'],
    featured: false,
  },
  {
    name: 'MQ-2 Gas / Smoke / LPG Detector Sensor',
    description: 'High sensitivity gas detector for LPG, i-butane, propane, methane, alcohol, Hydrogen, and smoke. Features both analog and digital threshold outputs.',
    price: 145,
    categorySlug: 'sensors-modules',
    imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80',
    specifications: ['Target Gases: LPG, Smoke, Combustible Gas', 'Operating Voltage: 5V DC', 'Output: Analog + Digital Comparator'],
    featured: false,
  },
  {
    name: 'SG90 Micro Servo Motor 9g (180 Degree)',
    description: 'Tiny and lightweight 9g servo motor with high output power. Ideal for robotic arms, steering mechanisms, pan-tilt camera mounts, and RC vehicles.',
    price: 125,
    categorySlug: 'sensors-modules',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
    specifications: ['Torque: 1.8 kg-cm at 4.8V', 'Operating Speed: 0.1s/60 degree', 'Weight: 9g', 'Rotation: 180 degrees'],
    featured: true,
  },
  {
    name: 'L298N Dual H-Bridge Motor Driver Module',
    description: 'High-power motor driver capable of driving two DC motors or one 4-wire bipolar stepper motor. Features onboard 5V regulator and indicator LEDs.',
    price: 179,
    categorySlug: 'sensors-modules',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    specifications: ['Drive Voltage: 5V-35V', 'Peak Current: 2A per bridge', 'Logic Voltage: 5V', 'Control Inputs: PWM speed control'],
    featured: true,
  },
  {
    name: '16x2 Blue Backlight Character LCD with I2C Interface',
    description: 'Classic 16 characters by 2 lines alphanumeric LCD with pre-soldered I2C backpack. Requires only 2 Arduino pins (SDA & SCL) to display information.',
    price: 249,
    categorySlug: 'displays-leds',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    specifications: ['Characters: 16 cols x 2 rows', 'Interface: I2C (PCF8574)', 'Backlight: Blue with white characters', 'Supply: 5V DC'],
    featured: true,
  },
  {
    name: '0.96 inch I2C OLED Display Module (128x64 Blue/Yellow)',
    description: 'Self-luminous graphical OLED display module with high contrast, wide viewing angle and low power consumption. Perfect for portable gadgets and wearable telemetry.',
    price: 220,
    categorySlug: 'displays-leds',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    specifications: ['Resolution: 128 x 64 pixels', 'Driver IC: SSD1306', 'Communication: I2C (0x3C default)', 'Voltage: 3.3V - 5V compatible'],
    featured: true,
  },
  {
    name: '830-Point Solderless Breadboard (MB-102)',
    description: 'High-grade transparent base breadboard with 830 tie-points, color-coded power distribution rails, and adhesive tape backing for rapid prototyping without soldering.',
    price: 140,
    categorySlug: 'tools-prototyping',
    imageUrl: 'https://images.unsplash.com/photo-1608562092523-289569806411?w=800&auto=format&fit=crop&q=80',
    specifications: ['Tie Points: 830 points (630 terminal + 200 distribution)', 'Pitch: Standard 2.54mm (0.1 in)', 'Dimensions: 165 x 55 x 10 mm'],
    featured: true,
  },
  {
    name: '65-Piece Flexible Jumper Wire Pack (Male to Male)',
    description: 'Assorted lengths of flexible multicolor male-to-male jumper wires with sturdy molded pin terminals. Essential for connecting components on breadboards.',
    price: 85,
    categorySlug: 'tools-prototyping',
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=80',
    specifications: ['Quantity: 65 wires', 'Lengths: 100mm, 150mm, 200mm, 250mm', 'Terminal: Male to Male 2.54mm pins'],
    featured: false,
  },
  {
    name: '40-Pin Dupont Ribbon Cable (Female to Female 20cm)',
    description: 'Color-coded separable ribbon jumper wires for linking sensor header pins to Arduino, Raspberry Pi, or ESP32 development boards.',
    price: 75,
    categorySlug: 'tools-prototyping',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    specifications: ['Pin Count: 40 pins', 'Connector: Female to Female', 'Length: 20 cm', 'Standard 2.54mm pitch'],
    featured: false,
  },
  {
    name: '60W Adjustable Temperature Soldering Iron Kit with Stand',
    description: 'Rapid-heating 60W soldering iron with 200°C to 450°C dial temperature control, stainless steel tip holder, cleaning sponge, and heat-resistant silicone grip.',
    price: 699,
    categorySlug: 'tools-prototyping',
    imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80',
    specifications: ['Power: 60W', 'Temperature Range: 200°C - 450°C', 'Voltage: 220V AC', 'Includes: Stand, sponge, 5 extra tips'],
    featured: true,
  },
  {
    name: 'XL830L Digital LCD Multimeter with Test Probes',
    description: 'Compact handheld digital multimeter for measuring AC/DC voltage, DC current, resistance, diode test, continuity buzzer, and transistor hFE verification.',
    price: 349,
    categorySlug: 'tools-prototyping',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    specifications: ['Display: 1999 counts LCD with backlight', 'DC Voltage: 200mV - 600V', 'AC Voltage: 200V - 600V', 'DC Current: 200uA - 10A'],
    featured: true,
  },
  {
    name: '300-Piece 1/4W Metal Film Resistor Assortment Kit',
    description: 'High precision 1% tolerance 1/4W metal film resistors sorted across 30 popular values (10 pieces each) from 10 Ohm to 1 Megaohm. Packaged with labeled strips.',
    price: 180,
    categorySlug: 'passives-ics',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    specifications: ['Total Quantity: 300 pieces', 'Tolerance: ±1%', 'Power Rating: 0.25W', 'Values: 10Ω, 100Ω, 220Ω, 1kΩ, 10kΩ, 100kΩ, etc.'],
    featured: false,
  },
  {
    name: '120-Piece Radial Electrolytic Capacitor Assortment',
    description: 'Kit of 12 standard electrolytic capacitor values (10pcs each) ranging from 1uF to 470uF with voltage ratings up to 50V. Ideal for power filtering and audio circuitry.',
    price: 210,
    categorySlug: 'passives-ics',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    specifications: ['Total Count: 120 capacitors', 'Values: 1uF, 2.2uF, 10uF, 47uF, 100uF, 470uF', 'Voltage Ratings: 16V to 50V'],
    featured: false,
  },
  {
    name: 'TP4056 1A Li-ion Battery Charging Module with Protection',
    description: 'Micro-USB 5V lithium-ion battery charging board featuring integrated DW01A battery protection against over-charge, over-discharge, and short circuit.',
    price: 45,
    categorySlug: 'power-battery',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    specifications: ['Charge Voltage: 4.2V ±1%', 'Max Charge Current: 1000mA', 'Protection: Over-discharge cut-off at 2.5V', 'Input: Micro-USB / solder pads'],
    featured: false,
  },
  {
    name: 'LM2596 DC-DC Buck Step-Down Voltage Regulator',
    description: 'Adjustable switching step-down power supply module. Converts input voltages from 4.5V-35V down to 1.25V-30V with up to 3A load capability and high efficiency.',
    price: 95,
    categorySlug: 'power-battery',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    specifications: ['Input Voltage: 4.5V - 35V', 'Output Voltage: 1.25V - 30V (Adjustable)', 'Max Current: 3A (with heatsink)', 'Efficiency: Up to 92%'],
    featured: true,
  },
  {
    name: '5V Single Channel Optical Relay Module with LED',
    description: 'Optocoupler isolated 5V relay module capable of switching AC 250V 10A or DC 30V 10A appliances directly from microcontroller logic pins.',
    price: 65,
    categorySlug: 'sensors-modules',
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=80',
    specifications: ['Trigger Current: 5mA', 'Control Voltage: 5V DC', 'Max Switch Capacity: AC 250V/10A, DC 30V/10A', 'Status LED: Green (Power), Red (Relay On)'],
    featured: false,
  },
];

const initialPromotions = [
  {
    title: 'IoT Developer Starter Bundle (ESP32 + 5 Sensors)',
    description: 'Complete hands-on IoT kit for building smart weather monitors, automation nodes, and cloud telemetry projects. Includes ESP32 WiFi+BLE dev board, DHT11 temp/humidity, HC-SR04 ultrasonic sensor, PIR motion detector, 5V relay, and 40-pin dupont cables.',
    price: 899,
    originalPrice: 1180,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    priority: 10,
    isPublished: true,
    items: [
      'ESP32 NodeMCU WiFi+BLE Dev Board',
      'DHT11 Temperature & Humidity Sensor',
      'HC-SR04 Ultrasonic Distance Sensor',
      'PIR Motion Sensor HC-SR501',
      '5V 1-Channel Relay Module',
      '40-Pin Dupont Cables',
    ],
  },
  {
    title: 'Arduino College Project Master Kit',
    description: 'The ultimate kit for engineering students and hobbyists building robotics and embedded projects. Everything you need to start programming and circuit building immediately.',
    price: 1199,
    originalPrice: 1550,
    imageUrl: 'https://images.unsplash.com/photo-1608562092523-289569806411?w=800&auto=format&fit=crop&q=80',
    priority: 9,
    isPublished: true,
    items: [
      'Arduino Uno R3 Compatible Board + USB Cable',
      '830-Point Solderless Breadboard',
      '16x2 Character LCD with I2C Module',
      'SG90 Micro Servo Motor 9g',
      'HC-SR04 Ultrasonic Sensor',
      '65pcs Jumper Wires Pack',
      'Resistor & LED Starter Pack',
    ],
  },
  {
    title: 'Smart 2WD Robot Car Chassis & Motor Driver Bundle',
    description: 'High quality acrylic 2-wheel drive robot chassis platform with dual DC geared BO motors, rubber wheels, omnidirectional caster, battery compartment, and L298N dual motor driver.',
    price: 749,
    originalPrice: 980,
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
    priority: 8,
    isPublished: true,
    items: [
      '2WD Laser-Cut Acrylic Smart Car Chassis',
      '2x Geared DC Motors with Speed Encoders',
      '2x High-Grip Rubber Tires',
      'Front Universal Caster Wheel',
      'L298N Dual H-Bridge Motor Controller',
      '4x AA Battery Holder with Switch',
    ],
  },
  {
    title: 'Pro Maker Soldering Station & Multimeter Toolkit',
    description: 'Professional hardware prototyping kit featuring a 60W dial-temperature soldering iron, heavy-duty stand, XL830L digital multimeter, desoldering pump, tweezers, and lead-free solder wire.',
    price: 999,
    originalPrice: 1350,
    imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80',
    priority: 7,
    isPublished: true,
    items: [
      '60W Adjustable Temp Soldering Iron (200-450°C)',
      'Soldering Stand with Cleaning Sponge',
      'XL830L Digital LCD Multimeter with Probes',
      'High-Grade Lead-Free Solder Wire Tube',
      'Anti-Static Precision Tweezers',
    ],
  },
  {
    title: 'Dual Display Pack: 0.96" OLED + 16x2 I2C LCD',
    description: 'Get both popular microcontroller displays in one discounted package. Crisp 128x64 OLED for detailed graphics and 16x2 backlit LCD for clear alphanumeric telemetry.',
    price: 419,
    originalPrice: 520,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    priority: 6,
    isPublished: true,
    items: [
      '0.96 inch I2C OLED Display (128x64)',
      '1602 LCD with Pre-soldered I2C Backpack',
      '4-pin Female to Female Jumper Wires',
    ],
  },
];

const seedDatabase = async (silent = false) => {
  try {
    if (!silent) console.log('🌱 Starting database seeding process...');

    // 1. Seed or Verify Admin User
    const adminEmail = 'admin@corex.com';
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      const passwordHash = await Admin.hashPassword('admin123');
      admin = await Admin.create({
        name: 'Corex Store Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });
      if (!silent) console.log(`👤 Admin created: ${adminEmail} (password: admin123)`);
    }

    // 2. Seed or Verify Settings
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        storeName: 'Corex Projects Hub',
        tagline: 'Your One-Stop Electronics Components & Project Supplies Hub',
        businessPhone: process.env.DEFAULT_WHATSAPP_NUMBER || '+919876543210',
        email: 'orders@corexprojects.com',
        address: 'Shop #14, Electronics Market Complex, Tech Road, City Center',
        currencySymbol: '₹',
        orderMessageTemplate:
          'Hello Corex Projects Hub! 👋\nI would like to order:\n📦 Item: {product}\n💰 Price: {currency}{price}\n🏷️ Category: {category}\n🔗 Link: {link}\n\nPlease let me know availability and delivery details!',
      });
      if (!silent) console.log('⚙️ Default settings initialized with WhatsApp number:', settings.businessPhone);
    }

    // 3. Seed or Verify Discount Banner
    let discount = await Discount.findOne();
    if (!discount) {
      discount = await Discount.create({
        text: '🎉 Monsoon Engineering Project Sale: Flat 10% OFF on all Sensors & Dev Boards! Order directly via WhatsApp.',
        badgeText: 'Limited Offer',
        linkUrl: '/products?category=sensors-modules',
        isActive: true,
      });
      if (!silent) console.log('📢 Discount announcement banner initialized');
    }

    // 4. Seed Categories
    const categoryMap = {};
    for (const catData of initialCategories) {
      let cat = await Category.findOne({ slug: catData.slug });
      if (!cat) {
        cat = await Category.create(catData);
      }
      categoryMap[cat.slug] = cat._id;
    }
    if (!silent) console.log(`📁 Categories synced (${Object.keys(categoryMap).length} categories ready)`);

    // 5. Seed Products (if none exist)
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const productsToInsert = initialProducts.map((p) => ({
        name: p.name,
        description: p.description,
        price: p.price,
        category: categoryMap[p.categorySlug],
        imageUrl: p.imageUrl,
        imagePublicId: '',
        specifications: p.specifications || [],
        featured: Boolean(p.featured),
        inStock: true,
        isActive: true,
      }));

      await Product.insertMany(productsToInsert);
      if (!silent) console.log(`⚡ Inserted ${productsToInsert.length} electronics components into catalogue`);
    }

    // 6. Seed Promotions (if none exist)
    const promoCount = await Promotion.countDocuments();
    if (promoCount === 0) {
      await Promotion.insertMany(initialPromotions);
      if (!silent) console.log(`🎁 Inserted ${initialPromotions.length} combo bundle offers`);
    }

    if (!silent) console.log('✅ Database seeding finished successfully!');
    return true;
  } catch (error) {
    console.error('❌ Seeding error:', error);
    return false;
  }
};

// Standalone execution support
if (require.main === module) {
  require('dotenv').config();
  (async () => {
    await connectDB();
    await seedDatabase(false);
    await disconnectDB();
    process.exit(0);
  })();
}

module.exports = { seedDatabase };
