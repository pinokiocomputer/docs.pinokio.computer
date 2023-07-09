# Self driving scripts

By default you need to click "Run" (or invoke them programmatically) to run a script.

But often you may want certain scripts to automatically run themselves whenever Pinokio rstarts.

For example if your script involves starting a server, you would probably want the server to automatically start whenever Pinokio starts.

Otherwise you would have to manually start all the servers required to run your scripts every time you restart Pinokio.

You can configure this by placing a special purpose file named `pinokio.js` in your project home directory. Let's imagine a project folder called `myscript`:


```
~/pinokio
  /api
    /myscript
      install.json
      start.json
```

We want Pinokio to automatically run `~/pinokio/api/myscript/start.json` whenever it restarts.

## pinokio.json

All we need to do is to create a file named `pinokio.js` and return a JSON object with its `start` attribute pointing to the start script file. Here's an example `pinokio.js` file:

```javascript
// pinokio.js
module.exports = {
  "start": "start.json"
}
```

The resulting file structure will look like this:

```
~/pinokio
  /api
    /myscript
      pinokio.js
      install.json
      start.json
```

Now when you restart Pinokio, Pinokio will automatically run the `start.json` script at the beginning.

## dynamic start script

Sometimes you may not want to trigger the start script until some condition is met.

For example, your `start.json` script may involve launching a web server, but this only makes sense when the web server is fully set up, or installed.

In this case, instead of setting a static value for the `start` attribute, the start attribute can be a JavaScript async function that returns the value:

```javascript
// pinokio.js
module.exports = {
  "start": async (kernel) => {
    
    // Run some logic here to check if all the modules have been installed
    //
    // . . . .
    //

    if (installed) {
      return "start.json"
    }
  }
```
