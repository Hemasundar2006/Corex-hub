'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Minimize2 } from 'lucide-react';

const STORE_KNOWLEDGE = {
  store: {
    name: 'IoT Garage',
    tagline: 'Electronics Components & WhatsApp Ordering',
    description: 'An electronics components store specializing in microcontrollers, sensors, ICs, modules, tools, and project kits for students, hobbyists, and engineers.',
    ordering: 'You can order directly via WhatsApp. Browse products, add to cart, fill in your delivery details, and our team will confirm your order on WhatsApp.',
    payment: 'We accept payment via WhatsApp order confirmation. Our team will share payment details after order confirmation.',
    delivery: 'We deliver across India. Delivery time varies by location.',
  },
  categories: [
    'Resistors', 'Capacitors', 'Inductors & Magnetic Components', 'Diodes', 'LEDs & Indicators',
    'ICS (Integrated Circuits)', 'Power Supply Components', 'Microcontrollers & Development Boards',
    'Sensors (Temperature, Humidity, Pressure, Gas, Light, Motion, Distance)',
    'Communication Modules (Bluetooth, WiFi, GSM, GPS, RF, LoRa)',
    'Displays (LCD, OLED, TFT)', 'Sound Components', 'Motors & Actuators',
    'Robotics Components', 'Breadboard & Prototyping', 'Switches & Relays',
    'Identification & Security (RFID, Fingerprint)', 'Timing & Clock',
    'Logic & Interface Modules', 'Protection Components', 'Connectors & Mechanical Parts',
    'Tools for B.Tech Projects', 'IoT / Smart Project Components', 'Camera & Vision',
    'Industrial / Advanced B.Tech Components', 'Common B.Tech Project Modules',
  ],
  popularProducts: [
    { name: 'Arduino Uno', category: 'Microcontrollers', use: 'General purpose prototyping, student projects' },
    { name: 'ESP32', category: 'Microcontrollers', use: 'WiFi/Bluetooth IoT projects' },
    { name: 'ESP8266 / NodeMCU', category: 'Microcontrollers', use: 'Low-cost WiFi IoT projects' },
    { name: 'Raspberry Pi', category: 'Development Boards', use: 'Linux-based projects, camera, vision' },
    { name: 'DHT11 / DHT22', category: 'Sensors', use: 'Temperature and humidity measurement' },
    { name: 'HC-SR04', category: 'Sensors', use: 'Ultrasonic distance measurement' },
    { name: 'PIR Sensor', category: 'Sensors', use: 'Motion detection' },
    { name: 'MQ-2 / MQ-135', category: 'Sensors', use: 'Gas and smoke detection' },
    { name: 'L298N / L293D', category: 'ICs/Modules', use: 'Motor driver for DC and stepper motors' },
    { name: '555 Timer IC', category: 'ICs', use: 'Timer circuits, oscillators, PWM' },
    { name: 'LM35', category: 'Sensors', use: 'Analog temperature sensing' },
    { name: 'HC-05 / HC-06', category: 'Communication', use: 'Bluetooth serial communication' },
    { name: 'NEO-6M GPS', category: 'Communication', use: 'GPS location tracking' },
    { name: 'SIM800L', category: 'Communication', use: 'GSM SMS/Call module' },
    { name: 'RC522 RFID', category: 'Security', use: 'RFID card reader/writer' },
    { name: 'SG90 Servo', category: 'Motors', use: 'Small servo for robotic arms, pan-tilt' },
    { name: 'NEMA 17 Stepper', category: 'Motors', use: 'Precise position control, 3D printers, CNC' },
    { name: '16x2 LCD / I2C LCD', category: 'Displays', use: 'Displaying text data' },
    { name: '0.96 OLED', category: 'Displays', use: 'Graphical display for IoT projects' },
    { name: 'TP4056', category: 'Power', use: 'Li-ion battery charging' },
    { name: 'LM317 / 7805', category: 'Power', use: 'Voltage regulation' },
  ],
  btechProjects: [
    'Smart Irrigation System (Soil moisture + ESP32)',
    'Automatic Street Light (LDR + Relay)',
    'Gas Leak Detector (MQ-2 + GSM Alert)',
    'RFID Door Lock System (RC522 + Servo)',
    'Home Automation (ESP8266 + Relay)',
    'Line Following Robot (IR Sensors + L298N)',
    'GPS Vehicle Tracker (NEO-6M + GSM)',
    'Smart Energy Meter (Current sensor + ESP32)',
    'Fire Alarm System (Flame sensor + Buzzer)',
    'Fingerprint Attendance System',
  ],
};

