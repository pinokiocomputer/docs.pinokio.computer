# File System

## fs.write

### Syntax

The `fs` api provides a simple way to write `json`, `text`, or `buffer` to the file system.

```json
{
  "method": "fs.write",
  "params": {
    "path": <the file path to store the content under>,
    <json>|<json2>|<text>|<buffer>: <data>|<array of data>,
    "join": <delimiter (optional. only when the data is an array)>
  }
}
```

### Example

<br>

#### Writing JSON

Here are some examples:

Writing JSON to `items.json`

```json
{
  "method": "fs.write",
  "params": {
    "path": "items.json",
    "json": [ "alice", "bob", "carol" ]
  }
}
```

This will result in `items.json` looking like this:

```json
["alice","bob","carol"]
```

<br>

#### Writing formatted JSON 

The `json` type writes the entire JSON in a single line.

Often you may not want this and want the JSON to be human readable.

For example we may want the `items.json` to look like:

```json
[
  "alice",
  "bob",
  "carol"
]
```

For this you can use the `json2` type `fs.write`:

```json
{
  "method": "fs.write",
  "params": {
    "path": "items.json",
    "json2": [ "alice", "bob", "carol" ]
  }
}
```

<br>

#### Writing text

```json
{
  "method": "fs.write",
  "params": {
    "path": "items.csv",
    "text": "alice,bob,carol"
  }
}
```

<br>

#### Writing multi line text

Often you may want to write multiple lines of text. You can pass an array instead of a string to the `text` attribute in this case:

```json
{
  "method": "fs.write",
  "params": {
    "path": "index.js",
    "text": [
      "const express = require('express');",
      "const app = express();",
      "app.get('/', function (req, res) {",
      "  res.send('<h1>Hello World</h1>');",
      "});",
      "console.log('starting server')",
      "app.listen(3000, () => { console.log ('server started') });"
    ],
    "join": "\n"
  }
}
```

<br>

#### Writing buffer

Writing Buffer to `img.png`

```json
{
  "method": "fs.write",
  "params": {
    "path": "img.png",
    "buffer": "{{Buffer.from(input.images[0], "base64")}}"
  }
}
```

## fs.append

The `fs.append` method is like `fs.write` but instead of writing data freshly to a file, it appends the data at the end of the specified file.

### Syntax

The `fs` api provides a simple way to write `json`, `text`, or `buffer` to the file system.

```json
{
  "method": "fs.write",
  "params": {
    "path": <the file path to store the content under>,
    <json>|<json2>|<text>|<buffer>: <data>|<array of data>,
    "join": <delimiter (optional. only when the data is an array)>
  }
}
```

### Examples

<br>

#### Appending text

```json
{
  "method": "fs.append",
  "params": {
    "path": "log.txt",
    "text": "some event happened"
  }
}
```

<br>

#### Appending multiple lines

```json
{
  "method": "fs.append",
  "params": {
    "path": "log.txt",
    "text": [
      "some event happened",
      "another event happened"
    ],
    "join": "\n"
  }
}
```

<br>

## fs.read

### Syntax

The `fs` api provides a simple way to read from files.

```json
{
  "method": "fs.read",
  "params": {
    "path": <the file path to read from>,
    "encoding": "ascii"|"base64"|"base64url"|"hex"|"utf8"|"utf-8"|"binary"|null
  }
}
```

> `null` for Buffer

### Example

Example (read `img.png` and print its base64 encoded string):

```json
{
  "run": [{
    "method": "fs.read",
    "params": {
      "path": "img.png",
      "encoding": "base64"
    }
  }, {
    "method": "log",
    "params": {
      "raw": "data:image/png;base64,{{input}}"
    }
  }]
}
```

## fs.download

### Syntax

The `fs.download` API downloads a URL to a designated path:

```json
{
  "method": "fs.download",
  "params": {
    "url": <the remote url>,
    "path": <the local path to store the file under>
  }
}
```

### Example

Example:

```json
{
  "run": [{
    "method": "fs.download",
    "params": {
      "url": "https://via.placeholder.com/600/92c952",
      "path": "placeholder.png"
    }
  }]
}
```
