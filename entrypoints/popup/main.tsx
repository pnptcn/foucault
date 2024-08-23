import React from "react"
import ReactDOM from "react-dom/client"
import "@/types/icons"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@elastic/eui/dist/eui_theme_dark.css"
import { EuiProvider } from "@elastic/eui"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <EuiProvider colorMode="dark">
                <App />
            </EuiProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
