# Dynamic Scripting

There are multiple ways you can use JavaScript to **dynamically construct the JSON script**.

1. **JavaScript inside JSON:** Evaluating JavaScript inside JSON
2. **JSON from JavaScript:** Evaluating JavaScript to dynamically return JSON
3. **Raw mode:** Not Evaluating anything

## JavaScript inside JSON

> This option is the recommended way to dynamically construct JSON in most cases.
>
> Only use other methods if you can't use this method to dynamically generate JSON.

Pinokio script supports a dynamic template feature that automatically fills out the template expressions at runtime.

> Learn more about templates [here](/processor/decode#template)

Here's an example using the `os` variable in a template expression and running different commands depending on the OS:

```json
{
  "run": [{
    "method": "goto",
    "params": {
      "index": "{{os.platform() === 'darwin' ? 1 : 5}}"
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": "brew install cmake protobuf rust python@3.10 git wget"
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": "git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui automatic1111"
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": "sh webui.sh -f --api",
      "path": "automatic1111"
    }
  }, {
    "method": "goto",
    "params": {
      "index": null
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": "git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui automatic1111"
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": "{{os.platform() === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f --api'}}",
      "path": "automatic1111"
    }
  }]
}
```

0. It first checks if the OS is `darwin` (mac) or not.
1. If it's a mac, it jumps to instruction 1 with the `goto` method
    - which runs the `brew install` command (instruction 1),
    - followed by `git clone` (instruction 2),
    - followed by `sh webui.sh -f --api` (instruction 3),
    - and finally finishes the script with `{ "method": "goto", "params": { index: null } }`
2. If it's not a mac, it jumps to instruction 5 with the `goto` method
    - wich runs `git clone` (instruction 5)
    - followed by checking the os (instruction 6)
    - and if the os is `win32`, runs `webui-user.bat` (instruction 6)
    - if the os is NOT `win32` (linux), runs `bash webui.sh -f --api` (instruction 6)


## JavaScript to return JSON

By default, Pinokio interprets a static JSON file to run instructions.

But sometimes you may want to dynamically generate the JSON script itself, using JavaScript.

To do this, just write a node.js module that returns a JSON object dynamically.

Here's the same example that takes operating systems into account, and exports custom Pinokio script JSON depending on the context:

```javascript
const os = require('os')
const platform = os.platform()
let cmd
if (platform === 'win32') {
  cmd = "webui-user.bat"
} else if (platform === 'darwin') {
  cmd = "sh webui.sh -f --api"
} else {
  cmd = "bash webui.sh -f --api"
}
let general = {
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui automatic1111"
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": cmd,
      "path": "automatic1111"
    }
  }]
}

let mac = {
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "brew install cmake protobuf rust python@3.10 git wget",
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": "git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui automatic1111"
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": cmd,
      "path": "automatic1111"
    }
  }]
}

let x
if (platform === "mac") {
  x = mac
} else {
  x = general
}
module.exports = x
```

## Raw mode

Sometimes you may need to use template expressions but without evaluating them.

In this case you can use three curly brackets:

```
{{{ expression }}}
```

When you include expressions in a raw mode temlate, it will be unwrapped once and turn into a template expression that can be evaluated next time you try to evaluate.

Let's take a look at an example to see when this can be useful. Let's imagine we want to write a Pinokio script to a file using Pinokio script.

The problem is, this script includes a template expression, like this:

```json
{
  "run": [{
    "method": "shell.run",
    "params": "{{ os.platform() === 'win32' ? 'dir' : 'ls' }}"
  }]
}
```

if we naively try to do this, it will look something like this:


```json
{
  "run": [{
    "method": "fs.write",
    "params": {
      "path": "script.json",
      "json2": {
        "run": [{
          "method": "shell.run",
          "params": "{{ os.platform() === 'win32' ? 'dir' : 'ls' }}"
        }]
      }
    }
  }]
}
```

But we may end up with an unexpected behavior. If we run the code above, the template expression will be evaluated when the `fs.write` method is called, therefore the template expression will be evaluated instead of literally being written to the file.

We will end up with a `script.json` file that looks like this:

```json
{
  "run": [{
    "method": "shell.run",
    "params": "ls"
  }]
}
```

or in case of windows:

```json
{
  "run": [{
    "method": "shell.run",
    "params": "dir"
  }]
}
```

So how do we avoid this evaluation and write the template expression literally to the file?

This is where the **raw mode** comes in:

```json
{
  "run": [{
    "method": "fs.write",
    "params": {
      "path": "script.json",
      "json2": {
        "run": [{
          "method": "shell.run",
          "params": "{{{ os.platform() === 'win32' ? 'dir' : 'ls' }}}"
        }]
      }
    }
  }]
}
```

Note that the template expression is wrapped with **3 curly brackets**.

When this script is run, the raw template expression will not be evaluated, but instead be unwrapped and turn into a template expression before being written to the file, and we would end up with the desired `script.json` file that looks like this:

```json
{
  "run": [{
    "method": "shell.run",
    "params": "{{ os.platform() === 'win32' ? 'dir' : 'ls' }}"
  }]
}
```
