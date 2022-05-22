import Pagination from './Pagination.vue'
import { App } from 'vue'

export const YoPagination = Pagination
export default {
  install(app: App) {
    app.component('YoPagination', Pagination)
  }
}