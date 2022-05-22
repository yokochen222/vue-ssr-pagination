<script lang="tsx">
import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        total: {
            type: Number,
            default: 0,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        currentPage: {
            type: Number,
            default: 1,
        },
        // 大于等于 5 且小于等于 21 的奇数
        pagerCount: {
            type: Number,
            default: 5,
        },
        pathPrefix: {
            type: String,
            default: '/',
        },
        pageQueryName: {
            type: String,
            default: 'page',
        },
        queryMode: {
            type: Number,
            default: 2, // 1 pathInfo, 2 queryString
        },
        layout: {
            type: String,
            default: 'prev, pager, next, jumper, ->, total',
        },
        prevBtnClassName: {
            type: String,
            default: '',
        },
        prevBtnText: {
            type: String,
            default: '上一页',
        },
        nextBtnClassName: {
            type: String,
            default: '',
        },
        nextBtnText: {
            type: String,
            default: '下一页',
        },
        background: {
            type: Boolean,
            default: true,
        },
        small: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isShowPrevMore: false,
            isShowNextMore: false,
        }
    },
    computed: {
        totalPage() {
            const t = Math.ceil(this.total / this.pageSize)
            return t ? t : 1
        },
        layoutComputed() {
            let arr = this.layout.split(',')
            arr = arr.map((item) => item.trim()).filter((item) => item)
            return arr
        },
        pathPrefixComputed() {
            let path = this.pathPrefix
            if (this.queryMode === 2) {
                if (path.includes('?')) {
                    path += `&${this.pageQueryName}=`
                } else {
                    path += `?${this.pageQueryName}=`
                }
            } else if (this.queryMode === 1) {
                if (path.substring(path.length - 1, 1) !== '/') {
                    path += '/'
                }
            }
            return path
        },
        pagers() {
            const pagerCount: number = this.pagerCount
            const halfPagerCount = (pagerCount - 1) / 2
            const currentPage = Number(this.currentPage)
            const pageCount = Number(this.totalPage)
            let showPrevMore = false
            let showNextMore = false
            if (pageCount > pagerCount) {
                if (currentPage > pagerCount - halfPagerCount) {
                    showPrevMore = true
                }
                if (currentPage < pageCount - halfPagerCount) {
                    showNextMore = true
                }
            }
            const array = []
            if (showPrevMore && !showNextMore) {
                const startPage = pageCount - (pagerCount - 2)
                for (let i = startPage; i < pageCount; i++) {
                    array.push(i)
                }
            } else if (!showPrevMore && showNextMore) {
                for (let i = 2; i < pagerCount; i++) {
                    array.push(i)
                }
            } else if (showPrevMore && showNextMore) {
                const offset = Math.floor(pagerCount / 2) - 1
                for (
                    let i = currentPage - offset;
                    i <= currentPage + offset;
                    i++
                ) {
                    array.push(i)
                }
            } else {
                for (let i = 2; i < pageCount; i++) {
                    array.push(i)
                }
            }
            this.isShowPrevMore = showPrevMore
            this.isShowNextMore = showNextMore
            return array
        },
    },
    methods: {
        handleChangePage(page: number, e: MouseEvent | null): undefined {
            if (e) {
                e.preventDefault()
                e.stopPropagation()
            }
            if (this.currentPage === page) {
                return
            }

            this.$emit('update:currentPage', page)
            this.$emit('currentChange', {
                page: page,
                path: this.pathPrefixComputed + page,
            })
            return
        },
        handleShowMoreClick(type: number) {
            let newPage = this.currentPage
            const pagerCountOffset = this.pagerCount - 2
            if (type === -1) {
                newPage = this.currentPage - pagerCountOffset
            } else {
                newPage = this.currentPage + pagerCountOffset
            }
            this.handleChangePage(newPage, null)
        },
        handleJumperChange(e: any) {
            const totalPage = this.totalPage
            const page = Number(e.target.value)
            if (page > totalPage) {
                e.target.value = totalPage
                this.handleChangePage(totalPage, null)
                return false
            }
            if (page < 1) {
                e.target.value = 1
                this.handleChangePage(1, null)
                return false
            }
            this.handleChangePage(page, null)
        },
    },
    render() {
        const doms = new Map()
        const prev = (
            <a
                onClick={(e) => {
                    this.handleChangePage(
                        this.currentPage - 1 >= 1 ? this.currentPage - 1 : 1,
                        e
                    )
                }}
                href={`${this.pathPrefixComputed}${
                    this.currentPage - 1 >= 1 ? this.currentPage - 1 : 1
                }`}
                class={`yo-pagination-btn yo-pagination-btn-pre ${
                    this.prevBtnClassName
                } ${this.currentPage <= 1 ? 'disabled' : ''}`}
            >
                {this.prevBtnText}
            </a>
        )
        const next = (
            <a
                onClick={(e) => {
                    this.handleChangePage(
                        this.currentPage + 1 > this.totalPage
                            ? this.totalPage
                            : this.currentPage + 1,
                        e
                    )
                }}
                href=""
                class={`yo-pagination-btn yo-pagination-btn-next ${
                    this.nextBtnClassName
                } ${this.currentPage >= this.totalPage ? 'disabled' : ''}`}
            >
                {this.nextBtnText}
            </a>
        )
        const total = (
            <div class="yo-total">
                共 <span class="yo-total-num">{this.total}</span> 条
            </div>
        )
        const jumper = (
            <div class="yo-jumper">
                前往
                <input
                    value={this.currentPage}
                    onBlur={(e) => {
                        this.handleJumperChange(e)
                    }}
                    type="number"
                    class="yo-input"
                />
                页
            </div>
        )
        const pager = () => {
            if (!this.total) {
                return ''
            }
            const dms = []
            const pagerNums = this.pagers.map((page) => {
                return (
                    <a
                        href={`${this.pathPrefixComputed}${page}`}
                        class={`yo-pagination-btn ${
                            this.currentPage === page ? 'active' : ''
                        }`}
                        onClick={(e) => {
                            this.handleChangePage(page, e)
                        }}
                    >
                        {page}
                    </a>
                )
            })

            if (this.isShowPrevMore) {
                dms.push(
                    <div
                        onClick={() => {
                            this.handleShowMoreClick(-1)
                        }}
                        class="yo-pagination-btn yo-pagination-btn-more"
                    >
                        ···
                    </div>
                )
            }
            if (pagerNums && pagerNums.length) {
                dms.push(...pagerNums)
            }
            if (this.isShowNextMore) {
                dms.push(
                    <div
                        onClick={() => {
                            this.handleShowMoreClick(1)
                        }}
                        class="yo-pagination-btn yo-pagination-btn-more"
                    >
                        ···
                    </div>
                )
            }

            return (
                <>
                    <a
                        onClick={(e) => {
                            this.handleChangePage(1, e)
                        }}
                        href={`${this.pathPrefixComputed}1`}
                        class={`yo-pagination-btn ${
                            this.currentPage === 1 ? 'active' : ''
                        }`}
                    >
                        1
                    </a>
                    {dms}
                    <a
                        onClick={(e) => {
                            this.handleChangePage(this.totalPage, e)
                        }}
                        href={`${this.pathPrefixComputed}1`}
                        class={`yo-pagination-btn ${
                            this.currentPage === this.totalPage ? 'active' : ''
                        }`}
                    >
                        {this.totalPage}
                    </a>
                </>
            )
        }

        doms.set('prev', prev)
        doms.set('next', next)
        doms.set('total', total)
        doms.set('jumper', jumper)
        doms.set('pager', pager())
        doms.set('->', <div class="yo-pagination-space "></div>)
        const d = this.layoutComputed.map((name) => {
            return doms.get(name)
        })
        return (
            <div
                class={`yo-pagination ${
                    this.background ? 'yo-pagination-background' : ''
                } ${this.small ? 'yo-pagination-small' : ''}`}
            >
                {d}
            </div>
        )
    },
})
</script>

