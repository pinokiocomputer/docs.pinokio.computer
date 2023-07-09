# Creating an API

Sometimes you may want to go further than just using the built-in core APIs, and write your OWN code that does something, and call THAT module using your own JSON-RPC syntax.


## Create an API folder

The entire Pinokio file system is stored under `~/pinokio`, and custom APIs are stored under `~/pinokio/api`.

So when building APIs locally, you just need to create a folder under `~/pinokio/api`.

Let's say we wanted to create a Pinokio script API for taking an array and returning a random item from the array. We will call this API endpoint `utils`, and the method name `random`.

For example:

```json
{
  "uri": "utils/index.js",
  "method": "random",
  "params": {
    "items": ["apple", "banana", "orange", "grape", "kiwi"];
  }
}
```

Let's get started by creating an API folder

```
cd ~/pinokio/api
mkdir utils
```

## Create an API class and a method

Now, go into the `utils` folder and create a JavaScript file named `index.js` at `~/pinokio/api/utils/index.js`.

> NOTE:
>
> We must use the exact file name `index.js` since this is how node.js resolves modules automatically.

Here is an example of what `index.js` may look like:

```javascript
class Utils {
  async random(request, ondata, kernel) {

  // Generate a random index within the range of the array length
  let randomIndex = Math.floor(Math.random() * items.length);

  // Access the item at the random index
  let randomItem = items[randomIndex];

  // Return the random item
  return randomItem
}
module.exports = Utils
```

Let's make sure that the API endpoint was created. All you need to do is go back to the Pinokio app and you will see the API show up on the home page. The home page automatically displays all folders under `~/pinokio/api`.

