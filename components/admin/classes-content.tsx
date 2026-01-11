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
import { Plus, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface ClassItem {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled: number;
}

interface ClassesContentProps {
  classes: ClassItem[];
}

export function ClassesContent({ classes }: ClassesContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t.admin.classes.title}
          </h1>
          <p className="text-white/50">{t.admin.classes.subtitle}</p>
        </div>
        <Button className="bg-brand-orange hover:bg-brand-orange-hover text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t.admin.classes.addClass}
        </Button>
      </div>

      <Card className="bg-brand-navy border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">{t.admin.classes.className}</TableHead>
                <TableHead className="text-white/70">{t.admin.classes.instructor}</TableHead>
                <TableHead className="text-white/70">{t.admin.classes.schedule}</TableHead>
                <TableHead className="text-white/70">{t.admin.classes.capacity}</TableHead>
                <TableHead className="text-white/70">{t.admin.classes.enrolled}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell colSpan={5} className="text-center py-12 text-white/50">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="h-8 w-8 text-white/30" />
                      <p>{t.admin.classes.noClasses}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((classItem) => (
                  <TableRow key={classItem.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{classItem.name}</TableCell>
                    <TableCell className="text-white/70">{classItem.instructor}</TableCell>
                    <TableCell className="text-white/70">{classItem.schedule}</TableCell>
                    <TableCell className="text-white/70">{classItem.capacity}</TableCell>
                    <TableCell>
                      <Badge className="bg-brand-orange/20 text-brand-orange border-brand-orange/30">
                        {classItem.enrolled}/{classItem.capacity}
                      </Badge>
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
