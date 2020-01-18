// ./settings/options.js
var list = document.getElementById('whitelist'),
    saved = true,
    unloaded = false;

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

    // get new list
    var whitelist = [];

    (new FormData(e.target)).forEach(function (text) {
        if (!text) return;
        whitelist.push(text);
    });

    // set storage
    chrome.runtime.sendMessage({
        set: {
            whitelist: whitelist
        }
    });

    // save
    saved = true;
};

// unload
window.onbeforeunload =
window.onunload = function (e) {
    if (saved || unloaded) return;

    e.preventDefault();
    e.returnValue = '';
    unloaded = true;

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