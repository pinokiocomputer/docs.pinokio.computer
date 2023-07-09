# Data Strcuture

Everything is a JSON object in Pinokio.

The code is written in JSON, and the data is written in JSON.

This means you not only can modify data while the code is running, but also can modify the code itself while it's running.

Because this can be so powerful, Pinokio ships with native APIs to manipulate JSON.

## local

Local variables are reset every time a script finishes running.

### local.set

Sets a value at an object path (can be a key path, and the key path can also include an array index)

The following comand sets the local variables `local.name.first` and `local.animal`:

```json
{
  "method": "local.set",
  "params": {
    "name.first": "Alice",
    "animal": "dog"
  }
}
```

The key path can even include array notations:

```json
{
  "method": "local.set",
  "params": {
    "items[0]": "water",
    "items[1]": "air"
  }
}
```

Above command will set the values of the `items` array, resulting in `["water", "air"]`.

### local.rm

Let's say we have the following values in the local variable:

```json
{
  "animal": "cat",
  "name": {
    "first": "john",
    "last": "doe"
  }
}
```

And we want to delete the attributes `animal` and `name.last`. We can call:

```json
{
  "method": "rm",
  "params": {
    "local": ["animal", "name.last"]
  }
}
```

Then the resulting local variable will be:

```json
{
  "name": {
    "first": "john"
  }
}
```

## global

global variable

### global.set

All local variables get reset once their parent script finishes running. Global variables, on the other hand, are persited across separate runs.

> If the script loops forever, the local variables will persist since they don't get reset until the program halts.

Here's an example that demonstrates the difference between local variables and global variables:


```json
{
  "run": [
    {
      "method": "global.set",
      "params": {
        "global": {
          "counter": "{{global.counter ? global.counter+1 : 1}}"
        }
      }
    },
    {
      "method": "log",
      "params": {
        "raw": "global: {{global.counter}}"
      }
    }
  ]
}
```

1. Try manually clicking "run".
2. Try clicking one more time.
3. You will see that the global variable counter keeps incrementing, whereas the local variable counter stays 1 (since it gets reset)

Some notable properties of global variables:

1. Global variables are scoped to the currently running script: `global.counter` is only global to this script and not other scripts.
2. Global variables are only reset when the Pinokio app restarts.
3. Global variables are NOT persisted anywhere. If you want a persistent memory, use the `self` variable.

### global.rm

Let's say we have the following values in the global variable:

```json
{
  "animal": "cat",
  "name": {
    "first": "john",
    "last": "doe"
  }
}
```

And we want to delete the attributes `animal` and `name.last`. We can call:

```json
{
  "method": "rm",
  "params": {
    "global": ["animal", "name.last"]
  }
}
```

Then the resulting global variable will be:

```json
{
  "name": {
    "first": "john"
  }
}
```

## self

### self.set

Sometimes you may want to persist the data. You can use `fs.write` to write JSON to a file, but you can also simply use the "set" method to set attributes in JSON files:

```json
{
  "method": "self.set"
  "params": {
    "config.json": {
      "apikey": "blablablabll",
      "apisecret": "secretsecretsecret"
    }
  }
}
```

This will set the `apikey` and `apisecret` keys of the `config.json` file:

```json
{
  "apikey": "blablablabll",
  "apisecret": "secretsecretsecret"
}
```

Also, remember that Pinokio instantly updates the `self` variable, the updated `self` variable can be accessed immediately.

For example, if you set the `apikey` and `apisecret` attributes of the `config.json` file, the corresponding variables will be available under `self.config.apikey` and `self.config.apisecret`:

```json
{
  "run": [{
    "method": "self.set"
    "params": {
      "config.json": {
        "apikey": "blablablabll",
        "apisecret": "secretsecretsecret"
      }
    }
  }, {
    "method": "log",
    "params": {
      "json": "{{self.config}}" 
    }
  }]
}
```

### self.rm

The same principle can be applied to `self` but since the `self` is constructed from files, we need to specify the specific files to mutate first.

Let's say we have a file named `config.json` which looks like this:

```json
{
  "animal": "cat",
  "name": {
    "first": "john",
    "last": "doe"
  }
}
```

This file itself is not "runnable" since it doesn't have a `"run"` attribute. But let's say we ran a file named `index.json` in the same folder, which looks like this:

```json
{
  "run": [{
    "method": "rm",
    "params": {
      "config.json": ["animal", "name.last"]
    }
  }]
}
```

This will remove the `animal` and `name.last` attributes from the `config.json` file, leaving us with the mutated `config.json` file that looks like this:

```json
{
  "name": {
    "first": "john"
  }
}
```

Then we can access "john" by referencing it from the `index.json` file using the `self` variable. For example the `self.config.name.first` will be "john".



## load

The **load** API lets you load data from other locally installed APIs.

> Only works for JSON/JavaScript modules

### syntax

```json
{
  "run": [{
    "method": "load",
    "params": {
      "llamaconfig": "https://github.com/malfunctionize/llama.git/config.json",
      "autoconfig": "https://github.com/malfunctionize/auto.git/config.json"
    }
  }, {
    "method": "log",
    "params": {
      "json2": "{{input}}"
    }
  }]
}
```

The above example works as follows:

1. It loads the locally installed `config.json` files under the URI, and assigns them to `llamaconfig` and `autoconfig` accordingly.
2. When the `load` API returns, the return value `{ llamaconfig, autoconfig }` will be available as the variable `input` in the next API call (`log`)

### why

While you can access all the local JSON attributes using the **self** attribute, this is only restricted to the current repository.

When you want to import data from other APIs installed on Pinokio, you can import them using the git URI.

It's similar to importing ES6 modules (uses the full URI to import).
