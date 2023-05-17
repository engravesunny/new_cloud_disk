import { createApp } from 'vue'
import pinia from './store'
import App from './App.vue'
import './style/index.css'
import './assets/icon/iconfont/iconfont.css'
import router from './router'



const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
