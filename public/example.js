// Load Google Sites page as main page on page load
window.addEventListener("load", function() {
    let url = "https://sites.google.com/view/ghost-ubg";
    iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(url);
});
