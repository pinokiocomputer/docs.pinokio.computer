# Growth

Pinokio is not an "AI engine", but AI itself. What is the difference?

An "AI engine" is a piece of software that lets you run some AI model to generate data. For example, StableDiffusion is an AI engine that generates images. However, StableDiffusion itself does NOT "grow", because it doesn't use its own experience and memory to generate new data. Every tiem you run a StableDiffusion process, it starts from fresh.

For an artificial intelligence to be able to grow, it needs to be able to maintain and make use of long term / short term memory, as well as being able to permanently store and access its accomplishments.

Basically to create a fully autonomous intelligence, it is not sufficient to be able to just process. It needs to be able to remember.

1. **Process:** uses its DNA (`self`) to process information and generate content.
2. **Remember:** can remember things by writing to itself

For example, you can write a `llama` script to generate an animal:

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

But it doesn't end there. The same script can be extended to **remember** the animal it has generated:

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
    "method": "set",
    "params": {
      "self": {
        "animals.json": {
          "items": "{{self.animals.items.concat(input)}}"
        }
      }
    }
  }]
}
```

Now every time you run this script, it will generate an animal, and append it to the `animals.items` array.

This means the Pinokio script itself can **evolve itself** by modifying its memory as well as its code.

