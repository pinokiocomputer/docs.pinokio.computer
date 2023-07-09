# self

The `self` refers to the script itself.

Pinokio scripts automatically re-construct themselves every time an instruction is executed, using the following algorithm:

1. Every time an instruction in a `run` array is about to be executed, the following algorithm is run.
2. First reload the currently executing script file. (if the current script is `index.json`, Pinokio automatically reloads the file to put the up-to-date JSON object in memory)
3. Auto-import all JSON and JavaScript modules in the same folder (as well as subfolders) using the [import algorithm](#_13-import)
4. The instruction (often contains template expressions) is filled out with the resulting memory
5. The instantiated instruction is executed.


Here's an example script:

```json
{
  "run": [{
    "method": "set"
    "params": {
      "self": {
        "config.json": {
          "apikey": "blablablabll",
          "apisecret": "secretsecretsecret"
        }
      }
    }
  }, {
    "method": "log",
    "params": {
      "json": "{{self.config}}" 
    }
  }]
}
```

1. When the first instruction is run, it sets the `self.config.apikey` and `self.config.apisecret` values through the [set](../api/datastructure#set) API.
2. The next instruction prints the `self.config`, and this will be based on the most up-to-date memory state, therefore will print the following:

```json
{ "apikey": "blablablabll", "apisecret": "secretsecretsecret" }
```

