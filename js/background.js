// init template
const darkMode = (function () {
    var values = {
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
        get: function (name) {
            return (name.indexOf('/') < 0)
                ? values[name]
                : getValueByPath(values, name);
        },
        set: function (name, value) {
            if (values[name] !== undefined && value !== undefined) {
                if (typeof value === 'object' && !(value instanceof Array))
                    Object.assign(values[name], value);
                else
                    values[name] = value;
            }
        },
        deleteTab: function (id) {
            delete values.tabs[id];
        }
    };

    function getValueByPath(obj, path) {
        for (let name of path.split('/')) {
            if (!obj) break;

            obj = obj[name];
        }

        return obj;
    }
})();

// handle get/set requests
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.set) {
        for (let name in req.set)
            darkMode.set(name, req.set[name]);

        // update storage
        if (req.set.whitelist)
            chrome.storage.local.set({ whitelist: req.set.whitelist });
    }

    if (req.get) {
        var res = {};

        if (!(req.get instanceof Array))
            req.get = [ req.get ];

        for (let name of req.get) {
            res[name] = (name === 'tab')
                ? sender.tab
                : darkMode.get(name);
        }

        sendResponse(res);
    }
});

// clear tab settings
chrome.tabs.onRemoved.addListener(id => {
    darkMode.deleteTab(id);
});

// save dark setting
chrome.windows.onRemoved.addListener(() => {
    chrome.storage.local.set('dark', darkMode.get('dark'));
});