# RPC API

You can mix and match the core APIs (The kernel APIs) to build a sophisticated API or an app (script).

To make anything runnable, you simply need to create a JSON file with a "run" array.

Let's say you want to fetch some shell script from a URL and write it to a file, and then run it. Simply create a folder at `~/pinokio/api/test`, and create a pinokio script named `index.json`:


```json
{
  "run": [{
    "method": "net",
    "params": {
      "url": "https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh",
      "method": "get",
      "responseType": "text"
    }
  }, {
    "method": "fs.write", 
    "params": {
      "text": "{{input}}",
      "path": "install.sh"
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": "bash install.sh"
    }
  }]
}
```

And this is all you need to do! Just go to the `test` folder in Pinokio app and press "run", and it will execute these commands in order.

