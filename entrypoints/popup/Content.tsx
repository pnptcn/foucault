import { EuiButton, EuiFieldText, EuiForm, EuiFormRow, EuiSpacer, EuiTitle } from "@elastic/eui"
import React, { useEffect, useState } from "react"

const defaultSettings = {
    extractEntities: false,
    trackPageContext: false,
    scanTrackers: false,
    trackerThreshold: 50
}

export const Content: React.FC = () => {
    const [settings, setSettings] = useState(defaultSettings)

    useEffect(() => {
        const loadSettings = async () => {
            const result = await browser.storage.local.get("foucaultSettings")
            if (result.foucaultSettings) {
                setSettings(result.foucaultSettings)
            } else {
                // If no settings are found, initialize with default settings
                await browser.storage.local.set({ foucaultSettings: defaultSettings })
                setSettings(defaultSettings)
            }
        }

        loadSettings()
    }, [])

    const updateSettings = (newSettings: Settings) => {
        setSettings(newSettings)
        browser.storage.local.set({ foucaultSettings: newSettings })
        browser.runtime.sendMessage({ type: "SETTINGS_UPDATED", settings: newSettings })
    }

    const handleToggle = (key: string) => {
        const newSettings = { ...settings, [key]: !settings[key] }
        updateSettings(newSettings)
    }

    return (
        <>
            <EuiSpacer />
            <EuiTitle size="s">
                <h4>Login</h4>
            </EuiTitle>
            <EuiSpacer />
            <EuiForm component="form">
                <EuiFormRow label="Username" helpText="Please enter your username.">
                    <EuiFieldText name="username" />
                </EuiFormRow>
                <EuiFormRow label="Password" helpText="Please enter your username.">
                    <EuiFieldText name="username" />
                </EuiFormRow>
                <EuiSpacer />
                <EuiButton type="submit" fill>
                    Submit
                </EuiButton>
            </EuiForm>
        </>
    )
}

export default Content
