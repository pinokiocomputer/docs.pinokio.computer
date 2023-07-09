# Pinokio Shell Interface

At the core of Pinokio engine is its **JSON-RPC to Shell Interface**. Its features include:

1. Accept a JSON-RPC formatted request
2. Run ANY command
3. An ability to emit task progress in realtime
4. An interface to parse the terminal result and return a result

This engine powers the [sh](#shell-execution) API, you can also use it when building your own API/apps.

## Shell RPC

As discussed in the [Shell API](#shell-execution) section, You can already use the `sh` method to run shell commands. For example:

```json
{
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "git clone https://github.com/cocktailpeanut/pinokio"
    }
  }]
}
```

While this works perfectly fine for most use cases, sometimes you may want a more low level access to the Pinokio shell interface.

To achieve this, we can directly use the Pinokio shell programattically, instead of using the `sh` API.


## Shell

To put simply, the `sh` API is a JSON-RPC API(remote procedure call) interface to calling the low level shell interface.

But we can directly use the low level shell interface when needed. Some use cases:

1. You need to build a custom app or api that uses the shell, as well as other JavaScript code.
2. You need to process the realtime stream and trigger custom events when certain conditions are met.


The Shell interface is a JavaScript module that gives you full access to the shell stream.

### Creating a shell session

1. The shell interface is accessible as an attribute under the [kernel parameter](api#kernel) when writing an API method.
2. You can acquire a fresh handle to a shell session using `kerhel.sh()`

```javascript
class MyAPI {
  async run(request, ondata, kernel) {

    // 1. get a fresh shell interface
    let sh = kernel.sh()

    // 2. do stuff with the shell
  }
}
module.exports = MyAPI
```

### Making a request to the shell session

Once you have the shell handle, you can make requests to it to run commands:

1. You can make requests to the shell using `sh.request({ message, path }, ondata)` (where `ondata()` is a callback function that streams data (string) in realtime.
2. The `sh.request()` method returns a promise that gets resolved when the command execution is over.
3. The `sh.request()` method does NOT return if you run a command that never returns (for example starting a server that keeps running)


```javascript
class MyAPI {
  async run(request, ondata, kernel) {

    // 1. get a fresh shell interface
    let sh = kernel.sh()

    // 2. make a request to the shell
    let result = await sh.request(request, (stream) => {
      
      // 3. do something with the realtime stream here...

    })

    // 4. do stuff with the terminal string `result`
    return result   // for example you can return `result` immediately, and the `run` method for your API will return `result` as the return value

  }
}
module.exports = MyAPI
```

For example, let's say we want to write an API that runs a python script `run.py` and returns the printed result as the return value.

But there's a twist. The python script prints a lot of things on the screen, and we may only want to extract certain pattern from the full text.

For example, we may want to only extract the part of the full text that's wrapped with `<pinokio></pinokio>`.

```javascript
class Pycaller {
  async run(request, ondata, kernel) {
    /*****************************************************************************************

      EXAMPLE: take a script name, run it, and return the printed result as the return value

      request := {
        method: "run",
        params: {
          script: "run.py"
        }
      }

    *****************************************************************************************/

    // 1. get a fresh shell interface
    let sh = kernel.sh()

    // 2. Compose shell request
    let shell_request = {
      message: `python ${request.params.script}`
    }

    // 3. make a request to the shell
    let result = await sh.request(shell_request, (stream) => {

      // 4. let's emit the incoming data stream as event => This will be automatically displayed in the Pinokio terminal in realtime
      ondata(stream)

    })

    // 5. When the command has finished, extract only the substring that matches `<pinokio>...</pinokio>` pattern and return this as the return value
    const pattern = /<pinokio>(.*?)<\/pinokio>/g;
    const matches = result.match(pattern);

    return matches

  }
}
module.exports = Pycaller
```

As you can see, in this case we are using the shell but also running some post processing tasks (extracting out the `<pinokio>...</pinokio>` patterns before returning), and in this case it's much simpler to write this JavaScript function and use the low level Shell interface instead of trying to do all of this using the `sh` JSON-RPC API.


### Processing the realtime stream

Briefly mentioned above, but often we may want to emit events during the execution in order to notify the client of the progress.

We can use the `ondata()` callback inside the callback function (the second argument in the call `sh.request(request, (stream) => { // do stuff with the stream })`.

```javascript
class MyAPI {
  async run(request, ondata, kernel) {

    // 1. get a fresh shell interface
    let sh = kernel.sh()

    // 2. make a request to the shell
    let started
    await sh.request(req, (stream) => {
      /******************************************************************************

        stream := {
          raw: <the raw text stream (including ANSI escape sequences)>,
          cleaned: <the cleaned version of the full terminal history>
        }

        1. raw: the realtime data stream
        2. cleaned: not a stream, but the full text view of the virtual terminal

      ******************************************************************************/


      // Option 1. We can pass all the raw terminal events to the client
      ondata(stream)

      // Option 2. We can process the `stream.cleaned` attribute to detect any string pattern
      let buffer = ""
      if (this.started) {
        // 1. At first, this.started is "undefined" so this part of the code is never run until this.started is set to true.
        // 2. This is because we may not be interested in the raw stream until we see some start markers.
        // 3. Once "this.started" is set to true, we can then start collecting the incoming data stream in to the buffer
        buffer += stream.raw
      } else {
        // 1. At first this.started is "undefined" so this part of the code will be executed for every incoming event.
        // 2. we keep testing for a pattern and wait until the cleaned terminal text matches some pattern, and set the "started" to true
        // 3. In this case, we are waiting for the "### Response" pattern to show up at least twice, and only when that happens we set this.started to true
        let test = /### Response.*### Response/gs.test(stream.cleaned)
        if (test) {
          this.started = true
        }
      }
    })

    // We finally return the "buffer" string as the response
    return buffer

  }
}
module.exports = MyAPI
```

### Killing a shell session

1. You can manually kill the `sh.request()` process by calling `sh.kill()`
2. When you call `sh.kill()`, the original promise returned by `sh.request()` is resolved.



```javascript
class MyAPI {
  async run(request, ondata, kernel) {

    // 1. get a fresh shell interface
    let sh = kernel.sh()

    // 2. make a request to the shell
    let started
    await sh.request(req, (stream) => {
      
      // 3. do something with the realtime stream := { raw, cleaned }

      // Example a. printing to the screen
      process.stdout.write(stream.raw)

      // Example b. emit websocket events to all connected sessions
      ondata(stream)

      // Example 3. wait until some pattern appears
      if (started) {
        // only triggered after the "started" is set to true
        // do something with the stream
      } else {
        // wait until the cleaned text matches some pattern, and set the "started" to true
        let test = /### Response.*### Response/gs.test(stream.cleaned)
        if (test) {
          started = true
        }
      }
    })

  }
}
module.exports = MyAPI
```

