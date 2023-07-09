# Notification

## notify

Programmatically display a push notification popup, which when clicked may be programmed to open a new window or close.

Anything from a simple text snippet to a full fledged HTML markup can be displayed inside the notification.

### Simple text

![textnotify.gif](textnotify.gif)

<br>

### Full HTML

![htmlnotify.gif](htmlnotify.gif)

<br>

---


### Syntax

```json
{
  "method": "notify",
  "params": {
    "html": <the html content inside the notification>,
    "action": <action name>,
    "href": <the url>,
    "target": <the 'target' attribute for window.open()>,
    "features": <the 'windowFeatures' attribute for window.open()>  // "app" opens the page in pinokio,
  }
}
```

- `html`: The html content to display in the notification popup. Can be any HTML
- `href`: The link to open when the notification is clicked. If unspecified, do nothing.
- `action`: Action name (currently supported action: "close")
- `target`: When there's an `href` parameter, this attribute acts as the "target" parameter of the `window.open()` method (see https://developer.mozilla.org/en-US/docs/Web/API/Window/open#parameters)
- `features`: When there's an `href` parameter, this attribute acts as the `windowFeatures` parameter of the `window.open()` method (See https://developer.mozilla.org/en-US/docs/Web/API/Window/open#parameters)

### Examples

<br>

#### Move to another url

```json
{
  "run": [{
    "method": "notify",
    "params": {
      "html": "Click to visit index.json",
      "href": "./index.json"
    }
  }]
}
```

<br>

#### Open a link in a browser

```json
{
  "run": [{
    "method": "notify",
    "params": {
      "html": "Click to open https://github.com",
      "href": "https://github.com",
      "target": "_blank"
    }
  }]
}
```

<br>

#### Close the current window

```json
{
  "run": [{
    "method": "notify",
    "params": {
      "action": "close"
    }
  }]
}
```
