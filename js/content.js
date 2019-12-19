(function () {
    var s = document.createElement('style');
    s.type = 'text/css';
    s.innerHTML = 'body{filter:invert(95%);background-color:#eee}img,video,iframe,[style*=background-image]{filter:invert(95%)}';

    browser.storage.local.get('dark', function (r) {
        if (r.dark) {
            browser.storage.local.get('whitelist', function (r) {
                if (!r.whiltelist ||
                    (r.whitelist && !r.whitelist.some(function (pattern) {
                        return location.href.match(new RegExp(pattern));
                    }))
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
