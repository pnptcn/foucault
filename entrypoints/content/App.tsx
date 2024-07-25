import React from "react"
import { useMutation } from "@tanstack/react-query"
import { scanPageInfo, PageInfo } from "@/lib/trackers"
import { scanPageContext, PageContext } from "@/lib/context"

interface Profile {
    page: {
        info: PageInfo
        context: PageContext
    }
}

export const App: React.FC = () => {
    const [pageLoaded, setPageLoaded] = React.useState(false)

    const extract = useMutation({
        mutationFn: async (profile: Profile) => {
            await fetch("http://localhost:5050/api/mutation", {
                method: "POST",
                body: JSON.stringify(profile)
            })
        }
    })

    React.useEffect(() => {
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

    React.useEffect(() => {
        if (!pageLoaded) return

        Promise.all([scanPageInfo(), scanPageContext()]).then(([info, context]) => {
            extract.mutate({ page: { info, context } })
        }).catch((err) => {
            console.error("FOUCAULT: Error scanning page:", err)
        })
    }, [pageLoaded])

    return (
        <div id="foucault"></div>
    )
}

export default App
