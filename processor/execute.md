# Execute

![execute.png](execute.png)

Once the request has been instantiated by the decoder, the request is executed.

## RPC Protocol

Every request takes the following format (an extended version of [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification)):

```json
{
  "uri": <The module path to call (optional)>,
  "method": <method name>,
  "params": <the parameters to pass to the method (optional)>,
  "returns": <return value handler (optional)>,
  "queue": <whether to queue the task or immediately run it (optional)>
}
```

Although it's an "RPC", it's used to make calls to modules that exist LOCALLY on your machine.

Even when the URI is an HTTP path, the HTTP path is merely being used to find the locally downloaded git repository whose remote URI matches the HTTP URI.


## Request Resolution

### overview

RPC, also known as "Remote Procedure Call", by design has the same expressive power as a local procedure call, meaning you can build any program using this convention.

A JSON-RPC request which looks like the following:

```json
{
  "uri",
  "method",
  "params",
  "returns",
  "queue"
}
```

is mapped to the following execution pseudocode:

```
let [RETURNS] = URI.METHOD(PARAMS)
```

### algorithm

Pinokio looks at the `uri` and `method` attributes to figure out which method to call:

#### 1. Process resolution

First, Pinokio needs to find the process using the `uri` attribute:

- **Kernel API:** A kernel API does NOT have a `uri` attribute since it's built into the Pinokio kernel.
- **Custom API:** Everything else relies on the `uri` attribute for process discoverability. If a `uri` is specified, this is used to find the relevant process.
  - **relative path:** If a relative path is used as the URI, Pinokio looks at `~/pinokio/<relative path>` to find the process file.
  - **absolute path:** If an absolute path is used (starts with `/`), it looks at that exact file location on your machine to find the process file.
  - **http git path:** If an HTTP git URI is used, Pinokio looks up all currently running processes to find the one that matches the git URI. This only applies when the process was downloaded from a remote git URL (there's a remote attribute inside the `.git/config` file)

#### 2. Method resolution

Once the process has been identified (a kernel process or a custom API process), Pinokio needs to resolve the specific method (function) within the resolved process:

- **Kernel API:** The "method" attribute refers to the corresponding kernel API.
- **Custom API:** A custom API is always a JavaScript class, which can have one or more public methods. Once the step 1 (process resolution) is successful, Pinokio can simply call the resolved object's method based on the "method" attribute name.

#### 3. Queue

Often, API calls consume a lot of CPU and memory. This is especially the case for most AI engines.

You may want to ensure that there is only one process running for each of these API endpoints at a time. For example, you may have multiple concurrent scripts running simultaneously, each of which is calling the same LLM API.

In this case, you will want to queue the tasks so only one task is running at a time for the LLM API (Instead of immediately running all tasks, which may result in concurrency, which will slow down everything)

You can use the `queue` attribute to achieve this:

```json
{
  "run": [{
    "uri": "https://github.com/malfunctionize/llama.git/index.js",
    "method": "run",
    "params": {
      "message": {
        "m": "../models/stable-vicuna/13b_q4_0.bin",
        "p": "### Instruction\n\n\rI want you to give me a random landmark location. simply write the name of the landmark location. No description. Just the name.\n\n\r### Response\n\n"
      }
    },
    "queue": true
  }]
}
```

By including the `"queue": true`, you can be sure that this API ONLY runs one task at a time, first come first served, regardless of how many scripts are running concurrently and all try to run the same API.

### example

#### Kernel API

```json
{
  "run": [{
    "method": "fs.write",
    "params": {
      "path": "temp.txt",
      "text": "hello world"
    }
  }]
}
```

Above command calls the `write()` method of the kernel's fs module.

#### Custom API

```json
{
  "run": [{
    "uri": "https://github.com/cocktailpeanut/llama.git/index.js",
    "method": "run",
    "params": {
      "p": "### Instruction\n\nName an animal.\n\n### Response\n\n",
      "m": "../models/stable-vicuna/13b_q4_0.bin",
      "n": 256
    }
  }]
}
```

Above command looks for the running process downloaded from https://github.com/cocktailpeanut/llama.git, and calls its `run()` method.

## Response Handling

### input

By default, if a module has a return value, this return value is temporarily stored on the `input` variable, and can be used in the next instruction.

Of course, when the next instruction runs, it will generate its own return value, and the `input` variable will be overwritten with its return value.

### returns

Often you may want to store the return values so they can be used later on in the workflow. You can do that by assigning the return value to a local variable name using the `returns` attribute:


```json
{
  "run": [{
    "uri": "https://github.com/cocktailpeanut/llama.git/index.js",
    "method": "run",
    "params": {
      "p": "### Instruction\n\nName an animal.\n\n### Response\n\n",
      "m": "../models/stable-vicuna/13b_q4_0.bin",
      "n": 256
    },
    "returns": "local.animal"
  }, {
    . . .
  }, {
    "method": "fs.write",
    "params": {
      "json": {
        "animal": "{{local.animal}}"
      }
    }
  }]
}
```

