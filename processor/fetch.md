# Fetch

![fetch.png](fetch.png)

Pinokio adopts a [convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration) approach in deciding which modules to load, and how.

## Resolve

The first step in every Pinokio workflow is always a URI.

1. You kick off a workflow by running a file.
2. The file needs to be either a JSON file, or a Node.js (JavaScript) module that returns JSON.

### Syntax

```json
{
  "uri": <relative path>|<absolute path>|<http git path>
}
```

### Example

The following Pinokio script runs the script at path https://github.com/cocktailpeanut/blogger.git/index.json

```json
{
  "uri": "https://github.com/cocktailpeanut/blogger.git/index.json"
}
```

### Usage

In practice, you will probably never have to call the "uri" call directly.

Instead, most often you will simply:

1. Create JSON files
2. Navigate to the JSON file URIs from Pinokio UI
3. Click "run" to run the scripts

See the next section to learn how to write Pinokio scripts.

## Load

This section explains what a typical Pinokio script file looks like.

### Requirements

Once the resolver successfully resolves a file, it checks whether

1. the JSON object contains a `run` array.
2. or in case of a node.js module, the module returns a JSON that contains a `run` array.


If above conditions pass, Pinokio loads the script for execution. The resulting JSON (The Pinokio script) is loaded into a variable named `self`. The `self` object acts as the "DNA" of a Pinokio script.

Here is an example of a valid Pinokio script:

```json
// A valid, runnable Pinokio script
{
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "ls -las"
    }
  }]
}
```

Here is an example of an invalid Pinokio script (Invalid scripts are ignored and not executed):

```json
// Not a runnable Pinokio script
{
  "method": "shell.run",
  "params": {
    "message": "ls -las"
  }
}
```

Above script is not a valid "runnable" Pinokio script since there is no `run` array.

### It's just JSON.

Aside from the main requirement (need to include a `run` array), there is no restriction for what you can include in a Pinokio script JSON file.

In fact, this ability to include any other attribute (not just "run") is the true power of Pinokio script---A Pinokio script can reference its OWN JSON body to run tasks. Here is an example:


```json
{
  "run": [{
    "uri": "https://github.com/cocktailpeanut/automatic1111.git/index.js",
    "method": "run",
    "params": {
      "cfg_scale": 7,
      "steps": 30,
      "prompt": "a pencil drawing of {{Math.floor(Math.random() * self.animals.length)}}"
    }
  }],
  "animals": [
    "elephant",
    "cat",
    "dog",
    "tiger"
  ]
}
```


Pay attention to the `run[0].params.prompt`:

```
"prompt": "a pencil drawing of {{self.animals[Math.floor(Math.random() * self.animals.length)]}}"
```

It's referencing `self.animals`, and basically generating a random animal from the `animals` array, thereby coming up with a different prompt every time.

### JavaScript support

Let's take a look at another example. This time it's a JavaScript module (instead of JSON):

```javascript
module.exports = {
  "run": [{
    "uri": "https://github.com/cocktailpeanut/automatic1111.git/index.js",
    "method": "run",
    "params": {
      "cfg_scale": 7,
      "steps": 30,
      "prompt": "a {{self.random(self.type)}} of {{self.random(self.animals)}}"
    }
  }],
  "type": [
    "Pencil drawing",
    "Closeup photo"
  ],
  "animals": [
    "elephant",
    "cat",
    "dog",
    "tiger"
  ],
  random: (array) => {
    let randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
  }
}
```

While the recommended way to write Pinokio script is JSON (there are many benefits of using JSON, mentioned below), sometimes your use case may demand a more advanced experience.

In these cases you can write your script in a JavaScript module that exports a JavaScript object (a superset of JSON). The exported object does not need to be constrained by the JSON spec. It can even support functions, Buffers, or any data types as its value.

