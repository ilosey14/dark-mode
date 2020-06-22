// init template
const darkMode = (function () {
    const values = {
        filter: null,
        dark: true,
        tabs: {},
        whitelist: []
    };

    // read in svg filter from filter
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'document';
    xhr.onload = function () {
        if (!this.response) return;

        values.filter = this.responseXML.documentElement.innerHTML;
    };

    xhr.open('GET', chrome.extension.getURL('/css/dark-mode-filter.svg'));
    xhr.send();

    // dark setting
    chrome.storage.local.get('dark', res => values.dark = res.dark || true);

    // whitelist
    chrome.storage.local.get('whitelist', res => values.whitelist = (res.whitelist instanceof Array) ? res.whitelist : []);

    // return interface
    return {
        /**
         * Gets the dark mode filter mark up.
         */
        getFilter: function () {
            return values.filter;
        },
        /**
         * Gets the global default dark state of th extension.
         */
        getIsDark: function() {
            return values.dark;
        },
        /**
         * Sets the global default dark state of the extension.
         * @param {bool} dark
         */
        setIsDark: function (sender, dark) {
            values.dark = dark;
        },
        /**
         * Gets the tab object from the sender.
         * @param {object} sender
         */
        getTab: function (sender) {
            return sender.tab;
        },
        /**
         * Adds a tab value-pair flag by its id.
         * @param {string|number} id Tab id to add
         */
        addTab: function (id) {
            if (values.tabs[id]) true;

            values.tabs[id] = values.dark;
        },
        /**
         * Deletes a tab value-pair flag by its id.
         * @param {string|number} id Tab id to delete
         */
        deleteTab: function (id) {
            delete values.tabs[id];
        },
        /**
         * Sets a tab's dark mode state by its id.
         * @param {string|number} id Tab id to set
         * @param {bool} dark Whether the tab is in dark mode.
         */
        setTabState: function (sender, id, dark) {
            id = id || sender.tab.id;
            if (values.tabs[id] !== undefined)
                values.tabs[id] = dark;
        },
        /**
         * Gets a tab's dark mode state by its id.
         * @param {string|number} id Tab id to get
         */
        getTabState: function (sender, id) {
            id = id || sender.tab.id;
            return values.tabs[id];
        },
        /**
         * Gets the url whitelist array.
         */
        getWhitelist: function () {
            return values.whitelist;
        },
        /**
         * Sets the url whitelist array.
         * @param {string[]} whitelist
         */
        setWhitelist: function (sender, whitelist) {
            values.whitelist = whitelist;
            chrome.storage.local.set({ whitelist: whitelist });
        },
        /**
         * Appends an item to the url whitelist array.
         * @param {string} url Url to whitelist
         */
        appendWhitelist: function (sender, url) {
            values.whitelist.push(url);
            chrome.storage.local.set({ whitelist: values.whitelist });
        },
        /**
         * Checks whether a url has been whitelisted.
         */
        isWhitelisted: function (sender, url) {
            return (values.whitelist.length &&
                (new RegExp(values.whitelist.join('|'))).test(url));
        }
    };
})();

// handle get/set requests
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    var res = {};

    for (let p in req) {
        if (typeof darkMode[p] !== 'function') continue;

        res[p] = darkMode[p](sender, ...makeArray(req[p]));
    }

    sendResponse(res);
});

// set tab settings
chrome.tabs.onCreated.addListener(tab => {
    darkMode.addTab(tab.id);
});

// clear tab settings
chrome.tabs.onRemoved.addListener(id => {
    darkMode.deleteTab(id);
});

// save dark setting
chrome.windows.onRemoved.addListener(() => {
    chrome.storage.local.set({ dark: darkMode.getIsDark() });
});

//
// functions
//

/**
 * Ensures an object is an array.
 * This enables param array function signatures..
 * @param {any} obj
 */
function makeArray(obj) {
    return (obj instanceof Array) ? obj : [ obj ];
}