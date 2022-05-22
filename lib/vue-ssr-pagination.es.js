function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const extend = Object.assign;
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isObject = (val) => val !== null && typeof val === "object";
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
let currentRenderingInstance = null;
let currentScopeId = null;
const isSuspense = (type) => type.__isSuspense;
function defineComponent(options) {
  return isFunction(options) ? { setup: options, name: options.name } : options;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
let currentBlock = null;
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref, ref_key, ref_for }) => {
  return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (!isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (!isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
var _sfc_main = defineComponent({
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pagerCount: {
      type: Number,
      default: 5
    },
    pathPrefix: {
      type: String,
      default: "/"
    },
    pageQueryName: {
      type: String,
      default: "page"
    },
    queryMode: {
      type: Number,
      default: 2
    },
    layout: {
      type: String,
      default: "prev, pager, next, jumper, ->, total"
    },
    prevBtnClassName: {
      type: String,
      default: ""
    },
    prevBtnText: {
      type: String,
      default: "\u4E0A\u4E00\u9875"
    },
    nextBtnClassName: {
      type: String,
      default: ""
    },
    nextBtnText: {
      type: String,
      default: "\u4E0B\u4E00\u9875"
    },
    background: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowPrevMore: false,
      isShowNextMore: false
    };
  },
  computed: {
    totalPage() {
      const t = Math.ceil(this.total / this.pageSize);
      return t ? t : 1;
    },
    layoutComputed() {
      let arr = this.layout.split(",");
      arr = arr.map((item) => item.trim()).filter((item) => item);
      return arr;
    },
    pathPrefixComputed() {
      let path = this.pathPrefix;
      if (this.queryMode === 2) {
        if (path.includes("?")) {
          path += `&${this.pageQueryName}=`;
        } else {
          path += `?${this.pageQueryName}=`;
        }
      } else if (this.queryMode === 1) {
        if (path.substring(path.length - 1, 1) !== "/") {
          path += "/";
        }
      }
      return path;
    },
    pagers() {
      const pagerCount = this.pagerCount;
      const halfPagerCount = (pagerCount - 1) / 2;
      const currentPage = Number(this.currentPage);
      const pageCount = Number(this.totalPage);
      let showPrevMore = false;
      let showNextMore = false;
      if (pageCount > pagerCount) {
        if (currentPage > pagerCount - halfPagerCount) {
          showPrevMore = true;
        }
        if (currentPage < pageCount - halfPagerCount) {
          showNextMore = true;
        }
      }
      const array = [];
      if (showPrevMore && !showNextMore) {
        const startPage = pageCount - (pagerCount - 2);
        for (let i = startPage; i < pageCount; i++) {
          array.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pagerCount; i++) {
          array.push(i);
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pagerCount / 2) - 1;
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          array.push(i);
        }
      } else {
        for (let i = 2; i < pageCount; i++) {
          array.push(i);
        }
      }
      this.isShowPrevMore = showPrevMore;
      this.isShowNextMore = showNextMore;
      return array;
    }
  },
  methods: {
    handleChangePage(page, e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (this.currentPage === page) {
        return;
      }
      this.$emit("update:currentPage", page);
      this.$emit("currentChange", {
        page,
        path: this.pathPrefixComputed + page
      });
      return;
    },
    handleShowMoreClick(type) {
      let newPage = this.currentPage;
      const pagerCountOffset = this.pagerCount - 2;
      if (type === -1) {
        newPage = this.currentPage - pagerCountOffset;
      } else {
        newPage = this.currentPage + pagerCountOffset;
      }
      this.handleChangePage(newPage, null);
    },
    handleJumperChange(e) {
      const totalPage = this.totalPage;
      const page = Number(e.target.value);
      if (page > totalPage) {
        e.target.value = totalPage;
        this.handleChangePage(totalPage, null);
        return false;
      }
      if (page < 1) {
        e.target.value = 1;
        this.handleChangePage(1, null);
        return false;
      }
      this.handleChangePage(page, null);
    }
  },
  render() {
    const doms = /* @__PURE__ */ new Map();
    const prev = createVNode("a", {
      "onClick": (e) => {
        this.handleChangePage(this.currentPage - 1 >= 1 ? this.currentPage - 1 : 1, e);
      },
      "href": `${this.pathPrefixComputed}${this.currentPage - 1 >= 1 ? this.currentPage - 1 : 1}`,
      "class": `yo-pagination-btn yo-pagination-btn-pre ${this.prevBtnClassName} ${this.currentPage <= 1 ? "disabled" : ""}`
    }, [this.prevBtnText]);
    const next = createVNode("a", {
      "onClick": (e) => {
        this.handleChangePage(this.currentPage + 1 > this.totalPage ? this.totalPage : this.currentPage + 1, e);
      },
      "href": "",
      "class": `yo-pagination-btn yo-pagination-btn-next ${this.nextBtnClassName} ${this.currentPage >= this.totalPage ? "disabled" : ""}`
    }, [this.nextBtnText]);
    const total = createVNode("div", {
      "class": "yo-total"
    }, [createTextVNode("\u5171 "), createVNode("span", {
      "class": "yo-total-num"
    }, [this.total]), createTextVNode(" \u6761")]);
    const jumper = createVNode("div", {
      "class": "yo-jumper"
    }, [createTextVNode("\u524D\u5F80"), createVNode("input", {
      "value": this.currentPage,
      "onBlur": (e) => {
        this.handleJumperChange(e);
      },
      "type": "number",
      "class": "yo-input"
    }, null), createTextVNode("\u9875")]);
    const pager = () => {
      if (!this.total) {
        return "";
      }
      const dms = [];
      const pagerNums = this.pagers.map((page) => {
        return createVNode("a", {
          "href": `${this.pathPrefixComputed}${page}`,
          "class": `yo-pagination-btn ${this.currentPage === page ? "active" : ""}`,
          "onClick": (e) => {
            this.handleChangePage(page, e);
          }
        }, [page]);
      });
      if (this.isShowPrevMore) {
        dms.push(createVNode("div", {
          "onClick": () => {
            this.handleShowMoreClick(-1);
          },
          "class": "yo-pagination-btn yo-pagination-btn-more"
        }, [createTextVNode("\xB7\xB7\xB7")]));
      }
      if (pagerNums && pagerNums.length) {
        dms.push(...pagerNums);
      }
      if (this.isShowNextMore) {
        dms.push(createVNode("div", {
          "onClick": () => {
            this.handleShowMoreClick(1);
          },
          "class": "yo-pagination-btn yo-pagination-btn-more"
        }, [createTextVNode("\xB7\xB7\xB7")]));
      }
      return createVNode(Fragment, null, [createVNode("a", {
        "onClick": (e) => {
          this.handleChangePage(1, e);
        },
        "href": `${this.pathPrefixComputed}1`,
        "class": `yo-pagination-btn ${this.currentPage === 1 ? "active" : ""}`
      }, [createTextVNode("1")]), dms, createVNode("a", {
        "onClick": (e) => {
          this.handleChangePage(this.totalPage, e);
        },
        "href": `${this.pathPrefixComputed}1`,
        "class": `yo-pagination-btn ${this.currentPage === this.totalPage ? "active" : ""}`
      }, [this.totalPage])]);
    };
    doms.set("prev", prev);
    doms.set("next", next);
    doms.set("total", total);
    doms.set("jumper", jumper);
    doms.set("pager", pager());
    doms.set("->", createVNode("div", {
      "class": "yo-pagination-space "
    }, null));
    const d = this.layoutComputed.map((name) => {
      return doms.get(name);
    });
    return createVNode("div", {
      "class": `yo-pagination ${this.background ? "yo-pagination-background" : ""} ${this.small ? "yo-pagination-small" : ""}`
    }, [d]);
  }
});
var Pagination_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
var Pagination = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3b3b5cff"]]);
const VueSSRPagination = Pagination;
var index = {
  install(app) {
    app.component("VueSSRPagination", Pagination);
  }
};
export { VueSSRPagination, index as default };
