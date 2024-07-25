export interface PageContext {
    localStorage: { [key: string]: any }
    sessionStorage: { [key: string]: any }
    cookies: { [key: string]: string }
}

export const scanPageContext = (): Promise<PageContext> => {
    return new Promise((resolve, reject) => {
        try {
            const context: PageContext = {
                localStorage: {},
                sessionStorage: {},
                cookies: {}
            }

            // Helper function to parse stored values
            const parseStoredValue = (value: string): any => {
                try {
                    return JSON.parse(value)
                } catch {
                    return value
                }
            }

            // Collect localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key) {
                    context.localStorage[key] = parseStoredValue(localStorage.getItem(key) || "")
                }
            }

            // Collect sessionStorage
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i)
                if (key) {
                    context.sessionStorage[key] = parseStoredValue(sessionStorage.getItem(key) || "")
                }
            }

            // Collect cookies
            document.cookie.split(";").forEach(cookie => {
                const [key, value] = cookie.split("=").map(c => c.trim())
                if (key && value) {
                    context.cookies[key] = value
                }
            })

            resolve(context)
        } catch (error) {
            reject(error)
        }
    })
}
