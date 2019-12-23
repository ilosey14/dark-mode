(function () {
    var s = document.createElement('style');
    s.type = 'text/css';
    s.innerHTML = 'html{filter:invert(95%);background-color:#111}img,video,iframe,[style*=background-image]{filter:invert(95%)}';
    // `html{filter:url(${browser.extension.getURL('/css/dark-mode-filter.svg')}#filter)}`;

    browser.storage.local.get('dark', function (response) {
        if (response.dark) {
            browser.storage.local.get('whitelist', function (response) {
                if (!response.whiltelist || !response.whitelist.some(function (pattern) {
                        return location.href.match(new RegExp(pattern));
                    })
                )
                    setStyle();
                else
                    console.log('Site whitelisted')
            });
        }
    });

    function setStyle() {
        if (!document.body) {
            window.setTimeout(setStyle, 5);
            return;
        }

        document.body.appendChild(s);
    }
})();
