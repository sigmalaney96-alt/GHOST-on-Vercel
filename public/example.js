const uvPrefix = __uv$config.prefix;

function stripUVFromUrl(url) {
    if (!url) return url;

    try {
        if (url.includes(uvPrefix)) {
            const encoded = url.split(uvPrefix).pop();
            return __uv$config.decodeUrl(encoded);
        }
    } catch (err) {
        return url;
    }

    return url;
}

function sanitizeNestedIframe(iframe) {
    if (!(iframe instanceof HTMLIFrameElement)) return;
    if (iframe.id === "iframeWindow") return;

    const src = iframe.getAttribute("src");
    if (!src) return;

    const clean = stripUVFromUrl(src);
    if (clean !== src) {
        iframe.setAttribute("src", clean);
    }
}

window.addEventListener("load", function() {
    let url = "https://sites.google.com/view/ghost-ubg";
    iframeWindow.src = uvPrefix + __uv$config.encodeUrl(url);
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("iframe").forEach(sanitizeNestedIframe);

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (
                mutation.type === "attributes" &&
                mutation.attributeName === "src" &&
                mutation.target.tagName === "IFRAME"
            ) {
                sanitizeNestedIframe(mutation.target);
            }
        }
    });

    observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ["src"]
    });
});
