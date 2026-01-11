"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ScanResult {
  success: boolean;
  result: "allowed" | "denied";
  memberName?: string;
  reason?: string;
}

interface QRScannerProps {
  deviceId: string;
  onScanComplete?: (result: ScanResult) => void;
}

export function QRScanner({ deviceId, onScanComplete }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const cooldownRef = useRef(false);

  const playSound = useCallback(
    (success: boolean) => {
      if (!soundEnabled) return;

      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (success) {
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
      } else {
        oscillator.frequency.value = 300;
        oscillator.type = "square";
      }

      gainNode.gain.value = 0.1;
      oscillator.start();

      setTimeout(() => {
        oscillator.stop();
        ctx.close();
      }, success ? 200 : 400);
    },
    [soundEnabled]
  );

  const validateToken = useCallback(
    async (token: string) => {
      if (cooldownRef.current) return;

      cooldownRef.current = true;

      try {
        const response = await fetch("/api/checkin/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, deviceId }),
        });

        const result: ScanResult = await response.json();
        setLastResult(result);
        playSound(result.success);
        onScanComplete?.(result);

        // Clear result after 3 seconds
        setTimeout(() => {
          setLastResult(null);
          cooldownRef.current = false;
        }, 3000);
      } catch {
        setLastResult({
          success: false,
          result: "denied",
          reason: "Network error",
        });
        playSound(false);

        setTimeout(() => {
          setLastResult(null);
          cooldownRef.current = false;
        }, 3000);
      }
    },
    [deviceId, onScanComplete, playSound]
  );

  const startScanner = useCallback(async () => {
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          validateToken(decodedText);
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start camera"
      );
      setIsScanning(false);
    }
  }, [validateToken]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch {
        // Ignore stop errors
      }
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <Button
          onClick={isScanning ? stopScanner : startScanner}
          variant={isScanning ? "destructive" : "default"}
          size="lg"
        >
          {isScanning ? (
            <>
              <CameraOff className="h-5 w-5 mr-2" />
              Stop Scanner
            </>
          ) : (
            <>
              <Camera className="h-5 w-5 mr-2" />
              Start Scanner
            </>
          )}
        </Button>

        <Button
          onClick={() => setSoundEnabled(!soundEnabled)}
          variant="outline"
          size="lg"
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
      </div>

      {error && (
        <Card className="w-full max-w-md border-destructive">
          <CardContent className="pt-4 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      <div
        id="qr-reader"
        className={`w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden ${
          !isScanning ? "hidden" : ""
        }`}
      />

      {lastResult && (
        <Card
          className={`w-full max-w-md ${
            lastResult.success
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : "border-destructive bg-red-50 dark:bg-red-950"
          }`}
        >
          <CardContent className="pt-6 flex flex-col items-center text-center">
            {lastResult.success ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="mt-4 text-2xl font-bold text-green-700 dark:text-green-300">
                  Welcome!
                </p>
                <p className="text-lg text-green-600 dark:text-green-400">
                  {lastResult.memberName}
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-destructive" />
                <p className="mt-4 text-2xl font-bold text-destructive">
                  Access Denied
                </p>
                {lastResult.reason && (
                  <p className="text-sm text-muted-foreground">
                    {lastResult.reason}
                  </p>
                )}
                {lastResult.memberName && (
                  <p className="text-sm text-muted-foreground">
                    {lastResult.memberName}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {isScanning && !lastResult && (
        <p className="text-muted-foreground animate-pulse">
          Point camera at member&apos;s QR code
        </p>
      )}
    </div>
  );
}
