# Testing the API

Now let's test this API to make sure it works.

Let's write a simple Pinokio run script and store it in the same folder as `example.json` (`~/pinokio/api/utils/example.json`):

```json
{
  "run": [{
    "uri": "utils/index.js",
    "method": "random",
    "params": {
      "items": ["apple", "banana", "orange", "grape", "kiwi"];
    }
  }, {
    "method": "fs.write",
    "params": {
      "text": "{{input}}",
      "path": "random.txt"
    }
  }]
}
```

Now go back to Pinokio app and you will see that the `example.json` file shows up in the explorer. Click, and you'll see the script runner page, with a "run" button.

Click the button and it will run:

1. Get a random item from the given array
2. Write the random item to `random.txt` in the same folder.

After running the script, inside the Pinokio app (or in your OS file explorer) check to see that the `random.txt` file has been created and it contains a random item from the array.

Try clicking the "run" button multiple times, and you will see that every time you press the button, the contents of the `random.txt` file changes.

