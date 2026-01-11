"use client";

import { useEffect, useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface TokenData {
  token: string;
  expiresAt: string;
  memberId: string;
  memberName: string;
}

interface QRDisplayProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function QRDisplay({
  autoRefresh = true,
  refreshInterval = 25000,
}: QRDisplayProps) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const fetchToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/checkin/token", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate token");
      }

      const data: TokenData = await response.json();
      setTokenData(data);

      // Calculate time left
      const expiresAt = new Date(data.expiresAt).getTime();
      const now = Date.now();
      setTimeLeft(Math.max(0, Math.floor((expiresAt - now) / 1000)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setTokenData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-refresh before expiry
  useEffect(() => {
    if (!autoRefresh || !tokenData) return;

    const timer = setInterval(() => {
      fetchToken();
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval, tokenData, fetchToken]);

  if (loading && !tokenData) {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Generating QR code...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <XCircle className="h-12 w-12 text-destructive" />
          <p className="mt-4 text-destructive font-medium">{error}</p>
          <Button onClick={fetchToken} className="mt-4" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Ready to Check-in
        </CardTitle>
        {tokenData && (
          <p className="text-sm text-muted-foreground">
            {tokenData.memberName}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {tokenData && (
          <>
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <QRCodeSVG
                value={tokenData.token}
                size={250}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Expires in{" "}
                <span
                  className={`font-mono font-bold ${
                    timeLeft <= 10 ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {timeLeft}s
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Auto-refreshing every 25 seconds
              </p>
            </div>

            <Button
              onClick={fetchToken}
              variant="ghost"
              size="sm"
              className="mt-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Now
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
