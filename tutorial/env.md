# Custom envrionment variables

Often, programs require setting custom environment variables for the execution context. Some examples:

1. **Server Configuration:** For example, Automatic1111 (StableDiffusion) lets you set the environment variable `COMMANDLINE_ARGS` to customize how the stable diffusion web ui is configured.
2. **API Keys:** Many apps do NOT store private secrets and API keys in the code but lets you pass them in through environment variables (example: `OPENAI_API_KEY`, etc.)

The shell API lets you specify custom environment variables as well (This example uses a fake API key).

```json
{
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "npm start",
      "env": {
        "OPENAI_API_KEY": "sk-r2v42ad3f8s3hfslgh3skdhgl3ksdhbh3ks34t23djgFdDa"
      }
    }
  }]
}
```

1. It runs the `npm start` command
2. But also passes in the `env` attribute, which sets the `OPENAI_API_KEY` variable when executing `npm start`.
