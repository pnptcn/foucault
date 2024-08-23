import React from "react"
import { Component as Header } from "@/components/header/Component"
import Auth from "./Auth"
import Content from "./Content"
import { EuiTabbedContent } from "@elastic/eui"

const ExtensionPopup: React.FC = () => {
    const tabs = [
        {
            id: "auth-tab",
            name: "Auth",
            content: <Auth />
        },
        {
            id: "content-tab",
            name: "Content",
            content: <Content />
        }
    ]
    return (
        <>
            <Header />
            <EuiTabbedContent tabs={tabs} initialSelectedTab={tabs[0]} />
        </>
    )
}

export default ExtensionPopup