<style lang="scss" scoped>
$color-border: #dcdfe6;
$color-disabled: #c0c4cc;
$color-primary: #0087ff;

.yo-pagination {
    font-size: 13px;
    color: #606266;
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    font-weight: 700;
    &-background {
        .yo-pagination-btn {
            background-color: #f4f4f5;
            margin: 0 5px;
            &.active {
                background-color: $color-primary;
                color: #fff;
            }
        }
    }
    &-small {
        font-size: 12px;
        .yo-pagination-btn {
            font-size: 12px;
            line-height: 22px;
            height: 22px;
            min-width: 22px;
        }
        .yo-jumper {
            .yo-input {
                font-size: 12px;
                height: 22px;
                line-height: 22px;
            }
        }
    }
}

.yo-pagination-btn {
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    color: #606266;
    padding: 0 4px;
    display: inline-block;
    font-weight: 700;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    border-radius: 2px;
    vertical-align: middle;
    transition: all 0.3s;
    &.active,
    &:hover {
        color: $color-primary;
    }
    &.disabled {
        cursor: not-allowed;
        color: $color-disabled;
        &:hover {
            color: $color-disabled;
        }
    }
}
.yo-pagination-space {
    flex: 1;
}
.yo-pagination-btn-pre,
.yo-pagination-btn-next {
    min-width: 40px;
}

.yo-total {
    display: inline-block;
    margin: 0 10px;
    vertical-align: middle;
}

.yo-jumper {
    display: inline-block;
    vertical-align: middle;
    margin: 0 10px;

    .yo-input {
        border: 1px solid $color-border;
        height: 28px;
        width: 50px;
        outline: none;
        font-size: 13px;
        border-radius: 4px;
        box-sizing: border-box;
        margin: 0 3px;
        color: #606266;
        text-align: center;
        -moz-appearance: textfield;
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
}
</style>
