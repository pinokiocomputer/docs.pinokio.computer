# Neuron

## Deterministic intelligence

Most typically, a Pinokio script will have a single threaded deterministic routine (example: "generate some text, then generate an image based on this text, and finally publish it somewhere") 

But because each step is easily replaceable (thanks to the standardized JSON interface), we can--on the fly--change what APIs are called next, as well as how they are called, which leads us to...

## Non-deterministic intelligence

![neuron.png](neuron.png)

Thanks to the standardized RPC interface, we can even treat each API as a neuron in a larger neural network.


By now we know that a Pinokio script can mutate itself as well as mutate its own memory during execution.

And this means we no longer need a single timeline. We can create have multiple options and assign a probability to each of these options.

For example, depending on the condition, you may want to generate some text using a language model, and then either feed it to a text-to-image engine, or a text-to-video, or even a text-to-audio engine.

We could even create an API that determines the probability of which actions to trigger based on the current `self` state as well as the `local` and `global` memory variables, and insert it in the logic.

There are a couple of ways to do this:

1. Use the template expression and the auto-construction feature to generate the next step in JSON
2. Write the script in JavaScript (to dynamically return a specific JSON depending on some complex logic, or based on probability)

