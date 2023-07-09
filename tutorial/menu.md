# Custom menu bar

By default, the top menu bar displays an "Update" button, which when clicked, pulls in updates from the git repository from which the code was downloaded.

## pinokio.json

But you can add additional custom buttons to the menu with `pinokio.js`, for example include a link to an install script, like this:

<p>
<img src="./install.png" class='framed'>
</p>

To achieve this, simply create a file named `pinokio.js` and add items to the `menu` array:

```javascript
module.exports = {
  menu: [{
    html: "<i class='fa-solid fa-plug'></i> Install",
    href: "install.json"
  }]
}
```

Each menu item can have the following attributes:

- `html`: The html code for the item content
- `href` (optional)
  - If specified, renders a button that links to the `href` URL.
  - If not specified, renders a label.

## dynamic menu construction

Sometimes you may want to dynamically generate the menu items instead of always having the same menu.

In this case, instead of setting an array for the `menu` attribute, the menu attribute can be a JavaScript async function that returns an array.

Example:

```json
module.exports = {
  menu: async (kernel) => {

    // Run some logic here to check if all the modules have been installed
    //
    // . . . .
    //

    if (installed) {
      // 1. is it installed already? => display an "installed" label
      return [{
        "html": "Installed"
      }]
    } else {
      // 2. is it not installed? => display an install button
      return [{
        "html": "<i class='fa-solid fa-plug'></i> Install",
        "href": "install.json"
      }]
    }
  }
}
```
