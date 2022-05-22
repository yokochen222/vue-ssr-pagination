<script setup lang="ts">
import { reactive } from 'vue'
const query = reactive({
    total: 100,
    page: 1,
})
const handleChangePage = (e: { path: string; page: number }) => {
    console.log(e)
}
</script>

<template>
    <VueSSRPagination
        @current-change="handleChangePage"
        :total="100"
        :query-mode="2"
        page-query-name="p"
        layout="prev,pager, next, jumper, ->, total, "
        path-prefix="/pages/number?t=12"
        v-model:current-page="query.page"
    />
</template>

<style></style>
