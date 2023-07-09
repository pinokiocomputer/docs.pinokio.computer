# Configuring Apps

## Service mode apps

The "random" example was a very simple one, it was just a stateless function that is triggered every time you call it.

But there are so many other things you may want to do, that require a certain service running at all times.

For example imagine installing and running a StableDiffusion server. If we restarted StableDiffusion every time we made a request, it would be very slow. Instead, it's much more efficient to have a single StableDiffusion service running at all times, and have the service respond to the requests as they come in.

Some example use cases:

1. AI server
2. Database server
3. Websocket server

To accomplish this we need two things:

1. An easy way to allow people to install and launch the service
2. An automated relaunch whenever Pinokio restarts (otherwise you will have to go through all these service modules and manually restart every tiem you restart Pinokio)

## Installer

In essence, an "installation" is nothing more than running some shell commands.

You can achieve this using the built-in `sh` (shell) API. Here's an example for installing Automatic1111 (a StableDiffusion client) on a Mac:

```json
{
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "brew install cmake protobuf rust python@3.10 git wget",
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": "git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui automatic1111"
    }
  }, {
    "method": "shell.run",
    "params": {
      "message": "sh webui.sh -f --api",
      "path": "automatic1111"
    }
  }]
}
```

1. Runs `brew install` to install dependencies
2. Runs `git clone` to download the automatic1111 repository
3. Runs `sh webui.sh -f --api` to start the installer

## Dynamic Installer

The problem with above script is that it only works on Mac.

For windows, or for linux, we need a different set of shell commands.

Fortunately we have multiple solutions for dynamically generating commands:

1. Use the [os](../processor/decode#os) variable to determine the OS inside templates.
2. Or, instead of using JSON, we write a JavaScript file that exports JSON dynamically!




