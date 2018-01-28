webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(23)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(17);
module.exports = __webpack_require__(54);


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App_vue__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__App_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_outside_events__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_outside_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_outside_events__);
window.Vue = __webpack_require__(6);



Vue.use(__WEBPACK_IMPORTED_MODULE_1_vue_outside_events___default.a);

var EventBus = new Vue();

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function get() {
      return EventBus;
    }
  }
});

var app = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App: __WEBPACK_IMPORTED_MODULE_0__App_vue___default.a }
});

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(21)
}
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(24)
/* template */
var __vue_template__ = __webpack_require__(52)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/App.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-66ab2f82", Component.options)
  } else {
    hotAPI.reload("data-v-66ab2f82", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("7a9ef29d", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-66ab2f82\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-66ab2f82\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\n*, *::before, *::after {\n\t-webkit-box-sizing: border-box;\n\t        box-sizing: border-box;\n}\n", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_TopBar_vue__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_TopBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_TopBar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_PuzzleHeading_vue__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_PuzzleHeading_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_PuzzleHeading_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_WordColumn_vue__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_WordColumn_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_WordColumn_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_PuzzleViz_vue__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_PuzzleViz_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_PuzzleViz_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_WordSuggestions_vue__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_WordSuggestions_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_WordSuggestions_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_BottomBar_vue__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_BottomBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_BottomBar_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








var _data = {
	ca_puzzle_name: "Zigs and Zags",

	ca_selected_index: 0,
	ca_letter_input: "",
	ca_input_direction: "across",

	ca_user: {
		name: "James Little",
		username: "james"
	},

	ca_board: {
		dimension: 15,
		spaces: [],
		words: []
	}
};

/* harmony default export */ __webpack_exports__["default"] = ({
	components: {
		TopBar: __WEBPACK_IMPORTED_MODULE_0__components_TopBar_vue___default.a, PuzzleHeading: __WEBPACK_IMPORTED_MODULE_1__components_PuzzleHeading_vue___default.a, WordColumn: __WEBPACK_IMPORTED_MODULE_2__components_WordColumn_vue___default.a, PuzzleViz: __WEBPACK_IMPORTED_MODULE_3__components_PuzzleViz_vue___default.a,
		WordSuggestions: __WEBPACK_IMPORTED_MODULE_4__components_WordSuggestions_vue___default.a, BottomBar: __WEBPACK_IMPORTED_MODULE_5__components_BottomBar_vue___default.a
	},

	data: function data() {
		return _data;
	},

	created: function created() {
		var _this = this;

		this.$bus.$on('switchInputDirection', function ($event) {
			_this.ca_input_direction = _this.ca_input_direction == "across" ? "down" : "across";
		});
	}
});

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(26)
}
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(28)
/* template */
var __vue_template__ = __webpack_require__(29)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-63fa6c75"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/TopBar.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-63fa6c75", Component.options)
  } else {
    hotAPI.reload("data-v-63fa6c75", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("9c003eea", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63fa6c75\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TopBar.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63fa6c75\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TopBar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\n.top-bar[data-v-63fa6c75] {\n  position: relative;\n}\n.user-dropdown-trigger[data-v-63fa6c75] {\n  vertical-align: text-top;\n  font-weight: bold;\n}\n.dropdown-active[data-v-63fa6c75] {\n  font-style: italic;\n}\n.dropdown-active svg[data-v-63fa6c75] {\n    -webkit-transform: rotate(180deg);\n            transform: rotate(180deg);\n}\n.user-dropdown[data-v-63fa6c75] {\n  position: absolute;\n  top: 35px;\n  right: 20px;\n  width: 140px;\n  background: white;\n  border: 1px solid black;\n  border-radius: 5px;\n  padding: 5px;\n  -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);\n          box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);\n}\n.user-dropdown li[data-v-63fa6c75] {\n    padding: 5px 0;\n    border-bottom: 1px solid #CCC;\n    list-style-type: none;\n}\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
    name: "topBar",
    props: ['user'],
    data: function data() {
        return {
            userDropdownVisible: false
        };
    },
    methods: {
        hideUserDropdown: function hideUserDropdown() {
            if (this.userDropdownVisible) {
                this.userDropdownVisible = false;
            }
        }
    }
});

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "top-bar" }, [
    _c("div", { staticClass: "app-name" }, [_vm._v("crossed.io")]),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "user-dropdown-trigger",
        class: { "dropdown-active": _vm.userDropdownVisible },
        on: {
          click: function($event) {
            _vm.userDropdownVisible = !_vm.userDropdownVisible
          }
        }
      },
      [
        _vm._v(_vm._s(_vm.user.username) + "\n\n    "),
        _c(
          "svg",
          {
            attrs: {
              version: "1.1",
              id: "Chevron_down",
              xmlns: "http://www.w3.org/2000/svg",
              "xmlns:xlink": "http://www.w3.org/1999/xlink",
              x: "0px",
              y: "0px",
              width: "27",
              height: "27",
              viewBox: "0 0 20 20",
              "enable-background": "new 0 0 20 20",
              "xml:space": "preserve"
            }
          },
          [
            _c("path", {
              attrs: {
                d:
                  "M4.516,7.548c0.436-0.446,1.043-0.481,1.576,0L10,11.295l3.908-3.747c0.533-0.481,1.141-0.446,1.574,0\n        c0.436,0.445,0.408,1.197,0,1.615c-0.406,0.418-4.695,4.502-4.695,4.502C10.57,13.888,10.285,14,10,14s-0.57-0.112-0.789-0.335\n        c0,0-4.287-4.084-4.695-4.502C4.107,8.745,4.08,7.993,4.516,7.548z"
              }
            })
          ]
        )
      ]
    ),
    _vm._v(" "),
    _vm.userDropdownVisible
      ? _c(
          "div",
          {
            directives: [
              {
                name: "click-outside",
                rawName: "v-click-outside",
                value: _vm.hideUserDropdown,
                expression: "hideUserDropdown"
              }
            ],
            staticClass: "user-dropdown"
          },
          [
            _c("li", [
              _c("a", { attrs: { href: "#" } }, [_vm._v(_vm._s(_vm.user.name))])
            ]),
            _vm._v(" "),
            _vm._m(0)
          ]
        )
      : _vm._e()
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", [
      _c("a", { attrs: { href: "#" } }, [_vm._v("Something else")])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-63fa6c75", module.exports)
  }
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(31)
}
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(33)
/* template */
var __vue_template__ = __webpack_require__(34)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-9bce6d86"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/PuzzleHeading.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9bce6d86", Component.options)
  } else {
    hotAPI.reload("data-v-9bce6d86", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("6bffefca", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9bce6d86\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PuzzleHeading.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9bce6d86\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PuzzleHeading.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\n.puzzle-heading[data-v-9bce6d86] {\n  border-bottom: 2px solid #979797;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 12px;\n}\n.settings-column[data-v-9bce6d86] {\n  -ms-flex-item-align: baseline;\n      align-self: baseline;\n  position: relative;\n  top: 0.4em;\n  margin-right: 0.8rem;\n}\n.title-column[data-v-9bce6d86] {\n  -ms-flex-item-align: start;\n      align-self: flex-start;\n  margin-right: 1em;\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n.puzzle-title[data-v-9bce6d86] {\n  font-family: \"Inter UI\";\n  font-weight: 900;\n  width: 100%;\n  font-style: italic;\n  font-size: 36px;\n  color: #000000;\n  border: 1px solid transparent;\n}\n.puzzle-title[data-v-9bce6d86]:hover {\n    border: 1px solid gray;\n}\n.puzzle-title[data-v-9bce6d86]:focus {\n    border: 1px solid blue;\n}\n.template-column[data-v-9bce6d86] {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  margin-right: 1rem;\n}\n.input-direction-column[data-v-9bce6d86] {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n}\n.save-status[data-v-9bce6d86] {\n  font-size: 12px;\n  color: #000000;\n  margin: 0;\n}\n", ""]);

// exports


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ApplyTemplateButton_vue__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ApplyTemplateButton_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ApplyTemplateButton_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__InputDirectionSwitch_vue__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__InputDirectionSwitch_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__InputDirectionSwitch_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
    name: "puzzleHeading",
    props: ['puzzleName', 'inputDirection'],
    components: {
        applyTemplateButton: __WEBPACK_IMPORTED_MODULE_0__ApplyTemplateButton_vue___default.a, inputDirectionSwitch: __WEBPACK_IMPORTED_MODULE_1__InputDirectionSwitch_vue___default.a
    },
    data: function data() {
        return {};
    },
    methods: {}
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "puzzle-heading" }, [
    _c("div", { staticClass: "settings-column" }, [
      _c(
        "svg",
        {
          attrs: {
            version: "1.1",
            id: "Cog",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            x: "0px",
            y: "0px",
            width: "31",
            height: "31",
            viewBox: "0 0 20 20",
            "enable-background": "new 0 0 20 20",
            "xml:space": "preserve"
          }
        },
        [
          _c("path", {
            attrs: {
              d:
                "M16.783,10c0-1.049,0.646-1.875,1.617-2.443c-0.176-0.584-0.407-1.145-0.692-1.672c-1.089,0.285-1.97-0.141-2.711-0.883\n            c-0.741-0.74-0.968-1.621-0.683-2.711c-0.527-0.285-1.088-0.518-1.672-0.691C12.074,2.57,11.047,3.215,10,3.215\n            c-1.048,0-2.074-0.645-2.643-1.615C6.772,1.773,6.213,2.006,5.686,2.291c0.285,1.09,0.059,1.971-0.684,2.711\n            C4.262,5.744,3.381,6.17,2.291,5.885C2.006,6.412,1.774,6.973,1.6,7.557C2.57,8.125,3.215,8.951,3.215,10\n            c0,1.047-0.645,2.074-1.615,2.643c0.175,0.584,0.406,1.144,0.691,1.672c1.09-0.285,1.971-0.059,2.711,0.682\n            c0.741,0.742,0.969,1.623,0.684,2.711c0.527,0.285,1.087,0.518,1.672,0.693c0.568-0.973,1.595-1.617,2.643-1.617\n            c1.047,0,2.074,0.645,2.643,1.617c0.584-0.176,1.144-0.408,1.672-0.693c-0.285-1.088-0.059-1.969,0.683-2.711\n            c0.741-0.74,1.622-1.166,2.711-0.883c0.285-0.527,0.517-1.086,0.692-1.672C17.429,11.873,16.783,11.047,16.783,10z M10,13.652\n            c-2.018,0-3.653-1.635-3.653-3.652c0-2.018,1.636-3.654,3.653-3.654c2.018,0,3.652,1.637,3.652,3.654\n            C13.652,12.018,12.018,13.652,10,13.652z"
            }
          })
        ]
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "title-column" }, [
      _c("input", {
        staticClass: "puzzle-title",
        attrs: { type: "text" },
        domProps: { value: _vm.puzzleName },
        on: {
          blur: function($event) {
            _vm.$emit("update:puzzleName", $event.target.value)
          }
        }
      }),
      _vm._v(" "),
      _c("p", { staticClass: "save-status" }, [_vm._v("All data saved.")])
    ]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "template-column" },
      [_c("apply-template-button")],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "input-direction-column" },
      [
        _c("input-direction-switch", {
          attrs: { direction: _vm.inputDirection },
          on: {
            "update:direction": function($event) {
              _vm.inputDirection = $event
            }
          }
        })
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-9bce6d86", module.exports)
  }
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(36)
/* template */
var __vue_template__ = __webpack_require__(40)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/WordColumn.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-584b3712", Component.options)
  } else {
    hotAPI.reload("data-v-584b3712", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Word_vue__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Word_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Word_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
    name: "wordColumn",
    components: {
        Word: __WEBPACK_IMPORTED_MODULE_0__Word_vue___default.a
    },
    props: ['direction'],
    data: function data() {
        return {
            words: {
                across: [{
                    id: 1,
                    number: 1,
                    value: "A_B_C",
                    clue: "I really don't know what's going on here."
                }],
                down: [{
                    id: 2,
                    number: 1,
                    value: "E_F_G",
                    clue: "You think I've gotten any more knowledgeable about my situation since we last spoke??"
                }]
            }
        };
    },

    methods: {
        hideUserDropdown: function hideUserDropdown() {
            if (this.userDropdownVisible) {
                this.userDropdownVisible = false;
            }
        }
    }
});

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(38)
/* template */
var __vue_template__ = __webpack_require__(39)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/Word.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-29b05a7e", Component.options)
  } else {
    hotAPI.reload("data-v-29b05a7e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
    name: "Word",
    props: ['number', 'value', 'clue'],
    data: function data() {
        return {};
    },

    methods: {
        hideUserDropdown: function hideUserDropdown() {
            if (this.userDropdownVisible) {
                this.userDropdownVisible = false;
            }
        }
    }
});

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "word" }, [
    _c("div", { staticClass: "word-number" }, [_vm._v(_vm._s(_vm.number))]),
    _vm._v(" "),
    _c("div", { staticClass: "word-value" }, [_vm._v(_vm._s(_vm.value))]),
    _vm._v(" "),
    _c("div", { staticClass: "word-clue" }, [_vm._v(_vm._s(_vm.clue))])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-29b05a7e", module.exports)
  }
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "word-column" },
    [
      _c("header", [_vm._v(_vm._s(_vm.direction))]),
      _vm._v(" "),
      _vm._l(_vm.words[_vm.direction], function(word) {
        return _c("word", {
          key: word.id,
          attrs: { number: word.number, value: word.value, clue: word.clue }
        })
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-584b3712", module.exports)
  }
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(97)
}
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(42)
/* template */
var __vue_template__ = __webpack_require__(99)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-e2a87b3c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/PuzzleViz.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e2a87b3c", Component.options)
  } else {
    hotAPI.reload("data-v-e2a87b3c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 42 */
/***/ (function(module, exports) {

//
//
//
//
//
//
//
//
//


document.addEventListener("DOMContentLoaded", function (event) {
    var canvas = document.getElementById('puzzle-canvas');
    canvas.height = canvas.width;
});

(function () {
    window.addEventListener("resize", resizeThrottler, false);

    var resizeTimeout;
    function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                actualResizeHandler();

                // The actualResizeHandler will execute at a rate of 15fps
            }, 66);
        }
    }

    function actualResizeHandler() {
        var canvas = document.getElementById('puzzle-canvas');
        canvas.height = canvas.width;
    }
})();

