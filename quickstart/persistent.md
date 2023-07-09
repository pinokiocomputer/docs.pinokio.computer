# Persistent shell

## You may not need a persistent shell

In most cases it's the cleanest to just run a new shell every time you run a new command, for example:

```json
{
  "run": [{
    "method": "shell.write",
    "params": {
      "message": "git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui"
    }
  }, {
    "method": "shell.write",
    "params": {
      "message": "webui.bat",
      "path": "stable-diffusion-webui"
    }
  }]
}
```

## When to use a persistent shell

However sometimes you may want to keep the existing terminal session instead of starting a new one.

Some examples:

1. **Interactive session:** For example, some installer scripts require the user to interact with the command line by selecting options along the way (instead of just typing one command).
2. **Environment variable preservation:** Sometimes you may be running some command that sets up custom environment variables. In this case if you start a new shell session for every command, you will have to recreate the environment for every command. It's easier to just create one shell and keep writing to it.


```json
{
  "run": [{
    "method": "shell.write",
    "params": {
      "message": "git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui"
    }
  }, {
    "method": "shell.write",
    "params": {
      "message": "webui.bat",
      "path": "stable-diffusion-webui"
    }
  }]
}
```
