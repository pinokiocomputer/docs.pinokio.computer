# Reproduction

## Version control

![git.png](git.png)

1. **Git native:** At the core of every Pinokio script is a git repository. Every API/App is uniquely identified by its public git repository URI.
2. **Forkable by nature:** Since public git repositories can easily cloned and forked, it becomes easy to "breed" new Pinokio state machines from an existing one.

## Soft clone

> Soft cloning is like cloning a github repository for a software library

In most cases you will probably want to only clone the code and use the code to generate your own content.

For example, you may download the llama API engine and feed it your own prompts to generate a fresh database of prompts and responses.

Let's call this a "Soft clone", because you're only cloning the behavior, but not reusing the data.

Basically, imagine creating a clone of yourself, but the clone only looks like you and has the same instinctive behaviors as yourself, but doesn't have your memory and therefore not exactly the same.

However, it is also possible to do a "deep clone", where you basically create a clone that thinks and acts exactly like you because it shares the same memory with you until the clone point. 

## Deep clone

> Deep cloning is similar to creating a Bitcoin fork, resulting in multiple forks that share a common history up until the point of the fork.

A "deep clone" means you clone not just the algorithm, but also the memory.

Remember that when you fork a Pinokio repository, you are forking not just code, but potentially all the data stored in the repository. This is much more powerful than just forking the code, because you are inheriting not just the behaviors but also the entire memory (just like how genes get inherited).

Imagine the following code stored as `index.json`:

```json
{
  "counter": 0,
  "run": [{
    "method": "set",
    "params": {
      "self": {
        "index.json": {
          "counter": "{{self.counter+1}}"
        }
      }
    }
  }]
}
```

Every time you run this script, the `counter` will increment by 1, and it will be persisted on your file system.

Let's say you ran this 100 times and the counter is now 100.

When you publish this to a public git repository, someone else may fork this repository and run it on their machine.

This time they start with the following script:

```json
{
  "counter": 100,
  "run": [{
    "method": "set",
    "params": {
      "self": {
        "index.json": {
          "counter": "{{self.counter+1}}"
        }
      }
    }
  }]
}
```

And they start from 100, instead of 0.

And thanks to the traceability of git, it is possible to trace the entire history of a Pinokio script, where it started and how it got here.

