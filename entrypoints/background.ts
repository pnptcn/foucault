import { browser } from "wxt/browser"

export default defineBackground(() => {
    let requestHeaders: { [key: string]: string } = {}
    let responseHeaders: { [key: string]: string } = {}

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
        if (message.action === "getHeaders") {
            return Promise.resolve({ requestHeaders, responseHeaders })
        }
    })
})
