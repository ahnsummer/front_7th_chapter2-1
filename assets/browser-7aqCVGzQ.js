var babelHelpers = function(exports) {
	function t(e, t, n) {
		if (typeof e == `function` ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
		throw TypeError(`Private element is not present on this object`);
	}
	function n(e, n, r) {
		return e.set(t(e, n), r), r;
	}
	function r(e) {
		"@babel/helpers - typeof";
		return r = typeof Symbol == `function` && typeof Symbol.iterator == `symbol` ? function(e) {
			return typeof e;
		} : function(e) {
			return e && typeof Symbol == `function` && e.constructor === Symbol && e !== Symbol.prototype ? `symbol` : typeof e;
		}, r(e);
	}
	function i(e, t) {
		if (r(e) != `object` || !e) return e;
		var n = e[Symbol.toPrimitive];
		if (n !== void 0) {
			var i = n.call(e, t || `default`);
			if (r(i) != `object`) return i;
			throw TypeError(`@@toPrimitive must return a primitive value.`);
		}
		return (t === `string` ? String : Number)(e);
	}
	function a(e) {
		var t = i(e, `string`);
		return r(t) == `symbol` ? t : t + ``;
	}
	function o(e, t, n) {
		return (t = a(t)) in e ? Object.defineProperty(e, t, {
			value: n,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[t] = n, e;
	}
	function s(e, t) {
		if (t.has(e)) throw TypeError(`Cannot initialize the same private elements twice on an object`);
	}
	function c(e, t, n) {
		s(e, t), t.set(e, n);
	}
	function l(e, t) {
		s(e, t), t.add(e);
	}
	function u(e, n) {
		return e.get(t(e, n));
	}
	return exports.assertClassBrand = t, exports.classPrivateFieldGet2 = u, exports.classPrivateFieldInitSpec = c, exports.classPrivateFieldSet2 = n, exports.classPrivateMethodInitSpec = l, exports.defineProperty = o, exports;
}({});
import { __require } from "./index-BVreo-Jp.js";
var _RequestHandler, _executor, _Class_brand, _executor2, _Class_brand2;
var POSITIONALS_EXP$1 = /(%?)(%([sdijo]))/g;
function serializePositional$1(positional, flag) {
	switch (flag) {
		case "s": return positional;
		case "d":
		case "i": return Number(positional);
		case "j": return JSON.stringify(positional);
		case "o": {
			if (typeof positional === "string") return positional;
			const json = JSON.stringify(positional);
			if (json === "{}" || json === "[]" || /^\[object .+?\]$/.test(json)) return positional;
			return json;
		}
	}
}
function format$1(message$2, ...positionals) {
	if (positionals.length === 0) return message$2;
	let positionalIndex = 0;
	let formattedMessage = message$2.replace(POSITIONALS_EXP$1, (match$1, isEscaped, _, flag) => {
		const positional = positionals[positionalIndex];
		const value = serializePositional$1(positional, flag);
		if (!isEscaped) {
			positionalIndex++;
			return value;
		}
		return match$1;
	});
	if (positionalIndex < positionals.length) formattedMessage += ` ${positionals.slice(positionalIndex).join(" ")}`;
	formattedMessage = formattedMessage.replace(/%{2,2}/g, "%");
	return formattedMessage;
}
var STACK_FRAMES_TO_IGNORE$1 = 2;
function cleanErrorStack$1(error$3) {
	if (!error$3.stack) return;
	const nextStack = error$3.stack.split("\n");
	nextStack.splice(1, STACK_FRAMES_TO_IGNORE$1);
	error$3.stack = nextStack.join("\n");
}
var InvariantError$1 = class extends Error {
	constructor(message$2, ...positionals) {
		super(message$2);
		this.message = message$2;
		this.name = "Invariant Violation";
		this.message = format$1(message$2, ...positionals);
		cleanErrorStack$1(this);
	}
};
var invariant$1 = (predicate, message$2, ...positionals) => {
	if (!predicate) throw new InvariantError$1(message$2, ...positionals);
};
invariant$1.as = (ErrorConstructor, predicate, message$2, ...positionals) => {
	if (!predicate) {
		const formatMessage$1 = positionals.length === 0 ? message$2 : format$1(message$2, ...positionals);
		let error$3;
		try {
			error$3 = Reflect.construct(ErrorConstructor, [formatMessage$1]);
		} catch (err) {
			error$3 = ErrorConstructor(formatMessage$1);
		}
		throw error$3;
	}
};
const LIBRARY_PREFIX = "[MSW]";
function formatMessage(message$2, ...positionals) {
	const interpolatedMessage = format$1(message$2, ...positionals);
	return `${LIBRARY_PREFIX} ${interpolatedMessage}`;
}
function warn$2(message$2, ...positionals) {
	console.warn(formatMessage(message$2, ...positionals));
}
function error$2(message$2, ...positionals) {
	console.error(formatMessage(message$2, ...positionals));
}
const devUtils = {
	formatMessage,
	warn: warn$2,
	error: error$2
};
var InternalError = class extends Error {
	constructor(message$2) {
		super(message$2);
		this.name = "InternalError";
	}
};
const SOURCE_FRAME = /[\/\\]msw[\/\\]src[\/\\](.+)/;
const BUILD_FRAME = /(node_modules)?[\/\\]lib[\/\\](core|browser|node|native|iife)[\/\\]|^[^\/\\]*$/;
function getCallFrame(error$3) {
	const stack = error$3.stack;
	if (!stack) return;
	const frames = stack.split("\n").slice(1);
	const declarationFrame = frames.find((frame) => {
		return !(SOURCE_FRAME.test(frame) || BUILD_FRAME.test(frame));
	});
	if (!declarationFrame) return;
	const declarationPath = declarationFrame.replace(/\s*at [^()]*\(([^)]+)\)/, "$1").replace(/^@/, "");
	return declarationPath;
}
function isIterable(fn) {
	if (!fn) return false;
	return Reflect.has(fn, Symbol.iterator) || Reflect.has(fn, Symbol.asyncIterator);
}
var RequestHandler = (_RequestHandler = class RequestHandler {
	constructor(args) {
		babelHelpers.defineProperty(this, "__kind", void 0);
		babelHelpers.defineProperty(this, "info", void 0);
		babelHelpers.defineProperty(
			this,
			/**
			* Indicates whether this request handler has been used
			* (its resolver has successfully executed).
			*/
			"isUsed",
			void 0
		);
		babelHelpers.defineProperty(this, "resolver", void 0);
		babelHelpers.defineProperty(this, "resolverIterator", void 0);
		babelHelpers.defineProperty(this, "resolverIteratorResult", void 0);
		babelHelpers.defineProperty(this, "options", void 0);
		this.resolver = args.resolver;
		this.options = args.options;
		const callFrame = getCallFrame(/* @__PURE__ */ new Error());
		this.info = {
			...args.info,
			callFrame
		};
		this.isUsed = false;
		this.__kind = "RequestHandler";
	}
	/**
	* Parse the intercepted request to extract additional information from it.
	* Parsed result is then exposed to other methods of this request handler.
	*/
	async parse(_args) {
		return {};
	}
	/**
	* Test if this handler matches the given request.
	*
	* This method is not used internally but is exposed
	* as a convenience method for consumers writing custom
	* handlers.
	*/
	async test(args) {
		const parsedResult = await this.parse({
			request: args.request,
			resolutionContext: args.resolutionContext
		});
		return this.predicate({
			request: args.request,
			parsedResult,
			resolutionContext: args.resolutionContext
		});
	}
	extendResolverArgs(_args) {
		return {};
	}
	cloneRequestOrGetFromCache(request) {
		const existingClone = RequestHandler.cache.get(request);
		if (typeof existingClone !== "undefined") return existingClone;
		const clonedRequest = request.clone();
		RequestHandler.cache.set(request, clonedRequest);
		return clonedRequest;
	}
	/**
	* Execute this request handler and produce a mocked response
	* using the given resolver function.
	*/
	async run(args) {
		var _this$options, _this$options2;
		if (this.isUsed && ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.once)) return null;
		const requestClone = this.cloneRequestOrGetFromCache(args.request);
		const parsedResult = await this.parse({
			request: args.request,
			resolutionContext: args.resolutionContext
		});
		const shouldInterceptRequest = this.predicate({
			request: args.request,
			parsedResult,
			resolutionContext: args.resolutionContext
		});
		if (!shouldInterceptRequest) return null;
		if (this.isUsed && ((_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.once)) return null;
		this.isUsed = true;
		const executeResolver = this.wrapResolver(this.resolver);
		const resolverExtras = this.extendResolverArgs({
			request: args.request,
			parsedResult
		});
		const mockedResponsePromise = executeResolver({
			...resolverExtras,
			requestId: args.requestId,
			request: args.request
		}).catch((errorOrResponse) => {
			if (errorOrResponse instanceof Response) return errorOrResponse;
			throw errorOrResponse;
		});
		const mockedResponse = await mockedResponsePromise;
		const executionResult = this.createExecutionResult({
			request: requestClone,
			requestId: args.requestId,
			response: mockedResponse,
			parsedResult
		});
		return executionResult;
	}
	wrapResolver(resolver) {
		return async (info) => {
			if (!this.resolverIterator) {
				const result = await resolver(info);
				if (!isIterable(result)) return result;
				this.resolverIterator = Symbol.iterator in result ? result[Symbol.iterator]() : result[Symbol.asyncIterator]();
			}
			this.isUsed = false;
			const { done, value } = await this.resolverIterator.next();
			const nextResponse = await value;
			if (nextResponse) this.resolverIteratorResult = nextResponse.clone();
			if (done) {
				var _this$resolverIterato;
				this.isUsed = true;
				return (_this$resolverIterato = this.resolverIteratorResult) === null || _this$resolverIterato === void 0 ? void 0 : _this$resolverIterato.clone();
			}
			return nextResponse;
		};
	}
	createExecutionResult(args) {
		return {
			handler: this,
			request: args.request,
			requestId: args.requestId,
			response: args.response,
			parsedResult: args.parsedResult
		};
	}
}, babelHelpers.defineProperty(_RequestHandler, "cache", /* @__PURE__ */ new WeakMap()), _RequestHandler);
var until$1 = async (promise) => {
	try {
		const data = await promise().catch((error$3) => {
			throw error$3;
		});
		return {
			error: null,
			data
		};
	} catch (error$3) {
		return {
			error: error$3,
			data: null
		};
	}
};
const executeHandlers = async ({ request, requestId, handlers: handlers$1, resolutionContext }) => {
	let matchingHandler = null;
	let result = null;
	for (const handler of handlers$1) {
		result = await handler.run({
			request,
			requestId,
			resolutionContext
		});
		if (result !== null) matchingHandler = handler;
		if (result === null || result === void 0 ? void 0 : result.response) break;
	}
	if (matchingHandler) return {
		handler: matchingHandler,
		parsedResult: result === null || result === void 0 ? void 0 : result.parsedResult,
		response: result === null || result === void 0 ? void 0 : result.response
	};
	return null;
};
function toPublicUrl(url) {
	if (typeof location === "undefined") return url.toString();
	const urlInstance = url instanceof URL ? url : new URL(url);
	return urlInstance.origin === location.origin ? urlInstance.pathname : urlInstance.origin + urlInstance.pathname;
}
function isCommonAssetRequest(request) {
	const url = new URL(request.url);
	if (url.protocol === "file:") return true;
	if (/(fonts\.googleapis\.com)/.test(url.hostname)) return true;
	if (/node_modules/.test(url.pathname)) return true;
	if (url.pathname.includes("@vite")) return true;
	return /\.(s?css|less|m?jsx?|m?tsx?|html|ttf|otf|woff|woff2|eot|gif|jpe?g|png|avif|webp|svg|mp4|webm|ogg|mov|mp3|wav|ogg|flac|aac|pdf|txt|csv|json|xml|md|zip|tar|gz|rar|7z)$/i.test(url.pathname);
}
async function onUnhandledRequest(request, strategy = "warn") {
	const url = new URL(request.url);
	const publicUrl = toPublicUrl(url) + url.search;
	const requestBody = request.method === "HEAD" || request.method === "GET" ? null : await request.clone().text();
	const messageDetails = `

  \u2022 ${request.method} ${publicUrl}

${requestBody ? `  \u2022 Request body: ${requestBody}

` : ""}`;
	const unhandledRequestMessage = `intercepted a request without a matching request handler:${messageDetails}If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/http/intercepting-requests`;
	function applyStrategy(strategy2) {
		switch (strategy2) {
			case "error": {
				devUtils.error("Error: %s", unhandledRequestMessage);
				throw new InternalError(devUtils.formatMessage("Cannot bypass a request when using the \"error\" strategy for the \"onUnhandledRequest\" option."));
			}
			case "warn": {
				devUtils.warn("Warning: %s", unhandledRequestMessage);
				break;
			}
			case "bypass": break;
			default: throw new InternalError(devUtils.formatMessage("Failed to react to an unhandled request: unknown strategy \"%s\". Please provide one of the supported strategies (\"bypass\", \"warn\", \"error\") or a custom callback function as the value of the \"onUnhandledRequest\" option.", strategy2));
		}
	}
	if (typeof strategy === "function") {
		strategy(request, {
			warning: applyStrategy.bind(null, "warn"),
			error: applyStrategy.bind(null, "error")
		});
		return;
	}
	if (!isCommonAssetRequest(request)) applyStrategy(strategy);
}
function isNodeProcess$1() {
	if (typeof navigator !== "undefined" && navigator.product === "ReactNative") return true;
	if (typeof process !== "undefined") {
		const type = process.type;
		if (type === "renderer" || type === "worker") return false;
		return !!(process.versions && process.versions.node);
	}
	return false;
}
var __create$3 = Object.create;
var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$3 = Object.getOwnPropertyNames;
var __getProtoOf$3 = Object.getPrototypeOf;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __require$1 = /* @__PURE__ */ ((x) => typeof __require !== "undefined" ? __require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof __require !== "undefined" ? __require : a)[b] }) : x)(function(x) {
	if (typeof __require !== "undefined") return __require.apply(this, arguments);
	throw Error("Dynamic require of \"" + x + "\" is not supported");
});
var __commonJS$3 = (cb, mod) => function __require2() {
	return mod || (0, cb[__getOwnPropNames$3(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps$3 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$3(from)) if (!__hasOwnProp$3.call(to, key) && key !== except) __defProp$5(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$3(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM$3 = (mod, isNodeMode, target) => (target = mod != null ? __create$3(__getProtoOf$3(mod)) : {}, __copyProps$3(isNodeMode || !mod || !mod.__esModule ? __defProp$5(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var require_punycode = __commonJS$3({ "node_modules/punycode/punycode.js"(exports, module) {
	"use strict";
	var maxInt = 2147483647;
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128;
	var delimiter = "-";
	var regexPunycode = /^xn--/;
	var regexNonASCII = /[^\0-\x7F]/;
	var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
	var errors = {
		"overflow": "Overflow: input needs wider integers to process",
		"not-basic": "Illegal input >= 0x80 (not a basic code point)",
		"invalid-input": "Invalid input"
	};
	var baseMinusTMin = base - tMin;
	var floor = Math.floor;
	var stringFromCharCode = String.fromCharCode;
	function error$3(type) {
		throw new RangeError(errors[type]);
	}
	function map(array, callback) {
		const result = [];
		let length = array.length;
		while (length--) result[length] = callback(array[length]);
		return result;
	}
	function mapDomain(domain, callback) {
		const parts = domain.split("@");
		let result = "";
		if (parts.length > 1) {
			result = parts[0] + "@";
			domain = parts[1];
		}
		domain = domain.replace(regexSeparators, ".");
		const labels = domain.split(".");
		const encoded = map(labels, callback).join(".");
		return result + encoded;
	}
	function ucs2decode(string) {
		const output = [];
		let counter = 0;
		const length = string.length;
		while (counter < length) {
			const value = string.charCodeAt(counter++);
			if (value >= 55296 && value <= 56319 && counter < length) {
				const extra = string.charCodeAt(counter++);
				if ((extra & 64512) == 56320) output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
				else {
					output.push(value);
					counter--;
				}
			} else output.push(value);
		}
		return output;
	}
	var ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
	var basicToDigit = function(codePoint) {
		if (codePoint >= 48 && codePoint < 58) return 26 + (codePoint - 48);
		if (codePoint >= 65 && codePoint < 91) return codePoint - 65;
		if (codePoint >= 97 && codePoint < 123) return codePoint - 97;
		return base;
	};
	var digitToBasic = function(digit, flag) {
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	};
	var adapt = function(delta, numPoints, firstTime) {
		let k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (; delta > baseMinusTMin * tMax >> 1; k += base) delta = floor(delta / baseMinusTMin);
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};
	var decode = function(input) {
		const output = [];
		const inputLength = input.length;
		let i = 0;
		let n = initialN;
		let bias = initialBias;
		let basic = input.lastIndexOf(delimiter);
		if (basic < 0) basic = 0;
		for (let j = 0; j < basic; ++j) {
			if (input.charCodeAt(j) >= 128) error$3("not-basic");
			output.push(input.charCodeAt(j));
		}
		for (let index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
			const oldi = i;
			for (let w = 1, k = base;; k += base) {
				if (index >= inputLength) error$3("invalid-input");
				const digit = basicToDigit(input.charCodeAt(index++));
				if (digit >= base) error$3("invalid-input");
				if (digit > floor((maxInt - i) / w)) error$3("overflow");
				i += digit * w;
				const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
				if (digit < t) break;
				const baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) error$3("overflow");
				w *= baseMinusT;
			}
			const out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);
			if (floor(i / out) > maxInt - n) error$3("overflow");
			n += floor(i / out);
			i %= out;
			output.splice(i++, 0, n);
		}
		return String.fromCodePoint(...output);
	};
	var encode = function(input) {
		const output = [];
		input = ucs2decode(input);
		const inputLength = input.length;
		let n = initialN;
		let delta = 0;
		let bias = initialBias;
		for (const currentValue of input) if (currentValue < 128) output.push(stringFromCharCode(currentValue));
		const basicLength = output.length;
		let handledCPCount = basicLength;
		if (basicLength) output.push(delimiter);
		while (handledCPCount < inputLength) {
			let m = maxInt;
			for (const currentValue of input) if (currentValue >= n && currentValue < m) m = currentValue;
			const handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) error$3("overflow");
			delta += (m - n) * handledCPCountPlusOne;
			n = m;
			for (const currentValue of input) {
				if (currentValue < n && ++delta > maxInt) error$3("overflow");
				if (currentValue === n) {
					let q = delta;
					for (let k = base;; k += base) {
						const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) break;
						const qMinusT = q - t;
						const baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor(qMinusT / baseMinusT);
					}
					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
					delta = 0;
					++handledCPCount;
				}
			}
			++delta;
			++n;
		}
		return output.join("");
	};
	var toUnicode = function(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
		});
	};
	var toASCII = function(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
		});
	};
	var punycode = {
		"version": "2.3.1",
		"ucs2": {
			"decode": ucs2decode,
			"encode": ucs2encode
		},
		"decode": decode,
		"encode": encode,
		"toASCII": toASCII,
		"toUnicode": toUnicode
	};
	module.exports = punycode;
} });
var require_requires_port = __commonJS$3({ "node_modules/requires-port/index.js"(exports, module) {
	"use strict";
	module.exports = function required(port, protocol) {
		protocol = protocol.split(":")[0];
		port = +port;
		if (!port) return false;
		switch (protocol) {
			case "http":
			case "ws": return port !== 80;
			case "https":
			case "wss": return port !== 443;
			case "ftp": return port !== 21;
			case "gopher": return port !== 70;
			case "file": return false;
		}
		return port !== 0;
	};
} });
var require_querystringify = __commonJS$3({ "node_modules/querystringify/index.js"(exports) {
	"use strict";
	var has = Object.prototype.hasOwnProperty;
	var undef;
	function decode(input) {
		try {
			return decodeURIComponent(input.replace(/\+/g, " "));
		} catch (e) {
			return null;
		}
	}
	function encode(input) {
		try {
			return encodeURIComponent(input);
		} catch (e) {
			return null;
		}
	}
	function querystring(query) {
		var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
		while (part = parser.exec(query)) {
			var key = decode(part[1]), value = decode(part[2]);
			if (key === null || value === null || key in result) continue;
			result[key] = value;
		}
		return result;
	}
	function querystringify(obj, prefix) {
		prefix = prefix || "";
		var pairs = [], value, key;
		if ("string" !== typeof prefix) prefix = "?";
		for (key in obj) if (has.call(obj, key)) {
			value = obj[key];
			if (!value && (value === null || value === undef || isNaN(value))) value = "";
			key = encode(key);
			value = encode(value);
			if (key === null || value === null) continue;
			pairs.push(key + "=" + value);
		}
		return pairs.length ? prefix + pairs.join("&") : "";
	}
	exports.stringify = querystringify;
	exports.parse = querystring;
} });
var require_url_parse = __commonJS$3({ "node_modules/url-parse/index.js"(exports, module) {
	"use strict";
	var required = require_requires_port();
	var qs = require_querystringify();
	var controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
	var CRHTLF = /[\n\r\t]/g;
	var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;
	var port = /:\d+$/;
	var protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i;
	var windowsDriveLetter = /^[a-zA-Z]:/;
	function trimLeft(str) {
		return (str ? str : "").toString().replace(controlOrWhitespace, "");
	}
	var rules = [
		["#", "hash"],
		["?", "query"],
		function sanitize(address, url) {
			return isSpecial(url.protocol) ? address.replace(/\\/g, "/") : address;
		},
		["/", "pathname"],
		[
			"@",
			"auth",
			1
		],
		[
			NaN,
			"host",
			void 0,
			1,
			1
		],
		[
			/:(\d*)$/,
			"port",
			void 0,
			1
		],
		[
			NaN,
			"hostname",
			void 0,
			1,
			1
		]
	];
	var ignore = {
		hash: 1,
		query: 1
	};
	function lolcation(loc) {
		var globalVar;
		if (typeof window !== "undefined") globalVar = window;
		else if (typeof global !== "undefined") globalVar = global;
		else if (typeof self !== "undefined") globalVar = self;
		else globalVar = {};
		var location$1 = globalVar.location || {};
		loc = loc || location$1;
		var finaldestination = {}, type = typeof loc, key;
		if ("blob:" === loc.protocol) finaldestination = new Url(unescape(loc.pathname), {});
		else if ("string" === type) {
			finaldestination = new Url(loc, {});
			for (key in ignore) delete finaldestination[key];
		} else if ("object" === type) {
			for (key in loc) {
				if (key in ignore) continue;
				finaldestination[key] = loc[key];
			}
			if (finaldestination.slashes === void 0) finaldestination.slashes = slashes.test(loc.href);
		}
		return finaldestination;
	}
	function isSpecial(scheme) {
		return scheme === "file:" || scheme === "ftp:" || scheme === "http:" || scheme === "https:" || scheme === "ws:" || scheme === "wss:";
	}
	function extractProtocol(address, location$1) {
		address = trimLeft(address);
		address = address.replace(CRHTLF, "");
		location$1 = location$1 || {};
		var match$1 = protocolre.exec(address);
		var protocol = match$1[1] ? match$1[1].toLowerCase() : "";
		var forwardSlashes = !!match$1[2];
		var otherSlashes = !!match$1[3];
		var slashesCount = 0;
		var rest;
		if (forwardSlashes) if (otherSlashes) {
			rest = match$1[2] + match$1[3] + match$1[4];
			slashesCount = match$1[2].length + match$1[3].length;
		} else {
			rest = match$1[2] + match$1[4];
			slashesCount = match$1[2].length;
		}
		else if (otherSlashes) {
			rest = match$1[3] + match$1[4];
			slashesCount = match$1[3].length;
		} else rest = match$1[4];
		if (protocol === "file:") {
			if (slashesCount >= 2) rest = rest.slice(2);
		} else if (isSpecial(protocol)) rest = match$1[4];
		else if (protocol) {
			if (forwardSlashes) rest = rest.slice(2);
		} else if (slashesCount >= 2 && isSpecial(location$1.protocol)) rest = match$1[4];
		return {
			protocol,
			slashes: forwardSlashes || isSpecial(protocol),
			slashesCount,
			rest
		};
	}
	function resolve(relative, base) {
		if (relative === "") return base;
		var path = (base || "/").split("/").slice(0, -1).concat(relative.split("/")), i = path.length, last = path[i - 1], unshift = false, up = 0;
		while (i--) if (path[i] === ".") path.splice(i, 1);
		else if (path[i] === "..") {
			path.splice(i, 1);
			up++;
		} else if (up) {
			if (i === 0) unshift = true;
			path.splice(i, 1);
			up--;
		}
		if (unshift) path.unshift("");
		if (last === "." || last === "..") path.push("");
		return path.join("/");
	}
	function Url(address, location$1, parser) {
		address = trimLeft(address);
		address = address.replace(CRHTLF, "");
		if (!(this instanceof Url)) return new Url(address, location$1, parser);
		var relative, extracted, parse$1, instruction, index, key, instructions = rules.slice(), type = typeof location$1, url = this, i = 0;
		if ("object" !== type && "string" !== type) {
			parser = location$1;
			location$1 = null;
		}
		if (parser && "function" !== typeof parser) parser = qs.parse;
		location$1 = lolcation(location$1);
		extracted = extractProtocol(address || "", location$1);
		relative = !extracted.protocol && !extracted.slashes;
		url.slashes = extracted.slashes || relative && location$1.slashes;
		url.protocol = extracted.protocol || location$1.protocol || "";
		address = extracted.rest;
		if (extracted.protocol === "file:" && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) instructions[3] = [/(.*)/, "pathname"];
		for (; i < instructions.length; i++) {
			instruction = instructions[i];
			if (typeof instruction === "function") {
				address = instruction(address, url);
				continue;
			}
			parse$1 = instruction[0];
			key = instruction[1];
			if (parse$1 !== parse$1) url[key] = address;
			else if ("string" === typeof parse$1) {
				index = parse$1 === "@" ? address.lastIndexOf(parse$1) : address.indexOf(parse$1);
				if (~index) if ("number" === typeof instruction[2]) {
					url[key] = address.slice(0, index);
					address = address.slice(index + instruction[2]);
				} else {
					url[key] = address.slice(index);
					address = address.slice(0, index);
				}
			} else if (index = parse$1.exec(address)) {
				url[key] = index[1];
				address = address.slice(0, index.index);
			}
			url[key] = url[key] || (relative && instruction[3] ? location$1[key] || "" : "");
			if (instruction[4]) url[key] = url[key].toLowerCase();
		}
		if (parser) url.query = parser(url.query);
		if (relative && location$1.slashes && url.pathname.charAt(0) !== "/" && (url.pathname !== "" || location$1.pathname !== "")) url.pathname = resolve(url.pathname, location$1.pathname);
		if (url.pathname.charAt(0) !== "/" && isSpecial(url.protocol)) url.pathname = "/" + url.pathname;
		if (!required(url.port, url.protocol)) {
			url.host = url.hostname;
			url.port = "";
		}
		url.username = url.password = "";
		if (url.auth) {
			index = url.auth.indexOf(":");
			if (~index) {
				url.username = url.auth.slice(0, index);
				url.username = encodeURIComponent(decodeURIComponent(url.username));
				url.password = url.auth.slice(index + 1);
				url.password = encodeURIComponent(decodeURIComponent(url.password));
			} else url.username = encodeURIComponent(decodeURIComponent(url.auth));
			url.auth = url.password ? url.username + ":" + url.password : url.username;
		}
		url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
		url.href = url.toString();
	}
	function set(part, value, fn) {
		var url = this;
		switch (part) {
			case "query":
				if ("string" === typeof value && value.length) value = (fn || qs.parse)(value);
				url[part] = value;
				break;
			case "port":
				url[part] = value;
				if (!required(value, url.protocol)) {
					url.host = url.hostname;
					url[part] = "";
				} else if (value) url.host = url.hostname + ":" + value;
				break;
			case "hostname":
				url[part] = value;
				if (url.port) value += ":" + url.port;
				url.host = value;
				break;
			case "host":
				url[part] = value;
				if (port.test(value)) {
					value = value.split(":");
					url.port = value.pop();
					url.hostname = value.join(":");
				} else {
					url.hostname = value;
					url.port = "";
				}
				break;
			case "protocol":
				url.protocol = value.toLowerCase();
				url.slashes = !fn;
				break;
			case "pathname":
			case "hash":
				if (value) {
					var char = part === "pathname" ? "/" : "#";
					url[part] = value.charAt(0) !== char ? char + value : value;
				} else url[part] = value;
				break;
			case "username":
			case "password":
				url[part] = encodeURIComponent(value);
				break;
			case "auth":
				var index = value.indexOf(":");
				if (~index) {
					url.username = value.slice(0, index);
					url.username = encodeURIComponent(decodeURIComponent(url.username));
					url.password = value.slice(index + 1);
					url.password = encodeURIComponent(decodeURIComponent(url.password));
				} else url.username = encodeURIComponent(decodeURIComponent(value));
		}
		for (var i = 0; i < rules.length; i++) {
			var ins = rules[i];
			if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
		}
		url.auth = url.password ? url.username + ":" + url.password : url.username;
		url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
		url.href = url.toString();
		return url;
	}
	function toString(stringify) {
		if (!stringify || "function" !== typeof stringify) stringify = qs.stringify;
		var query, url = this, host = url.host, protocol = url.protocol;
		if (protocol && protocol.charAt(protocol.length - 1) !== ":") protocol += ":";
		var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? "//" : "");
		if (url.username) {
			result += url.username;
			if (url.password) result += ":" + url.password;
			result += "@";
		} else if (url.password) {
			result += ":" + url.password;
			result += "@";
		} else if (url.protocol !== "file:" && isSpecial(url.protocol) && !host && url.pathname !== "/") result += "@";
		if (host[host.length - 1] === ":" || port.test(url.hostname) && !url.port) host += ":";
		result += host + url.pathname;
		query = "object" === typeof url.query ? stringify(url.query) : url.query;
		if (query) result += "?" !== query.charAt(0) ? "?" + query : query;
		if (url.hash) result += url.hash;
		return result;
	}
	Url.prototype = {
		set,
		toString
	};
	Url.extractProtocol = extractProtocol;
	Url.location = lolcation;
	Url.trimLeft = trimLeft;
	Url.qs = qs;
	module.exports = Url;
} });
var require_rules = __commonJS$3({ "node_modules/psl/data/rules.json"(exports, module) {
	module.exports = [
		"ac",
		"com.ac",
		"edu.ac",
		"gov.ac",
		"net.ac",
		"mil.ac",
		"org.ac",
		"ad",
		"nom.ad",
		"ae",
		"co.ae",
		"net.ae",
		"org.ae",
		"sch.ae",
		"ac.ae",
		"gov.ae",
		"mil.ae",
		"aero",
		"accident-investigation.aero",
		"accident-prevention.aero",
		"aerobatic.aero",
		"aeroclub.aero",
		"aerodrome.aero",
		"agents.aero",
		"aircraft.aero",
		"airline.aero",
		"airport.aero",
		"air-surveillance.aero",
		"airtraffic.aero",
		"air-traffic-control.aero",
		"ambulance.aero",
		"amusement.aero",
		"association.aero",
		"author.aero",
		"ballooning.aero",
		"broker.aero",
		"caa.aero",
		"cargo.aero",
		"catering.aero",
		"certification.aero",
		"championship.aero",
		"charter.aero",
		"civilaviation.aero",
		"club.aero",
		"conference.aero",
		"consultant.aero",
		"consulting.aero",
		"control.aero",
		"council.aero",
		"crew.aero",
		"design.aero",
		"dgca.aero",
		"educator.aero",
		"emergency.aero",
		"engine.aero",
		"engineer.aero",
		"entertainment.aero",
		"equipment.aero",
		"exchange.aero",
		"express.aero",
		"federation.aero",
		"flight.aero",
		"fuel.aero",
		"gliding.aero",
		"government.aero",
		"groundhandling.aero",
		"group.aero",
		"hanggliding.aero",
		"homebuilt.aero",
		"insurance.aero",
		"journal.aero",
		"journalist.aero",
		"leasing.aero",
		"logistics.aero",
		"magazine.aero",
		"maintenance.aero",
		"media.aero",
		"microlight.aero",
		"modelling.aero",
		"navigation.aero",
		"parachuting.aero",
		"paragliding.aero",
		"passenger-association.aero",
		"pilot.aero",
		"press.aero",
		"production.aero",
		"recreation.aero",
		"repbody.aero",
		"res.aero",
		"research.aero",
		"rotorcraft.aero",
		"safety.aero",
		"scientist.aero",
		"services.aero",
		"show.aero",
		"skydiving.aero",
		"software.aero",
		"student.aero",
		"trader.aero",
		"trading.aero",
		"trainer.aero",
		"union.aero",
		"workinggroup.aero",
		"works.aero",
		"af",
		"gov.af",
		"com.af",
		"org.af",
		"net.af",
		"edu.af",
		"ag",
		"com.ag",
		"org.ag",
		"net.ag",
		"co.ag",
		"nom.ag",
		"ai",
		"off.ai",
		"com.ai",
		"net.ai",
		"org.ai",
		"al",
		"com.al",
		"edu.al",
		"gov.al",
		"mil.al",
		"net.al",
		"org.al",
		"am",
		"co.am",
		"com.am",
		"commune.am",
		"net.am",
		"org.am",
		"ao",
		"ed.ao",
		"gv.ao",
		"og.ao",
		"co.ao",
		"pb.ao",
		"it.ao",
		"aq",
		"ar",
		"bet.ar",
		"com.ar",
		"coop.ar",
		"edu.ar",
		"gob.ar",
		"gov.ar",
		"int.ar",
		"mil.ar",
		"musica.ar",
		"mutual.ar",
		"net.ar",
		"org.ar",
		"senasa.ar",
		"tur.ar",
		"arpa",
		"e164.arpa",
		"in-addr.arpa",
		"ip6.arpa",
		"iris.arpa",
		"uri.arpa",
		"urn.arpa",
		"as",
		"gov.as",
		"asia",
		"at",
		"ac.at",
		"co.at",
		"gv.at",
		"or.at",
		"sth.ac.at",
		"au",
		"com.au",
		"net.au",
		"org.au",
		"edu.au",
		"gov.au",
		"asn.au",
		"id.au",
		"info.au",
		"conf.au",
		"oz.au",
		"act.au",
		"nsw.au",
		"nt.au",
		"qld.au",
		"sa.au",
		"tas.au",
		"vic.au",
		"wa.au",
		"act.edu.au",
		"catholic.edu.au",
		"nsw.edu.au",
		"nt.edu.au",
		"qld.edu.au",
		"sa.edu.au",
		"tas.edu.au",
		"vic.edu.au",
		"wa.edu.au",
		"qld.gov.au",
		"sa.gov.au",
		"tas.gov.au",
		"vic.gov.au",
		"wa.gov.au",
		"schools.nsw.edu.au",
		"aw",
		"com.aw",
		"ax",
		"az",
		"com.az",
		"net.az",
		"int.az",
		"gov.az",
		"org.az",
		"edu.az",
		"info.az",
		"pp.az",
		"mil.az",
		"name.az",
		"pro.az",
		"biz.az",
		"ba",
		"com.ba",
		"edu.ba",
		"gov.ba",
		"mil.ba",
		"net.ba",
		"org.ba",
		"bb",
		"biz.bb",
		"co.bb",
		"com.bb",
		"edu.bb",
		"gov.bb",
		"info.bb",
		"net.bb",
		"org.bb",
		"store.bb",
		"tv.bb",
		"*.bd",
		"be",
		"ac.be",
		"bf",
		"gov.bf",
		"bg",
		"a.bg",
		"b.bg",
		"c.bg",
		"d.bg",
		"e.bg",
		"f.bg",
		"g.bg",
		"h.bg",
		"i.bg",
		"j.bg",
		"k.bg",
		"l.bg",
		"m.bg",
		"n.bg",
		"o.bg",
		"p.bg",
		"q.bg",
		"r.bg",
		"s.bg",
		"t.bg",
		"u.bg",
		"v.bg",
		"w.bg",
		"x.bg",
		"y.bg",
		"z.bg",
		"0.bg",
		"1.bg",
		"2.bg",
		"3.bg",
		"4.bg",
		"5.bg",
		"6.bg",
		"7.bg",
		"8.bg",
		"9.bg",
		"bh",
		"com.bh",
		"edu.bh",
		"net.bh",
		"org.bh",
		"gov.bh",
		"bi",
		"co.bi",
		"com.bi",
		"edu.bi",
		"or.bi",
		"org.bi",
		"biz",
		"bj",
		"asso.bj",
		"barreau.bj",
		"gouv.bj",
		"bm",
		"com.bm",
		"edu.bm",
		"gov.bm",
		"net.bm",
		"org.bm",
		"bn",
		"com.bn",
		"edu.bn",
		"gov.bn",
		"net.bn",
		"org.bn",
		"bo",
		"com.bo",
		"edu.bo",
		"gob.bo",
		"int.bo",
		"org.bo",
		"net.bo",
		"mil.bo",
		"tv.bo",
		"web.bo",
		"academia.bo",
		"agro.bo",
		"arte.bo",
		"blog.bo",
		"bolivia.bo",
		"ciencia.bo",
		"cooperativa.bo",
		"democracia.bo",
		"deporte.bo",
		"ecologia.bo",
		"economia.bo",
		"empresa.bo",
		"indigena.bo",
		"industria.bo",
		"info.bo",
		"medicina.bo",
		"movimiento.bo",
		"musica.bo",
		"natural.bo",
		"nombre.bo",
		"noticias.bo",
		"patria.bo",
		"politica.bo",
		"profesional.bo",
		"plurinacional.bo",
		"pueblo.bo",
		"revista.bo",
		"salud.bo",
		"tecnologia.bo",
		"tksat.bo",
		"transporte.bo",
		"wiki.bo",
		"br",
		"9guacu.br",
		"abc.br",
		"adm.br",
		"adv.br",
		"agr.br",
		"aju.br",
		"am.br",
		"anani.br",
		"aparecida.br",
		"app.br",
		"arq.br",
		"art.br",
		"ato.br",
		"b.br",
		"barueri.br",
		"belem.br",
		"bhz.br",
		"bib.br",
		"bio.br",
		"blog.br",
		"bmd.br",
		"boavista.br",
		"bsb.br",
		"campinagrande.br",
		"campinas.br",
		"caxias.br",
		"cim.br",
		"cng.br",
		"cnt.br",
		"com.br",
		"contagem.br",
		"coop.br",
		"coz.br",
		"cri.br",
		"cuiaba.br",
		"curitiba.br",
		"def.br",
		"des.br",
		"det.br",
		"dev.br",
		"ecn.br",
		"eco.br",
		"edu.br",
		"emp.br",
		"enf.br",
		"eng.br",
		"esp.br",
		"etc.br",
		"eti.br",
		"far.br",
		"feira.br",
		"flog.br",
		"floripa.br",
		"fm.br",
		"fnd.br",
		"fortal.br",
		"fot.br",
		"foz.br",
		"fst.br",
		"g12.br",
		"geo.br",
		"ggf.br",
		"goiania.br",
		"gov.br",
		"ac.gov.br",
		"al.gov.br",
		"am.gov.br",
		"ap.gov.br",
		"ba.gov.br",
		"ce.gov.br",
		"df.gov.br",
		"es.gov.br",
		"go.gov.br",
		"ma.gov.br",
		"mg.gov.br",
		"ms.gov.br",
		"mt.gov.br",
		"pa.gov.br",
		"pb.gov.br",
		"pe.gov.br",
		"pi.gov.br",
		"pr.gov.br",
		"rj.gov.br",
		"rn.gov.br",
		"ro.gov.br",
		"rr.gov.br",
		"rs.gov.br",
		"sc.gov.br",
		"se.gov.br",
		"sp.gov.br",
		"to.gov.br",
		"gru.br",
		"imb.br",
		"ind.br",
		"inf.br",
		"jab.br",
		"jampa.br",
		"jdf.br",
		"joinville.br",
		"jor.br",
		"jus.br",
		"leg.br",
		"lel.br",
		"log.br",
		"londrina.br",
		"macapa.br",
		"maceio.br",
		"manaus.br",
		"maringa.br",
		"mat.br",
		"med.br",
		"mil.br",
		"morena.br",
		"mp.br",
		"mus.br",
		"natal.br",
		"net.br",
		"niteroi.br",
		"*.nom.br",
		"not.br",
		"ntr.br",
		"odo.br",
		"ong.br",
		"org.br",
		"osasco.br",
		"palmas.br",
		"poa.br",
		"ppg.br",
		"pro.br",
		"psc.br",
		"psi.br",
		"pvh.br",
		"qsl.br",
		"radio.br",
		"rec.br",
		"recife.br",
		"rep.br",
		"ribeirao.br",
		"rio.br",
		"riobranco.br",
		"riopreto.br",
		"salvador.br",
		"sampa.br",
		"santamaria.br",
		"santoandre.br",
		"saobernardo.br",
		"saogonca.br",
		"seg.br",
		"sjc.br",
		"slg.br",
		"slz.br",
		"sorocaba.br",
		"srv.br",
		"taxi.br",
		"tc.br",
		"tec.br",
		"teo.br",
		"the.br",
		"tmp.br",
		"trd.br",
		"tur.br",
		"tv.br",
		"udi.br",
		"vet.br",
		"vix.br",
		"vlog.br",
		"wiki.br",
		"zlg.br",
		"bs",
		"com.bs",
		"net.bs",
		"org.bs",
		"edu.bs",
		"gov.bs",
		"bt",
		"com.bt",
		"edu.bt",
		"gov.bt",
		"net.bt",
		"org.bt",
		"bv",
		"bw",
		"co.bw",
		"org.bw",
		"by",
		"gov.by",
		"mil.by",
		"com.by",
		"of.by",
		"bz",
		"com.bz",
		"net.bz",
		"org.bz",
		"edu.bz",
		"gov.bz",
		"ca",
		"ab.ca",
		"bc.ca",
		"mb.ca",
		"nb.ca",
		"nf.ca",
		"nl.ca",
		"ns.ca",
		"nt.ca",
		"nu.ca",
		"on.ca",
		"pe.ca",
		"qc.ca",
		"sk.ca",
		"yk.ca",
		"gc.ca",
		"cat",
		"cc",
		"cd",
		"gov.cd",
		"cf",
		"cg",
		"ch",
		"ci",
		"org.ci",
		"or.ci",
		"com.ci",
		"co.ci",
		"edu.ci",
		"ed.ci",
		"ac.ci",
		"net.ci",
		"go.ci",
		"asso.ci",
		"aéroport.ci",
		"int.ci",
		"presse.ci",
		"md.ci",
		"gouv.ci",
		"*.ck",
		"!www.ck",
		"cl",
		"co.cl",
		"gob.cl",
		"gov.cl",
		"mil.cl",
		"cm",
		"co.cm",
		"com.cm",
		"gov.cm",
		"net.cm",
		"cn",
		"ac.cn",
		"com.cn",
		"edu.cn",
		"gov.cn",
		"net.cn",
		"org.cn",
		"mil.cn",
		"公司.cn",
		"网络.cn",
		"網絡.cn",
		"ah.cn",
		"bj.cn",
		"cq.cn",
		"fj.cn",
		"gd.cn",
		"gs.cn",
		"gz.cn",
		"gx.cn",
		"ha.cn",
		"hb.cn",
		"he.cn",
		"hi.cn",
		"hl.cn",
		"hn.cn",
		"jl.cn",
		"js.cn",
		"jx.cn",
		"ln.cn",
		"nm.cn",
		"nx.cn",
		"qh.cn",
		"sc.cn",
		"sd.cn",
		"sh.cn",
		"sn.cn",
		"sx.cn",
		"tj.cn",
		"xj.cn",
		"xz.cn",
		"yn.cn",
		"zj.cn",
		"hk.cn",
		"mo.cn",
		"tw.cn",
		"co",
		"arts.co",
		"com.co",
		"edu.co",
		"firm.co",
		"gov.co",
		"info.co",
		"int.co",
		"mil.co",
		"net.co",
		"nom.co",
		"org.co",
		"rec.co",
		"web.co",
		"com",
		"coop",
		"cr",
		"ac.cr",
		"co.cr",
		"ed.cr",
		"fi.cr",
		"go.cr",
		"or.cr",
		"sa.cr",
		"cu",
		"com.cu",
		"edu.cu",
		"org.cu",
		"net.cu",
		"gov.cu",
		"inf.cu",
		"cv",
		"com.cv",
		"edu.cv",
		"int.cv",
		"nome.cv",
		"org.cv",
		"cw",
		"com.cw",
		"edu.cw",
		"net.cw",
		"org.cw",
		"cx",
		"gov.cx",
		"cy",
		"ac.cy",
		"biz.cy",
		"com.cy",
		"ekloges.cy",
		"gov.cy",
		"ltd.cy",
		"mil.cy",
		"net.cy",
		"org.cy",
		"press.cy",
		"pro.cy",
		"tm.cy",
		"cz",
		"de",
		"dj",
		"dk",
		"dm",
		"com.dm",
		"net.dm",
		"org.dm",
		"edu.dm",
		"gov.dm",
		"do",
		"art.do",
		"com.do",
		"edu.do",
		"gob.do",
		"gov.do",
		"mil.do",
		"net.do",
		"org.do",
		"sld.do",
		"web.do",
		"dz",
		"art.dz",
		"asso.dz",
		"com.dz",
		"edu.dz",
		"gov.dz",
		"org.dz",
		"net.dz",
		"pol.dz",
		"soc.dz",
		"tm.dz",
		"ec",
		"com.ec",
		"info.ec",
		"net.ec",
		"fin.ec",
		"k12.ec",
		"med.ec",
		"pro.ec",
		"org.ec",
		"edu.ec",
		"gov.ec",
		"gob.ec",
		"mil.ec",
		"edu",
		"ee",
		"edu.ee",
		"gov.ee",
		"riik.ee",
		"lib.ee",
		"med.ee",
		"com.ee",
		"pri.ee",
		"aip.ee",
		"org.ee",
		"fie.ee",
		"eg",
		"com.eg",
		"edu.eg",
		"eun.eg",
		"gov.eg",
		"mil.eg",
		"name.eg",
		"net.eg",
		"org.eg",
		"sci.eg",
		"*.er",
		"es",
		"com.es",
		"nom.es",
		"org.es",
		"gob.es",
		"edu.es",
		"et",
		"com.et",
		"gov.et",
		"org.et",
		"edu.et",
		"biz.et",
		"name.et",
		"info.et",
		"net.et",
		"eu",
		"fi",
		"aland.fi",
		"fj",
		"ac.fj",
		"biz.fj",
		"com.fj",
		"gov.fj",
		"info.fj",
		"mil.fj",
		"name.fj",
		"net.fj",
		"org.fj",
		"pro.fj",
		"*.fk",
		"com.fm",
		"edu.fm",
		"net.fm",
		"org.fm",
		"fm",
		"fo",
		"fr",
		"asso.fr",
		"com.fr",
		"gouv.fr",
		"nom.fr",
		"prd.fr",
		"tm.fr",
		"aeroport.fr",
		"avocat.fr",
		"avoues.fr",
		"cci.fr",
		"chambagri.fr",
		"chirurgiens-dentistes.fr",
		"experts-comptables.fr",
		"geometre-expert.fr",
		"greta.fr",
		"huissier-justice.fr",
		"medecin.fr",
		"notaires.fr",
		"pharmacien.fr",
		"port.fr",
		"veterinaire.fr",
		"ga",
		"gb",
		"edu.gd",
		"gov.gd",
		"gd",
		"ge",
		"com.ge",
		"edu.ge",
		"gov.ge",
		"org.ge",
		"mil.ge",
		"net.ge",
		"pvt.ge",
		"gf",
		"gg",
		"co.gg",
		"net.gg",
		"org.gg",
		"gh",
		"com.gh",
		"edu.gh",
		"gov.gh",
		"org.gh",
		"mil.gh",
		"gi",
		"com.gi",
		"ltd.gi",
		"gov.gi",
		"mod.gi",
		"edu.gi",
		"org.gi",
		"gl",
		"co.gl",
		"com.gl",
		"edu.gl",
		"net.gl",
		"org.gl",
		"gm",
		"gn",
		"ac.gn",
		"com.gn",
		"edu.gn",
		"gov.gn",
		"org.gn",
		"net.gn",
		"gov",
		"gp",
		"com.gp",
		"net.gp",
		"mobi.gp",
		"edu.gp",
		"org.gp",
		"asso.gp",
		"gq",
		"gr",
		"com.gr",
		"edu.gr",
		"net.gr",
		"org.gr",
		"gov.gr",
		"gs",
		"gt",
		"com.gt",
		"edu.gt",
		"gob.gt",
		"ind.gt",
		"mil.gt",
		"net.gt",
		"org.gt",
		"gu",
		"com.gu",
		"edu.gu",
		"gov.gu",
		"guam.gu",
		"info.gu",
		"net.gu",
		"org.gu",
		"web.gu",
		"gw",
		"gy",
		"co.gy",
		"com.gy",
		"edu.gy",
		"gov.gy",
		"net.gy",
		"org.gy",
		"hk",
		"com.hk",
		"edu.hk",
		"gov.hk",
		"idv.hk",
		"net.hk",
		"org.hk",
		"公司.hk",
		"教育.hk",
		"敎育.hk",
		"政府.hk",
		"個人.hk",
		"个��.hk",
		"箇人.hk",
		"網络.hk",
		"网络.hk",
		"组織.hk",
		"網絡.hk",
		"网絡.hk",
		"组织.hk",
		"組織.hk",
		"組织.hk",
		"hm",
		"hn",
		"com.hn",
		"edu.hn",
		"org.hn",
		"net.hn",
		"mil.hn",
		"gob.hn",
		"hr",
		"iz.hr",
		"from.hr",
		"name.hr",
		"com.hr",
		"ht",
		"com.ht",
		"shop.ht",
		"firm.ht",
		"info.ht",
		"adult.ht",
		"net.ht",
		"pro.ht",
		"org.ht",
		"med.ht",
		"art.ht",
		"coop.ht",
		"pol.ht",
		"asso.ht",
		"edu.ht",
		"rel.ht",
		"gouv.ht",
		"perso.ht",
		"hu",
		"co.hu",
		"info.hu",
		"org.hu",
		"priv.hu",
		"sport.hu",
		"tm.hu",
		"2000.hu",
		"agrar.hu",
		"bolt.hu",
		"casino.hu",
		"city.hu",
		"erotica.hu",
		"erotika.hu",
		"film.hu",
		"forum.hu",
		"games.hu",
		"hotel.hu",
		"ingatlan.hu",
		"jogasz.hu",
		"konyvelo.hu",
		"lakas.hu",
		"media.hu",
		"news.hu",
		"reklam.hu",
		"sex.hu",
		"shop.hu",
		"suli.hu",
		"szex.hu",
		"tozsde.hu",
		"utazas.hu",
		"video.hu",
		"id",
		"ac.id",
		"biz.id",
		"co.id",
		"desa.id",
		"go.id",
		"mil.id",
		"my.id",
		"net.id",
		"or.id",
		"ponpes.id",
		"sch.id",
		"web.id",
		"ie",
		"gov.ie",
		"il",
		"ac.il",
		"co.il",
		"gov.il",
		"idf.il",
		"k12.il",
		"muni.il",
		"net.il",
		"org.il",
		"im",
		"ac.im",
		"co.im",
		"com.im",
		"ltd.co.im",
		"net.im",
		"org.im",
		"plc.co.im",
		"tt.im",
		"tv.im",
		"in",
		"co.in",
		"firm.in",
		"net.in",
		"org.in",
		"gen.in",
		"ind.in",
		"nic.in",
		"ac.in",
		"edu.in",
		"res.in",
		"gov.in",
		"mil.in",
		"info",
		"int",
		"eu.int",
		"io",
		"com.io",
		"iq",
		"gov.iq",
		"edu.iq",
		"mil.iq",
		"com.iq",
		"org.iq",
		"net.iq",
		"ir",
		"ac.ir",
		"co.ir",
		"gov.ir",
		"id.ir",
		"net.ir",
		"org.ir",
		"sch.ir",
		"ایران.ir",
		"ايران.ir",
		"is",
		"net.is",
		"com.is",
		"edu.is",
		"gov.is",
		"org.is",
		"int.is",
		"it",
		"gov.it",
		"edu.it",
		"abr.it",
		"abruzzo.it",
		"aosta-valley.it",
		"aostavalley.it",
		"bas.it",
		"basilicata.it",
		"cal.it",
		"calabria.it",
		"cam.it",
		"campania.it",
		"emilia-romagna.it",
		"emiliaromagna.it",
		"emr.it",
		"friuli-v-giulia.it",
		"friuli-ve-giulia.it",
		"friuli-vegiulia.it",
		"friuli-venezia-giulia.it",
		"friuli-veneziagiulia.it",
		"friuli-vgiulia.it",
		"friuliv-giulia.it",
		"friulive-giulia.it",
		"friulivegiulia.it",
		"friulivenezia-giulia.it",
		"friuliveneziagiulia.it",
		"friulivgiulia.it",
		"fvg.it",
		"laz.it",
		"lazio.it",
		"lig.it",
		"liguria.it",
		"lom.it",
		"lombardia.it",
		"lombardy.it",
		"lucania.it",
		"mar.it",
		"marche.it",
		"mol.it",
		"molise.it",
		"piedmont.it",
		"piemonte.it",
		"pmn.it",
		"pug.it",
		"puglia.it",
		"sar.it",
		"sardegna.it",
		"sardinia.it",
		"sic.it",
		"sicilia.it",
		"sicily.it",
		"taa.it",
		"tos.it",
		"toscana.it",
		"trentin-sud-tirol.it",
		"trentin-süd-tirol.it",
		"trentin-sudtirol.it",
		"trentin-südtirol.it",
		"trentin-sued-tirol.it",
		"trentin-suedtirol.it",
		"trentino-a-adige.it",
		"trentino-aadige.it",
		"trentino-alto-adige.it",
		"trentino-altoadige.it",
		"trentino-s-tirol.it",
		"trentino-stirol.it",
		"trentino-sud-tirol.it",
		"trentino-süd-tirol.it",
		"trentino-sudtirol.it",
		"trentino-südtirol.it",
		"trentino-sued-tirol.it",
		"trentino-suedtirol.it",
		"trentino.it",
		"trentinoa-adige.it",
		"trentinoaadige.it",
		"trentinoalto-adige.it",
		"trentinoaltoadige.it",
		"trentinos-tirol.it",
		"trentinostirol.it",
		"trentinosud-tirol.it",
		"trentinosüd-tirol.it",
		"trentinosudtirol.it",
		"trentinosüdtirol.it",
		"trentinosued-tirol.it",
		"trentinosuedtirol.it",
		"trentinsud-tirol.it",
		"trentinsüd-tirol.it",
		"trentinsudtirol.it",
		"trentinsüdtirol.it",
		"trentinsued-tirol.it",
		"trentinsuedtirol.it",
		"tuscany.it",
		"umb.it",
		"umbria.it",
		"val-d-aosta.it",
		"val-daosta.it",
		"vald-aosta.it",
		"valdaosta.it",
		"valle-aosta.it",
		"valle-d-aosta.it",
		"valle-daosta.it",
		"valleaosta.it",
		"valled-aosta.it",
		"valledaosta.it",
		"vallee-aoste.it",
		"vallée-aoste.it",
		"vallee-d-aoste.it",
		"vallée-d-aoste.it",
		"valleeaoste.it",
		"valléeaoste.it",
		"valleedaoste.it",
		"valléedaoste.it",
		"vao.it",
		"vda.it",
		"ven.it",
		"veneto.it",
		"ag.it",
		"agrigento.it",
		"al.it",
		"alessandria.it",
		"alto-adige.it",
		"altoadige.it",
		"an.it",
		"ancona.it",
		"andria-barletta-trani.it",
		"andria-trani-barletta.it",
		"andriabarlettatrani.it",
		"andriatranibarletta.it",
		"ao.it",
		"aosta.it",
		"aoste.it",
		"ap.it",
		"aq.it",
		"aquila.it",
		"ar.it",
		"arezzo.it",
		"ascoli-piceno.it",
		"ascolipiceno.it",
		"asti.it",
		"at.it",
		"av.it",
		"avellino.it",
		"ba.it",
		"balsan-sudtirol.it",
		"balsan-südtirol.it",
		"balsan-suedtirol.it",
		"balsan.it",
		"bari.it",
		"barletta-trani-andria.it",
		"barlettatraniandria.it",
		"belluno.it",
		"benevento.it",
		"bergamo.it",
		"bg.it",
		"bi.it",
		"biella.it",
		"bl.it",
		"bn.it",
		"bo.it",
		"bologna.it",
		"bolzano-altoadige.it",
		"bolzano.it",
		"bozen-sudtirol.it",
		"bozen-südtirol.it",
		"bozen-suedtirol.it",
		"bozen.it",
		"br.it",
		"brescia.it",
		"brindisi.it",
		"bs.it",
		"bt.it",
		"bulsan-sudtirol.it",
		"bulsan-südtirol.it",
		"bulsan-suedtirol.it",
		"bulsan.it",
		"bz.it",
		"ca.it",
		"cagliari.it",
		"caltanissetta.it",
		"campidano-medio.it",
		"campidanomedio.it",
		"campobasso.it",
		"carbonia-iglesias.it",
		"carboniaiglesias.it",
		"carrara-massa.it",
		"carraramassa.it",
		"caserta.it",
		"catania.it",
		"catanzaro.it",
		"cb.it",
		"ce.it",
		"cesena-forli.it",
		"cesena-forlì.it",
		"cesenaforli.it",
		"cesenaforlì.it",
		"ch.it",
		"chieti.it",
		"ci.it",
		"cl.it",
		"cn.it",
		"co.it",
		"como.it",
		"cosenza.it",
		"cr.it",
		"cremona.it",
		"crotone.it",
		"cs.it",
		"ct.it",
		"cuneo.it",
		"cz.it",
		"dell-ogliastra.it",
		"dellogliastra.it",
		"en.it",
		"enna.it",
		"fc.it",
		"fe.it",
		"fermo.it",
		"ferrara.it",
		"fg.it",
		"fi.it",
		"firenze.it",
		"florence.it",
		"fm.it",
		"foggia.it",
		"forli-cesena.it",
		"forlì-cesena.it",
		"forlicesena.it",
		"forlìcesena.it",
		"fr.it",
		"frosinone.it",
		"ge.it",
		"genoa.it",
		"genova.it",
		"go.it",
		"gorizia.it",
		"gr.it",
		"grosseto.it",
		"iglesias-carbonia.it",
		"iglesiascarbonia.it",
		"im.it",
		"imperia.it",
		"is.it",
		"isernia.it",
		"kr.it",
		"la-spezia.it",
		"laquila.it",
		"laspezia.it",
		"latina.it",
		"lc.it",
		"le.it",
		"lecce.it",
		"lecco.it",
		"li.it",
		"livorno.it",
		"lo.it",
		"lodi.it",
		"lt.it",
		"lu.it",
		"lucca.it",
		"macerata.it",
		"mantova.it",
		"massa-carrara.it",
		"massacarrara.it",
		"matera.it",
		"mb.it",
		"mc.it",
		"me.it",
		"medio-campidano.it",
		"mediocampidano.it",
		"messina.it",
		"mi.it",
		"milan.it",
		"milano.it",
		"mn.it",
		"mo.it",
		"modena.it",
		"monza-brianza.it",
		"monza-e-della-brianza.it",
		"monza.it",
		"monzabrianza.it",
		"monzaebrianza.it",
		"monzaedellabrianza.it",
		"ms.it",
		"mt.it",
		"na.it",
		"naples.it",
		"napoli.it",
		"no.it",
		"novara.it",
		"nu.it",
		"nuoro.it",
		"og.it",
		"ogliastra.it",
		"olbia-tempio.it",
		"olbiatempio.it",
		"or.it",
		"oristano.it",
		"ot.it",
		"pa.it",
		"padova.it",
		"padua.it",
		"palermo.it",
		"parma.it",
		"pavia.it",
		"pc.it",
		"pd.it",
		"pe.it",
		"perugia.it",
		"pesaro-urbino.it",
		"pesarourbino.it",
		"pescara.it",
		"pg.it",
		"pi.it",
		"piacenza.it",
		"pisa.it",
		"pistoia.it",
		"pn.it",
		"po.it",
		"pordenone.it",
		"potenza.it",
		"pr.it",
		"prato.it",
		"pt.it",
		"pu.it",
		"pv.it",
		"pz.it",
		"ra.it",
		"ragusa.it",
		"ravenna.it",
		"rc.it",
		"re.it",
		"reggio-calabria.it",
		"reggio-emilia.it",
		"reggiocalabria.it",
		"reggioemilia.it",
		"rg.it",
		"ri.it",
		"rieti.it",
		"rimini.it",
		"rm.it",
		"rn.it",
		"ro.it",
		"roma.it",
		"rome.it",
		"rovigo.it",
		"sa.it",
		"salerno.it",
		"sassari.it",
		"savona.it",
		"si.it",
		"siena.it",
		"siracusa.it",
		"so.it",
		"sondrio.it",
		"sp.it",
		"sr.it",
		"ss.it",
		"suedtirol.it",
		"südtirol.it",
		"sv.it",
		"ta.it",
		"taranto.it",
		"te.it",
		"tempio-olbia.it",
		"tempioolbia.it",
		"teramo.it",
		"terni.it",
		"tn.it",
		"to.it",
		"torino.it",
		"tp.it",
		"tr.it",
		"trani-andria-barletta.it",
		"trani-barletta-andria.it",
		"traniandriabarletta.it",
		"tranibarlettaandria.it",
		"trapani.it",
		"trento.it",
		"treviso.it",
		"trieste.it",
		"ts.it",
		"turin.it",
		"tv.it",
		"ud.it",
		"udine.it",
		"urbino-pesaro.it",
		"urbinopesaro.it",
		"va.it",
		"varese.it",
		"vb.it",
		"vc.it",
		"ve.it",
		"venezia.it",
		"venice.it",
		"verbania.it",
		"vercelli.it",
		"verona.it",
		"vi.it",
		"vibo-valentia.it",
		"vibovalentia.it",
		"vicenza.it",
		"viterbo.it",
		"vr.it",
		"vs.it",
		"vt.it",
		"vv.it",
		"je",
		"co.je",
		"net.je",
		"org.je",
		"*.jm",
		"jo",
		"com.jo",
		"org.jo",
		"net.jo",
		"edu.jo",
		"sch.jo",
		"gov.jo",
		"mil.jo",
		"name.jo",
		"jobs",
		"jp",
		"ac.jp",
		"ad.jp",
		"co.jp",
		"ed.jp",
		"go.jp",
		"gr.jp",
		"lg.jp",
		"ne.jp",
		"or.jp",
		"aichi.jp",
		"akita.jp",
		"aomori.jp",
		"chiba.jp",
		"ehime.jp",
		"fukui.jp",
		"fukuoka.jp",
		"fukushima.jp",
		"gifu.jp",
		"gunma.jp",
		"hiroshima.jp",
		"hokkaido.jp",
		"hyogo.jp",
		"ibaraki.jp",
		"ishikawa.jp",
		"iwate.jp",
		"kagawa.jp",
		"kagoshima.jp",
		"kanagawa.jp",
		"kochi.jp",
		"kumamoto.jp",
		"kyoto.jp",
		"mie.jp",
		"miyagi.jp",
		"miyazaki.jp",
		"nagano.jp",
		"nagasaki.jp",
		"nara.jp",
		"niigata.jp",
		"oita.jp",
		"okayama.jp",
		"okinawa.jp",
		"osaka.jp",
		"saga.jp",
		"saitama.jp",
		"shiga.jp",
		"shimane.jp",
		"shizuoka.jp",
		"tochigi.jp",
		"tokushima.jp",
		"tokyo.jp",
		"tottori.jp",
		"toyama.jp",
		"wakayama.jp",
		"yamagata.jp",
		"yamaguchi.jp",
		"yamanashi.jp",
		"栃木.jp",
		"愛知.jp",
		"愛媛.jp",
		"兵庫.jp",
		"熊本.jp",
		"茨城.jp",
		"北海道.jp",
		"千葉.jp",
		"和歌山.jp",
		"長崎.jp",
		"長野.jp",
		"新潟.jp",
		"青森.jp",
		"静岡.jp",
		"東京.jp",
		"石川.jp",
		"埼玉.jp",
		"三重.jp",
		"京都.jp",
		"佐賀.jp",
		"大分.jp",
		"大阪.jp",
		"奈良.jp",
		"宮城.jp",
		"宮崎.jp",
		"富山.jp",
		"山口.jp",
		"山形.jp",
		"山梨.jp",
		"岩手.jp",
		"岐阜.jp",
		"岡山.jp",
		"島根.jp",
		"広島.jp",
		"徳島.jp",
		"沖縄.jp",
		"滋賀.jp",
		"神奈川.jp",
		"福井.jp",
		"福岡.jp",
		"福島.jp",
		"秋田.jp",
		"群馬.jp",
		"香川.jp",
		"高知.jp",
		"鳥取.jp",
		"鹿児島.jp",
		"*.kawasaki.jp",
		"*.kitakyushu.jp",
		"*.kobe.jp",
		"*.nagoya.jp",
		"*.sapporo.jp",
		"*.sendai.jp",
		"*.yokohama.jp",
		"!city.kawasaki.jp",
		"!city.kitakyushu.jp",
		"!city.kobe.jp",
		"!city.nagoya.jp",
		"!city.sapporo.jp",
		"!city.sendai.jp",
		"!city.yokohama.jp",
		"aisai.aichi.jp",
		"ama.aichi.jp",
		"anjo.aichi.jp",
		"asuke.aichi.jp",
		"chiryu.aichi.jp",
		"chita.aichi.jp",
		"fuso.aichi.jp",
		"gamagori.aichi.jp",
		"handa.aichi.jp",
		"hazu.aichi.jp",
		"hekinan.aichi.jp",
		"higashiura.aichi.jp",
		"ichinomiya.aichi.jp",
		"inazawa.aichi.jp",
		"inuyama.aichi.jp",
		"isshiki.aichi.jp",
		"iwakura.aichi.jp",
		"kanie.aichi.jp",
		"kariya.aichi.jp",
		"kasugai.aichi.jp",
		"kira.aichi.jp",
		"kiyosu.aichi.jp",
		"komaki.aichi.jp",
		"konan.aichi.jp",
		"kota.aichi.jp",
		"mihama.aichi.jp",
		"miyoshi.aichi.jp",
		"nishio.aichi.jp",
		"nisshin.aichi.jp",
		"obu.aichi.jp",
		"oguchi.aichi.jp",
		"oharu.aichi.jp",
		"okazaki.aichi.jp",
		"owariasahi.aichi.jp",
		"seto.aichi.jp",
		"shikatsu.aichi.jp",
		"shinshiro.aichi.jp",
		"shitara.aichi.jp",
		"tahara.aichi.jp",
		"takahama.aichi.jp",
		"tobishima.aichi.jp",
		"toei.aichi.jp",
		"togo.aichi.jp",
		"tokai.aichi.jp",
		"tokoname.aichi.jp",
		"toyoake.aichi.jp",
		"toyohashi.aichi.jp",
		"toyokawa.aichi.jp",
		"toyone.aichi.jp",
		"toyota.aichi.jp",
		"tsushima.aichi.jp",
		"yatomi.aichi.jp",
		"akita.akita.jp",
		"daisen.akita.jp",
		"fujisato.akita.jp",
		"gojome.akita.jp",
		"hachirogata.akita.jp",
		"happou.akita.jp",
		"higashinaruse.akita.jp",
		"honjo.akita.jp",
		"honjyo.akita.jp",
		"ikawa.akita.jp",
		"kamikoani.akita.jp",
		"kamioka.akita.jp",
		"katagami.akita.jp",
		"kazuno.akita.jp",
		"kitaakita.akita.jp",
		"kosaka.akita.jp",
		"kyowa.akita.jp",
		"misato.akita.jp",
		"mitane.akita.jp",
		"moriyoshi.akita.jp",
		"nikaho.akita.jp",
		"noshiro.akita.jp",
		"odate.akita.jp",
		"oga.akita.jp",
		"ogata.akita.jp",
		"semboku.akita.jp",
		"yokote.akita.jp",
		"yurihonjo.akita.jp",
		"aomori.aomori.jp",
		"gonohe.aomori.jp",
		"hachinohe.aomori.jp",
		"hashikami.aomori.jp",
		"hiranai.aomori.jp",
		"hirosaki.aomori.jp",
		"itayanagi.aomori.jp",
		"kuroishi.aomori.jp",
		"misawa.aomori.jp",
		"mutsu.aomori.jp",
		"nakadomari.aomori.jp",
		"noheji.aomori.jp",
		"oirase.aomori.jp",
		"owani.aomori.jp",
		"rokunohe.aomori.jp",
		"sannohe.aomori.jp",
		"shichinohe.aomori.jp",
		"shingo.aomori.jp",
		"takko.aomori.jp",
		"towada.aomori.jp",
		"tsugaru.aomori.jp",
		"tsuruta.aomori.jp",
		"abiko.chiba.jp",
		"asahi.chiba.jp",
		"chonan.chiba.jp",
		"chosei.chiba.jp",
		"choshi.chiba.jp",
		"chuo.chiba.jp",
		"funabashi.chiba.jp",
		"futtsu.chiba.jp",
		"hanamigawa.chiba.jp",
		"ichihara.chiba.jp",
		"ichikawa.chiba.jp",
		"ichinomiya.chiba.jp",
		"inzai.chiba.jp",
		"isumi.chiba.jp",
		"kamagaya.chiba.jp",
		"kamogawa.chiba.jp",
		"kashiwa.chiba.jp",
		"katori.chiba.jp",
		"katsuura.chiba.jp",
		"kimitsu.chiba.jp",
		"kisarazu.chiba.jp",
		"kozaki.chiba.jp",
		"kujukuri.chiba.jp",
		"kyonan.chiba.jp",
		"matsudo.chiba.jp",
		"midori.chiba.jp",
		"mihama.chiba.jp",
		"minamiboso.chiba.jp",
		"mobara.chiba.jp",
		"mutsuzawa.chiba.jp",
		"nagara.chiba.jp",
		"nagareyama.chiba.jp",
		"narashino.chiba.jp",
		"narita.chiba.jp",
		"noda.chiba.jp",
		"oamishirasato.chiba.jp",
		"omigawa.chiba.jp",
		"onjuku.chiba.jp",
		"otaki.chiba.jp",
		"sakae.chiba.jp",
		"sakura.chiba.jp",
		"shimofusa.chiba.jp",
		"shirako.chiba.jp",
		"shiroi.chiba.jp",
		"shisui.chiba.jp",
		"sodegaura.chiba.jp",
		"sosa.chiba.jp",
		"tako.chiba.jp",
		"tateyama.chiba.jp",
		"togane.chiba.jp",
		"tohnosho.chiba.jp",
		"tomisato.chiba.jp",
		"urayasu.chiba.jp",
		"yachimata.chiba.jp",
		"yachiyo.chiba.jp",
		"yokaichiba.chiba.jp",
		"yokoshibahikari.chiba.jp",
		"yotsukaido.chiba.jp",
		"ainan.ehime.jp",
		"honai.ehime.jp",
		"ikata.ehime.jp",
		"imabari.ehime.jp",
		"iyo.ehime.jp",
		"kamijima.ehime.jp",
		"kihoku.ehime.jp",
		"kumakogen.ehime.jp",
		"masaki.ehime.jp",
		"matsuno.ehime.jp",
		"matsuyama.ehime.jp",
		"namikata.ehime.jp",
		"niihama.ehime.jp",
		"ozu.ehime.jp",
		"saijo.ehime.jp",
		"seiyo.ehime.jp",
		"shikokuchuo.ehime.jp",
		"tobe.ehime.jp",
		"toon.ehime.jp",
		"uchiko.ehime.jp",
		"uwajima.ehime.jp",
		"yawatahama.ehime.jp",
		"echizen.fukui.jp",
		"eiheiji.fukui.jp",
		"fukui.fukui.jp",
		"ikeda.fukui.jp",
		"katsuyama.fukui.jp",
		"mihama.fukui.jp",
		"minamiechizen.fukui.jp",
		"obama.fukui.jp",
		"ohi.fukui.jp",
		"ono.fukui.jp",
		"sabae.fukui.jp",
		"sakai.fukui.jp",
		"takahama.fukui.jp",
		"tsuruga.fukui.jp",
		"wakasa.fukui.jp",
		"ashiya.fukuoka.jp",
		"buzen.fukuoka.jp",
		"chikugo.fukuoka.jp",
		"chikuho.fukuoka.jp",
		"chikujo.fukuoka.jp",
		"chikushino.fukuoka.jp",
		"chikuzen.fukuoka.jp",
		"chuo.fukuoka.jp",
		"dazaifu.fukuoka.jp",
		"fukuchi.fukuoka.jp",
		"hakata.fukuoka.jp",
		"higashi.fukuoka.jp",
		"hirokawa.fukuoka.jp",
		"hisayama.fukuoka.jp",
		"iizuka.fukuoka.jp",
		"inatsuki.fukuoka.jp",
		"kaho.fukuoka.jp",
		"kasuga.fukuoka.jp",
		"kasuya.fukuoka.jp",
		"kawara.fukuoka.jp",
		"keisen.fukuoka.jp",
		"koga.fukuoka.jp",
		"kurate.fukuoka.jp",
		"kurogi.fukuoka.jp",
		"kurume.fukuoka.jp",
		"minami.fukuoka.jp",
		"miyako.fukuoka.jp",
		"miyama.fukuoka.jp",
		"miyawaka.fukuoka.jp",
		"mizumaki.fukuoka.jp",
		"munakata.fukuoka.jp",
		"nakagawa.fukuoka.jp",
		"nakama.fukuoka.jp",
		"nishi.fukuoka.jp",
		"nogata.fukuoka.jp",
		"ogori.fukuoka.jp",
		"okagaki.fukuoka.jp",
		"okawa.fukuoka.jp",
		"oki.fukuoka.jp",
		"omuta.fukuoka.jp",
		"onga.fukuoka.jp",
		"onojo.fukuoka.jp",
		"oto.fukuoka.jp",
		"saigawa.fukuoka.jp",
		"sasaguri.fukuoka.jp",
		"shingu.fukuoka.jp",
		"shinyoshitomi.fukuoka.jp",
		"shonai.fukuoka.jp",
		"soeda.fukuoka.jp",
		"sue.fukuoka.jp",
		"tachiarai.fukuoka.jp",
		"tagawa.fukuoka.jp",
		"takata.fukuoka.jp",
		"toho.fukuoka.jp",
		"toyotsu.fukuoka.jp",
		"tsuiki.fukuoka.jp",
		"ukiha.fukuoka.jp",
		"umi.fukuoka.jp",
		"usui.fukuoka.jp",
		"yamada.fukuoka.jp",
		"yame.fukuoka.jp",
		"yanagawa.fukuoka.jp",
		"yukuhashi.fukuoka.jp",
		"aizubange.fukushima.jp",
		"aizumisato.fukushima.jp",
		"aizuwakamatsu.fukushima.jp",
		"asakawa.fukushima.jp",
		"bandai.fukushima.jp",
		"date.fukushima.jp",
		"fukushima.fukushima.jp",
		"furudono.fukushima.jp",
		"futaba.fukushima.jp",
		"hanawa.fukushima.jp",
		"higashi.fukushima.jp",
		"hirata.fukushima.jp",
		"hirono.fukushima.jp",
		"iitate.fukushima.jp",
		"inawashiro.fukushima.jp",
		"ishikawa.fukushima.jp",
		"iwaki.fukushima.jp",
		"izumizaki.fukushima.jp",
		"kagamiishi.fukushima.jp",
		"kaneyama.fukushima.jp",
		"kawamata.fukushima.jp",
		"kitakata.fukushima.jp",
		"kitashiobara.fukushima.jp",
		"koori.fukushima.jp",
		"koriyama.fukushima.jp",
		"kunimi.fukushima.jp",
		"miharu.fukushima.jp",
		"mishima.fukushima.jp",
		"namie.fukushima.jp",
		"nango.fukushima.jp",
		"nishiaizu.fukushima.jp",
		"nishigo.fukushima.jp",
		"okuma.fukushima.jp",
		"omotego.fukushima.jp",
		"ono.fukushima.jp",
		"otama.fukushima.jp",
		"samegawa.fukushima.jp",
		"shimogo.fukushima.jp",
		"shirakawa.fukushima.jp",
		"showa.fukushima.jp",
		"soma.fukushima.jp",
		"sukagawa.fukushima.jp",
		"taishin.fukushima.jp",
		"tamakawa.fukushima.jp",
		"tanagura.fukushima.jp",
		"tenei.fukushima.jp",
		"yabuki.fukushima.jp",
		"yamato.fukushima.jp",
		"yamatsuri.fukushima.jp",
		"yanaizu.fukushima.jp",
		"yugawa.fukushima.jp",
		"anpachi.gifu.jp",
		"ena.gifu.jp",
		"gifu.gifu.jp",
		"ginan.gifu.jp",
		"godo.gifu.jp",
		"gujo.gifu.jp",
		"hashima.gifu.jp",
		"hichiso.gifu.jp",
		"hida.gifu.jp",
		"higashishirakawa.gifu.jp",
		"ibigawa.gifu.jp",
		"ikeda.gifu.jp",
		"kakamigahara.gifu.jp",
		"kani.gifu.jp",
		"kasahara.gifu.jp",
		"kasamatsu.gifu.jp",
		"kawaue.gifu.jp",
		"kitagata.gifu.jp",
		"mino.gifu.jp",
		"minokamo.gifu.jp",
		"mitake.gifu.jp",
		"mizunami.gifu.jp",
		"motosu.gifu.jp",
		"nakatsugawa.gifu.jp",
		"ogaki.gifu.jp",
		"sakahogi.gifu.jp",
		"seki.gifu.jp",
		"sekigahara.gifu.jp",
		"shirakawa.gifu.jp",
		"tajimi.gifu.jp",
		"takayama.gifu.jp",
		"tarui.gifu.jp",
		"toki.gifu.jp",
		"tomika.gifu.jp",
		"wanouchi.gifu.jp",
		"yamagata.gifu.jp",
		"yaotsu.gifu.jp",
		"yoro.gifu.jp",
		"annaka.gunma.jp",
		"chiyoda.gunma.jp",
		"fujioka.gunma.jp",
		"higashiagatsuma.gunma.jp",
		"isesaki.gunma.jp",
		"itakura.gunma.jp",
		"kanna.gunma.jp",
		"kanra.gunma.jp",
		"katashina.gunma.jp",
		"kawaba.gunma.jp",
		"kiryu.gunma.jp",
		"kusatsu.gunma.jp",
		"maebashi.gunma.jp",
		"meiwa.gunma.jp",
		"midori.gunma.jp",
		"minakami.gunma.jp",
		"naganohara.gunma.jp",
		"nakanojo.gunma.jp",
		"nanmoku.gunma.jp",
		"numata.gunma.jp",
		"oizumi.gunma.jp",
		"ora.gunma.jp",
		"ota.gunma.jp",
		"shibukawa.gunma.jp",
		"shimonita.gunma.jp",
		"shinto.gunma.jp",
		"showa.gunma.jp",
		"takasaki.gunma.jp",
		"takayama.gunma.jp",
		"tamamura.gunma.jp",
		"tatebayashi.gunma.jp",
		"tomioka.gunma.jp",
		"tsukiyono.gunma.jp",
		"tsumagoi.gunma.jp",
		"ueno.gunma.jp",
		"yoshioka.gunma.jp",
		"asaminami.hiroshima.jp",
		"daiwa.hiroshima.jp",
		"etajima.hiroshima.jp",
		"fuchu.hiroshima.jp",
		"fukuyama.hiroshima.jp",
		"hatsukaichi.hiroshima.jp",
		"higashihiroshima.hiroshima.jp",
		"hongo.hiroshima.jp",
		"jinsekikogen.hiroshima.jp",
		"kaita.hiroshima.jp",
		"kui.hiroshima.jp",
		"kumano.hiroshima.jp",
		"kure.hiroshima.jp",
		"mihara.hiroshima.jp",
		"miyoshi.hiroshima.jp",
		"naka.hiroshima.jp",
		"onomichi.hiroshima.jp",
		"osakikamijima.hiroshima.jp",
		"otake.hiroshima.jp",
		"saka.hiroshima.jp",
		"sera.hiroshima.jp",
		"seranishi.hiroshima.jp",
		"shinichi.hiroshima.jp",
		"shobara.hiroshima.jp",
		"takehara.hiroshima.jp",
		"abashiri.hokkaido.jp",
		"abira.hokkaido.jp",
		"aibetsu.hokkaido.jp",
		"akabira.hokkaido.jp",
		"akkeshi.hokkaido.jp",
		"asahikawa.hokkaido.jp",
		"ashibetsu.hokkaido.jp",
		"ashoro.hokkaido.jp",
		"assabu.hokkaido.jp",
		"atsuma.hokkaido.jp",
		"bibai.hokkaido.jp",
		"biei.hokkaido.jp",
		"bifuka.hokkaido.jp",
		"bihoro.hokkaido.jp",
		"biratori.hokkaido.jp",
		"chippubetsu.hokkaido.jp",
		"chitose.hokkaido.jp",
		"date.hokkaido.jp",
		"ebetsu.hokkaido.jp",
		"embetsu.hokkaido.jp",
		"eniwa.hokkaido.jp",
		"erimo.hokkaido.jp",
		"esan.hokkaido.jp",
		"esashi.hokkaido.jp",
		"fukagawa.hokkaido.jp",
		"fukushima.hokkaido.jp",
		"furano.hokkaido.jp",
		"furubira.hokkaido.jp",
		"haboro.hokkaido.jp",
		"hakodate.hokkaido.jp",
		"hamatonbetsu.hokkaido.jp",
		"hidaka.hokkaido.jp",
		"higashikagura.hokkaido.jp",
		"higashikawa.hokkaido.jp",
		"hiroo.hokkaido.jp",
		"hokuryu.hokkaido.jp",
		"hokuto.hokkaido.jp",
		"honbetsu.hokkaido.jp",
		"horokanai.hokkaido.jp",
		"horonobe.hokkaido.jp",
		"ikeda.hokkaido.jp",
		"imakane.hokkaido.jp",
		"ishikari.hokkaido.jp",
		"iwamizawa.hokkaido.jp",
		"iwanai.hokkaido.jp",
		"kamifurano.hokkaido.jp",
		"kamikawa.hokkaido.jp",
		"kamishihoro.hokkaido.jp",
		"kamisunagawa.hokkaido.jp",
		"kamoenai.hokkaido.jp",
		"kayabe.hokkaido.jp",
		"kembuchi.hokkaido.jp",
		"kikonai.hokkaido.jp",
		"kimobetsu.hokkaido.jp",
		"kitahiroshima.hokkaido.jp",
		"kitami.hokkaido.jp",
		"kiyosato.hokkaido.jp",
		"koshimizu.hokkaido.jp",
		"kunneppu.hokkaido.jp",
		"kuriyama.hokkaido.jp",
		"kuromatsunai.hokkaido.jp",
		"kushiro.hokkaido.jp",
		"kutchan.hokkaido.jp",
		"kyowa.hokkaido.jp",
		"mashike.hokkaido.jp",
		"matsumae.hokkaido.jp",
		"mikasa.hokkaido.jp",
		"minamifurano.hokkaido.jp",
		"mombetsu.hokkaido.jp",
		"moseushi.hokkaido.jp",
		"mukawa.hokkaido.jp",
		"muroran.hokkaido.jp",
		"naie.hokkaido.jp",
		"nakagawa.hokkaido.jp",
		"nakasatsunai.hokkaido.jp",
		"nakatombetsu.hokkaido.jp",
		"nanae.hokkaido.jp",
		"nanporo.hokkaido.jp",
		"nayoro.hokkaido.jp",
		"nemuro.hokkaido.jp",
		"niikappu.hokkaido.jp",
		"niki.hokkaido.jp",
		"nishiokoppe.hokkaido.jp",
		"noboribetsu.hokkaido.jp",
		"numata.hokkaido.jp",
		"obihiro.hokkaido.jp",
		"obira.hokkaido.jp",
		"oketo.hokkaido.jp",
		"okoppe.hokkaido.jp",
		"otaru.hokkaido.jp",
		"otobe.hokkaido.jp",
		"otofuke.hokkaido.jp",
		"otoineppu.hokkaido.jp",
		"oumu.hokkaido.jp",
		"ozora.hokkaido.jp",
		"pippu.hokkaido.jp",
		"rankoshi.hokkaido.jp",
		"rebun.hokkaido.jp",
		"rikubetsu.hokkaido.jp",
		"rishiri.hokkaido.jp",
		"rishirifuji.hokkaido.jp",
		"saroma.hokkaido.jp",
		"sarufutsu.hokkaido.jp",
		"shakotan.hokkaido.jp",
		"shari.hokkaido.jp",
		"shibecha.hokkaido.jp",
		"shibetsu.hokkaido.jp",
		"shikabe.hokkaido.jp",
		"shikaoi.hokkaido.jp",
		"shimamaki.hokkaido.jp",
		"shimizu.hokkaido.jp",
		"shimokawa.hokkaido.jp",
		"shinshinotsu.hokkaido.jp",
		"shintoku.hokkaido.jp",
		"shiranuka.hokkaido.jp",
		"shiraoi.hokkaido.jp",
		"shiriuchi.hokkaido.jp",
		"sobetsu.hokkaido.jp",
		"sunagawa.hokkaido.jp",
		"taiki.hokkaido.jp",
		"takasu.hokkaido.jp",
		"takikawa.hokkaido.jp",
		"takinoue.hokkaido.jp",
		"teshikaga.hokkaido.jp",
		"tobetsu.hokkaido.jp",
		"tohma.hokkaido.jp",
		"tomakomai.hokkaido.jp",
		"tomari.hokkaido.jp",
		"toya.hokkaido.jp",
		"toyako.hokkaido.jp",
		"toyotomi.hokkaido.jp",
		"toyoura.hokkaido.jp",
		"tsubetsu.hokkaido.jp",
		"tsukigata.hokkaido.jp",
		"urakawa.hokkaido.jp",
		"urausu.hokkaido.jp",
		"uryu.hokkaido.jp",
		"utashinai.hokkaido.jp",
		"wakkanai.hokkaido.jp",
		"wassamu.hokkaido.jp",
		"yakumo.hokkaido.jp",
		"yoichi.hokkaido.jp",
		"aioi.hyogo.jp",
		"akashi.hyogo.jp",
		"ako.hyogo.jp",
		"amagasaki.hyogo.jp",
		"aogaki.hyogo.jp",
		"asago.hyogo.jp",
		"ashiya.hyogo.jp",
		"awaji.hyogo.jp",
		"fukusaki.hyogo.jp",
		"goshiki.hyogo.jp",
		"harima.hyogo.jp",
		"himeji.hyogo.jp",
		"ichikawa.hyogo.jp",
		"inagawa.hyogo.jp",
		"itami.hyogo.jp",
		"kakogawa.hyogo.jp",
		"kamigori.hyogo.jp",
		"kamikawa.hyogo.jp",
		"kasai.hyogo.jp",
		"kasuga.hyogo.jp",
		"kawanishi.hyogo.jp",
		"miki.hyogo.jp",
		"minamiawaji.hyogo.jp",
		"nishinomiya.hyogo.jp",
		"nishiwaki.hyogo.jp",
		"ono.hyogo.jp",
		"sanda.hyogo.jp",
		"sannan.hyogo.jp",
		"sasayama.hyogo.jp",
		"sayo.hyogo.jp",
		"shingu.hyogo.jp",
		"shinonsen.hyogo.jp",
		"shiso.hyogo.jp",
		"sumoto.hyogo.jp",
		"taishi.hyogo.jp",
		"taka.hyogo.jp",
		"takarazuka.hyogo.jp",
		"takasago.hyogo.jp",
		"takino.hyogo.jp",
		"tamba.hyogo.jp",
		"tatsuno.hyogo.jp",
		"toyooka.hyogo.jp",
		"yabu.hyogo.jp",
		"yashiro.hyogo.jp",
		"yoka.hyogo.jp",
		"yokawa.hyogo.jp",
		"ami.ibaraki.jp",
		"asahi.ibaraki.jp",
		"bando.ibaraki.jp",
		"chikusei.ibaraki.jp",
		"daigo.ibaraki.jp",
		"fujishiro.ibaraki.jp",
		"hitachi.ibaraki.jp",
		"hitachinaka.ibaraki.jp",
		"hitachiomiya.ibaraki.jp",
		"hitachiota.ibaraki.jp",
		"ibaraki.ibaraki.jp",
		"ina.ibaraki.jp",
		"inashiki.ibaraki.jp",
		"itako.ibaraki.jp",
		"iwama.ibaraki.jp",
		"joso.ibaraki.jp",
		"kamisu.ibaraki.jp",
		"kasama.ibaraki.jp",
		"kashima.ibaraki.jp",
		"kasumigaura.ibaraki.jp",
		"koga.ibaraki.jp",
		"miho.ibaraki.jp",
		"mito.ibaraki.jp",
		"moriya.ibaraki.jp",
		"naka.ibaraki.jp",
		"namegata.ibaraki.jp",
		"oarai.ibaraki.jp",
		"ogawa.ibaraki.jp",
		"omitama.ibaraki.jp",
		"ryugasaki.ibaraki.jp",
		"sakai.ibaraki.jp",
		"sakuragawa.ibaraki.jp",
		"shimodate.ibaraki.jp",
		"shimotsuma.ibaraki.jp",
		"shirosato.ibaraki.jp",
		"sowa.ibaraki.jp",
		"suifu.ibaraki.jp",
		"takahagi.ibaraki.jp",
		"tamatsukuri.ibaraki.jp",
		"tokai.ibaraki.jp",
		"tomobe.ibaraki.jp",
		"tone.ibaraki.jp",
		"toride.ibaraki.jp",
		"tsuchiura.ibaraki.jp",
		"tsukuba.ibaraki.jp",
		"uchihara.ibaraki.jp",
		"ushiku.ibaraki.jp",
		"yachiyo.ibaraki.jp",
		"yamagata.ibaraki.jp",
		"yawara.ibaraki.jp",
		"yuki.ibaraki.jp",
		"anamizu.ishikawa.jp",
		"hakui.ishikawa.jp",
		"hakusan.ishikawa.jp",
		"kaga.ishikawa.jp",
		"kahoku.ishikawa.jp",
		"kanazawa.ishikawa.jp",
		"kawakita.ishikawa.jp",
		"komatsu.ishikawa.jp",
		"nakanoto.ishikawa.jp",
		"nanao.ishikawa.jp",
		"nomi.ishikawa.jp",
		"nonoichi.ishikawa.jp",
		"noto.ishikawa.jp",
		"shika.ishikawa.jp",
		"suzu.ishikawa.jp",
		"tsubata.ishikawa.jp",
		"tsurugi.ishikawa.jp",
		"uchinada.ishikawa.jp",
		"wajima.ishikawa.jp",
		"fudai.iwate.jp",
		"fujisawa.iwate.jp",
		"hanamaki.iwate.jp",
		"hiraizumi.iwate.jp",
		"hirono.iwate.jp",
		"ichinohe.iwate.jp",
		"ichinoseki.iwate.jp",
		"iwaizumi.iwate.jp",
		"iwate.iwate.jp",
		"joboji.iwate.jp",
		"kamaishi.iwate.jp",
		"kanegasaki.iwate.jp",
		"karumai.iwate.jp",
		"kawai.iwate.jp",
		"kitakami.iwate.jp",
		"kuji.iwate.jp",
		"kunohe.iwate.jp",
		"kuzumaki.iwate.jp",
		"miyako.iwate.jp",
		"mizusawa.iwate.jp",
		"morioka.iwate.jp",
		"ninohe.iwate.jp",
		"noda.iwate.jp",
		"ofunato.iwate.jp",
		"oshu.iwate.jp",
		"otsuchi.iwate.jp",
		"rikuzentakata.iwate.jp",
		"shiwa.iwate.jp",
		"shizukuishi.iwate.jp",
		"sumita.iwate.jp",
		"tanohata.iwate.jp",
		"tono.iwate.jp",
		"yahaba.iwate.jp",
		"yamada.iwate.jp",
		"ayagawa.kagawa.jp",
		"higashikagawa.kagawa.jp",
		"kanonji.kagawa.jp",
		"kotohira.kagawa.jp",
		"manno.kagawa.jp",
		"marugame.kagawa.jp",
		"mitoyo.kagawa.jp",
		"naoshima.kagawa.jp",
		"sanuki.kagawa.jp",
		"tadotsu.kagawa.jp",
		"takamatsu.kagawa.jp",
		"tonosho.kagawa.jp",
		"uchinomi.kagawa.jp",
		"utazu.kagawa.jp",
		"zentsuji.kagawa.jp",
		"akune.kagoshima.jp",
		"amami.kagoshima.jp",
		"hioki.kagoshima.jp",
		"isa.kagoshima.jp",
		"isen.kagoshima.jp",
		"izumi.kagoshima.jp",
		"kagoshima.kagoshima.jp",
		"kanoya.kagoshima.jp",
		"kawanabe.kagoshima.jp",
		"kinko.kagoshima.jp",
		"kouyama.kagoshima.jp",
		"makurazaki.kagoshima.jp",
		"matsumoto.kagoshima.jp",
		"minamitane.kagoshima.jp",
		"nakatane.kagoshima.jp",
		"nishinoomote.kagoshima.jp",
		"satsumasendai.kagoshima.jp",
		"soo.kagoshima.jp",
		"tarumizu.kagoshima.jp",
		"yusui.kagoshima.jp",
		"aikawa.kanagawa.jp",
		"atsugi.kanagawa.jp",
		"ayase.kanagawa.jp",
		"chigasaki.kanagawa.jp",
		"ebina.kanagawa.jp",
		"fujisawa.kanagawa.jp",
		"hadano.kanagawa.jp",
		"hakone.kanagawa.jp",
		"hiratsuka.kanagawa.jp",
		"isehara.kanagawa.jp",
		"kaisei.kanagawa.jp",
		"kamakura.kanagawa.jp",
		"kiyokawa.kanagawa.jp",
		"matsuda.kanagawa.jp",
		"minamiashigara.kanagawa.jp",
		"miura.kanagawa.jp",
		"nakai.kanagawa.jp",
		"ninomiya.kanagawa.jp",
		"odawara.kanagawa.jp",
		"oi.kanagawa.jp",
		"oiso.kanagawa.jp",
		"sagamihara.kanagawa.jp",
		"samukawa.kanagawa.jp",
		"tsukui.kanagawa.jp",
		"yamakita.kanagawa.jp",
		"yamato.kanagawa.jp",
		"yokosuka.kanagawa.jp",
		"yugawara.kanagawa.jp",
		"zama.kanagawa.jp",
		"zushi.kanagawa.jp",
		"aki.kochi.jp",
		"geisei.kochi.jp",
		"hidaka.kochi.jp",
		"higashitsuno.kochi.jp",
		"ino.kochi.jp",
		"kagami.kochi.jp",
		"kami.kochi.jp",
		"kitagawa.kochi.jp",
		"kochi.kochi.jp",
		"mihara.kochi.jp",
		"motoyama.kochi.jp",
		"muroto.kochi.jp",
		"nahari.kochi.jp",
		"nakamura.kochi.jp",
		"nankoku.kochi.jp",
		"nishitosa.kochi.jp",
		"niyodogawa.kochi.jp",
		"ochi.kochi.jp",
		"okawa.kochi.jp",
		"otoyo.kochi.jp",
		"otsuki.kochi.jp",
		"sakawa.kochi.jp",
		"sukumo.kochi.jp",
		"susaki.kochi.jp",
		"tosa.kochi.jp",
		"tosashimizu.kochi.jp",
		"toyo.kochi.jp",
		"tsuno.kochi.jp",
		"umaji.kochi.jp",
		"yasuda.kochi.jp",
		"yusuhara.kochi.jp",
		"amakusa.kumamoto.jp",
		"arao.kumamoto.jp",
		"aso.kumamoto.jp",
		"choyo.kumamoto.jp",
		"gyokuto.kumamoto.jp",
		"kamiamakusa.kumamoto.jp",
		"kikuchi.kumamoto.jp",
		"kumamoto.kumamoto.jp",
		"mashiki.kumamoto.jp",
		"mifune.kumamoto.jp",
		"minamata.kumamoto.jp",
		"minamioguni.kumamoto.jp",
		"nagasu.kumamoto.jp",
		"nishihara.kumamoto.jp",
		"oguni.kumamoto.jp",
		"ozu.kumamoto.jp",
		"sumoto.kumamoto.jp",
		"takamori.kumamoto.jp",
		"uki.kumamoto.jp",
		"uto.kumamoto.jp",
		"yamaga.kumamoto.jp",
		"yamato.kumamoto.jp",
		"yatsushiro.kumamoto.jp",
		"ayabe.kyoto.jp",
		"fukuchiyama.kyoto.jp",
		"higashiyama.kyoto.jp",
		"ide.kyoto.jp",
		"ine.kyoto.jp",
		"joyo.kyoto.jp",
		"kameoka.kyoto.jp",
		"kamo.kyoto.jp",
		"kita.kyoto.jp",
		"kizu.kyoto.jp",
		"kumiyama.kyoto.jp",
		"kyotamba.kyoto.jp",
		"kyotanabe.kyoto.jp",
		"kyotango.kyoto.jp",
		"maizuru.kyoto.jp",
		"minami.kyoto.jp",
		"minamiyamashiro.kyoto.jp",
		"miyazu.kyoto.jp",
		"muko.kyoto.jp",
		"nagaokakyo.kyoto.jp",
		"nakagyo.kyoto.jp",
		"nantan.kyoto.jp",
		"oyamazaki.kyoto.jp",
		"sakyo.kyoto.jp",
		"seika.kyoto.jp",
		"tanabe.kyoto.jp",
		"uji.kyoto.jp",
		"ujitawara.kyoto.jp",
		"wazuka.kyoto.jp",
		"yamashina.kyoto.jp",
		"yawata.kyoto.jp",
		"asahi.mie.jp",
		"inabe.mie.jp",
		"ise.mie.jp",
		"kameyama.mie.jp",
		"kawagoe.mie.jp",
		"kiho.mie.jp",
		"kisosaki.mie.jp",
		"kiwa.mie.jp",
		"komono.mie.jp",
		"kumano.mie.jp",
		"kuwana.mie.jp",
		"matsusaka.mie.jp",
		"meiwa.mie.jp",
		"mihama.mie.jp",
		"minamiise.mie.jp",
		"misugi.mie.jp",
		"miyama.mie.jp",
		"nabari.mie.jp",
		"shima.mie.jp",
		"suzuka.mie.jp",
		"tado.mie.jp",
		"taiki.mie.jp",
		"taki.mie.jp",
		"tamaki.mie.jp",
		"toba.mie.jp",
		"tsu.mie.jp",
		"udono.mie.jp",
		"ureshino.mie.jp",
		"watarai.mie.jp",
		"yokkaichi.mie.jp",
		"furukawa.miyagi.jp",
		"higashimatsushima.miyagi.jp",
		"ishinomaki.miyagi.jp",
		"iwanuma.miyagi.jp",
		"kakuda.miyagi.jp",
		"kami.miyagi.jp",
		"kawasaki.miyagi.jp",
		"marumori.miyagi.jp",
		"matsushima.miyagi.jp",
		"minamisanriku.miyagi.jp",
		"misato.miyagi.jp",
		"murata.miyagi.jp",
		"natori.miyagi.jp",
		"ogawara.miyagi.jp",
		"ohira.miyagi.jp",
		"onagawa.miyagi.jp",
		"osaki.miyagi.jp",
		"rifu.miyagi.jp",
		"semine.miyagi.jp",
		"shibata.miyagi.jp",
		"shichikashuku.miyagi.jp",
		"shikama.miyagi.jp",
		"shiogama.miyagi.jp",
		"shiroishi.miyagi.jp",
		"tagajo.miyagi.jp",
		"taiwa.miyagi.jp",
		"tome.miyagi.jp",
		"tomiya.miyagi.jp",
		"wakuya.miyagi.jp",
		"watari.miyagi.jp",
		"yamamoto.miyagi.jp",
		"zao.miyagi.jp",
		"aya.miyazaki.jp",
		"ebino.miyazaki.jp",
		"gokase.miyazaki.jp",
		"hyuga.miyazaki.jp",
		"kadogawa.miyazaki.jp",
		"kawaminami.miyazaki.jp",
		"kijo.miyazaki.jp",
		"kitagawa.miyazaki.jp",
		"kitakata.miyazaki.jp",
		"kitaura.miyazaki.jp",
		"kobayashi.miyazaki.jp",
		"kunitomi.miyazaki.jp",
		"kushima.miyazaki.jp",
		"mimata.miyazaki.jp",
		"miyakonojo.miyazaki.jp",
		"miyazaki.miyazaki.jp",
		"morotsuka.miyazaki.jp",
		"nichinan.miyazaki.jp",
		"nishimera.miyazaki.jp",
		"nobeoka.miyazaki.jp",
		"saito.miyazaki.jp",
		"shiiba.miyazaki.jp",
		"shintomi.miyazaki.jp",
		"takaharu.miyazaki.jp",
		"takanabe.miyazaki.jp",
		"takazaki.miyazaki.jp",
		"tsuno.miyazaki.jp",
		"achi.nagano.jp",
		"agematsu.nagano.jp",
		"anan.nagano.jp",
		"aoki.nagano.jp",
		"asahi.nagano.jp",
		"azumino.nagano.jp",
		"chikuhoku.nagano.jp",
		"chikuma.nagano.jp",
		"chino.nagano.jp",
		"fujimi.nagano.jp",
		"hakuba.nagano.jp",
		"hara.nagano.jp",
		"hiraya.nagano.jp",
		"iida.nagano.jp",
		"iijima.nagano.jp",
		"iiyama.nagano.jp",
		"iizuna.nagano.jp",
		"ikeda.nagano.jp",
		"ikusaka.nagano.jp",
		"ina.nagano.jp",
		"karuizawa.nagano.jp",
		"kawakami.nagano.jp",
		"kiso.nagano.jp",
		"kisofukushima.nagano.jp",
		"kitaaiki.nagano.jp",
		"komagane.nagano.jp",
		"komoro.nagano.jp",
		"matsukawa.nagano.jp",
		"matsumoto.nagano.jp",
		"miasa.nagano.jp",
		"minamiaiki.nagano.jp",
		"minamimaki.nagano.jp",
		"minamiminowa.nagano.jp",
		"minowa.nagano.jp",
		"miyada.nagano.jp",
		"miyota.nagano.jp",
		"mochizuki.nagano.jp",
		"nagano.nagano.jp",
		"nagawa.nagano.jp",
		"nagiso.nagano.jp",
		"nakagawa.nagano.jp",
		"nakano.nagano.jp",
		"nozawaonsen.nagano.jp",
		"obuse.nagano.jp",
		"ogawa.nagano.jp",
		"okaya.nagano.jp",
		"omachi.nagano.jp",
		"omi.nagano.jp",
		"ookuwa.nagano.jp",
		"ooshika.nagano.jp",
		"otaki.nagano.jp",
		"otari.nagano.jp",
		"sakae.nagano.jp",
		"sakaki.nagano.jp",
		"saku.nagano.jp",
		"sakuho.nagano.jp",
		"shimosuwa.nagano.jp",
		"shinanomachi.nagano.jp",
		"shiojiri.nagano.jp",
		"suwa.nagano.jp",
		"suzaka.nagano.jp",
		"takagi.nagano.jp",
		"takamori.nagano.jp",
		"takayama.nagano.jp",
		"tateshina.nagano.jp",
		"tatsuno.nagano.jp",
		"togakushi.nagano.jp",
		"togura.nagano.jp",
		"tomi.nagano.jp",
		"ueda.nagano.jp",
		"wada.nagano.jp",
		"yamagata.nagano.jp",
		"yamanouchi.nagano.jp",
		"yasaka.nagano.jp",
		"yasuoka.nagano.jp",
		"chijiwa.nagasaki.jp",
		"futsu.nagasaki.jp",
		"goto.nagasaki.jp",
		"hasami.nagasaki.jp",
		"hirado.nagasaki.jp",
		"iki.nagasaki.jp",
		"isahaya.nagasaki.jp",
		"kawatana.nagasaki.jp",
		"kuchinotsu.nagasaki.jp",
		"matsuura.nagasaki.jp",
		"nagasaki.nagasaki.jp",
		"obama.nagasaki.jp",
		"omura.nagasaki.jp",
		"oseto.nagasaki.jp",
		"saikai.nagasaki.jp",
		"sasebo.nagasaki.jp",
		"seihi.nagasaki.jp",
		"shimabara.nagasaki.jp",
		"shinkamigoto.nagasaki.jp",
		"togitsu.nagasaki.jp",
		"tsushima.nagasaki.jp",
		"unzen.nagasaki.jp",
		"ando.nara.jp",
		"gose.nara.jp",
		"heguri.nara.jp",
		"higashiyoshino.nara.jp",
		"ikaruga.nara.jp",
		"ikoma.nara.jp",
		"kamikitayama.nara.jp",
		"kanmaki.nara.jp",
		"kashiba.nara.jp",
		"kashihara.nara.jp",
		"katsuragi.nara.jp",
		"kawai.nara.jp",
		"kawakami.nara.jp",
		"kawanishi.nara.jp",
		"koryo.nara.jp",
		"kurotaki.nara.jp",
		"mitsue.nara.jp",
		"miyake.nara.jp",
		"nara.nara.jp",
		"nosegawa.nara.jp",
		"oji.nara.jp",
		"ouda.nara.jp",
		"oyodo.nara.jp",
		"sakurai.nara.jp",
		"sango.nara.jp",
		"shimoichi.nara.jp",
		"shimokitayama.nara.jp",
		"shinjo.nara.jp",
		"soni.nara.jp",
		"takatori.nara.jp",
		"tawaramoto.nara.jp",
		"tenkawa.nara.jp",
		"tenri.nara.jp",
		"uda.nara.jp",
		"yamatokoriyama.nara.jp",
		"yamatotakada.nara.jp",
		"yamazoe.nara.jp",
		"yoshino.nara.jp",
		"aga.niigata.jp",
		"agano.niigata.jp",
		"gosen.niigata.jp",
		"itoigawa.niigata.jp",
		"izumozaki.niigata.jp",
		"joetsu.niigata.jp",
		"kamo.niigata.jp",
		"kariwa.niigata.jp",
		"kashiwazaki.niigata.jp",
		"minamiuonuma.niigata.jp",
		"mitsuke.niigata.jp",
		"muika.niigata.jp",
		"murakami.niigata.jp",
		"myoko.niigata.jp",
		"nagaoka.niigata.jp",
		"niigata.niigata.jp",
		"ojiya.niigata.jp",
		"omi.niigata.jp",
		"sado.niigata.jp",
		"sanjo.niigata.jp",
		"seiro.niigata.jp",
		"seirou.niigata.jp",
		"sekikawa.niigata.jp",
		"shibata.niigata.jp",
		"tagami.niigata.jp",
		"tainai.niigata.jp",
		"tochio.niigata.jp",
		"tokamachi.niigata.jp",
		"tsubame.niigata.jp",
		"tsunan.niigata.jp",
		"uonuma.niigata.jp",
		"yahiko.niigata.jp",
		"yoita.niigata.jp",
		"yuzawa.niigata.jp",
		"beppu.oita.jp",
		"bungoono.oita.jp",
		"bungotakada.oita.jp",
		"hasama.oita.jp",
		"hiji.oita.jp",
		"himeshima.oita.jp",
		"hita.oita.jp",
		"kamitsue.oita.jp",
		"kokonoe.oita.jp",
		"kuju.oita.jp",
		"kunisaki.oita.jp",
		"kusu.oita.jp",
		"oita.oita.jp",
		"saiki.oita.jp",
		"taketa.oita.jp",
		"tsukumi.oita.jp",
		"usa.oita.jp",
		"usuki.oita.jp",
		"yufu.oita.jp",
		"akaiwa.okayama.jp",
		"asakuchi.okayama.jp",
		"bizen.okayama.jp",
		"hayashima.okayama.jp",
		"ibara.okayama.jp",
		"kagamino.okayama.jp",
		"kasaoka.okayama.jp",
		"kibichuo.okayama.jp",
		"kumenan.okayama.jp",
		"kurashiki.okayama.jp",
		"maniwa.okayama.jp",
		"misaki.okayama.jp",
		"nagi.okayama.jp",
		"niimi.okayama.jp",
		"nishiawakura.okayama.jp",
		"okayama.okayama.jp",
		"satosho.okayama.jp",
		"setouchi.okayama.jp",
		"shinjo.okayama.jp",
		"shoo.okayama.jp",
		"soja.okayama.jp",
		"takahashi.okayama.jp",
		"tamano.okayama.jp",
		"tsuyama.okayama.jp",
		"wake.okayama.jp",
		"yakage.okayama.jp",
		"aguni.okinawa.jp",
		"ginowan.okinawa.jp",
		"ginoza.okinawa.jp",
		"gushikami.okinawa.jp",
		"haebaru.okinawa.jp",
		"higashi.okinawa.jp",
		"hirara.okinawa.jp",
		"iheya.okinawa.jp",
		"ishigaki.okinawa.jp",
		"ishikawa.okinawa.jp",
		"itoman.okinawa.jp",
		"izena.okinawa.jp",
		"kadena.okinawa.jp",
		"kin.okinawa.jp",
		"kitadaito.okinawa.jp",
		"kitanakagusuku.okinawa.jp",
		"kumejima.okinawa.jp",
		"kunigami.okinawa.jp",
		"minamidaito.okinawa.jp",
		"motobu.okinawa.jp",
		"nago.okinawa.jp",
		"naha.okinawa.jp",
		"nakagusuku.okinawa.jp",
		"nakijin.okinawa.jp",
		"nanjo.okinawa.jp",
		"nishihara.okinawa.jp",
		"ogimi.okinawa.jp",
		"okinawa.okinawa.jp",
		"onna.okinawa.jp",
		"shimoji.okinawa.jp",
		"taketomi.okinawa.jp",
		"tarama.okinawa.jp",
		"tokashiki.okinawa.jp",
		"tomigusuku.okinawa.jp",
		"tonaki.okinawa.jp",
		"urasoe.okinawa.jp",
		"uruma.okinawa.jp",
		"yaese.okinawa.jp",
		"yomitan.okinawa.jp",
		"yonabaru.okinawa.jp",
		"yonaguni.okinawa.jp",
		"zamami.okinawa.jp",
		"abeno.osaka.jp",
		"chihayaakasaka.osaka.jp",
		"chuo.osaka.jp",
		"daito.osaka.jp",
		"fujiidera.osaka.jp",
		"habikino.osaka.jp",
		"hannan.osaka.jp",
		"higashiosaka.osaka.jp",
		"higashisumiyoshi.osaka.jp",
		"higashiyodogawa.osaka.jp",
		"hirakata.osaka.jp",
		"ibaraki.osaka.jp",
		"ikeda.osaka.jp",
		"izumi.osaka.jp",
		"izumiotsu.osaka.jp",
		"izumisano.osaka.jp",
		"kadoma.osaka.jp",
		"kaizuka.osaka.jp",
		"kanan.osaka.jp",
		"kashiwara.osaka.jp",
		"katano.osaka.jp",
		"kawachinagano.osaka.jp",
		"kishiwada.osaka.jp",
		"kita.osaka.jp",
		"kumatori.osaka.jp",
		"matsubara.osaka.jp",
		"minato.osaka.jp",
		"minoh.osaka.jp",
		"misaki.osaka.jp",
		"moriguchi.osaka.jp",
		"neyagawa.osaka.jp",
		"nishi.osaka.jp",
		"nose.osaka.jp",
		"osakasayama.osaka.jp",
		"sakai.osaka.jp",
		"sayama.osaka.jp",
		"sennan.osaka.jp",
		"settsu.osaka.jp",
		"shijonawate.osaka.jp",
		"shimamoto.osaka.jp",
		"suita.osaka.jp",
		"tadaoka.osaka.jp",
		"taishi.osaka.jp",
		"tajiri.osaka.jp",
		"takaishi.osaka.jp",
		"takatsuki.osaka.jp",
		"tondabayashi.osaka.jp",
		"toyonaka.osaka.jp",
		"toyono.osaka.jp",
		"yao.osaka.jp",
		"ariake.saga.jp",
		"arita.saga.jp",
		"fukudomi.saga.jp",
		"genkai.saga.jp",
		"hamatama.saga.jp",
		"hizen.saga.jp",
		"imari.saga.jp",
		"kamimine.saga.jp",
		"kanzaki.saga.jp",
		"karatsu.saga.jp",
		"kashima.saga.jp",
		"kitagata.saga.jp",
		"kitahata.saga.jp",
		"kiyama.saga.jp",
		"kouhoku.saga.jp",
		"kyuragi.saga.jp",
		"nishiarita.saga.jp",
		"ogi.saga.jp",
		"omachi.saga.jp",
		"ouchi.saga.jp",
		"saga.saga.jp",
		"shiroishi.saga.jp",
		"taku.saga.jp",
		"tara.saga.jp",
		"tosu.saga.jp",
		"yoshinogari.saga.jp",
		"arakawa.saitama.jp",
		"asaka.saitama.jp",
		"chichibu.saitama.jp",
		"fujimi.saitama.jp",
		"fujimino.saitama.jp",
		"fukaya.saitama.jp",
		"hanno.saitama.jp",
		"hanyu.saitama.jp",
		"hasuda.saitama.jp",
		"hatogaya.saitama.jp",
		"hatoyama.saitama.jp",
		"hidaka.saitama.jp",
		"higashichichibu.saitama.jp",
		"higashimatsuyama.saitama.jp",
		"honjo.saitama.jp",
		"ina.saitama.jp",
		"iruma.saitama.jp",
		"iwatsuki.saitama.jp",
		"kamiizumi.saitama.jp",
		"kamikawa.saitama.jp",
		"kamisato.saitama.jp",
		"kasukabe.saitama.jp",
		"kawagoe.saitama.jp",
		"kawaguchi.saitama.jp",
		"kawajima.saitama.jp",
		"kazo.saitama.jp",
		"kitamoto.saitama.jp",
		"koshigaya.saitama.jp",
		"kounosu.saitama.jp",
		"kuki.saitama.jp",
		"kumagaya.saitama.jp",
		"matsubushi.saitama.jp",
		"minano.saitama.jp",
		"misato.saitama.jp",
		"miyashiro.saitama.jp",
		"miyoshi.saitama.jp",
		"moroyama.saitama.jp",
		"nagatoro.saitama.jp",
		"namegawa.saitama.jp",
		"niiza.saitama.jp",
		"ogano.saitama.jp",
		"ogawa.saitama.jp",
		"ogose.saitama.jp",
		"okegawa.saitama.jp",
		"omiya.saitama.jp",
		"otaki.saitama.jp",
		"ranzan.saitama.jp",
		"ryokami.saitama.jp",
		"saitama.saitama.jp",
		"sakado.saitama.jp",
		"satte.saitama.jp",
		"sayama.saitama.jp",
		"shiki.saitama.jp",
		"shiraoka.saitama.jp",
		"soka.saitama.jp",
		"sugito.saitama.jp",
		"toda.saitama.jp",
		"tokigawa.saitama.jp",
		"tokorozawa.saitama.jp",
		"tsurugashima.saitama.jp",
		"urawa.saitama.jp",
		"warabi.saitama.jp",
		"yashio.saitama.jp",
		"yokoze.saitama.jp",
		"yono.saitama.jp",
		"yorii.saitama.jp",
		"yoshida.saitama.jp",
		"yoshikawa.saitama.jp",
		"yoshimi.saitama.jp",
		"aisho.shiga.jp",
		"gamo.shiga.jp",
		"higashiomi.shiga.jp",
		"hikone.shiga.jp",
		"koka.shiga.jp",
		"konan.shiga.jp",
		"kosei.shiga.jp",
		"koto.shiga.jp",
		"kusatsu.shiga.jp",
		"maibara.shiga.jp",
		"moriyama.shiga.jp",
		"nagahama.shiga.jp",
		"nishiazai.shiga.jp",
		"notogawa.shiga.jp",
		"omihachiman.shiga.jp",
		"otsu.shiga.jp",
		"ritto.shiga.jp",
		"ryuoh.shiga.jp",
		"takashima.shiga.jp",
		"takatsuki.shiga.jp",
		"torahime.shiga.jp",
		"toyosato.shiga.jp",
		"yasu.shiga.jp",
		"akagi.shimane.jp",
		"ama.shimane.jp",
		"gotsu.shimane.jp",
		"hamada.shimane.jp",
		"higashiizumo.shimane.jp",
		"hikawa.shimane.jp",
		"hikimi.shimane.jp",
		"izumo.shimane.jp",
		"kakinoki.shimane.jp",
		"masuda.shimane.jp",
		"matsue.shimane.jp",
		"misato.shimane.jp",
		"nishinoshima.shimane.jp",
		"ohda.shimane.jp",
		"okinoshima.shimane.jp",
		"okuizumo.shimane.jp",
		"shimane.shimane.jp",
		"tamayu.shimane.jp",
		"tsuwano.shimane.jp",
		"unnan.shimane.jp",
		"yakumo.shimane.jp",
		"yasugi.shimane.jp",
		"yatsuka.shimane.jp",
		"arai.shizuoka.jp",
		"atami.shizuoka.jp",
		"fuji.shizuoka.jp",
		"fujieda.shizuoka.jp",
		"fujikawa.shizuoka.jp",
		"fujinomiya.shizuoka.jp",
		"fukuroi.shizuoka.jp",
		"gotemba.shizuoka.jp",
		"haibara.shizuoka.jp",
		"hamamatsu.shizuoka.jp",
		"higashiizu.shizuoka.jp",
		"ito.shizuoka.jp",
		"iwata.shizuoka.jp",
		"izu.shizuoka.jp",
		"izunokuni.shizuoka.jp",
		"kakegawa.shizuoka.jp",
		"kannami.shizuoka.jp",
		"kawanehon.shizuoka.jp",
		"kawazu.shizuoka.jp",
		"kikugawa.shizuoka.jp",
		"kosai.shizuoka.jp",
		"makinohara.shizuoka.jp",
		"matsuzaki.shizuoka.jp",
		"minamiizu.shizuoka.jp",
		"mishima.shizuoka.jp",
		"morimachi.shizuoka.jp",
		"nishiizu.shizuoka.jp",
		"numazu.shizuoka.jp",
		"omaezaki.shizuoka.jp",
		"shimada.shizuoka.jp",
		"shimizu.shizuoka.jp",
		"shimoda.shizuoka.jp",
		"shizuoka.shizuoka.jp",
		"susono.shizuoka.jp",
		"yaizu.shizuoka.jp",
		"yoshida.shizuoka.jp",
		"ashikaga.tochigi.jp",
		"bato.tochigi.jp",
		"haga.tochigi.jp",
		"ichikai.tochigi.jp",
		"iwafune.tochigi.jp",
		"kaminokawa.tochigi.jp",
		"kanuma.tochigi.jp",
		"karasuyama.tochigi.jp",
		"kuroiso.tochigi.jp",
		"mashiko.tochigi.jp",
		"mibu.tochigi.jp",
		"moka.tochigi.jp",
		"motegi.tochigi.jp",
		"nasu.tochigi.jp",
		"nasushiobara.tochigi.jp",
		"nikko.tochigi.jp",
		"nishikata.tochigi.jp",
		"nogi.tochigi.jp",
		"ohira.tochigi.jp",
		"ohtawara.tochigi.jp",
		"oyama.tochigi.jp",
		"sakura.tochigi.jp",
		"sano.tochigi.jp",
		"shimotsuke.tochigi.jp",
		"shioya.tochigi.jp",
		"takanezawa.tochigi.jp",
		"tochigi.tochigi.jp",
		"tsuga.tochigi.jp",
		"ujiie.tochigi.jp",
		"utsunomiya.tochigi.jp",
		"yaita.tochigi.jp",
		"aizumi.tokushima.jp",
		"anan.tokushima.jp",
		"ichiba.tokushima.jp",
		"itano.tokushima.jp",
		"kainan.tokushima.jp",
		"komatsushima.tokushima.jp",
		"matsushige.tokushima.jp",
		"mima.tokushima.jp",
		"minami.tokushima.jp",
		"miyoshi.tokushima.jp",
		"mugi.tokushima.jp",
		"nakagawa.tokushima.jp",
		"naruto.tokushima.jp",
		"sanagochi.tokushima.jp",
		"shishikui.tokushima.jp",
		"tokushima.tokushima.jp",
		"wajiki.tokushima.jp",
		"adachi.tokyo.jp",
		"akiruno.tokyo.jp",
		"akishima.tokyo.jp",
		"aogashima.tokyo.jp",
		"arakawa.tokyo.jp",
		"bunkyo.tokyo.jp",
		"chiyoda.tokyo.jp",
		"chofu.tokyo.jp",
		"chuo.tokyo.jp",
		"edogawa.tokyo.jp",
		"fuchu.tokyo.jp",
		"fussa.tokyo.jp",
		"hachijo.tokyo.jp",
		"hachioji.tokyo.jp",
		"hamura.tokyo.jp",
		"higashikurume.tokyo.jp",
		"higashimurayama.tokyo.jp",
		"higashiyamato.tokyo.jp",
		"hino.tokyo.jp",
		"hinode.tokyo.jp",
		"hinohara.tokyo.jp",
		"inagi.tokyo.jp",
		"itabashi.tokyo.jp",
		"katsushika.tokyo.jp",
		"kita.tokyo.jp",
		"kiyose.tokyo.jp",
		"kodaira.tokyo.jp",
		"koganei.tokyo.jp",
		"kokubunji.tokyo.jp",
		"komae.tokyo.jp",
		"koto.tokyo.jp",
		"kouzushima.tokyo.jp",
		"kunitachi.tokyo.jp",
		"machida.tokyo.jp",
		"meguro.tokyo.jp",
		"minato.tokyo.jp",
		"mitaka.tokyo.jp",
		"mizuho.tokyo.jp",
		"musashimurayama.tokyo.jp",
		"musashino.tokyo.jp",
		"nakano.tokyo.jp",
		"nerima.tokyo.jp",
		"ogasawara.tokyo.jp",
		"okutama.tokyo.jp",
		"ome.tokyo.jp",
		"oshima.tokyo.jp",
		"ota.tokyo.jp",
		"setagaya.tokyo.jp",
		"shibuya.tokyo.jp",
		"shinagawa.tokyo.jp",
		"shinjuku.tokyo.jp",
		"suginami.tokyo.jp",
		"sumida.tokyo.jp",
		"tachikawa.tokyo.jp",
		"taito.tokyo.jp",
		"tama.tokyo.jp",
		"toshima.tokyo.jp",
		"chizu.tottori.jp",
		"hino.tottori.jp",
		"kawahara.tottori.jp",
		"koge.tottori.jp",
		"kotoura.tottori.jp",
		"misasa.tottori.jp",
		"nanbu.tottori.jp",
		"nichinan.tottori.jp",
		"sakaiminato.tottori.jp",
		"tottori.tottori.jp",
		"wakasa.tottori.jp",
		"yazu.tottori.jp",
		"yonago.tottori.jp",
		"asahi.toyama.jp",
		"fuchu.toyama.jp",
		"fukumitsu.toyama.jp",
		"funahashi.toyama.jp",
		"himi.toyama.jp",
		"imizu.toyama.jp",
		"inami.toyama.jp",
		"johana.toyama.jp",
		"kamiichi.toyama.jp",
		"kurobe.toyama.jp",
		"nakaniikawa.toyama.jp",
		"namerikawa.toyama.jp",
		"nanto.toyama.jp",
		"nyuzen.toyama.jp",
		"oyabe.toyama.jp",
		"taira.toyama.jp",
		"takaoka.toyama.jp",
		"tateyama.toyama.jp",
		"toga.toyama.jp",
		"tonami.toyama.jp",
		"toyama.toyama.jp",
		"unazuki.toyama.jp",
		"uozu.toyama.jp",
		"yamada.toyama.jp",
		"arida.wakayama.jp",
		"aridagawa.wakayama.jp",
		"gobo.wakayama.jp",
		"hashimoto.wakayama.jp",
		"hidaka.wakayama.jp",
		"hirogawa.wakayama.jp",
		"inami.wakayama.jp",
		"iwade.wakayama.jp",
		"kainan.wakayama.jp",
		"kamitonda.wakayama.jp",
		"katsuragi.wakayama.jp",
		"kimino.wakayama.jp",
		"kinokawa.wakayama.jp",
		"kitayama.wakayama.jp",
		"koya.wakayama.jp",
		"koza.wakayama.jp",
		"kozagawa.wakayama.jp",
		"kudoyama.wakayama.jp",
		"kushimoto.wakayama.jp",
		"mihama.wakayama.jp",
		"misato.wakayama.jp",
		"nachikatsuura.wakayama.jp",
		"shingu.wakayama.jp",
		"shirahama.wakayama.jp",
		"taiji.wakayama.jp",
		"tanabe.wakayama.jp",
		"wakayama.wakayama.jp",
		"yuasa.wakayama.jp",
		"yura.wakayama.jp",
		"asahi.yamagata.jp",
		"funagata.yamagata.jp",
		"higashine.yamagata.jp",
		"iide.yamagata.jp",
		"kahoku.yamagata.jp",
		"kaminoyama.yamagata.jp",
		"kaneyama.yamagata.jp",
		"kawanishi.yamagata.jp",
		"mamurogawa.yamagata.jp",
		"mikawa.yamagata.jp",
		"murayama.yamagata.jp",
		"nagai.yamagata.jp",
		"nakayama.yamagata.jp",
		"nanyo.yamagata.jp",
		"nishikawa.yamagata.jp",
		"obanazawa.yamagata.jp",
		"oe.yamagata.jp",
		"oguni.yamagata.jp",
		"ohkura.yamagata.jp",
		"oishida.yamagata.jp",
		"sagae.yamagata.jp",
		"sakata.yamagata.jp",
		"sakegawa.yamagata.jp",
		"shinjo.yamagata.jp",
		"shirataka.yamagata.jp",
		"shonai.yamagata.jp",
		"takahata.yamagata.jp",
		"tendo.yamagata.jp",
		"tozawa.yamagata.jp",
		"tsuruoka.yamagata.jp",
		"yamagata.yamagata.jp",
		"yamanobe.yamagata.jp",
		"yonezawa.yamagata.jp",
		"yuza.yamagata.jp",
		"abu.yamaguchi.jp",
		"hagi.yamaguchi.jp",
		"hikari.yamaguchi.jp",
		"hofu.yamaguchi.jp",
		"iwakuni.yamaguchi.jp",
		"kudamatsu.yamaguchi.jp",
		"mitou.yamaguchi.jp",
		"nagato.yamaguchi.jp",
		"oshima.yamaguchi.jp",
		"shimonoseki.yamaguchi.jp",
		"shunan.yamaguchi.jp",
		"tabuse.yamaguchi.jp",
		"tokuyama.yamaguchi.jp",
		"toyota.yamaguchi.jp",
		"ube.yamaguchi.jp",
		"yuu.yamaguchi.jp",
		"chuo.yamanashi.jp",
		"doshi.yamanashi.jp",
		"fuefuki.yamanashi.jp",
		"fujikawa.yamanashi.jp",
		"fujikawaguchiko.yamanashi.jp",
		"fujiyoshida.yamanashi.jp",
		"hayakawa.yamanashi.jp",
		"hokuto.yamanashi.jp",
		"ichikawamisato.yamanashi.jp",
		"kai.yamanashi.jp",
		"kofu.yamanashi.jp",
		"koshu.yamanashi.jp",
		"kosuge.yamanashi.jp",
		"minami-alps.yamanashi.jp",
		"minobu.yamanashi.jp",
		"nakamichi.yamanashi.jp",
		"nanbu.yamanashi.jp",
		"narusawa.yamanashi.jp",
		"nirasaki.yamanashi.jp",
		"nishikatsura.yamanashi.jp",
		"oshino.yamanashi.jp",
		"otsuki.yamanashi.jp",
		"showa.yamanashi.jp",
		"tabayama.yamanashi.jp",
		"tsuru.yamanashi.jp",
		"uenohara.yamanashi.jp",
		"yamanakako.yamanashi.jp",
		"yamanashi.yamanashi.jp",
		"ke",
		"ac.ke",
		"co.ke",
		"go.ke",
		"info.ke",
		"me.ke",
		"mobi.ke",
		"ne.ke",
		"or.ke",
		"sc.ke",
		"kg",
		"org.kg",
		"net.kg",
		"com.kg",
		"edu.kg",
		"gov.kg",
		"mil.kg",
		"*.kh",
		"ki",
		"edu.ki",
		"biz.ki",
		"net.ki",
		"org.ki",
		"gov.ki",
		"info.ki",
		"com.ki",
		"km",
		"org.km",
		"nom.km",
		"gov.km",
		"prd.km",
		"tm.km",
		"edu.km",
		"mil.km",
		"ass.km",
		"com.km",
		"coop.km",
		"asso.km",
		"presse.km",
		"medecin.km",
		"notaires.km",
		"pharmaciens.km",
		"veterinaire.km",
		"gouv.km",
		"kn",
		"net.kn",
		"org.kn",
		"edu.kn",
		"gov.kn",
		"kp",
		"com.kp",
		"edu.kp",
		"gov.kp",
		"org.kp",
		"rep.kp",
		"tra.kp",
		"kr",
		"ac.kr",
		"co.kr",
		"es.kr",
		"go.kr",
		"hs.kr",
		"kg.kr",
		"mil.kr",
		"ms.kr",
		"ne.kr",
		"or.kr",
		"pe.kr",
		"re.kr",
		"sc.kr",
		"busan.kr",
		"chungbuk.kr",
		"chungnam.kr",
		"daegu.kr",
		"daejeon.kr",
		"gangwon.kr",
		"gwangju.kr",
		"gyeongbuk.kr",
		"gyeonggi.kr",
		"gyeongnam.kr",
		"incheon.kr",
		"jeju.kr",
		"jeonbuk.kr",
		"jeonnam.kr",
		"seoul.kr",
		"ulsan.kr",
		"kw",
		"com.kw",
		"edu.kw",
		"emb.kw",
		"gov.kw",
		"ind.kw",
		"net.kw",
		"org.kw",
		"ky",
		"com.ky",
		"edu.ky",
		"net.ky",
		"org.ky",
		"kz",
		"org.kz",
		"edu.kz",
		"net.kz",
		"gov.kz",
		"mil.kz",
		"com.kz",
		"la",
		"int.la",
		"net.la",
		"info.la",
		"edu.la",
		"gov.la",
		"per.la",
		"com.la",
		"org.la",
		"lb",
		"com.lb",
		"edu.lb",
		"gov.lb",
		"net.lb",
		"org.lb",
		"lc",
		"com.lc",
		"net.lc",
		"co.lc",
		"org.lc",
		"edu.lc",
		"gov.lc",
		"li",
		"lk",
		"gov.lk",
		"sch.lk",
		"net.lk",
		"int.lk",
		"com.lk",
		"org.lk",
		"edu.lk",
		"ngo.lk",
		"soc.lk",
		"web.lk",
		"ltd.lk",
		"assn.lk",
		"grp.lk",
		"hotel.lk",
		"ac.lk",
		"lr",
		"com.lr",
		"edu.lr",
		"gov.lr",
		"org.lr",
		"net.lr",
		"ls",
		"ac.ls",
		"biz.ls",
		"co.ls",
		"edu.ls",
		"gov.ls",
		"info.ls",
		"net.ls",
		"org.ls",
		"sc.ls",
		"lt",
		"gov.lt",
		"lu",
		"lv",
		"com.lv",
		"edu.lv",
		"gov.lv",
		"org.lv",
		"mil.lv",
		"id.lv",
		"net.lv",
		"asn.lv",
		"conf.lv",
		"ly",
		"com.ly",
		"net.ly",
		"gov.ly",
		"plc.ly",
		"edu.ly",
		"sch.ly",
		"med.ly",
		"org.ly",
		"id.ly",
		"ma",
		"co.ma",
		"net.ma",
		"gov.ma",
		"org.ma",
		"ac.ma",
		"press.ma",
		"mc",
		"tm.mc",
		"asso.mc",
		"md",
		"me",
		"co.me",
		"net.me",
		"org.me",
		"edu.me",
		"ac.me",
		"gov.me",
		"its.me",
		"priv.me",
		"mg",
		"org.mg",
		"nom.mg",
		"gov.mg",
		"prd.mg",
		"tm.mg",
		"edu.mg",
		"mil.mg",
		"com.mg",
		"co.mg",
		"mh",
		"mil",
		"mk",
		"com.mk",
		"org.mk",
		"net.mk",
		"edu.mk",
		"gov.mk",
		"inf.mk",
		"name.mk",
		"ml",
		"com.ml",
		"edu.ml",
		"gouv.ml",
		"gov.ml",
		"net.ml",
		"org.ml",
		"presse.ml",
		"*.mm",
		"mn",
		"gov.mn",
		"edu.mn",
		"org.mn",
		"mo",
		"com.mo",
		"net.mo",
		"org.mo",
		"edu.mo",
		"gov.mo",
		"mobi",
		"mp",
		"mq",
		"mr",
		"gov.mr",
		"ms",
		"com.ms",
		"edu.ms",
		"gov.ms",
		"net.ms",
		"org.ms",
		"mt",
		"com.mt",
		"edu.mt",
		"net.mt",
		"org.mt",
		"mu",
		"com.mu",
		"net.mu",
		"org.mu",
		"gov.mu",
		"ac.mu",
		"co.mu",
		"or.mu",
		"museum",
		"academy.museum",
		"agriculture.museum",
		"air.museum",
		"airguard.museum",
		"alabama.museum",
		"alaska.museum",
		"amber.museum",
		"ambulance.museum",
		"american.museum",
		"americana.museum",
		"americanantiques.museum",
		"americanart.museum",
		"amsterdam.museum",
		"and.museum",
		"annefrank.museum",
		"anthro.museum",
		"anthropology.museum",
		"antiques.museum",
		"aquarium.museum",
		"arboretum.museum",
		"archaeological.museum",
		"archaeology.museum",
		"architecture.museum",
		"art.museum",
		"artanddesign.museum",
		"artcenter.museum",
		"artdeco.museum",
		"arteducation.museum",
		"artgallery.museum",
		"arts.museum",
		"artsandcrafts.museum",
		"asmatart.museum",
		"assassination.museum",
		"assisi.museum",
		"association.museum",
		"astronomy.museum",
		"atlanta.museum",
		"austin.museum",
		"australia.museum",
		"automotive.museum",
		"aviation.museum",
		"axis.museum",
		"badajoz.museum",
		"baghdad.museum",
		"bahn.museum",
		"bale.museum",
		"baltimore.museum",
		"barcelona.museum",
		"baseball.museum",
		"basel.museum",
		"baths.museum",
		"bauern.museum",
		"beauxarts.museum",
		"beeldengeluid.museum",
		"bellevue.museum",
		"bergbau.museum",
		"berkeley.museum",
		"berlin.museum",
		"bern.museum",
		"bible.museum",
		"bilbao.museum",
		"bill.museum",
		"birdart.museum",
		"birthplace.museum",
		"bonn.museum",
		"boston.museum",
		"botanical.museum",
		"botanicalgarden.museum",
		"botanicgarden.museum",
		"botany.museum",
		"brandywinevalley.museum",
		"brasil.museum",
		"bristol.museum",
		"british.museum",
		"britishcolumbia.museum",
		"broadcast.museum",
		"brunel.museum",
		"brussel.museum",
		"brussels.museum",
		"bruxelles.museum",
		"building.museum",
		"burghof.museum",
		"bus.museum",
		"bushey.museum",
		"cadaques.museum",
		"california.museum",
		"cambridge.museum",
		"can.museum",
		"canada.museum",
		"capebreton.museum",
		"carrier.museum",
		"cartoonart.museum",
		"casadelamoneda.museum",
		"castle.museum",
		"castres.museum",
		"celtic.museum",
		"center.museum",
		"chattanooga.museum",
		"cheltenham.museum",
		"chesapeakebay.museum",
		"chicago.museum",
		"children.museum",
		"childrens.museum",
		"childrensgarden.museum",
		"chiropractic.museum",
		"chocolate.museum",
		"christiansburg.museum",
		"cincinnati.museum",
		"cinema.museum",
		"circus.museum",
		"civilisation.museum",
		"civilization.museum",
		"civilwar.museum",
		"clinton.museum",
		"clock.museum",
		"coal.museum",
		"coastaldefence.museum",
		"cody.museum",
		"coldwar.museum",
		"collection.museum",
		"colonialwilliamsburg.museum",
		"coloradoplateau.museum",
		"columbia.museum",
		"columbus.museum",
		"communication.museum",
		"communications.museum",
		"community.museum",
		"computer.museum",
		"computerhistory.museum",
		"comunicações.museum",
		"contemporary.museum",
		"contemporaryart.museum",
		"convent.museum",
		"copenhagen.museum",
		"corporation.museum",
		"correios-e-telecomunicações.museum",
		"corvette.museum",
		"costume.museum",
		"countryestate.museum",
		"county.museum",
		"crafts.museum",
		"cranbrook.museum",
		"creation.museum",
		"cultural.museum",
		"culturalcenter.museum",
		"culture.museum",
		"cyber.museum",
		"cymru.museum",
		"dali.museum",
		"dallas.museum",
		"database.museum",
		"ddr.museum",
		"decorativearts.museum",
		"delaware.museum",
		"delmenhorst.museum",
		"denmark.museum",
		"depot.museum",
		"design.museum",
		"detroit.museum",
		"dinosaur.museum",
		"discovery.museum",
		"dolls.museum",
		"donostia.museum",
		"durham.museum",
		"eastafrica.museum",
		"eastcoast.museum",
		"education.museum",
		"educational.museum",
		"egyptian.museum",
		"eisenbahn.museum",
		"elburg.museum",
		"elvendrell.museum",
		"embroidery.museum",
		"encyclopedic.museum",
		"england.museum",
		"entomology.museum",
		"environment.museum",
		"environmentalconservation.museum",
		"epilepsy.museum",
		"essex.museum",
		"estate.museum",
		"ethnology.museum",
		"exeter.museum",
		"exhibition.museum",
		"family.museum",
		"farm.museum",
		"farmequipment.museum",
		"farmers.museum",
		"farmstead.museum",
		"field.museum",
		"figueres.museum",
		"filatelia.museum",
		"film.museum",
		"fineart.museum",
		"finearts.museum",
		"finland.museum",
		"flanders.museum",
		"florida.museum",
		"force.museum",
		"fortmissoula.museum",
		"fortworth.museum",
		"foundation.museum",
		"francaise.museum",
		"frankfurt.museum",
		"franziskaner.museum",
		"freemasonry.museum",
		"freiburg.museum",
		"fribourg.museum",
		"frog.museum",
		"fundacio.museum",
		"furniture.museum",
		"gallery.museum",
		"garden.museum",
		"gateway.museum",
		"geelvinck.museum",
		"gemological.museum",
		"geology.museum",
		"georgia.museum",
		"giessen.museum",
		"glas.museum",
		"glass.museum",
		"gorge.museum",
		"grandrapids.museum",
		"graz.museum",
		"guernsey.museum",
		"halloffame.museum",
		"hamburg.museum",
		"handson.museum",
		"harvestcelebration.museum",
		"hawaii.museum",
		"health.museum",
		"heimatunduhren.museum",
		"hellas.museum",
		"helsinki.museum",
		"hembygdsforbund.museum",
		"heritage.museum",
		"histoire.museum",
		"historical.museum",
		"historicalsociety.museum",
		"historichouses.museum",
		"historisch.museum",
		"historisches.museum",
		"history.museum",
		"historyofscience.museum",
		"horology.museum",
		"house.museum",
		"humanities.museum",
		"illustration.museum",
		"imageandsound.museum",
		"indian.museum",
		"indiana.museum",
		"indianapolis.museum",
		"indianmarket.museum",
		"intelligence.museum",
		"interactive.museum",
		"iraq.museum",
		"iron.museum",
		"isleofman.museum",
		"jamison.museum",
		"jefferson.museum",
		"jerusalem.museum",
		"jewelry.museum",
		"jewish.museum",
		"jewishart.museum",
		"jfk.museum",
		"journalism.museum",
		"judaica.museum",
		"judygarland.museum",
		"juedisches.museum",
		"juif.museum",
		"karate.museum",
		"karikatur.museum",
		"kids.museum",
		"koebenhavn.museum",
		"koeln.museum",
		"kunst.museum",
		"kunstsammlung.museum",
		"kunstunddesign.museum",
		"labor.museum",
		"labour.museum",
		"lajolla.museum",
		"lancashire.museum",
		"landes.museum",
		"lans.museum",
		"läns.museum",
		"larsson.museum",
		"lewismiller.museum",
		"lincoln.museum",
		"linz.museum",
		"living.museum",
		"livinghistory.museum",
		"localhistory.museum",
		"london.museum",
		"losangeles.museum",
		"louvre.museum",
		"loyalist.museum",
		"lucerne.museum",
		"luxembourg.museum",
		"luzern.museum",
		"mad.museum",
		"madrid.museum",
		"mallorca.museum",
		"manchester.museum",
		"mansion.museum",
		"mansions.museum",
		"manx.museum",
		"marburg.museum",
		"maritime.museum",
		"maritimo.museum",
		"maryland.museum",
		"marylhurst.museum",
		"media.museum",
		"medical.museum",
		"medizinhistorisches.museum",
		"meeres.museum",
		"memorial.museum",
		"mesaverde.museum",
		"michigan.museum",
		"midatlantic.museum",
		"military.museum",
		"mill.museum",
		"miners.museum",
		"mining.museum",
		"minnesota.museum",
		"missile.museum",
		"missoula.museum",
		"modern.museum",
		"moma.museum",
		"money.museum",
		"monmouth.museum",
		"monticello.museum",
		"montreal.museum",
		"moscow.museum",
		"motorcycle.museum",
		"muenchen.museum",
		"muenster.museum",
		"mulhouse.museum",
		"muncie.museum",
		"museet.museum",
		"museumcenter.museum",
		"museumvereniging.museum",
		"music.museum",
		"national.museum",
		"nationalfirearms.museum",
		"nationalheritage.museum",
		"nativeamerican.museum",
		"naturalhistory.museum",
		"naturalhistorymuseum.museum",
		"naturalsciences.museum",
		"nature.museum",
		"naturhistorisches.museum",
		"natuurwetenschappen.museum",
		"naumburg.museum",
		"naval.museum",
		"nebraska.museum",
		"neues.museum",
		"newhampshire.museum",
		"newjersey.museum",
		"newmexico.museum",
		"newport.museum",
		"newspaper.museum",
		"newyork.museum",
		"niepce.museum",
		"norfolk.museum",
		"north.museum",
		"nrw.museum",
		"nyc.museum",
		"nyny.museum",
		"oceanographic.museum",
		"oceanographique.museum",
		"omaha.museum",
		"online.museum",
		"ontario.museum",
		"openair.museum",
		"oregon.museum",
		"oregontrail.museum",
		"otago.museum",
		"oxford.museum",
		"pacific.museum",
		"paderborn.museum",
		"palace.museum",
		"paleo.museum",
		"palmsprings.museum",
		"panama.museum",
		"paris.museum",
		"pasadena.museum",
		"pharmacy.museum",
		"philadelphia.museum",
		"philadelphiaarea.museum",
		"philately.museum",
		"phoenix.museum",
		"photography.museum",
		"pilots.museum",
		"pittsburgh.museum",
		"planetarium.museum",
		"plantation.museum",
		"plants.museum",
		"plaza.museum",
		"portal.museum",
		"portland.museum",
		"portlligat.museum",
		"posts-and-telecommunications.museum",
		"preservation.museum",
		"presidio.museum",
		"press.museum",
		"project.museum",
		"public.museum",
		"pubol.museum",
		"quebec.museum",
		"railroad.museum",
		"railway.museum",
		"research.museum",
		"resistance.museum",
		"riodejaneiro.museum",
		"rochester.museum",
		"rockart.museum",
		"roma.museum",
		"russia.museum",
		"saintlouis.museum",
		"salem.museum",
		"salvadordali.museum",
		"salzburg.museum",
		"sandiego.museum",
		"sanfrancisco.museum",
		"santabarbara.museum",
		"santacruz.museum",
		"santafe.museum",
		"saskatchewan.museum",
		"satx.museum",
		"savannahga.museum",
		"schlesisches.museum",
		"schoenbrunn.museum",
		"schokoladen.museum",
		"school.museum",
		"schweiz.museum",
		"science.museum",
		"scienceandhistory.museum",
		"scienceandindustry.museum",
		"sciencecenter.museum",
		"sciencecenters.museum",
		"science-fiction.museum",
		"sciencehistory.museum",
		"sciences.museum",
		"sciencesnaturelles.museum",
		"scotland.museum",
		"seaport.museum",
		"settlement.museum",
		"settlers.museum",
		"shell.museum",
		"sherbrooke.museum",
		"sibenik.museum",
		"silk.museum",
		"ski.museum",
		"skole.museum",
		"society.museum",
		"sologne.museum",
		"soundandvision.museum",
		"southcarolina.museum",
		"southwest.museum",
		"space.museum",
		"spy.museum",
		"square.museum",
		"stadt.museum",
		"stalbans.museum",
		"starnberg.museum",
		"state.museum",
		"stateofdelaware.museum",
		"station.museum",
		"steam.museum",
		"steiermark.museum",
		"stjohn.museum",
		"stockholm.museum",
		"stpetersburg.museum",
		"stuttgart.museum",
		"suisse.museum",
		"surgeonshall.museum",
		"surrey.museum",
		"svizzera.museum",
		"sweden.museum",
		"sydney.museum",
		"tank.museum",
		"tcm.museum",
		"technology.museum",
		"telekommunikation.museum",
		"television.museum",
		"texas.museum",
		"textile.museum",
		"theater.museum",
		"time.museum",
		"timekeeping.museum",
		"topology.museum",
		"torino.museum",
		"touch.museum",
		"town.museum",
		"transport.museum",
		"tree.museum",
		"trolley.museum",
		"trust.museum",
		"trustee.museum",
		"uhren.museum",
		"ulm.museum",
		"undersea.museum",
		"university.museum",
		"usa.museum",
		"usantiques.museum",
		"usarts.museum",
		"uscountryestate.museum",
		"usculture.museum",
		"usdecorativearts.museum",
		"usgarden.museum",
		"ushistory.museum",
		"ushuaia.museum",
		"uslivinghistory.museum",
		"utah.museum",
		"uvic.museum",
		"valley.museum",
		"vantaa.museum",
		"versailles.museum",
		"viking.museum",
		"village.museum",
		"virginia.museum",
		"virtual.museum",
		"virtuel.museum",
		"vlaanderen.museum",
		"volkenkunde.museum",
		"wales.museum",
		"wallonie.museum",
		"war.museum",
		"washingtondc.museum",
		"watchandclock.museum",
		"watch-and-clock.museum",
		"western.museum",
		"westfalen.museum",
		"whaling.museum",
		"wildlife.museum",
		"williamsburg.museum",
		"windmill.museum",
		"workshop.museum",
		"york.museum",
		"yorkshire.museum",
		"yosemite.museum",
		"youth.museum",
		"zoological.museum",
		"zoology.museum",
		"ירושלים.museum",
		"иком.museum",
		"mv",
		"aero.mv",
		"biz.mv",
		"com.mv",
		"coop.mv",
		"edu.mv",
		"gov.mv",
		"info.mv",
		"int.mv",
		"mil.mv",
		"museum.mv",
		"name.mv",
		"net.mv",
		"org.mv",
		"pro.mv",
		"mw",
		"ac.mw",
		"biz.mw",
		"co.mw",
		"com.mw",
		"coop.mw",
		"edu.mw",
		"gov.mw",
		"int.mw",
		"museum.mw",
		"net.mw",
		"org.mw",
		"mx",
		"com.mx",
		"org.mx",
		"gob.mx",
		"edu.mx",
		"net.mx",
		"my",
		"biz.my",
		"com.my",
		"edu.my",
		"gov.my",
		"mil.my",
		"name.my",
		"net.my",
		"org.my",
		"mz",
		"ac.mz",
		"adv.mz",
		"co.mz",
		"edu.mz",
		"gov.mz",
		"mil.mz",
		"net.mz",
		"org.mz",
		"na",
		"info.na",
		"pro.na",
		"name.na",
		"school.na",
		"or.na",
		"dr.na",
		"us.na",
		"mx.na",
		"ca.na",
		"in.na",
		"cc.na",
		"tv.na",
		"ws.na",
		"mobi.na",
		"co.na",
		"com.na",
		"org.na",
		"name",
		"nc",
		"asso.nc",
		"nom.nc",
		"ne",
		"net",
		"nf",
		"com.nf",
		"net.nf",
		"per.nf",
		"rec.nf",
		"web.nf",
		"arts.nf",
		"firm.nf",
		"info.nf",
		"other.nf",
		"store.nf",
		"ng",
		"com.ng",
		"edu.ng",
		"gov.ng",
		"i.ng",
		"mil.ng",
		"mobi.ng",
		"name.ng",
		"net.ng",
		"org.ng",
		"sch.ng",
		"ni",
		"ac.ni",
		"biz.ni",
		"co.ni",
		"com.ni",
		"edu.ni",
		"gob.ni",
		"in.ni",
		"info.ni",
		"int.ni",
		"mil.ni",
		"net.ni",
		"nom.ni",
		"org.ni",
		"web.ni",
		"nl",
		"no",
		"fhs.no",
		"vgs.no",
		"fylkesbibl.no",
		"folkebibl.no",
		"museum.no",
		"idrett.no",
		"priv.no",
		"mil.no",
		"stat.no",
		"dep.no",
		"kommune.no",
		"herad.no",
		"aa.no",
		"ah.no",
		"bu.no",
		"fm.no",
		"hl.no",
		"hm.no",
		"jan-mayen.no",
		"mr.no",
		"nl.no",
		"nt.no",
		"of.no",
		"ol.no",
		"oslo.no",
		"rl.no",
		"sf.no",
		"st.no",
		"svalbard.no",
		"tm.no",
		"tr.no",
		"va.no",
		"vf.no",
		"gs.aa.no",
		"gs.ah.no",
		"gs.bu.no",
		"gs.fm.no",
		"gs.hl.no",
		"gs.hm.no",
		"gs.jan-mayen.no",
		"gs.mr.no",
		"gs.nl.no",
		"gs.nt.no",
		"gs.of.no",
		"gs.ol.no",
		"gs.oslo.no",
		"gs.rl.no",
		"gs.sf.no",
		"gs.st.no",
		"gs.svalbard.no",
		"gs.tm.no",
		"gs.tr.no",
		"gs.va.no",
		"gs.vf.no",
		"akrehamn.no",
		"åkrehamn.no",
		"algard.no",
		"ålgård.no",
		"arna.no",
		"brumunddal.no",
		"bryne.no",
		"bronnoysund.no",
		"brønnøysund.no",
		"drobak.no",
		"drøbak.no",
		"egersund.no",
		"fetsund.no",
		"floro.no",
		"florø.no",
		"fredrikstad.no",
		"hokksund.no",
		"honefoss.no",
		"hønefoss.no",
		"jessheim.no",
		"jorpeland.no",
		"jørpeland.no",
		"kirkenes.no",
		"kopervik.no",
		"krokstadelva.no",
		"langevag.no",
		"langevåg.no",
		"leirvik.no",
		"mjondalen.no",
		"mjøndalen.no",
		"mo-i-rana.no",
		"mosjoen.no",
		"mosjøen.no",
		"nesoddtangen.no",
		"orkanger.no",
		"osoyro.no",
		"osøyro.no",
		"raholt.no",
		"råholt.no",
		"sandnessjoen.no",
		"sandnessjøen.no",
		"skedsmokorset.no",
		"slattum.no",
		"spjelkavik.no",
		"stathelle.no",
		"stavern.no",
		"stjordalshalsen.no",
		"stjørdalshalsen.no",
		"tananger.no",
		"tranby.no",
		"vossevangen.no",
		"afjord.no",
		"åfjord.no",
		"agdenes.no",
		"al.no",
		"ål.no",
		"alesund.no",
		"ålesund.no",
		"alstahaug.no",
		"alta.no",
		"áltá.no",
		"alaheadju.no",
		"álaheadju.no",
		"alvdal.no",
		"amli.no",
		"åmli.no",
		"amot.no",
		"åmot.no",
		"andebu.no",
		"andoy.no",
		"andøy.no",
		"andasuolo.no",
		"ardal.no",
		"årdal.no",
		"aremark.no",
		"arendal.no",
		"ås.no",
		"aseral.no",
		"åseral.no",
		"asker.no",
		"askim.no",
		"askvoll.no",
		"askoy.no",
		"askøy.no",
		"asnes.no",
		"åsnes.no",
		"audnedaln.no",
		"aukra.no",
		"aure.no",
		"aurland.no",
		"aurskog-holand.no",
		"aurskog-høland.no",
		"austevoll.no",
		"austrheim.no",
		"averoy.no",
		"averøy.no",
		"balestrand.no",
		"ballangen.no",
		"balat.no",
		"bálát.no",
		"balsfjord.no",
		"bahccavuotna.no",
		"báhccavuotna.no",
		"bamble.no",
		"bardu.no",
		"beardu.no",
		"beiarn.no",
		"bajddar.no",
		"bájddar.no",
		"baidar.no",
		"báidár.no",
		"berg.no",
		"bergen.no",
		"berlevag.no",
		"berlevåg.no",
		"bearalvahki.no",
		"bearalváhki.no",
		"bindal.no",
		"birkenes.no",
		"bjarkoy.no",
		"bjarkøy.no",
		"bjerkreim.no",
		"bjugn.no",
		"bodo.no",
		"bodø.no",
		"badaddja.no",
		"bådåddjå.no",
		"budejju.no",
		"bokn.no",
		"bremanger.no",
		"bronnoy.no",
		"brønnøy.no",
		"bygland.no",
		"bykle.no",
		"barum.no",
		"bærum.no",
		"bo.telemark.no",
		"bø.telemark.no",
		"bo.nordland.no",
		"bø.nordland.no",
		"bievat.no",
		"bievát.no",
		"bomlo.no",
		"bømlo.no",
		"batsfjord.no",
		"båtsfjord.no",
		"bahcavuotna.no",
		"báhcavuotna.no",
		"dovre.no",
		"drammen.no",
		"drangedal.no",
		"dyroy.no",
		"dyrøy.no",
		"donna.no",
		"dønna.no",
		"eid.no",
		"eidfjord.no",
		"eidsberg.no",
		"eidskog.no",
		"eidsvoll.no",
		"eigersund.no",
		"elverum.no",
		"enebakk.no",
		"engerdal.no",
		"etne.no",
		"etnedal.no",
		"evenes.no",
		"evenassi.no",
		"evenášši.no",
		"evje-og-hornnes.no",
		"farsund.no",
		"fauske.no",
		"fuossko.no",
		"fuoisku.no",
		"fedje.no",
		"fet.no",
		"finnoy.no",
		"finnøy.no",
		"fitjar.no",
		"fjaler.no",
		"fjell.no",
		"flakstad.no",
		"flatanger.no",
		"flekkefjord.no",
		"flesberg.no",
		"flora.no",
		"fla.no",
		"flå.no",
		"folldal.no",
		"forsand.no",
		"fosnes.no",
		"frei.no",
		"frogn.no",
		"froland.no",
		"frosta.no",
		"frana.no",
		"fræna.no",
		"froya.no",
		"frøya.no",
		"fusa.no",
		"fyresdal.no",
		"forde.no",
		"førde.no",
		"gamvik.no",
		"gangaviika.no",
		"gáŋgaviika.no",
		"gaular.no",
		"gausdal.no",
		"gildeskal.no",
		"gildeskål.no",
		"giske.no",
		"gjemnes.no",
		"gjerdrum.no",
		"gjerstad.no",
		"gjesdal.no",
		"gjovik.no",
		"gjøvik.no",
		"gloppen.no",
		"gol.no",
		"gran.no",
		"grane.no",
		"granvin.no",
		"gratangen.no",
		"grimstad.no",
		"grong.no",
		"kraanghke.no",
		"kråanghke.no",
		"grue.no",
		"gulen.no",
		"hadsel.no",
		"halden.no",
		"halsa.no",
		"hamar.no",
		"hamaroy.no",
		"habmer.no",
		"hábmer.no",
		"hapmir.no",
		"hápmir.no",
		"hammerfest.no",
		"hammarfeasta.no",
		"hámmárfeasta.no",
		"haram.no",
		"hareid.no",
		"harstad.no",
		"hasvik.no",
		"aknoluokta.no",
		"ákŋoluokta.no",
		"hattfjelldal.no",
		"aarborte.no",
		"haugesund.no",
		"hemne.no",
		"hemnes.no",
		"hemsedal.no",
		"heroy.more-og-romsdal.no",
		"herøy.møre-og-romsdal.no",
		"heroy.nordland.no",
		"herøy.nordland.no",
		"hitra.no",
		"hjartdal.no",
		"hjelmeland.no",
		"hobol.no",
		"hobøl.no",
		"hof.no",
		"hol.no",
		"hole.no",
		"holmestrand.no",
		"holtalen.no",
		"holtålen.no",
		"hornindal.no",
		"horten.no",
		"hurdal.no",
		"hurum.no",
		"hvaler.no",
		"hyllestad.no",
		"hagebostad.no",
		"hægebostad.no",
		"hoyanger.no",
		"høyanger.no",
		"hoylandet.no",
		"høylandet.no",
		"ha.no",
		"hå.no",
		"ibestad.no",
		"inderoy.no",
		"inderøy.no",
		"iveland.no",
		"jevnaker.no",
		"jondal.no",
		"jolster.no",
		"jølster.no",
		"karasjok.no",
		"karasjohka.no",
		"kárášjohka.no",
		"karlsoy.no",
		"galsa.no",
		"gálsá.no",
		"karmoy.no",
		"karmøy.no",
		"kautokeino.no",
		"guovdageaidnu.no",
		"klepp.no",
		"klabu.no",
		"klæbu.no",
		"kongsberg.no",
		"kongsvinger.no",
		"kragero.no",
		"kragerø.no",
		"kristiansand.no",
		"kristiansund.no",
		"krodsherad.no",
		"krødsherad.no",
		"kvalsund.no",
		"rahkkeravju.no",
		"ráhkkerávju.no",
		"kvam.no",
		"kvinesdal.no",
		"kvinnherad.no",
		"kviteseid.no",
		"kvitsoy.no",
		"kvitsøy.no",
		"kvafjord.no",
		"kvæfjord.no",
		"giehtavuoatna.no",
		"kvanangen.no",
		"kvænangen.no",
		"navuotna.no",
		"návuotna.no",
		"kafjord.no",
		"kåfjord.no",
		"gaivuotna.no",
		"gáivuotna.no",
		"larvik.no",
		"lavangen.no",
		"lavagis.no",
		"loabat.no",
		"loabát.no",
		"lebesby.no",
		"davvesiida.no",
		"leikanger.no",
		"leirfjord.no",
		"leka.no",
		"leksvik.no",
		"lenvik.no",
		"leangaviika.no",
		"leaŋgaviika.no",
		"lesja.no",
		"levanger.no",
		"lier.no",
		"lierne.no",
		"lillehammer.no",
		"lillesand.no",
		"lindesnes.no",
		"lindas.no",
		"lindås.no",
		"lom.no",
		"loppa.no",
		"lahppi.no",
		"láhppi.no",
		"lund.no",
		"lunner.no",
		"luroy.no",
		"lurøy.no",
		"luster.no",
		"lyngdal.no",
		"lyngen.no",
		"ivgu.no",
		"lardal.no",
		"lerdal.no",
		"lærdal.no",
		"lodingen.no",
		"lødingen.no",
		"lorenskog.no",
		"lørenskog.no",
		"loten.no",
		"løten.no",
		"malvik.no",
		"masoy.no",
		"måsøy.no",
		"muosat.no",
		"muosát.no",
		"mandal.no",
		"marker.no",
		"marnardal.no",
		"masfjorden.no",
		"meland.no",
		"meldal.no",
		"melhus.no",
		"meloy.no",
		"meløy.no",
		"meraker.no",
		"meråker.no",
		"moareke.no",
		"moåreke.no",
		"midsund.no",
		"midtre-gauldal.no",
		"modalen.no",
		"modum.no",
		"molde.no",
		"moskenes.no",
		"moss.no",
		"mosvik.no",
		"malselv.no",
		"målselv.no",
		"malatvuopmi.no",
		"málatvuopmi.no",
		"namdalseid.no",
		"aejrie.no",
		"namsos.no",
		"namsskogan.no",
		"naamesjevuemie.no",
		"nååmesjevuemie.no",
		"laakesvuemie.no",
		"nannestad.no",
		"narvik.no",
		"narviika.no",
		"naustdal.no",
		"nedre-eiker.no",
		"nes.akershus.no",
		"nes.buskerud.no",
		"nesna.no",
		"nesodden.no",
		"nesseby.no",
		"unjarga.no",
		"unjárga.no",
		"nesset.no",
		"nissedal.no",
		"nittedal.no",
		"nord-aurdal.no",
		"nord-fron.no",
		"nord-odal.no",
		"norddal.no",
		"nordkapp.no",
		"davvenjarga.no",
		"davvenjárga.no",
		"nordre-land.no",
		"nordreisa.no",
		"raisa.no",
		"ráisa.no",
		"nore-og-uvdal.no",
		"notodden.no",
		"naroy.no",
		"nærøy.no",
		"notteroy.no",
		"nøtterøy.no",
		"odda.no",
		"oksnes.no",
		"øksnes.no",
		"oppdal.no",
		"oppegard.no",
		"oppegård.no",
		"orkdal.no",
		"orland.no",
		"ørland.no",
		"orskog.no",
		"ørskog.no",
		"orsta.no",
		"ørsta.no",
		"os.hedmark.no",
		"os.hordaland.no",
		"osen.no",
		"osteroy.no",
		"osterøy.no",
		"ostre-toten.no",
		"østre-toten.no",
		"overhalla.no",
		"ovre-eiker.no",
		"øvre-eiker.no",
		"oyer.no",
		"øyer.no",
		"oygarden.no",
		"øygarden.no",
		"oystre-slidre.no",
		"øystre-slidre.no",
		"porsanger.no",
		"porsangu.no",
		"porsáŋgu.no",
		"porsgrunn.no",
		"radoy.no",
		"radøy.no",
		"rakkestad.no",
		"rana.no",
		"ruovat.no",
		"randaberg.no",
		"rauma.no",
		"rendalen.no",
		"rennebu.no",
		"rennesoy.no",
		"rennesøy.no",
		"rindal.no",
		"ringebu.no",
		"ringerike.no",
		"ringsaker.no",
		"rissa.no",
		"risor.no",
		"risør.no",
		"roan.no",
		"rollag.no",
		"rygge.no",
		"ralingen.no",
		"rælingen.no",
		"rodoy.no",
		"rødøy.no",
		"romskog.no",
		"rømskog.no",
		"roros.no",
		"røros.no",
		"rost.no",
		"røst.no",
		"royken.no",
		"røyken.no",
		"royrvik.no",
		"røyrvik.no",
		"rade.no",
		"råde.no",
		"salangen.no",
		"siellak.no",
		"saltdal.no",
		"salat.no",
		"sálát.no",
		"sálat.no",
		"samnanger.no",
		"sande.more-og-romsdal.no",
		"sande.møre-og-romsdal.no",
		"sande.vestfold.no",
		"sandefjord.no",
		"sandnes.no",
		"sandoy.no",
		"sandøy.no",
		"sarpsborg.no",
		"sauda.no",
		"sauherad.no",
		"sel.no",
		"selbu.no",
		"selje.no",
		"seljord.no",
		"sigdal.no",
		"siljan.no",
		"sirdal.no",
		"skaun.no",
		"skedsmo.no",
		"ski.no",
		"skien.no",
		"skiptvet.no",
		"skjervoy.no",
		"skjervøy.no",
		"skierva.no",
		"skiervá.no",
		"skjak.no",
		"skjåk.no",
		"skodje.no",
		"skanland.no",
		"skånland.no",
		"skanit.no",
		"skánit.no",
		"smola.no",
		"smøla.no",
		"snillfjord.no",
		"snasa.no",
		"snåsa.no",
		"snoasa.no",
		"snaase.no",
		"snåase.no",
		"sogndal.no",
		"sokndal.no",
		"sola.no",
		"solund.no",
		"songdalen.no",
		"sortland.no",
		"spydeberg.no",
		"stange.no",
		"stavanger.no",
		"steigen.no",
		"steinkjer.no",
		"stjordal.no",
		"stjørdal.no",
		"stokke.no",
		"stor-elvdal.no",
		"stord.no",
		"stordal.no",
		"storfjord.no",
		"omasvuotna.no",
		"strand.no",
		"stranda.no",
		"stryn.no",
		"sula.no",
		"suldal.no",
		"sund.no",
		"sunndal.no",
		"surnadal.no",
		"sveio.no",
		"svelvik.no",
		"sykkylven.no",
		"sogne.no",
		"søgne.no",
		"somna.no",
		"sømna.no",
		"sondre-land.no",
		"søndre-land.no",
		"sor-aurdal.no",
		"sør-aurdal.no",
		"sor-fron.no",
		"sør-fron.no",
		"sor-odal.no",
		"sør-odal.no",
		"sor-varanger.no",
		"sør-varanger.no",
		"matta-varjjat.no",
		"mátta-várjjat.no",
		"sorfold.no",
		"sørfold.no",
		"sorreisa.no",
		"sørreisa.no",
		"sorum.no",
		"sørum.no",
		"tana.no",
		"deatnu.no",
		"time.no",
		"tingvoll.no",
		"tinn.no",
		"tjeldsund.no",
		"dielddanuorri.no",
		"tjome.no",
		"tjøme.no",
		"tokke.no",
		"tolga.no",
		"torsken.no",
		"tranoy.no",
		"tranøy.no",
		"tromso.no",
		"tromsø.no",
		"tromsa.no",
		"romsa.no",
		"trondheim.no",
		"troandin.no",
		"trysil.no",
		"trana.no",
		"træna.no",
		"trogstad.no",
		"trøgstad.no",
		"tvedestrand.no",
		"tydal.no",
		"tynset.no",
		"tysfjord.no",
		"divtasvuodna.no",
		"divttasvuotna.no",
		"tysnes.no",
		"tysvar.no",
		"tysvær.no",
		"tonsberg.no",
		"tønsberg.no",
		"ullensaker.no",
		"ullensvang.no",
		"ulvik.no",
		"utsira.no",
		"vadso.no",
		"vadsø.no",
		"cahcesuolo.no",
		"čáhcesuolo.no",
		"vaksdal.no",
		"valle.no",
		"vang.no",
		"vanylven.no",
		"vardo.no",
		"vardø.no",
		"varggat.no",
		"várggát.no",
		"vefsn.no",
		"vaapste.no",
		"vega.no",
		"vegarshei.no",
		"vegårshei.no",
		"vennesla.no",
		"verdal.no",
		"verran.no",
		"vestby.no",
		"vestnes.no",
		"vestre-slidre.no",
		"vestre-toten.no",
		"vestvagoy.no",
		"vestvågøy.no",
		"vevelstad.no",
		"vik.no",
		"vikna.no",
		"vindafjord.no",
		"volda.no",
		"voss.no",
		"varoy.no",
		"værøy.no",
		"vagan.no",
		"vågan.no",
		"voagat.no",
		"vagsoy.no",
		"vågsøy.no",
		"vaga.no",
		"vågå.no",
		"valer.ostfold.no",
		"våler.østfold.no",
		"valer.hedmark.no",
		"våler.hedmark.no",
		"*.np",
		"nr",
		"biz.nr",
		"info.nr",
		"gov.nr",
		"edu.nr",
		"org.nr",
		"net.nr",
		"com.nr",
		"nu",
		"nz",
		"ac.nz",
		"co.nz",
		"cri.nz",
		"geek.nz",
		"gen.nz",
		"govt.nz",
		"health.nz",
		"iwi.nz",
		"kiwi.nz",
		"maori.nz",
		"mil.nz",
		"māori.nz",
		"net.nz",
		"org.nz",
		"parliament.nz",
		"school.nz",
		"om",
		"co.om",
		"com.om",
		"edu.om",
		"gov.om",
		"med.om",
		"museum.om",
		"net.om",
		"org.om",
		"pro.om",
		"onion",
		"org",
		"pa",
		"ac.pa",
		"gob.pa",
		"com.pa",
		"org.pa",
		"sld.pa",
		"edu.pa",
		"net.pa",
		"ing.pa",
		"abo.pa",
		"med.pa",
		"nom.pa",
		"pe",
		"edu.pe",
		"gob.pe",
		"nom.pe",
		"mil.pe",
		"org.pe",
		"com.pe",
		"net.pe",
		"pf",
		"com.pf",
		"org.pf",
		"edu.pf",
		"*.pg",
		"ph",
		"com.ph",
		"net.ph",
		"org.ph",
		"gov.ph",
		"edu.ph",
		"ngo.ph",
		"mil.ph",
		"i.ph",
		"pk",
		"com.pk",
		"net.pk",
		"edu.pk",
		"org.pk",
		"fam.pk",
		"biz.pk",
		"web.pk",
		"gov.pk",
		"gob.pk",
		"gok.pk",
		"gon.pk",
		"gop.pk",
		"gos.pk",
		"info.pk",
		"pl",
		"com.pl",
		"net.pl",
		"org.pl",
		"aid.pl",
		"agro.pl",
		"atm.pl",
		"auto.pl",
		"biz.pl",
		"edu.pl",
		"gmina.pl",
		"gsm.pl",
		"info.pl",
		"mail.pl",
		"miasta.pl",
		"media.pl",
		"mil.pl",
		"nieruchomosci.pl",
		"nom.pl",
		"pc.pl",
		"powiat.pl",
		"priv.pl",
		"realestate.pl",
		"rel.pl",
		"sex.pl",
		"shop.pl",
		"sklep.pl",
		"sos.pl",
		"szkola.pl",
		"targi.pl",
		"tm.pl",
		"tourism.pl",
		"travel.pl",
		"turystyka.pl",
		"gov.pl",
		"ap.gov.pl",
		"ic.gov.pl",
		"is.gov.pl",
		"us.gov.pl",
		"kmpsp.gov.pl",
		"kppsp.gov.pl",
		"kwpsp.gov.pl",
		"psp.gov.pl",
		"wskr.gov.pl",
		"kwp.gov.pl",
		"mw.gov.pl",
		"ug.gov.pl",
		"um.gov.pl",
		"umig.gov.pl",
		"ugim.gov.pl",
		"upow.gov.pl",
		"uw.gov.pl",
		"starostwo.gov.pl",
		"pa.gov.pl",
		"po.gov.pl",
		"psse.gov.pl",
		"pup.gov.pl",
		"rzgw.gov.pl",
		"sa.gov.pl",
		"so.gov.pl",
		"sr.gov.pl",
		"wsa.gov.pl",
		"sko.gov.pl",
		"uzs.gov.pl",
		"wiih.gov.pl",
		"winb.gov.pl",
		"pinb.gov.pl",
		"wios.gov.pl",
		"witd.gov.pl",
		"wzmiuw.gov.pl",
		"piw.gov.pl",
		"wiw.gov.pl",
		"griw.gov.pl",
		"wif.gov.pl",
		"oum.gov.pl",
		"sdn.gov.pl",
		"zp.gov.pl",
		"uppo.gov.pl",
		"mup.gov.pl",
		"wuoz.gov.pl",
		"konsulat.gov.pl",
		"oirm.gov.pl",
		"augustow.pl",
		"babia-gora.pl",
		"bedzin.pl",
		"beskidy.pl",
		"bialowieza.pl",
		"bialystok.pl",
		"bielawa.pl",
		"bieszczady.pl",
		"boleslawiec.pl",
		"bydgoszcz.pl",
		"bytom.pl",
		"cieszyn.pl",
		"czeladz.pl",
		"czest.pl",
		"dlugoleka.pl",
		"elblag.pl",
		"elk.pl",
		"glogow.pl",
		"gniezno.pl",
		"gorlice.pl",
		"grajewo.pl",
		"ilawa.pl",
		"jaworzno.pl",
		"jelenia-gora.pl",
		"jgora.pl",
		"kalisz.pl",
		"kazimierz-dolny.pl",
		"karpacz.pl",
		"kartuzy.pl",
		"kaszuby.pl",
		"katowice.pl",
		"kepno.pl",
		"ketrzyn.pl",
		"klodzko.pl",
		"kobierzyce.pl",
		"kolobrzeg.pl",
		"konin.pl",
		"konskowola.pl",
		"kutno.pl",
		"lapy.pl",
		"lebork.pl",
		"legnica.pl",
		"lezajsk.pl",
		"limanowa.pl",
		"lomza.pl",
		"lowicz.pl",
		"lubin.pl",
		"lukow.pl",
		"malbork.pl",
		"malopolska.pl",
		"mazowsze.pl",
		"mazury.pl",
		"mielec.pl",
		"mielno.pl",
		"mragowo.pl",
		"naklo.pl",
		"nowaruda.pl",
		"nysa.pl",
		"olawa.pl",
		"olecko.pl",
		"olkusz.pl",
		"olsztyn.pl",
		"opoczno.pl",
		"opole.pl",
		"ostroda.pl",
		"ostroleka.pl",
		"ostrowiec.pl",
		"ostrowwlkp.pl",
		"pila.pl",
		"pisz.pl",
		"podhale.pl",
		"podlasie.pl",
		"polkowice.pl",
		"pomorze.pl",
		"pomorskie.pl",
		"prochowice.pl",
		"pruszkow.pl",
		"przeworsk.pl",
		"pulawy.pl",
		"radom.pl",
		"rawa-maz.pl",
		"rybnik.pl",
		"rzeszow.pl",
		"sanok.pl",
		"sejny.pl",
		"slask.pl",
		"slupsk.pl",
		"sosnowiec.pl",
		"stalowa-wola.pl",
		"skoczow.pl",
		"starachowice.pl",
		"stargard.pl",
		"suwalki.pl",
		"swidnica.pl",
		"swiebodzin.pl",
		"swinoujscie.pl",
		"szczecin.pl",
		"szczytno.pl",
		"tarnobrzeg.pl",
		"tgory.pl",
		"turek.pl",
		"tychy.pl",
		"ustka.pl",
		"walbrzych.pl",
		"warmia.pl",
		"warszawa.pl",
		"waw.pl",
		"wegrow.pl",
		"wielun.pl",
		"wlocl.pl",
		"wloclawek.pl",
		"wodzislaw.pl",
		"wolomin.pl",
		"wroclaw.pl",
		"zachpomor.pl",
		"zagan.pl",
		"zarow.pl",
		"zgora.pl",
		"zgorzelec.pl",
		"pm",
		"pn",
		"gov.pn",
		"co.pn",
		"org.pn",
		"edu.pn",
		"net.pn",
		"post",
		"pr",
		"com.pr",
		"net.pr",
		"org.pr",
		"gov.pr",
		"edu.pr",
		"isla.pr",
		"pro.pr",
		"biz.pr",
		"info.pr",
		"name.pr",
		"est.pr",
		"prof.pr",
		"ac.pr",
		"pro",
		"aaa.pro",
		"aca.pro",
		"acct.pro",
		"avocat.pro",
		"bar.pro",
		"cpa.pro",
		"eng.pro",
		"jur.pro",
		"law.pro",
		"med.pro",
		"recht.pro",
		"ps",
		"edu.ps",
		"gov.ps",
		"sec.ps",
		"plo.ps",
		"com.ps",
		"org.ps",
		"net.ps",
		"pt",
		"net.pt",
		"gov.pt",
		"org.pt",
		"edu.pt",
		"int.pt",
		"publ.pt",
		"com.pt",
		"nome.pt",
		"pw",
		"co.pw",
		"ne.pw",
		"or.pw",
		"ed.pw",
		"go.pw",
		"belau.pw",
		"py",
		"com.py",
		"coop.py",
		"edu.py",
		"gov.py",
		"mil.py",
		"net.py",
		"org.py",
		"qa",
		"com.qa",
		"edu.qa",
		"gov.qa",
		"mil.qa",
		"name.qa",
		"net.qa",
		"org.qa",
		"sch.qa",
		"re",
		"asso.re",
		"com.re",
		"nom.re",
		"ro",
		"arts.ro",
		"com.ro",
		"firm.ro",
		"info.ro",
		"nom.ro",
		"nt.ro",
		"org.ro",
		"rec.ro",
		"store.ro",
		"tm.ro",
		"www.ro",
		"rs",
		"ac.rs",
		"co.rs",
		"edu.rs",
		"gov.rs",
		"in.rs",
		"org.rs",
		"ru",
		"rw",
		"ac.rw",
		"co.rw",
		"coop.rw",
		"gov.rw",
		"mil.rw",
		"net.rw",
		"org.rw",
		"sa",
		"com.sa",
		"net.sa",
		"org.sa",
		"gov.sa",
		"med.sa",
		"pub.sa",
		"edu.sa",
		"sch.sa",
		"sb",
		"com.sb",
		"edu.sb",
		"gov.sb",
		"net.sb",
		"org.sb",
		"sc",
		"com.sc",
		"gov.sc",
		"net.sc",
		"org.sc",
		"edu.sc",
		"sd",
		"com.sd",
		"net.sd",
		"org.sd",
		"edu.sd",
		"med.sd",
		"tv.sd",
		"gov.sd",
		"info.sd",
		"se",
		"a.se",
		"ac.se",
		"b.se",
		"bd.se",
		"brand.se",
		"c.se",
		"d.se",
		"e.se",
		"f.se",
		"fh.se",
		"fhsk.se",
		"fhv.se",
		"g.se",
		"h.se",
		"i.se",
		"k.se",
		"komforb.se",
		"kommunalforbund.se",
		"komvux.se",
		"l.se",
		"lanbib.se",
		"m.se",
		"n.se",
		"naturbruksgymn.se",
		"o.se",
		"org.se",
		"p.se",
		"parti.se",
		"pp.se",
		"press.se",
		"r.se",
		"s.se",
		"t.se",
		"tm.se",
		"u.se",
		"w.se",
		"x.se",
		"y.se",
		"z.se",
		"sg",
		"com.sg",
		"net.sg",
		"org.sg",
		"gov.sg",
		"edu.sg",
		"per.sg",
		"sh",
		"com.sh",
		"net.sh",
		"gov.sh",
		"org.sh",
		"mil.sh",
		"si",
		"sj",
		"sk",
		"sl",
		"com.sl",
		"net.sl",
		"edu.sl",
		"gov.sl",
		"org.sl",
		"sm",
		"sn",
		"art.sn",
		"com.sn",
		"edu.sn",
		"gouv.sn",
		"org.sn",
		"perso.sn",
		"univ.sn",
		"so",
		"com.so",
		"edu.so",
		"gov.so",
		"me.so",
		"net.so",
		"org.so",
		"sr",
		"ss",
		"biz.ss",
		"com.ss",
		"edu.ss",
		"gov.ss",
		"me.ss",
		"net.ss",
		"org.ss",
		"sch.ss",
		"st",
		"co.st",
		"com.st",
		"consulado.st",
		"edu.st",
		"embaixada.st",
		"mil.st",
		"net.st",
		"org.st",
		"principe.st",
		"saotome.st",
		"store.st",
		"su",
		"sv",
		"com.sv",
		"edu.sv",
		"gob.sv",
		"org.sv",
		"red.sv",
		"sx",
		"gov.sx",
		"sy",
		"edu.sy",
		"gov.sy",
		"net.sy",
		"mil.sy",
		"com.sy",
		"org.sy",
		"sz",
		"co.sz",
		"ac.sz",
		"org.sz",
		"tc",
		"td",
		"tel",
		"tf",
		"tg",
		"th",
		"ac.th",
		"co.th",
		"go.th",
		"in.th",
		"mi.th",
		"net.th",
		"or.th",
		"tj",
		"ac.tj",
		"biz.tj",
		"co.tj",
		"com.tj",
		"edu.tj",
		"go.tj",
		"gov.tj",
		"int.tj",
		"mil.tj",
		"name.tj",
		"net.tj",
		"nic.tj",
		"org.tj",
		"test.tj",
		"web.tj",
		"tk",
		"tl",
		"gov.tl",
		"tm",
		"com.tm",
		"co.tm",
		"org.tm",
		"net.tm",
		"nom.tm",
		"gov.tm",
		"mil.tm",
		"edu.tm",
		"tn",
		"com.tn",
		"ens.tn",
		"fin.tn",
		"gov.tn",
		"ind.tn",
		"info.tn",
		"intl.tn",
		"mincom.tn",
		"nat.tn",
		"net.tn",
		"org.tn",
		"perso.tn",
		"tourism.tn",
		"to",
		"com.to",
		"gov.to",
		"net.to",
		"org.to",
		"edu.to",
		"mil.to",
		"tr",
		"av.tr",
		"bbs.tr",
		"bel.tr",
		"biz.tr",
		"com.tr",
		"dr.tr",
		"edu.tr",
		"gen.tr",
		"gov.tr",
		"info.tr",
		"mil.tr",
		"k12.tr",
		"kep.tr",
		"name.tr",
		"net.tr",
		"org.tr",
		"pol.tr",
		"tel.tr",
		"tsk.tr",
		"tv.tr",
		"web.tr",
		"nc.tr",
		"gov.nc.tr",
		"tt",
		"co.tt",
		"com.tt",
		"org.tt",
		"net.tt",
		"biz.tt",
		"info.tt",
		"pro.tt",
		"int.tt",
		"coop.tt",
		"jobs.tt",
		"mobi.tt",
		"travel.tt",
		"museum.tt",
		"aero.tt",
		"name.tt",
		"gov.tt",
		"edu.tt",
		"tv",
		"tw",
		"edu.tw",
		"gov.tw",
		"mil.tw",
		"com.tw",
		"net.tw",
		"org.tw",
		"idv.tw",
		"game.tw",
		"ebiz.tw",
		"club.tw",
		"網路.tw",
		"組織.tw",
		"商業.tw",
		"tz",
		"ac.tz",
		"co.tz",
		"go.tz",
		"hotel.tz",
		"info.tz",
		"me.tz",
		"mil.tz",
		"mobi.tz",
		"ne.tz",
		"or.tz",
		"sc.tz",
		"tv.tz",
		"ua",
		"com.ua",
		"edu.ua",
		"gov.ua",
		"in.ua",
		"net.ua",
		"org.ua",
		"cherkassy.ua",
		"cherkasy.ua",
		"chernigov.ua",
		"chernihiv.ua",
		"chernivtsi.ua",
		"chernovtsy.ua",
		"ck.ua",
		"cn.ua",
		"cr.ua",
		"crimea.ua",
		"cv.ua",
		"dn.ua",
		"dnepropetrovsk.ua",
		"dnipropetrovsk.ua",
		"donetsk.ua",
		"dp.ua",
		"if.ua",
		"ivano-frankivsk.ua",
		"kh.ua",
		"kharkiv.ua",
		"kharkov.ua",
		"kherson.ua",
		"khmelnitskiy.ua",
		"khmelnytskyi.ua",
		"kiev.ua",
		"kirovograd.ua",
		"km.ua",
		"kr.ua",
		"krym.ua",
		"ks.ua",
		"kv.ua",
		"kyiv.ua",
		"lg.ua",
		"lt.ua",
		"lugansk.ua",
		"lutsk.ua",
		"lv.ua",
		"lviv.ua",
		"mk.ua",
		"mykolaiv.ua",
		"nikolaev.ua",
		"od.ua",
		"odesa.ua",
		"odessa.ua",
		"pl.ua",
		"poltava.ua",
		"rivne.ua",
		"rovno.ua",
		"rv.ua",
		"sb.ua",
		"sebastopol.ua",
		"sevastopol.ua",
		"sm.ua",
		"sumy.ua",
		"te.ua",
		"ternopil.ua",
		"uz.ua",
		"uzhgorod.ua",
		"vinnica.ua",
		"vinnytsia.ua",
		"vn.ua",
		"volyn.ua",
		"yalta.ua",
		"zaporizhzhe.ua",
		"zaporizhzhia.ua",
		"zhitomir.ua",
		"zhytomyr.ua",
		"zp.ua",
		"zt.ua",
		"ug",
		"co.ug",
		"or.ug",
		"ac.ug",
		"sc.ug",
		"go.ug",
		"ne.ug",
		"com.ug",
		"org.ug",
		"uk",
		"ac.uk",
		"co.uk",
		"gov.uk",
		"ltd.uk",
		"me.uk",
		"net.uk",
		"nhs.uk",
		"org.uk",
		"plc.uk",
		"police.uk",
		"*.sch.uk",
		"us",
		"dni.us",
		"fed.us",
		"isa.us",
		"kids.us",
		"nsn.us",
		"ak.us",
		"al.us",
		"ar.us",
		"as.us",
		"az.us",
		"ca.us",
		"co.us",
		"ct.us",
		"dc.us",
		"de.us",
		"fl.us",
		"ga.us",
		"gu.us",
		"hi.us",
		"ia.us",
		"id.us",
		"il.us",
		"in.us",
		"ks.us",
		"ky.us",
		"la.us",
		"ma.us",
		"md.us",
		"me.us",
		"mi.us",
		"mn.us",
		"mo.us",
		"ms.us",
		"mt.us",
		"nc.us",
		"nd.us",
		"ne.us",
		"nh.us",
		"nj.us",
		"nm.us",
		"nv.us",
		"ny.us",
		"oh.us",
		"ok.us",
		"or.us",
		"pa.us",
		"pr.us",
		"ri.us",
		"sc.us",
		"sd.us",
		"tn.us",
		"tx.us",
		"ut.us",
		"vi.us",
		"vt.us",
		"va.us",
		"wa.us",
		"wi.us",
		"wv.us",
		"wy.us",
		"k12.ak.us",
		"k12.al.us",
		"k12.ar.us",
		"k12.as.us",
		"k12.az.us",
		"k12.ca.us",
		"k12.co.us",
		"k12.ct.us",
		"k12.dc.us",
		"k12.de.us",
		"k12.fl.us",
		"k12.ga.us",
		"k12.gu.us",
		"k12.ia.us",
		"k12.id.us",
		"k12.il.us",
		"k12.in.us",
		"k12.ks.us",
		"k12.ky.us",
		"k12.la.us",
		"k12.ma.us",
		"k12.md.us",
		"k12.me.us",
		"k12.mi.us",
		"k12.mn.us",
		"k12.mo.us",
		"k12.ms.us",
		"k12.mt.us",
		"k12.nc.us",
		"k12.ne.us",
		"k12.nh.us",
		"k12.nj.us",
		"k12.nm.us",
		"k12.nv.us",
		"k12.ny.us",
		"k12.oh.us",
		"k12.ok.us",
		"k12.or.us",
		"k12.pa.us",
		"k12.pr.us",
		"k12.sc.us",
		"k12.tn.us",
		"k12.tx.us",
		"k12.ut.us",
		"k12.vi.us",
		"k12.vt.us",
		"k12.va.us",
		"k12.wa.us",
		"k12.wi.us",
		"k12.wy.us",
		"cc.ak.us",
		"cc.al.us",
		"cc.ar.us",
		"cc.as.us",
		"cc.az.us",
		"cc.ca.us",
		"cc.co.us",
		"cc.ct.us",
		"cc.dc.us",
		"cc.de.us",
		"cc.fl.us",
		"cc.ga.us",
		"cc.gu.us",
		"cc.hi.us",
		"cc.ia.us",
		"cc.id.us",
		"cc.il.us",
		"cc.in.us",
		"cc.ks.us",
		"cc.ky.us",
		"cc.la.us",
		"cc.ma.us",
		"cc.md.us",
		"cc.me.us",
		"cc.mi.us",
		"cc.mn.us",
		"cc.mo.us",
		"cc.ms.us",
		"cc.mt.us",
		"cc.nc.us",
		"cc.nd.us",
		"cc.ne.us",
		"cc.nh.us",
		"cc.nj.us",
		"cc.nm.us",
		"cc.nv.us",
		"cc.ny.us",
		"cc.oh.us",
		"cc.ok.us",
		"cc.or.us",
		"cc.pa.us",
		"cc.pr.us",
		"cc.ri.us",
		"cc.sc.us",
		"cc.sd.us",
		"cc.tn.us",
		"cc.tx.us",
		"cc.ut.us",
		"cc.vi.us",
		"cc.vt.us",
		"cc.va.us",
		"cc.wa.us",
		"cc.wi.us",
		"cc.wv.us",
		"cc.wy.us",
		"lib.ak.us",
		"lib.al.us",
		"lib.ar.us",
		"lib.as.us",
		"lib.az.us",
		"lib.ca.us",
		"lib.co.us",
		"lib.ct.us",
		"lib.dc.us",
		"lib.fl.us",
		"lib.ga.us",
		"lib.gu.us",
		"lib.hi.us",
		"lib.ia.us",
		"lib.id.us",
		"lib.il.us",
		"lib.in.us",
		"lib.ks.us",
		"lib.ky.us",
		"lib.la.us",
		"lib.ma.us",
		"lib.md.us",
		"lib.me.us",
		"lib.mi.us",
		"lib.mn.us",
		"lib.mo.us",
		"lib.ms.us",
		"lib.mt.us",
		"lib.nc.us",
		"lib.nd.us",
		"lib.ne.us",
		"lib.nh.us",
		"lib.nj.us",
		"lib.nm.us",
		"lib.nv.us",
		"lib.ny.us",
		"lib.oh.us",
		"lib.ok.us",
		"lib.or.us",
		"lib.pa.us",
		"lib.pr.us",
		"lib.ri.us",
		"lib.sc.us",
		"lib.sd.us",
		"lib.tn.us",
		"lib.tx.us",
		"lib.ut.us",
		"lib.vi.us",
		"lib.vt.us",
		"lib.va.us",
		"lib.wa.us",
		"lib.wi.us",
		"lib.wy.us",
		"pvt.k12.ma.us",
		"chtr.k12.ma.us",
		"paroch.k12.ma.us",
		"ann-arbor.mi.us",
		"cog.mi.us",
		"dst.mi.us",
		"eaton.mi.us",
		"gen.mi.us",
		"mus.mi.us",
		"tec.mi.us",
		"washtenaw.mi.us",
		"uy",
		"com.uy",
		"edu.uy",
		"gub.uy",
		"mil.uy",
		"net.uy",
		"org.uy",
		"uz",
		"co.uz",
		"com.uz",
		"net.uz",
		"org.uz",
		"va",
		"vc",
		"com.vc",
		"net.vc",
		"org.vc",
		"gov.vc",
		"mil.vc",
		"edu.vc",
		"ve",
		"arts.ve",
		"bib.ve",
		"co.ve",
		"com.ve",
		"e12.ve",
		"edu.ve",
		"firm.ve",
		"gob.ve",
		"gov.ve",
		"info.ve",
		"int.ve",
		"mil.ve",
		"net.ve",
		"nom.ve",
		"org.ve",
		"rar.ve",
		"rec.ve",
		"store.ve",
		"tec.ve",
		"web.ve",
		"vg",
		"vi",
		"co.vi",
		"com.vi",
		"k12.vi",
		"net.vi",
		"org.vi",
		"vn",
		"com.vn",
		"net.vn",
		"org.vn",
		"edu.vn",
		"gov.vn",
		"int.vn",
		"ac.vn",
		"biz.vn",
		"info.vn",
		"name.vn",
		"pro.vn",
		"health.vn",
		"vu",
		"com.vu",
		"edu.vu",
		"net.vu",
		"org.vu",
		"wf",
		"ws",
		"com.ws",
		"net.ws",
		"org.ws",
		"gov.ws",
		"edu.ws",
		"yt",
		"امارات",
		"հայ",
		"বাংলা",
		"бг",
		"البحرين",
		"бел",
		"中国",
		"中國",
		"الجزائر",
		"مصر",
		"ею",
		"ευ",
		"موريتانيا",
		"გე",
		"ελ",
		"香港",
		"公司.香港",
		"教育.香港",
		"政府.香港",
		"個人.香港",
		"網絡.香港",
		"組織.香港",
		"ಭಾರತ",
		"ଭାରତ",
		"ভাৰত",
		"भारतम्",
		"भारोत",
		"ڀارت",
		"ഭാരതം",
		"भारत",
		"بارت",
		"بھارت",
		"భారత్",
		"ભારત",
		"ਭਾਰਤ",
		"ভারত",
		"இந்தியா",
		"ایران",
		"ايران",
		"عراق",
		"الاردن",
		"한국",
		"қаз",
		"ລາວ",
		"ලංකා",
		"இலங்கை",
		"المغرب",
		"мкд",
		"мон",
		"澳門",
		"澳门",
		"مليسيا",
		"عمان",
		"پاکستان",
		"پاكستان",
		"فلسطين",
		"срб",
		"пр.срб",
		"орг.срб",
		"обр.срб",
		"од.срб",
		"упр.срб",
		"ак.срб",
		"рф",
		"قطر",
		"السعودية",
		"السعودیة",
		"السعودیۃ",
		"السعوديه",
		"سودان",
		"新加坡",
		"சிங்கப்பூர்",
		"سورية",
		"سوريا",
		"ไทย",
		"ศึกษา.ไทย",
		"ธุรกิจ.ไทย",
		"รัฐบาล.ไทย",
		"ทหาร.ไทย",
		"เน็ต.ไทย",
		"องค์กร.ไทย",
		"تونس",
		"台灣",
		"台湾",
		"臺灣",
		"укр",
		"اليمن",
		"xxx",
		"ye",
		"com.ye",
		"edu.ye",
		"gov.ye",
		"net.ye",
		"mil.ye",
		"org.ye",
		"ac.za",
		"agric.za",
		"alt.za",
		"co.za",
		"edu.za",
		"gov.za",
		"grondar.za",
		"law.za",
		"mil.za",
		"net.za",
		"ngo.za",
		"nic.za",
		"nis.za",
		"nom.za",
		"org.za",
		"school.za",
		"tm.za",
		"web.za",
		"zm",
		"ac.zm",
		"biz.zm",
		"co.zm",
		"com.zm",
		"edu.zm",
		"gov.zm",
		"info.zm",
		"mil.zm",
		"net.zm",
		"org.zm",
		"sch.zm",
		"zw",
		"ac.zw",
		"co.zw",
		"gov.zw",
		"mil.zw",
		"org.zw",
		"aaa",
		"aarp",
		"abarth",
		"abb",
		"abbott",
		"abbvie",
		"abc",
		"able",
		"abogado",
		"abudhabi",
		"academy",
		"accenture",
		"accountant",
		"accountants",
		"aco",
		"actor",
		"adac",
		"ads",
		"adult",
		"aeg",
		"aetna",
		"afl",
		"africa",
		"agakhan",
		"agency",
		"aig",
		"airbus",
		"airforce",
		"airtel",
		"akdn",
		"alfaromeo",
		"alibaba",
		"alipay",
		"allfinanz",
		"allstate",
		"ally",
		"alsace",
		"alstom",
		"amazon",
		"americanexpress",
		"americanfamily",
		"amex",
		"amfam",
		"amica",
		"amsterdam",
		"analytics",
		"android",
		"anquan",
		"anz",
		"aol",
		"apartments",
		"app",
		"apple",
		"aquarelle",
		"arab",
		"aramco",
		"archi",
		"army",
		"art",
		"arte",
		"asda",
		"associates",
		"athleta",
		"attorney",
		"auction",
		"audi",
		"audible",
		"audio",
		"auspost",
		"author",
		"auto",
		"autos",
		"avianca",
		"aws",
		"axa",
		"azure",
		"baby",
		"baidu",
		"banamex",
		"bananarepublic",
		"band",
		"bank",
		"bar",
		"barcelona",
		"barclaycard",
		"barclays",
		"barefoot",
		"bargains",
		"baseball",
		"basketball",
		"bauhaus",
		"bayern",
		"bbc",
		"bbt",
		"bbva",
		"bcg",
		"bcn",
		"beats",
		"beauty",
		"beer",
		"bentley",
		"berlin",
		"best",
		"bestbuy",
		"bet",
		"bharti",
		"bible",
		"bid",
		"bike",
		"bing",
		"bingo",
		"bio",
		"black",
		"blackfriday",
		"blockbuster",
		"blog",
		"bloomberg",
		"blue",
		"bms",
		"bmw",
		"bnpparibas",
		"boats",
		"boehringer",
		"bofa",
		"bom",
		"bond",
		"boo",
		"book",
		"booking",
		"bosch",
		"bostik",
		"boston",
		"bot",
		"boutique",
		"box",
		"bradesco",
		"bridgestone",
		"broadway",
		"broker",
		"brother",
		"brussels",
		"bugatti",
		"build",
		"builders",
		"business",
		"buy",
		"buzz",
		"bzh",
		"cab",
		"cafe",
		"cal",
		"call",
		"calvinklein",
		"cam",
		"camera",
		"camp",
		"cancerresearch",
		"canon",
		"capetown",
		"capital",
		"capitalone",
		"car",
		"caravan",
		"cards",
		"care",
		"career",
		"careers",
		"cars",
		"casa",
		"case",
		"cash",
		"casino",
		"catering",
		"catholic",
		"cba",
		"cbn",
		"cbre",
		"cbs",
		"center",
		"ceo",
		"cern",
		"cfa",
		"cfd",
		"chanel",
		"channel",
		"charity",
		"chase",
		"chat",
		"cheap",
		"chintai",
		"christmas",
		"chrome",
		"church",
		"cipriani",
		"circle",
		"cisco",
		"citadel",
		"citi",
		"citic",
		"city",
		"cityeats",
		"claims",
		"cleaning",
		"click",
		"clinic",
		"clinique",
		"clothing",
		"cloud",
		"club",
		"clubmed",
		"coach",
		"codes",
		"coffee",
		"college",
		"cologne",
		"comcast",
		"commbank",
		"community",
		"company",
		"compare",
		"computer",
		"comsec",
		"condos",
		"construction",
		"consulting",
		"contact",
		"contractors",
		"cooking",
		"cookingchannel",
		"cool",
		"corsica",
		"country",
		"coupon",
		"coupons",
		"courses",
		"cpa",
		"credit",
		"creditcard",
		"creditunion",
		"cricket",
		"crown",
		"crs",
		"cruise",
		"cruises",
		"cuisinella",
		"cymru",
		"cyou",
		"dabur",
		"dad",
		"dance",
		"data",
		"date",
		"dating",
		"datsun",
		"day",
		"dclk",
		"dds",
		"deal",
		"dealer",
		"deals",
		"degree",
		"delivery",
		"dell",
		"deloitte",
		"delta",
		"democrat",
		"dental",
		"dentist",
		"desi",
		"design",
		"dev",
		"dhl",
		"diamonds",
		"diet",
		"digital",
		"direct",
		"directory",
		"discount",
		"discover",
		"dish",
		"diy",
		"dnp",
		"docs",
		"doctor",
		"dog",
		"domains",
		"dot",
		"download",
		"drive",
		"dtv",
		"dubai",
		"dunlop",
		"dupont",
		"durban",
		"dvag",
		"dvr",
		"earth",
		"eat",
		"eco",
		"edeka",
		"education",
		"email",
		"emerck",
		"energy",
		"engineer",
		"engineering",
		"enterprises",
		"epson",
		"equipment",
		"ericsson",
		"erni",
		"esq",
		"estate",
		"etisalat",
		"eurovision",
		"eus",
		"events",
		"exchange",
		"expert",
		"exposed",
		"express",
		"extraspace",
		"fage",
		"fail",
		"fairwinds",
		"faith",
		"family",
		"fan",
		"fans",
		"farm",
		"farmers",
		"fashion",
		"fast",
		"fedex",
		"feedback",
		"ferrari",
		"ferrero",
		"fiat",
		"fidelity",
		"fido",
		"film",
		"final",
		"finance",
		"financial",
		"fire",
		"firestone",
		"firmdale",
		"fish",
		"fishing",
		"fit",
		"fitness",
		"flickr",
		"flights",
		"flir",
		"florist",
		"flowers",
		"fly",
		"foo",
		"food",
		"foodnetwork",
		"football",
		"ford",
		"forex",
		"forsale",
		"forum",
		"foundation",
		"fox",
		"free",
		"fresenius",
		"frl",
		"frogans",
		"frontdoor",
		"frontier",
		"ftr",
		"fujitsu",
		"fun",
		"fund",
		"furniture",
		"futbol",
		"fyi",
		"gal",
		"gallery",
		"gallo",
		"gallup",
		"game",
		"games",
		"gap",
		"garden",
		"gay",
		"gbiz",
		"gdn",
		"gea",
		"gent",
		"genting",
		"george",
		"ggee",
		"gift",
		"gifts",
		"gives",
		"giving",
		"glass",
		"gle",
		"global",
		"globo",
		"gmail",
		"gmbh",
		"gmo",
		"gmx",
		"godaddy",
		"gold",
		"goldpoint",
		"golf",
		"goo",
		"goodyear",
		"goog",
		"google",
		"gop",
		"got",
		"grainger",
		"graphics",
		"gratis",
		"green",
		"gripe",
		"grocery",
		"group",
		"guardian",
		"gucci",
		"guge",
		"guide",
		"guitars",
		"guru",
		"hair",
		"hamburg",
		"hangout",
		"haus",
		"hbo",
		"hdfc",
		"hdfcbank",
		"health",
		"healthcare",
		"help",
		"helsinki",
		"here",
		"hermes",
		"hgtv",
		"hiphop",
		"hisamitsu",
		"hitachi",
		"hiv",
		"hkt",
		"hockey",
		"holdings",
		"holiday",
		"homedepot",
		"homegoods",
		"homes",
		"homesense",
		"honda",
		"horse",
		"hospital",
		"host",
		"hosting",
		"hot",
		"hoteles",
		"hotels",
		"hotmail",
		"house",
		"how",
		"hsbc",
		"hughes",
		"hyatt",
		"hyundai",
		"ibm",
		"icbc",
		"ice",
		"icu",
		"ieee",
		"ifm",
		"ikano",
		"imamat",
		"imdb",
		"immo",
		"immobilien",
		"inc",
		"industries",
		"infiniti",
		"ing",
		"ink",
		"institute",
		"insurance",
		"insure",
		"international",
		"intuit",
		"investments",
		"ipiranga",
		"irish",
		"ismaili",
		"ist",
		"istanbul",
		"itau",
		"itv",
		"jaguar",
		"java",
		"jcb",
		"jeep",
		"jetzt",
		"jewelry",
		"jio",
		"jll",
		"jmp",
		"jnj",
		"joburg",
		"jot",
		"joy",
		"jpmorgan",
		"jprs",
		"juegos",
		"juniper",
		"kaufen",
		"kddi",
		"kerryhotels",
		"kerrylogistics",
		"kerryproperties",
		"kfh",
		"kia",
		"kids",
		"kim",
		"kinder",
		"kindle",
		"kitchen",
		"kiwi",
		"koeln",
		"komatsu",
		"kosher",
		"kpmg",
		"kpn",
		"krd",
		"kred",
		"kuokgroup",
		"kyoto",
		"lacaixa",
		"lamborghini",
		"lamer",
		"lancaster",
		"lancia",
		"land",
		"landrover",
		"lanxess",
		"lasalle",
		"lat",
		"latino",
		"latrobe",
		"law",
		"lawyer",
		"lds",
		"lease",
		"leclerc",
		"lefrak",
		"legal",
		"lego",
		"lexus",
		"lgbt",
		"lidl",
		"life",
		"lifeinsurance",
		"lifestyle",
		"lighting",
		"like",
		"lilly",
		"limited",
		"limo",
		"lincoln",
		"linde",
		"link",
		"lipsy",
		"live",
		"living",
		"llc",
		"llp",
		"loan",
		"loans",
		"locker",
		"locus",
		"loft",
		"lol",
		"london",
		"lotte",
		"lotto",
		"love",
		"lpl",
		"lplfinancial",
		"ltd",
		"ltda",
		"lundbeck",
		"luxe",
		"luxury",
		"macys",
		"madrid",
		"maif",
		"maison",
		"makeup",
		"man",
		"management",
		"mango",
		"map",
		"market",
		"marketing",
		"markets",
		"marriott",
		"marshalls",
		"maserati",
		"mattel",
		"mba",
		"mckinsey",
		"med",
		"media",
		"meet",
		"melbourne",
		"meme",
		"memorial",
		"men",
		"menu",
		"merckmsd",
		"miami",
		"microsoft",
		"mini",
		"mint",
		"mit",
		"mitsubishi",
		"mlb",
		"mls",
		"mma",
		"mobile",
		"moda",
		"moe",
		"moi",
		"mom",
		"monash",
		"money",
		"monster",
		"mormon",
		"mortgage",
		"moscow",
		"moto",
		"motorcycles",
		"mov",
		"movie",
		"msd",
		"mtn",
		"mtr",
		"music",
		"mutual",
		"nab",
		"nagoya",
		"natura",
		"navy",
		"nba",
		"nec",
		"netbank",
		"netflix",
		"network",
		"neustar",
		"new",
		"news",
		"next",
		"nextdirect",
		"nexus",
		"nfl",
		"ngo",
		"nhk",
		"nico",
		"nike",
		"nikon",
		"ninja",
		"nissan",
		"nissay",
		"nokia",
		"northwesternmutual",
		"norton",
		"now",
		"nowruz",
		"nowtv",
		"nra",
		"nrw",
		"ntt",
		"nyc",
		"obi",
		"observer",
		"office",
		"okinawa",
		"olayan",
		"olayangroup",
		"oldnavy",
		"ollo",
		"omega",
		"one",
		"ong",
		"onl",
		"online",
		"ooo",
		"open",
		"oracle",
		"orange",
		"organic",
		"origins",
		"osaka",
		"otsuka",
		"ott",
		"ovh",
		"page",
		"panasonic",
		"paris",
		"pars",
		"partners",
		"parts",
		"party",
		"passagens",
		"pay",
		"pccw",
		"pet",
		"pfizer",
		"pharmacy",
		"phd",
		"philips",
		"phone",
		"photo",
		"photography",
		"photos",
		"physio",
		"pics",
		"pictet",
		"pictures",
		"pid",
		"pin",
		"ping",
		"pink",
		"pioneer",
		"pizza",
		"place",
		"play",
		"playstation",
		"plumbing",
		"plus",
		"pnc",
		"pohl",
		"poker",
		"politie",
		"porn",
		"pramerica",
		"praxi",
		"press",
		"prime",
		"prod",
		"productions",
		"prof",
		"progressive",
		"promo",
		"properties",
		"property",
		"protection",
		"pru",
		"prudential",
		"pub",
		"pwc",
		"qpon",
		"quebec",
		"quest",
		"racing",
		"radio",
		"read",
		"realestate",
		"realtor",
		"realty",
		"recipes",
		"red",
		"redstone",
		"redumbrella",
		"rehab",
		"reise",
		"reisen",
		"reit",
		"reliance",
		"ren",
		"rent",
		"rentals",
		"repair",
		"report",
		"republican",
		"rest",
		"restaurant",
		"review",
		"reviews",
		"rexroth",
		"rich",
		"richardli",
		"ricoh",
		"ril",
		"rio",
		"rip",
		"rocher",
		"rocks",
		"rodeo",
		"rogers",
		"room",
		"rsvp",
		"rugby",
		"ruhr",
		"run",
		"rwe",
		"ryukyu",
		"saarland",
		"safe",
		"safety",
		"sakura",
		"sale",
		"salon",
		"samsclub",
		"samsung",
		"sandvik",
		"sandvikcoromant",
		"sanofi",
		"sap",
		"sarl",
		"sas",
		"save",
		"saxo",
		"sbi",
		"sbs",
		"sca",
		"scb",
		"schaeffler",
		"schmidt",
		"scholarships",
		"school",
		"schule",
		"schwarz",
		"science",
		"scot",
		"search",
		"seat",
		"secure",
		"security",
		"seek",
		"select",
		"sener",
		"services",
		"ses",
		"seven",
		"sew",
		"sex",
		"sexy",
		"sfr",
		"shangrila",
		"sharp",
		"shaw",
		"shell",
		"shia",
		"shiksha",
		"shoes",
		"shop",
		"shopping",
		"shouji",
		"show",
		"showtime",
		"silk",
		"sina",
		"singles",
		"site",
		"ski",
		"skin",
		"sky",
		"skype",
		"sling",
		"smart",
		"smile",
		"sncf",
		"soccer",
		"social",
		"softbank",
		"software",
		"sohu",
		"solar",
		"solutions",
		"song",
		"sony",
		"soy",
		"spa",
		"space",
		"sport",
		"spot",
		"srl",
		"stada",
		"staples",
		"star",
		"statebank",
		"statefarm",
		"stc",
		"stcgroup",
		"stockholm",
		"storage",
		"store",
		"stream",
		"studio",
		"study",
		"style",
		"sucks",
		"supplies",
		"supply",
		"support",
		"surf",
		"surgery",
		"suzuki",
		"swatch",
		"swiss",
		"sydney",
		"systems",
		"tab",
		"taipei",
		"talk",
		"taobao",
		"target",
		"tatamotors",
		"tatar",
		"tattoo",
		"tax",
		"taxi",
		"tci",
		"tdk",
		"team",
		"tech",
		"technology",
		"temasek",
		"tennis",
		"teva",
		"thd",
		"theater",
		"theatre",
		"tiaa",
		"tickets",
		"tienda",
		"tiffany",
		"tips",
		"tires",
		"tirol",
		"tjmaxx",
		"tjx",
		"tkmaxx",
		"tmall",
		"today",
		"tokyo",
		"tools",
		"top",
		"toray",
		"toshiba",
		"total",
		"tours",
		"town",
		"toyota",
		"toys",
		"trade",
		"trading",
		"training",
		"travel",
		"travelchannel",
		"travelers",
		"travelersinsurance",
		"trust",
		"trv",
		"tube",
		"tui",
		"tunes",
		"tushu",
		"tvs",
		"ubank",
		"ubs",
		"unicom",
		"university",
		"uno",
		"uol",
		"ups",
		"vacations",
		"vana",
		"vanguard",
		"vegas",
		"ventures",
		"verisign",
		"versicherung",
		"vet",
		"viajes",
		"video",
		"vig",
		"viking",
		"villas",
		"vin",
		"vip",
		"virgin",
		"visa",
		"vision",
		"viva",
		"vivo",
		"vlaanderen",
		"vodka",
		"volkswagen",
		"volvo",
		"vote",
		"voting",
		"voto",
		"voyage",
		"vuelos",
		"wales",
		"walmart",
		"walter",
		"wang",
		"wanggou",
		"watch",
		"watches",
		"weather",
		"weatherchannel",
		"webcam",
		"weber",
		"website",
		"wedding",
		"weibo",
		"weir",
		"whoswho",
		"wien",
		"wiki",
		"williamhill",
		"win",
		"windows",
		"wine",
		"winners",
		"wme",
		"wolterskluwer",
		"woodside",
		"work",
		"works",
		"world",
		"wow",
		"wtc",
		"wtf",
		"xbox",
		"xerox",
		"xfinity",
		"xihuan",
		"xin",
		"कॉम",
		"セール",
		"佛山",
		"慈善",
		"集团",
		"在线",
		"点看",
		"คอม",
		"八卦",
		"موقع",
		"公益",
		"公司",
		"香格里拉",
		"网站",
		"移动",
		"我爱你",
		"москва",
		"католик",
		"онлайн",
		"сайт",
		"联通",
		"קום",
		"时尚",
		"微博",
		"淡马锡",
		"ファッション",
		"орг",
		"नेट",
		"ストア",
		"アマゾン",
		"삼성",
		"商标",
		"商店",
		"商城",
		"дети",
		"ポイント",
		"新闻",
		"家電",
		"كوم",
		"中文网",
		"中信",
		"娱乐",
		"谷歌",
		"電訊盈科",
		"购物",
		"クラウド",
		"通販",
		"网店",
		"संगठन",
		"餐厅",
		"网络",
		"ком",
		"亚马逊",
		"诺基亚",
		"食品",
		"飞利浦",
		"手机",
		"ارامكو",
		"العليان",
		"اتصالات",
		"بازار",
		"ابوظبي",
		"كاثوليك",
		"همراه",
		"닷컴",
		"政府",
		"شبكة",
		"بيتك",
		"عرب",
		"机构",
		"组织机构",
		"健康",
		"招聘",
		"рус",
		"大拿",
		"みんな",
		"グーグル",
		"世界",
		"書籍",
		"网址",
		"닷넷",
		"コム",
		"天主教",
		"游戏",
		"vermögensberater",
		"vermögensberatung",
		"企业",
		"信息",
		"嘉里大酒店",
		"嘉里",
		"广东",
		"政务",
		"xyz",
		"yachts",
		"yahoo",
		"yamaxun",
		"yandex",
		"yodobashi",
		"yoga",
		"yokohama",
		"you",
		"youtube",
		"yun",
		"zappos",
		"zara",
		"zero",
		"zip",
		"zone",
		"zuerich",
		"cc.ua",
		"inf.ua",
		"ltd.ua",
		"611.to",
		"graphox.us",
		"*.devcdnaccesso.com",
		"adobeaemcloud.com",
		"*.dev.adobeaemcloud.com",
		"hlx.live",
		"adobeaemcloud.net",
		"hlx.page",
		"hlx3.page",
		"beep.pl",
		"airkitapps.com",
		"airkitapps-au.com",
		"airkitapps.eu",
		"aivencloud.com",
		"barsy.ca",
		"*.compute.estate",
		"*.alces.network",
		"kasserver.com",
		"altervista.org",
		"alwaysdata.net",
		"cloudfront.net",
		"*.compute.amazonaws.com",
		"*.compute-1.amazonaws.com",
		"*.compute.amazonaws.com.cn",
		"us-east-1.amazonaws.com",
		"cn-north-1.eb.amazonaws.com.cn",
		"cn-northwest-1.eb.amazonaws.com.cn",
		"elasticbeanstalk.com",
		"ap-northeast-1.elasticbeanstalk.com",
		"ap-northeast-2.elasticbeanstalk.com",
		"ap-northeast-3.elasticbeanstalk.com",
		"ap-south-1.elasticbeanstalk.com",
		"ap-southeast-1.elasticbeanstalk.com",
		"ap-southeast-2.elasticbeanstalk.com",
		"ca-central-1.elasticbeanstalk.com",
		"eu-central-1.elasticbeanstalk.com",
		"eu-west-1.elasticbeanstalk.com",
		"eu-west-2.elasticbeanstalk.com",
		"eu-west-3.elasticbeanstalk.com",
		"sa-east-1.elasticbeanstalk.com",
		"us-east-1.elasticbeanstalk.com",
		"us-east-2.elasticbeanstalk.com",
		"us-gov-west-1.elasticbeanstalk.com",
		"us-west-1.elasticbeanstalk.com",
		"us-west-2.elasticbeanstalk.com",
		"*.elb.amazonaws.com",
		"*.elb.amazonaws.com.cn",
		"awsglobalaccelerator.com",
		"s3.amazonaws.com",
		"s3-ap-northeast-1.amazonaws.com",
		"s3-ap-northeast-2.amazonaws.com",
		"s3-ap-south-1.amazonaws.com",
		"s3-ap-southeast-1.amazonaws.com",
		"s3-ap-southeast-2.amazonaws.com",
		"s3-ca-central-1.amazonaws.com",
		"s3-eu-central-1.amazonaws.com",
		"s3-eu-west-1.amazonaws.com",
		"s3-eu-west-2.amazonaws.com",
		"s3-eu-west-3.amazonaws.com",
		"s3-external-1.amazonaws.com",
		"s3-fips-us-gov-west-1.amazonaws.com",
		"s3-sa-east-1.amazonaws.com",
		"s3-us-gov-west-1.amazonaws.com",
		"s3-us-east-2.amazonaws.com",
		"s3-us-west-1.amazonaws.com",
		"s3-us-west-2.amazonaws.com",
		"s3.ap-northeast-2.amazonaws.com",
		"s3.ap-south-1.amazonaws.com",
		"s3.cn-north-1.amazonaws.com.cn",
		"s3.ca-central-1.amazonaws.com",
		"s3.eu-central-1.amazonaws.com",
		"s3.eu-west-2.amazonaws.com",
		"s3.eu-west-3.amazonaws.com",
		"s3.us-east-2.amazonaws.com",
		"s3.dualstack.ap-northeast-1.amazonaws.com",
		"s3.dualstack.ap-northeast-2.amazonaws.com",
		"s3.dualstack.ap-south-1.amazonaws.com",
		"s3.dualstack.ap-southeast-1.amazonaws.com",
		"s3.dualstack.ap-southeast-2.amazonaws.com",
		"s3.dualstack.ca-central-1.amazonaws.com",
		"s3.dualstack.eu-central-1.amazonaws.com",
		"s3.dualstack.eu-west-1.amazonaws.com",
		"s3.dualstack.eu-west-2.amazonaws.com",
		"s3.dualstack.eu-west-3.amazonaws.com",
		"s3.dualstack.sa-east-1.amazonaws.com",
		"s3.dualstack.us-east-1.amazonaws.com",
		"s3.dualstack.us-east-2.amazonaws.com",
		"s3-website-us-east-1.amazonaws.com",
		"s3-website-us-west-1.amazonaws.com",
		"s3-website-us-west-2.amazonaws.com",
		"s3-website-ap-northeast-1.amazonaws.com",
		"s3-website-ap-southeast-1.amazonaws.com",
		"s3-website-ap-southeast-2.amazonaws.com",
		"s3-website-eu-west-1.amazonaws.com",
		"s3-website-sa-east-1.amazonaws.com",
		"s3-website.ap-northeast-2.amazonaws.com",
		"s3-website.ap-south-1.amazonaws.com",
		"s3-website.ca-central-1.amazonaws.com",
		"s3-website.eu-central-1.amazonaws.com",
		"s3-website.eu-west-2.amazonaws.com",
		"s3-website.eu-west-3.amazonaws.com",
		"s3-website.us-east-2.amazonaws.com",
		"t3l3p0rt.net",
		"tele.amune.org",
		"apigee.io",
		"siiites.com",
		"appspacehosted.com",
		"appspaceusercontent.com",
		"appudo.net",
		"on-aptible.com",
		"user.aseinet.ne.jp",
		"gv.vc",
		"d.gv.vc",
		"user.party.eus",
		"pimienta.org",
		"poivron.org",
		"potager.org",
		"sweetpepper.org",
		"myasustor.com",
		"cdn.prod.atlassian-dev.net",
		"translated.page",
		"myfritz.net",
		"onavstack.net",
		"*.awdev.ca",
		"*.advisor.ws",
		"ecommerce-shop.pl",
		"b-data.io",
		"backplaneapp.io",
		"balena-devices.com",
		"rs.ba",
		"*.banzai.cloud",
		"app.banzaicloud.io",
		"*.backyards.banzaicloud.io",
		"base.ec",
		"official.ec",
		"buyshop.jp",
		"fashionstore.jp",
		"handcrafted.jp",
		"kawaiishop.jp",
		"supersale.jp",
		"theshop.jp",
		"shopselect.net",
		"base.shop",
		"*.beget.app",
		"betainabox.com",
		"bnr.la",
		"bitbucket.io",
		"blackbaudcdn.net",
		"of.je",
		"bluebite.io",
		"boomla.net",
		"boutir.com",
		"boxfuse.io",
		"square7.ch",
		"bplaced.com",
		"bplaced.de",
		"square7.de",
		"bplaced.net",
		"square7.net",
		"shop.brendly.rs",
		"browsersafetymark.io",
		"uk0.bigv.io",
		"dh.bytemark.co.uk",
		"vm.bytemark.co.uk",
		"cafjs.com",
		"mycd.eu",
		"drr.ac",
		"uwu.ai",
		"carrd.co",
		"crd.co",
		"ju.mp",
		"ae.org",
		"br.com",
		"cn.com",
		"com.de",
		"com.se",
		"de.com",
		"eu.com",
		"gb.net",
		"hu.net",
		"jp.net",
		"jpn.com",
		"mex.com",
		"ru.com",
		"sa.com",
		"se.net",
		"uk.com",
		"uk.net",
		"us.com",
		"za.bz",
		"za.com",
		"ar.com",
		"hu.com",
		"kr.com",
		"no.com",
		"qc.com",
		"uy.com",
		"africa.com",
		"gr.com",
		"in.net",
		"web.in",
		"us.org",
		"co.com",
		"aus.basketball",
		"nz.basketball",
		"radio.am",
		"radio.fm",
		"c.la",
		"certmgr.org",
		"cx.ua",
		"discourse.group",
		"discourse.team",
		"cleverapps.io",
		"clerk.app",
		"clerkstage.app",
		"*.lcl.dev",
		"*.lclstage.dev",
		"*.stg.dev",
		"*.stgstage.dev",
		"clickrising.net",
		"c66.me",
		"cloud66.ws",
		"cloud66.zone",
		"jdevcloud.com",
		"wpdevcloud.com",
		"cloudaccess.host",
		"freesite.host",
		"cloudaccess.net",
		"cloudcontrolled.com",
		"cloudcontrolapp.com",
		"*.cloudera.site",
		"pages.dev",
		"trycloudflare.com",
		"workers.dev",
		"wnext.app",
		"co.ca",
		"*.otap.co",
		"co.cz",
		"c.cdn77.org",
		"cdn77-ssl.net",
		"r.cdn77.net",
		"rsc.cdn77.org",
		"ssl.origin.cdn77-secure.org",
		"cloudns.asia",
		"cloudns.biz",
		"cloudns.club",
		"cloudns.cc",
		"cloudns.eu",
		"cloudns.in",
		"cloudns.info",
		"cloudns.org",
		"cloudns.pro",
		"cloudns.pw",
		"cloudns.us",
		"cnpy.gdn",
		"codeberg.page",
		"co.nl",
		"co.no",
		"webhosting.be",
		"hosting-cluster.nl",
		"ac.ru",
		"edu.ru",
		"gov.ru",
		"int.ru",
		"mil.ru",
		"test.ru",
		"dyn.cosidns.de",
		"dynamisches-dns.de",
		"dnsupdater.de",
		"internet-dns.de",
		"l-o-g-i-n.de",
		"dynamic-dns.info",
		"feste-ip.net",
		"knx-server.net",
		"static-access.net",
		"realm.cz",
		"*.cryptonomic.net",
		"cupcake.is",
		"curv.dev",
		"*.customer-oci.com",
		"*.oci.customer-oci.com",
		"*.ocp.customer-oci.com",
		"*.ocs.customer-oci.com",
		"cyon.link",
		"cyon.site",
		"fnwk.site",
		"folionetwork.site",
		"platform0.app",
		"daplie.me",
		"localhost.daplie.me",
		"dattolocal.com",
		"dattorelay.com",
		"dattoweb.com",
		"mydatto.com",
		"dattolocal.net",
		"mydatto.net",
		"biz.dk",
		"co.dk",
		"firm.dk",
		"reg.dk",
		"store.dk",
		"dyndns.dappnode.io",
		"*.dapps.earth",
		"*.bzz.dapps.earth",
		"builtwithdark.com",
		"demo.datadetect.com",
		"instance.datadetect.com",
		"edgestack.me",
		"ddns5.com",
		"debian.net",
		"deno.dev",
		"deno-staging.dev",
		"dedyn.io",
		"deta.app",
		"deta.dev",
		"*.rss.my.id",
		"*.diher.solutions",
		"discordsays.com",
		"discordsez.com",
		"jozi.biz",
		"dnshome.de",
		"online.th",
		"shop.th",
		"drayddns.com",
		"shoparena.pl",
		"dreamhosters.com",
		"mydrobo.com",
		"drud.io",
		"drud.us",
		"duckdns.org",
		"bip.sh",
		"bitbridge.net",
		"dy.fi",
		"tunk.org",
		"dyndns-at-home.com",
		"dyndns-at-work.com",
		"dyndns-blog.com",
		"dyndns-free.com",
		"dyndns-home.com",
		"dyndns-ip.com",
		"dyndns-mail.com",
		"dyndns-office.com",
		"dyndns-pics.com",
		"dyndns-remote.com",
		"dyndns-server.com",
		"dyndns-web.com",
		"dyndns-wiki.com",
		"dyndns-work.com",
		"dyndns.biz",
		"dyndns.info",
		"dyndns.org",
		"dyndns.tv",
		"at-band-camp.net",
		"ath.cx",
		"barrel-of-knowledge.info",
		"barrell-of-knowledge.info",
		"better-than.tv",
		"blogdns.com",
		"blogdns.net",
		"blogdns.org",
		"blogsite.org",
		"boldlygoingnowhere.org",
		"broke-it.net",
		"buyshouses.net",
		"cechire.com",
		"dnsalias.com",
		"dnsalias.net",
		"dnsalias.org",
		"dnsdojo.com",
		"dnsdojo.net",
		"dnsdojo.org",
		"does-it.net",
		"doesntexist.com",
		"doesntexist.org",
		"dontexist.com",
		"dontexist.net",
		"dontexist.org",
		"doomdns.com",
		"doomdns.org",
		"dvrdns.org",
		"dyn-o-saur.com",
		"dynalias.com",
		"dynalias.net",
		"dynalias.org",
		"dynathome.net",
		"dyndns.ws",
		"endofinternet.net",
		"endofinternet.org",
		"endoftheinternet.org",
		"est-a-la-maison.com",
		"est-a-la-masion.com",
		"est-le-patron.com",
		"est-mon-blogueur.com",
		"for-better.biz",
		"for-more.biz",
		"for-our.info",
		"for-some.biz",
		"for-the.biz",
		"forgot.her.name",
		"forgot.his.name",
		"from-ak.com",
		"from-al.com",
		"from-ar.com",
		"from-az.net",
		"from-ca.com",
		"from-co.net",
		"from-ct.com",
		"from-dc.com",
		"from-de.com",
		"from-fl.com",
		"from-ga.com",
		"from-hi.com",
		"from-ia.com",
		"from-id.com",
		"from-il.com",
		"from-in.com",
		"from-ks.com",
		"from-ky.com",
		"from-la.net",
		"from-ma.com",
		"from-md.com",
		"from-me.org",
		"from-mi.com",
		"from-mn.com",
		"from-mo.com",
		"from-ms.com",
		"from-mt.com",
		"from-nc.com",
		"from-nd.com",
		"from-ne.com",
		"from-nh.com",
		"from-nj.com",
		"from-nm.com",
		"from-nv.com",
		"from-ny.net",
		"from-oh.com",
		"from-ok.com",
		"from-or.com",
		"from-pa.com",
		"from-pr.com",
		"from-ri.com",
		"from-sc.com",
		"from-sd.com",
		"from-tn.com",
		"from-tx.com",
		"from-ut.com",
		"from-va.com",
		"from-vt.com",
		"from-wa.com",
		"from-wi.com",
		"from-wv.com",
		"from-wy.com",
		"ftpaccess.cc",
		"fuettertdasnetz.de",
		"game-host.org",
		"game-server.cc",
		"getmyip.com",
		"gets-it.net",
		"go.dyndns.org",
		"gotdns.com",
		"gotdns.org",
		"groks-the.info",
		"groks-this.info",
		"ham-radio-op.net",
		"here-for-more.info",
		"hobby-site.com",
		"hobby-site.org",
		"home.dyndns.org",
		"homedns.org",
		"homeftp.net",
		"homeftp.org",
		"homeip.net",
		"homelinux.com",
		"homelinux.net",
		"homelinux.org",
		"homeunix.com",
		"homeunix.net",
		"homeunix.org",
		"iamallama.com",
		"in-the-band.net",
		"is-a-anarchist.com",
		"is-a-blogger.com",
		"is-a-bookkeeper.com",
		"is-a-bruinsfan.org",
		"is-a-bulls-fan.com",
		"is-a-candidate.org",
		"is-a-caterer.com",
		"is-a-celticsfan.org",
		"is-a-chef.com",
		"is-a-chef.net",
		"is-a-chef.org",
		"is-a-conservative.com",
		"is-a-cpa.com",
		"is-a-cubicle-slave.com",
		"is-a-democrat.com",
		"is-a-designer.com",
		"is-a-doctor.com",
		"is-a-financialadvisor.com",
		"is-a-geek.com",
		"is-a-geek.net",
		"is-a-geek.org",
		"is-a-green.com",
		"is-a-guru.com",
		"is-a-hard-worker.com",
		"is-a-hunter.com",
		"is-a-knight.org",
		"is-a-landscaper.com",
		"is-a-lawyer.com",
		"is-a-liberal.com",
		"is-a-libertarian.com",
		"is-a-linux-user.org",
		"is-a-llama.com",
		"is-a-musician.com",
		"is-a-nascarfan.com",
		"is-a-nurse.com",
		"is-a-painter.com",
		"is-a-patsfan.org",
		"is-a-personaltrainer.com",
		"is-a-photographer.com",
		"is-a-player.com",
		"is-a-republican.com",
		"is-a-rockstar.com",
		"is-a-socialist.com",
		"is-a-soxfan.org",
		"is-a-student.com",
		"is-a-teacher.com",
		"is-a-techie.com",
		"is-a-therapist.com",
		"is-an-accountant.com",
		"is-an-actor.com",
		"is-an-actress.com",
		"is-an-anarchist.com",
		"is-an-artist.com",
		"is-an-engineer.com",
		"is-an-entertainer.com",
		"is-by.us",
		"is-certified.com",
		"is-found.org",
		"is-gone.com",
		"is-into-anime.com",
		"is-into-cars.com",
		"is-into-cartoons.com",
		"is-into-games.com",
		"is-leet.com",
		"is-lost.org",
		"is-not-certified.com",
		"is-saved.org",
		"is-slick.com",
		"is-uberleet.com",
		"is-very-bad.org",
		"is-very-evil.org",
		"is-very-good.org",
		"is-very-nice.org",
		"is-very-sweet.org",
		"is-with-theband.com",
		"isa-geek.com",
		"isa-geek.net",
		"isa-geek.org",
		"isa-hockeynut.com",
		"issmarterthanyou.com",
		"isteingeek.de",
		"istmein.de",
		"kicks-ass.net",
		"kicks-ass.org",
		"knowsitall.info",
		"land-4-sale.us",
		"lebtimnetz.de",
		"leitungsen.de",
		"likes-pie.com",
		"likescandy.com",
		"merseine.nu",
		"mine.nu",
		"misconfused.org",
		"mypets.ws",
		"myphotos.cc",
		"neat-url.com",
		"office-on-the.net",
		"on-the-web.tv",
		"podzone.net",
		"podzone.org",
		"readmyblog.org",
		"saves-the-whales.com",
		"scrapper-site.net",
		"scrapping.cc",
		"selfip.biz",
		"selfip.com",
		"selfip.info",
		"selfip.net",
		"selfip.org",
		"sells-for-less.com",
		"sells-for-u.com",
		"sells-it.net",
		"sellsyourhome.org",
		"servebbs.com",
		"servebbs.net",
		"servebbs.org",
		"serveftp.net",
		"serveftp.org",
		"servegame.org",
		"shacknet.nu",
		"simple-url.com",
		"space-to-rent.com",
		"stuff-4-sale.org",
		"stuff-4-sale.us",
		"teaches-yoga.com",
		"thruhere.net",
		"traeumtgerade.de",
		"webhop.biz",
		"webhop.info",
		"webhop.net",
		"webhop.org",
		"worse-than.tv",
		"writesthisblog.com",
		"ddnss.de",
		"dyn.ddnss.de",
		"dyndns.ddnss.de",
		"dyndns1.de",
		"dyn-ip24.de",
		"home-webserver.de",
		"dyn.home-webserver.de",
		"myhome-server.de",
		"ddnss.org",
		"definima.net",
		"definima.io",
		"ondigitalocean.app",
		"*.digitaloceanspaces.com",
		"bci.dnstrace.pro",
		"ddnsfree.com",
		"ddnsgeek.com",
		"giize.com",
		"gleeze.com",
		"kozow.com",
		"loseyourip.com",
		"ooguy.com",
		"theworkpc.com",
		"casacam.net",
		"dynu.net",
		"accesscam.org",
		"camdvr.org",
		"freeddns.org",
		"mywire.org",
		"webredirect.org",
		"myddns.rocks",
		"blogsite.xyz",
		"dynv6.net",
		"e4.cz",
		"eero.online",
		"eero-stage.online",
		"elementor.cloud",
		"elementor.cool",
		"en-root.fr",
		"mytuleap.com",
		"tuleap-partners.com",
		"encr.app",
		"encoreapi.com",
		"onred.one",
		"staging.onred.one",
		"eu.encoway.cloud",
		"eu.org",
		"al.eu.org",
		"asso.eu.org",
		"at.eu.org",
		"au.eu.org",
		"be.eu.org",
		"bg.eu.org",
		"ca.eu.org",
		"cd.eu.org",
		"ch.eu.org",
		"cn.eu.org",
		"cy.eu.org",
		"cz.eu.org",
		"de.eu.org",
		"dk.eu.org",
		"edu.eu.org",
		"ee.eu.org",
		"es.eu.org",
		"fi.eu.org",
		"fr.eu.org",
		"gr.eu.org",
		"hr.eu.org",
		"hu.eu.org",
		"ie.eu.org",
		"il.eu.org",
		"in.eu.org",
		"int.eu.org",
		"is.eu.org",
		"it.eu.org",
		"jp.eu.org",
		"kr.eu.org",
		"lt.eu.org",
		"lu.eu.org",
		"lv.eu.org",
		"mc.eu.org",
		"me.eu.org",
		"mk.eu.org",
		"mt.eu.org",
		"my.eu.org",
		"net.eu.org",
		"ng.eu.org",
		"nl.eu.org",
		"no.eu.org",
		"nz.eu.org",
		"paris.eu.org",
		"pl.eu.org",
		"pt.eu.org",
		"q-a.eu.org",
		"ro.eu.org",
		"ru.eu.org",
		"se.eu.org",
		"si.eu.org",
		"sk.eu.org",
		"tr.eu.org",
		"uk.eu.org",
		"us.eu.org",
		"eurodir.ru",
		"eu-1.evennode.com",
		"eu-2.evennode.com",
		"eu-3.evennode.com",
		"eu-4.evennode.com",
		"us-1.evennode.com",
		"us-2.evennode.com",
		"us-3.evennode.com",
		"us-4.evennode.com",
		"twmail.cc",
		"twmail.net",
		"twmail.org",
		"mymailer.com.tw",
		"url.tw",
		"onfabrica.com",
		"apps.fbsbx.com",
		"ru.net",
		"adygeya.ru",
		"bashkiria.ru",
		"bir.ru",
		"cbg.ru",
		"com.ru",
		"dagestan.ru",
		"grozny.ru",
		"kalmykia.ru",
		"kustanai.ru",
		"marine.ru",
		"mordovia.ru",
		"msk.ru",
		"mytis.ru",
		"nalchik.ru",
		"nov.ru",
		"pyatigorsk.ru",
		"spb.ru",
		"vladikavkaz.ru",
		"vladimir.ru",
		"abkhazia.su",
		"adygeya.su",
		"aktyubinsk.su",
		"arkhangelsk.su",
		"armenia.su",
		"ashgabad.su",
		"azerbaijan.su",
		"balashov.su",
		"bashkiria.su",
		"bryansk.su",
		"bukhara.su",
		"chimkent.su",
		"dagestan.su",
		"east-kazakhstan.su",
		"exnet.su",
		"georgia.su",
		"grozny.su",
		"ivanovo.su",
		"jambyl.su",
		"kalmykia.su",
		"kaluga.su",
		"karacol.su",
		"karaganda.su",
		"karelia.su",
		"khakassia.su",
		"krasnodar.su",
		"kurgan.su",
		"kustanai.su",
		"lenug.su",
		"mangyshlak.su",
		"mordovia.su",
		"msk.su",
		"murmansk.su",
		"nalchik.su",
		"navoi.su",
		"north-kazakhstan.su",
		"nov.su",
		"obninsk.su",
		"penza.su",
		"pokrovsk.su",
		"sochi.su",
		"spb.su",
		"tashkent.su",
		"termez.su",
		"togliatti.su",
		"troitsk.su",
		"tselinograd.su",
		"tula.su",
		"tuva.su",
		"vladikavkaz.su",
		"vladimir.su",
		"vologda.su",
		"channelsdvr.net",
		"u.channelsdvr.net",
		"edgecompute.app",
		"fastly-terrarium.com",
		"fastlylb.net",
		"map.fastlylb.net",
		"freetls.fastly.net",
		"map.fastly.net",
		"a.prod.fastly.net",
		"global.prod.fastly.net",
		"a.ssl.fastly.net",
		"b.ssl.fastly.net",
		"global.ssl.fastly.net",
		"fastvps-server.com",
		"fastvps.host",
		"myfast.host",
		"fastvps.site",
		"myfast.space",
		"fedorainfracloud.org",
		"fedorapeople.org",
		"cloud.fedoraproject.org",
		"app.os.fedoraproject.org",
		"app.os.stg.fedoraproject.org",
		"conn.uk",
		"copro.uk",
		"hosp.uk",
		"mydobiss.com",
		"fh-muenster.io",
		"filegear.me",
		"filegear-au.me",
		"filegear-de.me",
		"filegear-gb.me",
		"filegear-ie.me",
		"filegear-jp.me",
		"filegear-sg.me",
		"firebaseapp.com",
		"fireweb.app",
		"flap.id",
		"onflashdrive.app",
		"fldrv.com",
		"fly.dev",
		"edgeapp.net",
		"shw.io",
		"flynnhosting.net",
		"forgeblocks.com",
		"id.forgerock.io",
		"framer.app",
		"framercanvas.com",
		"*.frusky.de",
		"ravpage.co.il",
		"0e.vc",
		"freebox-os.com",
		"freeboxos.com",
		"fbx-os.fr",
		"fbxos.fr",
		"freebox-os.fr",
		"freeboxos.fr",
		"freedesktop.org",
		"freemyip.com",
		"wien.funkfeuer.at",
		"*.futurecms.at",
		"*.ex.futurecms.at",
		"*.in.futurecms.at",
		"futurehosting.at",
		"futuremailing.at",
		"*.ex.ortsinfo.at",
		"*.kunden.ortsinfo.at",
		"*.statics.cloud",
		"independent-commission.uk",
		"independent-inquest.uk",
		"independent-inquiry.uk",
		"independent-panel.uk",
		"independent-review.uk",
		"public-inquiry.uk",
		"royal-commission.uk",
		"campaign.gov.uk",
		"service.gov.uk",
		"api.gov.uk",
		"gehirn.ne.jp",
		"usercontent.jp",
		"gentapps.com",
		"gentlentapis.com",
		"lab.ms",
		"cdn-edges.net",
		"ghost.io",
		"gsj.bz",
		"githubusercontent.com",
		"githubpreview.dev",
		"github.io",
		"gitlab.io",
		"gitapp.si",
		"gitpage.si",
		"glitch.me",
		"nog.community",
		"co.ro",
		"shop.ro",
		"lolipop.io",
		"angry.jp",
		"babyblue.jp",
		"babymilk.jp",
		"backdrop.jp",
		"bambina.jp",
		"bitter.jp",
		"blush.jp",
		"boo.jp",
		"boy.jp",
		"boyfriend.jp",
		"but.jp",
		"candypop.jp",
		"capoo.jp",
		"catfood.jp",
		"cheap.jp",
		"chicappa.jp",
		"chillout.jp",
		"chips.jp",
		"chowder.jp",
		"chu.jp",
		"ciao.jp",
		"cocotte.jp",
		"coolblog.jp",
		"cranky.jp",
		"cutegirl.jp",
		"daa.jp",
		"deca.jp",
		"deci.jp",
		"digick.jp",
		"egoism.jp",
		"fakefur.jp",
		"fem.jp",
		"flier.jp",
		"floppy.jp",
		"fool.jp",
		"frenchkiss.jp",
		"girlfriend.jp",
		"girly.jp",
		"gloomy.jp",
		"gonna.jp",
		"greater.jp",
		"hacca.jp",
		"heavy.jp",
		"her.jp",
		"hiho.jp",
		"hippy.jp",
		"holy.jp",
		"hungry.jp",
		"icurus.jp",
		"itigo.jp",
		"jellybean.jp",
		"kikirara.jp",
		"kill.jp",
		"kilo.jp",
		"kuron.jp",
		"littlestar.jp",
		"lolipopmc.jp",
		"lolitapunk.jp",
		"lomo.jp",
		"lovepop.jp",
		"lovesick.jp",
		"main.jp",
		"mods.jp",
		"mond.jp",
		"mongolian.jp",
		"moo.jp",
		"namaste.jp",
		"nikita.jp",
		"nobushi.jp",
		"noor.jp",
		"oops.jp",
		"parallel.jp",
		"parasite.jp",
		"pecori.jp",
		"peewee.jp",
		"penne.jp",
		"pepper.jp",
		"perma.jp",
		"pigboat.jp",
		"pinoko.jp",
		"punyu.jp",
		"pupu.jp",
		"pussycat.jp",
		"pya.jp",
		"raindrop.jp",
		"readymade.jp",
		"sadist.jp",
		"schoolbus.jp",
		"secret.jp",
		"staba.jp",
		"stripper.jp",
		"sub.jp",
		"sunnyday.jp",
		"thick.jp",
		"tonkotsu.jp",
		"under.jp",
		"upper.jp",
		"velvet.jp",
		"verse.jp",
		"versus.jp",
		"vivian.jp",
		"watson.jp",
		"weblike.jp",
		"whitesnow.jp",
		"zombie.jp",
		"heteml.net",
		"cloudapps.digital",
		"london.cloudapps.digital",
		"pymnt.uk",
		"homeoffice.gov.uk",
		"ro.im",
		"goip.de",
		"run.app",
		"a.run.app",
		"web.app",
		"*.0emm.com",
		"appspot.com",
		"*.r.appspot.com",
		"codespot.com",
		"googleapis.com",
		"googlecode.com",
		"pagespeedmobilizer.com",
		"publishproxy.com",
		"withgoogle.com",
		"withyoutube.com",
		"*.gateway.dev",
		"cloud.goog",
		"translate.goog",
		"*.usercontent.goog",
		"cloudfunctions.net",
		"blogspot.ae",
		"blogspot.al",
		"blogspot.am",
		"blogspot.ba",
		"blogspot.be",
		"blogspot.bg",
		"blogspot.bj",
		"blogspot.ca",
		"blogspot.cf",
		"blogspot.ch",
		"blogspot.cl",
		"blogspot.co.at",
		"blogspot.co.id",
		"blogspot.co.il",
		"blogspot.co.ke",
		"blogspot.co.nz",
		"blogspot.co.uk",
		"blogspot.co.za",
		"blogspot.com",
		"blogspot.com.ar",
		"blogspot.com.au",
		"blogspot.com.br",
		"blogspot.com.by",
		"blogspot.com.co",
		"blogspot.com.cy",
		"blogspot.com.ee",
		"blogspot.com.eg",
		"blogspot.com.es",
		"blogspot.com.mt",
		"blogspot.com.ng",
		"blogspot.com.tr",
		"blogspot.com.uy",
		"blogspot.cv",
		"blogspot.cz",
		"blogspot.de",
		"blogspot.dk",
		"blogspot.fi",
		"blogspot.fr",
		"blogspot.gr",
		"blogspot.hk",
		"blogspot.hr",
		"blogspot.hu",
		"blogspot.ie",
		"blogspot.in",
		"blogspot.is",
		"blogspot.it",
		"blogspot.jp",
		"blogspot.kr",
		"blogspot.li",
		"blogspot.lt",
		"blogspot.lu",
		"blogspot.md",
		"blogspot.mk",
		"blogspot.mr",
		"blogspot.mx",
		"blogspot.my",
		"blogspot.nl",
		"blogspot.no",
		"blogspot.pe",
		"blogspot.pt",
		"blogspot.qa",
		"blogspot.re",
		"blogspot.ro",
		"blogspot.rs",
		"blogspot.ru",
		"blogspot.se",
		"blogspot.sg",
		"blogspot.si",
		"blogspot.sk",
		"blogspot.sn",
		"blogspot.td",
		"blogspot.tw",
		"blogspot.ug",
		"blogspot.vn",
		"goupile.fr",
		"gov.nl",
		"awsmppl.com",
		"günstigbestellen.de",
		"günstigliefern.de",
		"fin.ci",
		"free.hr",
		"caa.li",
		"ua.rs",
		"conf.se",
		"hs.zone",
		"hs.run",
		"hashbang.sh",
		"hasura.app",
		"hasura-app.io",
		"pages.it.hs-heilbronn.de",
		"hepforge.org",
		"herokuapp.com",
		"herokussl.com",
		"ravendb.cloud",
		"myravendb.com",
		"ravendb.community",
		"ravendb.me",
		"development.run",
		"ravendb.run",
		"homesklep.pl",
		"secaas.hk",
		"hoplix.shop",
		"orx.biz",
		"biz.gl",
		"col.ng",
		"firm.ng",
		"gen.ng",
		"ltd.ng",
		"ngo.ng",
		"edu.scot",
		"sch.so",
		"hostyhosting.io",
		"häkkinen.fi",
		"*.moonscale.io",
		"moonscale.net",
		"iki.fi",
		"ibxos.it",
		"iliadboxos.it",
		"impertrixcdn.com",
		"impertrix.com",
		"smushcdn.com",
		"wphostedmail.com",
		"wpmucdn.com",
		"tempurl.host",
		"wpmudev.host",
		"dyn-berlin.de",
		"in-berlin.de",
		"in-brb.de",
		"in-butter.de",
		"in-dsl.de",
		"in-dsl.net",
		"in-dsl.org",
		"in-vpn.de",
		"in-vpn.net",
		"in-vpn.org",
		"biz.at",
		"info.at",
		"info.cx",
		"ac.leg.br",
		"al.leg.br",
		"am.leg.br",
		"ap.leg.br",
		"ba.leg.br",
		"ce.leg.br",
		"df.leg.br",
		"es.leg.br",
		"go.leg.br",
		"ma.leg.br",
		"mg.leg.br",
		"ms.leg.br",
		"mt.leg.br",
		"pa.leg.br",
		"pb.leg.br",
		"pe.leg.br",
		"pi.leg.br",
		"pr.leg.br",
		"rj.leg.br",
		"rn.leg.br",
		"ro.leg.br",
		"rr.leg.br",
		"rs.leg.br",
		"sc.leg.br",
		"se.leg.br",
		"sp.leg.br",
		"to.leg.br",
		"pixolino.com",
		"na4u.ru",
		"iopsys.se",
		"ipifony.net",
		"iservschule.de",
		"mein-iserv.de",
		"schulplattform.de",
		"schulserver.de",
		"test-iserv.de",
		"iserv.dev",
		"iobb.net",
		"mel.cloudlets.com.au",
		"cloud.interhostsolutions.be",
		"users.scale.virtualcloud.com.br",
		"mycloud.by",
		"alp1.ae.flow.ch",
		"appengine.flow.ch",
		"es-1.axarnet.cloud",
		"diadem.cloud",
		"vip.jelastic.cloud",
		"jele.cloud",
		"it1.eur.aruba.jenv-aruba.cloud",
		"it1.jenv-aruba.cloud",
		"keliweb.cloud",
		"cs.keliweb.cloud",
		"oxa.cloud",
		"tn.oxa.cloud",
		"uk.oxa.cloud",
		"primetel.cloud",
		"uk.primetel.cloud",
		"ca.reclaim.cloud",
		"uk.reclaim.cloud",
		"us.reclaim.cloud",
		"ch.trendhosting.cloud",
		"de.trendhosting.cloud",
		"jele.club",
		"amscompute.com",
		"clicketcloud.com",
		"dopaas.com",
		"hidora.com",
		"paas.hosted-by-previder.com",
		"rag-cloud.hosteur.com",
		"rag-cloud-ch.hosteur.com",
		"jcloud.ik-server.com",
		"jcloud-ver-jpc.ik-server.com",
		"demo.jelastic.com",
		"kilatiron.com",
		"paas.massivegrid.com",
		"jed.wafaicloud.com",
		"lon.wafaicloud.com",
		"ryd.wafaicloud.com",
		"j.scaleforce.com.cy",
		"jelastic.dogado.eu",
		"fi.cloudplatform.fi",
		"demo.datacenter.fi",
		"paas.datacenter.fi",
		"jele.host",
		"mircloud.host",
		"paas.beebyte.io",
		"sekd1.beebyteapp.io",
		"jele.io",
		"cloud-fr1.unispace.io",
		"jc.neen.it",
		"cloud.jelastic.open.tim.it",
		"jcloud.kz",
		"upaas.kazteleport.kz",
		"cloudjiffy.net",
		"fra1-de.cloudjiffy.net",
		"west1-us.cloudjiffy.net",
		"jls-sto1.elastx.net",
		"jls-sto2.elastx.net",
		"jls-sto3.elastx.net",
		"faststacks.net",
		"fr-1.paas.massivegrid.net",
		"lon-1.paas.massivegrid.net",
		"lon-2.paas.massivegrid.net",
		"ny-1.paas.massivegrid.net",
		"ny-2.paas.massivegrid.net",
		"sg-1.paas.massivegrid.net",
		"jelastic.saveincloud.net",
		"nordeste-idc.saveincloud.net",
		"j.scaleforce.net",
		"jelastic.tsukaeru.net",
		"sdscloud.pl",
		"unicloud.pl",
		"mircloud.ru",
		"jelastic.regruhosting.ru",
		"enscaled.sg",
		"jele.site",
		"jelastic.team",
		"orangecloud.tn",
		"j.layershift.co.uk",
		"phx.enscaled.us",
		"mircloud.us",
		"myjino.ru",
		"*.hosting.myjino.ru",
		"*.landing.myjino.ru",
		"*.spectrum.myjino.ru",
		"*.vps.myjino.ru",
		"jotelulu.cloud",
		"*.triton.zone",
		"*.cns.joyent.com",
		"js.org",
		"kaas.gg",
		"khplay.nl",
		"ktistory.com",
		"kapsi.fi",
		"keymachine.de",
		"kinghost.net",
		"uni5.net",
		"knightpoint.systems",
		"koobin.events",
		"oya.to",
		"kuleuven.cloud",
		"ezproxy.kuleuven.be",
		"co.krd",
		"edu.krd",
		"krellian.net",
		"webthings.io",
		"git-repos.de",
		"lcube-server.de",
		"svn-repos.de",
		"leadpages.co",
		"lpages.co",
		"lpusercontent.com",
		"lelux.site",
		"co.business",
		"co.education",
		"co.events",
		"co.financial",
		"co.network",
		"co.place",
		"co.technology",
		"app.lmpm.com",
		"linkyard.cloud",
		"linkyard-cloud.ch",
		"members.linode.com",
		"*.nodebalancer.linode.com",
		"*.linodeobjects.com",
		"ip.linodeusercontent.com",
		"we.bs",
		"*.user.localcert.dev",
		"localzone.xyz",
		"loginline.app",
		"loginline.dev",
		"loginline.io",
		"loginline.services",
		"loginline.site",
		"servers.run",
		"lohmus.me",
		"krasnik.pl",
		"leczna.pl",
		"lubartow.pl",
		"lublin.pl",
		"poniatowa.pl",
		"swidnik.pl",
		"glug.org.uk",
		"lug.org.uk",
		"lugs.org.uk",
		"barsy.bg",
		"barsy.co.uk",
		"barsyonline.co.uk",
		"barsycenter.com",
		"barsyonline.com",
		"barsy.club",
		"barsy.de",
		"barsy.eu",
		"barsy.in",
		"barsy.info",
		"barsy.io",
		"barsy.me",
		"barsy.menu",
		"barsy.mobi",
		"barsy.net",
		"barsy.online",
		"barsy.org",
		"barsy.pro",
		"barsy.pub",
		"barsy.ro",
		"barsy.shop",
		"barsy.site",
		"barsy.support",
		"barsy.uk",
		"*.magentosite.cloud",
		"mayfirst.info",
		"mayfirst.org",
		"hb.cldmail.ru",
		"cn.vu",
		"mazeplay.com",
		"mcpe.me",
		"mcdir.me",
		"mcdir.ru",
		"mcpre.ru",
		"vps.mcdir.ru",
		"mediatech.by",
		"mediatech.dev",
		"hra.health",
		"miniserver.com",
		"memset.net",
		"messerli.app",
		"*.cloud.metacentrum.cz",
		"custom.metacentrum.cz",
		"flt.cloud.muni.cz",
		"usr.cloud.muni.cz",
		"meteorapp.com",
		"eu.meteorapp.com",
		"co.pl",
		"*.azurecontainer.io",
		"azurewebsites.net",
		"azure-mobile.net",
		"cloudapp.net",
		"azurestaticapps.net",
		"1.azurestaticapps.net",
		"centralus.azurestaticapps.net",
		"eastasia.azurestaticapps.net",
		"eastus2.azurestaticapps.net",
		"westeurope.azurestaticapps.net",
		"westus2.azurestaticapps.net",
		"csx.cc",
		"mintere.site",
		"forte.id",
		"mozilla-iot.org",
		"bmoattachments.org",
		"net.ru",
		"org.ru",
		"pp.ru",
		"hostedpi.com",
		"customer.mythic-beasts.com",
		"caracal.mythic-beasts.com",
		"fentiger.mythic-beasts.com",
		"lynx.mythic-beasts.com",
		"ocelot.mythic-beasts.com",
		"oncilla.mythic-beasts.com",
		"onza.mythic-beasts.com",
		"sphinx.mythic-beasts.com",
		"vs.mythic-beasts.com",
		"x.mythic-beasts.com",
		"yali.mythic-beasts.com",
		"cust.retrosnub.co.uk",
		"ui.nabu.casa",
		"pony.club",
		"of.fashion",
		"in.london",
		"of.london",
		"from.marketing",
		"with.marketing",
		"for.men",
		"repair.men",
		"and.mom",
		"for.mom",
		"for.one",
		"under.one",
		"for.sale",
		"that.win",
		"from.work",
		"to.work",
		"cloud.nospamproxy.com",
		"netlify.app",
		"4u.com",
		"ngrok.io",
		"nh-serv.co.uk",
		"nfshost.com",
		"*.developer.app",
		"noop.app",
		"*.northflank.app",
		"*.build.run",
		"*.code.run",
		"*.database.run",
		"*.migration.run",
		"noticeable.news",
		"dnsking.ch",
		"mypi.co",
		"n4t.co",
		"001www.com",
		"ddnslive.com",
		"myiphost.com",
		"forumz.info",
		"16-b.it",
		"32-b.it",
		"64-b.it",
		"soundcast.me",
		"tcp4.me",
		"dnsup.net",
		"hicam.net",
		"now-dns.net",
		"ownip.net",
		"vpndns.net",
		"dynserv.org",
		"now-dns.org",
		"x443.pw",
		"now-dns.top",
		"ntdll.top",
		"freeddns.us",
		"crafting.xyz",
		"zapto.xyz",
		"nsupdate.info",
		"nerdpol.ovh",
		"blogsyte.com",
		"brasilia.me",
		"cable-modem.org",
		"ciscofreak.com",
		"collegefan.org",
		"couchpotatofries.org",
		"damnserver.com",
		"ddns.me",
		"ditchyourip.com",
		"dnsfor.me",
		"dnsiskinky.com",
		"dvrcam.info",
		"dynns.com",
		"eating-organic.net",
		"fantasyleague.cc",
		"geekgalaxy.com",
		"golffan.us",
		"health-carereform.com",
		"homesecuritymac.com",
		"homesecuritypc.com",
		"hopto.me",
		"ilovecollege.info",
		"loginto.me",
		"mlbfan.org",
		"mmafan.biz",
		"myactivedirectory.com",
		"mydissent.net",
		"myeffect.net",
		"mymediapc.net",
		"mypsx.net",
		"mysecuritycamera.com",
		"mysecuritycamera.net",
		"mysecuritycamera.org",
		"net-freaks.com",
		"nflfan.org",
		"nhlfan.net",
		"no-ip.ca",
		"no-ip.co.uk",
		"no-ip.net",
		"noip.us",
		"onthewifi.com",
		"pgafan.net",
		"point2this.com",
		"pointto.us",
		"privatizehealthinsurance.net",
		"quicksytes.com",
		"read-books.org",
		"securitytactics.com",
		"serveexchange.com",
		"servehumour.com",
		"servep2p.com",
		"servesarcasm.com",
		"stufftoread.com",
		"ufcfan.org",
		"unusualperson.com",
		"workisboring.com",
		"3utilities.com",
		"bounceme.net",
		"ddns.net",
		"ddnsking.com",
		"gotdns.ch",
		"hopto.org",
		"myftp.biz",
		"myftp.org",
		"myvnc.com",
		"no-ip.biz",
		"no-ip.info",
		"no-ip.org",
		"noip.me",
		"redirectme.net",
		"servebeer.com",
		"serveblog.net",
		"servecounterstrike.com",
		"serveftp.com",
		"servegame.com",
		"servehalflife.com",
		"servehttp.com",
		"serveirc.com",
		"serveminecraft.net",
		"servemp3.com",
		"servepics.com",
		"servequake.com",
		"sytes.net",
		"webhop.me",
		"zapto.org",
		"stage.nodeart.io",
		"pcloud.host",
		"nyc.mn",
		"static.observableusercontent.com",
		"cya.gg",
		"omg.lol",
		"cloudycluster.net",
		"omniwe.site",
		"service.one",
		"nid.io",
		"opensocial.site",
		"opencraft.hosting",
		"orsites.com",
		"operaunite.com",
		"tech.orange",
		"authgear-staging.com",
		"authgearapps.com",
		"skygearapp.com",
		"outsystemscloud.com",
		"*.webpaas.ovh.net",
		"*.hosting.ovh.net",
		"ownprovider.com",
		"own.pm",
		"*.owo.codes",
		"ox.rs",
		"oy.lc",
		"pgfog.com",
		"pagefrontapp.com",
		"pagexl.com",
		"*.paywhirl.com",
		"bar0.net",
		"bar1.net",
		"bar2.net",
		"rdv.to",
		"art.pl",
		"gliwice.pl",
		"krakow.pl",
		"poznan.pl",
		"wroc.pl",
		"zakopane.pl",
		"pantheonsite.io",
		"gotpantheon.com",
		"mypep.link",
		"perspecta.cloud",
		"lk3.ru",
		"on-web.fr",
		"bc.platform.sh",
		"ent.platform.sh",
		"eu.platform.sh",
		"us.platform.sh",
		"*.platformsh.site",
		"*.tst.site",
		"platter-app.com",
		"platter-app.dev",
		"platterp.us",
		"pdns.page",
		"plesk.page",
		"pleskns.com",
		"dyn53.io",
		"onporter.run",
		"co.bn",
		"postman-echo.com",
		"pstmn.io",
		"mock.pstmn.io",
		"httpbin.org",
		"prequalifyme.today",
		"xen.prgmr.com",
		"priv.at",
		"prvcy.page",
		"*.dweb.link",
		"protonet.io",
		"chirurgiens-dentistes-en-france.fr",
		"byen.site",
		"pubtls.org",
		"pythonanywhere.com",
		"eu.pythonanywhere.com",
		"qoto.io",
		"qualifioapp.com",
		"qbuser.com",
		"cloudsite.builders",
		"instances.spawn.cc",
		"instantcloud.cn",
		"ras.ru",
		"qa2.com",
		"qcx.io",
		"*.sys.qcx.io",
		"dev-myqnapcloud.com",
		"alpha-myqnapcloud.com",
		"myqnapcloud.com",
		"*.quipelements.com",
		"vapor.cloud",
		"vaporcloud.io",
		"rackmaze.com",
		"rackmaze.net",
		"g.vbrplsbx.io",
		"*.on-k3s.io",
		"*.on-rancher.cloud",
		"*.on-rio.io",
		"readthedocs.io",
		"rhcloud.com",
		"app.render.com",
		"onrender.com",
		"repl.co",
		"id.repl.co",
		"repl.run",
		"resindevice.io",
		"devices.resinstaging.io",
		"hzc.io",
		"wellbeingzone.eu",
		"wellbeingzone.co.uk",
		"adimo.co.uk",
		"itcouldbewor.se",
		"git-pages.rit.edu",
		"rocky.page",
		"биз.рус",
		"ком.рус",
		"крым.рус",
		"мир.рус",
		"мск.рус",
		"орг.рус",
		"самара.рус",
		"сочи.рус",
		"спб.рус",
		"я.рус",
		"*.builder.code.com",
		"*.dev-builder.code.com",
		"*.stg-builder.code.com",
		"sandcats.io",
		"logoip.de",
		"logoip.com",
		"fr-par-1.baremetal.scw.cloud",
		"fr-par-2.baremetal.scw.cloud",
		"nl-ams-1.baremetal.scw.cloud",
		"fnc.fr-par.scw.cloud",
		"functions.fnc.fr-par.scw.cloud",
		"k8s.fr-par.scw.cloud",
		"nodes.k8s.fr-par.scw.cloud",
		"s3.fr-par.scw.cloud",
		"s3-website.fr-par.scw.cloud",
		"whm.fr-par.scw.cloud",
		"priv.instances.scw.cloud",
		"pub.instances.scw.cloud",
		"k8s.scw.cloud",
		"k8s.nl-ams.scw.cloud",
		"nodes.k8s.nl-ams.scw.cloud",
		"s3.nl-ams.scw.cloud",
		"s3-website.nl-ams.scw.cloud",
		"whm.nl-ams.scw.cloud",
		"k8s.pl-waw.scw.cloud",
		"nodes.k8s.pl-waw.scw.cloud",
		"s3.pl-waw.scw.cloud",
		"s3-website.pl-waw.scw.cloud",
		"scalebook.scw.cloud",
		"smartlabeling.scw.cloud",
		"dedibox.fr",
		"schokokeks.net",
		"gov.scot",
		"service.gov.scot",
		"scrysec.com",
		"firewall-gateway.com",
		"firewall-gateway.de",
		"my-gateway.de",
		"my-router.de",
		"spdns.de",
		"spdns.eu",
		"firewall-gateway.net",
		"my-firewall.org",
		"myfirewall.org",
		"spdns.org",
		"seidat.net",
		"sellfy.store",
		"senseering.net",
		"minisite.ms",
		"magnet.page",
		"biz.ua",
		"co.ua",
		"pp.ua",
		"shiftcrypto.dev",
		"shiftcrypto.io",
		"shiftedit.io",
		"myshopblocks.com",
		"myshopify.com",
		"shopitsite.com",
		"shopware.store",
		"mo-siemens.io",
		"1kapp.com",
		"appchizi.com",
		"applinzi.com",
		"sinaapp.com",
		"vipsinaapp.com",
		"siteleaf.net",
		"bounty-full.com",
		"alpha.bounty-full.com",
		"beta.bounty-full.com",
		"small-web.org",
		"vp4.me",
		"try-snowplow.com",
		"srht.site",
		"stackhero-network.com",
		"musician.io",
		"novecore.site",
		"static.land",
		"dev.static.land",
		"sites.static.land",
		"storebase.store",
		"vps-host.net",
		"atl.jelastic.vps-host.net",
		"njs.jelastic.vps-host.net",
		"ric.jelastic.vps-host.net",
		"playstation-cloud.com",
		"apps.lair.io",
		"*.stolos.io",
		"spacekit.io",
		"customer.speedpartner.de",
		"myspreadshop.at",
		"myspreadshop.com.au",
		"myspreadshop.be",
		"myspreadshop.ca",
		"myspreadshop.ch",
		"myspreadshop.com",
		"myspreadshop.de",
		"myspreadshop.dk",
		"myspreadshop.es",
		"myspreadshop.fi",
		"myspreadshop.fr",
		"myspreadshop.ie",
		"myspreadshop.it",
		"myspreadshop.net",
		"myspreadshop.nl",
		"myspreadshop.no",
		"myspreadshop.pl",
		"myspreadshop.se",
		"myspreadshop.co.uk",
		"api.stdlib.com",
		"storj.farm",
		"utwente.io",
		"soc.srcf.net",
		"user.srcf.net",
		"temp-dns.com",
		"supabase.co",
		"supabase.in",
		"supabase.net",
		"su.paba.se",
		"*.s5y.io",
		"*.sensiosite.cloud",
		"syncloud.it",
		"dscloud.biz",
		"direct.quickconnect.cn",
		"dsmynas.com",
		"familyds.com",
		"diskstation.me",
		"dscloud.me",
		"i234.me",
		"myds.me",
		"synology.me",
		"dscloud.mobi",
		"dsmynas.net",
		"familyds.net",
		"dsmynas.org",
		"familyds.org",
		"vpnplus.to",
		"direct.quickconnect.to",
		"tabitorder.co.il",
		"taifun-dns.de",
		"beta.tailscale.net",
		"ts.net",
		"gda.pl",
		"gdansk.pl",
		"gdynia.pl",
		"med.pl",
		"sopot.pl",
		"site.tb-hosting.com",
		"edugit.io",
		"s3.teckids.org",
		"telebit.app",
		"telebit.io",
		"*.telebit.xyz",
		"gwiddle.co.uk",
		"*.firenet.ch",
		"*.svc.firenet.ch",
		"reservd.com",
		"thingdustdata.com",
		"cust.dev.thingdust.io",
		"cust.disrec.thingdust.io",
		"cust.prod.thingdust.io",
		"cust.testing.thingdust.io",
		"reservd.dev.thingdust.io",
		"reservd.disrec.thingdust.io",
		"reservd.testing.thingdust.io",
		"tickets.io",
		"arvo.network",
		"azimuth.network",
		"tlon.network",
		"torproject.net",
		"pages.torproject.net",
		"bloxcms.com",
		"townnews-staging.com",
		"tbits.me",
		"12hp.at",
		"2ix.at",
		"4lima.at",
		"lima-city.at",
		"12hp.ch",
		"2ix.ch",
		"4lima.ch",
		"lima-city.ch",
		"trafficplex.cloud",
		"de.cool",
		"12hp.de",
		"2ix.de",
		"4lima.de",
		"lima-city.de",
		"1337.pictures",
		"clan.rip",
		"lima-city.rocks",
		"webspace.rocks",
		"lima.zone",
		"*.transurl.be",
		"*.transurl.eu",
		"*.transurl.nl",
		"site.transip.me",
		"tuxfamily.org",
		"dd-dns.de",
		"diskstation.eu",
		"diskstation.org",
		"dray-dns.de",
		"draydns.de",
		"dyn-vpn.de",
		"dynvpn.de",
		"mein-vigor.de",
		"my-vigor.de",
		"my-wan.de",
		"syno-ds.de",
		"synology-diskstation.de",
		"synology-ds.de",
		"typedream.app",
		"pro.typeform.com",
		"uber.space",
		"*.uberspace.de",
		"hk.com",
		"hk.org",
		"ltd.hk",
		"inc.hk",
		"name.pm",
		"sch.tf",
		"biz.wf",
		"sch.wf",
		"org.yt",
		"virtualuser.de",
		"virtual-user.de",
		"upli.io",
		"urown.cloud",
		"dnsupdate.info",
		"lib.de.us",
		"2038.io",
		"vercel.app",
		"vercel.dev",
		"now.sh",
		"router.management",
		"v-info.info",
		"voorloper.cloud",
		"neko.am",
		"nyaa.am",
		"be.ax",
		"cat.ax",
		"es.ax",
		"eu.ax",
		"gg.ax",
		"mc.ax",
		"us.ax",
		"xy.ax",
		"nl.ci",
		"xx.gl",
		"app.gp",
		"blog.gt",
		"de.gt",
		"to.gt",
		"be.gy",
		"cc.hn",
		"blog.kg",
		"io.kg",
		"jp.kg",
		"tv.kg",
		"uk.kg",
		"us.kg",
		"de.ls",
		"at.md",
		"de.md",
		"jp.md",
		"to.md",
		"indie.porn",
		"vxl.sh",
		"ch.tc",
		"me.tc",
		"we.tc",
		"nyan.to",
		"at.vg",
		"blog.vu",
		"dev.vu",
		"me.vu",
		"v.ua",
		"*.vultrobjects.com",
		"wafflecell.com",
		"*.webhare.dev",
		"reserve-online.net",
		"reserve-online.com",
		"bookonline.app",
		"hotelwithflight.com",
		"wedeploy.io",
		"wedeploy.me",
		"wedeploy.sh",
		"remotewd.com",
		"pages.wiardweb.com",
		"wmflabs.org",
		"toolforge.org",
		"wmcloud.org",
		"panel.gg",
		"daemon.panel.gg",
		"messwithdns.com",
		"woltlab-demo.com",
		"myforum.community",
		"community-pro.de",
		"diskussionsbereich.de",
		"community-pro.net",
		"meinforum.net",
		"affinitylottery.org.uk",
		"raffleentry.org.uk",
		"weeklylottery.org.uk",
		"wpenginepowered.com",
		"js.wpenginepowered.com",
		"wixsite.com",
		"editorx.io",
		"half.host",
		"xnbay.com",
		"u2.xnbay.com",
		"u2-local.xnbay.com",
		"cistron.nl",
		"demon.nl",
		"xs4all.space",
		"yandexcloud.net",
		"storage.yandexcloud.net",
		"website.yandexcloud.net",
		"official.academy",
		"yolasite.com",
		"ybo.faith",
		"yombo.me",
		"homelink.one",
		"ybo.party",
		"ybo.review",
		"ybo.science",
		"ybo.trade",
		"ynh.fr",
		"nohost.me",
		"noho.st",
		"za.net",
		"za.org",
		"bss.design",
		"basicserver.io",
		"virtualserver.io",
		"enterprisecloud.nu"
	];
} });
var require_psl = __commonJS$3({ "node_modules/psl/index.js"(exports) {
	"use strict";
	var Punycode = require_punycode();
	var internals = {};
	internals.rules = require_rules().map(function(rule) {
		return {
			rule,
			suffix: rule.replace(/^(\*\.|\!)/, ""),
			punySuffix: -1,
			wildcard: rule.charAt(0) === "*",
			exception: rule.charAt(0) === "!"
		};
	});
	internals.endsWith = function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};
	internals.findRule = function(domain) {
		var punyDomain = Punycode.toASCII(domain);
		return internals.rules.reduce(function(memo, rule) {
			if (rule.punySuffix === -1) rule.punySuffix = Punycode.toASCII(rule.suffix);
			if (!internals.endsWith(punyDomain, "." + rule.punySuffix) && punyDomain !== rule.punySuffix) return memo;
			return rule;
		}, null);
	};
	exports.errorCodes = {
		DOMAIN_TOO_SHORT: "Domain name too short.",
		DOMAIN_TOO_LONG: "Domain name too long. It should be no more than 255 chars.",
		LABEL_STARTS_WITH_DASH: "Domain name label can not start with a dash.",
		LABEL_ENDS_WITH_DASH: "Domain name label can not end with a dash.",
		LABEL_TOO_LONG: "Domain name label should be at most 63 chars long.",
		LABEL_TOO_SHORT: "Domain name label should be at least 1 character long.",
		LABEL_INVALID_CHARS: "Domain name label can only contain alphanumeric characters or dashes."
	};
	internals.validate = function(input) {
		var ascii = Punycode.toASCII(input);
		if (ascii.length < 1) return "DOMAIN_TOO_SHORT";
		if (ascii.length > 255) return "DOMAIN_TOO_LONG";
		var labels = ascii.split(".");
		var label;
		for (var i = 0; i < labels.length; ++i) {
			label = labels[i];
			if (!label.length) return "LABEL_TOO_SHORT";
			if (label.length > 63) return "LABEL_TOO_LONG";
			if (label.charAt(0) === "-") return "LABEL_STARTS_WITH_DASH";
			if (label.charAt(label.length - 1) === "-") return "LABEL_ENDS_WITH_DASH";
			if (!/^[a-z0-9\-]+$/.test(label)) return "LABEL_INVALID_CHARS";
		}
	};
	exports.parse = function(input) {
		if (typeof input !== "string") throw new TypeError("Domain name must be a string.");
		var domain = input.slice(0).toLowerCase();
		if (domain.charAt(domain.length - 1) === ".") domain = domain.slice(0, domain.length - 1);
		var error$3 = internals.validate(domain);
		if (error$3) return {
			input,
			error: {
				message: exports.errorCodes[error$3],
				code: error$3
			}
		};
		var parsed = {
			input,
			tld: null,
			sld: null,
			domain: null,
			subdomain: null,
			listed: false
		};
		var domainParts = domain.split(".");
		if (domainParts[domainParts.length - 1] === "local") return parsed;
		var handlePunycode = function() {
			if (!/xn--/.test(domain)) return parsed;
			if (parsed.domain) parsed.domain = Punycode.toASCII(parsed.domain);
			if (parsed.subdomain) parsed.subdomain = Punycode.toASCII(parsed.subdomain);
			return parsed;
		};
		var rule = internals.findRule(domain);
		if (!rule) {
			if (domainParts.length < 2) return parsed;
			parsed.tld = domainParts.pop();
			parsed.sld = domainParts.pop();
			parsed.domain = [parsed.sld, parsed.tld].join(".");
			if (domainParts.length) parsed.subdomain = domainParts.pop();
			return handlePunycode();
		}
		parsed.listed = true;
		var tldParts = rule.suffix.split(".");
		var privateParts = domainParts.slice(0, domainParts.length - tldParts.length);
		if (rule.exception) privateParts.push(tldParts.shift());
		parsed.tld = tldParts.join(".");
		if (!privateParts.length) return handlePunycode();
		if (rule.wildcard) {
			tldParts.unshift(privateParts.pop());
			parsed.tld = tldParts.join(".");
		}
		if (!privateParts.length) return handlePunycode();
		parsed.sld = privateParts.pop();
		parsed.domain = [parsed.sld, parsed.tld].join(".");
		if (privateParts.length) parsed.subdomain = privateParts.join(".");
		return handlePunycode();
	};
	exports.get = function(domain) {
		if (!domain) return null;
		return exports.parse(domain).domain || null;
	};
	exports.isValid = function(domain) {
		var parsed = exports.parse(domain);
		return Boolean(parsed.domain && parsed.listed);
	};
} });
var require_pubsuffix_psl = __commonJS$3({ "node_modules/tough-cookie/lib/pubsuffix-psl.js"(exports) {
	"use strict";
	var psl = require_psl();
	var SPECIAL_USE_DOMAINS = [
		"local",
		"example",
		"invalid",
		"localhost",
		"test"
	];
	var SPECIAL_TREATMENT_DOMAINS = ["localhost", "invalid"];
	function getPublicSuffix(domain, options = {}) {
		const domainParts = domain.split(".");
		const topLevelDomain = domainParts[domainParts.length - 1];
		const allowSpecialUseDomain = !!options.allowSpecialUseDomain;
		const ignoreError = !!options.ignoreError;
		if (allowSpecialUseDomain && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) {
			if (domainParts.length > 1) {
				const secondLevelDomain = domainParts[domainParts.length - 2];
				return `${secondLevelDomain}.${topLevelDomain}`;
			} else if (SPECIAL_TREATMENT_DOMAINS.includes(topLevelDomain)) return `${topLevelDomain}`;
		}
		if (!ignoreError && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) throw new Error(`Cookie has domain set to the public suffix "${topLevelDomain}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain:true, rejectPublicSuffixes: false}.`);
		return psl.get(domain);
	}
	exports.getPublicSuffix = getPublicSuffix;
} });
var require_store = __commonJS$3({ "node_modules/tough-cookie/lib/store.js"(exports) {
	"use strict";
	var Store$1 = class {
		constructor() {
			this.synchronous = false;
		}
		findCookie(domain, path, key, cb) {
			throw new Error("findCookie is not implemented");
		}
		findCookies(domain, path, allowSpecialUseDomain, cb) {
			throw new Error("findCookies is not implemented");
		}
		putCookie(cookie, cb) {
			throw new Error("putCookie is not implemented");
		}
		updateCookie(oldCookie, newCookie, cb) {
			throw new Error("updateCookie is not implemented");
		}
		removeCookie(domain, path, key, cb) {
			throw new Error("removeCookie is not implemented");
		}
		removeCookies(domain, path, cb) {
			throw new Error("removeCookies is not implemented");
		}
		removeAllCookies(cb) {
			throw new Error("removeAllCookies is not implemented");
		}
		getAllCookies(cb) {
			throw new Error("getAllCookies is not implemented (therefore jar cannot be serialized)");
		}
	};
	exports.Store = Store$1;
} });
var require_universalify = __commonJS$3({ "node_modules/universalify/index.js"(exports) {
	"use strict";
	exports.fromCallback = function(fn) {
		return Object.defineProperty(function() {
			if (typeof arguments[arguments.length - 1] === "function") fn.apply(this, arguments);
			else return new Promise((resolve, reject) => {
				arguments[arguments.length] = (err, res) => {
					if (err) return reject(err);
					resolve(res);
				};
				arguments.length++;
				fn.apply(this, arguments);
			});
		}, "name", { value: fn.name });
	};
	exports.fromPromise = function(fn) {
		return Object.defineProperty(function() {
			const cb = arguments[arguments.length - 1];
			if (typeof cb !== "function") return fn.apply(this, arguments);
			else {
				delete arguments[arguments.length - 1];
				arguments.length--;
				fn.apply(this, arguments).then((r) => cb(null, r), cb);
			}
		}, "name", { value: fn.name });
	};
} });
var require_permuteDomain = __commonJS$3({ "node_modules/tough-cookie/lib/permuteDomain.js"(exports) {
	"use strict";
	var pubsuffix = require_pubsuffix_psl();
	function permuteDomain(domain, allowSpecialUseDomain) {
		const pubSuf = pubsuffix.getPublicSuffix(domain, { allowSpecialUseDomain });
		if (!pubSuf) return null;
		if (pubSuf == domain) return [domain];
		if (domain.slice(-1) == ".") domain = domain.slice(0, -1);
		const prefix = domain.slice(0, -(pubSuf.length + 1));
		const parts = prefix.split(".").reverse();
		let cur = pubSuf;
		const permutations = [cur];
		while (parts.length) {
			cur = `${parts.shift()}.${cur}`;
			permutations.push(cur);
		}
		return permutations;
	}
	exports.permuteDomain = permuteDomain;
} });
var require_pathMatch = __commonJS$3({ "node_modules/tough-cookie/lib/pathMatch.js"(exports) {
	"use strict";
	function pathMatch$1(reqPath, cookiePath) {
		if (cookiePath === reqPath) return true;
		const idx = reqPath.indexOf(cookiePath);
		if (idx === 0) {
			if (cookiePath.substr(-1) === "/") return true;
			if (reqPath.substr(cookiePath.length, 1) === "/") return true;
		}
		return false;
	}
	exports.pathMatch = pathMatch$1;
} });
var require_utilHelper = __commonJS$3({ "node_modules/tough-cookie/lib/utilHelper.js"(exports) {
	function requireUtil() {
		try {
			return __require$1("util");
		} catch (e) {
			return null;
		}
	}
	function lookupCustomInspectSymbol() {
		return Symbol.for("nodejs.util.inspect.custom");
	}
	function tryReadingCustomSymbolFromUtilInspect(options) {
		const _requireUtil = options.requireUtil || requireUtil;
		const util = _requireUtil();
		return util ? util.inspect.custom : null;
	}
	exports.getUtilInspect = function getUtilInspect(fallback, options = {}) {
		const _requireUtil = options.requireUtil || requireUtil;
		const util = _requireUtil();
		return function inspect(value, showHidden, depth) {
			return util ? util.inspect(value, showHidden, depth) : fallback(value);
		};
	};
	exports.getCustomInspectSymbol = function getCustomInspectSymbol(options = {}) {
		const _lookupCustomInspectSymbol = options.lookupCustomInspectSymbol || lookupCustomInspectSymbol;
		return _lookupCustomInspectSymbol() || tryReadingCustomSymbolFromUtilInspect(options);
	};
} });
var require_memstore = __commonJS$3({ "node_modules/tough-cookie/lib/memstore.js"(exports) {
	"use strict";
	var { fromCallback } = require_universalify();
	var Store$1 = require_store().Store;
	var permuteDomain = require_permuteDomain().permuteDomain;
	var pathMatch$1 = require_pathMatch().pathMatch;
	var { getCustomInspectSymbol, getUtilInspect } = require_utilHelper();
	var MemoryCookieStore$1 = class extends Store$1 {
		constructor() {
			super();
			this.synchronous = true;
			this.idx = /* @__PURE__ */ Object.create(null);
			const customInspectSymbol = getCustomInspectSymbol();
			if (customInspectSymbol) this[customInspectSymbol] = this.inspect;
		}
		inspect() {
			const util = { inspect: getUtilInspect(inspectFallback) };
			return `{ idx: ${util.inspect(this.idx, false, 2)} }`;
		}
		findCookie(domain, path, key, cb) {
			if (!this.idx[domain]) return cb(null, void 0);
			if (!this.idx[domain][path]) return cb(null, void 0);
			return cb(null, this.idx[domain][path][key] || null);
		}
		findCookies(domain, path, allowSpecialUseDomain, cb) {
			const results = [];
			if (typeof allowSpecialUseDomain === "function") {
				cb = allowSpecialUseDomain;
				allowSpecialUseDomain = true;
			}
			if (!domain) return cb(null, []);
			let pathMatcher;
			if (!path) pathMatcher = function matchAll(domainIndex) {
				for (const curPath in domainIndex) {
					const pathIndex = domainIndex[curPath];
					for (const key in pathIndex) results.push(pathIndex[key]);
				}
			};
			else pathMatcher = function matchRFC(domainIndex) {
				Object.keys(domainIndex).forEach((cookiePath) => {
					if (pathMatch$1(path, cookiePath)) {
						const pathIndex = domainIndex[cookiePath];
						for (const key in pathIndex) results.push(pathIndex[key]);
					}
				});
			};
			const domains = permuteDomain(domain, allowSpecialUseDomain) || [domain];
			const idx = this.idx;
			domains.forEach((curDomain) => {
				const domainIndex = idx[curDomain];
				if (!domainIndex) return;
				pathMatcher(domainIndex);
			});
			cb(null, results);
		}
		putCookie(cookie, cb) {
			if (!this.idx[cookie.domain]) this.idx[cookie.domain] = /* @__PURE__ */ Object.create(null);
			if (!this.idx[cookie.domain][cookie.path]) this.idx[cookie.domain][cookie.path] = /* @__PURE__ */ Object.create(null);
			this.idx[cookie.domain][cookie.path][cookie.key] = cookie;
			cb(null);
		}
		updateCookie(oldCookie, newCookie, cb) {
			this.putCookie(newCookie, cb);
		}
		removeCookie(domain, path, key, cb) {
			if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) delete this.idx[domain][path][key];
			cb(null);
		}
		removeCookies(domain, path, cb) {
			if (this.idx[domain]) if (path) delete this.idx[domain][path];
			else delete this.idx[domain];
			return cb(null);
		}
		removeAllCookies(cb) {
			this.idx = /* @__PURE__ */ Object.create(null);
			return cb(null);
		}
		getAllCookies(cb) {
			const cookies = [];
			const idx = this.idx;
			const domains = Object.keys(idx);
			domains.forEach((domain) => {
				const paths = Object.keys(idx[domain]);
				paths.forEach((path) => {
					const keys = Object.keys(idx[domain][path]);
					keys.forEach((key) => {
						if (key !== null) cookies.push(idx[domain][path][key]);
					});
				});
			});
			cookies.sort((a, b) => {
				return (a.creationIndex || 0) - (b.creationIndex || 0);
			});
			cb(null, cookies);
		}
	};
	[
		"findCookie",
		"findCookies",
		"putCookie",
		"updateCookie",
		"removeCookie",
		"removeCookies",
		"removeAllCookies",
		"getAllCookies"
	].forEach((name) => {
		MemoryCookieStore$1.prototype[name] = fromCallback(MemoryCookieStore$1.prototype[name]);
	});
	exports.MemoryCookieStore = MemoryCookieStore$1;
	function inspectFallback(val) {
		const domains = Object.keys(val);
		if (domains.length === 0) return "[Object: null prototype] {}";
		let result = "[Object: null prototype] {\n";
		Object.keys(val).forEach((domain, i) => {
			result += formatDomain(domain, val[domain]);
			if (i < domains.length - 1) result += ",";
			result += "\n";
		});
		result += "}";
		return result;
	}
	function formatDomain(domainName, domainValue) {
		const indent = "  ";
		let result = `${indent}'${domainName}': [Object: null prototype] {
`;
		Object.keys(domainValue).forEach((path, i, paths) => {
			result += formatPath(path, domainValue[path]);
			if (i < paths.length - 1) result += ",";
			result += "\n";
		});
		result += `${indent}}`;
		return result;
	}
	function formatPath(pathName, pathValue) {
		const indent = "    ";
		let result = `${indent}'${pathName}': [Object: null prototype] {
`;
		Object.keys(pathValue).forEach((cookieName, i, cookieNames) => {
			const cookie = pathValue[cookieName];
			result += `      ${cookieName}: ${cookie.inspect()}`;
			if (i < cookieNames.length - 1) result += ",";
			result += "\n";
		});
		result += `${indent}}`;
		return result;
	}
	exports.inspectFallback = inspectFallback;
} });
var require_validators = __commonJS$3({ "node_modules/tough-cookie/lib/validators.js"(exports) {
	"use strict";
	var toString = Object.prototype.toString;
	function isFunction(data) {
		return typeof data === "function";
	}
	function isNonEmptyString(data) {
		return isString(data) && data !== "";
	}
	function isDate(data) {
		return isInstanceStrict(data, Date) && isInteger(data.getTime());
	}
	function isEmptyString(data) {
		return data === "" || data instanceof String && data.toString() === "";
	}
	function isString(data) {
		return typeof data === "string" || data instanceof String;
	}
	function isObject$2(data) {
		return toString.call(data) === "[object Object]";
	}
	function isInstanceStrict(data, prototype) {
		try {
			return data instanceof prototype;
		} catch (error$3) {
			return false;
		}
	}
	function isUrlStringOrObject(data) {
		return isNonEmptyString(data) || isObject$2(data) && "hostname" in data && "pathname" in data && "protocol" in data || isInstanceStrict(data, URL);
	}
	function isInteger(data) {
		return typeof data === "number" && data % 1 === 0;
	}
	function validate(bool, cb, options) {
		if (!isFunction(cb)) {
			options = cb;
			cb = null;
		}
		if (!isObject$2(options)) options = { Error: "Failed Check" };
		if (!bool) if (cb) cb(new ParameterError(options));
		else throw new ParameterError(options);
	}
	var ParameterError = class extends Error {
		constructor(...params) {
			super(...params);
		}
	};
	exports.ParameterError = ParameterError;
	exports.isFunction = isFunction;
	exports.isNonEmptyString = isNonEmptyString;
	exports.isDate = isDate;
	exports.isEmptyString = isEmptyString;
	exports.isString = isString;
	exports.isObject = isObject$2;
	exports.isUrlStringOrObject = isUrlStringOrObject;
	exports.validate = validate;
} });
var require_version = __commonJS$3({ "node_modules/tough-cookie/lib/version.js"(exports, module) {
	module.exports = "4.1.4";
} });
var require_cookie$1 = __commonJS$3({ "node_modules/tough-cookie/lib/cookie.js"(exports) {
	"use strict";
	var punycode = require_punycode();
	var urlParse = require_url_parse();
	var pubsuffix = require_pubsuffix_psl();
	var Store$1 = require_store().Store;
	var MemoryCookieStore$1 = require_memstore().MemoryCookieStore;
	var pathMatch$1 = require_pathMatch().pathMatch;
	var validators = require_validators();
	var VERSION = require_version();
	var { fromCallback } = require_universalify();
	var { getCustomInspectSymbol } = require_utilHelper();
	var COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;
	var CONTROL_CHARS = /[\x00-\x1F]/;
	var TERMINATORS = [
		"\n",
		"\r",
		"\0"
	];
	var PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;
	var DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;
	var MONTH_TO_NUM = {
		jan: 0,
		feb: 1,
		mar: 2,
		apr: 3,
		may: 4,
		jun: 5,
		jul: 6,
		aug: 7,
		sep: 8,
		oct: 9,
		nov: 10,
		dec: 11
	};
	var MAX_TIME = 2147483647e3;
	var MIN_TIME = 0;
	var SAME_SITE_CONTEXT_VAL_ERR = "Invalid sameSiteContext option for getCookies(); expected one of \"strict\", \"lax\", or \"none\"";
	function checkSameSiteContext(value) {
		validators.validate(validators.isNonEmptyString(value), value);
		const context = String(value).toLowerCase();
		if (context === "none" || context === "lax" || context === "strict") return context;
		else return null;
	}
	var PrefixSecurityEnum = Object.freeze({
		SILENT: "silent",
		STRICT: "strict",
		DISABLED: "unsafe-disabled"
	});
	var IP_REGEX_LOWERCASE = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;
	var IP_V6_REGEX = `
\\[?(?:
(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|
(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|
(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|
(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|
(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:))
)(?:%[0-9a-zA-Z]{1,})?\\]?
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
	var IP_V6_REGEX_OBJECT = /* @__PURE__ */ new RegExp(`^${IP_V6_REGEX}$`);
	function parseDigits(token, minDigits, maxDigits, trailingOK) {
		let count = 0;
		while (count < token.length) {
			const c = token.charCodeAt(count);
			if (c <= 47 || c >= 58) break;
			count++;
		}
		if (count < minDigits || count > maxDigits) return null;
		if (!trailingOK && count != token.length) return null;
		return parseInt(token.substr(0, count), 10);
	}
	function parseTime(token) {
		const parts = token.split(":");
		const result = [
			0,
			0,
			0
		];
		if (parts.length !== 3) return null;
		for (let i = 0; i < 3; i++) {
			const trailingOK = i == 2;
			const num = parseDigits(parts[i], 1, 2, trailingOK);
			if (num === null) return null;
			result[i] = num;
		}
		return result;
	}
	function parseMonth(token) {
		token = String(token).substr(0, 3).toLowerCase();
		const num = MONTH_TO_NUM[token];
		return num >= 0 ? num : null;
	}
	function parseDate(str) {
		if (!str) return;
		const tokens = str.split(DATE_DELIM);
		if (!tokens) return;
		let hour = null;
		let minute = null;
		let second = null;
		let dayOfMonth = null;
		let month = null;
		let year = null;
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i].trim();
			if (!token.length) continue;
			let result;
			if (second === null) {
				result = parseTime(token);
				if (result) {
					hour = result[0];
					minute = result[1];
					second = result[2];
					continue;
				}
			}
			if (dayOfMonth === null) {
				result = parseDigits(token, 1, 2, true);
				if (result !== null) {
					dayOfMonth = result;
					continue;
				}
			}
			if (month === null) {
				result = parseMonth(token);
				if (result !== null) {
					month = result;
					continue;
				}
			}
			if (year === null) {
				result = parseDigits(token, 2, 4, true);
				if (result !== null) {
					year = result;
					if (year >= 70 && year <= 99) year += 1900;
					else if (year >= 0 && year <= 69) year += 2e3;
				}
			}
		}
		if (dayOfMonth === null || month === null || year === null || second === null || dayOfMonth < 1 || dayOfMonth > 31 || year < 1601 || hour > 23 || minute > 59 || second > 59) return;
		return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
	}
	function formatDate(date) {
		validators.validate(validators.isDate(date), date);
		return date.toUTCString();
	}
	function canonicalDomain(str) {
		if (str == null) return null;
		str = str.trim().replace(/^\./, "");
		if (IP_V6_REGEX_OBJECT.test(str)) str = str.replace("[", "").replace("]", "");
		if (punycode && /[^\u0001-\u007f]/.test(str)) str = punycode.toASCII(str);
		return str.toLowerCase();
	}
	function domainMatch$1(str, domStr, canonicalize) {
		if (str == null || domStr == null) return null;
		if (canonicalize !== false) {
			str = canonicalDomain(str);
			domStr = canonicalDomain(domStr);
		}
		if (str == domStr) return true;
		const idx = str.lastIndexOf(domStr);
		if (idx <= 0) return false;
		if (str.length !== domStr.length + idx) return false;
		if (str.substr(idx - 1, 1) !== ".") return false;
		if (IP_REGEX_LOWERCASE.test(str)) return false;
		return true;
	}
	function defaultPath(path) {
		if (!path || path.substr(0, 1) !== "/") return "/";
		if (path === "/") return path;
		const rightSlash = path.lastIndexOf("/");
		if (rightSlash === 0) return "/";
		return path.slice(0, rightSlash);
	}
	function trimTerminator(str) {
		if (validators.isEmptyString(str)) return str;
		for (let t = 0; t < TERMINATORS.length; t++) {
			const terminatorIdx = str.indexOf(TERMINATORS[t]);
			if (terminatorIdx !== -1) str = str.substr(0, terminatorIdx);
		}
		return str;
	}
	function parseCookiePair(cookiePair, looseMode) {
		cookiePair = trimTerminator(cookiePair);
		validators.validate(validators.isString(cookiePair), cookiePair);
		let firstEq = cookiePair.indexOf("=");
		if (looseMode) {
			if (firstEq === 0) {
				cookiePair = cookiePair.substr(1);
				firstEq = cookiePair.indexOf("=");
			}
		} else if (firstEq <= 0) return;
		let cookieName, cookieValue;
		if (firstEq <= 0) {
			cookieName = "";
			cookieValue = cookiePair.trim();
		} else {
			cookieName = cookiePair.substr(0, firstEq).trim();
			cookieValue = cookiePair.substr(firstEq + 1).trim();
		}
		if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) return;
		const c = new Cookie$1();
		c.key = cookieName;
		c.value = cookieValue;
		return c;
	}
	function parse$1(str, options) {
		if (!options || typeof options !== "object") options = {};
		if (validators.isEmptyString(str) || !validators.isString(str)) return null;
		str = str.trim();
		const firstSemi = str.indexOf(";");
		const cookiePair = firstSemi === -1 ? str : str.substr(0, firstSemi);
		const c = parseCookiePair(cookiePair, !!options.loose);
		if (!c) return;
		if (firstSemi === -1) return c;
		const unparsed = str.slice(firstSemi + 1).trim();
		if (unparsed.length === 0) return c;
		const cookie_avs = unparsed.split(";");
		while (cookie_avs.length) {
			const av = cookie_avs.shift().trim();
			if (av.length === 0) continue;
			const av_sep = av.indexOf("=");
			let av_key, av_value;
			if (av_sep === -1) {
				av_key = av;
				av_value = null;
			} else {
				av_key = av.substr(0, av_sep);
				av_value = av.substr(av_sep + 1);
			}
			av_key = av_key.trim().toLowerCase();
			if (av_value) av_value = av_value.trim();
			switch (av_key) {
				case "expires":
					if (av_value) {
						const exp = parseDate(av_value);
						if (exp) c.expires = exp;
					}
					break;
				case "max-age":
					if (av_value) {
						if (/^-?[0-9]+$/.test(av_value)) {
							const delta = parseInt(av_value, 10);
							c.setMaxAge(delta);
						}
					}
					break;
				case "domain":
					if (av_value) {
						const domain = av_value.trim().replace(/^\./, "");
						if (domain) c.domain = domain.toLowerCase();
					}
					break;
				case "path":
					c.path = av_value && av_value[0] === "/" ? av_value : null;
					break;
				case "secure":
					c.secure = true;
					break;
				case "httponly":
					c.httpOnly = true;
					break;
				case "samesite":
					const enforcement = av_value ? av_value.toLowerCase() : "";
					switch (enforcement) {
						case "strict":
							c.sameSite = "strict";
							break;
						case "lax":
							c.sameSite = "lax";
							break;
						case "none":
							c.sameSite = "none";
							break;
						default:
							c.sameSite = void 0;
							break;
					}
					break;
				default:
					c.extensions = c.extensions || [];
					c.extensions.push(av);
					break;
			}
		}
		return c;
	}
	function isSecurePrefixConditionMet(cookie) {
		validators.validate(validators.isObject(cookie), cookie);
		return !cookie.key.startsWith("__Secure-") || cookie.secure;
	}
	function isHostPrefixConditionMet(cookie) {
		validators.validate(validators.isObject(cookie));
		return !cookie.key.startsWith("__Host-") || cookie.secure && cookie.hostOnly && cookie.path != null && cookie.path === "/";
	}
	function jsonParse(str) {
		let obj;
		try {
			obj = JSON.parse(str);
		} catch (e) {
			return e;
		}
		return obj;
	}
	function fromJSON(str) {
		if (!str || validators.isEmptyString(str)) return null;
		let obj;
		if (typeof str === "string") {
			obj = jsonParse(str);
			if (obj instanceof Error) return null;
		} else obj = str;
		const c = new Cookie$1();
		for (let i = 0; i < Cookie$1.serializableProperties.length; i++) {
			const prop = Cookie$1.serializableProperties[i];
			if (obj[prop] === void 0 || obj[prop] === cookieDefaults[prop]) continue;
			if (prop === "expires" || prop === "creation" || prop === "lastAccessed") if (obj[prop] === null) c[prop] = null;
			else c[prop] = obj[prop] == "Infinity" ? "Infinity" : new Date(obj[prop]);
			else c[prop] = obj[prop];
		}
		return c;
	}
	function cookieCompare(a, b) {
		validators.validate(validators.isObject(a), a);
		validators.validate(validators.isObject(b), b);
		let cmp = 0;
		const aPathLen = a.path ? a.path.length : 0;
		const bPathLen = b.path ? b.path.length : 0;
		cmp = bPathLen - aPathLen;
		if (cmp !== 0) return cmp;
		const aTime = a.creation ? a.creation.getTime() : MAX_TIME;
		const bTime = b.creation ? b.creation.getTime() : MAX_TIME;
		cmp = aTime - bTime;
		if (cmp !== 0) return cmp;
		cmp = a.creationIndex - b.creationIndex;
		return cmp;
	}
	function permutePath(path) {
		validators.validate(validators.isString(path));
		if (path === "/") return ["/"];
		const permutations = [path];
		while (path.length > 1) {
			const lindex = path.lastIndexOf("/");
			if (lindex === 0) break;
			path = path.substr(0, lindex);
			permutations.push(path);
		}
		permutations.push("/");
		return permutations;
	}
	function getCookieContext(url) {
		if (url instanceof Object) return url;
		try {
			url = decodeURI(url);
		} catch (err) {}
		return urlParse(url);
	}
	var cookieDefaults = {
		key: "",
		value: "",
		expires: "Infinity",
		maxAge: null,
		domain: null,
		path: null,
		secure: false,
		httpOnly: false,
		extensions: null,
		hostOnly: null,
		pathIsDefault: null,
		creation: null,
		lastAccessed: null,
		sameSite: void 0
	};
	var Cookie$1 = class _Cookie {
		constructor(options = {}) {
			const customInspectSymbol = getCustomInspectSymbol();
			if (customInspectSymbol) this[customInspectSymbol] = this.inspect;
			Object.assign(this, cookieDefaults, options);
			this.creation = this.creation || /* @__PURE__ */ new Date();
			Object.defineProperty(this, "creationIndex", {
				configurable: false,
				enumerable: false,
				writable: true,
				value: ++_Cookie.cookiesCreated
			});
		}
		inspect() {
			const now = Date.now();
			const hostOnly = this.hostOnly != null ? this.hostOnly : "?";
			const createAge = this.creation ? `${now - this.creation.getTime()}ms` : "?";
			const accessAge = this.lastAccessed ? `${now - this.lastAccessed.getTime()}ms` : "?";
			return `Cookie="${this.toString()}; hostOnly=${hostOnly}; aAge=${accessAge}; cAge=${createAge}"`;
		}
		toJSON() {
			const obj = {};
			for (const prop of _Cookie.serializableProperties) {
				if (this[prop] === cookieDefaults[prop]) continue;
				if (prop === "expires" || prop === "creation" || prop === "lastAccessed") if (this[prop] === null) obj[prop] = null;
				else obj[prop] = this[prop] == "Infinity" ? "Infinity" : this[prop].toISOString();
				else if (prop === "maxAge") {
					if (this[prop] !== null) obj[prop] = this[prop] == Infinity || this[prop] == -Infinity ? this[prop].toString() : this[prop];
				} else if (this[prop] !== cookieDefaults[prop]) obj[prop] = this[prop];
			}
			return obj;
		}
		clone() {
			return fromJSON(this.toJSON());
		}
		validate() {
			if (!COOKIE_OCTETS.test(this.value)) return false;
			if (this.expires != Infinity && !(this.expires instanceof Date) && !parseDate(this.expires)) return false;
			if (this.maxAge != null && this.maxAge <= 0) return false;
			if (this.path != null && !PATH_VALUE.test(this.path)) return false;
			const cdomain = this.cdomain();
			if (cdomain) {
				if (cdomain.match(/\.$/)) return false;
				const suffix = pubsuffix.getPublicSuffix(cdomain);
				if (suffix == null) return false;
			}
			return true;
		}
		setExpires(exp) {
			if (exp instanceof Date) this.expires = exp;
			else this.expires = parseDate(exp) || "Infinity";
		}
		setMaxAge(age) {
			if (age === Infinity || age === -Infinity) this.maxAge = age.toString();
			else this.maxAge = age;
		}
		cookieString() {
			let val = this.value;
			if (val == null) val = "";
			if (this.key === "") return val;
			return `${this.key}=${val}`;
		}
		toString() {
			let str = this.cookieString();
			if (this.expires != Infinity) if (this.expires instanceof Date) str += `; Expires=${formatDate(this.expires)}`;
			else str += `; Expires=${this.expires}`;
			if (this.maxAge != null && this.maxAge != Infinity) str += `; Max-Age=${this.maxAge}`;
			if (this.domain && !this.hostOnly) str += `; Domain=${this.domain}`;
			if (this.path) str += `; Path=${this.path}`;
			if (this.secure) str += "; Secure";
			if (this.httpOnly) str += "; HttpOnly";
			if (this.sameSite && this.sameSite !== "none") {
				const ssCanon = _Cookie.sameSiteCanonical[this.sameSite.toLowerCase()];
				str += `; SameSite=${ssCanon ? ssCanon : this.sameSite}`;
			}
			if (this.extensions) this.extensions.forEach((ext) => {
				str += `; ${ext}`;
			});
			return str;
		}
		TTL(now) {
			if (this.maxAge != null) return this.maxAge <= 0 ? 0 : this.maxAge * 1e3;
			let expires = this.expires;
			if (expires != Infinity) {
				if (!(expires instanceof Date)) expires = parseDate(expires) || Infinity;
				if (expires == Infinity) return Infinity;
				return expires.getTime() - (now || Date.now());
			}
			return Infinity;
		}
		expiryTime(now) {
			if (this.maxAge != null) {
				const relativeTo = now || this.creation || /* @__PURE__ */ new Date();
				const age = this.maxAge <= 0 ? -Infinity : this.maxAge * 1e3;
				return relativeTo.getTime() + age;
			}
			if (this.expires == Infinity) return Infinity;
			return this.expires.getTime();
		}
		expiryDate(now) {
			const millisec = this.expiryTime(now);
			if (millisec == Infinity) return new Date(MAX_TIME);
			else if (millisec == -Infinity) return new Date(MIN_TIME);
			else return new Date(millisec);
		}
		isPersistent() {
			return this.maxAge != null || this.expires != Infinity;
		}
		canonicalizedDomain() {
			if (this.domain == null) return null;
			return canonicalDomain(this.domain);
		}
		cdomain() {
			return this.canonicalizedDomain();
		}
	};
	Cookie$1.cookiesCreated = 0;
	Cookie$1.parse = parse$1;
	Cookie$1.fromJSON = fromJSON;
	Cookie$1.serializableProperties = Object.keys(cookieDefaults);
	Cookie$1.sameSiteLevel = {
		strict: 3,
		lax: 2,
		none: 1
	};
	Cookie$1.sameSiteCanonical = {
		strict: "Strict",
		lax: "Lax"
	};
	function getNormalizedPrefixSecurity(prefixSecurity) {
		if (prefixSecurity != null) {
			const normalizedPrefixSecurity = prefixSecurity.toLowerCase();
			switch (normalizedPrefixSecurity) {
				case PrefixSecurityEnum.STRICT:
				case PrefixSecurityEnum.SILENT:
				case PrefixSecurityEnum.DISABLED: return normalizedPrefixSecurity;
			}
		}
		return PrefixSecurityEnum.SILENT;
	}
	var CookieJar$1 = class _CookieJar {
		constructor(store$1, options = { rejectPublicSuffixes: true }) {
			if (typeof options === "boolean") options = { rejectPublicSuffixes: options };
			validators.validate(validators.isObject(options), options);
			this.rejectPublicSuffixes = options.rejectPublicSuffixes;
			this.enableLooseMode = !!options.looseMode;
			this.allowSpecialUseDomain = typeof options.allowSpecialUseDomain === "boolean" ? options.allowSpecialUseDomain : true;
			this.store = store$1 || new MemoryCookieStore$1();
			this.prefixSecurity = getNormalizedPrefixSecurity(options.prefixSecurity);
			this._cloneSync = syncWrap("clone");
			this._importCookiesSync = syncWrap("_importCookies");
			this.getCookiesSync = syncWrap("getCookies");
			this.getCookieStringSync = syncWrap("getCookieString");
			this.getSetCookieStringsSync = syncWrap("getSetCookieStrings");
			this.removeAllCookiesSync = syncWrap("removeAllCookies");
			this.setCookieSync = syncWrap("setCookie");
			this.serializeSync = syncWrap("serialize");
		}
		setCookie(cookie, url, options, cb) {
			validators.validate(validators.isUrlStringOrObject(url), cb, options);
			let err;
			if (validators.isFunction(url)) {
				cb = url;
				return cb(/* @__PURE__ */ new Error("No URL was specified"));
			}
			const context = getCookieContext(url);
			if (validators.isFunction(options)) {
				cb = options;
				options = {};
			}
			validators.validate(validators.isFunction(cb), cb);
			if (!validators.isNonEmptyString(cookie) && !validators.isObject(cookie) && cookie instanceof String && cookie.length == 0) return cb(null);
			const host = canonicalDomain(context.hostname);
			const loose = options.loose || this.enableLooseMode;
			let sameSiteContext = null;
			if (options.sameSiteContext) {
				sameSiteContext = checkSameSiteContext(options.sameSiteContext);
				if (!sameSiteContext) return cb(new Error(SAME_SITE_CONTEXT_VAL_ERR));
			}
			if (typeof cookie === "string" || cookie instanceof String) {
				cookie = Cookie$1.parse(cookie, { loose });
				if (!cookie) {
					err = /* @__PURE__ */ new Error("Cookie failed to parse");
					return cb(options.ignoreError ? null : err);
				}
			} else if (!(cookie instanceof Cookie$1)) {
				err = /* @__PURE__ */ new Error("First argument to setCookie must be a Cookie object or string");
				return cb(options.ignoreError ? null : err);
			}
			const now = options.now || /* @__PURE__ */ new Date();
			if (this.rejectPublicSuffixes && cookie.domain) {
				const suffix = pubsuffix.getPublicSuffix(cookie.cdomain(), {
					allowSpecialUseDomain: this.allowSpecialUseDomain,
					ignoreError: options.ignoreError
				});
				if (suffix == null && !IP_V6_REGEX_OBJECT.test(cookie.domain)) {
					err = /* @__PURE__ */ new Error("Cookie has domain set to a public suffix");
					return cb(options.ignoreError ? null : err);
				}
			}
			if (cookie.domain) {
				if (!domainMatch$1(host, cookie.cdomain(), false)) {
					err = /* @__PURE__ */ new Error(`Cookie not in this host's domain. Cookie:${cookie.cdomain()} Request:${host}`);
					return cb(options.ignoreError ? null : err);
				}
				if (cookie.hostOnly == null) cookie.hostOnly = false;
			} else {
				cookie.hostOnly = true;
				cookie.domain = host;
			}
			if (!cookie.path || cookie.path[0] !== "/") {
				cookie.path = defaultPath(context.pathname);
				cookie.pathIsDefault = true;
			}
			if (options.http === false && cookie.httpOnly) {
				err = /* @__PURE__ */ new Error("Cookie is HttpOnly and this isn't an HTTP API");
				return cb(options.ignoreError ? null : err);
			}
			if (cookie.sameSite !== "none" && cookie.sameSite !== void 0 && sameSiteContext) {
				if (sameSiteContext === "none") {
					err = /* @__PURE__ */ new Error("Cookie is SameSite but this is a cross-origin request");
					return cb(options.ignoreError ? null : err);
				}
			}
			const ignoreErrorForPrefixSecurity = this.prefixSecurity === PrefixSecurityEnum.SILENT;
			const prefixSecurityDisabled = this.prefixSecurity === PrefixSecurityEnum.DISABLED;
			if (!prefixSecurityDisabled) {
				let errorFound = false;
				let errorMsg;
				if (!isSecurePrefixConditionMet(cookie)) {
					errorFound = true;
					errorMsg = "Cookie has __Secure prefix but Secure attribute is not set";
				} else if (!isHostPrefixConditionMet(cookie)) {
					errorFound = true;
					errorMsg = "Cookie has __Host prefix but either Secure or HostOnly attribute is not set or Path is not '/'";
				}
				if (errorFound) return cb(options.ignoreError || ignoreErrorForPrefixSecurity ? null : new Error(errorMsg));
			}
			const store$1 = this.store;
			if (!store$1.updateCookie) store$1.updateCookie = function(oldCookie, newCookie, cb2) {
				this.putCookie(newCookie, cb2);
			};
			function withCookie(err2, oldCookie) {
				if (err2) return cb(err2);
				const next = function(err3) {
					if (err3) return cb(err3);
					else cb(null, cookie);
				};
				if (oldCookie) {
					if (options.http === false && oldCookie.httpOnly) {
						err2 = /* @__PURE__ */ new Error("old Cookie is HttpOnly and this isn't an HTTP API");
						return cb(options.ignoreError ? null : err2);
					}
					cookie.creation = oldCookie.creation;
					cookie.creationIndex = oldCookie.creationIndex;
					cookie.lastAccessed = now;
					store$1.updateCookie(oldCookie, cookie, next);
				} else {
					cookie.creation = cookie.lastAccessed = now;
					store$1.putCookie(cookie, next);
				}
			}
			store$1.findCookie(cookie.domain, cookie.path, cookie.key, withCookie);
		}
		getCookies(url, options, cb) {
			validators.validate(validators.isUrlStringOrObject(url), cb, url);
			const context = getCookieContext(url);
			if (validators.isFunction(options)) {
				cb = options;
				options = {};
			}
			validators.validate(validators.isObject(options), cb, options);
			validators.validate(validators.isFunction(cb), cb);
			const host = canonicalDomain(context.hostname);
			const path = context.pathname || "/";
			let secure = options.secure;
			if (secure == null && context.protocol && (context.protocol == "https:" || context.protocol == "wss:")) secure = true;
			let sameSiteLevel = 0;
			if (options.sameSiteContext) {
				const sameSiteContext = checkSameSiteContext(options.sameSiteContext);
				sameSiteLevel = Cookie$1.sameSiteLevel[sameSiteContext];
				if (!sameSiteLevel) return cb(new Error(SAME_SITE_CONTEXT_VAL_ERR));
			}
			let http$1 = options.http;
			if (http$1 == null) http$1 = true;
			const now = options.now || Date.now();
			const expireCheck = options.expire !== false;
			const allPaths = !!options.allPaths;
			const store$1 = this.store;
			function matchingCookie(c) {
				if (c.hostOnly) {
					if (c.domain != host) return false;
				} else if (!domainMatch$1(host, c.domain, false)) return false;
				if (!allPaths && !pathMatch$1(path, c.path)) return false;
				if (c.secure && !secure) return false;
				if (c.httpOnly && !http$1) return false;
				if (sameSiteLevel) {
					const cookieLevel = Cookie$1.sameSiteLevel[c.sameSite || "none"];
					if (cookieLevel > sameSiteLevel) return false;
				}
				if (expireCheck && c.expiryTime() <= now) {
					store$1.removeCookie(c.domain, c.path, c.key, () => {});
					return false;
				}
				return true;
			}
			store$1.findCookies(host, allPaths ? null : path, this.allowSpecialUseDomain, (err, cookies) => {
				if (err) return cb(err);
				cookies = cookies.filter(matchingCookie);
				if (options.sort !== false) cookies = cookies.sort(cookieCompare);
				const now2 = /* @__PURE__ */ new Date();
				for (const cookie of cookies) cookie.lastAccessed = now2;
				cb(null, cookies);
			});
		}
		getCookieString(...args) {
			const cb = args.pop();
			validators.validate(validators.isFunction(cb), cb);
			const next = function(err, cookies) {
				if (err) cb(err);
				else cb(null, cookies.sort(cookieCompare).map((c) => c.cookieString()).join("; "));
			};
			args.push(next);
			this.getCookies.apply(this, args);
		}
		getSetCookieStrings(...args) {
			const cb = args.pop();
			validators.validate(validators.isFunction(cb), cb);
			const next = function(err, cookies) {
				if (err) cb(err);
				else cb(null, cookies.map((c) => {
					return c.toString();
				}));
			};
			args.push(next);
			this.getCookies.apply(this, args);
		}
		serialize(cb) {
			validators.validate(validators.isFunction(cb), cb);
			let type = this.store.constructor.name;
			if (validators.isObject(type)) type = null;
			const serialized = {
				version: `tough-cookie@${VERSION}`,
				storeType: type,
				rejectPublicSuffixes: !!this.rejectPublicSuffixes,
				enableLooseMode: !!this.enableLooseMode,
				allowSpecialUseDomain: !!this.allowSpecialUseDomain,
				prefixSecurity: getNormalizedPrefixSecurity(this.prefixSecurity),
				cookies: []
			};
			if (!(this.store.getAllCookies && typeof this.store.getAllCookies === "function")) return cb(/* @__PURE__ */ new Error("store does not support getAllCookies and cannot be serialized"));
			this.store.getAllCookies((err, cookies) => {
				if (err) return cb(err);
				serialized.cookies = cookies.map((cookie) => {
					cookie = cookie instanceof Cookie$1 ? cookie.toJSON() : cookie;
					delete cookie.creationIndex;
					return cookie;
				});
				return cb(null, serialized);
			});
		}
		toJSON() {
			return this.serializeSync();
		}
		_importCookies(serialized, cb) {
			let cookies = serialized.cookies;
			if (!cookies || !Array.isArray(cookies)) return cb(/* @__PURE__ */ new Error("serialized jar has no cookies array"));
			cookies = cookies.slice();
			const putNext = (err) => {
				if (err) return cb(err);
				if (!cookies.length) return cb(err, this);
				let cookie;
				try {
					cookie = fromJSON(cookies.shift());
				} catch (e) {
					return cb(e);
				}
				if (cookie === null) return putNext(null);
				this.store.putCookie(cookie, putNext);
			};
			putNext();
		}
		clone(newStore, cb) {
			if (arguments.length === 1) {
				cb = newStore;
				newStore = null;
			}
			this.serialize((err, serialized) => {
				if (err) return cb(err);
				_CookieJar.deserialize(serialized, newStore, cb);
			});
		}
		cloneSync(newStore) {
			if (arguments.length === 0) return this._cloneSync();
			if (!newStore.synchronous) throw new Error("CookieJar clone destination store is not synchronous; use async API instead.");
			return this._cloneSync(newStore);
		}
		removeAllCookies(cb) {
			validators.validate(validators.isFunction(cb), cb);
			const store$1 = this.store;
			if (typeof store$1.removeAllCookies === "function" && store$1.removeAllCookies !== Store$1.prototype.removeAllCookies) return store$1.removeAllCookies(cb);
			store$1.getAllCookies((err, cookies) => {
				if (err) return cb(err);
				if (cookies.length === 0) return cb(null);
				let completedCount = 0;
				const removeErrors = [];
				function removeCookieCb(removeErr) {
					if (removeErr) removeErrors.push(removeErr);
					completedCount++;
					if (completedCount === cookies.length) return cb(removeErrors.length ? removeErrors[0] : null);
				}
				cookies.forEach((cookie) => {
					store$1.removeCookie(cookie.domain, cookie.path, cookie.key, removeCookieCb);
				});
			});
		}
		static deserialize(strOrObj, store$1, cb) {
			if (arguments.length !== 3) {
				cb = store$1;
				store$1 = null;
			}
			validators.validate(validators.isFunction(cb), cb);
			let serialized;
			if (typeof strOrObj === "string") {
				serialized = jsonParse(strOrObj);
				if (serialized instanceof Error) return cb(serialized);
			} else serialized = strOrObj;
			const jar = new _CookieJar(store$1, {
				rejectPublicSuffixes: serialized.rejectPublicSuffixes,
				looseMode: serialized.enableLooseMode,
				allowSpecialUseDomain: serialized.allowSpecialUseDomain,
				prefixSecurity: serialized.prefixSecurity
			});
			jar._importCookies(serialized, (err) => {
				if (err) return cb(err);
				cb(null, jar);
			});
		}
		static deserializeSync(strOrObj, store$1) {
			const serialized = typeof strOrObj === "string" ? JSON.parse(strOrObj) : strOrObj;
			const jar = new _CookieJar(store$1, {
				rejectPublicSuffixes: serialized.rejectPublicSuffixes,
				looseMode: serialized.enableLooseMode
			});
			if (!jar.store.synchronous) throw new Error("CookieJar store is not synchronous; use async API instead.");
			jar._importCookiesSync(serialized);
			return jar;
		}
	};
	CookieJar$1.fromJSON = CookieJar$1.deserializeSync;
	[
		"_importCookies",
		"clone",
		"getCookies",
		"getCookieString",
		"getSetCookieStrings",
		"removeAllCookies",
		"serialize",
		"setCookie"
	].forEach((name) => {
		CookieJar$1.prototype[name] = fromCallback(CookieJar$1.prototype[name]);
	});
	CookieJar$1.deserialize = fromCallback(CookieJar$1.deserialize);
	function syncWrap(method) {
		return function(...args) {
			if (!this.store.synchronous) throw new Error("CookieJar store is not synchronous; use async API instead.");
			let syncErr, syncResult;
			this[method](...args, (err, result) => {
				syncErr = err;
				syncResult = result;
			});
			if (syncErr) throw syncErr;
			return syncResult;
		};
	}
	exports.version = VERSION;
	exports.CookieJar = CookieJar$1;
	exports.Cookie = Cookie$1;
	exports.Store = Store$1;
	exports.MemoryCookieStore = MemoryCookieStore$1;
	exports.parseDate = parseDate;
	exports.formatDate = formatDate;
	exports.parse = parse$1;
	exports.fromJSON = fromJSON;
	exports.domainMatch = domainMatch$1;
	exports.defaultPath = defaultPath;
	exports.pathMatch = pathMatch$1;
	exports.getPublicSuffix = pubsuffix.getPublicSuffix;
	exports.cookieCompare = cookieCompare;
	exports.permuteDomain = require_permuteDomain().permuteDomain;
	exports.permutePath = permutePath;
	exports.canonicalDomain = canonicalDomain;
	exports.PrefixSecurityEnum = PrefixSecurityEnum;
	exports.ParameterError = validators.ParameterError;
} });
var import_tough_cookie = __toESM$3(require_cookie$1(), 1);
var source_default$2 = import_tough_cookie.default;
/*! Bundled license information:

tough-cookie/lib/pubsuffix-psl.js:
(*!
* Copyright (c) 2018, Salesforce.com, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice,
* this list of conditions and the following disclaimer.
*
* 2. Redistributions in binary form must reproduce the above copyright notice,
* this list of conditions and the following disclaimer in the documentation
* and/or other materials provided with the distribution.
*
* 3. Neither the name of Salesforce.com nor the names of its contributors may
* be used to endorse or promote products derived from this software without
* specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*)

tough-cookie/lib/store.js:
(*!
* Copyright (c) 2015, Salesforce.com, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice,
* this list of conditions and the following disclaimer.
*
* 2. Redistributions in binary form must reproduce the above copyright notice,
* this list of conditions and the following disclaimer in the documentation
* and/or other materials provided with the distribution.
*
* 3. Neither the name of Salesforce.com nor the names of its contributors may
* be used to endorse or promote products derived from this software without
* specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*)

tough-cookie/lib/permuteDomain.js:
(*!
* Copyright (c) 2015, Salesforce.com, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice,
* this list of conditions and the following disclaimer.
*
* 2. Redistributions in binary form must reproduce the above copyright notice,
* this list of conditions and the following disclaimer in the documentation
* and/or other materials provided with the distribution.
*
* 3. Neither the name of Salesforce.com nor the names of its contributors may
* be used to endorse or promote products derived from this software without
* specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*)

tough-cookie/lib/pathMatch.js:
(*!
* Copyright (c) 2015, Salesforce.com, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice,
* this list of conditions and the following disclaimer.
*
* 2. Redistributions in binary form must reproduce the above copyright notice,
* this list of conditions and the following disclaimer in the documentation
* and/or other materials provided with the distribution.
*
* 3. Neither the name of Salesforce.com nor the names of its contributors may
* be used to endorse or promote products derived from this software without
* specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*)

tough-cookie/lib/memstore.js:
(*!
* Copyright (c) 2015, Salesforce.com, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice,
* this list of conditions and the following disclaimer.
*
* 2. Redistributions in binary form must reproduce the above copyright notice,
* this list of conditions and the following disclaimer in the documentation
* and/or other materials provided with the distribution.
*
* 3. Neither the name of Salesforce.com nor the names of its contributors may
* be used to endorse or promote products derived from this software without
* specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*)

tough-cookie/lib/cookie.js:
(*!
* Copyright (c) 2015-2020, Salesforce.com, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice,
* this list of conditions and the following disclaimer.
*
* 2. Redistributions in binary form must reproduce the above copyright notice,
* this list of conditions and the following disclaimer in the documentation
* and/or other materials provided with the distribution.
*
* 3. Neither the name of Salesforce.com nor the names of its contributors may
* be used to endorse or promote products derived from this software without
* specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*)
*/
const { Cookie, CookieJar, Store, MemoryCookieStore, domainMatch, pathMatch } = source_default$2;
var WebStorageCookieStore = class extends Store {
	constructor() {
		super();
		babelHelpers.defineProperty(this, "storage", void 0);
		babelHelpers.defineProperty(this, "storageKey", void 0);
		invariant$1(typeof localStorage !== "undefined", "Failed to create a WebStorageCookieStore: `localStorage` is not available in this environment. This is likely an issue with MSW. Please report it on GitHub: https://github.com/mswjs/msw/issues");
		this.synchronous = true;
		this.storage = localStorage;
		this.storageKey = "__msw-cookie-store__";
	}
	findCookie(domain, path, key, callback) {
		try {
			const store2 = this.getStore();
			const cookies = this.filterCookiesFromList(store2, {
				domain,
				path,
				key
			});
			callback(null, cookies[0] || null);
		} catch (error$3) {
			if (error$3 instanceof Error) callback(error$3, null);
		}
	}
	findCookies(domain, path, allowSpecialUseDomain, callback) {
		if (!domain) {
			callback(null, []);
			return;
		}
		try {
			const store2 = this.getStore();
			const results = this.filterCookiesFromList(store2, {
				domain,
				path
			});
			callback(null, results);
		} catch (error$3) {
			if (error$3 instanceof Error) callback(error$3, []);
		}
	}
	putCookie(cookie, callback) {
		try {
			if (cookie.maxAge === 0) return;
			const store2 = this.getStore();
			store2.push(cookie);
			this.updateStore(store2);
		} catch (error$3) {
			if (error$3 instanceof Error) callback(error$3);
		}
	}
	updateCookie(oldCookie, newCookie, callback) {
		if (newCookie.maxAge === 0) {
			this.removeCookie(newCookie.domain || "", newCookie.path || "", newCookie.key, callback);
			return;
		}
		this.putCookie(newCookie, callback);
	}
	removeCookie(domain, path, key, callback) {
		try {
			const store2 = this.getStore();
			const nextStore = this.deleteCookiesFromList(store2, {
				domain,
				path,
				key
			});
			this.updateStore(nextStore);
			callback(null);
		} catch (error$3) {
			if (error$3 instanceof Error) callback(error$3);
		}
	}
	removeCookies(domain, path, callback) {
		try {
			const store2 = this.getStore();
			const nextStore = this.deleteCookiesFromList(store2, {
				domain,
				path
			});
			this.updateStore(nextStore);
			callback(null);
		} catch (error$3) {
			if (error$3 instanceof Error) callback(error$3);
		}
	}
	getAllCookies(callback) {
		try {
			callback(null, this.getStore());
		} catch (error$3) {
			if (error$3 instanceof Error) callback(error$3, []);
		}
	}
	getStore() {
		try {
			const json = this.storage.getItem(this.storageKey);
			if (json == null) return [];
			const rawCookies = JSON.parse(json);
			const cookies = [];
			for (const rawCookie of rawCookies) {
				const cookie = Cookie.fromJSON(rawCookie);
				if (cookie != null) cookies.push(cookie);
			}
			return cookies;
		} catch {
			return [];
		}
	}
	updateStore(nextStore) {
		this.storage.setItem(this.storageKey, JSON.stringify(nextStore.map((cookie) => cookie.toJSON())));
	}
	filterCookiesFromList(cookies, matches) {
		const result = [];
		for (const cookie of cookies) {
			if (matches.domain && !domainMatch(matches.domain, cookie.domain || "")) continue;
			if (matches.path && !pathMatch(matches.path, cookie.path || "")) continue;
			if (matches.key && cookie.key !== matches.key) continue;
			result.push(cookie);
		}
		return result;
	}
	deleteCookiesFromList(cookies, matches) {
		const matchingCookies = this.filterCookiesFromList(cookies, matches);
		return cookies.filter((cookie) => !matchingCookies.includes(cookie));
	}
};
const store = isNodeProcess$1() ? new MemoryCookieStore() : new WebStorageCookieStore();
const cookieStore = new CookieJar(store);
var __create$2 = Object.create;
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$2 = Object.getOwnPropertyNames;
var __getProtoOf$2 = Object.getPrototypeOf;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __commonJS$2 = (cb, mod) => function __require$2() {
	return mod || (0, cb[__getOwnPropNames$2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps$2 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$2(from)) if (!__hasOwnProp$2.call(to, key) && key !== except) __defProp$4(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$2(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM$2 = (mod, isNodeMode, target) => (target = mod != null ? __create$2(__getProtoOf$2(mod)) : {}, __copyProps$2(isNodeMode || !mod || !mod.__esModule ? __defProp$4(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var require_codes = __commonJS$2({ "node_modules/statuses/codes.json"(exports, module) {
	module.exports = {
		"100": "Continue",
		"101": "Switching Protocols",
		"102": "Processing",
		"103": "Early Hints",
		"200": "OK",
		"201": "Created",
		"202": "Accepted",
		"203": "Non-Authoritative Information",
		"204": "No Content",
		"205": "Reset Content",
		"206": "Partial Content",
		"207": "Multi-Status",
		"208": "Already Reported",
		"226": "IM Used",
		"300": "Multiple Choices",
		"301": "Moved Permanently",
		"302": "Found",
		"303": "See Other",
		"304": "Not Modified",
		"305": "Use Proxy",
		"307": "Temporary Redirect",
		"308": "Permanent Redirect",
		"400": "Bad Request",
		"401": "Unauthorized",
		"402": "Payment Required",
		"403": "Forbidden",
		"404": "Not Found",
		"405": "Method Not Allowed",
		"406": "Not Acceptable",
		"407": "Proxy Authentication Required",
		"408": "Request Timeout",
		"409": "Conflict",
		"410": "Gone",
		"411": "Length Required",
		"412": "Precondition Failed",
		"413": "Payload Too Large",
		"414": "URI Too Long",
		"415": "Unsupported Media Type",
		"416": "Range Not Satisfiable",
		"417": "Expectation Failed",
		"418": "I'm a Teapot",
		"421": "Misdirected Request",
		"422": "Unprocessable Entity",
		"423": "Locked",
		"424": "Failed Dependency",
		"425": "Too Early",
		"426": "Upgrade Required",
		"428": "Precondition Required",
		"429": "Too Many Requests",
		"431": "Request Header Fields Too Large",
		"451": "Unavailable For Legal Reasons",
		"500": "Internal Server Error",
		"501": "Not Implemented",
		"502": "Bad Gateway",
		"503": "Service Unavailable",
		"504": "Gateway Timeout",
		"505": "HTTP Version Not Supported",
		"506": "Variant Also Negotiates",
		"507": "Insufficient Storage",
		"508": "Loop Detected",
		"509": "Bandwidth Limit Exceeded",
		"510": "Not Extended",
		"511": "Network Authentication Required"
	};
} });
var require_statuses = __commonJS$2({ "node_modules/statuses/index.js"(exports, module) {
	"use strict";
	var codes = require_codes();
	module.exports = status2;
	status2.message = codes;
	status2.code = createMessageToStatusCodeMap(codes);
	status2.codes = createStatusCodeList(codes);
	status2.redirect = {
		300: true,
		301: true,
		302: true,
		303: true,
		305: true,
		307: true,
		308: true
	};
	status2.empty = {
		204: true,
		205: true,
		304: true
	};
	status2.retry = {
		502: true,
		503: true,
		504: true
	};
	function createMessageToStatusCodeMap(codes2) {
		var map = {};
		Object.keys(codes2).forEach(function forEachCode(code) {
			var message$2 = codes2[code];
			var status3 = Number(code);
			map[message$2.toLowerCase()] = status3;
		});
		return map;
	}
	function createStatusCodeList(codes2) {
		return Object.keys(codes2).map(function mapCode(code) {
			return Number(code);
		});
	}
	function getStatusCode(message$2) {
		var msg = message$2.toLowerCase();
		if (!Object.prototype.hasOwnProperty.call(status2.code, msg)) throw new Error("invalid status message: \"" + message$2 + "\"");
		return status2.code[msg];
	}
	function getStatusMessage(code) {
		if (!Object.prototype.hasOwnProperty.call(status2.message, code)) throw new Error("invalid status code: " + code);
		return status2.message[code];
	}
	function status2(code) {
		if (typeof code === "number") return getStatusMessage(code);
		if (typeof code !== "string") throw new TypeError("code must be a number or string");
		var n = parseInt(code, 10);
		if (!isNaN(n)) return getStatusMessage(n);
		return getStatusCode(code);
	}
} });
var import_statuses = __toESM$2(require_statuses(), 1);
var source_default$1 = import_statuses.default;
/*! Bundled license information:

statuses/index.js:
(*!
* statuses
* Copyright(c) 2014 Jonathan Ong
* Copyright(c) 2016 Douglas Christopher Wilson
* MIT Licensed
*)
*/
var __create$1 = Object.create;
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __getProtoOf$1 = Object.getPrototypeOf;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __commonJS$1 = (cb, mod) => function __require$2() {
	return mod || (0, cb[__getOwnPropNames$1(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps$1 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$1(from)) if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$3(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM$1 = (mod, isNodeMode, target) => (target = mod != null ? __create$1(__getProtoOf$1(mod)) : {}, __copyProps$1(isNodeMode || !mod || !mod.__esModule ? __defProp$3(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var require_set_cookie = __commonJS$1({ "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
	"use strict";
	var defaultParseOptions = {
		decodeValues: true,
		map: false,
		silent: false
	};
	function isNonEmptyString(str) {
		return typeof str === "string" && !!str.trim();
	}
	function parseString(setCookieValue, options) {
		var parts = setCookieValue.split(";").filter(isNonEmptyString);
		var nameValuePairStr = parts.shift();
		var parsed = parseNameValuePair(nameValuePairStr);
		var name = parsed.name;
		var value = parsed.value;
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		try {
			value = options.decodeValues ? decodeURIComponent(value) : value;
		} catch (e) {
			console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e);
		}
		var cookie = {
			name,
			value
		};
		parts.forEach(function(part) {
			var sides = part.split("=");
			var key = sides.shift().trimLeft().toLowerCase();
			var value2 = sides.join("=");
			if (key === "expires") cookie.expires = new Date(value2);
			else if (key === "max-age") cookie.maxAge = parseInt(value2, 10);
			else if (key === "secure") cookie.secure = true;
			else if (key === "httponly") cookie.httpOnly = true;
			else if (key === "samesite") cookie.sameSite = value2;
			else cookie[key] = value2;
		});
		return cookie;
	}
	function parseNameValuePair(nameValuePairStr) {
		var name = "";
		var value = "";
		var nameValueArr = nameValuePairStr.split("=");
		if (nameValueArr.length > 1) {
			name = nameValueArr.shift();
			value = nameValueArr.join("=");
		} else value = nameValuePairStr;
		return {
			name,
			value
		};
	}
	function parse$1(input, options) {
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		if (!input) if (!options.map) return [];
		else return {};
		if (input.headers) if (typeof input.headers.getSetCookie === "function") input = input.headers.getSetCookie();
		else if (input.headers["set-cookie"]) input = input.headers["set-cookie"];
		else {
			var sch = input.headers[Object.keys(input.headers).find(function(key) {
				return key.toLowerCase() === "set-cookie";
			})];
			if (!sch && input.headers.cookie && !options.silent) console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
			input = sch;
		}
		if (!Array.isArray(input)) input = [input];
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		if (!options.map) return input.filter(isNonEmptyString).map(function(str) {
			return parseString(str, options);
		});
		else {
			var cookies = {};
			return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
				var cookie = parseString(str, options);
				cookies2[cookie.name] = cookie;
				return cookies2;
			}, cookies);
		}
	}
	function splitCookiesString2(cookiesString) {
		if (Array.isArray(cookiesString)) return cookiesString;
		if (typeof cookiesString !== "string") return [];
		var cookiesStrings = [];
		var pos = 0;
		var start;
		var ch;
		var lastComma;
		var nextStart;
		var cookiesSeparatorFound;
		function skipWhitespace() {
			while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
			return pos < cookiesString.length;
		}
		function notSpecialChar() {
			ch = cookiesString.charAt(pos);
			return ch !== "=" && ch !== ";" && ch !== ",";
		}
		while (pos < cookiesString.length) {
			start = pos;
			cookiesSeparatorFound = false;
			while (skipWhitespace()) {
				ch = cookiesString.charAt(pos);
				if (ch === ",") {
					lastComma = pos;
					pos += 1;
					skipWhitespace();
					nextStart = pos;
					while (pos < cookiesString.length && notSpecialChar()) pos += 1;
					if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
						cookiesSeparatorFound = true;
						pos = nextStart;
						cookiesStrings.push(cookiesString.substring(start, lastComma));
						start = pos;
					} else pos = lastComma + 1;
				} else pos += 1;
			}
			if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
		}
		return cookiesStrings;
	}
	module.exports = parse$1;
	module.exports.parse = parse$1;
	module.exports.parseString = parseString;
	module.exports.splitCookiesString = splitCookiesString2;
} });
var import_set_cookie_parser = __toESM$1(require_set_cookie());
var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(name) {
	if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") throw new TypeError("Invalid character in header field name");
	return name.trim().toLowerCase();
}
var charCodesToRemove = [
	String.fromCharCode(10),
	String.fromCharCode(13),
	String.fromCharCode(9),
	String.fromCharCode(32)
];
var HEADER_VALUE_REMOVE_REGEXP = new RegExp(`(^[${charCodesToRemove.join("")}]|$[${charCodesToRemove.join("")}])`, "g");
function normalizeHeaderValue(value) {
	const nextValue = value.replace(HEADER_VALUE_REMOVE_REGEXP, "");
	return nextValue;
}
function isValidHeaderName(value) {
	if (typeof value !== "string") return false;
	if (value.length === 0) return false;
	for (let i = 0; i < value.length; i++) {
		const character = value.charCodeAt(i);
		if (character > 127 || !isToken(character)) return false;
	}
	return true;
}
function isToken(value) {
	return ![
		127,
		32,
		"(",
		")",
		"<",
		">",
		"@",
		",",
		";",
		":",
		"\\",
		"\"",
		"/",
		"[",
		"]",
		"?",
		"=",
		"{",
		"}"
	].includes(value);
}
function isValidHeaderValue(value) {
	if (typeof value !== "string") return false;
	if (value.trim() !== value) return false;
	for (let i = 0; i < value.length; i++) {
		const character = value.charCodeAt(i);
		if (character === 0 || character === 10 || character === 13) return false;
	}
	return true;
}
var NORMALIZED_HEADERS = Symbol("normalizedHeaders");
var RAW_HEADER_NAMES = Symbol("rawHeaderNames");
var HEADER_VALUE_DELIMITER = ", ";
var _a, _b, _c;
var Headers$1 = class _Headers {
	constructor(init) {
		this[_a] = {};
		this[_b] = /* @__PURE__ */ new Map();
		this[_c] = "Headers";
		if (["Headers", "HeadersPolyfill"].includes(init === null || init === void 0 ? void 0 : init.constructor.name) || init instanceof _Headers || typeof globalThis.Headers !== "undefined" && init instanceof globalThis.Headers) {
			const initialHeaders = init;
			initialHeaders.forEach((value, name) => {
				this.append(name, value);
			}, this);
		} else if (Array.isArray(init)) init.forEach(([name, value]) => {
			this.append(name, Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value);
		});
		else if (init) Object.getOwnPropertyNames(init).forEach((name) => {
			const value = init[name];
			this.append(name, Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value);
		});
	}
	[(_a = NORMALIZED_HEADERS, _b = RAW_HEADER_NAMES, _c = Symbol.toStringTag, Symbol.iterator)]() {
		return this.entries();
	}
	*keys() {
		for (const [name] of this.entries()) yield name;
	}
	*values() {
		for (const [, value] of this.entries()) yield value;
	}
	*entries() {
		let sortedKeys = Object.keys(this[NORMALIZED_HEADERS]).sort((a, b) => a.localeCompare(b));
		for (const name of sortedKeys) if (name === "set-cookie") for (const value of this.getSetCookie()) yield [name, value];
		else yield [name, this.get(name)];
	}
	/**
	* Returns a boolean stating whether a `Headers` object contains a certain header.
	*/
	has(name) {
		if (!isValidHeaderName(name)) throw new TypeError(`Invalid header name "${name}"`);
		return this[NORMALIZED_HEADERS].hasOwnProperty(normalizeHeaderName(name));
	}
	/**
	* Returns a `ByteString` sequence of all the values of a header with a given name.
	*/
	get(name) {
		if (!isValidHeaderName(name)) throw TypeError(`Invalid header name "${name}"`);
		return this[NORMALIZED_HEADERS][normalizeHeaderName(name)] ?? null;
	}
	/**
	* Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
	*/
	set(name, value) {
		if (!isValidHeaderName(name) || !isValidHeaderValue(value)) return;
		const normalizedName = normalizeHeaderName(name);
		const normalizedValue = normalizeHeaderValue(value);
		this[NORMALIZED_HEADERS][normalizedName] = normalizeHeaderValue(normalizedValue);
		this[RAW_HEADER_NAMES].set(normalizedName, name);
	}
	/**
	* Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
	*/
	append(name, value) {
		if (!isValidHeaderName(name) || !isValidHeaderValue(value)) return;
		const normalizedName = normalizeHeaderName(name);
		const normalizedValue = normalizeHeaderValue(value);
		let resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${normalizedValue}` : normalizedValue;
		this.set(name, resolvedValue);
	}
	/**
	* Deletes a header from the `Headers` object.
	*/
	delete(name) {
		if (!isValidHeaderName(name)) return;
		if (!this.has(name)) return;
		const normalizedName = normalizeHeaderName(name);
		delete this[NORMALIZED_HEADERS][normalizedName];
		this[RAW_HEADER_NAMES].delete(normalizedName);
	}
	/**
	* Traverses the `Headers` object,
	* calling the given callback for each header.
	*/
	forEach(callback, thisArg) {
		for (const [name, value] of this.entries()) callback.call(thisArg, value, name, this);
	}
	/**
	* Returns an array containing the values
	* of all Set-Cookie headers associated
	* with a response
	*/
	getSetCookie() {
		const setCookieHeader = this.get("set-cookie");
		if (setCookieHeader === null) return [];
		if (setCookieHeader === "") return [""];
		return (0, import_set_cookie_parser.splitCookiesString)(setCookieHeader);
	}
};
const { message: message$1 } = source_default$1;
const kSetCookie = Symbol("kSetCookie");
function normalizeResponseInit(init = {}) {
	const status = (init === null || init === void 0 ? void 0 : init.status) || 200;
	const statusText = (init === null || init === void 0 ? void 0 : init.statusText) || message$1[status] || "";
	const headers = new Headers(init === null || init === void 0 ? void 0 : init.headers);
	return {
		...init,
		headers,
		status,
		statusText
	};
}
function decorateResponse(response, init) {
	if (init.type) Object.defineProperty(response, "type", {
		value: init.type,
		enumerable: true,
		writable: false
	});
	const responseCookies = init.headers.get("set-cookie");
	if (responseCookies) {
		Object.defineProperty(response, kSetCookie, {
			value: responseCookies,
			enumerable: false,
			writable: false
		});
		if (typeof document !== "undefined") {
			const responseCookiePairs = Headers$1.prototype.getSetCookie.call(init.headers);
			for (const cookieString of responseCookiePairs) document.cookie = cookieString;
		}
	}
	return response;
}
function storeResponseCookies(request, response) {
	const responseCookies = Reflect.get(response, kSetCookie);
	if (responseCookies) cookieStore.setCookie(responseCookies, request.url);
}
async function handleRequest(request, requestId, handlers$1, options, emitter, handleRequestOptions) {
	var _request$headers$get, _handleRequestOptions5;
	emitter.emit("request:start", {
		request,
		requestId
	});
	if ((_request$headers$get = request.headers.get("accept")) === null || _request$headers$get === void 0 ? void 0 : _request$headers$get.includes("msw/passthrough")) {
		var _handleRequestOptions;
		emitter.emit("request:end", {
			request,
			requestId
		});
		handleRequestOptions === null || handleRequestOptions === void 0 || (_handleRequestOptions = handleRequestOptions.onPassthroughResponse) === null || _handleRequestOptions === void 0 || _handleRequestOptions.call(handleRequestOptions, request);
		return;
	}
	const lookupResult = await until$1(() => {
		return executeHandlers({
			request,
			requestId,
			handlers: handlers$1,
			resolutionContext: handleRequestOptions === null || handleRequestOptions === void 0 ? void 0 : handleRequestOptions.resolutionContext
		});
	});
	if (lookupResult.error) {
		emitter.emit("unhandledException", {
			error: lookupResult.error,
			request,
			requestId
		});
		throw lookupResult.error;
	}
	if (!lookupResult.data) {
		var _handleRequestOptions2;
		await onUnhandledRequest(request, options.onUnhandledRequest);
		emitter.emit("request:unhandled", {
			request,
			requestId
		});
		emitter.emit("request:end", {
			request,
			requestId
		});
		handleRequestOptions === null || handleRequestOptions === void 0 || (_handleRequestOptions2 = handleRequestOptions.onPassthroughResponse) === null || _handleRequestOptions2 === void 0 || _handleRequestOptions2.call(handleRequestOptions, request);
		return;
	}
	const { response } = lookupResult.data;
	if (!response) {
		var _handleRequestOptions3;
		emitter.emit("request:end", {
			request,
			requestId
		});
		handleRequestOptions === null || handleRequestOptions === void 0 || (_handleRequestOptions3 = handleRequestOptions.onPassthroughResponse) === null || _handleRequestOptions3 === void 0 || _handleRequestOptions3.call(handleRequestOptions, request);
		return;
	}
	if (response.status === 302 && response.headers.get("x-msw-intention") === "passthrough") {
		var _handleRequestOptions4;
		emitter.emit("request:end", {
			request,
			requestId
		});
		handleRequestOptions === null || handleRequestOptions === void 0 || (_handleRequestOptions4 = handleRequestOptions.onPassthroughResponse) === null || _handleRequestOptions4 === void 0 || _handleRequestOptions4.call(handleRequestOptions, request);
		return;
	}
	storeResponseCookies(request, response);
	emitter.emit("request:match", {
		request,
		requestId
	});
	const requiredLookupResult = lookupResult.data;
	handleRequestOptions === null || handleRequestOptions === void 0 || (_handleRequestOptions5 = handleRequestOptions.onMockedResponse) === null || _handleRequestOptions5 === void 0 || _handleRequestOptions5.call(handleRequestOptions, response, requiredLookupResult);
	emitter.emit("request:end", {
		request,
		requestId
	});
	return response;
}
function toResponseInit(response) {
	return {
		status: response.status,
		statusText: response.statusText,
		headers: Object.fromEntries(response.headers.entries())
	};
}
function isHandlerKind(kind) {
	return (input) => {
		return input != null && typeof input === "object" && "__kind" in input && input.__kind === kind;
	};
}
function isObject$1(value) {
	return value != null && typeof value === "object" && !Array.isArray(value);
}
function mergeRight(left, right) {
	return Object.entries(right).reduce((result, [key, rightValue]) => {
		const leftValue = result[key];
		if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
			result[key] = leftValue.concat(rightValue);
			return result;
		}
		if (isObject$1(leftValue) && isObject$1(rightValue)) {
			result[key] = mergeRight(leftValue, rightValue);
			return result;
		}
		result[key] = rightValue;
		return result;
	}, Object.assign({}, left));
}
var MemoryLeakError$1 = class extends Error {
	constructor(emitter, type, count) {
		super(`Possible EventEmitter memory leak detected. ${count} ${type.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`);
		this.emitter = emitter;
		this.type = type;
		this.count = count;
		this.name = "MaxListenersExceededWarning";
	}
};
var _Emitter$1 = class {
	static listenerCount(emitter, eventName) {
		return emitter.listenerCount(eventName);
	}
	constructor() {
		this.events = /* @__PURE__ */ new Map();
		this.maxListeners = _Emitter$1.defaultMaxListeners;
		this.hasWarnedAboutPotentialMemoryLeak = false;
	}
	_emitInternalEvent(internalEventName, eventName, listener) {
		this.emit(internalEventName, ...[eventName, listener]);
	}
	_getListeners(eventName) {
		return Array.prototype.concat.apply([], this.events.get(eventName)) || [];
	}
	_removeListener(listeners, listener) {
		const index = listeners.indexOf(listener);
		if (index > -1) listeners.splice(index, 1);
		return [];
	}
	_wrapOnceListener(eventName, listener) {
		const onceListener = (...data) => {
			this.removeListener(eventName, onceListener);
			return listener.apply(this, data);
		};
		Object.defineProperty(onceListener, "name", { value: listener.name });
		return onceListener;
	}
	setMaxListeners(maxListeners) {
		this.maxListeners = maxListeners;
		return this;
	}
	/**
	* Returns the current max listener value for the `Emitter` which is
	* either set by `emitter.setMaxListeners(n)` or defaults to
	* `Emitter.defaultMaxListeners`.
	*/
	getMaxListeners() {
		return this.maxListeners;
	}
	/**
	* Returns an array listing the events for which the emitter has registered listeners.
	* The values in the array will be strings or Symbols.
	*/
	eventNames() {
		return Array.from(this.events.keys());
	}
	/**
	* Synchronously calls each of the listeners registered for the event named `eventName`,
	* in the order they were registered, passing the supplied arguments to each.
	* Returns `true` if the event has listeners, `false` otherwise.
	*
	* @example
	* const emitter = new Emitter<{ hello: [string] }>()
	* emitter.emit('hello', 'John')
	*/
	emit(eventName, ...data) {
		const listeners = this._getListeners(eventName);
		listeners.forEach((listener) => {
			listener.apply(this, data);
		});
		return listeners.length > 0;
	}
	addListener(eventName, listener) {
		this._emitInternalEvent("newListener", eventName, listener);
		const nextListeners = this._getListeners(eventName).concat(listener);
		this.events.set(eventName, nextListeners);
		if (this.maxListeners > 0 && this.listenerCount(eventName) > this.maxListeners && !this.hasWarnedAboutPotentialMemoryLeak) {
			this.hasWarnedAboutPotentialMemoryLeak = true;
			const memoryLeakWarning = new MemoryLeakError$1(this, eventName, this.listenerCount(eventName));
			console.warn(memoryLeakWarning);
		}
		return this;
	}
	on(eventName, listener) {
		return this.addListener(eventName, listener);
	}
	once(eventName, listener) {
		return this.addListener(eventName, this._wrapOnceListener(eventName, listener));
	}
	prependListener(eventName, listener) {
		const listeners = this._getListeners(eventName);
		if (listeners.length > 0) {
			const nextListeners = [listener].concat(listeners);
			this.events.set(eventName, nextListeners);
		} else this.events.set(eventName, listeners.concat(listener));
		return this;
	}
	prependOnceListener(eventName, listener) {
		return this.prependListener(eventName, this._wrapOnceListener(eventName, listener));
	}
	removeListener(eventName, listener) {
		const listeners = this._getListeners(eventName);
		if (listeners.length > 0) {
			this._removeListener(listeners, listener);
			this.events.set(eventName, listeners);
			this._emitInternalEvent("removeListener", eventName, listener);
		}
		return this;
	}
	/**
	* Alias for `emitter.removeListener()`.
	*
	* @example
	* emitter.off('hello', listener)
	*/
	off(eventName, listener) {
		return this.removeListener(eventName, listener);
	}
	removeAllListeners(eventName) {
		if (eventName) this.events.delete(eventName);
		else this.events.clear();
		return this;
	}
	/**
	* Returns a copy of the array of listeners for the event named `eventName`.
	*/
	listeners(eventName) {
		return Array.from(this._getListeners(eventName));
	}
	/**
	* Returns the number of listeners listening to the event named `eventName`.
	*/
	listenerCount(eventName) {
		return this._getListeners(eventName).length;
	}
	rawListeners(eventName) {
		return this.listeners(eventName);
	}
};
var Emitter$1 = _Emitter$1;
Emitter$1.defaultMaxListeners = 10;
function pipeEvents(source, destination) {
	const rawEmit = source.emit;
	if (rawEmit._isPiped) return;
	const sourceEmit = function sourceEmit2(event, ...data) {
		destination.emit(event, ...data);
		return rawEmit.call(this, event, ...data);
	};
	sourceEmit._isPiped = true;
	source.emit = sourceEmit;
}
function toReadonlyArray(source) {
	const clone = [...source];
	Object.freeze(clone);
	return clone;
}
var Disposable = class {
	constructor() {
		babelHelpers.defineProperty(this, "subscriptions", []);
	}
	dispose() {
		let subscription;
		while (subscription = this.subscriptions.shift()) subscription();
	}
};
var InMemoryHandlersController = class {
	constructor(initialHandlers) {
		babelHelpers.defineProperty(this, "handlers", void 0);
		this.initialHandlers = initialHandlers;
		this.handlers = [...initialHandlers];
	}
	prepend(runtimeHandles) {
		this.handlers.unshift(...runtimeHandles);
	}
	reset(nextHandlers) {
		this.handlers = nextHandlers.length > 0 ? [...nextHandlers] : [...this.initialHandlers];
	}
	currentHandlers() {
		return this.handlers;
	}
};
var SetupApi = class extends Disposable {
	constructor(...initialHandlers) {
		super();
		babelHelpers.defineProperty(this, "handlersController", void 0);
		babelHelpers.defineProperty(this, "emitter", void 0);
		babelHelpers.defineProperty(this, "publicEmitter", void 0);
		babelHelpers.defineProperty(this, "events", void 0);
		invariant$1(this.validateHandlers(initialHandlers), devUtils.formatMessage(`Failed to apply given request handlers: invalid input. Did you forget to spread the request handlers Array?`));
		this.handlersController = new InMemoryHandlersController(initialHandlers);
		this.emitter = new Emitter$1();
		this.publicEmitter = new Emitter$1();
		pipeEvents(this.emitter, this.publicEmitter);
		this.events = this.createLifeCycleEvents();
		this.subscriptions.push(() => {
			this.emitter.removeAllListeners();
			this.publicEmitter.removeAllListeners();
		});
	}
	validateHandlers(handlers$1) {
		return handlers$1.every((handler) => !Array.isArray(handler));
	}
	use(...runtimeHandlers) {
		invariant$1(this.validateHandlers(runtimeHandlers), devUtils.formatMessage(`Failed to call "use()" with the given request handlers: invalid input. Did you forget to spread the array of request handlers?`));
		this.handlersController.prepend(runtimeHandlers);
	}
	restoreHandlers() {
		this.handlersController.currentHandlers().forEach((handler) => {
			if ("isUsed" in handler) handler.isUsed = false;
		});
	}
	resetHandlers(...nextHandlers) {
		this.handlersController.reset(nextHandlers);
	}
	listHandlers() {
		return toReadonlyArray(this.handlersController.currentHandlers());
	}
	createLifeCycleEvents() {
		return {
			on: (...args) => {
				return this.publicEmitter.on(...args);
			},
			removeListener: (...args) => {
				return this.publicEmitter.removeListener(...args);
			},
			removeAllListeners: (...args) => {
				return this.publicEmitter.removeAllListeners(...args);
			}
		};
	}
};
function hasConfigurableGlobal$1(propertyName) {
	const descriptor = Object.getOwnPropertyDescriptor(globalThis, propertyName);
	if (typeof descriptor === "undefined") return false;
	if (typeof descriptor.get === "function" && typeof descriptor.get() === "undefined") return false;
	if (typeof descriptor.get === "undefined" && descriptor.value == null) return false;
	if (typeof descriptor.set === "undefined" && !descriptor.configurable) {
		console.error(`[MSW] Failed to apply interceptor: the global \`${propertyName}\` property is non-configurable. This is likely an issue with your environment. If you are using a framework, please open an issue about this in their repository.`);
		return false;
	}
	return true;
}
var __defProp$2 = Object.defineProperty;
var __export$1 = (target, all) => {
	for (var name in all) __defProp$2(target, name, {
		get: all[name],
		enumerable: true
	});
};
var colors_exports$1 = {};
__export$1(colors_exports$1, {
	blue: () => blue$1,
	gray: () => gray$1,
	green: () => green$1,
	red: () => red$1,
	yellow: () => yellow$1
});
function yellow$1(text) {
	return `\x1B[33m${text}\x1B[0m`;
}
function blue$1(text) {
	return `\x1B[34m${text}\x1B[0m`;
}
function gray$1(text) {
	return `\x1B[90m${text}\x1B[0m`;
}
function red$1(text) {
	return `\x1B[31m${text}\x1B[0m`;
}
function green$1(text) {
	return `\x1B[32m${text}\x1B[0m`;
}
var IS_NODE$1 = isNodeProcess$1();
var Logger$1 = class {
	constructor(name) {
		babelHelpers.defineProperty(this, "prefix", void 0);
		this.name = name;
		this.prefix = `[${this.name}]`;
		const LOGGER_NAME = getVariable$1("DEBUG");
		const LOGGER_LEVEL = getVariable$1("LOG_LEVEL");
		const isLoggingEnabled = LOGGER_NAME === "1" || LOGGER_NAME === "true" || typeof LOGGER_NAME !== "undefined" && this.name.startsWith(LOGGER_NAME);
		if (isLoggingEnabled) {
			this.debug = isDefinedAndNotEquals$1(LOGGER_LEVEL, "debug") ? noop$1 : this.debug;
			this.info = isDefinedAndNotEquals$1(LOGGER_LEVEL, "info") ? noop$1 : this.info;
			this.success = isDefinedAndNotEquals$1(LOGGER_LEVEL, "success") ? noop$1 : this.success;
			this.warning = isDefinedAndNotEquals$1(LOGGER_LEVEL, "warning") ? noop$1 : this.warning;
			this.error = isDefinedAndNotEquals$1(LOGGER_LEVEL, "error") ? noop$1 : this.error;
		} else {
			this.info = noop$1;
			this.success = noop$1;
			this.warning = noop$1;
			this.error = noop$1;
			this.only = noop$1;
		}
	}
	extend(domain) {
		return new Logger$1(`${this.name}:${domain}`);
	}
	/**
	* Print a debug message.
	* @example
	* logger.debug('no duplicates found, creating a document...')
	*/
	debug(message$2, ...positionals) {
		this.logEntry({
			level: "debug",
			message: gray$1(message$2),
			positionals,
			prefix: this.prefix,
			colors: { prefix: "gray" }
		});
	}
	/**
	* Print an info message.
	* @example
	* logger.info('start parsing...')
	*/
	info(message$2, ...positionals) {
		this.logEntry({
			level: "info",
			message: message$2,
			positionals,
			prefix: this.prefix,
			colors: { prefix: "blue" }
		});
		const performance2 = new PerformanceEntry$1();
		return (message2, ...positionals2) => {
			performance2.measure();
			this.logEntry({
				level: "info",
				message: `${message2} ${gray$1(`${performance2.deltaTime}ms`)}`,
				positionals: positionals2,
				prefix: this.prefix,
				colors: { prefix: "blue" }
			});
		};
	}
	/**
	* Print a success message.
	* @example
	* logger.success('successfully created document')
	*/
	success(message$2, ...positionals) {
		this.logEntry({
			level: "info",
			message: message$2,
			positionals,
			prefix: `\u2714 ${this.prefix}`,
			colors: {
				timestamp: "green",
				prefix: "green"
			}
		});
	}
	/**
	* Print a warning.
	* @example
	* logger.warning('found legacy document format')
	*/
	warning(message$2, ...positionals) {
		this.logEntry({
			level: "warning",
			message: message$2,
			positionals,
			prefix: `\u26A0 ${this.prefix}`,
			colors: {
				timestamp: "yellow",
				prefix: "yellow"
			}
		});
	}
	/**
	* Print an error message.
	* @example
	* logger.error('something went wrong')
	*/
	error(message$2, ...positionals) {
		this.logEntry({
			level: "error",
			message: message$2,
			positionals,
			prefix: `\u2716 ${this.prefix}`,
			colors: {
				timestamp: "red",
				prefix: "red"
			}
		});
	}
	/**
	* Execute the given callback only when the logging is enabled.
	* This is skipped in its entirety and has no runtime cost otherwise.
	* This executes regardless of the log level.
	* @example
	* logger.only(() => {
	*   logger.info('additional info')
	* })
	*/
	only(callback) {
		callback();
	}
	createEntry(level, message$2) {
		return {
			timestamp: /* @__PURE__ */ new Date(),
			level,
			message: message$2
		};
	}
	logEntry(args) {
		const { level, message: message$2, prefix, colors: customColors, positionals = [] } = args;
		const entry = this.createEntry(level, message$2);
		const timestampColor = (customColors === null || customColors === void 0 ? void 0 : customColors.timestamp) || "gray";
		const prefixColor = (customColors === null || customColors === void 0 ? void 0 : customColors.prefix) || "gray";
		const colorize = {
			timestamp: colors_exports$1[timestampColor],
			prefix: colors_exports$1[prefixColor]
		};
		const write = this.getWriter(level);
		write([colorize.timestamp(this.formatTimestamp(entry.timestamp))].concat(prefix != null ? colorize.prefix(prefix) : []).concat(serializeInput$1(message$2)).join(" "), ...positionals.map(serializeInput$1));
	}
	formatTimestamp(timestamp) {
		return `${timestamp.toLocaleTimeString("en-GB")}:${timestamp.getMilliseconds()}`;
	}
	getWriter(level) {
		switch (level) {
			case "debug":
			case "success":
			case "info": return log$1;
			case "warning": return warn$1;
			case "error": return error$1;
		}
	}
};
var PerformanceEntry$1 = class {
	constructor() {
		babelHelpers.defineProperty(this, "startTime", void 0);
		babelHelpers.defineProperty(this, "endTime", void 0);
		babelHelpers.defineProperty(this, "deltaTime", void 0);
		this.startTime = performance.now();
	}
	measure() {
		this.endTime = performance.now();
		const deltaTime = this.endTime - this.startTime;
		this.deltaTime = deltaTime.toFixed(2);
	}
};
var noop$1 = () => void 0;
function log$1(message$2, ...positionals) {
	if (IS_NODE$1) {
		process.stdout.write(format$1(message$2, ...positionals) + "\n");
		return;
	}
	console.log(message$2, ...positionals);
}
function warn$1(message$2, ...positionals) {
	if (IS_NODE$1) {
		process.stderr.write(format$1(message$2, ...positionals) + "\n");
		return;
	}
	console.warn(message$2, ...positionals);
}
function error$1(message$2, ...positionals) {
	if (IS_NODE$1) {
		process.stderr.write(format$1(message$2, ...positionals) + "\n");
		return;
	}
	console.error(message$2, ...positionals);
}
function getVariable$1(variableName) {
	var _globalThis$variableN;
	if (IS_NODE$1) return {}[variableName];
	return (_globalThis$variableN = globalThis[variableName]) === null || _globalThis$variableN === void 0 ? void 0 : _globalThis$variableN.toString();
}
function isDefinedAndNotEquals$1(value, expected) {
	return value !== void 0 && value !== expected;
}
function serializeInput$1(message$2) {
	if (typeof message$2 === "undefined") return "undefined";
	if (message$2 === null) return "null";
	if (typeof message$2 === "string") return message$2;
	if (typeof message$2 === "object") return JSON.stringify(message$2);
	return message$2.toString();
}
function getGlobalSymbol$1(symbol) {
	return globalThis[symbol] || void 0;
}
function setGlobalSymbol$1(symbol, value) {
	globalThis[symbol] = value;
}
function deleteGlobalSymbol$1(symbol) {
	delete globalThis[symbol];
}
var Interceptor$1 = class {
	constructor(symbol) {
		this.symbol = symbol;
		this.readyState = "INACTIVE";
		this.emitter = new Emitter$1();
		this.subscriptions = [];
		this.logger = new Logger$1(symbol.description);
		this.emitter.setMaxListeners(0);
		this.logger.info("constructing the interceptor...");
	}
	/**
	* Determine if this interceptor can be applied
	* in the current environment.
	*/
	checkEnvironment() {
		return true;
	}
	/**
	* Apply this interceptor to the current process.
	* Returns an already running interceptor instance if it's present.
	*/
	apply() {
		const logger = this.logger.extend("apply");
		logger.info("applying the interceptor...");
		if (this.readyState === "APPLIED") {
			logger.info("intercepted already applied!");
			return;
		}
		const shouldApply = this.checkEnvironment();
		if (!shouldApply) {
			logger.info("the interceptor cannot be applied in this environment!");
			return;
		}
		this.readyState = "APPLYING";
		const runningInstance = this.getInstance();
		if (runningInstance) {
			logger.info("found a running instance, reusing...");
			this.on = (event, listener) => {
				logger.info("proxying the \"%s\" listener", event);
				runningInstance.emitter.addListener(event, listener);
				this.subscriptions.push(() => {
					runningInstance.emitter.removeListener(event, listener);
					logger.info("removed proxied \"%s\" listener!", event);
				});
				return this;
			};
			this.readyState = "APPLIED";
			return;
		}
		logger.info("no running instance found, setting up a new instance...");
		this.setup();
		this.setInstance();
		this.readyState = "APPLIED";
	}
	/**
	* Setup the module augments and stubs necessary for this interceptor.
	* This method is not run if there's a running interceptor instance
	* to prevent instantiating an interceptor multiple times.
	*/
	setup() {}
	/**
	* Listen to the interceptor's public events.
	*/
	on(event, listener) {
		const logger = this.logger.extend("on");
		if (this.readyState === "DISPOSING" || this.readyState === "DISPOSED") {
			logger.info("cannot listen to events, already disposed!");
			return this;
		}
		logger.info("adding \"%s\" event listener:", event, listener);
		this.emitter.on(event, listener);
		return this;
	}
	once(event, listener) {
		this.emitter.once(event, listener);
		return this;
	}
	off(event, listener) {
		this.emitter.off(event, listener);
		return this;
	}
	removeAllListeners(event) {
		this.emitter.removeAllListeners(event);
		return this;
	}
	/**
	* Disposes of any side-effects this interceptor has introduced.
	*/
	dispose() {
		const logger = this.logger.extend("dispose");
		if (this.readyState === "DISPOSED") {
			logger.info("cannot dispose, already disposed!");
			return;
		}
		logger.info("disposing the interceptor...");
		this.readyState = "DISPOSING";
		if (!this.getInstance()) {
			logger.info("no interceptors running, skipping dispose...");
			return;
		}
		this.clearInstance();
		logger.info("global symbol deleted:", getGlobalSymbol$1(this.symbol));
		if (this.subscriptions.length > 0) {
			logger.info("disposing of %d subscriptions...", this.subscriptions.length);
			for (const dispose of this.subscriptions) dispose();
			this.subscriptions = [];
			logger.info("disposed of all subscriptions!", this.subscriptions.length);
		}
		this.emitter.removeAllListeners();
		logger.info("destroyed the listener!");
		this.readyState = "DISPOSED";
	}
	getInstance() {
		var _a$1;
		const instance = getGlobalSymbol$1(this.symbol);
		this.logger.info("retrieved global instance:", (_a$1 = instance == null ? void 0 : instance.constructor) == null ? void 0 : _a$1.name);
		return instance;
	}
	setInstance() {
		setGlobalSymbol$1(this.symbol, this);
		this.logger.info("set global instance!", this.symbol.description);
	}
	clearInstance() {
		deleteGlobalSymbol$1(this.symbol);
		this.logger.info("cleared global instance!", this.symbol.description);
	}
};
function createRequestId$1() {
	return Math.random().toString(16).slice(2);
}
function createDeferredExecutor$1() {
	const executor = (resolve, reject) => {
		executor.state = "pending";
		executor.resolve = (data) => {
			if (executor.state !== "pending") return;
			executor.result = data;
			const onFulfilled = (value) => {
				executor.state = "fulfilled";
				return value;
			};
			return resolve(data instanceof Promise ? data : Promise.resolve(data).then(onFulfilled));
		};
		executor.reject = (reason) => {
			if (executor.state !== "pending") return;
			queueMicrotask(() => {
				executor.state = "rejected";
			});
			return reject(executor.rejectionReason = reason);
		};
	};
	return executor;
}
var DeferredPromise$1 = (_executor = /* @__PURE__ */ new WeakMap(), _Class_brand = /* @__PURE__ */ new WeakSet(), class extends Promise {
	constructor(executor = null) {
		const deferredExecutor = createDeferredExecutor$1();
		super((originalResolve, originalReject) => {
			deferredExecutor(originalResolve, originalReject);
			executor === null || executor === void 0 || executor(deferredExecutor.resolve, deferredExecutor.reject);
		});
		babelHelpers.classPrivateMethodInitSpec(this, _Class_brand);
		babelHelpers.classPrivateFieldInitSpec(this, _executor, void 0);
		babelHelpers.defineProperty(this, "resolve", void 0);
		babelHelpers.defineProperty(this, "reject", void 0);
		babelHelpers.classPrivateFieldSet2(_executor, this, deferredExecutor);
		this.resolve = babelHelpers.classPrivateFieldGet2(_executor, this).resolve;
		this.reject = babelHelpers.classPrivateFieldGet2(_executor, this).reject;
	}
	get state() {
		return babelHelpers.classPrivateFieldGet2(_executor, this).state;
	}
	get rejectionReason() {
		return babelHelpers.classPrivateFieldGet2(_executor, this).rejectionReason;
	}
	then(onFulfilled, onRejected) {
		return babelHelpers.assertClassBrand(_Class_brand, this, _decorate).call(this, super.then(onFulfilled, onRejected));
	}
	catch(onRejected) {
		return babelHelpers.assertClassBrand(_Class_brand, this, _decorate).call(this, super.catch(onRejected));
	}
	finally(onfinally) {
		return babelHelpers.assertClassBrand(_Class_brand, this, _decorate).call(this, super.finally(onfinally));
	}
});
function _decorate(promise) {
	return Object.defineProperties(promise, {
		resolve: {
			configurable: true,
			value: this.resolve
		},
		reject: {
			configurable: true,
			value: this.reject
		}
	});
}
function bindEvent(target, event) {
	Object.defineProperties(event, {
		target: {
			value: target,
			enumerable: true,
			writable: true
		},
		currentTarget: {
			value: target,
			enumerable: true,
			writable: true
		}
	});
	return event;
}
var kCancelable = Symbol("kCancelable");
var kDefaultPrevented = Symbol("kDefaultPrevented");
var CancelableMessageEvent = class extends MessageEvent {
	constructor(type, init) {
		super(type, init);
		this[kCancelable] = !!init.cancelable;
		this[kDefaultPrevented] = false;
	}
	get cancelable() {
		return this[kCancelable];
	}
	set cancelable(nextCancelable) {
		this[kCancelable] = nextCancelable;
	}
	get defaultPrevented() {
		return this[kDefaultPrevented];
	}
	set defaultPrevented(nextDefaultPrevented) {
		this[kDefaultPrevented] = nextDefaultPrevented;
	}
	preventDefault() {
		if (this.cancelable && !this[kDefaultPrevented]) this[kDefaultPrevented] = true;
	}
};
var CloseEvent = class extends Event {
	constructor(type, init = {}) {
		super(type, init);
		this.code = init.code === void 0 ? 0 : init.code;
		this.reason = init.reason === void 0 ? "" : init.reason;
		this.wasClean = init.wasClean === void 0 ? false : init.wasClean;
	}
};
var CancelableCloseEvent = class extends CloseEvent {
	constructor(type, init = {}) {
		super(type, init);
		this[kCancelable] = !!init.cancelable;
		this[kDefaultPrevented] = false;
	}
	get cancelable() {
		return this[kCancelable];
	}
	set cancelable(nextCancelable) {
		this[kCancelable] = nextCancelable;
	}
	get defaultPrevented() {
		return this[kDefaultPrevented];
	}
	set defaultPrevented(nextDefaultPrevented) {
		this[kDefaultPrevented] = nextDefaultPrevented;
	}
	preventDefault() {
		if (this.cancelable && !this[kDefaultPrevented]) this[kDefaultPrevented] = true;
	}
};
var kEmitter = Symbol("kEmitter");
var kBoundListener = Symbol("kBoundListener");
var WebSocketClientConnection = class {
	constructor(socket, transport) {
		this.socket = socket;
		this.transport = transport;
		this.id = createRequestId$1();
		this.url = new URL(socket.url);
		this[kEmitter] = new EventTarget();
		this.transport.addEventListener("outgoing", (event) => {
			const message$2 = bindEvent(this.socket, new CancelableMessageEvent("message", {
				data: event.data,
				origin: event.origin,
				cancelable: true
			}));
			this[kEmitter].dispatchEvent(message$2);
			if (message$2.defaultPrevented) event.preventDefault();
		});
		this.transport.addEventListener("close", (event) => {
			this[kEmitter].dispatchEvent(bindEvent(this.socket, new CloseEvent("close", event)));
		});
	}
	/**
	* Listen for the outgoing events from the connected WebSocket client.
	*/
	addEventListener(type, listener, options) {
		if (!Reflect.has(listener, kBoundListener)) {
			const boundListener = listener.bind(this.socket);
			Object.defineProperty(listener, kBoundListener, {
				value: boundListener,
				enumerable: false,
				configurable: false
			});
		}
		this[kEmitter].addEventListener(type, Reflect.get(listener, kBoundListener), options);
	}
	/**
	* Removes the listener for the given event.
	*/
	removeEventListener(event, listener, options) {
		this[kEmitter].removeEventListener(event, Reflect.get(listener, kBoundListener), options);
	}
	/**
	* Send data to the connected client.
	*/
	send(data) {
		this.transport.send(data);
	}
	/**
	* Close the WebSocket connection.
	* @param {number} code A status code (see https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1).
	* @param {string} reason A custom connection close reason.
	*/
	close(code, reason) {
		this.transport.close(code, reason);
	}
};
var WEBSOCKET_CLOSE_CODE_RANGE_ERROR = "InvalidAccessError: close code out of user configurable range";
var kPassthroughPromise = Symbol("kPassthroughPromise");
var kOnSend = Symbol("kOnSend");
var kClose = Symbol("kClose");
var WebSocketOverride = class extends EventTarget {
	constructor(url, protocols) {
		super();
		this.CONNECTING = 0;
		this.OPEN = 1;
		this.CLOSING = 2;
		this.CLOSED = 3;
		this._onopen = null;
		this._onmessage = null;
		this._onerror = null;
		this._onclose = null;
		this.url = url.toString();
		this.protocol = "";
		this.extensions = "";
		this.binaryType = "blob";
		this.readyState = this.CONNECTING;
		this.bufferedAmount = 0;
		this[kPassthroughPromise] = new DeferredPromise$1();
		queueMicrotask(async () => {
			if (await this[kPassthroughPromise]) return;
			this.protocol = typeof protocols === "string" ? protocols : Array.isArray(protocols) && protocols.length > 0 ? protocols[0] : "";
			if (this.readyState === this.CONNECTING) {
				this.readyState = this.OPEN;
				this.dispatchEvent(bindEvent(this, new Event("open")));
			}
		});
	}
	set onopen(listener) {
		this.removeEventListener("open", this._onopen);
		this._onopen = listener;
		if (listener !== null) this.addEventListener("open", listener);
	}
	get onopen() {
		return this._onopen;
	}
	set onmessage(listener) {
		this.removeEventListener("message", this._onmessage);
		this._onmessage = listener;
		if (listener !== null) this.addEventListener("message", listener);
	}
	get onmessage() {
		return this._onmessage;
	}
	set onerror(listener) {
		this.removeEventListener("error", this._onerror);
		this._onerror = listener;
		if (listener !== null) this.addEventListener("error", listener);
	}
	get onerror() {
		return this._onerror;
	}
	set onclose(listener) {
		this.removeEventListener("close", this._onclose);
		this._onclose = listener;
		if (listener !== null) this.addEventListener("close", listener);
	}
	get onclose() {
		return this._onclose;
	}
	/**
	* @see https://websockets.spec.whatwg.org/#ref-for-dom-websocket-send%E2%91%A0
	*/
	send(data) {
		if (this.readyState === this.CONNECTING) {
			this.close();
			throw new DOMException("InvalidStateError");
		}
		if (this.readyState === this.CLOSING || this.readyState === this.CLOSED) return;
		this.bufferedAmount += getDataSize(data);
		queueMicrotask(() => {
			var _a$1;
			this.bufferedAmount = 0;
			(_a$1 = this[kOnSend]) == null || _a$1.call(this, data);
		});
	}
	close(code = 1e3, reason) {
		invariant$1(code, WEBSOCKET_CLOSE_CODE_RANGE_ERROR);
		invariant$1(code === 1e3 || code >= 3e3 && code <= 4999, WEBSOCKET_CLOSE_CODE_RANGE_ERROR);
		this[kClose](code, reason);
	}
	[kClose](code = 1e3, reason, wasClean = true) {
		if (this.readyState === this.CLOSING || this.readyState === this.CLOSED) return;
		this.readyState = this.CLOSING;
		queueMicrotask(() => {
			this.readyState = this.CLOSED;
			this.dispatchEvent(bindEvent(this, new CloseEvent("close", {
				code,
				reason,
				wasClean
			})));
			this._onopen = null;
			this._onmessage = null;
			this._onerror = null;
			this._onclose = null;
		});
	}
	addEventListener(type, listener, options) {
		return super.addEventListener(type, listener, options);
	}
	removeEventListener(type, callback, options) {
		return super.removeEventListener(type, callback, options);
	}
};
WebSocketOverride.CONNECTING = 0;
WebSocketOverride.OPEN = 1;
WebSocketOverride.CLOSING = 2;
WebSocketOverride.CLOSED = 3;
function getDataSize(data) {
	if (typeof data === "string") return data.length;
	if (data instanceof Blob) return data.size;
	return data.byteLength;
}
var kEmitter2 = Symbol("kEmitter");
var kBoundListener2 = Symbol("kBoundListener");
var kSend = Symbol("kSend");
var WebSocketServerConnection = class {
	constructor(client, transport, createConnection) {
		this.client = client;
		this.transport = transport;
		this.createConnection = createConnection;
		this[kEmitter2] = new EventTarget();
		this.mockCloseController = new AbortController();
		this.realCloseController = new AbortController();
		this.transport.addEventListener("outgoing", (event) => {
			if (typeof this.realWebSocket === "undefined") return;
			queueMicrotask(() => {
				if (!event.defaultPrevented) this[kSend](event.data);
			});
		});
		this.transport.addEventListener("incoming", this.handleIncomingMessage.bind(this));
	}
	/**
	* The `WebSocket` instance connected to the original server.
	* Accessing this before calling `server.connect()` will throw.
	*/
	get socket() {
		invariant$1(this.realWebSocket, "Cannot access \"socket\" on the original WebSocket server object: the connection is not open. Did you forget to call `server.connect()`?");
		return this.realWebSocket;
	}
	/**
	* Open connection to the original WebSocket server.
	*/
	connect() {
		invariant$1(!this.realWebSocket || this.realWebSocket.readyState !== WebSocket.OPEN, "Failed to call \"connect()\" on the original WebSocket instance: the connection already open");
		const realWebSocket = this.createConnection();
		realWebSocket.binaryType = this.client.binaryType;
		realWebSocket.addEventListener("open", (event) => {
			this[kEmitter2].dispatchEvent(bindEvent(this.realWebSocket, new Event("open", event)));
		}, { once: true });
		realWebSocket.addEventListener("message", (event) => {
			this.transport.dispatchEvent(bindEvent(this.realWebSocket, new MessageEvent("incoming", {
				data: event.data,
				origin: event.origin
			})));
		});
		this.client.addEventListener("close", (event) => {
			this.handleMockClose(event);
		}, { signal: this.mockCloseController.signal });
		realWebSocket.addEventListener("close", (event) => {
			this.handleRealClose(event);
		}, { signal: this.realCloseController.signal });
		realWebSocket.addEventListener("error", () => {
			const errorEvent = bindEvent(realWebSocket, new Event("error", { cancelable: true }));
			this[kEmitter2].dispatchEvent(errorEvent);
			if (!errorEvent.defaultPrevented) this.client.dispatchEvent(bindEvent(this.client, new Event("error")));
		});
		this.realWebSocket = realWebSocket;
	}
	/**
	* Listen for the incoming events from the original WebSocket server.
	*/
	addEventListener(event, listener, options) {
		if (!Reflect.has(listener, kBoundListener2)) {
			const boundListener = listener.bind(this.client);
			Object.defineProperty(listener, kBoundListener2, {
				value: boundListener,
				enumerable: false
			});
		}
		this[kEmitter2].addEventListener(event, Reflect.get(listener, kBoundListener2), options);
	}
	/**
	* Remove the listener for the given event.
	*/
	removeEventListener(event, listener, options) {
		this[kEmitter2].removeEventListener(event, Reflect.get(listener, kBoundListener2), options);
	}
	/**
	* Send data to the original WebSocket server.
	* @example
	* server.send('hello')
	* server.send(new Blob(['hello']))
	* server.send(new TextEncoder().encode('hello'))
	*/
	send(data) {
		this[kSend](data);
	}
	[kSend](data) {
		const { realWebSocket } = this;
		invariant$1(realWebSocket, "Failed to call \"server.send()\" for \"%s\": the connection is not open. Did you forget to call \"server.connect()\"?", this.client.url);
		if (realWebSocket.readyState === WebSocket.CLOSING || realWebSocket.readyState === WebSocket.CLOSED) return;
		if (realWebSocket.readyState === WebSocket.CONNECTING) {
			realWebSocket.addEventListener("open", () => {
				realWebSocket.send(data);
			}, { once: true });
			return;
		}
		realWebSocket.send(data);
	}
	/**
	* Close the actual server connection.
	*/
	close() {
		const { realWebSocket } = this;
		invariant$1(realWebSocket, "Failed to close server connection for \"%s\": the connection is not open. Did you forget to call \"server.connect()\"?", this.client.url);
		this.realCloseController.abort();
		if (realWebSocket.readyState === WebSocket.CLOSING || realWebSocket.readyState === WebSocket.CLOSED) return;
		realWebSocket.close();
		queueMicrotask(() => {
			this[kEmitter2].dispatchEvent(bindEvent(this.realWebSocket, new CancelableCloseEvent("close", {
				code: 1e3,
				cancelable: true
			})));
		});
	}
	handleIncomingMessage(event) {
		const messageEvent = bindEvent(event.target, new CancelableMessageEvent("message", {
			data: event.data,
			origin: event.origin,
			cancelable: true
		}));
		this[kEmitter2].dispatchEvent(messageEvent);
		if (!messageEvent.defaultPrevented) this.client.dispatchEvent(bindEvent(
			/**
			* @note Bind the forwarded original server events
			* to the mock WebSocket instance so it would
			* dispatch them straight away.
			*/
			this.client,
			new MessageEvent("message", {
				data: event.data,
				origin: event.origin
			})
		));
	}
	handleMockClose(_event) {
		if (this.realWebSocket) this.realWebSocket.close();
	}
	handleRealClose(event) {
		this.mockCloseController.abort();
		const closeEvent = bindEvent(this.realWebSocket, new CancelableCloseEvent("close", {
			code: event.code,
			reason: event.reason,
			wasClean: event.wasClean,
			cancelable: true
		}));
		this[kEmitter2].dispatchEvent(closeEvent);
		if (!closeEvent.defaultPrevented) this.client[kClose](event.code, event.reason);
	}
};
var WebSocketClassTransport = class extends EventTarget {
	constructor(socket) {
		super();
		this.socket = socket;
		this.socket.addEventListener("close", (event) => {
			this.dispatchEvent(bindEvent(this.socket, new CloseEvent("close", event)));
		});
		this.socket[kOnSend] = (data) => {
			this.dispatchEvent(bindEvent(this.socket, new CancelableMessageEvent("outgoing", {
				data,
				origin: this.socket.url,
				cancelable: true
			})));
		};
	}
	addEventListener(type, callback, options) {
		return super.addEventListener(type, callback, options);
	}
	dispatchEvent(event) {
		return super.dispatchEvent(event);
	}
	send(data) {
		queueMicrotask(() => {
			if (this.socket.readyState === this.socket.CLOSING || this.socket.readyState === this.socket.CLOSED) return;
			const dispatchEvent = () => {
				this.socket.dispatchEvent(bindEvent(
					/**
					* @note Setting this event's "target" to the
					* WebSocket override instance is important.
					* This way it can tell apart original incoming events
					* (must be forwarded to the transport) from the
					* mocked message events like the one below
					* (must be dispatched on the client instance).
					*/
					this.socket,
					new MessageEvent("message", {
						data,
						origin: this.socket.url
					})
				));
			};
			if (this.socket.readyState === this.socket.CONNECTING) this.socket.addEventListener("open", () => {
				dispatchEvent();
			}, { once: true });
			else dispatchEvent();
		});
	}
	close(code, reason) {
		this.socket[kClose](code, reason);
	}
};
var _WebSocketInterceptor = class extends Interceptor$1 {
	constructor() {
		super(_WebSocketInterceptor.symbol);
	}
	checkEnvironment() {
		return hasConfigurableGlobal$1("WebSocket");
	}
	setup() {
		const originalWebSocketDescriptor = Object.getOwnPropertyDescriptor(globalThis, "WebSocket");
		const WebSocketProxy = new Proxy(globalThis.WebSocket, { construct: (target, args, newTarget) => {
			const [url, protocols] = args;
			const createConnection = () => {
				return Reflect.construct(target, args, newTarget);
			};
			const socket = new WebSocketOverride(url, protocols);
			const transport = new WebSocketClassTransport(socket);
			queueMicrotask(() => {
				try {
					const server = new WebSocketServerConnection(socket, transport, createConnection);
					const hasConnectionListeners = this.emitter.emit("connection", {
						client: new WebSocketClientConnection(socket, transport),
						server,
						info: { protocols }
					});
					if (hasConnectionListeners) socket[kPassthroughPromise].resolve(false);
					else {
						socket[kPassthroughPromise].resolve(true);
						server.connect();
						server.addEventListener("open", () => {
							socket.dispatchEvent(bindEvent(socket, new Event("open")));
							if (server["realWebSocket"]) socket.protocol = server["realWebSocket"].protocol;
						});
					}
				} catch (error$3) {
					if (error$3 instanceof Error) {
						socket.dispatchEvent(new Event("error"));
						if (socket.readyState !== WebSocket.CLOSING && socket.readyState !== WebSocket.CLOSED) socket[kClose](1011, error$3.message, false);
						console.error(error$3);
					}
				}
			});
			return socket;
		} });
		Object.defineProperty(globalThis, "WebSocket", {
			value: WebSocketProxy,
			configurable: true
		});
		this.subscriptions.push(() => {
			Object.defineProperty(globalThis, "WebSocket", originalWebSocketDescriptor);
		});
	}
};
var WebSocketInterceptor = _WebSocketInterceptor;
WebSocketInterceptor.symbol = Symbol("websocket");
const webSocketInterceptor = new WebSocketInterceptor();
function handleWebSocketEvent(options) {
	webSocketInterceptor.on("connection", async (connection) => {
		const handlers$1 = options.getHandlers().filter(isHandlerKind("EventHandler"));
		if (handlers$1.length > 0) {
			options === null || options === void 0 || options.onMockedConnection(connection);
			await Promise.all(handlers$1.map((handler) => {
				return handler.run(connection);
			}));
			return;
		}
		const request = new Request(connection.client.url, { headers: {
			upgrade: "websocket",
			connection: "upgrade"
		} });
		await onUnhandledRequest(request, options.getUnhandledRequestStrategy()).catch((error$3) => {
			const errorEvent = new Event("error");
			Object.defineProperty(errorEvent, "cause", {
				enumerable: true,
				configurable: false,
				value: error$3
			});
			connection.client.socket.dispatchEvent(errorEvent);
		});
		options === null || options === void 0 || options.onPassthroughConnection(connection);
		connection.server.connect();
	});
}
function getTimestamp(options) {
	const now = /* @__PURE__ */ new Date();
	const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
	if (options === null || options === void 0 ? void 0 : options.milliseconds) return `${timestamp}.${now.getMilliseconds().toString().padStart(3, "0")}`;
	return timestamp;
}
function getMessageLength(data) {
	if (data instanceof Blob) return data.size;
	if (data instanceof ArrayBuffer) return data.byteLength;
	return new Blob([data]).size;
}
const MAX_LENGTH = 24;
function truncateMessage(message$2) {
	if (message$2.length <= MAX_LENGTH) return message$2;
	return `${message$2.slice(0, MAX_LENGTH)}\u2026`;
}
async function getPublicData(data) {
	if (data instanceof Blob) {
		const text = await data.text();
		return `Blob(${truncateMessage(text)})`;
	}
	if (typeof data === "object" && "byteLength" in data) {
		const text = new TextDecoder().decode(data);
		return `ArrayBuffer(${truncateMessage(text)})`;
	}
	return truncateMessage(data);
}
const colors = {
	system: "#3b82f6",
	outgoing: "#22c55e",
	incoming: "#ef4444",
	mocked: "#ff6a33"
};
function attachWebSocketLogger(connection) {
	const { client, server } = connection;
	logConnectionOpen(client);
	client.addEventListener("message", (event) => {
		logOutgoingClientMessage(event);
	});
	client.addEventListener("close", (event) => {
		logConnectionClose(event);
	});
	client.socket.addEventListener("error", (event) => {
		logClientError(event);
	});
	client.send = new Proxy(client.send, { apply(target, thisArg, args) {
		const [data] = args;
		const messageEvent = new MessageEvent("message", { data });
		Object.defineProperties(messageEvent, {
			currentTarget: {
				enumerable: true,
				writable: false,
				value: client.socket
			},
			target: {
				enumerable: true,
				writable: false,
				value: client.socket
			}
		});
		queueMicrotask(() => {
			logIncomingMockedClientMessage(messageEvent);
		});
		return Reflect.apply(target, thisArg, args);
	} });
	server.addEventListener("open", () => {
		server.addEventListener("message", (event) => {
			logIncomingServerMessage(event);
		});
	}, { once: true });
	server.send = new Proxy(server.send, { apply(target, thisArg, args) {
		const [data] = args;
		const messageEvent = new MessageEvent("message", { data });
		Object.defineProperties(messageEvent, {
			currentTarget: {
				enumerable: true,
				writable: false,
				value: server.socket
			},
			target: {
				enumerable: true,
				writable: false,
				value: server.socket
			}
		});
		logOutgoingMockedClientMessage(messageEvent);
		return Reflect.apply(target, thisArg, args);
	} });
}
function logConnectionOpen(client) {
	const publicUrl = toPublicUrl(client.url);
	console.groupCollapsed(devUtils.formatMessage(`${getTimestamp()} %c\u25B6%c ${publicUrl}`), `color:${colors.system}`, "color:inherit");
	console.log("Client:", client.socket);
	console.groupEnd();
}
function logConnectionClose(event) {
	const target = event.target;
	const publicUrl = toPublicUrl(target.url);
	console.groupCollapsed(devUtils.formatMessage(`${getTimestamp({ milliseconds: true })} %c\u25A0%c ${publicUrl}`), `color:${colors.system}`, "color:inherit");
	console.log(event);
	console.groupEnd();
}
function logClientError(event) {
	const socket = event.target;
	const publicUrl = toPublicUrl(socket.url);
	console.groupCollapsed(devUtils.formatMessage(`${getTimestamp({ milliseconds: true })} %c\xD7%c ${publicUrl}`), `color:${colors.system}`, "color:inherit");
	console.log(event);
	console.groupEnd();
}
async function logOutgoingClientMessage(event) {
	const byteLength = getMessageLength(event.data);
	const publicData = await getPublicData(event.data);
	const arrow = event.defaultPrevented ? "⇡" : "⬆";
	console.groupCollapsed(devUtils.formatMessage(`${getTimestamp({ milliseconds: true })} %c${arrow}%c ${publicData} %c${byteLength}%c`), `color:${colors.outgoing}`, "color:inherit", "color:gray;font-weight:normal", "color:inherit;font-weight:inherit");
	console.log(event);
	console.groupEnd();
}
async function logOutgoingMockedClientMessage(event) {
	const byteLength = getMessageLength(event.data);
	const publicData = await getPublicData(event.data);
	console.groupCollapsed(devUtils.formatMessage(`${getTimestamp({ milliseconds: true })} %c\u2B06%c ${publicData} %c${byteLength}%c`), `color:${colors.mocked}`, "color:inherit", "color:gray;font-weight:normal", "color:inherit;font-weight:inherit");
	console.log(event);
	console.groupEnd();
}
async function logIncomingMockedClientMessage(event) {
	const byteLength = getMessageLength(event.data);
	const publicData = await getPublicData(event.data);
	console.groupCollapsed(devUtils.formatMessage(`${getTimestamp({ milliseconds: true })} %c\u2B07%c ${publicData} %c${byteLength}%c`), `color:${colors.mocked}`, "color:inherit", "color:gray;font-weight:normal", "color:inherit;font-weight:inherit");
	console.log(event);
	console.groupEnd();
}
async function logIncomingServerMessage(event) {
	const byteLength = getMessageLength(event.data);
	const publicData = await getPublicData(event.data);
	const arrow = event.defaultPrevented ? "⇣" : "⬇";
	console.groupCollapsed(devUtils.formatMessage(`${getTimestamp({ milliseconds: true })} %c${arrow}%c ${publicData} %c${byteLength}%c`), `color:${colors.incoming}`, "color:inherit", "color:gray;font-weight:normal", "color:inherit;font-weight:inherit");
	console.log(event);
	console.groupEnd();
}
var POSITIONALS_EXP = /(%?)(%([sdijo]))/g;
function serializePositional(positional, flag) {
	switch (flag) {
		case "s": return positional;
		case "d":
		case "i": return Number(positional);
		case "j": return JSON.stringify(positional);
		case "o": {
			if (typeof positional === "string") return positional;
			const json = JSON.stringify(positional);
			if (json === "{}" || json === "[]" || /^\[object .+?\]$/.test(json)) return positional;
			return json;
		}
	}
}
function format(message$2, ...positionals) {
	if (positionals.length === 0) return message$2;
	let positionalIndex = 0;
	let formattedMessage = message$2.replace(POSITIONALS_EXP, (match$1, isEscaped, _, flag) => {
		const positional = positionals[positionalIndex];
		const value = serializePositional(positional, flag);
		if (!isEscaped) {
			positionalIndex++;
			return value;
		}
		return match$1;
	});
	if (positionalIndex < positionals.length) formattedMessage += ` ${positionals.slice(positionalIndex).join(" ")}`;
	formattedMessage = formattedMessage.replace(/%{2,2}/g, "%");
	return formattedMessage;
}
var STACK_FRAMES_TO_IGNORE = 2;
function cleanErrorStack(error2) {
	if (!error2.stack) return;
	const nextStack = error2.stack.split("\n");
	nextStack.splice(1, STACK_FRAMES_TO_IGNORE);
	error2.stack = nextStack.join("\n");
}
var InvariantError = class extends Error {
	constructor(message$2, ...positionals) {
		super(message$2);
		this.message = message$2;
		this.name = "Invariant Violation";
		this.message = format(message$2, ...positionals);
		cleanErrorStack(this);
	}
};
var invariant = (predicate, message$2, ...positionals) => {
	if (!predicate) throw new InvariantError(message$2, ...positionals);
};
invariant.as = (ErrorConstructor, predicate, message$2, ...positionals) => {
	if (!predicate) {
		const formatMessage$1 = positionals.length === 0 ? message$2 : format(message$2, ...positionals);
		let error2;
		try {
			error2 = Reflect.construct(ErrorConstructor, [formatMessage$1]);
		} catch (err) {
			error2 = ErrorConstructor(formatMessage$1);
		}
		throw error2;
	}
};
function isNodeProcess() {
	if (typeof navigator !== "undefined" && navigator.product === "ReactNative") return true;
	if (typeof process !== "undefined") {
		const type = process.type;
		if (type === "renderer" || type === "worker") return false;
		return !!(process.versions && process.versions.node);
	}
	return false;
}
var until = async (promise) => {
	try {
		const data = await promise().catch((error2) => {
			throw error2;
		});
		return {
			error: null,
			data
		};
	} catch (error2) {
		return {
			error: error2,
			data: null
		};
	}
};
function getAbsoluteWorkerUrl(workerUrl) {
	return new URL(workerUrl, location.href).href;
}
function getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker) {
	const allStates = [
		registration.active,
		registration.installing,
		registration.waiting
	];
	const relevantStates = allStates.filter((state) => {
		return state != null;
	});
	const worker$1 = relevantStates.find((worker2) => {
		return findWorker(worker2.scriptURL, absoluteWorkerUrl);
	});
	return worker$1 || null;
}
var getWorkerInstance = async (url, options = {}, findWorker) => {
	const absoluteWorkerUrl = getAbsoluteWorkerUrl(url);
	const mockRegistrations = await navigator.serviceWorker.getRegistrations().then((registrations) => registrations.filter((registration) => getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker)));
	if (!navigator.serviceWorker.controller && mockRegistrations.length > 0) location.reload();
	const [existingRegistration] = mockRegistrations;
	if (existingRegistration) {
		existingRegistration.update();
		return [getWorkerByRegistration(existingRegistration, absoluteWorkerUrl, findWorker), existingRegistration];
	}
	const registrationResult = await until(async () => {
		const registration = await navigator.serviceWorker.register(url, options);
		return [getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker), registration];
	});
	if (registrationResult.error) {
		const isWorkerMissing = registrationResult.error.message.includes("(404)");
		if (isWorkerMissing) {
			const scopeUrl = new URL((options === null || options === void 0 ? void 0 : options.scope) || "/", location.href);
			throw new Error(devUtils.formatMessage(`Failed to register a Service Worker for scope ('${scopeUrl.href}') with script ('${absoluteWorkerUrl}'): Service Worker script does not exist at the given path.

Did you forget to run "npx msw init <PUBLIC_DIR>"?

Learn more about creating the Service Worker script: https://mswjs.io/docs/cli/init`));
		}
		throw new Error(devUtils.formatMessage("Failed to register the Service Worker:\n\n%s", registrationResult.error.message));
	}
	return registrationResult.data;
};
function printStartMessage(args = {}) {
	if (args.quiet) return;
	const message$2 = args.message || "Mocking enabled.";
	console.groupCollapsed(`%c${devUtils.formatMessage(message$2)}`, "color:orangered;font-weight:bold;");
	console.log("%cDocumentation: %chttps://mswjs.io/docs", "font-weight:bold", "font-weight:normal");
	console.log("Found an issue? https://github.com/mswjs/msw/issues");
	if (args.workerUrl) console.log("Worker script URL:", args.workerUrl);
	if (args.workerScope) console.log("Worker scope:", args.workerScope);
	if (args.client) console.log("Client ID: %s (%s)", args.client.id, args.client.frameType);
	console.groupEnd();
}
async function enableMocking(context, options) {
	var _context$registration, _context$worker;
	context.workerChannel.send("MOCK_ACTIVATE");
	const { payload } = await context.events.once("MOCKING_ENABLED");
	if (context.isMockingEnabled) {
		devUtils.warn(`Found a redundant "worker.start()" call. Note that starting the worker while mocking is already enabled will have no effect. Consider removing this "worker.start()" call.`);
		return;
	}
	context.isMockingEnabled = true;
	printStartMessage({
		quiet: options.quiet,
		workerScope: (_context$registration = context.registration) === null || _context$registration === void 0 ? void 0 : _context$registration.scope,
		workerUrl: (_context$worker = context.worker) === null || _context$worker === void 0 ? void 0 : _context$worker.scriptURL,
		client: payload.client
	});
}
var WorkerChannel = class {
	constructor(port) {
		this.port = port;
	}
	postMessage(event, ...rest) {
		const [data, transfer] = rest;
		this.port.postMessage({
			type: event,
			data
		}, { transfer });
	}
};
function pruneGetRequestBody(request) {
	if (["HEAD", "GET"].includes(request.method)) return void 0;
	return request.body;
}
function deserializeRequest(serializedRequest) {
	return new Request(serializedRequest.url, {
		...serializedRequest,
		body: pruneGetRequestBody(serializedRequest)
	});
}
var createRequestListener = (context, options) => {
	return async (event, message$2) => {
		const messageChannel = new WorkerChannel(event.ports[0]);
		const requestId = message$2.payload.id;
		const request = deserializeRequest(message$2.payload);
		const requestCloneForLogs = request.clone();
		const requestClone = request.clone();
		RequestHandler.cache.set(request, requestClone);
		try {
			await handleRequest(request, requestId, context.getRequestHandlers().filter(isHandlerKind("RequestHandler")), options, context.emitter, {
				onPassthroughResponse() {
					messageChannel.postMessage("PASSTHROUGH");
				},
				async onMockedResponse(response, { handler, parsedResult }) {
					const responseClone = response.clone();
					const responseCloneForLogs = response.clone();
					const responseInit = toResponseInit(response);
					if (context.supports.readableStreamTransfer) {
						const responseStreamOrNull = response.body;
						messageChannel.postMessage("MOCK_RESPONSE", {
							...responseInit,
							body: responseStreamOrNull
						}, responseStreamOrNull ? [responseStreamOrNull] : void 0);
					} else {
						const responseBufferOrNull = response.body === null ? null : await responseClone.arrayBuffer();
						messageChannel.postMessage("MOCK_RESPONSE", {
							...responseInit,
							body: responseBufferOrNull
						});
					}
					if (!options.quiet) context.emitter.once("response:mocked", () => {
						handler.log({
							request: requestCloneForLogs,
							response: responseCloneForLogs,
							parsedResult
						});
					});
				}
			});
		} catch (error2) {
			if (error2 instanceof Error) {
				devUtils.error(`Uncaught exception in the request handler for "%s %s":

%s

This exception has been gracefully handled as a 500 response, however, it's strongly recommended to resolve this error, as it indicates a mistake in your code. If you wish to mock an error response, please see this guide: https://mswjs.io/docs/http/mocking-responses/error-responses`, request.method, request.url, error2.stack ?? error2);
				messageChannel.postMessage("MOCK_RESPONSE", {
					status: 500,
					statusText: "Request Handler Error",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: error2.name,
						message: error2.message,
						stack: error2.stack
					})
				});
			}
		}
	};
};
async function checkWorkerIntegrity(context) {
	context.workerChannel.send("INTEGRITY_CHECK_REQUEST");
	const { payload } = await context.events.once("INTEGRITY_CHECK_RESPONSE");
	if (payload.checksum !== "f5825c521429caf22a4dd13b66e243af") devUtils.warn(`The currently registered Service Worker has been generated by a different version of MSW (${payload.packageVersion}) and may not be fully compatible with the installed version.

It's recommended you update your worker script by running this command:

  \u2022 npx msw init <PUBLIC_DIR>

You can also automate this process and make the worker script update automatically upon the library installations. Read more: https://mswjs.io/docs/cli/init.`);
}
var encoder$1 = new TextEncoder();
function encodeBuffer(text) {
	return encoder$1.encode(text);
}
function decodeBuffer(buffer, encoding) {
	const decoder = new TextDecoder(encoding);
	return decoder.decode(buffer);
}
function toArrayBuffer(array) {
	return array.buffer.slice(array.byteOffset, array.byteOffset + array.byteLength);
}
var IS_PATCHED_MODULE$1 = Symbol("isPatchedModule");
function canParseUrl$1(url) {
	try {
		new URL(url);
		return true;
	} catch (_error) {
		return false;
	}
}
function getValueBySymbol$1(symbolName, source) {
	const ownSymbols = Object.getOwnPropertySymbols(source);
	const symbol = ownSymbols.find((symbol2) => {
		return symbol2.description === symbolName;
	});
	if (symbol) return Reflect.get(source, symbol);
	return;
}
var _FetchResponse$1 = class extends Response {
	static isConfigurableStatusCode(status) {
		return status >= 200 && status <= 599;
	}
	static isRedirectResponse(status) {
		return _FetchResponse$1.STATUS_CODES_WITH_REDIRECT.includes(status);
	}
	/**
	* Returns a boolean indicating whether the given response status
	* code represents a response that can have a body.
	*/
	static isResponseWithBody(status) {
		return !_FetchResponse$1.STATUS_CODES_WITHOUT_BODY.includes(status);
	}
	static setUrl(url, response) {
		if (!url || url === "about:" || !canParseUrl$1(url)) return;
		const state = getValueBySymbol$1("state", response);
		if (state) state.urlList.push(new URL(url));
		else Object.defineProperty(response, "url", {
			value: url,
			enumerable: true,
			configurable: true,
			writable: false
		});
	}
	/**
	* Parses the given raw HTTP headers into a Fetch API `Headers` instance.
	*/
	static parseRawHeaders(rawHeaders) {
		const headers = new Headers();
		for (let line = 0; line < rawHeaders.length; line += 2) headers.append(rawHeaders[line], rawHeaders[line + 1]);
		return headers;
	}
	constructor(body, init = {}) {
		var _a$1;
		const status = (_a$1 = init.status) != null ? _a$1 : 200;
		const safeStatus = _FetchResponse$1.isConfigurableStatusCode(status) ? status : 200;
		const finalBody = _FetchResponse$1.isResponseWithBody(status) ? body : null;
		super(finalBody, {
			status: safeStatus,
			statusText: init.statusText,
			headers: init.headers
		});
		if (status !== safeStatus) {
			const state = getValueBySymbol$1("state", this);
			if (state) state.status = status;
			else Object.defineProperty(this, "status", {
				value: status,
				enumerable: true,
				configurable: true,
				writable: false
			});
		}
		_FetchResponse$1.setUrl(init.url, this);
	}
};
var FetchResponse$1 = _FetchResponse$1;
FetchResponse$1.STATUS_CODES_WITHOUT_BODY = [
	101,
	103,
	204,
	205,
	304
];
FetchResponse$1.STATUS_CODES_WITH_REDIRECT = [
	301,
	302,
	303,
	307,
	308
];
var kRawRequest$1 = Symbol("kRawRequest");
function setRawRequest(request, rawRequest) {
	Reflect.set(request, kRawRequest$1, rawRequest);
}
var __defProp$1 = Object.defineProperty;
var __export = (target, all) => {
	for (var name in all) __defProp$1(target, name, {
		get: all[name],
		enumerable: true
	});
};
var colors_exports = {};
__export(colors_exports, {
	blue: () => blue,
	gray: () => gray,
	green: () => green,
	red: () => red,
	yellow: () => yellow
});
function yellow(text) {
	return `\x1B[33m${text}\x1B[0m`;
}
function blue(text) {
	return `\x1B[34m${text}\x1B[0m`;
}
function gray(text) {
	return `\x1B[90m${text}\x1B[0m`;
}
function red(text) {
	return `\x1B[31m${text}\x1B[0m`;
}
function green(text) {
	return `\x1B[32m${text}\x1B[0m`;
}
var IS_NODE = isNodeProcess();
var Logger = class {
	constructor(name) {
		babelHelpers.defineProperty(this, "prefix", void 0);
		this.name = name;
		this.prefix = `[${this.name}]`;
		const LOGGER_NAME = getVariable("DEBUG");
		const LOGGER_LEVEL = getVariable("LOG_LEVEL");
		const isLoggingEnabled = LOGGER_NAME === "1" || LOGGER_NAME === "true" || typeof LOGGER_NAME !== "undefined" && this.name.startsWith(LOGGER_NAME);
		if (isLoggingEnabled) {
			this.debug = isDefinedAndNotEquals(LOGGER_LEVEL, "debug") ? noop : this.debug;
			this.info = isDefinedAndNotEquals(LOGGER_LEVEL, "info") ? noop : this.info;
			this.success = isDefinedAndNotEquals(LOGGER_LEVEL, "success") ? noop : this.success;
			this.warning = isDefinedAndNotEquals(LOGGER_LEVEL, "warning") ? noop : this.warning;
			this.error = isDefinedAndNotEquals(LOGGER_LEVEL, "error") ? noop : this.error;
		} else {
			this.info = noop;
			this.success = noop;
			this.warning = noop;
			this.error = noop;
			this.only = noop;
		}
	}
	extend(domain) {
		return new Logger(`${this.name}:${domain}`);
	}
	/**
	* Print a debug message.
	* @example
	* logger.debug('no duplicates found, creating a document...')
	*/
	debug(message$2, ...positionals) {
		this.logEntry({
			level: "debug",
			message: gray(message$2),
			positionals,
			prefix: this.prefix,
			colors: { prefix: "gray" }
		});
	}
	/**
	* Print an info message.
	* @example
	* logger.info('start parsing...')
	*/
	info(message$2, ...positionals) {
		this.logEntry({
			level: "info",
			message: message$2,
			positionals,
			prefix: this.prefix,
			colors: { prefix: "blue" }
		});
		const performance2 = new PerformanceEntry();
		return (message2, ...positionals2) => {
			performance2.measure();
			this.logEntry({
				level: "info",
				message: `${message2} ${gray(`${performance2.deltaTime}ms`)}`,
				positionals: positionals2,
				prefix: this.prefix,
				colors: { prefix: "blue" }
			});
		};
	}
	/**
	* Print a success message.
	* @example
	* logger.success('successfully created document')
	*/
	success(message$2, ...positionals) {
		this.logEntry({
			level: "info",
			message: message$2,
			positionals,
			prefix: `\u2714 ${this.prefix}`,
			colors: {
				timestamp: "green",
				prefix: "green"
			}
		});
	}
	/**
	* Print a warning.
	* @example
	* logger.warning('found legacy document format')
	*/
	warning(message$2, ...positionals) {
		this.logEntry({
			level: "warning",
			message: message$2,
			positionals,
			prefix: `\u26A0 ${this.prefix}`,
			colors: {
				timestamp: "yellow",
				prefix: "yellow"
			}
		});
	}
	/**
	* Print an error message.
	* @example
	* logger.error('something went wrong')
	*/
	error(message$2, ...positionals) {
		this.logEntry({
			level: "error",
			message: message$2,
			positionals,
			prefix: `\u2716 ${this.prefix}`,
			colors: {
				timestamp: "red",
				prefix: "red"
			}
		});
	}
	/**
	* Execute the given callback only when the logging is enabled.
	* This is skipped in its entirety and has no runtime cost otherwise.
	* This executes regardless of the log level.
	* @example
	* logger.only(() => {
	*   logger.info('additional info')
	* })
	*/
	only(callback) {
		callback();
	}
	createEntry(level, message$2) {
		return {
			timestamp: /* @__PURE__ */ new Date(),
			level,
			message: message$2
		};
	}
	logEntry(args) {
		const { level, message: message$2, prefix, colors: customColors, positionals = [] } = args;
		const entry = this.createEntry(level, message$2);
		const timestampColor = (customColors === null || customColors === void 0 ? void 0 : customColors.timestamp) || "gray";
		const prefixColor = (customColors === null || customColors === void 0 ? void 0 : customColors.prefix) || "gray";
		const colorize = {
			timestamp: colors_exports[timestampColor],
			prefix: colors_exports[prefixColor]
		};
		const write = this.getWriter(level);
		write([colorize.timestamp(this.formatTimestamp(entry.timestamp))].concat(prefix != null ? colorize.prefix(prefix) : []).concat(serializeInput(message$2)).join(" "), ...positionals.map(serializeInput));
	}
	formatTimestamp(timestamp) {
		return `${timestamp.toLocaleTimeString("en-GB")}:${timestamp.getMilliseconds()}`;
	}
	getWriter(level) {
		switch (level) {
			case "debug":
			case "success":
			case "info": return log;
			case "warning": return warn;
			case "error": return error;
		}
	}
};
var PerformanceEntry = class {
	constructor() {
		babelHelpers.defineProperty(this, "startTime", void 0);
		babelHelpers.defineProperty(this, "endTime", void 0);
		babelHelpers.defineProperty(this, "deltaTime", void 0);
		this.startTime = performance.now();
	}
	measure() {
		this.endTime = performance.now();
		const deltaTime = this.endTime - this.startTime;
		this.deltaTime = deltaTime.toFixed(2);
	}
};
var noop = () => void 0;
function log(message$2, ...positionals) {
	if (IS_NODE) {
		process.stdout.write(format(message$2, ...positionals) + "\n");
		return;
	}
	console.log(message$2, ...positionals);
}
function warn(message$2, ...positionals) {
	if (IS_NODE) {
		process.stderr.write(format(message$2, ...positionals) + "\n");
		return;
	}
	console.warn(message$2, ...positionals);
}
function error(message$2, ...positionals) {
	if (IS_NODE) {
		process.stderr.write(format(message$2, ...positionals) + "\n");
		return;
	}
	console.error(message$2, ...positionals);
}
function getVariable(variableName) {
	var _globalThis$variableN2;
	if (IS_NODE) return {}[variableName];
	return (_globalThis$variableN2 = globalThis[variableName]) === null || _globalThis$variableN2 === void 0 ? void 0 : _globalThis$variableN2.toString();
}
function isDefinedAndNotEquals(value, expected) {
	return value !== void 0 && value !== expected;
}
function serializeInput(message$2) {
	if (typeof message$2 === "undefined") return "undefined";
	if (message$2 === null) return "null";
	if (typeof message$2 === "string") return message$2;
	if (typeof message$2 === "object") return JSON.stringify(message$2);
	return message$2.toString();
}
var MemoryLeakError = class extends Error {
	constructor(emitter, type, count) {
		super(`Possible EventEmitter memory leak detected. ${count} ${type.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`);
		this.emitter = emitter;
		this.type = type;
		this.count = count;
		this.name = "MaxListenersExceededWarning";
	}
};
var _Emitter = class {
	static listenerCount(emitter, eventName) {
		return emitter.listenerCount(eventName);
	}
	constructor() {
		this.events = /* @__PURE__ */ new Map();
		this.maxListeners = _Emitter.defaultMaxListeners;
		this.hasWarnedAboutPotentialMemoryLeak = false;
	}
	_emitInternalEvent(internalEventName, eventName, listener) {
		this.emit(internalEventName, ...[eventName, listener]);
	}
	_getListeners(eventName) {
		return Array.prototype.concat.apply([], this.events.get(eventName)) || [];
	}
	_removeListener(listeners, listener) {
		const index = listeners.indexOf(listener);
		if (index > -1) listeners.splice(index, 1);
		return [];
	}
	_wrapOnceListener(eventName, listener) {
		const onceListener = (...data) => {
			this.removeListener(eventName, onceListener);
			return listener.apply(this, data);
		};
		Object.defineProperty(onceListener, "name", { value: listener.name });
		return onceListener;
	}
	setMaxListeners(maxListeners) {
		this.maxListeners = maxListeners;
		return this;
	}
	/**
	* Returns the current max listener value for the `Emitter` which is
	* either set by `emitter.setMaxListeners(n)` or defaults to
	* `Emitter.defaultMaxListeners`.
	*/
	getMaxListeners() {
		return this.maxListeners;
	}
	/**
	* Returns an array listing the events for which the emitter has registered listeners.
	* The values in the array will be strings or Symbols.
	*/
	eventNames() {
		return Array.from(this.events.keys());
	}
	/**
	* Synchronously calls each of the listeners registered for the event named `eventName`,
	* in the order they were registered, passing the supplied arguments to each.
	* Returns `true` if the event has listeners, `false` otherwise.
	*
	* @example
	* const emitter = new Emitter<{ hello: [string] }>()
	* emitter.emit('hello', 'John')
	*/
	emit(eventName, ...data) {
		const listeners = this._getListeners(eventName);
		listeners.forEach((listener) => {
			listener.apply(this, data);
		});
		return listeners.length > 0;
	}
	addListener(eventName, listener) {
		this._emitInternalEvent("newListener", eventName, listener);
		const nextListeners = this._getListeners(eventName).concat(listener);
		this.events.set(eventName, nextListeners);
		if (this.maxListeners > 0 && this.listenerCount(eventName) > this.maxListeners && !this.hasWarnedAboutPotentialMemoryLeak) {
			this.hasWarnedAboutPotentialMemoryLeak = true;
			const memoryLeakWarning = new MemoryLeakError(this, eventName, this.listenerCount(eventName));
			console.warn(memoryLeakWarning);
		}
		return this;
	}
	on(eventName, listener) {
		return this.addListener(eventName, listener);
	}
	once(eventName, listener) {
		return this.addListener(eventName, this._wrapOnceListener(eventName, listener));
	}
	prependListener(eventName, listener) {
		const listeners = this._getListeners(eventName);
		if (listeners.length > 0) {
			const nextListeners = [listener].concat(listeners);
			this.events.set(eventName, nextListeners);
		} else this.events.set(eventName, listeners.concat(listener));
		return this;
	}
	prependOnceListener(eventName, listener) {
		return this.prependListener(eventName, this._wrapOnceListener(eventName, listener));
	}
	removeListener(eventName, listener) {
		const listeners = this._getListeners(eventName);
		if (listeners.length > 0) {
			this._removeListener(listeners, listener);
			this.events.set(eventName, listeners);
			this._emitInternalEvent("removeListener", eventName, listener);
		}
		return this;
	}
	/**
	* Alias for `emitter.removeListener()`.
	*
	* @example
	* emitter.off('hello', listener)
	*/
	off(eventName, listener) {
		return this.removeListener(eventName, listener);
	}
	removeAllListeners(eventName) {
		if (eventName) this.events.delete(eventName);
		else this.events.clear();
		return this;
	}
	/**
	* Returns a copy of the array of listeners for the event named `eventName`.
	*/
	listeners(eventName) {
		return Array.from(this._getListeners(eventName));
	}
	/**
	* Returns the number of listeners listening to the event named `eventName`.
	*/
	listenerCount(eventName) {
		return this._getListeners(eventName).length;
	}
	rawListeners(eventName) {
		return this.listeners(eventName);
	}
};
var Emitter = _Emitter;
Emitter.defaultMaxListeners = 10;
var INTERNAL_REQUEST_ID_HEADER_NAME = "x-interceptors-internal-request-id";
function getGlobalSymbol(symbol) {
	return globalThis[symbol] || void 0;
}
function setGlobalSymbol(symbol, value) {
	globalThis[symbol] = value;
}
function deleteGlobalSymbol(symbol) {
	delete globalThis[symbol];
}
var Interceptor = class {
	constructor(symbol) {
		this.symbol = symbol;
		this.readyState = "INACTIVE";
		this.emitter = new Emitter();
		this.subscriptions = [];
		this.logger = new Logger(symbol.description);
		this.emitter.setMaxListeners(0);
		this.logger.info("constructing the interceptor...");
	}
	/**
	* Determine if this interceptor can be applied
	* in the current environment.
	*/
	checkEnvironment() {
		return true;
	}
	/**
	* Apply this interceptor to the current process.
	* Returns an already running interceptor instance if it's present.
	*/
	apply() {
		const logger = this.logger.extend("apply");
		logger.info("applying the interceptor...");
		if (this.readyState === "APPLIED") {
			logger.info("intercepted already applied!");
			return;
		}
		const shouldApply = this.checkEnvironment();
		if (!shouldApply) {
			logger.info("the interceptor cannot be applied in this environment!");
			return;
		}
		this.readyState = "APPLYING";
		const runningInstance = this.getInstance();
		if (runningInstance) {
			logger.info("found a running instance, reusing...");
			this.on = (event, listener) => {
				logger.info("proxying the \"%s\" listener", event);
				runningInstance.emitter.addListener(event, listener);
				this.subscriptions.push(() => {
					runningInstance.emitter.removeListener(event, listener);
					logger.info("removed proxied \"%s\" listener!", event);
				});
				return this;
			};
			this.readyState = "APPLIED";
			return;
		}
		logger.info("no running instance found, setting up a new instance...");
		this.setup();
		this.setInstance();
		this.readyState = "APPLIED";
	}
	/**
	* Setup the module augments and stubs necessary for this interceptor.
	* This method is not run if there's a running interceptor instance
	* to prevent instantiating an interceptor multiple times.
	*/
	setup() {}
	/**
	* Listen to the interceptor's public events.
	*/
	on(event, listener) {
		const logger = this.logger.extend("on");
		if (this.readyState === "DISPOSING" || this.readyState === "DISPOSED") {
			logger.info("cannot listen to events, already disposed!");
			return this;
		}
		logger.info("adding \"%s\" event listener:", event, listener);
		this.emitter.on(event, listener);
		return this;
	}
	once(event, listener) {
		this.emitter.once(event, listener);
		return this;
	}
	off(event, listener) {
		this.emitter.off(event, listener);
		return this;
	}
	removeAllListeners(event) {
		this.emitter.removeAllListeners(event);
		return this;
	}
	/**
	* Disposes of any side-effects this interceptor has introduced.
	*/
	dispose() {
		const logger = this.logger.extend("dispose");
		if (this.readyState === "DISPOSED") {
			logger.info("cannot dispose, already disposed!");
			return;
		}
		logger.info("disposing the interceptor...");
		this.readyState = "DISPOSING";
		if (!this.getInstance()) {
			logger.info("no interceptors running, skipping dispose...");
			return;
		}
		this.clearInstance();
		logger.info("global symbol deleted:", getGlobalSymbol(this.symbol));
		if (this.subscriptions.length > 0) {
			logger.info("disposing of %d subscriptions...", this.subscriptions.length);
			for (const dispose of this.subscriptions) dispose();
			this.subscriptions = [];
			logger.info("disposed of all subscriptions!", this.subscriptions.length);
		}
		this.emitter.removeAllListeners();
		logger.info("destroyed the listener!");
		this.readyState = "DISPOSED";
	}
	getInstance() {
		var _a$1;
		const instance = getGlobalSymbol(this.symbol);
		this.logger.info("retrieved global instance:", (_a$1 = instance == null ? void 0 : instance.constructor) == null ? void 0 : _a$1.name);
		return instance;
	}
	setInstance() {
		setGlobalSymbol(this.symbol, this);
		this.logger.info("set global instance!", this.symbol.description);
	}
	clearInstance() {
		deleteGlobalSymbol(this.symbol);
		this.logger.info("cleared global instance!", this.symbol.description);
	}
};
function createRequestId() {
	return Math.random().toString(16).slice(2);
}
var BatchInterceptor = class extends Interceptor {
	constructor(options) {
		BatchInterceptor.symbol = Symbol(options.name);
		super(BatchInterceptor.symbol);
		this.interceptors = options.interceptors;
	}
	setup() {
		const logger = this.logger.extend("setup");
		logger.info("applying all %d interceptors...", this.interceptors.length);
		for (const interceptor of this.interceptors) {
			logger.info("applying \"%s\" interceptor...", interceptor.constructor.name);
			interceptor.apply();
			logger.info("adding interceptor dispose subscription");
			this.subscriptions.push(() => interceptor.dispose());
		}
	}
	on(event, listener) {
		for (const interceptor of this.interceptors) interceptor.on(event, listener);
		return this;
	}
	once(event, listener) {
		for (const interceptor of this.interceptors) interceptor.once(event, listener);
		return this;
	}
	off(event, listener) {
		for (const interceptor of this.interceptors) interceptor.off(event, listener);
		return this;
	}
	removeAllListeners(event) {
		for (const interceptors of this.interceptors) interceptors.removeAllListeners(event);
		return this;
	}
};
function createResponseListener(context) {
	return (_, message$2) => {
		var _responseJson$respons;
		const { payload: responseJson } = message$2;
		const request = deserializeRequest(responseJson.request);
		if ((_responseJson$respons = responseJson.response.type) === null || _responseJson$respons === void 0 ? void 0 : _responseJson$respons.includes("opaque")) return;
		const response = responseJson.response.status === 0 ? Response.error() : new FetchResponse$1(
			/**
			* Responses may be streams here, but when we create a response object
			* with null-body status codes, like 204, 205, 304 Response will
			* throw when passed a non-null body, so ensure it's null here
			* for those codes
			*/
			FetchResponse$1.isResponseWithBody(responseJson.response.status) ? responseJson.response.body : null,
			{
				...responseJson,
				url: request.url
			}
		);
		context.emitter.emit(responseJson.isMockedResponse ? "response:mocked" : "response:bypass", {
			requestId: responseJson.request.id,
			request,
			response
		});
	};
}
function validateWorkerScope(registration, options) {
	if (!(options === null || options === void 0 ? void 0 : options.quiet) && !location.href.startsWith(registration.scope)) devUtils.warn(`Cannot intercept requests on this page because it's outside of the worker's scope ("${registration.scope}"). If you wish to mock API requests on this page, you must resolve this scope issue.

- (Recommended) Register the worker at the root level ("/") of your application.
- Set the "Service-Worker-Allowed" response header to allow out-of-scope workers.`);
}
var createStartHandler = (context) => {
	return function start(options, customOptions) {
		const startWorkerInstance = async () => {
			context.events.removeAllListeners();
			context.workerChannel.on("REQUEST", createRequestListener(context, options));
			context.workerChannel.on("RESPONSE", createResponseListener(context));
			const instance = await getWorkerInstance(options.serviceWorker.url, options.serviceWorker.options, options.findWorker);
			const [worker$1, registration] = instance;
			if (!worker$1) {
				const missingWorkerMessage = (customOptions === null || customOptions === void 0 ? void 0 : customOptions.findWorker) ? devUtils.formatMessage(`Failed to locate the Service Worker registration using a custom "findWorker" predicate.

Please ensure that the custom predicate properly locates the Service Worker registration at "%s".
More details: https://mswjs.io/docs/api/setup-worker/start#findworker
`, options.serviceWorker.url) : devUtils.formatMessage(`Failed to locate the Service Worker registration.

This most likely means that the worker script URL "%s" cannot resolve against the actual public hostname (%s). This may happen if your application runs behind a proxy, or has a dynamic hostname.

Please consider using a custom "serviceWorker.url" option to point to the actual worker script location, or a custom "findWorker" option to resolve the Service Worker registration manually. More details: https://mswjs.io/docs/api/setup-worker/start`, options.serviceWorker.url, location.host);
				throw new Error(missingWorkerMessage);
			}
			context.worker = worker$1;
			context.registration = registration;
			context.events.addListener(window, "beforeunload", () => {
				if (worker$1.state !== "redundant") context.workerChannel.send("CLIENT_CLOSED");
				window.clearInterval(context.keepAliveInterval);
				window.postMessage({ type: "msw/worker:stop" });
			});
			await checkWorkerIntegrity(context).catch((error2) => {
				devUtils.error("Error while checking the worker script integrity. Please report this on GitHub (https://github.com/mswjs/msw/issues), including the original error below.");
				console.error(error2);
			});
			context.keepAliveInterval = window.setInterval(() => context.workerChannel.send("KEEPALIVE_REQUEST"), 5e3);
			validateWorkerScope(registration, context.startOptions);
			return registration;
		};
		const workerRegistration = startWorkerInstance().then(async (registration) => {
			const pendingInstance = registration.installing || registration.waiting;
			if (pendingInstance) await new Promise((resolve) => {
				pendingInstance.addEventListener("statechange", () => {
					if (pendingInstance.state === "activated") return resolve();
				});
			});
			await enableMocking(context, options).catch((error2) => {
				throw new Error(`Failed to enable mocking: ${error2 === null || error2 === void 0 ? void 0 : error2.message}`);
			});
			return registration;
		});
		return workerRegistration;
	};
};
function printStopMessage(args = {}) {
	if (args.quiet) return;
	console.log(`%c${devUtils.formatMessage("Mocking disabled.")}`, "color:orangered;font-weight:bold;");
}
var createStop = (context) => {
	return function stop() {
		var _context$startOptions;
		if (!context.isMockingEnabled) {
			devUtils.warn("Found a redundant \"worker.stop()\" call. Note that stopping the worker while mocking already stopped has no effect. Consider removing this \"worker.stop()\" call.");
			return;
		}
		context.workerChannel.send("MOCK_DEACTIVATE");
		context.isMockingEnabled = false;
		window.clearInterval(context.keepAliveInterval);
		window.postMessage({ type: "msw/worker:stop" });
		printStopMessage({ quiet: (_context$startOptions = context.startOptions) === null || _context$startOptions === void 0 ? void 0 : _context$startOptions.quiet });
	};
};
var DEFAULT_START_OPTIONS = {
	serviceWorker: {
		url: "/mockServiceWorker.js",
		options: null
	},
	quiet: false,
	waitUntilReady: true,
	onUnhandledRequest: "warn",
	findWorker(scriptURL, mockServiceWorkerUrl) {
		return scriptURL === mockServiceWorkerUrl;
	}
};
function createDeferredExecutor() {
	const executor = (resolve, reject) => {
		executor.state = "pending";
		executor.resolve = (data) => {
			if (executor.state !== "pending") return;
			executor.result = data;
			const onFulfilled = (value) => {
				executor.state = "fulfilled";
				return value;
			};
			return resolve(data instanceof Promise ? data : Promise.resolve(data).then(onFulfilled));
		};
		executor.reject = (reason) => {
			if (executor.state !== "pending") return;
			queueMicrotask(() => {
				executor.state = "rejected";
			});
			return reject(executor.rejectionReason = reason);
		};
	};
	return executor;
}
var DeferredPromise = (_executor2 = /* @__PURE__ */ new WeakMap(), _Class_brand2 = /* @__PURE__ */ new WeakSet(), class extends Promise {
	constructor(executor = null) {
		const deferredExecutor = createDeferredExecutor();
		super((originalResolve, originalReject) => {
			deferredExecutor(originalResolve, originalReject);
			executor === null || executor === void 0 || executor(deferredExecutor.resolve, deferredExecutor.reject);
		});
		babelHelpers.classPrivateMethodInitSpec(this, _Class_brand2);
		babelHelpers.classPrivateFieldInitSpec(this, _executor2, void 0);
		babelHelpers.defineProperty(this, "resolve", void 0);
		babelHelpers.defineProperty(this, "reject", void 0);
		babelHelpers.classPrivateFieldSet2(_executor2, this, deferredExecutor);
		this.resolve = babelHelpers.classPrivateFieldGet2(_executor2, this).resolve;
		this.reject = babelHelpers.classPrivateFieldGet2(_executor2, this).reject;
	}
	get state() {
		return babelHelpers.classPrivateFieldGet2(_executor2, this).state;
	}
	get rejectionReason() {
		return babelHelpers.classPrivateFieldGet2(_executor2, this).rejectionReason;
	}
	then(onFulfilled, onRejected) {
		return babelHelpers.assertClassBrand(_Class_brand2, this, _decorate2).call(this, super.then(onFulfilled, onRejected));
	}
	catch(onRejected) {
		return babelHelpers.assertClassBrand(_Class_brand2, this, _decorate2).call(this, super.catch(onRejected));
	}
	finally(onfinally) {
		return babelHelpers.assertClassBrand(_Class_brand2, this, _decorate2).call(this, super.finally(onfinally));
	}
});
function _decorate2(promise) {
	return Object.defineProperties(promise, {
		resolve: {
			configurable: true,
			value: this.resolve
		},
		reject: {
			configurable: true,
			value: this.reject
		}
	});
}
var InterceptorError = class extends Error {
	constructor(message$2) {
		super(message$2);
		this.name = "InterceptorError";
		Object.setPrototypeOf(this, InterceptorError.prototype);
	}
};
var kRequestHandled = Symbol("kRequestHandled");
var kResponsePromise = Symbol("kResponsePromise");
var RequestController = class {
	constructor(request) {
		this.request = request;
		this[kRequestHandled] = false;
		this[kResponsePromise] = new DeferredPromise();
	}
	/**
	* Respond to this request with the given `Response` instance.
	* @example
	* controller.respondWith(new Response())
	* controller.respondWith(Response.json({ id }))
	* controller.respondWith(Response.error())
	*/
	respondWith(response) {
		invariant.as(InterceptorError, !this[kRequestHandled], "Failed to respond to the \"%s %s\" request: the \"request\" event has already been handled.", this.request.method, this.request.url);
		this[kRequestHandled] = true;
		this[kResponsePromise].resolve(response);
	}
	/**
	* Error this request with the given reason.
	*
	* @example
	* controller.errorWith()
	* controller.errorWith(new Error('Oops!'))
	* controller.errorWith({ message: 'Oops!'})
	*/
	errorWith(reason) {
		invariant.as(InterceptorError, !this[kRequestHandled], "Failed to error the \"%s %s\" request: the \"request\" event has already been handled.", this.request.method, this.request.url);
		this[kRequestHandled] = true;
		this[kResponsePromise].resolve(reason);
	}
};
async function emitAsync(emitter, eventName, ...data) {
	const listners = emitter.listeners(eventName);
	if (listners.length === 0) return;
	for (const listener of listners) await listener.apply(emitter, data);
}
function isObject(value, loose = false) {
	return loose ? Object.prototype.toString.call(value).startsWith("[object ") : Object.prototype.toString.call(value) === "[object Object]";
}
function isPropertyAccessible(obj, key) {
	try {
		obj[key];
		return true;
	} catch (e) {
		return false;
	}
}
function createServerErrorResponse(body) {
	return new Response(JSON.stringify(body instanceof Error ? {
		name: body.name,
		message: body.message,
		stack: body.stack
	} : body), {
		status: 500,
		statusText: "Unhandled Exception",
		headers: { "Content-Type": "application/json" }
	});
}
function isResponseError(response) {
	return response != null && response instanceof Response && isPropertyAccessible(response, "type") && response.type === "error";
}
function isResponseLike(value) {
	return isObject(value, true) && isPropertyAccessible(value, "status") && isPropertyAccessible(value, "statusText") && isPropertyAccessible(value, "bodyUsed");
}
function isNodeLikeError(error2) {
	if (error2 == null) return false;
	if (!(error2 instanceof Error)) return false;
	return "code" in error2 && "errno" in error2;
}
async function handleRequest2(options) {
	const handleResponse = async (response) => {
		if (response instanceof Error) {
			options.onError(response);
			return true;
		}
		if (isResponseError(response)) {
			options.onRequestError(response);
			return true;
		}
		if (isResponseLike(response)) {
			await options.onResponse(response);
			return true;
		}
		if (isObject(response)) {
			options.onError(response);
			return true;
		}
		return false;
	};
	const handleResponseError = async (error2) => {
		if (error2 instanceof InterceptorError) throw result.error;
		if (isNodeLikeError(error2)) {
			options.onError(error2);
			return true;
		}
		if (error2 instanceof Response) return await handleResponse(error2);
		return false;
	};
	options.emitter.once("request", ({ requestId: pendingRequestId }) => {
		if (pendingRequestId !== options.requestId) return;
		if (options.controller[kResponsePromise].state === "pending") options.controller[kResponsePromise].resolve(void 0);
	});
	const requestAbortPromise = new DeferredPromise();
	if (options.request.signal) if (options.request.signal.aborted) requestAbortPromise.reject(options.request.signal.reason);
	else options.request.signal.addEventListener("abort", () => {
		requestAbortPromise.reject(options.request.signal.reason);
	}, { once: true });
	const result = await until(async () => {
		const requestListenersPromise = emitAsync(options.emitter, "request", {
			requestId: options.requestId,
			request: options.request,
			controller: options.controller
		});
		await Promise.race([
			requestAbortPromise,
			requestListenersPromise,
			options.controller[kResponsePromise]
		]);
		return await options.controller[kResponsePromise];
	});
	if (requestAbortPromise.state === "rejected") {
		options.onError(requestAbortPromise.rejectionReason);
		return true;
	}
	if (result.error) {
		if (await handleResponseError(result.error)) return true;
		if (options.emitter.listenerCount("unhandledException") > 0) {
			const unhandledExceptionController = new RequestController(options.request);
			await emitAsync(options.emitter, "unhandledException", {
				error: result.error,
				request: options.request,
				requestId: options.requestId,
				controller: unhandledExceptionController
			}).then(() => {
				if (unhandledExceptionController[kResponsePromise].state === "pending") unhandledExceptionController[kResponsePromise].resolve(void 0);
			});
			const nextResult = await until(() => unhandledExceptionController[kResponsePromise]);
			if (nextResult.error) return handleResponseError(nextResult.error);
			if (nextResult.data) return handleResponse(nextResult.data);
		}
		options.onResponse(createServerErrorResponse(result.error));
		return true;
	}
	if (result.data) return handleResponse(result.data);
	return false;
}
function hasConfigurableGlobal(propertyName) {
	const descriptor = Object.getOwnPropertyDescriptor(globalThis, propertyName);
	if (typeof descriptor === "undefined") return false;
	if (typeof descriptor.get === "function" && typeof descriptor.get() === "undefined") return false;
	if (typeof descriptor.get === "undefined" && descriptor.value == null) return false;
	if (typeof descriptor.set === "undefined" && !descriptor.configurable) {
		console.error(`[MSW] Failed to apply interceptor: the global \`${propertyName}\` property is non-configurable. This is likely an issue with your environment. If you are using a framework, please open an issue about this in their repository.`);
		return false;
	}
	return true;
}
function createNetworkError(cause) {
	return Object.assign(/* @__PURE__ */ new TypeError("Failed to fetch"), { cause });
}
var REQUEST_BODY_HEADERS = [
	"content-encoding",
	"content-language",
	"content-location",
	"content-type",
	"content-length"
];
var kRedirectCount = Symbol("kRedirectCount");
async function followFetchRedirect(request, response) {
	if (response.status !== 303 && request.body != null) return Promise.reject(createNetworkError());
	const requestUrl = new URL(request.url);
	let locationUrl;
	try {
		locationUrl = new URL(response.headers.get("location"), request.url);
	} catch (error2) {
		return Promise.reject(createNetworkError(error2));
	}
	if (!(locationUrl.protocol === "http:" || locationUrl.protocol === "https:")) return Promise.reject(createNetworkError("URL scheme must be a HTTP(S) scheme"));
	if (Reflect.get(request, kRedirectCount) > 20) return Promise.reject(createNetworkError("redirect count exceeded"));
	Object.defineProperty(request, kRedirectCount, { value: (Reflect.get(request, kRedirectCount) || 0) + 1 });
	if (request.mode === "cors" && (locationUrl.username || locationUrl.password) && !sameOrigin(requestUrl, locationUrl)) return Promise.reject(createNetworkError("cross origin not allowed for request mode \"cors\""));
	const requestInit = {};
	if ([301, 302].includes(response.status) && request.method === "POST" || response.status === 303 && !["HEAD", "GET"].includes(request.method)) {
		requestInit.method = "GET";
		requestInit.body = null;
		REQUEST_BODY_HEADERS.forEach((headerName) => {
			request.headers.delete(headerName);
		});
	}
	if (!sameOrigin(requestUrl, locationUrl)) {
		request.headers.delete("authorization");
		request.headers.delete("proxy-authorization");
		request.headers.delete("cookie");
		request.headers.delete("host");
	}
	requestInit.headers = request.headers;
	return fetch(new Request(locationUrl, requestInit));
}
function sameOrigin(left, right) {
	if (left.origin === right.origin && left.origin === "null") return true;
	if (left.protocol === right.protocol && left.hostname === right.hostname && left.port === right.port) return true;
	return false;
}
var BrotliDecompressionStream = class extends TransformStream {
	constructor() {
		console.warn("[Interceptors]: Brotli decompression of response streams is not supported in the browser");
		super({ transform(chunk, controller) {
			controller.enqueue(chunk);
		} });
	}
};
var PipelineStream = class extends TransformStream {
	constructor(transformStreams, ...strategies) {
		super({}, ...strategies);
		const readable = [super.readable, ...transformStreams].reduce((readable2, transform) => readable2.pipeThrough(transform));
		Object.defineProperty(this, "readable", { get() {
			return readable;
		} });
	}
};
function parseContentEncoding(contentEncoding) {
	return contentEncoding.toLowerCase().split(",").map((coding) => coding.trim());
}
function createDecompressionStream(contentEncoding) {
	if (contentEncoding === "") return null;
	const codings = parseContentEncoding(contentEncoding);
	if (codings.length === 0) return null;
	const transformers = codings.reduceRight((transformers2, coding) => {
		if (coding === "gzip" || coding === "x-gzip") return transformers2.concat(new DecompressionStream("gzip"));
		else if (coding === "deflate") return transformers2.concat(new DecompressionStream("deflate"));
		else if (coding === "br") return transformers2.concat(new BrotliDecompressionStream());
		else transformers2.length = 0;
		return transformers2;
	}, []);
	return new PipelineStream(transformers);
}
function decompressResponse(response) {
	if (response.body === null) return null;
	const decompressionStream = createDecompressionStream(response.headers.get("content-encoding") || "");
	if (!decompressionStream) return null;
	response.body.pipeTo(decompressionStream.writable);
	return decompressionStream.readable;
}
var _FetchInterceptor = class extends Interceptor {
	constructor() {
		super(_FetchInterceptor.symbol);
	}
	checkEnvironment() {
		return hasConfigurableGlobal("fetch");
	}
	async setup() {
		const pureFetch = globalThis.fetch;
		invariant(!pureFetch[IS_PATCHED_MODULE$1], "Failed to patch the \"fetch\" module: already patched.");
		globalThis.fetch = async (input, init) => {
			const requestId = createRequestId();
			const resolvedInput = typeof input === "string" && typeof location !== "undefined" && !canParseUrl$1(input) ? new URL(input, location.href) : input;
			const request = new Request(resolvedInput, init);
			if (input instanceof Request) setRawRequest(request, input);
			const responsePromise = new DeferredPromise();
			const controller = new RequestController(request);
			this.logger.info("[%s] %s", request.method, request.url);
			this.logger.info("awaiting for the mocked response...");
			this.logger.info("emitting the \"request\" event for %s listener(s)...", this.emitter.listenerCount("request"));
			const isRequestHandled = await handleRequest2({
				request,
				requestId,
				emitter: this.emitter,
				controller,
				onResponse: async (rawResponse) => {
					this.logger.info("received mocked response!", { rawResponse });
					const decompressedStream = decompressResponse(rawResponse);
					const response = decompressedStream === null ? rawResponse : new FetchResponse$1(decompressedStream, rawResponse);
					FetchResponse$1.setUrl(request.url, response);
					if (FetchResponse$1.isRedirectResponse(response.status)) {
						if (request.redirect === "error") {
							responsePromise.reject(createNetworkError("unexpected redirect"));
							return;
						}
						if (request.redirect === "follow") {
							followFetchRedirect(request, response).then((response2) => {
								responsePromise.resolve(response2);
							}, (reason) => {
								responsePromise.reject(reason);
							});
							return;
						}
					}
					if (this.emitter.listenerCount("response") > 0) {
						this.logger.info("emitting the \"response\" event...");
						await emitAsync(this.emitter, "response", {
							response: response.clone(),
							isMockedResponse: true,
							request,
							requestId
						});
					}
					responsePromise.resolve(response);
				},
				onRequestError: (response) => {
					this.logger.info("request has errored!", { response });
					responsePromise.reject(createNetworkError(response));
				},
				onError: (error2) => {
					this.logger.info("request has been aborted!", { error: error2 });
					responsePromise.reject(error2);
				}
			});
			if (isRequestHandled) {
				this.logger.info("request has been handled, returning mock promise...");
				return responsePromise;
			}
			this.logger.info("no mocked response received, performing request as-is...");
			const requestCloneForResponseEvent = request.clone();
			return pureFetch(request).then(async (response) => {
				this.logger.info("original fetch performed", response);
				if (this.emitter.listenerCount("response") > 0) {
					this.logger.info("emitting the \"response\" event...");
					const responseClone = response.clone();
					await emitAsync(this.emitter, "response", {
						response: responseClone,
						isMockedResponse: false,
						request: requestCloneForResponseEvent,
						requestId
					});
				}
				return response;
			});
		};
		Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE$1, {
			enumerable: true,
			configurable: true,
			value: true
		});
		this.subscriptions.push(() => {
			Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE$1, { value: void 0 });
			globalThis.fetch = pureFetch;
			this.logger.info("restored native \"globalThis.fetch\"!", globalThis.fetch.name);
		});
	}
};
var FetchInterceptor = _FetchInterceptor;
FetchInterceptor.symbol = Symbol("fetch");
function concatArrayBuffer(left, right) {
	const result = new Uint8Array(left.byteLength + right.byteLength);
	result.set(left, 0);
	result.set(right, left.byteLength);
	return result;
}
var EventPolyfill = class {
	constructor(type, options) {
		this.NONE = 0;
		this.CAPTURING_PHASE = 1;
		this.AT_TARGET = 2;
		this.BUBBLING_PHASE = 3;
		this.type = "";
		this.srcElement = null;
		this.currentTarget = null;
		this.eventPhase = 0;
		this.isTrusted = true;
		this.composed = false;
		this.cancelable = true;
		this.defaultPrevented = false;
		this.bubbles = true;
		this.lengthComputable = true;
		this.loaded = 0;
		this.total = 0;
		this.cancelBubble = false;
		this.returnValue = true;
		this.type = type;
		this.target = (options == null ? void 0 : options.target) || null;
		this.currentTarget = (options == null ? void 0 : options.currentTarget) || null;
		this.timeStamp = Date.now();
	}
	composedPath() {
		return [];
	}
	initEvent(type, bubbles, cancelable) {
		this.type = type;
		this.bubbles = !!bubbles;
		this.cancelable = !!cancelable;
	}
	preventDefault() {
		this.defaultPrevented = true;
	}
	stopPropagation() {}
	stopImmediatePropagation() {}
};
var ProgressEventPolyfill = class extends EventPolyfill {
	constructor(type, init) {
		super(type);
		this.lengthComputable = (init == null ? void 0 : init.lengthComputable) || false;
		this.composed = (init == null ? void 0 : init.composed) || false;
		this.loaded = (init == null ? void 0 : init.loaded) || 0;
		this.total = (init == null ? void 0 : init.total) || 0;
	}
};
var SUPPORTS_PROGRESS_EVENT = typeof ProgressEvent !== "undefined";
function createEvent(target, type, init) {
	const progressEvents = [
		"error",
		"progress",
		"loadstart",
		"loadend",
		"load",
		"timeout",
		"abort"
	];
	const ProgressEventClass = SUPPORTS_PROGRESS_EVENT ? ProgressEvent : ProgressEventPolyfill;
	const event = progressEvents.includes(type) ? new ProgressEventClass(type, {
		lengthComputable: true,
		loaded: (init == null ? void 0 : init.loaded) || 0,
		total: (init == null ? void 0 : init.total) || 0
	}) : new EventPolyfill(type, {
		target,
		currentTarget: target
	});
	return event;
}
function findPropertySource(target, propertyName) {
	if (!(propertyName in target)) return null;
	const hasProperty = Object.prototype.hasOwnProperty.call(target, propertyName);
	if (hasProperty) return target;
	const prototype = Reflect.getPrototypeOf(target);
	return prototype ? findPropertySource(prototype, propertyName) : null;
}
function createProxy(target, options) {
	const proxy = new Proxy(target, optionsToProxyHandler(options));
	return proxy;
}
function optionsToProxyHandler(options) {
	const { constructorCall, methodCall, getProperty, setProperty } = options;
	const handler = {};
	if (typeof constructorCall !== "undefined") handler.construct = function(target, args, newTarget) {
		const next = Reflect.construct.bind(null, target, args, newTarget);
		return constructorCall.call(newTarget, args, next);
	};
	handler.set = function(target, propertyName, nextValue) {
		const next = () => {
			const propertySource = findPropertySource(target, propertyName) || target;
			const ownDescriptors = Reflect.getOwnPropertyDescriptor(propertySource, propertyName);
			if (typeof (ownDescriptors == null ? void 0 : ownDescriptors.set) !== "undefined") {
				ownDescriptors.set.apply(target, [nextValue]);
				return true;
			}
			return Reflect.defineProperty(propertySource, propertyName, {
				writable: true,
				enumerable: true,
				configurable: true,
				value: nextValue
			});
		};
		if (typeof setProperty !== "undefined") return setProperty.call(target, [propertyName, nextValue], next);
		return next();
	};
	handler.get = function(target, propertyName, receiver) {
		const next = () => target[propertyName];
		const value = typeof getProperty !== "undefined" ? getProperty.call(target, [propertyName, receiver], next) : next();
		if (typeof value === "function") return (...args) => {
			const next2 = value.bind(target, ...args);
			if (typeof methodCall !== "undefined") return methodCall.call(target, [propertyName, args], next2);
			return next2();
		};
		return value;
	};
	return handler;
}
function isDomParserSupportedType(type) {
	const supportedTypes = [
		"application/xhtml+xml",
		"application/xml",
		"image/svg+xml",
		"text/html",
		"text/xml"
	];
	return supportedTypes.some((supportedType) => {
		return type.startsWith(supportedType);
	});
}
function parseJson(data) {
	try {
		const json = JSON.parse(data);
		return json;
	} catch (_) {
		return null;
	}
}
function createResponse(request, body) {
	const responseBodyOrNull = FetchResponse$1.isResponseWithBody(request.status) ? body : null;
	return new FetchResponse$1(responseBodyOrNull, {
		url: request.responseURL,
		status: request.status,
		statusText: request.statusText,
		headers: createHeadersFromXMLHttpReqestHeaders(request.getAllResponseHeaders())
	});
}
function createHeadersFromXMLHttpReqestHeaders(headersString) {
	const headers = new Headers();
	const lines = headersString.split(/[\r\n]+/);
	for (const line of lines) {
		if (line.trim() === "") continue;
		const [name, ...parts] = line.split(": ");
		const value = parts.join(": ");
		headers.append(name, value);
	}
	return headers;
}
async function getBodyByteLength(input) {
	const explicitContentLength = input.headers.get("content-length");
	if (explicitContentLength != null && explicitContentLength !== "") return Number(explicitContentLength);
	const buffer = await input.arrayBuffer();
	return buffer.byteLength;
}
var kIsRequestHandled = Symbol("kIsRequestHandled");
var IS_NODE2 = isNodeProcess();
var kFetchRequest = Symbol("kFetchRequest");
var XMLHttpRequestController = class {
	constructor(initialRequest, logger) {
		this.initialRequest = initialRequest;
		this.logger = logger;
		this.method = "GET";
		this.url = null;
		this[kIsRequestHandled] = false;
		this.events = /* @__PURE__ */ new Map();
		this.uploadEvents = /* @__PURE__ */ new Map();
		this.requestId = createRequestId();
		this.requestHeaders = new Headers();
		this.responseBuffer = new Uint8Array();
		this.request = createProxy(initialRequest, {
			setProperty: ([propertyName, nextValue], invoke) => {
				switch (propertyName) {
					case "ontimeout": {
						const eventName = propertyName.slice(2);
						this.request.addEventListener(eventName, nextValue);
						return invoke();
					}
					default: return invoke();
				}
			},
			methodCall: ([methodName, args], invoke) => {
				var _a$1;
				switch (methodName) {
					case "open": {
						const [method, url] = args;
						if (typeof url === "undefined") {
							this.method = "GET";
							this.url = toAbsoluteUrl(method);
						} else {
							this.method = method;
							this.url = toAbsoluteUrl(url);
						}
						this.logger = this.logger.extend(`${this.method} ${this.url.href}`);
						this.logger.info("open", this.method, this.url.href);
						return invoke();
					}
					case "addEventListener": {
						const [eventName, listener] = args;
						this.registerEvent(eventName, listener);
						this.logger.info("addEventListener", eventName, listener);
						return invoke();
					}
					case "setRequestHeader": {
						const [name, value] = args;
						this.requestHeaders.set(name, value);
						this.logger.info("setRequestHeader", name, value);
						return invoke();
					}
					case "send": {
						const [body] = args;
						this.request.addEventListener("load", () => {
							if (typeof this.onResponse !== "undefined") {
								const fetchResponse = createResponse(
									this.request,
									/**
									* The `response` property is the right way to read
									* the ambiguous response body, as the request's "responseType" may differ.
									* @see https://xhr.spec.whatwg.org/#the-response-attribute
									*/
									this.request.response
								);
								this.onResponse.call(this, {
									response: fetchResponse,
									isMockedResponse: this[kIsRequestHandled],
									request: fetchRequest,
									requestId: this.requestId
								});
							}
						});
						const requestBody = typeof body === "string" ? encodeBuffer(body) : body;
						const fetchRequest = this.toFetchApiRequest(requestBody);
						this[kFetchRequest] = fetchRequest.clone();
						const onceRequestSettled = ((_a$1 = this.onRequest) == null ? void 0 : _a$1.call(this, {
							request: fetchRequest,
							requestId: this.requestId
						})) || Promise.resolve();
						onceRequestSettled.finally(() => {
							if (!this[kIsRequestHandled]) {
								this.logger.info("request callback settled but request has not been handled (readystate %d), performing as-is...", this.request.readyState);
								if (IS_NODE2) this.request.setRequestHeader(INTERNAL_REQUEST_ID_HEADER_NAME, this.requestId);
								return invoke();
							}
						});
						break;
					}
					default: return invoke();
				}
			}
		});
		define(this.request, "upload", createProxy(this.request.upload, {
			setProperty: ([propertyName, nextValue], invoke) => {
				switch (propertyName) {
					case "onloadstart":
					case "onprogress":
					case "onaboart":
					case "onerror":
					case "onload":
					case "ontimeout":
					case "onloadend": {
						const eventName = propertyName.slice(2);
						this.registerUploadEvent(eventName, nextValue);
					}
				}
				return invoke();
			},
			methodCall: ([methodName, args], invoke) => {
				switch (methodName) {
					case "addEventListener": {
						const [eventName, listener] = args;
						this.registerUploadEvent(eventName, listener);
						this.logger.info("upload.addEventListener", eventName, listener);
						return invoke();
					}
				}
			}
		}));
	}
	registerEvent(eventName, listener) {
		const prevEvents = this.events.get(eventName) || [];
		const nextEvents = prevEvents.concat(listener);
		this.events.set(eventName, nextEvents);
		this.logger.info("registered event \"%s\"", eventName, listener);
	}
	registerUploadEvent(eventName, listener) {
		const prevEvents = this.uploadEvents.get(eventName) || [];
		const nextEvents = prevEvents.concat(listener);
		this.uploadEvents.set(eventName, nextEvents);
		this.logger.info("registered upload event \"%s\"", eventName, listener);
	}
	/**
	* Responds to the current request with the given
	* Fetch API `Response` instance.
	*/
	async respondWith(response) {
		this[kIsRequestHandled] = true;
		if (this[kFetchRequest]) {
			const totalRequestBodyLength = await getBodyByteLength(this[kFetchRequest]);
			this.trigger("loadstart", this.request.upload, {
				loaded: 0,
				total: totalRequestBodyLength
			});
			this.trigger("progress", this.request.upload, {
				loaded: totalRequestBodyLength,
				total: totalRequestBodyLength
			});
			this.trigger("load", this.request.upload, {
				loaded: totalRequestBodyLength,
				total: totalRequestBodyLength
			});
			this.trigger("loadend", this.request.upload, {
				loaded: totalRequestBodyLength,
				total: totalRequestBodyLength
			});
		}
		this.logger.info("responding with a mocked response: %d %s", response.status, response.statusText);
		define(this.request, "status", response.status);
		define(this.request, "statusText", response.statusText);
		define(this.request, "responseURL", this.url.href);
		this.request.getResponseHeader = new Proxy(this.request.getResponseHeader, { apply: (_, __, args) => {
			this.logger.info("getResponseHeader", args[0]);
			if (this.request.readyState < this.request.HEADERS_RECEIVED) {
				this.logger.info("headers not received yet, returning null");
				return null;
			}
			const headerValue = response.headers.get(args[0]);
			this.logger.info("resolved response header \"%s\" to", args[0], headerValue);
			return headerValue;
		} });
		this.request.getAllResponseHeaders = new Proxy(this.request.getAllResponseHeaders, { apply: () => {
			this.logger.info("getAllResponseHeaders");
			if (this.request.readyState < this.request.HEADERS_RECEIVED) {
				this.logger.info("headers not received yet, returning empty string");
				return "";
			}
			const headersList = Array.from(response.headers.entries());
			const allHeaders = headersList.map(([headerName, headerValue]) => {
				return `${headerName}: ${headerValue}`;
			}).join("\r\n");
			this.logger.info("resolved all response headers to", allHeaders);
			return allHeaders;
		} });
		Object.defineProperties(this.request, {
			response: {
				enumerable: true,
				configurable: false,
				get: () => this.response
			},
			responseText: {
				enumerable: true,
				configurable: false,
				get: () => this.responseText
			},
			responseXML: {
				enumerable: true,
				configurable: false,
				get: () => this.responseXML
			}
		});
		const totalResponseBodyLength = await getBodyByteLength(response.clone());
		this.logger.info("calculated response body length", totalResponseBodyLength);
		this.trigger("loadstart", this.request, {
			loaded: 0,
			total: totalResponseBodyLength
		});
		this.setReadyState(this.request.HEADERS_RECEIVED);
		this.setReadyState(this.request.LOADING);
		const finalizeResponse = () => {
			this.logger.info("finalizing the mocked response...");
			this.setReadyState(this.request.DONE);
			this.trigger("load", this.request, {
				loaded: this.responseBuffer.byteLength,
				total: totalResponseBodyLength
			});
			this.trigger("loadend", this.request, {
				loaded: this.responseBuffer.byteLength,
				total: totalResponseBodyLength
			});
		};
		if (response.body) {
			this.logger.info("mocked response has body, streaming...");
			const reader = response.body.getReader();
			const readNextResponseBodyChunk = async () => {
				const { value, done } = await reader.read();
				if (done) {
					this.logger.info("response body stream done!");
					finalizeResponse();
					return;
				}
				if (value) {
					this.logger.info("read response body chunk:", value);
					this.responseBuffer = concatArrayBuffer(this.responseBuffer, value);
					this.trigger("progress", this.request, {
						loaded: this.responseBuffer.byteLength,
						total: totalResponseBodyLength
					});
				}
				readNextResponseBodyChunk();
			};
			readNextResponseBodyChunk();
		} else finalizeResponse();
	}
	responseBufferToText() {
		return decodeBuffer(this.responseBuffer);
	}
	get response() {
		this.logger.info("getResponse (responseType: %s)", this.request.responseType);
		if (this.request.readyState !== this.request.DONE) return null;
		switch (this.request.responseType) {
			case "json": {
				const responseJson = parseJson(this.responseBufferToText());
				this.logger.info("resolved response JSON", responseJson);
				return responseJson;
			}
			case "arraybuffer": {
				const arrayBuffer = toArrayBuffer(this.responseBuffer);
				this.logger.info("resolved response ArrayBuffer", arrayBuffer);
				return arrayBuffer;
			}
			case "blob": {
				const mimeType = this.request.getResponseHeader("Content-Type") || "text/plain";
				const responseBlob = new Blob([this.responseBufferToText()], { type: mimeType });
				this.logger.info("resolved response Blob (mime type: %s)", responseBlob, mimeType);
				return responseBlob;
			}
			default: {
				const responseText = this.responseBufferToText();
				this.logger.info("resolving \"%s\" response type as text", this.request.responseType, responseText);
				return responseText;
			}
		}
	}
	get responseText() {
		invariant(this.request.responseType === "" || this.request.responseType === "text", "InvalidStateError: The object is in invalid state.");
		if (this.request.readyState !== this.request.LOADING && this.request.readyState !== this.request.DONE) return "";
		const responseText = this.responseBufferToText();
		this.logger.info("getResponseText: \"%s\"", responseText);
		return responseText;
	}
	get responseXML() {
		invariant(this.request.responseType === "" || this.request.responseType === "document", "InvalidStateError: The object is in invalid state.");
		if (this.request.readyState !== this.request.DONE) return null;
		const contentType = this.request.getResponseHeader("Content-Type") || "";
		if (typeof DOMParser === "undefined") {
			console.warn("Cannot retrieve XMLHttpRequest response body as XML: DOMParser is not defined. You are likely using an environment that is not browser or does not polyfill browser globals correctly.");
			return null;
		}
		if (isDomParserSupportedType(contentType)) return new DOMParser().parseFromString(this.responseBufferToText(), contentType);
		return null;
	}
	errorWith(error2) {
		this[kIsRequestHandled] = true;
		this.logger.info("responding with an error");
		this.setReadyState(this.request.DONE);
		this.trigger("error", this.request);
		this.trigger("loadend", this.request);
	}
	/**
	* Transitions this request's `readyState` to the given one.
	*/
	setReadyState(nextReadyState) {
		this.logger.info("setReadyState: %d -> %d", this.request.readyState, nextReadyState);
		if (this.request.readyState === nextReadyState) {
			this.logger.info("ready state identical, skipping transition...");
			return;
		}
		define(this.request, "readyState", nextReadyState);
		this.logger.info("set readyState to: %d", nextReadyState);
		if (nextReadyState !== this.request.UNSENT) {
			this.logger.info("triggerring \"readystatechange\" event...");
			this.trigger("readystatechange", this.request);
		}
	}
	/**
	* Triggers given event on the `XMLHttpRequest` instance.
	*/
	trigger(eventName, target, options) {
		const callback = target[`on${eventName}`];
		const event = createEvent(target, eventName, options);
		this.logger.info("trigger \"%s\"", eventName, options || "");
		if (typeof callback === "function") {
			this.logger.info("found a direct \"%s\" callback, calling...", eventName);
			callback.call(target, event);
		}
		const events = target instanceof XMLHttpRequestUpload ? this.uploadEvents : this.events;
		for (const [registeredEventName, listeners] of events) if (registeredEventName === eventName) {
			this.logger.info("found %d listener(s) for \"%s\" event, calling...", listeners.length, eventName);
			listeners.forEach((listener) => listener.call(target, event));
		}
	}
	/**
	* Converts this `XMLHttpRequest` instance into a Fetch API `Request` instance.
	*/
	toFetchApiRequest(body) {
		this.logger.info("converting request to a Fetch API Request...");
		const resolvedBody = body instanceof Document ? body.documentElement.innerText : body;
		const fetchRequest = new Request(this.url.href, {
			method: this.method,
			headers: this.requestHeaders,
			credentials: this.request.withCredentials ? "include" : "same-origin",
			body: ["GET", "HEAD"].includes(this.method.toUpperCase()) ? null : resolvedBody
		});
		const proxyHeaders = createProxy(fetchRequest.headers, { methodCall: ([methodName, args], invoke) => {
			switch (methodName) {
				case "append":
				case "set": {
					const [headerName, headerValue] = args;
					this.request.setRequestHeader(headerName, headerValue);
					break;
				}
				case "delete": {
					const [headerName] = args;
					console.warn(`XMLHttpRequest: Cannot remove a "${headerName}" header from the Fetch API representation of the "${fetchRequest.method} ${fetchRequest.url}" request. XMLHttpRequest headers cannot be removed.`);
					break;
				}
			}
			return invoke();
		} });
		define(fetchRequest, "headers", proxyHeaders);
		setRawRequest(fetchRequest, this.request);
		this.logger.info("converted request to a Fetch API Request!", fetchRequest);
		return fetchRequest;
	}
};
function toAbsoluteUrl(url) {
	if (typeof location === "undefined") return new URL(url);
	return new URL(url.toString(), location.href);
}
function define(target, property, value) {
	Reflect.defineProperty(target, property, {
		writable: true,
		enumerable: true,
		value
	});
}
function createXMLHttpRequestProxy({ emitter, logger }) {
	const XMLHttpRequestProxy = new Proxy(globalThis.XMLHttpRequest, { construct(target, args, newTarget) {
		logger.info("constructed new XMLHttpRequest");
		const originalRequest = Reflect.construct(target, args, newTarget);
		const prototypeDescriptors = Object.getOwnPropertyDescriptors(target.prototype);
		for (const propertyName in prototypeDescriptors) Reflect.defineProperty(originalRequest, propertyName, prototypeDescriptors[propertyName]);
		const xhrRequestController = new XMLHttpRequestController(originalRequest, logger);
		xhrRequestController.onRequest = async function({ request, requestId }) {
			const controller = new RequestController(request);
			this.logger.info("awaiting mocked response...");
			this.logger.info("emitting the \"request\" event for %s listener(s)...", emitter.listenerCount("request"));
			const isRequestHandled = await handleRequest2({
				request,
				requestId,
				controller,
				emitter,
				onResponse: async (response) => {
					await this.respondWith(response);
				},
				onRequestError: () => {
					this.errorWith(/* @__PURE__ */ new TypeError("Network error"));
				},
				onError: (error2) => {
					this.logger.info("request errored!", { error: error2 });
					if (error2 instanceof Error) this.errorWith(error2);
				}
			});
			if (!isRequestHandled) this.logger.info("no mocked response received, performing request as-is...");
		};
		xhrRequestController.onResponse = async function({ response, isMockedResponse, request, requestId }) {
			this.logger.info("emitting the \"response\" event for %s listener(s)...", emitter.listenerCount("response"));
			emitter.emit("response", {
				response,
				isMockedResponse,
				request,
				requestId
			});
		};
		return xhrRequestController.request;
	} });
	return XMLHttpRequestProxy;
}
var _XMLHttpRequestInterceptor = class extends Interceptor {
	constructor() {
		super(_XMLHttpRequestInterceptor.interceptorSymbol);
	}
	checkEnvironment() {
		return hasConfigurableGlobal("XMLHttpRequest");
	}
	setup() {
		const logger = this.logger.extend("setup");
		logger.info("patching \"XMLHttpRequest\" module...");
		const PureXMLHttpRequest = globalThis.XMLHttpRequest;
		invariant(!PureXMLHttpRequest[IS_PATCHED_MODULE$1], "Failed to patch the \"XMLHttpRequest\" module: already patched.");
		globalThis.XMLHttpRequest = createXMLHttpRequestProxy({
			emitter: this.emitter,
			logger: this.logger
		});
		logger.info("native \"XMLHttpRequest\" module patched!", globalThis.XMLHttpRequest.name);
		Object.defineProperty(globalThis.XMLHttpRequest, IS_PATCHED_MODULE$1, {
			enumerable: true,
			configurable: true,
			value: true
		});
		this.subscriptions.push(() => {
			Object.defineProperty(globalThis.XMLHttpRequest, IS_PATCHED_MODULE$1, { value: void 0 });
			globalThis.XMLHttpRequest = PureXMLHttpRequest;
			logger.info("native \"XMLHttpRequest\" module restored!", globalThis.XMLHttpRequest.name);
		});
	}
};
var XMLHttpRequestInterceptor = _XMLHttpRequestInterceptor;
XMLHttpRequestInterceptor.interceptorSymbol = Symbol("xhr");
function createFallbackRequestListener(context, options) {
	const interceptor = new BatchInterceptor({
		name: "fallback",
		interceptors: [new FetchInterceptor(), new XMLHttpRequestInterceptor()]
	});
	interceptor.on("request", async ({ request, requestId, controller }) => {
		const requestCloneForLogs = request.clone();
		const response = await handleRequest(request, requestId, context.getRequestHandlers().filter(isHandlerKind("RequestHandler")), options, context.emitter, { onMockedResponse(_, { handler, parsedResult }) {
			if (!options.quiet) context.emitter.once("response:mocked", ({ response: response2 }) => {
				handler.log({
					request: requestCloneForLogs,
					response: response2,
					parsedResult
				});
			});
		} });
		if (response) controller.respondWith(response);
	});
	interceptor.on("response", ({ response, isMockedResponse, request, requestId }) => {
		context.emitter.emit(isMockedResponse ? "response:mocked" : "response:bypass", {
			response,
			request,
			requestId
		});
	});
	interceptor.apply();
	return interceptor;
}
function createFallbackStart(context) {
	return async function start(options) {
		context.fallbackInterceptor = createFallbackRequestListener(context, options);
		printStartMessage({
			message: "Mocking enabled (fallback mode).",
			quiet: options.quiet
		});
		return void 0;
	};
}
function createFallbackStop(context) {
	return function stop() {
		var _context$fallbackInte, _context$startOptions2;
		(_context$fallbackInte = context.fallbackInterceptor) === null || _context$fallbackInte === void 0 || _context$fallbackInte.dispose();
		printStopMessage({ quiet: (_context$startOptions2 = context.startOptions) === null || _context$startOptions2 === void 0 ? void 0 : _context$startOptions2.quiet });
	};
}
function supportsReadableStreamTransfer() {
	try {
		const stream = new ReadableStream({ start: (controller) => controller.close() });
		const message$2 = new MessageChannel();
		message$2.port1.postMessage(stream, [stream]);
		return true;
	} catch {
		return false;
	}
}
var SetupWorkerApi = class extends SetupApi {
	constructor(...handlers$1) {
		super(...handlers$1);
		babelHelpers.defineProperty(this, "context", void 0);
		babelHelpers.defineProperty(this, "startHandler", null);
		babelHelpers.defineProperty(this, "stopHandler", null);
		babelHelpers.defineProperty(this, "listeners", void 0);
		invariant(!isNodeProcess(), devUtils.formatMessage("Failed to execute `setupWorker` in a non-browser environment. Consider using `setupServer` for Node.js environment instead."));
		this.listeners = [];
		this.context = this.createWorkerContext();
	}
	createWorkerContext() {
		const context = {
			isMockingEnabled: false,
			startOptions: null,
			worker: null,
			getRequestHandlers: () => {
				return this.handlersController.currentHandlers();
			},
			registration: null,
			emitter: this.emitter,
			workerChannel: {
				on: (eventType, callback) => {
					this.context.events.addListener(navigator.serviceWorker, "message", (event) => {
						if (event.source !== this.context.worker) return;
						const message$2 = event.data;
						if (!message$2) return;
						if (message$2.type === eventType) callback(event, message$2);
					});
				},
				send: (type) => {
					var _this$context$worker;
					(_this$context$worker = this.context.worker) === null || _this$context$worker === void 0 || _this$context$worker.postMessage(type);
				}
			},
			events: {
				addListener: (target, eventType, callback) => {
					target.addEventListener(eventType, callback);
					this.listeners.push({
						eventType,
						target,
						callback
					});
					return () => {
						target.removeEventListener(eventType, callback);
					};
				},
				removeAllListeners: () => {
					for (const { target, eventType, callback } of this.listeners) target.removeEventListener(eventType, callback);
					this.listeners = [];
				},
				once: (eventType) => {
					const bindings = [];
					return new Promise((resolve, reject) => {
						const handleIncomingMessage = (event) => {
							try {
								const message$2 = event.data;
								if (message$2.type === eventType) resolve(message$2);
							} catch (error2) {
								reject(error2);
							}
						};
						bindings.push(this.context.events.addListener(navigator.serviceWorker, "message", handleIncomingMessage), this.context.events.addListener(navigator.serviceWorker, "messageerror", reject));
					}).finally(() => {
						bindings.forEach((unbind) => unbind());
					});
				}
			},
			supports: {
				serviceWorkerApi: !("serviceWorker" in navigator) || location.protocol === "file:",
				readableStreamTransfer: supportsReadableStreamTransfer()
			}
		};
		this.startHandler = context.supports.serviceWorkerApi ? createFallbackStart(context) : createStartHandler(context);
		this.stopHandler = context.supports.serviceWorkerApi ? createFallbackStop(context) : createStop(context);
		return context;
	}
	async start(options = {}) {
		if (options.waitUntilReady === true) devUtils.warn("The \"waitUntilReady\" option has been deprecated. Please remove it from this \"worker.start()\" call. Follow the recommended Browser integration (https://mswjs.io/docs/integrations/browser) to eliminate any race conditions between the Service Worker registration and any requests made by your application on initial render.");
		this.context.startOptions = mergeRight(DEFAULT_START_OPTIONS, options);
		handleWebSocketEvent({
			getUnhandledRequestStrategy: () => {
				return this.context.startOptions.onUnhandledRequest;
			},
			getHandlers: () => {
				return this.handlersController.currentHandlers();
			},
			onMockedConnection: (connection) => {
				if (!this.context.startOptions.quiet) attachWebSocketLogger(connection);
			},
			onPassthroughConnection() {}
		});
		webSocketInterceptor.apply();
		this.subscriptions.push(() => {
			webSocketInterceptor.dispose();
		});
		return await this.startHandler(this.context.startOptions, options);
	}
	stop() {
		super.dispose();
		this.context.events.removeAllListeners();
		this.context.emitter.removeAllListeners();
		this.stopHandler();
	}
};
function setupWorker(...handlers$1) {
	return new SetupWorkerApi(...handlers$1);
}
function isStringEqual(actual, expected) {
	return actual.toLowerCase() === expected.toLowerCase();
}
function getStatusCodeColor(status) {
	if (status < 300) return "#69AB32";
	if (status < 400) return "#F0BB4B";
	return "#E95F5D";
}
async function serializeRequest(request) {
	const requestClone = request.clone();
	const requestText = await requestClone.text();
	return {
		url: new URL(request.url),
		method: request.method,
		headers: Object.fromEntries(request.headers.entries()),
		body: requestText
	};
}
const { message } = source_default$1;
async function serializeResponse(response) {
	const responseClone = response.clone();
	const responseText = await responseClone.text();
	const responseStatus = responseClone.status || 200;
	const responseStatusText = responseClone.statusText || message[responseStatus] || "OK";
	return {
		status: responseStatus,
		statusText: responseStatusText,
		headers: Object.fromEntries(responseClone.headers.entries()),
		body: responseText
	};
}
/**
* Tokenize input string.
*/
function lexer(str) {
	var tokens = [];
	var i = 0;
	while (i < str.length) {
		var char = str[i];
		if (char === "*" || char === "+" || char === "?") {
			tokens.push({
				type: "MODIFIER",
				index: i,
				value: str[i++]
			});
			continue;
		}
		if (char === "\\") {
			tokens.push({
				type: "ESCAPED_CHAR",
				index: i++,
				value: str[i++]
			});
			continue;
		}
		if (char === "{") {
			tokens.push({
				type: "OPEN",
				index: i,
				value: str[i++]
			});
			continue;
		}
		if (char === "}") {
			tokens.push({
				type: "CLOSE",
				index: i,
				value: str[i++]
			});
			continue;
		}
		if (char === ":") {
			var name = "";
			var j = i + 1;
			while (j < str.length) {
				var code = str.charCodeAt(j);
				if (code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 95) {
					name += str[j++];
					continue;
				}
				break;
			}
			if (!name) throw new TypeError("Missing parameter name at ".concat(i));
			tokens.push({
				type: "NAME",
				index: i,
				value: name
			});
			i = j;
			continue;
		}
		if (char === "(") {
			var count = 1;
			var pattern = "";
			var j = i + 1;
			if (str[j] === "?") throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
			while (j < str.length) {
				if (str[j] === "\\") {
					pattern += str[j++] + str[j++];
					continue;
				}
				if (str[j] === ")") {
					count--;
					if (count === 0) {
						j++;
						break;
					}
				} else if (str[j] === "(") {
					count++;
					if (str[j + 1] !== "?") throw new TypeError("Capturing groups are not allowed at ".concat(j));
				}
				pattern += str[j++];
			}
			if (count) throw new TypeError("Unbalanced pattern at ".concat(i));
			if (!pattern) throw new TypeError("Missing pattern at ".concat(i));
			tokens.push({
				type: "PATTERN",
				index: i,
				value: pattern
			});
			i = j;
			continue;
		}
		tokens.push({
			type: "CHAR",
			index: i,
			value: str[i++]
		});
	}
	tokens.push({
		type: "END",
		index: i,
		value: ""
	});
	return tokens;
}
/**
* Parse a string for the raw tokens.
*/
function parse(str, options) {
	if (options === void 0) options = {};
	var tokens = lexer(str);
	var _a$1 = options.prefixes, prefixes = _a$1 === void 0 ? "./" : _a$1, _b$1 = options.delimiter, delimiter = _b$1 === void 0 ? "/#?" : _b$1;
	var result = [];
	var key = 0;
	var i = 0;
	var path = "";
	var tryConsume = function(type) {
		if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
	};
	var mustConsume = function(type) {
		var value$1 = tryConsume(type);
		if (value$1 !== void 0) return value$1;
		var _a$2 = tokens[i], nextType = _a$2.type, index = _a$2.index;
		throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
	};
	var consumeText = function() {
		var result$1 = "";
		var value$1;
		while (value$1 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) result$1 += value$1;
		return result$1;
	};
	var isSafe = function(value$1) {
		for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
			var char$1 = delimiter_1[_i];
			if (value$1.indexOf(char$1) > -1) return true;
		}
		return false;
	};
	var safePattern = function(prefix$1) {
		var prev = result[result.length - 1];
		var prevText = prefix$1 || (prev && typeof prev === "string" ? prev : "");
		if (prev && !prevText) throw new TypeError("Must have text between two parameters, missing text after \"".concat(prev.name, "\""));
		if (!prevText || isSafe(prevText)) return "[^".concat(escapeString(delimiter), "]+?");
		return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
	};
	while (i < tokens.length) {
		var char = tryConsume("CHAR");
		var name = tryConsume("NAME");
		var pattern = tryConsume("PATTERN");
		if (name || pattern) {
			var prefix = char || "";
			if (prefixes.indexOf(prefix) === -1) {
				path += prefix;
				prefix = "";
			}
			if (path) {
				result.push(path);
				path = "";
			}
			result.push({
				name: name || key++,
				prefix,
				suffix: "",
				pattern: pattern || safePattern(prefix),
				modifier: tryConsume("MODIFIER") || ""
			});
			continue;
		}
		var value = char || tryConsume("ESCAPED_CHAR");
		if (value) {
			path += value;
			continue;
		}
		if (path) {
			result.push(path);
			path = "";
		}
		var open = tryConsume("OPEN");
		if (open) {
			var prefix = consumeText();
			var name_1 = tryConsume("NAME") || "";
			var pattern_1 = tryConsume("PATTERN") || "";
			var suffix = consumeText();
			mustConsume("CLOSE");
			result.push({
				name: name_1 || (pattern_1 ? key++ : ""),
				pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
				prefix,
				suffix,
				modifier: tryConsume("MODIFIER") || ""
			});
			continue;
		}
		mustConsume("END");
	}
	return result;
}
/**
* Create path match function from `path-to-regexp` spec.
*/
function match(str, options) {
	var keys = [];
	var re = pathToRegexp(str, keys, options);
	return regexpToFunction(re, keys, options);
}
/**
* Create a path match function from `path-to-regexp` output.
*/
function regexpToFunction(re, keys, options) {
	if (options === void 0) options = {};
	var _a$1 = options.decode, decode = _a$1 === void 0 ? function(x) {
		return x;
	} : _a$1;
	return function(pathname) {
		var m = re.exec(pathname);
		if (!m) return false;
		var path = m[0], index = m.index;
		var params = Object.create(null);
		var _loop_1 = function(i$1) {
			if (m[i$1] === void 0) return "continue";
			var key = keys[i$1 - 1];
			if (key.modifier === "*" || key.modifier === "+") params[key.name] = m[i$1].split(key.prefix + key.suffix).map(function(value) {
				return decode(value, key);
			});
			else params[key.name] = decode(m[i$1], key);
		};
		for (var i = 1; i < m.length; i++) _loop_1(i);
		return {
			path,
			index,
			params
		};
	};
}
/**
* Escape a regular expression string.
*/
function escapeString(str) {
	return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
* Get the flags for a regexp from the options.
*/
function flags(options) {
	return options && options.sensitive ? "" : "i";
}
/**
* Pull out keys from a regexp.
*/
function regexpToRegexp(path, keys) {
	if (!keys) return path;
	var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
	var index = 0;
	var execResult = groupsRegex.exec(path.source);
	while (execResult) {
		keys.push({
			name: execResult[1] || index++,
			prefix: "",
			suffix: "",
			modifier: "",
			pattern: ""
		});
		execResult = groupsRegex.exec(path.source);
	}
	return path;
}
/**
* Transform an array into a regexp.
*/
function arrayToRegexp(paths, keys, options) {
	var parts = paths.map(function(path) {
		return pathToRegexp(path, keys, options).source;
	});
	return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
/**
* Create a path regexp from string input.
*/
function stringToRegexp(path, keys, options) {
	return tokensToRegexp(parse(path, options), keys, options);
}
/**
* Expose a function for taking tokens and returning a RegExp.
*/
function tokensToRegexp(tokens, keys, options) {
	if (options === void 0) options = {};
	var _a$1 = options.strict, strict = _a$1 === void 0 ? false : _a$1, _b$1 = options.start, start = _b$1 === void 0 ? true : _b$1, _c$1 = options.end, end = _c$1 === void 0 ? true : _c$1, _d = options.encode, encode = _d === void 0 ? function(x) {
		return x;
	} : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
	var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
	var delimiterRe = "[".concat(escapeString(delimiter), "]");
	var route = start ? "^" : "";
	for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
		var token = tokens_1[_i];
		if (typeof token === "string") route += escapeString(encode(token));
		else {
			var prefix = escapeString(encode(token.prefix));
			var suffix = escapeString(encode(token.suffix));
			if (token.pattern) {
				if (keys) keys.push(token);
				if (prefix || suffix) if (token.modifier === "+" || token.modifier === "*") {
					var mod = token.modifier === "*" ? "?" : "";
					route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
				} else route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
				else {
					if (token.modifier === "+" || token.modifier === "*") throw new TypeError("Can not repeat \"".concat(token.name, "\" without a prefix and suffix"));
					route += "(".concat(token.pattern, ")").concat(token.modifier);
				}
			} else route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
		}
	}
	if (end) {
		if (!strict) route += "".concat(delimiterRe, "?");
		route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
	} else {
		var endToken = tokens[tokens.length - 1];
		var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
		if (!strict) route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
		if (!isEndDelimited) route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
	}
	return new RegExp(route, flags(options));
}
/**
* Normalize the given path string, returning a regular expression.
*
* An empty array can be passed in for the keys, which will hold the
* placeholder key descriptions. For example, using `/user/:id`, `keys` will
* contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
*/
function pathToRegexp(path, keys, options) {
	if (path instanceof RegExp) return regexpToRegexp(path, keys);
	if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
	return stringToRegexp(path, keys, options);
}
var encoder = new TextEncoder();
var IS_PATCHED_MODULE = Symbol("isPatchedModule");
function canParseUrl(url) {
	try {
		new URL(url);
		return true;
	} catch (_error) {
		return false;
	}
}
function getValueBySymbol(symbolName, source) {
	const ownSymbols = Object.getOwnPropertySymbols(source);
	const symbol = ownSymbols.find((symbol2) => {
		return symbol2.description === symbolName;
	});
	if (symbol) return Reflect.get(source, symbol);
	return;
}
var _FetchResponse = class extends Response {
	static isConfigurableStatusCode(status) {
		return status >= 200 && status <= 599;
	}
	static isRedirectResponse(status) {
		return _FetchResponse.STATUS_CODES_WITH_REDIRECT.includes(status);
	}
	/**
	* Returns a boolean indicating whether the given response status
	* code represents a response that can have a body.
	*/
	static isResponseWithBody(status) {
		return !_FetchResponse.STATUS_CODES_WITHOUT_BODY.includes(status);
	}
	static setUrl(url, response) {
		if (!url || url === "about:" || !canParseUrl(url)) return;
		const state = getValueBySymbol("state", response);
		if (state) state.urlList.push(new URL(url));
		else Object.defineProperty(response, "url", {
			value: url,
			enumerable: true,
			configurable: true,
			writable: false
		});
	}
	/**
	* Parses the given raw HTTP headers into a Fetch API `Headers` instance.
	*/
	static parseRawHeaders(rawHeaders) {
		const headers = new Headers();
		for (let line = 0; line < rawHeaders.length; line += 2) headers.append(rawHeaders[line], rawHeaders[line + 1]);
		return headers;
	}
	constructor(body, init = {}) {
		var _a$1;
		const status = (_a$1 = init.status) != null ? _a$1 : 200;
		const safeStatus = _FetchResponse.isConfigurableStatusCode(status) ? status : 200;
		const finalBody = _FetchResponse.isResponseWithBody(status) ? body : null;
		super(finalBody, {
			status: safeStatus,
			statusText: init.statusText,
			headers: init.headers
		});
		if (status !== safeStatus) {
			const state = getValueBySymbol("state", this);
			if (state) state.status = status;
			else Object.defineProperty(this, "status", {
				value: status,
				enumerable: true,
				configurable: true,
				writable: false
			});
		}
		_FetchResponse.setUrl(init.url, this);
	}
};
var FetchResponse = _FetchResponse;
/**
* Response status codes for responses that cannot have body.
* @see https://fetch.spec.whatwg.org/#statuses
*/
FetchResponse.STATUS_CODES_WITHOUT_BODY = [
	101,
	103,
	204,
	205,
	304
];
FetchResponse.STATUS_CODES_WITH_REDIRECT = [
	301,
	302,
	303,
	307,
	308
];
var kRawRequest = Symbol("kRawRequest");
function getCleanUrl(url, isAbsolute = true) {
	return [isAbsolute && url.origin, url.pathname].filter(Boolean).join("");
}
const REDUNDANT_CHARACTERS_EXP = /[\?|#].*$/g;
function getSearchParams(path) {
	return new URL(`/${path}`, "http://localhost").searchParams;
}
function cleanUrl(path) {
	if (path.endsWith("?")) return path;
	return path.replace(REDUNDANT_CHARACTERS_EXP, "");
}
function isAbsoluteUrl(url) {
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}
function getAbsoluteUrl(path, baseUrl) {
	if (isAbsoluteUrl(path)) return path;
	if (path.startsWith("*")) return path;
	const origin = baseUrl || typeof location !== "undefined" && location.href;
	return origin ? decodeURI(new URL(encodeURI(path), origin).href) : path;
}
function normalizePath(path, baseUrl) {
	if (path instanceof RegExp) return path;
	const maybeAbsoluteUrl = getAbsoluteUrl(path, baseUrl);
	return cleanUrl(maybeAbsoluteUrl);
}
function coercePath(path) {
	return path.replace(/([:a-zA-Z_-]*)(\*{1,2})+/g, (_, parameterName, wildcard) => {
		const expression = "(.*)";
		if (!parameterName) return expression;
		return parameterName.startsWith(":") ? `${parameterName}${wildcard}` : `${parameterName}${expression}`;
	}).replace(/([^\/])(:)(?=\d+)/, "$1\\$2").replace(/^([^\/]+)(:)(?=\/\/)/, "$1\\$2");
}
function matchRequestUrl(url, path, baseUrl) {
	const normalizedPath = normalizePath(path, baseUrl);
	const cleanPath = typeof normalizedPath === "string" ? coercePath(normalizedPath) : normalizedPath;
	const cleanUrl$1 = getCleanUrl(url);
	const result = match(cleanPath, { decode: decodeURIComponent })(cleanUrl$1);
	const params = result && result.params || {};
	return {
		matches: result !== false,
		params
	};
}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require$2() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var require_cookie = __commonJS({ "node_modules/cookie/index.js"(exports) {
	"use strict";
	exports.parse = parse$1;
	exports.serialize = serialize;
	var __toString = Object.prototype.toString;
	var __hasOwnProperty = Object.prototype.hasOwnProperty;
	var cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
	var cookieValueRegExp = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/;
	var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
	var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
	function parse$1(str, opt) {
		if (typeof str !== "string") throw new TypeError("argument str must be a string");
		var obj = {};
		var len = str.length;
		if (len < 2) return obj;
		var dec = opt && opt.decode || decode;
		var index = 0;
		var eqIdx = 0;
		var endIdx = 0;
		do {
			eqIdx = str.indexOf("=", index);
			if (eqIdx === -1) break;
			endIdx = str.indexOf(";", index);
			if (endIdx === -1) endIdx = len;
			else if (eqIdx > endIdx) {
				index = str.lastIndexOf(";", eqIdx - 1) + 1;
				continue;
			}
			var keyStartIdx = startIndex(str, index, eqIdx);
			var keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
			var key = str.slice(keyStartIdx, keyEndIdx);
			if (!__hasOwnProperty.call(obj, key)) {
				var valStartIdx = startIndex(str, eqIdx + 1, endIdx);
				var valEndIdx = endIndex(str, endIdx, valStartIdx);
				if (str.charCodeAt(valStartIdx) === 34 && str.charCodeAt(valEndIdx - 1) === 34) {
					valStartIdx++;
					valEndIdx--;
				}
				var val = str.slice(valStartIdx, valEndIdx);
				obj[key] = tryDecode(val, dec);
			}
			index = endIdx + 1;
		} while (index < len);
		return obj;
	}
	function startIndex(str, index, max) {
		do {
			var code = str.charCodeAt(index);
			if (code !== 32 && code !== 9) return index;
		} while (++index < max);
		return max;
	}
	function endIndex(str, index, min) {
		while (index > min) {
			var code = str.charCodeAt(--index);
			if (code !== 32 && code !== 9) return index + 1;
		}
		return min;
	}
	function serialize(name, val, opt) {
		var enc = opt && opt.encode || encodeURIComponent;
		if (typeof enc !== "function") throw new TypeError("option encode is invalid");
		if (!cookieNameRegExp.test(name)) throw new TypeError("argument name is invalid");
		var value = enc(val);
		if (!cookieValueRegExp.test(value)) throw new TypeError("argument val is invalid");
		var str = name + "=" + value;
		if (!opt) return str;
		if (null != opt.maxAge) {
			var maxAge = Math.floor(opt.maxAge);
			if (!isFinite(maxAge)) throw new TypeError("option maxAge is invalid");
			str += "; Max-Age=" + maxAge;
		}
		if (opt.domain) {
			if (!domainValueRegExp.test(opt.domain)) throw new TypeError("option domain is invalid");
			str += "; Domain=" + opt.domain;
		}
		if (opt.path) {
			if (!pathValueRegExp.test(opt.path)) throw new TypeError("option path is invalid");
			str += "; Path=" + opt.path;
		}
		if (opt.expires) {
			var expires = opt.expires;
			if (!isDate(expires) || isNaN(expires.valueOf())) throw new TypeError("option expires is invalid");
			str += "; Expires=" + expires.toUTCString();
		}
		if (opt.httpOnly) str += "; HttpOnly";
		if (opt.secure) str += "; Secure";
		if (opt.partitioned) str += "; Partitioned";
		if (opt.priority) {
			var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
			switch (priority) {
				case "low":
					str += "; Priority=Low";
					break;
				case "medium":
					str += "; Priority=Medium";
					break;
				case "high":
					str += "; Priority=High";
					break;
				default: throw new TypeError("option priority is invalid");
			}
		}
		if (opt.sameSite) {
			var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
			switch (sameSite) {
				case true:
					str += "; SameSite=Strict";
					break;
				case "lax":
					str += "; SameSite=Lax";
					break;
				case "strict":
					str += "; SameSite=Strict";
					break;
				case "none":
					str += "; SameSite=None";
					break;
				default: throw new TypeError("option sameSite is invalid");
			}
		}
		return str;
	}
	function decode(str) {
		return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
	}
	function isDate(val) {
		return __toString.call(val) === "[object Date]";
	}
	function tryDecode(str, decode2) {
		try {
			return decode2(str);
		} catch (e) {
			return str;
		}
	}
} });
var import_cookie = __toESM(require_cookie(), 1);
var source_default = import_cookie.default;
/*! Bundled license information:

cookie/index.js:
(*!
* cookie
* Copyright(c) 2012-2014 Roman Shtylman
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*)
*/
function parseCookies(input) {
	const parsedCookies = source_default.parse(input);
	const cookies = {};
	for (const cookieName in parsedCookies) if (typeof parsedCookies[cookieName] !== "undefined") cookies[cookieName] = parsedCookies[cookieName];
	return cookies;
}
function getAllDocumentCookies() {
	return parseCookies(document.cookie);
}
function getDocumentCookies(request) {
	if (typeof document === "undefined" || typeof location === "undefined") return {};
	switch (request.credentials) {
		case "same-origin": {
			const requestUrl = new URL(request.url);
			return location.origin === requestUrl.origin ? getAllDocumentCookies() : {};
		}
		case "include": return getAllDocumentCookies();
		default: return {};
	}
}
function getAllRequestCookies(request) {
	const requestCookieHeader = request.headers.get("cookie");
	const cookiesFromHeaders = requestCookieHeader ? parseCookies(requestCookieHeader) : {};
	const cookiesFromDocument = getDocumentCookies(request);
	for (const name in cookiesFromDocument) request.headers.append("cookie", source_default.serialize(name, cookiesFromDocument[name]));
	const cookiesFromStore = cookieStore.getCookiesSync(request.url);
	const storedCookiesObject = Object.fromEntries(cookiesFromStore.map((cookie) => [cookie.key, cookie.value]));
	for (const cookie of cookiesFromStore) request.headers.append("cookie", cookie.toString());
	return {
		...cookiesFromDocument,
		...storedCookiesObject,
		...cookiesFromHeaders
	};
}
var HttpMethods = /* @__PURE__ */ ((HttpMethods2) => {
	HttpMethods2["HEAD"] = "HEAD";
	HttpMethods2["GET"] = "GET";
	HttpMethods2["POST"] = "POST";
	HttpMethods2["PUT"] = "PUT";
	HttpMethods2["PATCH"] = "PATCH";
	HttpMethods2["OPTIONS"] = "OPTIONS";
	HttpMethods2["DELETE"] = "DELETE";
	return HttpMethods2;
})(HttpMethods || {});
var HttpHandler = class extends RequestHandler {
	constructor(method, path, resolver, options) {
		super({
			info: {
				header: `${method} ${path}`,
				path,
				method
			},
			resolver,
			options
		});
		this.checkRedundantQueryParameters();
	}
	checkRedundantQueryParameters() {
		const { method, path } = this.info;
		if (path instanceof RegExp) return;
		const url = cleanUrl(path);
		if (url === path) return;
		const searchParams = getSearchParams(path);
		const queryParams = [];
		searchParams.forEach((_, paramName) => {
			queryParams.push(paramName);
		});
		devUtils.warn(`Found a redundant usage of query parameters in the request handler URL for "${method} ${path}". Please match against a path instead and access query parameters using "new URL(request.url).searchParams" instead. Learn more: https://mswjs.io/docs/http/intercepting-requestsquery-parameters`);
	}
	async parse(args) {
		var _args$resolutionConte;
		const url = new URL(args.request.url);
		const match$1 = matchRequestUrl(url, this.info.path, (_args$resolutionConte = args.resolutionContext) === null || _args$resolutionConte === void 0 ? void 0 : _args$resolutionConte.baseUrl);
		const cookies = getAllRequestCookies(args.request);
		return {
			match: match$1,
			cookies
		};
	}
	predicate(args) {
		const hasMatchingMethod = this.matchMethod(args.request.method);
		const hasMatchingUrl = args.parsedResult.match.matches;
		return hasMatchingMethod && hasMatchingUrl;
	}
	matchMethod(actualMethod) {
		return this.info.method instanceof RegExp ? this.info.method.test(actualMethod) : isStringEqual(this.info.method, actualMethod);
	}
	extendResolverArgs(args) {
		var _args$parsedResult$ma;
		return {
			params: ((_args$parsedResult$ma = args.parsedResult.match) === null || _args$parsedResult$ma === void 0 ? void 0 : _args$parsedResult$ma.params) || {},
			cookies: args.parsedResult.cookies
		};
	}
	async log(args) {
		const publicUrl = toPublicUrl(args.request.url);
		const loggedRequest = await serializeRequest(args.request);
		const loggedResponse = await serializeResponse(args.response);
		const statusColor = getStatusCodeColor(loggedResponse.status);
		console.groupCollapsed(devUtils.formatMessage(`${getTimestamp()} ${args.request.method} ${publicUrl} (%c${loggedResponse.status} ${loggedResponse.statusText}%c)`), `color:${statusColor}`, "color:inherit");
		console.log("Request", loggedRequest);
		console.log("Handler:", this);
		console.log("Response", loggedResponse);
		console.groupEnd();
	}
};
function createHttpHandler(method) {
	return (path, resolver, options = {}) => {
		return new HttpHandler(method, path, resolver, options);
	};
}
const http = {
	all: createHttpHandler(/.+/),
	head: createHttpHandler(HttpMethods.HEAD),
	get: createHttpHandler(HttpMethods.GET),
	post: createHttpHandler(HttpMethods.POST),
	put: createHttpHandler(HttpMethods.PUT),
	delete: createHttpHandler(HttpMethods.DELETE),
	patch: createHttpHandler(HttpMethods.PATCH),
	options: createHttpHandler(HttpMethods.OPTIONS)
};
const bodyType = Symbol("bodyType");
var HttpResponse = class HttpResponse extends FetchResponse {
	constructor(body, init) {
		const responseInit = normalizeResponseInit(init);
		super(body, responseInit);
		babelHelpers.defineProperty(this, bodyType, null);
		decorateResponse(this, responseInit);
	}
	static error() {
		return super.error();
	}
	/**
	* Create a `Response` with a `Content-Type: "text/plain"` body.
	* @example
	* HttpResponse.text('hello world')
	* HttpResponse.text('Error', { status: 500 })
	*/
	static text(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "text/plain");
		if (!responseInit.headers.has("Content-Length")) responseInit.headers.set("Content-Length", body ? new Blob([body]).size.toString() : "0");
		return new HttpResponse(body, responseInit);
	}
	/**
	* Create a `Response` with a `Content-Type: "application/json"` body.
	* @example
	* HttpResponse.json({ firstName: 'John' })
	* HttpResponse.json({ error: 'Not Authorized' }, { status: 401 })
	*/
	static json(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "application/json");
		const responseText = JSON.stringify(body);
		if (!responseInit.headers.has("Content-Length")) responseInit.headers.set("Content-Length", responseText ? new Blob([responseText]).size.toString() : "0");
		return new HttpResponse(responseText, responseInit);
	}
	/**
	* Create a `Response` with a `Content-Type: "application/xml"` body.
	* @example
	* HttpResponse.xml(`<user name="John" />`)
	* HttpResponse.xml(`<article id="abc-123" />`, { status: 201 })
	*/
	static xml(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "text/xml");
		return new HttpResponse(body, responseInit);
	}
	/**
	* Create a `Response` with a `Content-Type: "text/html"` body.
	* @example
	* HttpResponse.html(`<p class="author">Jane Doe</p>`)
	* HttpResponse.html(`<main id="abc-123">Main text</main>`, { status: 201 })
	*/
	static html(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "text/html");
		return new HttpResponse(body, responseInit);
	}
	/**
	* Create a `Response` with an `ArrayBuffer` body.
	* @example
	* const buffer = new ArrayBuffer(3)
	* const view = new Uint8Array(buffer)
	* view.set([1, 2, 3])
	*
	* HttpResponse.arrayBuffer(buffer)
	*/
	static arrayBuffer(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "application/octet-stream");
		if (body && !responseInit.headers.has("Content-Length")) responseInit.headers.set("Content-Length", body.byteLength.toString());
		return new HttpResponse(body, responseInit);
	}
	/**
	* Create a `Response` with a `FormData` body.
	* @example
	* const data = new FormData()
	* data.set('name', 'Alice')
	*
	* HttpResponse.formData(data)
	*/
	static formData(body, init) {
		return new HttpResponse(body, normalizeResponseInit(init));
	}
};
var items_default = /* @__PURE__ */ JSON.parse("[{\"title\":\"방충망 미세먼지 롤 창문 모기장 DIY 100cmx10cm\",\"link\":\"https://smartstore.naver.com/main/products/668979777\",\"image\":\"https://shopping-phinf.pstatic.net/main_1112415/11124150101.10.jpg\",\"lprice\":\"450\",\"hprice\":\"\",\"mallName\":\"동백물산\",\"productId\":\"11124150101\",\"productType\":\"2\",\"brand\":\"메쉬코리아\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"일체형 자석 방충망 현관 베란다 창문 안방 모기장 베이직 90X210\",\"link\":\"https://smartstore.naver.com/main/products/2788117408\",\"image\":\"https://shopping-phinf.pstatic.net/main_8028586/80285861246.19.jpg\",\"lprice\":\"9900\",\"hprice\":\"\",\"mallName\":\"다샵\",\"productId\":\"80285861246\",\"productType\":\"2\",\"brand\":\"다샵\",\"maker\":\"다샵\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"고농축 알칼리세탁세제 3L 4개 빨래 찌든때 수건 쉰내 냄새제거 실내건조 일반드럼용\",\"link\":\"https://smartstore.naver.com/main/products/6638551514\",\"image\":\"https://shopping-phinf.pstatic.net/main_8418305/84183051836.2.jpg\",\"lprice\":\"20900\",\"hprice\":\"\",\"mallName\":\"기웅생활건강\",\"productId\":\"84183051836\",\"productType\":\"2\",\"brand\":\"쥬블릭\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"원캠 스마트 무선 현관 CCTV 실시간 가정용 홈캠 홈 스마트폰 현관문 카메라\",\"link\":\"https://smartstore.naver.com/main/products/5258986017\",\"image\":\"https://shopping-phinf.pstatic.net/main_8280350/82803508510.4.jpg\",\"lprice\":\"98000\",\"hprice\":\"\",\"mallName\":\"원캠\",\"productId\":\"82803508510\",\"productType\":\"2\",\"brand\":\"원캠\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"리빙위키 현관 방충망 롤방충망 자동 현관문 출입문 방충문 모기장 일반형 셀프교체시공 무재단\",\"link\":\"https://smartstore.naver.com/main/products/290112144\",\"image\":\"https://shopping-phinf.pstatic.net/main_8440812/8440812714.4.jpg\",\"lprice\":\"51900\",\"hprice\":\"\",\"mallName\":\"리빙홈데코\",\"productId\":\"8440812714\",\"productType\":\"2\",\"brand\":\"리빙홈데코\",\"maker\":\"리빙홈데코\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"미세방충망 자석식 기능성 현관 모기장 현관문 방충문 블랙 일반망 시즌1 90x210cm\",\"link\":\"https://smartstore.naver.com/main/products/6711324501\",\"image\":\"https://shopping-phinf.pstatic.net/main_8425582/84255824823.3.jpg\",\"lprice\":\"15900\",\"hprice\":\"\",\"mallName\":\"폴라도레\",\"productId\":\"84255824823\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"넓고 튼튼한 원터치 모기장 텐트 사각 침대 아기 슈퍼싱글 SS\",\"link\":\"https://smartstore.naver.com/main/products/8436263806\",\"image\":\"https://shopping-phinf.pstatic.net/main_8598076/85980764129.3.jpg\",\"lprice\":\"29900\",\"hprice\":\"\",\"mallName\":\"베베데코\",\"productId\":\"85980764129\",\"productType\":\"2\",\"brand\":\"베베데코\",\"maker\":\"베베데코\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"금동이 1인용 침대모기장 천 원터치모기장 텐트 방충망 접이식 슈퍼싱글화이트\",\"link\":\"https://smartstore.naver.com/main/products/134970527\",\"image\":\"https://shopping-phinf.pstatic.net/main_6858338/6858338014.12.jpg\",\"lprice\":\"13800\",\"hprice\":\"\",\"mallName\":\"금동이샵\",\"productId\":\"6858338014\",\"productType\":\"2\",\"brand\":\"금동이\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"코디 순수 3겹 데코 화장지 30롤 30m 두루마리 휴지 물에잘녹는 비데\",\"link\":\"https://smartstore.naver.com/main/products/5597975808\",\"image\":\"https://shopping-phinf.pstatic.net/main_8314247/83142472148.5.jpg\",\"lprice\":\"7690\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"83142472148\",\"productType\":\"2\",\"brand\":\"CODI\",\"maker\":\"쌍용씨앤비\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"롤화장지\"},{\"title\":\"물먹는하마 옷장용 /피죤 숯 습기제로 /제습제 /습기제거제\",\"link\":\"https://www.11st.co.kr/connect/Gateway.tmall?method=Xsite&prdNo=56193030&tid=1000000061\",\"image\":\"https://shopping-phinf.pstatic.net/main_8626618/8626618755.4.jpg\",\"lprice\":\"11510\",\"hprice\":\"\",\"mallName\":\"11번가\",\"productId\":\"8626618755\",\"productType\":\"2\",\"brand\":\"물먹는하마\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"생활공작소 대용량제습제 옷장제습제 화장실제습제 24개\",\"link\":\"https://smartstore.naver.com/main/products/4905164407\",\"image\":\"https://shopping-phinf.pstatic.net/main_8244968/82449688071.14.jpg\",\"lprice\":\"20900\",\"hprice\":\"\",\"mallName\":\"주식회사 생활공작소\",\"productId\":\"82449688071\",\"productType\":\"2\",\"brand\":\"생활공작소\",\"maker\":\"SGC\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"큐폴드 접이식카트 폴딩박스 세트 기본형 장바구니캐리어 4바퀴 핸드 쇼핑\",\"link\":\"https://smartstore.naver.com/main/products/5789875556\",\"image\":\"https://shopping-phinf.pstatic.net/main_8333437/83334374970.5.jpg\",\"lprice\":\"69900\",\"hprice\":\"\",\"mallName\":\"큐폴드 QFOLD\",\"productId\":\"83334374970\",\"productType\":\"2\",\"brand\":\"큐폴드\",\"maker\":\"파인드프로덕츠\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"핸드카트\"},{\"title\":\"깨끗한나라 순수프리미엄 화장지 30롤 3겹 33m 두루마리 휴지 물에잘녹는 무형광\",\"link\":\"https://smartstore.naver.com/main/products/5154348621\",\"image\":\"https://shopping-phinf.pstatic.net/main_8269886/82698869544.10.jpg\",\"lprice\":\"12380\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"82698869544\",\"productType\":\"2\",\"brand\":\"깨끗한나라\",\"maker\":\"깨끗한나라\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"롤화장지\"},{\"title\":\"클라씨 굿바이 모기장 1인용 원터치 대형 텐트 침대 1인 싱글 슈퍼싱글\",\"link\":\"https://smartstore.naver.com/main/products/5577999749\",\"image\":\"https://shopping-phinf.pstatic.net/main_8312249/83122495821.2.jpg\",\"lprice\":\"21900\",\"hprice\":\"\",\"mallName\":\"클라씨\",\"productId\":\"83122495821\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"헤이홈 홈카메라 PRO 스마트 홈캠 펫캠 가정용 cctv 아기 강아지 베이비캠\",\"link\":\"https://smartstore.naver.com/main/products/4947669459\",\"image\":\"https://shopping-phinf.pstatic.net/main_8249218/82492189459.82.jpg\",\"lprice\":\"59900\",\"hprice\":\"\",\"mallName\":\"에디트홈\",\"productId\":\"82492189459\",\"productType\":\"2\",\"brand\":\"헤이홈\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"크리넥스 데코앤소프트 3겹 화장지 30롤 2팩 두루마리휴지 물에잘녹는 무형광 집들이 수딩플러스\",\"link\":\"https://smartstore.naver.com/main/products/10609054397\",\"image\":\"https://shopping-phinf.pstatic.net/main_8815355/88153559987.5.jpg\",\"lprice\":\"29900\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"88153559987\",\"productType\":\"2\",\"brand\":\"크리넥스\",\"maker\":\"유한킴벌리\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"롤화장지\"},{\"title\":\"스탠리 텀블러 887ml 퀜처 H2.0 플로우스테이트 대용량 손잡이 빨대 텀블러\",\"link\":\"https://smartstore.naver.com/main/products/9662667559\",\"image\":\"https://shopping-phinf.pstatic.net/main_8720716/87207169829.5.jpg\",\"lprice\":\"51900\",\"hprice\":\"\",\"mallName\":\"치포마켓\",\"productId\":\"87207169829\",\"productType\":\"2\",\"brand\":\"스탠리\",\"maker\":\"스탠리\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"잔/컵\",\"category4\":\"텀블러\"},{\"title\":\"BAS 바스 탈취제 핑크 160g ( 방 실내 화장실 냄새제거제 )\",\"link\":\"https://smartstore.naver.com/main/products/11135755263\",\"image\":\"https://shopping-phinf.pstatic.net/main_8868026/88680265585.5.jpg\",\"lprice\":\"15800\",\"hprice\":\"\",\"mallName\":\"BAS 공식 스토어\",\"productId\":\"88680265585\",\"productType\":\"2\",\"brand\":\"BAS\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"실내탈취제\"},{\"title\":\"살림백서 제습제 습기제거제 520ml 24개 옷장 화장실 선반 염화칼슘\",\"link\":\"https://smartstore.naver.com/main/products/4439990594\",\"image\":\"https://shopping-phinf.pstatic.net/main_8198451/81984513302.11.jpg\",\"lprice\":\"19900\",\"hprice\":\"\",\"mallName\":\"살림백서\",\"productId\":\"81984513302\",\"productType\":\"2\",\"brand\":\"살림백서\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"에코버 식기세척기세제 뉴올인원 20g x 22개입, 2개\",\"link\":\"https://search.shopping.naver.com/catalog/52271232632\",\"image\":\"https://shopping-phinf.pstatic.net/main_5227123/52271232632.20250103175308.jpg\",\"lprice\":\"19800\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"52271232632\",\"productType\":\"1\",\"brand\":\"에코버\",\"maker\":\"에코버\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"식기세척기전용세제\"},{\"title\":\"더티린넨 탈취제 화장실 담배 집안 실내 홀애비 남자 방 냄새 제거\",\"link\":\"https://smartstore.naver.com/main/products/10103216163\",\"image\":\"https://shopping-phinf.pstatic.net/main_8764771/87647718933.6.jpg\",\"lprice\":\"19300\",\"hprice\":\"\",\"mallName\":\"더티린넨\",\"productId\":\"87647718933\",\"productType\":\"2\",\"brand\":\"더티린넨\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"실내탈취제\"},{\"title\":\"풍지판 창문 틈새막이 샷시 바람막이 창틀 벌레차단 외풍차단\",\"link\":\"https://smartstore.naver.com/main/products/261719599\",\"image\":\"https://shopping-phinf.pstatic.net/main_8131970/8131970722.30.jpg\",\"lprice\":\"1690\",\"hprice\":\"\",\"mallName\":\"리빙포유\",\"productId\":\"8131970722\",\"productType\":\"2\",\"brand\":\"리빙포유\",\"maker\":\"세일인터내셔널\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"문풍지\"},{\"title\":\"로티 로티홈시스 네모 프리미엄 쇼핑 접이식 카트 L(대형), 그린\",\"link\":\"https://search.shopping.naver.com/catalog/53787418966\",\"image\":\"https://shopping-phinf.pstatic.net/main_5378741/53787418966.20250328134126.jpg\",\"lprice\":\"34400\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53787418966\",\"productType\":\"1\",\"brand\":\"로티홈시스\",\"maker\":\"로티\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"핸드카트\"},{\"title\":\"범일금고 OARC 스마트 금고\",\"link\":\"https://search.shopping.naver.com/catalog/39892144618\",\"image\":\"https://shopping-phinf.pstatic.net/main_3989214/39892144618.20240703161839.jpg\",\"lprice\":\"496290\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"39892144618\",\"productType\":\"1\",\"brand\":\"범일금고\",\"maker\":\"범일금고\",\"category1\":\"생활/건강\",\"category2\":\"문구/사무용품\",\"category3\":\"사무기기\",\"category4\":\"금고\"},{\"title\":\"디오 원터치 모기장 텐트 침대 대형 바닥겸용 화이트 1인용\",\"link\":\"https://smartstore.naver.com/main/products/381096764\",\"image\":\"https://shopping-phinf.pstatic.net/main_1401625/14016258981.7.jpg\",\"lprice\":\"12900\",\"hprice\":\"\",\"mallName\":\"디오컴퍼니\",\"productId\":\"14016258981\",\"productType\":\"2\",\"brand\":\"디오침구\",\"maker\":\"디오컴퍼니\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"쌍용씨앤비 CODI 순수한 데코 3겹 30m 30롤, 30롤, 3팩\",\"link\":\"https://search.shopping.naver.com/catalog/52187341621\",\"image\":\"https://shopping-phinf.pstatic.net/main_5218734/52187341621.20250425091125.jpg\",\"lprice\":\"23400\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"52187341621\",\"productType\":\"1\",\"brand\":\"CODI\",\"maker\":\"쌍용씨앤비\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"롤화장지\"},{\"title\":\"홈매트 리퀴드 코드형+리필 45일 액체 액상 전자 모기향 모기약 훈증기\",\"link\":\"https://smartstore.naver.com/main/products/5395877516\",\"image\":\"https://shopping-phinf.pstatic.net/main_8294037/82940371042.9.jpg\",\"lprice\":\"9980\",\"hprice\":\"\",\"mallName\":\"해브어굿팜\",\"productId\":\"82940371042\",\"productType\":\"2\",\"brand\":\"홈매트\",\"maker\":\"헨켈\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"리퀴드\"},{\"title\":\"홈키파 홈매트 리퀴드 훈증기2 리필4 무향 제로 맥스 코스트코 전자 모기향\",\"link\":\"https://smartstore.naver.com/main/products/10227792455\",\"image\":\"https://shopping-phinf.pstatic.net/main_8777229/87772296006.jpg\",\"lprice\":\"21970\",\"hprice\":\"\",\"mallName\":\"코스트유\",\"productId\":\"87772296006\",\"productType\":\"2\",\"brand\":\"홈매트\",\"maker\":\"헨켈\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"리퀴드\"},{\"title\":\"생활공작소 실리카겔제습제 옷장제습제 서랍제습제 20개\",\"link\":\"https://smartstore.naver.com/main/products/4573567912\",\"image\":\"https://shopping-phinf.pstatic.net/main_8211808/82118088066.9.jpg\",\"lprice\":\"11500\",\"hprice\":\"\",\"mallName\":\"주식회사 생활공작소\",\"productId\":\"82118088066\",\"productType\":\"2\",\"brand\":\"생활공작소\",\"maker\":\"올덴\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"넬리 알칼리 드럼세탁기세제 가루 코스트코 100회+세탁망 땀냄새 빨래쉰내제거 탄산소다\",\"link\":\"https://smartstore.naver.com/main/products/5250558586\",\"image\":\"https://shopping-phinf.pstatic.net/main_8279508/82795081064.24.jpg\",\"lprice\":\"22900\",\"hprice\":\"\",\"mallName\":\"설아네마켓\",\"productId\":\"82795081064\",\"productType\":\"2\",\"brand\":\"NELLIE'S\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"블루워시 캡슐 세탁세제 30개입, 시그니처코튼, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/53370594688\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337059/53370594688.20250305111654.jpg\",\"lprice\":\"18900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53370594688\",\"productType\":\"1\",\"brand\":\"블루워시\",\"maker\":\"블루워시\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"날파리 퇴치 초파리 트랩 뿌리파리 벌레 파리 벼룩파리 끈끈이 플라이스틱\",\"link\":\"https://smartstore.naver.com/main/products/6792117787\",\"image\":\"https://shopping-phinf.pstatic.net/main_8433661/84336618109.2.jpg\",\"lprice\":\"2700\",\"hprice\":\"\",\"mallName\":\"메디데이\",\"productId\":\"84336618109\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"끈끈이\"},{\"title\":\"이븐도우 생귄 베톰 명품 차량용 방향제\",\"link\":\"https://search.shopping.naver.com/catalog/45917416618\",\"image\":\"https://shopping-phinf.pstatic.net/main_4591741/45917416618.20250619163618.jpg\",\"lprice\":\"28600\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"45917416618\",\"productType\":\"1\",\"brand\":\"생귄\",\"maker\":\"이븐도우\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"공기청정용품\",\"category4\":\"차량용방향제\"},{\"title\":\"5차 실외 CCTV IP카메라 외부 감시카메라 방범용 매장 농막 CCTV 무선 와이파이\",\"link\":\"https://smartstore.naver.com/main/products/5892853018\",\"image\":\"https://shopping-phinf.pstatic.net/main_8343735/83437352480.14.jpg\",\"lprice\":\"79000\",\"hprice\":\"\",\"mallName\":\"MOESO\",\"productId\":\"83437352480\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"오캠 현관CCTV IP카메라 무선CCTV 가정용 홈CCTV 방범용\",\"link\":\"https://smartstore.naver.com/main/products/9769573610\",\"image\":\"https://shopping-phinf.pstatic.net/main_8731407/87314075883.6.jpg\",\"lprice\":\"89000\",\"hprice\":\"\",\"mallName\":\"오캠시시티비와이파이집문앞캠\",\"productId\":\"87314075883\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"탈부착 방충망 자석쫄대 방풍비닐 창문방충망 셀프시공 DIY 백색 100cm\",\"link\":\"https://smartstore.naver.com/main/products/2042376373\",\"image\":\"https://shopping-phinf.pstatic.net/main_1179488/11794889307.3.jpg\",\"lprice\":\"2190\",\"hprice\":\"\",\"mallName\":\"한반도철망\",\"productId\":\"11794889307\",\"productType\":\"2\",\"brand\":\"한반도철망\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"초소형 카메라 가정용 소형 무선 CCTV 적외선 홈캠 펫캠\",\"link\":\"https://smartstore.naver.com/main/products/8230148800\",\"image\":\"https://shopping-phinf.pstatic.net/main_8577464/85774649123.3.jpg\",\"lprice\":\"39800\",\"hprice\":\"\",\"mallName\":\"일레닉\",\"productId\":\"85774649123\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"마이키파 제로 이카리딘 20% 천연 임산부 뿌리는 모기기피제 기내반입 모기약 모기퇴치제\",\"link\":\"https://smartstore.naver.com/main/products/4891750057\",\"image\":\"https://shopping-phinf.pstatic.net/main_8243627/82436273591.10.jpg\",\"lprice\":\"7980\",\"hprice\":\"\",\"mallName\":\"컬러포\",\"productId\":\"82436273591\",\"productType\":\"2\",\"brand\":\"홈키파\",\"maker\":\"헨켈\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"에어졸/스프레이\"},{\"title\":\"삼정물산 왕타 백선생 베이직 칫솔 10개입, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/51929032506\",\"image\":\"https://shopping-phinf.pstatic.net/main_5192903/51929032506.20250206153651.jpg\",\"lprice\":\"15800\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"51929032506\",\"productType\":\"1\",\"brand\":\"왕타\",\"maker\":\"삼정물산\",\"category1\":\"생활/건강\",\"category2\":\"구강위생용품\",\"category3\":\"칫솔\",\"category4\":\"\"},{\"title\":\"슈랙 철제선반 조립식 앵글 베란다 선반 렉 창고 210210600 5단\",\"link\":\"https://smartstore.naver.com/main/products/9216202377\",\"image\":\"https://shopping-phinf.pstatic.net/main_8676070/86760702700.jpg\",\"lprice\":\"50600\",\"hprice\":\"\",\"mallName\":\"슈랙\",\"productId\":\"86760702700\",\"productType\":\"2\",\"brand\":\"슈랙\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"수납/정리용품\",\"category3\":\"선반/진열대\",\"category4\":\"스탠드선반/진열대\"},{\"title\":\"금동이 사각모기장 침대모기장 텐트 캠핑 캐노피 일반소형\",\"link\":\"https://smartstore.naver.com/main/products/134970521\",\"image\":\"https://shopping-phinf.pstatic.net/main_6858329/6858329603.8.jpg\",\"lprice\":\"15900\",\"hprice\":\"\",\"mallName\":\"금동이샵\",\"productId\":\"6858329603\",\"productType\":\"2\",\"brand\":\"금동이\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"모기퇴치제 모기기피제 3개\",\"link\":\"https://smartstore.naver.com/main/products/155202468\",\"image\":\"https://shopping-phinf.pstatic.net/main_7588748/7588748032.19.jpg\",\"lprice\":\"7900\",\"hprice\":\"\",\"mallName\":\"다팜메디\",\"productId\":\"7588748032\",\"productType\":\"2\",\"brand\":\"모스넷\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"에어졸/스프레이\"},{\"title\":\"벨크로 촘촘망 미세방충망 현관 롤 베란다 미세먼지 찍찍이 창문필터 모기장 제작 50X10\",\"link\":\"https://smartstore.naver.com/main/products/404981609\",\"image\":\"https://shopping-phinf.pstatic.net/main_9830472/9830472106.3.jpg\",\"lprice\":\"9900\",\"hprice\":\"\",\"mallName\":\"텍스토머\",\"productId\":\"9830472106\",\"productType\":\"2\",\"brand\":\"텍스토머\",\"maker\":\"텍스토머\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"다후아 500만화소 CCTV 설치 세트 실외 가정용 스마트폰 매장 야외 4채널 감시 카메라\",\"link\":\"https://smartstore.naver.com/main/products/6776045666\",\"image\":\"https://shopping-phinf.pstatic.net/main_8432054/84320545988.17.jpg\",\"lprice\":\"119900\",\"hprice\":\"\",\"mallName\":\"다봄씨엔에스\",\"productId\":\"84320545988\",\"productType\":\"2\",\"brand\":\"다후아\",\"maker\":\"다후아\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"다우니 실내건조 섬유유연제 엑스퍼트 초고농축 4L 코스트코 대용량 플러스 향좋은 향기좋은\",\"link\":\"https://smartstore.naver.com/main/products/5204078443\",\"image\":\"https://shopping-phinf.pstatic.net/main_8274860/82748600072.9.jpg\",\"lprice\":\"15100\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"82748600072\",\"productType\":\"2\",\"brand\":\"다우니\",\"maker\":\"P&G\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"섬유유연제\",\"category4\":\"고농축섬유유연제\"},{\"title\":\"대용량 텀블러 빨대텀블러 보온보냉텀블러 스텐 손잡이 운동 기념품 소\",\"link\":\"https://smartstore.naver.com/main/products/8702784236\",\"image\":\"https://shopping-phinf.pstatic.net/main_8624728/86247284559.26.jpg\",\"lprice\":\"13800\",\"hprice\":\"\",\"mallName\":\"1리터텀블러\",\"productId\":\"86247284559\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"잔/컵\",\"category4\":\"텀블러\"},{\"title\":\"담다 접이식카트 바퀴달린 장바구니캐리어 폴딩 시장바구니 손수레 쇼핑카트 4바퀴L 아이보리\",\"link\":\"https://smartstore.naver.com/main/products/4492877308\",\"image\":\"https://shopping-phinf.pstatic.net/main_8203740/82037400228.12.jpg\",\"lprice\":\"34800\",\"hprice\":\"\",\"mallName\":\"이소품\",\"productId\":\"82037400228\",\"productType\":\"2\",\"brand\":\"이소품\",\"maker\":\"이소품\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"핸드카트\"},{\"title\":\"헨켈 세탁세제 퍼실 캡슐 세제 디스크 실내건조 26개입 2개\",\"link\":\"https://smartstore.naver.com/main/products/6794730889\",\"image\":\"https://shopping-phinf.pstatic.net/main_8433923/84339231211.18.jpg\",\"lprice\":\"27000\",\"hprice\":\"\",\"mallName\":\"헨켈홈케어 공식몰\",\"productId\":\"84339231211\",\"productType\":\"2\",\"brand\":\"퍼실\",\"maker\":\"헨켈\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"로티 로티홈시스 플랫폼 쇼핑 접이식 카트, 실버\",\"link\":\"https://search.shopping.naver.com/catalog/53901375199\",\"image\":\"https://shopping-phinf.pstatic.net/main_5390137/53901375199.20250401184119.jpg\",\"lprice\":\"61400\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53901375199\",\"productType\":\"1\",\"brand\":\"로티홈시스\",\"maker\":\"로티\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"핸드카트\"},{\"title\":\"이글루 S8 1개\",\"link\":\"https://search.shopping.naver.com/catalog/54725183303\",\"image\":\"https://shopping-phinf.pstatic.net/main_5472518/54725183303.20250512175046.jpg\",\"lprice\":\"118500\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54725183303\",\"productType\":\"1\",\"brand\":\"이글루\",\"maker\":\"이글루\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"에어컨 세정제 세척제 청소 셀프 클리너 곰팡이 냄새 제거제 스프레이 330ml\",\"link\":\"https://smartstore.naver.com/main/products/4426750526\",\"image\":\"https://shopping-phinf.pstatic.net/main_8197127/81971273079.7.jpg\",\"lprice\":\"3000\",\"hprice\":\"\",\"mallName\":\"-에띠리얼-\",\"productId\":\"81971273079\",\"productType\":\"2\",\"brand\":\"산도깨비\",\"maker\":\"산도깨비\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"에어컨세정제\"},{\"title\":\"[1+1] 춘몽 섬유탈취제 섬유향수 룸스프레이 도플 패브릭 퍼퓸 217ml 블랑쉬\",\"link\":\"https://smartstore.naver.com/main/products/10555993438\",\"image\":\"https://shopping-phinf.pstatic.net/main_8810049/88100498921.11.jpg\",\"lprice\":\"21800\",\"hprice\":\"\",\"mallName\":\"춘몽\",\"productId\":\"88100498921\",\"productType\":\"2\",\"brand\":\"춘몽\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"섬유탈취스프레이\"},{\"title\":\"바퀴벌레약 맥스포스 셀렉트 이지겔 20g +먹이통 20개 바퀴벌레없애는법\",\"link\":\"https://smartstore.naver.com/main/products/4760148021\",\"image\":\"https://shopping-phinf.pstatic.net/main_8230466/82304669923.16.jpg\",\"lprice\":\"8700\",\"hprice\":\"\",\"mallName\":\"뉴트리케어\",\"productId\":\"82304669923\",\"productType\":\"2\",\"brand\":\"맥스포스\",\"maker\":\"바이엘크롭사이언스\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"겔\"},{\"title\":\"출입문 방충망 현관문 베란다 아파트 문 모기장 자석 방충문 화이트 90x210\",\"link\":\"https://smartstore.naver.com/main/products/6372161502\",\"image\":\"https://shopping-phinf.pstatic.net/main_8391666/83916661835.5.jpg\",\"lprice\":\"12700\",\"hprice\":\"\",\"mallName\":\"클라씨\",\"productId\":\"83916661835\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"랄라 접이식카트 박스 시장 장바구니캐리어 마트 핸드 쇼핑 폴딩카트 4바퀴L\",\"link\":\"https://smartstore.naver.com/main/products/4939028830\",\"image\":\"https://shopping-phinf.pstatic.net/main_8248355/82483553141.50.jpg\",\"lprice\":\"39800\",\"hprice\":\"\",\"mallName\":\"오늘도 랄라\",\"productId\":\"82483553141\",\"productType\":\"2\",\"brand\":\"랄라\",\"maker\":\"드림와이즈컴퍼니\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"핸드카트\"},{\"title\":\"방충망 셀프교체 미세먼지 롤 창문 모기장 알루미늄망 60cmX20cm\",\"link\":\"https://smartstore.naver.com/main/products/4814730329\",\"image\":\"https://shopping-phinf.pstatic.net/main_8235925/82359253087.18.jpg\",\"lprice\":\"420\",\"hprice\":\"\",\"mallName\":\"파머스홈\",\"productId\":\"82359253087\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"큐폴드 접이식카트 폴딩박스 세트 프로 장바구니캐리어 4바퀴 핸드 쇼핑\",\"link\":\"https://smartstore.naver.com/main/products/9122216199\",\"image\":\"https://shopping-phinf.pstatic.net/main_8666671/86666716522.jpg\",\"lprice\":\"77900\",\"hprice\":\"\",\"mallName\":\"큐폴드 QFOLD\",\"productId\":\"86666716522\",\"productType\":\"2\",\"brand\":\"큐폴드\",\"maker\":\"파인드프로덕츠\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"핸드카트\"},{\"title\":\"대용량 텀블러 보온 보냉텀블러 빨대 손잡이 스텐 텀블러 차량용 900ml\",\"link\":\"https://smartstore.naver.com/main/products/10526125099\",\"image\":\"https://shopping-phinf.pstatic.net/main_8807063/88070630459.2.jpg\",\"lprice\":\"13300\",\"hprice\":\"\",\"mallName\":\"타이소 코리아\",\"productId\":\"88070630459\",\"productType\":\"2\",\"brand\":\"TYESO\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"잔/컵\",\"category4\":\"텀블러\"},{\"title\":\"비오킬 500ml 빈대 벌레 좀벌레퇴치제 베드버그 진드기 살충제 해충 약 바이오킬+마스크\",\"link\":\"https://smartstore.naver.com/main/products/4674195277\",\"image\":\"https://shopping-phinf.pstatic.net/main_8221871/82218715992.15.jpg\",\"lprice\":\"7900\",\"hprice\":\"\",\"mallName\":\"다나아팜\",\"productId\":\"82218715992\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"동성제약\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"에어졸/스프레이\"},{\"title\":\"엔치약 잇몸 케어 천연 생약추출 알란토인 임산부 불소 없는 좋은 치약 N 앤치약\",\"link\":\"https://smartstore.naver.com/main/products/4094549653\",\"image\":\"https://shopping-phinf.pstatic.net/main_8163907/81639070502.8.jpg\",\"lprice\":\"12000\",\"hprice\":\"\",\"mallName\":\"자연팩토리\",\"productId\":\"81639070502\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"구강위생용품\",\"category3\":\"치약\",\"category4\":\"\"},{\"title\":\"방충망닷컴 무료재단 현관방충망 자동롤 국산 MS일반형1000X2100 방충문\",\"link\":\"https://smartstore.naver.com/main/products/5493666220\",\"image\":\"https://shopping-phinf.pstatic.net/main_8303816/83038161352.3.jpg\",\"lprice\":\"56000\",\"hprice\":\"\",\"mallName\":\"방충망 닷컴\",\"productId\":\"83038161352\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"접이식 쇼핑 카트 장바구니 캐리어 시장 세바퀴 접이식 손수레 핸드 카트 보급형\",\"link\":\"https://smartstore.naver.com/main/products/4130915605\",\"image\":\"https://shopping-phinf.pstatic.net/main_8167543/81675436659.11.jpg\",\"lprice\":\"38900\",\"hprice\":\"\",\"mallName\":\"지니고몰\",\"productId\":\"81675436659\",\"productType\":\"2\",\"brand\":\"지니고\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"핸드카트\"},{\"title\":\"팩앤롤 중형 접이식 쇼핑카트 장바구니 캐리어 폴딩카트 손수레 핸드카트\",\"link\":\"https://smartstore.naver.com/main/products/2125293206\",\"image\":\"https://shopping-phinf.pstatic.net/main_1207405/12074050645.4.jpg\",\"lprice\":\"12900\",\"hprice\":\"\",\"mallName\":\"SPIELL\",\"productId\":\"12074050645\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"스피엘\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"핸드카트\"},{\"title\":\"코스트코 커클랜드 휴지 3겹40m30롤1팩 화장지 두루마리휴지 물에잘녹는 무형광 프리미엄\",\"link\":\"https://smartstore.naver.com/main/products/4812652177\",\"image\":\"https://shopping-phinf.pstatic.net/main_8235717/82357174887.11.jpg\",\"lprice\":\"20750\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"82357174887\",\"productType\":\"2\",\"brand\":\"커클랜드\",\"maker\":\"유한킴벌리\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"롤화장지\"},{\"title\":\"1+1 수호천사파워 100ml 모기기피제 이카리딘15% 진드기 모기 퇴치제 유아 임산부\",\"link\":\"https://smartstore.naver.com/main/products/5312260037\",\"image\":\"https://shopping-phinf.pstatic.net/main_8285675/82856752499.8.jpg\",\"lprice\":\"8400\",\"hprice\":\"\",\"mallName\":\"영진팜\",\"productId\":\"82856752499\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"에어졸/스프레이\"},{\"title\":\"특허받은 USB 충전식 회전 전기 모기채 전자 파리채 해충퇴치 전기채\",\"link\":\"https://smartstore.naver.com/main/products/4503882155\",\"image\":\"https://shopping-phinf.pstatic.net/main_8204840/82048405103.14.jpg\",\"lprice\":\"19900\",\"hprice\":\"\",\"mallName\":\"레인보우 빅마켓\",\"productId\":\"82048405103\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"모기채/파리채\"},{\"title\":\"벅스델타 유제 1L 모기 퇴치제 벌레 집거미 베드버그 초파리 날파리 퇴치 나방파리 퇴치 방역 지네약 돈벌레 퇴치 유충 살충제 모기약\",\"link\":\"https://smartstore.naver.com/main/products/10198332758\",\"image\":\"https://shopping-phinf.pstatic.net/main_8774283/87742836219.7.jpg\",\"lprice\":\"28500\",\"hprice\":\"\",\"mallName\":\"닥터가드몰\",\"productId\":\"87742836219\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"에어졸/스프레이\"},{\"title\":\"포장용 롤 에어캡 뽁뽁이 0.2T 경포장용 20cm x 50M 1롤\",\"link\":\"https://smartstore.naver.com/main/products/5182465882\",\"image\":\"https://shopping-phinf.pstatic.net/main_8272698/82726987088.5.jpg\",\"lprice\":\"3500\",\"hprice\":\"\",\"mallName\":\"황금상사스토어\",\"productId\":\"82726987088\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"단열시트\"},{\"title\":\"사각모기장 침대모기장 텐트 야외모기장 캠핑 방충망 일반형 대형\",\"link\":\"https://smartstore.naver.com/main/products/8471665117\",\"image\":\"https://shopping-phinf.pstatic.net/main_8601616/86016165441.2.jpg\",\"lprice\":\"17900\",\"hprice\":\"\",\"mallName\":\"보스트라이프\",\"productId\":\"86016165441\",\"productType\":\"2\",\"brand\":\"금동이\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"모기장 원터치 접이식 침대 아기 텐트 캠핑 대형 싱글 1인용\",\"link\":\"https://smartstore.naver.com/main/products/5714893095\",\"image\":\"https://shopping-phinf.pstatic.net/main_8325939/83259391426.16.jpg\",\"lprice\":\"18800\",\"hprice\":\"\",\"mallName\":\"DR.아이텍\",\"productId\":\"83259391426\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"좀벌레싹 옷장 6개입 실버피쉬 옷장 벌레 좀벌레 퇴치제 퇴치법 퇴치약 좀약 트랩\",\"link\":\"https://smartstore.naver.com/main/products/8174326956\",\"image\":\"https://shopping-phinf.pstatic.net/main_8571882/85718827279.4.jpg\",\"lprice\":\"14900\",\"hprice\":\"\",\"mallName\":\"컬러포\",\"productId\":\"85718827279\",\"productType\":\"2\",\"brand\":\"컴배트\",\"maker\":\"헨켈\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"방충제\"},{\"title\":\"엔케이롤 현관 방충망 롤방충망 현관문 자동롤 모기장 무절단 회색 1000x2100 일반형\",\"link\":\"https://smartstore.naver.com/main/products/294104711\",\"image\":\"https://shopping-phinf.pstatic.net/main_8489905/8489905757.10.jpg\",\"lprice\":\"54500\",\"hprice\":\"\",\"mallName\":\"NK테크코리아\",\"productId\":\"8489905757\",\"productType\":\"2\",\"brand\":\"엔케이롤\",\"maker\":\"NK테크\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"크리넥스 데코앤소프트 특별기획 3겹 화장지 30롤 2팩 무형광 먼지없는 집들이 두루마리휴지\",\"link\":\"https://smartstore.naver.com/main/products/7624882804\",\"image\":\"https://shopping-phinf.pstatic.net/main_8516938/85169383126.8.jpg\",\"lprice\":\"37500\",\"hprice\":\"\",\"mallName\":\"태라상사\",\"productId\":\"85169383126\",\"productType\":\"2\",\"brand\":\"크리넥스\",\"maker\":\"유한킴벌리\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"롤화장지\"},{\"title\":\"스피드랙 V2 철제선반 조립식 앵글 렉 선반 창고 베란다 400300600 5단\",\"link\":\"https://smartstore.naver.com/main/products/8805641337\",\"image\":\"https://shopping-phinf.pstatic.net/main_8635014/86350141660.5.jpg\",\"lprice\":\"69900\",\"hprice\":\"\",\"mallName\":\"스피드랙 스토어\",\"productId\":\"86350141660\",\"productType\":\"2\",\"brand\":\"스피드랙\",\"maker\":\"스피드랙\",\"category1\":\"생활/건강\",\"category2\":\"수납/정리용품\",\"category3\":\"선반/진열대\",\"category4\":\"스탠드선반/진열대\"},{\"title\":\"말표산업 말표 블랙시트 20매, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/55379785025\",\"image\":\"https://shopping-phinf.pstatic.net/main_5537978/55379785025.20250619120435.jpg\",\"lprice\":\"7000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"55379785025\",\"productType\":\"1\",\"brand\":\"말표\",\"maker\":\"말표산업\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"홈캠거치대 이글루캠 헤이홈 타포 샤오미 티피링크 호환 무타공 부착형\",\"link\":\"https://smartstore.naver.com/main/products/10322980791\",\"image\":\"https://shopping-phinf.pstatic.net/main_8786748/87867484917.2.jpg\",\"lprice\":\"11900\",\"hprice\":\"\",\"mallName\":\"홈스탠드\",\"productId\":\"87867484917\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"홈키파 홈매트 리퀴드 맥스 제로 훈증기+리필 45일 액체 액상 전자 전기 모기약 모기향\",\"link\":\"https://smartstore.naver.com/main/products/9999483328\",\"image\":\"https://shopping-phinf.pstatic.net/main_8754398/87543985601.1.jpg\",\"lprice\":\"9980\",\"hprice\":\"\",\"mallName\":\"84년생 부엉이\",\"productId\":\"87543985601\",\"productType\":\"2\",\"brand\":\"홈매트\",\"maker\":\"헨켈\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"리퀴드\"},{\"title\":\"에어킹 포장뽁뽁이  20cmx50m, 5개\",\"link\":\"https://search.shopping.naver.com/catalog/55077096239\",\"image\":\"https://shopping-phinf.pstatic.net/main_5507709/55077096239.20250602120340.jpg\",\"lprice\":\"14500\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"55077096239\",\"productType\":\"1\",\"brand\":\"에어킹\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"단열시트\"},{\"title\":\"창틀벌레 모풍지판 창문 벌레 차단 틈새 창문틈 막이 방충망\",\"link\":\"https://smartstore.naver.com/main/products/6293889960\",\"image\":\"https://shopping-phinf.pstatic.net/main_8383839/83838392449.1.jpg\",\"lprice\":\"2300\",\"hprice\":\"\",\"mallName\":\"우예스토어\",\"productId\":\"83838392449\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"문풍지\"},{\"title\":\"화장실 하수구트랩 50mm 덮개 배수구트랩 냄새제거 차단 베란다 악취 벌레 하수도 역류\",\"link\":\"https://smartstore.naver.com/main/products/115297276\",\"image\":\"https://shopping-phinf.pstatic.net/main_6610700/6610700948.17.jpg\",\"lprice\":\"15900\",\"hprice\":\"\",\"mallName\":\"빌리브샵\",\"productId\":\"6610700948\",\"productType\":\"2\",\"brand\":\"SMZ냄새제로\",\"maker\":\"에스엠지\",\"category1\":\"생활/건강\",\"category2\":\"욕실용품\",\"category3\":\"샤워기/수전용품\",\"category4\":\"배수구캡\"},{\"title\":\"에코버 식기세척기세제 제로 500g, 2개\",\"link\":\"https://search.shopping.naver.com/catalog/52269069619\",\"image\":\"https://shopping-phinf.pstatic.net/main_5226906/52269069619.20250103145320.jpg\",\"lprice\":\"27900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"52269069619\",\"productType\":\"1\",\"brand\":\"에코버\",\"maker\":\"에코버\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"식기세척기전용세제\"},{\"title\":\"선일금고 루셀 소형 가정용 금고 YES-031D\",\"link\":\"https://search.shopping.naver.com/catalog/6691041836\",\"image\":\"https://shopping-phinf.pstatic.net/main_6691041/6691041836.20230404094801.jpg\",\"lprice\":\"223390\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"6691041836\",\"productType\":\"1\",\"brand\":\"루셀\",\"maker\":\"선일금고\",\"category1\":\"생활/건강\",\"category2\":\"문구/사무용품\",\"category3\":\"사무기기\",\"category4\":\"금고\"},{\"title\":\"물먹는하마 옷장용 제습제 525g, 12개\",\"link\":\"https://search.shopping.naver.com/catalog/54767725838\",\"image\":\"https://shopping-phinf.pstatic.net/main_5476772/54767725838.20250522133457.jpg\",\"lprice\":\"18280\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54767725838\",\"productType\":\"1\",\"brand\":\"물먹는하마\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"롤 에어캡 포장 뽁뽁이 택배 완충 포장용 50cmX50m 0.2T 1롤\",\"link\":\"https://smartstore.naver.com/main/products/7170955325\",\"image\":\"https://shopping-phinf.pstatic.net/main_8471545/84715455647.jpg\",\"lprice\":\"7200\",\"hprice\":\"\",\"mallName\":\"이고다포장\",\"productId\":\"84715455647\",\"productType\":\"2\",\"brand\":\"이고다\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"단열시트\"},{\"title\":\"커클랜드 캡슐세제 울트라클린팩 코스트코 세제 추천\",\"link\":\"https://smartstore.naver.com/main/products/5621546440\",\"image\":\"https://shopping-phinf.pstatic.net/main_8316604/83166042955.14.jpg\",\"lprice\":\"19690\",\"hprice\":\"\",\"mallName\":\"바이플랫\",\"productId\":\"83166042955\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"홈트너 제습제 옷장제습제 습기제거제 옷걸이형 250g, 20개\",\"link\":\"https://smartstore.naver.com/main/products/10389688304\",\"image\":\"https://shopping-phinf.pstatic.net/main_8793419/87934193163.jpg\",\"lprice\":\"22500\",\"hprice\":\"\",\"mallName\":\"홈트너\",\"productId\":\"87934193163\",\"productType\":\"2\",\"brand\":\"홈트너\",\"maker\":\"홈트너\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"실리카겔 50g 습기제거제 제품 /산업 신발 의류 방습제\",\"link\":\"https://smartstore.naver.com/main/products/4549948287\",\"image\":\"https://shopping-phinf.pstatic.net/main_8209446/82094468339.4.jpg\",\"lprice\":\"280\",\"hprice\":\"\",\"mallName\":\"제이제이상사\",\"productId\":\"82094468339\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"맥스포스겔 바퀴벌레약 셀렉트 이지 겔 바퀴벌레퇴치 230g, 1개\",\"link\":\"https://smartstore.naver.com/main/products/10663150138\",\"image\":\"https://shopping-phinf.pstatic.net/main_8820765/88207656052.3.jpg\",\"lprice\":\"29500\",\"hprice\":\"\",\"mallName\":\"토마스팜\",\"productId\":\"88207656052\",\"productType\":\"2\",\"brand\":\"BAYER\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"겔\"},{\"title\":\"홈트너 제습제 옷장제습제 습기제거제 선반형 570ml 250g, 24개\",\"link\":\"https://smartstore.naver.com/main/products/11722065095\",\"image\":\"https://shopping-phinf.pstatic.net/main_8926657/89266575594.jpg\",\"lprice\":\"20900\",\"hprice\":\"\",\"mallName\":\"홈트너\",\"productId\":\"89266575594\",\"productType\":\"2\",\"brand\":\"홈트너\",\"maker\":\"홈트너\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"대용량 옷장제습제 옷걸이형제습제 옷걸이제습제 8개\",\"link\":\"https://smartstore.naver.com/main/products/6872914080\",\"image\":\"https://shopping-phinf.pstatic.net/main_8441741/84417414402.9.jpg\",\"lprice\":\"18500\",\"hprice\":\"\",\"mallName\":\"주식회사 생활공작소\",\"productId\":\"84417414402\",\"productType\":\"2\",\"brand\":\"생활공작소\",\"maker\":\"생활공작소\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"홈캠거치대 스탠드 헤이홈 타포 이글루캠 티피링크 샤오미 호환 무타공\",\"link\":\"https://smartstore.naver.com/main/products/9960717951\",\"image\":\"https://shopping-phinf.pstatic.net/main_8750522/87505220224.3.jpg\",\"lprice\":\"32800\",\"hprice\":\"\",\"mallName\":\"홈스탠드\",\"productId\":\"87505220224\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"롤 에어캡 뽁뽁이 택배 포장 완충 포장용 50cmX50m 0.2T 2롤\",\"link\":\"https://smartstore.naver.com/main/products/6956192800\",\"image\":\"https://shopping-phinf.pstatic.net/main_8450069/84500693122.jpg\",\"lprice\":\"14000\",\"hprice\":\"\",\"mallName\":\"이고다포장\",\"productId\":\"84500693122\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"단열시트\"},{\"title\":\"고화질 헤이홈 PRO 홈카메라 가정용 반려동물 홈캠 CCTV 베이비캠 ip카메라 펫캠\",\"link\":\"https://smartstore.naver.com/main/products/4799243915\",\"image\":\"https://shopping-phinf.pstatic.net/main_8234376/82343766518.20.jpg\",\"lprice\":\"59900\",\"hprice\":\"\",\"mallName\":\"똑똑한집\",\"productId\":\"82343766518\",\"productType\":\"2\",\"brand\":\"헤이홈\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"로긴 304 올스텐 이동식 세탁 빨래바구니 2단\",\"link\":\"https://search.shopping.naver.com/catalog/49472008932\",\"image\":\"https://shopping-phinf.pstatic.net/main_4947200/49472008932.20250516053328.jpg\",\"lprice\":\"159000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"49472008932\",\"productType\":\"1\",\"brand\":\"로긴\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"세탁용품\",\"category3\":\"빨래바구니\",\"category4\":\"\"},{\"title\":\"콜게이트 치약 코스트코 250g5개입 잇몸 입냄새 불소 1450 고불소 그레이트 레귤러\",\"link\":\"https://smartstore.naver.com/main/products/9360080926\",\"image\":\"https://shopping-phinf.pstatic.net/main_8690458/86904581249.2.jpg\",\"lprice\":\"19650\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"86904581249\",\"productType\":\"2\",\"brand\":\"콜게이트\",\"maker\":\"콜게이트\",\"category1\":\"생활/건강\",\"category2\":\"구강위생용품\",\"category3\":\"치약\",\"category4\":\"\"},{\"title\":\"깨끗한나라 순수프리미엄 3겹 33m, 30롤, 2팩\",\"link\":\"https://search.shopping.naver.com/catalog/53531282602\",\"image\":\"https://shopping-phinf.pstatic.net/main_5353128/53531282602.20250313165432.jpg\",\"lprice\":\"23380\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53531282602\",\"productType\":\"1\",\"brand\":\"깨끗한나라\",\"maker\":\"깨끗한나라\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"롤화장지\"},{\"title\":\"[프로쉬] 식기세척기 세제 72개 베이킹소다 올인원 대용량 코스트코 식세기세제\",\"link\":\"https://smartstore.naver.com/main/products/11093986871\",\"image\":\"https://shopping-phinf.pstatic.net/main_8863849/88638497193.4.jpg\",\"lprice\":\"22590\",\"hprice\":\"\",\"mallName\":\"굿 바이즈\",\"productId\":\"88638497193\",\"productType\":\"2\",\"brand\":\"프로쉬\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"식기세척기전용세제\"},{\"title\":\"피크닉매트 방수돗자리 두꺼운돗자리 푹신한 대형 옐로우\",\"link\":\"https://smartstore.naver.com/main/products/8176642287\",\"image\":\"https://shopping-phinf.pstatic.net/main_8572114/85721142610.11.jpg\",\"lprice\":\"22800\",\"hprice\":\"\",\"mallName\":\"땡스투기프트\",\"productId\":\"85721142610\",\"productType\":\"2\",\"brand\":\"솜솜라이크\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"돗자리/매트\"},{\"title\":\"비트 딥클린 파워세탁 액체 세탁세제 3L 본품x4개+캡슐 5입\",\"link\":\"https://smartstore.naver.com/main/products/639909638\",\"image\":\"https://shopping-phinf.pstatic.net/main_1095711/10957110278.53.jpg\",\"lprice\":\"26900\",\"hprice\":\"\",\"mallName\":\"라이온코리아 브랜드스토어\",\"productId\":\"10957110278\",\"productType\":\"2\",\"brand\":\"비트\",\"maker\":\"라이온코리아\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"코스트코 커클랜드 키친타올 160매12롤x1팩 종이타올 주방 업소용 대용량 두꺼운 타월\",\"link\":\"https://smartstore.naver.com/main/products/7831231132\",\"image\":\"https://shopping-phinf.pstatic.net/main_8537573/85375731454.8.jpg\",\"lprice\":\"29790\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"85375731454\",\"productType\":\"2\",\"brand\":\"커클랜드\",\"maker\":\"코스트코\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"키친타월\"},{\"title\":\"코스트코 커클랜드 키친타올 160매12롤x1팩 종이타올 주방 업소용 대용량 두꺼운 타월\",\"link\":\"https://smartstore.naver.com/main/products/7831231132\",\"image\":\"https://shopping-phinf.pstatic.net/main_8537573/85375731454.8.jpg\",\"lprice\":\"29790\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"85375731454\",\"productType\":\"2\",\"brand\":\"커클랜드\",\"maker\":\"코스트코\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"키친타월\"},{\"title\":\"대용량 텀블러 퀜처 보온 보냉텀블러 빨대 손잡이텀블러 대형 차량용\",\"link\":\"https://smartstore.naver.com/main/products/8469600558\",\"image\":\"https://shopping-phinf.pstatic.net/main_8601410/86014100881.12.jpg\",\"lprice\":\"13000\",\"hprice\":\"\",\"mallName\":\"1리터텀블러 마켓\",\"productId\":\"86014100881\",\"productType\":\"2\",\"brand\":\"TYESO\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"잔/컵\",\"category4\":\"텀블러\"},{\"title\":\"유니레버 스너글 초고농축 섬유유연제 허거블코튼 , 1.8L, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/55381714650\",\"image\":\"https://shopping-phinf.pstatic.net/main_5538171/55381714650.20250619160239.jpg\",\"lprice\":\"9900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"55381714650\",\"productType\":\"1\",\"brand\":\"스너글\",\"maker\":\"유니레버\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"섬유유연제\",\"category4\":\"고농축섬유유연제\"},{\"title\":\"바퀴벌레약 맥스포스셀렉트 이지겔 20g\",\"link\":\"https://smartstore.naver.com/main/products/371021853\",\"image\":\"https://shopping-phinf.pstatic.net/main_9543148/9543148198.41.jpg\",\"lprice\":\"11000\",\"hprice\":\"\",\"mallName\":\"마당클럽\",\"productId\":\"9543148198\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"겔\"},{\"title\":\"뚱크 감성 피크닉 매트 휴대용 야외 비치 방수 돗자리\",\"link\":\"https://search.shopping.naver.com/catalog/54942592848\",\"image\":\"https://shopping-phinf.pstatic.net/main_5494259/54942592848.20250525095300.jpg\",\"lprice\":\"10900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54942592848\",\"productType\":\"1\",\"brand\":\"뚱크\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"돗자리/매트\"},{\"title\":\"이지 원터치 사각모기장 텐트 침대 캠핑 방충망 싱글\",\"link\":\"https://search.shopping.naver.com/catalog/48639360194\",\"image\":\"https://shopping-phinf.pstatic.net/main_4863936/48639360194.20250228182558.jpg\",\"lprice\":\"10900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"48639360194\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"페스트세븐 초파리 트랩 퇴치 날벌레 날파리 나방 벼룩 뿌리 파리 끈끈이 없애는법 퇴치법 퇴치제 제거\",\"link\":\"https://smartstore.naver.com/main/products/5076552040\",\"image\":\"https://shopping-phinf.pstatic.net/main_8262107/82621073724.6.jpg\",\"lprice\":\"9950\",\"hprice\":\"\",\"mallName\":\"페스트세븐\",\"productId\":\"82621073724\",\"productType\":\"2\",\"brand\":\"페스트세븐\",\"maker\":\"페스트세븐\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"끈끈이\"},{\"title\":\"맥스포스셀렉트겔20g + 먹이캡 30개 약국 맥스포겔 바퀴벌레없애는 퇴치법 바퀴벌레약\",\"link\":\"https://smartstore.naver.com/main/products/7569771250\",\"image\":\"https://shopping-phinf.pstatic.net/main_8511427/85114271572.jpg\",\"lprice\":\"13900\",\"hprice\":\"\",\"mallName\":\"리노 스토어\",\"productId\":\"85114271572\",\"productType\":\"2\",\"brand\":\"맥스포스\",\"maker\":\"바이엘크롭사이언스\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"겔\"},{\"title\":\"울트라델타 모기 파리 나방파리 초파리 벌레 유충 정화조 연막 퇴치제 살충제 지네 바퀴벌레 돈벌레 그리마 좀벌레 퇴치 약 퇴치법\",\"link\":\"https://smartstore.naver.com/main/products/2038170230\",\"image\":\"https://shopping-phinf.pstatic.net/main_1178122/11781220969.6.jpg\",\"lprice\":\"29000\",\"hprice\":\"\",\"mallName\":\"비티글로벌\",\"productId\":\"11781220969\",\"productType\":\"2\",\"brand\":\"모스헌터\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"에어졸/스프레이\"},{\"title\":\"파인디지털 파인뷰 AI 모션 트래킹 홈캠 CCTV K90 1개\",\"link\":\"https://search.shopping.naver.com/catalog/53955305824\",\"image\":\"https://shopping-phinf.pstatic.net/main_5395530/53955305824.20250404104816.jpg\",\"lprice\":\"59000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53955305824\",\"productType\":\"1\",\"brand\":\"파인뷰\",\"maker\":\"파인디지털\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"엔케이롤 현관방충망 자동롤 방충문 주문제작 교체시공 미세촘촘 절단 고급형 1000x2100\",\"link\":\"https://smartstore.naver.com/main/products/294104793\",\"image\":\"https://shopping-phinf.pstatic.net/main_8489916/8489916006.11.jpg\",\"lprice\":\"86500\",\"hprice\":\"\",\"mallName\":\"NK테크코리아\",\"productId\":\"8489916006\",\"productType\":\"2\",\"brand\":\"엔케이롤\",\"maker\":\"NK테크\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"1+1 살림백서 세탁세제 액체세제 천연 유래98% 2L 중성 드럼 세탁기 일반 대용량\",\"link\":\"https://smartstore.naver.com/main/products/2038109297\",\"image\":\"https://shopping-phinf.pstatic.net/main_1178110/11781100542.17.jpg\",\"lprice\":\"12900\",\"hprice\":\"\",\"mallName\":\"살림백서\",\"productId\":\"11781100542\",\"productType\":\"2\",\"brand\":\"살림백서\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"코맥스 인터폰 비디오폰 아날로그 아파트 주택 교체 설치 현관 초인종 별도 CAV43M\",\"link\":\"https://smartstore.naver.com/main/products/5866177635\",\"image\":\"https://shopping-phinf.pstatic.net/main_8341067/83410677049.8.jpg\",\"lprice\":\"55000\",\"hprice\":\"\",\"mallName\":\"KMplus\",\"productId\":\"83410677049\",\"productType\":\"2\",\"brand\":\"COMMAX\",\"maker\":\"COMMAX\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"기타보안용품\"},{\"title\":\"이노베이티브 전기 모기채 90도 회전 전자 파리채 대형 그레이 충전식 초파리 전기채\",\"link\":\"https://smartstore.naver.com/main/products/6375992557\",\"image\":\"https://shopping-phinf.pstatic.net/main_8392049/83920492890.15.jpg\",\"lprice\":\"29800\",\"hprice\":\"\",\"mallName\":\"이노베이티브리빙\",\"productId\":\"83920492890\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"모기채/파리채\"},{\"title\":\"CLA 듀얼 울트라 클린 캡슐세제 클린코튼 100개입, 클린코튼, 2개\",\"link\":\"https://search.shopping.naver.com/catalog/55003035568\",\"image\":\"https://shopping-phinf.pstatic.net/main_5500303/55003035568.20250528123648.jpg\",\"lprice\":\"18930\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"55003035568\",\"productType\":\"1\",\"brand\":\"CLA\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"GS칼텍스 킥스 PAO1 0W30 1L, 5개\",\"link\":\"https://search.shopping.naver.com/catalog/54894783454\",\"image\":\"https://shopping-phinf.pstatic.net/main_5489478/54894783454.20250521172441.jpg\",\"lprice\":\"44500\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54894783454\",\"productType\":\"1\",\"brand\":\"킥스\",\"maker\":\"GS칼텍스\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"오일/소모품\",\"category4\":\"엔진오일\"},{\"title\":\"PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장\",\"link\":\"https://smartstore.naver.com/main/products/7522712674\",\"image\":\"https://shopping-phinf.pstatic.net/main_8506721/85067212996.1.jpg\",\"lprice\":\"220\",\"hprice\":\"\",\"mallName\":\"기브N기브\",\"productId\":\"85067212996\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"쇼핑백\"},{\"title\":\"스탠드형 옷장제습제 옷장용제습제 대용량제습제 16개\",\"link\":\"https://smartstore.naver.com/main/products/6862149822\",\"image\":\"https://shopping-phinf.pstatic.net/main_8440665/84406650144.8.jpg\",\"lprice\":\"20900\",\"hprice\":\"\",\"mallName\":\"주식회사 생활공작소\",\"productId\":\"84406650144\",\"productType\":\"2\",\"brand\":\"생활공작소\",\"maker\":\"올덴\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"다우니 엑스퍼트 실내건조 섬유유연제 프레시클린, 1L, 5개\",\"link\":\"https://search.shopping.naver.com/catalog/54273979981\",\"image\":\"https://shopping-phinf.pstatic.net/main_5427397/54273979981.20250418095317.jpg\",\"lprice\":\"25890\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54273979981\",\"productType\":\"1\",\"brand\":\"다우니\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"섬유유연제\",\"category4\":\"고농축섬유유연제\"},{\"title\":\"맥세이프 차량용 거치대 진공흡착 대시보드 핸드폰 태블릿 자석 테슬라 카니발 쏘렌토 벤츠\",\"link\":\"https://smartstore.naver.com/main/products/11355634698\",\"image\":\"https://shopping-phinf.pstatic.net/main_8890014/88900145049.jpg\",\"lprice\":\"17800\",\"hprice\":\"\",\"mallName\":\"올거치\",\"productId\":\"88900145049\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"휴대폰용품\",\"category4\":\"차량용휴대폰거치대\"},{\"title\":\"나이키 리유저블 쇼핑백 소형 타포린백 쇼퍼백 에코백 장바구니 운동 헬스 가방 방수\",\"link\":\"https://smartstore.naver.com/main/products/6642533357\",\"image\":\"https://shopping-phinf.pstatic.net/main_8418703/84187033679.6.jpg\",\"lprice\":\"2890\",\"hprice\":\"\",\"mallName\":\"소울 컴퍼니sc\",\"productId\":\"84187033679\",\"productType\":\"2\",\"brand\":\"나이키\",\"maker\":\"나이키\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"쇼핑백\"},{\"title\":\"방문방음 문틈 창문 방문 틈새막이 소음차단 문틈막이 방음재 고무 문풍지 현관문 패킹 I형\",\"link\":\"https://smartstore.naver.com/main/products/6106851858\",\"image\":\"https://shopping-phinf.pstatic.net/main_8365135/83651351346.10.jpg\",\"lprice\":\"2900\",\"hprice\":\"\",\"mallName\":\"주알보\",\"productId\":\"83651351346\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"문풍지\"},{\"title\":\"모나리자 미용티슈 250매, 6개\",\"link\":\"https://search.shopping.naver.com/catalog/54626507920\",\"image\":\"https://shopping-phinf.pstatic.net/main_5462650/54626507920.20250507093536.jpg\",\"lprice\":\"7250\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54626507920\",\"productType\":\"1\",\"brand\":\"모나리자\",\"maker\":\"모나리자\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"갑티슈\"},{\"title\":\"로티 로티홈시스 트랜스폼 쇼핑 접이식 카트, 블랙\",\"link\":\"https://search.shopping.naver.com/catalog/53875383579\",\"image\":\"https://shopping-phinf.pstatic.net/main_5387538/53875383579.20250612131833.jpg\",\"lprice\":\"71400\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53875383579\",\"productType\":\"1\",\"brand\":\"로티홈시스\",\"maker\":\"로티\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"핸드카트\"},{\"title\":\"베오라 차량용 우산형 햇빛가리개 자동차 앞유리 창문 햇볕 가림막\",\"link\":\"https://smartstore.naver.com/main/products/5713093059\",\"image\":\"https://shopping-phinf.pstatic.net/main_8325759/83257591390.12.jpg\",\"lprice\":\"6800\",\"hprice\":\"\",\"mallName\":\"베오라\",\"productId\":\"83257591390\",\"productType\":\"2\",\"brand\":\"베오라\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"인테리어용품\",\"category4\":\"차량용햇빛가리개\"},{\"title\":\"뽁뽁이 포장용 롤 에어캡 0.2T 50cm 50M 2롤\",\"link\":\"https://smartstore.naver.com/main/products/10607575860\",\"image\":\"https://shopping-phinf.pstatic.net/main_8815208/88152081450.2.jpg\",\"lprice\":\"13300\",\"hprice\":\"\",\"mallName\":\"포장자재몰\",\"productId\":\"88152081450\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"단열시트\"},{\"title\":\"더블에이 A4용지 복사용지 80g 2500매, 2개\",\"link\":\"https://search.shopping.naver.com/catalog/51929532141\",\"image\":\"https://shopping-phinf.pstatic.net/main_5192953/51929532141.20241213221241.jpg\",\"lprice\":\"43800\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"51929532141\",\"productType\":\"1\",\"brand\":\"더블에이\",\"maker\":\"더블에이\",\"category1\":\"생활/건강\",\"category2\":\"문구/사무용품\",\"category3\":\"용지\",\"category4\":\"복사지\"},{\"title\":\"태양 홈키파 엘비이 알파 수성 에어졸 500ml, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/52481568603\",\"image\":\"https://shopping-phinf.pstatic.net/main_5248156/52481568603.20250114124554.jpg\",\"lprice\":\"1820\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"52481568603\",\"productType\":\"1\",\"brand\":\"홈키파\",\"maker\":\"태양\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"에어졸/스프레이\"},{\"title\":\"슬라이락 샷시 창문 잠금장치 열림방지 스토퍼 G102 방충망고정 미닫이문 베란다 방범장치\",\"link\":\"https://smartstore.naver.com/main/products/2058184292\",\"image\":\"https://shopping-phinf.pstatic.net/main_1185453/11854533297.10.jpg\",\"lprice\":\"11000\",\"hprice\":\"\",\"mallName\":\"에누리 스토어\",\"productId\":\"11854533297\",\"productType\":\"2\",\"brand\":\"슬라이락\",\"maker\":\"GLORYTEC\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"도어락/안전고리\"},{\"title\":\"디엠공사 현관방충망 접이식 현관방범방충문 그릴망 백색\",\"link\":\"https://smartstore.naver.com/main/products/4343271229\",\"image\":\"https://shopping-phinf.pstatic.net/main_8188779/81887793257.12.jpg\",\"lprice\":\"275000\",\"hprice\":\"\",\"mallName\":\"디엠공사\",\"productId\":\"81887793257\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"롤 에어캡 포장 뽁뽁이 완충 포장용 더블2T 50cm x 50M 4롤\",\"link\":\"https://smartstore.naver.com/main/products/393813507\",\"image\":\"https://shopping-phinf.pstatic.net/main_9740449/9740449684.4.jpg\",\"lprice\":\"28000\",\"hprice\":\"\",\"mallName\":\"뽁뽁이공장\",\"productId\":\"9740449684\",\"productType\":\"2\",\"brand\":\"에어킹\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"단열시트\"},{\"title\":\"시모무라 채칼 4종세트 화이트 만능 당근 양배추 채칼 필러 야채 슬라이서 감자칼 무채칼\",\"link\":\"https://smartstore.naver.com/main/products/9104602174\",\"image\":\"https://shopping-phinf.pstatic.net/main_8664910/86649102497.8.jpg\",\"lprice\":\"12500\",\"hprice\":\"\",\"mallName\":\"라미스홈\",\"productId\":\"86649102497\",\"productType\":\"2\",\"brand\":\"시모무라\",\"maker\":\"시모무라\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"칼/커팅기구\",\"category4\":\"채칼/필러\"},{\"title\":\"피톤치드 편백수 스프레이 원액 2L 편백나무 오일 수액 새집증후군 페인트 제거 방법 새차 탄 새가구 이불 곰팡이 냄새 베이크아웃 퇴치제 침대 집먼지 천연 셀프 청소 퇴치\",\"link\":\"https://smartstore.naver.com/main/products/321150888\",\"image\":\"https://shopping-phinf.pstatic.net/main_8794978/8794978502.60.jpg\",\"lprice\":\"16900\",\"hprice\":\"\",\"mallName\":\"김민재편백\",\"productId\":\"8794978502\",\"productType\":\"2\",\"brand\":\"김민재편백\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"새집증후군/진드기\"},{\"title\":\"토리 리빙폴리쉬 욕실 주방 가구 다목적 세정제 찌든때 손때 제거제 물때 클리너\",\"link\":\"https://smartstore.naver.com/main/products/9455240960\",\"image\":\"https://shopping-phinf.pstatic.net/main_8699974/86999741283.6.jpg\",\"lprice\":\"34000\",\"hprice\":\"\",\"mallName\":\"TORRI\",\"productId\":\"86999741283\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"일반주방세제\"},{\"title\":\"[New 다막아방충망] 미세 먼지 창문 프로젝트 자동 스크린 롤 방충망 틀 시공 제작(300x300/화이트)\",\"link\":\"https://smartstore.naver.com/main/products/6308394553\",\"image\":\"https://shopping-phinf.pstatic.net/main_8385289/83852897042.12.jpg\",\"lprice\":\"13420\",\"hprice\":\"\",\"mallName\":\"다막아방충망\",\"productId\":\"83852897042\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"이글루캠S4+ 플러스 베이비 신생아 홈CCTV 집안 가정용 모니터 펫캠 이글루홈캠 본품\",\"link\":\"https://smartstore.naver.com/main/products/9472235915\",\"image\":\"https://shopping-phinf.pstatic.net/main_8701673/87016736238.jpg\",\"lprice\":\"89800\",\"hprice\":\"\",\"mallName\":\"오후의 삶\",\"productId\":\"87016736238\",\"productType\":\"2\",\"brand\":\"이글루캠\",\"maker\":\"트루엔\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"계피오일 스프레이 1개입, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/55209097505\",\"image\":\"https://shopping-phinf.pstatic.net/main_5520909/55209097505.20250609101607.jpg\",\"lprice\":\"26900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"55209097505\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"방충제\"},{\"title\":\"프리미엄 클린 보틀 대용량 자동 변기세정제 클리너 4개\",\"link\":\"https://smartstore.naver.com/main/products/11457974697\",\"image\":\"https://shopping-phinf.pstatic.net/main_8900248/89002485063.jpg\",\"lprice\":\"12900\",\"hprice\":\"\",\"mallName\":\"더스마티\",\"productId\":\"89002485063\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"변기세정제\"},{\"title\":\"프로쉬 알로에베라 세탁세제 6L 코스트코 독일 고농축 액상 액체 세제 친환경\",\"link\":\"https://smartstore.naver.com/main/products/8868352674\",\"image\":\"https://shopping-phinf.pstatic.net/main_8641285/86412852997.9.jpg\",\"lprice\":\"28790\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"86412852997\",\"productType\":\"2\",\"brand\":\"프로쉬\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"네오플램 전자렌지용 냉동밥 보관용기 10P 360ml 반찬통\",\"link\":\"https://smartstore.naver.com/main/products/7015716211\",\"image\":\"https://shopping-phinf.pstatic.net/main_8456021/84560216533.5.jpg\",\"lprice\":\"44800\",\"hprice\":\"\",\"mallName\":\"리빙스토리\",\"productId\":\"84560216533\",\"productType\":\"2\",\"brand\":\"네오플램\",\"maker\":\"네오플램\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"보관/밀폐용기\",\"category4\":\"도자기/유리용기\"},{\"title\":\"제이비제이 JBJ 올인원 올스텐 식기건조대 쟁반형 2단\",\"link\":\"https://search.shopping.naver.com/catalog/35681690230\",\"image\":\"https://shopping-phinf.pstatic.net/main_3568169/35681690230.20240519010549.jpg\",\"lprice\":\"97320\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"35681690230\",\"productType\":\"1\",\"brand\":\"제이비제이\",\"maker\":\"제이비제이\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"주방수납용품\",\"category4\":\"식기건조대\"},{\"title\":\"암웨이 프리워시 스프레이 세제 얼룩제거제\",\"link\":\"https://smartstore.naver.com/main/products/8606816544\",\"image\":\"https://shopping-phinf.pstatic.net/main_8615131/86151316867.8.jpg\",\"lprice\":\"14300\",\"hprice\":\"\",\"mallName\":\"NATUREMARKET\",\"productId\":\"86151316867\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁보조제\"},{\"title\":\"순수한면 제로 생리대 중형 64p 순면 안전한 친환경\",\"link\":\"https://smartstore.naver.com/main/products/9333916814\",\"image\":\"https://shopping-phinf.pstatic.net/main_8687841/86878417137.8.jpg\",\"lprice\":\"10490\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"86878417137\",\"productType\":\"2\",\"brand\":\"순수한면\",\"maker\":\"깨끗한나라\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생리대\",\"category4\":\"일반생리대\"},{\"title\":\"언더스코어 젠틀맨 프리미엄 차량용 방향제 블랙체리, 8.2g, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/53547335449\",\"image\":\"https://shopping-phinf.pstatic.net/main_5354733/53547335449.20250314114802.jpg\",\"lprice\":\"29000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53547335449\",\"productType\":\"1\",\"brand\":\"언더스코어\",\"maker\":\"언더스코어\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"공기청정용품\",\"category4\":\"차량용방향제\"},{\"title\":\"1+1 살림백서 곰팡이 제거제 제거 벽지 베란다 벽 화장실 욕실 실리콘 젤 뿌리는 세제\",\"link\":\"https://smartstore.naver.com/main/products/4440069322\",\"image\":\"https://shopping-phinf.pstatic.net/main_8198459/81984592030.7.jpg\",\"lprice\":\"10900\",\"hprice\":\"\",\"mallName\":\"살림백서\",\"productId\":\"81984592030\",\"productType\":\"2\",\"brand\":\"살림백서\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"곰팡이제거제\"},{\"title\":\"큐브캠 2.0 FHD 초소형 카메라 가정용 소형 무선 CCTV 적외선 홈캠 펫캠\",\"link\":\"https://smartstore.naver.com/main/products/5219618783\",\"image\":\"https://shopping-phinf.pstatic.net/main_8276414/82764140753.2.jpg\",\"lprice\":\"29800\",\"hprice\":\"\",\"mallName\":\"원캠\",\"productId\":\"82764140753\",\"productType\":\"2\",\"brand\":\"원캠\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"CCTV\"},{\"title\":\"암웨이치약 200gx4개 한국암웨이 오랄케어\",\"link\":\"https://smartstore.naver.com/main/products/8722398377\",\"image\":\"https://shopping-phinf.pstatic.net/main_8626689/86266898700.2.jpg\",\"lprice\":\"26400\",\"hprice\":\"\",\"mallName\":\"뷰티스타2\",\"productId\":\"86266898700\",\"productType\":\"2\",\"brand\":\"암웨이\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"구강위생용품\",\"category3\":\"치약\",\"category4\":\"\"},{\"title\":\"홈매트 리퀴드 리필 무향 제로 액체 액상 전자모기향 모기약\",\"link\":\"https://smartstore.naver.com/main/products/10191083845\",\"image\":\"https://shopping-phinf.pstatic.net/main_8773558/87735587292.7.jpg\",\"lprice\":\"17300\",\"hprice\":\"\",\"mallName\":\"코스트코이케아\",\"productId\":\"87735587292\",\"productType\":\"2\",\"brand\":\"홈매트\",\"maker\":\"헨켈\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"리퀴드\"},{\"title\":\"알칼리세탁세제 땀냄새제거 3L 4개 드럼세탁기 통돌이 빨래냄새제거\",\"link\":\"https://smartstore.naver.com/main/products/6052431889\",\"image\":\"https://shopping-phinf.pstatic.net/main_8359693/83596931377.4.jpg\",\"lprice\":\"23900\",\"hprice\":\"\",\"mallName\":\"기웅생활건강\",\"productId\":\"83596931377\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"액츠 세탁세제 실내건조용기 2개 중성세제 일반드럼겸용 고농축 통돌이\",\"link\":\"https://smartstore.naver.com/main/products/8140558953\",\"image\":\"https://shopping-phinf.pstatic.net/main_8568505/85685059276.10.jpg\",\"lprice\":\"13900\",\"hprice\":\"\",\"mallName\":\"티에스shop\",\"productId\":\"85685059276\",\"productType\":\"2\",\"brand\":\"액츠\",\"maker\":\"피죤\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"현관문 방화문 KAN -자 기본형 K630 도어클로저 도어체크 목문 방문 자동문닫힘\",\"link\":\"https://smartstore.naver.com/main/products/250818283\",\"image\":\"https://shopping-phinf.pstatic.net/main_7998282/7998282605.14.jpg\",\"lprice\":\"12000\",\"hprice\":\"\",\"mallName\":\"씨엘\",\"productId\":\"7998282605\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"보안용품\",\"category4\":\"도어락/안전고리\"},{\"title\":\"국가검정품 ABC 분말소화기 3.3kg 가정용 업소용 사무실용 수입\",\"link\":\"https://smartstore.naver.com/main/products/256430566\",\"image\":\"https://shopping-phinf.pstatic.net/main_1149517/11495170654.21.jpg\",\"lprice\":\"15500\",\"hprice\":\"\",\"mallName\":\"한국소방공사\",\"productId\":\"11495170654\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"공구\",\"category3\":\"안전용품\",\"category4\":\"소화기\"},{\"title\":\"그릭홀릭 유청분리기 꾸덕 그릭요거트메이커 야채탈수기 짤순이 다이어트\",\"link\":\"https://smartstore.naver.com/main/products/9274820534\",\"image\":\"https://shopping-phinf.pstatic.net/main_8681932/86819320857.2.jpg\",\"lprice\":\"15900\",\"hprice\":\"\",\"mallName\":\"Greek Holic\",\"productId\":\"86819320857\",\"productType\":\"2\",\"brand\":\"그릭홀릭\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"조리기구\",\"category4\":\"기타조리기구\"},{\"title\":\"다우니 대용량 섬유유연제 8.5L + 브레프 파워 액티브 변기세정제 1p\",\"link\":\"https://smartstore.naver.com/main/products/10325709315\",\"image\":\"https://shopping-phinf.pstatic.net/main_8787021/87870213517.2.jpg\",\"lprice\":\"20700\",\"hprice\":\"\",\"mallName\":\"지엑스몰\",\"productId\":\"87870213517\",\"productType\":\"2\",\"brand\":\"다우니\",\"maker\":\"P&G\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"섬유유연제\",\"category4\":\"고농축섬유유연제\"},{\"title\":\"스탠리 591 텀블러 퀜처 H2.0 플로우스테이트 차량용 텀블러\",\"link\":\"https://smartstore.naver.com/main/products/10205968585\",\"image\":\"https://shopping-phinf.pstatic.net/main_8775047/87750472093.2.jpg\",\"lprice\":\"39000\",\"hprice\":\"\",\"mallName\":\"치포마켓\",\"productId\":\"87750472093\",\"productType\":\"2\",\"brand\":\"스탠리\",\"maker\":\"스탠리\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"잔/컵\",\"category4\":\"텀블러\"},{\"title\":\"[썸머패드 증정] 좋은느낌 썸머 입는 오버나이트 8매 X 3팩 / 입는 생리대\",\"link\":\"https://smartstore.naver.com/main/products/10129386910\",\"image\":\"https://shopping-phinf.pstatic.net/main_8767388/87673889854.16.jpg\",\"lprice\":\"24900\",\"hprice\":\"\",\"mallName\":\"좋은느낌 스토어\",\"productId\":\"87673889854\",\"productType\":\"2\",\"brand\":\"좋은느낌\",\"maker\":\"유한킴벌리\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생리대\",\"category4\":\"일반생리대\"},{\"title\":\"두꺼운 고급 무지쇼핑백 종이쇼핑백 주문제작 소량 로고인쇄 선물용 종이가방 세로형1호\",\"link\":\"https://smartstore.naver.com/main/products/8643964296\",\"image\":\"https://shopping-phinf.pstatic.net/main_8618846/86188464619.14.jpg\",\"lprice\":\"350\",\"hprice\":\"\",\"mallName\":\"세모쇼핑백\",\"productId\":\"86188464619\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"쇼핑백\"},{\"title\":\"아스토니쉬 5분 욕실청소 2종 세트 (곰팡이제거제+배스룸클리너)\",\"link\":\"https://smartstore.naver.com/main/products/8529119715\",\"image\":\"https://shopping-phinf.pstatic.net/main_8607362/86073620038.3.jpg\",\"lprice\":\"23040\",\"hprice\":\"\",\"mallName\":\"아스토니쉬\",\"productId\":\"86073620038\",\"productType\":\"2\",\"brand\":\"아스토니쉬\",\"maker\":\"런던오일리파이닝\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"곰팡이제거제\"},{\"title\":\"컴배트 좀벌레싹 허브 옷장 6개입 퇴치제 약\",\"link\":\"https://smartstore.naver.com/main/products/130681093\",\"image\":\"https://shopping-phinf.pstatic.net/main_6811953/6811953254.14.jpg\",\"lprice\":\"9500\",\"hprice\":\"\",\"mallName\":\"예스유통\",\"productId\":\"6811953254\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"방충제\"},{\"title\":\"방충망 탈부착 자석 미세먼지 모기장 창문 설치 DIY 셀프시공 소프트 자석쫄대 3M\",\"link\":\"https://smartstore.naver.com/main/products/9901819508\",\"image\":\"https://shopping-phinf.pstatic.net/main_8744632/87446321781.1.jpg\",\"lprice\":\"6500\",\"hprice\":\"\",\"mallName\":\"한반도철망\",\"productId\":\"87446321781\",\"productType\":\"2\",\"brand\":\"한반도철망\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"최근생산 롯데정밀화학 유록스 요소수10L 1개 자바라포함\",\"link\":\"https://smartstore.naver.com/main/products/9559248305\",\"image\":\"https://shopping-phinf.pstatic.net/main_8710375/87103750575.4.jpg\",\"lprice\":\"6250\",\"hprice\":\"\",\"mallName\":\"정품정량\",\"productId\":\"87103750575\",\"productType\":\"2\",\"brand\":\"유록스\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"오일/소모품\",\"category4\":\"요소수\"},{\"title\":\"제거죠스 미생물 효소 배수구 클리너 싱크대 하수구 냄새 제거 세정제\",\"link\":\"https://smartstore.naver.com/main/products/10780688049\",\"image\":\"https://shopping-phinf.pstatic.net/main_8832519/88325194039.1.jpg\",\"lprice\":\"18900\",\"hprice\":\"\",\"mallName\":\"제거죠스\",\"productId\":\"88325194039\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"배수구세정제\"},{\"title\":\"현대 국산 멀티탭 개별 과부하차단 16A 4구 1.5M 안전 접지 스위치 멀티 콘센트\",\"link\":\"https://smartstore.naver.com/main/products/11057381668\",\"image\":\"https://shopping-phinf.pstatic.net/main_8860188/88601887879.jpg\",\"lprice\":\"9700\",\"hprice\":\"\",\"mallName\":\"현대멀티탭스토어\",\"productId\":\"88601887879\",\"productType\":\"2\",\"brand\":\"현대\",\"maker\":\"현대일렉트릭\",\"category1\":\"생활/건강\",\"category2\":\"공구\",\"category3\":\"전기용품\",\"category4\":\"멀티탭\"},{\"title\":\"올리 센서휴지통 스마트쓰레기통 자동센서 미니 대형 12L 16L 1+1\",\"link\":\"https://smartstore.naver.com/main/products/9771054163\",\"image\":\"https://shopping-phinf.pstatic.net/main_8731555/87315556436.4.jpg\",\"lprice\":\"29900\",\"hprice\":\"\",\"mallName\":\"올리 OLLY\",\"productId\":\"87315556436\",\"productType\":\"2\",\"brand\":\"OLLY\",\"maker\":\"에어로코리아\",\"category1\":\"생활/건강\",\"category2\":\"청소용품\",\"category3\":\"휴지통\",\"category4\":\"다용도휴지통\"},{\"title\":\"위프 탈취제 WHIFF 화장실 담배 새집증후군 홀애비 소변기 초강력 냄새 제거\",\"link\":\"https://smartstore.naver.com/main/products/11530520013\",\"image\":\"https://shopping-phinf.pstatic.net/main_8907503/89075030419.jpg\",\"lprice\":\"21900\",\"hprice\":\"\",\"mallName\":\"위프라이프\",\"productId\":\"89075030419\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"실내탈취제\"},{\"title\":\"땡큐 순수 천연펄프 3겹 14m, 30롤, 1팩\",\"link\":\"https://search.shopping.naver.com/catalog/54647347924\",\"image\":\"https://shopping-phinf.pstatic.net/main_5464734/54647347924.20250508140616.jpg\",\"lprice\":\"4990\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54647347924\",\"productType\":\"1\",\"brand\":\"땡큐\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"롤화장지\"},{\"title\":\"국산 모기장 대형모기장 침대 야외 사각모기장 화이트10인용\",\"link\":\"https://smartstore.naver.com/main/products/2651807250\",\"image\":\"https://shopping-phinf.pstatic.net/main_8014955/80149550922.19.jpg\",\"lprice\":\"19200\",\"hprice\":\"\",\"mallName\":\"닛시스타일\",\"productId\":\"80149550922\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"모기장\"},{\"title\":\"바퀴벌레약 바이엘 맥스포스셀렉트 이지겔 20g\",\"link\":\"https://smartstore.naver.com/main/products/2756843543\",\"image\":\"https://shopping-phinf.pstatic.net/main_8025458/80254587290.2.jpg\",\"lprice\":\"11000\",\"hprice\":\"\",\"mallName\":\"벌레특공대\",\"productId\":\"80254587290\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"해충퇴치용품\",\"category4\":\"겔\"},{\"title\":\"현관문고무패킹 문틈막이 방화문가스켓 현관 우풍 소음 벌레 외풍차단 틈새막이 방음재 일반형\",\"link\":\"https://smartstore.naver.com/main/products/4976480580\",\"image\":\"https://shopping-phinf.pstatic.net/main_8252100/82521000904.2.jpg\",\"lprice\":\"1390\",\"hprice\":\"\",\"mallName\":\"나라종합\",\"productId\":\"82521000904\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"문풍지\"},{\"title\":\"살림백서 딥클린 트리플 액션 고농축 캡슐세제 100개입, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/53191833757\",\"image\":\"https://shopping-phinf.pstatic.net/main_5319183/53191833757.20250224165636.jpg\",\"lprice\":\"19900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53191833757\",\"productType\":\"1\",\"brand\":\"살림백서\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"살림백서 보들보들 각티슈 미용티슈 250매 6개입 곽휴지 곽티슈\",\"link\":\"https://smartstore.naver.com/main/products/5043187023\",\"image\":\"https://shopping-phinf.pstatic.net/main_8258770/82587708083.2.jpg\",\"lprice\":\"11900\",\"hprice\":\"\",\"mallName\":\"살림백서\",\"productId\":\"82587708083\",\"productType\":\"2\",\"brand\":\"살림백서\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"갑티슈\"},{\"title\":\"돗자리 피크닉매트 방수 감성 휴대용 소풍 양면 비치 한강 세트 야외 대형\",\"link\":\"https://smartstore.naver.com/main/products/5882065887\",\"image\":\"https://shopping-phinf.pstatic.net/main_8342656/83426565301.19.jpg\",\"lprice\":\"12900\",\"hprice\":\"\",\"mallName\":\"더캠핑\",\"productId\":\"83426565301\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"돗자리/매트\"},{\"title\":\"엑스포트 A4용지 75g 2500매, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/51929189596\",\"image\":\"https://shopping-phinf.pstatic.net/main_5192918/51929189596.20241213205230.jpg\",\"lprice\":\"15070\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"51929189596\",\"productType\":\"1\",\"brand\":\"엑스포트\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"문구/사무용품\",\"category3\":\"용지\",\"category4\":\"복사지\"},{\"title\":\"화분 대형 거실 플라스틱 인테리어화분 세로플리츠 2647 화이트\",\"link\":\"https://smartstore.naver.com/main/products/2489117355\",\"image\":\"https://shopping-phinf.pstatic.net/main_1348596/13485962768.14.jpg\",\"lprice\":\"33800\",\"hprice\":\"\",\"mallName\":\"밍이네가든\",\"productId\":\"13485962768\",\"productType\":\"2\",\"brand\":\"밍이네가든\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"정원/원예용품\",\"category3\":\"화분\",\"category4\":\"\"},{\"title\":\"크린센스 점보롤 물에잘녹는 뉴욕 엠보싱 300 100m(2겹)x8롤 대용량 업소용 휴지\",\"link\":\"https://smartstore.naver.com/main/products/216843370\",\"image\":\"https://shopping-phinf.pstatic.net/main_7504738/7504738662.4.jpg\",\"lprice\":\"12900\",\"hprice\":\"\",\"mallName\":\"브리즈\",\"productId\":\"7504738662\",\"productType\":\"2\",\"brand\":\"크린센스\",\"maker\":\"동성인터내쇼날\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"점보롤\"},{\"title\":\"샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이\",\"link\":\"https://smartstore.naver.com/main/products/9396357056\",\"image\":\"https://shopping-phinf.pstatic.net/main_8694085/86940857379.1.jpg\",\"lprice\":\"230\",\"hprice\":\"\",\"mallName\":\"EASYWAY\",\"productId\":\"86940857379\",\"productType\":\"2\",\"brand\":\"이지웨이건축자재\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생활잡화\",\"category4\":\"문풍지\"},{\"title\":\"[매일출발]유로블루플러스 차량용 요소수 국내산 Adblue 호스포함\",\"link\":\"https://smartstore.naver.com/main/products/10299892253\",\"image\":\"https://shopping-phinf.pstatic.net/main_8784439/87844396267.17.jpg\",\"lprice\":\"8700\",\"hprice\":\"\",\"mallName\":\"유로블루플러스\",\"productId\":\"87844396267\",\"productType\":\"2\",\"brand\":\"유로블루플러스\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"오일/소모품\",\"category4\":\"요소수\"},{\"title\":\"에이스컴즈맥세이프 차량용 휴대폰 거치대 자석 대시보드 아이폰 아이패드 태블릿마그네틱 갤럭시\",\"link\":\"https://smartstore.naver.com/main/products/8362734879\",\"image\":\"https://shopping-phinf.pstatic.net/main_8590723/85907235202.9.jpg\",\"lprice\":\"27900\",\"hprice\":\"\",\"mallName\":\"에이스컴즈\",\"productId\":\"85907235202\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"휴대폰용품\",\"category4\":\"차량용휴대폰거치대\"},{\"title\":\"[팝마트] 스컬판다 겨울 교향곡 시리즈 인형 키링 / 랜덤피규어\",\"link\":\"https://smartstore.naver.com/main/products/11236456326\",\"image\":\"https://shopping-phinf.pstatic.net/main_8878096/88780966657.jpg\",\"lprice\":\"28000\",\"hprice\":\"\",\"mallName\":\"팝마트코리아 공식 스토어\",\"productId\":\"88780966657\",\"productType\":\"2\",\"brand\":\"팝마트\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"수집품\",\"category3\":\"모형/프라모델/피규어\",\"category4\":\"피규어\"},{\"title\":\"자동차 TPE 카매트 차량용 바닥매트 3D 풀커버 BS-04 2륜\",\"link\":\"https://smartstore.naver.com/main/products/7598986439\",\"image\":\"https://shopping-phinf.pstatic.net/main_8514348/85143486761.3.jpg\",\"lprice\":\"98000\",\"hprice\":\"\",\"mallName\":\"유투카\",\"productId\":\"85143486761\",\"productType\":\"2\",\"brand\":\"유투카\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"인테리어용품\",\"category4\":\"바닥매트\"},{\"title\":\"딥디크 차량용 방향제 베이 세트 (케이스+리필용 캡슐)\",\"link\":\"https://smartstore.naver.com/main/products/8199629704\",\"image\":\"https://shopping-phinf.pstatic.net/main_8574413/85744130027.2.jpg\",\"lprice\":\"73500\",\"hprice\":\"\",\"mallName\":\"황가네 장터\",\"productId\":\"85744130027\",\"productType\":\"2\",\"brand\":\"딥티크\",\"maker\":\"딥티크\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"공기청정용품\",\"category4\":\"차량용방향제\"},{\"title\":\"캠핑슬립 라이트 SUV 차박매트 트렁크 매트리스 차량용 평탄화 차박용품 엠보그레이\",\"link\":\"https://smartstore.naver.com/main/products/5960280549\",\"image\":\"https://shopping-phinf.pstatic.net/main_8350478/83504780037.7.jpg\",\"lprice\":\"139000\",\"hprice\":\"\",\"mallName\":\"캠핑슬립\",\"productId\":\"83504780037\",\"productType\":\"2\",\"brand\":\"캠핑슬립\",\"maker\":\"꼬메벨로\",\"category1\":\"생활/건강\",\"category2\":\"자동차용품\",\"category3\":\"인테리어용품\",\"category4\":\"바닥매트\"},{\"title\":\"에이스라이프 대림바스 필터없는 에어버블 방수 비데 DDS-S150A 자가설치\",\"link\":\"https://search.shopping.naver.com/catalog/53786242417\",\"image\":\"https://shopping-phinf.pstatic.net/main_5378624/53786242417.20250326120451.jpg\",\"lprice\":\"186850\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53786242417\",\"productType\":\"1\",\"brand\":\"대림바스\",\"maker\":\"에이스라이프\",\"category1\":\"생활/건강\",\"category2\":\"욕실용품\",\"category3\":\"비데/비데용품\",\"category4\":\"전자식비데\"},{\"title\":\"국산 고용량 멀티탭 안전 접지 대용량 건조기 에어컨 전용 2구 1m\",\"link\":\"https://smartstore.naver.com/main/products/7489457007\",\"image\":\"https://shopping-phinf.pstatic.net/main_8503395/85033957329.7.jpg\",\"lprice\":\"12600\",\"hprice\":\"\",\"mallName\":\"스윗홈 스토어\",\"productId\":\"85033957329\",\"productType\":\"2\",\"brand\":\"스윗홈\",\"maker\":\"스윗홈\",\"category1\":\"생활/건강\",\"category2\":\"공구\",\"category3\":\"전기용품\",\"category4\":\"멀티탭\"},{\"title\":\"하수구트랩 배수구 냄새제거 차단 화장실 욕실 40-99mm\",\"link\":\"https://smartstore.naver.com/main/products/5008920074\",\"image\":\"https://shopping-phinf.pstatic.net/main_8255344/82553440741.14.jpg\",\"lprice\":\"4000\",\"hprice\":\"\",\"mallName\":\"낭만 탐구소\",\"productId\":\"82553440741\",\"productType\":\"2\",\"brand\":\"낭만탐구소\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"욕실용품\",\"category3\":\"샤워기/수전용품\",\"category4\":\"배수구캡\"},{\"title\":\"다우니 향수 컬렉션 초고농축 섬유유연제 5종 패밀리팩 본품 1L 5개\",\"link\":\"https://smartstore.naver.com/main/products/6506976689\",\"image\":\"https://shopping-phinf.pstatic.net/main_8405147/84051477022.65.jpg\",\"lprice\":\"29900\",\"hprice\":\"\",\"mallName\":\"다우니페브리즈공식몰\",\"productId\":\"84051477022\",\"productType\":\"2\",\"brand\":\"다우니\",\"maker\":\"P&G\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"섬유유연제\",\"category4\":\"고농축섬유유연제\"},{\"title\":\"피지 모락셀라 운동복 땀냄새제거 스포츠세제 빨래쉰내 스포츠의류 실내건조 일반드럼 겸용 1.5L 1개+액체세제 70ml 2개\",\"link\":\"https://smartstore.naver.com/main/products/11745635994\",\"image\":\"https://shopping-phinf.pstatic.net/main_8929014/89290146513.8.jpg\",\"lprice\":\"11500\",\"hprice\":\"\",\"mallName\":\"LG생활건강 공식 스토어\",\"productId\":\"89290146513\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"물먹는하마 옷장용300g (물부피525ml) 제습제 냄새먹는하마 8개입, 3개\",\"link\":\"https://smartstore.naver.com/main/products/11662326588\",\"image\":\"https://shopping-phinf.pstatic.net/main_8920683/89206837055.jpg\",\"lprice\":\"35900\",\"hprice\":\"\",\"mallName\":\"조아나라\",\"productId\":\"89206837055\",\"productType\":\"2\",\"brand\":\"물먹는하마\",\"maker\":\"옥시레킷벤키저\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"제습/방향/탈취\",\"category4\":\"제습제\"},{\"title\":\"안깨지는 세이프티어항 거북이 물고기 열대어 금붕어 구피 키우기 아크릴 수족관 중형 화이트\",\"link\":\"https://smartstore.naver.com/main/products/7536429618\",\"image\":\"https://shopping-phinf.pstatic.net/main_8508092/85080929940.3.jpg\",\"lprice\":\"25860\",\"hprice\":\"\",\"mallName\":\"물고기입니다만\",\"productId\":\"85080929940\",\"productType\":\"2\",\"brand\":\"페이토\",\"maker\":\"페이토코리아\",\"category1\":\"생활/건강\",\"category2\":\"관상어용품\",\"category3\":\"수족관/어항\",\"category4\":\"\"},{\"title\":\"카포드 듀얼코어 캡슐세제 브라이트닝 35개입+파워플러스 35개입,향기부스터 10g x2개\",\"link\":\"https://smartstore.naver.com/main/products/5107921535\",\"image\":\"https://shopping-phinf.pstatic.net/main_8265244/82652443581.109.jpg\",\"lprice\":\"39900\",\"hprice\":\"\",\"mallName\":\"웰스로만센트라린\",\"productId\":\"82652443581\",\"productType\":\"2\",\"brand\":\"카포드\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"세탁세제\"},{\"title\":\"하비비 청개구리 변기클리너 120g, 6개\",\"link\":\"https://search.shopping.naver.com/catalog/52249568626\",\"image\":\"https://shopping-phinf.pstatic.net/main_5224956/52249568626.20250403100046.jpg\",\"lprice\":\"17900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"52249568626\",\"productType\":\"1\",\"brand\":\"하비비\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"세제/세정제\",\"category4\":\"변기세정제\"},{\"title\":\"국산 개별 스위치 과부하차단 4구 1m 멀티 콘센트 안전 접지 슬림 멀티탭\",\"link\":\"https://smartstore.naver.com/main/products/5878545801\",\"image\":\"https://shopping-phinf.pstatic.net/main_8342304/83423045215.15.jpg\",\"lprice\":\"7900\",\"hprice\":\"\",\"mallName\":\"스윗홈 스토어\",\"productId\":\"83423045215\",\"productType\":\"2\",\"brand\":\"스윗홈\",\"maker\":\"스윗홈\",\"category1\":\"생활/건강\",\"category2\":\"공구\",\"category3\":\"전기용품\",\"category4\":\"멀티탭\"},{\"title\":\"선일금고 루셀 지문인식 메타셀 내화금고 MC-ID40\",\"link\":\"https://search.shopping.naver.com/catalog/40617685882\",\"image\":\"https://shopping-phinf.pstatic.net/main_4061768/40617685882.20230726101246.jpg\",\"lprice\":\"598000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"40617685882\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"선일금고\",\"category1\":\"생활/건강\",\"category2\":\"문구/사무용품\",\"category3\":\"사무기기\",\"category4\":\"금고\"},{\"title\":\"오픈형 폴딩박스 리빙박스 56L 투명 옷정리함 옷장 수납함\",\"link\":\"https://smartstore.naver.com/main/products/5403419056\",\"image\":\"https://shopping-phinf.pstatic.net/main_8294791/82947912717.4.jpg\",\"lprice\":\"13800\",\"hprice\":\"\",\"mallName\":\"낭만 탐구소\",\"productId\":\"82947912717\",\"productType\":\"2\",\"brand\":\"낭만탐구소\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"수납/정리용품\",\"category3\":\"정리함\",\"category4\":\"소품정리함\"},{\"title\":\"올챌린지 도톰한 3겹 뽑아쓰는 키친타올 100매 4개+4개+1개 100%천연펄프\",\"link\":\"https://smartstore.naver.com/main/products/6631785129\",\"image\":\"https://shopping-phinf.pstatic.net/main_8417628/84176285451.18.jpg\",\"lprice\":\"10000\",\"hprice\":\"\",\"mallName\":\"올챌린지\",\"productId\":\"84176285451\",\"productType\":\"2\",\"brand\":\"올챌린지\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"화장지\",\"category4\":\"키친타월\"},{\"title\":\"스웰데이 투웨이 쿠션 막대걸레 물걸레 밀대걸레 호환 밀대\",\"link\":\"https://smartstore.naver.com/main/products/9454752218\",\"image\":\"https://shopping-phinf.pstatic.net/main_8699925/86999252541.8.jpg\",\"lprice\":\"12900\",\"hprice\":\"\",\"mallName\":\"스웰데이\",\"productId\":\"86999252541\",\"productType\":\"2\",\"brand\":\"스웰데이\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"청소용품\",\"category3\":\"밀대/패드\",\"category4\":\"\"},{\"title\":\"유한킴벌리 좋은느낌 에어핏쿠션 슈퍼롱 오버나이트, 20개입, 1팩\",\"link\":\"https://search.shopping.naver.com/catalog/52818475675\",\"image\":\"https://shopping-phinf.pstatic.net/main_5281847/52818475675.20250205120235.jpg\",\"lprice\":\"6250\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"52818475675\",\"productType\":\"1\",\"brand\":\"좋은느낌\",\"maker\":\"유한킴벌리\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"생리대\",\"category4\":\"일반생리대\"},{\"title\":\"[옵션] 테팔 인덕션 티타늄 1X 스테인리스 스틸 에센스쿡 프라이팬 20cm\",\"link\":\"https://smartstore.naver.com/main/products/5489216369\",\"image\":\"https://shopping-phinf.pstatic.net/main_8303371/83033711411.25.jpg\",\"lprice\":\"28000\",\"hprice\":\"\",\"mallName\":\"테팔\",\"productId\":\"83033711411\",\"productType\":\"2\",\"brand\":\"테팔\",\"maker\":\"테팔\",\"category1\":\"생활/건강\",\"category2\":\"주방용품\",\"category3\":\"프라이팬\",\"category4\":\"일반프라이팬\"},{\"title\":\"나노 아트2 전기 매립 콘센트 커버 2구\",\"link\":\"https://smartstore.naver.com/main/products/7170895087\",\"image\":\"https://shopping-phinf.pstatic.net/main_8471539/84715395409.1.jpg\",\"lprice\":\"2500\",\"hprice\":\"\",\"mallName\":\"터치전기\",\"productId\":\"84715395409\",\"productType\":\"2\",\"brand\":\"나노\",\"maker\":\"나노\",\"category1\":\"생활/건강\",\"category2\":\"공구\",\"category3\":\"전기용품\",\"category4\":\"기타 전기용품\"},{\"title\":\"P&amp;G 다우니 울트라 섬유유연제 에이프릴 프레쉬, 5.03L, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/53546567170\",\"image\":\"https://shopping-phinf.pstatic.net/main_5354656/53546567170.20250314103924.jpg\",\"lprice\":\"16610\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53546567170\",\"productType\":\"1\",\"brand\":\"다우니\",\"maker\":\"P&G\",\"category1\":\"생활/건강\",\"category2\":\"생활용품\",\"category3\":\"섬유유연제\",\"category4\":\"고농축섬유유연제\"},{\"title\":\"바비온 슬리커 자동 털제거 빗 쓱싹 핀 브러쉬 112ZR 오렌지, M\",\"link\":\"https://search.shopping.naver.com/catalog/53663904900\",\"image\":\"https://shopping-phinf.pstatic.net/main_5366390/53663904900.20250320100513.jpg\",\"lprice\":\"15900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53663904900\",\"productType\":\"1\",\"brand\":\"바비온\",\"maker\":\"바비온\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"브러시/빗\"},{\"title\":\"카스테라 강아지 방석 고양이 마약쿠션 커버분리 코스트코 켄넬 대형 대형견 방석 M\",\"link\":\"https://smartstore.naver.com/main/products/7223807949\",\"image\":\"https://shopping-phinf.pstatic.net/main_8476830/84768308271.11.jpg\",\"lprice\":\"24900\",\"hprice\":\"\",\"mallName\":\"킁킁펫\",\"productId\":\"84768308271\",\"productType\":\"2\",\"brand\":\"킁킁펫\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"가르르 오로라 캣타워 고양이 캣폴 알루미늄+삼줄기둥 일반세트\",\"link\":\"https://smartstore.naver.com/main/products/8406568596\",\"image\":\"https://shopping-phinf.pstatic.net/main_8595106/85951068919.43.jpg\",\"lprice\":\"230000\",\"hprice\":\"\",\"mallName\":\"가르르\",\"productId\":\"85951068919\",\"productType\":\"2\",\"brand\":\"가르르\",\"maker\":\"가르르\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"캣타워/캣폴\"},{\"title\":\"스타일러그 강아지매트 고양이 애견 미끄럼방지 펫 반려견 카페트 바닥 방수 러그 거실\",\"link\":\"https://search.shopping.naver.com/catalog/53705940330\",\"image\":\"https://shopping-phinf.pstatic.net/main_5370594/53705940330.20250404094459.jpg\",\"lprice\":\"18900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53705940330\",\"productType\":\"1\",\"brand\":\"스타일러그\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"LUAZ 강아지 밥그릇 물그릇 고양이 식기 물통 LUAZ-DW01\",\"link\":\"https://search.shopping.naver.com/catalog/36321905955\",\"image\":\"https://shopping-phinf.pstatic.net/main_3632190/36321905955.20240331031626.jpg\",\"lprice\":\"8500\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"36321905955\",\"productType\":\"1\",\"brand\":\"LUAZ\",\"maker\":\"루아즈\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"토마고 강아지 고양이 바리깡 미니 미용기 발 부분 털 발털 클리퍼 발바닥 이발기 화이트\",\"link\":\"https://smartstore.naver.com/main/products/2184526789\",\"image\":\"https://shopping-phinf.pstatic.net/main_1228498/12284980671.36.jpg\",\"lprice\":\"24800\",\"hprice\":\"\",\"mallName\":\"펫방앗간\",\"productId\":\"12284980671\",\"productType\":\"2\",\"brand\":\"토마고\",\"maker\":\"케이엘테크\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"이발기\"},{\"title\":\"강아지 고양이 숨숨집 하우스 텐트 실외 길냥이 길고양이 집 플라스틱 개집\",\"link\":\"https://smartstore.naver.com/main/products/10037143546\",\"image\":\"https://shopping-phinf.pstatic.net/main_8758164/87581646050.jpg\",\"lprice\":\"35900\",\"hprice\":\"\",\"mallName\":\"미우프\",\"productId\":\"87581646050\",\"productType\":\"2\",\"brand\":\"UNKNOWN\",\"maker\":\"UNKNOWN\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"하우스\"},{\"title\":\"실리어스 푸우형 실리콘 강아지매트, 미끄럼방지 애견 롤매트 펫 러그 140x100cm\",\"link\":\"https://smartstore.naver.com/main/products/8719169350\",\"image\":\"https://shopping-phinf.pstatic.net/main_8626366/86263669673.1.jpg\",\"lprice\":\"83000\",\"hprice\":\"\",\"mallName\":\"실리어스\",\"productId\":\"86263669673\",\"productType\":\"2\",\"brand\":\"실리어스\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"사롬사리 강아지 쿨매트 고양이 애견 여름 냉감 패드\",\"link\":\"https://search.shopping.naver.com/catalog/53670171320\",\"image\":\"https://shopping-phinf.pstatic.net/main_5367017/53670171320.20250408070603.jpg\",\"lprice\":\"18500\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53670171320\",\"productType\":\"1\",\"brand\":\"사롬사리\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"[세이버 퐁고 2.0] 펫드라이룸 중형견케어 강아지 고양이 간편 털말리기 애견 애묘 건조기\",\"link\":\"https://smartstore.naver.com/main/products/11102041334\",\"image\":\"https://shopping-phinf.pstatic.net/main_8864655/88646551656.5.jpg\",\"lprice\":\"1190000\",\"hprice\":\"\",\"mallName\":\"세이버 공식몰\",\"productId\":\"88646551656\",\"productType\":\"2\",\"brand\":\"세이버\",\"maker\":\"세이버\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"드라이기/드라이룸\"},{\"title\":\"멍묘인 강아지 2.0텐트 M 집 고양이 숨숨집 예쁜 하우스 개 애견 방석 없음\",\"link\":\"https://smartstore.naver.com/main/products/5776179111\",\"image\":\"https://shopping-phinf.pstatic.net/main_8332067/83320678525.4.jpg\",\"lprice\":\"22900\",\"hprice\":\"\",\"mallName\":\"멍묘인\",\"productId\":\"83320678525\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"하우스\"},{\"title\":\"LUAZ 애견 강아지 방석 고양이 쿠션 담요 이불 LUAZ-DG6\",\"link\":\"https://search.shopping.naver.com/catalog/54279064807\",\"image\":\"https://shopping-phinf.pstatic.net/main_5427906/54279064807.20250502103826.jpg\",\"lprice\":\"7500\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54279064807\",\"productType\":\"1\",\"brand\":\"LUAZ\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"스니프 칠링칠링 듀라론 애견 강아지쿨매트 여름용 반려동물 쿨방석\",\"link\":\"https://search.shopping.naver.com/catalog/33242151678\",\"image\":\"https://shopping-phinf.pstatic.net/main_3324215/33242151678.20250514090745.jpg\",\"lprice\":\"18900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"33242151678\",\"productType\":\"1\",\"brand\":\"스니프\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"접촉냉감 누빔 강아지 쿨매트 고양이 아이스 패드 냉감 매트 M\",\"link\":\"https://smartstore.naver.com/main/products/10615040891\",\"image\":\"https://shopping-phinf.pstatic.net/main_8815954/88159546540.7.jpg\",\"lprice\":\"26800\",\"hprice\":\"\",\"mallName\":\"올웨이즈올펫\",\"productId\":\"88159546540\",\"productType\":\"2\",\"brand\":\"올웨이즈올펫\",\"maker\":\"지오위즈\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"올웨이즈올펫 딩굴 강아지매트 고양이 미끄럼방지 슬개골예방 롤 매트 110x50x0.6cm\",\"link\":\"https://smartstore.naver.com/main/products/5311346622\",\"image\":\"https://shopping-phinf.pstatic.net/main_8285583/82855839069.40.jpg\",\"lprice\":\"10800\",\"hprice\":\"\",\"mallName\":\"올웨이즈올펫\",\"productId\":\"82855839069\",\"productType\":\"2\",\"brand\":\"올웨이즈올펫\",\"maker\":\"지오위즈\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"비엔메이드 무드 롤 시공 강아지매트 애견 방수 미끄럼방지 고양이 매트 70cm X 0.5M\",\"link\":\"https://smartstore.naver.com/main/products/8490392547\",\"image\":\"https://shopping-phinf.pstatic.net/main_8603489/86034892870.1.jpg\",\"lprice\":\"9900\",\"hprice\":\"\",\"mallName\":\"비엔메이드\",\"productId\":\"86034892870\",\"productType\":\"2\",\"brand\":\"비엔메이드\",\"maker\":\"신영인더스\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"가티가티 고양이식기 강아지밥그릇 식탁 1구식기세트 빈티지로즈\",\"link\":\"https://smartstore.naver.com/main/products/5354078062\",\"image\":\"https://shopping-phinf.pstatic.net/main_8289857/82898571031.3.jpg\",\"lprice\":\"26400\",\"hprice\":\"\",\"mallName\":\"가티몰\",\"productId\":\"82898571031\",\"productType\":\"2\",\"brand\":\"가티가티\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"올웨이즈올펫 강아지 쿨방석 고양이 냉감 아이스 쿨쿠션 M\",\"link\":\"https://smartstore.naver.com/main/products/8501680564\",\"image\":\"https://shopping-phinf.pstatic.net/main_8604618/86046180887.10.jpg\",\"lprice\":\"49800\",\"hprice\":\"\",\"mallName\":\"올웨이즈올펫\",\"productId\":\"86046180887\",\"productType\":\"3\",\"brand\":\"펫토\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"슈퍼벳 레날 에이드 280mg x 60캡슐, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/52539061038\",\"image\":\"https://shopping-phinf.pstatic.net/main_5253906/52539061038.20250117155343.jpg\",\"lprice\":\"28700\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"52539061038\",\"productType\":\"1\",\"brand\":\"슈퍼벳\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"영양제\"},{\"title\":\"테일로그 탈출방지 고양이 방묘창 캣키퍼 1개 창문 높이 85\",\"link\":\"https://search.shopping.naver.com/catalog/53922016884\",\"image\":\"https://shopping-phinf.pstatic.net/main_5392201/53922016884.20250403011953.jpg\",\"lprice\":\"32000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53922016884\",\"productType\":\"1\",\"brand\":\"테일로그\",\"maker\":\"테일로그\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"안전문\"},{\"title\":\"[케어사이드] 강아지 고양이 헤파카디오 Q10 60정 심장보조영양제 CARESIDE HEPACARDIO\",\"link\":\"https://smartstore.naver.com/main/products/7102910072\",\"image\":\"https://shopping-phinf.pstatic.net/main_8464741/84647410394.5.jpg\",\"lprice\":\"18990\",\"hprice\":\"\",\"mallName\":\"예쁘개냥\",\"productId\":\"84647410394\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"영양제\"},{\"title\":\"접이식 강아지 고양이 해먹 침대 대형견해먹 캠핑 의자 S\",\"link\":\"https://smartstore.naver.com/main/products/5769443200\",\"image\":\"https://shopping-phinf.pstatic.net/main_8331394/83313942614.2.jpg\",\"lprice\":\"28000\",\"hprice\":\"\",\"mallName\":\"멍심사냥\",\"productId\":\"83313942614\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"침대/해먹\"},{\"title\":\"[페스룸] 네이처 이어 클리너 강아지 고양이 귀세정제 귀청소 귓병 예방\",\"link\":\"https://smartstore.naver.com/main/products/4792716744\",\"image\":\"https://shopping-phinf.pstatic.net/main_8233723/82337239241.3.jpg\",\"lprice\":\"15900\",\"hprice\":\"\",\"mallName\":\"PETHROOM\",\"productId\":\"82337239241\",\"productType\":\"2\",\"brand\":\"페스룸\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"눈/귀 관리용품\"},{\"title\":\"키즈온더블럭 펫도어 견문 강아지 고양이 안전문 베란다 펫도어 시공 미니\",\"link\":\"https://smartstore.naver.com/main/products/7918440666\",\"image\":\"https://shopping-phinf.pstatic.net/main_8546294/85462940989.10.jpg\",\"lprice\":\"98000\",\"hprice\":\"\",\"mallName\":\"키즈온더블럭\",\"productId\":\"85462940989\",\"productType\":\"2\",\"brand\":\"키즈온더블럭\",\"maker\":\"아이작\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"안전문\"},{\"title\":\"퍼키퍼키 강아지밥그릇 고양이밥그릇 물그릇 애견 식기 높이조절 식탁 세트\",\"link\":\"https://smartstore.naver.com/main/products/10268762667\",\"image\":\"https://shopping-phinf.pstatic.net/main_8781326/87813266469.16.jpg\",\"lprice\":\"27900\",\"hprice\":\"\",\"mallName\":\"퍼키퍼키\",\"productId\":\"87813266469\",\"productType\":\"2\",\"brand\":\"퍼키퍼키\",\"maker\":\"퍼키퍼키\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"펫테일 견분무취 200g, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/51929267504\",\"image\":\"https://shopping-phinf.pstatic.net/main_5192926/51929267504.20241213211322.jpg\",\"lprice\":\"18900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"51929267504\",\"productType\":\"1\",\"brand\":\"펫테일\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"영양제\"},{\"title\":\"펫코본 고양이밥그릇 물그릇 강아지 1구 투명 유리 식기 수반\",\"link\":\"https://search.shopping.naver.com/catalog/51181438556\",\"image\":\"https://shopping-phinf.pstatic.net/main_5118143/51181438556.20241211202407.jpg\",\"lprice\":\"16900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"51181438556\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"가또나인 고양이스크래쳐 옐로 레오파드 3PC 스크래쳐 2개\",\"link\":\"https://smartstore.naver.com/main/products/2058243766\",\"image\":\"https://shopping-phinf.pstatic.net/main_1185459/11854591070.14.jpg\",\"lprice\":\"17900\",\"hprice\":\"\",\"mallName\":\"GATO\",\"productId\":\"11854591070\",\"productType\":\"2\",\"brand\":\"가또나인\",\"maker\":\"빅트리\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"스크래쳐\"},{\"title\":\"DUIT 올데이보드 고양이 스크래쳐 장난감\",\"link\":\"https://search.shopping.naver.com/catalog/33691361489\",\"image\":\"https://shopping-phinf.pstatic.net/main_3369136/33691361489.20241015154005.jpg\",\"lprice\":\"28000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"33691361489\",\"productType\":\"1\",\"brand\":\"DUIT\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"스크래쳐\"},{\"title\":\"루시몰 고양이 스크래쳐 원형 대형 특대형 기본 46cm\",\"link\":\"https://smartstore.naver.com/main/products/6659642344\",\"image\":\"https://shopping-phinf.pstatic.net/main_8420414/84204142666.13.jpg\",\"lprice\":\"19000\",\"hprice\":\"\",\"mallName\":\"Lusi mall\",\"productId\":\"84204142666\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"스크래쳐\"},{\"title\":\"강아지 이불 블랭킷 고양이 담요 펫 애견 쿠션 더블유곰 소\",\"link\":\"https://smartstore.naver.com/main/products/8671921224\",\"image\":\"https://shopping-phinf.pstatic.net/main_8621642/86216421547.jpg\",\"lprice\":\"10900\",\"hprice\":\"\",\"mallName\":\"해피앤퍼피\",\"productId\":\"86216421547\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"해피앤퍼피\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"씨리얼펫 젤리냥수기 고양이 세라믹 정수기 반려동물 필터 음수기 1.2L\",\"link\":\"https://search.shopping.naver.com/catalog/30431203499\",\"image\":\"https://shopping-phinf.pstatic.net/main_3043120/30431203499.20250222214801.jpg\",\"lprice\":\"49900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"30431203499\",\"productType\":\"1\",\"brand\":\"씨리얼펫\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"정수기/필터\"},{\"title\":\"수의사가 만든 라퓨클레르 강아지 고양이 샴푸 저자극 보습 목욕 300ml\",\"link\":\"https://smartstore.naver.com/main/products/10582992973\",\"image\":\"https://shopping-phinf.pstatic.net/main_8812749/88127498563.9.jpg\",\"lprice\":\"19900\",\"hprice\":\"\",\"mallName\":\"라퓨클레르\",\"productId\":\"88127498563\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"샴푸/린스/비누\"},{\"title\":\"22kg까지 견디는 고양이 해먹 윈도우 해먹 창문해먹\",\"link\":\"https://smartstore.naver.com/main/products/4709037976\",\"image\":\"https://shopping-phinf.pstatic.net/main_8225355/82253558998.2.jpg\",\"lprice\":\"6900\",\"hprice\":\"\",\"mallName\":\"홈앤스위트\",\"productId\":\"82253558998\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"침대/해먹\"},{\"title\":\"바비온 9in1 올마스터 진공 흡입 미용기 강아지 고양이 이발기 바리깡 클리퍼 셀프미용\",\"link\":\"https://smartstore.naver.com/main/products/10352906076\",\"image\":\"https://shopping-phinf.pstatic.net/main_8789741/87897410549.18.jpg\",\"lprice\":\"179000\",\"hprice\":\"\",\"mallName\":\"바비온코리아\",\"productId\":\"87897410549\",\"productType\":\"2\",\"brand\":\"바비온\",\"maker\":\"바비온\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"이발기\"},{\"title\":\"MOOQS 묵스 우드 스노우 펫 하우스 강아지집 숨숨집 고양이집\",\"link\":\"https://search.shopping.naver.com/catalog/40031843151\",\"image\":\"https://shopping-phinf.pstatic.net/main_4003184/40031843151.20250316173117.jpg\",\"lprice\":\"125000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"40031843151\",\"productType\":\"1\",\"brand\":\"MOOQS\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"하우스\"},{\"title\":\"강아지 샴푸 올인원 린스 100% 천연 약용 각질 비듬 아토피 피부병 고양이겸용 270ml\",\"link\":\"https://smartstore.naver.com/main/products/4737618345\",\"image\":\"https://shopping-phinf.pstatic.net/main_8228213/82282139809.9.jpg\",\"lprice\":\"36000\",\"hprice\":\"\",\"mallName\":\"지켜줄개 댕댕아\",\"productId\":\"82282139809\",\"productType\":\"2\",\"brand\":\"지켜줄개댕댕아\",\"maker\":\"지켜줄개댕댕아\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"샴푸/린스/비누\"},{\"title\":\"강아지 고양이 넥카라 깔대기 목보호대 애견 중성화 쿠션 중형견 피너츠 엘리자베스 그레이M\",\"link\":\"https://smartstore.naver.com/main/products/3973660933\",\"image\":\"https://shopping-phinf.pstatic.net/main_8151818/81518181158.16.jpg\",\"lprice\":\"9800\",\"hprice\":\"\",\"mallName\":\"르쁘띠숑\",\"productId\":\"81518181158\",\"productType\":\"2\",\"brand\":\"패리스독\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"넥카라/보호대\"},{\"title\":\"코드 헬씨에이징 항산화 영양 보조제 2g x 30포, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/51929018110\",\"image\":\"https://shopping-phinf.pstatic.net/main_5192901/51929018110.20241213202545.jpg\",\"lprice\":\"35900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"51929018110\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"코스맥스펫\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"영양제\"},{\"title\":\"세이펫 접이식 안전문 1.5m 고양이 접이식 방묘문\",\"link\":\"https://smartstore.naver.com/main/products/4937924597\",\"image\":\"https://shopping-phinf.pstatic.net/main_8248244/82482448908.10.jpg\",\"lprice\":\"142000\",\"hprice\":\"\",\"mallName\":\"세이펫\",\"productId\":\"82482448908\",\"productType\":\"2\",\"brand\":\"세이펫\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"안전문\"},{\"title\":\"고양이 난간 안전망 복층 베란다 방묘창 방묘문 방충망 캣도어 일반형검정1mx1m\",\"link\":\"https://smartstore.naver.com/main/products/6187449408\",\"image\":\"https://shopping-phinf.pstatic.net/main_8373194/83731948985.5.jpg\",\"lprice\":\"5000\",\"hprice\":\"\",\"mallName\":\"나이스메쉬\",\"productId\":\"83731948985\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"안전문\"},{\"title\":\"티지오매트 우다다 강아지매트 애견 롤 미끄럼방지 거실 복도 펫 110x50cm (10T)\",\"link\":\"https://smartstore.naver.com/main/products/5154283552\",\"image\":\"https://shopping-phinf.pstatic.net/main_8269880/82698804475.15.jpg\",\"lprice\":\"10900\",\"hprice\":\"\",\"mallName\":\"티지오매트\",\"productId\":\"82698804475\",\"productType\":\"2\",\"brand\":\"티지오매트\",\"maker\":\"티지오\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"[페스룸] 논슬립 폴더블 욕조 강아지 고양이 목욕 접이식 스파욕조 애견욕조\",\"link\":\"https://smartstore.naver.com/main/products/5534035049\",\"image\":\"https://shopping-phinf.pstatic.net/main_8307853/83078530731.2.jpg\",\"lprice\":\"51900\",\"hprice\":\"\",\"mallName\":\"PETHROOM\",\"productId\":\"83078530731\",\"productType\":\"2\",\"brand\":\"페스룸\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"샤워기/욕조\"},{\"title\":\"제스퍼우드 원목 강아지 침대 S 애견 고양이 집 하우스 반려견 반려묘 반려동물 쿠션\",\"link\":\"https://smartstore.naver.com/main/products/4504272686\",\"image\":\"https://shopping-phinf.pstatic.net/main_8204879/82048795634.4.jpg\",\"lprice\":\"55000\",\"hprice\":\"\",\"mallName\":\"제스퍼우드공방\",\"productId\":\"82048795634\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"침대/해먹\"},{\"title\":\"펫코본 강아지집 원목 고양이 숨숨집 애견방석 강아지하우스 아이보리, M\",\"link\":\"https://search.shopping.naver.com/catalog/54190213755\",\"image\":\"https://shopping-phinf.pstatic.net/main_5419021/54190213755.20250414164048.jpg\",\"lprice\":\"49000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54190213755\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"하우스\"},{\"title\":\"[베토퀴놀][냉장배송] 강아지 고양이 아조딜 90캡슐 - 신장질환 보조제\",\"link\":\"https://smartstore.naver.com/main/products/5572133410\",\"image\":\"https://shopping-phinf.pstatic.net/main_8311662/83116629447.11.jpg\",\"lprice\":\"75000\",\"hprice\":\"\",\"mallName\":\"블리펫89\",\"productId\":\"83116629447\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"베토퀴놀\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"영양제\"},{\"title\":\"오구구 강아지 고양이 정수기 분수대\",\"link\":\"https://search.shopping.naver.com/catalog/29974021619\",\"image\":\"https://shopping-phinf.pstatic.net/main_2997402/29974021619.20211206154812.jpg\",\"lprice\":\"29800\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"29974021619\",\"productType\":\"1\",\"brand\":\"오구구\",\"maker\":\"HOLYTACHI\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"정수기/필터\"},{\"title\":\"강아지 방석 쿠션 애견 마약 반려견 꿀잠 개 본능 무중력 중형견 애완견 방석 S\",\"link\":\"https://smartstore.naver.com/main/products/5783071611\",\"image\":\"https://shopping-phinf.pstatic.net/main_8332757/83327571025.6.jpg\",\"lprice\":\"29900\",\"hprice\":\"\",\"mallName\":\"알록달록댕댕샵\",\"productId\":\"83327571025\",\"productType\":\"2\",\"brand\":\"쉼쉼\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"레토 고양이 숨숨집 2단 방석 쿠션 하우스 스크래쳐\",\"link\":\"https://search.shopping.naver.com/catalog/45872181967\",\"image\":\"https://shopping-phinf.pstatic.net/main_4587218/45872181967.20250523124214.jpg\",\"lprice\":\"18170\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"45872181967\",\"productType\":\"1\",\"brand\":\"레토\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"하우스\"},{\"title\":\"바라바 강아지 안전문 견문 애견 고양이 방묘문 베란다 펫도어\",\"link\":\"https://search.shopping.naver.com/catalog/35924635714\",\"image\":\"https://shopping-phinf.pstatic.net/main_3592463/35924635714.20231129051432.jpg\",\"lprice\":\"29800\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"35924635714\",\"productType\":\"1\",\"brand\":\"바라바\",\"maker\":\"바라바\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"안전문\"},{\"title\":\"라우라반 강아지밥그릇 물그릇 고양이 식탁 도자기 높이 조절 식기 그릇 수반\",\"link\":\"https://smartstore.naver.com/main/products/10130414591\",\"image\":\"https://shopping-phinf.pstatic.net/main_8767491/87674917667.1.jpg\",\"lprice\":\"19500\",\"hprice\":\"\",\"mallName\":\"라우라반\",\"productId\":\"87674917667\",\"productType\":\"2\",\"brand\":\"라우라반\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"강아지 고양이 빗 스팀 브러쉬 털청소기 스팀빗\",\"link\":\"https://smartstore.naver.com/main/products/10069170353\",\"image\":\"https://shopping-phinf.pstatic.net/main_8761367/87613672977.17.jpg\",\"lprice\":\"11900\",\"hprice\":\"\",\"mallName\":\"캣트럴파크\",\"productId\":\"87613672977\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"브러시/빗\"},{\"title\":\"비니비니펫 아지트 스크래처 고양이 스크래쳐 대형 숨숨집 하우스 스크래쳐\",\"link\":\"https://smartstore.naver.com/main/products/10280963095\",\"image\":\"https://shopping-phinf.pstatic.net/main_8782546/87825466919.13.jpg\",\"lprice\":\"37900\",\"hprice\":\"\",\"mallName\":\"비니비니펫\",\"productId\":\"87825466919\",\"productType\":\"2\",\"brand\":\"비니비니펫\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"스크래쳐\"},{\"title\":\"퓨어프렌즈 퓨어 밸런스 천연 강아지 샴푸 300ml, 1개\",\"link\":\"https://search.shopping.naver.com/catalog/52203429639\",\"image\":\"https://shopping-phinf.pstatic.net/main_5220342/52203429639.20250331163115.jpg\",\"lprice\":\"23500\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"52203429639\",\"productType\":\"1\",\"brand\":\"퓨어프렌즈\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"샴푸/린스/비누\"},{\"title\":\"고양이 밥그릇 도자기 세라믹 급체방지 슬로우 식기 그릇 높이 식탁\",\"link\":\"https://smartstore.naver.com/main/products/6131993369\",\"image\":\"https://shopping-phinf.pstatic.net/main_8367649/83676492857.2.jpg\",\"lprice\":\"9400\",\"hprice\":\"\",\"mallName\":\"마브펫\",\"productId\":\"83676492857\",\"productType\":\"2\",\"brand\":\"마브펫\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"강아지 고양이 아이스팩 파우치 여름 베개 젤리곰 M사이즈\",\"link\":\"https://smartstore.naver.com/main/products/8554743594\",\"image\":\"https://shopping-phinf.pstatic.net/main_8609924/86099243917.3.jpg\",\"lprice\":\"9900\",\"hprice\":\"\",\"mallName\":\"예쁘개살고양\",\"productId\":\"86099243917\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"강아지 고양이 애견 대형견 하우스 텐트 야외개집 숨숨집 S\",\"link\":\"https://smartstore.naver.com/main/products/7626829741\",\"image\":\"https://shopping-phinf.pstatic.net/main_8517133/85171330063.1.jpg\",\"lprice\":\"24000\",\"hprice\":\"\",\"mallName\":\"미우프\",\"productId\":\"85171330063\",\"productType\":\"2\",\"brand\":\"UNKNOWN\",\"maker\":\"UNKNOWN\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"하우스\"},{\"title\":\"이너피스 원목 강아지집 애견하우스 고양이숨숨집 A\",\"link\":\"https://smartstore.naver.com/main/products/3307441934\",\"image\":\"https://shopping-phinf.pstatic.net/main_8080606/80806066376.14.jpg\",\"lprice\":\"79000\",\"hprice\":\"\",\"mallName\":\"innerpeace이너피스\",\"productId\":\"80806066376\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"하우스\"},{\"title\":\"펫토 알러프리 강아지방석 고양이 애견 쿠션 쿨방석 범퍼형 라이트그레이, M\",\"link\":\"https://search.shopping.naver.com/catalog/54236867637\",\"image\":\"https://shopping-phinf.pstatic.net/main_5423686/54236867637.20250416115734.jpg\",\"lprice\":\"49800\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54236867637\",\"productType\":\"1\",\"brand\":\"펫토\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"원시림의곰 금빗\",\"link\":\"https://search.shopping.naver.com/catalog/54233894193\",\"image\":\"https://shopping-phinf.pstatic.net/main_5423389/54233894193.20250416084020.jpg\",\"lprice\":\"65700\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54233894193\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"브러시/빗\"},{\"title\":\"원목 캣타워 캣워커 캣폴 고양이에버랜드 2 (고양이와나무꾼)\",\"link\":\"https://smartstore.naver.com/main/products/4701485622\",\"image\":\"https://shopping-phinf.pstatic.net/main_8224600/82246006480.11.jpg\",\"lprice\":\"312000\",\"hprice\":\"\",\"mallName\":\"고양이와나무꾼\",\"productId\":\"82246006480\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"캣타워/캣폴\"},{\"title\":\"펫펫펫 고양이 스크래쳐 수직 대형\",\"link\":\"https://smartstore.naver.com/main/products/5491461598\",\"image\":\"https://shopping-phinf.pstatic.net/main_8303595/83035956658.4.jpg\",\"lprice\":\"26700\",\"hprice\":\"\",\"mallName\":\"펫펫펫 PPPET\",\"productId\":\"83035956658\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"스크래쳐\"},{\"title\":\"슈퍼펫 강아지밥그릇 고양이 식기 물그릇 3단 높이조절 커브 도자기 식탁세트\",\"link\":\"https://search.shopping.naver.com/catalog/55401583212\",\"image\":\"https://shopping-phinf.pstatic.net/main_5540158/55401583212.20250621045841.jpg\",\"lprice\":\"22900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"55401583212\",\"productType\":\"1\",\"brand\":\"슈퍼펫\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"펫테일 올독방석 강아지 방석 대형견 쿠션 극세사 면 M\",\"link\":\"https://smartstore.naver.com/main/products/4827270040\",\"image\":\"https://shopping-phinf.pstatic.net/main_8237179/82371792892.3.jpg\",\"lprice\":\"24900\",\"hprice\":\"\",\"mallName\":\"펫테일코리아\",\"productId\":\"82371792892\",\"productType\":\"2\",\"brand\":\"펫테일\",\"maker\":\"주떼인터내셔날\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"펫조은자리 듀라론 100% 강아지 쿨매트 3D에어매쉬 냉감패드 애견 고양이 여름방석\",\"link\":\"https://smartstore.naver.com/main/products/11697645474\",\"image\":\"https://shopping-phinf.pstatic.net/main_8924215/89242155941.1.jpg\",\"lprice\":\"39800\",\"hprice\":\"\",\"mallName\":\"영메디칼바이오\",\"productId\":\"89242155941\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"영메디칼바이오\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"까치토 더보틀 휴대용 강아지 고양이 물통 애견 산책물병 원터치 급수기\",\"link\":\"https://smartstore.naver.com/main/products/9561639195\",\"image\":\"https://shopping-phinf.pstatic.net/main_8710614/87106141465.7.jpg\",\"lprice\":\"9800\",\"hprice\":\"\",\"mallName\":\"까치토\",\"productId\":\"87106141465\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"급수기/물병\"},{\"title\":\"펫모어 오메가침대 여름 방수 쿨매트 슬개골 강아지침대 펫 베드 애견 방석 고양이쇼파 소파 [국내생산]\",\"link\":\"https://smartstore.naver.com/main/products/6096500544\",\"image\":\"https://shopping-phinf.pstatic.net/main_8364100/83641000032.2.jpg\",\"lprice\":\"59000\",\"hprice\":\"\",\"mallName\":\"미르공간\",\"productId\":\"83641000032\",\"productType\":\"2\",\"brand\":\"펫모어\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"침대/해먹\"},{\"title\":\"이츠독 강아지 고양이 쿨매트 인견 방석 여름 애견 쿨링 패드\",\"link\":\"https://smartstore.naver.com/main/products/2964096923\",\"image\":\"https://shopping-phinf.pstatic.net/main_8046184/80461840901.1.jpg\",\"lprice\":\"32000\",\"hprice\":\"\",\"mallName\":\"이츠독\",\"productId\":\"80461840901\",\"productType\":\"2\",\"brand\":\"이츠독\",\"maker\":\"이츠독\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"펫쭈 고양이 AI 자동급식기 강아지 360도 회전 카메라 반려동물 펫\",\"link\":\"https://smartstore.naver.com/main/products/10420577952\",\"image\":\"https://shopping-phinf.pstatic.net/main_8796508/87965082938.17.jpg\",\"lprice\":\"273900\",\"hprice\":\"\",\"mallName\":\"펫쭈\",\"productId\":\"87965082938\",\"productType\":\"2\",\"brand\":\"펫쭈\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"자동급식기\"},{\"title\":\"올웨이즈올펫 코닉 숨숨집 고양이 강아지 하우스 그레이, M\",\"link\":\"https://search.shopping.naver.com/catalog/53665784947\",\"image\":\"https://shopping-phinf.pstatic.net/main_5366578/53665784947.20250320141714.jpg\",\"lprice\":\"25400\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53665784947\",\"productType\":\"1\",\"brand\":\"올웨이즈올펫\",\"maker\":\"지오위즈\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"하우스\"},{\"title\":\"펫초이스 댕피스텔 강아지 텐트 고양이 쿠션 숨숨 집 하우스 크림 크림, S\",\"link\":\"https://search.shopping.naver.com/catalog/54190191811\",\"image\":\"https://shopping-phinf.pstatic.net/main_5419019/54190191811.20250429171332.jpg\",\"lprice\":\"38900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54190191811\",\"productType\":\"1\",\"brand\":\"펫초이스\",\"maker\":\"프랑코모다\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"하우스\"},{\"title\":\"고양이 스크래쳐 숨숨집 하우스 대형 원목 스크레쳐 A type\",\"link\":\"https://smartstore.naver.com/main/products/8137026692\",\"image\":\"https://shopping-phinf.pstatic.net/main_8568152/85681527015.2.jpg\",\"lprice\":\"14900\",\"hprice\":\"\",\"mallName\":\"미우프\",\"productId\":\"85681527015\",\"productType\":\"2\",\"brand\":\"UNKNOWN\",\"maker\":\"UNKNOWN\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"스크래쳐\"},{\"title\":\"제로넥카라 강아지 고양이 초경량 가벼운 편안한 중성화 미용 깔대기 실내용 넥카라\",\"link\":\"https://smartstore.naver.com/main/products/7499603619\",\"image\":\"https://shopping-phinf.pstatic.net/main_8504410/85044103941.jpg\",\"lprice\":\"24000\",\"hprice\":\"\",\"mallName\":\"루니펫\",\"productId\":\"85044103941\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"넥카라/보호대\"},{\"title\":\"펫토 클린펫 강아지 계단 고양이 논슬립 스텝 라이트그레이, 2단\",\"link\":\"https://search.shopping.naver.com/catalog/54892869310\",\"image\":\"https://shopping-phinf.pstatic.net/main_5489286/54892869310.20250521143121.jpg\",\"lprice\":\"49800\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54892869310\",\"productType\":\"1\",\"brand\":\"펫토\",\"maker\":\"펫토\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"계단/스텝\"},{\"title\":\"[폴딩70x60cm] 디팡 4mm 미끄럼방지 강아지 고양이매트 애견매트 슬개골탈구예방\",\"link\":\"https://smartstore.naver.com/main/products/2122490803\",\"image\":\"https://shopping-phinf.pstatic.net/main_1206556/12065560134.58.jpg\",\"lprice\":\"14800\",\"hprice\":\"\",\"mallName\":\"디팡\",\"productId\":\"12065560134\",\"productType\":\"2\",\"brand\":\"디팡\",\"maker\":\"디팡\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"슈퍼벳 안티콜록 강아지 기관지 영양제 협착증 호흡기 기침 약x 60캡슐\",\"link\":\"https://smartstore.naver.com/main/products/8470675034\",\"image\":\"https://shopping-phinf.pstatic.net/main_8601517/86015175357.5.jpg\",\"lprice\":\"25020\",\"hprice\":\"\",\"mallName\":\"슈퍼벳\",\"productId\":\"86015175357\",\"productType\":\"2\",\"brand\":\"슈퍼벳\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"영양제\"},{\"title\":\"HAKKI 강아지 해먹 대형견쿨매트 애견침대 블랙색상 S\",\"link\":\"https://smartstore.naver.com/main/products/3477192248\",\"image\":\"https://shopping-phinf.pstatic.net/main_8102170/81021709385.jpg\",\"lprice\":\"18800\",\"hprice\":\"\",\"mallName\":\"돈키호테쇼핑몰\",\"productId\":\"81021709385\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"돈키호테\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"침대/해먹\"},{\"title\":\"링펫 강아지 고양이 물그릇 밥그릇 식기 아크릴 유리수반 중형\",\"link\":\"https://search.shopping.naver.com/catalog/33629233457\",\"image\":\"https://shopping-phinf.pstatic.net/main_3362923/33629233457.20250512014917.jpg\",\"lprice\":\"18900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"33629233457\",\"productType\":\"1\",\"brand\":\"링펫\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"페노비스 고양이 강아지 치약 바르는 입냄새 플라그 구취 치석 제거 임상균주 오랄벳\",\"link\":\"https://smartstore.naver.com/main/products/10800961164\",\"image\":\"https://shopping-phinf.pstatic.net/main_8834546/88345467154.4.jpg\",\"lprice\":\"15900\",\"hprice\":\"\",\"mallName\":\"페노비스\",\"productId\":\"88345467154\",\"productType\":\"2\",\"brand\":\"페노비스\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"치약\"},{\"title\":\"네네린도 수직 월 고양이 스크래쳐 웜 화이트, L(대형)\",\"link\":\"https://search.shopping.naver.com/catalog/54114571823\",\"image\":\"https://shopping-phinf.pstatic.net/main_5411457/54114571823.20250411160223.jpg\",\"lprice\":\"21400\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54114571823\",\"productType\":\"1\",\"brand\":\"네네린도\",\"maker\":\"네네린도\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"스크래쳐\"},{\"title\":\"리포소펫 강아지매트 미끄럼방지 애견 반려견 거실 복도 셀프시공 롤매트 6T 110X50cm\",\"link\":\"https://smartstore.naver.com/main/products/5151541190\",\"image\":\"https://shopping-phinf.pstatic.net/main_8269606/82696062046.45.jpg\",\"lprice\":\"11400\",\"hprice\":\"\",\"mallName\":\"리포소펫\",\"productId\":\"82696062046\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"매트\"},{\"title\":\"페노비스 고양이 강아지 관절영양제 슬개골 연골 관절염 노견영양제 캡슐 벳 글루코사민\",\"link\":\"https://smartstore.naver.com/main/products/11149454290\",\"image\":\"https://shopping-phinf.pstatic.net/main_8869396/88693964612.5.jpg\",\"lprice\":\"22900\",\"hprice\":\"\",\"mallName\":\"페노비스\",\"productId\":\"88693964612\",\"productType\":\"2\",\"brand\":\"페노비스\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"영양제\"},{\"title\":\"펫코본 강아지계단 고양이 논슬립 애견 펫스텝 침대 슬라이드 A형\",\"link\":\"https://search.shopping.naver.com/catalog/55343999616\",\"image\":\"https://shopping-phinf.pstatic.net/main_5534399/55343999616.20250618102528.jpg\",\"lprice\":\"59000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"55343999616\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"계단/스텝\"},{\"title\":\"보울보울 고양이 밥그릇 강아지 식기 헬로볼 세트\",\"link\":\"https://smartstore.naver.com/main/products/5108893506\",\"image\":\"https://shopping-phinf.pstatic.net/main_8265341/82653415552.10.jpg\",\"lprice\":\"31900\",\"hprice\":\"\",\"mallName\":\"보울보울\",\"productId\":\"82653415552\",\"productType\":\"2\",\"brand\":\"보울보울\",\"maker\":\"보울보울\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"강아지방석 고양이 쿠션 매트 유모차 개모차 개 꿀잠 이불 원터치 떠블유곰 소\",\"link\":\"https://smartstore.naver.com/main/products/8571815502\",\"image\":\"https://shopping-phinf.pstatic.net/main_8611631/86116315825.jpg\",\"lprice\":\"32000\",\"hprice\":\"\",\"mallName\":\"해피앤퍼피\",\"productId\":\"86116315825\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"해피앤퍼피\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"큐브플래닛 윈도우 고양이 선반 해먹 캣워커 캣선반 소형 (창문, 창틀에 설치하세요)\",\"link\":\"https://smartstore.naver.com/main/products/5660301120\",\"image\":\"https://shopping-phinf.pstatic.net/main_8320479/83204798455.9.jpg\",\"lprice\":\"19800\",\"hprice\":\"\",\"mallName\":\"큐브 플래닛\",\"productId\":\"83204798455\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"캣타워/캣폴\"},{\"title\":\"아껴주다 저자극 천연 고양이 샴푸 500ml (고양이 비듬, 턱드름 관리)\",\"link\":\"https://smartstore.naver.com/main/products/5054264001\",\"image\":\"https://shopping-phinf.pstatic.net/main_8259878/82598785222.12.jpg\",\"lprice\":\"18500\",\"hprice\":\"\",\"mallName\":\"아껴주다\",\"productId\":\"82598785222\",\"productType\":\"2\",\"brand\":\"아껴주다\",\"maker\":\"아껴주다\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"샴푸/린스/비누\"},{\"title\":\"하개랩 상쾌하개 강아지 고양이 기관지 영양제 협착증 기침 켁켁거림\",\"link\":\"https://smartstore.naver.com/main/products/10078212989\",\"image\":\"https://shopping-phinf.pstatic.net/main_8762271/87622715642.2.jpg\",\"lprice\":\"25000\",\"hprice\":\"\",\"mallName\":\"하개 LAB\",\"productId\":\"87622715642\",\"productType\":\"2\",\"brand\":\"하개LAB\",\"maker\":\"칠명바이오\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"강아지 건강/관리용품\",\"category4\":\"영양제\"},{\"title\":\"강아지 방석 대형견 애견 쿠션 포근한 반려견 침대 그레이 L\",\"link\":\"https://smartstore.naver.com/main/products/5652281382\",\"image\":\"https://shopping-phinf.pstatic.net/main_8319677/83196778686.41.jpg\",\"lprice\":\"19800\",\"hprice\":\"\",\"mallName\":\"펫브랜디\",\"productId\":\"83196778686\",\"productType\":\"2\",\"brand\":\"펫브랜디\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"쿠션/방석\"},{\"title\":\"네코이찌 고양이 발톱깍이\",\"link\":\"https://search.shopping.naver.com/catalog/53669243993\",\"image\":\"https://shopping-phinf.pstatic.net/main_5366924/53669243993.20250320194701.jpg\",\"lprice\":\"15900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53669243993\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"발톱/발 관리\"},{\"title\":\"펠리웨이 클래식 스타터키트 고양이 페로몬 디퓨저 이사 동물병원외출 스트레스완화 진정\",\"link\":\"https://smartstore.naver.com/main/products/11486023143\",\"image\":\"https://shopping-phinf.pstatic.net/main_8903053/89030533508.jpg\",\"lprice\":\"34000\",\"hprice\":\"\",\"mallName\":\"MOKOA\",\"productId\":\"89030533508\",\"productType\":\"2\",\"brand\":\"펠리웨이\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"에센스/향수/밤\"},{\"title\":\"위티 강아지 빗 콤빗 고양이 슬리커 브러쉬\",\"link\":\"https://smartstore.naver.com/main/products/9970804750\",\"image\":\"https://shopping-phinf.pstatic.net/main_8751530/87515307023.2.jpg\",\"lprice\":\"8900\",\"hprice\":\"\",\"mallName\":\"위티witty\",\"productId\":\"87515307023\",\"productType\":\"2\",\"brand\":\"ouitt\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"브러시/빗\"},{\"title\":\"보니렌 퓨어냥 고양이 정수기 강아지정수기 고양이 음수대 자동급수기\",\"link\":\"https://smartstore.naver.com/main/products/11364128365\",\"image\":\"https://shopping-phinf.pstatic.net/main_8890863/88908638730.5.jpg\",\"lprice\":\"59900\",\"hprice\":\"\",\"mallName\":\"보니렌\",\"productId\":\"88908638730\",\"productType\":\"2\",\"brand\":\"보니렌\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"정수기/필터\"},{\"title\":\"탑컷 애견이발기 YD9000 프로 클리퍼 강아지 고양이 미용 바리깡\",\"link\":\"https://smartstore.naver.com/main/products/5238078134\",\"image\":\"https://shopping-phinf.pstatic.net/main_8278260/82782600545.6.jpg\",\"lprice\":\"90000\",\"hprice\":\"\",\"mallName\":\"탑컷\",\"productId\":\"82782600545\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"이발기\"},{\"title\":\"세임스텝 [무선] 애견 미용기 클리퍼 강아지 고양이 바리깡 셀프 펫 진공 흡입 털 청소기\",\"link\":\"https://smartstore.naver.com/main/products/11205843632\",\"image\":\"https://shopping-phinf.pstatic.net/main_8875035/88750353963.2.jpg\",\"lprice\":\"109900\",\"hprice\":\"\",\"mallName\":\"뉴트로 스토어\",\"productId\":\"88750353963\",\"productType\":\"2\",\"brand\":\"세임스텝\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"미용/목욕\",\"category4\":\"이발기\"},{\"title\":\"독톡 강아지 커스텀 울타리 1P\",\"link\":\"https://smartstore.naver.com/main/products/2426030847\",\"image\":\"https://shopping-phinf.pstatic.net/main_1325105/13251055464.14.jpg\",\"lprice\":\"22500\",\"hprice\":\"\",\"mallName\":\"독톡\",\"productId\":\"13251055464\",\"productType\":\"2\",\"brand\":\"독톡\",\"maker\":\"독톡\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"울타리\"},{\"title\":\"캣튜디오 고양이 유리 물그릇 강아지 밥그릇 식기 수반 유리화이트식기S\",\"link\":\"https://smartstore.naver.com/main/products/6512908155\",\"image\":\"https://shopping-phinf.pstatic.net/main_8405740/84057408488.7.jpg\",\"lprice\":\"7400\",\"hprice\":\"\",\"mallName\":\"캣튜디오\",\"productId\":\"84057408488\",\"productType\":\"2\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"공간녹백 고양이 캣휠 무소음 켓휠 쳇바퀴 M 1개\",\"link\":\"https://search.shopping.naver.com/catalog/49559295153\",\"image\":\"https://shopping-phinf.pstatic.net/main_4955929/49559295153.20240802032032.jpg\",\"lprice\":\"82000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"49559295153\",\"productType\":\"1\",\"brand\":\"\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"캣타워/스크래쳐\",\"category4\":\"캣휠\"},{\"title\":\"바라바 강아지 밥그릇 고양이 물그릇 애견 도자기 그릇 높이조절 식기 식탁 수반 세트\",\"link\":\"https://search.shopping.naver.com/catalog/50033034869\",\"image\":\"https://shopping-phinf.pstatic.net/main_5003303/50033034869.20240829050921.jpg\",\"lprice\":\"28800\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"50033034869\",\"productType\":\"1\",\"brand\":\"바라바\",\"maker\":\"바라바\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"식기/급수기\",\"category4\":\"식기/식탁\"},{\"title\":\"이드몽 강아지 넥카라 고양이 애견 깔대기 쿠션 시즌2프라가S\",\"link\":\"https://search.shopping.naver.com/catalog/36713411331\",\"image\":\"https://shopping-phinf.pstatic.net/main_3671341/36713411331.20230618043123.jpg\",\"lprice\":\"13900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"36713411331\",\"productType\":\"1\",\"brand\":\"이드몽\",\"maker\":\"\",\"category1\":\"생활/건강\",\"category2\":\"반려동물\",\"category3\":\"리빙용품\",\"category4\":\"넥카라/보호대\"},{\"title\":\"Apple 아이패드 11세대 실버, 128GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53370909201\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337090/53370909201.20250403155536.jpg\",\"lprice\":\"520500\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53370909201\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 11세대 블루, 128GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53370758552\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337075/53370758552.20250403155332.jpg\",\"lprice\":\"525800\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53370758552\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 11세대 핑크, 128GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53370808130\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337080/53370808130.20250403155104.jpg\",\"lprice\":\"527700\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53370808130\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 11세대 옐로, 128GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53370875209\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337087/53370875209.20250403155436.jpg\",\"lprice\":\"525900\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53370875209\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 에어 11 7세대 M3 스페이스그레이, 128GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53371237199\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337123/53371237199.20250403153417.jpg\",\"lprice\":\"884810\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53371237199\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 11세대 실버, 256GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53370909202\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337090/53370909202.20250403155553.jpg\",\"lprice\":\"679000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53370909202\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 미니 7세대 스페이스그레이, 128GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53351852199\",\"image\":\"https://shopping-phinf.pstatic.net/main_5335185/53351852199.20250304153610.jpg\",\"lprice\":\"696570\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53351852199\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 에어 13 7세대 M3 스페이스그레이, 128GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53371410788\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337141/53371410788.20250403154146.jpg\",\"lprice\":\"1199040\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53371410788\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 프로 11 5세대 M4 스탠다드 글래스 스페이스 블랙, 256GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53394317288\",\"image\":\"https://shopping-phinf.pstatic.net/main_5339431/53394317288.20250306171208.jpg\",\"lprice\":\"1393580\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53394317288\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 프로 13 7세대 M4 스탠다드 글래스 스페이스 블랙, 256GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53491820442\",\"image\":\"https://shopping-phinf.pstatic.net/main_5349182/53491820442.20250311162829.jpg\",\"lprice\":\"1897700\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53491820442\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 11세대 블루, 256GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53370758553\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337075/53370758553.20250403155346.jpg\",\"lprice\":\"679000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53370758553\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"애플 아이패드 11세대 A16 WIFI 128GB 2025출시 관부포함 미국애플정품\",\"link\":\"https://smartstore.naver.com/main/products/11553506634\",\"image\":\"https://shopping-phinf.pstatic.net/main_8909801/89098017040.3.jpg\",\"lprice\":\"459900\",\"hprice\":\"\",\"mallName\":\"제니퍼스토리\",\"productId\":\"89098017040\",\"productType\":\"2\",\"brand\":\"아이패드\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 10세대 실버, 64GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53212173186\",\"image\":\"https://shopping-phinf.pstatic.net/main_5321217/53212173186.20250225172035.jpg\",\"lprice\":\"557000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53212173186\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 2025 아이패드 에어 11 M3  스페이스그레이  128GB  Wi-Fi MC9W4KH/A\",\"link\":\"https://link.coupang.com/re/PCSNAVERPCSDP?pageKey=8820001925&ctag=8820001925&lptag=I25079475724&itemId=25079475724&vendorItemId=92083407421&spec=10305197\",\"image\":\"https://shopping-phinf.pstatic.net/main_5393557/53935570413.1.jpg\",\"lprice\":\"884820\",\"hprice\":\"\",\"mallName\":\"쿠팡\",\"productId\":\"53935570413\",\"productType\":\"3\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"미사용 애플 아이패드 미니 5세대 WIFI 64GB 스페이스그레이\",\"link\":\"https://smartstore.naver.com/main/products/6555981468\",\"image\":\"https://shopping-phinf.pstatic.net/main_8410048/84100481801.jpg\",\"lprice\":\"398000\",\"hprice\":\"\",\"mallName\":\"도란:\",\"productId\":\"84100481801\",\"productType\":\"2\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 에어 11 7세대 M3 퍼플, 128GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53371237381\",\"image\":\"https://shopping-phinf.pstatic.net/main_5337123/53371237381.20250403153732.jpg\",\"lprice\":\"897000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53371237381\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 9세대 스페이스그레이, 64GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53352561711\",\"image\":\"https://shopping-phinf.pstatic.net/main_5335256/53352561711.20250304165819.jpg\",\"lprice\":\"434490\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53352561711\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"[미국당일출고]애플 아이패드 11세대 A16 WIFI 128GB 2025 신제품 미국 정품\",\"link\":\"https://smartstore.naver.com/main/products/11553327971\",\"image\":\"https://shopping-phinf.pstatic.net/main_8909783/89097838377.4.jpg\",\"lprice\":\"459900\",\"hprice\":\"\",\"mallName\":\"뉴욕 스토리\",\"productId\":\"89097838377\",\"productType\":\"2\",\"brand\":\"아이패드\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 에어 13 6세대 M2 퍼플, 128GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53318261103\",\"image\":\"https://shopping-phinf.pstatic.net/main_5331826/53318261103.20250303172440.jpg\",\"lprice\":\"1019140\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53318261103\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"Apple 아이패드 프로 11 5세대 M4 스탠다드 글래스 실버, 256GB, WiFi전용\",\"link\":\"https://search.shopping.naver.com/catalog/53394328115\",\"image\":\"https://shopping-phinf.pstatic.net/main_5339432/53394328115.20250306172608.jpg\",\"lprice\":\"1392840\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53394328115\",\"productType\":\"1\",\"brand\":\"Apple\",\"maker\":\"Apple\",\"category1\":\"디지털/가전\",\"category2\":\"태블릿PC\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"삼성 노트북 i7 윈도우11프로 사무용 인강용 업무용 교육용 학생 노트북 NT551XDA [소상공인/기업체 우대]\",\"link\":\"https://smartstore.naver.com/main/products/10532359076\",\"image\":\"https://shopping-phinf.pstatic.net/main_8807686/88076864436.4.jpg\",\"lprice\":\"2598990\",\"hprice\":\"\",\"mallName\":\"삼성온라인몰\",\"productId\":\"88076864436\",\"productType\":\"2\",\"brand\":\"삼성\",\"maker\":\"삼성전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"ASUS ROG Flow Z13 GZ302EA-RU110W 64GB, 1TB\",\"link\":\"https://search.shopping.naver.com/catalog/53902497170\",\"image\":\"https://shopping-phinf.pstatic.net/main_5390249/53902497170.20250401141458.jpg\",\"lprice\":\"3749000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53902497170\",\"productType\":\"1\",\"brand\":\"ASUS\",\"maker\":\"ASUS\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"ASUS 노트북 비보북15 라이젠7 8GB 512GB 대학생 인강용 사무용 저렴한 포토샵\",\"link\":\"https://smartstore.naver.com/main/products/11577222869\",\"image\":\"https://shopping-phinf.pstatic.net/main_8912173/89121733275.4.jpg\",\"lprice\":\"519000\",\"hprice\":\"\",\"mallName\":\"창이로운\",\"productId\":\"89121733275\",\"productType\":\"2\",\"brand\":\"ASUS\",\"maker\":\"ASUS\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"삼성전자 갤럭시북5 프로 NT960XHA-KP72G 32GB, 512GB\",\"link\":\"https://search.shopping.naver.com/catalog/54024331464\",\"image\":\"https://shopping-phinf.pstatic.net/main_5402433/54024331464.20250407101024.jpg\",\"lprice\":\"2309980\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54024331464\",\"productType\":\"1\",\"brand\":\"갤럭시북5 프로\",\"maker\":\"삼성전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"ASUS 젠북 A14 퀄컴 스냅드래곤X 초경량 사무용 대학생 업무용 노트북 Win11\",\"link\":\"https://smartstore.naver.com/main/products/11359933656\",\"image\":\"https://shopping-phinf.pstatic.net/main_8890444/88904444007.jpg\",\"lprice\":\"1166000\",\"hprice\":\"\",\"mallName\":\"ASUS공식총판 에스라이즈\",\"productId\":\"88904444007\",\"productType\":\"2\",\"brand\":\"ASUS\",\"maker\":\"ASUS\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"삼성전자 갤럭시북5 프로360 NT960QHA-KC71G\",\"link\":\"https://search.shopping.naver.com/catalog/51340833624\",\"image\":\"https://shopping-phinf.pstatic.net/main_5134083/51340833624.20241111121622.jpg\",\"lprice\":\"2224980\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"51340833624\",\"productType\":\"1\",\"brand\":\"갤럭시북5 프로360\",\"maker\":\"삼성전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"주연테크 캐리북e J3GW\",\"link\":\"https://search.shopping.naver.com/catalog/24875454523\",\"image\":\"https://shopping-phinf.pstatic.net/main_2487545/24875454523.20201117114806.jpg\",\"lprice\":\"219000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"24875454523\",\"productType\":\"1\",\"brand\":\"주연테크\",\"maker\":\"주연테크\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"엘지 그램 14세대 울트라 7 AI 인공지능 32GB 1TB 17Z90S 터치 병행\",\"link\":\"https://smartstore.naver.com/main/products/7049938391\",\"image\":\"https://shopping-phinf.pstatic.net/main_8459443/84594438713.11.jpg\",\"lprice\":\"1749000\",\"hprice\":\"\",\"mallName\":\"G-스토어\",\"productId\":\"84594438713\",\"productType\":\"2\",\"brand\":\"LG그램\",\"maker\":\"LG전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"삼성전자 갤럭시북4 NT750XGR-A71A 사무용 업무용 i7 노트북\",\"link\":\"https://smartstore.naver.com/main/products/10093514318\",\"image\":\"https://shopping-phinf.pstatic.net/main_8763801/87638016995.14.jpg\",\"lprice\":\"1098000\",\"hprice\":\"\",\"mallName\":\"삼성공식파트너 코인비엠에스\",\"productId\":\"87638016995\",\"productType\":\"3\",\"brand\":\"갤럭시북4\",\"maker\":\"삼성전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"레노버 아이디어패드 Slim3 15ABR8 82XM00ELKR RAM 16GB, 512GB\",\"link\":\"https://search.shopping.naver.com/catalog/54909327778\",\"image\":\"https://shopping-phinf.pstatic.net/main_5490932/54909327778.20250522125003.jpg\",\"lprice\":\"559000\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54909327778\",\"productType\":\"1\",\"brand\":\"아이디어패드\",\"maker\":\"레노버\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"MSI 게이밍노트북 17 영상편집 캐드 고사양 i9 13980HX RTX 4070 노트북\",\"link\":\"https://smartstore.naver.com/main/products/11205471249\",\"image\":\"https://shopping-phinf.pstatic.net/main_8874998/88749981580.1.jpg\",\"lprice\":\"1999000\",\"hprice\":\"\",\"mallName\":\"에이치텍 스토어\",\"productId\":\"88749981580\",\"productType\":\"2\",\"brand\":\"MSI\",\"maker\":\"MSI\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"삼성전자 갤럭시북3 NT750XFT-A51A\",\"link\":\"https://search.shopping.naver.com/catalog/39746112618\",\"image\":\"https://shopping-phinf.pstatic.net/main_3974611/39746112618.20230502165309.jpg\",\"lprice\":\"798990\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"39746112618\",\"productType\":\"1\",\"brand\":\"갤럭시북3\",\"maker\":\"삼성전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"삼성전자 갤럭시북4 NT750XGQ-A51A\",\"link\":\"https://search.shopping.naver.com/catalog/46633068618\",\"image\":\"https://shopping-phinf.pstatic.net/main_4663306/46633068618.20240325185204.jpg\",\"lprice\":\"1098990\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"46633068618\",\"productType\":\"1\",\"brand\":\"갤럭시북4\",\"maker\":\"삼성전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"LG전자 울트라PC 15UD50R-GX56K 8GB, 256GB\",\"link\":\"https://search.shopping.naver.com/catalog/54398511102\",\"image\":\"https://shopping-phinf.pstatic.net/main_5439851/54398511102.20250424175153.jpg\",\"lprice\":\"558890\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54398511102\",\"productType\":\"1\",\"brand\":\"울트라PC\",\"maker\":\"LG전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"LG전자 그램 프로 16ZD90SP-GX56K 16GB, 256GB\",\"link\":\"https://search.shopping.naver.com/catalog/52647379133\",\"image\":\"https://shopping-phinf.pstatic.net/main_5264737/52647379133.20250124115648.jpg\",\"lprice\":\"1466380\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"52647379133\",\"productType\":\"1\",\"brand\":\"그램 프로\",\"maker\":\"LG전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"LG전자 LG그램 15ZD90T-GX59K 32GB, 256GB\",\"link\":\"https://search.shopping.naver.com/catalog/54672053704\",\"image\":\"https://shopping-phinf.pstatic.net/main_5467205/54672053704.20250509164753.jpg\",\"lprice\":\"1668940\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"54672053704\",\"productType\":\"1\",\"brand\":\"LG그램\",\"maker\":\"LG전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"HP OMEN 16-xf0052ax 16GB, 1TB\",\"link\":\"https://search.shopping.naver.com/catalog/53663904780\",\"image\":\"https://shopping-phinf.pstatic.net/main_5366390/53663904780.20250320095528.jpg\",\"lprice\":\"1888950\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53663904780\",\"productType\":\"1\",\"brand\":\"HP\",\"maker\":\"HP\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"삼성노트북 2024 갤럭시북4 NT750XGR-A51A SSD 총 512GB 윈도우11홈\",\"link\":\"https://smartstore.naver.com/main/products/10164369375\",\"image\":\"https://shopping-phinf.pstatic.net/main_8770887/87708872717.jpg\",\"lprice\":\"949000\",\"hprice\":\"\",\"mallName\":\"더하기Shop\",\"productId\":\"87708872717\",\"productType\":\"2\",\"brand\":\"갤럭시북4\",\"maker\":\"삼성전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"삼성전자 갤럭시북5 프로360 NT960QHA-KD72 32GB, 1TB\",\"link\":\"https://search.shopping.naver.com/catalog/53666908447\",\"image\":\"https://shopping-phinf.pstatic.net/main_5366690/53666908447.20250320160726.jpg\",\"lprice\":\"2698990\",\"hprice\":\"\",\"mallName\":\"네이버\",\"productId\":\"53666908447\",\"productType\":\"1\",\"brand\":\"갤럭시북5 프로360\",\"maker\":\"삼성전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"},{\"title\":\"LG그램 노트북 가벼운 가성비 그램 AI AMD 크라켄5 16GB\",\"link\":\"https://smartstore.naver.com/main/products/11859744023\",\"image\":\"https://shopping-phinf.pstatic.net/main_8940425/89404254616.jpg\",\"lprice\":\"1199000\",\"hprice\":\"\",\"mallName\":\"카인드스토어몰\",\"productId\":\"89404254616\",\"productType\":\"2\",\"brand\":\"LG전자\",\"maker\":\"LG전자\",\"category1\":\"디지털/가전\",\"category2\":\"노트북\",\"category3\":\"\",\"category4\":\"\"}]");
/**
* 상품 데이터 (JSON에서 가져온 원본 데이터)
*/
const items = items_default;
/**
* 딜레이 함수 (API 응답 시뮬레이션)
*/
const delay = async () => await new Promise((resolve) => setTimeout(resolve, 200));
/**
* 카테고리 추출 함수
*/
function getUniqueCategories() {
	const categories = {};
	items.forEach((item) => {
		const cat1 = item.category1;
		const cat2 = item.category2;
		if (!categories[cat1]) categories[cat1] = {};
		if (cat2 && !categories[cat1][cat2]) categories[cat1][cat2] = {};
	});
	return categories;
}
/**
* 상품 검색 및 필터링 함수
*/
function filterProducts(products, query) {
	let filtered = [...products];
	if (query.search) {
		const searchTerm = query.search.toLowerCase();
		filtered = filtered.filter((item) => item.title.toLowerCase().includes(searchTerm) || item.brand.toLowerCase().includes(searchTerm));
	}
	if (query.category1) filtered = filtered.filter((item) => item.category1 === query.category1);
	if (query.category2) filtered = filtered.filter((item) => item.category2 === query.category2);
	if (query.sort) switch (query.sort) {
		case "price_asc":
			filtered.sort((a, b) => parseInt(a.lprice) - parseInt(b.lprice));
			break;
		case "price_desc":
			filtered.sort((a, b) => parseInt(b.lprice) - parseInt(a.lprice));
			break;
		case "name_asc":
			filtered.sort((a, b) => a.title.localeCompare(b.title, "ko"));
			break;
		case "name_desc":
			filtered.sort((a, b) => b.title.localeCompare(a.title, "ko"));
			break;
		default: filtered.sort((a, b) => parseInt(a.lprice) - parseInt(b.lprice));
	}
	return filtered;
}
const handlers = [
	http.get("/api/products", async ({ request }) => {
		const url = new URL(request.url);
		const page = Number(url.searchParams.get("page") ?? url.searchParams.get("current") ?? "1");
		const limit = Number(url.searchParams.get("limit") ?? "20");
		const search = url.searchParams.get("search") || "";
		const category1 = url.searchParams.get("category1") || "";
		const category2 = url.searchParams.get("category2") || "";
		const sort = url.searchParams.get("sort") || "price_asc";
		const filteredProducts = filterProducts(items, {
			search,
			category1,
			category2,
			sort
		});
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
		const response = {
			products: paginatedProducts,
			pagination: {
				page,
				limit,
				total: filteredProducts.length,
				totalPages: Math.ceil(filteredProducts.length / limit),
				hasNext: endIndex < filteredProducts.length,
				hasPrev: page > 1
			},
			filters: {
				search,
				category1,
				category2,
				sort
			}
		};
		await delay();
		return HttpResponse.json(response);
	}),
	http.get("/api/products/:id", async ({ params }) => {
		const { id } = params;
		const product = items.find((item) => item.productId === id);
		if (!product) return HttpResponse.json({ error: "Product not found" }, { status: 404 });
		const detailProduct = {
			...product,
			description: `${product.title}에 대한 상세 설명입니다. ${product.brand} 브랜드의 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다.`,
			rating: Math.floor(Math.random() * 2) + 4,
			reviewCount: Math.floor(Math.random() * 1e3) + 50,
			stock: Math.floor(Math.random() * 100) + 10,
			images: [
				product.image,
				product.image.replace(".jpg", "_2.jpg"),
				product.image.replace(".jpg", "_3.jpg")
			]
		};
		await delay();
		return HttpResponse.json(detailProduct);
	}),
	http.get("/api/categories", async () => {
		const categories = getUniqueCategories();
		await delay();
		return HttpResponse.json(categories);
	})
];
const worker = setupWorker(...handlers);
export { worker };
