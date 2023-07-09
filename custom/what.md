# What is an API?

## Local first API

In Pinokio, APIs are local JavaScript classes that behave like remote servers.

It's easy to understand when we compare it to traditional APIs.

## Traditional API vs. Pinokio API

### Traditional API

Here's an example "traditional" API request:

```
POST /test HTTP/1.1
Host: foo.example
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

field1=value1&field2=value2
```

Basically it's making a:

1. **POST** request
2. to the route **/test**
3. at a remote server **foo.example**
4. by passing the key value pairs **field1=value1&field2=value2**

### Pinokio API

With Pinokio, all APIs exist locally.

Instead of making a request to a remote server, the API requests go to locally installed JavaScript modules.

Here's an example Pinokio request:

```json
{
  "uri": "https://github.com/cocktailpeanut/sum.git/api.js",
  "method": "sum",
  "params": [1,2,3,4,5]
}
```

Here's how it works:

1. First download the JavaScript module at `https://github.com/cocktailpeanut/sum.git` (**NOTE: the URI is used to DOWNLOAD the entire repository, not to make a reuqest to it**)
2. Resolve the endpoint by importing the JavaScript module at `api.js`
3. Look up the exported `sum()` inside the `api.js` file
4. Pass in the `params` to the resolved `sum()` method.
5. The `sum()` method does its job and returns a response.

Basically, everything happens locally but it resembles a network request.

## Building a custom API

Therefore, building a custom API simply means writing a JavaScript module that follows a certain convention (will be explained in the following sections).

All you need to do is write a single JavaScript module while following the Pinokio JavaScript API convention, and you should be able to immediately start calling these API "backends" using JSON scripts.
