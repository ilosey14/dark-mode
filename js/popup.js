(function () {
    var tab;

    // runtime message does not provide a sender.tab
    // object from popup, use query instead
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, tabs => {
        // set tab
        tab = tabs[0];

        // check if already whitelisted
        // and set toggle button
        chrome.runtime.sendMessage({ get: ['whitelist', 'tabs/' + tab.id] }, res => {
            // whitelist
            if (res.whitelist.length && (new RegExp(res.whitelist.join('|'))).test(tab.url)) {
                whitelistPage.disabled =
                theme.disabled = true;

                whitelistPage.title =
                theme.title = 'Already whitelisted. Click "Edit..." to make changes';
            }

            // toggle
            theme.checked = res['tabs/' + tab.id];
        });
    });

    // toggle button
    var theme = document.getElementById('theme-toggle');

    theme.onchange = function () {
        // toggle page
        chrome.tabs.sendMessage(tab.id, { dark: this.checked });

        // set background flag
        chrome.runtime.sendMessage({
            set: {
                dark: this.checked,
                tabs: {
                    [tab.id]: this.checked
                }
            }
        });
    };

    // whitelist current page
    var whitelistPage = document.getElementById('whitelist-page');

    whitelistPage.onclick = function () {
        // get whitelist to update
        chrome.runtime.sendMessage({ get: 'whitelist' }, res => {
            // get current page url
            var url = new URL(tab.url);

            res.whitelist.push(url.origin + '/*');

            chrome.runtime.sendMessage({
                set: {
                    whitelist: res.whitelist
                }
            });
        });
    };

    document.getElementById('whitelist-edit').onclick = function () {
        // chrome.runtime.openOptionsPage();
        chrome.tabs.create({ url: '/options/options.html'});
    };
})();