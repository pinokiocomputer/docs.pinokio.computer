# Wait for event

Often when running commands, they don't end immediately and you will have to wait for it to end before going to the next step.

In this case you need to declare event handlers with an "on" array.

Here's an example:

```json
{
  "run": [{
    "method": "shell.write",
    "params": {
      "message": "curl https://jsonplaceholder.typicode.com/users",
      "on": [{
        "event": "/.*(\\[.*\\]).*/gs",
        "return": "{{event.matches[0][1]}}"
      }]
    }
  }, {
    "method": "fs.write",
    "params": {
      "path": "users.json",
      "text": "{{input}}"
    }
  }]
}
```
