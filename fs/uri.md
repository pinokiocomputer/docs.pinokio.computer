# URI

## What is a Pinokio URI?

### Requirements

Normally when we talk about APIs, we think of **remote web servers that can be configured to expose one or more public routes**, to which you can make requests.

However, Pinokio API was designed with a unique set of assumptions:

1. **Local First:** Unlike traditional APIs that assume remote execution, Pinokio assumes the primary use case is interacting with the local machine to carry out tasks. This "local first" assumption is important for running AI tasks with privacy and without censorship.
2. **Zero Configuration:** APIs should require zero configuration, and should "just work" out of the box.
4. **Globally unique resource identifiers for locally hosted APIs:** This sounds like an oxymoron, but it is a unique challenge for autonomous AI engines, because while we assume that the actual task execution will happen locally, there needs to be some way to globally address these locally hosted endpoints. An example solution adopted by Pinokio is to use [public git URIs for calling APIs](#http-path).

### Implementation

1. **JSON RPC:** All API requests are [JSON-RPC](https://www.jsonrpc.org/specification) calls (instead of [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) based)
2. **Automatic 1:1 mapping to local file paths:** Unlike traditional APIs where you can only make requests to manually configured routes, Pinokio automatically creates an endpoint for EVERY file path under the Pinokio file system.
3. **Convention over Configuration:** To automatically map JSON-RPC calls to local file paths, the Pinokio URI framework has a convention you can follow instead of manually specifying exposed routes.


Basically, Pinokio API URIs are unique resource identifiers that automatically map to locally installed folders via HTTP.

## Instant URI

### Convention over Configuration

Similar to how [next.js automatically sets up routes based on convention](https://nextjs.org/docs/pages/building-your-application/routing), Pinokio lets you simply place your workspace folders under the `~/pinokio/api` top level folder, and the files inside your workspace folders will be instantly made available for API reqeusts, each available at URIs based on the file and folder paths.

## URI Types

When making an API request to a Pinokio engine, you can use any of the following 3 URI schemes:

2. Relative path
3. HTTP path

Note that all of these URI schemes resolve to a local file path (even when using the HTTP path option).


### Relative Path

A URI can be a file path. Let's imagine an example project:

```
~/pinokio
  /test
    run.json
    /bin
      install.json
```

Where the `run.json` script looks like this:

```json
{
  "run": [{
    "uri": "./bin/install.json",
    "method": "run",
    "params": {
      ... 
    }
  }]
}
```

Note that the relative path `./bin/install.json` will be resolved against the path of the calling script (`run.json`).


### HTTP Path

An HTTP path exists ONLY for the folders you downloaded from a remote git repository.

#### Spec

The HTTP path is equivalent to the remote git URI, followed by the relative path within the git repository. It takes the following format:

```
<remote git URI>/<relative path>
```

For example, to reference a file at `index.js` inside the https://github.com/cocktailpeanut/llama.git git repository, the HTTP path would look like:

https://github.com/cocktailpeanut/llama.git/index.js


#### How it works

Although the URL looks like a typical HTTP url, it's important to note that the you are not actually making an API request to https://github.com/cocktailpeanut/llama.git/index.js

1. The URI is just a unique identifier used to identify the endpoint and the method to call
2. The `remote git URI` and `relative path` combination is used to uniquely identify where the API files exist on your machine.

#### Where the files are stored

When you download an API from a git repository, Pinokio stores them under the **hex version of the remote git URI**.

For example, if the remote git URI you downloaded were https://github.com/cocktailpeanut/llama.git - Pinokio automatically creates a folder named `0x68747470733a2f2f6769746875622e636f6d2f636f636b7461696c7065616e75742f6c6c616d612e676974` (This is the hex version of the URI) and downloads the remote git repository to that folder.

```
~
  /pinokio
    /api
      /0x68747470733a2f2f6769746875622e636f6d2f636f636b7461696c7065616e75742f6c6c616d612e676974
```

Note that Pinokio automatically generates these folder names when you download APIs from git repositories, but when you're building your own app or api locally, you can name the folders whatever you want:

![folders.png](folders.png)

In above example, the first 4 folders with hex names are the downloaded APIs, whereas the next 2 (**helloworld** and **test**) are locally created folders.


#### Rules

Some rules:

1. The `<remote git URI>` must end with `.git` (This is the standard way to reference git repositories)
2. The URL info is derived from the `.git/config` file within the downloaded repository.

#### Example

This section will explain how the URI to local path resolution is actually carried out.

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

In above example,

1. The `https://github.com/cocktailpeanut/llama.git` part is the `<remote git URI>`
2. The `index.js` part is the `<relative path>`

Resolution algorithm:

1. **Begin URI parsing:** Pinokio sees the uri `https://github.com/cocktailpeanut/llama.git/index.js`
2. **Git uri extraction:** the git repository uri is extracted from the full uri: `https://github.com/cocktailpeanut/llama.git`
3. **Git config match:** Pinokio checks if there is any top level folder under `~/pinokio/api` whose `.git/config` includes a matching remote URL
4. **Endpoint resolution:** If there's a match (let's say it finds one at `~/pinokio/api/0x68747470733a2f2f6769746875622e636f6d2f636f636b7461696c7065616e75742f6c6c616d612e676974`), the resolution is complete, and the request is routed to the module inside the matched local folder (`~/pinokio/api/0x68747470733a2f2f6769746875622e636f6d2f636f636b7461696c7065616e75742f6c6c616d612e676974`).
5. **Route resolution:** Now that the endpoint has been resolved, Pinokio looks at the `<relative path>` part of the full URI. In this case it's `index.js`. Pinokio takes the resolved endpoint path from the previous step (`~/pinokio/api/0x68747470733a2f2f6769746875622e636f6d2f636f636b7461696c7065616e75742f6c6c616d612e676974`) and resolves the rest of the file path `index.js`, and ends up with the full local path `~/pinokio/api/0x68747470733a2f2f6769746875622e636f6d2f636f636b7461696c7065616e75742f6c6c616d612e676974/index.js`.
6. **Method resolution:** Pinokio then looks at the JavaScript class file `~/pinokio/api/0x68747470733a2f2f6769746875622e636f6d2f636f636b7461696c7065616e75742f6c6c616d612e676974/index.js` and finds the method `run`
7. **Method Execution:** Now that Pinokio knows which method inside which file needs to be executed, the only thing left is to actually execute the method by passing the `params` attribute. 

The `~/pinokio/api/0x68747470733a2f2f6769746875622e636f6d2f636f636b7461696c7065616e75742f6c6c616d612e676974/index.js` must follow the [API framework convention](../apps/api#api-framework), and may look something like this:

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

