(function () {
    // toggle button
    var theme = document.getElementById('theme-toggle');

    theme.onchange = function () {
        browser.storage.local.set({dark: this.checked});
    };

    theme.checked = browser.storage.local.get('dark', response => {
        theme.checked = response.dark;
        delete theme;
    });

    // whitelist
    document.getElementById('whitelist-page').onclick = function () {
        browser.storage.local.get('whitelist', response => {
            if (!(response.whitelist instanceof Array)) return;

            browser.tabs.query({
                currentWindow: true,
                active: true
            }, tabs => {
                var url = new URL(tabs[0].url);

                response.whitelist.push(url.origin);
                browser.storage.local.set({ whitelist: response.whitelist });
            });
        });
    };

    document.getElementById('whitelist-edit').onclick = function () {
        // browser.runtime.openOptionsPage();
        browser.tabs.create({ url: '/options/options.html'});
    };
})();