/***/ }),
/* 43 */,
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(45)
/* template */
var __vue_template__ = __webpack_require__(46)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/WordSuggestions.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-03aa2e1e", Component.options)
  } else {
    hotAPI.reload("data-v-03aa2e1e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 45 */
/***/ (function(module, exports) {

//
//
//
//
//
//

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "word-suggestions" }, [
      _c("p", [_vm._v("Word Suggestions")])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-03aa2e1e", module.exports)
  }
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(48)
}
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(50)
/* template */
var __vue_template__ = __webpack_require__(51)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/BottomBar.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2bf57c7e", Component.options)
  } else {
    hotAPI.reload("data-v-2bf57c7e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("242b4b66", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2bf57c7e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./BottomBar.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2bf57c7e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./BottomBar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\n.bottom-bar__button {\n  background: rgba(0, 0, 0, 0.69);\n  border-radius: 8px;\n  color: #FFFFFF;\n  padding: 5px 12px;\n  margin-right: 6px;\n  text-decoration: none;\n}\n.bottom-bar__button:hover {\n    background: rgba(0, 0, 0, 0.93);\n}\n", ""]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'bottomBar'
});

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "bottom-bar" }, [
    _vm._m(0),
    _vm._v(" "),
    _c("div", { staticClass: "right" }, [
      _c(
        "a",
        { staticClass: "bottom-bar__warning-icon", attrs: { href: "#" } },
        [
          _c(
            "svg",
            {
              attrs: {
                version: "1.1",
                id: "Warning",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
                x: "0px",
                y: "0px",
                width: "20px",
                height: "20px",
                viewBox: "0 0 20 20",
                "enable-background": "new 0 0 20 20",
                "xml:space": "preserve"
              }
            },
            [
              _c("path", {
                attrs: {
                  fill: "#FF8D9B",
                  d:
                    "M19.511,17.98L10.604,1.348C10.48,1.133,10.25,1,10,1C9.749,1,9.519,1.133,9.396,1.348L0.49,17.98\n                    c-0.121,0.211-0.119,0.471,0.005,0.68C0.62,18.871,0.847,19,1.093,19h17.814c0.245,0,0.474-0.129,0.598-0.34\n                    C19.629,18.451,19.631,18.191,19.511,17.98z M11,17H9v-2h2V17z M11,13.5H9V7h2V13.5z"
                }
              })
            ]
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "left" }, [
      _c("a", { staticClass: "bottom-bar__button", attrs: { href: "#" } }, [
        _vm._v("Share")
      ]),
      _vm._v(" "),
      _c("a", { staticClass: "bottom-bar__button", attrs: { href: "#" } }, [
        _vm._v("Embed")
      ]),
      _vm._v(" "),
      _c("a", { staticClass: "bottom-bar__button", attrs: { href: "#" } }, [
        _vm._v("Export")
      ]),
      _vm._v(" "),
      _c("a", { staticClass: "bottom-bar__button", attrs: { href: "#" } }, [
        _vm._v("Help")
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2bf57c7e", module.exports)
  }
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "ca-wrapper", attrs: { id: "app" } },
    [
      _c("top-bar", { attrs: { user: _vm.ca_user } }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "puzzle-info" },
        [
          _c("puzzle-heading", {
            attrs: {
              puzzleName: _vm.ca_puzzle_name,
              inputDirection: _vm.ca_input_direction
            },
            on: {
              "update:puzzleName": function($event) {
                _vm.ca_puzzle_name = $event
              },
              "update:inputDirection": function($event) {
                _vm.ca_input_direction = $event
              }
            }
          }),
          _vm._v(" "),
          _c("word-column", { attrs: { direction: "across" } }),
          _vm._v(" "),
          _c("word-column", { attrs: { direction: "down" } })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "puzzle-visualization" },
        [_c("puzzle-viz"), _vm._v(" "), _c("word-suggestions")],
        1
      ),
      _vm._v(" "),
      _c("bottom-bar")
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-66ab2f82", module.exports)
  }
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_$, __webpack_provided_window_dot_jQuery, jQuery) {/**
 * vue-outside-events @ 1.1.0
 * Nicholas Hutchind <nicholas@hutchind.com>
 *
 * Vue directive to react to various events outside the current element
 *
 * License: MIT
 */
!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define("vue-outside-events",t):e["vue-outside-events"]=t()}(this,function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t=function(t,i){var n={};return n.directiveName=t,n.eventName=i,n.bind=function(n,o,u){var d=void 0!==console.error?console.error:console.log,r=null,v=void 0;if("function"!=typeof o.value)if("object"===e(o.value)&&o.value.hasOwnProperty("handler")&&"function"==typeof o.value.handler)r=o.value.handler,v=Object.assign({},o.value),delete v.handler;else{var c="["+t+"]: provided expression '"+o.expression+"' must be a function or an object containing a property named 'handler' that is a function.";u.context.name&&(c+="\nFound in component '"+u.context.name+"'"),d(c)}else r=o.value;var a=function(e){n.contains(e.target)||n===e.target||r(e,n,v)};n.__vueEventOutside__=a,document.addEventListener(i,a)},n.unbind=function(e,t){document.removeEventListener(i,e.__vueEventOutside__),e.__vueEventOutside__=null},n},i={directiveName:"event-outside",bind:function(t,i,n){var o=void 0!==console.error?console.error:console.log,u=void 0;if("object"!==e(i.value)||void 0===i.value.name||"string"!=typeof i.value.name||void 0===i.value.handler||"function"!=typeof i.value.handler){var d="[v-event-outside]: provided expression '"+i.expression+'\' must be an object containing a "name" string and a "handler" function.';return n.context.name&&(d+="\nFound in component '"+n.context.name+"'"),void o(d)}if(u=Object.assign({},i.value),delete u.name,delete u.handler,i.modifiers.jquery&&void 0===__webpack_provided_window_dot_$&&void 0===__webpack_provided_window_dot_jQuery){var r="[v-event-outside]: jQuery is not present in window.";return n.context.name&&(r+="\nFound in component '"+n.context.name+"'"),void o(r)}var v=function(e){t.contains(e.target)||t===e.target||i.value.handler(e,t,u)};t.__vueEventOutside__=v,i.modifiers.jquery?jQuery(document).on(i.value.name,v):document.addEventListener(i.value.name,v)},unbind:function(e,t){t.modifiers.jquery?jQuery(document).off(t.value.name,e.__vueEventOutside__):document.removeEventListener(t.value.name,e.__vueEventOutside__),e.__vueEventOutside__=null}},n=t("click-outside","click"),o=t("dblclick-outside","dblclick"),u=t("focus-outside","focusin"),d=t("blur-outside","focusout"),r=t("mousemove-outside","mousemove"),v=t("mousedown-outside","mousedown"),c=t("mouseup-outside","mouseup"),a=t("mouseover-outside","mouseover"),s=t("mouseout-outside","mouseout"),m=t("change-outside","change"),l=t("select-outside","select"),f=t("submit-outside","submit"),p=t("keydown-outside","keydown"),y=t("keypress-outside","keypress"),_=t("keyup-outside","keyup"),b={install:function(e){e.directive(n.directiveName,n),e.directive(o.directiveName,o),e.directive(u.directiveName,u),e.directive(d.directiveName,d),e.directive(r.directiveName,r),e.directive(v.directiveName,v),e.directive(c.directiveName,c),e.directive(a.directiveName,a),e.directive(s.directiveName,s),e.directive(m.directiveName,m),e.directive(l.directiveName,l),e.directive(f.directiveName,f),e.directive(p.directiveName,p),e.directive(y.directiveName,y),e.directive(y.directiveName,y),e.directive(_.directiveName,_),e.directive(i.directiveName,i)}};return"undefined"!=typeof window&&window.Vue&&window.Vue.use(b),b});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(2), __webpack_require__(2)))

/***/ }),
/* 54 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(90)
}
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(83)
/* template */
var __vue_template__ = __webpack_require__(92)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6a9b78f3"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/ApplyTemplateButton.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6a9b78f3", Component.options)
  } else {
    hotAPI.reload("data-v-6a9b78f3", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 81 */,
/* 82 */,
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'applyTemplateButton'
});

