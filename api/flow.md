# Flow control

## goto

By default, Pinokio steps through all the requests in the `run` array and halts at the end.

However you can implement looping, which will let you build all kinds of interesting perpetual workflows.

```json
{
  "method": "goto",
  "params": {
    "index": <the index of the "run" array>,
    "input": <the 'input' variable to pass into the next step (optional)>
  }
}
```

### Infinite loop

Above command will send Pinokio to the `run[index]` instruction and restart from there.

Often the index will be just 0, in which case the script will keep looping from step 0 to N forever. For example:

```json
{
  "run": [{
    "uri": "https://github.com/cocktailpeanut/automatic1111.git/index.js",
    "method": "run",
    "params": {
      "cfg_scale": 7,
      "steps": 30,
      "prompt": "a pencil drawing of {{Math.floor(Math.random() * self.animals.length)}}"
    }
  }, {
    "method": "fs.write",
    "params": {
      "path": "{{Date.now()}}.png",
      "buffer": "{{Buffer.from(input.images[0], 'base64')}}"
    }
  }, {
    "method": "goto",
    "params": {
      "index": 0
    }
  }]
}
```

Above code will:

1. generate a stable diffusion image
2. write it to an image file
3. loop back to step 0.
4. Repeat 0~3 forever.

### Sophisticated loop

In some cases you may NOT want to start from beginning. There may be some preprocessing steps you want to run only once, and want to loop back to the checkpoint right after the preprocessing steps (so the pre processing steps are run only once).

Here's an example:

```json
{
  run: [{
    "uri": "https://github.com/malfunctionize/llama.git/index.js",
    "method": "run",
    "params": {
      "message": {
        "p": "### Instruction\n\nWrite a brief controversial opinion.\n\n### Response\n\n",
        "m": "../models/stable-vicuna/13b_q4_0.bin",
        "n": 256
      }
    },
    "returns": "local.message"
  }, {
    "uri": "https://github.com/malfunctionize/llama.git/index.js",
    "method": "run",
    "params": {
      "message": {
        "p": "### Instruction\n\nExplain why you disagree with the following statement:\n\n{{local.message}}. Just explain while including the original message coherently.\n\n### Response\n\n",
        "m": "../models/stable-vicuna/13b_q4_0.bin",
        "n": 256
      }
    },
    "returns": "local.message"
  }, {
    "method": "set",
    "params": {
      "self": {
        "index.json": {
          "items": "{{self.items.concat(local.message)}}"
        }
      }
    }
  }, {
    "method": "goto",
    "params": {
      "index": 1
    }
  }]
}
```

- Step 0. Generate a seed "controversial opinion"
- Step 1. Write why the controversial opinion is wrong
- Step 2. Save to `items` array
- Step 3. Loop back to step 1 (NOT to the beginning)

The reason we loop back to step 1 is because we don't want to generate a controversial opionion from scratch every time, but want the AI to keep debating with itself on why it disagrees with its previous statement. So the flow in this case will be:

- 0 => 1 => 2 => 3 => 1 => 2 => 3 => 1 => 2 => 3 => ...

### Finite loop

You can pass `index: null` to the `goto` method to finish the program.

Using this property, it is possible to program a Pinokio script to loop until certain condition is met.

```json
{
  "run": [{
    "method": "set",
    "params": {
      "local": {
        "counter": 0
      }
    }
  }, {
    "method": "log",
    "params": {
      "raw": "{{local.counter}}"
    }
  }, {
    "method": "set",
    "params": {
      "local": {
        "counter": "{{local.counter+1}}"
      }
    }
  }, {
    "method": "goto",
    "params": {
      "index": "{{ local.counter > 15 ? null : 1 }}"
    }
  }]
}
```

Here's how the code above works:

0. Initially set the counter to 0.
1. Print the counter.
2. Increment the counter.
3. Check if the counter is greater than 15. If it's greater, stop (`goto null`). Otherwise loop back to instruction 1 (not instruction 0).

### Flow control

You can use the `goto` method not only to loop, but also to control the program flow:

