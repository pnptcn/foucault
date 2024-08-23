import { browser } from "wxt/browser"

export default defineBackground(() => {
    let requestHeaders: { [key: string]: string } = {}
    let responseHeaders: { [key: string]: string } = {}

    let currentSettings = {
        extractEntities: false,
        trackPageContext: false,
        scanTrackers: false,
        trackerThreshold: 50
    }

    browser?.webRequest?.onSendHeaders?.addListener(
        (details) => {
            if (details.type === "main_frame") {
                requestHeaders = {}
                details.requestHeaders?.forEach((header) => {
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
                details.responseHeaders?.forEach((header) => {
                    responseHeaders[header.name] = header.value || ""
                })
            }
        },
        { urls: ["<all_urls>"] },
        ["responseHeaders"]
    )

    // Function to parse the response body
    async function parseResponse(response: Blob) {
        console.log("FOUCAULT background parseResponse", response)

        const text = await response.text()
        try {
            return JSON.parse(text)
        } catch (error) {
            console.error("Error parsing JSON:", error)
            return null
        }
    }

    browser?.webRequest?.onCompleted?.addListener(
        async (details) => {
            console.log("FOUCAULT background webRequest.onComplete details", details)

            if (details.type === "main_frame") {
                const filter = browser?.webRequest
                if (!filter) return

                console.log("FOUCAULT background webRequest.onComplete filter", filter)
                let data: BlobPart[] | undefined = []

                filter.ondata = (event: { data: BlobPart }) => {
                    data.push(event.data)
                }

                filter.onstop = async () => {
                    const responseBody = new Blob(data)
                    const parsedJSON = await parseResponse(responseBody)

                    if (parsedJSON) {
                        console.log("Intercepted JSON:", parsedJSON)
                        browser.tabs.sendMessage(details.tabId, {
                            type: "interceptedJSON",
                            data: parsedJSON
                        })
                    }

                    filter.disconnect()
                }
            }
        },
        { urls: ["<all_urls>"] }
    )

    browser?.runtime?.onMessage?.addListener((message, sender, sendResponse) => {
        if (message.type === "SETTINGS_UPDATED") {
            currentSettings = message.settings
            browser.tabs.query({}).then((tabs) => {
                tabs.forEach((tab) => {
                    if (tab.id) {
                        browser.tabs.sendMessage(tab.id, {
                            type: "SETTINGS_UPDATED",
                            settings: currentSettings
                        })
                    }
                })
            })
        }

        if (message.type === "GET_SETTINGS") sendResponse()

        if (message.action === "getHeaders") {
            return Promise.resolve({
                requestHeaders,
                responseHeaders
            })
        }

        if (message.type === "interceptedJSON") {
            console.log("Received intercepted JSON in content script:", message.data)
        }
    })
})