/***/ }),
/* 84 */,
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(93)
}
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(88)
/* template */
var __vue_template__ = __webpack_require__(95)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-45e988a0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/InputDirectionSwitch.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-45e988a0", Component.options)
  } else {
    hotAPI.reload("data-v-45e988a0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 86 */,
/* 87 */,
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'inputDirectionSwitch',
    props: ['direction']
});

/***/ }),
/* 89 */,
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(91);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("816acba0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6a9b78f3\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ApplyTemplateButton.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6a9b78f3\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ApplyTemplateButton.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\n.apply-template-button[data-v-6a9b78f3] {\n  text-align: center;\n}\n.apply-template-button[data-v-6a9b78f3]:hover {\n    cursor: pointer;\n}\n.apply-template-button:hover svg[data-v-6a9b78f3] {\n      -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.7);\n              box-shadow: 0 0 4px rgba(0, 0, 0, 0.7);\n}\n", ""]);

// exports


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "apply-template-button" }, [
    _c(
      "svg",
      {
        attrs: {
          width: "36px",
          height: "36px",
          viewBox: "0 0 36 36",
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink"
        }
      },
      [
        _c(
          "g",
          {
            attrs: {
              id: "Page-1",
              stroke: "none",
              "stroke-width": "1",
              fill: "none",
              "fill-rule": "evenodd"
            }
          },
          [
            _c(
              "g",
              {
                attrs: {
                  id: "Desktop-HD",
                  transform: "translate(-570.000000, -62.000000)"
                }
              },
              [
                _c(
                  "g",
                  {
                    attrs: {
                      id: "Puzzle-Heading",
                      transform: "translate(21.000000, 56.000000)"
                    }
                  },
                  [
                    _c(
                      "g",
                      {
                        attrs: {
                          id: "Template-Button",
                          transform: "translate(549.000000, 6.000000)"
                        }
                      },
                      [
                        _c("rect", {
                          attrs: {
                            id: "Rectangle-4",
                            stroke: "#525252",
                            "stroke-width": "2",
                            x: "1",
                            y: "1",
                            width: "34",
                            height: "34"
                          }
                        }),
                        _vm._v(" "),
                        _c("rect", {
                          attrs: {
                            id: "Rectangle-4-Copy",
                            fill: "#000000",
                            x: "0",
                            y: "0",
                            width: "18",
                            height: "18"
                          }
                        }),
                        _vm._v(" "),
                        _c("rect", {
                          attrs: {
                            id: "Rectangle-4-Copy-2",
                            fill: "#000000",
                            x: "18",
                            y: "18",
                            width: "18",
                            height: "18"
                          }
                        })
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
      ]
    ),
    _vm._v(" "),
    _c("p", { staticClass: "puzzle-heading-control-text" }, [
      _vm._v("Apply Template")
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6a9b78f3", module.exports)
  }
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(94);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("53b65d82", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-45e988a0\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./InputDirectionSwitch.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-45e988a0\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./InputDirectionSwitch.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\n.input-direction-switch[data-v-45e988a0] {\n  text-align: center;\n  cursor: pointer;\n}\n.input-direction-switch:hover #arrow path[data-v-45e988a0] {\n    stroke: black;\n}\nsvg *[data-v-45e988a0] {\n  -webkit-transition: 0.4s ease all;\n  transition: 0.4s ease all;\n}\n#arrow[data-v-45e988a0] {\n  -webkit-transform-origin: 16.8px 16.8px;\n          transform-origin: 16.8px 16.8px;\n}\n#arrow path[data-v-45e988a0] {\n    -webkit-transition-duration: 0ms;\n            transition-duration: 0ms;\n}\n.switch-across #arrow[data-v-45e988a0] {\n  -webkit-transform: translateX(37.5px) rotate(-90deg);\n          transform: translateX(37.5px) rotate(-90deg);\n}\n.switch-across #Oval[data-v-45e988a0] {\n  -webkit-transform: translateX(37px);\n          transform: translateX(37px);\n}\n.switch-across #Rectangle-3[data-v-45e988a0] {\n  fill: #259843;\n}\n", ""]);

// exports


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "input-direction-switch",
      class: { "switch-across": _vm.direction == "across" },
      on: {
        mousedown: function($event) {
          _vm.$bus.$emit("switchInputDirection")
        }
      }
    },
    [
      _c(
        "svg",
        {
          attrs: {
            width: "72px",
            height: "34px",
            viewBox: "0 0 72 34",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        },
        [
          _c(
            "g",
            {
              attrs: {
                id: "Page-1",
                stroke: "none",
                "stroke-width": "1",
                fill: "none",
                "fill-rule": "evenodd"
              }
            },
            [
              _c(
                "g",
                {
                  attrs: {
                    id: "Desktop-HD",
                    transform: "translate(-662.000000, -63.000000)"
                  }
                },
                [
                  _c(
                    "g",
                    {
                      attrs: {
                        id: "Puzzle-Heading",
                        transform: "translate(21.000000, 56.000000)"
                      }
                    },
                    [
                      _c(
                        "g",
                        {
                          attrs: {
                            id: "Input-Dir-Toggle",
                            transform: "translate(641.000000, 7.000000)"
                          }
                        },
                        [
                          _c("rect", {
                            attrs: {
                              id: "Rectangle-3",
                              fill: "#68A6EF",
                              x: "0",
                              y: "0",
                              width: "72",
                              height: "34",
                              rx: "18"
                            }
                          }),
                          _vm._v(" "),
                          _c("circle", {
                            attrs: {
                              id: "Oval",
                              fill: "#F8F8F8",
                              cx: "17.5",
                              cy: "17.5",
                              r: "14.5"
                            }
                          }),
                          _vm._v(" "),
                          _c("g", { attrs: { id: "arrow" } }, [
                            _c("path", {
                              attrs: {
                                d: "M17,7.28333333 L17,23.7166667",
                                id: "Line-3",
                                stroke: "#737373",
                                "stroke-width": "4",
                                "stroke-linecap": "square"
                              }
                            }),
                            _vm._v(" "),
                            _c("path", {
                              attrs: {
                                d:
                                  "M11.2727273,20.2727273 L16.7272727,25.7552264",
                                id: "Line-3",
                                stroke: "#737373",
                                "stroke-width": "4",
                                "stroke-linecap": "square"
                              }
                            }),
                            _vm._v(" "),
                            _c("path", {
                              attrs: {
                                d:
                                  "M22.7412674,20.2866862 L17.2727273,25.7552264",
                                id: "Line-3",
                                stroke: "#737373",
                                "stroke-width": "4",
                                "stroke-linecap": "square"
                              }
                            })
                          ])
                        ]
                      )
                    ]
                  )
                ]
              )
            ]
          )
        ]
      ),
      _vm._v(" "),
      _c("p", { staticClass: "puzzle-heading-control-text" }, [
        _vm._v("Input Direction")
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-45e988a0", module.exports)
  }
}

/***/ }),
/* 96 */,
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(98);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("40500a3e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e2a87b3c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PuzzleViz.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e2a87b3c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PuzzleViz.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\ncanvas[data-v-e2a87b3c] {\n  width: 100%;\n  border: 1px solid black;\n}\n.hidden-input[data-v-e2a87b3c] {\n  position: absolute;\n  opacity: 0;\n  cursor: default;\n}\n", ""]);

// exports


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "puzzle-viz" }, [
    _c("input", {
      staticClass: "hidden-input",
      attrs: { type: "text", id: "hiddenInput", autofocus: "" },
      on: {
        keydown: function($event) {
          if (
            !("button" in $event) &&
            _vm._k($event.keyCode, "tab", 9, $event.key)
          ) {
            return null
          }
          $event.stopPropagation()
          $event.preventDefault()
          _vm.$bus.$emit("switchInputDirection")
        }
      }
    }),
    _vm._v(" "),
    _vm._m(0)
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("label", { attrs: { for: "hiddenInput" } }, [
      _c("canvas", { attrs: { id: "puzzle-canvas" } })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-e2a87b3c", module.exports)
  }
}

/***/ })
],[16]);