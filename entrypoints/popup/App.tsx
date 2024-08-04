import React, { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const defaultSettings = {
    extractEntities: false,
    trackPageContext: false,
    scanTrackers: false,
    trackerThreshold: 50
}

const ExtensionPopup: React.FC = () => {
    const [settings, setSettings] = useState(defaultSettings)

    useEffect(() => {
        browser.storage.local.get("foucaultSettings").then((result) => {
            if (result.foucaultSettings) {
                setSettings(result.foucaultSettings)
            }
        })
    }, [])

    const updateSettings = (newSettings) => {
        setSettings(newSettings)
        browser.storage.local.set({ foucaultSettings: newSettings })
        browser.runtime.sendMessage({ type: "SETTINGS_UPDATED", settings: newSettings })
    }

    const handleToggle = (key) => {
        const newSettings = { ...settings, [key]: !settings[key] }
        updateSettings(newSettings)
    }

    const handleThresholdChange = (e) => {
        const newSettings = { ...settings, trackerThreshold: e.target.value }
        updateSettings(newSettings)
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Foucault Settings</CardTitle>
                <CardDescription>Configure extension features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="extract-entities">Extract Entities</Label>
                    <Switch
                        id="extract-entities"
                        checked={settings.extractEntities}
                        onCheckedChange={() => handleToggle("extractEntities")}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="track-context">Track Page Context</Label>
                    <Switch
                        id="track-context"
                        checked={settings.trackPageContext}
                        onCheckedChange={() => handleToggle("trackPageContext")}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="scan-trackers">Scan for Trackers</Label>
                    <Switch
                        id="scan-trackers"
                        checked={settings.scanTrackers}
                        onCheckedChange={() => handleToggle("scanTrackers")}
                    />
                </div>
                {settings.scanTrackers && (
                    <div className="space-y-2">
                        <Label htmlFor="tracker-threshold">Tracker Detection Threshold</Label>
                        <Input
                            id="tracker-threshold"
                            type="number"
                            value={settings.trackerThreshold}
                            onChange={handleThresholdChange}
                            min="0"
                            max="100"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ExtensionPopup
