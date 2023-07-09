# JavaScript Shell API

One of Pinokio's most powerful features is the [Shell JSON-RPC API](/api/shell), which lets you interact with the shell with nothing but JSON.

While the JSON-RPC API is already powerful and you should be able to achieve most of what you want using the JSON-RPC API, sometimes you may want more low level access to the shell.

Basically, instead of including the shell execution code in your JSON script (the "frontend"), you may want to write the shell manipulation logic in your custom API code (the "backend").


## How to access

The shell API is available at `kernel.shell` when writing your own custom API method:

```javascript
class CustomAPI {
  async customMethod(req, ondata, kernel) {
    // Access the JavaScript shell API with "kernel.shell"
    await kernel.shell.run({
      message: "npm init"
    })
  }
}
```

## Modes

There are two ways to use the shell:

1. **Request/Response mode:** Use it like a web server. Making a request creates a shell, runs the command, and returns the response. The created shell is destroyed at the end of the request.
2. **Persistent mode:** Use it like a socket server, by creating a persistent connection and sending messages. The shell session is not destroyed until it encounters an event you specify.

## 1. Request/Response mode

### shell.run

```javascript
let response = await kernel.shell.run(params, options, ondata)
```

#### parameters

- **params:** shell request params
- **options:** optional
  - **group:** group id. used to group shell sessions, so they can be stopped later by group id.
  - **cwd:** base path. if not specified, the cwd is set as ~/pinokio

#### return value

- **response:** The full terminal text

## 2. Persistent mode

### shell.start

```javascript
let id = await kernel.shell.start(params, options)
```

#### parameters

- **params:** shell request params
- **options:** optional
  - **group:** group id. used to group shell sessions, so they can be stopped later by group id.
  - **cwd:** base path. if not specified, the cwd is set as ~/pinokio

#### return value

- **id:** The created shell id

### shell.enter

```javascript
let response = await kernel.shell.enter(params, ondata)
```

#### parameters

- **params:** shell request params
- **ondata:** realtime callback that gets called for every shell event. Triggers the following event object:
  - **id:** The shell ID
  - **raw:** Raw event string
  - **state** The full terminal text when the event was triggered

#### return value

- **response:** The full terminal text

### shell.write

```javascript
let response = await kernel.shell.write(params, ondata)
```

#### parameters

- **params:** shell request params
- **ondata:** realtime callback that gets called for every shell event. Triggers the following event object:
  - **id:** The shell ID
  - **raw:** Raw event string
  - **state** The full terminal text when the event was triggered

#### return value

- **response:** The full terminal text

### shell.stop

```javascript
await kernel.shell.stop(query)
```

- **query**
  - **id:** stop a shell session by ID
  - **group:** stop all shell sessions that belong to the group


