import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Pinokio",
  description: "AI Browser",
  transformHead: ({ pageData }) => {
    const head = []

    head.push(['meta', { property: 'og:type', content: "website" }])
    head.push(['meta', { property: 'og:title', content: "Pinokio documentation" }])
    head.push(['meta', { property: 'og:description', content: "A Living Application" }])
    head.push(['meta', { property: 'og:image', content: "https://docs.pinokio.computer/poster.png" }])
    head.push(['meta', { property: 'og:url', content: "https://docs.pinokio.computer" }])
    head.push(['meta', { name: 'twitter:card', content: "summary_large_image" }])
    head.push(['meta', { name: 'twitter:title', content: "Pinokio documentation" }])
    head.push(['meta', { name: 'twitter:description', content: "A Living Application" }])
    head.push(['meta', { name: 'twitter:image', content: "https://docs.pinokio.computer/poster.png" }])

    return head
  },
  themeConfig: {
    search: {
      provider: 'local'
    },

    logo: {
      "light": "/pinokio.png",
      "dark": "/pinokio-white.png",
      "alt": ""
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: 'https://pinokio.computer' },
      { text: 'Twitter', link: 'https://twitter.com/cocktailpeanut' },
      { text: 'GitHub', link: 'https://github.com/pinokiocomputer/pinokio' },
      { text: 'Discord', link: 'https://discord.gg/TQdNwadtE4' },
    ],

//    aside: "left",
    outline: [2, 3],

    sidebar: [
      {
//        collapsible:true,
//        collapsed:true,
        text: 'Pinokio',
        items: [
          { text: 'Introduction', link: '/' },
        ]
      },
      {
        text: "Download",
        items: [
          { text: 'Download Pinokio', link: '/download/index' },
          { text: "M1/M2 Mac", link: "/download/applemac" },
          { text: "Intel Mac", link: "/download/intelmac" },
          { text: "Windows", link: "/download/windows" },
          { text: "Linux", link: "/download/linux" },
          { text: "Beta", link: "/download/beta" },
        ]
      },
      {
        collapsible:true,
//        collapsed:true,
        text: "Tutorial",
        items: [
          { text: 'Getting started', link: '/tutorial/index' },
          { text: 'Hello world', link: '/tutorial/hello' },
          { text: 'Run multiple commands', link: '/tutorial/multiple' },
          { text: 'Automatically type keys', link: '/tutorial/write' },
          { text: 'Pressing enter', link: '/tutorial/enter' },
          { text: 'Interacting with the shell', link: '/tutorial/programming' },
          { text: 'Run python scripts', link: '/tutorial/python' },
          { text: 'Custom environment variables', link: '/tutorial/env' },
          { text: 'Self driving scripts', link: '/tutorial/autostart' },
          { text: 'Custom menu bar', link: '/tutorial/menu' },
          { text: 'Install a DB automatically', link: '/tutorial/database' },
          { text: 'Documenting scripts', link: '/tutorial/document' },
          { text: 'Dynamic scripts', link: '/tutorial/dynamic' },
          { text: 'Declaring dependencies', link: '/tutorial/dependencies' },
          { text: 'User-friendly forms', link: '/tutorial/forms' },
          { text: 'Publishing scripts', link: '/tutorial/publish' },
          { text: 'Sharing scripts', link: '/tutorial/share' },
          { text: 'Build your own API', link: '/tutorial/api' },
        ]
      },
//      {
//        collapsible:true,
////        collapsed:true,
//        text: "Advanced",
//        items: [
////          { text: "Overview", link: "/apps/overview" },
////          { text: "API Framework", link: "/apps/api" },
////          { text: "Using the API", link: "/apps/rpc" },
////          { text: "Creating an App", link: "/apps/create" },
//          { text: "Testing the App", link: "/apps/test" },
//          { text: "Publishing the App", link: "/apps/publish" },
//          { text: "Configuring App Execution", link: "/apps/configure" },
////          { text: "Shell API Interface", link: "/apps/shell" },
//          { text: "Automatic Form Generation", link: "/apps/form" }
//        ]
//      },
      {
        collapsible:true,
//        collapsed:true,
        text: "File System",
        items: [
          { text: 'Overview', link: '/fs/overview' },
//          { text: 'Structure', link: '/fs/structure' },
          { text: 'URI', link: '/fs/uri' },
        ]
      },
      {
        collapsible:true,
//        collapsed:true,
        text: "Processor",
        items: [
          { text: "Overview", link: '/processor/overview' },
          { text: "Fetch", link: '/processor/fetch' },
          { text: "Decode", link: '/processor/decode' },
          { text: "Execute", link: '/processor/execute' },
        ]
      },
      {
        collapsible:true,
//        collapsed:true,
        text: "Memory",
        items: [
          { text: "Overview", link: "/memory/overview" },
          { text: "Input", link: "/memory/input" },
          { text: "Local Variable", link: "/memory/local" },
          { text: "Global Variable", link: "/memory/global" },
          { text: "Self", link: "/memory/self" },
        ]
      },
      {
        collapsible:true,
//        collapsed:true,
        text: "API",
        items: [
          { text: "Overview", link: "/api/overview" },
          { text: "File System", link: "/api/fs" },
          { text: "Data Structure", link: "/api/datastructure" },
          { text: "Shell", link: "/api/shell" },
          { text: "Flow Control", link: "/api/flow" },
          { text: "Networking", link: "/api/networking" },
          { text: "Notification", link: "/api/notify" },
          { text: "Input", link: "/api/input" },
          { text: "Browser", link: "/api/browser" },
          { text: "Logging", link: "/api/log" },
        ]
      },
      {
        text: "Build your own API",
        items: [
          { text: "What is an API?", link: "/custom/what" },
          { text: "Quickstart", link: "/custom/quickstart" },
          { text: "JavaScript Shell API", link: "/custom/shell" },
          { text: "API Reference", link: "/custom/reference" },
        ]
      },
      {
        collapsible:true,
//        collapsed:true,
        text: "Lifeform",
        items: [
          { text: "Overview", link: "/ai/overview" },
          { text: "State Machine", link: "/ai/statemachine" },
          { text: "DNA", link: "/ai/dna" },
          { text: "Neuron", link: "/ai/neuron" },
          { text: "Growth", link: "/ai/growth" },
          { text: "Reproduction", link: "/ai/reproduction" },
          { text: "Writing history", link: "/ai/history" },

        ]
      }
    ],

//    socialLinks: [
//      { icon: 'github', link: 'https://github.com/cocktailpeanut/pinokio' },
//      { icon: 'twitter', link: 'https://twitter.com/cocktailpeanut' }
//    ]
  }
})
