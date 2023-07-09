# Browser

The `browser` API lets you open or close windows programmatically.

## browser.open

### syntax

Implements the [window.open()](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) browser API using JSON-RPC.

```json
{
  "method": "browser.open",
  "params": {
    "uri": <URI to open>,
    "target": <Target>,
    "features": <Features attribute>
  }
}
```

### examples

<br>

#### open a web page in a browser

```json
{
  "method": "browser.open",
  "params": {
    "uri": "https://github.com",
    "target": "_blank"
  }
}
```

#### open a web page in Pinokio

```json
{
  "method": "browser.open",
  "params": {
    "uri": "./start.json",
    "target": "_blank",
    "features": "self"      // "self" is a special keyword that makes the URI open in Pinokio instead of a browser
  }
}
```


## browser.close

Close a window, or close a window by target ID.

### syntax


```json
{
  "method": "browser.close",
  "params": {
    "target": <Target (optional)>
  }
}
```

### examples

<br>

#### Closing the current window:

```json
{
  "methocd": "browser.close"
}
```

<br>

#### Closing a window based on target ID

```json
{
  "methocd": "browser.close",
  "params": {
    "target": "child"
  }
}
```
