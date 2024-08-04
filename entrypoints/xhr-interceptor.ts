export default defineContentScript({
    matches: ["<all_urls>"],
    runAt: "document_start",
    main(ctx: ContentScriptContext) {
        console.log("XHR interceptor initializing...")

        const XHR = XMLHttpRequest.prototype
        const originalOpen = XHR.open
        const originalSend = XHR.send

        XHR.open = function (this: XMLHttpRequest, method: string, url: string) {
            console.log(`XHR open called: ${method} ${url}`)

                (this as any)._method = method
                    (this as any)._url = url
            return originalOpen.apply(this, arguments)
        }

        XHR.send = function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
            console.log(`XHR send called for ${(this as any)._method} ${(this as any)._url}`)

            this.addEventListener("loadend", function () {
                console.log(`XHR loadend event fired for ${(this as any)._method} ${(this as any)._url}`)
                let responseData: string
                try {
                    switch (this.responseType) {
                        case "":
                        case "text":
                            responseData = this.responseText
                            break
                        case "json":
                            responseData = JSON.stringify(this.response)
                            break
                        default:
                            responseData = `[${this.responseType} data]`
                    }

                    console.log(`FOUCCAULT send: ${(this as any)._method} ${(this as any)._url}`)

                    browser.runtime.sendMessage(JSON.stringify({
                        type: "interceptedXHR",
                        data: {
                            method: (this as any)._method,
                            url: (this as any)._url,
                            status: this.status,
                            responseType: this.responseType,
                            response: responseData
                        }
                    }), (response: any) => {
                        console.log(response)
                    })
                } catch (error) {
                    console.error("Error in XHR interception:", error)
                }
            })

            return originalSend.apply(this, arguments)
        }

        console.log("XHR interceptor initialized")
    },
})

