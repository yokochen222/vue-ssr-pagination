import { createApp } from 'vue'
import App from './App.vue'

import YoPagination from './packages/index'

const app = createApp(App)

app.use(YoPagination)

app.mount('#app')
