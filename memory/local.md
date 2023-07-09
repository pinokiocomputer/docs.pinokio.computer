# local variable

The local variable is every variable prefixed with `local.`. For example:

- `local.items`
- `local.prompt`


Local variables are reset whenever the script finishes running, which means if you run a script once, and run it again, they will always start from scratch.

There are a couple of ways to set the local variable:

1. [set](../api/datastructure#set): There is a dedictated method called `set` that lets you update local variables.
2. [returns](../processor/execute#returns): every step (request) can have a `returns` attribute. The `returns` attribute is used to assign the return value to either a local variable or a global variable.

