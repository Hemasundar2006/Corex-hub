import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '../lib/authContext';
import StoreShell from '../components/StoreShell';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata = {
  title: 'IoT Garage | Electronics Components & WhatsApp Ordering',
  description:
    'Browse and order microcontrollers, sensors, ICs, modules, and DIY electronics supplies directly via WhatsApp. Fast confirmation, student project friendly, verified components.',
  keywords: [
    'Electronics Components',
    'Arduino Uno',
    'ESP32',
    'Sensors',
    'WhatsApp Ordering',
    'Robotics Parts',
    'IoT Garage',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="antialiased bg-[#F5F5DC] text-[#1C1917]"
        suppressHydrationWarning
      >
        <AuthProvider>
          <StoreShell>{children}</StoreShell>
        </AuthProvider>
      </body>
    </html>
  );
}
