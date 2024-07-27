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

    // Function to parse the response body
    async function parseResponse(response) {
      console.log("FOUCAULT", response)

      const text = await response.text()
      try {
        return JSON.parse(text)
      } catch (error) {
        console.error('Error parsing JSON:', error)
        return null
      }
    }

    browser?.webRequest?.onCompleted?.addListener(
      async (details) => {
        console.log("FOUCAULT", details)
        
        if (details.type === 'main_frame') {
          const filter = browser.webRequest.filterResponseData(details.requestId)
          let data = []

          filter.ondata = (event) => {
            data.push(event.data)
          }

          filter.onstop = async () => {
            const responseBody = new Blob(data)
            const parsedJSON = await parseResponse(responseBody)

            if (parsedJSON) {
              console.log('Intercepted JSON:', parsedJSON)
              // You can perform any operations on the JSON here
              // For example, you could send it to your content script:
              browser.tabs.sendMessage(details.tabId, {
                type: 'interceptedJSON',
                data: parsedJSON
              })
            }

            filter.disconnect()
          }
        }
      },
      { urls: ['<all_urls>'] }
    )

    browser?.runtime?.onMessage?.addListener((message, sender) => {
      if (message.action === "getHeaders") {
        return Promise.resolve({ requestHeaders, responseHeaders })
      }

      if (message.type === 'interceptedJSON') {
        console.log('Received intercepted JSON in content script:', message.data)
        // You can manipulate the DOM or perform other actions here based on the JSON data
      }
    })
})
