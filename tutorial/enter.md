# Auto-press Enter

Since `shell.write` does NOT automatically press the "enter" key for you, when you're trying to run commands with `shell.write` you will need to append all your messages with `\n`, for example:

```json
{
  "run": [{
    "method": "shell.write",
    "params": {
      "message": "{{os.platform() === 'win32' ? 'dir' : 'ls'}}\n"
    }
  }]
}
```

There are two things to note here:

1. First, we're using [template expressions](/processor/decode#template) and the built-in `os` variable to determine the platform and sending `dir` if windows, and `ls` if otherwise.
2. Second, the `message` ends with an explicit `\n` (newline character).

If you don't include the `\n` at the end, it will just print `dir` or `ls` and not run them.

Since most use cases will involve entering commands and it will get tedious to append everything with `\n`, Pinokio also provides a method called `shell.enter`.

The `shell.enter` command basically does the same thing as `shell.write`, except it always automatically enters the enter key for you at the end.

Above example can be transformed to the following (Notice we're using `shell.enter` instead of `shell.write`, and that the trailing `\n` in the `message` is gone now):


```json
{
  "run": [{
    "method": "shell.enter",
    "params": {
      "message": "{{os.platform() === 'win32' ? 'dir' : 'ls'}}"
    }
  }]
}
```
