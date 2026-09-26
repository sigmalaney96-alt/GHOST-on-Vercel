// Load Google Sites page as main page on page load
window.addEventListener("load", function() {
    let url = "https://sites.google.com/view/ghost-ubg";
    iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(url);
});

// Prevent nested iframes from being proxied
window.addEventListener('message', function(event) {
    // Check if the message is about an iframe trying to load through UV
    if (event.data && event.data.type === 'iframe-load') {
        // Load iframe without UV proxying
        const iframe = event.source;
        if (iframe) {
            iframe.src = event.data.url;
        }
    }
});

// Intercept iframe src changes to prevent nested proxying
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                const iframe = mutation.target;
                if (iframe.tagName === 'IFRAME' && iframe !== document.getElementById('iframeWindow')) {
                    // This is a nested iframe - don't let it get proxied
                    const src = iframe.getAttribute('src');
                    if (src && src.includes(__uv$config.prefix)) {
                        // Remove UV proxying from nested iframes
                        const decodedUrl = __uv$config.decodeUrl(src);
                        iframe.src = decodedUrl;
                    }
                }
            }
        });
    });

    observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
    });
});
