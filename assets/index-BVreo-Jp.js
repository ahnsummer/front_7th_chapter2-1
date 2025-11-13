var __defProp = Object.defineProperty;
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function.");
});
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
	return "/front_7th_chapter2-1/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let allSettled2 = function(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		};
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = (cspNonceMeta === null || cspNonceMeta === void 0 ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta === null || cspNonceMeta === void 0 ? void 0 : cspNonceMeta.getAttribute("nonce"));
		promise = allSettled2(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			const cssSelector = isCss ? "[rel=\"stylesheet\"]" : "";
			const isBaseRelative = !!importerUrl;
			if (isBaseRelative) for (let i = links.length - 1; i >= 0; i--) {
				const link2 = links[i];
				if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) return;
			}
			else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
var AbortError = class extends Error {
	constructor(message = "The operation was aborted") {
		super(message);
		this.name = "AbortError";
	}
};
function noop() {}
function delay(ms, { signal } = {}) {
	return new Promise((resolve, reject) => {
		const abortError = () => {
			reject(new AbortError());
		};
		const abortHandler = () => {
			clearTimeout(timeoutId);
			abortError();
		};
		if (signal === null || signal === void 0 ? void 0 : signal.aborted) return abortError();
		const timeoutId = setTimeout(() => {
			signal === null || signal === void 0 || signal.removeEventListener("abort", abortHandler);
			resolve();
		}, ms);
		signal === null || signal === void 0 || signal.addEventListener("abort", abortHandler, { once: true });
	});
}
function sum(nums) {
	let result = 0;
	for (let i = 0; i < nums.length; i++) result += nums[i];
	return result;
}
function range(start, end, step = 1) {
	if (end == null) {
		end = start;
		start = 0;
	}
	if (!Number.isInteger(step) || step === 0) throw new Error(`The step value must be a non-zero integer.`);
	const length = Math.max(Math.ceil((end - start) / step), 0);
	const result = new Array(length);
	for (let i = 0; i < length; i++) result[i] = start + i * step;
	return result;
}
function isPrimitive(value) {
	return value == null || typeof value !== "object" && typeof value !== "function";
}
function isTypedArray(x) {
	return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
function getSymbols(object) {
	return Object.getOwnPropertySymbols(object).filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol));
}
function getTag(value) {
	if (value == null) return value === void 0 ? "[object Undefined]" : "[object Null]";
	return Object.prototype.toString.call(value);
}
const regexpTag = "[object RegExp]";
const stringTag = "[object String]";
const numberTag = "[object Number]";
const booleanTag = "[object Boolean]";
const argumentsTag = "[object Arguments]";
const symbolTag = "[object Symbol]";
const dateTag = "[object Date]";
const mapTag = "[object Map]";
const setTag = "[object Set]";
const arrayTag = "[object Array]";
const functionTag = "[object Function]";
const arrayBufferTag = "[object ArrayBuffer]";
const objectTag = "[object Object]";
const errorTag = "[object Error]";
const dataViewTag = "[object DataView]";
const uint8ArrayTag = "[object Uint8Array]";
const uint8ClampedArrayTag = "[object Uint8ClampedArray]";
const uint16ArrayTag = "[object Uint16Array]";
const uint32ArrayTag = "[object Uint32Array]";
const bigUint64ArrayTag = "[object BigUint64Array]";
const int8ArrayTag = "[object Int8Array]";
const int16ArrayTag = "[object Int16Array]";
const int32ArrayTag = "[object Int32Array]";
const bigInt64ArrayTag = "[object BigInt64Array]";
const float32ArrayTag = "[object Float32Array]";
const float64ArrayTag = "[object Float64Array]";
function cloneDeepWithImpl(valueToClone, keyToClone, objectToClone, stack = /* @__PURE__ */ new Map(), cloneValue = void 0) {
	const cloned = cloneValue === null || cloneValue === void 0 ? void 0 : cloneValue(valueToClone, keyToClone, objectToClone, stack);
	if (cloned !== void 0) return cloned;
	if (isPrimitive(valueToClone)) return valueToClone;
	if (stack.has(valueToClone)) return stack.get(valueToClone);
	if (Array.isArray(valueToClone)) {
		const result = new Array(valueToClone.length);
		stack.set(valueToClone, result);
		for (let i = 0; i < valueToClone.length; i++) result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
		if (Object.hasOwn(valueToClone, "index")) result.index = valueToClone.index;
		if (Object.hasOwn(valueToClone, "input")) result.input = valueToClone.input;
		return result;
	}
	if (valueToClone instanceof Date) return new Date(valueToClone.getTime());
	if (valueToClone instanceof RegExp) {
		const result = new RegExp(valueToClone.source, valueToClone.flags);
		result.lastIndex = valueToClone.lastIndex;
		return result;
	}
	if (valueToClone instanceof Map) {
		const result = /* @__PURE__ */ new Map();
		stack.set(valueToClone, result);
		for (const [key, value] of valueToClone) result.set(key, cloneDeepWithImpl(value, key, objectToClone, stack, cloneValue));
		return result;
	}
	if (valueToClone instanceof Set) {
		const result = /* @__PURE__ */ new Set();
		stack.set(valueToClone, result);
		for (const value of valueToClone) result.add(cloneDeepWithImpl(value, void 0, objectToClone, stack, cloneValue));
		return result;
	}
	if (typeof Buffer !== "undefined" && Buffer.isBuffer(valueToClone)) return valueToClone.subarray();
	if (isTypedArray(valueToClone)) {
		const result = new (Object.getPrototypeOf(valueToClone)).constructor(valueToClone.length);
		stack.set(valueToClone, result);
		for (let i = 0; i < valueToClone.length; i++) result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && valueToClone instanceof SharedArrayBuffer) return valueToClone.slice(0);
	if (valueToClone instanceof DataView) {
		const result = new DataView(valueToClone.buffer.slice(0), valueToClone.byteOffset, valueToClone.byteLength);
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (typeof File !== "undefined" && valueToClone instanceof File) {
		const result = new File([valueToClone], valueToClone.name, { type: valueToClone.type });
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (typeof Blob !== "undefined" && valueToClone instanceof Blob) {
		const result = new Blob([valueToClone], { type: valueToClone.type });
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof Error) {
		const result = new valueToClone.constructor();
		stack.set(valueToClone, result);
		result.message = valueToClone.message;
		result.name = valueToClone.name;
		result.stack = valueToClone.stack;
		result.cause = valueToClone.cause;
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof Boolean) {
		const result = new Boolean(valueToClone.valueOf());
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof Number) {
		const result = new Number(valueToClone.valueOf());
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof String) {
		const result = new String(valueToClone.valueOf());
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (typeof valueToClone === "object" && isCloneableObject(valueToClone)) {
		const result = Object.create(Object.getPrototypeOf(valueToClone));
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	return valueToClone;
}
function copyProperties(target, source, objectToClone = target, stack, cloneValue) {
	const keys = [...Object.keys(source), ...getSymbols(source)];
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const descriptor = Object.getOwnPropertyDescriptor(target, key);
		if (descriptor == null || descriptor.writable) target[key] = cloneDeepWithImpl(source[key], key, objectToClone, stack, cloneValue);
	}
}
function isCloneableObject(object) {
	switch (getTag(object)) {
		case argumentsTag:
		case arrayTag:
		case arrayBufferTag:
		case dataViewTag:
		case booleanTag:
		case dateTag:
		case float32ArrayTag:
		case float64ArrayTag:
		case int8ArrayTag:
		case int16ArrayTag:
		case int32ArrayTag:
		case mapTag:
		case numberTag:
		case objectTag:
		case regexpTag:
		case setTag:
		case stringTag:
		case symbolTag:
		case uint8ArrayTag:
		case uint8ClampedArrayTag:
		case uint16ArrayTag:
		case uint32ArrayTag: return true;
		default: return false;
	}
}
function cloneDeep(obj) {
	return cloneDeepWithImpl(obj, void 0, obj, /* @__PURE__ */ new Map(), void 0);
}
function isPlainObject(value) {
	if (!value || typeof value !== "object") return false;
	const proto = Object.getPrototypeOf(value);
	const hasObjectPrototype = proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null;
	if (!hasObjectPrototype) return false;
	return Object.prototype.toString.call(value) === "[object Object]";
}
const CASE_SPLIT_PATTERN = /\p{Lu}?\p{Ll}+|[0-9]+|\p{Lu}+(?!\p{Ll})|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{L}+/gu;
function words(str) {
	return Array.from(str.match(CASE_SPLIT_PATTERN) ?? []);
}
function eq(value, other) {
	return value === other || Number.isNaN(value) && Number.isNaN(other);
}
function isEqualWith(a, b, areValuesEqual) {
	return isEqualWithImpl(a, b, void 0, void 0, void 0, void 0, areValuesEqual);
}
function isEqualWithImpl(a, b, property, aParent, bParent, stack, areValuesEqual) {
	const result = areValuesEqual(a, b, property, aParent, bParent, stack);
	if (result !== void 0) return result;
	if (typeof a === typeof b) switch (typeof a) {
		case "bigint":
		case "string":
		case "boolean":
		case "symbol":
		case "undefined": return a === b;
		case "number": return a === b || Object.is(a, b);
		case "function": return a === b;
		case "object": return areObjectsEqual(a, b, stack, areValuesEqual);
	}
	return areObjectsEqual(a, b, stack, areValuesEqual);
}
function areObjectsEqual(a, b, stack, areValuesEqual) {
	if (Object.is(a, b)) return true;
	let aTag = getTag(a);
	let bTag = getTag(b);
	if (aTag === argumentsTag) aTag = objectTag;
	if (bTag === argumentsTag) bTag = objectTag;
	if (aTag !== bTag) return false;
	switch (aTag) {
		case stringTag: return a.toString() === b.toString();
		case numberTag: {
			const x = a.valueOf();
			const y = b.valueOf();
			return eq(x, y);
		}
		case booleanTag:
		case dateTag:
		case symbolTag: return Object.is(a.valueOf(), b.valueOf());
		case regexpTag: return a.source === b.source && a.flags === b.flags;
		case functionTag: return a === b;
	}
	stack = stack ?? /* @__PURE__ */ new Map();
	const aStack = stack.get(a);
	const bStack = stack.get(b);
	if (aStack != null && bStack != null) return aStack === b;
	stack.set(a, b);
	stack.set(b, a);
	try {
		switch (aTag) {
			case mapTag: {
				if (a.size !== b.size) return false;
				for (const [key, value] of a.entries()) if (!b.has(key) || !isEqualWithImpl(value, b.get(key), key, a, b, stack, areValuesEqual)) return false;
				return true;
			}
			case setTag: {
				if (a.size !== b.size) return false;
				const aValues = Array.from(a.values());
				const bValues = Array.from(b.values());
				for (let i = 0; i < aValues.length; i++) {
					const aValue = aValues[i];
					const index = bValues.findIndex((bValue) => {
						return isEqualWithImpl(aValue, bValue, void 0, a, b, stack, areValuesEqual);
					});
					if (index === -1) return false;
					bValues.splice(index, 1);
				}
				return true;
			}
			case arrayTag:
			case uint8ArrayTag:
			case uint8ClampedArrayTag:
			case uint16ArrayTag:
			case uint32ArrayTag:
			case bigUint64ArrayTag:
			case int8ArrayTag:
			case int16ArrayTag:
			case int32ArrayTag:
			case bigInt64ArrayTag:
			case float32ArrayTag:
			case float64ArrayTag: {
				if (typeof Buffer !== "undefined" && Buffer.isBuffer(a) !== Buffer.isBuffer(b)) return false;
				if (a.length !== b.length) return false;
				for (let i = 0; i < a.length; i++) if (!isEqualWithImpl(a[i], b[i], i, a, b, stack, areValuesEqual)) return false;
				return true;
			}
			case arrayBufferTag: {
				if (a.byteLength !== b.byteLength) return false;
				return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
			}
			case dataViewTag: {
				if (a.byteLength !== b.byteLength || a.byteOffset !== b.byteOffset) return false;
				return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
			}
			case errorTag: return a.name === b.name && a.message === b.message;
			case objectTag: {
				const areEqualInstances = areObjectsEqual(a.constructor, b.constructor, stack, areValuesEqual) || isPlainObject(a) && isPlainObject(b);
				if (!areEqualInstances) return false;
				const aKeys = [...Object.keys(a), ...getSymbols(a)];
				const bKeys = [...Object.keys(b), ...getSymbols(b)];
				if (aKeys.length !== bKeys.length) return false;
				for (let i = 0; i < aKeys.length; i++) {
					const propKey = aKeys[i];
					const aProp = a[propKey];
					if (!Object.hasOwn(b, propKey)) return false;
					const bProp = b[propKey];
					if (!isEqualWithImpl(aProp, bProp, propKey, a, b, stack, areValuesEqual)) return false;
				}
				return true;
			}
			default: return false;
		}
	} finally {
		stack.delete(a);
		stack.delete(b);
	}
}
function isEqual(a, b) {
	return isEqualWith(a, b, noop);
}
function isNil(x) {
	return x == null;
}
function isNotNil(x) {
	return x != null;
}
function kebabCase(str) {
	const words$1 = words(str);
	return words$1.map((word) => word.toLowerCase()).join("-");
}
function lowerCase(str) {
	const words$1 = words(str);
	return words$1.map((word) => word.toLowerCase()).join(" ");
}
function invariant(condition, message) {
	if (condition) return;
	if (typeof message === "string") throw new Error(message);
	throw message;
}
var ElementNode = class {
	constructor(tag, children, key) {
		this.tag = tag;
		this.children = children;
		this.key = key;
	}
};
var FragmentNode = class extends ElementNode {
	constructor(tag, children, key) {
		super("Fragment", children);
		this.tag = tag;
		this.children = children;
		this.key = key;
	}
};
var DomElementNode = class extends ElementNode {
	constructor(tag, props, children, key) {
		super(tag, children);
		this.tag = tag;
		this.props = props;
		this.children = children;
		this.key = key;
	}
};
var CompnentElementNode = class extends ElementNode {
	constructor(key, tag, props, children, state, stateCursor, sideEffects, sideEffectsCursor, parent, nodes, nestedComponenets) {
		super(tag, children);
		this.key = key;
		this.tag = tag;
		this.props = props;
		this.children = children;
		this.state = state;
		this.stateCursor = stateCursor;
		this.sideEffects = sideEffects;
		this.sideEffectsCursor = sideEffectsCursor;
		this.parent = parent;
		this.nodes = nodes;
		this.nestedComponenets = nestedComponenets;
	}
};
function h(tag, props, ...children) {
	if (typeof tag === "function" && tag.name === "Fragment") return Fragment(props, ...mapKeyToChildren(children));
	if (typeof tag === "function") return new CompnentElementNode(String((props === null || props === void 0 ? void 0 : props.key) ?? ""), tag, props, mapKeyToChildren(children));
	return new DomElementNode(tag, props, mapKeyToChildren(children), String((props === null || props === void 0 ? void 0 : props.key) ?? ""));
}
function Fragment(_, ...children) {
	return new FragmentNode("Fragment", children);
}
function mapKeyToChildren(children) {
	return children.map((child, idx) => {
		if (typeof child !== "object" || isNil(child)) return child;
		child.key = isNil(child === null || child === void 0 ? void 0 : child.key) || (child === null || child === void 0 ? void 0 : child.key) === "" ? `idx:${idx}` : child.key;
		return child;
	});
}
function searchCurrentNode(key, targetNode = renderTree.tree) {
	if (Array.isArray(targetNode)) for (const child of targetNode) {
		if (!(child instanceof ElementNode)) continue;
		const found = searchCurrentNode(key, child);
		if (isNotNil(found)) return found;
	}
	else {
		if (targetNode instanceof CompnentElementNode && key === targetNode.key) return targetNode;
		for (const child of targetNode.children) if (Array.isArray(child) || child instanceof ElementNode) {
			const found = searchCurrentNode(key, child);
			if (isNotNil(found)) return found;
		}
		if (targetNode instanceof CompnentElementNode) for (const nestedComponent of targetNode.nestedComponenets ?? []) {
			const found = searchCurrentNode(key, nestedComponent);
			if (isNotNil(found)) return found;
		}
	}
	return null;
}
window.searchCurrentNode = searchCurrentNode;
function decodeHtmlEntity(html) {
	const temp = document.createElement("textarea");
	temp.innerHTML = html;
	return temp.value;
}
const renderTree = {
	tree: null,
	raw: null
};
let currentRenderingNode = null;
function render(jsx, parent = root(), path = "root", onAppend) {
	var _jsx$props;
	console.log(cloneDeep(jsx));
	if (Array.isArray(jsx)) {
		jsx.forEach((child, idx) => {
			render(child, parent, `${path}[${idx}]`, onAppend);
		});
		return;
	}
	if (isNil(renderTree.tree)) {
		renderTree.tree = jsx;
		window.renderTree = renderTree;
	}
	if (isNil(renderTree.raw)) renderTree.raw = cloneDeep(jsx);
	if (typeof jsx === "boolean" || jsx == null) return;
	if (!(jsx instanceof ElementNode)) {
		const text = decodeHtmlEntity(String(jsx));
		parent.appendChild(document.createTextNode(text));
		return;
	}
	jsx.key = path === "" ? jsx.key : isNil(jsx.key) || jsx.key === "" ? `${path}` : `${path}.${jsx.key}`;
	if (jsx instanceof CompnentElementNode) {
		var _target$nodes, _target$parent, _target$nodes2;
		const target = searchCurrentNode(jsx.key) ?? jsx;
		currentRenderingNode = target;
		target.parent = syncParent(parent);
		target.state = target.state ?? [];
		target.stateCursor = 0;
		target.sideEffects = target.sideEffects ?? [];
		target.sideEffectsCursor = 0;
		const firstChild = target === null || target === void 0 || (_target$nodes = target.nodes) === null || _target$nodes === void 0 ? void 0 : _target$nodes[0];
		const position = isNotNil(firstChild) ? [...((_target$parent = target.parent) === null || _target$parent === void 0 ? void 0 : _target$parent.children) ?? []].indexOf(firstChild) : -1;
		target === null || target === void 0 || (_target$nodes2 = target.nodes) === null || _target$nodes2 === void 0 || _target$nodes2.forEach((node) => {
			node.remove();
		});
		target.nodes = [];
		const rendered = jsx.tag({
			...jsx.props,
			children: jsx.children
		});
		if (rendered instanceof CompnentElementNode || rendered instanceof FragmentNode) jsx.nestedComponenets = jsx.nestedComponenets ?? [rendered];
		if (rendered instanceof ElementNode) jsx.nestedComponenets = jsx.nestedComponenets ?? rendered.children.filter((child) => child instanceof CompnentElementNode || child instanceof FragmentNode);
		render(rendered, parent, jsx.key, (callback) => {
			callback(target, position);
		});
		return;
	}
	if (jsx instanceof FragmentNode) {
		jsx.children.forEach((child, idx) => {
			render(child, parent, `${path}[${idx}]`, onAppend);
		});
		return;
	}
	if (!(jsx instanceof DomElementNode)) throw new Error("jsx is not a DomElementNode");
	const svgTags = [
		"svg",
		"path",
		"defs",
		"linearGradient",
		"stop",
		"filter",
		"feDropShadow",
		"g",
		"line",
		"polyline",
		"polygon",
		"ellipse",
		"rect",
		"text"
	];
	const element = svgTags.includes(jsx.tag) ? document.createElementNS("http://www.w3.org/2000/svg", jsx.tag) : document.createElement(jsx.tag);
	for (const [key, value] of Object.entries(jsx.props ?? {}).filter((key$1) => !String(key$1).startsWith("__"))) {
		if (key === "style") {
			const styleObject = value;
			const stringifiedStyle = Object.entries(styleObject).map(([key$1, value$1]) => `${kebabCase(key$1)}: ${value$1}`).join(";");
			element.setAttribute("style", stringifiedStyle);
			continue;
		}
		if (key === "key") continue;
		if (key.startsWith("on") && typeof value === "function") {
			element.addEventListener(lowerCase(key.replace("on", "")).replace(/\s/g, ""), value);
			continue;
		}
		if (key === "className") {
			element.setAttribute("class", value);
			continue;
		}
		if (key === "checked") {
			if (value) element.setAttribute("checked", "true");
			continue;
		}
		if (jsx.tag === "option" && key === "selected") {
			if (value) element.setAttribute("selected", "true");
			continue;
		}
		if (key === "viewBox") {
			element.setAttributeNS("http://www.w3.org/2000/svg", "viewBox", value);
			continue;
		}
		if (svgTags.includes(jsx.tag)) {
			element.setAttribute(key, value);
			continue;
		}
		element.setAttribute(kebabCase(key), String(value));
	}
	jsx.key = ((_jsx$props = jsx.props) === null || _jsx$props === void 0 ? void 0 : _jsx$props.key) ?? jsx.key;
	if (!svgTags.includes(jsx.tag)) element.setAttribute("data-jsx-key", jsx.key);
	if (isNotNil(onAppend)) onAppend === null || onAppend === void 0 || onAppend((componentNode, position) => {
		var _componentNode$nodes;
		let targetParent = parent;
		if (parent instanceof HTMLElement) targetParent = document.querySelector(`[data-jsx-key="${parent.dataset.jsxKey}"]`);
		if (isNil(componentNode.nodes)) componentNode.nodes = [];
		(_componentNode$nodes = componentNode.nodes) === null || _componentNode$nodes === void 0 || _componentNode$nodes.push(element);
		if (position === -1) targetParent.appendChild(element);
		else targetParent.insertBefore(element, targetParent.children[position]);
	});
	else parent.appendChild(element);
	for (const [idx, child] of jsx.children.entries()) render(child, element, `${path}[${idx}]`);
}
function root() {
	return document.querySelector("#root");
}
function syncParent(parent) {
	if (parent instanceof DocumentFragment) return parent;
	const targetParent = document.querySelector(`[data-jsx-key="${parent.dataset.jsxKey}"]`);
	return targetParent ?? parent;
}
function nextTick() {
	return new Promise((resolve) => {
		queueMicrotask(resolve);
	});
}
function useEffect(callback, dependencies) {
	if (!(currentRenderingNode instanceof CompnentElementNode)) throw new Error("currentRenderingNode is not an object");
	if (isNil(currentRenderingNode.sideEffects) || isNil(currentRenderingNode.sideEffectsCursor)) throw new Error("parentNode.sideEffects or parentNode.sideEffectsCursor is not set");
	const { sideEffects, sideEffectsCursor } = currentRenderingNode;
	const targetSideEffect = sideEffects[sideEffectsCursor];
	currentRenderingNode.sideEffectsCursor++;
	if (isNil(targetSideEffect)) {
		nextTick().then(() => {
			const cleanup$1 = callback();
			sideEffects[sideEffectsCursor] = {
				callback,
				dependencies: cloneDeep(dependencies),
				cleanup: cleanup$1
			};
		});
		return;
	}
	const hasChanged = !isEqual(targetSideEffect.dependencies, dependencies);
	if (hasChanged) {
		var _targetSideEffect$cle;
		(_targetSideEffect$cle = targetSideEffect.cleanup) === null || _targetSideEffect$cle === void 0 || _targetSideEffect$cle.call(targetSideEffect);
		nextTick().then(() => {
			const cleanup$1 = callback();
			targetSideEffect.cleanup = cleanup$1;
			targetSideEffect.dependencies = cloneDeep(dependencies);
		});
	}
}
function useMemo(callback, dependencies) {
	if (!(currentRenderingNode instanceof CompnentElementNode)) throw new Error("currentRenderingNode is not an object");
	if (isNil(currentRenderingNode.state) || isNil(currentRenderingNode.stateCursor)) throw new Error("parentNode.state or parentNode.stateCursor is not set");
	if (isNil(currentRenderingNode.sideEffects) || isNil(currentRenderingNode.sideEffectsCursor)) throw new Error("parentNode.sideEffects or parentNode.sideEffectsCursor is not set");
	const { state, stateCursor, sideEffects, sideEffectsCursor } = currentRenderingNode;
	state[stateCursor] = state[stateCursor] ?? callback();
	currentRenderingNode.stateCursor++;
	const targetSideEffect = sideEffects[sideEffectsCursor];
	currentRenderingNode.sideEffectsCursor++;
	if (isNil(targetSideEffect)) {
		const returnValue = callback();
		state[stateCursor] = returnValue;
		sideEffects[sideEffectsCursor] = {
			callback,
			dependencies: cloneDeep(dependencies)
		};
		return returnValue;
	}
	const hasChanged = !isEqual(targetSideEffect.dependencies, dependencies);
	if (hasChanged) {
		const returnValue = callback();
		state[stateCursor] = returnValue;
		targetSideEffect.dependencies = cloneDeep(dependencies);
		return returnValue;
	}
	return state[stateCursor];
}
const token = "%[a-f0-9]{2}";
const singleMatcher = new RegExp("(" + token + ")|([^%]+?)", "gi");
const multiMatcher = new RegExp("(" + token + ")+", "gi");
function decodeComponents(components, split) {
	try {
		return [decodeURIComponent(components.join(""))];
	} catch {}
	if (components.length === 1) return components;
	split = split || 1;
	const left = components.slice(0, split);
	const right = components.slice(split);
	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}
function decode$1(input) {
	try {
		return decodeURIComponent(input);
	} catch {
		let tokens = input.match(singleMatcher) || [];
		for (let i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join("");
			tokens = input.match(singleMatcher) || [];
		}
		return input;
	}
}
function customDecodeURIComponent(input) {
	const replaceMap = {
		"%FE%FF": "��",
		"%FF%FE": "��"
	};
	let match = multiMatcher.exec(input);
	while (match) {
		try {
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch {
			const result = decode$1(match[0]);
			if (result !== match[0]) replaceMap[match[0]] = result;
		}
		match = multiMatcher.exec(input);
	}
	replaceMap["%C2"] = "�";
	const entries = Object.keys(replaceMap);
	for (const key of entries) input = input.replace(new RegExp(key, "g"), replaceMap[key]);
	return input;
}
function decodeUriComponent(encodedURI) {
	if (typeof encodedURI !== "string") throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
	try {
		return decodeURIComponent(encodedURI);
	} catch {
		return customDecodeURIComponent(encodedURI);
	}
}
function includeKeys(object, predicate) {
	const result = {};
	if (Array.isArray(predicate)) for (const key of predicate) {
		const descriptor = Object.getOwnPropertyDescriptor(object, key);
		if (descriptor === null || descriptor === void 0 ? void 0 : descriptor.enumerable) Object.defineProperty(result, key, descriptor);
	}
	else for (const key of Reflect.ownKeys(object)) {
		const descriptor = Object.getOwnPropertyDescriptor(object, key);
		if (descriptor.enumerable) {
			const value = object[key];
			if (predicate(key, value, object)) Object.defineProperty(result, key, descriptor);
		}
	}
	return result;
}
function splitOnFirst(string, separator) {
	if (!(typeof string === "string" && typeof separator === "string")) throw new TypeError("Expected the arguments to be of type `string`");
	if (string === "" || separator === "") return [];
	const separatorIndex = string.indexOf(separator);
	if (separatorIndex === -1) return [];
	return [string.slice(0, separatorIndex), string.slice(separatorIndex + separator.length)];
}
var base_exports = {};
__export(base_exports, {
	exclude: () => exclude,
	extract: () => extract,
	parse: () => parse,
	parseUrl: () => parseUrl,
	pick: () => pick,
	stringify: () => stringify,
	stringifyUrl: () => stringifyUrl
});
const isNullOrUndefined = (value) => value === null || value === void 0;
const strictUriEncode = (string) => encodeURIComponent(string).replaceAll(/[!'()*]/g, (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
const encodeFragmentIdentifier = Symbol("encodeFragmentIdentifier");
function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case "index": return (key) => (result, value) => {
			const index = result.length;
			if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") return result;
			if (value === null) return [...result, [
				encode(key, options),
				"[",
				index,
				"]"
			].join("")];
			return [...result, [
				encode(key, options),
				"[",
				encode(index, options),
				"]=",
				encode(value, options)
			].join("")];
		};
		case "bracket": return (key) => (result, value) => {
			if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") return result;
			if (value === null) return [...result, [encode(key, options), "[]"].join("")];
			return [...result, [
				encode(key, options),
				"[]=",
				encode(value, options)
			].join("")];
		};
		case "colon-list-separator": return (key) => (result, value) => {
			if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") return result;
			if (value === null) return [...result, [encode(key, options), ":list="].join("")];
			return [...result, [
				encode(key, options),
				":list=",
				encode(value, options)
			].join("")];
		};
		case "comma":
		case "separator":
		case "bracket-separator": {
			const keyValueSeparator = options.arrayFormat === "bracket-separator" ? "[]=" : "=";
			return (key) => (result, value) => {
				if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") return result;
				value = value === null ? "" : value;
				if (result.length === 0) return [[
					encode(key, options),
					keyValueSeparator,
					encode(value, options)
				].join("")];
				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};
		}
		default: return (key) => (result, value) => {
			if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") return result;
			if (value === null) return [...result, encode(key, options)];
			return [...result, [
				encode(key, options),
				"=",
				encode(value, options)
			].join("")];
		};
	}
}
function parserForArrayFormat(options) {
	let result;
	switch (options.arrayFormat) {
		case "index": return (key, value, accumulator) => {
			result = /\[(\d*)]$/.exec(key);
			key = key.replace(/\[\d*]$/, "");
			if (!result) {
				accumulator[key] = value;
				return;
			}
			if (accumulator[key] === void 0) accumulator[key] = {};
			accumulator[key][result[1]] = value;
		};
		case "bracket": return (key, value, accumulator) => {
			result = /(\[])$/.exec(key);
			key = key.replace(/\[]$/, "");
			if (!result) {
				accumulator[key] = value;
				return;
			}
			if (accumulator[key] === void 0) {
				accumulator[key] = [value];
				return;
			}
			accumulator[key] = [...accumulator[key], value];
		};
		case "colon-list-separator": return (key, value, accumulator) => {
			result = /(:list)$/.exec(key);
			key = key.replace(/:list$/, "");
			if (!result) {
				accumulator[key] = value;
				return;
			}
			if (accumulator[key] === void 0) {
				accumulator[key] = [value];
				return;
			}
			accumulator[key] = [...accumulator[key], value];
		};
		case "comma":
		case "separator": return (key, value, accumulator) => {
			const isArray = typeof value === "string" && value.includes(options.arrayFormatSeparator);
			const newValue = isArray ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
			accumulator[key] = newValue;
		};
		case "bracket-separator": return (key, value, accumulator) => {
			const isArray = /(\[])$/.test(key);
			key = key.replace(/\[]$/, "");
			if (!isArray) {
				accumulator[key] = value ? decode(value, options) : value;
				return;
			}
			const arrayValue = value === null ? [] : decode(value, options).split(options.arrayFormatSeparator);
			if (accumulator[key] === void 0) {
				accumulator[key] = arrayValue;
				return;
			}
			accumulator[key] = [...accumulator[key], ...arrayValue];
		};
		default: return (key, value, accumulator) => {
			if (accumulator[key] === void 0) {
				accumulator[key] = value;
				return;
			}
			accumulator[key] = [...[accumulator[key]].flat(), value];
		};
	}
}
function validateArrayFormatSeparator(value) {
	if (typeof value !== "string" || value.length !== 1) throw new TypeError("arrayFormatSeparator must be single character string");
}
function encode(value, options) {
	if (options.encode) return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	return value;
}
function decode(value, options) {
	if (options.decode) return decodeUriComponent(value);
	return value;
}
function keysSorter(input) {
	if (Array.isArray(input)) return input.sort();
	if (typeof input === "object") return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map((key) => input[key]);
	return input;
}
function removeHash(input) {
	const hashStart = input.indexOf("#");
	if (hashStart !== -1) input = input.slice(0, hashStart);
	return input;
}
function getHash(url) {
	let hash = "";
	const hashStart = url.indexOf("#");
	if (hashStart !== -1) hash = url.slice(hashStart);
	return hash;
}
function parseValue(value, options, type) {
	if (type === "string" && typeof value === "string") return value;
	if (typeof type === "function" && typeof value === "string") return type(value);
	if (type === "boolean" && value === null) return true;
	if (type === "boolean" && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) return value.toLowerCase() === "true";
	if (type === "boolean" && value !== null && (value.toLowerCase() === "1" || value.toLowerCase() === "0")) return value.toLowerCase() === "1";
	if (type === "string[]" && options.arrayFormat !== "none" && typeof value === "string") return [value];
	if (type === "number[]" && options.arrayFormat !== "none" && !Number.isNaN(Number(value)) && typeof value === "string" && value.trim() !== "") return [Number(value)];
	if (type === "number" && !Number.isNaN(Number(value)) && typeof value === "string" && value.trim() !== "") return Number(value);
	if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) return value.toLowerCase() === "true";
	if (options.parseNumbers && !Number.isNaN(Number(value)) && typeof value === "string" && value.trim() !== "") return Number(value);
	return value;
}
function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf("?");
	if (queryStart === -1) return "";
	return input.slice(queryStart + 1);
}
function parse(query, options) {
	options = {
		decode: true,
		sort: true,
		arrayFormat: "none",
		arrayFormatSeparator: ",",
		parseNumbers: false,
		parseBooleans: false,
		types: Object.create(null),
		...options
	};
	validateArrayFormatSeparator(options.arrayFormatSeparator);
	const formatter = parserForArrayFormat(options);
	const returnValue = Object.create(null);
	if (typeof query !== "string") return returnValue;
	query = query.trim().replace(/^[?#&]/, "");
	if (!query) return returnValue;
	for (const parameter of query.split("&")) {
		if (parameter === "") continue;
		const parameter_ = options.decode ? parameter.replaceAll("+", " ") : parameter;
		let [key, value] = splitOnFirst(parameter_, "=");
		if (key === void 0) key = parameter_;
		value = value === void 0 ? null : [
			"comma",
			"separator",
			"bracket-separator"
		].includes(options.arrayFormat) ? value : decode(value, options);
		formatter(decode(key, options), value, returnValue);
	}
	for (const [key, value] of Object.entries(returnValue)) if (typeof value === "object" && value !== null && options.types[key] !== "string") for (const [key2, value2] of Object.entries(value)) {
		const typeOption = options.types[key];
		const type = typeof typeOption === "function" ? typeOption : typeOption ? typeOption.replace("[]", "") : void 0;
		value[key2] = parseValue(value2, options, type);
	}
	else if (typeof value === "object" && value !== null && options.types[key] === "string") returnValue[key] = Object.values(value).join(options.arrayFormatSeparator);
	else returnValue[key] = parseValue(value, options, options.types[key]);
	if (options.sort === false) return returnValue;
	return (options.sort === true ? Object.keys(returnValue).sort() : Object.keys(returnValue).sort(options.sort)).reduce((result, key) => {
		const value = returnValue[key];
		result[key] = Boolean(value) && typeof value === "object" && !Array.isArray(value) ? keysSorter(value) : value;
		return result;
	}, Object.create(null));
}
function stringify(object, options) {
	if (!object) return "";
	options = {
		encode: true,
		strict: true,
		arrayFormat: "none",
		arrayFormatSeparator: ",",
		...options
	};
	validateArrayFormatSeparator(options.arrayFormatSeparator);
	const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
	const formatter = encoderForArrayFormat(options);
	const objectCopy = {};
	for (const [key, value] of Object.entries(object)) if (!shouldFilter(key)) objectCopy[key] = value;
	const keys = Object.keys(objectCopy);
	if (options.sort !== false) keys.sort(options.sort);
	return keys.map((key) => {
		let value = object[key];
		if (options.replacer) {
			value = options.replacer(key, value);
			if (value === void 0) return "";
		}
		if (value === void 0) return "";
		if (value === null) return encode(key, options);
		if (Array.isArray(value)) {
			if (value.length === 0 && options.arrayFormat === "bracket-separator") return encode(key, options) + "[]";
			let processedArray = value;
			if (options.replacer) processedArray = value.map((item, index) => options.replacer(`${key}[${index}]`, item)).filter((item) => item !== void 0);
			return processedArray.reduce(formatter(key), []).join("&");
		}
		return encode(key, options) + "=" + encode(value, options);
	}).filter((x) => x.length > 0).join("&");
}
function parseUrl(url, options) {
	var _url_$split;
	options = {
		decode: true,
		...options
	};
	let [url_, hash] = splitOnFirst(url, "#");
	if (url_ === void 0) url_ = url;
	return {
		url: (url_ === null || url_ === void 0 || (_url_$split = url_.split("?")) === null || _url_$split === void 0 ? void 0 : _url_$split[0]) ?? "",
		query: parse(extract(url), options),
		...options && options.parseFragmentIdentifier && hash ? { fragmentIdentifier: decode(hash, options) } : {}
	};
}
function stringifyUrl(object, options) {
	options = {
		encode: true,
		strict: true,
		[encodeFragmentIdentifier]: true,
		...options
	};
	const url = removeHash(object.url).split("?")[0] || "";
	const queryFromUrl = extract(object.url);
	const query = {
		...parse(queryFromUrl, {
			sort: false,
			...options
		}),
		...object.query
	};
	let queryString = stringify(query, options);
	queryString && (queryString = `?${queryString}`);
	let hash = getHash(object.url);
	if (typeof object.fragmentIdentifier === "string") {
		const urlObjectForFragmentEncode = new URL(url);
		urlObjectForFragmentEncode.hash = object.fragmentIdentifier;
		hash = options[encodeFragmentIdentifier] ? urlObjectForFragmentEncode.hash : `#${object.fragmentIdentifier}`;
	}
	return `${url}${queryString}${hash}`;
}
function pick(input, filter, options) {
	options = {
		parseFragmentIdentifier: true,
		[encodeFragmentIdentifier]: false,
		...options
	};
	const { url, query, fragmentIdentifier } = parseUrl(input, options);
	return stringifyUrl({
		url,
		query: includeKeys(query, filter),
		fragmentIdentifier
	}, options);
}
function exclude(input, filter, options) {
	const exclusionFilter = Array.isArray(filter) ? (key) => !filter.includes(key) : (key, value) => !filter(key, value);
	return pick(input, exclusionFilter, options);
}
var query_string_default = base_exports;
const stateMap = /* @__PURE__ */ new Map();
let enabled = true;
function useGlobalState(key, initialValue) {
	const state = stateMap.get(key) ?? initialValue;
	function setValue(valueOrDispatcher) {
		if (typeof valueOrDispatcher === "function") {
			const dispatcher = valueOrDispatcher;
			stateMap.set(key, dispatcher(cloneDeep(state)));
		} else {
			const value = valueOrDispatcher;
			stateMap.set(key, value);
		}
		queueMicrotask(() => {
			if (!enabled) return;
			enabled = false;
			const root$1 = document.querySelector("#root");
			root$1.innerHTML = "";
			render(cloneDeep(renderTree.raw));
			delay(1).then(() => {
				enabled = true;
			});
		});
	}
	return [state, setValue];
}
function cleanup(targetNode = renderTree.tree) {
	if (Array.isArray(targetNode)) for (const child of targetNode) {
		if (!(child instanceof ElementNode)) continue;
		cleanup(child);
	}
	else {
		var _targetNode$sideEffec;
		for (const child of targetNode.children) if (Array.isArray(child) || child instanceof ElementNode) cleanup(child);
		if (targetNode instanceof CompnentElementNode) for (const nestedComponent of targetNode.nestedComponenets ?? []) cleanup(nestedComponent);
		if (targetNode instanceof CompnentElementNode) (_targetNode$sideEffec = targetNode.sideEffects) === null || _targetNode$sideEffec === void 0 || _targetNode$sideEffec.forEach((sideEffect) => {
			var _sideEffect$cleanup;
			(_sideEffect$cleanup = sideEffect.cleanup) === null || _sideEffect$cleanup === void 0 || _sideEffect$cleanup.call(sideEffect);
		});
	}
	return null;
}
function createRouter(routes$1) {
	function useInternalRouter() {
		const [route, setRoute] = useGlobalState("route", detectCurrentRoute(routes$1));
		if (isNil(route)) return {
			route: void 0,
			pathParams: {},
			queryParams: {},
			push: () => {},
			replace: () => {},
			back: () => {},
			forward: () => {}
		};
		const path = useMemo(() => routes$1[route].path, [route]);
		const pathParams = useMemo(() => extractPathParams(path), [path]);
		const queryParams = useMemo(() => query_string_default.parse(window.location.search), [window.location.search]);
		const [error, setError] = useGlobalState("error", null);
		const push = (routeName, options) => {
			const url = getUrl(routes$1, routeName, options);
			window.history.pushState({}, "", url);
			cleanup();
			renderTree.tree = null;
			setRoute(routeName);
		};
		const replace = (routeName, options) => {
			const url = getUrl(routes$1, routeName, options);
			window.history.replaceState({}, "", url);
			cleanup();
			renderTree.tree = null;
			setRoute(routeName);
		};
		const back = () => {
			window.history.back();
			cleanup();
			renderTree.tree = null;
			setRoute(detectCurrentRoute(routes$1));
		};
		const forward = () => {
			window.history.forward();
			cleanup();
			setRoute(detectCurrentRoute(routes$1));
		};
		useEffect(() => {
			const controller = new AbortController();
			window.addEventListener("popstate", () => {
				cleanup();
				renderTree.tree = null;
				setRoute(detectCurrentRoute(routes$1));
			}, { signal: controller.signal });
			window.addEventListener("unhandledrejection", (event) => {
				cleanup();
				setError(event.reason);
			}, { signal: controller.signal });
			window.addEventListener("error", (event) => {
				cleanup();
				console.log("error", event.error);
				if (event.error === error) return;
				setError(event.error);
			}, { signal: controller.signal });
			return () => {
				controller.abort();
			};
		}, []);
		return {
			route,
			error,
			pathParams,
			queryParams,
			push,
			replace,
			back,
			forward
		};
	}
	function useRouter$1() {
		return window.__router;
	}
	function Router$1({ fallback }) {
		const router = useInternalRouter();
		const { route, error, pathParams, queryParams } = router;
		if (isNotNil(error)) {
			const ErrorComponent = fallback.error;
			return /* @__PURE__ */ h(ErrorComponent, { error });
		}
		if (isNil(route)) {
			const NotFoundComponent = fallback.notFound;
			return /* @__PURE__ */ h(NotFoundComponent, null);
		}
		const RouteComponent = routes$1[route].component;
		window.__router = router;
		return /* @__PURE__ */ h(Fragment, null, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h(RouteComponent, {
			pathParams,
			queryParams
		})));
	}
	return {
		Router: Router$1,
		useRouter: useRouter$1
	};
}
function applyPathParams(path, pathParams) {
	return path.replace(/:(\w+)/g, (match, p1) => pathParams[p1] ?? match);
}
function extractPathParams(path) {
	const base = "/front_7th_chapter2-1/";
	const splittedWindowPath = window.location.pathname.replace(base === "/" ? "" : `${base === null || base === void 0 ? void 0 : base.replace(/\/$/, "")}`, "").split("/");
	const result = {};
	for (const [idx, token$1] of path.split("/").entries()) if (token$1.startsWith(":")) result[token$1.slice(1)] = splittedWindowPath[idx];
	return result;
}
function detectCurrentRoute(routes$1) {
	var _Object$entries$find;
	const base = "/front_7th_chapter2-1/";
	const splittedPath = window.location.pathname.replace(base === "/" ? "" : `${base === null || base === void 0 ? void 0 : base.replace(/\/$/, "")}`, "").split("/");
	return (_Object$entries$find = Object.entries(routes$1).find(([_, route]) => route.path.split("/").every((token$1, idx) => token$1 === splittedPath[idx] || token$1.startsWith(":") && isNotNil(splittedPath[idx])))) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[0];
}
function getUrl(routes$1, routeName, options) {
	const base = "/front_7th_chapter2-1/";
	const route = routes$1[routeName];
	const appliedPath = applyPathParams(route.path, (options === null || options === void 0 ? void 0 : options.pathParams) ?? {});
	const queryString = query_string_default.stringify((options === null || options === void 0 ? void 0 : options.queryParams) ?? {});
	return `${String(base).replace(/\/$/, "")}${appliedPath}${queryString === "" ? "" : `?${queryString}`}`;
}
function useState(initialValue) {
	if (!(currentRenderingNode instanceof CompnentElementNode)) throw new Error("currentRenderingNode is not an object");
	if (isNil(currentRenderingNode.state) || isNil(currentRenderingNode.stateCursor)) throw new Error("parentNode.state or parentNode.stateCursor is not set");
	const { key, state, stateCursor } = currentRenderingNode;
	state[stateCursor] = state[stateCursor] ?? initialValue;
	currentRenderingNode.stateCursor++;
	if (typeof state[stateCursor] === "object") Object.freeze(state[stateCursor]);
	function setValue(valueOrDispatcher) {
		const parentNode = searchCurrentNode(key);
		invariant(isNotNil(parentNode), "parentNode is not found");
		invariant(isNotNil(parentNode.state), "parentNode.state is not set");
		if (typeof valueOrDispatcher === "function") {
			const dispatcher = valueOrDispatcher;
			parentNode.state[stateCursor] = dispatcher(cloneDeep(state[stateCursor]));
		} else {
			const value = valueOrDispatcher;
			parentNode.state[stateCursor] = value;
		}
		queueMicrotask(() => {
			render(parentNode, parentNode.parent, "");
		});
	}
	return [state[stateCursor], setValue];
}
/**
* 상품 목록 조회
*/
async function getProducts(params = {}) {
	const { limit = 20, search = "", category1 = "", category2 = "", sort = "price_asc" } = params;
	const page = params.current ?? params.page ?? 1;
	const searchParams = new URLSearchParams({
		page: page.toString(),
		limit: limit.toString(),
		...search && { search },
		...category1 && { category1 },
		...category2 && { category2 },
		sort
	});
	const response = await fetch(`/api/products?${searchParams}`);
	return await response.json();
}
/**
* 상품 상세 조회
*/
async function getProduct(productId) {
	const response = await fetch(`/api/products/${productId}`);
	return await response.json();
}
/**
* 카테고리 목록 조회
*/
async function getCategories() {
	const response = await fetch("/api/categories");
	return await response.json();
}
const limitOptions = [
	10,
	20,
	50,
	100
];
const sortOptions = [
	{
		label: "가격 낮은순",
		value: "price_asc"
	},
	{
		label: "가격 높은순",
		value: "price_desc"
	},
	{
		label: "이름순",
		value: "name_asc"
	},
	{
		label: "이름 역순",
		value: "name_desc"
	}
];
function ProductFilter({ onSearch, onChangeCategories, onSort, onLimit }) {
	const router = useRouter();
	const { search, category1, category2 } = router.queryParams;
	const sort = router.queryParams.sort ?? "price_asc";
	const limit = Number(router.queryParams.limit ?? 20);
	const [isLoading, setIsLoading] = useState(true);
	const [categories, setCategories] = useState(null);
	const step = useMemo(() => isNil(category1) ? 0 : 1, [category1]);
	const currentDisplayingCategories = useMemo(() => {
		if (isNil(categories)) return [];
		if (isNil(category1)) return Object.keys(categories);
		return Object.keys(categories[category1]);
	}, [category1, categories]);
	const fetchCategories = async () => {
		setIsLoading(true);
		const response = await getCategories();
		setCategories(response);
		setIsLoading(false);
	};
	useEffect(() => {
		fetchCategories();
	}, []);
	return /* @__PURE__ */ h("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4" }, /* @__PURE__ */ h("div", { className: "mb-4" }, /* @__PURE__ */ h("div", { className: "relative" }, /* @__PURE__ */ h("input", {
		type: "text",
		id: "search-input",
		placeholder: "상품명을 검색해보세요...",
		value: search ?? "",
		onKeyDown: (e) => {
			var _e$currentTarget;
			if (e.key === "Enter") onSearch((_e$currentTarget = e.currentTarget) === null || _e$currentTarget === void 0 ? void 0 : _e$currentTarget.value);
		},
		className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
	}), /* @__PURE__ */ h("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" }, /* @__PURE__ */ h("svg", {
		className: "h-5 w-5 text-gray-400",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: "2",
		d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
	}))))), /* @__PURE__ */ h("div", { className: "space-y-3" }, /* @__PURE__ */ h("div", { className: "space-y-2" }, /* @__PURE__ */ h("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ h("label", { className: "text-sm text-gray-600" }, "카테고리: "), /* @__PURE__ */ h("button", {
		"data-breadcrumb": "reset",
		className: "text-xs hover:text-blue-800 hover:underline",
		onClick: () => {
			onChangeCategories([]);
		}
	}, "전체"), isNotNil(category1) && /* @__PURE__ */ h(Fragment, null, /* @__PURE__ */ h("span", { className: "text-xs text-gray-500" }, ">"), /* @__PURE__ */ h("button", {
		"data-breadcrumb": "category1",
		"data-category1": category1,
		className: "text-xs hover:text-blue-800 hover:underline",
		onClick: () => {
			onChangeCategories([category1]);
		}
	}, category1)), isNotNil(category2) && /* @__PURE__ */ h(Fragment, null, /* @__PURE__ */ h("span", { className: "text-xs text-gray-500" }, ">"), /* @__PURE__ */ h("button", {
		"data-breadcrumb": "category2",
		"data-category2": category2,
		className: "text-xs hover:text-blue-800 hover:underline",
		onClick: () => {
			onChangeCategories([category1, category2]);
		}
	}, category2))), (() => {
		if (isLoading) return /* @__PURE__ */ h("div", { className: "flex flex-wrap gap-2" }, /* @__PURE__ */ h("div", { className: "text-sm text-gray-500 italic" }, "카테고리 로딩 중..."));
		return /* @__PURE__ */ h("div", { className: "flex flex-wrap gap-2" }, currentDisplayingCategories.map((category) => /* @__PURE__ */ h("button", {
			"data-category1": category,
			className: `category${step}-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                  ${category2 === category ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`,
			onClick: () => {
				const nextCategories = [category1, category2].filter(isNotNil);
				nextCategories[step] = category;
				onChangeCategories(nextCategories);
			}
		}, " ", category)));
	})()), /* @__PURE__ */ h("div", { className: "flex gap-2 items-center justify-between" }, /* @__PURE__ */ h("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ h("label", { className: "text-sm text-gray-600" }, "개수:"), /* @__PURE__ */ h("select", {
		id: "limit-select",
		className: "text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
		onChange: (e) => {
			var _e$currentTarget2;
			const value = Number((_e$currentTarget2 = e.currentTarget) === null || _e$currentTarget2 === void 0 ? void 0 : _e$currentTarget2.value);
			onLimit(value);
		}
	}, limitOptions.map((option) => /* @__PURE__ */ h("option", {
		key: option,
		value: option,
		selected: option === limit
	}, option, "개")))), /* @__PURE__ */ h("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ h("label", { className: "text-sm text-gray-600" }, "정렬:"), /* @__PURE__ */ h("select", {
		id: "sort-select",
		className: "text-sm border border-gray-300 rounded px-2 py-1\n                         focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
		onChange: (e) => {
			var _e$currentTarget3;
			const value = (_e$currentTarget3 = e.currentTarget) === null || _e$currentTarget3 === void 0 ? void 0 : _e$currentTarget3.value;
			onSort(value);
		}
	}, sortOptions.map((option) => /* @__PURE__ */ h("option", {
		key: option.value,
		value: option.value,
		selected: option.value === sort
	}, option.label)))))));
}
function useLocalStorage(key, initialValue) {
	const [state, setState] = useGlobalState(key, localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : initialValue);
	useEffect(() => {
		try {
			const item = localStorage.getItem(key);
			if (isNotNil(item)) setState(JSON.parse(item));
		} catch (error) {
			console.error(error);
		}
	}, []);
	const setValue = (valueOrDispatcher) => {
		if (typeof valueOrDispatcher === "function") {
			const dispatcher = valueOrDispatcher;
			const value$1 = dispatcher(state);
			localStorage.setItem(key, JSON.stringify(value$1));
			setState(value$1);
			return;
		}
		const value = valueOrDispatcher;
		localStorage.setItem(key, JSON.stringify(value));
		setState(value);
	};
	return [state, setValue];
}
const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
	let id = "";
	let bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
	while (size--) id += urlAlphabet[bytes[size] & 63];
	return id;
};
function Toast({ variant, title, onDestroy }) {
	useEffect(() => {
		delay(3e3).then(() => {
			onDestroy();
		});
	}, []);
	const color = (() => {
		switch (variant) {
			case "success": return "bg-green-600";
			case "info": return "bg-blue-600";
			case "error": return "bg-red-600";
		}
	})();
	const icon = (() => {
		switch (variant) {
			case "success": return /* @__PURE__ */ h("svg", {
				className: "w-5 h-5",
				fill: "none",
				stroke: "currentColor",
				viewBox: "0 0 24 24"
			}, /* @__PURE__ */ h("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"stroke-width": "2",
				d: "M5 13l4 4L19 7"
			}));
			case "info": return /* @__PURE__ */ h("svg", {
				className: "w-5 h-5",
				fill: "none",
				stroke: "currentColor",
				viewBox: "0 0 24 24"
			}, /* @__PURE__ */ h("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"stroke-width": "2",
				d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			}));
			case "error": return /* @__PURE__ */ h("svg", {
				className: "w-5 h-5",
				fill: "none",
				stroke: "currentColor",
				viewBox: "0 0 24 24"
			}, /* @__PURE__ */ h("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"stroke-width": "2",
				d: "M6 18L18 6M6 6l12 12"
			}));
		}
	})();
	return /* @__PURE__ */ h("div", { className: `${color} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm pointer-events-auto` }, /* @__PURE__ */ h("div", { className: "flex-shrink-0" }, icon), /* @__PURE__ */ h("p", { className: "text-sm font-medium" }, title), /* @__PURE__ */ h("button", {
		id: "toast-close-btn",
		className: "flex-shrink-0 ml-2 text-white hover:text-gray-200",
		onClick: onDestroy
	}, /* @__PURE__ */ h("svg", {
		className: "w-4 h-4",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M6 18L18 6M6 6l12 12"
	}))));
}
function ToastContainer() {
	const [toasts, setToasts] = useState([]);
	useEffect(() => {
		const controller = new AbortController();
		window.addEventListener("toast", (event) => {
			const { variant, title } = event.detail;
			setToasts((prev) => [...prev, {
				id: nanoid(),
				variant,
				title
			}]);
		}, { signal: controller.signal });
		return () => {
			controller.abort();
		};
	}, []);
	return /* @__PURE__ */ h("div", {
		className: "fixed w-screen p-2 flex flex-col gap-2 items-end justify-center mx-auto pointer-events-none",
		style: { zIndex: "99" }
	}, toasts.map((toast) => /* @__PURE__ */ h(Toast, {
		...toast,
		onDestroy: () => {
			setToasts((prev) => prev.filter((t) => t.id !== toast.id));
		}
	})));
}
function showToast(variant, title) {
	window.dispatchEvent(new CustomEvent("toast", { detail: {
		variant,
		title
	} }));
}
function commaNumber(number) {
	return number.toLocaleString("ko-KR");
}
function ProductItem({ product }) {
	const router = useRouter();
	const [_, setCart] = useLocalStorage("shopping_cart", []);
	return /* @__PURE__ */ h("div", {
		className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card",
		"data-product-id": product.productId,
		onClick: (e) => {
			const target = e.target;
			if (target.tagName === "BUTTON") return;
			router.push("상품 상세", { pathParams: { id: product.productId } });
		}
	}, /* @__PURE__ */ h("div", { className: "aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image" }, /* @__PURE__ */ h("img", {
		src: product.image,
		alt: decodeHtmlEntity(product.title),
		className: "w-full h-full object-cover hover:scale-105 transition-transform duration-200",
		loading: "lazy"
	})), /* @__PURE__ */ h("div", { className: "p-3" }, /* @__PURE__ */ h("div", { className: "cursor-pointer product-info mb-3" }, /* @__PURE__ */ h("h3", { className: "text-sm font-medium text-gray-900 line-clamp-2 mb-1" }, product.title), /* @__PURE__ */ h("p", { className: "text-xs text-gray-500 mb-2" }, product.brand), /* @__PURE__ */ h("p", { className: "text-lg font-bold text-gray-900" }, commaNumber(Number(product.lprice)), "원")), /* @__PURE__ */ h("button", {
		className: "w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn",
		"data-product-id": product.productId,
		onClick: () => {
			setCart((prev) => {
				const existingCart = prev.find((cart) => cart.product.productId === product.productId);
				if (isNotNil(existingCart)) return prev.map((cart) => cart.product.productId === product.productId ? {
					...cart,
					quantity: cart.quantity + 1
				} : cart);
				return [...prev, {
					product,
					quantity: 1
				}];
			});
			showToast("success", "장바구니에 추가되었습니다");
		}
	}, "장바구니 담기")));
}
function ProductSkeleton() {
	return /* @__PURE__ */ h("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse" }, /* @__PURE__ */ h("div", { className: "aspect-square bg-gray-200" }), /* @__PURE__ */ h("div", { className: "p-3" }, /* @__PURE__ */ h("div", { className: "h-4 bg-gray-200 rounded mb-2" }), /* @__PURE__ */ h("div", { className: "h-3 bg-gray-200 rounded w-2/3 mb-2" }), /* @__PURE__ */ h("div", { className: "h-5 bg-gray-200 rounded w-1/2 mb-3" }), /* @__PURE__ */ h("div", { className: "h-8 bg-gray-200 rounded" })));
}
function SpinCircle() {
	return /* @__PURE__ */ h("svg", {
		className: "animate-spin h-5 w-5 text-blue-600 mr-2",
		fill: "none",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("circle", {
		className: "opacity-25",
		cx: "12",
		cy: "12",
		r: "10",
		stroke: "currentColor",
		strokeWidth: "4"
	}), /* @__PURE__ */ h("path", {
		className: "opacity-75",
		fill: "currentColor",
		d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
	}));
}
function ProductList({ totalProducts, products, isLoading, limit }) {
	return /* @__PURE__ */ h("div", { className: "mb-6" }, /* @__PURE__ */ h("div", null, !isLoading && /* @__PURE__ */ h("div", { className: "mb-4 text-sm text-gray-600" }, "총", " ", /* @__PURE__ */ h("span", { className: "font-medium text-gray-900" }, commaNumber(totalProducts), "개"), "의 상품"), /* @__PURE__ */ h("div", {
		className: "grid grid-cols-2 gap-4 mb-6",
		id: "products-grid"
	}, (() => {
		if (isLoading) return Array.from({ length: limit }).map(() => /* @__PURE__ */ h(ProductSkeleton, null));
		return products.map((product) => /* @__PURE__ */ h(ProductItem, { product }));
	})()), (() => {
		if (isLoading) return /* @__PURE__ */ h("div", { className: "text-center py-4" }, /* @__PURE__ */ h("div", { className: "inline-flex items-center" }, /* @__PURE__ */ h(SpinCircle, null), /* @__PURE__ */ h("span", { className: "text-sm text-gray-600" }, "상품을 불러오는 중...")));
		return /* @__PURE__ */ h("div", { className: "text-center py-4 text-sm text-gray-500" }, "모든 상품을 확인했습니다");
	})()));
}
function ImpressionArea({ rootMargin = "0px", threshold = .5, debounceTime = 500, onImpression }) {
	useEffect(() => {
		let triggered = false;
		const root$1 = document.querySelector("#root");
		if (isNil(root$1)) return;
		const intersectionObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && !triggered) {
					triggered = true;
					onImpression();
					intersectionObserver.disconnect();
					delay(debounceTime).then(() => {
						triggered = false;
						intersectionObserver.observe(entry.target);
					});
				}
			});
		}, {
			rootMargin,
			threshold
		});
		intersectionObserver.observe(document.querySelector("#impression-area"));
		const mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node instanceof HTMLElement && node.id === "impression-area") {
						intersectionObserver.disconnect();
						delay(1).then(() => {
							intersectionObserver.observe(node);
						});
					}
				});
			});
		});
		mutationObserver.observe(root$1, {
			childList: true,
			subtree: true
		});
		return () => {
			mutationObserver === null || mutationObserver === void 0 || mutationObserver.disconnect();
			intersectionObserver === null || intersectionObserver === void 0 || intersectionObserver.disconnect();
		};
	}, []);
	return /* @__PURE__ */ h("div", { id: "impression-area" });
}
function CartModal({ onClose }) {
	const [cart, setCart] = useLocalStorage("shopping_cart", []);
	const [selectedItems, setSelectedItems] = useState([]);
	const totalQuantity = useMemo(() => sum(cart.map((item) => item.quantity)), [cart]);
	const totalPrice = useMemo(() => sum(cart.map((item) => Number(item.product.lprice) * item.quantity)), [cart]);
	return /* @__PURE__ */ h("div", { className: "flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4" }, /* @__PURE__ */ h("div", { className: "cart-modal relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden" }, /* @__PURE__ */ h("div", { className: "sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between" }, /* @__PURE__ */ h("h2", { className: "text-lg font-bold text-gray-900 flex items-center" }, /* @__PURE__ */ h("svg", {
		className: "w-5 h-5 mr-2",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
	})), "장바구니", /* @__PURE__ */ h("span", { className: "text-sm font-normal text-gray-600 ml-1" }, "(", totalQuantity, ")")), /* @__PURE__ */ h("button", {
		id: "cart-modal-close-btn",
		className: "text-gray-400 hover:text-gray-600 p-1",
		onClick: onClose
	}, /* @__PURE__ */ h("svg", {
		className: "w-6 h-6",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M6 18L18 6M6 6l12 12"
	})))), cart.length === 0 ? /* @__PURE__ */ h("div", { className: "flex-1 flex items-center justify-center p-8" }, /* @__PURE__ */ h("div", { className: "text-center" }, /* @__PURE__ */ h("div", { className: "text-gray-400 mb-4" }, /* @__PURE__ */ h("svg", {
		className: "mx-auto h-12 w-12",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
	}))), /* @__PURE__ */ h("h3", { className: "text-lg font-medium text-gray-900 mb-2" }, "장바구니가 비어있습니다"), /* @__PURE__ */ h("p", { className: "text-gray-600" }, "원하는 상품을 담아보세요!"))) : /* @__PURE__ */ h("div", { className: "flex flex-col max-h-[calc(90vh-120px)]" }, /* @__PURE__ */ h("div", { className: "p-4 border-b border-gray-200 bg-gray-50" }, /* @__PURE__ */ h("label", { className: "flex items-center text-sm text-gray-700" }, /* @__PURE__ */ h("input", {
		type: "checkbox",
		id: "cart-modal-select-all-checkbox",
		className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2",
		checked: selectedItems.length === cart.length,
		onChange: (e) => {
			var _e$currentTarget4;
			if ((_e$currentTarget4 = e.currentTarget) === null || _e$currentTarget4 === void 0 ? void 0 : _e$currentTarget4.checked) setSelectedItems(cart.map((item) => item.product.productId));
			else setSelectedItems([]);
		}
	}), "전체선택 (", totalQuantity, "개)")), /* @__PURE__ */ h("div", { className: "flex-1 overflow-y-auto" }, /* @__PURE__ */ h("div", { className: "p-4 space-y-4" }, cart.map((item) => /* @__PURE__ */ h("div", {
		className: "flex items-center py-3 border-b border-gray-100 cart-item",
		"data-product-id": "85067212996"
	}, /* @__PURE__ */ h("label", { className: "flex items-center mr-3" }, /* @__PURE__ */ h("input", {
		type: "checkbox",
		className: "cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded \n                focus:ring-blue-500",
		"data-product-id": "85067212996",
		checked: selectedItems.includes(item.product.productId),
		onChange: (e) => {
			var _e$currentTarget5;
			if ((_e$currentTarget5 = e.currentTarget) === null || _e$currentTarget5 === void 0 ? void 0 : _e$currentTarget5.checked) setSelectedItems([...selectedItems, item.product.productId]);
			else setSelectedItems(selectedItems.filter((id) => id !== item.product.productId));
		}
	})), /* @__PURE__ */ h("div", { className: "w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0" }, /* @__PURE__ */ h("img", {
		src: item.product.image,
		alt: item.product.title,
		className: "w-full h-full object-cover cursor-pointer cart-item-image",
		"data-product-id": "85067212996"
	})), /* @__PURE__ */ h("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ h("h4", {
		className: "text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title",
		"data-product-id": "85067212996"
	}, item.product.title), /* @__PURE__ */ h("p", { className: "text-sm text-gray-600 mt-1" }, commaNumber(Number(item.product.lprice)), "원"), /* @__PURE__ */ h("div", { className: "flex items-center mt-2" }, /* @__PURE__ */ h("button", {
		className: "quantity-decrease-btn w-7 h-7 flex items-center justify-center \n                 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100",
		"data-product-id": "85067212996",
		onClick: () => {
			setCart(cart.map((campareItem) => campareItem.product.productId === item.product.productId ? {
				...campareItem,
				quantity: Math.max(campareItem.quantity - 1, 1)
			} : campareItem));
		}
	}, /* @__PURE__ */ h("svg", {
		className: "w-3 h-3",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M20 12H4"
	}))), /* @__PURE__ */ h("input", {
		type: "number",
		value: item.quantity,
		min: "1",
		className: "quantity-input w-12 h-7 text-center text-sm border-t border-b \n                border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
		disabled: true,
		"data-product-id": "85067212996"
	}), /* @__PURE__ */ h("button", {
		className: "quantity-increase-btn w-7 h-7 flex items-center justify-center \n                 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100",
		"data-product-id": "85067212996",
		onClick: () => {
			setCart(cart.map((campareItem) => campareItem.product.productId === item.product.productId ? {
				...campareItem,
				quantity: campareItem.quantity + 1
			} : campareItem));
		}
	}, /* @__PURE__ */ h("svg", {
		className: "w-3 h-3",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M12 4v16m8-8H4"
	}))))), /* @__PURE__ */ h("div", { className: "text-right ml-3" }, /* @__PURE__ */ h("p", { className: "text-sm font-medium text-gray-900" }, commaNumber(Number(item.product.lprice) * item.quantity), "원"), /* @__PURE__ */ h("button", {
		className: "cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800",
		"data-product-id": "85067212996",
		onClick: () => {
			setCart(cart.filter((campareItem) => campareItem.product.productId !== item.product.productId));
			showToast("info", "선택된 상품들이 삭제되었습니다");
		}
	}, "삭제"))))))), /* @__PURE__ */ h("div", { className: "sticky bottom-0 bg-white border-t border-gray-200 p-4" }, /* @__PURE__ */ h("div", { className: "flex justify-between items-center mb-4" }, /* @__PURE__ */ h("span", { className: "text-lg font-bold text-gray-900" }, "총 금액"), /* @__PURE__ */ h("span", { className: "text-xl font-bold text-blue-600" }, commaNumber(totalPrice), "원")), /* @__PURE__ */ h("div", { className: "space-y-2" }, selectedItems.length > 0 && /* @__PURE__ */ h("button", {
		id: "cart-modal-remove-selected-btn",
		className: "w-full bg-red-600 text-white py-2 px-4 rounded-md \n                       hover:bg-red-700 transition-colors text-sm",
		onClick: () => {
			setCart(cart.filter((item) => !selectedItems.includes(item.product.productId)));
			setSelectedItems([]);
			showToast("info", "선택된 상품들이 삭제되었습니다");
		}
	}, "선택한 상품 삭제 (", selectedItems.length, "개)"), /* @__PURE__ */ h("div", { className: "flex gap-2" }, /* @__PURE__ */ h("button", {
		id: "cart-modal-clear-cart-btn",
		className: "flex-1 bg-gray-600 text-white py-2 px-4 rounded-md \n                       hover:bg-gray-700 transition-colors text-sm",
		onClick: () => {
			setCart([]);
			setSelectedItems([]);
			showToast("info", "선택된 상품들이 삭제되었습니다");
		}
	}, "전체 비우기"), /* @__PURE__ */ h("button", {
		id: "cart-modal-checkout-btn",
		className: "flex-1 bg-blue-600 text-white py-2 px-4 rounded-md \n                       hover:bg-blue-700 transition-colors text-sm"
	}, "구매하기"))))));
}
function OverlayContainer() {
	const [overlays, setOverlays] = useState([]);
	useEffect(() => {
		const controller = new AbortController();
		window.addEventListener("overlay", (event) => {
			setOverlays((prev) => [...prev, event.detail]);
		}, { signal: controller.signal });
		window.addEventListener("overlay:close", (event) => {
			setOverlays((prev) => prev.filter((overlay) => overlay.id !== event.detail));
		}, { signal: controller.signal });
		window.addEventListener("keydown", (event) => {
			if (event.key === "Escape") setOverlays([]);
		}, { signal: controller.signal });
		return () => {
			controller.abort();
		};
	}, []);
	if (overlays.length === 0) return null;
	return /* @__PURE__ */ h(Fragment, null, /* @__PURE__ */ h("div", {
		className: "cart-modal-overlay fixed w-screen h-screen top-0 left-0 bg-black/50",
		style: { zIndex: "98" },
		onClick: (e) => {
			const target = e.target;
			const currentTarget = e.currentTarget;
			if (target !== currentTarget) return;
			e.preventDefault();
			e.stopPropagation();
			setOverlays([]);
		}
	}, overlays.map(({ id, Controller }) => /* @__PURE__ */ h("div", {
		key: `overlay-${id}`,
		className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
	}, /* @__PURE__ */ h(Controller, { close: () => setOverlays((prev) => prev.filter((overlay) => overlay.id !== overlay.id)) })))));
}
function openOverlay(Controller) {
	const id = nanoid();
	window.dispatchEvent(new CustomEvent("overlay", { detail: {
		id,
		Controller
	} }));
}
function CartButton() {
	const [cart] = useLocalStorage("shopping_cart", []);
	const totalQuantity = useMemo(() => sum(cart.map((item) => item.quantity)), [cart]);
	return /* @__PURE__ */ h("button", {
		id: "cart-icon-btn",
		className: "relative p-2 text-gray-700 hover:text-gray-900 transition-colors",
		onClick: () => {
			openOverlay(({ close }) => /* @__PURE__ */ h(CartModal, { onClose: close }));
		}
	}, /* @__PURE__ */ h("svg", {
		className: "w-6 h-6",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: "2",
		d: "M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
	})), cart.length > 0 && /* @__PURE__ */ h("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" }, cart.length));
}
function Topbar() {
	const router = useRouter();
	return /* @__PURE__ */ h("header", { className: "bg-white shadow-sm sticky top-0 z-40" }, /* @__PURE__ */ h("div", { className: "max-w-md mx-auto px-4 py-4" }, /* @__PURE__ */ h("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ h("h1", { className: "text-xl font-bold text-gray-900" }, /* @__PURE__ */ h("a", {
		href: "/",
		dataLink: ""
	}, router === null || router === void 0 ? void 0 : router.route)), /* @__PURE__ */ h("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ h(CartButton, null)))));
}
function Footer() {
	return /* @__PURE__ */ h("footer", { className: "bg-white shadow-sm sticky top-0 z-40" }, /* @__PURE__ */ h("div", { className: "max-w-md mx-auto py-8 text-center text-gray-500" }, /* @__PURE__ */ h("p", null, "© 2025 항해플러스 프론트엔드 쇼핑몰")));
}
function Layout({ children }) {
	return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h(Topbar, null), /* @__PURE__ */ h("div", { className: "flex-1" }, children), /* @__PURE__ */ h(Footer, null));
}
function ProductListPage() {
	const router = useRouter();
	const { search, category1, category2 } = router.queryParams;
	const sort = router.queryParams.sort ?? "price_asc";
	const limit = Number(router.queryParams.limit ?? 20);
	const [totalProducts, setTotalProducts] = useState(0);
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(null);
	const [page, setPage] = useState(1);
	const [error, setError] = useState(null);
	const fetchProducts = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await getProducts({
				page,
				search,
				category1,
				category2,
				sort,
				limit
			});
			setTotalProducts(response.pagination.total);
			setTotalPages(response.pagination.totalPages);
			setProducts((prev) => {
				prev[page - 1] = response.products;
				return prev;
			});
			setIsLoading(false);
		} catch (error$1) {
			console.log("상품 로딩 실패: ", error$1);
			setError(error$1 instanceof Error ? error$1.message : "상품을 불러오는데 실패했습니다.");
			setIsLoading(false);
		}
	};
	useEffect(() => {
		if (isNotNil(totalPages) && page > totalPages) return;
		fetchProducts();
	}, [
		search,
		sort,
		limit,
		page,
		totalPages,
		category1,
		category2
	]);
	return /* @__PURE__ */ h(Layout, null, /* @__PURE__ */ h("main", { className: "h-full max-w-md mx-auto px-4 py-4" }, (() => {
		if (error) return /* @__PURE__ */ h("div", { className: "h-full w-full flex flex-col gap-4 items-center justify-center text-center font-bold" }, /* @__PURE__ */ h("p", { className: "font-medium" }, error), /* @__PURE__ */ h("button", {
			className: "bg-blue-500 p-3 rounded-md flex-shrink-0 text-white hover:text-gray-200",
			onClick: () => {
				fetchProducts();
			}
		}, "다시 시도"));
		return /* @__PURE__ */ h(Fragment, null, /* @__PURE__ */ h(ProductFilter, {
			onSearch: (search$1) => {
				router.push("쇼핑몰", { queryParams: {
					...router.queryParams,
					search: search$1
				} });
			},
			onChangeCategories: (categories) => {
				router.push("쇼핑몰", { queryParams: {
					...router.queryParams,
					category1: categories[0],
					category2: categories[1]
				} });
			},
			onSort: (sort$1) => {
				router.push("쇼핑몰", { queryParams: {
					...router.queryParams,
					sort: sort$1
				} });
			},
			onLimit: (limit$1) => {
				router.push("쇼핑몰", { queryParams: {
					...router.queryParams,
					limit: limit$1.toString()
				} });
			}
		}), /* @__PURE__ */ h(ProductList, {
			totalProducts,
			products: products.flat(),
			isLoading,
			limit
		}), /* @__PURE__ */ h(ImpressionArea, {
			debounceTime: 500,
			onImpression: () => {
				setPage((prev) => prev + 1);
			}
		}));
	})()));
}
function Link({ className, onClick, to, pathParams, queryParams, children,...props }) {
	const router = useRouter();
	const url = getUrl(routes, to, {
		pathParams,
		queryParams
	});
	return /* @__PURE__ */ h("a", {
		className: `${className ?? ""}`,
		...props,
		href: url,
		onClick: (e) => {
			e.preventDefault();
			onClick === null || onClick === void 0 || onClick(e);
			router.push(to, {
				pathParams,
				queryParams
			});
		}
	}, children);
}
function ProductDetail({ id }) {
	const [product, setProduct] = useState(null);
	const fetchProduct = async () => {
		const response = await getProduct(id);
		setProduct(response);
	};
	useEffect(() => {
		fetchProduct();
	}, []);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const fetchRelatedProducts = async () => {
		const response = await getProducts({
			category1: product === null || product === void 0 ? void 0 : product.category1,
			category2: product === null || product === void 0 ? void 0 : product.category2,
			limit: 11,
			page: 1
		});
		setRelatedProducts(response.products.filter((product$1) => product$1.productId !== id).slice(0, 10));
	};
	useEffect(() => {
		fetchRelatedProducts();
	}, [product === null || product === void 0 ? void 0 : product.category1, product === null || product === void 0 ? void 0 : product.category2]);
	const [quantity, setQuantity] = useState(1);
	const [_, setCart] = useLocalStorage("shopping_cart", []);
	if (isNil(product)) return /* @__PURE__ */ h("main", { className: "max-w-md mx-auto px-4 py-4" }, /* @__PURE__ */ h("div", { className: "py-20 bg-gray-50 flex items-center justify-center" }, /* @__PURE__ */ h("div", { className: "text-center" }, /* @__PURE__ */ h("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), /* @__PURE__ */ h("p", { className: "text-gray-600" }, "상품 정보를 불러오는 중..."))));
	return /* @__PURE__ */ h("main", { className: "max-w-md mx-auto px-4 py-4" }, /* @__PURE__ */ h("nav", { className: "mb-4" }, /* @__PURE__ */ h("div", { className: "flex items-center space-x-2 text-sm text-gray-600" }, /* @__PURE__ */ h(Link, {
		to: "쇼핑몰",
		"data-link": "",
		className: "hover:text-blue-600 transition-colors"
	}, "홈"), /* @__PURE__ */ h("svg", {
		className: "w-4 h-4 text-gray-400",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M9 5l7 7-7 7"
	})), /* @__PURE__ */ h(Link, {
		to: "쇼핑몰",
		queryParams: { category1: product.category1 },
		className: "breadcrumb-link"
	}, product.category1), /* @__PURE__ */ h("svg", {
		className: "w-4 h-4 text-gray-400",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M9 5l7 7-7 7"
	})), /* @__PURE__ */ h(Link, {
		to: "쇼핑몰",
		queryParams: {
			category1: product.category1,
			category2: product.category2
		},
		className: "breadcrumb-link"
	}, product.category2))), /* @__PURE__ */ h("div", { className: "bg-white rounded-lg shadow-sm mb-6" }, /* @__PURE__ */ h("div", { className: "p-4" }, /* @__PURE__ */ h("div", { className: "aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4" }, /* @__PURE__ */ h("img", {
		src: product.images[0],
		alt: "PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장",
		className: "w-full h-full object-cover product-detail-image"
	})), /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("p", { className: "text-sm text-gray-600 mb-1" }, product.mallName), /* @__PURE__ */ h("h1", { className: "text-xl font-bold text-gray-900 mb-3" }, product.title), /* @__PURE__ */ h("div", { className: "flex items-center mb-3" }, /* @__PURE__ */ h("div", { className: "flex items-center" }, range(5).map((index) => index < product.rating ? /* @__PURE__ */ h("svg", {
		key: index,
		className: "w-4 h-4 text-yellow-400",
		fill: "currentColor",
		viewBox: "0 0 20 20"
	}, /* @__PURE__ */ h("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })) : /* @__PURE__ */ h("svg", {
		className: "w-4 h-4 text-gray-300",
		fill: "currentColor",
		viewBox: "0 0 20 20"
	}, /* @__PURE__ */ h("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })))), /* @__PURE__ */ h("span", { className: "ml-2 text-sm text-gray-600" }, product.rating.toFixed(1), " (", product.reviewCount, "개 리뷰)")), /* @__PURE__ */ h("div", { className: "mb-4" }, /* @__PURE__ */ h("span", { className: "text-2xl font-bold text-blue-600" }, commaNumber(Number(product.lprice)), "원")), /* @__PURE__ */ h("div", { className: "text-sm text-gray-600 mb-4" }, "재고 ", commaNumber(product.stock), "개"), /* @__PURE__ */ h("div", { className: "text-sm text-gray-700 leading-relaxed mb-6" }, product.description))), /* @__PURE__ */ h("div", { className: "border-t border-gray-200 p-4" }, /* @__PURE__ */ h("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ h("span", { className: "text-sm font-medium text-gray-900" }, "수량"), /* @__PURE__ */ h("div", { className: "flex items-center" }, /* @__PURE__ */ h("button", {
		id: "quantity-decrease",
		className: "w-8 h-8 flex items-center justify-center border border-gray-300 \n                   rounded-l-md bg-gray-50 hover:bg-gray-100",
		onClick: () => setQuantity(Math.max(quantity - 1, 1))
	}, /* @__PURE__ */ h("svg", {
		className: "w-4 h-4",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M20 12H4"
	}))), /* @__PURE__ */ h("input", {
		type: "number",
		id: "quantity-input",
		value: quantity,
		min: "1",
		max: product.stock,
		className: "w-16 h-8 text-center text-sm border-t border-b border-gray-300 \n                  focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
	}), /* @__PURE__ */ h("button", {
		id: "quantity-increase",
		className: "w-8 h-8 flex items-center justify-center border border-gray-300 \n                   rounded-r-md bg-gray-50 hover:bg-gray-100",
		onClick: () => setQuantity(Math.min(quantity + 1, product.stock))
	}, /* @__PURE__ */ h("svg", {
		className: "w-4 h-4",
		fill: "none",
		stroke: "currentColor",
		viewBox: "0 0 24 24"
	}, /* @__PURE__ */ h("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M12 4v16m8-8H4"
	}))))), /* @__PURE__ */ h("button", {
		id: "add-to-cart-btn",
		"data-product-id": "85067212996",
		className: "w-full bg-blue-600 text-white py-3 px-4 rounded-md \n                 hover:bg-blue-700 transition-colors font-medium",
		onClick: () => {
			setCart((prev) => {
				const existingCart = prev.find((cart) => cart.product.productId === product.productId);
				if (isNotNil(existingCart)) return prev.map((cart) => cart.product.productId === product.productId ? {
					...cart,
					quantity: cart.quantity + quantity
				} : cart);
				return [...prev, {
					product,
					quantity
				}];
			});
			showToast("success", "장바구니에 추가되었습니다");
		}
	}, "장바구니 담기"))), /* @__PURE__ */ h("div", { className: "mb-6" }, /* @__PURE__ */ h(Link, {
		to: "쇼핑몰",
		className: "block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md \n            hover:bg-gray-200 transition-colors go-to-product-list"
	}, "상품 목록으로 돌아가기")), /* @__PURE__ */ h("div", { className: "bg-white rounded-lg shadow-sm" }, /* @__PURE__ */ h("div", { className: "p-4 border-b border-gray-200" }, /* @__PURE__ */ h("h2", { className: "text-lg font-bold text-gray-900" }, "관련 상품"), /* @__PURE__ */ h("p", { className: "text-sm text-gray-600" }, "같은 카테고리의 다른 상품들")), /* @__PURE__ */ h("div", { className: "p-4" }, /* @__PURE__ */ h("div", { className: "grid grid-cols-2 gap-3 responsive-grid" }, relatedProducts.map((product$1) => /* @__PURE__ */ h(Link, {
		to: "상품 상세",
		pathParams: { id: product$1.productId }
	}, /* @__PURE__ */ h("div", {
		className: "bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer",
		"data-product-id": product$1.productId
	}, /* @__PURE__ */ h("div", { className: "aspect-square bg-white rounded-md overflow-hidden mb-2" }, /* @__PURE__ */ h("img", {
		src: product$1.image,
		alt: product$1.title,
		className: "w-full h-full object-cover",
		loading: "lazy"
	})), /* @__PURE__ */ h("h3", { className: "text-sm font-medium text-gray-900 mb-1 line-clamp-2" }, product$1.title), /* @__PURE__ */ h("p", { className: "text-sm font-bold text-blue-600" }, commaNumber(Number(product$1.lprice)), "원"))))))));
}
function ProductDetailPage() {
	const router = useRouter();
	const { id } = router.pathParams;
	return /* @__PURE__ */ h(Layout, null, /* @__PURE__ */ h(ProductDetail, { id }));
}
const routes = {
	쇼핑몰: {
		path: "/",
		component: ProductListPage
	},
	"상품 상세": {
		path: "/product/:id",
		component: ProductDetailPage
	}
};
const { Router, useRouter } = createRouter(routes);
function NotFound() {
	return /* @__PURE__ */ h("main", { className: "max-w-md mx-auto px-4 py-4" }, /* @__PURE__ */ h("div", { className: "text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg" }, /* @__PURE__ */ h("svg", {
		viewBox: "0 0 320 180",
		xmlns: "http://www.w3.org/2000/svg"
	}, /* @__PURE__ */ h("defs", null, /* @__PURE__ */ h("linearGradient", {
		id: "blueGradient",
		x1: "0%",
		y1: "0%",
		x2: "100%",
		y2: "100%"
	}, /* @__PURE__ */ h("stop", {
		offset: "0%",
		stopColor: "#4285f4",
		stopOpacity: 1
	}), /* @__PURE__ */ h("stop", {
		offset: "100%",
		stopColor: "#1a73e8",
		stopOpacity: 1
	})), /* @__PURE__ */ h("filter", {
		id: "softShadow",
		x: "-50%",
		y: "-50%",
		width: "200%",
		height: "200%"
	}, /* @__PURE__ */ h("feDropShadow", {
		dx: "0",
		dy: "2",
		stdDeviation: "8",
		floodColor: "#000000",
		floodOpacity: .1
	}))), /* @__PURE__ */ h("text", {
		x: "160",
		y: "85",
		fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		fontSize: "48",
		fontWeight: "600",
		fill: "url(#blueGradient)",
		textAnchor: "middle"
	}, "404"), /* @__PURE__ */ h("circle", {
		cx: "80",
		cy: "60",
		r: "3",
		fill: "#e8f0fe",
		opacity: "0.8"
	}), /* @__PURE__ */ h("circle", {
		cx: "240",
		cy: "60",
		r: "3",
		fill: "#e8f0fe",
		opacity: "0.8"
	}), /* @__PURE__ */ h("circle", {
		cx: "90",
		cy: "45",
		r: "2",
		fill: "#4285f4",
		opacity: "0.5"
	}), /* @__PURE__ */ h("circle", {
		cx: "230",
		cy: "45",
		r: "2",
		fill: "#4285f4",
		opacity: "0.5"
	}), /* @__PURE__ */ h("text", {
		x: "160",
		y: "110",
		fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		fontSize: "14",
		fontWeight: "400",
		fill: "#5f6368",
		textAnchor: "middle"
	}, "페이지를 찾을 수 없습니다"), /* @__PURE__ */ h("rect", {
		x: "130",
		y: "130",
		width: "60",
		height: "2",
		rx: "1",
		fill: "url(#blueGradient)",
		opacity: "0.3"
	})), /* @__PURE__ */ h("a", {
		href: "/",
		"data-link": true,
		className: "inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
	}, "홈으로")));
}
function ErrorPage({ error }) {
	return /* @__PURE__ */ h("main", { className: "max-w-md mx-auto px-4 py-4" }, /* @__PURE__ */ h("div", { className: "text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg" }, /* @__PURE__ */ h("h1", { className: "text-2xl font-bold" }, "오류가 발생했습니다!"), /* @__PURE__ */ h("p", { className: "text-gray-500" }, "Error: ", error instanceof Error ? error.message : String(error)), /* @__PURE__ */ h("button", {
		className: "bg-blue-500 p-3 rounded-md flex-shrink-0 text-white hover:text-gray-200",
		onClick: () => {
			window.location.reload();
		}
	}, "다시 시도")));
}
function main() {
	render(/* @__PURE__ */ h("div", { className: "flex flex-col h-screen w-full bg-gray-50" }, /* @__PURE__ */ h("div", { className: "flex-1" }, /* @__PURE__ */ h(Router, { fallback: {
		notFound: NotFound,
		error: ErrorPage
	} })), /* @__PURE__ */ h(ToastContainer, null), /* @__PURE__ */ h(OverlayContainer, null)));
}
const enableMocking = () => __vitePreload(async () => {
	const { worker } = await import("./browser-7aqCVGzQ.js");
	return { worker };
}, []).then(({ worker }) => worker.start({
	onUnhandledRequest: "bypass",
	serviceWorker: { url: `/front_7th_chapter2-1/mockServiceWorker.js` }
}));
enableMocking().then(main);
export { __require };
