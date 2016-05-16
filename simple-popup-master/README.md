# simple-popup
A jQuery(optional) plugin to show a popup.

**DEMO:** [http://Alex1990.github.io/simple-popup](http://Alex1990.github.io/simple-popup)

## Usage

As a jQuery plugin:

```js
var popup = $('#popup').popup();

// Open all popups.
popup.open();
// Close all popups.
popup.close();

// Pass a configurable object.
$('#popup').popup({
  width: 400,
  height: 300
});
```

As a native plugin:

```js
var popup = new Popup(document.getElementById('popup'), { width: 400, height: 300 });

// Open this popup.
popup.open();
// Close this popup.
popup.close();
```

Also, this plugin supports as an AMD/CommonJS module.

## Packages

You can use `npm` to install it.

**NPM:**

```bash
npm install simple-popup
```

## Options

- **width**

  Type: `Number` Default: `500`

  The popup width.

- **height**

  Type: `Number` Default: `400`

  The popup height.

- **offsetX**

  Type: `Number` Default: `0`

  The horizontal offset of the popup element.

- **offsetY**

  Type: `Number` Default: `0`

  The vertical offset of the popup element.

- **zIndex**

  Type: `Number` Default: `999`

  The popup element `z-index` value.

- **closeBtnClass**

  Type: `String` Default: `'.popup-close'`

  The close button's `className`.

## Issues

If you came across a bug or usage problem, welcome to submit an issue:
[https://github.com/Alex1990/simple-popup/issues](https://github.com/Alex1990/simple-popup/issues).

## License

Under the MIT license.
