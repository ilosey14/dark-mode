(function () {
    // basic styling
    // 'html{filter:invert(95%);background-color:#111}img,video,iframe,[style*=background-image]{filter:invert(95%)}';

    var filter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // get resources
    chrome.runtime.sendMessage({
        get: ['dark', 'whitelist', 'filter', 'tab']
    }, res => {
        // check if site is whitelisted
        if (res.whitelist.length &&  (new RegExp(res.whitelist.join('|'))).test(location.href)) {
            console.log('[dark mode] site whitelisted by user');
            return;
        }

        // configure filter
        filter.innerHTML = res.filter;

        // apply filter when document is available
        setStyle(res.dark);

        // log theme for tab
        chrome.runtime.sendMessage({
            set: {
                tabs: {
                    [res.tab.id]: res.dark
                }
            }
        });
    });

    function setStyle(enabled) {
        var head = document.getElementsByTagName('head')[0];

        if (!head) {
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