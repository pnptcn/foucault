import React, { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { scanPageInfo, PageInfo } from "@/lib/trackers"
import { scanPageContext, PageContext } from "@/lib/context"
import { processText } from "@/lib/chunky"
import { Component as Command } from "@/components/command/Component"
import { Settings } from "@/types/settings" // Make sure this type is correctly imported

const defaultSettings: Settings = {
    extractEntities: false
}

interface Profile {
    page: {
        info: PageInfo
        context: PageContext
        content: {
            raw: string
            chunks: string[]
        }
    }
}

export const App: React.FC = () => {
    const [pageLoaded, setPageLoaded] = React.useState(false)
    const [settings, setSettings] = useState<Settings>(defaultSettings)

    const extract = useMutation({
        mutationFn: async (doc) => {
            const formData = new FormData()

            // Create a blob from the document and append it to the form data
            const blob = new Blob([doc], { type: "text/html" }) // Adjust the type based on the document type
            formData.append("files", blob, "document.html") // Adjust the filename based on the document type

            await fetch("http://localhost:5055/ingress", {
                method: "POST",
                body: formData
            })
        }
    })

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

    useEffect(() => {
        const handleLoad = () => {
            console.log("FOUCAULT: Page loaded")
            setPageLoaded(true)
        }

        if (document.readyState === "complete") {
            handleLoad()
        } else {
            console.log("FOUCAULT: Listening for readystatechange event...")
            document.addEventListener("readystatechange", handleLoad)
        }

        return () => {
            document.removeEventListener("readystatechange", handleLoad)
        }
    }, [])

    useEffect(() => {
        if (!pageLoaded) return

        const processPage = async () => {
            const [info, context] = await Promise.all([scanPageInfo(), scanPageContext()])
            const cleaned = [processText()]

            console.log(cleaned)

            extract.mutate(document.body.outerHTML)
        }

        if (settings.extractEntities) {
            processPage().catch((err) => {
                console.error("FOUCAULT: Error scanning page:", err)
            })
        }
    }, [pageLoaded, settings])

    return (
        <div id="foucault">
            <Command />
        </div>
    )
}

export default App