> The recommended way to write Pinokio script is using JSON as much as possible. This is because:
>
> 1. **Machine readable and writable:** Compared to JSON, a JavaScript code is too complicated and requires heavier reasoning to make sense of what's going on. If you express your logic in JSON as much as possible, this means the code itself is trivially machine readable therefore the code itself can change, even during execution.
> 2. **Storage friendly:** There are many database systems that support JSON based storage and queries natively. So using JSON will make your script much easier to filter and manipulate.


## Import

While it's quite cool that a single JSON can express the entire logic set AND the data that powers an intelligent autonomous AI agent, this can get messy very quickly as you add more and more attributes to the script.

To solve this problem, Pinokio lets you split out your script into as many pieces as you want. Here's how it works:

### Automatic Import

All JSON/JavaScript modules under your workspace folder are automatically imported.

Let's say we have the following Pinokio script call:

```json
{
  "uri": "myapp/index.json"
}
```

and the `myapp` folder (`~/pinokio/api/myapp`) contains the following files:

```
~/pinokio
  /bin
  /api
    /myapp
      index.json
      animals.json
      type.json
      random.js
```

And the `index.json` file looks like this:

```json
{
  "run": [{
    "uri": "https://github.com/cocktailpeanut/automatic1111.git/index.js",
    "method": "run",
    "params": {
      "cfg_scale": 7,
      "steps": 30,
      "prompt": "a {{self.random(self.type)}} of {{self.random(self.animals)}}"
    }
  }]
}
```

And `animals.json`:

```json
[
  "elephant",
  "cat",
  "dog",
  "tiger"
]
```

And `type.json`:

```json
[
  "Pencil drawing",
  "Closeup photo"
]
```

and `random.js`:

```javascript
module.exports = (array) => {
  let randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}
```

Pinokio automatically scans the `myapp` folder to find all these files and automatically attaches them to the core `index.json` file.

Therefore the attributes `self.random`, `self.type`, and `self.animals` are all made available inside `index.json` even though the `index.json` file itself does NOT contain the attributes.

Most importantly, these module imports are **automatically** carried out, so you do not need to worry about importing manually. 

To modify the behavior of the AI in your workspace, you do NOT need to restart Pinokio or manually import anything. Everything "just works" as soon as you place the files anywhere inside your workspace folder.

Any JSON file or JavaScript module will be automatically imported under the filename as attribute (without the extension)


### Recursive import

Pinokio automatically imports all the descendent folders recursively.

#### Default import

By default, the `index.json` and `index.js` files in every folder is loaded under the folder name.

For example, we could think about restructuring the folders this way:

```
~/pinokio
  /bin
  /api
    /myapp
      index.json
      /data
        index.json    # contains "animals" and "type" attributes
      /helpers
        index.js      # contains a "random" attribute that points to the random function
```

where the `myapp/data/index.json` looks like:

```json
{
  "animals": [
    "elephant",
    "cat",
    "dog",
    "tiger"
  ],
  "type": [
    "Pencil drawing",
    "Closeup photo"
  ]
]
```

and the `myapp/helpers/index.js` looks like:

```javascript
module.exports = {
  random: (array) => {
    let randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
  }
}
```

This works automatically out of the box without you having to do anything. Just structure the folders that way, and the attributes will now be available under:

- `self.data.animals`
- `self.data.type`
- `self.helpers.random()`

#### Named import

This is cool, but we can go further.

Sometimes you may want to organize the modules under multiple folders AND also split them out to individual files. Let's imagine we wanted to structure the modules like the following:

```
~/pinokio
  /bin
  /api
    /myapp
      index.json
      /data
        animals.json
        type.json
      /helpers
        rarndom.js
```


Here's the modified `index.json` file that takes advantage of this new structure:

```json
{
  "run": [{
    "uri": "https://github.com/cocktailpeanut/automatic1111.git/index.js",
    "method": "run",
    "params": {
      "cfg_scale": 7,
      "steps": 30,
      "prompt": "a {{self.helpers.random(self.data.type)}} of {{self.helpers.random(self.data.animals)}}"
    }
  }]
}
```

Same as the default import, the variablees are accessible at:

- `self.data.animals`
- `self.data.type`
- `self.helpers.random()`
