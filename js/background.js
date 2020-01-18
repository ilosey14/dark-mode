// init template
const darkMode = (function () {
    var values = {
        filter: null,
        dark: true,
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

    // whitelist
    chrome.storage.local.get('whitelist', res => values.whitelist = (res.whitelist instanceof Array) ? res.whitelist : []);

    // return interface
    return {
        get: function (name) {
            return values[name];
        },
        set: function (name, value) {
            if (values[name] !== undefined)
                values[name] = value;
        }
    };
})();

// handle get/set requests
chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (req.set) {
        for (let name in req.set)
            darkMode.set(name, req.set[name]);

        // update storage
        if (req.set.whitelist)
            chrome.storage.local.set({ whitelist: req.set.whitelist });
    }

    if (req.get) {
        var res = {};

        for (let name of req.get)
            res[name] = darkMode.get(name);

        sendResponse(res);
    }
});