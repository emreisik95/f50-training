"use client";

import { useState, useEffect } from "react";
import { QRScanner } from "@/components/checkin/qr-scanner";
import { Dumbbell, Clock } from "lucide-react";
import Link from "next/link";

// Generate or retrieve device ID
function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem("kiosk_device_id");
  if (!deviceId) {
    deviceId = `kiosk_${crypto.randomUUID()}`;
    localStorage.setItem("kiosk_device_id", deviceId);
  }
  return deviceId;
}

export default function ScannerPage() {
  const [deviceId, setDeviceId] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setDeviceId(getDeviceId());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      <header className="p-4 flex items-center justify-between border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Dumbbell className="h-8 w-8" />
          <span className="text-xl font-bold">F50 Gym</span>
        </Link>

        <div className="flex items-center gap-2 text-white">
          <Clock className="h-5 w-5" />
          <span className="font-mono text-lg">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Member Check-in</h1>

        {deviceId && <QRScanner deviceId={deviceId} />}
      </main>

      <footer className="p-4 text-center text-slate-500 text-sm">
        Kiosk Mode • Device: {deviceId.slice(0, 20)}...
      </footer>
    </div>
  );
}
