# Vue SSR Pagination 
> 根据页码生成 a 标签 使得浏览器可以抓取 a 链接
> 用于需要 SEO 分页插件，例结合nuxtjs使用
> 支持 查询参数模式 及 动态路由模式

##### 查询参数模式
[![Oxv9r6.png](https://s1.ax1x.com/2022/05/22/Oxv9r6.png)](https://s1.ax1x.com/2022/05/22/Oxv9r6.png)

##### 动态路由模式
[![Oxj2VS.png](https://s1.ax1x.com/2022/05/22/Oxj2VS.png)](https://s1.ax1x.com/2022/05/22/Oxj2VS.png)


# DEMO
<a href="https://yokochen222.github.io/vue-ssr-pagination/">https://yokochen222.github.io/vue-ssr-pagination/<a>
# Props
| name    | type  | default |  desc  |
| --------   | ----- | ---- | ---- |
| total      | Number   | 0 | 总数据条数    |
| pageSize   |   Number   | 10 | 每页条数   |
| currentPage |    Number    | 1 | 当前页码  |
| pathPrefix |    String    | '/'  | 生成路由前缀  |
| pageQueryName |    String  | 'page' |  查询参数名称 ⚠️：queryMode 为 2 时生效  |
| queryMode |    Number    | 1 |   1 动态路由模式, 2 查询参数模式  |
| pagerCount | Number | 5 |  大于等于 5 且小于等于 21 的奇数 |
| layout | String| 'prev, pager, next, jumper, ->, total' | 组件布局，子组件名用逗号分隔 |
| prevBtnClassName | String | - | 上一页按钮类名 |
| prevBtnText | String | - | 上一页按钮文本 |
| nextBtnClassName | String | - | 下一页按钮类名 |
| nextBtnText | String | - | 下一页按钮文本 |
| background | Boolean | false | 是否为分页按钮添加背景色 |
| small | Boolean | false | 是否使用小型分页样式 |


# Usege

#### 1、局部注册
```html
<script setup lang="ts">
import YoPagination from './packages/Pagination.vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const query = reactive({
    total: 100,
    page: 1,
})
const handleChangePage = (e: { path: string; page: number }) => {
    router.push(e.path)
}
</script>

<template>
    <YoPagination
        @current-change="handleChangePage"
        :total="100"
        :query-mode="2"
        page-query-name="page"
        path-prefix="/pages/number?t=12"
        v-model:current-page="query.page"
    />
</template>

<style></style>

```

#### 2、全局注册
```js
  import App from './App.vue'
  import YoPagination from './packages/index'
  import { createApp } from 'vue'

  const app = createApp(App)

  app.use(YoPagination)
  
  app.mount('#app')
```