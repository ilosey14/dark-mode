(function () {
    // basic styling
    // 'html{filter:invert(95%);background-color:#111}img,video,iframe,[style*=background-image]{filter:invert(95%)}';

    var filter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // get resources
    chrome.runtime.sendMessage({
        getTabState: null,
        isWhitelisted: location.href,
        getFilter: null,
    }, res => {
        // check if site is whitelisted
        if (res.isWhitelisted) {
            console.log('[dark mode] site whitelisted by user');
            res.getTabState = false;
        }

        // configure filter
        filter.innerHTML = res.getFilter;

        // apply filter when document is available
        setStyle(res.getTabState);
    });

    /**
     * Sets the dark mode style when the document is first available.
     * @param {bool} enabled Whether dark mode is enabled
     */
    function setStyle(enabled) {
        var head = document.getElementsByTagName('head')[0];

        if (!head) {
            // continue to queue function until the document head is accessible.
            window.setTimeout(setStyle, 5, enabled);
            return;
        }

        if (enabled)
            document.documentElement.classList.add('dark');

        head.appendChild(filter);
    }
})();

// toggle theme live
chrome.runtime.onMessage.addListener(req => {
    document.documentElement.classList.toggle('dark', req.dark);
});