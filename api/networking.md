# Networking

## net

The `net` api internally makes use of the [axios](https://github.com/axios/axios) library. 

For example,

```json
{
  "method": "net",
  "params": {
    "url": <url>,
    "method": "get"|"post"|"delete"|"put",
    "headers": <request headers>,
    "data": <request body>,
  }
}
```

is mapped to:

```javascript
let result = await axios({
  "url": <url>,
  "method": "get"|"post"|"delete"|"put",
  "headers": <request headers>,
  "data": <request body>,
}).then((res) => {
  return res.data
})
```

The `result` will be set as the `input` variable's value for the next step.

Here's an example:

```json
{
  "run": [{
    "method": "net",
    "params": {
      "url": "http://127.0.0.1:7860/sdapi/v1/txt2img",
      "method": "post",
      "data": {
        "cfg_scale": 7,
        "steps": 30,
        "prompt": "a pencil drawing of a bear"
      }
    }
  }, {
    "method": "fs.write",
    "params": {
      "path": "img.png",
      "buffer": "{{Buffer.from(input.images[0], "base64")}}"
    }
  }]
}
```
