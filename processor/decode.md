# Decode

![decode.png](decode.png)

A typical Pinokio script contains template expressions.

Without template expressions, you would only be able to run static commands. What we want is to be able to dynamically form requests on the fly, so every run can run a unique request workflow based on the current state of the Pinokio state machine.

## Template

A Pinokio template expression is a string surrounded by <span v-pre>`{{ }}`</span>, and filled out on the fly when a command is run. Example:

```json
{
  "method": "set",
  "params": {
    "name": "{{input}}"
  }
}
```

So, what can go inside the <span v-pre>`{{ }}`</span> expression?

1. Any JavaScript evaluation expression: It is recommended to use only simple expressions, but any expression you can run in node.js can be included. For example: <span v-pre>`{{Buffer.from(input.images[0], "base64")}}`</span>
2. Must use the variables currently available in memory at the time of execution.

## Variables

Here are the memory variables available for filling out template expressions:

- `uri`: The request uri that triggered the script execution
- `cwd`: The current execution path
- `event`: A variable used by some API methods (such as `shell.write` or `shell.enter`)
- `input`: a value passed in from the previous step
- `local`: local variable
- `global`: global variable
- `self`: the instruction code (JSON) itself.
- `current`: the current instruction index
- `next`: the next instruction index (`null` if this is the final instruction)
- `_`: [lodash](https://lodash.com/). Includes many utility functions for dealing with data
- `os`: The [node.js os](https://nodejs.org/api/os.html) object. You can use this to determine the device platform, architecture, etc.
- `path`: The [node.js path](https://nodejs.org/api/path.html) module. You can use this to access various path related methods inside the template, such as `path.dirname()`, `path.resolve()`, etc.
- `system`: [https://github.com/sebhildebrandt/systeminformation](systeminformation module) used to get various low level system related values

### input

See [input](../memory/input)

### local

See [local variable](../memory/local)

### global

See [global variable](../memory/global)


### self

See [self](../memory/self)

### current

The `current` variable points to the index of the currently executing instruction within the `run` array. For example:

```json
{
  "run": [{
    "method": "log",
    "params": {
      "raw": "running instruction {{current}}"
    }
  }, {
    "method": "log",
    "params": {
      "raw": "running instruction {{current}}"
    }
  }, {
    "method": "log",
    "params": {
      "raw": "running instruction {{current}}"
    }
  }]
}
```

will print:

```
running instruction 0
running instruction 1
running instruction 2
```

### next

The `next` variable points to the index of the next instruction to be executed. (`null` if the current instruction is the final instruction in the `run` array):

```json
{
  "run": [{
    "method": "log",
    "params": {
      "raw": "running instruction {{current}}. next instruction is {{next}}"
    }
  }, {
    "method": "log",
    "params": {
      "raw": "running instruction {{current}}. next instruction is {{next}}"
    }
  }, {
    "method": "log",
    "params": {
      "raw": "running instruction {{current}}. next instruction is {{next}}"
    }
  }]
}
```

Above command will print the following:


```
running instruction 0. next instruction is 1
running instruction 1. next instruction is 2
running instruction 2. next instruction is null
```

### _

The `_` is the utility variable that lets you easily manipulate data inside template expressions, powered by [lodash](https://lodash.com/).

Example:

```json
{
  "run": [{
    "method": "log",
    "params": {
      "raw": "{{_.difference([2, 1], [2, 3])}}"
    }
  }]
}
```

will print:

```
1
```

Another example, where we use the `_.sample()` method to randomly pick an item from the `self.friends` variable:

```json
{
  "friends": [
    "HAL 9000",
    "Deep Blue",
    "Watson",
    "AlphaGo",
    "Siri",
    "Cortana",
    "Alexa",
    "Google Assistant",
    "OpenAI",
    "Tesla Autopilot",
    "IBM Watson",
    "Boston Dynamics",
    "IBM Deep Blue",
    "Microsoft Tay",
    "IBM DeepMind",
    "Amazon Rekognition",
    "OpenAI GPT-3"
  ],
  "run": [{
    "method": "log",
    "params": {
      "raw": "random friend: {{_.sample(self.friends)}}"
    }
  }, {
    "method": "log",
    "params": {
      "raw": "random friend: {{_.sample(self.friends)}}"
    }
  }, {
    "method": "log",
    "params": {
      "raw": "random friend: {{_.sample(self.friends)}}"
    }
  }]
}
```

Above script prints randomly picked items, for example:

```
random friend: IBM DeepMind
random friend: HAL 9000
random friend: Amazon Rekognition
```

### os

Pinokio exposes the [node.js os module](https://nodejs.org/api/os.html) through the `os` variable.

For example, ee can use the `os` variable to dynamically figure out which platform the script is running on and perhaps shape the commands based on the platform. Example:

```json
{
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "{{os.platform() === 'win32' ? 'dir' : 'ls'}}"
    }
  }]
}
```

Above script:

1. runs `dir` on windows
2. runs `ls` on non-windows operating systems (mac, linux)


## Timing

Instructions are decoded for every step (meaning, the template expressions are filled out on the fly when a request is about to be executed).

This means, every time an instruction is run, it is instantiated with the most up-to-date state of the state machine.

For example, the second instruction from the `run` array below is not instantiated until it's time to run it, so the <span v-pre>`{{input}}`</span> expression can be filled in using the variable `input` from the instruction right before it.

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
  }, {
    "uri": "https://github.com/cocktailpeanut/automatic1111.git/index.js",
    "method": "run",
    "params": {
      "cfg_scale": 7,
      "steps": 30,
      "prompt": "{{input}}"
    }
  }]
}
```

This also means you can keep extending the instruction set WHILE the instructions are running. Here is a (somewhat convoluted) example to demonstrate how this can work:

```json
// index.json
{
  "run": [{
    "uri": "https://github.com/cocktailpeanut/llama.git/index.js",
    "method": "run",
    "params": {
      "p": "### Instruction\n\nName an animal.\n\n### Response\n\n",
      "m": "../models/stable-vicuna/13b_q4_0.bin",
      "n": 256
    },
    "returns": "animal"
  }, {
    "uri": "https://github.com/cocktailpeanut/llama.git/index.js",
    "method": "run",
    "params": {
      "p": "### Instruction\n\nWrite a poem about {{local.animal}}.\n\n### Response\n\n",
      "m": "../models/stable-vicuna/13b_q4_0.bin",
      "n": 256
    }
  }, {
    "method": "goto",
    "params": {
      "index": 0
    }
  }]
}
```

1. The first instruction generates an animal name
2. The second instruction takes that animal and generates a poem
3. The third instruction loops back to index 0 (the first instruction)
4. The `local.animal` is always freshly generated for every run (because the template expression is NOT pre-filled out, but right when it's about to run)

