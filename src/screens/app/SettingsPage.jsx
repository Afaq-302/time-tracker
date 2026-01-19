"use client";

import { useEffect, useState, useCallback } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTheme } from '@/hooks/useTheme';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const defaultPreferences = {
  timeFormat: '24h',
  weekStartDay: 1,
  theme: 'system',
  defaultBillable: true,
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  const requestJson = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Request failed.');
    }
    return data;
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const { settings } = await requestJson('/api/settings');
        if (isActive && settings) {
          setPreferences({
            ...defaultPreferences,
            ...settings,
          });
          if (settings.theme) {
            setTheme(settings.theme);
          }
        }
      } catch (error) {
        if (isActive) {
          toast({
            title: 'Unable to load settings',
            description: error.message || 'Please try again.',
          });
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadSettings();
    return () => {
      isActive = false;
    };
  }, [requestJson, setTheme]);

  const updatePreference = useCallback(async (key, value) => {
    const next = { ...preferences, [key]: value };
    setPreferences(next);

    if (key === 'theme') {
      setTheme(value);
    }

    try {
      await requestJson('/api/settings', {
        method: 'PATCH',
        body: JSON.stringify({ [key]: value }),
      });
      toast({
        title: 'Settings updated',
        description: 'Your preferences have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Settings update failed',
        description: error.message || 'Please try again.',
      });
    }
  }, [preferences, requestJson, setTheme]);

  const resetPreferences = useCallback(async () => {
    setPreferences(defaultPreferences);
    setTheme(defaultPreferences.theme);

    try {
      await requestJson('/api/settings', {
        method: 'PATCH',
        body: JSON.stringify(defaultPreferences),
      });
      toast({
        title: 'Settings reset',
        description: 'Defaults have been restored.',
      });
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: error.message || 'Please try again.',
      });
    }
  }, [requestJson, setTheme]);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage your preferences"
      />

      <div className="max-w-2xl space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how TimeTrack looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Theme</Label>
              <div className={cn("flex gap-3", isLoading && "opacity-60 pointer-events-none")}>
                {themeOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={theme === option.value ? 'default' : 'outline'}
                    disabled={isLoading}
                    className={cn(
                      "flex-1",
                      theme === option.value && "ring-2 ring-ring ring-offset-2"
                    )}
                    onClick={() => setTheme(option.value)}
                  >
                    <option.icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time & Date */}
        <Card>
          <CardHeader>
            <CardTitle>Time & Date</CardTitle>
            <CardDescription>Configure time and date display preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Time Format</Label>
                <p className="text-sm text-muted-foreground">Choose between 12-hour and 24-hour time</p>
              </div>
              <Select
                value={preferences.timeFormat}
                onValueChange={(v) => updatePreference('timeFormat', v)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Week Starts On</Label>
                <p className="text-sm text-muted-foreground">Set the first day of the week</p>
              </div>
              <Select
                value={preferences.weekStartDay.toString()}
                onValueChange={(v) => updatePreference('weekStartDay', parseInt(v, 10))}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>Defaults</CardTitle>
            <CardDescription>Configure default values for new entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Default Billable</Label>
                <p className="text-sm text-muted-foreground">New entries are billable by default</p>
              </div>
              <Switch
                checked={preferences.defaultBillable}
                onCheckedChange={(v) => updatePreference('defaultBillable', v)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>Manage your preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your preferences are stored securely with your account and applied across devices.
            </p>
            <Button
              variant="outline"
              onClick={resetPreferences}
              disabled={isLoading}
            >
              Reset Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
