# global variable

The global variable is every variable prefixed with `global.`. For example:

- `global.items`
- `global.prompt`

There are a couple of ways to set the global variable:

1. [set](../api/datastructure#set): There is a dedictated method called `set` that lets you update global variables.
2. [returns](../processor/execute#returns): every step (request) can have a `returns` attribute.

