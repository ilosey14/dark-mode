(function () {
    var tab, themeToggle, whitelistPageButton;

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
        chrome.runtime.sendMessage({
            isWhitelisted: tab.url,
            getTabState: tab.id
        }, res => {
            // whitelist
            if (res.isWhitelisted) {
                whitelistPageButton.disabled = true;
                whitelistPageButton.title = 'Already whitelisted. Click "Edit..." to make changes';
            }

            // toggle
            themeToggle.checked = !res.isWhitelisted && res.getTabState;
        });
    });

    // toggle button
    themeToggle = document.getElementById('theme-toggle');

    themeToggle.onchange = function () {
        // toggle page
        chrome.tabs.sendMessage(tab.id, { dark: this.checked });

        // set background flag
        chrome.runtime.sendMessage({
            setTabState: [tab.id, this.checked],
            setIsDark: this.checked
        });
    };

    // whitelist current page
    whitelistPageButton = document.getElementById('whitelist-page');

    whitelistPageButton.onclick = function () {
        var url = new URL(tab.url);

        // append whitelist
        chrome.runtime.sendMessage({
            appendWhitelist: url.origin + '/*'
        });
    };

    // open whitelist page
    document.getElementById('whitelist-edit').onclick = function () {
        chrome.tabs.create({ url: '/options/options.html' });
    };
})();