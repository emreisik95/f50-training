"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, Bell, Shield, Save, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { toast } from "sonner";

interface SettingsContentProps {
  user: {
    full_name: string;
    email: string;
    role: string;
  };
}

export function SettingsContent({ user }: SettingsContentProps) {
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user.full_name,
    email: user.email,
    phone: "",
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success(t.admin.settings.saved);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {t.admin.settings.title}
        </h1>
        <p className="text-white/50">{t.admin.settings.subtitle}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-brand-navy border border-white/10">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white text-white/70"
          >
            <User className="h-4 w-4 mr-2" />
            {t.admin.settings.profile}
          </TabsTrigger>
          <TabsTrigger
            value="gym"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white text-white/70"
          >
            <Building2 className="h-4 w-4 mr-2" />
            {t.admin.settings.gym}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white text-white/70"
          >
            <Bell className="h-4 w-4 mr-2" />
            {t.admin.settings.notifications}
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white text-white/70"
          >
            <Shield className="h-4 w-4 mr-2" />
            {t.admin.settings.security}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-brand-navy border-white/10">
            <CardHeader>
              <CardTitle className="text-white">{t.admin.settings.profile}</CardTitle>
              <CardDescription className="text-white/50">
                {t.admin.settings.profileDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white/70">
                    {t.admin.settings.fullName}
                  </Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, fullName: e.target.value })
                    }
                    className="bg-brand-navy-light border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/70">
                    {t.admin.settings.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="bg-brand-navy-light border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/70">
                    {t.admin.settings.phone}
                  </Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="bg-brand-navy-light border-white/10 text-white"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-brand-orange hover:bg-brand-orange-hover text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t.admin.settings.saving}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t.admin.settings.saveChanges}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gym Tab */}
        <TabsContent value="gym">
          <Card className="bg-brand-navy border-white/10">
            <CardHeader>
              <CardTitle className="text-white">{t.admin.settings.gym}</CardTitle>
              <CardDescription className="text-white/50">
                {t.admin.settings.gymDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gymName" className="text-white/70">
                    {t.admin.settings.gymName}
                  </Label>
                  <Input
                    id="gymName"
                    defaultValue="F50 Training"
                    className="bg-brand-navy-light border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white/70">
                    {t.admin.settings.address}
                  </Label>
                  <Input
                    id="address"
                    className="bg-brand-navy-light border-white/10 text-white"
                    placeholder="Adres..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="hours" className="text-white/70">
                    {t.admin.settings.openingHours}
                  </Label>
                  <Input
                    id="hours"
                    defaultValue="06:00 - 23:00"
                    className="bg-brand-navy-light border-white/10 text-white"
                  />
                </div>
              </div>
              <Button className="bg-brand-orange hover:bg-brand-orange-hover text-white">
                <Save className="h-4 w-4 mr-2" />
                {t.admin.settings.saveChanges}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="bg-brand-navy border-white/10">
            <CardHeader>
              <CardTitle className="text-white">{t.admin.settings.notifications}</CardTitle>
              <CardDescription className="text-white/50">
                {t.admin.settings.notificationsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">{t.admin.settings.emailNotifications}</Label>
                  <p className="text-sm text-white/50">
                    Yeni üye kayıtları ve ödemeler hakkında bildirim al
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">{t.admin.settings.smsNotifications}</Label>
                  <p className="text-sm text-white/50">
                    Acil durumlar için SMS bildirimleri
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-brand-navy border-white/10">
            <CardHeader>
              <CardTitle className="text-white">{t.admin.settings.security}</CardTitle>
              <CardDescription className="text-white/50">
                {t.admin.settings.securityDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-white/70">
                    {t.admin.settings.currentPassword}
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="bg-brand-navy-light border-white/10 text-white"
                  />
                </div>
                <div></div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white/70">
                    {t.admin.settings.newPassword}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-brand-navy-light border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/70">
                    {t.admin.settings.confirmPassword}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-brand-navy-light border-white/10 text-white"
                  />
                </div>
              </div>
              <Button className="bg-brand-orange hover:bg-brand-orange-hover text-white">
                <Shield className="h-4 w-4 mr-2" />
                {t.admin.settings.changePassword}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
