import "./globals.css"
import ReactDOM from "react-dom/client"
import App from "./content/App.tsx"
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query"

export default defineContentScript({
    matches: ["*://*/*"],
    cssInjectionMode: "ui",

    async main(ctx) {
        const ui = await createShadowRootUi(ctx, {
            name: "wxt-react-example",
            position: "inline",
            anchor: "body",
            append: "first",
            onMount: (container) => {
                console.log("FOUCAULT: container", container)
                const foucaultRoot = document.createElement("div")
                foucaultRoot.id = "foucault-root"
                container.appendChild(foucaultRoot)

                const queryClient = new QueryClient()
                const root = ReactDOM.createRoot(foucaultRoot)

                root.render(
                    <QueryClientProvider client={queryClient}>
                        <App />
                    </QueryClientProvider>
                )
                return root
            },
            onRemove: (root) => {
                root?.unmount()
            },
        })

        ui.mount()
    }
})

