<script setup lang="ts">
import { reactive } from 'vue'
// import { useRouter } from 'vue-router'
// const router = useRouter()
const query = reactive({
    total: 100,
    page: 1,
})
const handleChangePage = (e: { path: string; page: number }) => {
    // router.push(e.path)
    console.log(e.page)
}
</script>

<template>
    <YoPagination
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
