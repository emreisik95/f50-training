"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Scan } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface Device {
  id: string;
  name: string;
  location: string;
  status: string;
  last_seen: string;
}

interface DevicesContentProps {
  devices: Device[];
}

export function DevicesContent({ devices }: DevicesContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t.admin.devices.title}
          </h1>
          <p className="text-white/50">{t.admin.devices.subtitle}</p>
        </div>
        <Button className="bg-brand-orange hover:bg-brand-orange-hover text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t.admin.devices.addDevice}
        </Button>
      </div>

      <Card className="bg-brand-navy border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">{t.admin.devices.deviceName}</TableHead>
                <TableHead className="text-white/70">{t.admin.devices.location}</TableHead>
                <TableHead className="text-white/70">{t.admin.devices.status}</TableHead>
                <TableHead className="text-white/70">{t.admin.devices.lastSeen}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell colSpan={4} className="text-center py-12 text-white/50">
                    <div className="flex flex-col items-center gap-2">
                      <Scan className="h-8 w-8 text-white/30" />
                      <p>{t.admin.devices.noDevices}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                devices.map((device) => (
                  <TableRow key={device.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{device.name}</TableCell>
                    <TableCell className="text-white/70">{device.location}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          device.status === "online"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {device.status === "online" ? t.admin.devices.online : t.admin.devices.offline}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {device.last_seen ? new Date(device.last_seen).toLocaleString() : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
