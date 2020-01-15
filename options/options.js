// ./settings/options.js
var list = document.getElementById('whitelist'),
    saved = false;

list.nItems = 0;

// get whitelist
browser.storage.local.get('whitelist', function (result) {
    if (!(result.whitelist instanceof Array)) return;

    result.whitelist.forEach(addItem);
});

// add item button
document.getElementById('whitelist-add-item').onclick = function () {
    addItem();
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
    browser.storage.local.set({
        whitelist: whitelist
    });

    // save
    saved = true;
};

// unload
window.onbeforeunload = function (e) {
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
    li.appendChild(text);

    remove.type = 'button';
    remove.value = 'x';
    remove.onclick = function () {
        this.parentElement.parentElement.removeChild(this.parentElement);
    };
    li.appendChild(remove);

    list.appendChild(li);

    text.focus();

    saved = false;
}