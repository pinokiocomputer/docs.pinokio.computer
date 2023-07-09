# Interacting with the shell

Simply being able to send off commands to the terminal is not enough if you want to fully control what happens in the terminal.

Often you will need to:

1. **Read and Process:** Read and process realtime data from the terminal (instead of just writing to it)
2. **Wait:** Wait for certain pattern to occur before returning

The event handler (The `on` attribute) lets you achieve this (available with `shell.write` and `shell.enter`).

Let's imagine we want to build an autonomous intelligence that can **install and run programs**.

Often, installing or setting up libraries and packages require an interactive session. Take `npm init` for example. When you run the command, it will get into an interactive mode where the user needs to enter stuff multiple times in order to complete the setup.

Here's an example of what happens when you run `npm init`:

```
> npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (myapp)
```

From this point, the user needs to either press "enter" to fill out the attribute with default values, or enter custom values.

If you keep pressing `enter`, the initialization process will keep filling out the required attributes with the default values and eventually end, and the control will return back to the prompt:

```
> npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (yyy)
version: (1.0.0)
description:
git repository:
author:
license: (ISC)
About to write to /Users/x/Demos/yyy/package.json:

{
  "name": "yyy",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}
> 
```

In this example, we're going to automate this entire `npm init` process using Pinokio, by automatically walking through the entire `npm init` workflow step by step, by simply submitting `enter`:


```json
{
  "run": [{
    "method": "shell.start"
  }, {
    "method": "shell.enter",
    "params": {
      "message": "npm init",
      "on": [{
        "event": "/.+: /",
        "return": true
      }]
    }
  }, {
    "method": "shell.enter",
    "params": {
      "message": "",
      "on": [{
        "event": "/.+: /",
        "return": 2
      }, {
        "event": null,
        "return": null
      }]
    }
  }, {
    "method": "goto",
    "params": {
      "index": "{{input}}"
    }
  }]
}
```

1. First we start a shell session with `shell.start`
2. Then we run `npm init` with `shell.enter`
    1. The entered `message` is `""`. The `shell.enter` will simply press enter in this case.
    2. Note that we have an `on` event handler array. The `on` array can contain as many event handlers as you want but in this case we only have one handler.
    3. The event handler waits for a regular expression `/.+: /` to be printed on the terminal. And when it does, it returns `true`.
    4. In this case, the `/.+: /` event will trigger when it first reaches the `package name: (myapp)` part of the `npm init` execution since it matches the regular expression.
3. Then it goes onto the next step, where it again submits an empty string `""`
    1. This time we have 2 event handlers, executed sequentially.
    2. The first event handler is the same `.+: /` handler, which indicates that we are still in the `npm init` session. This returns 2 (which will be used in the next step)
    3. The second event handler is `event: null`. This is a special event that gets triggered when the terminal encounters a new terminal prompt. In this case it will be `> ` (as shown above), and in this case returns `null`
4. Finally the last step is a `goto` statement, which utilizes the `input` (passed in from the previous step as the return value).
    1. In case of the `/.+: /` pattern, we know we're still in the `npm init` process so it goes to the index 2, which keeps submitting enter keys.
    2. In case of the `null` event, we know we've encountered a terminal prompt, so we need to finish the script. The `goto` method with `index: null` ends the script.

Let's step back and appreciate what we have built.

**We have built something that can write, read, and process anything in terminal, without human intervention.**

