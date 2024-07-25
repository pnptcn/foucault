/*
TrackerInfo defines the structure for tracking scripts' information.
It includes regex patterns, script sources, code snippets, and global variables
to identify various tracking technologies on a webpage.
*/
interface TrackerInfo {
    r: RegExp
    s: string[]
    c: string[]
    g: string[]
}

/*
TrackerDictionary is a collection of TrackerInfo objects.
This allows for easy addition or modification of tracker types
without changing the core scanning logic.
*/
interface TrackerDictionary {
    [key: string]: TrackerInfo
}

/*
PageInfo represents the structure of the data collected about a webpage.
This includes metadata and identified trackers, providing a comprehensive
overview of the page's characteristics and tracking technologies.
*/
export interface PageInfo {
    url: string
    title: string
    description?: string
    keywords?: string[]
    author?: string
    trackers?: {
        [key: string]: string | boolean
    }
}

/*
scanPageInfo scans the current webpage for metadata and tracking technologies.
This serves two purposes:

1. It provides page (meta) data that is joined onto any data collected, and potentially
   processed downstream, adding lineage and context to the data.
2. It connects any uniquely identifiable markers (e.d. tracker signatures) to the
   page, which may uncover hidden relationships with other sites, should they use the same
   tracking IDs.
*/
export const scanPageInfo = (): Promise<PageInfo> => {
    return new Promise((resolve, reject) => {
        try {
            // Tracker definitions for various popular analytics and marketing tools.
            const t: TrackerDictionary = {
                ga: { r: /UA-\d+-\d+|G-[A-Z0-9]+/, s: ["www.google-analytics.com"], c: ["ga(", "gtag("], g: ["ga", "gtag"] },
                gtm: { r: /GTM-[A-Z0-9]+/, s: ["www.googletagmanager.com"], c: ["gtm.start"], g: ["google_tag_manager"] },
                fbp: { r: /\d{15,16}/, s: ["connect.facebook.net"], c: ["fbq("], g: ["fbq"] },
                hj: { r: /\d{7}/, s: ["static.hotjar.com"], c: ["hjSettings"], g: ["hj"] },
                adsense: { r: /pub-\d+/, s: ["pagead2.googlesyndication.com"], c: ["adsbygoogle"], g: [] },
                matomo: { r: /"siteId": \d+/, s: ["matomo.php", "piwik.php"], c: ["Matomo", "Piwik"], g: [] }
            }

            // Initialize result object with basic page information.
            const res: PageInfo = {
                url: window.location.href,
                title: document.title
            }

            const trackers: { [key: string]: string } = {}

            // Extract metadata from meta tags.
            document.querySelectorAll("meta").forEach((m: HTMLMetaElement) => {
                const n = m.getAttribute("name")
                const p = m.getAttribute("property")
                const c = m.getAttribute("content")
                if (c) {
                    // Prioritize "og:description" over "description" for more comprehensive info.
                    if (n === "description" || p === "og:description") res["description"] = c
                    else if (n === "keywords") res["keywords"] = c.split(",").map(k => k.trim()).filter(Boolean)
                    else if (n === "author") res["author"] = c
                }
            })

            // Scan script tags for tracker signatures.
            document.querySelectorAll("script").forEach((s: HTMLScriptElement) => {
                Object.entries(t).forEach(([k, { r, s: ss, c }]) => {
                    // Look for tracker-specific code patterns.
                    if (c && s.textContent) {
                        const match = s.textContent.match(r)
                        if (match) {
                            trackers[k] = match[0]
                        }
                    }
                })
            })

            // Add trackers if we found any.
            if (trackers.length) {
                res["trackers"] = trackers
            }

            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}

