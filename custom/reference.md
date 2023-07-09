# Reference

First of all, a Pinokio API is nothing more than **a mapping from JSON-RPC to a JavaScript function call.**

## Rules

To build your own API, you need to follow the convention expected by the Pinokio API framework.

All Pinokio functions must take the following form:

1. Every API should be stored under its own uniquely named folder under `~/pinokio/api`.
2. The API file must be a JavaScript class with `index.js` as its filename.
3. The JavaScript class must have one or more methods. The method names are important since they will be used in JSON-RPC calls.
4. The methods must follow a specific function signature convention expected by the Pinokio API framework

## API Class

Let's say we want to create an API that takes a JSON-RPC request like this:

```json
{
  "uri": "./echo.js",
  "method": "run",
  "params": {
    "text": "hello world"
  }
}
```

and returns the same value `params.text` (`"hello world"`).

To accomplish this, we just need to write a JavaScript class and a method that looks something like this:

```javascript
class Echo {
  async run (request, ondata, kernel) {
    return request.params.text 
  }
}
module.exports = Echo
```

### class name

The name of the class (`Echo` in this example) here is not important and you can name it whatever you want.

### file name

The file name however, is important. In this case, since the uri is set to `./echo.js`, we need to place the `echo.js` file in the same folder as the Pinokio script JSON file.


## API Method

Each method must follow the protocol (must have a specific function signature):

```javascript
async (request, ondata, kernel) {
  // 1. do something with the request (the JSON-RPC payload)
  // 2. use ondata() to send realtime updates during execution 
  // 3. use kernel to access some kernel level attributes and methods
  // 4. finally, return a value (in case this API has a return value)
}
```

Let's walk through each parameter one by one:

1. request
2. ondata
3. kernel

### request

The `request` object is used to utilize the JSON-RPC request object as well as some additional information.

- `request`: The JSON-RPC request object, along with some additional metadata attached by the Pinokio processor
  - `uri`: The request destination URI
  - `method`: The request method
  - `params`: The request parameter. This is the attribute that's used most frequently to implement APIs
  - `dirname`: The absolute path of the folder that contains the API file being called (For example, `~/pinokio/api/utils`)
  - `cwd`: The absolute path of the folder from which the script is being called. The difference from `dirname` is that the `cwd` is the folder path of the run script that's currently calling this API, whereas the `dirname` is the folder path of the API file being called. Similar to the difference between [process.cwd() and __dirname in node.js](https://www.tutorialspoint.com/difference-between-process-cwd-and-dirname-in-nodejs)
  - `parent`: The parent script file object. Every API call in a single script shares the same `parent` object.
    - `uri`: The uri of the parent script
    - `path`: The absolute file path of the parent script
    - `body`: The actual script body object.
  - `current`: The current instruction index within the `run` array.
  - `next`: The next instruction index within the `run` array. `null` if the current instruction is the last step in the `run` array.


### ondata

The `ondata()` callback function is used to emit events while the API is running.

Often (especially when using AI engines), a single API call may take a while to finish, and it is useful to be able to notify the realtime progress update to the client. 

You can call the `ondata()` callback to trigger these events.

```javascript
ondata(data)
```

- `data`: the raw data stream (string). may includes the following attributes:
  - `raw`: The raw string (can include ANSI characters and escape sequences, and translates 1:1 to a terminal display). Emit this attribute if you need to display escape sequences in the terminal.
  - `state`: The full state representation of the current state. While `raw` represents individual events, the `state` is a single full string that represents the current state.

Here's an example where you can call "say" and it will emit a "hello" event every 1 second, and return "finished" at the end.

```javascript
class Hello {
  async say (request, ondata, kernel) {
    for(let i=0; i<10; i++) {
      // wait 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      // emit "hello " + i event
      ondata({ raw: "hello" })
    }
    return "finished"
  }
}
module.exports = Hello
```

Try saving above file under `~/pinokio/api/hello/index.js`, and then create an example run script at `~/pinokio/api/hello/example.json`:

```json
{
  "run": [{
    "uri": "hello/index.js",
    "method": "say"
  }]
}
```

And when you run the `example.json` script, it will print "hello" to the terminal every 1 second, and after 10 seconds it will return "finished" and halt.

### kernel

Often, the RPC request won't be enough to carry out a task. For example you may need to access some low level methods or attributes.

You can use the `kernel` variable for this. Since the kernel object essentially gives you full access to the entire Pinokio operating system, I can't mention everything, but here are some notable modules worth looking at:

