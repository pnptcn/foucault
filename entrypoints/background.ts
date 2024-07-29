import { browser } from "wxt/browser"

export default defineBackground(() => {
    let requestHeaders: { [key: string]: string } = {}
    let responseHeaders: { [key: string]: string } = {}

    // Inject the script into all pages
    browser.scripting.registerContentScripts([{
        id: "xhr-interceptor",
        js: ["xhr-interceptor.js"],
        matches: ["<all_urls>"],
        runAt: "document_start"
    }])

    browser?.webRequest?.onSendHeaders?.addListener(
        (details) => {
            if (details.type === "main_frame") {
                requestHeaders = {}
                details.requestHeaders?.forEach(header => {
                    requestHeaders[header.name] = header.value || ""
                })
            }
        },
        { urls: ["<all_urls>"] },
        ["requestHeaders"]
    )

    browser?.webRequest?.onHeadersReceived?.addListener(
        (details) => {
            if (details.type === "main_frame") {
                responseHeaders = {}
                details.responseHeaders?.forEach(header => {
                    responseHeaders[header.name] = header.value || ""
                })
            }
        },
        { urls: ["<all_urls>"] },
        ["responseHeaders"]
    )

    browser?.runtime?.onMessage?.addListener((message, sender) => {
        console.log("Received message in background:", message)

        if (message.action === "getHeaders") {
            return Promise.resolve({ requestHeaders, responseHeaders })
        }

        if (message.type === "interceptedXHR") {
            console.log("Received intercepted XHR in background script:", message.data)
            // Process the intercepted XHR data here
            // For example, you could store it, analyze it, or send it to a server
        }
    })
})