function generateBotResponse(message, userName, conversationHistory) {
  const msg = message.toLowerCase().trim();

  // Greeting detection
  if (msg.match(/^(hi|hello|hey|hii|helo|yo|sup|namaste|good morning|good evening)/)) {
    if (!userName) {
      return `Hello there! 👋 Welcome to **IoT Garage** — your go-to electronics store!\n\nI'm **IoTBot** 🤖, your personal assistant. I can help you find components, suggest project ideas, and guide you through ordering.\n\nMay I know your name?`;
    }
    return `Hey ${userName}! 😊 Great to see you again! How can I help you today?\n\nYou can ask me about:\n• **Products & components** 🔌\n• **B.Tech project ideas** 💡\n• **How to order** 🛒\n• **Any electronics question** ⚡`;
  }

  // Name detection after greeting
  if (conversationHistory.length <= 3 && msg.match(/^(i am|i'm|my name is|call me|name is|it's|its)\s+\w+|^\w{2,20}$/)) {
    const possibleName = message.trim().replace(/^(i am|i'm|my name is|call me|name is|it's|its)\s+/i, '').replace(/[^a-zA-Z ]/g, '').trim();
    if (possibleName && possibleName.length >= 2 && possibleName.length <= 30 && !possibleName.includes(' ') || possibleName.split(' ').length <= 3) {
      return `__SET_NAME__${possibleName}`;
    }
  }

  // Component/product search
  if (msg.match(/arduino|uno|nano|mega/)) {
    return `🎯 **Arduino boards** are a great choice!\n\nWe stock:\n• **Arduino Uno** – Best for beginners, 14 digital I/O pins\n• **Arduino Nano** – Compact, breadboard-friendly\n• **Arduino Mega** – More pins for complex projects\n• **Arduino Micro** – Ultra compact\n\nAll compatible with the Arduino IDE. Would you like help picking the right one for your project?`;
  }

  if (msg.match(/esp32|esp8266|nodemcu/)) {
    return `📡 **ESP32/ESP8266** — Perfect for IoT projects!\n\n• **ESP8266 / NodeMCU** – Budget WiFi, great for simple IoT\n• **ESP32** – Dual-core, WiFi + Bluetooth, more GPIOs\n• **ESP32-CAM** – Built-in camera, great for surveillance projects\n\nFor a **B.Tech project**, ESP32 is usually the best choice due to its versatility. Want help choosing?`;
  }

  if (msg.match(/raspberry pi|rpi/)) {
    return `🍓 **Raspberry Pi** boards we carry:\n\n• **Pi Pico** – Microcontroller, MicroPython, great for embedded\n• **Pi Zero** – Ultra compact, Linux-capable\n• **Pi 3/4/5** – Full Linux computer, great for AI/vision projects\n\nNeed one for a camera project, AI, or robotics? Tell me your use case!`;
  }

  if (msg.match(/sensor|dht|temperature|humidity|lm35/)) {
    return `🌡️ **Temperature & Humidity Sensors:**\n\n• **LM35** – Analog, simple and accurate (±0.5°C)\n• **DHT11** – Digital, temp + humidity, ±2°C accuracy, budget pick\n• **DHT22** – Higher accuracy (±0.5°C), wider range (-40°C to 80°C)\n• **BMP280/BME280** – Includes atmospheric pressure too!\n\nFor most student projects, **DHT11** is the go-to. Want recommendations for your specific project?`;
  }

  if (msg.match(/motor|servo|stepper|driver|l298|l293/)) {
    return `⚙️ **Motors & Drivers we carry:**\n\n• **DC Motors** (BO motor, gear motor, N20)\n• **Servo** – SG90 (9g), MG90S, MG995, MG996R\n• **Stepper** – NEMA 17, NEMA 23 (for CNC, 3D printing)\n\n**Motor Drivers:**\n• **L293D** – Up to 600mA per channel\n• **L298N** – Up to 2A, great for robot cars\n• **Stepper drivers** – A4988, DRV8825\n\nWhat kind of motor project are you building?`;
  }

  if (msg.match(/display|lcd|oled|tft/)) {
    return `📺 **Display options we stock:**\n\n• **16x2 LCD** – Classic text display, with/without I2C backpack\n• **20x4 LCD** – More rows for detailed menus\n• **0.96" OLED** – Crisp 128x64 graphics, great for wearables\n• **1.3" OLED** – Slightly larger version\n• **TFT Displays** – 2.4", 2.8", 3.5" with touch support\n\nOLED is best for sleek IoT dashboards. TFT for apps needing color. Which project is it for?`;
  }

  if (msg.match(/bluetooth|bt|hc-05|hc-06|hm-10/)) {
    return `📶 **Bluetooth Modules:**\n\n• **HC-05** – Classic Bluetooth, master/slave configurable\n• **HC-06** – Classic Bluetooth, slave only (simpler)\n• **HM-10** – Bluetooth BLE 4.0, works with phones & iOS\n\nFor phone-controlled projects, **HC-05** is most popular. For BLE/low-power apps, use **HM-10**.`;
  }

  if (msg.match(/wifi|wi-fi|wireless|iot|internet of things/)) {
    return `🌐 **WiFi & IoT Modules:**\n\n• **ESP8266** – Budget WiFi module\n• **ESP32** – WiFi + Bluetooth combo (recommended for new projects)\n• **ESP32-CAM** – WiFi camera module\n\nFor full IoT projects with MQTT, Firebase, or cloud — **ESP32** is the gold standard. Need help with a specific IoT project?`;
  }

  if (msg.match(/rfid|rc522|nfc|security|door lock|access control/)) {
    return `🔐 **RFID & Security components:**\n\n• **RC522 RFID Module** – 13.56MHz reader/writer\n• **RFID Cards & Key Tags** – Compatible with RC522\n• **NFC Modules** – Near-field communication\n• **Fingerprint Modules** – For biometric access\n• **Keypads** – 4x4 matrix, 4x3 numeric\n\nFor a **door lock project**, the classic combo is: **RC522 + Arduino/ESP32 + Servo Motor**. Interested in that?`;
  }

  if (msg.match(/relay|switch|5v relay|12v relay|automation/)) {
    return `⚡ **Relay Modules we stock:**\n\n• **5V Single Channel Relay** – Basic on/off switching\n• **5V / 12V / 24V Relays**\n• **2-channel, 4-channel, 8-channel relay boards** – For home automation\n• **Solid State Relay** – Silent, long-lasting\n\nFor **Home Automation projects**, a 4-channel relay + ESP8266 is the most popular combo. Want a project guide?`;
  }

  if (msg.match(/power|battery|charger|tp4056|bms|lipo|li-ion|18650/)) {
    return `🔋 **Power & Battery components:**\n\n• **18650 Li-ion batteries** – Rechargeable, 3.7V\n• **TP4056** – Li-ion charging module (Micro-USB)\n• **BMS modules** – 1S, 2S, 3S battery protection\n• **Buck converters** – Step-down DC-DC\n• **Boost converters** – Step-up\n• **LM317 / 7805** – Voltage regulators\n\nWhat's your power requirement? I can suggest the right combo!`;
  }

  if (msg.match(/project|btech|b\.tech|engineering|college|final year|mini project/)) {
    return `🎓 **Popular B.Tech project ideas using our components:**\n\n1. 🌱 Smart Irrigation (ESP32 + Soil sensor)\n2. 💡 Automatic Street Light (LDR + Relay)\n3. 🚨 Gas Leak Detector (MQ-2 + GSM)\n4. 🔐 RFID Door Lock (RC522 + Servo)\n5. 🏠 Home Automation (ESP8266 + Relay)\n6. 🚗 Line Following Robot (IR + L298N)\n7. 📍 GPS Tracker (NEO-6M + SIM800L)\n8. ⚡ Smart Energy Meter (Current sensor + ESP32)\n9. 🔥 Fire Alarm (Flame sensor + Buzzer + GSM)\n10. 👆 Fingerprint Attendance System\n\nWant a **component list** for any of these projects?`;
  }

  if (msg.match(/how to order|ordering|buy|purchase|place order/)) {
    return `🛒 **How to order from IoT Garage:**\n\n1. Browse our catalogue → click **Add to Cart** on any product\n2. When ready, click the cart icon in the navbar\n3. Enter your **delivery details** (name, phone, address, pincode)\n4. Click **Place Order via WhatsApp**\n5. A pre-filled WhatsApp message opens — just **Send it!** ✅\n\nOur team will confirm your order and share payment details.\n\nYou can also message us directly on WhatsApp with your BOM (Bill of Materials)!`;
  }

  if (msg.match(/price|cost|rate|how much|cheap|expensive/)) {
    return `💰 **Pricing at IoT Garage:**\n\nOur prices are displayed on each product card. Here's a rough idea:\n• **Basic sensors** (DHT11, PIR, etc.) – ₹89 to ₹200\n• **Microcontrollers** (Arduino Uno, ESP32) – ₹299 to ₹620\n• **ICs** (555, 7805, L298N) – ₹45 to ₹179\n• **Combo Kits** – ₹419 to ₹1,199\n\nPrices are updated regularly. Browse the catalogue for exact pricing or ask me about a specific component!`;
  }

  if (msg.match(/delivery|shipping|dispatch|when will i get|how many days/)) {
    return `🚚 **Delivery Information:**\n\nWe deliver across India. Estimated timelines:\n• **Metro cities** – 2 to 3 business days\n• **Tier 2/3 cities** – 3 to 5 business days\n• **Remote areas** – Up to 7 days\n\nOnce your order is confirmed on WhatsApp, our team will share the tracking details. Need urgent delivery? Mention it in your order message!`;
  }

  if (msg.match(/what do you sell|what do you have|what components|what is available|catalogue|catalog/)) {
    return `📦 **We carry 30+ categories and 400+ products:**\n\n🔌 Resistors, Capacitors, Inductors, Diodes\n💡 LEDs, ICs, Power components\n🧠 Microcontrollers (Arduino, ESP32, Raspberry Pi)\n📡 Sensors (Temperature, Gas, Motion, Distance...)\n📶 Communication (WiFi, BT, GSM, GPS, LoRa)\n📺 Displays (LCD, OLED, TFT)\n⚙️ Motors, Servos, Stepper motors\n🔐 RFID, Fingerprint, Security modules\n🛠️ Tools, Breadboards, Prototyping supplies\n\nVisit our **Products** page to browse everything. What category interests you?`;
  }

  if (msg.match(/thank|thanks|helpful|great|awesome|perfect|excellent/)) {
    return `You're welcome${userName ? `, ${userName}` : ''}! 😊 Happy to help!\n\nIf you need anything else — component recommendations, project ideas, or order help — just ask. Happy building! ⚡🔧`;
  }

  if (msg.match(/bye|goodbye|see you|cya|ok bye/)) {
    return `Goodbye${userName ? `, ${userName}` : ''}! 👋 Happy building your project!\n\nRemember, we're always here if you need components or project advice. Come back anytime! 🔌⚡`;
  }

  // Generic helpful fallback
  return `🤔 Great question${userName ? `, ${userName}` : ''}! \n\nI can help you with:\n• 🔍 **Finding components** – Just name the part\n• 💡 **Project ideas** – Tell me your domain (IoT, Robotics, etc.)\n• 🛒 **How to order** – Step-by-step guide\n• ⚡ **Electronics help** – Basic circuit questions\n• 📦 **Checking availability** – Ask about any component\n\nWhat would you like to know?`;
}

