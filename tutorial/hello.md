# Hello world

Let's start by creating a simple script that lists files in the current directory.

When run, this script will run "ls" (or "dir" on windows)

![helloworld.gif](helloworld.gif)

First, find the [API folder under the Pinokio file system](/fs/overview.html#api). The folder structure will look something like this:


```
~/pinokio
  /api
  /bin
```

To create a project folder, go into `~/pinokio/api` and create a new folder named `helloworld`


```
mkdir helloworld
```

The resulting folder structure will be:

```
~/pinokio
  /api
    /helloworld
  /bin
```

Now create a script file named `index.json` inside the `~/pinokio/api/helloworld` folder:

```json
{
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "ls"
    }
  }]
}
```

Or, if you're on Windows, use `dir` instead:


```json
{
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "dir"
    }
  }]
}
```

The folder structure would look something like this:

```
~/pinokio
  /api
    /helloworld
      index.json
  /bin
```

Now open Pinokio and you will see the `helloworld` folder on the home page.

1. Go to the `helloworld/index.json` page
2. Click the **Run** button at the top.
3. You will see the command being executed and the web terminal display the result.
