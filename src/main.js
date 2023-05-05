import { createApp } from "vue";
import ElementPlus from 'element-plus'
import App from "./App"
import router from "./router"
import 'element-plus/dist/index.css'
// import "./styles/element/index.scss"


const app =createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app');
