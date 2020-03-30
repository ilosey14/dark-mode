// ./settings/options.js
var list = document.getElementById('whitelist'),
    saved = true;

list.nItems = 0;

// get whitelist
chrome.runtime.sendMessage({ get: ['whitelist'] }, res => res.whitelist.forEach(addItem));

// add item button
document.getElementById('whitelist-add-item').onclick = function () {
    addItem();
    saved = false;
};

// save settings
document.getElementById('whitelist-form').onsubmit = function (e) {
    e.preventDefault();
    saved = true;

    // get new list
    var whitelist = [];

    (new FormData(e.target)).forEach(function (value, name, parent) {
        if (!value) return;

        // test expression
        try {
            new RegExp(value);
        }
        catch {
            var el = document.getElementsByName(name)[0];

            if (!el) return;

            el.onfocus = function () {
                this.classList.remove('invalid');
                this.onfocus = null;
            };

            el.classList.add('invalid');
            saved = false;

            return;
        }

        whitelist.push(value);
    });

    if (!saved) return;

    // set storage
    chrome.runtime.sendMessage({
        set: {
            whitelist: whitelist
        }
    });
};

// unload
window.onbeforeunload =
window.onunload = function (e) {
    if (saved) return;

    e.preventDefault();
    e.returnValue = '';

    return 'Are you sure you want to leave?';
};

function addItem(value = '') {
    var li = document.createElement('li'),
        text = document.createElement('input'),
        remove = document.createElement('input');

    text.type = 'text';
    text.name = 'item-' + list.nItems++;
    text.value = value;
    text.className = 'whitelist-item';
    text.spellcheck = false;
    li.appendChild(text);

    remove.type = 'button';
    remove.value = '\u{274c}';
    remove.onclick = function () {
        li.parentElement.removeChild(li);
    };
    li.appendChild(remove);

    list.insertBefore(li, list.firstElementChild);

    text.focus();
}