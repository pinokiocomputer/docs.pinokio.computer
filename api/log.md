# Logging

Often it's useful to be able to print things on the web terminal programmatically. You can do this using the `log` method.

## log

```json
{
  "method": "log",
  "params": {
    "raw"|"text"|"json"|"json2": <object or text>
  }
}
```

- "raw": log raw text
- "text": same as "raw"
- "json": log single line json
- "json2": log json in multiple lines

### Printing raw text

```json
{
  "run": [{
    "method": "set",
    "params": {
      "local": {
        "hello": "world"
      }
    }
  }, {
    "method": "log",
    "params": {
      "raw": "{{local.hello}}"
    }
  }]
}
```

will print:

```
world
```

### Printing JSON

Passing the `json` attribute (instead of `raw`) will print JSON

```json
{
  "run": [{
    "method": "set",
    "params": {
      "local": {
        "hello": "world"
      }
    }
  }, {
    "method": "log",
    "params": {
      "json": "{{local}}"
    }
  }]
}
```

will print:

```json
{"hello":"world"}
```

### Printing multiline JSON

Passing the `json2` attribute will print JSON, but in multiple lines:

```json
{
  "run": [{
    "method": "set",
    "params": {
      "local": {
        "hello": "world",
        "bye": "world"
      }
    }
  }, {
    "method": "log",
    "params": {
      "json2": "{{local}}"
    }
  }]
}
```

will print the object in multiple lines:

```json
{
  "hello": "world"
  "bye": "world"
}
```