- `kernel`
  - shell: You can use the low level Shell API with [kernel.shell](/custom/shell)

## Example

### API with git URI

Let's imagine a simple script that contains one instruction:

```json
{
  "run": [{
    "uri": "https://github.com/cocktailpeanut/llama.git/index.js",
    "method": "run",
    "params": {
      "message": {
        "p": "### Instruction\n\nWrite a brief controversial opinion.\n\n### Response\n\n",
        "m": "../models/stable-vicuna/13b_q4_0.bin",
        "n": 256
      }
    }
  }]
}
```

The first thing Pinokio does is figuring out which module and its method the `uri` resolves to, according to the [URI resolution convention](../fs/uri#http-path).

A git uri is made up of two components:

```
<remote git URI>/<relative path>
```

In the example above,

1. The `https://github.com/cocktailpeanut/llama.git` part is the `<remote git URI>`
2. The `index.js` part is the `<relative path>`

The actual algorithm:

1. **Begin URI parsing:** Pinokio sees the uri `https://github.com/cocktailpeanut/llama.git/index.js`
2. **Git uri extraction:** the git repository uri is extracted from the full uri: `https://github.com/cocktailpeanut/llama.git`
3. **Git config match:** Pinokio checks if there is any top level folder under `~/pinokio/api` whose `.git/config` includes the matching remote URL `https://github.com/cocktailpeanut/llama.git` (This would imply that the folder has been downloaded from a remote git repository available at the URL)
4. **Endpoint resolution:** If there's a match (let's say it finds one at `~/pinokio/api/llama`), the resolution is complete, and the request is routed to the module inside the matched local folder (`~/pinokio/api/llama`).
5. **Route resolution:** Now that the endpoint has been resolved, Pinokio looks at the `<relative path>` part of the full URI. In this case it's `index.js`. Pinokio takes the resolved endpoint path from the previous step (`~/pinokio/api/llama`) and resolves the rest of the file path `index.js`, and ends up with the full local path `~/pinokio/api/llama/index.js`.
6. **Method resolution:** Pinokio then looks at the JavaScript class file `~/pinokio/api/llama/index.js` and finds the method `run`
7. **Method Execution:** Now that Pinokio knows which method inside which file needs to be executed, the only thing left is to actually execute the method by passing the `params` attribute. 

The `~/pinokio/api/llama/index.js` must follow the [API framework convention](../apps/api#api-framework), and may look something like this:

```javascript
class Llama {
  async run (request, ondata, kernel) {

    // do stuff with the request.params

  }
}
module.exports = Llama
```

The `request` parameter will contain:

```json
{
  uri: 'https://github.com/malfunctionize/llama.git/index.js',
  method: 'run',
  params: {
    message: {
      p: "### Instruction\n\nWrite a brief controversial opinion.\n\n### Response\n\n",
      m: '../models/stable-vicuna/13b_q4_0.bin',
      n: 256
    }
  },
  dirname: '/Users/x/pinokio/api/llama',
  cwd: '/Users/x/pinokio/api/llama/example',
  root: 'https://github.com/malfunctionize/llama.git/example/stable-vicuna-13b-q4_0.json',
  current: 0,
  next: null
}
```

1. `uri`: the full endpoint URI from the **begin URI parsing** step.
2. `method`: the RPC method passed in.
3. `params`: the RPC params passed in.
4. `dirname`: the resolved local path from the **endpoint resolution** step. This is the path under which the resolved module exists
5. `cwd`: the current execution path. This is the folder that contains the script that is running currently. 
6. `root`: the full path for the script file that is currently running.
7. `current`: The current instruction index within the `run` array. In this case it's 0 since it's the first instruction in the `run` array.
8. `next`: The next instruction index to be executed after the current request ends. In this case it's `null` since there is only one item in the `run` array (the current instruction), and `null` means the program will halt after this step.


### API with relative path

Now let's imagie the same script, but with relative path as its URI, instead of the remote git URI.

```json
{
  "run": [{
    "uri": "./index.js",
    "method": "run",
    "params": {
      "message": {
        "p": "### Instruction\n\nWrite a brief controversial opinion.\n\n### Response\n\n",
        "m": "../models/stable-vicuna/13b_q4_0.bin",
        "n": 256
      }
    }
  }]
}
```

Note that the `uri` is a relative path, so it will look for the `index.js` file in the same folder as the script file itself.

