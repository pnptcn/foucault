export const Interceptor = () => {
    const intercept = () => {
        var xhrOverrideScript = document.createElement("script")
        xhrOverrideScript.type = "text/javascript"
        xhrOverrideScript.innerHTML = `
	  (function() {
		var XHR = XMLHttpRequest.prototype
		var send = XHR.send
		var open = XHR.open
		XHR.open = function(method, url) {
			this.url = url; // the request url
			return open.apply(this, arguments)
		}
		XHR.send = function() {
			this.addEventListener("load", function() {
				console.log("FOUCAULT: Intercepted request", this.url, this.responseText)
			})
			return send.apply(this, arguments)
		}
	  })()
	`
        document.head.prepend(xhrOverrideScript)
    }

    const checkForDOM = () => {
        if (document.body && document.head) {
            intercept()
        } else {
            requestIdleCallback(checkForDOM)
        }

    }

    const init = () => {
        requestIdleCallback(checkForDOM)
    }

    return { init }
}
