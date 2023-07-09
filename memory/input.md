# input

An `input` is a special type of variable that refers to whichever data is being passed in from the request right before the current request.

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
    "uri": "llama",
    "method": "run",
    "params": {
      "uri": "https://github.com/cocktailpeanut/automatic1111.git/index.js",
      "method": "run",
      "params": {
        "cfg_scale": 7,
        "steps": 30,
        "prompt": "{{input}}"
      }
    }
  }]
}
```

In the example above, we are:

1. making a call to the llama API to generate an animal
2. This is temporarily stored in the `input` variable when the next step is run.
3. The next step makes use of the template expression `{{input}}` to pass the generated animal name as a prompt to Automatic1111 (Stable Diffusion).

Some properties of `input`:

1. Not all methods generate return values (for example `set`), and for those methods, the `input` will be null
2. The first step in a run loop will have an `input` value of `null`.
3. The `input` value changes for every step, therefore you may often want to store the return values in the memory. For this, you can use the `returns` attributte.