export default function Chatbot({ businessPhone }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addBotMessage = useCallback((text, delay = 600) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'bot',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, delay);
  }, []);

  // Initial greeting when chatbot is first opened
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          role: 'bot',
          text: `Hi there! 👋 Welcome to **IoT Garage**!\n\nI'm **IoTBot** 🤖 — your personal electronics assistant. I can help you find components, suggest project ideas, and guide you through ordering.\n\nWhat's your name? I'd love to assist you personally! 😊`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 400);
    }
  }, [isOpen, hasGreeted]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Generate response
    const response = generateBotResponse(text, userName, messages);

    if (response.startsWith('__SET_NAME__')) {
      const name = response.replace('__SET_NAME__', '').trim();
      setUserName(name);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'bot',
          text: `Nice to meet you, **${name}**! 🎉\n\nHow can I help you today? You can ask me about:\n• 🔌 **Components** – Resistors, ICs, Sensors, Modules\n• 🧠 **Microcontrollers** – Arduino, ESP32, Raspberry Pi\n• 💡 **Project Ideas** – B.Tech, IoT, Robotics\n• 🛒 **How to Order** – Step-by-step guide\n• ⚡ **Any electronics question!**`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 800);
    } else {
      addBotMessage(response, 700);
    }
  }, [inputValue, userName, messages, addBotMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format markdown-like text (bold)
  const formatText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      // Handle newlines
      return part.split('\n').map((line, j, arr) => (
        <React.Fragment key={`${i}-${j}`}>
          {line}
          {j < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  const quickReplies = userName
    ? ['Project ideas 💡', 'How to order 🛒', 'ESP32 info', 'Arduino boards', 'Sensors']
    : [];

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className={`fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center
          ${isOpen && !isMinimized ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
          bg-gradient-to-br from-[#C85A32] to-[#A84422] hover:from-[#B04923] hover:to-[#903D1C] text-white hover:scale-110 active:scale-95`}
        aria-label="Open chat assistant"
      >
        <Bot className="w-7 h-7" />
        {/* Pulsing dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed right-6 z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-[#E2E2C5] overflow-hidden transition-all duration-300
            ${isMinimized ? 'bottom-24 w-72 h-14 rounded-2xl' : 'bottom-24 w-80 sm:w-96 h-[520px]'}
          `}
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1C1917] to-[#292524] text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C85A32] flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">IoTBot</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] text-white/70">Online – Ready to help</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(m => !m)}
                className="w-7 h-7 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages area — hidden when minimized */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F0]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-[#C85A32] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className={`max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed
                          ${msg.role === 'user'
                            ? 'bg-[#C85A32] text-white rounded-tr-sm'
                            : 'bg-white border border-[#E2E2C5] text-[#1C1917] rounded-tl-sm shadow-xs'
                          }`}
                      >
                        {formatText(msg.text)}
                      </div>
                      <span className="text-[10px] text-[#78716C] px-1">{msg.time}</span>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-[#E2E2C5] text-[#1C1917] flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full bg-[#C85A32] text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white border border-[#E2E2C5] rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {quickReplies.length > 0 && messages.length > 0 && (
                <div className="px-3 py-2 bg-[#FAF9F0] border-t border-[#E2E2C5] flex gap-1.5 overflow-x-auto scrollbar-none">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => {
                        // Strip emoji and extra whitespace from the reply label
                        const cleanText = reply.replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
                        setMessages(prev => [...prev, {
                          id: Date.now(),
                          role: 'user',
                          text: reply,
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        }]);
                        const response = generateBotResponse(cleanText, userName, messages);
                        addBotMessage(response, 700);
                      }}
                      className="shrink-0 bg-white border border-[#E2E2C5] hover:border-[#C85A32] hover:text-[#C85A32] text-[#57534E] rounded-full px-3 py-1 text-[11px] font-medium transition-colors whitespace-nowrap"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-[#E2E2C5] flex items-center gap-2 shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={userName ? `Ask IoTBot anything...` : `Type your name to get started...`}
                  className="flex-1 text-xs bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl px-3 py-2.5 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32]"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 rounded-xl bg-[#C85A32] hover:bg-[#B04923] disabled:bg-[#E2E2C5] disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
