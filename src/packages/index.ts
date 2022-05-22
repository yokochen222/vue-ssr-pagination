import Pagination from './Pagination.vue'
import { App } from 'vue'

export const VueSSRPagination = Pagination
export default {
  install(app: App) {
    app.component('VueSSRPagination', Pagination)
  }
}