```json
{
  "run": [{
    "method": "set",
    "params": {
      "local": {
        "counter": 0
      }
    }
  }, {
    "method": "set",
    "params": {
      "local": {
        "counter": "{{local.counter+1}}"
      }
    }
  }, {
    "method": "goto",
    "params": {
      "index": "{{ local.counter%2 === 0 ? 3 : 4 }}"
    }
  }, {
    "method": "log",
    "params": {
      "raw": "{{local.counter}} is even"
    }
  }, {
    "method": "log",
    "params": {
      "raw": "{{local.counter}} is odd"
    }
  }, {
    "method": "goto",
    "params": {
      "index": "{{ local.counter > 7 ? null : 1 }}"
    }
  }]
}
```

0. sets the counter to 0
1. increment the counter
2. if the `local.counter%2===0` (even), goto instruction 3, otherwise goto instruction 4
3. print <span v-pre>"{{local.counter}} is even"</span>
4. print <span v-pre>"{{local.counter}} is odd"</span>
5. if the counter is greater than 7, stop. Otherwise goto instruction 1

### Pass arguments

Every method call has access to a variable named `input`, which is the return value of the method call from the previous step.

This is straightforward enough when everything runs in sequence, but what about when you call `goto`?

When calling the `goto` method, you can set the `input` variable by using the `params.input` attribute. Here's an example:

```json
{
  "run": [{
    "method": "log",
    "params": {
      "raw": "{{input ? input : 'first time'}}" 
    }
  }, {
    "method": "process.wait",
    "params": {
      "sec": 1
    }
  }, {
    "method": "goto",
    "params": {
      "index": 0,
      "input": "not first time"
    }
  }]
}
```

In this example:

1. The first time the script is run, the `log` method prints `first time` because there is no method call before it and the `input` doesn't exist.
2. However when it reaches the end and the `goto` statement loops back to the step 0 with an input value of `"not first time"`, it prints "not first time" instead, and loops forever.

## process.wait

### pause

By default, Pinokio runs every step in the `run` array and halts the script.

This means everything will be cleaned up after the script finishes running.

However you may sometimes want all the spawned up processes to keep running even after you have finished running all the steps in the script.

To achieve this, simply call `process.wait`, and the script will go into a standby mode.

```json
{
  "method": "process.wait"
}
```

Here's an example script to demonstrate when this may be necessary:

```json
{
  "run": [{
    "method": "shell.start",
    "params": {
      "message": "npm start",
      "on": [{
        "event": "/.*/",
        "return": true
      }]
    }
  }, {
    "method": "notify",
    "params": {
      "html": "server started"
    }
  }]
}
```

When we run the script above, it will:

1. First start a server with `npm start` (let's assume this is a web server app)
2. Then it calls a `notify` method to display a notification once the server has started

The problem is, immediately after the notify method, this script will halt, and all the processes spun up throughout the script (in this case the web server launched through the `npm start`  command) will shut down.

To avoid the script from halting, we can add one last step at the end that just waits forever:


```json
{
  "run": [{
    "method": "shell.start",
    "params": {
      "message": "npm start",
      "on": [{
        "event": "/.*/",
        "return": true
      }]
    }
  }, {
    "method": "notify",
    "params": {
      "html": "server started"
    }
  }, {
    "method": "process.wait"
  }]
}
```



The "process.wait" will ensure that:

1. The script keeps running
2. It won't stop until you manually press the "stop" button on your script page, at which point the web server started with `npm start` will shut down.

### timer

Often, especially when you create a perpetual state machine that keeps running forever (via "goto"), you may NOT want it to run non-stop, but only run once in a while.

This is especially critical when you are trying to use this to post the generated content to some 3rd party API (most of which have some forms of API rate limit).

For example you may want to generate an image and some text and post to Tumblr every 10 minutes.

To accomplish this, you can use the `process.wait` method to pause execution.

```json
{
  "method": "process.wait",
  "params": {
    "min"|"sec": <minutes or seconds>
  }
}
```

Example (pause for 5 minutes, and then loop:

```json
{
  run: [{
    "uri": "https://github.com/malfunctionize/llama.git/index.js",
    "method": "run",
    "params": {
      "message": {
        "p": "### Instruction\n\nWrite a brief controversial opinion.\n\n### Response\n\n",
        "m": "../models/stable-vicuna/13b_q4_0.bin",
        "n": 256
      }
    },
    "returns": "local.message"
  }, {
    "method": "sleep",
    "params": {
      "min": 5
    }
  }, {
    "method": "goto",
    "params": {
      "index": 0
    }
  }]
}
```
