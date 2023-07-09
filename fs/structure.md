# Structure

```
~
  /pinokio
    /api    # stores the user installed files
    /bin    # stores binary files, such as cmake, git, python, etc.
```

## bin

The `bin` folder stores all the binaries commonly used by AI engines. Currently includes:

- **python** (and `pip`)
- **node.js**
- **git** (only on windows for now, since mac and linux mostly ships with git)
- **cmake** used for building C projects
- more coming soon (please request if you need something)

## api

The `api` folder is where the user downloaded repositories are stored. An API folder can contain either of the following:

1. **downloaded from git:** repositories you downloaded from git.
2. **locally created:** you can manually create folders and work from there.

A Pinokio API is a completely local.
