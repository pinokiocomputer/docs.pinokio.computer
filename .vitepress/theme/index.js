import DefaultTheme from 'vitepress/theme'
//import Layout from "./Layout.vue";
import './custom.css'

export default DefaultTheme
//export default {
//  extends: DefaultTheme,
//  ...DefaultTheme,
////  Layout: Layout,
//  enhanceApp({ app }) {
//    if (typeof document === 'undefined') return
//    document.onreadystatechange = () => {
//      if (document.readyState === 'complete') {
//        const { hash } = location
//        console.log("hash", hash)
//        const decoded = decodeURIComponent(hash)
//        setTimeout(() => {
//          document.querySelector(decoded).scrollIntoView()
//        }, 1000)
//        /*
//        const { hash } = location
//        console.log("hash", hash)
//        const decoded = decodeURIComponent(hash)
//        console.log("decoded", decoded)
//        if (hash !== decoded) {
//          document.querySelector(decoded).scrollIntoView()
//        }
//        */
//      }
//    }
//  }
//};
