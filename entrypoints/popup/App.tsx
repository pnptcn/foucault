import React from "react"
import { Switch } from "@/components/ui/switch"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

function App() {
    const [active, setActive] = React.useState(false)
    const [replaceInputs, setReplaceInputs] = React.useState(false)

    React.useEffect(() => {
        browser.runtime.sendMessage({ message: { tweak: active } })
    }, [active])

    return (
        <div style={{ width: 350, padding: 20, background: "rgba(0, 0, 0, 0.5)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "space-around" }}>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Extract Entities & Relations</CardTitle>
                        <CardDescription>Tweak CSS on any page, live!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Switch onCheckedChange={() => setActive(!active)} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )

}

export default App
