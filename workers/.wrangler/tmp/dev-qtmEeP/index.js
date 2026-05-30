var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) =>
  function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res);
  };
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod
  )
);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-jHi9tU/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
var init_strip_cf_connecting_ip_header = __esm({
  ".wrangler/tmp/bundle-jHi9tU/strip-cf-connecting-ip-header.js"() {
    "use strict";
    __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [stripCfConnectingIPHeader.apply(null, argArray)]);
      },
    });
  },
});

// node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  },
});

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin,
  _performanceNow,
  nodeTiming,
  PerformanceEntry,
  PerformanceMark,
  PerformanceMeasure,
  PerformanceResourceTiming,
  PerformanceObserverEntryList,
  Performance,
  PerformanceObserver,
  performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now
      ? globalThis.performance.now.bind(globalThis.performance)
      : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0,
      },
      detail: void 0,
      toJSON() {
        return this;
      },
    };
    PerformanceEntry = class {
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail,
        };
      }
    };
    __name(PerformanceEntry, "PerformanceEntry");
    PerformanceMark = /* @__PURE__ */ __name(
      class PerformanceMark2 extends PerformanceEntry {
        entryType = "mark";
        constructor() {
          super(...arguments);
        }
        get duration() {
          return 0;
        }
      },
      "PerformanceMark"
    );
    PerformanceMeasure = class extends PerformanceEntry {
      entryType = "measure";
    };
    __name(PerformanceMeasure, "PerformanceMeasure");
    PerformanceResourceTiming = class extends PerformanceEntry {
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name(PerformanceResourceTiming, "PerformanceResourceTiming");
    PerformanceObserverEntryList = class {
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
    Performance = class {
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName
          ? this._entries.filter((e) => e.name !== markName)
          : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName
          ? this._entries.filter((e) => e.name !== measureName)
          : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter(
          (e) => e.entryType !== "resource" || e.entryType !== "navigation"
        );
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end,
          },
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    __name(Performance, "Performance");
    PerformanceObserver = class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    __name(PerformanceObserver, "PerformanceObserver");
    __publicField(PerformanceObserver, "supportedEntryTypes", []);
    performance =
      globalThis.performance && "addEventListener" in globalThis.performance
        ? globalThis.performance
        : new Performance();
  },
});

// node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  },
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  },
});

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {}, { __unenv__: true });
  },
});

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console,
  _ignoreErrors,
  _stderr,
  _stdout,
  log,
  info,
  trace,
  debug,
  table,
  error,
  warn,
  createTask,
  clear,
  count,
  countReset,
  dir,
  dirxml,
  group,
  groupEnd,
  groupCollapsed,
  profile,
  profileEnd,
  time,
  timeEnd,
  timeLog,
  timeStamp,
  Console,
  _times,
  _stdoutErrorHandler,
  _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  },
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole,
  assert,
  clear2,
  context,
  count2,
  countReset2,
  createTask2,
  debug2,
  dir2,
  dirxml2,
  error2,
  group2,
  groupCollapsed2,
  groupEnd2,
  info2,
  log2,
  profile2,
  profileEnd2,
  table2,
  time2,
  timeEnd2,
  timeLog2,
  timeStamp2,
  trace2,
  warn2,
  console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context:
        // @ts-expect-error undocumented public API
        context,
      count: count2,
      countReset: countReset2,
      createTask:
        // @ts-expect-error undocumented public API
        createTask2,
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2,
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times,
    });
    console_default = workerdConsole;
  },
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  },
});

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(
      /* @__PURE__ */ __name(function hrtime2(startTime) {
        const now = Date.now();
        const seconds = Math.trunc(now / 1e3);
        const nanos = (now % 1e3) * 1e6;
        if (startTime) {
          let diffSeconds = seconds - startTime[0];
          let diffNanos = nanos - startTime[0];
          if (diffNanos < 0) {
            diffSeconds = diffSeconds - 1;
            diffNanos = 1e9 + diffNanos;
          }
          return [diffSeconds, diffNanos];
        }
        return [seconds, nanos];
      }, "hrtime"),
      {
        bigint: /* @__PURE__ */ __name(function bigint() {
          return BigInt(Date.now() * 1e6);
        }, "bigint"),
      }
    );
  },
});

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class extends Socket {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      isRaw = false;
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
      isTTY = false;
    };
    __name(ReadStream, "ReadStream");
  },
});

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class extends Socket2 {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      columns = 80;
      rows = 24;
      isTTY = false;
    };
    __name(WriteStream, "WriteStream");
  },
});

// node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  },
});

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process = class extends EventEmitter {
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [
          ...Object.getOwnPropertyNames(Process.prototype),
          ...Object.getOwnPropertyNames(EventEmitter.prototype),
        ]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return (this.#stdin ??= new ReadStream(0));
      }
      get stdout() {
        return (this.#stdout ??= new WriteStream(1));
      }
      get stderr() {
        return (this.#stderr ??= new WriteStream(2));
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {}
      unref() {}
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport"),
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented(
          "process.finalization.registerBeforeExit"
        ),
      };
      memoryUsage = Object.assign(
        () => ({
          arrayBuffers: 0,
          rss: 0,
          external: 0,
          heapTotal: 0,
          heapUsed: 0,
        }),
        { rss: () => 0 }
      );
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    __name(Process, "Process");
  },
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess,
  getBuiltinModule,
  exit,
  platform,
  nextTick,
  unenvProcess,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding,
  _process,
  process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule("node:process"));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick,
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding,
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding,
    };
    process_default = _process;
  },
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  },
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  },
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  },
});

// node_modules/pvtsutils/build/index.js
var require_build = __commonJS({
  "node_modules/pvtsutils/build/index.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ARRAY_BUFFER_NAME = "[object ArrayBuffer]";
    var BufferSourceConverter3 = class {
      static isArrayBuffer(data) {
        return Object.prototype.toString.call(data) === ARRAY_BUFFER_NAME;
      }
      static toArrayBuffer(data) {
        if (this.isArrayBuffer(data)) {
          return data;
        }
        if (data.byteLength === data.buffer.byteLength) {
          return data.buffer;
        }
        if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
          return data.buffer;
        }
        return this.toUint8Array(data.buffer).slice(
          data.byteOffset,
          data.byteOffset + data.byteLength
        ).buffer;
      }
      static toUint8Array(data) {
        return this.toView(data, Uint8Array);
      }
      static toView(data, type) {
        if (data.constructor === type) {
          return data;
        }
        if (this.isArrayBuffer(data)) {
          return new type(data);
        }
        if (this.isArrayBufferView(data)) {
          return new type(data.buffer, data.byteOffset, data.byteLength);
        }
        throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
      }
      static isBufferSource(data) {
        return this.isArrayBufferView(data) || this.isArrayBuffer(data);
      }
      static isArrayBufferView(data) {
        return ArrayBuffer.isView(data) || (data && this.isArrayBuffer(data.buffer));
      }
      static isEqual(a, b) {
        const aView = BufferSourceConverter3.toUint8Array(a);
        const bView = BufferSourceConverter3.toUint8Array(b);
        if (aView.length !== bView.byteLength) {
          return false;
        }
        for (let i = 0; i < aView.length; i++) {
          if (aView[i] !== bView[i]) {
            return false;
          }
        }
        return true;
      }
      static concat(...args) {
        let buffers;
        if (Array.isArray(args[0]) && !(args[1] instanceof Function)) {
          buffers = args[0];
        } else if (Array.isArray(args[0]) && args[1] instanceof Function) {
          buffers = args[0];
        } else {
          if (args[args.length - 1] instanceof Function) {
            buffers = args.slice(0, args.length - 1);
          } else {
            buffers = args;
          }
        }
        let size = 0;
        for (const buffer of buffers) {
          size += buffer.byteLength;
        }
        const res = new Uint8Array(size);
        let offset = 0;
        for (const buffer of buffers) {
          const view = this.toUint8Array(buffer);
          res.set(view, offset);
          offset += view.length;
        }
        if (args[args.length - 1] instanceof Function) {
          return this.toView(res, args[args.length - 1]);
        }
        return res.buffer;
      }
    };
    __name(BufferSourceConverter3, "BufferSourceConverter");
    var STRING_TYPE = "string";
    var HEX_REGEX = /^[0-9a-f\s]+$/i;
    var BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    var BASE64URL_REGEX = /^[a-zA-Z0-9-_]+$/;
    var Utf8Converter = class {
      static fromString(text) {
        const s = unescape(encodeURIComponent(text));
        const uintArray = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) {
          uintArray[i] = s.charCodeAt(i);
        }
        return uintArray.buffer;
      }
      static toString(buffer) {
        const buf = BufferSourceConverter3.toUint8Array(buffer);
        let encodedString = "";
        for (let i = 0; i < buf.length; i++) {
          encodedString += String.fromCharCode(buf[i]);
        }
        const decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
      }
    };
    __name(Utf8Converter, "Utf8Converter");
    var Utf16Converter = class {
      static toString(buffer, littleEndian = false) {
        const arrayBuffer = BufferSourceConverter3.toArrayBuffer(buffer);
        const dataView = new DataView(arrayBuffer);
        let res = "";
        for (let i = 0; i < arrayBuffer.byteLength; i += 2) {
          const code = dataView.getUint16(i, littleEndian);
          res += String.fromCharCode(code);
        }
        return res;
      }
      static fromString(text, littleEndian = false) {
        const res = new ArrayBuffer(text.length * 2);
        const dataView = new DataView(res);
        for (let i = 0; i < text.length; i++) {
          dataView.setUint16(i * 2, text.charCodeAt(i), littleEndian);
        }
        return res;
      }
    };
    __name(Utf16Converter, "Utf16Converter");
    var Convert3 = class {
      static isHex(data) {
        return typeof data === STRING_TYPE && HEX_REGEX.test(data);
      }
      static isBase64(data) {
        return typeof data === STRING_TYPE && BASE64_REGEX.test(data);
      }
      static isBase64Url(data) {
        return typeof data === STRING_TYPE && BASE64URL_REGEX.test(data);
      }
      static ToString(buffer, enc = "utf8") {
        const buf = BufferSourceConverter3.toUint8Array(buffer);
        switch (enc.toLowerCase()) {
          case "utf8":
            return this.ToUtf8String(buf);
          case "binary":
            return this.ToBinary(buf);
          case "hex":
            return this.ToHex(buf);
          case "base64":
            return this.ToBase64(buf);
          case "base64url":
            return this.ToBase64Url(buf);
          case "utf16le":
            return Utf16Converter.toString(buf, true);
          case "utf16":
          case "utf16be":
            return Utf16Converter.toString(buf);
          default:
            throw new Error(`Unknown type of encoding '${enc}'`);
        }
      }
      static FromString(str, enc = "utf8") {
        if (!str) {
          return new ArrayBuffer(0);
        }
        switch (enc.toLowerCase()) {
          case "utf8":
            return this.FromUtf8String(str);
          case "binary":
            return this.FromBinary(str);
          case "hex":
            return this.FromHex(str);
          case "base64":
            return this.FromBase64(str);
          case "base64url":
            return this.FromBase64Url(str);
          case "utf16le":
            return Utf16Converter.fromString(str, true);
          case "utf16":
          case "utf16be":
            return Utf16Converter.fromString(str);
          default:
            throw new Error(`Unknown type of encoding '${enc}'`);
        }
      }
      static ToBase64(buffer) {
        const buf = BufferSourceConverter3.toUint8Array(buffer);
        if (typeof btoa !== "undefined") {
          const binary = this.ToString(buf, "binary");
          return btoa(binary);
        } else {
          return Buffer.from(buf).toString("base64");
        }
      }
      static FromBase64(base643) {
        const formatted = this.formatString(base643);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!Convert3.isBase64(formatted)) {
          throw new TypeError("Argument 'base64Text' is not Base64 encoded");
        }
        if (typeof atob !== "undefined") {
          return this.FromBinary(atob(formatted));
        } else {
          return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
        }
      }
      static FromBase64Url(base64url) {
        const formatted = this.formatString(base64url);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!Convert3.isBase64Url(formatted)) {
          throw new TypeError("Argument 'base64url' is not Base64Url encoded");
        }
        return this.FromBase64(
          this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/"))
        );
      }
      static ToBase64Url(data) {
        return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
      }
      static FromUtf8String(text, encoding = Convert3.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
          case "ascii":
            return this.FromBinary(text);
          case "utf8":
            return Utf8Converter.fromString(text);
          case "utf16":
          case "utf16be":
            return Utf16Converter.fromString(text);
          case "utf16le":
          case "usc2":
            return Utf16Converter.fromString(text, true);
          default:
            throw new Error(`Unknown type of encoding '${encoding}'`);
        }
      }
      static ToUtf8String(buffer, encoding = Convert3.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
          case "ascii":
            return this.ToBinary(buffer);
          case "utf8":
            return Utf8Converter.toString(buffer);
          case "utf16":
          case "utf16be":
            return Utf16Converter.toString(buffer);
          case "utf16le":
          case "usc2":
            return Utf16Converter.toString(buffer, true);
          default:
            throw new Error(`Unknown type of encoding '${encoding}'`);
        }
      }
      static FromBinary(text) {
        const stringLength = text.length;
        const resultView = new Uint8Array(stringLength);
        for (let i = 0; i < stringLength; i++) {
          resultView[i] = text.charCodeAt(i);
        }
        return resultView.buffer;
      }
      static ToBinary(buffer) {
        const buf = BufferSourceConverter3.toUint8Array(buffer);
        let res = "";
        for (let i = 0; i < buf.length; i++) {
          res += String.fromCharCode(buf[i]);
        }
        return res;
      }
      static ToHex(buffer) {
        const buf = BufferSourceConverter3.toUint8Array(buffer);
        let result = "";
        const len = buf.length;
        for (let i = 0; i < len; i++) {
          const byte = buf[i];
          if (byte < 16) {
            result += "0";
          }
          result += byte.toString(16);
        }
        return result;
      }
      static FromHex(hexString) {
        let formatted = this.formatString(hexString);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!Convert3.isHex(formatted)) {
          throw new TypeError("Argument 'hexString' is not HEX encoded");
        }
        if (formatted.length % 2) {
          formatted = `0${formatted}`;
        }
        const res = new Uint8Array(formatted.length / 2);
        for (let i = 0; i < formatted.length; i = i + 2) {
          const c = formatted.slice(i, i + 2);
          res[i / 2] = parseInt(c, 16);
        }
        return res.buffer;
      }
      static ToUtf16String(buffer, littleEndian = false) {
        return Utf16Converter.toString(buffer, littleEndian);
      }
      static FromUtf16String(text, littleEndian = false) {
        return Utf16Converter.fromString(text, littleEndian);
      }
      static Base64Padding(base643) {
        const padCount = 4 - (base643.length % 4);
        if (padCount < 4) {
          for (let i = 0; i < padCount; i++) {
            base643 += "=";
          }
        }
        return base643;
      }
      static formatString(data) {
        return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
      }
    };
    __name(Convert3, "Convert");
    Convert3.DEFAULT_UTF8_ENCODING = "utf8";
    function assign(target, ...sources) {
      const res = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        const obj = arguments[i];
        for (const prop in obj) {
          res[prop] = obj[prop];
        }
      }
      return res;
    }
    __name(assign, "assign");
    function combine2(...buf) {
      const totalByteLength = buf.map((item) => item.byteLength).reduce((prev, cur) => prev + cur);
      const res = new Uint8Array(totalByteLength);
      let currentPos = 0;
      buf
        .map((item) => new Uint8Array(item))
        .forEach((arr) => {
          for (const item2 of arr) {
            res[currentPos++] = item2;
          }
        });
      return res.buffer;
    }
    __name(combine2, "combine");
    function isEqual2(bytes1, bytes2) {
      if (!(bytes1 && bytes2)) {
        return false;
      }
      if (bytes1.byteLength !== bytes2.byteLength) {
        return false;
      }
      const b1 = new Uint8Array(bytes1);
      const b2 = new Uint8Array(bytes2);
      for (let i = 0; i < bytes1.byteLength; i++) {
        if (b1[i] !== b2[i]) {
          return false;
        }
      }
      return true;
    }
    __name(isEqual2, "isEqual");
    exports.BufferSourceConverter = BufferSourceConverter3;
    exports.Convert = Convert3;
    exports.assign = assign;
    exports.combine = combine2;
    exports.isEqual = isEqual2;
  },
});

// node_modules/reflect-metadata/Reflect.js
var require_Reflect = __commonJS({
  "node_modules/reflect-metadata/Reflect.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Reflect2;
    (function (Reflect3) {
      (function (factory) {
        var root =
          typeof globalThis === "object"
            ? globalThis
            : typeof global === "object"
              ? global
              : typeof self === "object"
                ? self
                : typeof this === "object"
                  ? this
                  : sloppyModeThis();
        var exporter = makeExporter(Reflect3);
        if (typeof root.Reflect !== "undefined") {
          exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter, root);
        if (typeof root.Reflect === "undefined") {
          root.Reflect = Reflect3;
        }
        function makeExporter(target, previous) {
          return function (key, value) {
            Object.defineProperty(target, key, { configurable: true, writable: true, value });
            if (previous) previous(key, value);
          };
        }
        __name(makeExporter, "makeExporter");
        function functionThis() {
          try {
            return Function("return this;")();
          } catch (_) {}
        }
        __name(functionThis, "functionThis");
        function indirectEvalThis() {
          try {
            return (void 0, eval)("(function() { return this; })()");
          } catch (_) {}
        }
        __name(indirectEvalThis, "indirectEvalThis");
        function sloppyModeThis() {
          return functionThis() || indirectEvalThis();
        }
        __name(sloppyModeThis, "sloppyModeThis");
      })(function (exporter, root) {
        var hasOwn = Object.prototype.hasOwnProperty;
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol =
          supportsSymbol && typeof Symbol.toPrimitive !== "undefined"
            ? Symbol.toPrimitive
            : "@@toPrimitive";
        var iteratorSymbol =
          supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function";
        var supportsProto = { __proto__: [] } instanceof Array;
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
          // create an object in dictionary mode (a.k.a. "slow" mode in v8)
          create: supportsCreate
            ? function () {
                return MakeDictionary(/* @__PURE__ */ Object.create(null));
              }
            : supportsProto
              ? function () {
                  return MakeDictionary({ __proto__: null });
                }
              : function () {
                  return MakeDictionary({});
                },
          has: downLevel
            ? function (map, key) {
                return hasOwn.call(map, key);
              }
            : function (map, key) {
                return key in map;
              },
          get: downLevel
            ? function (map, key) {
                return hasOwn.call(map, key) ? map[key] : void 0;
              }
            : function (map, key) {
                return map[key];
              },
        };
        var functionPrototype = Object.getPrototypeOf(Function);
        var _Map =
          typeof Map === "function" && typeof Map.prototype.entries === "function"
            ? Map
            : CreateMapPolyfill();
        var _Set =
          typeof Set === "function" && typeof Set.prototype.entries === "function"
            ? Set
            : CreateSetPolyfill();
        var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : void 0;
        var metadataRegistry = GetOrCreateMetadataRegistry();
        var metadataProvider = CreateMetadataProvider(metadataRegistry);
        function decorate(decorators, target, propertyKey, attributes) {
          if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators)) throw new TypeError();
            if (!IsObject(target)) throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
              throw new TypeError();
            if (IsNull(attributes)) attributes = void 0;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
          } else {
            if (!IsArray(decorators)) throw new TypeError();
            if (!IsConstructor(target)) throw new TypeError();
            return DecorateConstructor(decorators, target);
          }
        }
        __name(decorate, "decorate");
        exporter("decorate", decorate);
        function metadata(metadataKey, metadataValue) {
          function decorator(target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
          }
          __name(decorator, "decorator");
          return decorator;
        }
        __name(metadata, "metadata");
        exporter("metadata", metadata);
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
          if (!IsObject(target)) throw new TypeError();
          if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        __name(defineMetadata, "defineMetadata");
        exporter("defineMetadata", defineMetadata);
        function hasMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target)) throw new TypeError();
          if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        __name(hasMetadata, "hasMetadata");
        exporter("hasMetadata", hasMetadata);
        function hasOwnMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target)) throw new TypeError();
          if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        __name(hasOwnMetadata, "hasOwnMetadata");
        exporter("hasOwnMetadata", hasOwnMetadata);
        function getMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target)) throw new TypeError();
          if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        __name(getMetadata, "getMetadata");
        exporter("getMetadata", getMetadata);
        function getOwnMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target)) throw new TypeError();
          if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        __name(getOwnMetadata, "getOwnMetadata");
        exporter("getOwnMetadata", getOwnMetadata);
        function getMetadataKeys(target, propertyKey) {
          if (!IsObject(target)) throw new TypeError();
          if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryMetadataKeys(target, propertyKey);
        }
        __name(getMetadataKeys, "getMetadataKeys");
        exporter("getMetadataKeys", getMetadataKeys);
        function getOwnMetadataKeys(target, propertyKey) {
          if (!IsObject(target)) throw new TypeError();
          if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        __name(getOwnMetadataKeys, "getOwnMetadataKeys");
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        function deleteMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target)) throw new TypeError();
          if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
          if (!IsObject(target)) throw new TypeError();
          if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
          var provider = GetMetadataProvider(
            target,
            propertyKey,
            /*Create*/
            false
          );
          if (IsUndefined(provider)) return false;
          return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
        }
        __name(deleteMetadata, "deleteMetadata");
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
          for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
              if (!IsConstructor(decorated)) throw new TypeError();
              target = decorated;
            }
          }
          return target;
        }
        __name(DecorateConstructor, "DecorateConstructor");
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
          for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
              if (!IsObject(decorated)) throw new TypeError();
              descriptor = decorated;
            }
          }
          return descriptor;
        }
        __name(DecorateProperty, "DecorateProperty");
        function OrdinaryHasMetadata(MetadataKey, O, P) {
          var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
          if (hasOwn2) return true;
          var parent = OrdinaryGetPrototypeOf(O);
          if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
          return false;
        }
        __name(OrdinaryHasMetadata, "OrdinaryHasMetadata");
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
          var provider = GetMetadataProvider(
            O,
            P,
            /*Create*/
            false
          );
          if (IsUndefined(provider)) return false;
          return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
        }
        __name(OrdinaryHasOwnMetadata, "OrdinaryHasOwnMetadata");
        function OrdinaryGetMetadata(MetadataKey, O, P) {
          var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
          if (hasOwn2) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
          var parent = OrdinaryGetPrototypeOf(O);
          if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
          return void 0;
        }
        __name(OrdinaryGetMetadata, "OrdinaryGetMetadata");
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
          var provider = GetMetadataProvider(
            O,
            P,
            /*Create*/
            false
          );
          if (IsUndefined(provider)) return;
          return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
        }
        __name(OrdinaryGetOwnMetadata, "OrdinaryGetOwnMetadata");
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
          var provider = GetMetadataProvider(
            O,
            P,
            /*Create*/
            true
          );
          provider.OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
        }
        __name(OrdinaryDefineOwnMetadata, "OrdinaryDefineOwnMetadata");
        function OrdinaryMetadataKeys(O, P) {
          var ownKeys = OrdinaryOwnMetadataKeys(O, P);
          var parent = OrdinaryGetPrototypeOf(O);
          if (parent === null) return ownKeys;
          var parentKeys = OrdinaryMetadataKeys(parent, P);
          if (parentKeys.length <= 0) return ownKeys;
          if (ownKeys.length <= 0) return parentKeys;
          var set = new _Set();
          var keys = [];
          for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
              set.add(key);
              keys.push(key);
            }
          }
          for (var _a3 = 0, parentKeys_1 = parentKeys; _a3 < parentKeys_1.length; _a3++) {
            var key = parentKeys_1[_a3];
            var hasKey = set.has(key);
            if (!hasKey) {
              set.add(key);
              keys.push(key);
            }
          }
          return keys;
        }
        __name(OrdinaryMetadataKeys, "OrdinaryMetadataKeys");
        function OrdinaryOwnMetadataKeys(O, P) {
          var provider = GetMetadataProvider(
            O,
            P,
            /*create*/
            false
          );
          if (!provider) {
            return [];
          }
          return provider.OrdinaryOwnMetadataKeys(O, P);
        }
        __name(OrdinaryOwnMetadataKeys, "OrdinaryOwnMetadataKeys");
        function Type(x) {
          if (x === null) return 1;
          switch (typeof x) {
            case "undefined":
              return 0;
            case "boolean":
              return 2;
            case "string":
              return 3;
            case "symbol":
              return 4;
            case "number":
              return 5;
            case "object":
              return x === null ? 1 : 6;
            default:
              return 6;
          }
        }
        __name(Type, "Type");
        function IsUndefined(x) {
          return x === void 0;
        }
        __name(IsUndefined, "IsUndefined");
        function IsNull(x) {
          return x === null;
        }
        __name(IsNull, "IsNull");
        function IsSymbol(x) {
          return typeof x === "symbol";
        }
        __name(IsSymbol, "IsSymbol");
        function IsObject(x) {
          return typeof x === "object" ? x !== null : typeof x === "function";
        }
        __name(IsObject, "IsObject");
        function ToPrimitive(input, PreferredType) {
          switch (Type(input)) {
            case 0:
              return input;
            case 1:
              return input;
            case 2:
              return input;
            case 3:
              return input;
            case 4:
              return input;
            case 5:
              return input;
          }
          var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
          var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
          if (exoticToPrim !== void 0) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result)) throw new TypeError();
            return result;
          }
          return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        __name(ToPrimitive, "ToPrimitive");
        function OrdinaryToPrimitive(O, hint) {
          if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
              var result = toString_1.call(O);
              if (!IsObject(result)) return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
              var result = valueOf.call(O);
              if (!IsObject(result)) return result;
            }
          } else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
              var result = valueOf.call(O);
              if (!IsObject(result)) return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
              var result = toString_2.call(O);
              if (!IsObject(result)) return result;
            }
          }
          throw new TypeError();
        }
        __name(OrdinaryToPrimitive, "OrdinaryToPrimitive");
        function ToBoolean(argument) {
          return !!argument;
        }
        __name(ToBoolean, "ToBoolean");
        function ToString(argument) {
          return "" + argument;
        }
        __name(ToString, "ToString");
        function ToPropertyKey(argument) {
          var key = ToPrimitive(
            argument,
            3
            /* String */
          );
          if (IsSymbol(key)) return key;
          return ToString(key);
        }
        __name(ToPropertyKey, "ToPropertyKey");
        function IsArray(argument) {
          return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
              ? argument instanceof Array
              : Object.prototype.toString.call(argument) === "[object Array]";
        }
        __name(IsArray, "IsArray");
        function IsCallable(argument) {
          return typeof argument === "function";
        }
        __name(IsCallable, "IsCallable");
        function IsConstructor(argument) {
          return typeof argument === "function";
        }
        __name(IsConstructor, "IsConstructor");
        function IsPropertyKey(argument) {
          switch (Type(argument)) {
            case 3:
              return true;
            case 4:
              return true;
            default:
              return false;
          }
        }
        __name(IsPropertyKey, "IsPropertyKey");
        function SameValueZero(x, y) {
          return x === y || (x !== x && y !== y);
        }
        __name(SameValueZero, "SameValueZero");
        function GetMethod(V, P) {
          var func = V[P];
          if (func === void 0 || func === null) return void 0;
          if (!IsCallable(func)) throw new TypeError();
          return func;
        }
        __name(GetMethod, "GetMethod");
        function GetIterator(obj) {
          var method = GetMethod(obj, iteratorSymbol);
          if (!IsCallable(method)) throw new TypeError();
          var iterator = method.call(obj);
          if (!IsObject(iterator)) throw new TypeError();
          return iterator;
        }
        __name(GetIterator, "GetIterator");
        function IteratorValue(iterResult) {
          return iterResult.value;
        }
        __name(IteratorValue, "IteratorValue");
        function IteratorStep(iterator) {
          var result = iterator.next();
          return result.done ? false : result;
        }
        __name(IteratorStep, "IteratorStep");
        function IteratorClose(iterator) {
          var f = iterator["return"];
          if (f) f.call(iterator);
        }
        __name(IteratorClose, "IteratorClose");
        function OrdinaryGetPrototypeOf(O) {
          var proto = Object.getPrototypeOf(O);
          if (typeof O !== "function" || O === functionPrototype) return proto;
          if (proto !== functionPrototype) return proto;
          var prototype = O.prototype;
          var prototypeProto = prototype && Object.getPrototypeOf(prototype);
          if (prototypeProto == null || prototypeProto === Object.prototype) return proto;
          var constructor = prototypeProto.constructor;
          if (typeof constructor !== "function") return proto;
          if (constructor === O) return proto;
          return constructor;
        }
        __name(OrdinaryGetPrototypeOf, "OrdinaryGetPrototypeOf");
        function CreateMetadataRegistry() {
          var fallback;
          if (
            !IsUndefined(registrySymbol) &&
            typeof root.Reflect !== "undefined" &&
            !(registrySymbol in root.Reflect) &&
            typeof root.Reflect.defineMetadata === "function"
          ) {
            fallback = CreateFallbackProvider(root.Reflect);
          }
          var first;
          var second;
          var rest;
          var targetProviderMap = new _WeakMap();
          var registry = {
            registerProvider,
            getProvider,
            setProvider,
          };
          return registry;
          function registerProvider(provider) {
            if (!Object.isExtensible(registry)) {
              throw new Error("Cannot add provider to a frozen registry.");
            }
            switch (true) {
              case fallback === provider:
                break;
              case IsUndefined(first):
                first = provider;
                break;
              case first === provider:
                break;
              case IsUndefined(second):
                second = provider;
                break;
              case second === provider:
                break;
              default:
                if (rest === void 0) rest = new _Set();
                rest.add(provider);
                break;
            }
          }
          __name(registerProvider, "registerProvider");
          function getProviderNoCache(O, P) {
            if (!IsUndefined(first)) {
              if (first.isProviderFor(O, P)) return first;
              if (!IsUndefined(second)) {
                if (second.isProviderFor(O, P)) return first;
                if (!IsUndefined(rest)) {
                  var iterator = GetIterator(rest);
                  while (true) {
                    var next = IteratorStep(iterator);
                    if (!next) {
                      return void 0;
                    }
                    var provider = IteratorValue(next);
                    if (provider.isProviderFor(O, P)) {
                      IteratorClose(iterator);
                      return provider;
                    }
                  }
                }
              }
            }
            if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) {
              return fallback;
            }
            return void 0;
          }
          __name(getProviderNoCache, "getProviderNoCache");
          function getProvider(O, P) {
            var providerMap = targetProviderMap.get(O);
            var provider;
            if (!IsUndefined(providerMap)) {
              provider = providerMap.get(P);
            }
            if (!IsUndefined(provider)) {
              return provider;
            }
            provider = getProviderNoCache(O, P);
            if (!IsUndefined(provider)) {
              if (IsUndefined(providerMap)) {
                providerMap = new _Map();
                targetProviderMap.set(O, providerMap);
              }
              providerMap.set(P, provider);
            }
            return provider;
          }
          __name(getProvider, "getProvider");
          function hasProvider(provider) {
            if (IsUndefined(provider)) throw new TypeError();
            return (
              first === provider ||
              second === provider ||
              (!IsUndefined(rest) && rest.has(provider))
            );
          }
          __name(hasProvider, "hasProvider");
          function setProvider(O, P, provider) {
            if (!hasProvider(provider)) {
              throw new Error("Metadata provider not registered.");
            }
            var existingProvider = getProvider(O, P);
            if (existingProvider !== provider) {
              if (!IsUndefined(existingProvider)) {
                return false;
              }
              var providerMap = targetProviderMap.get(O);
              if (IsUndefined(providerMap)) {
                providerMap = new _Map();
                targetProviderMap.set(O, providerMap);
              }
              providerMap.set(P, provider);
            }
            return true;
          }
          __name(setProvider, "setProvider");
        }
        __name(CreateMetadataRegistry, "CreateMetadataRegistry");
        function GetOrCreateMetadataRegistry() {
          var metadataRegistry2;
          if (
            !IsUndefined(registrySymbol) &&
            IsObject(root.Reflect) &&
            Object.isExtensible(root.Reflect)
          ) {
            metadataRegistry2 = root.Reflect[registrySymbol];
          }
          if (IsUndefined(metadataRegistry2)) {
            metadataRegistry2 = CreateMetadataRegistry();
          }
          if (
            !IsUndefined(registrySymbol) &&
            IsObject(root.Reflect) &&
            Object.isExtensible(root.Reflect)
          ) {
            Object.defineProperty(root.Reflect, registrySymbol, {
              enumerable: false,
              configurable: false,
              writable: false,
              value: metadataRegistry2,
            });
          }
          return metadataRegistry2;
        }
        __name(GetOrCreateMetadataRegistry, "GetOrCreateMetadataRegistry");
        function CreateMetadataProvider(registry) {
          var metadata2 = new _WeakMap();
          var provider = {
            isProviderFor: function (O, P) {
              var targetMetadata = metadata2.get(O);
              if (IsUndefined(targetMetadata)) return false;
              return targetMetadata.has(P);
            },
            OrdinaryDefineOwnMetadata: OrdinaryDefineOwnMetadata2,
            OrdinaryHasOwnMetadata: OrdinaryHasOwnMetadata2,
            OrdinaryGetOwnMetadata: OrdinaryGetOwnMetadata2,
            OrdinaryOwnMetadataKeys: OrdinaryOwnMetadataKeys2,
            OrdinaryDeleteMetadata,
          };
          metadataRegistry.registerProvider(provider);
          return provider;
          function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = metadata2.get(O);
            var createdTargetMetadata = false;
            if (IsUndefined(targetMetadata)) {
              if (!Create) return void 0;
              targetMetadata = new _Map();
              metadata2.set(O, targetMetadata);
              createdTargetMetadata = true;
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
              if (!Create) return void 0;
              metadataMap = new _Map();
              targetMetadata.set(P, metadataMap);
              if (!registry.setProvider(O, P, provider)) {
                targetMetadata.delete(P);
                if (createdTargetMetadata) {
                  metadata2.delete(O);
                }
                throw new Error("Wrong provider for target.");
              }
            }
            return metadataMap;
          }
          __name(GetOrCreateMetadataMap, "GetOrCreateMetadataMap");
          function OrdinaryHasOwnMetadata2(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(metadataMap)) return false;
            return ToBoolean(metadataMap.has(MetadataKey));
          }
          __name(OrdinaryHasOwnMetadata2, "OrdinaryHasOwnMetadata");
          function OrdinaryGetOwnMetadata2(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(metadataMap)) return void 0;
            return metadataMap.get(MetadataKey);
          }
          __name(OrdinaryGetOwnMetadata2, "OrdinaryGetOwnMetadata");
          function OrdinaryDefineOwnMetadata2(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              true
            );
            metadataMap.set(MetadataKey, MetadataValue);
          }
          __name(OrdinaryDefineOwnMetadata2, "OrdinaryDefineOwnMetadata");
          function OrdinaryOwnMetadataKeys2(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(metadataMap)) return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
              var next = IteratorStep(iterator);
              if (!next) {
                keys.length = k;
                return keys;
              }
              var nextValue = IteratorValue(next);
              try {
                keys[k] = nextValue;
              } catch (e) {
                try {
                  IteratorClose(iterator);
                } finally {
                  throw e;
                }
              }
              k++;
            }
          }
          __name(OrdinaryOwnMetadataKeys2, "OrdinaryOwnMetadataKeys");
          function OrdinaryDeleteMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(metadataMap)) return false;
            if (!metadataMap.delete(MetadataKey)) return false;
            if (metadataMap.size === 0) {
              var targetMetadata = metadata2.get(O);
              if (!IsUndefined(targetMetadata)) {
                targetMetadata.delete(P);
                if (targetMetadata.size === 0) {
                  metadata2.delete(targetMetadata);
                }
              }
            }
            return true;
          }
          __name(OrdinaryDeleteMetadata, "OrdinaryDeleteMetadata");
        }
        __name(CreateMetadataProvider, "CreateMetadataProvider");
        function CreateFallbackProvider(reflect) {
          var defineMetadata2 = reflect.defineMetadata,
            hasOwnMetadata2 = reflect.hasOwnMetadata,
            getOwnMetadata2 = reflect.getOwnMetadata,
            getOwnMetadataKeys2 = reflect.getOwnMetadataKeys,
            deleteMetadata2 = reflect.deleteMetadata;
          var metadataOwner = new _WeakMap();
          var provider = {
            isProviderFor: function (O, P) {
              var metadataPropertySet = metadataOwner.get(O);
              if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) {
                return true;
              }
              if (getOwnMetadataKeys2(O, P).length) {
                if (IsUndefined(metadataPropertySet)) {
                  metadataPropertySet = new _Set();
                  metadataOwner.set(O, metadataPropertySet);
                }
                metadataPropertySet.add(P);
                return true;
              }
              return false;
            },
            OrdinaryDefineOwnMetadata: defineMetadata2,
            OrdinaryHasOwnMetadata: hasOwnMetadata2,
            OrdinaryGetOwnMetadata: getOwnMetadata2,
            OrdinaryOwnMetadataKeys: getOwnMetadataKeys2,
            OrdinaryDeleteMetadata: deleteMetadata2,
          };
          return provider;
        }
        __name(CreateFallbackProvider, "CreateFallbackProvider");
        function GetMetadataProvider(O, P, Create) {
          var registeredProvider = metadataRegistry.getProvider(O, P);
          if (!IsUndefined(registeredProvider)) {
            return registeredProvider;
          }
          if (Create) {
            if (metadataRegistry.setProvider(O, P, metadataProvider)) {
              return metadataProvider;
            }
            throw new Error("Illegal state.");
          }
          return void 0;
        }
        __name(GetMetadataProvider, "GetMetadataProvider");
        function CreateMapPolyfill() {
          var cacheSentinel = {};
          var arraySentinel = [];
          var MapIterator =
            /** @class */
            (function () {
              function MapIterator2(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
              }
              __name(MapIterator2, "MapIterator");
              MapIterator2.prototype["@@iterator"] = function () {
                return this;
              };
              MapIterator2.prototype[iteratorSymbol] = function () {
                return this;
              };
              MapIterator2.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                  var result = this._selector(this._keys[index], this._values[index]);
                  if (index + 1 >= this._keys.length) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                  } else {
                    this._index++;
                  }
                  return { value: result, done: false };
                }
                return { value: void 0, done: true };
              };
              MapIterator2.prototype.throw = function (error3) {
                if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
                }
                throw error3;
              };
              MapIterator2.prototype.return = function (value) {
                if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
                }
                return { value, done: true };
              };
              return MapIterator2;
            })();
          var Map2 =
            /** @class */
            (function () {
              function Map3() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              }
              __name(Map3, "Map");
              Object.defineProperty(Map3.prototype, "size", {
                get: function () {
                  return this._keys.length;
                },
                enumerable: true,
                configurable: true,
              });
              Map3.prototype.has = function (key) {
                return (
                  this._find(
                    key,
                    /*insert*/
                    false
                  ) >= 0
                );
              };
              Map3.prototype.get = function (key) {
                var index = this._find(
                  key,
                  /*insert*/
                  false
                );
                return index >= 0 ? this._values[index] : void 0;
              };
              Map3.prototype.set = function (key, value) {
                var index = this._find(
                  key,
                  /*insert*/
                  true
                );
                this._values[index] = value;
                return this;
              };
              Map3.prototype.delete = function (key) {
                var index = this._find(
                  key,
                  /*insert*/
                  false
                );
                if (index >= 0) {
                  var size = this._keys.length;
                  for (var i = index + 1; i < size; i++) {
                    this._keys[i - 1] = this._keys[i];
                    this._values[i - 1] = this._values[i];
                  }
                  this._keys.length--;
                  this._values.length--;
                  if (SameValueZero(key, this._cacheKey)) {
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                  }
                  return true;
                }
                return false;
              };
              Map3.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              };
              Map3.prototype.keys = function () {
                return new MapIterator(this._keys, this._values, getKey);
              };
              Map3.prototype.values = function () {
                return new MapIterator(this._keys, this._values, getValue);
              };
              Map3.prototype.entries = function () {
                return new MapIterator(this._keys, this._values, getEntry);
              };
              Map3.prototype["@@iterator"] = function () {
                return this.entries();
              };
              Map3.prototype[iteratorSymbol] = function () {
                return this.entries();
              };
              Map3.prototype._find = function (key, insert) {
                if (!SameValueZero(this._cacheKey, key)) {
                  this._cacheIndex = -1;
                  for (var i = 0; i < this._keys.length; i++) {
                    if (SameValueZero(this._keys[i], key)) {
                      this._cacheIndex = i;
                      break;
                    }
                  }
                }
                if (this._cacheIndex < 0 && insert) {
                  this._cacheIndex = this._keys.length;
                  this._keys.push(key);
                  this._values.push(void 0);
                }
                return this._cacheIndex;
              };
              return Map3;
            })();
          return Map2;
          function getKey(key, _) {
            return key;
          }
          __name(getKey, "getKey");
          function getValue(_, value) {
            return value;
          }
          __name(getValue, "getValue");
          function getEntry(key, value) {
            return [key, value];
          }
          __name(getEntry, "getEntry");
        }
        __name(CreateMapPolyfill, "CreateMapPolyfill");
        function CreateSetPolyfill() {
          var Set3 =
            /** @class */
            (function () {
              function Set4() {
                this._map = new _Map();
              }
              __name(Set4, "Set");
              Object.defineProperty(Set4.prototype, "size", {
                get: function () {
                  return this._map.size;
                },
                enumerable: true,
                configurable: true,
              });
              Set4.prototype.has = function (value) {
                return this._map.has(value);
              };
              Set4.prototype.add = function (value) {
                return (this._map.set(value, value), this);
              };
              Set4.prototype.delete = function (value) {
                return this._map.delete(value);
              };
              Set4.prototype.clear = function () {
                this._map.clear();
              };
              Set4.prototype.keys = function () {
                return this._map.keys();
              };
              Set4.prototype.values = function () {
                return this._map.keys();
              };
              Set4.prototype.entries = function () {
                return this._map.entries();
              };
              Set4.prototype["@@iterator"] = function () {
                return this.keys();
              };
              Set4.prototype[iteratorSymbol] = function () {
                return this.keys();
              };
              return Set4;
            })();
          return Set3;
        }
        __name(CreateSetPolyfill, "CreateSetPolyfill");
        function CreateWeakMapPolyfill() {
          var UUID_SIZE = 16;
          var keys = HashMap.create();
          var rootKey = CreateUniqueKey();
          return (
            /** @class */
            (function () {
              function WeakMap2() {
                this._key = CreateUniqueKey();
              }
              __name(WeakMap2, "WeakMap");
              WeakMap2.prototype.has = function (target) {
                var table3 = GetOrCreateWeakMapTable(
                  target,
                  /*create*/
                  false
                );
                return table3 !== void 0 ? HashMap.has(table3, this._key) : false;
              };
              WeakMap2.prototype.get = function (target) {
                var table3 = GetOrCreateWeakMapTable(
                  target,
                  /*create*/
                  false
                );
                return table3 !== void 0 ? HashMap.get(table3, this._key) : void 0;
              };
              WeakMap2.prototype.set = function (target, value) {
                var table3 = GetOrCreateWeakMapTable(
                  target,
                  /*create*/
                  true
                );
                table3[this._key] = value;
                return this;
              };
              WeakMap2.prototype.delete = function (target) {
                var table3 = GetOrCreateWeakMapTable(
                  target,
                  /*create*/
                  false
                );
                return table3 !== void 0 ? delete table3[this._key] : false;
              };
              WeakMap2.prototype.clear = function () {
                this._key = CreateUniqueKey();
              };
              return WeakMap2;
            })()
          );
          function CreateUniqueKey() {
            var key;
            do key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
          }
          __name(CreateUniqueKey, "CreateUniqueKey");
          function GetOrCreateWeakMapTable(target, create3) {
            if (!hasOwn.call(target, rootKey)) {
              if (!create3) return void 0;
              Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
          }
          __name(GetOrCreateWeakMapTable, "GetOrCreateWeakMapTable");
          function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i) buffer[i] = (Math.random() * 255) | 0;
            return buffer;
          }
          __name(FillRandomBytes, "FillRandomBytes");
          function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
              var array = new Uint8Array(size);
              if (typeof crypto !== "undefined") {
                crypto.getRandomValues(array);
              } else if (typeof msCrypto !== "undefined") {
                msCrypto.getRandomValues(array);
              } else {
                FillRandomBytes(array, size);
              }
              return array;
            }
            return FillRandomBytes(new Array(size), size);
          }
          __name(GenRandomBytes, "GenRandomBytes");
          function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            data[6] = (data[6] & 79) | 64;
            data[8] = (data[8] & 191) | 128;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
              var byte = data[offset];
              if (offset === 4 || offset === 6 || offset === 8) result += "-";
              if (byte < 16) result += "0";
              result += byte.toString(16).toLowerCase();
            }
            return result;
          }
          __name(CreateUUID, "CreateUUID");
        }
        __name(CreateWeakMapPolyfill, "CreateWeakMapPolyfill");
        function MakeDictionary(obj) {
          obj.__ = void 0;
          delete obj.__;
          return obj;
        }
        __name(MakeDictionary, "MakeDictionary");
      });
    })(Reflect2 || (Reflect2 = {}));
  },
});

// node_modules/tsyringe/node_modules/tslib/tslib.js
var require_tslib = __commonJS({
  "node_modules/tsyringe/node_modules/tslib/tslib.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __extends2;
    var __assign2;
    var __rest2;
    var __decorate3;
    var __param2;
    var __metadata2;
    var __awaiter2;
    var __generator2;
    var __exportStar2;
    var __values2;
    var __read2;
    var __spread2;
    var __spreadArrays2;
    var __await2;
    var __asyncGenerator2;
    var __asyncDelegator2;
    var __asyncValues2;
    var __makeTemplateObject2;
    var __importStar2;
    var __importDefault2;
    var __classPrivateFieldGet3;
    var __classPrivateFieldSet3;
    var __createBinding2;
    (function (factory) {
      var root =
        typeof global === "object"
          ? global
          : typeof self === "object"
            ? self
            : typeof this === "object"
              ? this
              : {};
      if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports2) {
          factory(createExporter(root, createExporter(exports2)));
        });
      } else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
      } else {
        factory(createExporter(root));
      }
      function createExporter(exports2, previous) {
        if (exports2 !== root) {
          if (typeof Object.create === "function") {
            Object.defineProperty(exports2, "__esModule", { value: true });
          } else {
            exports2.__esModule = true;
          }
        }
        return function (id, v) {
          return (exports2[id] = previous ? previous(id, v) : v);
        };
      }
      __name(createExporter, "createExporter");
    })(function (exporter) {
      var extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      __extends2 = /* @__PURE__ */ __name(function (d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        __name(__, "__");
        d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
      }, "__extends");
      __assign2 =
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      __rest2 = /* @__PURE__ */ __name(function (s, e) {
        var t = {};
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
          }
        return t;
      }, "__rest");
      __decorate3 = /* @__PURE__ */ __name(function (decorators, target, key, desc) {
        var c = arguments.length,
          r =
            c < 3
              ? target
              : desc === null
                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                : desc,
          d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          r = Reflect.decorate(decorators, target, key, desc);
        else
          for (var i = decorators.length - 1; i >= 0; i--)
            if ((d = decorators[i]))
              r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return (c > 3 && r && Object.defineProperty(target, key, r), r);
      }, "__decorate");
      __param2 = /* @__PURE__ */ __name(function (paramIndex, decorator) {
        return function (target, key) {
          decorator(target, key, paramIndex);
        };
      }, "__param");
      __metadata2 = /* @__PURE__ */ __name(function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(metadataKey, metadataValue);
      }, "__metadata");
      __awaiter2 = /* @__PURE__ */ __name(function (thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P
            ? value
            : new P(function (resolve) {
                resolve(value);
              });
        }
        __name(adopt, "adopt");
        return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          __name(fulfilled, "fulfilled");
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          __name(rejected, "rejected");
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          __name(step, "step");
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      }, "__awaiter");
      __generator2 = /* @__PURE__ */ __name(function (thisArg, body) {
        var _ = {
            label: 0,
            sent: function () {
              if (t[0] & 1) throw t[1];
              return t[1];
            },
            trys: [],
            ops: [],
          },
          f,
          y,
          t,
          g;
        return (
          (g = { next: verb(0), throw: verb(1), return: verb(2) }),
          typeof Symbol === "function" &&
            (g[Symbol.iterator] = function () {
              return this;
            }),
          g
        );
        function verb(n) {
          return function (v) {
            return step([n, v]);
          };
        }
        __name(verb, "verb");
        function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (
                ((f = 1),
                y &&
                  (t =
                    op[0] & 2
                      ? y["return"]
                      : op[0]
                        ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                        : y.next) &&
                  !(t = t.call(y, op[1])).done)
              )
                return t;
              if (((y = 0), t)) op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (
                    !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                    (op[0] === 6 || op[0] === 2)
                  ) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2]) _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5) throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
        __name(step, "step");
      }, "__generator");
      __createBinding2 = /* @__PURE__ */ __name(function (o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      }, "__createBinding");
      __exportStar2 = /* @__PURE__ */ __name(function (m, exports2) {
        for (var p in m) if (p !== "default" && !exports2.hasOwnProperty(p)) exports2[p] = m[p];
      }, "__exportStar");
      __values2 = /* @__PURE__ */ __name(function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator,
          m = s && o[s],
          i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number")
          return {
            next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
            },
          };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }, "__values");
      __read2 = /* @__PURE__ */ __name(function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o),
          r,
          ar = [],
          e;
        try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        } catch (error3) {
          e = { error: error3 };
        } finally {
          try {
            if (r && !r.done && (m = i["return"])) m.call(i);
          } finally {
            if (e) throw e.error;
          }
        }
        return ar;
      }, "__read");
      __spread2 = /* @__PURE__ */ __name(function () {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read2(arguments[i]));
        return ar;
      }, "__spread");
      __spreadArrays2 = /* @__PURE__ */ __name(function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
        return r;
      }, "__spreadArrays");
      __await2 = /* @__PURE__ */ __name(function (v) {
        return this instanceof __await2 ? ((this.v = v), this) : new __await2(v);
      }, "__await");
      __asyncGenerator2 = /* @__PURE__ */ __name(function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []),
          i,
          q = [];
        return (
          (i = {}),
          verb("next"),
          verb("throw"),
          verb("return"),
          (i[Symbol.asyncIterator] = function () {
            return this;
          }),
          i
        );
        function verb(n) {
          if (g[n])
            i[n] = function (v) {
              return new Promise(function (a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
              });
            };
        }
        __name(verb, "verb");
        function resume(n, v) {
          try {
            step(g[n](v));
          } catch (e) {
            settle(q[0][3], e);
          }
        }
        __name(resume, "resume");
        function step(r) {
          r.value instanceof __await2
            ? Promise.resolve(r.value.v).then(fulfill, reject)
            : settle(q[0][2], r);
        }
        __name(step, "step");
        function fulfill(value) {
          resume("next", value);
        }
        __name(fulfill, "fulfill");
        function reject(value) {
          resume("throw", value);
        }
        __name(reject, "reject");
        function settle(f, v) {
          if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
        }
        __name(settle, "settle");
      }, "__asyncGenerator");
      __asyncDelegator2 = /* @__PURE__ */ __name(function (o) {
        var i, p;
        return (
          (i = {}),
          verb("next"),
          verb("throw", function (e) {
            throw e;
          }),
          verb("return"),
          (i[Symbol.iterator] = function () {
            return this;
          }),
          i
        );
        function verb(n, f) {
          i[n] = o[n]
            ? function (v) {
                return (p = !p) ? { value: __await2(o[n](v)), done: n === "return" } : f ? f(v) : v;
              }
            : f;
        }
        __name(verb, "verb");
      }, "__asyncDelegator");
      __asyncValues2 = /* @__PURE__ */ __name(function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator],
          i;
        return m
          ? m.call(o)
          : ((o = typeof __values2 === "function" ? __values2(o) : o[Symbol.iterator]()),
            (i = {}),
            verb("next"),
            verb("throw"),
            verb("return"),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i);
        function verb(n) {
          i[n] =
            o[n] &&
            function (v) {
              return new Promise(function (resolve, reject) {
                ((v = o[n](v)), settle(resolve, reject, v.done, v.value));
              });
            };
        }
        __name(verb, "verb");
        function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function (v2) {
            resolve({ value: v2, done: d });
          }, reject);
        }
        __name(settle, "settle");
      }, "__asyncValues");
      __makeTemplateObject2 = /* @__PURE__ */ __name(function (cooked, raw) {
        if (Object.defineProperty) {
          Object.defineProperty(cooked, "raw", { value: raw });
        } else {
          cooked.raw = raw;
        }
        return cooked;
      }, "__makeTemplateObject");
      __importStar2 = /* @__PURE__ */ __name(function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        }
        result["default"] = mod;
        return result;
      }, "__importStar");
      __importDefault2 = /* @__PURE__ */ __name(function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      }, "__importDefault");
      __classPrivateFieldGet3 = /* @__PURE__ */ __name(function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
          throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
      }, "__classPrivateFieldGet");
      __classPrivateFieldSet3 = /* @__PURE__ */ __name(function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
          throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
      }, "__classPrivateFieldSet");
      exporter("__extends", __extends2);
      exporter("__assign", __assign2);
      exporter("__rest", __rest2);
      exporter("__decorate", __decorate3);
      exporter("__param", __param2);
      exporter("__metadata", __metadata2);
      exporter("__awaiter", __awaiter2);
      exporter("__generator", __generator2);
      exporter("__exportStar", __exportStar2);
      exporter("__createBinding", __createBinding2);
      exporter("__values", __values2);
      exporter("__read", __read2);
      exporter("__spread", __spread2);
      exporter("__spreadArrays", __spreadArrays2);
      exporter("__await", __await2);
      exporter("__asyncGenerator", __asyncGenerator2);
      exporter("__asyncDelegator", __asyncDelegator2);
      exporter("__asyncValues", __asyncValues2);
      exporter("__makeTemplateObject", __makeTemplateObject2);
      exporter("__importStar", __importStar2);
      exporter("__importDefault", __importDefault2);
      exporter("__classPrivateFieldGet", __classPrivateFieldGet3);
      exporter("__classPrivateFieldSet", __classPrivateFieldSet3);
    });
  },
});

// .wrangler/tmp/bundle-jHi9tU/middleware-loader.entry.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-jHi9tU/middleware-insertion-facade.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/index.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/middleware/cors.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function corsHeaders(origin, allowedOrigin) {
  const isAllowed =
    origin === allowedOrigin ||
    (origin !== null &&
      (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")));
  const effectiveOrigin = isAllowed && origin !== null ? origin : allowedOrigin;
  return {
    "Access-Control-Allow-Origin": effectiveOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
__name(corsHeaders, "corsHeaders");
function handleOptions(request, allowedOrigin) {
  const origin = request.headers.get("Origin");
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, allowedOrigin),
  });
}
__name(handleOptions, "handleOptions");
function jsonResponse(body, status, origin, allowedOrigin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin, allowedOrigin),
    },
  });
}
__name(jsonResponse, "jsonResponse");
function emptyResponse(status, origin, allowedOrigin) {
  return new Response(null, {
    status,
    headers: corsHeaders(origin, allowedOrigin),
  });
}
__name(emptyResponse, "emptyResponse");

// src/routes/auth.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/lib/jwt.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function base64UrlEncode(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let str = "";
  for (const b of bytes) {
    str += String.fromCharCode(b);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(base64UrlEncode, "base64UrlEncode");
function base64UrlDecode(s) {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const b64 = pad === 0 ? padded : padded + "====".slice(pad);
  const raw = atob(b64);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    buf[i] = raw.charCodeAt(i);
  }
  return buf;
}
__name(base64UrlDecode, "base64UrlDecode");
async function importHmacKey(secret) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}
__name(importHmacKey, "importHmacKey");
async function signJwt(payload, secret, expiresInSeconds) {
  const now = Math.floor(Date.now() / 1e3);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };
  const header = { alg: "HS256", typ: "JWT" };
  const enc = new TextEncoder();
  const headerB64 = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(enc.encode(JSON.stringify(claims)));
  const signingInput = `${headerB64}.${payloadB64}`;
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(signingInput));
  return `${signingInput}.${base64UrlEncode(signature)}`;
}
__name(signJwt, "signJwt");
async function verifyJwt(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  const [headerB64, payloadB64, sigB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;
  const enc = new TextEncoder();
  const key = await importHmacKey(secret);
  const expectedSig = base64UrlDecode(sigB64);
  let valid;
  try {
    valid = await crypto.subtle.verify("HMAC", key, expectedSig, enc.encode(signingInput));
  } catch {
    return null;
  }
  if (!valid) {
    return null;
  }
  let claims;
  try {
    const decoded = new TextDecoder().decode(base64UrlDecode(payloadB64));
    claims = JSON.parse(decoded);
  } catch {
    return null;
  }
  const now = Math.floor(Date.now() / 1e3);
  if (typeof claims["exp"] === "number" && claims["exp"] < now) {
    return null;
  }
  return claims;
}
__name(verifyJwt, "verifyJwt");

// src/middleware/auth.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function forbidden(message) {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}
__name(forbidden, "forbidden");
async function requireAuth(request, env2) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const token = authHeader.slice(7).trim();
  const payload = await verifyJwt(token, env2.JWT_SECRET);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const sub = payload["sub"];
  if (typeof sub !== "string") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const user = await env2.DB.prepare(
    `SELECT u.plan, u.role,
       EXISTS(SELECT 1 FROM family_seats WHERE member_user_id = u.id) AS has_seat
     FROM users u WHERE u.id = ?`
  )
    .bind(sub)
    .first();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const plan = user.plan ?? "free";
  const effectivePlan = plan === "pro" || plan === "family" || user.has_seat === 1 ? "pro" : "free";
  return {
    userId: sub,
    plan,
    effectivePlan,
    role: user.role ?? "user",
  };
}
__name(requireAuth, "requireAuth");
function requirePro(auth) {
  if (auth.effectivePlan !== "pro") {
    return forbidden("pro_required");
  }
  return null;
}
__name(requirePro, "requirePro");
function requireFamilyOwner(auth) {
  if (auth.plan !== "family") {
    return forbidden("family_plan_required");
  }
  return null;
}
__name(requireFamilyOwner, "requireFamilyOwner");
function requireAdmin(auth) {
  if (auth.role !== "admin") {
    return forbidden("admin_required");
  }
  return null;
}
__name(requireAdmin, "requireAdmin");

// src/routes/webauthn.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/registration/generateRegistrationOptions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/generateChallenge.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/iso/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoBase64URL.js
var isoBase64URL_exports = {};
__export(isoBase64URL_exports, {
  fromBuffer: () => fromBuffer,
  fromUTF8String: () => fromUTF8String,
  isBase64: () => isBase64,
  isBase64URL: () => isBase64URL,
  toBase64: () => toBase64,
  toBuffer: () => toBuffer,
  toUTF8String: () => toUTF8String,
  trimPadding: () => trimPadding,
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@hexagon/base64/src/base64.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var charsUrl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var genLookup = /* @__PURE__ */ __name((target) => {
  const lookupTemp = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
  const len = chars.length;
  for (let i = 0; i < len; i++) {
    lookupTemp[target.charCodeAt(i)] = i;
  }
  return lookupTemp;
}, "genLookup");
var lookup = genLookup(chars);
var lookupUrl = genLookup(charsUrl);
var base64UrlPattern = /^[-A-Za-z0-9\-_]*$/;
var base64Pattern = /^[-A-Za-z0-9+/]*={0,3}$/;
var base64 = {};
base64.toArrayBuffer = (data, urlMode) => {
  const len = data.length;
  let bufferLength = data.length * 0.75,
    i,
    p = 0,
    encoded1,
    encoded2,
    encoded3,
    encoded4;
  if (data[data.length - 1] === "=") {
    bufferLength--;
    if (data[data.length - 2] === "=") {
      bufferLength--;
    }
  }
  const arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer),
    target = urlMode ? lookupUrl : lookup;
  for (i = 0; i < len; i += 4) {
    encoded1 = target[data.charCodeAt(i)];
    encoded2 = target[data.charCodeAt(i + 1)];
    encoded3 = target[data.charCodeAt(i + 2)];
    encoded4 = target[data.charCodeAt(i + 3)];
    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }
  return arraybuffer;
};
base64.fromArrayBuffer = (arrBuf, urlMode) => {
  const bytes = new Uint8Array(arrBuf);
  let i,
    result = "";
  const len = bytes.length,
    target = urlMode ? charsUrl : chars;
  for (i = 0; i < len; i += 3) {
    result += target[bytes[i] >> 2];
    result += target[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    result += target[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    result += target[bytes[i + 2] & 63];
  }
  const remainder = len % 3;
  if (remainder === 2) {
    result = result.substring(0, result.length - 1) + (urlMode ? "" : "=");
  } else if (remainder === 1) {
    result = result.substring(0, result.length - 2) + (urlMode ? "" : "==");
  }
  return result;
};
base64.toString = (str, urlMode) => {
  return new TextDecoder().decode(base64.toArrayBuffer(str, urlMode));
};
base64.fromString = (str, urlMode) => {
  return base64.fromArrayBuffer(new TextEncoder().encode(str), urlMode);
};
base64.validate = (encoded, urlMode) => {
  if (!(typeof encoded === "string" || encoded instanceof String)) {
    return false;
  }
  try {
    return urlMode ? base64UrlPattern.test(encoded) : base64Pattern.test(encoded);
  } catch (_e) {
    return false;
  }
};
base64.base64 = base64;
var base64_default = base64;

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoBase64URL.js
function toBuffer(base64urlString, from = "base64url") {
  const _buffer = base64_default.toArrayBuffer(base64urlString, from === "base64url");
  return new Uint8Array(_buffer);
}
__name(toBuffer, "toBuffer");
function fromBuffer(buffer, to = "base64url") {
  const _normalized = new Uint8Array(buffer);
  return base64_default.fromArrayBuffer(_normalized.buffer, to === "base64url");
}
__name(fromBuffer, "fromBuffer");
function toBase64(base64urlString) {
  const fromBase64Url = base64_default.toArrayBuffer(base64urlString, true);
  const toBase642 = base64_default.fromArrayBuffer(fromBase64Url);
  return toBase642;
}
__name(toBase64, "toBase64");
function fromUTF8String(utf8String) {
  return base64_default.fromString(utf8String, true);
}
__name(fromUTF8String, "fromUTF8String");
function toUTF8String(base64urlString) {
  return base64_default.toString(base64urlString, true);
}
__name(toUTF8String, "toUTF8String");
function isBase64(input) {
  return base64_default.validate(input, false);
}
__name(isBase64, "isBase64");
function isBase64URL(input) {
  input = trimPadding(input);
  return base64_default.validate(input, true);
}
__name(isBase64URL, "isBase64URL");
function trimPadding(input) {
  return input.replace(/=/g, "");
}
__name(trimPadding, "trimPadding");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCBOR.js
var isoCBOR_exports = {};
__export(isoCBOR_exports, {
  decodeFirst: () => decodeFirst,
  encode: () => encode,
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@levischuck/tiny-cbor/esm/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@levischuck/tiny-cbor/esm/cbor/cbor.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@levischuck/tiny-cbor/esm/cbor/cbor_internal.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function decodeLength(data, argument, index) {
  if (argument < 24) {
    return [argument, 1];
  }
  const remainingDataLength = data.byteLength - index - 1;
  const view = new DataView(data.buffer, index + 1);
  let output;
  let bytes = 0;
  switch (argument) {
    case 24: {
      if (remainingDataLength > 0) {
        output = view.getUint8(0);
        bytes = 2;
      }
      break;
    }
    case 25: {
      if (remainingDataLength > 1) {
        output = view.getUint16(0, false);
        bytes = 3;
      }
      break;
    }
    case 26: {
      if (remainingDataLength > 3) {
        output = view.getUint32(0, false);
        bytes = 5;
      }
      break;
    }
    case 27: {
      if (remainingDataLength > 7) {
        const bigOutput = view.getBigUint64(0, false);
        if (bigOutput >= 24n && bigOutput <= Number.MAX_SAFE_INTEGER) {
          return [Number(bigOutput), 9];
        }
      }
      break;
    }
  }
  if (output && output >= 24) {
    return [output, bytes];
  }
  throw new Error("Length not supported or not well formed");
}
__name(decodeLength, "decodeLength");
var MAJOR_TYPE_UNSIGNED_INTEGER = 0;
var MAJOR_TYPE_NEGATIVE_INTEGER = 1;
var MAJOR_TYPE_BYTE_STRING = 2;
var MAJOR_TYPE_TEXT_STRING = 3;
var MAJOR_TYPE_ARRAY = 4;
var MAJOR_TYPE_MAP = 5;
var MAJOR_TYPE_TAG = 6;
var MAJOR_TYPE_SIMPLE_OR_FLOAT = 7;
function encodeLength(major, argument) {
  const majorEncoded = major << 5;
  if (argument < 0) {
    throw new Error("CBOR Data Item argument must not be negative");
  }
  let bigintArgument;
  if (typeof argument == "number") {
    if (!Number.isInteger(argument)) {
      throw new Error("CBOR Data Item argument must be an integer");
    }
    bigintArgument = BigInt(argument);
  } else {
    bigintArgument = argument;
  }
  if (major == MAJOR_TYPE_NEGATIVE_INTEGER) {
    if (bigintArgument == 0n) {
      throw new Error("CBOR Data Item argument cannot be zero when negative");
    }
    bigintArgument = bigintArgument - 1n;
  }
  if (bigintArgument > 18446744073709551615n) {
    throw new Error("CBOR number out of range");
  }
  const buffer = new Uint8Array(8);
  const view = new DataView(buffer.buffer);
  view.setBigUint64(0, bigintArgument, false);
  if (bigintArgument <= 23) {
    return [majorEncoded | buffer[7]];
  } else if (bigintArgument <= 255) {
    return [majorEncoded | 24, buffer[7]];
  } else if (bigintArgument <= 65535) {
    return [majorEncoded | 25, ...buffer.slice(6)];
  } else if (bigintArgument <= 4294967295) {
    return [majorEncoded | 26, ...buffer.slice(4)];
  } else {
    return [majorEncoded | 27, ...buffer];
  }
}
__name(encodeLength, "encodeLength");

// node_modules/@levischuck/tiny-cbor/esm/cbor/cbor.js
var CBORTag = class {
  /**
   * Wrap a value with a tag number.
   * When encoded, this tag will be attached to the value.
   *
   * @param tag Tag number
   * @param value Wrapped value
   */
  constructor(tag, value) {
    Object.defineProperty(this, "tagId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "tagValue", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    this.tagId = tag;
    this.tagValue = value;
  }
  /**
   * Read the tag number
   */
  get tag() {
    return this.tagId;
  }
  /**
   * Read the value
   */
  get value() {
    return this.tagValue;
  }
};
__name(CBORTag, "CBORTag");
function decodeUnsignedInteger(data, argument, index) {
  return decodeLength(data, argument, index);
}
__name(decodeUnsignedInteger, "decodeUnsignedInteger");
function decodeNegativeInteger(data, argument, index) {
  const [value, length] = decodeUnsignedInteger(data, argument, index);
  return [-value - 1, length];
}
__name(decodeNegativeInteger, "decodeNegativeInteger");
function decodeByteString(data, argument, index) {
  const [lengthValue, lengthConsumed] = decodeLength(data, argument, index);
  const dataStartIndex = index + lengthConsumed;
  return [
    new Uint8Array(data.buffer.slice(dataStartIndex, dataStartIndex + lengthValue)),
    lengthConsumed + lengthValue,
  ];
}
__name(decodeByteString, "decodeByteString");
var TEXT_DECODER = new TextDecoder();
function decodeString(data, argument, index) {
  const [value, length] = decodeByteString(data, argument, index);
  return [TEXT_DECODER.decode(value), length];
}
__name(decodeString, "decodeString");
function decodeArray(data, argument, index) {
  if (argument === 0) {
    return [[], 1];
  }
  const [length, lengthConsumed] = decodeLength(data, argument, index);
  let consumedLength = lengthConsumed;
  const value = [];
  for (let i = 0; i < length; i++) {
    const remainingDataLength = data.byteLength - index - consumedLength;
    if (remainingDataLength <= 0) {
      throw new Error("array is not supported or well formed");
    }
    const [decodedValue, consumed] = decodeNext(data, index + consumedLength);
    value.push(decodedValue);
    consumedLength += consumed;
  }
  return [value, consumedLength];
}
__name(decodeArray, "decodeArray");
var MAP_ERROR = "Map is not supported or well formed";
function decodeMap(data, argument, index) {
  if (argument === 0) {
    return [/* @__PURE__ */ new Map(), 1];
  }
  const [length, lengthConsumed] = decodeLength(data, argument, index);
  let consumedLength = lengthConsumed;
  const result = /* @__PURE__ */ new Map();
  for (let i = 0; i < length; i++) {
    let remainingDataLength = data.byteLength - index - consumedLength;
    if (remainingDataLength <= 0) {
      throw new Error(MAP_ERROR);
    }
    const [key, keyConsumed] = decodeNext(data, index + consumedLength);
    consumedLength += keyConsumed;
    remainingDataLength -= keyConsumed;
    if (remainingDataLength <= 0) {
      throw new Error(MAP_ERROR);
    }
    if (typeof key !== "string" && typeof key !== "number") {
      throw new Error(MAP_ERROR);
    }
    if (result.has(key)) {
      throw new Error(MAP_ERROR);
    }
    const [value, valueConsumed] = decodeNext(data, index + consumedLength);
    consumedLength += valueConsumed;
    result.set(key, value);
  }
  return [result, consumedLength];
}
__name(decodeMap, "decodeMap");
function decodeFloat16(data, index) {
  if (index + 3 > data.byteLength) {
    throw new Error("CBOR stream ended before end of Float 16");
  }
  const result = data.getUint16(index + 1, false);
  if (result == 31744) {
    return [Infinity, 3];
  } else if (result == 32256) {
    return [NaN, 3];
  } else if (result == 64512) {
    return [-Infinity, 3];
  }
  throw new Error("Float16 data is unsupported");
}
__name(decodeFloat16, "decodeFloat16");
function decodeFloat32(data, index) {
  if (index + 5 > data.byteLength) {
    throw new Error("CBOR stream ended before end of Float 32");
  }
  const result = data.getFloat32(index + 1, false);
  return [result, 5];
}
__name(decodeFloat32, "decodeFloat32");
function decodeFloat64(data, index) {
  if (index + 9 > data.byteLength) {
    throw new Error("CBOR stream ended before end of Float 64");
  }
  const result = data.getFloat64(index + 1, false);
  return [result, 9];
}
__name(decodeFloat64, "decodeFloat64");
function decodeTag(data, argument, index) {
  const [tag, tagBytes] = decodeLength(data, argument, index);
  const [value, valueBytes] = decodeNext(data, index + tagBytes);
  return [new CBORTag(tag, value), tagBytes + valueBytes];
}
__name(decodeTag, "decodeTag");
function decodeNext(data, index) {
  if (index >= data.byteLength) {
    throw new Error("CBOR stream ended before tag value");
  }
  const byte = data.getUint8(index);
  const majorType = byte >> 5;
  const argument = byte & 31;
  switch (majorType) {
    case MAJOR_TYPE_UNSIGNED_INTEGER: {
      return decodeUnsignedInteger(data, argument, index);
    }
    case MAJOR_TYPE_NEGATIVE_INTEGER: {
      return decodeNegativeInteger(data, argument, index);
    }
    case MAJOR_TYPE_BYTE_STRING: {
      return decodeByteString(data, argument, index);
    }
    case MAJOR_TYPE_TEXT_STRING: {
      return decodeString(data, argument, index);
    }
    case MAJOR_TYPE_ARRAY: {
      return decodeArray(data, argument, index);
    }
    case MAJOR_TYPE_MAP: {
      return decodeMap(data, argument, index);
    }
    case MAJOR_TYPE_TAG: {
      return decodeTag(data, argument, index);
    }
    case MAJOR_TYPE_SIMPLE_OR_FLOAT: {
      switch (argument) {
        case 20:
          return [false, 1];
        case 21:
          return [true, 1];
        case 22:
          return [null, 1];
        case 23:
          return [void 0, 1];
        case 25:
          return decodeFloat16(data, index);
        case 26:
          return decodeFloat32(data, index);
        case 27:
          return decodeFloat64(data, index);
      }
    }
  }
  throw new Error(`Unsupported or not well formed at ${index}`);
}
__name(decodeNext, "decodeNext");
function encodeSimple(data) {
  if (data === true) {
    return 245;
  } else if (data === false) {
    return 244;
  } else if (data === null) {
    return 246;
  }
  return 247;
}
__name(encodeSimple, "encodeSimple");
function encodeFloat(data) {
  if (Math.fround(data) == data || !Number.isFinite(data) || Number.isNaN(data)) {
    const output = new Uint8Array(5);
    output[0] = 250;
    const view = new DataView(output.buffer);
    view.setFloat32(1, data, false);
    return output;
  } else {
    const output = new Uint8Array(9);
    output[0] = 251;
    const view = new DataView(output.buffer);
    view.setFloat64(1, data, false);
    return output;
  }
}
__name(encodeFloat, "encodeFloat");
function encodeNumber(data) {
  if (typeof data == "number") {
    if (Number.isSafeInteger(data)) {
      if (data < 0) {
        return encodeLength(MAJOR_TYPE_NEGATIVE_INTEGER, Math.abs(data));
      } else {
        return encodeLength(MAJOR_TYPE_UNSIGNED_INTEGER, data);
      }
    }
    return [encodeFloat(data)];
  } else {
    if (data < 0n) {
      return encodeLength(MAJOR_TYPE_NEGATIVE_INTEGER, data * -1n);
    } else {
      return encodeLength(MAJOR_TYPE_UNSIGNED_INTEGER, data);
    }
  }
}
__name(encodeNumber, "encodeNumber");
var ENCODER = new TextEncoder();
function encodeString(data, output) {
  output.push(...encodeLength(MAJOR_TYPE_TEXT_STRING, data.length));
  output.push(ENCODER.encode(data));
}
__name(encodeString, "encodeString");
function encodeBytes(data, output) {
  output.push(...encodeLength(MAJOR_TYPE_BYTE_STRING, data.length));
  output.push(data);
}
__name(encodeBytes, "encodeBytes");
function encodeArray(data, output) {
  output.push(...encodeLength(MAJOR_TYPE_ARRAY, data.length));
  for (const element of data) {
    encodePartialCBOR(element, output);
  }
}
__name(encodeArray, "encodeArray");
function encodeMap(data, output) {
  output.push(new Uint8Array(encodeLength(MAJOR_TYPE_MAP, data.size)));
  for (const [key, value] of data.entries()) {
    encodePartialCBOR(key, output);
    encodePartialCBOR(value, output);
  }
}
__name(encodeMap, "encodeMap");
function encodeTag(tag, output) {
  output.push(...encodeLength(MAJOR_TYPE_TAG, tag.tag));
  encodePartialCBOR(tag.value, output);
}
__name(encodeTag, "encodeTag");
function encodePartialCBOR(data, output) {
  if (typeof data == "boolean" || data === null || data == void 0) {
    output.push(encodeSimple(data));
    return;
  }
  if (typeof data == "number" || typeof data == "bigint") {
    output.push(...encodeNumber(data));
    return;
  }
  if (typeof data == "string") {
    encodeString(data, output);
    return;
  }
  if (data instanceof Uint8Array) {
    encodeBytes(data, output);
    return;
  }
  if (Array.isArray(data)) {
    encodeArray(data, output);
    return;
  }
  if (data instanceof Map) {
    encodeMap(data, output);
    return;
  }
  if (data instanceof CBORTag) {
    encodeTag(data, output);
    return;
  }
  throw new Error("Not implemented");
}
__name(encodePartialCBOR, "encodePartialCBOR");
function decodePartialCBOR(data, index) {
  if (data.byteLength === 0 || data.byteLength <= index || index < 0) {
    throw new Error("No data");
  }
  if (data instanceof Uint8Array) {
    return decodeNext(new DataView(data.buffer), index);
  } else if (data instanceof ArrayBuffer) {
    return decodeNext(new DataView(data), index);
  }
  return decodeNext(data, index);
}
__name(decodePartialCBOR, "decodePartialCBOR");
function encodeCBOR(data) {
  const results = [];
  encodePartialCBOR(data, results);
  let length = 0;
  for (const result of results) {
    if (typeof result == "number") {
      length += 1;
    } else {
      length += result.length;
    }
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const result of results) {
    if (typeof result == "number") {
      output[index] = result;
      index += 1;
    } else {
      output.set(result, index);
      index += result.length;
    }
  }
  return output;
}
__name(encodeCBOR, "encodeCBOR");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCBOR.js
function decodeFirst(input) {
  const _input = new Uint8Array(input);
  const decoded = decodePartialCBOR(_input, 0);
  const [first] = decoded;
  return first;
}
__name(decodeFirst, "decodeFirst");
function encode(input) {
  return encodeCBOR(input);
}
__name(encode, "encode");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/index.js
var isoCrypto_exports = {};
__export(isoCrypto_exports, {
  digest: () => digest,
  getRandomValues: () => getRandomValues,
  verify: () => verify,
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/digest.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/mapCoseAlgToWebCryptoAlg.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/cose.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isCOSEPublicKeyOKP(cosePublicKey) {
  const kty = cosePublicKey.get(COSEKEYS.kty);
  return isCOSEKty(kty) && kty === COSEKTY.OKP;
}
__name(isCOSEPublicKeyOKP, "isCOSEPublicKeyOKP");
function isCOSEPublicKeyEC2(cosePublicKey) {
  const kty = cosePublicKey.get(COSEKEYS.kty);
  return isCOSEKty(kty) && kty === COSEKTY.EC2;
}
__name(isCOSEPublicKeyEC2, "isCOSEPublicKeyEC2");
function isCOSEPublicKeyRSA(cosePublicKey) {
  const kty = cosePublicKey.get(COSEKEYS.kty);
  return isCOSEKty(kty) && kty === COSEKTY.RSA;
}
__name(isCOSEPublicKeyRSA, "isCOSEPublicKeyRSA");
var COSEKEYS;
(function (COSEKEYS2) {
  COSEKEYS2[(COSEKEYS2["kty"] = 1)] = "kty";
  COSEKEYS2[(COSEKEYS2["alg"] = 3)] = "alg";
  COSEKEYS2[(COSEKEYS2["crv"] = -1)] = "crv";
  COSEKEYS2[(COSEKEYS2["x"] = -2)] = "x";
  COSEKEYS2[(COSEKEYS2["y"] = -3)] = "y";
  COSEKEYS2[(COSEKEYS2["n"] = -1)] = "n";
  COSEKEYS2[(COSEKEYS2["e"] = -2)] = "e";
})(COSEKEYS || (COSEKEYS = {}));
var COSEKTY;
(function (COSEKTY2) {
  COSEKTY2[(COSEKTY2["OKP"] = 1)] = "OKP";
  COSEKTY2[(COSEKTY2["EC2"] = 2)] = "EC2";
  COSEKTY2[(COSEKTY2["RSA"] = 3)] = "RSA";
})(COSEKTY || (COSEKTY = {}));
function isCOSEKty(kty) {
  return Object.values(COSEKTY).indexOf(kty) >= 0;
}
__name(isCOSEKty, "isCOSEKty");
var COSECRV;
(function (COSECRV2) {
  COSECRV2[(COSECRV2["P256"] = 1)] = "P256";
  COSECRV2[(COSECRV2["P384"] = 2)] = "P384";
  COSECRV2[(COSECRV2["P521"] = 3)] = "P521";
  COSECRV2[(COSECRV2["ED25519"] = 6)] = "ED25519";
  COSECRV2[(COSECRV2["SECP256K1"] = 8)] = "SECP256K1";
})(COSECRV || (COSECRV = {}));
function isCOSECrv(crv) {
  return Object.values(COSECRV).indexOf(crv) >= 0;
}
__name(isCOSECrv, "isCOSECrv");
var COSEALG;
(function (COSEALG2) {
  COSEALG2[(COSEALG2["ES256"] = -7)] = "ES256";
  COSEALG2[(COSEALG2["EdDSA"] = -8)] = "EdDSA";
  COSEALG2[(COSEALG2["ES384"] = -35)] = "ES384";
  COSEALG2[(COSEALG2["ES512"] = -36)] = "ES512";
  COSEALG2[(COSEALG2["PS256"] = -37)] = "PS256";
  COSEALG2[(COSEALG2["PS384"] = -38)] = "PS384";
  COSEALG2[(COSEALG2["PS512"] = -39)] = "PS512";
  COSEALG2[(COSEALG2["ES256K"] = -47)] = "ES256K";
  COSEALG2[(COSEALG2["RS256"] = -257)] = "RS256";
  COSEALG2[(COSEALG2["RS384"] = -258)] = "RS384";
  COSEALG2[(COSEALG2["RS512"] = -259)] = "RS512";
  COSEALG2[(COSEALG2["RS1"] = -65535)] = "RS1";
})(COSEALG || (COSEALG = {}));
function isCOSEAlg(alg) {
  return Object.values(COSEALG).indexOf(alg) >= 0;
}
__name(isCOSEAlg, "isCOSEAlg");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/mapCoseAlgToWebCryptoAlg.js
function mapCoseAlgToWebCryptoAlg(alg) {
  if ([COSEALG.RS1].indexOf(alg) >= 0) {
    return "SHA-1";
  } else if ([COSEALG.ES256, COSEALG.PS256, COSEALG.RS256].indexOf(alg) >= 0) {
    return "SHA-256";
  } else if ([COSEALG.ES384, COSEALG.PS384, COSEALG.RS384].indexOf(alg) >= 0) {
    return "SHA-384";
  } else if ([COSEALG.ES512, COSEALG.PS512, COSEALG.RS512, COSEALG.EdDSA].indexOf(alg) >= 0) {
    return "SHA-512";
  }
  throw new Error(`Could not map COSE alg value of ${alg} to a WebCrypto alg`);
}
__name(mapCoseAlgToWebCryptoAlg, "mapCoseAlgToWebCryptoAlg");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/getWebCrypto.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var webCrypto = void 0;
function getWebCrypto() {
  const toResolve = new Promise((resolve, reject) => {
    if (webCrypto) {
      return resolve(webCrypto);
    }
    const _globalThisCrypto = _getWebCryptoInternals.stubThisGlobalThisCrypto();
    if (_globalThisCrypto) {
      webCrypto = _globalThisCrypto;
      return resolve(webCrypto);
    }
    return reject(new MissingWebCrypto());
  });
  return toResolve;
}
__name(getWebCrypto, "getWebCrypto");
var MissingWebCrypto = class extends Error {
  constructor() {
    const message = "An instance of the Crypto API could not be located";
    super(message);
    this.name = "MissingWebCrypto";
  }
};
__name(MissingWebCrypto, "MissingWebCrypto");
var _getWebCryptoInternals = {
  stubThisGlobalThisCrypto: () => globalThis.crypto,
  // Make it possible to reset the `webCrypto` at the top of the file
  setCachedCrypto: (newCrypto) => {
    webCrypto = newCrypto;
  },
};

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/digest.js
async function digest(data, algorithm) {
  const WebCrypto = await getWebCrypto();
  const subtleAlgorithm = mapCoseAlgToWebCryptoAlg(algorithm);
  const hashed = await WebCrypto.subtle.digest(subtleAlgorithm, data);
  return new Uint8Array(hashed);
}
__name(digest, "digest");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/getRandomValues.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function getRandomValues(array) {
  const WebCrypto = await getWebCrypto();
  WebCrypto.getRandomValues(array);
  return array;
}
__name(getRandomValues, "getRandomValues");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verify.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyEC2.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/importKey.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function importKey(opts) {
  const WebCrypto = await getWebCrypto();
  const { keyData, algorithm } = opts;
  return WebCrypto.subtle.importKey("jwk", keyData, algorithm, false, ["verify"]);
}
__name(importKey, "importKey");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyEC2.js
async function verifyEC2(opts) {
  const { cosePublicKey, signature, data, shaHashOverride } = opts;
  const WebCrypto = await getWebCrypto();
  const alg = cosePublicKey.get(COSEKEYS.alg);
  const crv = cosePublicKey.get(COSEKEYS.crv);
  const x = cosePublicKey.get(COSEKEYS.x);
  const y = cosePublicKey.get(COSEKEYS.y);
  if (!alg) {
    throw new Error("Public key was missing alg (EC2)");
  }
  if (!crv) {
    throw new Error("Public key was missing crv (EC2)");
  }
  if (!x) {
    throw new Error("Public key was missing x (EC2)");
  }
  if (!y) {
    throw new Error("Public key was missing y (EC2)");
  }
  let _crv;
  if (crv === COSECRV.P256) {
    _crv = "P-256";
  } else if (crv === COSECRV.P384) {
    _crv = "P-384";
  } else if (crv === COSECRV.P521) {
    _crv = "P-521";
  } else {
    throw new Error(`Unexpected COSE crv value of ${crv} (EC2)`);
  }
  const keyData = {
    kty: "EC",
    crv: _crv,
    x: isoBase64URL_exports.fromBuffer(x),
    y: isoBase64URL_exports.fromBuffer(y),
    ext: false,
  };
  const keyAlgorithm = {
    /**
     * Note to future self: you can't use `mapCoseAlgToWebCryptoKeyAlgName()` here because some
     * leaf certs from actual devices specified an RSA SHA value for `alg` (e.g. `-257`) which
     * would then map here to `'RSASSA-PKCS1-v1_5'`. We always want `'ECDSA'` here so we'll
     * hard-code this.
     */
    name: "ECDSA",
    namedCurve: _crv,
  };
  const key = await importKey({
    keyData,
    algorithm: keyAlgorithm,
  });
  let subtleAlg = mapCoseAlgToWebCryptoAlg(alg);
  if (shaHashOverride) {
    subtleAlg = mapCoseAlgToWebCryptoAlg(shaHashOverride);
  }
  const verifyAlgorithm = {
    name: "ECDSA",
    hash: { name: subtleAlg },
  };
  return WebCrypto.subtle.verify(verifyAlgorithm, key, signature, data);
}
__name(verifyEC2, "verifyEC2");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyRSA.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/mapCoseAlgToWebCryptoKeyAlgName.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function mapCoseAlgToWebCryptoKeyAlgName(alg) {
  if ([COSEALG.EdDSA].indexOf(alg) >= 0) {
    return "Ed25519";
  } else if ([COSEALG.ES256, COSEALG.ES384, COSEALG.ES512, COSEALG.ES256K].indexOf(alg) >= 0) {
    return "ECDSA";
  } else if ([COSEALG.RS256, COSEALG.RS384, COSEALG.RS512, COSEALG.RS1].indexOf(alg) >= 0) {
    return "RSASSA-PKCS1-v1_5";
  } else if ([COSEALG.PS256, COSEALG.PS384, COSEALG.PS512].indexOf(alg) >= 0) {
    return "RSA-PSS";
  }
  throw new Error(`Could not map COSE alg value of ${alg} to a WebCrypto key alg name`);
}
__name(mapCoseAlgToWebCryptoKeyAlgName, "mapCoseAlgToWebCryptoKeyAlgName");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyRSA.js
async function verifyRSA(opts) {
  const { cosePublicKey, signature, data, shaHashOverride } = opts;
  const WebCrypto = await getWebCrypto();
  const alg = cosePublicKey.get(COSEKEYS.alg);
  const n = cosePublicKey.get(COSEKEYS.n);
  const e = cosePublicKey.get(COSEKEYS.e);
  if (!alg) {
    throw new Error("Public key was missing alg (RSA)");
  }
  if (!isCOSEAlg(alg)) {
    throw new Error(`Public key had invalid alg ${alg} (RSA)`);
  }
  if (!n) {
    throw new Error("Public key was missing n (RSA)");
  }
  if (!e) {
    throw new Error("Public key was missing e (RSA)");
  }
  const keyData = {
    kty: "RSA",
    alg: "",
    n: isoBase64URL_exports.fromBuffer(n),
    e: isoBase64URL_exports.fromBuffer(e),
    ext: false,
  };
  const keyAlgorithm = {
    name: mapCoseAlgToWebCryptoKeyAlgName(alg),
    hash: { name: mapCoseAlgToWebCryptoAlg(alg) },
  };
  const verifyAlgorithm = {
    name: mapCoseAlgToWebCryptoKeyAlgName(alg),
  };
  if (shaHashOverride) {
    keyAlgorithm.hash.name = mapCoseAlgToWebCryptoAlg(shaHashOverride);
  }
  if (keyAlgorithm.name === "RSASSA-PKCS1-v1_5") {
    if (keyAlgorithm.hash.name === "SHA-256") {
      keyData.alg = "RS256";
    } else if (keyAlgorithm.hash.name === "SHA-384") {
      keyData.alg = "RS384";
    } else if (keyAlgorithm.hash.name === "SHA-512") {
      keyData.alg = "RS512";
    } else if (keyAlgorithm.hash.name === "SHA-1") {
      keyData.alg = "RS1";
    }
  } else if (keyAlgorithm.name === "RSA-PSS") {
    let saltLength = 0;
    if (keyAlgorithm.hash.name === "SHA-256") {
      keyData.alg = "PS256";
      saltLength = 32;
    } else if (keyAlgorithm.hash.name === "SHA-384") {
      keyData.alg = "PS384";
      saltLength = 48;
    } else if (keyAlgorithm.hash.name === "SHA-512") {
      keyData.alg = "PS512";
      saltLength = 64;
    }
    verifyAlgorithm.saltLength = saltLength;
  } else {
    throw new Error(`Unexpected RSA key algorithm ${alg} (${keyAlgorithm.name})`);
  }
  const key = await importKey({
    keyData,
    algorithm: keyAlgorithm,
  });
  return WebCrypto.subtle.verify(verifyAlgorithm, key, signature, data);
}
__name(verifyRSA, "verifyRSA");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyOKP.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/convertAAGUIDToString.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function convertAAGUIDToString(aaguid) {
  const hex2 = isoUint8Array_exports.toHex(aaguid);
  const segments = [
    hex2.slice(0, 8),
    // 8
    hex2.slice(8, 12),
    // 4
    hex2.slice(12, 16),
    // 4
    hex2.slice(16, 20),
    // 4
    hex2.slice(20, 32),
    // 8
  ];
  return segments.join("-");
}
__name(convertAAGUIDToString, "convertAAGUIDToString");

// node_modules/@simplewebauthn/server/esm/helpers/convertCertBufferToPEM.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function convertCertBufferToPEM(certBuffer) {
  let b64cert;
  if (typeof certBuffer === "string") {
    if (isoBase64URL_exports.isBase64URL(certBuffer)) {
      b64cert = isoBase64URL_exports.toBase64(certBuffer);
    } else if (isoBase64URL_exports.isBase64(certBuffer)) {
      b64cert = certBuffer;
    } else {
      throw new Error("Certificate is not a valid base64 or base64url string");
    }
  } else {
    b64cert = isoBase64URL_exports.fromBuffer(certBuffer, "base64");
  }
  let PEMKey = "";
  for (let i = 0; i < Math.ceil(b64cert.length / 64); i += 1) {
    const start = 64 * i;
    PEMKey += `${b64cert.substr(start, 64)}
`;
  }
  PEMKey = `-----BEGIN CERTIFICATE-----
${PEMKey}-----END CERTIFICATE-----
`;
  return PEMKey;
}
__name(convertCertBufferToPEM, "convertCertBufferToPEM");

// node_modules/@simplewebauthn/server/esm/helpers/convertCOSEtoPKCS.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function convertCOSEtoPKCS(cosePublicKey) {
  const struct = isoCBOR_exports.decodeFirst(cosePublicKey);
  const tag = Uint8Array.from([4]);
  const x = struct.get(COSEKEYS.x);
  const y = struct.get(COSEKEYS.y);
  if (!x) {
    throw new Error("COSE public key was missing x");
  }
  if (y) {
    return isoUint8Array_exports.concat([tag, x, y]);
  }
  return isoUint8Array_exports.concat([tag, x]);
}
__name(convertCOSEtoPKCS, "convertCOSEtoPKCS");

// node_modules/@simplewebauthn/server/esm/helpers/decodeAttestationObject.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function decodeAttestationObject(attestationObject) {
  return _decodeAttestationObjectInternals.stubThis(isoCBOR_exports.decodeFirst(attestationObject));
}
__name(decodeAttestationObject, "decodeAttestationObject");
var _decodeAttestationObjectInternals = {
  stubThis: (value) => value,
};

// node_modules/@simplewebauthn/server/esm/helpers/decodeClientDataJSON.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function decodeClientDataJSON(data) {
  const toString = isoBase64URL_exports.toUTF8String(data);
  const clientData = JSON.parse(toString);
  return _decodeClientDataJSONInternals.stubThis(clientData);
}
__name(decodeClientDataJSON, "decodeClientDataJSON");
var _decodeClientDataJSONInternals = {
  stubThis: (value) => value,
};

// node_modules/@simplewebauthn/server/esm/helpers/decodeCredentialPublicKey.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function decodeCredentialPublicKey(publicKey) {
  return _decodeCredentialPublicKeyInternals.stubThis(isoCBOR_exports.decodeFirst(publicKey));
}
__name(decodeCredentialPublicKey, "decodeCredentialPublicKey");
var _decodeCredentialPublicKeyInternals = {
  stubThis: (value) => value,
};

// node_modules/@simplewebauthn/server/esm/helpers/generateUserID.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function generateUserID() {
  const newUserID = new Uint8Array(32);
  await isoCrypto_exports.getRandomValues(newUserID);
  return _generateUserIDInternals.stubThis(newUserID);
}
__name(generateUserID, "generateUserID");
var _generateUserIDInternals = {
  stubThis: (value) => value,
};

// node_modules/@simplewebauthn/server/esm/helpers/getCertificateInfo.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-schema/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-schema/build/es2015/converters.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/asn1js/build/index.es.js
var index_es_exports = {};
__export(index_es_exports, {
  Any: () => Any,
  BaseBlock: () => BaseBlock,
  BaseStringBlock: () => BaseStringBlock,
  BitString: () => BitString,
  BmpString: () => BmpString,
  Boolean: () => Boolean,
  CharacterString: () => CharacterString,
  Choice: () => Choice,
  Constructed: () => Constructed,
  DATE: () => DATE,
  DEFAULT_MAX_CONTENT_LENGTH: () => DEFAULT_MAX_CONTENT_LENGTH,
  DEFAULT_MAX_DEPTH: () => DEFAULT_MAX_DEPTH,
  DEFAULT_MAX_NODES: () => DEFAULT_MAX_NODES,
  DateTime: () => DateTime,
  Duration: () => Duration,
  EndOfContent: () => EndOfContent,
  Enumerated: () => Enumerated,
  GeneralString: () => GeneralString,
  GeneralizedTime: () => GeneralizedTime,
  GraphicString: () => GraphicString,
  HexBlock: () => HexBlock,
  IA5String: () => IA5String,
  Integer: () => Integer,
  Null: () => Null,
  NumericString: () => NumericString,
  ObjectIdentifier: () => ObjectIdentifier,
  OctetString: () => OctetString,
  Primitive: () => Primitive,
  PrintableString: () => PrintableString,
  RawData: () => RawData,
  RelativeObjectIdentifier: () => RelativeObjectIdentifier,
  Repeated: () => Repeated,
  Sequence: () => Sequence,
  Set: () => Set2,
  TIME: () => TIME,
  TeletexString: () => TeletexString,
  TimeOfDay: () => TimeOfDay,
  UTCTime: () => UTCTime,
  UniversalString: () => UniversalString,
  Utf8String: () => Utf8String,
  ValueBlock: () => ValueBlock,
  VideotexString: () => VideotexString,
  ViewWriter: () => ViewWriter,
  VisibleString: () => VisibleString,
  compareSchema: () => compareSchema,
  fromBER: () => fromBER,
  verifySchema: () => verifySchema,
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var pvtsutils = __toESM(require_build());

// node_modules/pvutils/build/utils.es.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function utilFromBase(inputBuffer, inputBase) {
  let result = 0;
  if (inputBuffer.length === 1) {
    return inputBuffer[0];
  }
  for (let i = inputBuffer.length - 1; i >= 0; i--) {
    result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);
  }
  return result;
}
__name(utilFromBase, "utilFromBase");
function utilToBase(value, base, reserved = -1) {
  const internalReserved = reserved;
  let internalValue = value;
  let result = 0;
  let biggest = Math.pow(2, base);
  for (let i = 1; i < 8; i++) {
    if (value < biggest) {
      let retBuf;
      if (internalReserved < 0) {
        retBuf = new ArrayBuffer(i);
        result = i;
      } else {
        if (internalReserved < i) {
          return new ArrayBuffer(0);
        }
        retBuf = new ArrayBuffer(internalReserved);
        result = internalReserved;
      }
      const retView = new Uint8Array(retBuf);
      for (let j = i - 1; j >= 0; j--) {
        const basis = Math.pow(2, j * base);
        retView[result - j - 1] = Math.floor(internalValue / basis);
        internalValue -= retView[result - j - 1] * basis;
      }
      return retBuf;
    }
    biggest *= Math.pow(2, base);
  }
  return new ArrayBuffer(0);
}
__name(utilToBase, "utilToBase");
function utilConcatView(...views) {
  let outputLength = 0;
  let prevLength = 0;
  for (const view of views) {
    outputLength += view.length;
  }
  const retBuf = new ArrayBuffer(outputLength);
  const retView = new Uint8Array(retBuf);
  for (const view of views) {
    retView.set(view, prevLength);
    prevLength += view.length;
  }
  return retView;
}
__name(utilConcatView, "utilConcatView");
function utilDecodeTC() {
  const buf = new Uint8Array(this.valueHex);
  if (this.valueHex.byteLength >= 2) {
    const condition1 = buf[0] === 255 && buf[1] & 128;
    const condition2 = buf[0] === 0 && (buf[1] & 128) === 0;
    if (condition1 || condition2) {
      this.warnings.push("Needlessly long format");
    }
  }
  const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
  const bigIntView = new Uint8Array(bigIntBuffer);
  for (let i = 0; i < this.valueHex.byteLength; i++) {
    bigIntView[i] = 0;
  }
  bigIntView[0] = buf[0] & 128;
  const bigInt = utilFromBase(bigIntView, 8);
  const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
  const smallIntView = new Uint8Array(smallIntBuffer);
  for (let j = 0; j < this.valueHex.byteLength; j++) {
    smallIntView[j] = buf[j];
  }
  smallIntView[0] &= 127;
  const smallInt = utilFromBase(smallIntView, 8);
  return smallInt - bigInt;
}
__name(utilDecodeTC, "utilDecodeTC");
function utilEncodeTC(value) {
  const modValue = value < 0 ? value * -1 : value;
  let bigInt = 128;
  for (let i = 1; i < 8; i++) {
    if (modValue <= bigInt) {
      if (value < 0) {
        const smallInt = bigInt - modValue;
        const retBuf2 = utilToBase(smallInt, 8, i);
        const retView2 = new Uint8Array(retBuf2);
        retView2[0] |= 128;
        return retBuf2;
      }
      let retBuf = utilToBase(modValue, 8, i);
      let retView = new Uint8Array(retBuf);
      if (retView[0] & 128) {
        const tempBuf = retBuf.slice(0);
        const tempView = new Uint8Array(tempBuf);
        retBuf = new ArrayBuffer(retBuf.byteLength + 1);
        retView = new Uint8Array(retBuf);
        for (let k = 0; k < tempBuf.byteLength; k++) {
          retView[k + 1] = tempView[k];
        }
        retView[0] = 0;
      }
      return retBuf;
    }
    bigInt *= Math.pow(2, 8);
  }
  return new ArrayBuffer(0);
}
__name(utilEncodeTC, "utilEncodeTC");
function isEqualBuffer(inputBuffer1, inputBuffer2) {
  if (inputBuffer1.byteLength !== inputBuffer2.byteLength) {
    return false;
  }
  const view1 = new Uint8Array(inputBuffer1);
  const view2 = new Uint8Array(inputBuffer2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) {
      return false;
    }
  }
  return true;
}
__name(isEqualBuffer, "isEqualBuffer");
function padNumber(inputNumber, fullLength) {
  const str = inputNumber.toString(10);
  if (fullLength < str.length) {
    return "";
  }
  const dif = fullLength - str.length;
  const padding = new Array(dif);
  for (let i = 0; i < dif; i++) {
    padding[i] = "0";
  }
  const paddingString = padding.join("");
  return paddingString.concat(str);
}
__name(padNumber, "padNumber");
var log22 = Math.log(2);

// node_modules/asn1js/build/index.es.js
function assertBigInt() {
  if (typeof BigInt === "undefined") {
    throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
  }
}
__name(assertBigInt, "assertBigInt");
function concat(buffers) {
  let outputLength = 0;
  let prevLength = 0;
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    outputLength += buffer.byteLength;
  }
  const retView = new Uint8Array(outputLength);
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    retView.set(new Uint8Array(buffer), prevLength);
    prevLength += buffer.byteLength;
  }
  return retView.buffer;
}
__name(concat, "concat");
function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
  if (!(inputBuffer instanceof Uint8Array)) {
    baseBlock.error = "Wrong parameter: inputBuffer must be 'Uint8Array'";
    return false;
  }
  if (!inputBuffer.byteLength) {
    baseBlock.error = "Wrong parameter: inputBuffer has zero length";
    return false;
  }
  if (inputOffset < 0) {
    baseBlock.error = "Wrong parameter: inputOffset less than zero";
    return false;
  }
  if (inputLength < 0) {
    baseBlock.error = "Wrong parameter: inputLength less than zero";
    return false;
  }
  if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
    baseBlock.error =
      "End of input reached before message was fully decoded (inconsistent offset and length values)";
    return false;
  }
  return true;
}
__name(checkBufferParams, "checkBufferParams");
var ViewWriter = class {
  constructor() {
    this.items = [];
  }
  write(buf) {
    this.items.push(buf);
  }
  final() {
    return concat(this.items);
  }
};
__name(ViewWriter, "ViewWriter");
var powers2 = [new Uint8Array([1])];
var digitsString = "0123456789";
var NAME = "name";
var VALUE_HEX_VIEW = "valueHexView";
var IS_HEX_ONLY = "isHexOnly";
var ID_BLOCK = "idBlock";
var TAG_CLASS = "tagClass";
var TAG_NUMBER = "tagNumber";
var IS_CONSTRUCTED = "isConstructed";
var FROM_BER = "fromBER";
var TO_BER = "toBER";
var LOCAL = "local";
var EMPTY_STRING = "";
var EMPTY_BUFFER = new ArrayBuffer(0);
var EMPTY_VIEW = new Uint8Array(0);
var END_OF_CONTENT_NAME = "EndOfContent";
var OCTET_STRING_NAME = "OCTET STRING";
var BIT_STRING_NAME = "BIT STRING";
function HexBlock(BaseClass) {
  var _a3;
  return (
    (_a3 = /* @__PURE__ */ __name(
      class Some extends BaseClass {
        get valueHex() {
          return this.valueHexView.slice().buffer;
        }
        set valueHex(value) {
          this.valueHexView = new Uint8Array(value);
        }
        constructor(...args) {
          var _b;
          super(...args);
          const params = args[0] || {};
          this.isHexOnly = (_b = params.isHexOnly) !== null && _b !== void 0 ? _b : false;
          this.valueHexView = params.valueHex
            ? pvtsutils.BufferSourceConverter.toUint8Array(params.valueHex)
            : EMPTY_VIEW;
        }
        fromBER(inputBuffer, inputOffset, inputLength, _context) {
          const view =
            inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
          if (!checkBufferParams(this, view, inputOffset, inputLength)) {
            return -1;
          }
          const endLength = inputOffset + inputLength;
          this.valueHexView = view.subarray(inputOffset, endLength);
          if (!this.valueHexView.length) {
            this.warnings.push("Zero buffer length");
            return inputOffset;
          }
          this.blockLength = inputLength;
          return endLength;
        }
        toBER(sizeOnly = false) {
          if (!this.isHexOnly) {
            this.error = "Flag 'isHexOnly' is not set, abort";
            return EMPTY_BUFFER;
          }
          if (sizeOnly) {
            return new ArrayBuffer(this.valueHexView.byteLength);
          }
          return this.valueHexView.byteLength === this.valueHexView.buffer.byteLength
            ? this.valueHexView.buffer
            : this.valueHexView.slice().buffer;
        }
        toJSON() {
          return {
            ...super.toJSON(),
            isHexOnly: this.isHexOnly,
            valueHex: pvtsutils.Convert.ToHex(this.valueHexView),
          };
        }
      },
      "Some"
    )),
    (_a3.NAME = "hexBlock"),
    _a3
  );
}
__name(HexBlock, "HexBlock");
var LocalBaseBlock = class {
  static blockName() {
    return this.NAME;
  }
  get valueBeforeDecode() {
    return this.valueBeforeDecodeView.slice().buffer;
  }
  set valueBeforeDecode(value) {
    this.valueBeforeDecodeView = new Uint8Array(value);
  }
  constructor({
    blockLength = 0,
    error: error3 = EMPTY_STRING,
    warnings = [],
    valueBeforeDecode = EMPTY_VIEW,
  } = {}) {
    this.blockLength = blockLength;
    this.error = error3;
    this.warnings = warnings;
    this.valueBeforeDecodeView = pvtsutils.BufferSourceConverter.toUint8Array(valueBeforeDecode);
  }
  toJSON() {
    return {
      blockName: this.constructor.NAME,
      blockLength: this.blockLength,
      error: this.error,
      warnings: this.warnings,
      valueBeforeDecode: pvtsutils.Convert.ToHex(this.valueBeforeDecodeView),
    };
  }
};
__name(LocalBaseBlock, "LocalBaseBlock");
LocalBaseBlock.NAME = "baseBlock";
var ValueBlock = class extends LocalBaseBlock {
  fromBER(_inputBuffer, _inputOffset, _inputLength, _context) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
  toBER(_sizeOnly, _writer) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
};
__name(ValueBlock, "ValueBlock");
ValueBlock.NAME = "valueBlock";
var LocalIdentificationBlock = class extends HexBlock(LocalBaseBlock) {
  constructor({ idBlock = {} } = {}) {
    var _a3, _b, _c, _d;
    super();
    if (idBlock) {
      this.isHexOnly = (_a3 = idBlock.isHexOnly) !== null && _a3 !== void 0 ? _a3 : false;
      this.valueHexView = idBlock.valueHex
        ? pvtsutils.BufferSourceConverter.toUint8Array(idBlock.valueHex)
        : EMPTY_VIEW;
      this.tagClass = (_b = idBlock.tagClass) !== null && _b !== void 0 ? _b : -1;
      this.tagNumber = (_c = idBlock.tagNumber) !== null && _c !== void 0 ? _c : -1;
      this.isConstructed = (_d = idBlock.isConstructed) !== null && _d !== void 0 ? _d : false;
    } else {
      this.tagClass = -1;
      this.tagNumber = -1;
      this.isConstructed = false;
    }
  }
  toBER(sizeOnly = false) {
    let firstOctet = 0;
    switch (this.tagClass) {
      case 1:
        firstOctet |= 0;
        break;
      case 2:
        firstOctet |= 64;
        break;
      case 3:
        firstOctet |= 128;
        break;
      case 4:
        firstOctet |= 192;
        break;
      default:
        this.error = "Unknown tag class";
        return EMPTY_BUFFER;
    }
    if (this.isConstructed) firstOctet |= 32;
    if (this.tagNumber < 31 && !this.isHexOnly) {
      const retView2 = new Uint8Array(1);
      if (!sizeOnly) {
        let number = this.tagNumber;
        number &= 31;
        firstOctet |= number;
        retView2[0] = firstOctet;
      }
      return retView2.buffer;
    }
    if (!this.isHexOnly) {
      const encodedBuf = utilToBase(this.tagNumber, 7);
      const encodedView = new Uint8Array(encodedBuf);
      const size = encodedBuf.byteLength;
      const retView2 = new Uint8Array(size + 1);
      retView2[0] = firstOctet | 31;
      if (!sizeOnly) {
        for (let i = 0; i < size - 1; i++) retView2[i + 1] = encodedView[i] | 128;
        retView2[size] = encodedView[size - 1];
      }
      return retView2.buffer;
    }
    const retView = new Uint8Array(this.valueHexView.byteLength + 1);
    retView[0] = firstOctet | 31;
    if (!sizeOnly) {
      const curView = this.valueHexView;
      for (let i = 0; i < curView.length - 1; i++) retView[i + 1] = curView[i] | 128;
      retView[this.valueHexView.byteLength] = curView[curView.length - 1];
    }
    return retView.buffer;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    }
    const tagClassMask = intBuffer[0] & 192;
    switch (tagClassMask) {
      case 0:
        this.tagClass = 1;
        break;
      case 64:
        this.tagClass = 2;
        break;
      case 128:
        this.tagClass = 3;
        break;
      case 192:
        this.tagClass = 4;
        break;
      default:
        this.error = "Unknown tag class";
        return -1;
    }
    this.isConstructed = (intBuffer[0] & 32) === 32;
    this.isHexOnly = false;
    const tagNumberMask = intBuffer[0] & 31;
    if (tagNumberMask !== 31) {
      this.tagNumber = tagNumberMask;
      this.blockLength = 1;
    } else {
      let count3 = 0;
      while (true) {
        const tagByteIndex = count3 + 1;
        if (tagByteIndex >= intBuffer.length) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }
        count3++;
        if ((intBuffer[tagByteIndex] & 128) === 0) break;
      }
      this.blockLength = count3 + 1;
      const intTagNumberBuffer = (this.valueHexView = new Uint8Array(count3));
      for (let i = 0; i < count3; i++) intTagNumberBuffer[i] = intBuffer[i + 1] & 127;
      if (this.blockLength <= 9) this.tagNumber = utilFromBase(intTagNumberBuffer, 7);
      else {
        this.isHexOnly = true;
        this.warnings.push("Tag too long, represented as hex-coded");
      }
    }
    if (this.tagClass === 1 && this.isConstructed) {
      switch (this.tagNumber) {
        case 1:
        case 2:
        case 5:
        case 6:
        case 9:
        case 13:
        case 14:
        case 23:
        case 24:
        case 31:
        case 32:
        case 33:
        case 34:
          this.error = "Constructed encoding used for primitive type";
          return -1;
      }
    }
    return inputOffset + this.blockLength;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      tagClass: this.tagClass,
      tagNumber: this.tagNumber,
      isConstructed: this.isConstructed,
    };
  }
};
__name(LocalIdentificationBlock, "LocalIdentificationBlock");
LocalIdentificationBlock.NAME = "identificationBlock";
var LocalLengthBlock = class extends LocalBaseBlock {
  constructor({ lenBlock = {} } = {}) {
    var _a3, _b, _c;
    super();
    this.isIndefiniteForm =
      (_a3 = lenBlock.isIndefiniteForm) !== null && _a3 !== void 0 ? _a3 : false;
    this.longFormUsed = (_b = lenBlock.longFormUsed) !== null && _b !== void 0 ? _b : false;
    this.length = (_c = lenBlock.length) !== null && _c !== void 0 ? _c : 0;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const view = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, view, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = view.subarray(inputOffset, inputOffset + inputLength);
    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    }
    if (intBuffer[0] === 255) {
      this.error = "Length block 0xFF is reserved by standard";
      return -1;
    }
    this.isIndefiniteForm = intBuffer[0] === 128;
    if (this.isIndefiniteForm) {
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    }
    this.longFormUsed = !!(intBuffer[0] & 128);
    if (this.longFormUsed === false) {
      this.length = intBuffer[0];
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    }
    const count3 = intBuffer[0] & 127;
    if (count3 > 8) {
      this.error = "Too big integer";
      return -1;
    }
    if (count3 + 1 > intBuffer.length) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    const lenOffset = inputOffset + 1;
    const lengthBufferView = view.subarray(lenOffset, lenOffset + count3);
    if (lengthBufferView[count3 - 1] === 0) this.warnings.push("Needlessly long encoded length");
    this.length = utilFromBase(lengthBufferView, 8);
    if (this.longFormUsed && this.length <= 127)
      this.warnings.push("Unnecessary usage of long length form");
    this.blockLength = count3 + 1;
    return inputOffset + this.blockLength;
  }
  toBER(sizeOnly = false) {
    let retBuf;
    let retView;
    if (this.length > 127) this.longFormUsed = true;
    if (this.isIndefiniteForm) {
      retBuf = new ArrayBuffer(1);
      if (sizeOnly === false) {
        retView = new Uint8Array(retBuf);
        retView[0] = 128;
      }
      return retBuf;
    }
    if (this.longFormUsed) {
      const encodedBuf = utilToBase(this.length, 8);
      if (encodedBuf.byteLength > 127) {
        this.error = "Too big length";
        return EMPTY_BUFFER;
      }
      retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
      if (sizeOnly) return retBuf;
      const encodedView = new Uint8Array(encodedBuf);
      retView = new Uint8Array(retBuf);
      retView[0] = encodedBuf.byteLength | 128;
      for (let i = 0; i < encodedBuf.byteLength; i++) retView[i + 1] = encodedView[i];
      return retBuf;
    }
    retBuf = new ArrayBuffer(1);
    if (sizeOnly === false) {
      retView = new Uint8Array(retBuf);
      retView[0] = this.length;
    }
    return retBuf;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      longFormUsed: this.longFormUsed,
      length: this.length,
    };
  }
};
__name(LocalLengthBlock, "LocalLengthBlock");
LocalLengthBlock.NAME = "lengthBlock";
var typeStore = {};
var BaseBlock = class extends LocalBaseBlock {
  constructor(
    { name = EMPTY_STRING, optional = false, primitiveSchema, ...parameters } = {},
    valueBlockType
  ) {
    super(parameters);
    this.name = name;
    this.optional = optional;
    if (primitiveSchema) {
      this.primitiveSchema = primitiveSchema;
    }
    this.idBlock = new LocalIdentificationBlock(parameters);
    this.lenBlock = new LocalLengthBlock(parameters);
    this.valueBlock = valueBlockType ? new valueBlockType(parameters) : new ValueBlock(parameters);
  }
  fromBER(inputBuffer, inputOffset, inputLength, context2) {
    const resultOffset = this.valueBlock.fromBER(
      inputBuffer,
      inputOffset,
      this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length,
      context2
    );
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    const _writer = writer || new ViewWriter();
    if (!writer) {
      prepareIndefiniteForm(this);
    }
    const idBlockBuf = this.idBlock.toBER(sizeOnly);
    _writer.write(idBlockBuf);
    if (this.lenBlock.isIndefiniteForm) {
      _writer.write(new Uint8Array([128]).buffer);
      this.valueBlock.toBER(sizeOnly, _writer);
      _writer.write(new ArrayBuffer(2));
    } else {
      const valueBlockBuf = this.valueBlock.toBER(sizeOnly);
      this.lenBlock.length = valueBlockBuf.byteLength;
      const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
      _writer.write(lenBlockBuf);
      _writer.write(valueBlockBuf);
    }
    if (!writer) {
      return _writer.final();
    }
    return EMPTY_BUFFER;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      idBlock: this.idBlock.toJSON(),
      lenBlock: this.lenBlock.toJSON(),
      valueBlock: this.valueBlock.toJSON(),
      name: this.name,
      optional: this.optional,
    };
    if (this.primitiveSchema) object.primitiveSchema = this.primitiveSchema.toJSON();
    return object;
  }
  toString(encoding = "ascii") {
    if (encoding === "ascii") {
      return this.onAsciiEncoding();
    }
    return pvtsutils.Convert.ToHex(this.toBER());
  }
  onAsciiEncoding() {
    const name = this.constructor.NAME;
    const value = pvtsutils.Convert.ToHex(this.valueBlock.valueBeforeDecodeView);
    return `${name} : ${value}`;
  }
  isEqual(other) {
    if (this === other) {
      return true;
    }
    if (!(other instanceof this.constructor)) {
      return false;
    }
    const thisRaw = this.toBER();
    const otherRaw = other.toBER();
    return isEqualBuffer(thisRaw, otherRaw);
  }
};
__name(BaseBlock, "BaseBlock");
BaseBlock.NAME = "BaseBlock";
function prepareIndefiniteForm(baseBlock) {
  var _a3;
  if (baseBlock instanceof typeStore.Constructed) {
    for (const value of baseBlock.valueBlock.value) {
      if (prepareIndefiniteForm(value)) {
        baseBlock.lenBlock.isIndefiniteForm = true;
      }
    }
  }
  return !!((_a3 = baseBlock.lenBlock) === null || _a3 === void 0 ? void 0 : _a3.isIndefiniteForm);
}
__name(prepareIndefiniteForm, "prepareIndefiniteForm");
var BaseStringBlock = class extends BaseBlock {
  getValue() {
    return this.valueBlock.value;
  }
  setValue(value) {
    this.valueBlock.value = value;
  }
  constructor({ value = EMPTY_STRING, ...parameters } = {}, stringValueBlockType) {
    super(parameters, stringValueBlockType);
    if (value) {
      this.fromString(value);
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(
      inputBuffer,
      inputOffset,
      this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length
    );
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    this.fromBuffer(this.valueBlock.valueHexView);
    if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
  }
};
__name(BaseStringBlock, "BaseStringBlock");
BaseStringBlock.NAME = "BaseStringBlock";
var LocalPrimitiveValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ isHexOnly = true, ...parameters } = {}) {
    super(parameters);
    this.isHexOnly = isHexOnly;
  }
};
__name(LocalPrimitiveValueBlock, "LocalPrimitiveValueBlock");
LocalPrimitiveValueBlock.NAME = "PrimitiveValueBlock";
var _a$w;
var Primitive = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalPrimitiveValueBlock);
    this.idBlock.isConstructed = false;
  }
};
__name(Primitive, "Primitive");
_a$w = Primitive;
(() => {
  typeStore.Primitive = _a$w;
})();
Primitive.NAME = "PRIMITIVE";
var DEFAULT_MAX_DEPTH = 100;
var DEFAULT_MAX_NODES = 1e4;
var DEFAULT_MAX_CONTENT_LENGTH = 16 * 1024 * 1024;
var MAX_DEPTH_EXCEEDED_ERROR = "Maximum ASN.1 nesting depth exceeded";
var MAX_NODES_EXCEEDED_ERROR = "Maximum ASN.1 node count exceeded";
var MAX_CONTENT_LENGTH_EXCEEDED_ERROR = "Maximum ASN.1 content length exceeded";
function createFromBerContext(options = {}) {
  var _a3, _b, _c;
  return {
    depth: 0,
    maxDepth: (_a3 = options.maxDepth) !== null && _a3 !== void 0 ? _a3 : DEFAULT_MAX_DEPTH,
    nodesCount: 0,
    maxNodes: (_b = options.maxNodes) !== null && _b !== void 0 ? _b : DEFAULT_MAX_NODES,
    maxContentLength:
      (_c = options.maxContentLength) !== null && _c !== void 0 ? _c : DEFAULT_MAX_CONTENT_LENGTH,
  };
}
__name(createFromBerContext, "createFromBerContext");
function createErrorResult(error3) {
  const result = new BaseBlock({}, ValueBlock);
  result.error = error3;
  return {
    offset: -1,
    result,
  };
}
__name(createErrorResult, "createErrorResult");
function checkNodesLimit(context2) {
  context2.nodesCount += 1;
  if (context2.nodesCount > context2.maxNodes) {
    return MAX_NODES_EXCEEDED_ERROR;
  }
  return void 0;
}
__name(checkNodesLimit, "checkNodesLimit");
function checkContentLengthLimit(inputLength, context2) {
  if (inputLength > context2.maxContentLength) {
    return MAX_CONTENT_LENGTH_EXCEEDED_ERROR;
  }
  return void 0;
}
__name(checkContentLengthLimit, "checkContentLengthLimit");
function localFromBERWithChildContext(inputBuffer, inputOffset, inputLength, context2) {
  const childDepth = context2.depth + 1;
  if (childDepth > context2.maxDepth) {
    return createErrorResult(MAX_DEPTH_EXCEEDED_ERROR);
  }
  context2.depth = childDepth;
  try {
    return localFromBER(inputBuffer, inputOffset, inputLength, context2);
  } finally {
    context2.depth -= 1;
  }
}
__name(localFromBERWithChildContext, "localFromBERWithChildContext");
function localChangeType(inputObject, newType) {
  if (inputObject instanceof newType) {
    return inputObject;
  }
  const newObject = new newType();
  newObject.idBlock = inputObject.idBlock;
  newObject.lenBlock = inputObject.lenBlock;
  newObject.warnings = inputObject.warnings;
  newObject.valueBeforeDecodeView = inputObject.valueBeforeDecodeView;
  return newObject;
}
__name(localChangeType, "localChangeType");
function localFromBER(
  inputBuffer,
  inputOffset = 0,
  inputLength = inputBuffer.length,
  context2 = createFromBerContext()
) {
  const incomingOffset = inputOffset;
  let returnObject = new BaseBlock({}, ValueBlock);
  const baseBlock = new LocalBaseBlock();
  if (!checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)) {
    returnObject.error = baseBlock.error;
    return {
      offset: -1,
      result: returnObject,
    };
  }
  const intBuffer = inputBuffer.subarray(inputOffset, inputOffset + inputLength);
  if (!intBuffer.length) {
    returnObject.error = "Zero buffer length";
    return {
      offset: -1,
      result: returnObject,
    };
  }
  const nodesLimitError = checkNodesLimit(context2);
  if (nodesLimitError) {
    returnObject.error = nodesLimitError;
    return {
      offset: -1,
      result: returnObject,
    };
  }
  let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
  if (returnObject.idBlock.warnings.length) {
    returnObject.warnings.concat(returnObject.idBlock.warnings);
  }
  if (resultOffset === -1) {
    returnObject.error = returnObject.idBlock.error;
    return {
      offset: -1,
      result: returnObject,
    };
  }
  inputOffset = resultOffset;
  inputLength -= returnObject.idBlock.blockLength;
  resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
  if (returnObject.lenBlock.warnings.length) {
    returnObject.warnings.concat(returnObject.lenBlock.warnings);
  }
  if (resultOffset === -1) {
    returnObject.error = returnObject.lenBlock.error;
    return {
      offset: -1,
      result: returnObject,
    };
  }
  inputOffset = resultOffset;
  inputLength -= returnObject.lenBlock.blockLength;
  const valueLength = returnObject.lenBlock.isIndefiniteForm
    ? inputLength
    : returnObject.lenBlock.length;
  const contentLengthError = checkContentLengthLimit(valueLength, context2);
  if (contentLengthError) {
    returnObject.error = contentLengthError;
    return {
      offset: -1,
      result: returnObject,
    };
  }
  if (!returnObject.idBlock.isConstructed && returnObject.lenBlock.isIndefiniteForm) {
    returnObject.error = "Indefinite length form used for primitive encoding form";
    return {
      offset: -1,
      result: returnObject,
    };
  }
  let newASN1Type = BaseBlock;
  switch (returnObject.idBlock.tagClass) {
    case 1:
      if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
        returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
        return {
          offset: -1,
          result: returnObject,
        };
      }
      switch (returnObject.idBlock.tagNumber) {
        case 0:
          if (returnObject.idBlock.isConstructed && returnObject.lenBlock.length > 0) {
            returnObject.error = "Type [UNIVERSAL 0] is reserved";
            return {
              offset: -1,
              result: returnObject,
            };
          }
          newASN1Type = typeStore.EndOfContent;
          break;
        case 1:
          newASN1Type = typeStore.Boolean;
          break;
        case 2:
          newASN1Type = typeStore.Integer;
          break;
        case 3:
          newASN1Type = typeStore.BitString;
          break;
        case 4:
          newASN1Type = typeStore.OctetString;
          break;
        case 5:
          newASN1Type = typeStore.Null;
          break;
        case 6:
          newASN1Type = typeStore.ObjectIdentifier;
          break;
        case 10:
          newASN1Type = typeStore.Enumerated;
          break;
        case 12:
          newASN1Type = typeStore.Utf8String;
          break;
        case 13:
          newASN1Type = typeStore.RelativeObjectIdentifier;
          break;
        case 14:
          newASN1Type = typeStore.TIME;
          break;
        case 15:
          returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
          return {
            offset: -1,
            result: returnObject,
          };
        case 16:
          newASN1Type = typeStore.Sequence;
          break;
        case 17:
          newASN1Type = typeStore.Set;
          break;
        case 18:
          newASN1Type = typeStore.NumericString;
          break;
        case 19:
          newASN1Type = typeStore.PrintableString;
          break;
        case 20:
          newASN1Type = typeStore.TeletexString;
          break;
        case 21:
          newASN1Type = typeStore.VideotexString;
          break;
        case 22:
          newASN1Type = typeStore.IA5String;
          break;
        case 23:
          newASN1Type = typeStore.UTCTime;
          break;
        case 24:
          newASN1Type = typeStore.GeneralizedTime;
          break;
        case 25:
          newASN1Type = typeStore.GraphicString;
          break;
        case 26:
          newASN1Type = typeStore.VisibleString;
          break;
        case 27:
          newASN1Type = typeStore.GeneralString;
          break;
        case 28:
          newASN1Type = typeStore.UniversalString;
          break;
        case 29:
          newASN1Type = typeStore.CharacterString;
          break;
        case 30:
          newASN1Type = typeStore.BmpString;
          break;
        case 31:
          newASN1Type = typeStore.DATE;
          break;
        case 32:
          newASN1Type = typeStore.TimeOfDay;
          break;
        case 33:
          newASN1Type = typeStore.DateTime;
          break;
        case 34:
          newASN1Type = typeStore.Duration;
          break;
        default: {
          const newObject = returnObject.idBlock.isConstructed
            ? new typeStore.Constructed()
            : new typeStore.Primitive();
          newObject.idBlock = returnObject.idBlock;
          newObject.lenBlock = returnObject.lenBlock;
          newObject.warnings = returnObject.warnings;
          returnObject = newObject;
        }
      }
      break;
    case 2:
    case 3:
    case 4:
    default: {
      newASN1Type = returnObject.idBlock.isConstructed
        ? typeStore.Constructed
        : typeStore.Primitive;
    }
  }
  returnObject = localChangeType(returnObject, newASN1Type);
  resultOffset = returnObject.fromBER(inputBuffer, inputOffset, valueLength, context2);
  returnObject.valueBeforeDecodeView = inputBuffer.subarray(
    incomingOffset,
    incomingOffset + returnObject.blockLength
  );
  return {
    offset: resultOffset,
    result: returnObject,
  };
}
__name(localFromBER, "localFromBER");
function fromBER(inputBuffer, options = {}) {
  if (!inputBuffer.byteLength) {
    const result = new BaseBlock({}, ValueBlock);
    result.error = "Input buffer has zero length";
    return {
      offset: -1,
      result,
    };
  }
  return localFromBER(
    pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer).slice(),
    0,
    inputBuffer.byteLength,
    createFromBerContext(options)
  );
}
__name(fromBER, "fromBER");
function checkLen(indefiniteLength, length) {
  if (indefiniteLength) {
    return 1;
  }
  return length;
}
__name(checkLen, "checkLen");
var LocalConstructedValueBlock = class extends ValueBlock {
  constructor({ value = [], isIndefiniteForm = false, ...parameters } = {}) {
    super(parameters);
    this.value = value;
    this.isIndefiniteForm = isIndefiniteForm;
  }
  fromBER(inputBuffer, inputOffset, inputLength, context2) {
    const view = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    const parseContext =
      context2 !== null && context2 !== void 0 ? context2 : createFromBerContext();
    if (!checkBufferParams(this, view, inputOffset, inputLength)) {
      return -1;
    }
    this.valueBeforeDecodeView = view.subarray(inputOffset, inputOffset + inputLength);
    if (this.valueBeforeDecodeView.length === 0) {
      this.warnings.push("Zero buffer length");
      return inputOffset;
    }
    let currentOffset = inputOffset;
    while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
      const returnObject = localFromBERWithChildContext(
        view,
        currentOffset,
        inputLength,
        parseContext
      );
      if (returnObject.offset === -1) {
        this.error = returnObject.result.error;
        this.warnings.concat(returnObject.result.warnings);
        return -1;
      }
      currentOffset = returnObject.offset;
      this.blockLength += returnObject.result.blockLength;
      inputLength -= returnObject.result.blockLength;
      this.value.push(returnObject.result);
      if (this.isIndefiniteForm && returnObject.result.constructor.NAME === END_OF_CONTENT_NAME) {
        break;
      }
    }
    if (this.isIndefiniteForm) {
      if (this.value[this.value.length - 1].constructor.NAME === END_OF_CONTENT_NAME) {
        this.value.pop();
      } else {
        this.warnings.push("No EndOfContent block encoded");
      }
    }
    return currentOffset;
  }
  toBER(sizeOnly, writer) {
    const _writer = writer || new ViewWriter();
    for (let i = 0; i < this.value.length; i++) {
      this.value[i].toBER(sizeOnly, _writer);
    }
    if (!writer) {
      return _writer.final();
    }
    return EMPTY_BUFFER;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      value: [],
    };
    for (const value of this.value) {
      object.value.push(value.toJSON());
    }
    return object;
  }
};
__name(LocalConstructedValueBlock, "LocalConstructedValueBlock");
LocalConstructedValueBlock.NAME = "ConstructedValueBlock";
var _a$v;
var Constructed = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalConstructedValueBlock);
    this.idBlock.isConstructed = true;
  }
  fromBER(inputBuffer, inputOffset, inputLength, context2) {
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    const resultOffset = this.valueBlock.fromBER(
      inputBuffer,
      inputOffset,
      this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length,
      context2
    );
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  onAsciiEncoding() {
    const values = [];
    for (const value of this.valueBlock.value) {
      values.push(
        value
          .toString("ascii")
          .split("\n")
          .map((o) => `  ${o}`)
          .join("\n")
      );
    }
    const blockName =
      this.idBlock.tagClass === 3 ? `[${this.idBlock.tagNumber}]` : this.constructor.NAME;
    return values.length
      ? `${blockName} :
${values.join("\n")}`
      : `${blockName} :`;
  }
};
__name(Constructed, "Constructed");
_a$v = Constructed;
(() => {
  typeStore.Constructed = _a$v;
})();
Constructed.NAME = "CONSTRUCTED";
var LocalEndOfContentValueBlock = class extends ValueBlock {
  fromBER(inputBuffer, inputOffset, _inputLength) {
    return inputOffset;
  }
  toBER(_sizeOnly) {
    return EMPTY_BUFFER;
  }
};
__name(LocalEndOfContentValueBlock, "LocalEndOfContentValueBlock");
LocalEndOfContentValueBlock.override = "EndOfContentValueBlock";
var _a$u;
var EndOfContent = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalEndOfContentValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 0;
  }
};
__name(EndOfContent, "EndOfContent");
_a$u = EndOfContent;
(() => {
  typeStore.EndOfContent = _a$u;
})();
EndOfContent.NAME = END_OF_CONTENT_NAME;
var _a$t;
var Null = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, ValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 5;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (this.lenBlock.length > 0)
      this.warnings.push("Non-zero length of value block for Null type");
    if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
    this.blockLength += inputLength;
    if (inputOffset + inputLength > inputBuffer.byteLength) {
      this.error =
        "End of input reached before message was fully decoded (inconsistent offset and length values)";
      return -1;
    }
    return inputOffset + inputLength;
  }
  toBER(sizeOnly, writer) {
    const retBuf = new ArrayBuffer(2);
    if (!sizeOnly) {
      const retView = new Uint8Array(retBuf);
      retView[0] = 5;
      retView[1] = 0;
    }
    if (writer) {
      writer.write(retBuf);
    }
    return retBuf;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME}`;
  }
};
__name(Null, "Null");
_a$t = Null;
(() => {
  typeStore.Null = _a$t;
})();
Null.NAME = "NULL";
var LocalBooleanValueBlock = class extends HexBlock(ValueBlock) {
  get value() {
    for (const octet of this.valueHexView) {
      if (octet > 0) {
        return true;
      }
    }
    return false;
  }
  set value(value) {
    this.valueHexView[0] = value ? 255 : 0;
  }
  constructor({ value, ...parameters } = {}) {
    super(parameters);
    if (parameters.valueHex) {
      this.valueHexView = pvtsutils.BufferSourceConverter.toUint8Array(parameters.valueHex);
    } else {
      this.valueHexView = new Uint8Array(1);
    }
    if (value) {
      this.value = value;
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    this.valueHexView = inputView.subarray(inputOffset, inputOffset + inputLength);
    if (inputLength > 1) this.warnings.push("Boolean value encoded in more then 1 octet");
    this.isHexOnly = true;
    utilDecodeTC.call(this);
    this.blockLength = inputLength;
    return inputOffset + inputLength;
  }
  toBER() {
    return this.valueHexView.slice();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value,
    };
  }
};
__name(LocalBooleanValueBlock, "LocalBooleanValueBlock");
LocalBooleanValueBlock.NAME = "BooleanValueBlock";
var _a$s;
var Boolean = class extends BaseBlock {
  getValue() {
    return this.valueBlock.value;
  }
  setValue(value) {
    this.valueBlock.value = value;
  }
  constructor(parameters = {}) {
    super(parameters, LocalBooleanValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 1;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.getValue}`;
  }
};
__name(Boolean, "Boolean");
_a$s = Boolean;
(() => {
  typeStore.Boolean = _a$s;
})();
Boolean.NAME = "BOOLEAN";
var LocalOctetStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
  constructor({ isConstructed = false, ...parameters } = {}) {
    super(parameters);
    this.isConstructed = isConstructed;
  }
  fromBER(inputBuffer, inputOffset, inputLength, context2) {
    let resultOffset = 0;
    if (this.isConstructed) {
      this.isHexOnly = false;
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(
        this,
        inputBuffer,
        inputOffset,
        inputLength,
        context2
      );
      if (resultOffset === -1) return resultOffset;
      for (let i = 0; i < this.value.length; i++) {
        const currentBlockName = this.value[i].constructor.NAME;
        if (currentBlockName === END_OF_CONTENT_NAME) {
          if (this.isIndefiniteForm) break;
          else {
            this.error =
              "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
            return -1;
          }
        }
        if (currentBlockName !== OCTET_STRING_NAME) {
          this.error = "OCTET STRING may consists of OCTET STRINGs only";
          return -1;
        }
      }
    } else {
      this.isHexOnly = true;
      resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
      this.blockLength = inputLength;
    }
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    if (this.isConstructed)
      return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
    return sizeOnly
      ? new ArrayBuffer(this.valueHexView.byteLength)
      : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isConstructed: this.isConstructed,
    };
  }
};
__name(LocalOctetStringValueBlock, "LocalOctetStringValueBlock");
LocalOctetStringValueBlock.NAME = "OctetStringValueBlock";
var _a$r;
var OctetString = class extends BaseBlock {
  constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
    var _b, _c;
    (_b = parameters.isConstructed) !== null && _b !== void 0
      ? _b
      : (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0
          ? void 0
          : _c.length));
    super(
      {
        idBlock: {
          isConstructed: parameters.isConstructed,
          ...idBlock,
        },
        lenBlock: {
          ...lenBlock,
          isIndefiniteForm: !!parameters.isIndefiniteForm,
        },
        ...parameters,
      },
      LocalOctetStringValueBlock
    );
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 4;
  }
  fromBER(inputBuffer, inputOffset, inputLength, context2) {
    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    if (inputLength === 0) {
      if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
      if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
      return inputOffset;
    }
    if (!this.valueBlock.isConstructed) {
      const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
      const buf = view.subarray(inputOffset, inputOffset + inputLength);
      try {
        if (buf.byteLength) {
          const parseContext =
            context2 !== null && context2 !== void 0 ? context2 : createFromBerContext();
          const asn = localFromBERWithChildContext(buf, 0, buf.byteLength, parseContext);
          if (asn.offset !== -1 && asn.offset === inputLength) {
            this.valueBlock.value = [asn.result];
          }
        }
      } catch {}
    }
    return super.fromBER(inputBuffer, inputOffset, inputLength, context2);
  }
  onAsciiEncoding() {
    if (this.valueBlock.isConstructed || (this.valueBlock.value && this.valueBlock.value.length)) {
      return Constructed.prototype.onAsciiEncoding.call(this);
    }
    const name = this.constructor.NAME;
    const value = pvtsutils.Convert.ToHex(this.valueBlock.valueHexView);
    return `${name} : ${value}`;
  }
  getValue() {
    if (!this.idBlock.isConstructed) {
      return this.valueBlock.valueHexView.slice().buffer;
    }
    const array = [];
    for (const content of this.valueBlock.value) {
      if (content instanceof _a$r) {
        array.push(content.valueBlock.valueHexView);
      }
    }
    return pvtsutils.BufferSourceConverter.concat(array);
  }
};
__name(OctetString, "OctetString");
_a$r = OctetString;
(() => {
  typeStore.OctetString = _a$r;
})();
OctetString.NAME = OCTET_STRING_NAME;
var LocalBitStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
  constructor({ unusedBits = 0, isConstructed = false, ...parameters } = {}) {
    super(parameters);
    this.unusedBits = unusedBits;
    this.isConstructed = isConstructed;
    this.blockLength = this.valueHexView.byteLength;
  }
  fromBER(inputBuffer, inputOffset, inputLength, context2) {
    if (!inputLength) {
      return inputOffset;
    }
    let resultOffset = -1;
    if (this.isConstructed) {
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(
        this,
        inputBuffer,
        inputOffset,
        inputLength,
        context2
      );
      if (resultOffset === -1) return resultOffset;
      for (const value of this.value) {
        const currentBlockName = value.constructor.NAME;
        if (currentBlockName === END_OF_CONTENT_NAME) {
          if (this.isIndefiniteForm) break;
          else {
            this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
            return -1;
          }
        }
        if (currentBlockName !== BIT_STRING_NAME) {
          this.error = "BIT STRING may consists of BIT STRINGs only";
          return -1;
        }
        const valueBlock = value.valueBlock;
        if (this.unusedBits > 0 && valueBlock.unusedBits > 0) {
          this.error =
            'Using of "unused bits" inside constructive BIT STRING allowed for least one only';
          return -1;
        }
        this.unusedBits = valueBlock.unusedBits;
      }
      return resultOffset;
    }
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.unusedBits = intBuffer[0];
    if (this.unusedBits > 7) {
      this.error = "Unused bits for BitString must be in range 0-7";
      return -1;
    }
    if (!this.unusedBits) {
      const buf = intBuffer.subarray(1);
      try {
        if (buf.byteLength) {
          const parseContext =
            context2 !== null && context2 !== void 0 ? context2 : createFromBerContext();
          const asn = localFromBERWithChildContext(buf, 0, buf.byteLength, parseContext);
          if (asn.offset !== -1 && asn.offset === inputLength - 1) {
            this.value = [asn.result];
          }
        }
      } catch {}
    }
    this.valueHexView = intBuffer.subarray(1);
    this.blockLength = intBuffer.length;
    return inputOffset + inputLength;
  }
  toBER(sizeOnly, writer) {
    if (this.isConstructed) {
      return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
    }
    if (sizeOnly) {
      return new ArrayBuffer(this.valueHexView.byteLength + 1);
    }
    if (!this.valueHexView.byteLength) {
      const empty = new Uint8Array(1);
      empty[0] = 0;
      return empty.buffer;
    }
    const retView = new Uint8Array(this.valueHexView.length + 1);
    retView[0] = this.unusedBits;
    retView.set(this.valueHexView, 1);
    return retView.buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      unusedBits: this.unusedBits,
      isConstructed: this.isConstructed,
    };
  }
};
__name(LocalBitStringValueBlock, "LocalBitStringValueBlock");
LocalBitStringValueBlock.NAME = "BitStringValueBlock";
var _a$q;
var BitString = class extends BaseBlock {
  constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
    var _b, _c;
    (_b = parameters.isConstructed) !== null && _b !== void 0
      ? _b
      : (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0
          ? void 0
          : _c.length));
    super(
      {
        idBlock: {
          isConstructed: parameters.isConstructed,
          ...idBlock,
        },
        lenBlock: {
          ...lenBlock,
          isIndefiniteForm: !!parameters.isIndefiniteForm,
        },
        ...parameters,
      },
      LocalBitStringValueBlock
    );
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 3;
  }
  fromBER(inputBuffer, inputOffset, inputLength, context2) {
    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    return super.fromBER(inputBuffer, inputOffset, inputLength, context2);
  }
  onAsciiEncoding() {
    if (this.valueBlock.isConstructed || (this.valueBlock.value && this.valueBlock.value.length)) {
      return Constructed.prototype.onAsciiEncoding.call(this);
    } else {
      const bits = [];
      const valueHex = this.valueBlock.valueHexView;
      for (const byte of valueHex) {
        bits.push(byte.toString(2).padStart(8, "0"));
      }
      const bitsStr = bits.join("");
      const name = this.constructor.NAME;
      const value = bitsStr.substring(0, bitsStr.length - this.valueBlock.unusedBits);
      return `${name} : ${value}`;
    }
  }
};
__name(BitString, "BitString");
_a$q = BitString;
(() => {
  typeStore.BitString = _a$q;
})();
BitString.NAME = BIT_STRING_NAME;
var _a$p;
function viewAdd(first, second) {
  const c = new Uint8Array([0]);
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second);
  let firstViewCopy = firstView.slice(0);
  const firstViewCopyLength = firstViewCopy.length - 1;
  const secondViewCopy = secondView.slice(0);
  const secondViewCopyLength = secondViewCopy.length - 1;
  let value = 0;
  const max =
    secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
  let counter = 0;
  for (let i = max; i >= 0; i--, counter++) {
    switch (true) {
      case counter < secondViewCopy.length:
        value =
          firstViewCopy[firstViewCopyLength - counter] +
          secondViewCopy[secondViewCopyLength - counter] +
          c[0];
        break;
      default:
        value = firstViewCopy[firstViewCopyLength - counter] + c[0];
    }
    c[0] = value / 10;
    switch (true) {
      case counter >= firstViewCopy.length:
        firstViewCopy = utilConcatView(new Uint8Array([value % 10]), firstViewCopy);
        break;
      default:
        firstViewCopy[firstViewCopyLength - counter] = value % 10;
    }
  }
  if (c[0] > 0) firstViewCopy = utilConcatView(c, firstViewCopy);
  return firstViewCopy;
}
__name(viewAdd, "viewAdd");
function power2(n) {
  if (n >= powers2.length) {
    for (let p = powers2.length; p <= n; p++) {
      const c = new Uint8Array([0]);
      let digits = powers2[p - 1].slice(0);
      for (let i = digits.length - 1; i >= 0; i--) {
        const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
        c[0] = newValue[0] / 10;
        digits[i] = newValue[0] % 10;
      }
      if (c[0] > 0) digits = utilConcatView(c, digits);
      powers2.push(digits);
    }
  }
  return powers2[n];
}
__name(power2, "power2");
function viewSub(first, second) {
  let b = 0;
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second);
  const firstViewCopy = firstView.slice(0);
  const firstViewCopyLength = firstViewCopy.length - 1;
  const secondViewCopy = secondView.slice(0);
  const secondViewCopyLength = secondViewCopy.length - 1;
  let value;
  let counter = 0;
  for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
    value =
      firstViewCopy[firstViewCopyLength - counter] -
      secondViewCopy[secondViewCopyLength - counter] -
      b;
    switch (true) {
      case value < 0:
        b = 1;
        firstViewCopy[firstViewCopyLength - counter] = value + 10;
        break;
      default:
        b = 0;
        firstViewCopy[firstViewCopyLength - counter] = value;
    }
  }
  if (b > 0) {
    for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
      value = firstViewCopy[firstViewCopyLength - counter] - b;
      if (value < 0) {
        b = 1;
        firstViewCopy[firstViewCopyLength - counter] = value + 10;
      } else {
        b = 0;
        firstViewCopy[firstViewCopyLength - counter] = value;
        break;
      }
    }
  }
  return firstViewCopy.slice();
}
__name(viewSub, "viewSub");
var LocalIntegerValueBlock = class extends HexBlock(ValueBlock) {
  setValueHex() {
    if (this.valueHexView.length >= 4) {
      this.warnings.push("Too big Integer for decoding, hex only");
      this.isHexOnly = true;
      this._valueDec = 0;
    } else {
      this.isHexOnly = false;
      if (this.valueHexView.length > 0) {
        this._valueDec = utilDecodeTC.call(this);
      }
    }
  }
  constructor({ value, ...parameters } = {}) {
    super(parameters);
    this._valueDec = 0;
    if (parameters.valueHex) {
      this.setValueHex();
    }
    if (value !== void 0) {
      this.valueDec = value;
    }
  }
  set valueDec(v) {
    this._valueDec = v;
    this.isHexOnly = false;
    this.valueHexView = new Uint8Array(utilEncodeTC(v));
  }
  get valueDec() {
    return this._valueDec;
  }
  fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
    const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
    if (offset === -1) return offset;
    const view = this.valueHexView;
    if (view[0] === 0 && (view[1] & 128) !== 0) {
      this.valueHexView = view.subarray(1);
    } else {
      if (expectedLength !== 0) {
        if (view.length < expectedLength) {
          if (expectedLength - view.length > 1) expectedLength = view.length + 1;
          this.valueHexView = view.subarray(expectedLength - view.length);
        }
      }
    }
    return offset;
  }
  toDER(sizeOnly = false) {
    const view = this.valueHexView;
    switch (true) {
      case (view[0] & 128) !== 0:
        {
          const updatedView = new Uint8Array(this.valueHexView.length + 1);
          updatedView[0] = 0;
          updatedView.set(view, 1);
          this.valueHexView = updatedView;
        }
        break;
      case view[0] === 0 && (view[1] & 128) === 0:
        {
          this.valueHexView = this.valueHexView.subarray(1);
        }
        break;
    }
    return this.toBER(sizeOnly);
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
    if (resultOffset === -1) {
      return resultOffset;
    }
    this.setValueHex();
    return resultOffset;
  }
  toBER(sizeOnly) {
    return sizeOnly ? new ArrayBuffer(this.valueHexView.length) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec,
    };
  }
  toString() {
    const firstBit = this.valueHexView.length * 8 - 1;
    let digits = new Uint8Array((this.valueHexView.length * 8) / 3);
    let bitNumber = 0;
    let currentByte;
    const asn1View = this.valueHexView;
    let result = "";
    let flag = false;
    for (let byteNumber = asn1View.byteLength - 1; byteNumber >= 0; byteNumber--) {
      currentByte = asn1View[byteNumber];
      for (let i = 0; i < 8; i++) {
        if ((currentByte & 1) === 1) {
          switch (bitNumber) {
            case firstBit:
              digits = viewSub(power2(bitNumber), digits);
              result = "-";
              break;
            default:
              digits = viewAdd(digits, power2(bitNumber));
          }
        }
        bitNumber++;
        currentByte >>= 1;
      }
    }
    for (let i = 0; i < digits.length; i++) {
      if (digits[i]) flag = true;
      if (flag) result += digitsString.charAt(digits[i]);
    }
    if (flag === false) result += digitsString.charAt(0);
    return result;
  }
};
__name(LocalIntegerValueBlock, "LocalIntegerValueBlock");
_a$p = LocalIntegerValueBlock;
LocalIntegerValueBlock.NAME = "IntegerValueBlock";
(() => {
  Object.defineProperty(_a$p.prototype, "valueHex", {
    set: function (v) {
      this.valueHexView = new Uint8Array(v);
      this.setValueHex();
    },
    get: function () {
      return this.valueHexView.slice().buffer;
    },
  });
})();
var _a$o;
var Integer = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalIntegerValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 2;
  }
  toBigInt() {
    assertBigInt();
    return BigInt(this.valueBlock.toString());
  }
  static fromBigInt(value) {
    assertBigInt();
    const bigIntValue = BigInt(value);
    const writer = new ViewWriter();
    const hex2 = bigIntValue.toString(16).replace(/^-/, "");
    const view = new Uint8Array(pvtsutils.Convert.FromHex(hex2));
    if (bigIntValue < 0) {
      const first = new Uint8Array(view.length + (view[0] & 128 ? 1 : 0));
      first[0] |= 128;
      const firstInt = BigInt(`0x${pvtsutils.Convert.ToHex(first)}`);
      const secondInt = firstInt + bigIntValue;
      const second = pvtsutils.BufferSourceConverter.toUint8Array(
        pvtsutils.Convert.FromHex(secondInt.toString(16))
      );
      second[0] |= 128;
      writer.write(second);
    } else {
      if (view[0] & 128) {
        writer.write(new Uint8Array([0]));
      }
      writer.write(view);
    }
    const res = new _a$o({ valueHex: writer.final() });
    return res;
  }
  convertToDER() {
    const integer = new _a$o({ valueHex: this.valueBlock.valueHexView });
    integer.valueBlock.toDER();
    return integer;
  }
  convertFromDER() {
    return new _a$o({
      valueHex:
        this.valueBlock.valueHexView[0] === 0
          ? this.valueBlock.valueHexView.subarray(1)
          : this.valueBlock.valueHexView,
    });
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
  }
};
__name(Integer, "Integer");
_a$o = Integer;
(() => {
  typeStore.Integer = _a$o;
})();
Integer.NAME = "INTEGER";
var _a$n;
var Enumerated = class extends Integer {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 10;
  }
};
__name(Enumerated, "Enumerated");
_a$n = Enumerated;
(() => {
  typeStore.Enumerated = _a$n;
})();
Enumerated.NAME = "ENUMERATED";
var LocalSidValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ valueDec = -1, isFirstSid = false, ...parameters } = {}) {
    super(parameters);
    this.valueDec = valueDec;
    this.isFirstSid = isFirstSid;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (!inputLength) {
      return inputOffset;
    }
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.valueHexView = new Uint8Array(inputLength);
    for (let i = 0; i < inputLength; i++) {
      this.valueHexView[i] = intBuffer[i] & 127;
      this.blockLength++;
      if ((intBuffer[i] & 128) === 0) break;
    }
    const tempView = new Uint8Array(this.blockLength);
    for (let i = 0; i < this.blockLength; i++) {
      tempView[i] = this.valueHexView[i];
    }
    this.valueHexView = tempView;
    if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    if (this.valueHexView[0] === 0) this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8) this.valueDec = utilFromBase(this.valueHexView, 7);
    else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  }
  set valueBigInt(value) {
    assertBigInt();
    let bits = BigInt(value).toString(2);
    while (bits.length % 7) {
      bits = "0" + bits;
    }
    const bytes = new Uint8Array(bits.length / 7);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(bits.slice(i * 7, i * 7 + 7), 2) + (i + 1 < bytes.length ? 128 : 0);
    }
    this.fromBER(bytes.buffer, 0, bytes.length);
  }
  toBER(sizeOnly) {
    if (this.isHexOnly) {
      if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
      const curView = this.valueHexView;
      const retView2 = new Uint8Array(this.blockLength);
      for (let i = 0; i < this.blockLength - 1; i++) retView2[i] = curView[i] | 128;
      retView2[this.blockLength - 1] = curView[this.blockLength - 1];
      return retView2.buffer;
    }
    const encodedBuf = utilToBase(this.valueDec, 7);
    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(encodedBuf.byteLength);
    if (!sizeOnly) {
      const encodedView = new Uint8Array(encodedBuf);
      const len = encodedBuf.byteLength - 1;
      for (let i = 0; i < len; i++) retView[i] = encodedView[i] | 128;
      retView[len] = encodedView[len];
    }
    return retView;
  }
  toString() {
    let result = "";
    if (this.isHexOnly) result = pvtsutils.Convert.ToHex(this.valueHexView);
    else {
      if (this.isFirstSid) {
        let sidValue = this.valueDec;
        if (this.valueDec <= 39) result = "0.";
        else {
          if (this.valueDec <= 79) {
            result = "1.";
            sidValue -= 40;
          } else {
            result = "2.";
            sidValue -= 80;
          }
        }
        result += sidValue.toString();
      } else result = this.valueDec.toString();
    }
    return result;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec,
      isFirstSid: this.isFirstSid,
    };
  }
};
__name(LocalSidValueBlock, "LocalSidValueBlock");
LocalSidValueBlock.NAME = "sidBlock";
var LocalObjectIdentifierValueBlock = class extends ValueBlock {
  constructor({ value = EMPTY_STRING, ...parameters } = {}) {
    super(parameters);
    this.value = [];
    if (value) {
      this.fromString(value);
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;
    while (inputLength > 0) {
      const sidBlock = new LocalSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }
      if (this.value.length === 0) sidBlock.isFirstSid = true;
      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }
    return resultOffset;
  }
  toBER(sizeOnly) {
    const retBuffers = [];
    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);
      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return EMPTY_BUFFER;
      }
      retBuffers.push(valueBuf);
    }
    return concat(retBuffers);
  }
  fromString(string) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    let flag = false;
    do {
      pos2 = string.indexOf(".", pos1);
      if (pos2 === -1) sid = string.substring(pos1);
      else sid = string.substring(pos1, pos2);
      pos1 = pos2 + 1;
      if (flag) {
        const sidBlock = this.value[0];
        let plus = 0;
        switch (sidBlock.valueDec) {
          case 0:
            break;
          case 1:
            plus = 40;
            break;
          case 2:
            plus = 80;
            break;
          default:
            this.value = [];
            return;
        }
        const parsedSID = parseInt(sid, 10);
        if (isNaN(parsedSID)) return;
        sidBlock.valueDec = parsedSID + plus;
        flag = false;
      } else {
        const sidBlock = new LocalSidValueBlock();
        if (sid > Number.MAX_SAFE_INTEGER) {
          assertBigInt();
          const sidValue = BigInt(sid);
          sidBlock.valueBigInt = sidValue;
        } else {
          sidBlock.valueDec = parseInt(sid, 10);
          if (isNaN(sidBlock.valueDec)) return;
        }
        if (!this.value.length) {
          sidBlock.isFirstSid = true;
          flag = true;
        }
        this.value.push(sidBlock);
      }
    } while (pos2 !== -1);
  }
  toString() {
    let result = "";
    let isHexOnly = false;
    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0) result = `${result}.`;
      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        if (this.value[i].isFirstSid) result = `2.{${sidStr} - 80}`;
        else result += sidStr;
      } else result += sidStr;
    }
    return result;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: [],
    };
    for (let i = 0; i < this.value.length; i++) {
      object.sidArray.push(this.value[i].toJSON());
    }
    return object;
  }
};
__name(LocalObjectIdentifierValueBlock, "LocalObjectIdentifierValueBlock");
LocalObjectIdentifierValueBlock.NAME = "ObjectIdentifierValueBlock";
var _a$m;
var ObjectIdentifier = class extends BaseBlock {
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(value) {
    this.valueBlock.fromString(value);
  }
  constructor(parameters = {}) {
    super(parameters, LocalObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 6;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue(),
    };
  }
};
__name(ObjectIdentifier, "ObjectIdentifier");
_a$m = ObjectIdentifier;
(() => {
  typeStore.ObjectIdentifier = _a$m;
})();
ObjectIdentifier.NAME = "OBJECT IDENTIFIER";
var LocalRelativeSidValueBlock = class extends HexBlock(LocalBaseBlock) {
  constructor({ valueDec = 0, ...parameters } = {}) {
    super(parameters);
    this.valueDec = valueDec;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (inputLength === 0) return inputOffset;
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.valueHexView = new Uint8Array(inputLength);
    for (let i = 0; i < inputLength; i++) {
      this.valueHexView[i] = intBuffer[i] & 127;
      this.blockLength++;
      if ((intBuffer[i] & 128) === 0) break;
    }
    const tempView = new Uint8Array(this.blockLength);
    for (let i = 0; i < this.blockLength; i++) tempView[i] = this.valueHexView[i];
    this.valueHexView = tempView;
    if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    if (this.valueHexView[0] === 0) this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8) this.valueDec = utilFromBase(this.valueHexView, 7);
    else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  }
  toBER(sizeOnly) {
    if (this.isHexOnly) {
      if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
      const curView = this.valueHexView;
      const retView2 = new Uint8Array(this.blockLength);
      for (let i = 0; i < this.blockLength - 1; i++) retView2[i] = curView[i] | 128;
      retView2[this.blockLength - 1] = curView[this.blockLength - 1];
      return retView2.buffer;
    }
    const encodedBuf = utilToBase(this.valueDec, 7);
    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(encodedBuf.byteLength);
    if (!sizeOnly) {
      const encodedView = new Uint8Array(encodedBuf);
      const len = encodedBuf.byteLength - 1;
      for (let i = 0; i < len; i++) retView[i] = encodedView[i] | 128;
      retView[len] = encodedView[len];
    }
    return retView.buffer;
  }
  toString() {
    let result = "";
    if (this.isHexOnly) result = pvtsutils.Convert.ToHex(this.valueHexView);
    else {
      result = this.valueDec.toString();
    }
    return result;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec,
    };
  }
};
__name(LocalRelativeSidValueBlock, "LocalRelativeSidValueBlock");
LocalRelativeSidValueBlock.NAME = "relativeSidBlock";
var LocalRelativeObjectIdentifierValueBlock = class extends ValueBlock {
  constructor({ value = EMPTY_STRING, ...parameters } = {}) {
    super(parameters);
    this.value = [];
    if (value) {
      this.fromString(value);
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;
    while (inputLength > 0) {
      const sidBlock = new LocalRelativeSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }
      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }
    return resultOffset;
  }
  toBER(sizeOnly, _writer) {
    const retBuffers = [];
    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);
      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return EMPTY_BUFFER;
      }
      retBuffers.push(valueBuf);
    }
    return concat(retBuffers);
  }
  fromString(string) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    do {
      pos2 = string.indexOf(".", pos1);
      if (pos2 === -1) sid = string.substring(pos1);
      else sid = string.substring(pos1, pos2);
      pos1 = pos2 + 1;
      const sidBlock = new LocalRelativeSidValueBlock();
      sidBlock.valueDec = parseInt(sid, 10);
      if (isNaN(sidBlock.valueDec)) return true;
      this.value.push(sidBlock);
    } while (pos2 !== -1);
    return true;
  }
  toString() {
    let result = "";
    let isHexOnly = false;
    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0) result = `${result}.`;
      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        result += sidStr;
      } else result += sidStr;
    }
    return result;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: [],
    };
    for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());
    return object;
  }
};
__name(LocalRelativeObjectIdentifierValueBlock, "LocalRelativeObjectIdentifierValueBlock");
LocalRelativeObjectIdentifierValueBlock.NAME = "RelativeObjectIdentifierValueBlock";
var _a$l;
var RelativeObjectIdentifier = class extends BaseBlock {
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(value) {
    this.valueBlock.fromString(value);
  }
  constructor(parameters = {}) {
    super(parameters, LocalRelativeObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 13;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue(),
    };
  }
};
__name(RelativeObjectIdentifier, "RelativeObjectIdentifier");
_a$l = RelativeObjectIdentifier;
(() => {
  typeStore.RelativeObjectIdentifier = _a$l;
})();
RelativeObjectIdentifier.NAME = "RelativeObjectIdentifier";
var _a$k;
var Sequence = class extends Constructed {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 16;
  }
};
__name(Sequence, "Sequence");
_a$k = Sequence;
(() => {
  typeStore.Sequence = _a$k;
})();
Sequence.NAME = "SEQUENCE";
var _a$j;
var Set2 = class extends Constructed {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 17;
  }
};
__name(Set2, "Set");
_a$j = Set2;
(() => {
  typeStore.Set = _a$j;
})();
Set2.NAME = "SET";
var LocalStringValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.isHexOnly = true;
    this.value = EMPTY_STRING;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value,
    };
  }
};
__name(LocalStringValueBlock, "LocalStringValueBlock");
LocalStringValueBlock.NAME = "StringValueBlock";
var LocalSimpleStringValueBlock = class extends LocalStringValueBlock {};
__name(LocalSimpleStringValueBlock, "LocalSimpleStringValueBlock");
LocalSimpleStringValueBlock.NAME = "SimpleStringValueBlock";
var LocalSimpleStringBlock = class extends BaseStringBlock {
  constructor({ ...parameters } = {}) {
    super(parameters, LocalSimpleStringValueBlock);
  }
  fromBuffer(inputBuffer) {
    this.valueBlock.value = String.fromCharCode.apply(
      null,
      pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer)
    );
  }
  fromString(inputString) {
    const strLen = inputString.length;
    const view = (this.valueBlock.valueHexView = new Uint8Array(strLen));
    for (let i = 0; i < strLen; i++) view[i] = inputString.charCodeAt(i);
    this.valueBlock.value = inputString;
  }
};
__name(LocalSimpleStringBlock, "LocalSimpleStringBlock");
LocalSimpleStringBlock.NAME = "SIMPLE STRING";
var LocalUtf8StringValueBlock = class extends LocalSimpleStringBlock {
  fromBuffer(inputBuffer) {
    this.valueBlock.valueHexView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    try {
      this.valueBlock.value = pvtsutils.Convert.ToUtf8String(inputBuffer);
    } catch (ex) {
      this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
      this.valueBlock.value = pvtsutils.Convert.ToBinary(inputBuffer);
    }
  }
  fromString(inputString) {
    this.valueBlock.valueHexView = new Uint8Array(pvtsutils.Convert.FromUtf8String(inputString));
    this.valueBlock.value = inputString;
  }
};
__name(LocalUtf8StringValueBlock, "LocalUtf8StringValueBlock");
LocalUtf8StringValueBlock.NAME = "Utf8StringValueBlock";
var _a$i;
var Utf8String = class extends LocalUtf8StringValueBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 12;
  }
};
__name(Utf8String, "Utf8String");
_a$i = Utf8String;
(() => {
  typeStore.Utf8String = _a$i;
})();
Utf8String.NAME = "UTF8String";
var LocalBmpStringValueBlock = class extends LocalSimpleStringBlock {
  fromBuffer(inputBuffer) {
    this.valueBlock.value = pvtsutils.Convert.ToUtf16String(inputBuffer);
    this.valueBlock.valueHexView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
  }
  fromString(inputString) {
    this.valueBlock.value = inputString;
    this.valueBlock.valueHexView = new Uint8Array(pvtsutils.Convert.FromUtf16String(inputString));
  }
};
__name(LocalBmpStringValueBlock, "LocalBmpStringValueBlock");
LocalBmpStringValueBlock.NAME = "BmpStringValueBlock";
var _a$h;
var BmpString = class extends LocalBmpStringValueBlock {
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 30;
  }
};
__name(BmpString, "BmpString");
_a$h = BmpString;
(() => {
  typeStore.BmpString = _a$h;
})();
BmpString.NAME = "BMPString";
var LocalUniversalStringValueBlock = class extends LocalSimpleStringBlock {
  fromBuffer(inputBuffer) {
    const copyBuffer = ArrayBuffer.isView(inputBuffer)
      ? inputBuffer.slice().buffer
      : inputBuffer.slice(0);
    const valueView = new Uint8Array(copyBuffer);
    for (let i = 0; i < valueView.length; i += 4) {
      valueView[i] = valueView[i + 3];
      valueView[i + 1] = valueView[i + 2];
      valueView[i + 2] = 0;
      valueView[i + 3] = 0;
    }
    this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
  }
  fromString(inputString) {
    const strLength = inputString.length;
    const valueHexView = (this.valueBlock.valueHexView = new Uint8Array(strLength * 4));
    for (let i = 0; i < strLength; i++) {
      const codeBuf = utilToBase(inputString.charCodeAt(i), 8);
      const codeView = new Uint8Array(codeBuf);
      if (codeView.length > 4) continue;
      const dif = 4 - codeView.length;
      for (let j = codeView.length - 1; j >= 0; j--) valueHexView[i * 4 + j + dif] = codeView[j];
    }
    this.valueBlock.value = inputString;
  }
};
__name(LocalUniversalStringValueBlock, "LocalUniversalStringValueBlock");
LocalUniversalStringValueBlock.NAME = "UniversalStringValueBlock";
var _a$g;
var UniversalString = class extends LocalUniversalStringValueBlock {
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 28;
  }
};
__name(UniversalString, "UniversalString");
_a$g = UniversalString;
(() => {
  typeStore.UniversalString = _a$g;
})();
UniversalString.NAME = "UniversalString";
var _a$f;
var NumericString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 18;
  }
};
__name(NumericString, "NumericString");
_a$f = NumericString;
(() => {
  typeStore.NumericString = _a$f;
})();
NumericString.NAME = "NumericString";
var _a$e;
var PrintableString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 19;
  }
};
__name(PrintableString, "PrintableString");
_a$e = PrintableString;
(() => {
  typeStore.PrintableString = _a$e;
})();
PrintableString.NAME = "PrintableString";
var _a$d;
var TeletexString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 20;
  }
};
__name(TeletexString, "TeletexString");
_a$d = TeletexString;
(() => {
  typeStore.TeletexString = _a$d;
})();
TeletexString.NAME = "TeletexString";
var _a$c;
var VideotexString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 21;
  }
};
__name(VideotexString, "VideotexString");
_a$c = VideotexString;
(() => {
  typeStore.VideotexString = _a$c;
})();
VideotexString.NAME = "VideotexString";
var _a$b;
var IA5String = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 22;
  }
};
__name(IA5String, "IA5String");
_a$b = IA5String;
(() => {
  typeStore.IA5String = _a$b;
})();
IA5String.NAME = "IA5String";
var _a$a;
var GraphicString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 25;
  }
};
__name(GraphicString, "GraphicString");
_a$a = GraphicString;
(() => {
  typeStore.GraphicString = _a$a;
})();
GraphicString.NAME = "GraphicString";
var _a$9;
var VisibleString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 26;
  }
};
__name(VisibleString, "VisibleString");
_a$9 = VisibleString;
(() => {
  typeStore.VisibleString = _a$9;
})();
VisibleString.NAME = "VisibleString";
var _a$8;
var GeneralString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 27;
  }
};
__name(GeneralString, "GeneralString");
_a$8 = GeneralString;
(() => {
  typeStore.GeneralString = _a$8;
})();
GeneralString.NAME = "GeneralString";
var _a$7;
var CharacterString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 29;
  }
};
__name(CharacterString, "CharacterString");
_a$7 = CharacterString;
(() => {
  typeStore.CharacterString = _a$7;
})();
CharacterString.NAME = "CharacterString";
var _a$6;
var UTCTime = class extends VisibleString {
  constructor({ value, valueDate, ...parameters } = {}) {
    super(parameters);
    this.year = 0;
    this.month = 0;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    if (value) {
      this.fromString(value);
      this.valueBlock.valueHexView = new Uint8Array(value.length);
      for (let i = 0; i < value.length; i++) this.valueBlock.valueHexView[i] = value.charCodeAt(i);
    }
    if (valueDate) {
      this.fromDate(valueDate);
      this.valueBlock.valueHexView = new Uint8Array(this.toBuffer());
    }
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 23;
  }
  fromBuffer(inputBuffer) {
    this.fromString(
      String.fromCharCode.apply(null, pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer))
    );
  }
  toBuffer() {
    const str = this.toString();
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);
    return buffer;
  }
  fromDate(inputDate) {
    this.year = inputDate.getUTCFullYear();
    this.month = inputDate.getUTCMonth() + 1;
    this.day = inputDate.getUTCDate();
    this.hour = inputDate.getUTCHours();
    this.minute = inputDate.getUTCMinutes();
    this.second = inputDate.getUTCSeconds();
  }
  toDate() {
    return new Date(
      Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second)
    );
  }
  fromString(inputString) {
    const parser = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/gi;
    const parserArray = parser.exec(inputString);
    if (parserArray === null) {
      this.error = "Wrong input string for conversion";
      return;
    }
    const year = parseInt(parserArray[1], 10);
    if (year >= 50) this.year = 1900 + year;
    else this.year = 2e3 + year;
    this.month = parseInt(parserArray[2], 10);
    this.day = parseInt(parserArray[3], 10);
    this.hour = parseInt(parserArray[4], 10);
    this.minute = parseInt(parserArray[5], 10);
    this.second = parseInt(parserArray[6], 10);
  }
  toString(encoding = "iso") {
    if (encoding === "iso") {
      const outputArray = new Array(7);
      outputArray[0] = padNumber(this.year < 2e3 ? this.year - 1900 : this.year - 2e3, 2);
      outputArray[1] = padNumber(this.month, 2);
      outputArray[2] = padNumber(this.day, 2);
      outputArray[3] = padNumber(this.hour, 2);
      outputArray[4] = padNumber(this.minute, 2);
      outputArray[5] = padNumber(this.second, 2);
      outputArray[6] = "Z";
      return outputArray.join("");
    }
    return super.toString(encoding);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
    };
  }
};
__name(UTCTime, "UTCTime");
_a$6 = UTCTime;
(() => {
  typeStore.UTCTime = _a$6;
})();
UTCTime.NAME = "UTCTime";
var _a$5;
var GeneralizedTime = class extends UTCTime {
  constructor(parameters = {}) {
    var _b;
    super(parameters);
    (_b = this.millisecond) !== null && _b !== void 0 ? _b : (this.millisecond = 0);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 24;
  }
  fromDate(inputDate) {
    super.fromDate(inputDate);
    this.millisecond = inputDate.getUTCMilliseconds();
  }
  toDate() {
    const utcDate = Date.UTC(
      this.year,
      this.month - 1,
      this.day,
      this.hour,
      this.minute,
      this.second,
      this.millisecond
    );
    return new Date(utcDate);
  }
  fromString(inputString) {
    let isUTC = false;
    let timeString = "";
    let dateTimeString = "";
    let fractionPart = 0;
    let parser;
    let hourDifference = 0;
    let minuteDifference = 0;
    if (inputString[inputString.length - 1] === "Z") {
      timeString = inputString.substring(0, inputString.length - 1);
      isUTC = true;
    } else {
      const number = new Number(inputString[inputString.length - 1]);
      if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
      timeString = inputString;
    }
    if (isUTC) {
      if (timeString.indexOf("+") !== -1) throw new Error("Wrong input string for conversion");
      if (timeString.indexOf("-") !== -1) throw new Error("Wrong input string for conversion");
    } else {
      let multiplier = 1;
      let differencePosition = timeString.indexOf("+");
      let differenceString = "";
      if (differencePosition === -1) {
        differencePosition = timeString.indexOf("-");
        multiplier = -1;
      }
      if (differencePosition !== -1) {
        differenceString = timeString.substring(differencePosition + 1);
        timeString = timeString.substring(0, differencePosition);
        if (differenceString.length !== 2 && differenceString.length !== 4)
          throw new Error("Wrong input string for conversion");
        let number = parseInt(differenceString.substring(0, 2), 10);
        if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
        hourDifference = multiplier * number;
        if (differenceString.length === 4) {
          number = parseInt(differenceString.substring(2, 4), 10);
          if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
          minuteDifference = multiplier * number;
        }
      }
    }
    let fractionPointPosition = timeString.indexOf(".");
    if (fractionPointPosition === -1) fractionPointPosition = timeString.indexOf(",");
    if (fractionPointPosition !== -1) {
      const fractionPartCheck = new Number(`0${timeString.substring(fractionPointPosition)}`);
      if (isNaN(fractionPartCheck.valueOf())) throw new Error("Wrong input string for conversion");
      fractionPart = fractionPartCheck.valueOf();
      dateTimeString = timeString.substring(0, fractionPointPosition);
    } else dateTimeString = timeString;
    switch (true) {
      case dateTimeString.length === 8:
        parser = /(\d{4})(\d{2})(\d{2})/gi;
        if (fractionPointPosition !== -1) throw new Error("Wrong input string for conversion");
        break;
      case dateTimeString.length === 10:
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})/gi;
        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.minute = Math.floor(fractionResult);
          fractionResult = 60 * (fractionResult - this.minute);
          this.second = Math.floor(fractionResult);
          fractionResult = 1e3 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      case dateTimeString.length === 12:
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/gi;
        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.second = Math.floor(fractionResult);
          fractionResult = 1e3 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      case dateTimeString.length === 14:
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/gi;
        if (fractionPointPosition !== -1) {
          const fractionResult = 1e3 * fractionPart;
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      default:
        throw new Error("Wrong input string for conversion");
    }
    const parserArray = parser.exec(dateTimeString);
    if (parserArray === null) throw new Error("Wrong input string for conversion");
    for (let j = 1; j < parserArray.length; j++) {
      switch (j) {
        case 1:
          this.year = parseInt(parserArray[j], 10);
          break;
        case 2:
          this.month = parseInt(parserArray[j], 10);
          break;
        case 3:
          this.day = parseInt(parserArray[j], 10);
          break;
        case 4:
          this.hour = parseInt(parserArray[j], 10) + hourDifference;
          break;
        case 5:
          this.minute = parseInt(parserArray[j], 10) + minuteDifference;
          break;
        case 6:
          this.second = parseInt(parserArray[j], 10);
          break;
        default:
          throw new Error("Wrong input string for conversion");
      }
    }
    if (isUTC === false) {
      const tempDate = new Date(
        this.year,
        this.month,
        this.day,
        this.hour,
        this.minute,
        this.second,
        this.millisecond
      );
      this.year = tempDate.getUTCFullYear();
      this.month = tempDate.getUTCMonth();
      this.day = tempDate.getUTCDay();
      this.hour = tempDate.getUTCHours();
      this.minute = tempDate.getUTCMinutes();
      this.second = tempDate.getUTCSeconds();
      this.millisecond = tempDate.getUTCMilliseconds();
    }
  }
  toString(encoding = "iso") {
    if (encoding === "iso") {
      const outputArray = [];
      outputArray.push(padNumber(this.year, 4));
      outputArray.push(padNumber(this.month, 2));
      outputArray.push(padNumber(this.day, 2));
      outputArray.push(padNumber(this.hour, 2));
      outputArray.push(padNumber(this.minute, 2));
      outputArray.push(padNumber(this.second, 2));
      if (this.millisecond !== 0) {
        outputArray.push(".");
        outputArray.push(padNumber(this.millisecond, 3));
      }
      outputArray.push("Z");
      return outputArray.join("");
    }
    return super.toString(encoding);
  }
  toJSON() {
    return {
      ...super.toJSON(),
      millisecond: this.millisecond,
    };
  }
};
__name(GeneralizedTime, "GeneralizedTime");
_a$5 = GeneralizedTime;
(() => {
  typeStore.GeneralizedTime = _a$5;
})();
GeneralizedTime.NAME = "GeneralizedTime";
var _a$4;
var DATE = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 31;
  }
};
__name(DATE, "DATE");
_a$4 = DATE;
(() => {
  typeStore.DATE = _a$4;
})();
DATE.NAME = "DATE";
var _a$3;
var TimeOfDay = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 32;
  }
};
__name(TimeOfDay, "TimeOfDay");
_a$3 = TimeOfDay;
(() => {
  typeStore.TimeOfDay = _a$3;
})();
TimeOfDay.NAME = "TimeOfDay";
var _a$2;
var DateTime = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 33;
  }
};
__name(DateTime, "DateTime");
_a$2 = DateTime;
(() => {
  typeStore.DateTime = _a$2;
})();
DateTime.NAME = "DateTime";
var _a$1;
var Duration = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 34;
  }
};
__name(Duration, "Duration");
_a$1 = Duration;
(() => {
  typeStore.Duration = _a$1;
})();
Duration.NAME = "Duration";
var _a;
var TIME = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 14;
  }
};
__name(TIME, "TIME");
_a = TIME;
(() => {
  typeStore.TIME = _a;
})();
TIME.NAME = "TIME";
var Any = class {
  constructor({ name = EMPTY_STRING, optional = false } = {}) {
    this.name = name;
    this.optional = optional;
  }
};
__name(Any, "Any");
var Choice = class extends Any {
  constructor({ value = [], ...parameters } = {}) {
    super(parameters);
    this.value = value;
  }
};
__name(Choice, "Choice");
var Repeated = class extends Any {
  constructor({ value = new Any(), local = false, ...parameters } = {}) {
    super(parameters);
    this.value = value;
    this.local = local;
  }
};
__name(Repeated, "Repeated");
var RawData = class {
  get data() {
    return this.dataView.slice().buffer;
  }
  set data(value) {
    this.dataView = pvtsutils.BufferSourceConverter.toUint8Array(value);
  }
  constructor({ data = EMPTY_VIEW } = {}) {
    this.dataView = pvtsutils.BufferSourceConverter.toUint8Array(data);
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const endLength = inputOffset + inputLength;
    this.dataView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer).subarray(
      inputOffset,
      endLength
    );
    return endLength;
  }
  toBER(_sizeOnly) {
    return this.dataView.slice().buffer;
  }
};
__name(RawData, "RawData");
function compareSchema(root, inputData, inputSchema) {
  if (inputSchema instanceof Choice) {
    for (const element of inputSchema.value) {
      const result = compareSchema(root, inputData, element);
      if (result.verified) {
        return {
          verified: true,
          result: root,
        };
      }
    }
    {
      const _result = {
        verified: false,
        result: { error: "Wrong values for Choice type" },
      };
      if (inputSchema.hasOwnProperty(NAME)) _result.name = inputSchema.name;
      return _result;
    }
  }
  if (inputSchema instanceof Any) {
    if (inputSchema.hasOwnProperty(NAME)) root[inputSchema.name] = inputData;
    return {
      verified: true,
      result: root,
    };
  }
  if (root instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong root object" },
    };
  }
  if (inputData instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 data" },
    };
  }
  if (inputSchema instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" },
    };
  }
  if (ID_BLOCK in inputSchema === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" },
    };
  }
  if (FROM_BER in inputSchema.idBlock === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" },
    };
  }
  if (TO_BER in inputSchema.idBlock === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" },
    };
  }
  const encodedId = inputSchema.idBlock.toBER(false);
  if (encodedId.byteLength === 0) {
    return {
      verified: false,
      result: { error: "Error encoding idBlock for ASN.1 schema" },
    };
  }
  const decodedOffset = inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength);
  if (decodedOffset === -1) {
    return {
      verified: false,
      result: { error: "Error decoding idBlock for ASN.1 schema" },
    };
  }
  if (inputSchema.idBlock.hasOwnProperty(TAG_CLASS) === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" },
    };
  }
  if (inputSchema.idBlock.tagClass !== inputData.idBlock.tagClass) {
    return {
      verified: false,
      result: root,
    };
  }
  if (inputSchema.idBlock.hasOwnProperty(TAG_NUMBER) === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" },
    };
  }
  if (inputSchema.idBlock.tagNumber !== inputData.idBlock.tagNumber) {
    return {
      verified: false,
      result: root,
    };
  }
  if (inputSchema.idBlock.hasOwnProperty(IS_CONSTRUCTED) === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" },
    };
  }
  if (inputSchema.idBlock.isConstructed !== inputData.idBlock.isConstructed) {
    return {
      verified: false,
      result: root,
    };
  }
  if (!(IS_HEX_ONLY in inputSchema.idBlock)) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" },
    };
  }
  if (inputSchema.idBlock.isHexOnly !== inputData.idBlock.isHexOnly) {
    return {
      verified: false,
      result: root,
    };
  }
  if (inputSchema.idBlock.isHexOnly) {
    if (VALUE_HEX_VIEW in inputSchema.idBlock === false) {
      return {
        verified: false,
        result: { error: "Wrong ASN.1 schema" },
      };
    }
    const schemaView = inputSchema.idBlock.valueHexView;
    const asn1View = inputData.idBlock.valueHexView;
    if (schemaView.length !== asn1View.length) {
      return {
        verified: false,
        result: root,
      };
    }
    for (let i = 0; i < schemaView.length; i++) {
      if (schemaView[i] !== asn1View[1]) {
        return {
          verified: false,
          result: root,
        };
      }
    }
  }
  if (inputSchema.name) {
    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
    if (inputSchema.name) root[inputSchema.name] = inputData;
  }
  if (inputSchema instanceof typeStore.Constructed) {
    let admission = 0;
    let result = {
      verified: false,
      result: { error: "Unknown error" },
    };
    let maxLength = inputSchema.valueBlock.value.length;
    if (maxLength > 0) {
      if (inputSchema.valueBlock.value[0] instanceof Repeated) {
        maxLength = inputData.valueBlock.value.length;
      }
    }
    if (maxLength === 0) {
      return {
        verified: true,
        result: root,
      };
    }
    if (inputData.valueBlock.value.length === 0 && inputSchema.valueBlock.value.length !== 0) {
      let _optional = true;
      for (let i = 0; i < inputSchema.valueBlock.value.length; i++)
        _optional = _optional && (inputSchema.valueBlock.value[i].optional || false);
      if (_optional) {
        return {
          verified: true,
          result: root,
        };
      }
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name) delete root[inputSchema.name];
      }
      root.error = "Inconsistent object length";
      return {
        verified: false,
        result: root,
      };
    }
    for (let i = 0; i < maxLength; i++) {
      if (i - admission >= inputData.valueBlock.value.length) {
        if (inputSchema.valueBlock.value[i].optional === false) {
          const _result = {
            verified: false,
            result: root,
          };
          root.error = "Inconsistent length between ASN.1 data and schema";
          if (inputSchema.name) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
            if (inputSchema.name) {
              delete root[inputSchema.name];
              _result.name = inputSchema.name;
            }
          }
          return _result;
        }
      } else {
        if (inputSchema.valueBlock.value[0] instanceof Repeated) {
          result = compareSchema(
            root,
            inputData.valueBlock.value[i],
            inputSchema.valueBlock.value[0].value
          );
          if (result.verified === false) {
            if (inputSchema.valueBlock.value[0].optional) admission++;
            else {
              if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name) delete root[inputSchema.name];
              }
              return result;
            }
          }
          if (
            NAME in inputSchema.valueBlock.value[0] &&
            inputSchema.valueBlock.value[0].name.length > 0
          ) {
            let arrayRoot = {};
            if (LOCAL in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].local)
              arrayRoot = inputData;
            else arrayRoot = root;
            if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined")
              arrayRoot[inputSchema.valueBlock.value[0].name] = [];
            arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[i]);
          }
        } else {
          result = compareSchema(
            root,
            inputData.valueBlock.value[i - admission],
            inputSchema.valueBlock.value[i]
          );
          if (result.verified === false) {
            if (inputSchema.valueBlock.value[i].optional) admission++;
            else {
              if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name) delete root[inputSchema.name];
              }
              return result;
            }
          }
        }
      }
    }
    if (result.verified === false) {
      const _result = {
        verified: false,
        result: root,
      };
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name) {
          delete root[inputSchema.name];
          _result.name = inputSchema.name;
        }
      }
      return _result;
    }
    return {
      verified: true,
      result: root,
    };
  }
  if (inputSchema.primitiveSchema && VALUE_HEX_VIEW in inputData.valueBlock) {
    const asn1 = localFromBER(inputData.valueBlock.valueHexView);
    if (asn1.offset === -1) {
      const _result = {
        verified: false,
        result: asn1.result,
      };
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name) {
          delete root[inputSchema.name];
          _result.name = inputSchema.name;
        }
      }
      return _result;
    }
    return compareSchema(root, asn1.result, inputSchema.primitiveSchema);
  }
  return {
    verified: true,
    result: root,
  };
}
__name(compareSchema, "compareSchema");
function verifySchema(inputBuffer, inputSchema) {
  if (inputSchema instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema type" },
    };
  }
  const asn1 = localFromBER(pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer));
  if (asn1.offset === -1) {
    return {
      verified: false,
      result: asn1.result,
    };
  }
  return compareSchema(asn1.result, asn1.result, inputSchema);
}
__name(verifySchema, "verifySchema");

// node_modules/@peculiar/utils/build/esm/bytes/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/utils/build/esm/bytes/buffer-source.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ARRAY_BUFFER_TAG = "[object ArrayBuffer]";
var SHARED_ARRAY_BUFFER_TAG = "[object SharedArrayBuffer]";
function tagOf(value) {
  return Object.prototype.toString.call(value);
}
__name(tagOf, "tagOf");
function isArrayBufferViewLike(value) {
  if (ArrayBuffer.isView(value)) {
    return true;
  }
  if (!value || typeof value !== "object") {
    return false;
  }
  const view = value;
  return (
    typeof view.byteOffset === "number" &&
    typeof view.byteLength === "number" &&
    isArrayBufferLike(view.buffer)
  );
}
__name(isArrayBufferViewLike, "isArrayBufferViewLike");
function isArrayBuffer(value) {
  return tagOf(value) === ARRAY_BUFFER_TAG;
}
__name(isArrayBuffer, "isArrayBuffer");
function isSharedArrayBuffer(value) {
  return typeof SharedArrayBuffer !== "undefined" && tagOf(value) === SHARED_ARRAY_BUFFER_TAG;
}
__name(isSharedArrayBuffer, "isSharedArrayBuffer");
function isArrayBufferLike(value) {
  return isArrayBuffer(value) || isSharedArrayBuffer(value);
}
__name(isArrayBufferLike, "isArrayBufferLike");
function isArrayBufferView(value) {
  return isArrayBufferViewLike(value);
}
__name(isArrayBufferView, "isArrayBufferView");
function isBufferSource(value) {
  return isArrayBufferLike(value) || isArrayBufferView(value);
}
__name(isBufferSource, "isBufferSource");
function assertBufferSource(value) {
  if (!isBufferSource(value)) {
    throw new TypeError("Expected ArrayBuffer, SharedArrayBuffer, or ArrayBufferView");
  }
}
__name(assertBufferSource, "assertBufferSource");
function toUint8Array(data) {
  assertBufferSource(data);
  if (isArrayBufferLike(data)) {
    return new Uint8Array(data);
  }
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}
__name(toUint8Array, "toUint8Array");
function toArrayBuffer(data) {
  assertBufferSource(data);
  if (isArrayBuffer(data)) {
    return data;
  }
  const buffer = new ArrayBuffer(data.byteLength);
  new Uint8Array(buffer).set(toUint8Array(data));
  return buffer;
}
__name(toArrayBuffer, "toArrayBuffer");

// node_modules/@peculiar/utils/build/esm/bytes/concat.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/utils/build/esm/bytes/equal.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function equal(a, b, options = {}) {
  const left = toUint8Array(a);
  const right = toUint8Array(b);
  if (!options.constantTime && left.byteLength !== right.byteLength) {
    return false;
  }
  const length = Math.max(left.byteLength, right.byteLength);
  let diff = left.byteLength ^ right.byteLength;
  for (let i = 0; i < length; i++) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}
__name(equal, "equal");

// node_modules/@peculiar/utils/build/esm/bytes/sequence.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-schema/build/es2015/enums.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AsnTypeTypes;
(function (AsnTypeTypes2) {
  AsnTypeTypes2[(AsnTypeTypes2["Sequence"] = 0)] = "Sequence";
  AsnTypeTypes2[(AsnTypeTypes2["Set"] = 1)] = "Set";
  AsnTypeTypes2[(AsnTypeTypes2["Choice"] = 2)] = "Choice";
})(AsnTypeTypes || (AsnTypeTypes = {}));
var AsnPropTypes;
(function (AsnPropTypes2) {
  AsnPropTypes2[(AsnPropTypes2["Any"] = 1)] = "Any";
  AsnPropTypes2[(AsnPropTypes2["Boolean"] = 2)] = "Boolean";
  AsnPropTypes2[(AsnPropTypes2["OctetString"] = 3)] = "OctetString";
  AsnPropTypes2[(AsnPropTypes2["BitString"] = 4)] = "BitString";
  AsnPropTypes2[(AsnPropTypes2["Integer"] = 5)] = "Integer";
  AsnPropTypes2[(AsnPropTypes2["Enumerated"] = 6)] = "Enumerated";
  AsnPropTypes2[(AsnPropTypes2["ObjectIdentifier"] = 7)] = "ObjectIdentifier";
  AsnPropTypes2[(AsnPropTypes2["Utf8String"] = 8)] = "Utf8String";
  AsnPropTypes2[(AsnPropTypes2["BmpString"] = 9)] = "BmpString";
  AsnPropTypes2[(AsnPropTypes2["UniversalString"] = 10)] = "UniversalString";
  AsnPropTypes2[(AsnPropTypes2["NumericString"] = 11)] = "NumericString";
  AsnPropTypes2[(AsnPropTypes2["PrintableString"] = 12)] = "PrintableString";
  AsnPropTypes2[(AsnPropTypes2["TeletexString"] = 13)] = "TeletexString";
  AsnPropTypes2[(AsnPropTypes2["VideotexString"] = 14)] = "VideotexString";
  AsnPropTypes2[(AsnPropTypes2["IA5String"] = 15)] = "IA5String";
  AsnPropTypes2[(AsnPropTypes2["GraphicString"] = 16)] = "GraphicString";
  AsnPropTypes2[(AsnPropTypes2["VisibleString"] = 17)] = "VisibleString";
  AsnPropTypes2[(AsnPropTypes2["GeneralString"] = 18)] = "GeneralString";
  AsnPropTypes2[(AsnPropTypes2["CharacterString"] = 19)] = "CharacterString";
  AsnPropTypes2[(AsnPropTypes2["UTCTime"] = 20)] = "UTCTime";
  AsnPropTypes2[(AsnPropTypes2["GeneralizedTime"] = 21)] = "GeneralizedTime";
  AsnPropTypes2[(AsnPropTypes2["DATE"] = 22)] = "DATE";
  AsnPropTypes2[(AsnPropTypes2["TimeOfDay"] = 23)] = "TimeOfDay";
  AsnPropTypes2[(AsnPropTypes2["DateTime"] = 24)] = "DateTime";
  AsnPropTypes2[(AsnPropTypes2["Duration"] = 25)] = "Duration";
  AsnPropTypes2[(AsnPropTypes2["TIME"] = 26)] = "TIME";
  AsnPropTypes2[(AsnPropTypes2["Null"] = 27)] = "Null";
})(AsnPropTypes || (AsnPropTypes = {}));

// node_modules/@peculiar/asn1-schema/build/es2015/types/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-schema/build/es2015/types/bit_string.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var BitString2 = class {
  unusedBits = 0;
  value = new ArrayBuffer(0);
  constructor(params, unusedBits = 0) {
    if (params) {
      if (typeof params === "number") {
        this.fromNumber(params);
      } else if (isBufferSource(params)) {
        this.unusedBits = unusedBits;
        this.value = toArrayBuffer(params);
      } else {
        throw TypeError("Unsupported type of 'params' argument for BitString");
      }
    }
  }
  fromASN(asn) {
    if (!(asn instanceof BitString)) {
      throw new TypeError("Argument 'asn' is not instance of ASN.1 BitString");
    }
    this.unusedBits = asn.valueBlock.unusedBits;
    this.value = toArrayBuffer(asn.valueBlock.valueHex);
    return this;
  }
  toASN() {
    return new BitString({
      unusedBits: this.unusedBits,
      valueHex: this.value,
    });
  }
  toSchema(name) {
    return new BitString({ name });
  }
  toNumber() {
    let res = "";
    const uintArray = new Uint8Array(this.value);
    for (const octet of uintArray) {
      res += octet.toString(2).padStart(8, "0");
    }
    res = res.split("").reverse().join("");
    if (this.unusedBits) {
      res = res.slice(this.unusedBits).padStart(this.unusedBits, "0");
    }
    return parseInt(res, 2);
  }
  fromNumber(value) {
    let bits = value.toString(2);
    const octetSize = (bits.length + 7) >> 3;
    this.unusedBits = (octetSize << 3) - bits.length;
    const octets = new Uint8Array(octetSize);
    bits = bits
      .padStart(octetSize << 3, "0")
      .split("")
      .reverse()
      .join("");
    let index = 0;
    while (index < octetSize) {
      octets[index] = parseInt(bits.slice(index << 3, (index << 3) + 8), 2);
      index++;
    }
    this.value = octets.buffer;
  }
};
__name(BitString2, "BitString");

// node_modules/@peculiar/asn1-schema/build/es2015/types/octet_string.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var OctetString2 = class {
  buffer;
  get byteLength() {
    return this.buffer.byteLength;
  }
  get byteOffset() {
    return 0;
  }
  constructor(param) {
    if (typeof param === "number") {
      this.buffer = new ArrayBuffer(param);
    } else {
      if (isBufferSource(param)) {
        this.buffer = toArrayBuffer(param);
      } else if (Array.isArray(param)) {
        this.buffer = new Uint8Array(param).buffer;
      } else {
        this.buffer = new ArrayBuffer(0);
      }
    }
  }
  fromASN(asn) {
    if (!(asn instanceof OctetString)) {
      throw new TypeError("Argument 'asn' is not instance of ASN.1 OctetString");
    }
    this.buffer = toArrayBuffer(asn.valueBlock.valueHex);
    return this;
  }
  toASN() {
    return new OctetString({ valueHex: this.buffer });
  }
  toSchema(name) {
    return new OctetString({ name });
  }
};
__name(OctetString2, "OctetString");

// node_modules/@peculiar/asn1-schema/build/es2015/converters.js
var AsnAnyConverter = {
  fromASN: (value) => (value instanceof Null ? null : toArrayBuffer(value.valueBeforeDecodeView)),
  toASN: (value) => {
    if (value === null) {
      return new Null();
    }
    const schema = fromBER(value);
    if (schema.result.error) {
      throw new Error(schema.result.error);
    }
    return schema.result;
  },
};
var AsnIntegerConverter = {
  fromASN: (value) =>
    value.valueBlock.valueHexView.byteLength >= 4
      ? value.valueBlock.toString()
      : value.valueBlock.valueDec,
  toASN: (value) => new Integer({ value: +value }),
};
var AsnEnumeratedConverter = {
  fromASN: (value) => value.valueBlock.valueDec,
  toASN: (value) => new Enumerated({ value }),
};
var AsnIntegerArrayBufferConverter = {
  fromASN: (value) => toArrayBuffer(value.valueBlock.valueHexView),
  toASN: (value) => new Integer({ valueHex: value }),
};
var AsnBitStringConverter = {
  fromASN: (value) => toArrayBuffer(value.valueBlock.valueHexView),
  toASN: (value) => new BitString({ valueHex: value }),
};
var AsnObjectIdentifierConverter = {
  fromASN: (value) => value.valueBlock.toString(),
  toASN: (value) => new ObjectIdentifier({ value }),
};
var AsnBooleanConverter = {
  fromASN: (value) => value.valueBlock.value,
  toASN: (value) => new Boolean({ value }),
};
var AsnOctetStringConverter = {
  fromASN: (value) => toArrayBuffer(value.valueBlock.valueHexView),
  toASN: (value) => new OctetString({ valueHex: value }),
};
var AsnConstructedOctetStringConverter = {
  fromASN: (value) => new OctetString2(value.getValue()),
  toASN: (value) => value.toASN(),
};
function createStringConverter(Asn1Type) {
  return {
    fromASN: (value) => value.valueBlock.value,
    toASN: (value) => new Asn1Type({ value }),
  };
}
__name(createStringConverter, "createStringConverter");
var AsnUtf8StringConverter = createStringConverter(Utf8String);
var AsnBmpStringConverter = createStringConverter(BmpString);
var AsnUniversalStringConverter = createStringConverter(UniversalString);
var AsnNumericStringConverter = createStringConverter(NumericString);
var AsnPrintableStringConverter = createStringConverter(PrintableString);
var AsnTeletexStringConverter = createStringConverter(TeletexString);
var AsnVideotexStringConverter = createStringConverter(VideotexString);
var AsnIA5StringConverter = createStringConverter(IA5String);
var AsnGraphicStringConverter = createStringConverter(GraphicString);
var AsnVisibleStringConverter = createStringConverter(VisibleString);
var AsnGeneralStringConverter = createStringConverter(GeneralString);
var AsnCharacterStringConverter = createStringConverter(CharacterString);
var AsnUTCTimeConverter = {
  fromASN: (value) => value.toDate(),
  toASN: (value) => new UTCTime({ valueDate: value }),
};
var AsnGeneralizedTimeConverter = {
  fromASN: (value) => value.toDate(),
  toASN: (value) => new GeneralizedTime({ valueDate: value }),
};
var AsnNullConverter = {
  fromASN: () => null,
  toASN: () => {
    return new Null();
  },
};
function defaultConverter(type) {
  switch (type) {
    case AsnPropTypes.Any:
      return AsnAnyConverter;
    case AsnPropTypes.BitString:
      return AsnBitStringConverter;
    case AsnPropTypes.BmpString:
      return AsnBmpStringConverter;
    case AsnPropTypes.Boolean:
      return AsnBooleanConverter;
    case AsnPropTypes.CharacterString:
      return AsnCharacterStringConverter;
    case AsnPropTypes.Enumerated:
      return AsnEnumeratedConverter;
    case AsnPropTypes.GeneralString:
      return AsnGeneralStringConverter;
    case AsnPropTypes.GeneralizedTime:
      return AsnGeneralizedTimeConverter;
    case AsnPropTypes.GraphicString:
      return AsnGraphicStringConverter;
    case AsnPropTypes.IA5String:
      return AsnIA5StringConverter;
    case AsnPropTypes.Integer:
      return AsnIntegerConverter;
    case AsnPropTypes.Null:
      return AsnNullConverter;
    case AsnPropTypes.NumericString:
      return AsnNumericStringConverter;
    case AsnPropTypes.ObjectIdentifier:
      return AsnObjectIdentifierConverter;
    case AsnPropTypes.OctetString:
      return AsnOctetStringConverter;
    case AsnPropTypes.PrintableString:
      return AsnPrintableStringConverter;
    case AsnPropTypes.TeletexString:
      return AsnTeletexStringConverter;
    case AsnPropTypes.UTCTime:
      return AsnUTCTimeConverter;
    case AsnPropTypes.UniversalString:
      return AsnUniversalStringConverter;
    case AsnPropTypes.Utf8String:
      return AsnUtf8StringConverter;
    case AsnPropTypes.VideotexString:
      return AsnVideotexStringConverter;
    case AsnPropTypes.VisibleString:
      return AsnVisibleStringConverter;
    default:
      return null;
  }
}
__name(defaultConverter, "defaultConverter");

// node_modules/@peculiar/asn1-schema/build/es2015/decorators.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-schema/build/es2015/storage.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-schema/build/es2015/schema.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-schema/build/es2015/helper.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isConvertible(target) {
  if (typeof target === "function" && target.prototype) {
    if (target.prototype.toASN && target.prototype.fromASN) {
      return true;
    } else {
      return isConvertible(target.prototype);
    }
  } else {
    return !!(target && typeof target === "object" && "toASN" in target && "fromASN" in target);
  }
}
__name(isConvertible, "isConvertible");
function isTypeOfArray(target) {
  if (target) {
    const proto = Object.getPrototypeOf(target);
    if (proto?.prototype?.constructor === Array) {
      return true;
    }
    return isTypeOfArray(proto);
  }
  return false;
}
__name(isTypeOfArray, "isTypeOfArray");
function isArrayEqual(bytes1, bytes2) {
  if (!(bytes1 && bytes2)) {
    return false;
  }
  if (bytes1.byteLength !== bytes2.byteLength) {
    return false;
  }
  const b1 = new Uint8Array(bytes1);
  const b2 = new Uint8Array(bytes2);
  for (let i = 0; i < bytes1.byteLength; i++) {
    if (b1[i] !== b2[i]) {
      return false;
    }
  }
  return true;
}
__name(isArrayEqual, "isArrayEqual");

// node_modules/@peculiar/asn1-schema/build/es2015/schema.js
var AsnSchemaStorage = class {
  items = /* @__PURE__ */ new WeakMap();
  has(target) {
    return this.items.has(target);
  }
  get(target, checkSchema = false) {
    const schema = this.items.get(target);
    if (!schema) {
      throw new Error(`Cannot get schema for '${target.prototype.constructor.name}' target`);
    }
    if (checkSchema && !schema.schema) {
      throw new Error(
        `Schema '${target.prototype.constructor.name}' doesn't contain ASN.1 schema. Call 'AsnSchemaStorage.cache'.`
      );
    }
    return schema;
  }
  cache(target) {
    const schema = this.get(target);
    if (!schema.schema) {
      schema.schema = this.create(target, true);
    }
  }
  createDefault(target) {
    const schema = {
      type: AsnTypeTypes.Sequence,
      items: {},
    };
    const parentSchema = this.findParentSchema(target);
    if (parentSchema) {
      Object.assign(schema, parentSchema);
      schema.items = Object.assign({}, schema.items, parentSchema.items);
    }
    return schema;
  }
  create(target, useNames) {
    const schema = this.items.get(target) || this.createDefault(target);
    const asn1Value = [];
    for (const key in schema.items) {
      const item = schema.items[key];
      const name = useNames ? key : "";
      let asn1Item;
      if (typeof item.type === "number") {
        const Asn1TypeName = AsnPropTypes[item.type];
        const Asn1Type = index_es_exports[Asn1TypeName];
        if (!Asn1Type) {
          throw new Error(`Cannot get ASN1 class by name '${Asn1TypeName}'`);
        }
        asn1Item = new Asn1Type({ name });
      } else if (isConvertible(item.type)) {
        const instance2 = new item.type();
        asn1Item = instance2.toSchema(name);
      } else if (item.optional) {
        const itemSchema = this.get(item.type);
        if (itemSchema.type === AsnTypeTypes.Choice) {
          asn1Item = new Any({ name });
        } else {
          asn1Item = this.create(item.type, false);
          asn1Item.name = name;
        }
      } else {
        asn1Item = new Any({ name });
      }
      const optional = !!item.optional || item.defaultValue !== void 0;
      if (item.repeated) {
        asn1Item.name = "";
        const Container = item.repeated === "set" ? Set2 : Sequence;
        asn1Item = new Container({
          name: "",
          value: [
            new Repeated({
              name,
              value: asn1Item,
            }),
          ],
        });
      }
      if (item.context !== null && item.context !== void 0) {
        if (item.implicit) {
          if (typeof item.type === "number" || isConvertible(item.type)) {
            const Container = item.repeated ? Constructed : Primitive;
            asn1Value.push(
              new Container({
                name,
                optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: item.context,
                },
              })
            );
          } else {
            this.cache(item.type);
            const isRepeated = !!item.repeated;
            let value = !isRepeated ? this.get(item.type, true).schema : asn1Item;
            value = "valueBlock" in value ? value.valueBlock.value : value.value;
            asn1Value.push(
              new Constructed({
                name: !isRepeated ? name : "",
                optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: item.context,
                },
                value,
              })
            );
          }
        } else {
          asn1Value.push(
            new Constructed({
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context,
              },
              value: [asn1Item],
            })
          );
        }
      } else {
        asn1Item.optional = optional;
        asn1Value.push(asn1Item);
      }
    }
    switch (schema.type) {
      case AsnTypeTypes.Sequence:
        return new Sequence({
          value: asn1Value,
          name: "",
        });
      case AsnTypeTypes.Set:
        return new Set2({
          value: asn1Value,
          name: "",
        });
      case AsnTypeTypes.Choice:
        return new Choice({
          value: asn1Value,
          name: "",
        });
      default:
        throw new Error("Unsupported ASN1 type in use");
    }
  }
  set(target, schema) {
    this.items.set(target, schema);
    return this;
  }
  findParentSchema(target) {
    const parent = Object.getPrototypeOf(target);
    if (parent) {
      const schema = this.items.get(parent);
      return schema || this.findParentSchema(parent);
    }
    return null;
  }
};
__name(AsnSchemaStorage, "AsnSchemaStorage");

// node_modules/@peculiar/asn1-schema/build/es2015/storage.js
var schemaStorage = new AsnSchemaStorage();

// node_modules/@peculiar/asn1-schema/build/es2015/decorators.js
var AsnType = /* @__PURE__ */ __name(
  (options) => (target) => {
    let schema;
    if (!schemaStorage.has(target)) {
      schema = schemaStorage.createDefault(target);
      schemaStorage.set(target, schema);
    } else {
      schema = schemaStorage.get(target);
    }
    Object.assign(schema, options);
  },
  "AsnType"
);
var AsnProp = /* @__PURE__ */ __name(
  (options) => (target, propertyKey) => {
    let schema;
    if (!schemaStorage.has(target.constructor)) {
      schema = schemaStorage.createDefault(target.constructor);
      schemaStorage.set(target.constructor, schema);
    } else {
      schema = schemaStorage.get(target.constructor);
    }
    const copyOptions = Object.assign({}, options);
    if (typeof copyOptions.type === "number" && !copyOptions.converter) {
      const defaultConverter2 = defaultConverter(options.type);
      if (!defaultConverter2) {
        throw new Error(
          `Cannot get default converter for property '${propertyKey}' of ${target.constructor.name}`
        );
      }
      copyOptions.converter = defaultConverter2;
    }
    copyOptions.raw = options.raw;
    schema.items[propertyKey] = copyOptions;
  },
  "AsnProp"
);

// node_modules/@peculiar/asn1-schema/build/es2015/parser.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-schema/build/es2015/errors/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-schema/build/es2015/errors/schema_validation.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AsnSchemaValidationError = class extends Error {
  schemas = [];
};
__name(AsnSchemaValidationError, "AsnSchemaValidationError");

// node_modules/@peculiar/asn1-schema/build/es2015/parser.js
var AsnParser = class {
  static parse(data, target) {
    const asn1Parsed = fromBER(toArrayBuffer(data));
    if (asn1Parsed.result.error) {
      throw new Error(asn1Parsed.result.error);
    }
    const res = this.fromASN(asn1Parsed.result, target);
    return res;
  }
  static fromASN(asn1Schema, target) {
    try {
      if (isConvertible(target)) {
        const value = new target();
        return value.fromASN(asn1Schema);
      }
      const schema = schemaStorage.get(target);
      schemaStorage.cache(target);
      let targetSchema = schema.schema;
      const choiceResult = this.handleChoiceTypes(asn1Schema, schema, target, targetSchema);
      if (choiceResult?.result) {
        return choiceResult.result;
      }
      if (choiceResult?.targetSchema) {
        targetSchema = choiceResult.targetSchema;
      }
      const sequenceResult = this.handleSequenceTypes(asn1Schema, schema, target, targetSchema);
      const res = new target();
      if (isTypeOfArray(target)) {
        return this.handleArrayTypes(asn1Schema, schema, target);
      }
      this.processSchemaItems(schema, sequenceResult, res);
      return res;
    } catch (error3) {
      if (error3 instanceof AsnSchemaValidationError) {
        error3.schemas.push(target.name);
      }
      throw error3;
    }
  }
  static handleChoiceTypes(asn1Schema, schema, target, targetSchema) {
    if (
      asn1Schema.constructor === Constructed &&
      schema.type === AsnTypeTypes.Choice &&
      asn1Schema.idBlock.tagClass === 3
    ) {
      for (const key in schema.items) {
        const schemaItem = schema.items[key];
        if (schemaItem.context === asn1Schema.idBlock.tagNumber && schemaItem.implicit) {
          if (typeof schemaItem.type === "function" && schemaStorage.has(schemaItem.type)) {
            const fieldSchema = schemaStorage.get(schemaItem.type);
            if (fieldSchema && fieldSchema.type === AsnTypeTypes.Sequence) {
              const newSeq = new Sequence();
              if (
                "value" in asn1Schema.valueBlock &&
                Array.isArray(asn1Schema.valueBlock.value) &&
                "value" in newSeq.valueBlock
              ) {
                newSeq.valueBlock.value = asn1Schema.valueBlock.value;
                const fieldValue = this.fromASN(newSeq, schemaItem.type);
                const res = new target();
                res[key] = fieldValue;
                return { result: res };
              }
            }
          }
        }
      }
    } else if (asn1Schema.constructor === Constructed && schema.type !== AsnTypeTypes.Choice) {
      const newTargetSchema = new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: asn1Schema.idBlock.tagNumber,
        },
        value: schema.schema.valueBlock.value,
      });
      for (const key in schema.items) {
        delete asn1Schema[key];
      }
      return { targetSchema: newTargetSchema };
    }
    return null;
  }
  static handleSequenceTypes(asn1Schema, schema, target, targetSchema) {
    if (schema.type === AsnTypeTypes.Sequence) {
      const asn1ComparedSchema = compareSchema({}, asn1Schema, targetSchema);
      if (!asn1ComparedSchema.verified) {
        throw new AsnSchemaValidationError(
          `Data does not match to ${target.name} ASN1 schema.${asn1ComparedSchema.result.error ? ` ${asn1ComparedSchema.result.error}` : ""}`
        );
      }
      return asn1ComparedSchema;
    } else {
      const asn1ComparedSchema = compareSchema({}, asn1Schema, targetSchema);
      if (!asn1ComparedSchema.verified) {
        throw new AsnSchemaValidationError(
          `Data does not match to ${target.name} ASN1 schema.${asn1ComparedSchema.result.error ? ` ${asn1ComparedSchema.result.error}` : ""}`
        );
      }
      return asn1ComparedSchema;
    }
  }
  static processRepeatedField(asn1Elements, asn1Index, schemaItem) {
    let elementsToProcess = asn1Elements.slice(asn1Index);
    if (elementsToProcess.length === 1 && elementsToProcess[0].constructor.name === "Sequence") {
      const seq = elementsToProcess[0];
      if (seq.valueBlock && seq.valueBlock.value && Array.isArray(seq.valueBlock.value)) {
        elementsToProcess = seq.valueBlock.value;
      }
    }
    if (typeof schemaItem.type === "number") {
      const converter = defaultConverter(schemaItem.type);
      if (!converter) throw new Error(`No converter for ASN.1 type ${schemaItem.type}`);
      return elementsToProcess
        .filter((el) => el && el.valueBlock)
        .map((el) => {
          try {
            return converter.fromASN(el);
          } catch {
            return void 0;
          }
        })
        .filter((v) => v !== void 0);
    } else {
      return elementsToProcess
        .filter((el) => el && el.valueBlock)
        .map((el) => {
          try {
            return this.fromASN(el, schemaItem.type);
          } catch {
            return void 0;
          }
        })
        .filter((v) => v !== void 0);
    }
  }
  static processPrimitiveField(asn1Element, schemaItem) {
    const converter = defaultConverter(schemaItem.type);
    if (!converter) throw new Error(`No converter for ASN.1 type ${schemaItem.type}`);
    return converter.fromASN(asn1Element);
  }
  static isOptionalChoiceField(schemaItem) {
    return (
      schemaItem.optional &&
      typeof schemaItem.type === "function" &&
      schemaStorage.has(schemaItem.type) &&
      schemaStorage.get(schemaItem.type).type === AsnTypeTypes.Choice
    );
  }
  static processOptionalChoiceField(asn1Element, schemaItem) {
    try {
      const value = this.fromASN(asn1Element, schemaItem.type);
      return {
        processed: true,
        value,
      };
    } catch (err) {
      if (
        err instanceof AsnSchemaValidationError &&
        /Wrong values for Choice type/.test(err.message)
      ) {
        return { processed: false };
      }
      throw err;
    }
  }
  static handleArrayTypes(asn1Schema, schema, target) {
    if (!("value" in asn1Schema.valueBlock && Array.isArray(asn1Schema.valueBlock.value))) {
      throw new Error(
        "Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed."
      );
    }
    const itemType = schema.itemType;
    if (typeof itemType === "number") {
      const converter = defaultConverter(itemType);
      if (!converter) {
        throw new Error(
          `Cannot get default converter for array item of ${target.name} ASN1 schema`
        );
      }
      return target.from(asn1Schema.valueBlock.value, (element) => converter.fromASN(element));
    } else {
      return target.from(asn1Schema.valueBlock.value, (element) => this.fromASN(element, itemType));
    }
  }
  static processSchemaItems(schema, asn1ComparedSchema, res) {
    for (const key in schema.items) {
      const asn1SchemaValue = asn1ComparedSchema.result[key];
      if (!asn1SchemaValue) {
        continue;
      }
      const schemaItem = schema.items[key];
      const schemaItemType = schemaItem.type;
      let parsedValue;
      if (typeof schemaItemType === "number" || isConvertible(schemaItemType)) {
        parsedValue = this.processPrimitiveSchemaItem(asn1SchemaValue, schemaItem, schemaItemType);
      } else {
        parsedValue = this.processComplexSchemaItem(asn1SchemaValue, schemaItem, schemaItemType);
      }
      if (
        parsedValue &&
        typeof parsedValue === "object" &&
        "value" in parsedValue &&
        "raw" in parsedValue
      ) {
        res[key] = parsedValue.value;
        res[`${key}Raw`] = parsedValue.raw;
      } else {
        res[key] = parsedValue;
      }
    }
  }
  static processPrimitiveSchemaItem(asn1SchemaValue, schemaItem, schemaItemType) {
    const converter =
      schemaItem.converter ?? (isConvertible(schemaItemType) ? new schemaItemType() : null);
    if (!converter) {
      throw new Error("Converter is empty");
    }
    if (schemaItem.repeated) {
      return this.processRepeatedPrimitiveItem(asn1SchemaValue, schemaItem, converter);
    } else {
      return this.processSinglePrimitiveItem(
        asn1SchemaValue,
        schemaItem,
        schemaItemType,
        converter
      );
    }
  }
  static processRepeatedPrimitiveItem(asn1SchemaValue, schemaItem, converter) {
    if (schemaItem.implicit) {
      const Container = schemaItem.repeated === "sequence" ? Sequence : Set2;
      const newItem = new Container();
      newItem.valueBlock = asn1SchemaValue.valueBlock;
      const newItemAsn = fromBER(newItem.toBER(false));
      if (newItemAsn.offset === -1) {
        throw new Error(`Cannot parse the child item. ${newItemAsn.result.error}`);
      }
      if (
        !(
          "value" in newItemAsn.result.valueBlock &&
          Array.isArray(newItemAsn.result.valueBlock.value)
        )
      ) {
        throw new Error(
          "Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed."
        );
      }
      const value = newItemAsn.result.valueBlock.value;
      return Array.from(value, (element) => converter.fromASN(element));
    } else {
      return Array.from(asn1SchemaValue, (element) => converter.fromASN(element));
    }
  }
  static processSinglePrimitiveItem(asn1SchemaValue, schemaItem, schemaItemType, converter) {
    let value = asn1SchemaValue;
    if (schemaItem.implicit) {
      let newItem;
      if (isConvertible(schemaItemType)) {
        newItem = new schemaItemType().toSchema("");
      } else {
        const Asn1TypeName = AsnPropTypes[schemaItemType];
        const Asn1Type = index_es_exports[Asn1TypeName];
        if (!Asn1Type) {
          throw new Error(`Cannot get '${Asn1TypeName}' class from asn1js module`);
        }
        newItem = new Asn1Type();
      }
      newItem.valueBlock = value.valueBlock;
      value = fromBER(newItem.toBER(false)).result;
    }
    return converter.fromASN(value);
  }
  static processComplexSchemaItem(asn1SchemaValue, schemaItem, schemaItemType) {
    if (schemaItem.repeated) {
      if (!Array.isArray(asn1SchemaValue)) {
        throw new Error(
          "Cannot get list of items from the ASN.1 parsed value. ASN.1 value should be iterable."
        );
      }
      return Array.from(asn1SchemaValue, (element) => this.fromASN(element, schemaItemType));
    } else {
      const valueToProcess = this.handleImplicitTagging(
        asn1SchemaValue,
        schemaItem,
        schemaItemType
      );
      if (this.isOptionalChoiceField(schemaItem)) {
        try {
          return this.fromASN(valueToProcess, schemaItemType);
        } catch (err) {
          if (
            err instanceof AsnSchemaValidationError &&
            /Wrong values for Choice type/.test(err.message)
          ) {
            return void 0;
          }
          throw err;
        }
      } else {
        const parsedValue = this.fromASN(valueToProcess, schemaItemType);
        if (schemaItem.raw) {
          return {
            value: parsedValue,
            raw: asn1SchemaValue.valueBeforeDecodeView,
          };
        }
        return parsedValue;
      }
    }
  }
  static handleImplicitTagging(asn1SchemaValue, schemaItem, schemaItemType) {
    if (schemaItem.implicit && typeof schemaItem.context === "number") {
      const schema = schemaStorage.get(schemaItemType);
      if (schema.type === AsnTypeTypes.Sequence) {
        const newSeq = new Sequence();
        if (
          "value" in asn1SchemaValue.valueBlock &&
          Array.isArray(asn1SchemaValue.valueBlock.value) &&
          "value" in newSeq.valueBlock
        ) {
          newSeq.valueBlock.value = asn1SchemaValue.valueBlock.value;
          return newSeq;
        }
      } else if (schema.type === AsnTypeTypes.Set) {
        const newSet = new Set2();
        if (
          "value" in asn1SchemaValue.valueBlock &&
          Array.isArray(asn1SchemaValue.valueBlock.value) &&
          "value" in newSet.valueBlock
        ) {
          newSet.valueBlock.value = asn1SchemaValue.valueBlock.value;
          return newSet;
        }
      }
    }
    return asn1SchemaValue;
  }
};
__name(AsnParser, "AsnParser");

// node_modules/@peculiar/asn1-schema/build/es2015/serializer.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AsnSerializer = class {
  static serialize(obj) {
    if (obj instanceof BaseBlock) {
      return obj.toBER(false);
    }
    return this.toASN(obj).toBER(false);
  }
  static toASN(obj) {
    if (obj && typeof obj === "object" && isConvertible(obj)) {
      return obj.toASN();
    }
    if (!(obj && typeof obj === "object")) {
      throw new TypeError("Parameter 1 should be type of Object.");
    }
    const target = obj.constructor;
    const schema = schemaStorage.get(target);
    schemaStorage.cache(target);
    let asn1Value = [];
    if (schema.itemType) {
      if (!Array.isArray(obj)) {
        throw new TypeError("Parameter 1 should be type of Array.");
      }
      if (typeof schema.itemType === "number") {
        const converter = defaultConverter(schema.itemType);
        if (!converter) {
          throw new Error(
            `Cannot get default converter for array item of ${target.name} ASN1 schema`
          );
        }
        asn1Value = obj.map((o) => converter.toASN(o));
      } else {
        asn1Value = obj.map((o) => this.toAsnItem({ type: schema.itemType }, "[]", target, o));
      }
    } else {
      for (const key in schema.items) {
        const schemaItem = schema.items[key];
        const objProp = obj[key];
        if (
          objProp === void 0 ||
          schemaItem.defaultValue === objProp ||
          (typeof schemaItem.defaultValue === "object" &&
            typeof objProp === "object" &&
            isArrayEqual(this.serialize(schemaItem.defaultValue), this.serialize(objProp)))
        ) {
          continue;
        }
        const asn1Item = AsnSerializer.toAsnItem(schemaItem, key, target, objProp);
        if (typeof schemaItem.context === "number") {
          if (schemaItem.implicit) {
            if (
              !schemaItem.repeated &&
              (typeof schemaItem.type === "number" || isConvertible(schemaItem.type))
            ) {
              const value = {};
              value.valueHex =
                asn1Item instanceof Null
                  ? toArrayBuffer(asn1Item.valueBeforeDecodeView)
                  : asn1Item.valueBlock.toBER();
              asn1Value.push(
                new Primitive({
                  optional: schemaItem.optional,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: schemaItem.context,
                  },
                  ...value,
                })
              );
            } else {
              asn1Value.push(
                new Constructed({
                  optional: schemaItem.optional,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: schemaItem.context,
                  },
                  value: asn1Item.valueBlock.value,
                })
              );
            }
          } else {
            asn1Value.push(
              new Constructed({
                optional: schemaItem.optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: schemaItem.context,
                },
                value: [asn1Item],
              })
            );
          }
        } else if (schemaItem.repeated) {
          asn1Value = asn1Value.concat(asn1Item);
        } else {
          asn1Value.push(asn1Item);
        }
      }
    }
    let asnSchema;
    switch (schema.type) {
      case AsnTypeTypes.Sequence:
        asnSchema = new Sequence({ value: asn1Value });
        break;
      case AsnTypeTypes.Set:
        asnSchema = new Set2({ value: asn1Value });
        break;
      case AsnTypeTypes.Choice:
        if (!asn1Value[0]) {
          throw new Error(`Schema '${target.name}' has wrong data. Choice cannot be empty.`);
        }
        asnSchema = asn1Value[0];
        break;
    }
    return asnSchema;
  }
  static toAsnItem(schemaItem, key, target, objProp) {
    let asn1Item;
    if (typeof schemaItem.type === "number") {
      const converter = schemaItem.converter;
      if (!converter) {
        throw new Error(
          `Property '${key}' doesn't have converter for type ${AsnPropTypes[schemaItem.type]} in schema '${target.name}'`
        );
      }
      if (schemaItem.repeated) {
        if (!Array.isArray(objProp)) {
          throw new TypeError("Parameter 'objProp' should be type of Array.");
        }
        const items = Array.from(objProp, (element) => converter.toASN(element));
        const Container = schemaItem.repeated === "sequence" ? Sequence : Set2;
        asn1Item = new Container({ value: items });
      } else {
        asn1Item = converter.toASN(objProp);
      }
    } else {
      if (schemaItem.repeated) {
        if (!Array.isArray(objProp)) {
          throw new TypeError("Parameter 'objProp' should be type of Array.");
        }
        const items = Array.from(objProp, (element) => this.toASN(element));
        const Container = schemaItem.repeated === "sequence" ? Sequence : Set2;
        asn1Item = new Container({ value: items });
      } else {
        asn1Item = this.toASN(objProp);
      }
    }
    return asn1Item;
  }
};
__name(AsnSerializer, "AsnSerializer");

// node_modules/@peculiar/asn1-schema/build/es2015/objects.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AsnArray = class extends Array {
  constructor(items = []) {
    if (typeof items === "number") {
      super(items);
    } else {
      super();
      for (const item of items) {
        this.push(item);
      }
    }
  }
};
__name(AsnArray, "AsnArray");

// node_modules/@peculiar/asn1-schema/build/es2015/convert.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AsnConvert = class {
  static serialize(obj) {
    return AsnSerializer.serialize(obj);
  }
  static parse(data, target) {
    return AsnParser.parse(data, target);
  }
  static toString(data) {
    const buf = isBufferSource(data) ? toArrayBuffer(data) : AsnConvert.serialize(data);
    const asn = fromBER(buf);
    if (asn.offset === -1) {
      throw new Error(`Cannot decode ASN.1 data. ${asn.result.error}`);
    }
    return asn.result.toString();
  }
};
__name(AsnConvert, "AsnConvert");

// node_modules/@peculiar/asn1-x509/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/authority_information_access.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tslib/tslib.es6.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
    r =
      c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return (c > 3 && r && Object.defineProperty(target, key, r), r);
}
__name(__decorate, "__decorate");
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
__name(__classPrivateFieldGet, "__classPrivateFieldGet");
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (
    kind === "a" ? f.call(receiver, value) : f ? (f.value = value) : state.set(receiver, value),
    value
  );
}
__name(__classPrivateFieldSet, "__classPrivateFieldSet");

// node_modules/@peculiar/asn1-x509/build/es2015/general_name.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/ip_converter.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/utils/build/esm/encoding/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/utils/build/esm/encoding/binary.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/utils/build/esm/encoding/hex.js
var hex_exports = {};
__export(hex_exports, {
  decode: () => decode,
  encode: () => encode2,
  format: () => format,
  formats: () => formats,
  hex: () => hex,
  is: () => is,
  normalize: () => normalize,
  parse: () => parse,
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HEX_CHARACTER_REGEX = /^[0-9a-f]$/i;
var COMMON_SEPARATORS = [" ", "	", "\n", "\r", ":", "-", "."];
function resolveSeparators(options) {
  if (options.separators === "none") {
    return [];
  }
  if (!options.separators || options.separators === "common") {
    return COMMON_SEPARATORS;
  }
  return options.separators;
}
__name(resolveSeparators, "resolveSeparators");
function validateSeparator(separator) {
  if (!separator) {
    throw new TypeError("Hex separators must be non-empty strings");
  }
}
__name(validateSeparator, "validateSeparator");
function matchSeparator(text, index, separators) {
  for (const separator of separators) {
    if (text.startsWith(separator, index)) {
      return separator;
    }
  }
  return void 0;
}
__name(matchSeparator, "matchSeparator");
function detectCase(text) {
  const hasUpper = /[A-F]/.test(text);
  const hasLower = /[a-f]/.test(text);
  return hasUpper && !hasLower ? "upper" : "lower";
}
__name(detectCase, "detectCase");
function detectLineSeparator(text) {
  const match = /\r\n|\n/.exec(text);
  if (!match) {
    return void 0;
  }
  return match[0] === "\r\n" ? "\r\n" : "\n";
}
__name(detectLineSeparator, "detectLineSeparator");
function compactForDetection(text) {
  return text.replace(/[^0-9a-f]/gi, "");
}
__name(compactForDetection, "compactForDetection");
function detectGroup(text) {
  const segments = text.match(/[0-9A-Fa-f]+|[^0-9A-Fa-f]+/g) ?? [];
  if (segments.length < 3) {
    return void 0;
  }
  const hexSegments = segments.filter((_, index) => index % 2 === 0);
  const separators = segments.filter((_, index) => index % 2 === 1);
  const separator = separators[0];
  if (!separator || separators.some((item) => item !== separator)) {
    return void 0;
  }
  if (hexSegments.some((segment) => segment.length === 0 || segment.length % 2 !== 0)) {
    return void 0;
  }
  const firstLength = hexSegments[0]?.length ?? 0;
  if (!firstLength) {
    return void 0;
  }
  if (hexSegments.slice(0, -1).some((segment) => segment.length !== firstLength)) {
    return void 0;
  }
  if ((hexSegments[hexSegments.length - 1]?.length ?? 0) > firstLength) {
    return void 0;
  }
  return {
    size: firstLength / 2,
    separator,
  };
}
__name(detectGroup, "detectGroup");
function detectFormat(text) {
  const trimmed = text.trim();
  const prefix = /^0x/i.test(trimmed) ? "0x" : "";
  const body = prefix ? trimmed.slice(2) : trimmed;
  const lineSeparator = detectLineSeparator(body);
  const lines = body.split(/\r\n|\n/).filter((line) => line.length > 0);
  const sampleLine = lines[0]?.trim() ?? "";
  const group3 = detectGroup(sampleLine);
  const format2 = {
    case: detectCase(trimmed),
    prefix,
  };
  if (group3) {
    format2.group = group3;
  }
  if (lineSeparator && lines.length > 1) {
    const firstLineBytes = compactForDetection(lines[0] ?? "").length / 2;
    if (
      firstLineBytes > 0 &&
      lines.slice(0, -1).every((line) => compactForDetection(line).length / 2 === firstLineBytes)
    ) {
      format2.line = {
        bytesPerLine: firstLineBytes,
        separator: lineSeparator,
      };
    }
  }
  return format2;
}
__name(detectFormat, "detectFormat");
function normalizeText(text, options) {
  const allowPrefix = options.allowPrefix ?? true;
  const separators = [...resolveSeparators(options)].sort(
    (left, right) => right.length - left.length
  );
  for (const separator of separators) {
    validateSeparator(separator);
  }
  let working = text.trim();
  if (/^0x/i.test(working)) {
    if (!allowPrefix) {
      throw new TypeError("Hexadecimal text must not include a 0x prefix");
    }
    working = working.slice(2);
  }
  let normalized = "";
  let lastTokenWasSeparator = false;
  for (let index = 0; index < working.length; ) {
    const character = working[index] ?? "";
    if (HEX_CHARACTER_REGEX.test(character)) {
      normalized += character;
      lastTokenWasSeparator = false;
      index += 1;
      continue;
    }
    const separator = matchSeparator(working, index, separators);
    if (!separator) {
      throw new TypeError("Input is not valid hexadecimal text");
    }
    if (options.strict && (lastTokenWasSeparator || normalized.length === 0)) {
      throw new TypeError("Hexadecimal text contains misplaced separators");
    }
    lastTokenWasSeparator = true;
    index += separator.length;
  }
  if (options.strict && lastTokenWasSeparator && normalized.length > 0) {
    throw new TypeError("Hexadecimal text must not end with a separator");
  }
  if (normalized.length % 2 !== 0) {
    if (!options.allowOddLength) {
      throw new TypeError("Hexadecimal text must contain an even number of characters");
    }
    normalized = `0${normalized}`;
  }
  return normalized.toLowerCase();
}
__name(normalizeText, "normalizeText");
function groupPairs(pairs, group3) {
  if (!group3) {
    return pairs.join("");
  }
  if (!Number.isInteger(group3.size) || group3.size < 1) {
    throw new RangeError("Hex group size must be a positive integer");
  }
  const chunks = [];
  for (let index = 0; index < pairs.length; index += group3.size) {
    chunks.push(pairs.slice(index, index + group3.size).join(""));
  }
  return chunks.join(group3.separator);
}
__name(groupPairs, "groupPairs");
function normalize(text, options = {}) {
  return normalizeText(text, options);
}
__name(normalize, "normalize");
function is(text, options = {}) {
  if (typeof text !== "string") {
    return false;
  }
  try {
    normalize(text, options);
    return true;
  } catch {
    return false;
  }
}
__name(is, "is");
function encode2(data, options = {}) {
  const bytes = toUint8Array(data);
  const casing = options.case ?? "lower";
  const pairs = Array.from(bytes, (byte) => {
    const text = byte.toString(16).padStart(2, "0");
    return casing === "upper" ? text.toUpperCase() : text;
  });
  let body = "";
  if (options.line) {
    const bytesPerLine = options.line.bytesPerLine;
    if (!Number.isInteger(bytesPerLine) || bytesPerLine < 1) {
      throw new RangeError("Hex bytesPerLine must be a positive integer");
    }
    const separator = options.line.separator ?? "\n";
    const lines = [];
    for (let index = 0; index < pairs.length; index += bytesPerLine) {
      lines.push(groupPairs(pairs.slice(index, index + bytesPerLine), options.group));
    }
    body = lines.join(separator);
  } else {
    body = groupPairs(pairs, options.group);
  }
  return `${options.prefix ?? ""}${body}`;
}
__name(encode2, "encode");
function decode(text, options = {}) {
  const normalized = normalize(text, options);
  const result = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    result[i / 2] = Number.parseInt(normalized.slice(i, i + 2), 16);
  }
  return result;
}
__name(decode, "decode");
function parse(text, options = {}) {
  const normalized = normalize(text, options);
  return {
    bytes: decode(normalized),
    format: detectFormat(text),
    normalized,
  };
}
__name(parse, "parse");
function format(data, value) {
  return encode2(data, value);
}
__name(format, "format");
var formats = {
  compact: Object.freeze({}),
  upper: Object.freeze({ case: "upper" }),
  colon: Object.freeze({ group: { size: 1, separator: ":" } }),
  colonUpper: Object.freeze({ case: "upper", group: { size: 1, separator: ":" } }),
  groupsOf4: Object.freeze({ group: { size: 4, separator: " " } }),
  prefixed: Object.freeze({ prefix: "0x" }),
};
var hex = { encode: encode2, decode, format, formats, is, normalize, parse };

// node_modules/@peculiar/utils/build/esm/encoding/utf8.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/utils/build/esm/encoding/utf16.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/utils/build/esm/encoding/base64.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/utils/build/esm/encoding/base64url.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/ip_converter.js
var IpConverter = class {
  static isIPv4(ip) {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
  }
  static parseIPv4(ip) {
    const parts = ip.split(".");
    if (parts.length !== 4) {
      throw new Error("Invalid IPv4 address");
    }
    return parts.map((part) => {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255) {
        throw new Error("Invalid IPv4 address part");
      }
      return num;
    });
  }
  static parseIPv6(ip) {
    const expandedIP = this.expandIPv6(ip);
    const parts = expandedIP.split(":");
    if (parts.length !== 8) {
      throw new Error("Invalid IPv6 address");
    }
    return parts.reduce((bytes, part) => {
      const num = parseInt(part, 16);
      if (isNaN(num) || num < 0 || num > 65535) {
        throw new Error("Invalid IPv6 address part");
      }
      bytes.push((num >> 8) & 255);
      bytes.push(num & 255);
      return bytes;
    }, []);
  }
  static expandIPv6(ip) {
    if (!ip.includes("::")) {
      return ip;
    }
    const parts = ip.split("::");
    if (parts.length > 2) {
      throw new Error("Invalid IPv6 address");
    }
    const left = parts[0] ? parts[0].split(":") : [];
    const right = parts[1] ? parts[1].split(":") : [];
    const missing = 8 - (left.length + right.length);
    if (missing < 0) {
      throw new Error("Invalid IPv6 address");
    }
    return [...left, ...Array(missing).fill("0"), ...right].join(":");
  }
  static formatIPv6(bytes) {
    const parts = [];
    for (let i = 0; i < 16; i += 2) {
      parts.push(((bytes[i] << 8) | bytes[i + 1]).toString(16));
    }
    return this.compressIPv6(parts.join(":"));
  }
  static compressIPv6(ip) {
    const parts = ip.split(":");
    let longestZeroStart = -1;
    let longestZeroLength = 0;
    let currentZeroStart = -1;
    let currentZeroLength = 0;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "0") {
        if (currentZeroStart === -1) {
          currentZeroStart = i;
        }
        currentZeroLength++;
      } else {
        if (currentZeroLength > longestZeroLength) {
          longestZeroStart = currentZeroStart;
          longestZeroLength = currentZeroLength;
        }
        currentZeroStart = -1;
        currentZeroLength = 0;
      }
    }
    if (currentZeroLength > longestZeroLength) {
      longestZeroStart = currentZeroStart;
      longestZeroLength = currentZeroLength;
    }
    if (longestZeroLength > 1) {
      const before = parts.slice(0, longestZeroStart).join(":");
      const after = parts.slice(longestZeroStart + longestZeroLength).join(":");
      return `${before}::${after}`;
    }
    return ip;
  }
  static parseCIDR(text) {
    const [addr, prefixStr] = text.split("/");
    const prefix = parseInt(prefixStr, 10);
    if (this.isIPv4(addr)) {
      if (prefix < 0 || prefix > 32) {
        throw new Error("Invalid IPv4 prefix length");
      }
      return [this.parseIPv4(addr), prefix];
    } else {
      if (prefix < 0 || prefix > 128) {
        throw new Error("Invalid IPv6 prefix length");
      }
      return [this.parseIPv6(addr), prefix];
    }
  }
  static decodeIP(value) {
    if (value.length === 64 && parseInt(value, 16) === 0) {
      return "::/0";
    }
    if (value.length !== 16) {
      return value;
    }
    const mask = parseInt(value.slice(8), 16)
      .toString(2)
      .split("")
      .reduce((a, k) => a + +k, 0);
    let ip = value.slice(0, 8).replace(/(.{2})/g, (match) => `${parseInt(match, 16)}.`);
    ip = ip.slice(0, -1);
    return `${ip}/${mask}`;
  }
  static toString(buf) {
    const uint8 = new Uint8Array(buf);
    if (uint8.length === 4) {
      return Array.from(uint8).join(".");
    }
    if (uint8.length === 16) {
      return this.formatIPv6(uint8);
    }
    if (uint8.length === 8 || uint8.length === 32) {
      const half = uint8.length / 2;
      const addrBytes = uint8.slice(0, half);
      const maskBytes = uint8.slice(half);
      const isAllZeros = uint8.every((byte) => byte === 0);
      if (isAllZeros) {
        return uint8.length === 8 ? "0.0.0.0/0" : "::/0";
      }
      const prefixLen = maskBytes.reduce((a, b) => a + (b.toString(2).match(/1/g) || []).length, 0);
      if (uint8.length === 8) {
        const addrStr = Array.from(addrBytes).join(".");
        return `${addrStr}/${prefixLen}`;
      } else {
        const addrStr = this.formatIPv6(addrBytes);
        return `${addrStr}/${prefixLen}`;
      }
    }
    return this.decodeIP(hex_exports.encode(buf));
  }
  static fromString(text) {
    if (text.includes("/")) {
      const [addr, prefix] = this.parseCIDR(text);
      const maskBytes = new Uint8Array(addr.length);
      let bitsLeft = prefix;
      for (let i = 0; i < maskBytes.length; i++) {
        if (bitsLeft >= 8) {
          maskBytes[i] = 255;
          bitsLeft -= 8;
        } else if (bitsLeft > 0) {
          maskBytes[i] = 255 << (8 - bitsLeft);
          bitsLeft = 0;
        }
      }
      const out = new Uint8Array(addr.length * 2);
      out.set(addr, 0);
      out.set(maskBytes, addr.length);
      return out.buffer;
    }
    const bytes = this.isIPv4(text) ? this.parseIPv4(text) : this.parseIPv6(text);
    return new Uint8Array(bytes).buffer;
  }
};
__name(IpConverter, "IpConverter");

// node_modules/@peculiar/asn1-x509/build/es2015/name.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RelativeDistinguishedName_1;
var RDNSequence_1;
var Name_1;
var DirectoryString = /* @__PURE__ */ __name(
  class DirectoryString2 {
    teletexString;
    printableString;
    universalString;
    utf8String;
    bmpString;
    constructor(params = {}) {
      Object.assign(this, params);
    }
    toString() {
      return (
        this.bmpString ||
        this.printableString ||
        this.teletexString ||
        this.universalString ||
        this.utf8String ||
        ""
      );
    }
  },
  "DirectoryString"
);
__decorate(
  [AsnProp({ type: AsnPropTypes.TeletexString })],
  DirectoryString.prototype,
  "teletexString",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.PrintableString })],
  DirectoryString.prototype,
  "printableString",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.UniversalString })],
  DirectoryString.prototype,
  "universalString",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Utf8String })],
  DirectoryString.prototype,
  "utf8String",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.BmpString })],
  DirectoryString.prototype,
  "bmpString",
  void 0
);
DirectoryString = __decorate([AsnType({ type: AsnTypeTypes.Choice })], DirectoryString);
var AttributeValue = /* @__PURE__ */ __name(
  class AttributeValue2 extends DirectoryString {
    ia5String;
    anyValue;
    constructor(params = {}) {
      super(params);
      Object.assign(this, params);
    }
    toString() {
      return (
        this.ia5String || (this.anyValue ? hex_exports.encode(this.anyValue) : super.toString())
      );
    }
  },
  "AttributeValue"
);
__decorate(
  [AsnProp({ type: AsnPropTypes.IA5String })],
  AttributeValue.prototype,
  "ia5String",
  void 0
);
__decorate([AsnProp({ type: AsnPropTypes.Any })], AttributeValue.prototype, "anyValue", void 0);
AttributeValue = __decorate([AsnType({ type: AsnTypeTypes.Choice })], AttributeValue);
var AttributeTypeAndValue = class {
  type = "";
  value = new AttributeValue();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(AttributeTypeAndValue, "AttributeTypeAndValue");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  AttributeTypeAndValue.prototype,
  "type",
  void 0
);
__decorate([AsnProp({ type: AttributeValue })], AttributeTypeAndValue.prototype, "value", void 0);
var RelativeDistinguishedName = (RelativeDistinguishedName_1 = /* @__PURE__ */ __name(
  class RelativeDistinguishedName2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, RelativeDistinguishedName_1.prototype);
    }
  },
  "RelativeDistinguishedName"
));
RelativeDistinguishedName = RelativeDistinguishedName_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Set,
      itemType: AttributeTypeAndValue,
    }),
  ],
  RelativeDistinguishedName
);
var RDNSequence = (RDNSequence_1 = /* @__PURE__ */ __name(
  class RDNSequence2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, RDNSequence_1.prototype);
    }
  },
  "RDNSequence"
));
RDNSequence = RDNSequence_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: RelativeDistinguishedName,
    }),
  ],
  RDNSequence
);
var Name = (Name_1 = /* @__PURE__ */ __name(
  class Name2 extends RDNSequence {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, Name_1.prototype);
    }
  },
  "Name"
));
Name = Name_1 = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], Name);

// node_modules/@peculiar/asn1-x509/build/es2015/general_name.js
var AsnIpConverter = {
  fromASN: (value) => IpConverter.toString(AsnOctetStringConverter.fromASN(value)),
  toASN: (value) => AsnOctetStringConverter.toASN(IpConverter.fromString(value)),
};
var OtherName = class {
  typeId = "";
  value = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(OtherName, "OtherName");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  OtherName.prototype,
  "typeId",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      context: 0,
    }),
  ],
  OtherName.prototype,
  "value",
  void 0
);
var EDIPartyName = class {
  nameAssigner;
  partyName = new DirectoryString();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(EDIPartyName, "EDIPartyName");
__decorate(
  [
    AsnProp({
      type: DirectoryString,
      optional: true,
      context: 0,
      implicit: true,
    }),
  ],
  EDIPartyName.prototype,
  "nameAssigner",
  void 0
);
__decorate(
  [
    AsnProp({
      type: DirectoryString,
      context: 1,
      implicit: true,
    }),
  ],
  EDIPartyName.prototype,
  "partyName",
  void 0
);
var GeneralName = /* @__PURE__ */ __name(
  class GeneralName2 {
    otherName;
    rfc822Name;
    dNSName;
    x400Address;
    directoryName;
    ediPartyName;
    uniformResourceIdentifier;
    iPAddress;
    registeredID;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "GeneralName"
);
__decorate(
  [
    AsnProp({
      type: OtherName,
      context: 0,
      implicit: true,
    }),
  ],
  GeneralName.prototype,
  "otherName",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.IA5String,
      context: 1,
      implicit: true,
    }),
  ],
  GeneralName.prototype,
  "rfc822Name",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.IA5String,
      context: 2,
      implicit: true,
    }),
  ],
  GeneralName.prototype,
  "dNSName",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      context: 3,
      implicit: true,
    }),
  ],
  GeneralName.prototype,
  "x400Address",
  void 0
);
__decorate(
  [
    AsnProp({
      type: Name,
      context: 4,
      implicit: false,
    }),
  ],
  GeneralName.prototype,
  "directoryName",
  void 0
);
__decorate(
  [
    AsnProp({
      type: EDIPartyName,
      context: 5,
    }),
  ],
  GeneralName.prototype,
  "ediPartyName",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.IA5String,
      context: 6,
      implicit: true,
    }),
  ],
  GeneralName.prototype,
  "uniformResourceIdentifier",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.OctetString,
      context: 7,
      implicit: true,
      converter: AsnIpConverter,
    }),
  ],
  GeneralName.prototype,
  "iPAddress",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.ObjectIdentifier,
      context: 8,
      implicit: true,
    }),
  ],
  GeneralName.prototype,
  "registeredID",
  void 0
);
GeneralName = __decorate([AsnType({ type: AsnTypeTypes.Choice })], GeneralName);

// node_modules/@peculiar/asn1-x509/build/es2015/object_identifiers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_pkix = "1.3.6.1.5.5.7";
var id_pe = `${id_pkix}.1`;
var id_qt = `${id_pkix}.2`;
var id_kp = `${id_pkix}.3`;
var id_ad = `${id_pkix}.48`;
var id_qt_csp = `${id_qt}.1`;
var id_qt_unotice = `${id_qt}.2`;
var id_ad_ocsp = `${id_ad}.1`;
var id_ad_caIssuers = `${id_ad}.2`;
var id_ad_timeStamping = `${id_ad}.3`;
var id_ad_caRepository = `${id_ad}.5`;
var id_ce = "2.5.29";

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/authority_information_access.js
var AuthorityInfoAccessSyntax_1;
var id_pe_authorityInfoAccess = `${id_pe}.1`;
var AccessDescription = class {
  accessMethod = "";
  accessLocation = new GeneralName();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(AccessDescription, "AccessDescription");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  AccessDescription.prototype,
  "accessMethod",
  void 0
);
__decorate([AsnProp({ type: GeneralName })], AccessDescription.prototype, "accessLocation", void 0);
var AuthorityInfoAccessSyntax = (AuthorityInfoAccessSyntax_1 = /* @__PURE__ */ __name(
  class AuthorityInfoAccessSyntax2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, AuthorityInfoAccessSyntax_1.prototype);
    }
  },
  "AuthorityInfoAccessSyntax"
));
AuthorityInfoAccessSyntax = AuthorityInfoAccessSyntax_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: AccessDescription,
    }),
  ],
  AuthorityInfoAccessSyntax
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/authority_key_identifier.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_authorityKeyIdentifier = `${id_ce}.35`;
var KeyIdentifier = class extends OctetString2 {};
__name(KeyIdentifier, "KeyIdentifier");
var AuthorityKeyIdentifier = class {
  keyIdentifier;
  authorityCertIssuer;
  authorityCertSerialNumber;
  constructor(params = {}) {
    if (params) {
      Object.assign(this, params);
    }
  }
};
__name(AuthorityKeyIdentifier, "AuthorityKeyIdentifier");
__decorate(
  [
    AsnProp({
      type: KeyIdentifier,
      context: 0,
      optional: true,
      implicit: true,
    }),
  ],
  AuthorityKeyIdentifier.prototype,
  "keyIdentifier",
  void 0
);
__decorate(
  [
    AsnProp({
      type: GeneralName,
      context: 1,
      optional: true,
      implicit: true,
      repeated: "sequence",
    }),
  ],
  AuthorityKeyIdentifier.prototype,
  "authorityCertIssuer",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      context: 2,
      optional: true,
      implicit: true,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  AuthorityKeyIdentifier.prototype,
  "authorityCertSerialNumber",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/basic_constraints.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_basicConstraints = `${id_ce}.19`;
var BasicConstraints = class {
  cA = false;
  pathLenConstraint;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(BasicConstraints, "BasicConstraints");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Boolean,
      defaultValue: false,
    }),
  ],
  BasicConstraints.prototype,
  "cA",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  BasicConstraints.prototype,
  "pathLenConstraint",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/certificate_issuer.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/general_names.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GeneralNames_1;
var GeneralNames = (GeneralNames_1 = /* @__PURE__ */ __name(
  class GeneralNames2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, GeneralNames_1.prototype);
    }
  },
  "GeneralNames"
));
GeneralNames = GeneralNames_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: GeneralName,
    }),
  ],
  GeneralNames
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/certificate_issuer.js
var CertificateIssuer_1;
var id_ce_certificateIssuer = `${id_ce}.29`;
var CertificateIssuer = (CertificateIssuer_1 = /* @__PURE__ */ __name(
  class CertificateIssuer2 extends GeneralNames {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, CertificateIssuer_1.prototype);
    }
  },
  "CertificateIssuer"
));
CertificateIssuer = CertificateIssuer_1 = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  CertificateIssuer
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/certificate_policies.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var CertificatePolicies_1;
var id_ce_certificatePolicies = `${id_ce}.32`;
var id_ce_certificatePolicies_anyPolicy = `${id_ce_certificatePolicies}.0`;
var DisplayText = /* @__PURE__ */ __name(
  class DisplayText2 {
    ia5String;
    visibleString;
    bmpString;
    utf8String;
    constructor(params = {}) {
      Object.assign(this, params);
    }
    toString() {
      return this.ia5String || this.visibleString || this.bmpString || this.utf8String || "";
    }
  },
  "DisplayText"
);
__decorate([AsnProp({ type: AsnPropTypes.IA5String })], DisplayText.prototype, "ia5String", void 0);
__decorate(
  [AsnProp({ type: AsnPropTypes.VisibleString })],
  DisplayText.prototype,
  "visibleString",
  void 0
);
__decorate([AsnProp({ type: AsnPropTypes.BmpString })], DisplayText.prototype, "bmpString", void 0);
__decorate(
  [AsnProp({ type: AsnPropTypes.Utf8String })],
  DisplayText.prototype,
  "utf8String",
  void 0
);
DisplayText = __decorate([AsnType({ type: AsnTypeTypes.Choice })], DisplayText);
var NoticeReference = class {
  organization = new DisplayText();
  noticeNumbers = [];
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(NoticeReference, "NoticeReference");
__decorate([AsnProp({ type: DisplayText })], NoticeReference.prototype, "organization", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      repeated: "sequence",
    }),
  ],
  NoticeReference.prototype,
  "noticeNumbers",
  void 0
);
var UserNotice = class {
  noticeRef;
  explicitText;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(UserNotice, "UserNotice");
__decorate(
  [
    AsnProp({
      type: NoticeReference,
      optional: true,
    }),
  ],
  UserNotice.prototype,
  "noticeRef",
  void 0
);
__decorate(
  [
    AsnProp({
      type: DisplayText,
      optional: true,
    }),
  ],
  UserNotice.prototype,
  "explicitText",
  void 0
);
var Qualifier = /* @__PURE__ */ __name(
  class Qualifier2 {
    cPSuri;
    userNotice;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "Qualifier"
);
__decorate([AsnProp({ type: AsnPropTypes.IA5String })], Qualifier.prototype, "cPSuri", void 0);
__decorate([AsnProp({ type: UserNotice })], Qualifier.prototype, "userNotice", void 0);
Qualifier = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Qualifier);
var PolicyQualifierInfo = class {
  policyQualifierId = "";
  qualifier = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(PolicyQualifierInfo, "PolicyQualifierInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  PolicyQualifierInfo.prototype,
  "policyQualifierId",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Any })],
  PolicyQualifierInfo.prototype,
  "qualifier",
  void 0
);
var PolicyInformation = class {
  policyIdentifier = "";
  policyQualifiers;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(PolicyInformation, "PolicyInformation");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  PolicyInformation.prototype,
  "policyIdentifier",
  void 0
);
__decorate(
  [
    AsnProp({
      type: PolicyQualifierInfo,
      repeated: "sequence",
      optional: true,
    }),
  ],
  PolicyInformation.prototype,
  "policyQualifiers",
  void 0
);
var CertificatePolicies = (CertificatePolicies_1 = /* @__PURE__ */ __name(
  class CertificatePolicies2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, CertificatePolicies_1.prototype);
    }
  },
  "CertificatePolicies"
));
CertificatePolicies = CertificatePolicies_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: PolicyInformation,
    }),
  ],
  CertificatePolicies
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_delta_indicator.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_number.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_cRLNumber = `${id_ce}.20`;
var CRLNumber = /* @__PURE__ */ __name(
  class CRLNumber2 {
    value;
    constructor(value = 0) {
      this.value = value;
    }
  },
  "CRLNumber"
);
__decorate([AsnProp({ type: AsnPropTypes.Integer })], CRLNumber.prototype, "value", void 0);
CRLNumber = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CRLNumber);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_delta_indicator.js
var id_ce_deltaCRLIndicator = `${id_ce}.27`;
var BaseCRLNumber = /* @__PURE__ */ __name(
  class BaseCRLNumber2 extends CRLNumber {},
  "BaseCRLNumber"
);
BaseCRLNumber = __decorate([AsnType({ type: AsnTypeTypes.Choice })], BaseCRLNumber);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_distribution_points.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var CRLDistributionPoints_1;
var id_ce_cRLDistributionPoints = `${id_ce}.31`;
var ReasonFlags;
(function (ReasonFlags2) {
  ReasonFlags2[(ReasonFlags2["unused"] = 1)] = "unused";
  ReasonFlags2[(ReasonFlags2["keyCompromise"] = 2)] = "keyCompromise";
  ReasonFlags2[(ReasonFlags2["cACompromise"] = 4)] = "cACompromise";
  ReasonFlags2[(ReasonFlags2["affiliationChanged"] = 8)] = "affiliationChanged";
  ReasonFlags2[(ReasonFlags2["superseded"] = 16)] = "superseded";
  ReasonFlags2[(ReasonFlags2["cessationOfOperation"] = 32)] = "cessationOfOperation";
  ReasonFlags2[(ReasonFlags2["certificateHold"] = 64)] = "certificateHold";
  ReasonFlags2[(ReasonFlags2["privilegeWithdrawn"] = 128)] = "privilegeWithdrawn";
  ReasonFlags2[(ReasonFlags2["aACompromise"] = 256)] = "aACompromise";
})(ReasonFlags || (ReasonFlags = {}));
var Reason = class extends BitString2 {
  toJSON() {
    const res = [];
    const flags = this.toNumber();
    if (flags & ReasonFlags.aACompromise) {
      res.push("aACompromise");
    }
    if (flags & ReasonFlags.affiliationChanged) {
      res.push("affiliationChanged");
    }
    if (flags & ReasonFlags.cACompromise) {
      res.push("cACompromise");
    }
    if (flags & ReasonFlags.certificateHold) {
      res.push("certificateHold");
    }
    if (flags & ReasonFlags.cessationOfOperation) {
      res.push("cessationOfOperation");
    }
    if (flags & ReasonFlags.keyCompromise) {
      res.push("keyCompromise");
    }
    if (flags & ReasonFlags.privilegeWithdrawn) {
      res.push("privilegeWithdrawn");
    }
    if (flags & ReasonFlags.superseded) {
      res.push("superseded");
    }
    if (flags & ReasonFlags.unused) {
      res.push("unused");
    }
    return res;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
};
__name(Reason, "Reason");
var DistributionPointName = /* @__PURE__ */ __name(
  class DistributionPointName2 {
    fullName;
    nameRelativeToCRLIssuer;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "DistributionPointName"
);
__decorate(
  [
    AsnProp({
      type: GeneralName,
      context: 0,
      repeated: "sequence",
      implicit: true,
    }),
  ],
  DistributionPointName.prototype,
  "fullName",
  void 0
);
__decorate(
  [
    AsnProp({
      type: RelativeDistinguishedName,
      context: 1,
      implicit: true,
    }),
  ],
  DistributionPointName.prototype,
  "nameRelativeToCRLIssuer",
  void 0
);
DistributionPointName = __decorate([AsnType({ type: AsnTypeTypes.Choice })], DistributionPointName);
var DistributionPoint = class {
  distributionPoint;
  reasons;
  cRLIssuer;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(DistributionPoint, "DistributionPoint");
__decorate(
  [
    AsnProp({
      type: DistributionPointName,
      context: 0,
      optional: true,
    }),
  ],
  DistributionPoint.prototype,
  "distributionPoint",
  void 0
);
__decorate(
  [
    AsnProp({
      type: Reason,
      context: 1,
      optional: true,
      implicit: true,
    }),
  ],
  DistributionPoint.prototype,
  "reasons",
  void 0
);
__decorate(
  [
    AsnProp({
      type: GeneralName,
      context: 2,
      optional: true,
      repeated: "sequence",
      implicit: true,
    }),
  ],
  DistributionPoint.prototype,
  "cRLIssuer",
  void 0
);
var CRLDistributionPoints = (CRLDistributionPoints_1 = /* @__PURE__ */ __name(
  class CRLDistributionPoints2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, CRLDistributionPoints_1.prototype);
    }
  },
  "CRLDistributionPoints"
));
CRLDistributionPoints = CRLDistributionPoints_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: DistributionPoint,
    }),
  ],
  CRLDistributionPoints
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_freshest.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var FreshestCRL_1;
var id_ce_freshestCRL = `${id_ce}.46`;
var FreshestCRL = (FreshestCRL_1 = /* @__PURE__ */ __name(
  class FreshestCRL2 extends CRLDistributionPoints {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, FreshestCRL_1.prototype);
    }
  },
  "FreshestCRL"
));
FreshestCRL = FreshestCRL_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: DistributionPoint,
    }),
  ],
  FreshestCRL
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_issuing_distribution_point.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_issuingDistributionPoint = `${id_ce}.28`;
var _IssuingDistributionPoint = class {
  distributionPoint;
  onlyContainsUserCerts = _IssuingDistributionPoint.ONLY;
  onlyContainsCACerts = _IssuingDistributionPoint.ONLY;
  onlySomeReasons;
  indirectCRL = _IssuingDistributionPoint.ONLY;
  onlyContainsAttributeCerts = _IssuingDistributionPoint.ONLY;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
var IssuingDistributionPoint = _IssuingDistributionPoint;
__name(IssuingDistributionPoint, "IssuingDistributionPoint");
__publicField(IssuingDistributionPoint, "ONLY", false);
__decorate(
  [
    AsnProp({
      type: DistributionPointName,
      context: 0,
      optional: true,
    }),
  ],
  IssuingDistributionPoint.prototype,
  "distributionPoint",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Boolean,
      context: 1,
      defaultValue: IssuingDistributionPoint.ONLY,
      implicit: true,
    }),
  ],
  IssuingDistributionPoint.prototype,
  "onlyContainsUserCerts",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Boolean,
      context: 2,
      defaultValue: IssuingDistributionPoint.ONLY,
      implicit: true,
    }),
  ],
  IssuingDistributionPoint.prototype,
  "onlyContainsCACerts",
  void 0
);
__decorate(
  [
    AsnProp({
      type: Reason,
      context: 3,
      optional: true,
      implicit: true,
    }),
  ],
  IssuingDistributionPoint.prototype,
  "onlySomeReasons",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Boolean,
      context: 4,
      defaultValue: IssuingDistributionPoint.ONLY,
      implicit: true,
    }),
  ],
  IssuingDistributionPoint.prototype,
  "indirectCRL",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Boolean,
      context: 5,
      defaultValue: IssuingDistributionPoint.ONLY,
      implicit: true,
    }),
  ],
  IssuingDistributionPoint.prototype,
  "onlyContainsAttributeCerts",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_reason.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_cRLReasons = `${id_ce}.21`;
var CRLReasons;
(function (CRLReasons2) {
  CRLReasons2[(CRLReasons2["unspecified"] = 0)] = "unspecified";
  CRLReasons2[(CRLReasons2["keyCompromise"] = 1)] = "keyCompromise";
  CRLReasons2[(CRLReasons2["cACompromise"] = 2)] = "cACompromise";
  CRLReasons2[(CRLReasons2["affiliationChanged"] = 3)] = "affiliationChanged";
  CRLReasons2[(CRLReasons2["superseded"] = 4)] = "superseded";
  CRLReasons2[(CRLReasons2["cessationOfOperation"] = 5)] = "cessationOfOperation";
  CRLReasons2[(CRLReasons2["certificateHold"] = 6)] = "certificateHold";
  CRLReasons2[(CRLReasons2["removeFromCRL"] = 8)] = "removeFromCRL";
  CRLReasons2[(CRLReasons2["privilegeWithdrawn"] = 9)] = "privilegeWithdrawn";
  CRLReasons2[(CRLReasons2["aACompromise"] = 10)] = "aACompromise";
})(CRLReasons || (CRLReasons = {}));
var CRLReason = /* @__PURE__ */ __name(
  class CRLReason2 {
    reason = CRLReasons.unspecified;
    constructor(reason = CRLReasons.unspecified) {
      this.reason = reason;
    }
    toJSON() {
      return CRLReasons[this.reason];
    }
    toString() {
      return this.toJSON();
    }
  },
  "CRLReason"
);
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], CRLReason.prototype, "reason", void 0);
CRLReason = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CRLReason);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/extended_key_usage.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ExtendedKeyUsage_1;
var id_ce_extKeyUsage = `${id_ce}.37`;
var ExtendedKeyUsage = (ExtendedKeyUsage_1 = /* @__PURE__ */ __name(
  class ExtendedKeyUsage2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, ExtendedKeyUsage_1.prototype);
    }
  },
  "ExtendedKeyUsage"
));
ExtendedKeyUsage = ExtendedKeyUsage_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: AsnPropTypes.ObjectIdentifier,
    }),
  ],
  ExtendedKeyUsage
);
var anyExtendedKeyUsage = `${id_ce_extKeyUsage}.0`;
var id_kp_serverAuth = `${id_kp}.1`;
var id_kp_clientAuth = `${id_kp}.2`;
var id_kp_codeSigning = `${id_kp}.3`;
var id_kp_emailProtection = `${id_kp}.4`;
var id_kp_timeStamping = `${id_kp}.8`;
var id_kp_OCSPSigning = `${id_kp}.9`;

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/inhibit_any_policy.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_inhibitAnyPolicy = `${id_ce}.54`;
var InhibitAnyPolicy = /* @__PURE__ */ __name(
  class InhibitAnyPolicy2 {
    value;
    constructor(value = new ArrayBuffer(0)) {
      this.value = value;
    }
  },
  "InhibitAnyPolicy"
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  InhibitAnyPolicy.prototype,
  "value",
  void 0
);
InhibitAnyPolicy = __decorate([AsnType({ type: AsnTypeTypes.Choice })], InhibitAnyPolicy);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/invalidity_date.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_invalidityDate = `${id_ce}.24`;
var InvalidityDate = /* @__PURE__ */ __name(
  class InvalidityDate2 {
    value = /* @__PURE__ */ new Date();
    constructor(value) {
      if (value) {
        this.value = value;
      }
    }
  },
  "InvalidityDate"
);
__decorate(
  [AsnProp({ type: AsnPropTypes.GeneralizedTime })],
  InvalidityDate.prototype,
  "value",
  void 0
);
InvalidityDate = __decorate([AsnType({ type: AsnTypeTypes.Choice })], InvalidityDate);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/issuer_alternative_name.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var IssueAlternativeName_1;
var id_ce_issuerAltName = `${id_ce}.18`;
var IssueAlternativeName = (IssueAlternativeName_1 = /* @__PURE__ */ __name(
  class IssueAlternativeName2 extends GeneralNames {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, IssueAlternativeName_1.prototype);
    }
  },
  "IssueAlternativeName"
));
IssueAlternativeName = IssueAlternativeName_1 = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  IssueAlternativeName
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/key_usage.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_keyUsage = `${id_ce}.15`;
var KeyUsageFlags;
(function (KeyUsageFlags3) {
  KeyUsageFlags3[(KeyUsageFlags3["digitalSignature"] = 1)] = "digitalSignature";
  KeyUsageFlags3[(KeyUsageFlags3["nonRepudiation"] = 2)] = "nonRepudiation";
  KeyUsageFlags3[(KeyUsageFlags3["keyEncipherment"] = 4)] = "keyEncipherment";
  KeyUsageFlags3[(KeyUsageFlags3["dataEncipherment"] = 8)] = "dataEncipherment";
  KeyUsageFlags3[(KeyUsageFlags3["keyAgreement"] = 16)] = "keyAgreement";
  KeyUsageFlags3[(KeyUsageFlags3["keyCertSign"] = 32)] = "keyCertSign";
  KeyUsageFlags3[(KeyUsageFlags3["cRLSign"] = 64)] = "cRLSign";
  KeyUsageFlags3[(KeyUsageFlags3["encipherOnly"] = 128)] = "encipherOnly";
  KeyUsageFlags3[(KeyUsageFlags3["decipherOnly"] = 256)] = "decipherOnly";
})(KeyUsageFlags || (KeyUsageFlags = {}));
var KeyUsage = class extends BitString2 {
  toJSON() {
    const flag = this.toNumber();
    const res = [];
    if (flag & KeyUsageFlags.cRLSign) {
      res.push("crlSign");
    }
    if (flag & KeyUsageFlags.dataEncipherment) {
      res.push("dataEncipherment");
    }
    if (flag & KeyUsageFlags.decipherOnly) {
      res.push("decipherOnly");
    }
    if (flag & KeyUsageFlags.digitalSignature) {
      res.push("digitalSignature");
    }
    if (flag & KeyUsageFlags.encipherOnly) {
      res.push("encipherOnly");
    }
    if (flag & KeyUsageFlags.keyAgreement) {
      res.push("keyAgreement");
    }
    if (flag & KeyUsageFlags.keyCertSign) {
      res.push("keyCertSign");
    }
    if (flag & KeyUsageFlags.keyEncipherment) {
      res.push("keyEncipherment");
    }
    if (flag & KeyUsageFlags.nonRepudiation) {
      res.push("nonRepudiation");
    }
    return res;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
};
__name(KeyUsage, "KeyUsage");

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/name_constraints.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GeneralSubtrees_1;
var id_ce_nameConstraints = `${id_ce}.30`;
var GeneralSubtree = class {
  base = new GeneralName();
  minimum = 0;
  maximum;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(GeneralSubtree, "GeneralSubtree");
__decorate([AsnProp({ type: GeneralName })], GeneralSubtree.prototype, "base", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      context: 0,
      defaultValue: 0,
      implicit: true,
    }),
  ],
  GeneralSubtree.prototype,
  "minimum",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      context: 1,
      optional: true,
      implicit: true,
    }),
  ],
  GeneralSubtree.prototype,
  "maximum",
  void 0
);
var GeneralSubtrees = (GeneralSubtrees_1 = /* @__PURE__ */ __name(
  class GeneralSubtrees2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, GeneralSubtrees_1.prototype);
    }
  },
  "GeneralSubtrees"
));
GeneralSubtrees = GeneralSubtrees_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: GeneralSubtree,
    }),
  ],
  GeneralSubtrees
);
var NameConstraints = class {
  permittedSubtrees;
  excludedSubtrees;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(NameConstraints, "NameConstraints");
__decorate(
  [
    AsnProp({
      type: GeneralSubtrees,
      context: 0,
      optional: true,
      implicit: true,
    }),
  ],
  NameConstraints.prototype,
  "permittedSubtrees",
  void 0
);
__decorate(
  [
    AsnProp({
      type: GeneralSubtrees,
      context: 1,
      optional: true,
      implicit: true,
    }),
  ],
  NameConstraints.prototype,
  "excludedSubtrees",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/policy_constraints.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_policyConstraints = `${id_ce}.36`;
var PolicyConstraints = class {
  requireExplicitPolicy;
  inhibitPolicyMapping;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(PolicyConstraints, "PolicyConstraints");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      context: 0,
      implicit: true,
      optional: true,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  PolicyConstraints.prototype,
  "requireExplicitPolicy",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      context: 1,
      implicit: true,
      optional: true,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  PolicyConstraints.prototype,
  "inhibitPolicyMapping",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/policy_mappings.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var PolicyMappings_1;
var id_ce_policyMappings = `${id_ce}.33`;
var PolicyMapping = class {
  issuerDomainPolicy = "";
  subjectDomainPolicy = "";
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(PolicyMapping, "PolicyMapping");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  PolicyMapping.prototype,
  "issuerDomainPolicy",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  PolicyMapping.prototype,
  "subjectDomainPolicy",
  void 0
);
var PolicyMappings = (PolicyMappings_1 = /* @__PURE__ */ __name(
  class PolicyMappings2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, PolicyMappings_1.prototype);
    }
  },
  "PolicyMappings"
));
PolicyMappings = PolicyMappings_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: PolicyMapping,
    }),
  ],
  PolicyMappings
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/subject_alternative_name.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SubjectAlternativeName_1;
var id_ce_subjectAltName = `${id_ce}.17`;
var SubjectAlternativeName = (SubjectAlternativeName_1 = /* @__PURE__ */ __name(
  class SubjectAlternativeName2 extends GeneralNames {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, SubjectAlternativeName_1.prototype);
    }
  },
  "SubjectAlternativeName"
));
SubjectAlternativeName = SubjectAlternativeName_1 = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  SubjectAlternativeName
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/subject_directory_attributes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/attribute.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Attribute = class {
  type = "";
  values = [];
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(Attribute, "Attribute");
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], Attribute.prototype, "type", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      repeated: "set",
    }),
  ],
  Attribute.prototype,
  "values",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/subject_directory_attributes.js
var SubjectDirectoryAttributes_1;
var id_ce_subjectDirectoryAttributes = `${id_ce}.9`;
var SubjectDirectoryAttributes = (SubjectDirectoryAttributes_1 = /* @__PURE__ */ __name(
  class SubjectDirectoryAttributes2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, SubjectDirectoryAttributes_1.prototype);
    }
  },
  "SubjectDirectoryAttributes"
));
SubjectDirectoryAttributes = SubjectDirectoryAttributes_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: Attribute,
    }),
  ],
  SubjectDirectoryAttributes
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/subject_key_identifier.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_subjectKeyIdentifier = `${id_ce}.14`;
var SubjectKeyIdentifier = class extends KeyIdentifier {};
__name(SubjectKeyIdentifier, "SubjectKeyIdentifier");

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/private_key_usage_period.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ce_privateKeyUsagePeriod = `${id_ce}.16`;
var PrivateKeyUsagePeriod = class {
  notBefore;
  notAfter;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(PrivateKeyUsagePeriod, "PrivateKeyUsagePeriod");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.GeneralizedTime,
      context: 0,
      implicit: true,
      optional: true,
    }),
  ],
  PrivateKeyUsagePeriod.prototype,
  "notBefore",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.GeneralizedTime,
      context: 1,
      implicit: true,
      optional: true,
    }),
  ],
  PrivateKeyUsagePeriod.prototype,
  "notAfter",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/entrust_version_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var EntrustInfoFlags;
(function (EntrustInfoFlags2) {
  EntrustInfoFlags2[(EntrustInfoFlags2["keyUpdateAllowed"] = 1)] = "keyUpdateAllowed";
  EntrustInfoFlags2[(EntrustInfoFlags2["newExtensions"] = 2)] = "newExtensions";
  EntrustInfoFlags2[(EntrustInfoFlags2["pKIXCertificate"] = 4)] = "pKIXCertificate";
})(EntrustInfoFlags || (EntrustInfoFlags = {}));
var EntrustInfo = class extends BitString2 {
  toJSON() {
    const res = [];
    const flags = this.toNumber();
    if (flags & EntrustInfoFlags.pKIXCertificate) {
      res.push("pKIXCertificate");
    }
    if (flags & EntrustInfoFlags.newExtensions) {
      res.push("newExtensions");
    }
    if (flags & EntrustInfoFlags.keyUpdateAllowed) {
      res.push("keyUpdateAllowed");
    }
    return res;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
};
__name(EntrustInfo, "EntrustInfo");
var EntrustVersionInfo = class {
  entrustVers = "";
  entrustInfoFlags = new EntrustInfo();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(EntrustVersionInfo, "EntrustVersionInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.GeneralString })],
  EntrustVersionInfo.prototype,
  "entrustVers",
  void 0
);
__decorate(
  [AsnProp({ type: EntrustInfo })],
  EntrustVersionInfo.prototype,
  "entrustInfoFlags",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/extensions/subject_info_access.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SubjectInfoAccessSyntax_1;
var id_pe_subjectInfoAccess = `${id_pe}.11`;
var SubjectInfoAccessSyntax = (SubjectInfoAccessSyntax_1 = /* @__PURE__ */ __name(
  class SubjectInfoAccessSyntax2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, SubjectInfoAccessSyntax_1.prototype);
    }
  },
  "SubjectInfoAccessSyntax"
));
SubjectInfoAccessSyntax = SubjectInfoAccessSyntax_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: AccessDescription,
    }),
  ],
  SubjectInfoAccessSyntax
);

// node_modules/@peculiar/asn1-x509/build/es2015/algorithm_identifier.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AlgorithmIdentifier = class {
  algorithm = "";
  parameters;
  constructor(params = {}) {
    Object.assign(this, params);
  }
  isEqual(data) {
    return (
      data instanceof AlgorithmIdentifier &&
      data.algorithm == this.algorithm &&
      ((data.parameters && this.parameters && equal(data.parameters, this.parameters)) ||
        data.parameters === this.parameters)
    );
  }
};
__name(AlgorithmIdentifier, "AlgorithmIdentifier");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  AlgorithmIdentifier.prototype,
  "algorithm",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      optional: true,
    }),
  ],
  AlgorithmIdentifier.prototype,
  "parameters",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/certificate.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/tbs_certificate.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/subject_public_key_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SubjectPublicKeyInfo = class {
  algorithm = new AlgorithmIdentifier();
  subjectPublicKey = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(SubjectPublicKeyInfo, "SubjectPublicKeyInfo");
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  SubjectPublicKeyInfo.prototype,
  "algorithm",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.BitString })],
  SubjectPublicKeyInfo.prototype,
  "subjectPublicKey",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/validity.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/time.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Time = /* @__PURE__ */ __name(
  class Time2 {
    utcTime;
    generalTime;
    constructor(time3) {
      if (time3) {
        if (typeof time3 === "string" || typeof time3 === "number" || time3 instanceof Date) {
          const date = new Date(time3);
          date.setMilliseconds(0);
          if (date.getUTCFullYear() > 2049) {
            this.generalTime = date;
          } else {
            this.utcTime = date;
          }
        } else {
          Object.assign(this, time3);
        }
      }
    }
    getTime() {
      const time3 = this.utcTime || this.generalTime;
      if (!time3) {
        throw new Error("Cannot get time from CHOICE object");
      }
      return time3;
    }
  },
  "Time"
);
__decorate([AsnProp({ type: AsnPropTypes.UTCTime })], Time.prototype, "utcTime", void 0);
__decorate(
  [AsnProp({ type: AsnPropTypes.GeneralizedTime })],
  Time.prototype,
  "generalTime",
  void 0
);
Time = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Time);

// node_modules/@peculiar/asn1-x509/build/es2015/validity.js
var Validity = class {
  notBefore = new Time(/* @__PURE__ */ new Date());
  notAfter = new Time(/* @__PURE__ */ new Date());
  constructor(params) {
    if (params) {
      this.notBefore = new Time(params.notBefore);
      this.notAfter = new Time(params.notAfter);
    }
  }
};
__name(Validity, "Validity");
__decorate([AsnProp({ type: Time })], Validity.prototype, "notBefore", void 0);
__decorate([AsnProp({ type: Time })], Validity.prototype, "notAfter", void 0);

// node_modules/@peculiar/asn1-x509/build/es2015/extension.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Extensions_1;
var _Extension = class {
  extnID = "";
  critical = _Extension.CRITICAL;
  extnValue = new OctetString2();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
var Extension = _Extension;
__name(Extension, "Extension");
__publicField(Extension, "CRITICAL", false);
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  Extension.prototype,
  "extnID",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Boolean,
      defaultValue: Extension.CRITICAL,
    }),
  ],
  Extension.prototype,
  "critical",
  void 0
);
__decorate([AsnProp({ type: OctetString2 })], Extension.prototype, "extnValue", void 0);
var Extensions = (Extensions_1 = /* @__PURE__ */ __name(
  class Extensions2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, Extensions_1.prototype);
    }
  },
  "Extensions"
));
Extensions = Extensions_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: Extension,
    }),
  ],
  Extensions
);

// node_modules/@peculiar/asn1-x509/build/es2015/types.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Version;
(function (Version4) {
  Version4[(Version4["v1"] = 0)] = "v1";
  Version4[(Version4["v2"] = 1)] = "v2";
  Version4[(Version4["v3"] = 2)] = "v3";
})(Version || (Version = {}));

// node_modules/@peculiar/asn1-x509/build/es2015/tbs_certificate.js
var TBSCertificate = class {
  version = Version.v1;
  serialNumber = new ArrayBuffer(0);
  signature = new AlgorithmIdentifier();
  issuer = new Name();
  validity = new Validity();
  subject = new Name();
  subjectPublicKeyInfo = new SubjectPublicKeyInfo();
  issuerUniqueID;
  subjectUniqueID;
  extensions;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(TBSCertificate, "TBSCertificate");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      context: 0,
      defaultValue: Version.v1,
    }),
  ],
  TBSCertificate.prototype,
  "version",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  TBSCertificate.prototype,
  "serialNumber",
  void 0
);
__decorate([AsnProp({ type: AlgorithmIdentifier })], TBSCertificate.prototype, "signature", void 0);
__decorate([AsnProp({ type: Name })], TBSCertificate.prototype, "issuer", void 0);
__decorate([AsnProp({ type: Validity })], TBSCertificate.prototype, "validity", void 0);
__decorate([AsnProp({ type: Name })], TBSCertificate.prototype, "subject", void 0);
__decorate(
  [AsnProp({ type: SubjectPublicKeyInfo })],
  TBSCertificate.prototype,
  "subjectPublicKeyInfo",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.BitString,
      context: 1,
      implicit: true,
      optional: true,
    }),
  ],
  TBSCertificate.prototype,
  "issuerUniqueID",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.BitString,
      context: 2,
      implicit: true,
      optional: true,
    }),
  ],
  TBSCertificate.prototype,
  "subjectUniqueID",
  void 0
);
__decorate(
  [
    AsnProp({
      type: Extensions,
      context: 3,
      optional: true,
    }),
  ],
  TBSCertificate.prototype,
  "extensions",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/certificate.js
var Certificate = class {
  tbsCertificate = new TBSCertificate();
  tbsCertificateRaw;
  signatureAlgorithm = new AlgorithmIdentifier();
  signatureValue = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(Certificate, "Certificate");
__decorate(
  [
    AsnProp({
      type: TBSCertificate,
      raw: true,
    }),
  ],
  Certificate.prototype,
  "tbsCertificate",
  void 0
);
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  Certificate.prototype,
  "signatureAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.BitString })],
  Certificate.prototype,
  "signatureValue",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/certificate_list.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509/build/es2015/tbs_cert_list.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RevokedCertificate = class {
  userCertificate = new ArrayBuffer(0);
  revocationDate = new Time();
  crlEntryExtensions;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(RevokedCertificate, "RevokedCertificate");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RevokedCertificate.prototype,
  "userCertificate",
  void 0
);
__decorate([AsnProp({ type: Time })], RevokedCertificate.prototype, "revocationDate", void 0);
__decorate(
  [
    AsnProp({
      type: Extension,
      optional: true,
      repeated: "sequence",
    }),
  ],
  RevokedCertificate.prototype,
  "crlEntryExtensions",
  void 0
);
var TBSCertList = class {
  version;
  signature = new AlgorithmIdentifier();
  issuer = new Name();
  thisUpdate = new Time();
  nextUpdate;
  revokedCertificates;
  crlExtensions;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(TBSCertList, "TBSCertList");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  TBSCertList.prototype,
  "version",
  void 0
);
__decorate([AsnProp({ type: AlgorithmIdentifier })], TBSCertList.prototype, "signature", void 0);
__decorate([AsnProp({ type: Name })], TBSCertList.prototype, "issuer", void 0);
__decorate([AsnProp({ type: Time })], TBSCertList.prototype, "thisUpdate", void 0);
__decorate(
  [
    AsnProp({
      type: Time,
      optional: true,
    }),
  ],
  TBSCertList.prototype,
  "nextUpdate",
  void 0
);
__decorate(
  [
    AsnProp({
      type: RevokedCertificate,
      repeated: "sequence",
      optional: true,
    }),
  ],
  TBSCertList.prototype,
  "revokedCertificates",
  void 0
);
__decorate(
  [
    AsnProp({
      type: Extension,
      optional: true,
      context: 0,
      repeated: "sequence",
    }),
  ],
  TBSCertList.prototype,
  "crlExtensions",
  void 0
);

// node_modules/@peculiar/asn1-x509/build/es2015/certificate_list.js
var CertificateList = class {
  tbsCertList = new TBSCertList();
  tbsCertListRaw;
  signatureAlgorithm = new AlgorithmIdentifier();
  signature = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(CertificateList, "CertificateList");
__decorate(
  [
    AsnProp({
      type: TBSCertList,
      raw: true,
    }),
  ],
  CertificateList.prototype,
  "tbsCertList",
  void 0
);
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  CertificateList.prototype,
  "signatureAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.BitString })],
  CertificateList.prototype,
  "signature",
  void 0
);

// node_modules/@simplewebauthn/server/esm/helpers/getCertificateInfo.js
var issuerSubjectIDKey = {
  "2.5.4.6": "C",
  "2.5.4.10": "O",
  "2.5.4.11": "OU",
  "2.5.4.3": "CN",
};
function getCertificateInfo(leafCertBuffer) {
  const x509 = AsnParser.parse(leafCertBuffer, Certificate);
  const parsedCert = x509.tbsCertificate;
  const issuer = { combined: "" };
  parsedCert.issuer.forEach(([iss]) => {
    const key = issuerSubjectIDKey[iss.type];
    if (key) {
      issuer[key] = iss.value.toString();
    }
  });
  issuer.combined = issuerSubjectToString(issuer);
  const subject = { combined: "" };
  parsedCert.subject.forEach(([iss]) => {
    const key = issuerSubjectIDKey[iss.type];
    if (key) {
      subject[key] = iss.value.toString();
    }
  });
  subject.combined = issuerSubjectToString(subject);
  let basicConstraintsCA = false;
  if (parsedCert.extensions) {
    for (const ext of parsedCert.extensions) {
      if (ext.extnID === id_ce_basicConstraints) {
        const basicConstraints = AsnParser.parse(ext.extnValue, BasicConstraints);
        basicConstraintsCA = basicConstraints.cA;
      }
    }
  }
  return {
    issuer,
    subject,
    version: parsedCert.version,
    basicConstraintsCA,
    notBefore: parsedCert.validity.notBefore.getTime(),
    notAfter: parsedCert.validity.notAfter.getTime(),
    parsedCertificate: x509,
  };
}
__name(getCertificateInfo, "getCertificateInfo");
function issuerSubjectToString(input) {
  const parts = [];
  if (input.C) {
    parts.push(input.C);
  }
  if (input.O) {
    parts.push(input.O);
  }
  if (input.OU) {
    parts.push(input.OU);
  }
  if (input.CN) {
    parts.push(input.CN);
  }
  return parts.join(" : ");
}
__name(issuerSubjectToString, "issuerSubjectToString");

// node_modules/@simplewebauthn/server/esm/helpers/isCertRevoked.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/x509/build/x509.es.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_reflect_metadata = __toESM(require_Reflect());
var import_pvtsutils = __toESM(require_build());

// node_modules/@peculiar/asn1-cms/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/attributes/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/attributes/counter_signature.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/signer_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/signer_identifier.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/issuer_and_serial_number.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var IssuerAndSerialNumber = class {
  issuer = new Name();
  serialNumber = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(IssuerAndSerialNumber, "IssuerAndSerialNumber");
__decorate([AsnProp({ type: Name })], IssuerAndSerialNumber.prototype, "issuer", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  IssuerAndSerialNumber.prototype,
  "serialNumber",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/signer_identifier.js
var SignerIdentifier = /* @__PURE__ */ __name(
  class SignerIdentifier2 {
    subjectKeyIdentifier;
    issuerAndSerialNumber;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "SignerIdentifier"
);
__decorate(
  [
    AsnProp({
      type: SubjectKeyIdentifier,
      context: 0,
      implicit: true,
    }),
  ],
  SignerIdentifier.prototype,
  "subjectKeyIdentifier",
  void 0
);
__decorate(
  [AsnProp({ type: IssuerAndSerialNumber })],
  SignerIdentifier.prototype,
  "issuerAndSerialNumber",
  void 0
);
SignerIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Choice })], SignerIdentifier);

// node_modules/@peculiar/asn1-cms/build/es2015/types.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var CMSVersion;
(function (CMSVersion2) {
  CMSVersion2[(CMSVersion2["v0"] = 0)] = "v0";
  CMSVersion2[(CMSVersion2["v1"] = 1)] = "v1";
  CMSVersion2[(CMSVersion2["v2"] = 2)] = "v2";
  CMSVersion2[(CMSVersion2["v3"] = 3)] = "v3";
  CMSVersion2[(CMSVersion2["v4"] = 4)] = "v4";
  CMSVersion2[(CMSVersion2["v5"] = 5)] = "v5";
})(CMSVersion || (CMSVersion = {}));
var DigestAlgorithmIdentifier = /* @__PURE__ */ __name(
  class DigestAlgorithmIdentifier2 extends AlgorithmIdentifier {},
  "DigestAlgorithmIdentifier"
);
DigestAlgorithmIdentifier = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  DigestAlgorithmIdentifier
);
var SignatureAlgorithmIdentifier = /* @__PURE__ */ __name(
  class SignatureAlgorithmIdentifier2 extends AlgorithmIdentifier {},
  "SignatureAlgorithmIdentifier"
);
SignatureAlgorithmIdentifier = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  SignatureAlgorithmIdentifier
);
var KeyEncryptionAlgorithmIdentifier = /* @__PURE__ */ __name(
  class KeyEncryptionAlgorithmIdentifier2 extends AlgorithmIdentifier {},
  "KeyEncryptionAlgorithmIdentifier"
);
KeyEncryptionAlgorithmIdentifier = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  KeyEncryptionAlgorithmIdentifier
);
var ContentEncryptionAlgorithmIdentifier = /* @__PURE__ */ __name(
  class ContentEncryptionAlgorithmIdentifier2 extends AlgorithmIdentifier {},
  "ContentEncryptionAlgorithmIdentifier"
);
ContentEncryptionAlgorithmIdentifier = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  ContentEncryptionAlgorithmIdentifier
);
var MessageAuthenticationCodeAlgorithm = /* @__PURE__ */ __name(
  class MessageAuthenticationCodeAlgorithm2 extends AlgorithmIdentifier {},
  "MessageAuthenticationCodeAlgorithm"
);
MessageAuthenticationCodeAlgorithm = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  MessageAuthenticationCodeAlgorithm
);
var KeyDerivationAlgorithmIdentifier = /* @__PURE__ */ __name(
  class KeyDerivationAlgorithmIdentifier2 extends AlgorithmIdentifier {},
  "KeyDerivationAlgorithmIdentifier"
);
KeyDerivationAlgorithmIdentifier = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  KeyDerivationAlgorithmIdentifier
);

// node_modules/@peculiar/asn1-cms/build/es2015/attribute.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Attribute2 = class {
  attrType = "";
  attrValues = [];
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(Attribute2, "Attribute");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  Attribute2.prototype,
  "attrType",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      repeated: "set",
    }),
  ],
  Attribute2.prototype,
  "attrValues",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/signer_info.js
var SignerInfos_1;
var SignerInfo = class {
  version = CMSVersion.v0;
  sid = new SignerIdentifier();
  digestAlgorithm = new DigestAlgorithmIdentifier();
  signedAttrs;
  signedAttrsRaw;
  signatureAlgorithm = new SignatureAlgorithmIdentifier();
  signature = new OctetString2();
  unsignedAttrs;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(SignerInfo, "SignerInfo");
__decorate([AsnProp({ type: AsnPropTypes.Integer })], SignerInfo.prototype, "version", void 0);
__decorate([AsnProp({ type: SignerIdentifier })], SignerInfo.prototype, "sid", void 0);
__decorate(
  [AsnProp({ type: DigestAlgorithmIdentifier })],
  SignerInfo.prototype,
  "digestAlgorithm",
  void 0
);
__decorate(
  [
    AsnProp({
      type: Attribute2,
      repeated: "set",
      context: 0,
      implicit: true,
      optional: true,
      raw: true,
    }),
  ],
  SignerInfo.prototype,
  "signedAttrs",
  void 0
);
__decorate(
  [AsnProp({ type: SignatureAlgorithmIdentifier })],
  SignerInfo.prototype,
  "signatureAlgorithm",
  void 0
);
__decorate([AsnProp({ type: OctetString2 })], SignerInfo.prototype, "signature", void 0);
__decorate(
  [
    AsnProp({
      type: Attribute2,
      repeated: "set",
      context: 1,
      implicit: true,
      optional: true,
    }),
  ],
  SignerInfo.prototype,
  "unsignedAttrs",
  void 0
);
var SignerInfos = (SignerInfos_1 = /* @__PURE__ */ __name(
  class SignerInfos2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, SignerInfos_1.prototype);
    }
  },
  "SignerInfos"
));
SignerInfos = SignerInfos_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Set,
      itemType: SignerInfo,
    }),
  ],
  SignerInfos
);

// node_modules/@peculiar/asn1-cms/build/es2015/attributes/counter_signature.js
var CounterSignature = /* @__PURE__ */ __name(
  class CounterSignature2 extends SignerInfo {},
  "CounterSignature"
);
CounterSignature = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], CounterSignature);

// node_modules/@peculiar/asn1-cms/build/es2015/attributes/message_digest.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/attributes/signing_time.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SigningTime = /* @__PURE__ */ __name(class SigningTime2 extends Time {}, "SigningTime");
SigningTime = __decorate([AsnType({ type: AsnTypeTypes.Choice })], SigningTime);

// node_modules/@peculiar/asn1-cms/build/es2015/certificate_choices.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509-attr/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509-attr/build/es2015/aa_clear_attrs.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ACClearAttrs = class {
  acIssuer = new GeneralName();
  acSerial = 0;
  attrs = [];
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(ACClearAttrs, "ACClearAttrs");
__decorate([AsnProp({ type: GeneralName })], ACClearAttrs.prototype, "acIssuer", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Integer })], ACClearAttrs.prototype, "acSerial", void 0);
__decorate(
  [
    AsnProp({
      type: Attribute,
      repeated: "sequence",
    }),
  ],
  ACClearAttrs.prototype,
  "attrs",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/aa_controls.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509-attr/build/es2015/attr_spec.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AttrSpec_1;
var AttrSpec = (AttrSpec_1 = /* @__PURE__ */ __name(
  class AttrSpec2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, AttrSpec_1.prototype);
    }
  },
  "AttrSpec"
));
AttrSpec = AttrSpec_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: AsnPropTypes.ObjectIdentifier,
    }),
  ],
  AttrSpec
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/aa_controls.js
var AAControls = class {
  pathLenConstraint;
  permittedAttrs;
  excludedAttrs;
  permitUnSpecified = true;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(AAControls, "AAControls");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AAControls.prototype,
  "pathLenConstraint",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AttrSpec,
      implicit: true,
      context: 0,
      optional: true,
    }),
  ],
  AAControls.prototype,
  "permittedAttrs",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AttrSpec,
      implicit: true,
      context: 1,
      optional: true,
    }),
  ],
  AAControls.prototype,
  "excludedAttrs",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Boolean,
      defaultValue: true,
    }),
  ],
  AAControls.prototype,
  "permitUnSpecified",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/attr_cert_issuer.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509-attr/build/es2015/v2_form.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509-attr/build/es2015/issuer_serial.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var IssuerSerial = class {
  issuer = new GeneralNames();
  serial = new ArrayBuffer(0);
  issuerUID = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(IssuerSerial, "IssuerSerial");
__decorate([AsnProp({ type: GeneralNames })], IssuerSerial.prototype, "issuer", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  IssuerSerial.prototype,
  "serial",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.BitString,
      optional: true,
    }),
  ],
  IssuerSerial.prototype,
  "issuerUID",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/object_digest_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DigestedObjectType;
(function (DigestedObjectType2) {
  DigestedObjectType2[(DigestedObjectType2["publicKey"] = 0)] = "publicKey";
  DigestedObjectType2[(DigestedObjectType2["publicKeyCert"] = 1)] = "publicKeyCert";
  DigestedObjectType2[(DigestedObjectType2["otherObjectTypes"] = 2)] = "otherObjectTypes";
})(DigestedObjectType || (DigestedObjectType = {}));
var ObjectDigestInfo = class {
  digestedObjectType = DigestedObjectType.publicKey;
  otherObjectTypeID;
  digestAlgorithm = new AlgorithmIdentifier();
  objectDigest = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(ObjectDigestInfo, "ObjectDigestInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.Enumerated })],
  ObjectDigestInfo.prototype,
  "digestedObjectType",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.ObjectIdentifier,
      optional: true,
    }),
  ],
  ObjectDigestInfo.prototype,
  "otherObjectTypeID",
  void 0
);
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  ObjectDigestInfo.prototype,
  "digestAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.BitString })],
  ObjectDigestInfo.prototype,
  "objectDigest",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/v2_form.js
var V2Form = class {
  issuerName;
  baseCertificateID;
  objectDigestInfo;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(V2Form, "V2Form");
__decorate(
  [
    AsnProp({
      type: GeneralNames,
      optional: true,
    }),
  ],
  V2Form.prototype,
  "issuerName",
  void 0
);
__decorate(
  [
    AsnProp({
      type: IssuerSerial,
      context: 0,
      implicit: true,
      optional: true,
    }),
  ],
  V2Form.prototype,
  "baseCertificateID",
  void 0
);
__decorate(
  [
    AsnProp({
      type: ObjectDigestInfo,
      context: 1,
      implicit: true,
      optional: true,
    }),
  ],
  V2Form.prototype,
  "objectDigestInfo",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/attr_cert_issuer.js
var AttCertIssuer = /* @__PURE__ */ __name(
  class AttCertIssuer2 {
    v1Form;
    v2Form;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "AttCertIssuer"
);
__decorate(
  [
    AsnProp({
      type: GeneralName,
      repeated: "sequence",
    }),
  ],
  AttCertIssuer.prototype,
  "v1Form",
  void 0
);
__decorate(
  [
    AsnProp({
      type: V2Form,
      context: 0,
      implicit: true,
    }),
  ],
  AttCertIssuer.prototype,
  "v2Form",
  void 0
);
AttCertIssuer = __decorate([AsnType({ type: AsnTypeTypes.Choice })], AttCertIssuer);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/attr_cert_validity_period.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AttCertValidityPeriod = class {
  notBeforeTime = /* @__PURE__ */ new Date();
  notAfterTime = /* @__PURE__ */ new Date();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(AttCertValidityPeriod, "AttCertValidityPeriod");
__decorate(
  [AsnProp({ type: AsnPropTypes.GeneralizedTime })],
  AttCertValidityPeriod.prototype,
  "notBeforeTime",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.GeneralizedTime })],
  AttCertValidityPeriod.prototype,
  "notAfterTime",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/attribute_certificate.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509-attr/build/es2015/attribute_certificate_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509-attr/build/es2015/holder.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Holder = class {
  baseCertificateID;
  entityName;
  objectDigestInfo;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(Holder, "Holder");
__decorate(
  [
    AsnProp({
      type: IssuerSerial,
      implicit: true,
      context: 0,
      optional: true,
    }),
  ],
  Holder.prototype,
  "baseCertificateID",
  void 0
);
__decorate(
  [
    AsnProp({
      type: GeneralNames,
      implicit: true,
      context: 1,
      optional: true,
    }),
  ],
  Holder.prototype,
  "entityName",
  void 0
);
__decorate(
  [
    AsnProp({
      type: ObjectDigestInfo,
      implicit: true,
      context: 2,
      optional: true,
    }),
  ],
  Holder.prototype,
  "objectDigestInfo",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/attribute_certificate_info.js
var AttCertVersion;
(function (AttCertVersion2) {
  AttCertVersion2[(AttCertVersion2["v2"] = 1)] = "v2";
})(AttCertVersion || (AttCertVersion = {}));
var AttributeCertificateInfo = class {
  version = AttCertVersion.v2;
  holder = new Holder();
  issuer = new AttCertIssuer();
  signature = new AlgorithmIdentifier();
  serialNumber = new ArrayBuffer(0);
  attrCertValidityPeriod = new AttCertValidityPeriod();
  attributes = [];
  issuerUniqueID;
  extensions;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(AttributeCertificateInfo, "AttributeCertificateInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  AttributeCertificateInfo.prototype,
  "version",
  void 0
);
__decorate([AsnProp({ type: Holder })], AttributeCertificateInfo.prototype, "holder", void 0);
__decorate(
  [AsnProp({ type: AttCertIssuer })],
  AttributeCertificateInfo.prototype,
  "issuer",
  void 0
);
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  AttributeCertificateInfo.prototype,
  "signature",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  AttributeCertificateInfo.prototype,
  "serialNumber",
  void 0
);
__decorate(
  [AsnProp({ type: AttCertValidityPeriod })],
  AttributeCertificateInfo.prototype,
  "attrCertValidityPeriod",
  void 0
);
__decorate(
  [
    AsnProp({
      type: Attribute,
      repeated: "sequence",
    }),
  ],
  AttributeCertificateInfo.prototype,
  "attributes",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.BitString,
      optional: true,
    }),
  ],
  AttributeCertificateInfo.prototype,
  "issuerUniqueID",
  void 0
);
__decorate(
  [
    AsnProp({
      type: Extensions,
      optional: true,
    }),
  ],
  AttributeCertificateInfo.prototype,
  "extensions",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/attribute_certificate.js
var AttributeCertificate = class {
  acinfo = new AttributeCertificateInfo();
  signatureAlgorithm = new AlgorithmIdentifier();
  signatureValue = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(AttributeCertificate, "AttributeCertificate");
__decorate(
  [AsnProp({ type: AttributeCertificateInfo })],
  AttributeCertificate.prototype,
  "acinfo",
  void 0
);
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  AttributeCertificate.prototype,
  "signatureAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.BitString })],
  AttributeCertificate.prototype,
  "signatureValue",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/class_list.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ClassListFlags;
(function (ClassListFlags2) {
  ClassListFlags2[(ClassListFlags2["unmarked"] = 1)] = "unmarked";
  ClassListFlags2[(ClassListFlags2["unclassified"] = 2)] = "unclassified";
  ClassListFlags2[(ClassListFlags2["restricted"] = 4)] = "restricted";
  ClassListFlags2[(ClassListFlags2["confidential"] = 8)] = "confidential";
  ClassListFlags2[(ClassListFlags2["secret"] = 16)] = "secret";
  ClassListFlags2[(ClassListFlags2["topSecret"] = 32)] = "topSecret";
})(ClassListFlags || (ClassListFlags = {}));
var ClassList = class extends BitString2 {};
__name(ClassList, "ClassList");

// node_modules/@peculiar/asn1-x509-attr/build/es2015/clearance.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509-attr/build/es2015/security_category.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SecurityCategory = class {
  type = "";
  value = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(SecurityCategory, "SecurityCategory");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.ObjectIdentifier,
      implicit: true,
      context: 0,
    }),
  ],
  SecurityCategory.prototype,
  "type",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      implicit: true,
      context: 1,
    }),
  ],
  SecurityCategory.prototype,
  "value",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/clearance.js
var Clearance = class {
  policyId = "";
  classList = new ClassList(ClassListFlags.unclassified);
  securityCategories;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(Clearance, "Clearance");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  Clearance.prototype,
  "policyId",
  void 0
);
__decorate(
  [
    AsnProp({
      type: ClassList,
      defaultValue: new ClassList(ClassListFlags.unclassified),
    }),
  ],
  Clearance.prototype,
  "classList",
  void 0
);
__decorate(
  [
    AsnProp({
      type: SecurityCategory,
      repeated: "set",
    }),
  ],
  Clearance.prototype,
  "securityCategories",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/ietf_attr_syntax.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var IetfAttrSyntaxValueChoices = class {
  cotets;
  oid;
  string;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(IetfAttrSyntaxValueChoices, "IetfAttrSyntaxValueChoices");
__decorate(
  [AsnProp({ type: OctetString2 })],
  IetfAttrSyntaxValueChoices.prototype,
  "cotets",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  IetfAttrSyntaxValueChoices.prototype,
  "oid",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Utf8String })],
  IetfAttrSyntaxValueChoices.prototype,
  "string",
  void 0
);
var IetfAttrSyntax = class {
  policyAuthority;
  values = [];
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(IetfAttrSyntax, "IetfAttrSyntax");
__decorate(
  [
    AsnProp({
      type: GeneralNames,
      implicit: true,
      context: 0,
      optional: true,
    }),
  ],
  IetfAttrSyntax.prototype,
  "policyAuthority",
  void 0
);
__decorate(
  [
    AsnProp({
      type: IetfAttrSyntaxValueChoices,
      repeated: "sequence",
    }),
  ],
  IetfAttrSyntax.prototype,
  "values",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/object_identifiers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_pe_ac_auditIdentity = `${id_pe}.4`;
var id_pe_aaControls = `${id_pe}.6`;
var id_pe_ac_proxying = `${id_pe}.10`;
var id_ce_targetInformation = `${id_ce}.55`;
var id_aca = `${id_pkix}.10`;
var id_aca_authenticationInfo = `${id_aca}.1`;
var id_aca_accessIdentity = `${id_aca}.2`;
var id_aca_chargingIdentity = `${id_aca}.3`;
var id_aca_group = `${id_aca}.4`;
var id_aca_encAttrs = `${id_aca}.6`;
var id_at = "2.5.4";
var id_at_role = `${id_at}.72`;

// node_modules/@peculiar/asn1-x509-attr/build/es2015/proxy_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-x509-attr/build/es2015/target.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Targets_1;
var TargetCert = class {
  targetCertificate = new IssuerSerial();
  targetName;
  certDigestInfo;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(TargetCert, "TargetCert");
__decorate([AsnProp({ type: IssuerSerial })], TargetCert.prototype, "targetCertificate", void 0);
__decorate(
  [
    AsnProp({
      type: GeneralName,
      optional: true,
    }),
  ],
  TargetCert.prototype,
  "targetName",
  void 0
);
__decorate(
  [
    AsnProp({
      type: ObjectDigestInfo,
      optional: true,
    }),
  ],
  TargetCert.prototype,
  "certDigestInfo",
  void 0
);
var Target = /* @__PURE__ */ __name(
  class Target2 {
    targetName;
    targetGroup;
    targetCert;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "Target"
);
__decorate(
  [
    AsnProp({
      type: GeneralName,
      context: 0,
      implicit: true,
    }),
  ],
  Target.prototype,
  "targetName",
  void 0
);
__decorate(
  [
    AsnProp({
      type: GeneralName,
      context: 1,
      implicit: true,
    }),
  ],
  Target.prototype,
  "targetGroup",
  void 0
);
__decorate(
  [
    AsnProp({
      type: TargetCert,
      context: 2,
      implicit: true,
    }),
  ],
  Target.prototype,
  "targetCert",
  void 0
);
Target = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Target);
var Targets = (Targets_1 = /* @__PURE__ */ __name(
  class Targets2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, Targets_1.prototype);
    }
  },
  "Targets"
));
Targets = Targets_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: Target,
    }),
  ],
  Targets
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/proxy_info.js
var ProxyInfo_1;
var ProxyInfo = (ProxyInfo_1 = /* @__PURE__ */ __name(
  class ProxyInfo2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, ProxyInfo_1.prototype);
    }
  },
  "ProxyInfo"
));
ProxyInfo = ProxyInfo_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: Targets,
    }),
  ],
  ProxyInfo
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/role_syntax.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RoleSyntax = class {
  roleAuthority;
  roleName;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(RoleSyntax, "RoleSyntax");
__decorate(
  [
    AsnProp({
      type: GeneralNames,
      implicit: true,
      context: 0,
      optional: true,
    }),
  ],
  RoleSyntax.prototype,
  "roleAuthority",
  void 0
);
__decorate(
  [
    AsnProp({
      type: GeneralName,
      implicit: true,
      context: 1,
    }),
  ],
  RoleSyntax.prototype,
  "roleName",
  void 0
);

// node_modules/@peculiar/asn1-x509-attr/build/es2015/svce_auth_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SvceAuthInfo = class {
  service = new GeneralName();
  ident = new GeneralName();
  authInfo;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(SvceAuthInfo, "SvceAuthInfo");
__decorate([AsnProp({ type: GeneralName })], SvceAuthInfo.prototype, "service", void 0);
__decorate([AsnProp({ type: GeneralName })], SvceAuthInfo.prototype, "ident", void 0);
__decorate(
  [
    AsnProp({
      type: OctetString2,
      optional: true,
    }),
  ],
  SvceAuthInfo.prototype,
  "authInfo",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/certificate_choices.js
var CertificateSet_1;
var OtherCertificateFormat = class {
  otherCertFormat = "";
  otherCert = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(OtherCertificateFormat, "OtherCertificateFormat");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  OtherCertificateFormat.prototype,
  "otherCertFormat",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Any })],
  OtherCertificateFormat.prototype,
  "otherCert",
  void 0
);
var CertificateChoices = /* @__PURE__ */ __name(
  class CertificateChoices2 {
    certificate;
    v2AttrCert;
    other;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "CertificateChoices"
);
__decorate([AsnProp({ type: Certificate })], CertificateChoices.prototype, "certificate", void 0);
__decorate(
  [
    AsnProp({
      type: AttributeCertificate,
      context: 2,
      implicit: true,
    }),
  ],
  CertificateChoices.prototype,
  "v2AttrCert",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OtherCertificateFormat,
      context: 3,
      implicit: true,
    }),
  ],
  CertificateChoices.prototype,
  "other",
  void 0
);
CertificateChoices = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CertificateChoices);
var CertificateSet = (CertificateSet_1 = /* @__PURE__ */ __name(
  class CertificateSet2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, CertificateSet_1.prototype);
    }
  },
  "CertificateSet"
));
CertificateSet = CertificateSet_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Set,
      itemType: CertificateChoices,
    }),
  ],
  CertificateSet
);

// node_modules/@peculiar/asn1-cms/build/es2015/content_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ContentInfo = class {
  contentType = "";
  content = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(ContentInfo, "ContentInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  ContentInfo.prototype,
  "contentType",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      context: 0,
    }),
  ],
  ContentInfo.prototype,
  "content",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/encapsulated_content_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var EncapsulatedContent = /* @__PURE__ */ __name(
  class EncapsulatedContent2 {
    single;
    any;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "EncapsulatedContent"
);
__decorate([AsnProp({ type: OctetString2 })], EncapsulatedContent.prototype, "single", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Any })], EncapsulatedContent.prototype, "any", void 0);
EncapsulatedContent = __decorate([AsnType({ type: AsnTypeTypes.Choice })], EncapsulatedContent);
var EncapsulatedContentInfo = class {
  eContentType = "";
  eContent;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(EncapsulatedContentInfo, "EncapsulatedContentInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  EncapsulatedContentInfo.prototype,
  "eContentType",
  void 0
);
__decorate(
  [
    AsnProp({
      type: EncapsulatedContent,
      context: 0,
      optional: true,
    }),
  ],
  EncapsulatedContentInfo.prototype,
  "eContent",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/encrypted_content_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var EncryptedContent = /* @__PURE__ */ __name(
  class EncryptedContent2 {
    value;
    constructedValue;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "EncryptedContent"
);
__decorate(
  [
    AsnProp({
      type: OctetString2,
      context: 0,
      implicit: true,
      optional: true,
    }),
  ],
  EncryptedContent.prototype,
  "value",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OctetString2,
      converter: AsnConstructedOctetStringConverter,
      context: 0,
      implicit: true,
      optional: true,
      repeated: "sequence",
    }),
  ],
  EncryptedContent.prototype,
  "constructedValue",
  void 0
);
EncryptedContent = __decorate([AsnType({ type: AsnTypeTypes.Choice })], EncryptedContent);
var EncryptedContentInfo = class {
  contentType = "";
  contentEncryptionAlgorithm = new ContentEncryptionAlgorithmIdentifier();
  encryptedContent;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(EncryptedContentInfo, "EncryptedContentInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  EncryptedContentInfo.prototype,
  "contentType",
  void 0
);
__decorate(
  [AsnProp({ type: ContentEncryptionAlgorithmIdentifier })],
  EncryptedContentInfo.prototype,
  "contentEncryptionAlgorithm",
  void 0
);
__decorate(
  [
    AsnProp({
      type: EncryptedContent,
      optional: true,
    }),
  ],
  EncryptedContentInfo.prototype,
  "encryptedContent",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/enveloped_data.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/recipient_infos.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/recipient_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/key_agree_recipient_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/other_key_attribute.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var OtherKeyAttribute = class {
  keyAttrId = "";
  keyAttr;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(OtherKeyAttribute, "OtherKeyAttribute");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  OtherKeyAttribute.prototype,
  "keyAttrId",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      optional: true,
    }),
  ],
  OtherKeyAttribute.prototype,
  "keyAttr",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/key_agree_recipient_info.js
var RecipientEncryptedKeys_1;
var RecipientKeyIdentifier = class {
  subjectKeyIdentifier = new SubjectKeyIdentifier();
  date;
  other;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(RecipientKeyIdentifier, "RecipientKeyIdentifier");
__decorate(
  [AsnProp({ type: SubjectKeyIdentifier })],
  RecipientKeyIdentifier.prototype,
  "subjectKeyIdentifier",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.GeneralizedTime,
      optional: true,
    }),
  ],
  RecipientKeyIdentifier.prototype,
  "date",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OtherKeyAttribute,
      optional: true,
    }),
  ],
  RecipientKeyIdentifier.prototype,
  "other",
  void 0
);
var KeyAgreeRecipientIdentifier = /* @__PURE__ */ __name(
  class KeyAgreeRecipientIdentifier2 {
    rKeyId;
    issuerAndSerialNumber;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "KeyAgreeRecipientIdentifier"
);
__decorate(
  [
    AsnProp({
      type: RecipientKeyIdentifier,
      context: 0,
      implicit: true,
      optional: true,
    }),
  ],
  KeyAgreeRecipientIdentifier.prototype,
  "rKeyId",
  void 0
);
__decorate(
  [
    AsnProp({
      type: IssuerAndSerialNumber,
      optional: true,
    }),
  ],
  KeyAgreeRecipientIdentifier.prototype,
  "issuerAndSerialNumber",
  void 0
);
KeyAgreeRecipientIdentifier = __decorate(
  [AsnType({ type: AsnTypeTypes.Choice })],
  KeyAgreeRecipientIdentifier
);
var RecipientEncryptedKey = class {
  rid = new KeyAgreeRecipientIdentifier();
  encryptedKey = new OctetString2();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(RecipientEncryptedKey, "RecipientEncryptedKey");
__decorate(
  [AsnProp({ type: KeyAgreeRecipientIdentifier })],
  RecipientEncryptedKey.prototype,
  "rid",
  void 0
);
__decorate(
  [AsnProp({ type: OctetString2 })],
  RecipientEncryptedKey.prototype,
  "encryptedKey",
  void 0
);
var RecipientEncryptedKeys = (RecipientEncryptedKeys_1 = /* @__PURE__ */ __name(
  class RecipientEncryptedKeys2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, RecipientEncryptedKeys_1.prototype);
    }
  },
  "RecipientEncryptedKeys"
));
RecipientEncryptedKeys = RecipientEncryptedKeys_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: RecipientEncryptedKey,
    }),
  ],
  RecipientEncryptedKeys
);
var OriginatorPublicKey = class {
  algorithm = new AlgorithmIdentifier();
  publicKey = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(OriginatorPublicKey, "OriginatorPublicKey");
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  OriginatorPublicKey.prototype,
  "algorithm",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.BitString })],
  OriginatorPublicKey.prototype,
  "publicKey",
  void 0
);
var OriginatorIdentifierOrKey = /* @__PURE__ */ __name(
  class OriginatorIdentifierOrKey2 {
    subjectKeyIdentifier;
    originatorKey;
    issuerAndSerialNumber;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "OriginatorIdentifierOrKey"
);
__decorate(
  [
    AsnProp({
      type: SubjectKeyIdentifier,
      context: 0,
      implicit: true,
      optional: true,
    }),
  ],
  OriginatorIdentifierOrKey.prototype,
  "subjectKeyIdentifier",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OriginatorPublicKey,
      context: 1,
      implicit: true,
      optional: true,
    }),
  ],
  OriginatorIdentifierOrKey.prototype,
  "originatorKey",
  void 0
);
__decorate(
  [
    AsnProp({
      type: IssuerAndSerialNumber,
      optional: true,
    }),
  ],
  OriginatorIdentifierOrKey.prototype,
  "issuerAndSerialNumber",
  void 0
);
OriginatorIdentifierOrKey = __decorate(
  [AsnType({ type: AsnTypeTypes.Choice })],
  OriginatorIdentifierOrKey
);
var KeyAgreeRecipientInfo = class {
  version = CMSVersion.v3;
  originator = new OriginatorIdentifierOrKey();
  ukm;
  keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();
  recipientEncryptedKeys = new RecipientEncryptedKeys();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(KeyAgreeRecipientInfo, "KeyAgreeRecipientInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  KeyAgreeRecipientInfo.prototype,
  "version",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OriginatorIdentifierOrKey,
      context: 0,
    }),
  ],
  KeyAgreeRecipientInfo.prototype,
  "originator",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OctetString2,
      context: 1,
      optional: true,
    }),
  ],
  KeyAgreeRecipientInfo.prototype,
  "ukm",
  void 0
);
__decorate(
  [AsnProp({ type: KeyEncryptionAlgorithmIdentifier })],
  KeyAgreeRecipientInfo.prototype,
  "keyEncryptionAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: RecipientEncryptedKeys })],
  KeyAgreeRecipientInfo.prototype,
  "recipientEncryptedKeys",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/key_trans_recipient_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RecipientIdentifier = /* @__PURE__ */ __name(
  class RecipientIdentifier2 {
    subjectKeyIdentifier;
    issuerAndSerialNumber;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "RecipientIdentifier"
);
__decorate(
  [
    AsnProp({
      type: SubjectKeyIdentifier,
      context: 0,
      implicit: true,
    }),
  ],
  RecipientIdentifier.prototype,
  "subjectKeyIdentifier",
  void 0
);
__decorate(
  [AsnProp({ type: IssuerAndSerialNumber })],
  RecipientIdentifier.prototype,
  "issuerAndSerialNumber",
  void 0
);
RecipientIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Choice })], RecipientIdentifier);
var KeyTransRecipientInfo = class {
  version = CMSVersion.v0;
  rid = new RecipientIdentifier();
  keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();
  encryptedKey = new OctetString2();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(KeyTransRecipientInfo, "KeyTransRecipientInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  KeyTransRecipientInfo.prototype,
  "version",
  void 0
);
__decorate(
  [AsnProp({ type: RecipientIdentifier })],
  KeyTransRecipientInfo.prototype,
  "rid",
  void 0
);
__decorate(
  [AsnProp({ type: KeyEncryptionAlgorithmIdentifier })],
  KeyTransRecipientInfo.prototype,
  "keyEncryptionAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: OctetString2 })],
  KeyTransRecipientInfo.prototype,
  "encryptedKey",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/kek_recipient_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var KEKIdentifier = class {
  keyIdentifier = new OctetString2();
  date;
  other;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(KEKIdentifier, "KEKIdentifier");
__decorate([AsnProp({ type: OctetString2 })], KEKIdentifier.prototype, "keyIdentifier", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.GeneralizedTime,
      optional: true,
    }),
  ],
  KEKIdentifier.prototype,
  "date",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OtherKeyAttribute,
      optional: true,
    }),
  ],
  KEKIdentifier.prototype,
  "other",
  void 0
);
var KEKRecipientInfo = class {
  version = CMSVersion.v4;
  kekid = new KEKIdentifier();
  keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();
  encryptedKey = new OctetString2();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(KEKRecipientInfo, "KEKRecipientInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  KEKRecipientInfo.prototype,
  "version",
  void 0
);
__decorate([AsnProp({ type: KEKIdentifier })], KEKRecipientInfo.prototype, "kekid", void 0);
__decorate(
  [AsnProp({ type: KeyEncryptionAlgorithmIdentifier })],
  KEKRecipientInfo.prototype,
  "keyEncryptionAlgorithm",
  void 0
);
__decorate([AsnProp({ type: OctetString2 })], KEKRecipientInfo.prototype, "encryptedKey", void 0);

// node_modules/@peculiar/asn1-cms/build/es2015/password_recipient_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var PasswordRecipientInfo = class {
  version = CMSVersion.v0;
  keyDerivationAlgorithm;
  keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();
  encryptedKey = new OctetString2();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(PasswordRecipientInfo, "PasswordRecipientInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  PasswordRecipientInfo.prototype,
  "version",
  void 0
);
__decorate(
  [
    AsnProp({
      type: KeyDerivationAlgorithmIdentifier,
      context: 0,
      optional: true,
    }),
  ],
  PasswordRecipientInfo.prototype,
  "keyDerivationAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: KeyEncryptionAlgorithmIdentifier })],
  PasswordRecipientInfo.prototype,
  "keyEncryptionAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: OctetString2 })],
  PasswordRecipientInfo.prototype,
  "encryptedKey",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/recipient_info.js
var OtherRecipientInfo = class {
  oriType = "";
  oriValue = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(OtherRecipientInfo, "OtherRecipientInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  OtherRecipientInfo.prototype,
  "oriType",
  void 0
);
__decorate([AsnProp({ type: AsnPropTypes.Any })], OtherRecipientInfo.prototype, "oriValue", void 0);
var RecipientInfo = /* @__PURE__ */ __name(
  class RecipientInfo2 {
    ktri;
    kari;
    kekri;
    pwri;
    ori;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "RecipientInfo"
);
__decorate(
  [
    AsnProp({
      type: KeyTransRecipientInfo,
      optional: true,
    }),
  ],
  RecipientInfo.prototype,
  "ktri",
  void 0
);
__decorate(
  [
    AsnProp({
      type: KeyAgreeRecipientInfo,
      context: 1,
      implicit: true,
      optional: true,
    }),
  ],
  RecipientInfo.prototype,
  "kari",
  void 0
);
__decorate(
  [
    AsnProp({
      type: KEKRecipientInfo,
      context: 2,
      implicit: true,
      optional: true,
    }),
  ],
  RecipientInfo.prototype,
  "kekri",
  void 0
);
__decorate(
  [
    AsnProp({
      type: PasswordRecipientInfo,
      context: 3,
      implicit: true,
      optional: true,
    }),
  ],
  RecipientInfo.prototype,
  "pwri",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OtherRecipientInfo,
      context: 4,
      implicit: true,
      optional: true,
    }),
  ],
  RecipientInfo.prototype,
  "ori",
  void 0
);
RecipientInfo = __decorate([AsnType({ type: AsnTypeTypes.Choice })], RecipientInfo);

// node_modules/@peculiar/asn1-cms/build/es2015/recipient_infos.js
var RecipientInfos_1;
var RecipientInfos = (RecipientInfos_1 = /* @__PURE__ */ __name(
  class RecipientInfos2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, RecipientInfos_1.prototype);
    }
  },
  "RecipientInfos"
));
RecipientInfos = RecipientInfos_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Set,
      itemType: RecipientInfo,
    }),
  ],
  RecipientInfos
);

// node_modules/@peculiar/asn1-cms/build/es2015/originator_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-cms/build/es2015/revocation_info_choice.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RevocationInfoChoices_1;
var id_ri = `${id_pkix}.16`;
var id_ri_ocsp_response = `${id_ri}.2`;
var id_ri_scvp = `${id_ri}.4`;
var OtherRevocationInfoFormat = class {
  otherRevInfoFormat = "";
  otherRevInfo = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(OtherRevocationInfoFormat, "OtherRevocationInfoFormat");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  OtherRevocationInfoFormat.prototype,
  "otherRevInfoFormat",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Any })],
  OtherRevocationInfoFormat.prototype,
  "otherRevInfo",
  void 0
);
var RevocationInfoChoice = /* @__PURE__ */ __name(
  class RevocationInfoChoice2 {
    other = new OtherRevocationInfoFormat();
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "RevocationInfoChoice"
);
__decorate(
  [
    AsnProp({
      type: OtherRevocationInfoFormat,
      context: 1,
      implicit: true,
    }),
  ],
  RevocationInfoChoice.prototype,
  "other",
  void 0
);
RevocationInfoChoice = __decorate([AsnType({ type: AsnTypeTypes.Choice })], RevocationInfoChoice);
var RevocationInfoChoices = (RevocationInfoChoices_1 = /* @__PURE__ */ __name(
  class RevocationInfoChoices2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, RevocationInfoChoices_1.prototype);
    }
  },
  "RevocationInfoChoices"
));
RevocationInfoChoices = RevocationInfoChoices_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Set,
      itemType: RevocationInfoChoice,
    }),
  ],
  RevocationInfoChoices
);

// node_modules/@peculiar/asn1-cms/build/es2015/originator_info.js
var OriginatorInfo = class {
  certs;
  crls;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(OriginatorInfo, "OriginatorInfo");
__decorate(
  [
    AsnProp({
      type: CertificateSet,
      context: 0,
      implicit: true,
      optional: true,
    }),
  ],
  OriginatorInfo.prototype,
  "certs",
  void 0
);
__decorate(
  [
    AsnProp({
      type: RevocationInfoChoices,
      context: 1,
      implicit: true,
      optional: true,
    }),
  ],
  OriginatorInfo.prototype,
  "crls",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/enveloped_data.js
var UnprotectedAttributes_1;
var UnprotectedAttributes = (UnprotectedAttributes_1 = /* @__PURE__ */ __name(
  class UnprotectedAttributes2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, UnprotectedAttributes_1.prototype);
    }
  },
  "UnprotectedAttributes"
));
UnprotectedAttributes = UnprotectedAttributes_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Set,
      itemType: Attribute2,
    }),
  ],
  UnprotectedAttributes
);
var EnvelopedData = class {
  version = CMSVersion.v0;
  originatorInfo;
  recipientInfos = new RecipientInfos();
  encryptedContentInfo = new EncryptedContentInfo();
  unprotectedAttrs;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(EnvelopedData, "EnvelopedData");
__decorate([AsnProp({ type: AsnPropTypes.Integer })], EnvelopedData.prototype, "version", void 0);
__decorate(
  [
    AsnProp({
      type: OriginatorInfo,
      context: 0,
      implicit: true,
      optional: true,
    }),
  ],
  EnvelopedData.prototype,
  "originatorInfo",
  void 0
);
__decorate([AsnProp({ type: RecipientInfos })], EnvelopedData.prototype, "recipientInfos", void 0);
__decorate(
  [AsnProp({ type: EncryptedContentInfo })],
  EnvelopedData.prototype,
  "encryptedContentInfo",
  void 0
);
__decorate(
  [
    AsnProp({
      type: UnprotectedAttributes,
      context: 1,
      implicit: true,
      optional: true,
    }),
  ],
  EnvelopedData.prototype,
  "unprotectedAttrs",
  void 0
);

// node_modules/@peculiar/asn1-cms/build/es2015/object_identifiers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_signedData = "1.2.840.113549.1.7.2";

// node_modules/@peculiar/asn1-cms/build/es2015/signed_data.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DigestAlgorithmIdentifiers_1;
var DigestAlgorithmIdentifiers = (DigestAlgorithmIdentifiers_1 = /* @__PURE__ */ __name(
  class DigestAlgorithmIdentifiers2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, DigestAlgorithmIdentifiers_1.prototype);
    }
  },
  "DigestAlgorithmIdentifiers"
));
DigestAlgorithmIdentifiers = DigestAlgorithmIdentifiers_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Set,
      itemType: DigestAlgorithmIdentifier,
    }),
  ],
  DigestAlgorithmIdentifiers
);
var SignedData = class {
  version = CMSVersion.v0;
  digestAlgorithms = new DigestAlgorithmIdentifiers();
  encapContentInfo = new EncapsulatedContentInfo();
  certificates;
  crls;
  signerInfos = new SignerInfos();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(SignedData, "SignedData");
__decorate([AsnProp({ type: AsnPropTypes.Integer })], SignedData.prototype, "version", void 0);
__decorate(
  [AsnProp({ type: DigestAlgorithmIdentifiers })],
  SignedData.prototype,
  "digestAlgorithms",
  void 0
);
__decorate(
  [AsnProp({ type: EncapsulatedContentInfo })],
  SignedData.prototype,
  "encapContentInfo",
  void 0
);
__decorate(
  [
    AsnProp({
      type: CertificateSet,
      context: 0,
      implicit: true,
      optional: true,
    }),
  ],
  SignedData.prototype,
  "certificates",
  void 0
);
__decorate(
  [
    AsnProp({
      type: RevocationInfoChoices,
      context: 1,
      implicit: true,
      optional: true,
    }),
  ],
  SignedData.prototype,
  "crls",
  void 0
);
__decorate([AsnProp({ type: SignerInfos })], SignedData.prototype, "signerInfos", void 0);

// node_modules/@peculiar/asn1-ecc/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-ecc/build/es2015/algorithms.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-ecc/build/es2015/object_identifiers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_ecPublicKey = "1.2.840.10045.2.1";
var id_ecdsaWithSHA1 = "1.2.840.10045.4.1";
var id_ecdsaWithSHA224 = "1.2.840.10045.4.3.1";
var id_ecdsaWithSHA256 = "1.2.840.10045.4.3.2";
var id_ecdsaWithSHA384 = "1.2.840.10045.4.3.3";
var id_ecdsaWithSHA512 = "1.2.840.10045.4.3.4";
var id_secp256r1 = "1.2.840.10045.3.1.7";
var id_secp384r1 = "1.3.132.0.34";
var id_secp521r1 = "1.3.132.0.35";

// node_modules/@peculiar/asn1-ecc/build/es2015/algorithms.js
function create(algorithm) {
  return new AlgorithmIdentifier({ algorithm });
}
__name(create, "create");
var ecdsaWithSHA1 = create(id_ecdsaWithSHA1);
var ecdsaWithSHA224 = create(id_ecdsaWithSHA224);
var ecdsaWithSHA256 = create(id_ecdsaWithSHA256);
var ecdsaWithSHA384 = create(id_ecdsaWithSHA384);
var ecdsaWithSHA512 = create(id_ecdsaWithSHA512);

// node_modules/@peculiar/asn1-ecc/build/es2015/ec_parameters.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-ecc/build/es2015/rfc3279.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var FieldID = /* @__PURE__ */ __name(
  class FieldID2 {
    fieldType;
    parameters;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "FieldID"
);
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  FieldID.prototype,
  "fieldType",
  void 0
);
__decorate([AsnProp({ type: AsnPropTypes.Any })], FieldID.prototype, "parameters", void 0);
FieldID = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], FieldID);
var ECPoint = class extends OctetString2 {};
__name(ECPoint, "ECPoint");
var Curve = /* @__PURE__ */ __name(
  class Curve2 {
    a;
    b;
    seed;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "Curve"
);
__decorate([AsnProp({ type: AsnPropTypes.OctetString })], Curve.prototype, "a", void 0);
__decorate([AsnProp({ type: AsnPropTypes.OctetString })], Curve.prototype, "b", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.BitString,
      optional: true,
    }),
  ],
  Curve.prototype,
  "seed",
  void 0
);
Curve = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], Curve);
var ECPVer;
(function (ECPVer2) {
  ECPVer2[(ECPVer2["ecpVer1"] = 1)] = "ecpVer1";
})(ECPVer || (ECPVer = {}));
var SpecifiedECDomain = /* @__PURE__ */ __name(
  class SpecifiedECDomain2 {
    version = ECPVer.ecpVer1;
    fieldID;
    curve;
    base;
    order;
    cofactor;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "SpecifiedECDomain"
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  SpecifiedECDomain.prototype,
  "version",
  void 0
);
__decorate([AsnProp({ type: FieldID })], SpecifiedECDomain.prototype, "fieldID", void 0);
__decorate([AsnProp({ type: Curve })], SpecifiedECDomain.prototype, "curve", void 0);
__decorate([AsnProp({ type: ECPoint })], SpecifiedECDomain.prototype, "base", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  SpecifiedECDomain.prototype,
  "order",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  SpecifiedECDomain.prototype,
  "cofactor",
  void 0
);
SpecifiedECDomain = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], SpecifiedECDomain);

// node_modules/@peculiar/asn1-ecc/build/es2015/ec_parameters.js
var ECParameters = /* @__PURE__ */ __name(
  class ECParameters2 {
    namedCurve;
    implicitCurve;
    specifiedCurve;
    constructor(params = {}) {
      Object.assign(this, params);
    }
  },
  "ECParameters"
);
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  ECParameters.prototype,
  "namedCurve",
  void 0
);
__decorate([AsnProp({ type: AsnPropTypes.Null })], ECParameters.prototype, "implicitCurve", void 0);
__decorate(
  [AsnProp({ type: SpecifiedECDomain })],
  ECParameters.prototype,
  "specifiedCurve",
  void 0
);
ECParameters = __decorate([AsnType({ type: AsnTypeTypes.Choice })], ECParameters);

// node_modules/@peculiar/asn1-ecc/build/es2015/ec_private_key.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ECPrivateKey = class {
  version = 1;
  privateKey = new OctetString2();
  parameters;
  publicKey;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(ECPrivateKey, "ECPrivateKey");
__decorate([AsnProp({ type: AsnPropTypes.Integer })], ECPrivateKey.prototype, "version", void 0);
__decorate([AsnProp({ type: OctetString2 })], ECPrivateKey.prototype, "privateKey", void 0);
__decorate(
  [
    AsnProp({
      type: ECParameters,
      context: 0,
      optional: true,
    }),
  ],
  ECPrivateKey.prototype,
  "parameters",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.BitString,
      context: 1,
      optional: true,
    }),
  ],
  ECPrivateKey.prototype,
  "publicKey",
  void 0
);

// node_modules/@peculiar/asn1-ecc/build/es2015/ec_signature_value.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ECDSASigValue = class {
  r = new ArrayBuffer(0);
  s = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(ECDSASigValue, "ECDSASigValue");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  ECDSASigValue.prototype,
  "r",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  ECDSASigValue.prototype,
  "s",
  void 0
);

// node_modules/@peculiar/asn1-rsa/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-rsa/build/es2015/parameters/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-rsa/build/es2015/parameters/rsaes_oaep.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-rsa/build/es2015/object_identifiers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_pkcs_1 = "1.2.840.113549.1.1";
var id_rsaEncryption = `${id_pkcs_1}.1`;
var id_RSAES_OAEP = `${id_pkcs_1}.7`;
var id_pSpecified = `${id_pkcs_1}.9`;
var id_RSASSA_PSS = `${id_pkcs_1}.10`;
var id_md2WithRSAEncryption = `${id_pkcs_1}.2`;
var id_md5WithRSAEncryption = `${id_pkcs_1}.4`;
var id_sha1WithRSAEncryption = `${id_pkcs_1}.5`;
var id_sha224WithRSAEncryption = `${id_pkcs_1}.14`;
var id_sha256WithRSAEncryption = `${id_pkcs_1}.11`;
var id_sha384WithRSAEncryption = `${id_pkcs_1}.12`;
var id_sha512WithRSAEncryption = `${id_pkcs_1}.13`;
var id_sha512_224WithRSAEncryption = `${id_pkcs_1}.15`;
var id_sha512_256WithRSAEncryption = `${id_pkcs_1}.16`;
var id_sha1 = "1.3.14.3.2.26";
var id_sha224 = "2.16.840.1.101.3.4.2.4";
var id_sha256 = "2.16.840.1.101.3.4.2.1";
var id_sha384 = "2.16.840.1.101.3.4.2.2";
var id_sha512 = "2.16.840.1.101.3.4.2.3";
var id_sha512_224 = "2.16.840.1.101.3.4.2.5";
var id_sha512_256 = "2.16.840.1.101.3.4.2.6";
var id_md2 = "1.2.840.113549.2.2";
var id_md5 = "1.2.840.113549.2.5";
var id_mgf1 = `${id_pkcs_1}.8`;

// node_modules/@peculiar/asn1-rsa/build/es2015/algorithms.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function create2(algorithm) {
  return new AlgorithmIdentifier({
    algorithm,
    parameters: null,
  });
}
__name(create2, "create");
var md2 = create2(id_md2);
var md4 = create2(id_md5);
var sha1 = create2(id_sha1);
var sha224 = create2(id_sha224);
var sha256 = create2(id_sha256);
var sha384 = create2(id_sha384);
var sha512 = create2(id_sha512);
var sha512_224 = create2(id_sha512_224);
var sha512_256 = create2(id_sha512_256);
var mgf1SHA1 = new AlgorithmIdentifier({
  algorithm: id_mgf1,
  parameters: AsnConvert.serialize(sha1),
});
var pSpecifiedEmpty = new AlgorithmIdentifier({
  algorithm: id_pSpecified,
  parameters: AsnConvert.serialize(
    AsnOctetStringConverter.toASN(
      new Uint8Array([
        218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9,
      ]).buffer
    )
  ),
});
var rsaEncryption = create2(id_rsaEncryption);
var md2WithRSAEncryption = create2(id_md2WithRSAEncryption);
var md5WithRSAEncryption = create2(id_md5WithRSAEncryption);
var sha1WithRSAEncryption = create2(id_sha1WithRSAEncryption);
var sha224WithRSAEncryption = create2(id_sha512_224WithRSAEncryption);
var sha256WithRSAEncryption = create2(id_sha512_256WithRSAEncryption);
var sha384WithRSAEncryption = create2(id_sha384WithRSAEncryption);
var sha512WithRSAEncryption = create2(id_sha512WithRSAEncryption);
var sha512_224WithRSAEncryption = create2(id_sha512_224WithRSAEncryption);
var sha512_256WithRSAEncryption = create2(id_sha512_256WithRSAEncryption);

// node_modules/@peculiar/asn1-rsa/build/es2015/parameters/rsaes_oaep.js
var RsaEsOaepParams = class {
  hashAlgorithm = new AlgorithmIdentifier(sha1);
  maskGenAlgorithm = new AlgorithmIdentifier({
    algorithm: id_mgf1,
    parameters: AsnConvert.serialize(sha1),
  });
  pSourceAlgorithm = new AlgorithmIdentifier(pSpecifiedEmpty);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(RsaEsOaepParams, "RsaEsOaepParams");
__decorate(
  [
    AsnProp({
      type: AlgorithmIdentifier,
      context: 0,
      defaultValue: sha1,
    }),
  ],
  RsaEsOaepParams.prototype,
  "hashAlgorithm",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AlgorithmIdentifier,
      context: 1,
      defaultValue: mgf1SHA1,
    }),
  ],
  RsaEsOaepParams.prototype,
  "maskGenAlgorithm",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AlgorithmIdentifier,
      context: 2,
      defaultValue: pSpecifiedEmpty,
    }),
  ],
  RsaEsOaepParams.prototype,
  "pSourceAlgorithm",
  void 0
);
var RSAES_OAEP = new AlgorithmIdentifier({
  algorithm: id_RSAES_OAEP,
  parameters: AsnConvert.serialize(new RsaEsOaepParams()),
});

// node_modules/@peculiar/asn1-rsa/build/es2015/parameters/rsassa_pss.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RsaSaPssParams = class {
  hashAlgorithm = new AlgorithmIdentifier(sha1);
  maskGenAlgorithm = new AlgorithmIdentifier({
    algorithm: id_mgf1,
    parameters: AsnConvert.serialize(sha1),
  });
  saltLength = 20;
  trailerField = 1;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(RsaSaPssParams, "RsaSaPssParams");
__decorate(
  [
    AsnProp({
      type: AlgorithmIdentifier,
      context: 0,
      defaultValue: sha1,
    }),
  ],
  RsaSaPssParams.prototype,
  "hashAlgorithm",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AlgorithmIdentifier,
      context: 1,
      defaultValue: mgf1SHA1,
    }),
  ],
  RsaSaPssParams.prototype,
  "maskGenAlgorithm",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      context: 2,
      defaultValue: 20,
    }),
  ],
  RsaSaPssParams.prototype,
  "saltLength",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      context: 3,
      defaultValue: 1,
    }),
  ],
  RsaSaPssParams.prototype,
  "trailerField",
  void 0
);
var RSASSA_PSS = new AlgorithmIdentifier({
  algorithm: id_RSASSA_PSS,
  parameters: AsnConvert.serialize(new RsaSaPssParams()),
});

// node_modules/@peculiar/asn1-rsa/build/es2015/parameters/rsassa_pkcs1_v1_5.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DigestInfo = class {
  digestAlgorithm = new AlgorithmIdentifier();
  digest = new OctetString2();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(DigestInfo, "DigestInfo");
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  DigestInfo.prototype,
  "digestAlgorithm",
  void 0
);
__decorate([AsnProp({ type: OctetString2 })], DigestInfo.prototype, "digest", void 0);

// node_modules/@peculiar/asn1-rsa/build/es2015/other_prime_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var OtherPrimeInfos_1;
var OtherPrimeInfo = class {
  prime = new ArrayBuffer(0);
  exponent = new ArrayBuffer(0);
  coefficient = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(OtherPrimeInfo, "OtherPrimeInfo");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  OtherPrimeInfo.prototype,
  "prime",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  OtherPrimeInfo.prototype,
  "exponent",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  OtherPrimeInfo.prototype,
  "coefficient",
  void 0
);
var OtherPrimeInfos = (OtherPrimeInfos_1 = /* @__PURE__ */ __name(
  class OtherPrimeInfos2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, OtherPrimeInfos_1.prototype);
    }
  },
  "OtherPrimeInfos"
));
OtherPrimeInfos = OtherPrimeInfos_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: OtherPrimeInfo,
    }),
  ],
  OtherPrimeInfos
);

// node_modules/@peculiar/asn1-rsa/build/es2015/rsa_private_key.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RSAPrivateKey = class {
  version = 0;
  modulus = new ArrayBuffer(0);
  publicExponent = new ArrayBuffer(0);
  privateExponent = new ArrayBuffer(0);
  prime1 = new ArrayBuffer(0);
  prime2 = new ArrayBuffer(0);
  exponent1 = new ArrayBuffer(0);
  exponent2 = new ArrayBuffer(0);
  coefficient = new ArrayBuffer(0);
  otherPrimeInfos;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(RSAPrivateKey, "RSAPrivateKey");
__decorate([AsnProp({ type: AsnPropTypes.Integer })], RSAPrivateKey.prototype, "version", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPrivateKey.prototype,
  "modulus",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPrivateKey.prototype,
  "publicExponent",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPrivateKey.prototype,
  "privateExponent",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPrivateKey.prototype,
  "prime1",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPrivateKey.prototype,
  "prime2",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPrivateKey.prototype,
  "exponent1",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPrivateKey.prototype,
  "exponent2",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPrivateKey.prototype,
  "coefficient",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OtherPrimeInfos,
      optional: true,
    }),
  ],
  RSAPrivateKey.prototype,
  "otherPrimeInfos",
  void 0
);

// node_modules/@peculiar/asn1-rsa/build/es2015/rsa_public_key.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RSAPublicKey = class {
  modulus = new ArrayBuffer(0);
  publicExponent = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(RSAPublicKey, "RSAPublicKey");
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPublicKey.prototype,
  "modulus",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter,
    }),
  ],
  RSAPublicKey.prototype,
  "publicExponent",
  void 0
);

// node_modules/tsyringe/dist/esm5/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/types/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/types/lifecycle.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Lifecycle;
(function (Lifecycle2) {
  Lifecycle2[(Lifecycle2["Transient"] = 0)] = "Transient";
  Lifecycle2[(Lifecycle2["Singleton"] = 1)] = "Singleton";
  Lifecycle2[(Lifecycle2["ResolutionScoped"] = 2)] = "ResolutionScoped";
  Lifecycle2[(Lifecycle2["ContainerScoped"] = 3)] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));
var lifecycle_default = Lifecycle;

// node_modules/tsyringe/dist/esm5/decorators/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/node_modules/tslib/modules/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_tslib87 = __toESM(require_tslib(), 1);
var {
  __extends,
  __assign,
  __rest,
  __decorate: __decorate2,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __exportStar,
  __createBinding,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet: __classPrivateFieldGet2,
  __classPrivateFieldSet: __classPrivateFieldSet2,
} = import_tslib87.default;

// node_modules/tsyringe/dist/esm5/reflection-helpers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
function getParamInfo(target) {
  var params = Reflect.getMetadata("design:paramtypes", target) || [];
  var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
  Object.keys(injectionTokens).forEach(function (key) {
    params[+key] = injectionTokens[key];
  });
  return params;
}
__name(getParamInfo, "getParamInfo");

// node_modules/tsyringe/dist/esm5/dependency-container.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/providers/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/providers/class-provider.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isClassProvider(provider) {
  return !!provider.useClass;
}
__name(isClassProvider, "isClassProvider");

// node_modules/tsyringe/dist/esm5/providers/factory-provider.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isFactoryProvider(provider) {
  return !!provider.useFactory;
}
__name(isFactoryProvider, "isFactoryProvider");

// node_modules/tsyringe/dist/esm5/providers/injection-token.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/lazy-helpers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DelayedConstructor = (function () {
  function DelayedConstructor2(wrap) {
    this.wrap = wrap;
    this.reflectMethods = [
      "get",
      "getPrototypeOf",
      "setPrototypeOf",
      "getOwnPropertyDescriptor",
      "defineProperty",
      "has",
      "set",
      "deleteProperty",
      "apply",
      "construct",
      "ownKeys",
    ];
  }
  __name(DelayedConstructor2, "DelayedConstructor");
  DelayedConstructor2.prototype.createProxy = function (createObject) {
    var _this = this;
    var target = {};
    var init = false;
    var value;
    var delayedObject = /* @__PURE__ */ __name(function () {
      if (!init) {
        value = createObject(_this.wrap());
        init = true;
      }
      return value;
    }, "delayedObject");
    return new Proxy(target, this.createHandler(delayedObject));
  };
  DelayedConstructor2.prototype.createHandler = function (delayedObject) {
    var handler = {};
    var install = /* @__PURE__ */ __name(function (name) {
      handler[name] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        args[0] = delayedObject();
        var method = Reflect[name];
        return method.apply(void 0, __spread(args));
      };
    }, "install");
    this.reflectMethods.forEach(install);
    return handler;
  };
  return DelayedConstructor2;
})();

// node_modules/tsyringe/dist/esm5/providers/injection-token.js
function isNormalToken(token) {
  return typeof token === "string" || typeof token === "symbol";
}
__name(isNormalToken, "isNormalToken");
function isTokenDescriptor(descriptor) {
  return typeof descriptor === "object" && "token" in descriptor && "multiple" in descriptor;
}
__name(isTokenDescriptor, "isTokenDescriptor");
function isTransformDescriptor(descriptor) {
  return typeof descriptor === "object" && "token" in descriptor && "transform" in descriptor;
}
__name(isTransformDescriptor, "isTransformDescriptor");
function isConstructorToken(token) {
  return typeof token === "function" || token instanceof DelayedConstructor;
}
__name(isConstructorToken, "isConstructorToken");

// node_modules/tsyringe/dist/esm5/providers/token-provider.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isTokenProvider(provider) {
  return !!provider.useToken;
}
__name(isTokenProvider, "isTokenProvider");

// node_modules/tsyringe/dist/esm5/providers/value-provider.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isValueProvider(provider) {
  return provider.useValue != void 0;
}
__name(isValueProvider, "isValueProvider");

// node_modules/tsyringe/dist/esm5/providers/provider.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isProvider(provider) {
  return (
    isClassProvider(provider) ||
    isValueProvider(provider) ||
    isTokenProvider(provider) ||
    isFactoryProvider(provider)
  );
}
__name(isProvider, "isProvider");

// node_modules/tsyringe/dist/esm5/registry.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/registry-base.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var RegistryBase = (function () {
  function RegistryBase2() {
    this._registryMap = /* @__PURE__ */ new Map();
  }
  __name(RegistryBase2, "RegistryBase");
  RegistryBase2.prototype.entries = function () {
    return this._registryMap.entries();
  };
  RegistryBase2.prototype.getAll = function (key) {
    this.ensure(key);
    return this._registryMap.get(key);
  };
  RegistryBase2.prototype.get = function (key) {
    this.ensure(key);
    var value = this._registryMap.get(key);
    return value[value.length - 1] || null;
  };
  RegistryBase2.prototype.set = function (key, value) {
    this.ensure(key);
    this._registryMap.get(key).push(value);
  };
  RegistryBase2.prototype.setAll = function (key, value) {
    this._registryMap.set(key, value);
  };
  RegistryBase2.prototype.has = function (key) {
    this.ensure(key);
    return this._registryMap.get(key).length > 0;
  };
  RegistryBase2.prototype.clear = function () {
    this._registryMap.clear();
  };
  RegistryBase2.prototype.ensure = function (key) {
    if (!this._registryMap.has(key)) {
      this._registryMap.set(key, []);
    }
  };
  return RegistryBase2;
})();
var registry_base_default = RegistryBase;

// node_modules/tsyringe/dist/esm5/registry.js
var Registry = (function (_super) {
  __extends(Registry2, _super);
  function Registry2() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  __name(Registry2, "Registry");
  return Registry2;
})(registry_base_default);
var registry_default = Registry;

// node_modules/tsyringe/dist/esm5/resolution-context.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ResolutionContext = (function () {
  function ResolutionContext2() {
    this.scopedResolutions = /* @__PURE__ */ new Map();
  }
  __name(ResolutionContext2, "ResolutionContext");
  return ResolutionContext2;
})();
var resolution_context_default = ResolutionContext;

// node_modules/tsyringe/dist/esm5/error-helpers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function formatDependency(params, idx) {
  if (params === null) {
    return "at position #" + idx;
  }
  var argName = params.split(",")[idx].trim();
  return '"' + argName + '" at position #' + idx;
}
__name(formatDependency, "formatDependency");
function composeErrorMessage(msg, e, indent) {
  if (indent === void 0) {
    indent = "    ";
  }
  return __spread(
    [msg],
    e.message.split("\n").map(function (l) {
      return indent + l;
    })
  ).join("\n");
}
__name(composeErrorMessage, "composeErrorMessage");
function formatErrorCtor(ctor, paramIdx, error3) {
  var _a3 = __read(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2),
    _b = _a3[1],
    params = _b === void 0 ? null : _b;
  var dep = formatDependency(params, paramIdx);
  return composeErrorMessage(
    "Cannot inject the dependency " + dep + ' of "' + ctor.name + '" constructor. Reason:',
    error3
  );
}
__name(formatErrorCtor, "formatErrorCtor");

// node_modules/tsyringe/dist/esm5/types/disposable.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function isDisposable(value) {
  if (typeof value.dispose !== "function") return false;
  var disposeFun = value.dispose;
  if (disposeFun.length > 0) {
    return false;
  }
  return true;
}
__name(isDisposable, "isDisposable");

// node_modules/tsyringe/dist/esm5/interceptors.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var PreResolutionInterceptors = (function (_super) {
  __extends(PreResolutionInterceptors2, _super);
  function PreResolutionInterceptors2() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  __name(PreResolutionInterceptors2, "PreResolutionInterceptors");
  return PreResolutionInterceptors2;
})(registry_base_default);
var PostResolutionInterceptors = (function (_super) {
  __extends(PostResolutionInterceptors2, _super);
  function PostResolutionInterceptors2() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  __name(PostResolutionInterceptors2, "PostResolutionInterceptors");
  return PostResolutionInterceptors2;
})(registry_base_default);
var Interceptors = (function () {
  function Interceptors2() {
    this.preResolution = new PreResolutionInterceptors();
    this.postResolution = new PostResolutionInterceptors();
  }
  __name(Interceptors2, "Interceptors");
  return Interceptors2;
})();
var interceptors_default = Interceptors;

// node_modules/tsyringe/dist/esm5/dependency-container.js
var typeInfo = /* @__PURE__ */ new Map();
var InternalDependencyContainer = (function () {
  function InternalDependencyContainer2(parent) {
    this.parent = parent;
    this._registry = new registry_default();
    this.interceptors = new interceptors_default();
    this.disposed = false;
    this.disposables = /* @__PURE__ */ new Set();
  }
  __name(InternalDependencyContainer2, "InternalDependencyContainer");
  InternalDependencyContainer2.prototype.register = function (
    token,
    providerOrConstructor,
    options
  ) {
    if (options === void 0) {
      options = { lifecycle: lifecycle_default.Transient };
    }
    this.ensureNotDisposed();
    var provider;
    if (!isProvider(providerOrConstructor)) {
      provider = { useClass: providerOrConstructor };
    } else {
      provider = providerOrConstructor;
    }
    if (isTokenProvider(provider)) {
      var path = [token];
      var tokenProvider = provider;
      while (tokenProvider != null) {
        var currentToken = tokenProvider.useToken;
        if (path.includes(currentToken)) {
          throw new Error(
            "Token registration cycle detected! " + __spread(path, [currentToken]).join(" -> ")
          );
        }
        path.push(currentToken);
        var registration = this._registry.get(currentToken);
        if (registration && isTokenProvider(registration.provider)) {
          tokenProvider = registration.provider;
        } else {
          tokenProvider = null;
        }
      }
    }
    if (
      options.lifecycle === lifecycle_default.Singleton ||
      options.lifecycle == lifecycle_default.ContainerScoped ||
      options.lifecycle == lifecycle_default.ResolutionScoped
    ) {
      if (isValueProvider(provider) || isFactoryProvider(provider)) {
        throw new Error(
          'Cannot use lifecycle "' +
            lifecycle_default[options.lifecycle] +
            '" with ValueProviders or FactoryProviders'
        );
      }
    }
    this._registry.set(token, { provider, options });
    return this;
  };
  InternalDependencyContainer2.prototype.registerType = function (from, to) {
    this.ensureNotDisposed();
    if (isNormalToken(to)) {
      return this.register(from, {
        useToken: to,
      });
    }
    return this.register(from, {
      useClass: to,
    });
  };
  InternalDependencyContainer2.prototype.registerInstance = function (token, instance2) {
    this.ensureNotDisposed();
    return this.register(token, {
      useValue: instance2,
    });
  };
  InternalDependencyContainer2.prototype.registerSingleton = function (from, to) {
    this.ensureNotDisposed();
    if (isNormalToken(from)) {
      if (isNormalToken(to)) {
        return this.register(
          from,
          {
            useToken: to,
          },
          { lifecycle: lifecycle_default.Singleton }
        );
      } else if (to) {
        return this.register(
          from,
          {
            useClass: to,
          },
          { lifecycle: lifecycle_default.Singleton }
        );
      }
      throw new Error('Cannot register a type name as a singleton without a "to" token');
    }
    var useClass = from;
    if (to && !isNormalToken(to)) {
      useClass = to;
    }
    return this.register(
      from,
      {
        useClass,
      },
      { lifecycle: lifecycle_default.Singleton }
    );
  };
  InternalDependencyContainer2.prototype.resolve = function (token, context2, isOptional) {
    if (context2 === void 0) {
      context2 = new resolution_context_default();
    }
    if (isOptional === void 0) {
      isOptional = false;
    }
    this.ensureNotDisposed();
    var registration = this.getRegistration(token);
    if (!registration && isNormalToken(token)) {
      if (isOptional) {
        return void 0;
      }
      throw new Error(
        'Attempted to resolve unregistered dependency token: "' + token.toString() + '"'
      );
    }
    this.executePreResolutionInterceptor(token, "Single");
    if (registration) {
      var result = this.resolveRegistration(registration, context2);
      this.executePostResolutionInterceptor(token, result, "Single");
      return result;
    }
    if (isConstructorToken(token)) {
      var result = this.construct(token, context2);
      this.executePostResolutionInterceptor(token, result, "Single");
      return result;
    }
    throw new Error(
      "Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function."
    );
  };
  InternalDependencyContainer2.prototype.executePreResolutionInterceptor = function (
    token,
    resolutionType
  ) {
    var e_1, _a3;
    if (this.interceptors.preResolution.has(token)) {
      var remainingInterceptors = [];
      try {
        for (
          var _b = __values(this.interceptors.preResolution.getAll(token)), _c = _b.next();
          !_c.done;
          _c = _b.next()
        ) {
          var interceptor = _c.value;
          if (interceptor.options.frequency != "Once") {
            remainingInterceptors.push(interceptor);
          }
          interceptor.callback(token, resolutionType);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      this.interceptors.preResolution.setAll(token, remainingInterceptors);
    }
  };
  InternalDependencyContainer2.prototype.executePostResolutionInterceptor = function (
    token,
    result,
    resolutionType
  ) {
    var e_2, _a3;
    if (this.interceptors.postResolution.has(token)) {
      var remainingInterceptors = [];
      try {
        for (
          var _b = __values(this.interceptors.postResolution.getAll(token)), _c = _b.next();
          !_c.done;
          _c = _b.next()
        ) {
          var interceptor = _c.value;
          if (interceptor.options.frequency != "Once") {
            remainingInterceptors.push(interceptor);
          }
          interceptor.callback(token, result, resolutionType);
        }
      } catch (e_2_1) {
        e_2 = { error: e_2_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
      this.interceptors.postResolution.setAll(token, remainingInterceptors);
    }
  };
  InternalDependencyContainer2.prototype.resolveRegistration = function (registration, context2) {
    this.ensureNotDisposed();
    if (
      registration.options.lifecycle === lifecycle_default.ResolutionScoped &&
      context2.scopedResolutions.has(registration)
    ) {
      return context2.scopedResolutions.get(registration);
    }
    var isSingleton = registration.options.lifecycle === lifecycle_default.Singleton;
    var isContainerScoped = registration.options.lifecycle === lifecycle_default.ContainerScoped;
    var returnInstance = isSingleton || isContainerScoped;
    var resolved;
    if (isValueProvider(registration.provider)) {
      resolved = registration.provider.useValue;
    } else if (isTokenProvider(registration.provider)) {
      resolved = returnInstance
        ? registration.instance ||
          (registration.instance = this.resolve(registration.provider.useToken, context2))
        : this.resolve(registration.provider.useToken, context2);
    } else if (isClassProvider(registration.provider)) {
      resolved = returnInstance
        ? registration.instance ||
          (registration.instance = this.construct(registration.provider.useClass, context2))
        : this.construct(registration.provider.useClass, context2);
    } else if (isFactoryProvider(registration.provider)) {
      resolved = registration.provider.useFactory(this);
    } else {
      resolved = this.construct(registration.provider, context2);
    }
    if (registration.options.lifecycle === lifecycle_default.ResolutionScoped) {
      context2.scopedResolutions.set(registration, resolved);
    }
    return resolved;
  };
  InternalDependencyContainer2.prototype.resolveAll = function (token, context2, isOptional) {
    var _this = this;
    if (context2 === void 0) {
      context2 = new resolution_context_default();
    }
    if (isOptional === void 0) {
      isOptional = false;
    }
    this.ensureNotDisposed();
    var registrations = this.getAllRegistrations(token);
    if (!registrations && isNormalToken(token)) {
      if (isOptional) {
        return [];
      }
      throw new Error(
        'Attempted to resolve unregistered dependency token: "' + token.toString() + '"'
      );
    }
    this.executePreResolutionInterceptor(token, "All");
    if (registrations) {
      var result_1 = registrations.map(function (item) {
        return _this.resolveRegistration(item, context2);
      });
      this.executePostResolutionInterceptor(token, result_1, "All");
      return result_1;
    }
    var result = [this.construct(token, context2)];
    this.executePostResolutionInterceptor(token, result, "All");
    return result;
  };
  InternalDependencyContainer2.prototype.isRegistered = function (token, recursive) {
    if (recursive === void 0) {
      recursive = false;
    }
    this.ensureNotDisposed();
    return (
      this._registry.has(token) ||
      (recursive && (this.parent || false) && this.parent.isRegistered(token, true))
    );
  };
  InternalDependencyContainer2.prototype.reset = function () {
    this.ensureNotDisposed();
    this._registry.clear();
    this.interceptors.preResolution.clear();
    this.interceptors.postResolution.clear();
  };
  InternalDependencyContainer2.prototype.clearInstances = function () {
    var e_3, _a3;
    this.ensureNotDisposed();
    try {
      for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read(_c.value, 2),
          token = _d[0],
          registrations = _d[1];
        this._registry.setAll(
          token,
          registrations
            .filter(function (registration) {
              return !isValueProvider(registration.provider);
            })
            .map(function (registration) {
              registration.instance = void 0;
              return registration;
            })
        );
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
  };
  InternalDependencyContainer2.prototype.createChildContainer = function () {
    var e_4, _a3;
    this.ensureNotDisposed();
    var childContainer = new InternalDependencyContainer2(this);
    try {
      for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read(_c.value, 2),
          token = _d[0],
          registrations = _d[1];
        if (
          registrations.some(function (_a4) {
            var options = _a4.options;
            return options.lifecycle === lifecycle_default.ContainerScoped;
          })
        ) {
          childContainer._registry.setAll(
            token,
            registrations.map(function (registration) {
              if (registration.options.lifecycle === lifecycle_default.ContainerScoped) {
                return {
                  provider: registration.provider,
                  options: registration.options,
                };
              }
              return registration;
            })
          );
        }
      }
    } catch (e_4_1) {
      e_4 = { error: e_4_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
      } finally {
        if (e_4) throw e_4.error;
      }
    }
    return childContainer;
  };
  InternalDependencyContainer2.prototype.beforeResolution = function (token, callback, options) {
    if (options === void 0) {
      options = { frequency: "Always" };
    }
    this.interceptors.preResolution.set(token, {
      callback,
      options,
    });
  };
  InternalDependencyContainer2.prototype.afterResolution = function (token, callback, options) {
    if (options === void 0) {
      options = { frequency: "Always" };
    }
    this.interceptors.postResolution.set(token, {
      callback,
      options,
    });
  };
  InternalDependencyContainer2.prototype.dispose = function () {
    return __awaiter(this, void 0, void 0, function () {
      var promises;
      return __generator(this, function (_a3) {
        switch (_a3.label) {
          case 0:
            this.disposed = true;
            promises = [];
            this.disposables.forEach(function (disposable) {
              var maybePromise = disposable.dispose();
              if (maybePromise) {
                promises.push(maybePromise);
              }
            });
            return [4, Promise.all(promises)];
          case 1:
            _a3.sent();
            return [2];
        }
      });
    });
  };
  InternalDependencyContainer2.prototype.getRegistration = function (token) {
    if (this.isRegistered(token)) {
      return this._registry.get(token);
    }
    if (this.parent) {
      return this.parent.getRegistration(token);
    }
    return null;
  };
  InternalDependencyContainer2.prototype.getAllRegistrations = function (token) {
    if (this.isRegistered(token)) {
      return this._registry.getAll(token);
    }
    if (this.parent) {
      return this.parent.getAllRegistrations(token);
    }
    return null;
  };
  InternalDependencyContainer2.prototype.construct = function (ctor, context2) {
    var _this = this;
    if (ctor instanceof DelayedConstructor) {
      return ctor.createProxy(function (target) {
        return _this.resolve(target, context2);
      });
    }
    var instance2 = (function () {
      var paramInfo = typeInfo.get(ctor);
      if (!paramInfo || paramInfo.length === 0) {
        if (ctor.length === 0) {
          return new ctor();
        } else {
          throw new Error('TypeInfo not known for "' + ctor.name + '"');
        }
      }
      var params = paramInfo.map(_this.resolveParams(context2, ctor));
      return new (ctor.bind.apply(ctor, __spread([void 0], params)))();
    })();
    if (isDisposable(instance2)) {
      this.disposables.add(instance2);
    }
    return instance2;
  };
  InternalDependencyContainer2.prototype.resolveParams = function (context2, ctor) {
    var _this = this;
    return function (param, idx) {
      var _a3, _b, _c;
      try {
        if (isTokenDescriptor(param)) {
          if (isTransformDescriptor(param)) {
            return param.multiple
              ? (_a3 = _this.resolve(param.transform)).transform.apply(
                  _a3,
                  __spread(
                    [
                      _this.resolveAll(
                        param.token,
                        new resolution_context_default(),
                        param.isOptional
                      ),
                    ],
                    param.transformArgs
                  )
                )
              : (_b = _this.resolve(param.transform)).transform.apply(
                  _b,
                  __spread(
                    [_this.resolve(param.token, context2, param.isOptional)],
                    param.transformArgs
                  )
                );
          } else {
            return param.multiple
              ? _this.resolveAll(param.token, new resolution_context_default(), param.isOptional)
              : _this.resolve(param.token, context2, param.isOptional);
          }
        } else if (isTransformDescriptor(param)) {
          return (_c = _this.resolve(param.transform, context2)).transform.apply(
            _c,
            __spread([_this.resolve(param.token, context2)], param.transformArgs)
          );
        }
        return _this.resolve(param, context2);
      } catch (e) {
        throw new Error(formatErrorCtor(ctor, idx, e));
      }
    };
  };
  InternalDependencyContainer2.prototype.ensureNotDisposed = function () {
    if (this.disposed) {
      throw new Error(
        "This container has been disposed, you cannot interact with a disposed container"
      );
    }
  };
  return InternalDependencyContainer2;
})();
var instance = new InternalDependencyContainer();

// node_modules/tsyringe/dist/esm5/decorators/inject.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/decorators/injectable.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function injectable(options) {
  return function (target) {
    typeInfo.set(target, getParamInfo(target));
    if (options && options.token) {
      if (!Array.isArray(options.token)) {
        instance.register(options.token, target);
      } else {
        options.token.forEach(function (token) {
          instance.register(token, target);
        });
      }
    }
  };
}
__name(injectable, "injectable");
var injectable_default = injectable;

// node_modules/tsyringe/dist/esm5/decorators/registry.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/decorators/singleton.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/decorators/inject-all.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/decorators/scoped.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/factories/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/factories/instance-per-container-caching-factory.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/tsyringe/dist/esm5/index.js
if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
  throw new Error(
    `tsyringe requires a reflect polyfill. Please add 'import "reflect-metadata"' to the top of your entry point.`
  );
}

// node_modules/@peculiar/asn1-pkcs9/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-pfx/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-pfx/build/es2015/attribute.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var PKCS12AttrSet_1;
var PKCS12Attribute = class {
  attrId = "";
  attrValues = [];
  constructor(params = {}) {
    Object.assign(params);
  }
};
__name(PKCS12Attribute, "PKCS12Attribute");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  PKCS12Attribute.prototype,
  "attrId",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      repeated: "set",
    }),
  ],
  PKCS12Attribute.prototype,
  "attrValues",
  void 0
);
var PKCS12AttrSet = (PKCS12AttrSet_1 = /* @__PURE__ */ __name(
  class PKCS12AttrSet2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, PKCS12AttrSet_1.prototype);
    }
  },
  "PKCS12AttrSet"
));
PKCS12AttrSet = PKCS12AttrSet_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: PKCS12Attribute,
    }),
  ],
  PKCS12AttrSet
);

// node_modules/@peculiar/asn1-pfx/build/es2015/authenticated_safe.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AuthenticatedSafe_1;
var AuthenticatedSafe = (AuthenticatedSafe_1 = /* @__PURE__ */ __name(
  class AuthenticatedSafe2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, AuthenticatedSafe_1.prototype);
    }
  },
  "AuthenticatedSafe"
));
AuthenticatedSafe = AuthenticatedSafe_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: ContentInfo,
    }),
  ],
  AuthenticatedSafe
);

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/cert_bag.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/types.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-pfx/build/es2015/object_identifiers.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_rsadsi = "1.2.840.113549";
var id_pkcs = `${id_rsadsi}.1`;
var id_pkcs_12 = `${id_pkcs}.12`;
var id_pkcs_12PbeIds = `${id_pkcs_12}.1`;
var id_pbeWithSHAAnd128BitRC4 = `${id_pkcs_12PbeIds}.1`;
var id_pbeWithSHAAnd40BitRC4 = `${id_pkcs_12PbeIds}.2`;
var id_pbeWithSHAAnd3_KeyTripleDES_CBC = `${id_pkcs_12PbeIds}.3`;
var id_pbeWithSHAAnd2_KeyTripleDES_CBC = `${id_pkcs_12PbeIds}.4`;
var id_pbeWithSHAAnd128BitRC2_CBC = `${id_pkcs_12PbeIds}.5`;
var id_pbewithSHAAnd40BitRC2_CBC = `${id_pkcs_12PbeIds}.6`;
var id_bagtypes = `${id_pkcs_12}.10.1`;

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/types.js
var id_keyBag = `${id_bagtypes}.1`;
var id_pkcs8ShroudedKeyBag = `${id_bagtypes}.2`;
var id_certBag = `${id_bagtypes}.3`;
var id_CRLBag = `${id_bagtypes}.4`;
var id_SecretBag = `${id_bagtypes}.5`;
var id_SafeContents = `${id_bagtypes}.6`;
var id_pkcs_9 = "1.2.840.113549.1.9";

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/cert_bag.js
var CertBag = class {
  certId = "";
  certValue = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(CertBag, "CertBag");
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], CertBag.prototype, "certId", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      context: 0,
    }),
  ],
  CertBag.prototype,
  "certValue",
  void 0
);
var id_certTypes = `${id_pkcs_9}.22`;
var id_x509Certificate = `${id_certTypes}.1`;
var id_sdsiCertificate = `${id_certTypes}.2`;

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/crl_bag.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var CRLBag = class {
  crlId = "";
  crltValue = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(CRLBag, "CRLBag");
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], CRLBag.prototype, "crlId", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      context: 0,
    }),
  ],
  CRLBag.prototype,
  "crltValue",
  void 0
);
var id_crlTypes = `${id_pkcs_9}.23`;
var id_x509CRL = `${id_crlTypes}.1`;

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/key_bag.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-pkcs8/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-pkcs8/build/es2015/encrypted_private_key_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var EncryptedData = class extends OctetString2 {};
__name(EncryptedData, "EncryptedData");
var EncryptedPrivateKeyInfo = class {
  encryptionAlgorithm = new AlgorithmIdentifier();
  encryptedData = new EncryptedData();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(EncryptedPrivateKeyInfo, "EncryptedPrivateKeyInfo");
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  EncryptedPrivateKeyInfo.prototype,
  "encryptionAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: EncryptedData })],
  EncryptedPrivateKeyInfo.prototype,
  "encryptedData",
  void 0
);

// node_modules/@peculiar/asn1-pkcs8/build/es2015/private_key_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Attributes_1;
var Version2;
(function (Version4) {
  Version4[(Version4["v1"] = 0)] = "v1";
})(Version2 || (Version2 = {}));
var PrivateKey = class extends OctetString2 {};
__name(PrivateKey, "PrivateKey");
var Attributes = (Attributes_1 = /* @__PURE__ */ __name(
  class Attributes2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, Attributes_1.prototype);
    }
  },
  "Attributes"
));
Attributes = Attributes_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: Attribute,
    }),
  ],
  Attributes
);
var PrivateKeyInfo = class {
  version = Version2.v1;
  privateKeyAlgorithm = new AlgorithmIdentifier();
  privateKey = new PrivateKey();
  attributes;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(PrivateKeyInfo, "PrivateKeyInfo");
__decorate([AsnProp({ type: AsnPropTypes.Integer })], PrivateKeyInfo.prototype, "version", void 0);
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  PrivateKeyInfo.prototype,
  "privateKeyAlgorithm",
  void 0
);
__decorate([AsnProp({ type: PrivateKey })], PrivateKeyInfo.prototype, "privateKey", void 0);
__decorate(
  [
    AsnProp({
      type: Attributes,
      implicit: true,
      context: 0,
      optional: true,
    }),
  ],
  PrivateKeyInfo.prototype,
  "attributes",
  void 0
);

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/key_bag.js
var KeyBag = /* @__PURE__ */ __name(class KeyBag2 extends PrivateKeyInfo {}, "KeyBag");
KeyBag = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], KeyBag);

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/pkcs8_shrouded_key_bag.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var PKCS8ShroudedKeyBag = /* @__PURE__ */ __name(
  class PKCS8ShroudedKeyBag2 extends EncryptedPrivateKeyInfo {},
  "PKCS8ShroudedKeyBag"
);
PKCS8ShroudedKeyBag = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], PKCS8ShroudedKeyBag);

// node_modules/@peculiar/asn1-pfx/build/es2015/bags/secret_bag.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SecretBag = class {
  secretTypeId = "";
  secretValue = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(SecretBag, "SecretBag");
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  SecretBag.prototype,
  "secretTypeId",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      context: 0,
    }),
  ],
  SecretBag.prototype,
  "secretValue",
  void 0
);

// node_modules/@peculiar/asn1-pfx/build/es2015/mac_data.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var MacData = class {
  mac = new DigestInfo();
  macSalt = new OctetString2();
  iterations = 1;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(MacData, "MacData");
__decorate([AsnProp({ type: DigestInfo })], MacData.prototype, "mac", void 0);
__decorate([AsnProp({ type: OctetString2 })], MacData.prototype, "macSalt", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Integer,
      defaultValue: 1,
    }),
  ],
  MacData.prototype,
  "iterations",
  void 0
);

// node_modules/@peculiar/asn1-pfx/build/es2015/pfx.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var PFX = class {
  version = 3;
  authSafe = new ContentInfo();
  macData = new MacData();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(PFX, "PFX");
__decorate([AsnProp({ type: AsnPropTypes.Integer })], PFX.prototype, "version", void 0);
__decorate([AsnProp({ type: ContentInfo })], PFX.prototype, "authSafe", void 0);
__decorate(
  [
    AsnProp({
      type: MacData,
      optional: true,
    }),
  ],
  PFX.prototype,
  "macData",
  void 0
);

// node_modules/@peculiar/asn1-pfx/build/es2015/safe_bag.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SafeContents_1;
var SafeBag = class {
  bagId = "";
  bagValue = new ArrayBuffer(0);
  bagAttributes;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(SafeBag, "SafeBag");
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], SafeBag.prototype, "bagId", void 0);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.Any,
      context: 0,
    }),
  ],
  SafeBag.prototype,
  "bagValue",
  void 0
);
__decorate(
  [
    AsnProp({
      type: PKCS12Attribute,
      repeated: "set",
      optional: true,
    }),
  ],
  SafeBag.prototype,
  "bagAttributes",
  void 0
);
var SafeContents = (SafeContents_1 = /* @__PURE__ */ __name(
  class SafeContents2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, SafeContents_1.prototype);
    }
  },
  "SafeContents"
));
SafeContents = SafeContents_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: SafeBag,
    }),
  ],
  SafeContents
);

// node_modules/@peculiar/asn1-pkcs9/build/es2015/index.js
var ExtensionRequest_1;
var ExtendedCertificateAttributes_1;
var SMIMECapabilities_1;
var id_pkcs9 = "1.2.840.113549.1.9";
var id_pkcs9_mo = `${id_pkcs9}.0`;
var id_pkcs9_oc = `${id_pkcs9}.24`;
var id_pkcs9_at = `${id_pkcs9}.25`;
var id_pkcs9_sx = `${id_pkcs9}.26`;
var id_pkcs9_mr = `${id_pkcs9}.27`;
var id_pkcs9_oc_pkcsEntity = `${id_pkcs9_oc}.1`;
var id_pkcs9_oc_naturalPerson = `${id_pkcs9_oc}.2`;
var id_pkcs9_at_emailAddress = `${id_pkcs9}.1`;
var id_pkcs9_at_unstructuredName = `${id_pkcs9}.2`;
var id_pkcs9_at_contentType = `${id_pkcs9}.3`;
var id_pkcs9_at_messageDigest = `${id_pkcs9}.4`;
var id_pkcs9_at_signingTime = `${id_pkcs9}.5`;
var id_pkcs9_at_counterSignature = `${id_pkcs9}.6`;
var id_pkcs9_at_challengePassword = `${id_pkcs9}.7`;
var id_pkcs9_at_unstructuredAddress = `${id_pkcs9}.8`;
var id_pkcs9_at_extendedCertificateAttributes = `${id_pkcs9}.9`;
var id_pkcs9_at_signingDescription = `${id_pkcs9}.13`;
var id_pkcs9_at_extensionRequest = `${id_pkcs9}.14`;
var id_pkcs9_at_smimeCapabilities = `${id_pkcs9}.15`;
var id_pkcs9_at_friendlyName = `${id_pkcs9}.20`;
var id_pkcs9_at_localKeyId = `${id_pkcs9}.21`;
var id_pkcs9_at_pkcs15Token = `${id_pkcs9_at}.1`;
var id_pkcs9_at_encryptedPrivateKeyInfo = `${id_pkcs9_at}.2`;
var id_pkcs9_at_randomNonce = `${id_pkcs9_at}.3`;
var id_pkcs9_at_sequenceNumber = `${id_pkcs9_at}.4`;
var id_pkcs9_at_pkcs7PDU = `${id_pkcs9_at}.5`;
var id_ietf_at = "1.3.6.1.5.5.7.9";
var id_pkcs9_at_dateOfBirth = `${id_ietf_at}.1`;
var id_pkcs9_at_placeOfBirth = `${id_ietf_at}.2`;
var id_pkcs9_at_gender = `${id_ietf_at}.3`;
var id_pkcs9_at_countryOfCitizenship = `${id_ietf_at}.4`;
var id_pkcs9_at_countryOfResidence = `${id_ietf_at}.5`;
var id_pkcs9_sx_pkcs9String = `${id_pkcs9_sx}.1`;
var id_pkcs9_sx_signingTime = `${id_pkcs9_sx}.2`;
var id_pkcs9_mr_caseIgnoreMatch = `${id_pkcs9_mr}.1`;
var id_pkcs9_mr_signingTimeMatch = `${id_pkcs9_mr}.2`;
var id_smime = `${id_pkcs9}.16`;
var id_certTypes2 = `${id_pkcs9}.22`;
var crlTypes = `${id_pkcs9}.23`;
var id_at_pseudonym = `${id_at}.65`;
var PKCS9String = /* @__PURE__ */ __name(
  class PKCS9String2 extends DirectoryString {
    ia5String;
    constructor(params = {}) {
      super(params);
    }
    toString() {
      const o = {};
      o.toString();
      return this.ia5String || super.toString();
    }
  },
  "PKCS9String"
);
__decorate([AsnProp({ type: AsnPropTypes.IA5String })], PKCS9String.prototype, "ia5String", void 0);
PKCS9String = __decorate([AsnType({ type: AsnTypeTypes.Choice })], PKCS9String);
var Pkcs7PDU = /* @__PURE__ */ __name(class Pkcs7PDU2 extends ContentInfo {}, "Pkcs7PDU");
Pkcs7PDU = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], Pkcs7PDU);
var UserPKCS12 = /* @__PURE__ */ __name(class UserPKCS122 extends PFX {}, "UserPKCS12");
UserPKCS12 = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], UserPKCS12);
var EncryptedPrivateKeyInfo2 = /* @__PURE__ */ __name(
  class EncryptedPrivateKeyInfo3 extends EncryptedPrivateKeyInfo {},
  "EncryptedPrivateKeyInfo"
);
EncryptedPrivateKeyInfo2 = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  EncryptedPrivateKeyInfo2
);
var EmailAddress = /* @__PURE__ */ __name(
  class EmailAddress2 {
    value;
    constructor(value = "") {
      this.value = value;
    }
    toString() {
      return this.value;
    }
  },
  "EmailAddress"
);
__decorate([AsnProp({ type: AsnPropTypes.IA5String })], EmailAddress.prototype, "value", void 0);
EmailAddress = __decorate([AsnType({ type: AsnTypeTypes.Choice })], EmailAddress);
var UnstructuredName = /* @__PURE__ */ __name(
  class UnstructuredName2 extends PKCS9String {},
  "UnstructuredName"
);
UnstructuredName = __decorate([AsnType({ type: AsnTypeTypes.Choice })], UnstructuredName);
var UnstructuredAddress = /* @__PURE__ */ __name(
  class UnstructuredAddress2 extends DirectoryString {},
  "UnstructuredAddress"
);
UnstructuredAddress = __decorate([AsnType({ type: AsnTypeTypes.Choice })], UnstructuredAddress);
var DateOfBirth = /* @__PURE__ */ __name(
  class DateOfBirth2 {
    value;
    constructor(value = /* @__PURE__ */ new Date()) {
      this.value = value;
    }
  },
  "DateOfBirth"
);
__decorate(
  [AsnProp({ type: AsnPropTypes.GeneralizedTime })],
  DateOfBirth.prototype,
  "value",
  void 0
);
DateOfBirth = __decorate([AsnType({ type: AsnTypeTypes.Choice })], DateOfBirth);
var PlaceOfBirth = /* @__PURE__ */ __name(
  class PlaceOfBirth2 extends DirectoryString {},
  "PlaceOfBirth"
);
PlaceOfBirth = __decorate([AsnType({ type: AsnTypeTypes.Choice })], PlaceOfBirth);
var Gender = /* @__PURE__ */ __name(
  class Gender2 {
    value;
    constructor(value = "M") {
      this.value = value;
    }
    toString() {
      return this.value;
    }
  },
  "Gender"
);
__decorate([AsnProp({ type: AsnPropTypes.PrintableString })], Gender.prototype, "value", void 0);
Gender = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Gender);
var CountryOfCitizenship = /* @__PURE__ */ __name(
  class CountryOfCitizenship2 {
    value;
    constructor(value = "") {
      this.value = value;
    }
    toString() {
      return this.value;
    }
  },
  "CountryOfCitizenship"
);
__decorate(
  [AsnProp({ type: AsnPropTypes.PrintableString })],
  CountryOfCitizenship.prototype,
  "value",
  void 0
);
CountryOfCitizenship = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CountryOfCitizenship);
var CountryOfResidence = /* @__PURE__ */ __name(
  class CountryOfResidence2 extends CountryOfCitizenship {},
  "CountryOfResidence"
);
CountryOfResidence = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CountryOfResidence);
var Pseudonym = /* @__PURE__ */ __name(class Pseudonym2 extends DirectoryString {}, "Pseudonym");
Pseudonym = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Pseudonym);
var ContentType = /* @__PURE__ */ __name(
  class ContentType2 {
    value;
    constructor(value = "") {
      this.value = value;
    }
    toString() {
      return this.value;
    }
  },
  "ContentType"
);
__decorate(
  [AsnProp({ type: AsnPropTypes.ObjectIdentifier })],
  ContentType.prototype,
  "value",
  void 0
);
ContentType = __decorate([AsnType({ type: AsnTypeTypes.Choice })], ContentType);
var SigningTime3 = /* @__PURE__ */ __name(class SigningTime4 extends Time {}, "SigningTime");
SigningTime3 = __decorate([AsnType({ type: AsnTypeTypes.Choice })], SigningTime3);
var SequenceNumber = /* @__PURE__ */ __name(
  class SequenceNumber2 {
    value;
    constructor(value = 0) {
      this.value = value;
    }
    toString() {
      return this.value.toString();
    }
  },
  "SequenceNumber"
);
__decorate([AsnProp({ type: AsnPropTypes.Integer })], SequenceNumber.prototype, "value", void 0);
SequenceNumber = __decorate([AsnType({ type: AsnTypeTypes.Choice })], SequenceNumber);
var CounterSignature3 = /* @__PURE__ */ __name(
  class CounterSignature4 extends SignerInfo {},
  "CounterSignature"
);
CounterSignature3 = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], CounterSignature3);
var ChallengePassword = /* @__PURE__ */ __name(
  class ChallengePassword2 extends DirectoryString {},
  "ChallengePassword"
);
ChallengePassword = __decorate([AsnType({ type: AsnTypeTypes.Choice })], ChallengePassword);
var ExtensionRequest = (ExtensionRequest_1 = /* @__PURE__ */ __name(
  class ExtensionRequest2 extends Extensions {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, ExtensionRequest_1.prototype);
    }
  },
  "ExtensionRequest"
));
ExtensionRequest = ExtensionRequest_1 = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  ExtensionRequest
);
var ExtendedCertificateAttributes = (ExtendedCertificateAttributes_1 = /* @__PURE__ */ __name(
  class ExtendedCertificateAttributes2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, ExtendedCertificateAttributes_1.prototype);
    }
  },
  "ExtendedCertificateAttributes"
));
ExtendedCertificateAttributes = ExtendedCertificateAttributes_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Set,
      itemType: Attribute2,
    }),
  ],
  ExtendedCertificateAttributes
);
var FriendlyName = /* @__PURE__ */ __name(
  class FriendlyName2 {
    value;
    constructor(value = "") {
      this.value = value;
    }
    toString() {
      return this.value;
    }
  },
  "FriendlyName"
);
__decorate([AsnProp({ type: AsnPropTypes.BmpString })], FriendlyName.prototype, "value", void 0);
FriendlyName = __decorate([AsnType({ type: AsnTypeTypes.Choice })], FriendlyName);
var SMIMECapability = /* @__PURE__ */ __name(
  class SMIMECapability2 extends AlgorithmIdentifier {},
  "SMIMECapability"
);
SMIMECapability = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], SMIMECapability);
var SMIMECapabilities = (SMIMECapabilities_1 = /* @__PURE__ */ __name(
  class SMIMECapabilities2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, SMIMECapabilities_1.prototype);
    }
  },
  "SMIMECapabilities"
));
SMIMECapabilities = SMIMECapabilities_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: SMIMECapability,
    }),
  ],
  SMIMECapabilities
);

// node_modules/@peculiar/asn1-csr/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-csr/build/es2015/attributes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Attributes_12;
var Attributes3 = (Attributes_12 = /* @__PURE__ */ __name(
  class Attributes4 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, Attributes_12.prototype);
    }
  },
  "Attributes"
));
Attributes3 = Attributes_12 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: Attribute,
    }),
  ],
  Attributes3
);

// node_modules/@peculiar/asn1-csr/build/es2015/certification_request.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-csr/build/es2015/certification_request_info.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var CertificationRequestInfo = class {
  version = 0;
  subject = new Name();
  subjectPKInfo = new SubjectPublicKeyInfo();
  attributes = new Attributes3();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(CertificationRequestInfo, "CertificationRequestInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  CertificationRequestInfo.prototype,
  "version",
  void 0
);
__decorate([AsnProp({ type: Name })], CertificationRequestInfo.prototype, "subject", void 0);
__decorate(
  [AsnProp({ type: SubjectPublicKeyInfo })],
  CertificationRequestInfo.prototype,
  "subjectPKInfo",
  void 0
);
__decorate(
  [
    AsnProp({
      type: Attributes3,
      implicit: true,
      context: 0,
      optional: true,
    }),
  ],
  CertificationRequestInfo.prototype,
  "attributes",
  void 0
);

// node_modules/@peculiar/asn1-csr/build/es2015/certification_request.js
var CertificationRequest = class {
  certificationRequestInfo = new CertificationRequestInfo();
  certificationRequestInfoRaw;
  signatureAlgorithm = new AlgorithmIdentifier();
  signature = new ArrayBuffer(0);
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(CertificationRequest, "CertificationRequest");
__decorate(
  [
    AsnProp({
      type: CertificationRequestInfo,
      raw: true,
    }),
  ],
  CertificationRequest.prototype,
  "certificationRequestInfo",
  void 0
);
__decorate(
  [AsnProp({ type: AlgorithmIdentifier })],
  CertificationRequest.prototype,
  "signatureAlgorithm",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.BitString })],
  CertificationRequest.prototype,
  "signature",
  void 0
);

// node_modules/@peculiar/x509/build/x509.es.js
var diAlgorithm = "crypto.algorithm";
var AlgorithmProvider = class {
  getAlgorithms() {
    return instance.resolveAll(diAlgorithm);
  }
  toAsnAlgorithm(alg) {
    ({ ...alg });
    for (const algorithm of this.getAlgorithms()) {
      const res = algorithm.toAsnAlgorithm(alg);
      if (res) {
        return res;
      }
    }
    if (/^[0-9.]+$/.test(alg.name)) {
      const res = new AlgorithmIdentifier({ algorithm: alg.name });
      if ("parameters" in alg) {
        const unknown = alg;
        res.parameters = unknown.parameters;
      }
      return res;
    }
    throw new Error("Cannot convert WebCrypto algorithm to ASN.1 algorithm");
  }
  toWebAlgorithm(alg) {
    for (const algorithm of this.getAlgorithms()) {
      const res = algorithm.toWebAlgorithm(alg);
      if (res) {
        return res;
      }
    }
    const unknown = {
      name: alg.algorithm,
      parameters: alg.parameters,
    };
    return unknown;
  }
};
__name(AlgorithmProvider, "AlgorithmProvider");
var diAlgorithmProvider = "crypto.algorithmProvider";
instance.registerSingleton(diAlgorithmProvider, AlgorithmProvider);
var EcAlgorithm_1;
var idVersionOne = "1.3.36.3.3.2.8.1.1";
var idBrainpoolP160r1 = `${idVersionOne}.1`;
var idBrainpoolP160t1 = `${idVersionOne}.2`;
var idBrainpoolP192r1 = `${idVersionOne}.3`;
var idBrainpoolP192t1 = `${idVersionOne}.4`;
var idBrainpoolP224r1 = `${idVersionOne}.5`;
var idBrainpoolP224t1 = `${idVersionOne}.6`;
var idBrainpoolP256r1 = `${idVersionOne}.7`;
var idBrainpoolP256t1 = `${idVersionOne}.8`;
var idBrainpoolP320r1 = `${idVersionOne}.9`;
var idBrainpoolP320t1 = `${idVersionOne}.10`;
var idBrainpoolP384r1 = `${idVersionOne}.11`;
var idBrainpoolP384t1 = `${idVersionOne}.12`;
var idBrainpoolP512r1 = `${idVersionOne}.13`;
var idBrainpoolP512t1 = `${idVersionOne}.14`;
var brainpoolP160r1 = "brainpoolP160r1";
var brainpoolP160t1 = "brainpoolP160t1";
var brainpoolP192r1 = "brainpoolP192r1";
var brainpoolP192t1 = "brainpoolP192t1";
var brainpoolP224r1 = "brainpoolP224r1";
var brainpoolP224t1 = "brainpoolP224t1";
var brainpoolP256r1 = "brainpoolP256r1";
var brainpoolP256t1 = "brainpoolP256t1";
var brainpoolP320r1 = "brainpoolP320r1";
var brainpoolP320t1 = "brainpoolP320t1";
var brainpoolP384r1 = "brainpoolP384r1";
var brainpoolP384t1 = "brainpoolP384t1";
var brainpoolP512r1 = "brainpoolP512r1";
var brainpoolP512t1 = "brainpoolP512t1";
var ECDSA = "ECDSA";
var EcAlgorithm = (EcAlgorithm_1 = /* @__PURE__ */ __name(
  class EcAlgorithm2 {
    toAsnAlgorithm(alg) {
      switch (alg.name.toLowerCase()) {
        case ECDSA.toLowerCase():
          if ("hash" in alg) {
            const hash = typeof alg.hash === "string" ? alg.hash : alg.hash.name;
            switch (hash.toLowerCase()) {
              case "sha-1":
                return ecdsaWithSHA1;
              case "sha-256":
                return ecdsaWithSHA256;
              case "sha-384":
                return ecdsaWithSHA384;
              case "sha-512":
                return ecdsaWithSHA512;
            }
          } else if ("namedCurve" in alg) {
            let parameters = "";
            switch (alg.namedCurve) {
              case "P-256":
                parameters = id_secp256r1;
                break;
              case "K-256":
                parameters = EcAlgorithm_1.SECP256K1;
                break;
              case "P-384":
                parameters = id_secp384r1;
                break;
              case "P-521":
                parameters = id_secp521r1;
                break;
              case brainpoolP160r1:
                parameters = idBrainpoolP160r1;
                break;
              case brainpoolP160t1:
                parameters = idBrainpoolP160t1;
                break;
              case brainpoolP192r1:
                parameters = idBrainpoolP192r1;
                break;
              case brainpoolP192t1:
                parameters = idBrainpoolP192t1;
                break;
              case brainpoolP224r1:
                parameters = idBrainpoolP224r1;
                break;
              case brainpoolP224t1:
                parameters = idBrainpoolP224t1;
                break;
              case brainpoolP256r1:
                parameters = idBrainpoolP256r1;
                break;
              case brainpoolP256t1:
                parameters = idBrainpoolP256t1;
                break;
              case brainpoolP320r1:
                parameters = idBrainpoolP320r1;
                break;
              case brainpoolP320t1:
                parameters = idBrainpoolP320t1;
                break;
              case brainpoolP384r1:
                parameters = idBrainpoolP384r1;
                break;
              case brainpoolP384t1:
                parameters = idBrainpoolP384t1;
                break;
              case brainpoolP512r1:
                parameters = idBrainpoolP512r1;
                break;
              case brainpoolP512t1:
                parameters = idBrainpoolP512t1;
                break;
            }
            if (parameters) {
              return new AlgorithmIdentifier({
                algorithm: id_ecPublicKey,
                parameters: AsnConvert.serialize(new ECParameters({ namedCurve: parameters })),
              });
            }
          }
      }
      return null;
    }
    toWebAlgorithm(alg) {
      switch (alg.algorithm) {
        case id_ecdsaWithSHA1:
          return {
            name: ECDSA,
            hash: { name: "SHA-1" },
          };
        case id_ecdsaWithSHA256:
          return {
            name: ECDSA,
            hash: { name: "SHA-256" },
          };
        case id_ecdsaWithSHA384:
          return {
            name: ECDSA,
            hash: { name: "SHA-384" },
          };
        case id_ecdsaWithSHA512:
          return {
            name: ECDSA,
            hash: { name: "SHA-512" },
          };
        case id_ecPublicKey: {
          if (!alg.parameters) {
            throw new TypeError("Cannot get required parameters from EC algorithm");
          }
          const parameters = AsnConvert.parse(alg.parameters, ECParameters);
          switch (parameters.namedCurve) {
            case id_secp256r1:
              return {
                name: ECDSA,
                namedCurve: "P-256",
              };
            case EcAlgorithm_1.SECP256K1:
              return {
                name: ECDSA,
                namedCurve: "K-256",
              };
            case id_secp384r1:
              return {
                name: ECDSA,
                namedCurve: "P-384",
              };
            case id_secp521r1:
              return {
                name: ECDSA,
                namedCurve: "P-521",
              };
            case idBrainpoolP160r1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP160r1,
              };
            case idBrainpoolP160t1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP160t1,
              };
            case idBrainpoolP192r1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP192r1,
              };
            case idBrainpoolP192t1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP192t1,
              };
            case idBrainpoolP224r1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP224r1,
              };
            case idBrainpoolP224t1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP224t1,
              };
            case idBrainpoolP256r1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP256r1,
              };
            case idBrainpoolP256t1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP256t1,
              };
            case idBrainpoolP320r1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP320r1,
              };
            case idBrainpoolP320t1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP320t1,
              };
            case idBrainpoolP384r1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP384r1,
              };
            case idBrainpoolP384t1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP384t1,
              };
            case idBrainpoolP512r1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP512r1,
              };
            case idBrainpoolP512t1:
              return {
                name: ECDSA,
                namedCurve: brainpoolP512t1,
              };
          }
        }
      }
      return null;
    }
  },
  "EcAlgorithm"
));
EcAlgorithm.SECP256K1 = "1.3.132.0.10";
EcAlgorithm = EcAlgorithm_1 = __decorate([injectable_default()], EcAlgorithm);
instance.registerSingleton(diAlgorithm, EcAlgorithm);
var NAME2 = Symbol("name");
var VALUE = Symbol("value");
var TextObject = class {
  constructor(name, items = {}, value = "") {
    this[NAME2] = name;
    this[VALUE] = value;
    for (const key in items) {
      this[key] = items[key];
    }
  }
};
__name(TextObject, "TextObject");
TextObject.NAME = NAME2;
TextObject.VALUE = VALUE;
var DefaultAlgorithmSerializer = class {
  static toTextObject(alg) {
    const obj = new TextObject("Algorithm Identifier", {}, OidSerializer.toString(alg.algorithm));
    if (alg.parameters) {
      switch (alg.algorithm) {
        case id_ecPublicKey: {
          const ecAlg = new EcAlgorithm().toWebAlgorithm(alg);
          if (ecAlg && "namedCurve" in ecAlg) {
            obj["Named Curve"] = ecAlg.namedCurve;
          } else {
            obj["Parameters"] = alg.parameters;
          }
          break;
        }
        default:
          obj["Parameters"] = alg.parameters;
      }
    }
    return obj;
  }
};
__name(DefaultAlgorithmSerializer, "DefaultAlgorithmSerializer");
var OidSerializer = class {
  static toString(oid) {
    const name = this.items[oid];
    if (name) {
      return name;
    }
    return oid;
  }
};
__name(OidSerializer, "OidSerializer");
OidSerializer.items = {
  [id_sha1]: "sha1",
  [id_sha224]: "sha224",
  [id_sha256]: "sha256",
  [id_sha384]: "sha384",
  [id_sha512]: "sha512",
  [id_rsaEncryption]: "rsaEncryption",
  [id_sha1WithRSAEncryption]: "sha1WithRSAEncryption",
  [id_sha224WithRSAEncryption]: "sha224WithRSAEncryption",
  [id_sha256WithRSAEncryption]: "sha256WithRSAEncryption",
  [id_sha384WithRSAEncryption]: "sha384WithRSAEncryption",
  [id_sha512WithRSAEncryption]: "sha512WithRSAEncryption",
  [id_ecPublicKey]: "ecPublicKey",
  [id_ecdsaWithSHA1]: "ecdsaWithSHA1",
  [id_ecdsaWithSHA224]: "ecdsaWithSHA224",
  [id_ecdsaWithSHA256]: "ecdsaWithSHA256",
  [id_ecdsaWithSHA384]: "ecdsaWithSHA384",
  [id_ecdsaWithSHA512]: "ecdsaWithSHA512",
  [id_kp_serverAuth]: "TLS WWW server authentication",
  [id_kp_clientAuth]: "TLS WWW client authentication",
  [id_kp_codeSigning]: "Code Signing",
  [id_kp_emailProtection]: "E-mail Protection",
  [id_kp_timeStamping]: "Time Stamping",
  [id_kp_OCSPSigning]: "OCSP Signing",
  [id_signedData]: "Signed Data",
};
var TextConverter = class {
  static serialize(obj) {
    return this.serializeObj(obj).join("\n");
  }
  static pad(deep = 0) {
    return "".padStart(2 * deep, " ");
  }
  static serializeObj(obj, deep = 0) {
    const res = [];
    let pad = this.pad(deep++);
    let value = "";
    const objValue = obj[TextObject.VALUE];
    if (objValue) {
      value = ` ${objValue}`;
    }
    res.push(`${pad}${obj[TextObject.NAME]}:${value}`);
    pad = this.pad(deep);
    for (const key in obj) {
      if (typeof key === "symbol") {
        continue;
      }
      const value2 = obj[key];
      const keyValue = key ? `${key}: ` : "";
      if (typeof value2 === "string" || typeof value2 === "number" || typeof value2 === "boolean") {
        res.push(`${pad}${keyValue}${value2}`);
      } else if (value2 instanceof Date) {
        res.push(`${pad}${keyValue}${value2.toUTCString()}`);
      } else if (Array.isArray(value2)) {
        for (const obj2 of value2) {
          obj2[TextObject.NAME] = key;
          res.push(...this.serializeObj(obj2, deep));
        }
      } else if (value2 instanceof TextObject) {
        value2[TextObject.NAME] = key;
        res.push(...this.serializeObj(value2, deep));
      } else if (import_pvtsutils.BufferSourceConverter.isBufferSource(value2)) {
        if (key) {
          res.push(`${pad}${keyValue}`);
          res.push(...this.serializeBufferSource(value2, deep + 1));
        } else {
          res.push(...this.serializeBufferSource(value2, deep));
        }
      } else if ("toTextObject" in value2) {
        const obj2 = value2.toTextObject();
        obj2[TextObject.NAME] = key;
        res.push(...this.serializeObj(obj2, deep));
      } else {
        throw new TypeError("Cannot serialize data in text format. Unsupported type.");
      }
    }
    return res;
  }
  static serializeBufferSource(buffer, deep = 0) {
    const pad = this.pad(deep);
    const view = import_pvtsutils.BufferSourceConverter.toUint8Array(buffer);
    const res = [];
    for (let i = 0; i < view.length; ) {
      const row = [];
      for (let j = 0; j < 16 && i < view.length; j++) {
        if (j === 8) {
          row.push("");
        }
        const hex2 = view[i++].toString(16).padStart(2, "0");
        row.push(hex2);
      }
      res.push(`${pad}${row.join(" ")}`);
    }
    return res;
  }
  static serializeAlgorithm(alg) {
    return this.algorithmSerializer.toTextObject(alg);
  }
};
__name(TextConverter, "TextConverter");
TextConverter.oidSerializer = OidSerializer;
TextConverter.algorithmSerializer = DefaultAlgorithmSerializer;
var _AsnData_rawData;
var AsnData = class {
  get rawData() {
    if (!__classPrivateFieldGet(this, _AsnData_rawData, "f")) {
      __classPrivateFieldSet(this, _AsnData_rawData, AsnConvert.serialize(this.asn), "f");
    }
    return __classPrivateFieldGet(this, _AsnData_rawData, "f");
  }
  constructor(...args) {
    _AsnData_rawData.set(this, void 0);
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      this.asn = AsnConvert.parse(args[0], args[1]);
      __classPrivateFieldSet(
        this,
        _AsnData_rawData,
        import_pvtsutils.BufferSourceConverter.toArrayBuffer(args[0]),
        "f"
      );
      this.onInit(this.asn);
    } else {
      this.asn = args[0];
      this.onInit(this.asn);
    }
  }
  equal(data) {
    if (data instanceof AsnData) {
      return (0, import_pvtsutils.isEqual)(data.rawData, this.rawData);
    }
    return false;
  }
  toString(format2 = "text") {
    switch (format2) {
      case "asn":
        return AsnConvert.toString(this.rawData);
      case "text":
        return TextConverter.serialize(this.toTextObject());
      case "hex":
        return import_pvtsutils.Convert.ToHex(this.rawData);
      case "base64":
        return import_pvtsutils.Convert.ToBase64(this.rawData);
      case "base64url":
        return import_pvtsutils.Convert.ToBase64Url(this.rawData);
      default:
        throw TypeError("Argument 'format' is unsupported value");
    }
  }
  getTextName() {
    const constructor = this.constructor;
    return constructor.NAME;
  }
  toTextObject() {
    const obj = this.toTextObjectEmpty();
    obj[""] = this.rawData;
    return obj;
  }
  toTextObjectEmpty(value) {
    return new TextObject(this.getTextName(), {}, value);
  }
};
__name(AsnData, "AsnData");
_AsnData_rawData = /* @__PURE__ */ new WeakMap();
AsnData.NAME = "ASN";
var Extension2 = class extends AsnData {
  constructor(...args) {
    let raw;
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      raw = import_pvtsutils.BufferSourceConverter.toArrayBuffer(args[0]);
    } else {
      raw = AsnConvert.serialize(
        new Extension({
          extnID: args[0],
          critical: args[1],
          extnValue: new OctetString2(
            import_pvtsutils.BufferSourceConverter.toArrayBuffer(args[2])
          ),
        })
      );
    }
    super(raw, Extension);
  }
  onInit(asn) {
    this.type = asn.extnID;
    this.critical = asn.critical;
    this.value = asn.extnValue.buffer;
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    obj[""] = this.value;
    return obj;
  }
  toTextObjectWithoutValue() {
    const obj = this.toTextObjectEmpty(this.critical ? "critical" : void 0);
    if (obj[TextObject.NAME] === Extension2.NAME) {
      obj[TextObject.NAME] = OidSerializer.toString(this.type);
    }
    return obj;
  }
};
__name(Extension2, "Extension");
var _a2;
var CryptoProvider = class {
  static isCryptoKeyPair(data) {
    return data && data.privateKey && data.publicKey;
  }
  static isCryptoKey(data) {
    return data && data.usages && data.type && data.algorithm && data.extractable !== void 0;
  }
  constructor() {
    this.items = /* @__PURE__ */ new Map();
    this[_a2] = "CryptoProvider";
    if (typeof self !== "undefined" && typeof crypto !== "undefined") {
      this.set(CryptoProvider.DEFAULT, crypto);
    } else if (typeof global !== "undefined" && global.crypto && global.crypto.subtle) {
      this.set(CryptoProvider.DEFAULT, global.crypto);
    }
  }
  clear() {
    this.items.clear();
  }
  delete(key) {
    return this.items.delete(key);
  }
  forEach(callbackfn, thisArg) {
    return this.items.forEach(callbackfn, thisArg);
  }
  has(key) {
    return this.items.has(key);
  }
  get size() {
    return this.items.size;
  }
  entries() {
    return this.items.entries();
  }
  keys() {
    return this.items.keys();
  }
  values() {
    return this.items.values();
  }
  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
  get(key = CryptoProvider.DEFAULT) {
    const crypto2 = this.items.get(key.toLowerCase());
    if (!crypto2) {
      throw new Error(`Cannot get Crypto by name '${key}'`);
    }
    return crypto2;
  }
  set(key, value) {
    if (typeof key === "string") {
      if (!value) {
        throw new TypeError("Argument 'value' is required");
      }
      this.items.set(key.toLowerCase(), value);
    } else {
      this.items.set(CryptoProvider.DEFAULT, key);
    }
    return this;
  }
};
__name(CryptoProvider, "CryptoProvider");
_a2 = Symbol.toStringTag;
CryptoProvider.DEFAULT = "default";
var cryptoProvider = new CryptoProvider();
var OID_REGEX = /^[0-2](?:\.[1-9][0-9]*)+$/;
function isOID(id) {
  return new RegExp(OID_REGEX).test(id);
}
__name(isOID, "isOID");
var NameIdentifier = class {
  constructor(names2 = {}) {
    this.items = {};
    for (const id in names2) {
      this.register(id, names2[id]);
    }
  }
  get(idOrName) {
    return this.items[idOrName] || null;
  }
  findId(idOrName) {
    if (!isOID(idOrName)) {
      return this.get(idOrName);
    }
    return idOrName;
  }
  register(id, name) {
    this.items[id] = name;
    this.items[name] = id;
  }
};
__name(NameIdentifier, "NameIdentifier");
var names = new NameIdentifier();
names.register("CN", "2.5.4.3");
names.register("L", "2.5.4.7");
names.register("ST", "2.5.4.8");
names.register("O", "2.5.4.10");
names.register("OU", "2.5.4.11");
names.register("C", "2.5.4.6");
names.register("DC", "0.9.2342.19200300.100.1.25");
names.register("E", "1.2.840.113549.1.9.1");
names.register("G", "2.5.4.42");
names.register("I", "2.5.4.43");
names.register("SN", "2.5.4.4");
names.register("T", "2.5.4.12");
function replaceUnknownCharacter(text, char) {
  return `\\${import_pvtsutils.Convert.ToHex(import_pvtsutils.Convert.FromUtf8String(char)).toUpperCase()}`;
}
__name(replaceUnknownCharacter, "replaceUnknownCharacter");
function escape2(data) {
  return data
    .replace(/([,+"\\<>;])/g, "\\$1")
    .replace(/^([ #])/, "\\$1")
    .replace(/([ ]$)/, "\\$1")
    .replace(/([\r\n\t])/, replaceUnknownCharacter);
}
__name(escape2, "escape");
var Name3 = class {
  static isASCII(text) {
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code > 255) {
        return false;
      }
    }
    return true;
  }
  static isPrintableString(text) {
    return /^[A-Za-z0-9 '()+,-./:=?]*$/g.test(text);
  }
  constructor(data, extraNames = {}) {
    this.extraNames = new NameIdentifier();
    this.asn = new Name();
    for (const key in extraNames) {
      if (Object.prototype.hasOwnProperty.call(extraNames, key)) {
        const value = extraNames[key];
        this.extraNames.register(key, value);
      }
    }
    if (typeof data === "string") {
      this.asn = this.fromString(data);
    } else if (data instanceof Name) {
      this.asn = data;
    } else if (import_pvtsutils.BufferSourceConverter.isBufferSource(data)) {
      this.asn = AsnConvert.parse(data, Name);
    } else {
      this.asn = this.fromJSON(data);
    }
  }
  getField(idOrName) {
    const id = this.extraNames.findId(idOrName) || names.findId(idOrName);
    const res = [];
    for (const name of this.asn) {
      for (const rdn of name) {
        if (rdn.type === id) {
          res.push(rdn.value.toString());
        }
      }
    }
    return res;
  }
  getName(idOrName) {
    return this.extraNames.get(idOrName) || names.get(idOrName);
  }
  toString() {
    return this.asn
      .map((rdn) =>
        rdn
          .map((o) => {
            const type = this.getName(o.type) || o.type;
            const value = o.value.anyValue
              ? `#${import_pvtsutils.Convert.ToHex(o.value.anyValue)}`
              : escape2(o.value.toString());
            return `${type}=${value}`;
          })
          .join("+")
      )
      .join(", ");
  }
  toJSON() {
    var _a3;
    const json = [];
    for (const rdn of this.asn) {
      const jsonItem = {};
      for (const attr of rdn) {
        const type = this.getName(attr.type) || attr.type;
        (_a3 = jsonItem[type]) !== null && _a3 !== void 0 ? _a3 : (jsonItem[type] = []);
        jsonItem[type].push(
          attr.value.anyValue
            ? `#${import_pvtsutils.Convert.ToHex(attr.value.anyValue)}`
            : attr.value.toString()
        );
      }
      json.push(jsonItem);
    }
    return json;
  }
  fromString(data) {
    const asn = new Name();
    const regex =
      /(\d\.[\d.]*\d|[A-Za-z]+)=((?:"")|(?:".*?[^\\]")|(?:[^,+"\\](?=[,+]|$))|(?:[^,+].*?(?:[^\\][,+]))|(?:))([,+])?/g;
    let matches = null;
    let level = ",";
    while ((matches = regex.exec(`${data},`))) {
      let [, type, value] = matches;
      const lastChar = value[value.length - 1];
      if (lastChar === "," || lastChar === "+") {
        value = value.slice(0, value.length - 1);
        matches[3] = lastChar;
      }
      const next = matches[3];
      type = this.getTypeOid(type);
      const attr = this.createAttribute(type, value);
      if (level === "+") {
        asn[asn.length - 1].push(attr);
      } else {
        asn.push(new RelativeDistinguishedName([attr]));
      }
      level = next;
    }
    return asn;
  }
  fromJSON(data) {
    const asn = new Name();
    for (const item of data) {
      const asnRdn = new RelativeDistinguishedName();
      for (const type in item) {
        const typeId = this.getTypeOid(type);
        const values = item[type];
        for (const value of values) {
          const asnAttr = this.createAttribute(typeId, value);
          asnRdn.push(asnAttr);
        }
      }
      asn.push(asnRdn);
    }
    return asn;
  }
  getTypeOid(type) {
    if (!/[\d.]+/.test(type)) {
      type = this.getName(type) || "";
    }
    if (!type) {
      throw new Error(`Cannot get OID for name type '${type}'`);
    }
    return type;
  }
  createAttribute(type, value) {
    const attr = new AttributeTypeAndValue({ type });
    if (typeof value === "object") {
      for (const key in value) {
        switch (key) {
          case "ia5String":
            attr.value.ia5String = value[key];
            break;
          case "utf8String":
            attr.value.utf8String = value[key];
            break;
          case "universalString":
            attr.value.universalString = value[key];
            break;
          case "bmpString":
            attr.value.bmpString = value[key];
            break;
          case "printableString":
            attr.value.printableString = value[key];
            break;
        }
      }
    } else if (value[0] === "#") {
      attr.value.anyValue = import_pvtsutils.Convert.FromHex(value.slice(1));
    } else {
      const processedValue = this.processStringValue(value);
      if (type === this.getName("E") || type === this.getName("DC")) {
        attr.value.ia5String = processedValue;
      } else {
        if (Name3.isPrintableString(processedValue)) {
          attr.value.printableString = processedValue;
        } else {
          attr.value.utf8String = processedValue;
        }
      }
    }
    return attr;
  }
  processStringValue(value) {
    const quotedMatches = /"(.*?[^\\])?"/.exec(value);
    if (quotedMatches) {
      value = quotedMatches[1];
    }
    return value
      .replace(/\\0a/gi, "\n")
      .replace(/\\0d/gi, "\r")
      .replace(/\\0g/gi, "	")
      .replace(/\\(.)/g, "$1");
  }
  toArrayBuffer() {
    return AsnConvert.serialize(this.asn);
  }
  async getThumbprint(...args) {
    var _a3;
    let crypto2;
    let algorithm = "SHA-1";
    if (args.length >= 1 && !((_a3 = args[0]) === null || _a3 === void 0 ? void 0 : _a3.subtle)) {
      algorithm = args[0] || algorithm;
      crypto2 = args[1] || cryptoProvider.get();
    } else {
      crypto2 = args[0] || cryptoProvider.get();
    }
    return await crypto2.subtle.digest(algorithm, this.toArrayBuffer());
  }
};
__name(Name3, "Name");
var ERR_GN_CONSTRUCTOR = "Cannot initialize GeneralName from ASN.1 data.";
var ERR_GN_STRING_FORMAT = `${ERR_GN_CONSTRUCTOR} Unsupported string format in use.`;
var ERR_GUID = `${ERR_GN_CONSTRUCTOR} Value doesn't match to GUID regular expression.`;
var GUID_REGEX = /^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i;
var id_GUID = "1.3.6.1.4.1.311.25.1";
var id_UPN = "1.3.6.1.4.1.311.20.2.3";
var DNS = "dns";
var DN = "dn";
var EMAIL = "email";
var IP = "ip";
var URL2 = "url";
var GUID = "guid";
var UPN = "upn";
var REGISTERED_ID = "id";
var GeneralName3 = class extends AsnData {
  constructor(...args) {
    let name;
    if (args.length === 2) {
      switch (args[0]) {
        case DN: {
          const derName = new Name3(args[1]).toArrayBuffer();
          const asnName = AsnConvert.parse(derName, Name);
          name = new GeneralName({ directoryName: asnName });
          break;
        }
        case DNS:
          name = new GeneralName({ dNSName: args[1] });
          break;
        case EMAIL:
          name = new GeneralName({ rfc822Name: args[1] });
          break;
        case GUID: {
          const matches = new RegExp(GUID_REGEX, "i").exec(args[1]);
          if (!matches) {
            throw new Error("Cannot parse GUID value. Value doesn't match to regular expression");
          }
          const hex2 = matches
            .slice(1)
            .map((o, i) => {
              if (i < 3) {
                return import_pvtsutils.Convert.ToHex(
                  new Uint8Array(import_pvtsutils.Convert.FromHex(o)).reverse()
                );
              }
              return o;
            })
            .join("");
          name = new GeneralName({
            otherName: new OtherName({
              typeId: id_GUID,
              value: AsnConvert.serialize(new OctetString2(import_pvtsutils.Convert.FromHex(hex2))),
            }),
          });
          break;
        }
        case IP:
          name = new GeneralName({ iPAddress: args[1] });
          break;
        case REGISTERED_ID:
          name = new GeneralName({ registeredID: args[1] });
          break;
        case UPN: {
          name = new GeneralName({
            otherName: new OtherName({
              typeId: id_UPN,
              value: AsnConvert.serialize(AsnUtf8StringConverter.toASN(args[1])),
            }),
          });
          break;
        }
        case URL2:
          name = new GeneralName({ uniformResourceIdentifier: args[1] });
          break;
        default:
          throw new Error("Cannot create GeneralName. Unsupported type of the name");
      }
    } else if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      name = AsnConvert.parse(args[0], GeneralName);
    } else {
      name = args[0];
    }
    super(name);
  }
  onInit(asn) {
    if (asn.dNSName != void 0) {
      this.type = DNS;
      this.value = asn.dNSName;
    } else if (asn.rfc822Name != void 0) {
      this.type = EMAIL;
      this.value = asn.rfc822Name;
    } else if (asn.iPAddress != void 0) {
      this.type = IP;
      this.value = asn.iPAddress;
    } else if (asn.uniformResourceIdentifier != void 0) {
      this.type = URL2;
      this.value = asn.uniformResourceIdentifier;
    } else if (asn.registeredID != void 0) {
      this.type = REGISTERED_ID;
      this.value = asn.registeredID;
    } else if (asn.directoryName != void 0) {
      this.type = DN;
      this.value = new Name3(asn.directoryName).toString();
    } else if (asn.otherName != void 0) {
      if (asn.otherName.typeId === id_GUID) {
        this.type = GUID;
        const guid = AsnConvert.parse(asn.otherName.value, OctetString2);
        const matches = new RegExp(GUID_REGEX, "i").exec(import_pvtsutils.Convert.ToHex(guid));
        if (!matches) {
          throw new Error(ERR_GUID);
        }
        this.value = matches
          .slice(1)
          .map((o, i) => {
            if (i < 3) {
              return import_pvtsutils.Convert.ToHex(
                new Uint8Array(import_pvtsutils.Convert.FromHex(o)).reverse()
              );
            }
            return o;
          })
          .join("-");
      } else if (asn.otherName.typeId === id_UPN) {
        this.type = UPN;
        this.value = AsnConvert.parse(asn.otherName.value, DirectoryString).toString();
      } else {
        throw new Error(ERR_GN_STRING_FORMAT);
      }
    } else {
      throw new Error(ERR_GN_STRING_FORMAT);
    }
  }
  toJSON() {
    return {
      type: this.type,
      value: this.value,
    };
  }
  toTextObject() {
    let type;
    switch (this.type) {
      case DN:
      case DNS:
      case GUID:
      case IP:
      case REGISTERED_ID:
      case UPN:
      case URL2:
        type = this.type.toUpperCase();
        break;
      case EMAIL:
        type = "Email";
        break;
      default:
        throw new Error("Unsupported GeneralName type");
    }
    let value = this.value;
    if (this.type === REGISTERED_ID) {
      value = OidSerializer.toString(value);
    }
    return new TextObject(type, void 0, value);
  }
};
__name(GeneralName3, "GeneralName");
var GeneralNames3 = class extends AsnData {
  constructor(params) {
    let names2;
    if (params instanceof GeneralNames) {
      names2 = params;
    } else if (Array.isArray(params)) {
      const items = [];
      for (const name of params) {
        if (name instanceof GeneralName) {
          items.push(name);
        } else {
          const asnName = AsnConvert.parse(
            new GeneralName3(name.type, name.value).rawData,
            GeneralName
          );
          items.push(asnName);
        }
      }
      names2 = new GeneralNames(items);
    } else if (import_pvtsutils.BufferSourceConverter.isBufferSource(params)) {
      names2 = AsnConvert.parse(params, GeneralNames);
    } else {
      throw new Error("Cannot initialize GeneralNames. Incorrect incoming arguments");
    }
    super(names2);
  }
  onInit(asn) {
    const items = [];
    for (const asnName of asn) {
      let name = null;
      try {
        name = new GeneralName3(asnName);
      } catch {
        continue;
      }
      items.push(name);
    }
    this.items = items;
  }
  toJSON() {
    return this.items.map((o) => o.toJSON());
  }
  toTextObject() {
    const res = super.toTextObjectEmpty();
    for (const name of this.items) {
      const nameObj = name.toTextObject();
      let field = res[nameObj[TextObject.NAME]];
      if (!Array.isArray(field)) {
        field = [];
        res[nameObj[TextObject.NAME]] = field;
      }
      field.push(nameObj);
    }
    return res;
  }
};
__name(GeneralNames3, "GeneralNames");
GeneralNames3.NAME = "GeneralNames";
var rPaddingTag = "-{5}";
var rEolChars = "\\n";
var rNameTag = `[^${rEolChars}]+`;
var rBeginTag = `${rPaddingTag}BEGIN (${rNameTag}(?=${rPaddingTag}))${rPaddingTag}`;
var rEndTag = `${rPaddingTag}END \\1${rPaddingTag}`;
var rEolGroup = "\\n";
var rHeaderKey = `[^:${rEolChars}]+`;
var rHeaderValue = `(?:[^${rEolChars}]+${rEolGroup}(?: +[^${rEolChars}]+${rEolGroup})*)`;
var rBase64Chars = "[a-zA-Z0-9=+/]+";
var rBase64 = `(?:${rBase64Chars}${rEolGroup})+`;
var rPem = `${rBeginTag}${rEolGroup}(?:((?:${rHeaderKey}: ${rHeaderValue})+))?${rEolGroup}?(${rBase64})${rEndTag}`;
var PemConverter = class {
  static isPem(data) {
    return typeof data === "string" && new RegExp(rPem, "g").test(data.replace(/\r/g, ""));
  }
  static decodeWithHeaders(pem) {
    pem = pem.replace(/\r/g, "");
    const pattern = new RegExp(rPem, "g");
    const res = [];
    let matches = null;
    while ((matches = pattern.exec(pem))) {
      const base643 = matches[3].replace(new RegExp(`[${rEolChars}]+`, "g"), "");
      const pemStruct = {
        type: matches[1],
        headers: [],
        rawData: import_pvtsutils.Convert.FromBase64(base643),
      };
      const headersString = matches[2];
      if (headersString) {
        const headers = headersString.split(new RegExp(rEolGroup, "g"));
        let lastHeader = null;
        for (const header of headers) {
          const [key, value] = header.split(/:(.*)/);
          if (value === void 0) {
            if (!lastHeader) {
              throw new Error("Cannot parse PEM string. Incorrect header value");
            }
            lastHeader.value += key.trim();
          } else {
            if (lastHeader) {
              pemStruct.headers.push(lastHeader);
            }
            lastHeader = {
              key,
              value: value.trim(),
            };
          }
        }
        if (lastHeader) {
          pemStruct.headers.push(lastHeader);
        }
      }
      res.push(pemStruct);
    }
    return res;
  }
  static decode(pem) {
    const blocks = this.decodeWithHeaders(pem);
    return blocks.map((o) => o.rawData);
  }
  static decodeFirst(pem) {
    const items = this.decode(pem);
    if (!items.length) {
      throw new RangeError("PEM string doesn't contain any objects");
    }
    return items[0];
  }
  static encode(rawData, tag) {
    if (Array.isArray(rawData)) {
      const raws = new Array();
      if (tag) {
        rawData.forEach((element) => {
          if (!import_pvtsutils.BufferSourceConverter.isBufferSource(element)) {
            throw new TypeError(
              "Cannot encode array of BufferSource in PEM format. Not all items of the array are BufferSource"
            );
          }
          raws.push(
            this.encodeStruct({
              type: tag,
              rawData: import_pvtsutils.BufferSourceConverter.toArrayBuffer(element),
            })
          );
        });
      } else {
        rawData.forEach((element) => {
          if (!("type" in element)) {
            throw new TypeError(
              "Cannot encode array of PemStruct in PEM format. Not all items of the array are PemStrut"
            );
          }
          raws.push(this.encodeStruct(element));
        });
      }
      return raws.join("\n");
    } else {
      if (!tag) {
        throw new Error("Required argument 'tag' is missed");
      }
      return this.encodeStruct({
        type: tag,
        rawData: import_pvtsutils.BufferSourceConverter.toArrayBuffer(rawData),
      });
    }
  }
  static encodeStruct(pem) {
    var _a3;
    const upperCaseType = pem.type.toLocaleUpperCase();
    const res = [];
    res.push(`-----BEGIN ${upperCaseType}-----`);
    if ((_a3 = pem.headers) === null || _a3 === void 0 ? void 0 : _a3.length) {
      for (const header of pem.headers) {
        res.push(`${header.key}: ${header.value}`);
      }
      res.push("");
    }
    const base643 = import_pvtsutils.Convert.ToBase64(pem.rawData);
    let sliced;
    let offset = 0;
    const rows = Array();
    while (offset < base643.length) {
      if (base643.length - offset < 64) {
        sliced = base643.substring(offset);
      } else {
        sliced = base643.substring(offset, offset + 64);
        offset += 64;
      }
      if (sliced.length !== 0) {
        rows.push(sliced);
        if (sliced.length < 64) {
          break;
        }
      } else {
        break;
      }
    }
    res.push(...rows);
    res.push(`-----END ${upperCaseType}-----`);
    return res.join("\n");
  }
};
__name(PemConverter, "PemConverter");
PemConverter.CertificateTag = "CERTIFICATE";
PemConverter.CrlTag = "CRL";
PemConverter.CertificateRequestTag = "CERTIFICATE REQUEST";
PemConverter.PublicKeyTag = "PUBLIC KEY";
PemConverter.PrivateKeyTag = "PRIVATE KEY";
var PemData = class extends AsnData {
  static isAsnEncoded(data) {
    return import_pvtsutils.BufferSourceConverter.isBufferSource(data) || typeof data === "string";
  }
  static toArrayBuffer(raw) {
    if (typeof raw === "string") {
      if (PemConverter.isPem(raw)) {
        return PemConverter.decode(raw)[0];
      } else if (import_pvtsutils.Convert.isHex(raw)) {
        return import_pvtsutils.Convert.FromHex(raw);
      } else if (import_pvtsutils.Convert.isBase64(raw)) {
        return import_pvtsutils.Convert.FromBase64(raw);
      } else if (import_pvtsutils.Convert.isBase64Url(raw)) {
        return import_pvtsutils.Convert.FromBase64Url(raw);
      } else {
        throw new TypeError(
          "Unsupported format of 'raw' argument. Must be one of DER, PEM, HEX, Base64, or Base4Url"
        );
      }
    } else {
      const buffer = import_pvtsutils.BufferSourceConverter.toUint8Array(raw);
      if (buffer.length > 0 && buffer[0] === 48) {
        return import_pvtsutils.BufferSourceConverter.toArrayBuffer(raw);
      }
      const stringRaw = import_pvtsutils.Convert.ToBinary(raw);
      if (PemConverter.isPem(stringRaw)) {
        return PemConverter.decode(stringRaw)[0];
      } else if (import_pvtsutils.Convert.isHex(stringRaw)) {
        return import_pvtsutils.Convert.FromHex(stringRaw);
      } else if (import_pvtsutils.Convert.isBase64(stringRaw)) {
        return import_pvtsutils.Convert.FromBase64(stringRaw);
      } else if (import_pvtsutils.Convert.isBase64Url(stringRaw)) {
        return import_pvtsutils.Convert.FromBase64Url(stringRaw);
      }
      throw new TypeError(
        "Unsupported format of 'raw' argument. Must be one of DER, PEM, HEX, Base64, or Base4Url"
      );
    }
  }
  constructor(...args) {
    if (PemData.isAsnEncoded(args[0])) {
      super(PemData.toArrayBuffer(args[0]), args[1]);
    } else {
      super(args[0]);
    }
  }
  toString(format2 = "pem") {
    switch (format2) {
      case "pem":
        return PemConverter.encode(this.rawData, this.tag);
      default:
        return super.toString(format2);
    }
  }
};
__name(PemData, "PemData");
var PublicKey = class extends PemData {
  static async create(data, crypto2 = cryptoProvider.get()) {
    if (data instanceof PublicKey) {
      return data;
    } else if (CryptoProvider.isCryptoKey(data)) {
      if (data.type !== "public") {
        throw new TypeError("Public key is required");
      }
      const spki = await crypto2.subtle.exportKey("spki", data);
      return new PublicKey(spki);
    } else if (data.publicKey) {
      return data.publicKey;
    } else if (import_pvtsutils.BufferSourceConverter.isBufferSource(data)) {
      return new PublicKey(data);
    } else {
      throw new TypeError("Unsupported PublicKeyType");
    }
  }
  constructor(param) {
    if (PemData.isAsnEncoded(param)) {
      super(param, SubjectPublicKeyInfo);
    } else {
      super(param);
    }
    this.tag = PemConverter.PublicKeyTag;
  }
  async export(...args) {
    let crypto2;
    let keyUsages = ["verify"];
    let algorithm = {
      hash: "SHA-256",
      ...this.algorithm,
    };
    if (args.length > 1) {
      algorithm = args[0] || algorithm;
      keyUsages = args[1] || keyUsages;
      crypto2 = args[2] || cryptoProvider.get();
    } else {
      crypto2 = args[0] || cryptoProvider.get();
    }
    let raw = this.rawData;
    const asnSpki = AsnConvert.parse(this.rawData, SubjectPublicKeyInfo);
    if (asnSpki.algorithm.algorithm === id_RSASSA_PSS) {
      raw = convertSpkiToRsaPkcs1(asnSpki, raw);
    }
    return crypto2.subtle.importKey("spki", raw, algorithm, true, keyUsages);
  }
  onInit(asn) {
    const algProv = instance.resolve(diAlgorithmProvider);
    const algorithm = (this.algorithm = algProv.toWebAlgorithm(asn.algorithm));
    switch (asn.algorithm.algorithm) {
      case id_rsaEncryption: {
        const rsaPublicKey = AsnConvert.parse(asn.subjectPublicKey, RSAPublicKey);
        const modulus = import_pvtsutils.BufferSourceConverter.toUint8Array(rsaPublicKey.modulus);
        algorithm.publicExponent = import_pvtsutils.BufferSourceConverter.toUint8Array(
          rsaPublicKey.publicExponent
        );
        algorithm.modulusLength = (!modulus[0] ? modulus.slice(1) : modulus).byteLength << 3;
        break;
      }
    }
  }
  async getThumbprint(...args) {
    var _a3;
    let crypto2;
    let algorithm = "SHA-1";
    if (args.length >= 1 && !((_a3 = args[0]) === null || _a3 === void 0 ? void 0 : _a3.subtle)) {
      algorithm = args[0] || algorithm;
      crypto2 = args[1] || cryptoProvider.get();
    } else {
      crypto2 = args[0] || cryptoProvider.get();
    }
    return await crypto2.subtle.digest(algorithm, this.rawData);
  }
  async getKeyIdentifier(...args) {
    let crypto2;
    let algorithm = "SHA-1";
    if (args.length === 1) {
      if (typeof args[0] === "string") {
        algorithm = args[0];
        crypto2 = cryptoProvider.get();
      } else {
        crypto2 = args[0];
      }
    } else if (args.length === 2) {
      algorithm = args[0];
      crypto2 = args[1];
    } else {
      crypto2 = cryptoProvider.get();
    }
    const asn = AsnConvert.parse(this.rawData, SubjectPublicKeyInfo);
    return await crypto2.subtle.digest(algorithm, asn.subjectPublicKey);
  }
  toTextObject() {
    const obj = this.toTextObjectEmpty();
    const asn = AsnConvert.parse(this.rawData, SubjectPublicKeyInfo);
    obj["Algorithm"] = TextConverter.serializeAlgorithm(asn.algorithm);
    switch (asn.algorithm.algorithm) {
      case id_ecPublicKey:
        obj["EC Point"] = asn.subjectPublicKey;
        break;
      case id_rsaEncryption:
      default:
        obj["Raw Data"] = asn.subjectPublicKey;
    }
    return obj;
  }
};
__name(PublicKey, "PublicKey");
function convertSpkiToRsaPkcs1(asnSpki, raw) {
  asnSpki.algorithm = new AlgorithmIdentifier({
    algorithm: id_rsaEncryption,
    parameters: null,
  });
  raw = AsnConvert.serialize(asnSpki);
  return raw;
}
__name(convertSpkiToRsaPkcs1, "convertSpkiToRsaPkcs1");
var AuthorityKeyIdentifierExtension = class extends Extension2 {
  static async create(param, critical = false, crypto2 = cryptoProvider.get()) {
    if ("name" in param && "serialNumber" in param) {
      return new AuthorityKeyIdentifierExtension(param, critical);
    }
    const key = await PublicKey.create(param, crypto2);
    const id = await key.getKeyIdentifier(crypto2);
    return new AuthorityKeyIdentifierExtension(import_pvtsutils.Convert.ToHex(id), critical);
  }
  constructor(...args) {
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
    } else if (typeof args[0] === "string") {
      const value = new AuthorityKeyIdentifier({
        keyIdentifier: new KeyIdentifier(import_pvtsutils.Convert.FromHex(args[0])),
      });
      super(id_ce_authorityKeyIdentifier, args[1], AsnConvert.serialize(value));
    } else {
      const certId = args[0];
      const certIdName =
        certId.name instanceof GeneralNames3
          ? AsnConvert.parse(certId.name.rawData, GeneralNames)
          : certId.name;
      const value = new AuthorityKeyIdentifier({
        authorityCertIssuer: certIdName,
        authorityCertSerialNumber: import_pvtsutils.Convert.FromHex(certId.serialNumber),
      });
      super(id_ce_authorityKeyIdentifier, args[1], AsnConvert.serialize(value));
    }
  }
  onInit(asn) {
    super.onInit(asn);
    const aki = AsnConvert.parse(asn.extnValue, AuthorityKeyIdentifier);
    if (aki.keyIdentifier) {
      this.keyId = import_pvtsutils.Convert.ToHex(aki.keyIdentifier);
    }
    if (aki.authorityCertIssuer || aki.authorityCertSerialNumber) {
      this.certId = {
        name: aki.authorityCertIssuer || [],
        serialNumber: aki.authorityCertSerialNumber
          ? import_pvtsutils.Convert.ToHex(aki.authorityCertSerialNumber)
          : "",
      };
    }
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    const asn = AsnConvert.parse(this.value, AuthorityKeyIdentifier);
    if (asn.authorityCertIssuer) {
      obj["Authority Issuer"] = new GeneralNames3(asn.authorityCertIssuer).toTextObject();
    }
    if (asn.authorityCertSerialNumber) {
      obj["Authority Serial Number"] = asn.authorityCertSerialNumber;
    }
    if (asn.keyIdentifier) {
      obj[""] = asn.keyIdentifier;
    }
    return obj;
  }
};
__name(AuthorityKeyIdentifierExtension, "AuthorityKeyIdentifierExtension");
AuthorityKeyIdentifierExtension.NAME = "Authority Key Identifier";
var BasicConstraintsExtension = class extends Extension2 {
  constructor(...args) {
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
      const value = AsnConvert.parse(this.value, BasicConstraints);
      this.ca = value.cA;
      this.pathLength = value.pathLenConstraint;
    } else {
      const value = new BasicConstraints({
        cA: args[0],
        pathLenConstraint: args[1],
      });
      super(id_ce_basicConstraints, args[2], AsnConvert.serialize(value));
      this.ca = args[0];
      this.pathLength = args[1];
    }
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    if (this.ca) {
      obj["CA"] = this.ca;
    }
    if (this.pathLength !== void 0) {
      obj["Path Length"] = this.pathLength;
    }
    return obj;
  }
};
__name(BasicConstraintsExtension, "BasicConstraintsExtension");
BasicConstraintsExtension.NAME = "Basic Constraints";
var ExtendedKeyUsage3;
(function (ExtendedKeyUsage4) {
  ExtendedKeyUsage4["serverAuth"] = "1.3.6.1.5.5.7.3.1";
  ExtendedKeyUsage4["clientAuth"] = "1.3.6.1.5.5.7.3.2";
  ExtendedKeyUsage4["codeSigning"] = "1.3.6.1.5.5.7.3.3";
  ExtendedKeyUsage4["emailProtection"] = "1.3.6.1.5.5.7.3.4";
  ExtendedKeyUsage4["timeStamping"] = "1.3.6.1.5.5.7.3.8";
  ExtendedKeyUsage4["ocspSigning"] = "1.3.6.1.5.5.7.3.9";
})(ExtendedKeyUsage3 || (ExtendedKeyUsage3 = {}));
var ExtendedKeyUsageExtension = class extends Extension2 {
  constructor(...args) {
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
      const value = AsnConvert.parse(this.value, ExtendedKeyUsage);
      this.usages = value.map((o) => o);
    } else {
      const value = new ExtendedKeyUsage(args[0]);
      super(id_ce_extKeyUsage, args[1], AsnConvert.serialize(value));
      this.usages = args[0];
    }
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    obj[""] = this.usages.map((o) => OidSerializer.toString(o)).join(", ");
    return obj;
  }
};
__name(ExtendedKeyUsageExtension, "ExtendedKeyUsageExtension");
ExtendedKeyUsageExtension.NAME = "Extended Key Usages";
var KeyUsageFlags2;
(function (KeyUsageFlags3) {
  KeyUsageFlags3[(KeyUsageFlags3["digitalSignature"] = 1)] = "digitalSignature";
  KeyUsageFlags3[(KeyUsageFlags3["nonRepudiation"] = 2)] = "nonRepudiation";
  KeyUsageFlags3[(KeyUsageFlags3["keyEncipherment"] = 4)] = "keyEncipherment";
  KeyUsageFlags3[(KeyUsageFlags3["dataEncipherment"] = 8)] = "dataEncipherment";
  KeyUsageFlags3[(KeyUsageFlags3["keyAgreement"] = 16)] = "keyAgreement";
  KeyUsageFlags3[(KeyUsageFlags3["keyCertSign"] = 32)] = "keyCertSign";
  KeyUsageFlags3[(KeyUsageFlags3["cRLSign"] = 64)] = "cRLSign";
  KeyUsageFlags3[(KeyUsageFlags3["encipherOnly"] = 128)] = "encipherOnly";
  KeyUsageFlags3[(KeyUsageFlags3["decipherOnly"] = 256)] = "decipherOnly";
})(KeyUsageFlags2 || (KeyUsageFlags2 = {}));
var KeyUsagesExtension = class extends Extension2 {
  constructor(...args) {
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
      const value = AsnConvert.parse(this.value, KeyUsage);
      this.usages = value.toNumber();
    } else {
      const value = new KeyUsage(args[0]);
      super(id_ce_keyUsage, args[1], AsnConvert.serialize(value));
      this.usages = args[0];
    }
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    const asn = AsnConvert.parse(this.value, KeyUsage);
    obj[""] = asn.toJSON().join(", ");
    return obj;
  }
};
__name(KeyUsagesExtension, "KeyUsagesExtension");
KeyUsagesExtension.NAME = "Key Usages";
var SubjectKeyIdentifierExtension = class extends Extension2 {
  static async create(publicKey, critical = false, crypto2 = cryptoProvider.get()) {
    const key = await PublicKey.create(publicKey, crypto2);
    const id = await key.getKeyIdentifier(crypto2);
    return new SubjectKeyIdentifierExtension(import_pvtsutils.Convert.ToHex(id), critical);
  }
  constructor(...args) {
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
      const value = AsnConvert.parse(this.value, SubjectKeyIdentifier);
      this.keyId = import_pvtsutils.Convert.ToHex(value);
    } else {
      const identifier =
        typeof args[0] === "string" ? import_pvtsutils.Convert.FromHex(args[0]) : args[0];
      const value = new SubjectKeyIdentifier(identifier);
      super(id_ce_subjectKeyIdentifier, args[1], AsnConvert.serialize(value));
      this.keyId = import_pvtsutils.Convert.ToHex(identifier);
    }
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    const asn = AsnConvert.parse(this.value, SubjectKeyIdentifier);
    obj[""] = asn;
    return obj;
  }
};
__name(SubjectKeyIdentifierExtension, "SubjectKeyIdentifierExtension");
SubjectKeyIdentifierExtension.NAME = "Subject Key Identifier";
var SubjectAlternativeNameExtension = class extends Extension2 {
  constructor(...args) {
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
    } else {
      super(id_ce_subjectAltName, args[1], new GeneralNames3(args[0] || []).rawData);
    }
  }
  onInit(asn) {
    super.onInit(asn);
    const value = AsnConvert.parse(asn.extnValue, SubjectAlternativeName);
    this.names = new GeneralNames3(value);
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    const namesObj = this.names.toTextObject();
    for (const key in namesObj) {
      obj[key] = namesObj[key];
    }
    return obj;
  }
};
__name(SubjectAlternativeNameExtension, "SubjectAlternativeNameExtension");
SubjectAlternativeNameExtension.NAME = "Subject Alternative Name";
var ExtensionFactory = class {
  static register(id, type) {
    this.items.set(id, type);
  }
  static create(data) {
    const extension = new Extension2(data);
    const Type = this.items.get(extension.type);
    if (Type) {
      return new Type(data);
    }
    return extension;
  }
};
__name(ExtensionFactory, "ExtensionFactory");
ExtensionFactory.items = /* @__PURE__ */ new Map();
var CertificatePolicyExtension = class extends Extension2 {
  constructor(...args) {
    var _a3;
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
      const asnPolicies = AsnConvert.parse(this.value, CertificatePolicies);
      this.policies = asnPolicies.map((o) => o.policyIdentifier);
    } else {
      const policies = args[0];
      const critical = (_a3 = args[1]) !== null && _a3 !== void 0 ? _a3 : false;
      const value = new CertificatePolicies(
        policies.map((o) => new PolicyInformation({ policyIdentifier: o }))
      );
      super(id_ce_certificatePolicies, critical, AsnConvert.serialize(value));
      this.policies = policies;
    }
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    obj["Policy"] = this.policies.map((o) => new TextObject("", {}, OidSerializer.toString(o)));
    return obj;
  }
};
__name(CertificatePolicyExtension, "CertificatePolicyExtension");
CertificatePolicyExtension.NAME = "Certificate Policies";
ExtensionFactory.register(id_ce_certificatePolicies, CertificatePolicyExtension);
var CRLDistributionPointsExtension = class extends Extension2 {
  constructor(...args) {
    var _a3;
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
    } else if (Array.isArray(args[0]) && typeof args[0][0] === "string") {
      const urls = args[0];
      const dps = urls.map((url) => {
        return new DistributionPoint({
          distributionPoint: new DistributionPointName({
            fullName: [new GeneralName({ uniformResourceIdentifier: url })],
          }),
        });
      });
      const value = new CRLDistributionPoints(dps);
      super(id_ce_cRLDistributionPoints, args[1], AsnConvert.serialize(value));
    } else {
      const value = new CRLDistributionPoints(args[0]);
      super(id_ce_cRLDistributionPoints, args[1], AsnConvert.serialize(value));
    }
    (_a3 = this.distributionPoints) !== null && _a3 !== void 0
      ? _a3
      : (this.distributionPoints = []);
  }
  onInit(asn) {
    super.onInit(asn);
    const crlExt = AsnConvert.parse(asn.extnValue, CRLDistributionPoints);
    this.distributionPoints = crlExt;
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    obj["Distribution Point"] = this.distributionPoints.map((dp) => {
      var _a3;
      const dpObj = {};
      if (dp.distributionPoint) {
        dpObj[""] =
          (_a3 = dp.distributionPoint.fullName) === null || _a3 === void 0
            ? void 0
            : _a3.map((name) => new GeneralName3(name).toString()).join(", ");
      }
      if (dp.reasons) {
        dpObj["Reasons"] = dp.reasons.toString();
      }
      if (dp.cRLIssuer) {
        dpObj["CRL Issuer"] = dp.cRLIssuer.map((issuer) => issuer.toString()).join(", ");
      }
      return dpObj;
    });
    return obj;
  }
};
__name(CRLDistributionPointsExtension, "CRLDistributionPointsExtension");
CRLDistributionPointsExtension.NAME = "CRL Distribution Points";
var AuthorityInfoAccessExtension = class extends Extension2 {
  constructor(...args) {
    var _a3, _b, _c, _d;
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
    } else if (args[0] instanceof AuthorityInfoAccessSyntax) {
      const value = new AuthorityInfoAccessSyntax(args[0]);
      super(id_pe_authorityInfoAccess, args[1], AsnConvert.serialize(value));
    } else {
      const params = args[0];
      const value = new AuthorityInfoAccessSyntax();
      addAccessDescriptions(value, params, id_ad_ocsp, "ocsp");
      addAccessDescriptions(value, params, id_ad_caIssuers, "caIssuers");
      addAccessDescriptions(value, params, id_ad_timeStamping, "timeStamping");
      addAccessDescriptions(value, params, id_ad_caRepository, "caRepository");
      super(id_pe_authorityInfoAccess, args[1], AsnConvert.serialize(value));
    }
    (_a3 = this.ocsp) !== null && _a3 !== void 0 ? _a3 : (this.ocsp = []);
    (_b = this.caIssuers) !== null && _b !== void 0 ? _b : (this.caIssuers = []);
    (_c = this.timeStamping) !== null && _c !== void 0 ? _c : (this.timeStamping = []);
    (_d = this.caRepository) !== null && _d !== void 0 ? _d : (this.caRepository = []);
  }
  onInit(asn) {
    super.onInit(asn);
    this.ocsp = [];
    this.caIssuers = [];
    this.timeStamping = [];
    this.caRepository = [];
    const aia = AsnConvert.parse(asn.extnValue, AuthorityInfoAccessSyntax);
    aia.forEach((accessDescription) => {
      switch (accessDescription.accessMethod) {
        case id_ad_ocsp:
          this.ocsp.push(new GeneralName3(accessDescription.accessLocation));
          break;
        case id_ad_caIssuers:
          this.caIssuers.push(new GeneralName3(accessDescription.accessLocation));
          break;
        case id_ad_timeStamping:
          this.timeStamping.push(new GeneralName3(accessDescription.accessLocation));
          break;
        case id_ad_caRepository:
          this.caRepository.push(new GeneralName3(accessDescription.accessLocation));
          break;
      }
    });
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    if (this.ocsp.length) {
      addUrlsToObject(obj, "OCSP", this.ocsp);
    }
    if (this.caIssuers.length) {
      addUrlsToObject(obj, "CA Issuers", this.caIssuers);
    }
    if (this.timeStamping.length) {
      addUrlsToObject(obj, "Time Stamping", this.timeStamping);
    }
    if (this.caRepository.length) {
      addUrlsToObject(obj, "CA Repository", this.caRepository);
    }
    return obj;
  }
};
__name(AuthorityInfoAccessExtension, "AuthorityInfoAccessExtension");
AuthorityInfoAccessExtension.NAME = "Authority Info Access";
function addUrlsToObject(obj, key, urls) {
  if (urls.length === 1) {
    obj[key] = urls[0].toTextObject();
  } else {
    const names2 = new TextObject("");
    urls.forEach((name, index) => {
      const nameObj = name.toTextObject();
      const indexedKey = `${nameObj[TextObject.NAME]} ${index + 1}`;
      let field = names2[indexedKey];
      if (!Array.isArray(field)) {
        field = [];
        names2[indexedKey] = field;
      }
      field.push(nameObj);
    });
    obj[key] = names2;
  }
}
__name(addUrlsToObject, "addUrlsToObject");
function addAccessDescriptions(value, params, method, key) {
  const items = params[key];
  if (items) {
    const array = Array.isArray(items) ? items : [items];
    array.forEach((url) => {
      if (typeof url === "string") {
        url = new GeneralName3("url", url);
      }
      value.push(
        new AccessDescription({
          accessMethod: method,
          accessLocation: AsnConvert.parse(url.rawData, GeneralName),
        })
      );
    });
  }
}
__name(addAccessDescriptions, "addAccessDescriptions");
var IssuerAlternativeNameExtension = class extends Extension2 {
  constructor(...args) {
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
    } else {
      super(id_ce_issuerAltName, args[1], new GeneralNames3(args[0] || []).rawData);
    }
  }
  onInit(asn) {
    super.onInit(asn);
    const value = AsnConvert.parse(asn.extnValue, GeneralNames);
    this.names = new GeneralNames3(value);
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    const namesObj = this.names.toTextObject();
    for (const key in namesObj) {
      obj[key] = namesObj[key];
    }
    return obj;
  }
};
__name(IssuerAlternativeNameExtension, "IssuerAlternativeNameExtension");
IssuerAlternativeNameExtension.NAME = "Issuer Alternative Name";
var Attribute3 = class extends AsnData {
  constructor(...args) {
    let raw;
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      raw = import_pvtsutils.BufferSourceConverter.toArrayBuffer(args[0]);
    } else {
      const type = args[0];
      const values = Array.isArray(args[1])
        ? args[1].map((o) => import_pvtsutils.BufferSourceConverter.toArrayBuffer(o))
        : [];
      raw = AsnConvert.serialize(
        new Attribute({
          type,
          values,
        })
      );
    }
    super(raw, Attribute);
  }
  onInit(asn) {
    this.type = asn.type;
    this.values = asn.values;
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    obj["Value"] = this.values.map((o) => new TextObject("", { "": o }));
    return obj;
  }
  toTextObjectWithoutValue() {
    const obj = this.toTextObjectEmpty();
    if (obj[TextObject.NAME] === Attribute3.NAME) {
      obj[TextObject.NAME] = OidSerializer.toString(this.type);
    }
    return obj;
  }
};
__name(Attribute3, "Attribute");
Attribute3.NAME = "Attribute";
var ChallengePasswordAttribute = class extends Attribute3 {
  constructor(...args) {
    var _a3;
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
    } else {
      const value = new ChallengePassword({ printableString: args[0] });
      super(id_pkcs9_at_challengePassword, [AsnConvert.serialize(value)]);
    }
    (_a3 = this.password) !== null && _a3 !== void 0 ? _a3 : (this.password = "");
  }
  onInit(asn) {
    super.onInit(asn);
    if (this.values[0]) {
      const value = AsnConvert.parse(this.values[0], ChallengePassword);
      this.password = value.toString();
    }
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    obj[TextObject.VALUE] = this.password;
    return obj;
  }
};
__name(ChallengePasswordAttribute, "ChallengePasswordAttribute");
ChallengePasswordAttribute.NAME = "Challenge Password";
var ExtensionsAttribute = class extends Attribute3 {
  constructor(...args) {
    var _a3;
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      super(args[0]);
    } else {
      const extensions = args[0];
      const value = new Extensions();
      for (const extension of extensions) {
        value.push(AsnConvert.parse(extension.rawData, Extension));
      }
      super(id_pkcs9_at_extensionRequest, [AsnConvert.serialize(value)]);
    }
    (_a3 = this.items) !== null && _a3 !== void 0 ? _a3 : (this.items = []);
  }
  onInit(asn) {
    super.onInit(asn);
    if (this.values[0]) {
      const value = AsnConvert.parse(this.values[0], Extensions);
      this.items = value.map((o) => ExtensionFactory.create(AsnConvert.serialize(o)));
    }
  }
  toTextObject() {
    const obj = this.toTextObjectWithoutValue();
    const extensions = this.items.map((o) => o.toTextObject());
    for (const extension of extensions) {
      obj[extension[TextObject.NAME]] = extension;
    }
    return obj;
  }
};
__name(ExtensionsAttribute, "ExtensionsAttribute");
ExtensionsAttribute.NAME = "Extensions";
var AttributeFactory = class {
  static register(id, type) {
    this.items.set(id, type);
  }
  static create(data) {
    const attribute = new Attribute3(data);
    const Type = this.items.get(attribute.type);
    if (Type) {
      return new Type(data);
    }
    return attribute;
  }
};
__name(AttributeFactory, "AttributeFactory");
AttributeFactory.items = /* @__PURE__ */ new Map();
var diAsnSignatureFormatter = "crypto.signatureFormatter";
var AsnDefaultSignatureFormatter = class {
  toAsnSignature(algorithm, signature) {
    return import_pvtsutils.BufferSourceConverter.toArrayBuffer(signature);
  }
  toWebSignature(algorithm, signature) {
    return import_pvtsutils.BufferSourceConverter.toArrayBuffer(signature);
  }
};
__name(AsnDefaultSignatureFormatter, "AsnDefaultSignatureFormatter");
var RsaAlgorithm_1;
var RsaAlgorithm = (RsaAlgorithm_1 = /* @__PURE__ */ __name(
  class RsaAlgorithm2 {
    static createPssParams(hash, saltLength) {
      const hashAlgorithm = RsaAlgorithm_1.getHashAlgorithm(hash);
      if (!hashAlgorithm) {
        return null;
      }
      return new RsaSaPssParams({
        hashAlgorithm,
        maskGenAlgorithm: new AlgorithmIdentifier({
          algorithm: id_mgf1,
          parameters: AsnConvert.serialize(hashAlgorithm),
        }),
        saltLength,
      });
    }
    static getHashAlgorithm(alg) {
      const algProv = instance.resolve(diAlgorithmProvider);
      if (typeof alg === "string") {
        return algProv.toAsnAlgorithm({ name: alg });
      }
      if (typeof alg === "object" && alg && "name" in alg) {
        return algProv.toAsnAlgorithm(alg);
      }
      return null;
    }
    toAsnAlgorithm(alg) {
      switch (alg.name.toLowerCase()) {
        case "rsassa-pkcs1-v1_5":
          if ("hash" in alg) {
            let hash;
            if (typeof alg.hash === "string") {
              hash = alg.hash;
            } else if (
              alg.hash &&
              typeof alg.hash === "object" &&
              "name" in alg.hash &&
              typeof alg.hash.name === "string"
            ) {
              hash = alg.hash.name.toUpperCase();
            } else {
              throw new Error("Cannot get hash algorithm name");
            }
            switch (hash.toLowerCase()) {
              case "sha-1":
                return new AlgorithmIdentifier({
                  algorithm: id_sha1WithRSAEncryption,
                  parameters: null,
                });
              case "sha-256":
                return new AlgorithmIdentifier({
                  algorithm: id_sha256WithRSAEncryption,
                  parameters: null,
                });
              case "sha-384":
                return new AlgorithmIdentifier({
                  algorithm: id_sha384WithRSAEncryption,
                  parameters: null,
                });
              case "sha-512":
                return new AlgorithmIdentifier({
                  algorithm: id_sha512WithRSAEncryption,
                  parameters: null,
                });
            }
          } else {
            return new AlgorithmIdentifier({
              algorithm: id_rsaEncryption,
              parameters: null,
            });
          }
          break;
        case "rsa-pss":
          if ("hash" in alg) {
            if (!("saltLength" in alg && typeof alg.saltLength === "number")) {
              throw new Error("Cannot get 'saltLength' from 'alg' argument");
            }
            const pssParams = RsaAlgorithm_1.createPssParams(alg.hash, alg.saltLength);
            if (!pssParams) {
              throw new Error("Cannot create PSS parameters");
            }
            return new AlgorithmIdentifier({
              algorithm: id_RSASSA_PSS,
              parameters: AsnConvert.serialize(pssParams),
            });
          } else {
            return new AlgorithmIdentifier({
              algorithm: id_RSASSA_PSS,
              parameters: null,
            });
          }
      }
      return null;
    }
    toWebAlgorithm(alg) {
      switch (alg.algorithm) {
        case id_rsaEncryption:
          return { name: "RSASSA-PKCS1-v1_5" };
        case id_sha1WithRSAEncryption:
          return {
            name: "RSASSA-PKCS1-v1_5",
            hash: { name: "SHA-1" },
          };
        case id_sha256WithRSAEncryption:
          return {
            name: "RSASSA-PKCS1-v1_5",
            hash: { name: "SHA-256" },
          };
        case id_sha384WithRSAEncryption:
          return {
            name: "RSASSA-PKCS1-v1_5",
            hash: { name: "SHA-384" },
          };
        case id_sha512WithRSAEncryption:
          return {
            name: "RSASSA-PKCS1-v1_5",
            hash: { name: "SHA-512" },
          };
        case id_RSASSA_PSS:
          if (alg.parameters) {
            const pssParams = AsnConvert.parse(alg.parameters, RsaSaPssParams);
            const algProv = instance.resolve(diAlgorithmProvider);
            const hashAlg = algProv.toWebAlgorithm(pssParams.hashAlgorithm);
            return {
              name: "RSA-PSS",
              hash: hashAlg,
              saltLength: pssParams.saltLength,
            };
          } else {
            return { name: "RSA-PSS" };
          }
      }
      return null;
    }
  },
  "RsaAlgorithm"
));
RsaAlgorithm = RsaAlgorithm_1 = __decorate([injectable_default()], RsaAlgorithm);
instance.registerSingleton(diAlgorithm, RsaAlgorithm);
var ShaAlgorithm = /* @__PURE__ */ __name(
  class ShaAlgorithm2 {
    toAsnAlgorithm(alg) {
      switch (alg.name.toLowerCase()) {
        case "sha-1":
          return new AlgorithmIdentifier({ algorithm: id_sha1 });
        case "sha-256":
          return new AlgorithmIdentifier({ algorithm: id_sha256 });
        case "sha-384":
          return new AlgorithmIdentifier({ algorithm: id_sha384 });
        case "sha-512":
          return new AlgorithmIdentifier({ algorithm: id_sha512 });
      }
      return null;
    }
    toWebAlgorithm(alg) {
      switch (alg.algorithm) {
        case id_sha1:
          return { name: "SHA-1" };
        case id_sha256:
          return { name: "SHA-256" };
        case id_sha384:
          return { name: "SHA-384" };
        case id_sha512:
          return { name: "SHA-512" };
      }
      return null;
    }
  },
  "ShaAlgorithm"
);
ShaAlgorithm = __decorate([injectable_default()], ShaAlgorithm);
instance.registerSingleton(diAlgorithm, ShaAlgorithm);
var AsnEcSignatureFormatter = class {
  addPadding(pointSize, data) {
    const bytes = import_pvtsutils.BufferSourceConverter.toUint8Array(data);
    const res = new Uint8Array(pointSize);
    res.set(bytes, pointSize - bytes.length);
    return res.buffer;
  }
  removePadding(data, positive = false) {
    let bytes = import_pvtsutils.BufferSourceConverter.toUint8Array(data);
    for (let i = 0; i < bytes.length; i++) {
      if (!bytes[i]) {
        continue;
      }
      bytes = bytes.slice(i);
      break;
    }
    if (positive && bytes[0] > 127) {
      const result = new Uint8Array(bytes.length + 1);
      result.set(bytes, 1);
      return result.buffer;
    }
    return bytes.buffer;
  }
  toAsnSignature(algorithm, signature) {
    if (algorithm.name === "ECDSA") {
      const namedCurve = algorithm.namedCurve;
      const pointSize =
        AsnEcSignatureFormatter.namedCurveSize.get(namedCurve) ||
        AsnEcSignatureFormatter.defaultNamedCurveSize;
      const ecSignature = new ECDSASigValue();
      const uint8Signature = import_pvtsutils.BufferSourceConverter.toUint8Array(signature);
      ecSignature.r = this.removePadding(uint8Signature.slice(0, pointSize), true);
      ecSignature.s = this.removePadding(
        uint8Signature.slice(pointSize, pointSize + pointSize),
        true
      );
      return AsnConvert.serialize(ecSignature);
    }
    return null;
  }
  toWebSignature(algorithm, signature) {
    if (algorithm.name === "ECDSA") {
      const ecSigValue = AsnConvert.parse(signature, ECDSASigValue);
      const namedCurve = algorithm.namedCurve;
      const pointSize =
        AsnEcSignatureFormatter.namedCurveSize.get(namedCurve) ||
        AsnEcSignatureFormatter.defaultNamedCurveSize;
      const r = this.addPadding(pointSize, this.removePadding(ecSigValue.r));
      const s = this.addPadding(pointSize, this.removePadding(ecSigValue.s));
      return (0, import_pvtsutils.combine)(r, s);
    }
    return null;
  }
};
__name(AsnEcSignatureFormatter, "AsnEcSignatureFormatter");
AsnEcSignatureFormatter.namedCurveSize = /* @__PURE__ */ new Map();
AsnEcSignatureFormatter.defaultNamedCurveSize = 32;
var idX25519 = "1.3.101.110";
var idX448 = "1.3.101.111";
var idEd25519 = "1.3.101.112";
var idEd448 = "1.3.101.113";
var EdAlgorithm = /* @__PURE__ */ __name(
  class EdAlgorithm2 {
    toAsnAlgorithm(alg) {
      let algorithm = null;
      switch (alg.name.toLowerCase()) {
        case "ed25519":
          algorithm = idEd25519;
          break;
        case "x25519":
          algorithm = idX25519;
          break;
        case "eddsa":
          switch (alg.namedCurve.toLowerCase()) {
            case "ed25519":
              algorithm = idEd25519;
              break;
            case "ed448":
              algorithm = idEd448;
              break;
          }
          break;
        case "ecdh-es":
          switch (alg.namedCurve.toLowerCase()) {
            case "x25519":
              algorithm = idX25519;
              break;
            case "x448":
              algorithm = idX448;
              break;
          }
      }
      if (algorithm) {
        return new AlgorithmIdentifier({ algorithm });
      }
      return null;
    }
    toWebAlgorithm(alg) {
      switch (alg.algorithm) {
        case idEd25519:
          return { name: "Ed25519" };
        case idEd448:
          return {
            name: "EdDSA",
            namedCurve: "Ed448",
          };
        case idX25519:
          return { name: "X25519" };
        case idX448:
          return {
            name: "ECDH-ES",
            namedCurve: "X448",
          };
      }
      return null;
    }
  },
  "EdAlgorithm"
);
EdAlgorithm = __decorate([injectable_default()], EdAlgorithm);
instance.registerSingleton(diAlgorithm, EdAlgorithm);
var _Pkcs10CertificateRequest_tbs;
var _Pkcs10CertificateRequest_subjectName;
var _Pkcs10CertificateRequest_subject;
var _Pkcs10CertificateRequest_signatureAlgorithm;
var _Pkcs10CertificateRequest_signature;
var _Pkcs10CertificateRequest_publicKey;
var _Pkcs10CertificateRequest_attributes;
var _Pkcs10CertificateRequest_extensions;
var Pkcs10CertificateRequest = class extends PemData {
  get subjectName() {
    if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_subjectName, "f")) {
      __classPrivateFieldSet(
        this,
        _Pkcs10CertificateRequest_subjectName,
        new Name3(this.asn.certificationRequestInfo.subject),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_subjectName, "f");
  }
  get subject() {
    if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_subject, "f")) {
      __classPrivateFieldSet(
        this,
        _Pkcs10CertificateRequest_subject,
        this.subjectName.toString(),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_subject, "f");
  }
  get signatureAlgorithm() {
    if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_signatureAlgorithm, "f")) {
      const algProv = instance.resolve(diAlgorithmProvider);
      __classPrivateFieldSet(
        this,
        _Pkcs10CertificateRequest_signatureAlgorithm,
        algProv.toWebAlgorithm(this.asn.signatureAlgorithm),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_signatureAlgorithm, "f");
  }
  get signature() {
    if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_signature, "f")) {
      __classPrivateFieldSet(this, _Pkcs10CertificateRequest_signature, this.asn.signature, "f");
    }
    return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_signature, "f");
  }
  get publicKey() {
    if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_publicKey, "f")) {
      __classPrivateFieldSet(
        this,
        _Pkcs10CertificateRequest_publicKey,
        new PublicKey(this.asn.certificationRequestInfo.subjectPKInfo),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_publicKey, "f");
  }
  get attributes() {
    if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_attributes, "f")) {
      __classPrivateFieldSet(
        this,
        _Pkcs10CertificateRequest_attributes,
        this.asn.certificationRequestInfo.attributes.map((o) =>
          AttributeFactory.create(AsnConvert.serialize(o))
        ),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_attributes, "f");
  }
  get extensions() {
    if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_extensions, "f")) {
      __classPrivateFieldSet(this, _Pkcs10CertificateRequest_extensions, [], "f");
      const extensions = this.getAttribute(id_pkcs9_at_extensionRequest);
      if (extensions instanceof ExtensionsAttribute) {
        __classPrivateFieldSet(this, _Pkcs10CertificateRequest_extensions, extensions.items, "f");
      }
    }
    return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_extensions, "f");
  }
  get tbs() {
    if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_tbs, "f")) {
      __classPrivateFieldSet(
        this,
        _Pkcs10CertificateRequest_tbs,
        this.asn.certificationRequestInfoRaw ||
          AsnConvert.serialize(this.asn.certificationRequestInfo),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_tbs, "f");
  }
  constructor(param) {
    const args = PemData.isAsnEncoded(param) ? [param, CertificationRequest] : [param];
    super(args[0], args[1]);
    _Pkcs10CertificateRequest_tbs.set(this, void 0);
    _Pkcs10CertificateRequest_subjectName.set(this, void 0);
    _Pkcs10CertificateRequest_subject.set(this, void 0);
    _Pkcs10CertificateRequest_signatureAlgorithm.set(this, void 0);
    _Pkcs10CertificateRequest_signature.set(this, void 0);
    _Pkcs10CertificateRequest_publicKey.set(this, void 0);
    _Pkcs10CertificateRequest_attributes.set(this, void 0);
    _Pkcs10CertificateRequest_extensions.set(this, void 0);
    this.tag = PemConverter.CertificateRequestTag;
  }
  onInit(_asn) {}
  getAttribute(type) {
    for (const attr of this.attributes) {
      if (attr.type === type) {
        return attr;
      }
    }
    return null;
  }
  getAttributes(type) {
    return this.attributes.filter((o) => o.type === type);
  }
  getExtension(type) {
    for (const ext of this.extensions) {
      if (ext.type === type) {
        return ext;
      }
    }
    return null;
  }
  getExtensions(type) {
    return this.extensions.filter((o) => o.type === type);
  }
  async verify(crypto2 = cryptoProvider.get()) {
    const algorithm = {
      ...this.publicKey.algorithm,
      ...this.signatureAlgorithm,
    };
    const publicKey = await this.publicKey.export(algorithm, ["verify"], crypto2);
    const signatureFormatters = instance.resolveAll(diAsnSignatureFormatter).reverse();
    let signature = null;
    for (const signatureFormatter of signatureFormatters) {
      signature = signatureFormatter.toWebSignature(algorithm, this.signature);
      if (signature) {
        break;
      }
    }
    if (!signature) {
      throw Error("Cannot convert WebCrypto signature value to ASN.1 format");
    }
    const ok = await crypto2.subtle.verify(this.signatureAlgorithm, publicKey, signature, this.tbs);
    return ok;
  }
  toTextObject() {
    const obj = this.toTextObjectEmpty();
    const req = AsnConvert.parse(this.rawData, CertificationRequest);
    const tbs = req.certificationRequestInfo;
    const data = new TextObject("", {
      Version: `${Version[tbs.version]} (${tbs.version})`,
      Subject: this.subject,
      "Subject Public Key Info": this.publicKey,
    });
    if (this.attributes.length) {
      const attrs = new TextObject("");
      for (const ext of this.attributes) {
        const attrObj = ext.toTextObject();
        attrs[attrObj[TextObject.NAME]] = attrObj;
      }
      data["Attributes"] = attrs;
    }
    obj["Data"] = data;
    obj["Signature"] = new TextObject("", {
      Algorithm: TextConverter.serializeAlgorithm(req.signatureAlgorithm),
      "": req.signature,
    });
    return obj;
  }
};
__name(Pkcs10CertificateRequest, "Pkcs10CertificateRequest");
((_Pkcs10CertificateRequest_tbs = /* @__PURE__ */ new WeakMap()),
  (_Pkcs10CertificateRequest_subjectName = /* @__PURE__ */ new WeakMap()),
  (_Pkcs10CertificateRequest_subject = /* @__PURE__ */ new WeakMap()),
  (_Pkcs10CertificateRequest_signatureAlgorithm = /* @__PURE__ */ new WeakMap()),
  (_Pkcs10CertificateRequest_signature = /* @__PURE__ */ new WeakMap()),
  (_Pkcs10CertificateRequest_publicKey = /* @__PURE__ */ new WeakMap()),
  (_Pkcs10CertificateRequest_attributes = /* @__PURE__ */ new WeakMap()),
  (_Pkcs10CertificateRequest_extensions = /* @__PURE__ */ new WeakMap()));
Pkcs10CertificateRequest.NAME = "PKCS#10 Certificate Request";
var _X509Certificate_tbs;
var _X509Certificate_serialNumber;
var _X509Certificate_subjectName;
var _X509Certificate_subject;
var _X509Certificate_issuerName;
var _X509Certificate_issuer;
var _X509Certificate_notBefore;
var _X509Certificate_notAfter;
var _X509Certificate_signatureAlgorithm;
var _X509Certificate_signature;
var _X509Certificate_extensions;
var _X509Certificate_publicKey;
var X509Certificate = class extends PemData {
  get publicKey() {
    if (!__classPrivateFieldGet(this, _X509Certificate_publicKey, "f")) {
      __classPrivateFieldSet(
        this,
        _X509Certificate_publicKey,
        new PublicKey(this.asn.tbsCertificate.subjectPublicKeyInfo),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Certificate_publicKey, "f");
  }
  get serialNumber() {
    if (!__classPrivateFieldGet(this, _X509Certificate_serialNumber, "f")) {
      const tbs = this.asn.tbsCertificate;
      let serialNumberBytes = new Uint8Array(tbs.serialNumber);
      if (
        serialNumberBytes.length > 1 &&
        serialNumberBytes[0] === 0 &&
        serialNumberBytes[1] > 127
      ) {
        serialNumberBytes = serialNumberBytes.slice(1);
      }
      __classPrivateFieldSet(
        this,
        _X509Certificate_serialNumber,
        import_pvtsutils.Convert.ToHex(serialNumberBytes),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Certificate_serialNumber, "f");
  }
  get subjectName() {
    if (!__classPrivateFieldGet(this, _X509Certificate_subjectName, "f")) {
      __classPrivateFieldSet(
        this,
        _X509Certificate_subjectName,
        new Name3(this.asn.tbsCertificate.subject),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Certificate_subjectName, "f");
  }
  get subject() {
    if (!__classPrivateFieldGet(this, _X509Certificate_subject, "f")) {
      __classPrivateFieldSet(this, _X509Certificate_subject, this.subjectName.toString(), "f");
    }
    return __classPrivateFieldGet(this, _X509Certificate_subject, "f");
  }
  get issuerName() {
    if (!__classPrivateFieldGet(this, _X509Certificate_issuerName, "f")) {
      __classPrivateFieldSet(
        this,
        _X509Certificate_issuerName,
        new Name3(this.asn.tbsCertificate.issuer),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Certificate_issuerName, "f");
  }
  get issuer() {
    if (!__classPrivateFieldGet(this, _X509Certificate_issuer, "f")) {
      __classPrivateFieldSet(this, _X509Certificate_issuer, this.issuerName.toString(), "f");
    }
    return __classPrivateFieldGet(this, _X509Certificate_issuer, "f");
  }
  get notBefore() {
    if (!__classPrivateFieldGet(this, _X509Certificate_notBefore, "f")) {
      const notBefore =
        this.asn.tbsCertificate.validity.notBefore.utcTime ||
        this.asn.tbsCertificate.validity.notBefore.generalTime;
      if (!notBefore) {
        throw new Error("Cannot get 'notBefore' value");
      }
      __classPrivateFieldSet(this, _X509Certificate_notBefore, notBefore, "f");
    }
    return __classPrivateFieldGet(this, _X509Certificate_notBefore, "f");
  }
  get notAfter() {
    if (!__classPrivateFieldGet(this, _X509Certificate_notAfter, "f")) {
      const notAfter =
        this.asn.tbsCertificate.validity.notAfter.utcTime ||
        this.asn.tbsCertificate.validity.notAfter.generalTime;
      if (!notAfter) {
        throw new Error("Cannot get 'notAfter' value");
      }
      __classPrivateFieldSet(this, _X509Certificate_notAfter, notAfter, "f");
    }
    return __classPrivateFieldGet(this, _X509Certificate_notAfter, "f");
  }
  get signatureAlgorithm() {
    if (!__classPrivateFieldGet(this, _X509Certificate_signatureAlgorithm, "f")) {
      const algProv = instance.resolve(diAlgorithmProvider);
      __classPrivateFieldSet(
        this,
        _X509Certificate_signatureAlgorithm,
        algProv.toWebAlgorithm(this.asn.signatureAlgorithm),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Certificate_signatureAlgorithm, "f");
  }
  get signature() {
    if (!__classPrivateFieldGet(this, _X509Certificate_signature, "f")) {
      __classPrivateFieldSet(this, _X509Certificate_signature, this.asn.signatureValue, "f");
    }
    return __classPrivateFieldGet(this, _X509Certificate_signature, "f");
  }
  get extensions() {
    if (!__classPrivateFieldGet(this, _X509Certificate_extensions, "f")) {
      __classPrivateFieldSet(this, _X509Certificate_extensions, [], "f");
      if (this.asn.tbsCertificate.extensions) {
        __classPrivateFieldSet(
          this,
          _X509Certificate_extensions,
          this.asn.tbsCertificate.extensions.map((o) =>
            ExtensionFactory.create(AsnConvert.serialize(o))
          ),
          "f"
        );
      }
    }
    return __classPrivateFieldGet(this, _X509Certificate_extensions, "f");
  }
  get tbs() {
    if (!__classPrivateFieldGet(this, _X509Certificate_tbs, "f")) {
      __classPrivateFieldSet(
        this,
        _X509Certificate_tbs,
        this.asn.tbsCertificateRaw || AsnConvert.serialize(this.asn.tbsCertificate),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Certificate_tbs, "f");
  }
  constructor(param) {
    const args = PemData.isAsnEncoded(param) ? [param, Certificate] : [param];
    super(args[0], args[1]);
    _X509Certificate_tbs.set(this, void 0);
    _X509Certificate_serialNumber.set(this, void 0);
    _X509Certificate_subjectName.set(this, void 0);
    _X509Certificate_subject.set(this, void 0);
    _X509Certificate_issuerName.set(this, void 0);
    _X509Certificate_issuer.set(this, void 0);
    _X509Certificate_notBefore.set(this, void 0);
    _X509Certificate_notAfter.set(this, void 0);
    _X509Certificate_signatureAlgorithm.set(this, void 0);
    _X509Certificate_signature.set(this, void 0);
    _X509Certificate_extensions.set(this, void 0);
    _X509Certificate_publicKey.set(this, void 0);
    this.tag = PemConverter.CertificateTag;
  }
  onInit(_asn) {}
  getExtension(type) {
    for (const ext of this.extensions) {
      if (typeof type === "string") {
        if (ext.type === type) {
          return ext;
        }
      } else {
        if (ext instanceof type) {
          return ext;
        }
      }
    }
    return null;
  }
  getExtensions(type) {
    return this.extensions.filter((o) => {
      if (typeof type === "string") {
        return o.type === type;
      } else {
        return o instanceof type;
      }
    });
  }
  async verify(params = {}, crypto2 = cryptoProvider.get()) {
    let keyAlgorithm;
    let publicKey;
    const paramsKey = params.publicKey;
    try {
      if (!paramsKey) {
        keyAlgorithm = {
          ...this.publicKey.algorithm,
          ...this.signatureAlgorithm,
        };
        publicKey = await this.publicKey.export(keyAlgorithm, ["verify"], crypto2);
      } else if ("publicKey" in paramsKey) {
        keyAlgorithm = {
          ...paramsKey.publicKey.algorithm,
          ...this.signatureAlgorithm,
        };
        publicKey = await paramsKey.publicKey.export(keyAlgorithm, ["verify"], crypto2);
      } else if (paramsKey instanceof PublicKey) {
        keyAlgorithm = {
          ...paramsKey.algorithm,
          ...this.signatureAlgorithm,
        };
        publicKey = await paramsKey.export(keyAlgorithm, ["verify"], crypto2);
      } else if (import_pvtsutils.BufferSourceConverter.isBufferSource(paramsKey)) {
        const key = new PublicKey(paramsKey);
        keyAlgorithm = {
          ...key.algorithm,
          ...this.signatureAlgorithm,
        };
        publicKey = await key.export(keyAlgorithm, ["verify"], crypto2);
      } else {
        keyAlgorithm = {
          ...paramsKey.algorithm,
          ...this.signatureAlgorithm,
        };
        publicKey = paramsKey;
      }
    } catch {
      return false;
    }
    const signatureFormatters = instance.resolveAll(diAsnSignatureFormatter).reverse();
    let signature = null;
    for (const signatureFormatter of signatureFormatters) {
      signature = signatureFormatter.toWebSignature(keyAlgorithm, this.signature);
      if (signature) {
        break;
      }
    }
    if (!signature) {
      throw Error("Cannot convert ASN.1 signature value to WebCrypto format");
    }
    const ok = await crypto2.subtle.verify(this.signatureAlgorithm, publicKey, signature, this.tbs);
    if (params.signatureOnly) {
      return ok;
    } else {
      const date = params.date || /* @__PURE__ */ new Date();
      const time3 = date.getTime();
      return ok && this.notBefore.getTime() < time3 && time3 < this.notAfter.getTime();
    }
  }
  async getThumbprint(...args) {
    let crypto2;
    let algorithm = "SHA-1";
    if (args[0]) {
      if (!args[0].subtle) {
        algorithm = args[0] || algorithm;
        crypto2 = args[1];
      } else {
        crypto2 = args[0];
      }
    }
    crypto2 !== null && crypto2 !== void 0 ? crypto2 : (crypto2 = cryptoProvider.get());
    return await crypto2.subtle.digest(algorithm, this.rawData);
  }
  async isSelfSigned(crypto2 = cryptoProvider.get()) {
    return this.subject === this.issuer && (await this.verify({ signatureOnly: true }, crypto2));
  }
  toTextObject() {
    const obj = this.toTextObjectEmpty();
    const cert = AsnConvert.parse(this.rawData, Certificate);
    const tbs = cert.tbsCertificate;
    const data = new TextObject("", {
      Version: `${Version[tbs.version]} (${tbs.version})`,
      "Serial Number": tbs.serialNumber,
      "Signature Algorithm": TextConverter.serializeAlgorithm(tbs.signature),
      Issuer: this.issuer,
      Validity: new TextObject("", {
        "Not Before": tbs.validity.notBefore.getTime(),
        "Not After": tbs.validity.notAfter.getTime(),
      }),
      Subject: this.subject,
      "Subject Public Key Info": this.publicKey,
    });
    if (tbs.issuerUniqueID) {
      data["Issuer Unique ID"] = tbs.issuerUniqueID;
    }
    if (tbs.subjectUniqueID) {
      data["Subject Unique ID"] = tbs.subjectUniqueID;
    }
    if (this.extensions.length) {
      const extensions = new TextObject("");
      for (const ext of this.extensions) {
        const extObj = ext.toTextObject();
        extensions[extObj[TextObject.NAME]] = extObj;
      }
      data["Extensions"] = extensions;
    }
    obj["Data"] = data;
    obj["Signature"] = new TextObject("", {
      Algorithm: TextConverter.serializeAlgorithm(cert.signatureAlgorithm),
      "": cert.signatureValue,
    });
    return obj;
  }
};
__name(X509Certificate, "X509Certificate");
((_X509Certificate_tbs = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_serialNumber = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_subjectName = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_subject = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_issuerName = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_issuer = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_notBefore = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_notAfter = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_signatureAlgorithm = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_signature = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_extensions = /* @__PURE__ */ new WeakMap()),
  (_X509Certificate_publicKey = /* @__PURE__ */ new WeakMap()));
X509Certificate.NAME = "Certificate";
function generateCertificateSerialNumber(input, crypto2 = cryptoProvider.get()) {
  const inputView = import_pvtsutils.BufferSourceConverter.toUint8Array(
    import_pvtsutils.Convert.FromHex(input || "")
  );
  let serialNumber =
    inputView && inputView.length && inputView.some((o) => o > 0)
      ? new Uint8Array(inputView)
      : void 0;
  if (!serialNumber) {
    serialNumber = crypto2.getRandomValues(new Uint8Array(16));
  }
  let firstNonZero = 0;
  while (firstNonZero < serialNumber.length - 1 && serialNumber[firstNonZero] === 0) {
    firstNonZero++;
  }
  serialNumber = serialNumber.slice(firstNonZero);
  if (serialNumber[0] > 127) {
    const newSerialNumber = new Uint8Array(serialNumber.length + 1);
    newSerialNumber[0] = 0;
    newSerialNumber.set(serialNumber, 1);
    serialNumber = newSerialNumber;
  }
  return serialNumber.buffer;
}
__name(generateCertificateSerialNumber, "generateCertificateSerialNumber");
var _X509CrlEntry_serialNumber;
var _X509CrlEntry_revocationDate;
var _X509CrlEntry_reason;
var _X509CrlEntry_invalidity;
var _X509CrlEntry_extensions;
var X509CrlReason;
(function (X509CrlReason2) {
  X509CrlReason2[(X509CrlReason2["unspecified"] = 0)] = "unspecified";
  X509CrlReason2[(X509CrlReason2["keyCompromise"] = 1)] = "keyCompromise";
  X509CrlReason2[(X509CrlReason2["cACompromise"] = 2)] = "cACompromise";
  X509CrlReason2[(X509CrlReason2["affiliationChanged"] = 3)] = "affiliationChanged";
  X509CrlReason2[(X509CrlReason2["superseded"] = 4)] = "superseded";
  X509CrlReason2[(X509CrlReason2["cessationOfOperation"] = 5)] = "cessationOfOperation";
  X509CrlReason2[(X509CrlReason2["certificateHold"] = 6)] = "certificateHold";
  X509CrlReason2[(X509CrlReason2["removeFromCRL"] = 8)] = "removeFromCRL";
  X509CrlReason2[(X509CrlReason2["privilegeWithdrawn"] = 9)] = "privilegeWithdrawn";
  X509CrlReason2[(X509CrlReason2["aACompromise"] = 10)] = "aACompromise";
})(X509CrlReason || (X509CrlReason = {}));
var X509CrlEntry = class extends AsnData {
  get serialNumber() {
    if (!__classPrivateFieldGet(this, _X509CrlEntry_serialNumber, "f")) {
      __classPrivateFieldSet(
        this,
        _X509CrlEntry_serialNumber,
        import_pvtsutils.Convert.ToHex(this.asn.userCertificate),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509CrlEntry_serialNumber, "f");
  }
  get revocationDate() {
    if (!__classPrivateFieldGet(this, _X509CrlEntry_revocationDate, "f")) {
      __classPrivateFieldSet(
        this,
        _X509CrlEntry_revocationDate,
        this.asn.revocationDate.getTime(),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509CrlEntry_revocationDate, "f");
  }
  get reason() {
    if (__classPrivateFieldGet(this, _X509CrlEntry_reason, "f") === void 0) {
      void this.extensions;
    }
    return __classPrivateFieldGet(this, _X509CrlEntry_reason, "f");
  }
  get invalidity() {
    if (__classPrivateFieldGet(this, _X509CrlEntry_invalidity, "f") === void 0) {
      void this.extensions;
    }
    return __classPrivateFieldGet(this, _X509CrlEntry_invalidity, "f");
  }
  get extensions() {
    if (!__classPrivateFieldGet(this, _X509CrlEntry_extensions, "f")) {
      __classPrivateFieldSet(this, _X509CrlEntry_extensions, [], "f");
      if (this.asn.crlEntryExtensions) {
        __classPrivateFieldSet(
          this,
          _X509CrlEntry_extensions,
          this.asn.crlEntryExtensions.map((o) => {
            const extension = ExtensionFactory.create(AsnConvert.serialize(o));
            switch (extension.type) {
              case id_ce_cRLReasons:
                if (__classPrivateFieldGet(this, _X509CrlEntry_reason, "f") === void 0) {
                  __classPrivateFieldSet(
                    this,
                    _X509CrlEntry_reason,
                    AsnConvert.parse(extension.value, CRLReason).reason,
                    "f"
                  );
                }
                break;
              case id_ce_invalidityDate:
                if (__classPrivateFieldGet(this, _X509CrlEntry_invalidity, "f") === void 0) {
                  __classPrivateFieldSet(
                    this,
                    _X509CrlEntry_invalidity,
                    AsnConvert.parse(extension.value, InvalidityDate).value,
                    "f"
                  );
                }
                break;
            }
            return extension;
          }),
          "f"
        );
      }
    }
    return __classPrivateFieldGet(this, _X509CrlEntry_extensions, "f");
  }
  constructor(...args) {
    let raw;
    if (import_pvtsutils.BufferSourceConverter.isBufferSource(args[0])) {
      raw = import_pvtsutils.BufferSourceConverter.toArrayBuffer(args[0]);
    } else if (typeof args[0] === "string") {
      raw = AsnConvert.serialize(
        new RevokedCertificate({
          userCertificate: generateCertificateSerialNumber(args[0]),
          revocationDate: new Time(args[1]),
          crlEntryExtensions: args[2],
        })
      );
    } else if (args[0] instanceof RevokedCertificate) {
      raw = args[0];
    }
    if (!raw) {
      throw new TypeError("Cannot create X509CrlEntry instance. Wrong constructor arguments.");
    }
    super(raw, RevokedCertificate);
    _X509CrlEntry_serialNumber.set(this, void 0);
    _X509CrlEntry_revocationDate.set(this, void 0);
    _X509CrlEntry_reason.set(this, void 0);
    _X509CrlEntry_invalidity.set(this, void 0);
    _X509CrlEntry_extensions.set(this, void 0);
  }
  onInit(_asn) {}
};
__name(X509CrlEntry, "X509CrlEntry");
((_X509CrlEntry_serialNumber = /* @__PURE__ */ new WeakMap()),
  (_X509CrlEntry_revocationDate = /* @__PURE__ */ new WeakMap()),
  (_X509CrlEntry_reason = /* @__PURE__ */ new WeakMap()),
  (_X509CrlEntry_invalidity = /* @__PURE__ */ new WeakMap()),
  (_X509CrlEntry_extensions = /* @__PURE__ */ new WeakMap()));
var _X509Crl_tbs;
var _X509Crl_signatureAlgorithm;
var _X509Crl_issuerName;
var _X509Crl_thisUpdate;
var _X509Crl_nextUpdate;
var _X509Crl_entries;
var _X509Crl_extensions;
var X509Crl = class extends PemData {
  get version() {
    return this.asn.tbsCertList.version;
  }
  get signatureAlgorithm() {
    if (!__classPrivateFieldGet(this, _X509Crl_signatureAlgorithm, "f")) {
      const algProv = instance.resolve(diAlgorithmProvider);
      __classPrivateFieldSet(
        this,
        _X509Crl_signatureAlgorithm,
        algProv.toWebAlgorithm(this.asn.signatureAlgorithm),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Crl_signatureAlgorithm, "f");
  }
  get signature() {
    return this.asn.signature;
  }
  get issuer() {
    return this.issuerName.toString();
  }
  get issuerName() {
    if (!__classPrivateFieldGet(this, _X509Crl_issuerName, "f")) {
      __classPrivateFieldSet(
        this,
        _X509Crl_issuerName,
        new Name3(this.asn.tbsCertList.issuer),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Crl_issuerName, "f");
  }
  get thisUpdate() {
    if (!__classPrivateFieldGet(this, _X509Crl_thisUpdate, "f")) {
      const thisUpdate = this.asn.tbsCertList.thisUpdate.getTime();
      if (!thisUpdate) {
        throw new Error("Cannot get 'thisUpdate' value");
      }
      __classPrivateFieldSet(this, _X509Crl_thisUpdate, thisUpdate, "f");
    }
    return __classPrivateFieldGet(this, _X509Crl_thisUpdate, "f");
  }
  get nextUpdate() {
    var _a3;
    if (__classPrivateFieldGet(this, _X509Crl_nextUpdate, "f") === void 0) {
      __classPrivateFieldSet(
        this,
        _X509Crl_nextUpdate,
        ((_a3 = this.asn.tbsCertList.nextUpdate) === null || _a3 === void 0
          ? void 0
          : _a3.getTime()) || void 0,
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Crl_nextUpdate, "f");
  }
  get entries() {
    var _a3;
    if (!__classPrivateFieldGet(this, _X509Crl_entries, "f")) {
      __classPrivateFieldSet(
        this,
        _X509Crl_entries,
        ((_a3 = this.asn.tbsCertList.revokedCertificates) === null || _a3 === void 0
          ? void 0
          : _a3.map((o) => new X509CrlEntry(o))) || [],
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Crl_entries, "f");
  }
  get extensions() {
    if (!__classPrivateFieldGet(this, _X509Crl_extensions, "f")) {
      __classPrivateFieldSet(this, _X509Crl_extensions, [], "f");
      if (this.asn.tbsCertList.crlExtensions) {
        __classPrivateFieldSet(
          this,
          _X509Crl_extensions,
          this.asn.tbsCertList.crlExtensions.map((o) =>
            ExtensionFactory.create(AsnConvert.serialize(o))
          ),
          "f"
        );
      }
    }
    return __classPrivateFieldGet(this, _X509Crl_extensions, "f");
  }
  get tbs() {
    if (!__classPrivateFieldGet(this, _X509Crl_tbs, "f")) {
      __classPrivateFieldSet(
        this,
        _X509Crl_tbs,
        this.asn.tbsCertListRaw || AsnConvert.serialize(this.asn.tbsCertList),
        "f"
      );
    }
    return __classPrivateFieldGet(this, _X509Crl_tbs, "f");
  }
  get tbsCertListSignatureAlgorithm() {
    return this.asn.tbsCertList.signature;
  }
  get certListSignatureAlgorithm() {
    return this.asn.signatureAlgorithm;
  }
  constructor(param) {
    super(param, PemData.isAsnEncoded(param) ? CertificateList : void 0);
    this.tag = PemConverter.CrlTag;
    _X509Crl_tbs.set(this, void 0);
    _X509Crl_signatureAlgorithm.set(this, void 0);
    _X509Crl_issuerName.set(this, void 0);
    _X509Crl_thisUpdate.set(this, void 0);
    _X509Crl_nextUpdate.set(this, void 0);
    _X509Crl_entries.set(this, void 0);
    _X509Crl_extensions.set(this, void 0);
  }
  onInit(_asn) {}
  getExtension(type) {
    for (const ext of this.extensions) {
      if (typeof type === "string") {
        if (ext.type === type) {
          return ext;
        }
      } else {
        if (ext instanceof type) {
          return ext;
        }
      }
    }
    return null;
  }
  getExtensions(type) {
    return this.extensions.filter((o) => {
      if (typeof type === "string") {
        return o.type === type;
      } else {
        return o instanceof type;
      }
    });
  }
  async verify(params, crypto2 = cryptoProvider.get()) {
    if (!this.certListSignatureAlgorithm.isEqual(this.tbsCertListSignatureAlgorithm)) {
      throw new Error(
        "algorithm identifier in the sequence tbsCertList and CertificateList mismatch"
      );
    }
    let keyAlgorithm;
    let publicKey;
    const paramsKey = params.publicKey;
    try {
      if (paramsKey instanceof X509Certificate) {
        keyAlgorithm = {
          ...paramsKey.publicKey.algorithm,
          ...paramsKey.signatureAlgorithm,
        };
        publicKey = await paramsKey.publicKey.export(keyAlgorithm, ["verify"]);
      } else if (paramsKey instanceof PublicKey) {
        keyAlgorithm = {
          ...paramsKey.algorithm,
          ...this.signatureAlgorithm,
        };
        publicKey = await paramsKey.export(keyAlgorithm, ["verify"]);
      } else {
        keyAlgorithm = {
          ...paramsKey.algorithm,
          ...this.signatureAlgorithm,
        };
        publicKey = paramsKey;
      }
    } catch {
      return false;
    }
    const signatureFormatters = instance.resolveAll(diAsnSignatureFormatter).reverse();
    let signature = null;
    for (const signatureFormatter of signatureFormatters) {
      signature = signatureFormatter.toWebSignature(keyAlgorithm, this.signature);
      if (signature) {
        break;
      }
    }
    if (!signature) {
      throw Error("Cannot convert ASN.1 signature value to WebCrypto format");
    }
    return await crypto2.subtle.verify(this.signatureAlgorithm, publicKey, signature, this.tbs);
  }
  async getThumbprint(...args) {
    let crypto2;
    let algorithm = "SHA-1";
    if (args[0]) {
      if (!args[0].subtle) {
        algorithm = args[0] || algorithm;
        crypto2 = args[1];
      } else {
        crypto2 = args[0];
      }
    }
    crypto2 !== null && crypto2 !== void 0 ? crypto2 : (crypto2 = cryptoProvider.get());
    return await crypto2.subtle.digest(algorithm, this.rawData);
  }
  findRevoked(certOrSerialNumber) {
    const serialNumber =
      typeof certOrSerialNumber === "string" ? certOrSerialNumber : certOrSerialNumber.serialNumber;
    const serialBuffer = generateCertificateSerialNumber(serialNumber);
    for (const revoked of this.asn.tbsCertList.revokedCertificates || []) {
      if (import_pvtsutils.BufferSourceConverter.isEqual(revoked.userCertificate, serialBuffer)) {
        return new X509CrlEntry(AsnConvert.serialize(revoked));
      }
    }
    return null;
  }
};
__name(X509Crl, "X509Crl");
((_X509Crl_tbs = /* @__PURE__ */ new WeakMap()),
  (_X509Crl_signatureAlgorithm = /* @__PURE__ */ new WeakMap()),
  (_X509Crl_issuerName = /* @__PURE__ */ new WeakMap()),
  (_X509Crl_thisUpdate = /* @__PURE__ */ new WeakMap()),
  (_X509Crl_nextUpdate = /* @__PURE__ */ new WeakMap()),
  (_X509Crl_entries = /* @__PURE__ */ new WeakMap()),
  (_X509Crl_extensions = /* @__PURE__ */ new WeakMap()));
ExtensionFactory.register(id_ce_basicConstraints, BasicConstraintsExtension);
ExtensionFactory.register(id_ce_extKeyUsage, ExtendedKeyUsageExtension);
ExtensionFactory.register(id_ce_keyUsage, KeyUsagesExtension);
ExtensionFactory.register(id_ce_subjectKeyIdentifier, SubjectKeyIdentifierExtension);
ExtensionFactory.register(id_ce_authorityKeyIdentifier, AuthorityKeyIdentifierExtension);
ExtensionFactory.register(id_ce_subjectAltName, SubjectAlternativeNameExtension);
ExtensionFactory.register(id_ce_cRLDistributionPoints, CRLDistributionPointsExtension);
ExtensionFactory.register(id_pe_authorityInfoAccess, AuthorityInfoAccessExtension);
ExtensionFactory.register(id_ce_issuerAltName, IssuerAlternativeNameExtension);
AttributeFactory.register(id_pkcs9_at_challengePassword, ChallengePasswordAttribute);
AttributeFactory.register(id_pkcs9_at_extensionRequest, ExtensionsAttribute);
instance.registerSingleton(diAsnSignatureFormatter, AsnDefaultSignatureFormatter);
instance.registerSingleton(diAsnSignatureFormatter, AsnEcSignatureFormatter);
AsnEcSignatureFormatter.namedCurveSize.set("P-256", 32);
AsnEcSignatureFormatter.namedCurveSize.set("K-256", 32);
AsnEcSignatureFormatter.namedCurveSize.set("P-384", 48);
AsnEcSignatureFormatter.namedCurveSize.set("P-521", 66);

// node_modules/@simplewebauthn/server/esm/helpers/fetch.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function fetch(url) {
  return _fetchInternals.stubThis(url);
}
__name(fetch, "fetch");
var _fetchInternals = {
  stubThis: (url) => globalThis.fetch(url),
};

// node_modules/@simplewebauthn/server/esm/helpers/isCertRevoked.js
var cacheRevokedCerts = {};
async function isCertRevoked(cert) {
  const { extensions } = cert;
  if (!extensions) {
    return false;
  }
  let extAuthorityKeyID;
  let extSubjectKeyID;
  let extCRLDistributionPoints;
  extensions.forEach((ext) => {
    if (ext instanceof AuthorityKeyIdentifierExtension) {
      extAuthorityKeyID = ext;
    } else if (ext instanceof SubjectKeyIdentifierExtension) {
      extSubjectKeyID = ext;
    } else if (ext instanceof CRLDistributionPointsExtension) {
      extCRLDistributionPoints = ext;
    }
  });
  let keyIdentifier = void 0;
  if (extAuthorityKeyID && extAuthorityKeyID.keyId) {
    keyIdentifier = extAuthorityKeyID.keyId;
  } else if (extSubjectKeyID) {
    keyIdentifier = extSubjectKeyID.keyId;
  }
  if (keyIdentifier) {
    const cached = cacheRevokedCerts[keyIdentifier];
    if (cached) {
      const now = /* @__PURE__ */ new Date();
      if (!cached.nextUpdate || cached.nextUpdate > now) {
        return cached.revokedCerts.indexOf(cert.serialNumber) >= 0;
      }
    }
  }
  const crlURL =
    extCRLDistributionPoints?.distributionPoints?.[0].distributionPoint?.fullName?.[0]
      .uniformResourceIdentifier;
  if (!crlURL) {
    return false;
  }
  let certListBytes;
  try {
    const respCRL = await fetch(crlURL);
    certListBytes = await respCRL.arrayBuffer();
  } catch (_err) {
    return false;
  }
  let data;
  try {
    data = new X509Crl(certListBytes);
  } catch (_err) {
    return false;
  }
  const newCached = {
    revokedCerts: [],
    nextUpdate: void 0,
  };
  if (data.nextUpdate) {
    newCached.nextUpdate = data.nextUpdate;
  }
  const revokedCerts = data.entries;
  if (revokedCerts) {
    for (const cert2 of revokedCerts) {
      const revokedHex = cert2.serialNumber;
      newCached.revokedCerts.push(revokedHex);
    }
    if (keyIdentifier) {
      cacheRevokedCerts[keyIdentifier] = newCached;
    }
    return newCached.revokedCerts.indexOf(cert.serialNumber) >= 0;
  }
  return false;
}
__name(isCertRevoked, "isCertRevoked");

// node_modules/@simplewebauthn/server/esm/helpers/parseAuthenticatorData.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/decodeAuthenticatorExtensions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function decodeAuthenticatorExtensions(extensionData) {
  let toCBOR;
  try {
    toCBOR = isoCBOR_exports.decodeFirst(extensionData);
  } catch (err) {
    const _err = err;
    throw new Error(`Error decoding authenticator extensions: ${_err.message}`);
  }
  return convertMapToObjectDeep(toCBOR);
}
__name(decodeAuthenticatorExtensions, "decodeAuthenticatorExtensions");
function convertMapToObjectDeep(input) {
  const mapped = {};
  for (const [key, value] of input) {
    if (value instanceof Map) {
      mapped[key] = convertMapToObjectDeep(value);
    } else {
      mapped[key] = value;
    }
  }
  return mapped;
}
__name(convertMapToObjectDeep, "convertMapToObjectDeep");

// node_modules/@simplewebauthn/server/esm/helpers/parseAuthenticatorData.js
function parseAuthenticatorData(authData) {
  if (authData.byteLength < 37) {
    throw new Error(
      `Authenticator data was ${authData.byteLength} bytes, expected at least 37 bytes`
    );
  }
  let pointer = 0;
  const dataView = isoUint8Array_exports.toDataView(authData);
  const rpIdHash = authData.slice(pointer, (pointer += 32));
  const flagsBuf = authData.slice(pointer, (pointer += 1));
  const flagsInt = flagsBuf[0];
  const flags = {
    up: !!(flagsInt & (1 << 0)),
    // User Presence
    uv: !!(flagsInt & (1 << 2)),
    // User Verified
    be: !!(flagsInt & (1 << 3)),
    // Backup Eligibility
    bs: !!(flagsInt & (1 << 4)),
    // Backup State
    at: !!(flagsInt & (1 << 6)),
    // Attested Credential Data Present
    ed: !!(flagsInt & (1 << 7)),
    // Extension Data Present
    flagsInt,
  };
  const counterBuf = authData.slice(pointer, pointer + 4);
  const counter = dataView.getUint32(pointer, false);
  pointer += 4;
  let aaguid = void 0;
  let credentialID = void 0;
  let credentialPublicKey = void 0;
  if (flags.at) {
    aaguid = authData.slice(pointer, (pointer += 16));
    const credIDLen = dataView.getUint16(pointer);
    pointer += 2;
    credentialID = authData.slice(pointer, (pointer += credIDLen));
    const badEdDSACBOR = isoUint8Array_exports.fromHex("a301634f4b500327206745643235353139");
    const bytesAtCurrentPosition = authData.slice(pointer, pointer + badEdDSACBOR.byteLength);
    let foundBadCBOR = false;
    if (isoUint8Array_exports.areEqual(badEdDSACBOR, bytesAtCurrentPosition)) {
      foundBadCBOR = true;
      authData[pointer] = 164;
    }
    const firstDecoded = isoCBOR_exports.decodeFirst(authData.slice(pointer));
    const firstEncoded = Uint8Array.from(
      /**
       * Casting to `Map` via `as unknown` here because TS doesn't make it possible to define Maps
       * with discrete keys and properties with known types per pair, and CBOR libs typically parse
       * CBOR Major Type 5 to `Map` because you can have numbers for keys. A `COSEPublicKey` can be
       * generalized as "a Map with numbers for keys and either numbers or bytes for values" though.
       * If this presumption falls apart then other parts of verification later on will fail so we
       * should be safe doing this here.
       */
      isoCBOR_exports.encode(firstDecoded)
    );
    if (foundBadCBOR) {
      authData[pointer] = 163;
    }
    credentialPublicKey = firstEncoded;
    pointer += firstEncoded.byteLength;
  }
  let extensionsData = void 0;
  let extensionsDataBuffer = void 0;
  if (flags.ed) {
    const firstDecoded = isoCBOR_exports.decodeFirst(authData.slice(pointer));
    extensionsDataBuffer = Uint8Array.from(isoCBOR_exports.encode(firstDecoded));
    extensionsData = decodeAuthenticatorExtensions(extensionsDataBuffer);
    pointer += extensionsDataBuffer.byteLength;
  }
  if (authData.byteLength > pointer) {
    throw new Error("Leftover bytes detected while parsing authenticator data");
  }
  return _parseAuthenticatorDataInternals.stubThis({
    rpIdHash,
    flagsBuf,
    flags,
    counter,
    counterBuf,
    aaguid,
    credentialID,
    credentialPublicKey,
    extensionsData,
    extensionsDataBuffer,
  });
}
__name(parseAuthenticatorData, "parseAuthenticatorData");
var _parseAuthenticatorDataInternals = {
  stubThis: (value) => value,
};

// node_modules/@simplewebauthn/server/esm/helpers/toHash.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function toHash(data, algorithm = -7) {
  if (typeof data === "string") {
    data = isoUint8Array_exports.fromUTF8String(data);
  }
  const digest2 = isoCrypto_exports.digest(data, algorithm);
  return digest2;
}
__name(toHash, "toHash");

// node_modules/@simplewebauthn/server/esm/helpers/validateCertificatePath.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function validateCertificatePath(x5cCertsPEM, trustAnchorsPEM = []) {
  if (trustAnchorsPEM.length === 0) {
    return true;
  }
  const WebCrypto = await getWebCrypto();
  const x5cCertsParsed = x5cCertsPEM.map((certPEM) => new X509Certificate(certPEM));
  for (let i = 0; i < x5cCertsParsed.length; i++) {
    const cert = x5cCertsParsed[i];
    const certPEM = x5cCertsPEM[i];
    try {
      await assertCertNotRevoked(cert);
    } catch (_err) {
      throw new Error(`Found revoked certificate in x5c:
${certPEM}`);
    }
    try {
      assertCertIsWithinValidTimeWindow(cert.notBefore, cert.notAfter);
    } catch (_err) {
      throw new Error(`Found certificate out of validity period in x5c:
${certPEM}`);
    }
  }
  const trustAnchorsParsed = trustAnchorsPEM.map((certPEM) => {
    try {
      return new X509Certificate(certPEM);
    } catch (err) {
      const _err = err;
      throw new Error(
        `Could not parse trust anchor certificate:
${certPEM}`,
        { cause: _err }
      );
    }
  });
  const validTrustAnchors = [];
  for (let i = 0; i < trustAnchorsParsed.length; i++) {
    const cert = trustAnchorsParsed[i];
    try {
      await assertCertNotRevoked(cert);
    } catch (_err) {
      continue;
    }
    try {
      assertCertIsWithinValidTimeWindow(cert.notBefore, cert.notAfter);
    } catch (_err) {
      continue;
    }
    validTrustAnchors.push(cert);
  }
  if (validTrustAnchors.length === 0) {
    throw new Error("No specified trust anchor was valid for verifying x5c");
  }
  let invalidSubjectAndIssuerError = false;
  for (const anchor of trustAnchorsParsed) {
    try {
      const x5cWithTrustAnchor = x5cCertsParsed.concat([anchor]);
      if (new Set(x5cWithTrustAnchor).size !== x5cWithTrustAnchor.length) {
        throw new Error("Invalid certificate path: found duplicate certificates");
      }
      for (let i = 0; i < x5cWithTrustAnchor.length - 1; i++) {
        const subject = x5cWithTrustAnchor[i];
        const issuer = x5cWithTrustAnchor[i + 1];
        const issuerSignedSubject = await subject.verify(
          { publicKey: issuer.publicKey, signatureOnly: true },
          WebCrypto
        );
        if (!issuerSignedSubject) {
          throw new InvalidSubjectAndIssuer();
        }
        if (issuer.subject === issuer.issuer) {
          const issuerSignedIssuer = await issuer.verify(
            { publicKey: issuer.publicKey, signatureOnly: true },
            WebCrypto
          );
          if (!issuerSignedIssuer) {
            throw new InvalidSubjectAndIssuer();
          }
          break;
        }
      }
      invalidSubjectAndIssuerError = false;
      break;
    } catch (err) {
      if (err instanceof InvalidSubjectAndIssuer) {
        invalidSubjectAndIssuerError = true;
      } else {
        throw new Error("Unexpected error while validating certificate path", { cause: err });
      }
    }
  }
  if (invalidSubjectAndIssuerError) {
    throw new InvalidSubjectAndIssuer();
  }
  return true;
}
__name(validateCertificatePath, "validateCertificatePath");
async function assertCertNotRevoked(certificate) {
  const subjectCertRevoked = await isCertRevoked(certificate);
  if (subjectCertRevoked) {
    throw new Error("Found revoked certificate in certificate path");
  }
}
__name(assertCertNotRevoked, "assertCertNotRevoked");
function assertCertIsWithinValidTimeWindow(certNotBefore, certNotAfter) {
  const now = new Date(Date.now());
  if (certNotBefore > now || certNotAfter < now) {
    throw new Error("Certificate is not yet valid or expired");
  }
}
__name(assertCertIsWithinValidTimeWindow, "assertCertIsWithinValidTimeWindow");
var InvalidSubjectAndIssuer = class extends Error {
  constructor() {
    const message = "Subject issuer did not match issuer subject";
    super(message);
    this.name = "InvalidSubjectAndIssuer";
  }
};
__name(InvalidSubjectAndIssuer, "InvalidSubjectAndIssuer");

// node_modules/@simplewebauthn/server/esm/helpers/verifySignature.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/convertX509PublicKeyToCOSE.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/mapX509SignatureAlgToCOSEAlg.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function mapX509SignatureAlgToCOSEAlg(signatureAlgorithm) {
  let alg;
  if (signatureAlgorithm === "1.2.840.10045.4.3.2") {
    alg = COSEALG.ES256;
  } else if (signatureAlgorithm === "1.2.840.10045.4.3.3") {
    alg = COSEALG.ES384;
  } else if (signatureAlgorithm === "1.2.840.10045.4.3.4") {
    alg = COSEALG.ES512;
  } else if (signatureAlgorithm === "1.2.840.113549.1.1.11") {
    alg = COSEALG.RS256;
  } else if (signatureAlgorithm === "1.2.840.113549.1.1.12") {
    alg = COSEALG.RS384;
  } else if (signatureAlgorithm === "1.2.840.113549.1.1.13") {
    alg = COSEALG.RS512;
  } else if (signatureAlgorithm === "1.2.840.113549.1.1.5") {
    alg = COSEALG.RS1;
  } else {
    throw new Error(
      `Unable to map X.509 signature algorithm ${signatureAlgorithm} to a COSE algorithm`
    );
  }
  return alg;
}
__name(mapX509SignatureAlgToCOSEAlg, "mapX509SignatureAlgToCOSEAlg");

// node_modules/@simplewebauthn/server/esm/helpers/convertX509PublicKeyToCOSE.js
function convertX509PublicKeyToCOSE(x509Certificate) {
  let cosePublicKey = /* @__PURE__ */ new Map();
  const x509 = AsnParser.parse(x509Certificate, Certificate);
  const { tbsCertificate } = x509;
  const { subjectPublicKeyInfo, signature: _tbsSignature } = tbsCertificate;
  const signatureAlgorithm = _tbsSignature.algorithm;
  const publicKeyAlgorithmID = subjectPublicKeyInfo.algorithm.algorithm;
  if (publicKeyAlgorithmID === id_ecPublicKey) {
    if (!subjectPublicKeyInfo.algorithm.parameters) {
      throw new Error("Certificate public key was missing parameters (EC2)");
    }
    const ecParameters = AsnParser.parse(
      new Uint8Array(subjectPublicKeyInfo.algorithm.parameters),
      ECParameters
    );
    let crv = -999;
    const { namedCurve } = ecParameters;
    if (namedCurve === id_secp256r1) {
      crv = COSECRV.P256;
    } else if (namedCurve === id_secp384r1) {
      crv = COSECRV.P384;
    } else {
      throw new Error(`Certificate public key contained unexpected namedCurve ${namedCurve} (EC2)`);
    }
    const subjectPublicKey = new Uint8Array(subjectPublicKeyInfo.subjectPublicKey);
    let x;
    let y;
    if (subjectPublicKey[0] === 4) {
      let pointer = 1;
      const halfLength = (subjectPublicKey.length - 1) / 2;
      x = subjectPublicKey.slice(pointer, (pointer += halfLength));
      y = subjectPublicKey.slice(pointer);
    } else {
      throw new Error('TODO: Figure out how to handle public keys in "compressed form"');
    }
    const coseEC2PubKey = /* @__PURE__ */ new Map();
    coseEC2PubKey.set(COSEKEYS.kty, COSEKTY.EC2);
    coseEC2PubKey.set(COSEKEYS.alg, mapX509SignatureAlgToCOSEAlg(signatureAlgorithm));
    coseEC2PubKey.set(COSEKEYS.crv, crv);
    coseEC2PubKey.set(COSEKEYS.x, x);
    coseEC2PubKey.set(COSEKEYS.y, y);
    cosePublicKey = coseEC2PubKey;
  } else if (publicKeyAlgorithmID === id_rsaEncryption) {
    const rsaPublicKey = AsnParser.parse(subjectPublicKeyInfo.subjectPublicKey, RSAPublicKey);
    const coseRSAPubKey = /* @__PURE__ */ new Map();
    coseRSAPubKey.set(COSEKEYS.kty, COSEKTY.RSA);
    coseRSAPubKey.set(COSEKEYS.alg, mapX509SignatureAlgToCOSEAlg(signatureAlgorithm));
    coseRSAPubKey.set(COSEKEYS.n, new Uint8Array(rsaPublicKey.modulus));
    coseRSAPubKey.set(COSEKEYS.e, new Uint8Array(rsaPublicKey.publicExponent));
    cosePublicKey = coseRSAPubKey;
  } else {
    throw new Error(
      `Certificate public key contained unexpected algorithm ID ${publicKeyAlgorithmID}`
    );
  }
  return cosePublicKey;
}
__name(convertX509PublicKeyToCOSE, "convertX509PublicKeyToCOSE");

// node_modules/@simplewebauthn/server/esm/helpers/verifySignature.js
function verifySignature(opts) {
  const { signature, data, credentialPublicKey, x509Certificate, hashAlgorithm } = opts;
  if (!x509Certificate && !credentialPublicKey) {
    throw new Error('Must declare either "leafCert" or "credentialPublicKey"');
  }
  if (x509Certificate && credentialPublicKey) {
    throw new Error('Must not declare both "leafCert" and "credentialPublicKey"');
  }
  let cosePublicKey = /* @__PURE__ */ new Map();
  if (credentialPublicKey) {
    cosePublicKey = decodeCredentialPublicKey(credentialPublicKey);
  } else if (x509Certificate) {
    cosePublicKey = convertX509PublicKeyToCOSE(x509Certificate);
  }
  return _verifySignatureInternals.stubThis(
    isoCrypto_exports.verify({
      cosePublicKey,
      signature,
      data,
      shaHashOverride: hashAlgorithm,
    })
  );
}
__name(verifySignature, "verifySignature");
var _verifySignatureInternals = {
  stubThis: (value) => value,
};

// node_modules/@simplewebauthn/server/esm/metadata/verifyMDSBlob.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/metadata/parseJWT.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function parseJWT(jwt) {
  const parts = jwt.split(".");
  return [
    JSON.parse(isoBase64URL_exports.toUTF8String(parts[0])),
    JSON.parse(isoBase64URL_exports.toUTF8String(parts[1])),
    parts[2],
  ];
}
__name(parseJWT, "parseJWT");

// node_modules/@simplewebauthn/server/esm/metadata/verifyJWT.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function verifyJWT(jwt, leafCert) {
  const [header, payload, signature] = jwt.split(".");
  const certCOSE = convertX509PublicKeyToCOSE(leafCert);
  const data = isoUint8Array_exports.fromUTF8String(`${header}.${payload}`);
  const signatureBytes = isoBase64URL_exports.toBuffer(signature);
  if (isCOSEPublicKeyEC2(certCOSE)) {
    return verifyEC2({
      data,
      signature: signatureBytes,
      cosePublicKey: certCOSE,
      shaHashOverride: COSEALG.ES256,
    });
  } else if (isCOSEPublicKeyRSA(certCOSE)) {
    return verifyRSA({
      data,
      signature: signatureBytes,
      cosePublicKey: certCOSE,
    });
  }
  const kty = certCOSE.get(COSEKEYS.kty);
  throw new Error(`JWT verification with public key of kty ${kty} is not supported by this method`);
}
__name(verifyJWT, "verifyJWT");

// node_modules/@simplewebauthn/server/esm/helpers/convertPEMToBytes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function convertPEMToBytes(pem) {
  const certBase64 = pem
    .replace("-----BEGIN CERTIFICATE-----", "")
    .replace("-----END CERTIFICATE-----", "")
    .replace(/[\n ]/g, "");
  return isoBase64URL_exports.toBuffer(certBase64, "base64");
}
__name(convertPEMToBytes, "convertPEMToBytes");

// node_modules/@simplewebauthn/server/esm/services/settingsService.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/services/defaultRootCerts/android-safetynet.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GlobalSign_Root_CA = `-----BEGIN CERTIFICATE-----
MIIDdTCCAl2gAwIBAgILBAAAAAABFUtaw5QwDQYJKoZIhvcNAQEFBQAwVzELMAkG
A1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExEDAOBgNVBAsTB1Jv
b3QgQ0ExGzAZBgNVBAMTEkdsb2JhbFNpZ24gUm9vdCBDQTAeFw05ODA5MDExMjAw
MDBaFw0yODAxMjgxMjAwMDBaMFcxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9i
YWxTaWduIG52LXNhMRAwDgYDVQQLEwdSb290IENBMRswGQYDVQQDExJHbG9iYWxT
aWduIFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDaDuaZ
jc6j40+Kfvvxi4Mla+pIH/EqsLmVEQS98GPR4mdmzxzdzxtIK+6NiY6arymAZavp
xy0Sy6scTHAHoT0KMM0VjU/43dSMUBUc71DuxC73/OlS8pF94G3VNTCOXkNz8kHp
1Wrjsok6Vjk4bwY8iGlbKk3Fp1S4bInMm/k8yuX9ifUSPJJ4ltbcdG6TRGHRjcdG
snUOhugZitVtbNV4FpWi6cgKOOvyJBNPc1STE4U6G7weNLWLBYy5d4ux2x8gkasJ
U26Qzns3dLlwR5EiUWMWea6xrkEmCMgZK9FGqkjWZCrXgzT/LCrBbBlDSgeF59N8
9iFo7+ryUp9/k5DPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8E
BTADAQH/MB0GA1UdDgQWBBRge2YaRQ2XyolQL30EzTSo//z9SzANBgkqhkiG9w0B
AQUFAAOCAQEA1nPnfE920I2/7LqivjTFKDK1fPxsnCwrvQmeU79rXqoRSLblCKOz
yj1hTdNGCbM+w6DjY1Ub8rrvrTnhQ7k4o+YviiY776BQVvnGCv04zcQLcFGUl5gE
38NflNUVyRRBnMRddWQVDf9VMOyGj/8N7yy5Y0b2qvzfvGn9LhJIZJrglfCm7ymP
AbEVtQwdpf5pLGkkeB6zpxxxYu7KyJesF12KwvhHhm4qxFYxldBniYUr+WymXUad
DKqC5JlR3XC321Y9YeRq4VzW9v493kHMB65jUr9TU/Qr6cf9tveCX4XSQRjbgbME
HMUfpIBvFSDJ3gyICh3WZlXi/EjJKSZp4A==
-----END CERTIFICATE-----
`;

// node_modules/@simplewebauthn/server/esm/services/defaultRootCerts/android-key.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Google_Hardware_Attestation_Root_1 = `-----BEGIN CERTIFICATE-----
MIIFYDCCA0igAwIBAgIJAOj6GWMU0voYMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAUTEGY5MjAwOWU4NTNiNmIwNDUwHhcNMTYwNTI2MTYyODUyWhcNMjYwNTI0MTYy
ODUyWjAbMRkwFwYDVQQFExBmOTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0B
AQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHsK7Qui8xUFmOr75gvMsd/dTEDDJdS
Sxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfdnJLmN0pTy/4lj4/7
tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL/ggj
nar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGq
C4FSYa04T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQ
oVJYnFPlXTcHYvASLu+RhhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+O
JtvsBslHZvPBKCOdT0MS+tgSOIfga+z1Z1g7+DVagf7quvmag8jfPioyKvxnK/Eg
sTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgpZrt3i5MIlCaY504LzSRi
igHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6tUXHI/+M
RPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9E
aDK8Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5Um
AGMCAwEAAaOBpjCBozAdBgNVHQ4EFgQUNmHhAHyIBQlRi0RsR/8aTMnqTxIwHwYD
VR0jBBgwFoAUNmHhAHyIBQlRi0RsR/8aTMnqTxIwDwYDVR0TAQH/BAUwAwEB/zAO
BgNVHQ8BAf8EBAMCAYYwQAYDVR0fBDkwNzA1oDOgMYYvaHR0cHM6Ly9hbmRyb2lk
Lmdvb2dsZWFwaXMuY29tL2F0dGVzdGF0aW9uL2NybC8wDQYJKoZIhvcNAQELBQAD
ggIBACDIw41L3KlXG0aMiS//cqrG+EShHUGo8HNsw30W1kJtjn6UBwRM6jnmiwfB
Pb8VA91chb2vssAtX2zbTvqBJ9+LBPGCdw/E53Rbf86qhxKaiAHOjpvAy5Y3m00m
qC0w/Zwvju1twb4vhLaJ5NkUJYsUS7rmJKHHBnETLi8GFqiEsqTWpG/6ibYCv7rY
DBJDcR9W62BW9jfIoBQcxUCUJouMPH25lLNcDc1ssqvC2v7iUgI9LeoM1sNovqPm
QUiG9rHli1vXxzCyaMTjwftkJLkf6724DFhuKug2jITV0QkXvaJWF4nUaHOTNA4u
JU9WDvZLI1j83A+/xnAJUucIv/zGJ1AMH2boHqF8CY16LpsYgBt6tKxxWH00XcyD
CdW2KlBCeqbQPcsFmWyWugxdcekhYsAWyoSf818NUsZdBWBaR/OukXrNLfkQ79Iy
ZohZbvabO/X+MVT3rriAoKc8oE2Uws6DF+60PV7/WIPjNvXySdqspImSN78mflxD
qwLqRBYkA3I75qppLGG9rp7UCdRjxMl8ZDBld+7yvHVgt1cVzJx9xnyGCC23Uaic
MDSXYrB4I4WHXPGjxhZuCuPBLTdOLU8YRvMYdEvYebWHMpvwGCF6bAx3JBpIeOQ1
wDB5y0USicV3YgYGmi+NZfhA4URSh77Yd6uuJOJENRaNVTzk
-----END CERTIFICATE-----
`;
var Google_Hardware_Attestation_Root_2 = `-----BEGIN CERTIFICATE-----
MIIFHDCCAwSgAwIBAgIJANUP8luj8tazMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAUTEGY5MjAwOWU4NTNiNmIwNDUwHhcNMTkxMTIyMjAzNzU4WhcNMzQxMTE4MjAz
NzU4WjAbMRkwFwYDVQQFExBmOTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0B
AQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHsK7Qui8xUFmOr75gvMsd/dTEDDJdS
Sxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfdnJLmN0pTy/4lj4/7
tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL/ggj
nar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGq
C4FSYa04T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQ
oVJYnFPlXTcHYvASLu+RhhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+O
JtvsBslHZvPBKCOdT0MS+tgSOIfga+z1Z1g7+DVagf7quvmag8jfPioyKvxnK/Eg
sTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgpZrt3i5MIlCaY504LzSRi
igHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6tUXHI/+M
RPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9E
aDK8Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5Um
AGMCAwEAAaNjMGEwHQYDVR0OBBYEFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMB8GA1Ud
IwQYMBaAFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMA8GA1UdEwEB/wQFMAMBAf8wDgYD
VR0PAQH/BAQDAgIEMA0GCSqGSIb3DQEBCwUAA4ICAQBOMaBc8oumXb2voc7XCWnu
XKhBBK3e2KMGz39t7lA3XXRe2ZLLAkLM5y3J7tURkf5a1SutfdOyXAmeE6SRo83U
h6WszodmMkxK5GM4JGrnt4pBisu5igXEydaW7qq2CdC6DOGjG+mEkN8/TA6p3cno
L/sPyz6evdjLlSeJ8rFBH6xWyIZCbrcpYEJzXaUOEaxxXxgYz5/cTiVKN2M1G2ok
QBUIYSY6bjEL4aUN5cfo7ogP3UvliEo3Eo0YgwuzR2v0KR6C1cZqZJSTnghIC/vA
D32KdNQ+c3N+vl2OTsUVMC1GiWkngNx1OO1+kXW+YTnnTUOtOIswUP/Vqd5SYgAI
mMAfY8U9/iIgkQj6T2W6FsScy94IN9fFhE1UtzmLoBIuUFsVXJMTz+Jucth+IqoW
Fua9v1R93/k98p41pjtFX+H8DslVgfP097vju4KDlqN64xV1grw3ZLl4CiOe/A91
oeLm2UHOq6wn3esB4r2EIQKb6jTVGu5sYCcdWpXr0AUVqcABPdgL+H7qJguBw09o
jm6xNIrw2OocrDKsudk/okr/AwqEyPKw9WnMlQgLIKw1rODG2NvU9oR3GVGdMkUB
ZutL8VuFkERQGt6vQ2OCw0sV47VMkuYbacK/xyZFiRcrPJPb41zgbQj9XAEyLKCH
ex0SdDrx+tWUDqG8At2JHA==
-----END CERTIFICATE-----
`;
var Google_Hardware_Attestation_Root_3 = `
-----BEGIN CERTIFICATE-----
MIIFHDCCAwSgAwIBAgIJAMNrfES5rhgxMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAUTEGY5MjAwOWU4NTNiNmIwNDUwHhcNMjExMTE3MjMxMDQyWhcNMzYxMTEzMjMx
MDQyWjAbMRkwFwYDVQQFExBmOTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0B
AQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHsK7Qui8xUFmOr75gvMsd/dTEDDJdS
Sxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfdnJLmN0pTy/4lj4/7
tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL/ggj
nar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGq
C4FSYa04T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQ
oVJYnFPlXTcHYvASLu+RhhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+O
JtvsBslHZvPBKCOdT0MS+tgSOIfga+z1Z1g7+DVagf7quvmag8jfPioyKvxnK/Eg
sTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgpZrt3i5MIlCaY504LzSRi
igHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6tUXHI/+M
RPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9E
aDK8Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5Um
AGMCAwEAAaNjMGEwHQYDVR0OBBYEFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMB8GA1Ud
IwQYMBaAFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMA8GA1UdEwEB/wQFMAMBAf8wDgYD
VR0PAQH/BAQDAgIEMA0GCSqGSIb3DQEBCwUAA4ICAQBTNNZe5cuf8oiq+jV0itTG
zWVhSTjOBEk2FQvh11J3o3lna0o7rd8RFHnN00q4hi6TapFhh4qaw/iG6Xg+xOan
63niLWIC5GOPFgPeYXM9+nBb3zZzC8ABypYuCusWCmt6Tn3+Pjbz3MTVhRGXuT/T
QH4KGFY4PhvzAyXwdjTOCXID+aHud4RLcSySr0Fq/L+R8TWalvM1wJJPhyRjqRCJ
erGtfBagiALzvhnmY7U1qFcS0NCnKjoO7oFedKdWlZz0YAfu3aGCJd4KHT0MsGiL
Zez9WP81xYSrKMNEsDK+zK5fVzw6jA7cxmpXcARTnmAuGUeI7VVDhDzKeVOctf3a
0qQLwC+d0+xrETZ4r2fRGNw2YEs2W8Qj6oDcfPvq9JySe7pJ6wcHnl5EZ0lwc4xH
7Y4Dx9RA1JlfooLMw3tOdJZH0enxPXaydfAD3YifeZpFaUzicHeLzVJLt9dvGB0b
HQLE4+EqKFgOZv2EoP686DQqbVS1u+9k0p2xbMA105TBIk7npraa8VM0fnrRKi7w
lZKwdH+aNAyhbXRW9xsnODJ+g8eF452zvbiKKngEKirK5LGieoXBX7tZ9D1GNBH2
Ob3bKOwwIWdEFle/YF/h6zWgdeoaNGDqVBrLr2+0DtWoiB1aDEjLWl9FmyIUyUm7
mD/vFDkzF+wm7cyWpQpCVQ==
-----END CERTIFICATE-----
`;
var Google_Hardware_Attestation_Root_4 = `
-----BEGIN CERTIFICATE-----
MIIFHDCCAwSgAwIBAgIJAPHBcqaZ6vUdMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAUTEGY5MjAwOWU4NTNiNmIwNDUwHhcNMjIwMzIwMTgwNzQ4WhcNNDIwMzE1MTgw
NzQ4WjAbMRkwFwYDVQQFExBmOTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0B
AQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHsK7Qui8xUFmOr75gvMsd/dTEDDJdS
Sxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfdnJLmN0pTy/4lj4/7
tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL/ggj
nar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGq
C4FSYa04T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQ
oVJYnFPlXTcHYvASLu+RhhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+O
JtvsBslHZvPBKCOdT0MS+tgSOIfga+z1Z1g7+DVagf7quvmag8jfPioyKvxnK/Eg
sTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgpZrt3i5MIlCaY504LzSRi
igHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6tUXHI/+M
RPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9E
aDK8Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5Um
AGMCAwEAAaNjMGEwHQYDVR0OBBYEFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMB8GA1Ud
IwQYMBaAFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMA8GA1UdEwEB/wQFMAMBAf8wDgYD
VR0PAQH/BAQDAgIEMA0GCSqGSIb3DQEBCwUAA4ICAQB8cMqTllHc8U+qCrOlg3H7
174lmaCsbo/bJ0C17JEgMLb4kvrqsXZs01U3mB/qABg/1t5Pd5AORHARs1hhqGIC
W/nKMav574f9rZN4PC2ZlufGXb7sIdJpGiO9ctRhiLuYuly10JccUZGEHpHSYM2G
tkgYbZba6lsCPYAAP83cyDV+1aOkTf1RCp/lM0PKvmxYN10RYsK631jrleGdcdkx
oSK//mSQbgcWnmAEZrzHoF1/0gso1HZgIn0YLzVhLSA/iXCX4QT2h3J5z3znluKG
1nv8NQdxei2DIIhASWfu804CA96cQKTTlaae2fweqXjdN1/v2nqOhngNyz1361mF
mr4XmaKH/ItTwOe72NI9ZcwS1lVaCvsIkTDCEXdm9rCNPAY10iTunIHFXRh+7KPz
lHGewCq/8TOohBRn0/NNfh7uRslOSZ/xKbN9tMBtw37Z8d2vvnXq/YWdsm1+JLVw
n6yYD/yacNJBlwpddla8eaVMjsF6nBnIgQOf9zKSe06nSTqvgwUHosgOECZJZ1Eu
zbH4yswbt02tKtKEFhx+v+OTge/06V+jGsqTWLsfrOCNLuA8H++z+pUENmpqnnHo
vaI47gC+TNpkgYGkkBT6B/m/U01BuOBBTzhIlMEZq9qkDWuM2cA5kW5V3FJUcfHn
w1IdYIg2Wxg7yHcQZemFQg==
-----END CERTIFICATE-----
`;

// node_modules/@simplewebauthn/server/esm/services/defaultRootCerts/apple.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Apple_WebAuthn_Root_CA = `-----BEGIN CERTIFICATE-----
MIICEjCCAZmgAwIBAgIQaB0BbHo84wIlpQGUKEdXcTAKBggqhkjOPQQDAzBLMR8w
HQYDVQQDDBZBcHBsZSBXZWJBdXRobiBSb290IENBMRMwEQYDVQQKDApBcHBsZSBJ
bmMuMRMwEQYDVQQIDApDYWxpZm9ybmlhMB4XDTIwMDMxODE4MjEzMloXDTQ1MDMx
NTAwMDAwMFowSzEfMB0GA1UEAwwWQXBwbGUgV2ViQXV0aG4gUm9vdCBDQTETMBEG
A1UECgwKQXBwbGUgSW5jLjETMBEGA1UECAwKQ2FsaWZvcm5pYTB2MBAGByqGSM49
AgEGBSuBBAAiA2IABCJCQ2pTVhzjl4Wo6IhHtMSAzO2cv+H9DQKev3//fG59G11k
xu9eI0/7o6V5uShBpe1u6l6mS19S1FEh6yGljnZAJ+2GNP1mi/YK2kSXIuTHjxA/
pcoRf7XkOtO4o1qlcaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUJtdk
2cV4wlpn0afeaxLQG2PxxtcwDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMDA2cA
MGQCMFrZ+9DsJ1PW9hfNdBywZDsWDbWFp28it1d/5w2RPkRX3Bbn/UbDTNLx7Jr3
jAGGiQIwHFj+dJZYUJR786osByBelJYsVZd2GbHQu209b5RCmGQ21gpSAk9QZW4B
1bWeT0vT
-----END CERTIFICATE-----
`;

// node_modules/@simplewebauthn/server/esm/services/defaultRootCerts/mds.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GlobalSign_Root_CA_R3 = `-----BEGIN CERTIFICATE-----
MIIDXzCCAkegAwIBAgILBAAAAAABIVhTCKIwDQYJKoZIhvcNAQELBQAwTDEgMB4G
A1UECxMXR2xvYmFsU2lnbiBSb290IENBIC0gUjMxEzARBgNVBAoTCkdsb2JhbFNp
Z24xEzARBgNVBAMTCkdsb2JhbFNpZ24wHhcNMDkwMzE4MTAwMDAwWhcNMjkwMzE4
MTAwMDAwWjBMMSAwHgYDVQQLExdHbG9iYWxTaWduIFJvb3QgQ0EgLSBSMzETMBEG
A1UEChMKR2xvYmFsU2lnbjETMBEGA1UEAxMKR2xvYmFsU2lnbjCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBAMwldpB5BngiFvXAg7aEyiie/QV2EcWtiHL8
RgJDx7KKnQRfJMsuS+FggkbhUqsMgUdwbN1k0ev1LKMPgj0MK66X17YUhhB5uzsT
gHeMCOFJ0mpiLx9e+pZo34knlTifBtc+ycsmWQ1z3rDI6SYOgxXG71uL0gRgykmm
KPZpO/bLyCiR5Z2KYVc3rHQU3HTgOu5yLy6c+9C7v/U9AOEGM+iCK65TpjoWc4zd
QQ4gOsC0p6Hpsk+QLjJg6VfLuQSSaGjlOCZgdbKfd/+RFO+uIEn8rUAVSNECMWEZ
XriX7613t2Saer9fwRPvm2L7DWzgVGkWqQPabumDk3F2xmmFghcCAwEAAaNCMEAw
DgYDVR0PAQH/BAQDAgEGMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFI/wS3+o
LkUkrk1Q+mOai97i3Ru8MA0GCSqGSIb3DQEBCwUAA4IBAQBLQNvAUKr+yAzv95ZU
RUm7lgAJQayzE4aGKAczymvmdLm6AC2upArT9fHxD4q/c2dKg8dEe3jgr25sbwMp
jjM5RcOO5LlXbKr8EpbsU8Yt5CRsuZRj+9xTaGdWPoO4zzUhw8lo/s7awlOqzJCK
6fBdRoyV3XpYKBovHd7NADdBj+1EbddTKJd+82cEHhXXipa0095MJ6RMG3NzdvQX
mcIfeg7jLQitChws/zyrVQ4PkX4268NXSb7hLi18YIvDQVETI53O9zJrlAGomecs
Mx86OyXShkDOOyyGeMlhLxS67ttVb9+E7gUJTb0o2HLO02JQZR7rkpeDMdmztcpH
WD9f
-----END CERTIFICATE-----
 `;

// node_modules/@simplewebauthn/server/esm/services/settingsService.js
var BaseSettingsService = class {
  constructor() {
    Object.defineProperty(this, "pemCertificates", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    this.pemCertificates = /* @__PURE__ */ new Map();
  }
  setRootCertificates(opts) {
    const { identifier, certificates } = opts;
    const newCertificates = [];
    for (const cert of certificates) {
      if (cert instanceof Uint8Array) {
        newCertificates.push(convertCertBufferToPEM(cert));
      } else {
        newCertificates.push(cert);
      }
    }
    this.pemCertificates.set(identifier, newCertificates);
  }
  getRootCertificates(opts) {
    const { identifier } = opts;
    return this.pemCertificates.get(identifier) ?? [];
  }
};
__name(BaseSettingsService, "BaseSettingsService");
var SettingsService = new BaseSettingsService();
SettingsService.setRootCertificates({
  identifier: "android-key",
  certificates: [
    Google_Hardware_Attestation_Root_1,
    Google_Hardware_Attestation_Root_2,
    Google_Hardware_Attestation_Root_3,
    Google_Hardware_Attestation_Root_4,
  ],
});
SettingsService.setRootCertificates({
  identifier: "android-safetynet",
  certificates: [GlobalSign_Root_CA],
});
SettingsService.setRootCertificates({
  identifier: "apple",
  certificates: [Apple_WebAuthn_Root_CA],
});
SettingsService.setRootCertificates({
  identifier: "mds",
  certificates: [GlobalSign_Root_CA_R3],
});

// node_modules/@simplewebauthn/server/esm/metadata/verifyMDSBlob.js
async function verifyMDSBlob(blob) {
  const parsedJWT = parseJWT(blob);
  const header = parsedJWT[0];
  const payload = parsedJWT[1];
  const headerCertsPEM = header.x5c.map(convertCertBufferToPEM);
  try {
    const rootCerts = SettingsService.getRootCertificates({
      identifier: "mds",
    });
    await validateCertificatePath(headerCertsPEM, rootCerts);
  } catch (error3) {
    const _error = error3;
    throw new Error("BLOB certificate path could not be validated", { cause: _error });
  }
  const leafCert = headerCertsPEM[0];
  const verified = await verifyJWT(blob, convertPEMToBytes(leafCert));
  if (!verified) {
    throw new Error("BLOB signature could not be verified");
  }
  const statements = [];
  for (const entry of payload.entries) {
    if (entry.aaguid && entry.metadataStatement) {
      statements.push(entry.metadataStatement);
    }
  }
  const [year, month, day] = payload.nextUpdate.split("-");
  const parsedNextUpdate = new Date(
    parseInt(year, 10),
    // Months need to be zero-indexed
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
  return {
    statements,
    parsedNextUpdate,
    payload,
  };
}
__name(verifyMDSBlob, "verifyMDSBlob");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyOKP.js
async function verifyOKP(opts) {
  const { cosePublicKey, signature, data } = opts;
  const WebCrypto = await getWebCrypto();
  const alg = cosePublicKey.get(COSEKEYS.alg);
  const crv = cosePublicKey.get(COSEKEYS.crv);
  const x = cosePublicKey.get(COSEKEYS.x);
  if (!alg) {
    throw new Error("Public key was missing alg (OKP)");
  }
  if (!isCOSEAlg(alg)) {
    throw new Error(`Public key had invalid alg ${alg} (OKP)`);
  }
  if (!crv) {
    throw new Error("Public key was missing crv (OKP)");
  }
  if (!x) {
    throw new Error("Public key was missing x (OKP)");
  }
  let _crv;
  if (crv === COSECRV.ED25519) {
    _crv = "Ed25519";
  } else {
    throw new Error(`Unexpected COSE crv value of ${crv} (OKP)`);
  }
  const keyData = {
    kty: "OKP",
    crv: _crv,
    alg: "EdDSA",
    x: isoBase64URL_exports.fromBuffer(x),
    ext: false,
  };
  const keyAlgorithm = {
    name: _crv,
    namedCurve: _crv,
  };
  const key = await importKey({
    keyData,
    algorithm: keyAlgorithm,
  });
  const verifyAlgorithm = {
    name: _crv,
  };
  return WebCrypto.subtle.verify(verifyAlgorithm, key, signature, data);
}
__name(verifyOKP, "verifyOKP");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/unwrapEC2Signature.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function unwrapEC2Signature(signature, crv) {
  const parsedSignature = AsnParser.parse(signature, ECDSASigValue);
  const rBytes = new Uint8Array(parsedSignature.r);
  const sBytes = new Uint8Array(parsedSignature.s);
  const componentLength = getSignatureComponentLength(crv);
  const rNormalizedBytes = toNormalizedBytes(rBytes, componentLength);
  const sNormalizedBytes = toNormalizedBytes(sBytes, componentLength);
  const finalSignature = isoUint8Array_exports.concat([rNormalizedBytes, sNormalizedBytes]);
  return finalSignature;
}
__name(unwrapEC2Signature, "unwrapEC2Signature");
function getSignatureComponentLength(crv) {
  switch (crv) {
    case COSECRV.P256:
      return 32;
    case COSECRV.P384:
      return 48;
    case COSECRV.P521:
      return 66;
    default:
      throw new Error(`Unexpected COSE crv value of ${crv} (EC2)`);
  }
}
__name(getSignatureComponentLength, "getSignatureComponentLength");
function toNormalizedBytes(bytes, componentLength) {
  let normalizedBytes;
  if (bytes.length < componentLength) {
    normalizedBytes = new Uint8Array(componentLength);
    normalizedBytes.set(bytes, componentLength - bytes.length);
  } else if (bytes.length === componentLength) {
    normalizedBytes = bytes;
  } else if (bytes.length === componentLength + 1 && bytes[0] === 0 && (bytes[1] & 128) === 128) {
    normalizedBytes = bytes.subarray(1);
  } else {
    throw new Error(
      `Invalid signature component length ${bytes.length}, expected ${componentLength}`
    );
  }
  return normalizedBytes;
}
__name(toNormalizedBytes, "toNormalizedBytes");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verify.js
function verify(opts) {
  const { cosePublicKey, signature, data, shaHashOverride } = opts;
  if (isCOSEPublicKeyEC2(cosePublicKey)) {
    const crv = cosePublicKey.get(COSEKEYS.crv);
    if (!isCOSECrv(crv)) {
      throw new Error(`unknown COSE curve ${crv}`);
    }
    const unwrappedSignature = unwrapEC2Signature(signature, crv);
    return verifyEC2({
      cosePublicKey,
      signature: unwrappedSignature,
      data,
      shaHashOverride,
    });
  } else if (isCOSEPublicKeyRSA(cosePublicKey)) {
    return verifyRSA({ cosePublicKey, signature, data, shaHashOverride });
  } else if (isCOSEPublicKeyOKP(cosePublicKey)) {
    return verifyOKP({ cosePublicKey, signature, data });
  }
  const kty = cosePublicKey.get(COSEKEYS.kty);
  throw new Error(
    `Signature verification with public key of kty ${kty} is not supported by this method`
  );
}
__name(verify, "verify");

// node_modules/@simplewebauthn/server/esm/helpers/iso/isoUint8Array.js
var isoUint8Array_exports = {};
__export(isoUint8Array_exports, {
  areEqual: () => areEqual,
  concat: () => concat3,
  fromASCIIString: () => fromASCIIString,
  fromHex: () => fromHex,
  fromUTF8String: () => fromUTF8String2,
  toDataView: () => toDataView,
  toHex: () => toHex,
  toUTF8String: () => toUTF8String2,
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function areEqual(array1, array2) {
  if (array1.length != array2.length) {
    return false;
  }
  return array1.every((val, i) => val === array2[i]);
}
__name(areEqual, "areEqual");
function toHex(array) {
  const hexParts = Array.from(array, (i) => i.toString(16).padStart(2, "0"));
  return hexParts.join("");
}
__name(toHex, "toHex");
function fromHex(hex2) {
  if (!hex2) {
    return Uint8Array.from([]);
  }
  const isValid = hex2.length !== 0 && hex2.length % 2 === 0 && !/[^a-fA-F0-9]/u.test(hex2);
  if (!isValid) {
    throw new Error("Invalid hex string");
  }
  const byteStrings = hex2.match(/.{1,2}/g) ?? [];
  return Uint8Array.from(byteStrings.map((byte) => parseInt(byte, 16)));
}
__name(fromHex, "fromHex");
function concat3(arrays) {
  let pointer = 0;
  const totalLength = arrays.reduce((prev, curr) => prev + curr.length, 0);
  const toReturn = new Uint8Array(totalLength);
  arrays.forEach((arr) => {
    toReturn.set(arr, pointer);
    pointer += arr.length;
  });
  return toReturn;
}
__name(concat3, "concat");
function toUTF8String2(array) {
  const decoder = new globalThis.TextDecoder("utf-8");
  return decoder.decode(array);
}
__name(toUTF8String2, "toUTF8String");
function fromUTF8String2(utf8String) {
  const encoder = new globalThis.TextEncoder();
  return encoder.encode(utf8String);
}
__name(fromUTF8String2, "fromUTF8String");
function fromASCIIString(value) {
  return Uint8Array.from(value.split("").map((x) => x.charCodeAt(0)));
}
__name(fromASCIIString, "fromASCIIString");
function toDataView(array) {
  return new DataView(array.buffer, array.byteOffset, array.length);
}
__name(toDataView, "toDataView");

// node_modules/@simplewebauthn/server/esm/helpers/generateChallenge.js
async function generateChallenge() {
  const challenge = new Uint8Array(32);
  await isoCrypto_exports.getRandomValues(challenge);
  return _generateChallengeInternals.stubThis(challenge);
}
__name(generateChallenge, "generateChallenge");
var _generateChallengeInternals = {
  stubThis: (value) => value,
};

// node_modules/@simplewebauthn/server/esm/registration/generateRegistrationOptions.js
var supportedCOSEAlgorithmIdentifiers = [
  // EdDSA (In first position to encourage authenticators to use this over ES256)
  -8,
  // ECDSA w/ SHA-256
  -7,
  // ECDSA w/ SHA-512
  -36,
  // RSASSA-PSS w/ SHA-256
  -37,
  // RSASSA-PSS w/ SHA-384
  -38,
  // RSASSA-PSS w/ SHA-512
  -39,
  // RSASSA-PKCS1-v1_5 w/ SHA-256
  -257,
  // RSASSA-PKCS1-v1_5 w/ SHA-384
  -258,
  // RSASSA-PKCS1-v1_5 w/ SHA-512
  -259,
  // RSASSA-PKCS1-v1_5 w/ SHA-1 (Deprecated; here for legacy support)
  -65535,
];
var defaultAuthenticatorSelection = {
  residentKey: "preferred",
  userVerification: "preferred",
};
var defaultSupportedAlgorithmIDs = [-8, -7, -257];
async function generateRegistrationOptions(options) {
  const {
    rpName,
    rpID,
    userName,
    userID,
    challenge = await generateChallenge(),
    userDisplayName = "",
    timeout = 6e4,
    attestationType = "none",
    excludeCredentials = [],
    authenticatorSelection = defaultAuthenticatorSelection,
    extensions,
    supportedAlgorithmIDs = defaultSupportedAlgorithmIDs,
    preferredAuthenticatorType,
  } = options;
  const pubKeyCredParams = supportedAlgorithmIDs.map((id) => ({
    alg: id,
    type: "public-key",
  }));
  if (authenticatorSelection.residentKey === void 0) {
    if (authenticatorSelection.requireResidentKey) {
      authenticatorSelection.residentKey = "required";
    } else {
    }
  } else {
    authenticatorSelection.requireResidentKey = authenticatorSelection.residentKey === "required";
  }
  let _challenge = challenge;
  if (typeof _challenge === "string") {
    _challenge = isoUint8Array_exports.fromUTF8String(_challenge);
  }
  if (typeof userID === "string") {
    throw new Error(
      `String values for \`userID\` are no longer supported. See https://simplewebauthn.dev/docs/advanced/server/custom-user-ids`
    );
  }
  let _userID = userID;
  if (!_userID) {
    _userID = await generateUserID();
  }
  const hints = [];
  if (preferredAuthenticatorType) {
    if (preferredAuthenticatorType === "securityKey") {
      hints.push("security-key");
      authenticatorSelection.authenticatorAttachment = "cross-platform";
    } else if (preferredAuthenticatorType === "localDevice") {
      hints.push("client-device");
      authenticatorSelection.authenticatorAttachment = "platform";
    } else if (preferredAuthenticatorType === "remoteDevice") {
      hints.push("hybrid");
      authenticatorSelection.authenticatorAttachment = "cross-platform";
    }
  }
  return {
    challenge: isoBase64URL_exports.fromBuffer(_challenge),
    rp: {
      name: rpName,
      id: rpID,
    },
    user: {
      id: isoBase64URL_exports.fromBuffer(_userID),
      name: userName,
      displayName: userDisplayName,
    },
    pubKeyCredParams,
    timeout,
    attestation: attestationType,
    excludeCredentials: excludeCredentials.map((cred) => {
      if (!isoBase64URL_exports.isBase64URL(cred.id)) {
        throw new Error(`excludeCredential id "${cred.id}" is not a valid base64url string`);
      }
      return {
        ...cred,
        id: isoBase64URL_exports.trimPadding(cred.id),
        type: "public-key",
      };
    }),
    authenticatorSelection,
    extensions: {
      ...extensions,
      credProps: true,
    },
    hints,
  };
}
__name(generateRegistrationOptions, "generateRegistrationOptions");

// node_modules/@simplewebauthn/server/esm/registration/verifyRegistrationResponse.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/parseBackupFlags.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function parseBackupFlags({ be, bs }) {
  const credentialBackedUp = bs;
  let credentialDeviceType = "singleDevice";
  if (be) {
    credentialDeviceType = "multiDevice";
  }
  if (credentialDeviceType === "singleDevice" && credentialBackedUp) {
    throw new InvalidBackupFlags(
      "Single-device credential indicated that it was backed up, which should be impossible."
    );
  }
  return { credentialDeviceType, credentialBackedUp };
}
__name(parseBackupFlags, "parseBackupFlags");
var InvalidBackupFlags = class extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidBackupFlags";
  }
};
__name(InvalidBackupFlags, "InvalidBackupFlags");

// node_modules/@simplewebauthn/server/esm/helpers/matchExpectedRPID.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function matchExpectedRPID(rpIDHash, expectedRPIDs) {
  try {
    const matchedRPID = await Promise.any(
      expectedRPIDs.map((expected) => {
        return new Promise((resolve, reject) => {
          toHash(isoUint8Array_exports.fromASCIIString(expected)).then((expectedRPIDHash) => {
            if (isoUint8Array_exports.areEqual(rpIDHash, expectedRPIDHash)) {
              resolve(expected);
            } else {
              reject();
            }
          });
        });
      })
    );
    return matchedRPID;
  } catch (err) {
    const _err = err;
    if (_err.name === "AggregateError") {
      throw new UnexpectedRPIDHash();
    }
    throw err;
  }
}
__name(matchExpectedRPID, "matchExpectedRPID");
var UnexpectedRPIDHash = class extends Error {
  constructor() {
    const message = "Unexpected RP ID hash";
    super(message);
    this.name = "UnexpectedRPIDHash";
  }
};
__name(UnexpectedRPIDHash, "UnexpectedRPIDHash");

// node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationFIDOU2F.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function verifyAttestationFIDOU2F(options) {
  const {
    attStmt,
    clientDataHash,
    rpIdHash,
    credentialID,
    credentialPublicKey,
    aaguid,
    rootCertificates,
  } = options;
  const reservedByte = Uint8Array.from([0]);
  const publicKey = convertCOSEtoPKCS(credentialPublicKey);
  const signatureBase = isoUint8Array_exports.concat([
    reservedByte,
    rpIdHash,
    clientDataHash,
    credentialID,
    publicKey,
  ]);
  const sig = attStmt.get("sig");
  const x5c = attStmt.get("x5c");
  if (!x5c) {
    throw new Error("No attestation certificate provided in attestation statement (FIDOU2F)");
  }
  if (!sig) {
    throw new Error("No attestation signature provided in attestation statement (FIDOU2F)");
  }
  const aaguidToHex = Number.parseInt(isoUint8Array_exports.toHex(aaguid), 16);
  if (aaguidToHex !== 0) {
    throw new Error(`AAGUID "${aaguidToHex}" was not expected value`);
  }
  try {
    await validateCertificatePath(x5c.map(convertCertBufferToPEM), rootCertificates);
  } catch (err) {
    const _err = err;
    throw new Error(`${_err.message} (FIDOU2F)`);
  }
  return verifySignature({
    signature: sig,
    data: signatureBase,
    x509Certificate: x5c[0],
    hashAlgorithm: COSEALG.ES256,
  });
}
__name(verifyAttestationFIDOU2F, "verifyAttestationFIDOU2F");

// node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationPacked.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/validateExtFIDOGenCEAAGUID.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var id_fido_gen_ce_aaguid = "1.3.6.1.4.1.45724.1.1.4";
function validateExtFIDOGenCEAAGUID(certExtensions, aaguid) {
  if (!certExtensions) {
    return true;
  }
  const extFIDOGenCEAAGUID = certExtensions.find((ext) => ext.extnID === id_fido_gen_ce_aaguid);
  if (!extFIDOGenCEAAGUID) {
    return true;
  }
  const parsedExtFIDOGenCEAAGUID = AsnParser.parse(extFIDOGenCEAAGUID.extnValue, OctetString2);
  const extValue = new Uint8Array(parsedExtFIDOGenCEAAGUID.buffer);
  const aaguidAndExtAreEqual = isoUint8Array_exports.areEqual(aaguid, extValue);
  if (!aaguidAndExtAreEqual) {
    const _debugExtHex = isoUint8Array_exports.toHex(extValue);
    const _debugAAGUIDHex = isoUint8Array_exports.toHex(aaguid);
    throw new Error(
      `Certificate extension id-fido-gen-ce-aaguid (${id_fido_gen_ce_aaguid}) value of "${_debugExtHex}" was present but not equal to attestation statement AAGUID value of "${_debugAAGUIDHex}"`
    );
  }
  return true;
}
__name(validateExtFIDOGenCEAAGUID, "validateExtFIDOGenCEAAGUID");

// node_modules/@simplewebauthn/server/esm/services/metadataService.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/helpers/logging.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getLogger(_name) {
  return (_message, ..._rest) => {};
}
__name(getLogger, "getLogger");

// node_modules/@simplewebauthn/server/esm/services/metadataService.js
var NonRefreshingMDS = {
  url: "",
  no: 0,
  nextUpdate: /* @__PURE__ */ new Date(0),
};
var defaultURLMDS = "https://mds.fidoalliance.org/";
var SERVICE_STATE;
(function (SERVICE_STATE2) {
  SERVICE_STATE2[(SERVICE_STATE2["DISABLED"] = 0)] = "DISABLED";
  SERVICE_STATE2[(SERVICE_STATE2["REFRESHING"] = 1)] = "REFRESHING";
  SERVICE_STATE2[(SERVICE_STATE2["READY"] = 2)] = "READY";
})(SERVICE_STATE || (SERVICE_STATE = {}));
var log3 = getLogger("MetadataService");
var BaseMetadataService = class {
  constructor() {
    Object.defineProperty(this, "mdsCache", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {},
    });
    Object.defineProperty(this, "statementCache", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {},
    });
    Object.defineProperty(this, "state", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: SERVICE_STATE.DISABLED,
    });
    Object.defineProperty(this, "verificationMode", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "strict",
    });
  }
  async initialize(opts = {}) {
    this.statementCache = {};
    const { mdsServers = [defaultURLMDS], statements, verificationMode } = opts;
    this.setState(SERVICE_STATE.REFRESHING);
    if (statements?.length) {
      let statementsAdded = 0;
      statements.forEach((statement) => {
        if (statement.aaguid) {
          this.statementCache[statement.aaguid] = {
            entry: {
              metadataStatement: statement,
              statusReports: [],
              timeOfLastStatusChange: "1970-01-01",
            },
            url: NonRefreshingMDS.url,
          };
          statementsAdded += 1;
        }
      });
      log3(`Cached ${statementsAdded} local statements`);
    }
    if (mdsServers?.length) {
      const currentCacheCount = Object.keys(this.statementCache).length;
      let numServers = mdsServers.length;
      for (const url of mdsServers) {
        try {
          const cachedMDS = {
            url,
            no: 0,
            nextUpdate: /* @__PURE__ */ new Date(0),
          };
          const blob = await this.downloadBlob(cachedMDS);
          await this.verifyBlob(blob, cachedMDS);
        } catch (err) {
          log3(`Could not download BLOB from ${url}:`, err);
          numServers -= 1;
        }
      }
      const newCacheCount = Object.keys(this.statementCache).length;
      const cacheDiff = newCacheCount - currentCacheCount;
      log3(`Cached ${cacheDiff} statements from ${numServers} metadata server(s)`);
    }
    if (verificationMode) {
      this.verificationMode = verificationMode;
    }
    this.setState(SERVICE_STATE.READY);
  }
  async getStatement(aaguid) {
    if (this.state === SERVICE_STATE.DISABLED) {
      return;
    }
    if (!aaguid) {
      return;
    }
    if (aaguid instanceof Uint8Array) {
      aaguid = convertAAGUIDToString(aaguid);
    }
    await this.pauseUntilReady();
    const cachedStatement = this.statementCache[aaguid];
    if (!cachedStatement) {
      if (this.verificationMode === "strict") {
        throw new Error(`No metadata statement found for aaguid "${aaguid}"`);
      }
      return;
    }
    if (cachedStatement.url) {
      const mds = this.mdsCache[cachedStatement.url];
      const now = /* @__PURE__ */ new Date();
      if (now > mds.nextUpdate) {
        try {
          this.setState(SERVICE_STATE.REFRESHING);
          const blob = await this.downloadBlob(mds);
          await this.verifyBlob(blob, mds);
        } finally {
          this.setState(SERVICE_STATE.READY);
        }
      }
    }
    const { entry } = cachedStatement;
    for (const report2 of entry.statusReports) {
      const { status } = report2;
      if (
        status === "USER_VERIFICATION_BYPASS" ||
        status === "ATTESTATION_KEY_COMPROMISE" ||
        status === "USER_KEY_REMOTE_COMPROMISE" ||
        status === "USER_KEY_PHYSICAL_COMPROMISE"
      ) {
        throw new Error(`Detected compromised aaguid "${aaguid}"`);
      }
    }
    return entry.metadataStatement;
  }
  /**
   * Download and process the latest BLOB from MDS
   */
  async downloadBlob(cachedMDS) {
    const { url } = cachedMDS;
    const resp = await fetch(url);
    const data = await resp.text();
    return data;
  }
  /**
   * Verify and process the MDS metadata blob
   */
  async verifyBlob(blob, cachedMDS) {
    const { url, no } = cachedMDS;
    const { payload, parsedNextUpdate } = await verifyMDSBlob(blob);
    if (payload.no <= no) {
      throw new Error(`Latest BLOB no. ${payload.no} is not greater than previous no. ${no}`);
    }
    for (const entry of payload.entries) {
      if (entry.aaguid) {
        this.statementCache[entry.aaguid] = { entry, url };
      }
    }
    if (url) {
      this.mdsCache[url] = {
        ...cachedMDS,
        // Store the payload `no` to make sure we're getting the next BLOB in the sequence
        no: payload.no,
        // Remember when we need to refresh this blob
        nextUpdate: parsedNextUpdate,
      };
    } else {
      if (parsedNextUpdate < /* @__PURE__ */ new Date()) {
        log3(
          `\u26A0\uFE0F This MDS blob (serial: ${payload.no}) contains stale data as of ${parsedNextUpdate.toISOString()}. Please consider re-initializing MetadataService with a newer MDS blob.`
        );
      }
    }
  }
  /**
   * A helper method to pause execution until the service is ready
   */
  pauseUntilReady() {
    if (this.state === SERVICE_STATE.READY) {
      return new Promise((resolve) => {
        resolve();
      });
    }
    const readyPromise = new Promise((resolve, reject) => {
      const totalTimeoutMS = 7e4;
      const intervalMS = 100;
      let iterations = totalTimeoutMS / intervalMS;
      const intervalID = globalThis.setInterval(() => {
        if (iterations < 1) {
          clearInterval(intervalID);
          reject(`State did not become ready in ${totalTimeoutMS / 1e3} seconds`);
        } else if (this.state === SERVICE_STATE.READY) {
          clearInterval(intervalID);
          resolve();
        }
        iterations -= 1;
      }, intervalMS);
    });
    return readyPromise;
  }
  /**
   * Report service status on change
   */
  setState(newState) {
    this.state = newState;
    if (newState === SERVICE_STATE.DISABLED) {
      log3("MetadataService is DISABLED");
    } else if (newState === SERVICE_STATE.REFRESHING) {
      log3("MetadataService is REFRESHING");
    } else if (newState === SERVICE_STATE.READY) {
      log3("MetadataService is READY");
    }
  }
};
__name(BaseMetadataService, "BaseMetadataService");
var MetadataService = new BaseMetadataService();

// node_modules/@simplewebauthn/server/esm/metadata/verifyAttestationWithMetadata.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function verifyAttestationWithMetadata({
  statement,
  credentialPublicKey,
  x5c,
  attestationStatementAlg,
}) {
  const { authenticationAlgorithms, authenticatorGetInfo, attestationRootCertificates } = statement;
  const keypairCOSEAlgs = /* @__PURE__ */ new Set();
  authenticationAlgorithms.forEach((algSign) => {
    const algSignCOSEINFO = algSignToCOSEInfoMap[algSign];
    if (algSignCOSEINFO) {
      keypairCOSEAlgs.add(algSignCOSEINFO);
    }
  });
  const decodedPublicKey = decodeCredentialPublicKey(credentialPublicKey);
  const kty = decodedPublicKey.get(COSEKEYS.kty);
  const alg = decodedPublicKey.get(COSEKEYS.alg);
  if (!kty) {
    throw new Error("Credential public key was missing kty");
  }
  if (!alg) {
    throw new Error("Credential public key was missing alg");
  }
  if (!kty) {
    throw new Error("Credential public key was missing kty");
  }
  const publicKeyCOSEInfo = { kty, alg };
  if (isCOSEPublicKeyEC2(decodedPublicKey)) {
    const crv = decodedPublicKey.get(COSEKEYS.crv);
    publicKeyCOSEInfo.crv = crv;
  }
  let foundMatch = false;
  for (const keypairAlg of keypairCOSEAlgs) {
    if (keypairAlg.alg === publicKeyCOSEInfo.alg && keypairAlg.kty === publicKeyCOSEInfo.kty) {
      if (
        (keypairAlg.kty === COSEKTY.EC2 || keypairAlg.kty === COSEKTY.OKP) &&
        keypairAlg.crv === publicKeyCOSEInfo.crv
      ) {
        foundMatch = true;
      } else {
        foundMatch = true;
      }
    }
    if (foundMatch) {
      break;
    }
  }
  if (!foundMatch) {
    const debugMDSAlgs = authenticationAlgorithms.map(
      (algSign) => `'${algSign}' (COSE info: ${stringifyCOSEInfo(algSignToCOSEInfoMap[algSign])})`
    );
    const strMDSAlgs = JSON.stringify(debugMDSAlgs, null, 2).replace(/"/g, "");
    const strPubKeyAlg = stringifyCOSEInfo(publicKeyCOSEInfo);
    throw new Error(`Public key parameters ${strPubKeyAlg} did not match any of the following metadata algorithms:
${strMDSAlgs}`);
  }
  if (attestationStatementAlg !== void 0 && authenticatorGetInfo?.algorithms !== void 0) {
    const getInfoAlgs = authenticatorGetInfo.algorithms.map((_alg) => _alg.alg);
    if (getInfoAlgs.indexOf(attestationStatementAlg) < 0) {
      throw new Error(
        `Attestation statement alg ${attestationStatementAlg} did not match one of ${getInfoAlgs}`
      );
    }
  }
  const authenticatorCerts = x5c.map(convertCertBufferToPEM);
  const statementRootCerts = attestationRootCertificates.map(convertCertBufferToPEM);
  let authenticatorIsSelfReferencing = false;
  if (authenticatorCerts.length === 1 && statementRootCerts.indexOf(authenticatorCerts[0]) >= 0) {
    authenticatorIsSelfReferencing = true;
  }
  if (!authenticatorIsSelfReferencing) {
    try {
      await validateCertificatePath(authenticatorCerts, statementRootCerts);
    } catch (err) {
      const _err = err;
      throw new Error(
        `Could not validate certificate path with any metadata root certificates: ${_err.message}`
      );
    }
  }
  return true;
}
__name(verifyAttestationWithMetadata, "verifyAttestationWithMetadata");
var algSignToCOSEInfoMap = {
  secp256r1_ecdsa_sha256_raw: { kty: 2, alg: -7, crv: 1 },
  secp256r1_ecdsa_sha256_der: { kty: 2, alg: -7, crv: 1 },
  rsassa_pss_sha256_raw: { kty: 3, alg: -37 },
  rsassa_pss_sha256_der: { kty: 3, alg: -37 },
  secp256k1_ecdsa_sha256_raw: { kty: 2, alg: -47, crv: 8 },
  secp256k1_ecdsa_sha256_der: { kty: 2, alg: -47, crv: 8 },
  rsassa_pss_sha384_raw: { kty: 3, alg: -38 },
  rsassa_pkcsv15_sha256_raw: { kty: 3, alg: -257 },
  rsassa_pkcsv15_sha384_raw: { kty: 3, alg: -258 },
  rsassa_pkcsv15_sha512_raw: { kty: 3, alg: -259 },
  rsassa_pkcsv15_sha1_raw: { kty: 3, alg: -65535 },
  secp384r1_ecdsa_sha384_raw: { kty: 2, alg: -35, crv: 2 },
  secp512r1_ecdsa_sha256_raw: { kty: 2, alg: -36, crv: 3 },
  ed25519_eddsa_sha512_raw: { kty: 1, alg: -8, crv: 6 },
};
function stringifyCOSEInfo(info3) {
  const { kty, alg, crv } = info3;
  let toReturn = "";
  if (kty !== COSEKTY.RSA) {
    toReturn = `{ kty: ${kty}, alg: ${alg}, crv: ${crv} }`;
  } else {
    toReturn = `{ kty: ${kty}, alg: ${alg} }`;
  }
  return toReturn;
}
__name(stringifyCOSEInfo, "stringifyCOSEInfo");

// node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationPacked.js
async function verifyAttestationPacked(options) {
  const { attStmt, clientDataHash, authData, credentialPublicKey, aaguid, rootCertificates } =
    options;
  const sig = attStmt.get("sig");
  const x5c = attStmt.get("x5c");
  const alg = attStmt.get("alg");
  if (!sig) {
    throw new Error("No attestation signature provided in attestation statement (Packed)");
  }
  if (!alg) {
    throw new Error("Attestation statement did not contain alg (Packed)");
  }
  if (!isCOSEAlg(alg)) {
    throw new Error(`Attestation statement contained invalid alg ${alg} (Packed)`);
  }
  const signatureBase = isoUint8Array_exports.concat([authData, clientDataHash]);
  let verified = false;
  if (x5c) {
    const {
      subject,
      basicConstraintsCA,
      version: version2,
      notBefore,
      notAfter,
      parsedCertificate,
    } = getCertificateInfo(x5c[0]);
    const { OU, CN, O, C } = subject;
    if (OU !== "Authenticator Attestation") {
      throw new Error('Certificate OU was not "Authenticator Attestation" (Packed|Full)');
    }
    if (!CN) {
      throw new Error("Certificate CN was empty (Packed|Full)");
    }
    if (!O) {
      throw new Error("Certificate O was empty (Packed|Full)");
    }
    if (!C || C.length !== 2) {
      throw new Error("Certificate C was not two-character ISO 3166 code (Packed|Full)");
    }
    if (basicConstraintsCA) {
      throw new Error("Certificate basic constraints CA was not `false` (Packed|Full)");
    }
    if (version2 !== 2) {
      throw new Error("Certificate version was not `3` (ASN.1 value of 2) (Packed|Full)");
    }
    let now = /* @__PURE__ */ new Date();
    if (notBefore > now) {
      throw new Error(`Certificate not good before "${notBefore.toString()}" (Packed|Full)`);
    }
    now = /* @__PURE__ */ new Date();
    if (notAfter < now) {
      throw new Error(`Certificate not good after "${notAfter.toString()}" (Packed|Full)`);
    }
    try {
      await validateExtFIDOGenCEAAGUID(parsedCertificate.tbsCertificate.extensions, aaguid);
    } catch (err) {
      const _err = err;
      throw new Error(`${_err.message} (Packed|Full)`);
    }
    const statement = await MetadataService.getStatement(aaguid);
    if (statement) {
      if (statement.attestationTypes.indexOf("basic_full") < 0) {
        throw new Error("Metadata does not indicate support for full attestations (Packed|Full)");
      }
      try {
        await verifyAttestationWithMetadata({
          statement,
          credentialPublicKey,
          x5c,
          attestationStatementAlg: alg,
        });
      } catch (err) {
        const _err = err;
        throw new Error(`${_err.message} (Packed|Full)`);
      }
    } else {
      try {
        await validateCertificatePath(x5c.map(convertCertBufferToPEM), rootCertificates);
      } catch (err) {
        const _err = err;
        throw new Error(`${_err.message} (Packed|Full)`);
      }
    }
    verified = await verifySignature({
      signature: sig,
      data: signatureBase,
      x509Certificate: x5c[0],
      hashAlgorithm: alg,
    });
  } else {
    verified = await verifySignature({
      signature: sig,
      data: signatureBase,
      credentialPublicKey,
      hashAlgorithm: alg,
    });
  }
  return verified;
}
__name(verifyAttestationPacked, "verifyAttestationPacked");

// node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationAndroidSafetyNet.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function verifyAttestationAndroidSafetyNet(options) {
  const {
    attStmt,
    clientDataHash,
    authData,
    aaguid,
    rootCertificates,
    verifyTimestampMS = true,
    credentialPublicKey,
    attestationSafetyNetEnforceCTSCheck,
  } = options;
  const alg = attStmt.get("alg");
  const response = attStmt.get("response");
  const ver = attStmt.get("ver");
  if (!ver) {
    throw new Error("No ver value in attestation (SafetyNet)");
  }
  if (!response) {
    throw new Error("No response was included in attStmt by authenticator (SafetyNet)");
  }
  const jwt = isoUint8Array_exports.toUTF8String(response);
  const jwtParts = jwt.split(".");
  const HEADER = JSON.parse(isoBase64URL_exports.toUTF8String(jwtParts[0]));
  const PAYLOAD = JSON.parse(isoBase64URL_exports.toUTF8String(jwtParts[1]));
  const SIGNATURE = jwtParts[2];
  const { nonce, ctsProfileMatch, timestampMs } = PAYLOAD;
  if (verifyTimestampMS) {
    let now = Date.now();
    if (timestampMs > Date.now()) {
      throw new Error(`Payload timestamp "${timestampMs}" was later than "${now}" (SafetyNet)`);
    }
    const timestampPlusDelay = timestampMs + 60 * 1e3;
    now = Date.now();
    if (timestampPlusDelay < now) {
      throw new Error(`Payload timestamp "${timestampPlusDelay}" has expired (SafetyNet)`);
    }
  }
  const nonceBase = isoUint8Array_exports.concat([authData, clientDataHash]);
  const nonceBuffer = await toHash(nonceBase);
  const expectedNonce = isoBase64URL_exports.fromBuffer(nonceBuffer, "base64");
  if (nonce !== expectedNonce) {
    throw new Error("Could not verify payload nonce (SafetyNet)");
  }
  if (attestationSafetyNetEnforceCTSCheck && !ctsProfileMatch) {
    throw new Error("Could not verify device integrity (SafetyNet)");
  }
  const leafCertBuffer = isoBase64URL_exports.toBuffer(HEADER.x5c[0], "base64");
  const leafCertInfo = getCertificateInfo(leafCertBuffer);
  const { subject } = leafCertInfo;
  if (subject.CN !== "attest.android.com") {
    throw new Error('Certificate common name was not "attest.android.com" (SafetyNet)');
  }
  const statement = await MetadataService.getStatement(aaguid);
  if (statement) {
    try {
      await verifyAttestationWithMetadata({
        statement,
        credentialPublicKey,
        x5c: HEADER.x5c,
        attestationStatementAlg: alg,
      });
    } catch (err) {
      const _err = err;
      throw new Error(`${_err.message} (SafetyNet)`);
    }
  } else {
    try {
      await validateCertificatePath(HEADER.x5c.map(convertCertBufferToPEM), rootCertificates);
    } catch (err) {
      const _err = err;
      throw new Error(`${_err.message} (SafetyNet)`);
    }
  }
  const signatureBaseBuffer = isoUint8Array_exports.fromUTF8String(`${jwtParts[0]}.${jwtParts[1]}`);
  const signatureBuffer = isoBase64URL_exports.toBuffer(SIGNATURE);
  const verified = await verifySignature({
    signature: signatureBuffer,
    data: signatureBaseBuffer,
    x509Certificate: leafCertBuffer,
    hashAlgorithm: alg,
  });
  return verified;
}
__name(verifyAttestationAndroidSafetyNet, "verifyAttestationAndroidSafetyNet");

// node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/verifyAttestationTPM.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/constants.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var TPM_ST = {
  196: "TPM_ST_RSP_COMMAND",
  32768: "TPM_ST_NULL",
  32769: "TPM_ST_NO_SESSIONS",
  32770: "TPM_ST_SESSIONS",
  32788: "TPM_ST_ATTEST_NV",
  32789: "TPM_ST_ATTEST_COMMAND_AUDIT",
  32790: "TPM_ST_ATTEST_SESSION_AUDIT",
  32791: "TPM_ST_ATTEST_CERTIFY",
  32792: "TPM_ST_ATTEST_QUOTE",
  32793: "TPM_ST_ATTEST_TIME",
  32794: "TPM_ST_ATTEST_CREATION",
  32801: "TPM_ST_CREATION",
  32802: "TPM_ST_VERIFIED",
  32803: "TPM_ST_AUTH_SECRET",
  32804: "TPM_ST_HASHCHECK",
  32805: "TPM_ST_AUTH_SIGNED",
  32809: "TPM_ST_FU_MANIFEST",
};
var TPM_ALG = {
  0: "TPM_ALG_ERROR",
  1: "TPM_ALG_RSA",
  4: "TPM_ALG_SHA",
  // @ts-ignore 2300
  4: "TPM_ALG_SHA1",
  5: "TPM_ALG_HMAC",
  6: "TPM_ALG_AES",
  7: "TPM_ALG_MGF1",
  8: "TPM_ALG_KEYEDHASH",
  10: "TPM_ALG_XOR",
  11: "TPM_ALG_SHA256",
  12: "TPM_ALG_SHA384",
  13: "TPM_ALG_SHA512",
  16: "TPM_ALG_NULL",
  18: "TPM_ALG_SM3_256",
  19: "TPM_ALG_SM4",
  20: "TPM_ALG_RSASSA",
  21: "TPM_ALG_RSAES",
  22: "TPM_ALG_RSAPSS",
  23: "TPM_ALG_OAEP",
  24: "TPM_ALG_ECDSA",
  25: "TPM_ALG_ECDH",
  26: "TPM_ALG_ECDAA",
  27: "TPM_ALG_SM2",
  28: "TPM_ALG_ECSCHNORR",
  29: "TPM_ALG_ECMQV",
  32: "TPM_ALG_KDF1_SP800_56A",
  33: "TPM_ALG_KDF2",
  34: "TPM_ALG_KDF1_SP800_108",
  35: "TPM_ALG_ECC",
  37: "TPM_ALG_SYMCIPHER",
  38: "TPM_ALG_CAMELLIA",
  64: "TPM_ALG_CTR",
  65: "TPM_ALG_OFB",
  66: "TPM_ALG_CBC",
  67: "TPM_ALG_CFB",
  68: "TPM_ALG_ECB",
};
var TPM_ECC_CURVE = {
  0: "TPM_ECC_NONE",
  1: "TPM_ECC_NIST_P192",
  2: "TPM_ECC_NIST_P224",
  3: "TPM_ECC_NIST_P256",
  4: "TPM_ECC_NIST_P384",
  5: "TPM_ECC_NIST_P521",
  16: "TPM_ECC_BN_P256",
  17: "TPM_ECC_BN_P638",
  32: "TPM_ECC_SM2_P256",
};
var TPM_MANUFACTURERS = {
  "id:414D4400": { name: "AMD", id: "AMD" },
  "id:414E5400": { name: "Ant Group", id: "ANT" },
  "id:41544D4C": { name: "Atmel", id: "ATML" },
  "id:4252434D": { name: "Broadcom", id: "BRCM" },
  "id:4353434F": { name: "Cisco", id: "CSCO" },
  "id:464C5953": { name: "Flyslice Technologies", id: "FLYS" },
  "id:524F4343": { name: "Fuzhou Rockchip", id: "ROCC" },
  "id:474F4F47": { name: "Google", id: "GOOG" },
  "id:48504900": { name: "HPI", id: "HPI" },
  "id:48504500": { name: "HPE", id: "HPE" },
  "id:48495349": { name: "Huawei", id: "HISI" },
  "id:49424d00": { name: "IBM", id: "IBM" },
  "id:49424D00": { name: "IBM", id: "IBM" },
  // Same ID for IBM as above, except the "D" is capitalized as per TPM spec
  "id:49465800": { name: "Infineon", id: "IFX" },
  "id:494E5443": { name: "Intel", id: "INTC" },
  "id:4C454E00": { name: "Lenovo", id: "LEN" },
  "id:4D534654": { name: "Microsoft", id: "MSFT" },
  "id:4E534D20": { name: "National Semiconductor", id: "NSM" },
  "id:4E545A00": { name: "Nationz", id: "NTZ" },
  "id:4E534700": { name: "NSING", id: "NSG" },
  "id:4E544300": { name: "Nuvoton Technology", id: "NTC" },
  "id:51434F4D": { name: "Qualcomm", id: "QCOM" },
  "id:534D534E": { name: "Samsung", id: "SMSN" },
  "id:53454345": { name: "SecEdge", id: "SECE" },
  "id:534E5300": { name: "Sinosun", id: "SNS" },
  "id:534D5343": { name: "SMSC", id: "SMSC" },
  "id:53544D20": { name: "STMicroelectronics", id: "STM" },
  "id:54584E00": { name: "Texas Instruments", id: "TXN" },
  "id:57454300": { name: "Winbond", id: "WEC" },
  "id:5345414C": { name: "Wisekey", id: "SEAL" },
  "id:FFFFF1D0": { name: "FIDO Alliance", id: "FIDO" },
  // FIDO Conformance
};
var TPM_ECC_CURVE_COSE_CRV_MAP = {
  TPM_ECC_NIST_P256: 1,
  // p256
  TPM_ECC_NIST_P384: 2,
  // p384
  TPM_ECC_NIST_P521: 3,
  // p521
  TPM_ECC_BN_P256: 1,
  // p256
  TPM_ECC_SM2_P256: 1,
  // p256
};

// node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/parseCertInfo.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function parseCertInfo(certInfo) {
  let pointer = 0;
  const dataView = isoUint8Array_exports.toDataView(certInfo);
  const magic = dataView.getUint32(pointer);
  pointer += 4;
  const typeBuffer = dataView.getUint16(pointer);
  pointer += 2;
  const type = TPM_ST[typeBuffer];
  const qualifiedSignerLength = dataView.getUint16(pointer);
  pointer += 2;
  const qualifiedSigner = certInfo.slice(pointer, (pointer += qualifiedSignerLength));
  const extraDataLength = dataView.getUint16(pointer);
  pointer += 2;
  const extraData = certInfo.slice(pointer, (pointer += extraDataLength));
  const clock = certInfo.slice(pointer, (pointer += 8));
  const resetCount = dataView.getUint32(pointer);
  pointer += 4;
  const restartCount = dataView.getUint32(pointer);
  pointer += 4;
  const safe = !!certInfo.slice(pointer, (pointer += 1));
  const clockInfo = { clock, resetCount, restartCount, safe };
  const firmwareVersion = certInfo.slice(pointer, (pointer += 8));
  const attestedNameLength = dataView.getUint16(pointer);
  pointer += 2;
  const attestedName = certInfo.slice(pointer, (pointer += attestedNameLength));
  const attestedNameDataView = isoUint8Array_exports.toDataView(attestedName);
  const qualifiedNameLength = dataView.getUint16(pointer);
  pointer += 2;
  const qualifiedName = certInfo.slice(pointer, (pointer += qualifiedNameLength));
  const attested = {
    nameAlg: TPM_ALG[attestedNameDataView.getUint16(0)],
    nameAlgBuffer: attestedName.slice(0, 2),
    name: attestedName,
    qualifiedName,
  };
  return {
    magic,
    type,
    qualifiedSigner,
    extraData,
    clockInfo,
    firmwareVersion,
    attested,
  };
}
__name(parseCertInfo, "parseCertInfo");

// node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/parsePubArea.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function parsePubArea(pubArea) {
  let pointer = 0;
  const dataView = isoUint8Array_exports.toDataView(pubArea);
  const type = TPM_ALG[dataView.getUint16(pointer)];
  pointer += 2;
  const nameAlg = TPM_ALG[dataView.getUint16(pointer)];
  pointer += 2;
  const objectAttributesInt = dataView.getUint32(pointer);
  pointer += 4;
  const objectAttributes = {
    fixedTPM: !!(objectAttributesInt & 1),
    stClear: !!(objectAttributesInt & 2),
    fixedParent: !!(objectAttributesInt & 8),
    sensitiveDataOrigin: !!(objectAttributesInt & 16),
    userWithAuth: !!(objectAttributesInt & 32),
    adminWithPolicy: !!(objectAttributesInt & 64),
    noDA: !!(objectAttributesInt & 512),
    encryptedDuplication: !!(objectAttributesInt & 1024),
    restricted: !!(objectAttributesInt & 32768),
    decrypt: !!(objectAttributesInt & 65536),
    signOrEncrypt: !!(objectAttributesInt & 131072),
  };
  const authPolicyLength = dataView.getUint16(pointer);
  pointer += 2;
  const authPolicy = pubArea.slice(pointer, (pointer += authPolicyLength));
  const parameters = {};
  let unique = Uint8Array.from([]);
  if (type === "TPM_ALG_RSA") {
    const symmetric = TPM_ALG[dataView.getUint16(pointer)];
    pointer += 2;
    const scheme = TPM_ALG[dataView.getUint16(pointer)];
    pointer += 2;
    const keyBits = dataView.getUint16(pointer);
    pointer += 2;
    const exponent = dataView.getUint32(pointer);
    pointer += 4;
    parameters.rsa = { symmetric, scheme, keyBits, exponent };
    const uniqueLength = dataView.getUint16(pointer);
    pointer += 2;
    unique = pubArea.slice(pointer, (pointer += uniqueLength));
  } else if (type === "TPM_ALG_ECC") {
    const symmetric = TPM_ALG[dataView.getUint16(pointer)];
    pointer += 2;
    const scheme = TPM_ALG[dataView.getUint16(pointer)];
    pointer += 2;
    const curveID = TPM_ECC_CURVE[dataView.getUint16(pointer)];
    pointer += 2;
    const kdf = TPM_ALG[dataView.getUint16(pointer)];
    pointer += 2;
    parameters.ecc = { symmetric, scheme, curveID, kdf };
    const uniqueXLength = dataView.getUint16(pointer);
    pointer += 2;
    const uniqueX = pubArea.slice(pointer, (pointer += uniqueXLength));
    const uniqueYLength = dataView.getUint16(pointer);
    pointer += 2;
    const uniqueY = pubArea.slice(pointer, (pointer += uniqueYLength));
    unique = isoUint8Array_exports.concat([uniqueX, uniqueY]);
  } else {
    throw new Error(`Unexpected type "${type}" (TPM)`);
  }
  return {
    type,
    nameAlg,
    objectAttributes,
    authPolicy,
    parameters,
    unique,
  };
}
__name(parsePubArea, "parsePubArea");

// node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/verifyAttestationTPM.js
async function verifyAttestationTPM(options) {
  const { aaguid, attStmt, authData, credentialPublicKey, clientDataHash, rootCertificates } =
    options;
  const ver = attStmt.get("ver");
  const sig = attStmt.get("sig");
  const alg = attStmt.get("alg");
  const x5c = attStmt.get("x5c");
  const pubArea = attStmt.get("pubArea");
  const certInfo = attStmt.get("certInfo");
  if (ver !== "2.0") {
    throw new Error(`Unexpected ver "${ver}", expected "2.0" (TPM)`);
  }
  if (!sig) {
    throw new Error("No attestation signature provided in attestation statement (TPM)");
  }
  if (!alg) {
    throw new Error(`Attestation statement did not contain alg (TPM)`);
  }
  if (!isCOSEAlg(alg)) {
    throw new Error(`Attestation statement contained invalid alg ${alg} (TPM)`);
  }
  if (!x5c) {
    throw new Error("No attestation certificate provided in attestation statement (TPM)");
  }
  if (!pubArea) {
    throw new Error("Attestation statement did not contain pubArea (TPM)");
  }
  if (!certInfo) {
    throw new Error("Attestation statement did not contain certInfo (TPM)");
  }
  const parsedPubArea = parsePubArea(pubArea);
  const { unique, type: pubType, parameters } = parsedPubArea;
  const cosePublicKey = decodeCredentialPublicKey(credentialPublicKey);
  if (pubType === "TPM_ALG_RSA") {
    if (!isCOSEPublicKeyRSA(cosePublicKey)) {
      throw new Error(
        `Credential public key with kty ${cosePublicKey.get(COSEKEYS.kty)} did not match ${pubType}`
      );
    }
    const n = cosePublicKey.get(COSEKEYS.n);
    const e = cosePublicKey.get(COSEKEYS.e);
    if (!n) {
      throw new Error("COSE public key missing n (TPM|RSA)");
    }
    if (!e) {
      throw new Error("COSE public key missing e (TPM|RSA)");
    }
    if (!isoUint8Array_exports.areEqual(unique, n)) {
      throw new Error("PubArea unique is not same as credentialPublicKey (TPM|RSA)");
    }
    if (!parameters.rsa) {
      throw new Error(`Parsed pubArea type is RSA, but missing parameters.rsa (TPM|RSA)`);
    }
    const eBuffer = e;
    const pubAreaExponent = parameters.rsa.exponent || 65537;
    const eSum = eBuffer[0] + (eBuffer[1] << 8) + (eBuffer[2] << 16);
    if (pubAreaExponent !== eSum) {
      throw new Error(`Unexpected public key exp ${eSum}, expected ${pubAreaExponent} (TPM|RSA)`);
    }
  } else if (pubType === "TPM_ALG_ECC") {
    if (!isCOSEPublicKeyEC2(cosePublicKey)) {
      throw new Error(
        `Credential public key with kty ${cosePublicKey.get(COSEKEYS.kty)} did not match ${pubType}`
      );
    }
    const crv = cosePublicKey.get(COSEKEYS.crv);
    const x = cosePublicKey.get(COSEKEYS.x);
    const y = cosePublicKey.get(COSEKEYS.y);
    if (!crv) {
      throw new Error("COSE public key missing crv (TPM|ECC)");
    }
    if (!x) {
      throw new Error("COSE public key missing x (TPM|ECC)");
    }
    if (!y) {
      throw new Error("COSE public key missing y (TPM|ECC)");
    }
    if (!isoUint8Array_exports.areEqual(unique, isoUint8Array_exports.concat([x, y]))) {
      throw new Error("PubArea unique is not same as public key x and y (TPM|ECC)");
    }
    if (!parameters.ecc) {
      throw new Error(`Parsed pubArea type is ECC, but missing parameters.ecc (TPM|ECC)`);
    }
    const pubAreaCurveID = parameters.ecc.curveID;
    const pubAreaCurveIDMapToCOSECRV = TPM_ECC_CURVE_COSE_CRV_MAP[pubAreaCurveID];
    if (pubAreaCurveIDMapToCOSECRV !== crv) {
      throw new Error(
        `Public area key curve ID "${pubAreaCurveID}" mapped to "${pubAreaCurveIDMapToCOSECRV}" which did not match public key crv of "${crv}" (TPM|ECC)`
      );
    }
  } else {
    throw new Error(`Unsupported pubArea.type "${pubType}"`);
  }
  const parsedCertInfo = parseCertInfo(certInfo);
  const { magic, type: certType, attested, extraData } = parsedCertInfo;
  if (magic !== 4283712327) {
    throw new Error(`Unexpected magic value "${magic}", expected "0xff544347" (TPM)`);
  }
  if (certType !== "TPM_ST_ATTEST_CERTIFY") {
    throw new Error(`Unexpected type "${certType}", expected "TPM_ST_ATTEST_CERTIFY" (TPM)`);
  }
  const pubAreaHash = await toHash(pubArea, attestedNameAlgToCOSEAlg(attested.nameAlg));
  const attestedName = isoUint8Array_exports.concat([attested.nameAlgBuffer, pubAreaHash]);
  if (!isoUint8Array_exports.areEqual(attested.name, attestedName)) {
    throw new Error(`Attested name comparison failed (TPM)`);
  }
  const attToBeSigned = isoUint8Array_exports.concat([authData, clientDataHash]);
  const attToBeSignedHash = await toHash(attToBeSigned, alg);
  if (!isoUint8Array_exports.areEqual(extraData, attToBeSignedHash)) {
    throw new Error("CertInfo extra data did not equal hashed attestation (TPM)");
  }
  if (x5c.length < 1) {
    throw new Error("No certificates present in x5c array (TPM)");
  }
  const leafCertInfo = getCertificateInfo(x5c[0]);
  const { basicConstraintsCA, version: version2, subject, notAfter, notBefore } = leafCertInfo;
  if (basicConstraintsCA) {
    throw new Error("Certificate basic constraints CA was not `false` (TPM)");
  }
  if (version2 !== 2) {
    throw new Error("Certificate version was not `3` (ASN.1 value of 2) (TPM)");
  }
  if (subject.combined.length > 0) {
    throw new Error("Certificate subject was not empty (TPM)");
  }
  let now = /* @__PURE__ */ new Date();
  if (notBefore > now) {
    throw new Error(`Certificate not good before "${notBefore.toString()}" (TPM)`);
  }
  now = /* @__PURE__ */ new Date();
  if (notAfter < now) {
    throw new Error(`Certificate not good after "${notAfter.toString()}" (TPM)`);
  }
  const parsedCert = AsnParser.parse(x5c[0], Certificate);
  if (!parsedCert.tbsCertificate.extensions) {
    throw new Error("Certificate was missing extensions (TPM)");
  }
  let subjectAltNamePresent;
  let extKeyUsage;
  parsedCert.tbsCertificate.extensions.forEach((ext) => {
    if (ext.extnID === id_ce_subjectAltName) {
      subjectAltNamePresent = AsnParser.parse(ext.extnValue, SubjectAlternativeName);
    } else if (ext.extnID === id_ce_extKeyUsage) {
      extKeyUsage = AsnParser.parse(ext.extnValue, ExtendedKeyUsage);
    }
  });
  if (!subjectAltNamePresent) {
    throw new Error("Certificate did not contain subjectAltName extension (TPM)");
  }
  if (!subjectAltNamePresent[0].directoryName?.[0].length) {
    throw new Error("Certificate subjectAltName extension directoryName was empty (TPM)");
  }
  const { tcgAtTpmManufacturer, tcgAtTpmModel, tcgAtTpmVersion } = getTcgAtTpmValues(
    subjectAltNamePresent[0].directoryName
  );
  if (!tcgAtTpmManufacturer || !tcgAtTpmModel || !tcgAtTpmVersion) {
    throw new Error("Certificate contained incomplete subjectAltName data (TPM)");
  }
  if (!extKeyUsage) {
    throw new Error("Certificate did not contain ExtendedKeyUsage extension (TPM)");
  }
  if (!TPM_MANUFACTURERS[tcgAtTpmManufacturer]) {
    throw new Error(`Could not match TPM manufacturer "${tcgAtTpmManufacturer}" (TPM)`);
  }
  if (extKeyUsage[0] !== "2.23.133.8.3") {
    throw new Error(`Unexpected extKeyUsage "${extKeyUsage[0]}", expected "2.23.133.8.3" (TPM)`);
  }
  try {
    await validateExtFIDOGenCEAAGUID(parsedCert.tbsCertificate.extensions, aaguid);
  } catch (err) {
    const _err = err;
    throw new Error(`${_err.message} (TPM)`);
  }
  const statement = await MetadataService.getStatement(aaguid);
  if (statement) {
    try {
      await verifyAttestationWithMetadata({
        statement,
        credentialPublicKey,
        x5c,
        attestationStatementAlg: alg,
      });
    } catch (err) {
      const _err = err;
      throw new Error(`${_err.message} (TPM)`);
    }
  } else {
    try {
      await validateCertificatePath(x5c.map(convertCertBufferToPEM), rootCertificates);
    } catch (err) {
      const _err = err;
      throw new Error(`${_err.message} (TPM)`);
    }
  }
  return verifySignature({
    signature: sig,
    data: certInfo,
    x509Certificate: x5c[0],
    hashAlgorithm: alg,
  });
}
__name(verifyAttestationTPM, "verifyAttestationTPM");
function getTcgAtTpmValues(root) {
  const oidManufacturer = "2.23.133.2.1";
  const oidModel = "2.23.133.2.2";
  const oidVersion = "2.23.133.2.3";
  let tcgAtTpmManufacturer;
  let tcgAtTpmModel;
  let tcgAtTpmVersion;
  root.forEach((relName) => {
    relName.forEach((attr) => {
      if (attr.type === oidManufacturer) {
        tcgAtTpmManufacturer = attr.value.toString();
      } else if (attr.type === oidModel) {
        tcgAtTpmModel = attr.value.toString();
      } else if (attr.type === oidVersion) {
        tcgAtTpmVersion = attr.value.toString();
      }
    });
  });
  return {
    tcgAtTpmManufacturer,
    tcgAtTpmModel,
    tcgAtTpmVersion,
  };
}
__name(getTcgAtTpmValues, "getTcgAtTpmValues");
function attestedNameAlgToCOSEAlg(alg) {
  if (alg === "TPM_ALG_SHA256") {
    return COSEALG.ES256;
  } else if (alg === "TPM_ALG_SHA384") {
    return COSEALG.ES384;
  } else if (alg === "TPM_ALG_SHA512") {
    return COSEALG.ES512;
  }
  throw new Error(`Unexpected TPM attested name alg ${alg}`);
}
__name(attestedNameAlgToCOSEAlg, "attestedNameAlgToCOSEAlg");

// node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationAndroidKey.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-android/build/es2015/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@peculiar/asn1-android/build/es2015/key_description.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var IntegerSet_1;
var id_ce_keyDescription = "1.3.6.1.4.1.11129.2.1.17";
var VerifiedBootState;
(function (VerifiedBootState2) {
  VerifiedBootState2[(VerifiedBootState2["verified"] = 0)] = "verified";
  VerifiedBootState2[(VerifiedBootState2["selfSigned"] = 1)] = "selfSigned";
  VerifiedBootState2[(VerifiedBootState2["unverified"] = 2)] = "unverified";
  VerifiedBootState2[(VerifiedBootState2["failed"] = 3)] = "failed";
})(VerifiedBootState || (VerifiedBootState = {}));
var RootOfTrust = class {
  verifiedBootKey = new OctetString2();
  deviceLocked = false;
  verifiedBootState = VerifiedBootState.verified;
  verifiedBootHash;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(RootOfTrust, "RootOfTrust");
__decorate([AsnProp({ type: OctetString2 })], RootOfTrust.prototype, "verifiedBootKey", void 0);
__decorate(
  [AsnProp({ type: AsnPropTypes.Boolean })],
  RootOfTrust.prototype,
  "deviceLocked",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Enumerated })],
  RootOfTrust.prototype,
  "verifiedBootState",
  void 0
);
__decorate(
  [
    AsnProp({
      type: OctetString2,
      optional: true,
    }),
  ],
  RootOfTrust.prototype,
  "verifiedBootHash",
  void 0
);
var IntegerSet = (IntegerSet_1 = /* @__PURE__ */ __name(
  class IntegerSet2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, IntegerSet_1.prototype);
    }
  },
  "IntegerSet"
));
IntegerSet = IntegerSet_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Set,
      itemType: AsnPropTypes.Integer,
    }),
  ],
  IntegerSet
);
var AuthorizationList = class {
  purpose;
  algorithm;
  keySize;
  digest;
  padding;
  ecCurve;
  rsaPublicExponent;
  mgfDigest;
  rollbackResistance;
  earlyBootOnly;
  activeDateTime;
  originationExpireDateTime;
  usageExpireDateTime;
  usageCountLimit;
  noAuthRequired;
  userAuthType;
  authTimeout;
  allowWhileOnBody;
  trustedUserPresenceRequired;
  trustedConfirmationRequired;
  unlockedDeviceRequired;
  allApplications;
  applicationId;
  creationDateTime;
  origin;
  rollbackResistant;
  rootOfTrust;
  osVersion;
  osPatchLevel;
  attestationApplicationId;
  attestationIdBrand;
  attestationIdDevice;
  attestationIdProduct;
  attestationIdSerial;
  attestationIdImei;
  attestationIdMeid;
  attestationIdManufacturer;
  attestationIdModel;
  vendorPatchLevel;
  bootPatchLevel;
  deviceUniqueAttestation;
  attestationIdSecondImei;
  moduleHash;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(AuthorizationList, "AuthorizationList");
__decorate(
  [
    AsnProp({
      context: 1,
      type: IntegerSet,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "purpose",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 2,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "algorithm",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 3,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "keySize",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 5,
      type: IntegerSet,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "digest",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 6,
      type: IntegerSet,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "padding",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 10,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "ecCurve",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 200,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "rsaPublicExponent",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 203,
      type: IntegerSet,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "mgfDigest",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 303,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "rollbackResistance",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 305,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "earlyBootOnly",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 400,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "activeDateTime",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 401,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "originationExpireDateTime",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 402,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "usageExpireDateTime",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 405,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "usageCountLimit",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 503,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "noAuthRequired",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 504,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "userAuthType",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 505,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "authTimeout",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 506,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "allowWhileOnBody",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 507,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "trustedUserPresenceRequired",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 508,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "trustedConfirmationRequired",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 509,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "unlockedDeviceRequired",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 600,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "allApplications",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 601,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "applicationId",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 701,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "creationDateTime",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 702,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "origin",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 703,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "rollbackResistant",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 704,
      type: RootOfTrust,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "rootOfTrust",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 705,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "osVersion",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 706,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "osPatchLevel",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 709,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationApplicationId",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 710,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationIdBrand",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 711,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationIdDevice",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 712,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationIdProduct",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 713,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationIdSerial",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 714,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationIdImei",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 715,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationIdMeid",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 716,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationIdManufacturer",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 717,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationIdModel",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 718,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "vendorPatchLevel",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 719,
      type: AsnPropTypes.Integer,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "bootPatchLevel",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 720,
      type: AsnPropTypes.Null,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "deviceUniqueAttestation",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 723,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "attestationIdSecondImei",
  void 0
);
__decorate(
  [
    AsnProp({
      context: 724,
      type: OctetString2,
      optional: true,
    }),
  ],
  AuthorizationList.prototype,
  "moduleHash",
  void 0
);
var SecurityLevel;
(function (SecurityLevel2) {
  SecurityLevel2[(SecurityLevel2["software"] = 0)] = "software";
  SecurityLevel2[(SecurityLevel2["trustedEnvironment"] = 1)] = "trustedEnvironment";
  SecurityLevel2[(SecurityLevel2["strongBox"] = 2)] = "strongBox";
})(SecurityLevel || (SecurityLevel = {}));
var Version3;
(function (Version4) {
  Version4[(Version4["KM2"] = 1)] = "KM2";
  Version4[(Version4["KM3"] = 2)] = "KM3";
  Version4[(Version4["KM4"] = 3)] = "KM4";
  Version4[(Version4["KM4_1"] = 4)] = "KM4_1";
  Version4[(Version4["keyMint1"] = 100)] = "keyMint1";
  Version4[(Version4["keyMint2"] = 200)] = "keyMint2";
  Version4[(Version4["keyMint3"] = 300)] = "keyMint3";
  Version4[(Version4["keyMint4"] = 400)] = "keyMint4";
})(Version3 || (Version3 = {}));
var KeyDescription = class {
  attestationVersion = Version3.KM4;
  attestationSecurityLevel = SecurityLevel.software;
  keymasterVersion = 0;
  keymasterSecurityLevel = SecurityLevel.software;
  attestationChallenge = new OctetString2();
  uniqueId = new OctetString2();
  softwareEnforced = new AuthorizationList();
  teeEnforced = new AuthorizationList();
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(KeyDescription, "KeyDescription");
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  KeyDescription.prototype,
  "attestationVersion",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Enumerated })],
  KeyDescription.prototype,
  "attestationSecurityLevel",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  KeyDescription.prototype,
  "keymasterVersion",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Enumerated })],
  KeyDescription.prototype,
  "keymasterSecurityLevel",
  void 0
);
__decorate(
  [AsnProp({ type: OctetString2 })],
  KeyDescription.prototype,
  "attestationChallenge",
  void 0
);
__decorate([AsnProp({ type: OctetString2 })], KeyDescription.prototype, "uniqueId", void 0);
__decorate(
  [AsnProp({ type: AuthorizationList })],
  KeyDescription.prototype,
  "softwareEnforced",
  void 0
);
__decorate([AsnProp({ type: AuthorizationList })], KeyDescription.prototype, "teeEnforced", void 0);
var KeyMintKeyDescription = class {
  attestationVersion = Version3.keyMint4;
  attestationSecurityLevel = SecurityLevel.software;
  keyMintVersion = 0;
  keyMintSecurityLevel = SecurityLevel.software;
  attestationChallenge = new OctetString2();
  uniqueId = new OctetString2();
  softwareEnforced = new AuthorizationList();
  hardwareEnforced = new AuthorizationList();
  constructor(params = {}) {
    Object.assign(this, params);
  }
  toLegacyKeyDescription() {
    return new KeyDescription({
      attestationVersion: this.attestationVersion,
      attestationSecurityLevel: this.attestationSecurityLevel,
      keymasterVersion: this.keyMintVersion,
      keymasterSecurityLevel: this.keyMintSecurityLevel,
      attestationChallenge: this.attestationChallenge,
      uniqueId: this.uniqueId,
      softwareEnforced: this.softwareEnforced,
      teeEnforced: this.hardwareEnforced,
    });
  }
  static fromLegacyKeyDescription(keyDesc) {
    return new KeyMintKeyDescription({
      attestationVersion: keyDesc.attestationVersion,
      attestationSecurityLevel: keyDesc.attestationSecurityLevel,
      keyMintVersion: keyDesc.keymasterVersion,
      keyMintSecurityLevel: keyDesc.keymasterSecurityLevel,
      attestationChallenge: keyDesc.attestationChallenge,
      uniqueId: keyDesc.uniqueId,
      softwareEnforced: keyDesc.softwareEnforced,
      hardwareEnforced: keyDesc.teeEnforced,
    });
  }
};
__name(KeyMintKeyDescription, "KeyMintKeyDescription");
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  KeyMintKeyDescription.prototype,
  "attestationVersion",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Enumerated })],
  KeyMintKeyDescription.prototype,
  "attestationSecurityLevel",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  KeyMintKeyDescription.prototype,
  "keyMintVersion",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Enumerated })],
  KeyMintKeyDescription.prototype,
  "keyMintSecurityLevel",
  void 0
);
__decorate(
  [AsnProp({ type: OctetString2 })],
  KeyMintKeyDescription.prototype,
  "attestationChallenge",
  void 0
);
__decorate([AsnProp({ type: OctetString2 })], KeyMintKeyDescription.prototype, "uniqueId", void 0);
__decorate(
  [AsnProp({ type: AuthorizationList })],
  KeyMintKeyDescription.prototype,
  "softwareEnforced",
  void 0
);
__decorate(
  [AsnProp({ type: AuthorizationList })],
  KeyMintKeyDescription.prototype,
  "hardwareEnforced",
  void 0
);

// node_modules/@peculiar/asn1-android/build/es2015/nonstandard.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var NonStandardAuthorizationList_1;
var NonStandardAuthorization = /* @__PURE__ */ __name(
  class NonStandardAuthorization2 extends AuthorizationList {},
  "NonStandardAuthorization"
);
NonStandardAuthorization = __decorate(
  [AsnType({ type: AsnTypeTypes.Choice })],
  NonStandardAuthorization
);
var NonStandardAuthorizationList = (NonStandardAuthorizationList_1 = /* @__PURE__ */ __name(
  class NonStandardAuthorizationList2 extends AsnArray {
    constructor(items) {
      super(items);
      Object.setPrototypeOf(this, NonStandardAuthorizationList_1.prototype);
    }
    findProperty(key) {
      const prop = this.find((o) => o[key] !== void 0);
      if (prop) {
        return prop[key];
      }
      return void 0;
    }
  },
  "NonStandardAuthorizationList"
));
NonStandardAuthorizationList = NonStandardAuthorizationList_1 = __decorate(
  [
    AsnType({
      type: AsnTypeTypes.Sequence,
      itemType: NonStandardAuthorization,
    }),
  ],
  NonStandardAuthorizationList
);
var NonStandardKeyDescription = class {
  attestationVersion = Version3.KM4;
  attestationSecurityLevel = SecurityLevel.software;
  keymasterVersion = 0;
  keymasterSecurityLevel = SecurityLevel.software;
  attestationChallenge = new OctetString2();
  uniqueId = new OctetString2();
  softwareEnforced = new NonStandardAuthorizationList();
  teeEnforced = new NonStandardAuthorizationList();
  get keyMintVersion() {
    return this.keymasterVersion;
  }
  set keyMintVersion(value) {
    this.keymasterVersion = value;
  }
  get keyMintSecurityLevel() {
    return this.keymasterSecurityLevel;
  }
  set keyMintSecurityLevel(value) {
    this.keymasterSecurityLevel = value;
  }
  get hardwareEnforced() {
    return this.teeEnforced;
  }
  set hardwareEnforced(value) {
    this.teeEnforced = value;
  }
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(NonStandardKeyDescription, "NonStandardKeyDescription");
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  NonStandardKeyDescription.prototype,
  "attestationVersion",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Enumerated })],
  NonStandardKeyDescription.prototype,
  "attestationSecurityLevel",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  NonStandardKeyDescription.prototype,
  "keymasterVersion",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Enumerated })],
  NonStandardKeyDescription.prototype,
  "keymasterSecurityLevel",
  void 0
);
__decorate(
  [AsnProp({ type: OctetString2 })],
  NonStandardKeyDescription.prototype,
  "attestationChallenge",
  void 0
);
__decorate(
  [AsnProp({ type: OctetString2 })],
  NonStandardKeyDescription.prototype,
  "uniqueId",
  void 0
);
__decorate(
  [AsnProp({ type: NonStandardAuthorizationList })],
  NonStandardKeyDescription.prototype,
  "softwareEnforced",
  void 0
);
__decorate(
  [AsnProp({ type: NonStandardAuthorizationList })],
  NonStandardKeyDescription.prototype,
  "teeEnforced",
  void 0
);
var NonStandardKeyMintKeyDescription = /* @__PURE__ */ __name(
  class NonStandardKeyMintKeyDescription2 extends NonStandardKeyDescription {
    constructor(params = {}) {
      if ("keymasterVersion" in params && !("keyMintVersion" in params)) {
        params.keyMintVersion = params.keymasterVersion;
      }
      if ("keymasterSecurityLevel" in params && !("keyMintSecurityLevel" in params)) {
        params.keyMintSecurityLevel = params.keymasterSecurityLevel;
      }
      if ("teeEnforced" in params && !("hardwareEnforced" in params)) {
        params.hardwareEnforced = params.teeEnforced;
      }
      super(params);
    }
  },
  "NonStandardKeyMintKeyDescription"
);
NonStandardKeyMintKeyDescription = __decorate(
  [AsnType({ type: AsnTypeTypes.Sequence })],
  NonStandardKeyMintKeyDescription
);

// node_modules/@peculiar/asn1-android/build/es2015/attestation.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AttestationPackageInfo = class {
  packageName;
  version;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(AttestationPackageInfo, "AttestationPackageInfo");
__decorate(
  [AsnProp({ type: AsnPropTypes.OctetString })],
  AttestationPackageInfo.prototype,
  "packageName",
  void 0
);
__decorate(
  [AsnProp({ type: AsnPropTypes.Integer })],
  AttestationPackageInfo.prototype,
  "version",
  void 0
);
var AttestationApplicationId = class {
  packageInfos;
  signatureDigests;
  constructor(params = {}) {
    Object.assign(this, params);
  }
};
__name(AttestationApplicationId, "AttestationApplicationId");
__decorate(
  [
    AsnProp({
      type: AttestationPackageInfo,
      repeated: "set",
    }),
  ],
  AttestationApplicationId.prototype,
  "packageInfos",
  void 0
);
__decorate(
  [
    AsnProp({
      type: AsnPropTypes.OctetString,
      repeated: "set",
    }),
  ],
  AttestationApplicationId.prototype,
  "signatureDigests",
  void 0
);

// node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationAndroidKey.js
async function verifyAttestationAndroidKey(options) {
  const { authData, clientDataHash, attStmt, credentialPublicKey, aaguid, rootCertificates } =
    options;
  const x5c = attStmt.get("x5c");
  const sig = attStmt.get("sig");
  const alg = attStmt.get("alg");
  if (!x5c) {
    throw new Error("No attestation certificate provided in attestation statement (Android Key)");
  }
  if (!sig) {
    throw new Error("No attestation signature provided in attestation statement (Android Key)");
  }
  if (!alg) {
    throw new Error(`Attestation statement did not contain alg (Android Key)`);
  }
  if (!isCOSEAlg(alg)) {
    throw new Error(`Attestation statement contained invalid alg ${alg} (Android Key)`);
  }
  const parsedCert = AsnParser.parse(x5c[0], Certificate);
  const parsedCertPubKey = new Uint8Array(
    parsedCert.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey
  );
  const credPubKeyPKCS = convertCOSEtoPKCS(credentialPublicKey);
  if (!isoUint8Array_exports.areEqual(credPubKeyPKCS, parsedCertPubKey)) {
    throw new Error("Credential public key does not equal leaf cert public key (Android Key)");
  }
  const extKeyStore = parsedCert.tbsCertificate.extensions?.find(
    (ext) => ext.extnID === id_ce_keyDescription
  );
  if (!extKeyStore) {
    throw new Error("Certificate did not contain extKeyStore (Android Key)");
  }
  const parsedExtKeyStore = AsnParser.parse(extKeyStore.extnValue, KeyDescription);
  const { attestationChallenge, teeEnforced, softwareEnforced } = parsedExtKeyStore;
  if (
    !isoUint8Array_exports.areEqual(new Uint8Array(attestationChallenge.buffer), clientDataHash)
  ) {
    throw new Error("Attestation challenge was not equal to client data hash (Android Key)");
  }
  if (teeEnforced.allApplications !== void 0) {
    throw new Error('teeEnforced contained "allApplications [600]" tag (Android Key)');
  }
  if (softwareEnforced.allApplications !== void 0) {
    throw new Error('teeEnforced contained "allApplications [600]" tag (Android Key)');
  }
  const statement = await MetadataService.getStatement(aaguid);
  if (statement) {
    try {
      await verifyAttestationWithMetadata({
        statement,
        credentialPublicKey,
        x5c,
        attestationStatementAlg: alg,
      });
    } catch (err) {
      const _err = err;
      throw new Error(`${_err.message} (Android Key)`, { cause: _err });
    }
  } else {
    const x5cNoRootPEM = x5c.slice(0, -1).map(convertCertBufferToPEM);
    const x5cRootPEM = x5c.slice(-1).map(convertCertBufferToPEM);
    try {
      await validateCertificatePath(x5cNoRootPEM, x5cRootPEM);
    } catch (err) {
      const _err = err;
      throw new Error(`${_err.message} (Android Key)`, { cause: _err });
    }
    if (rootCertificates.length > 0 && rootCertificates.indexOf(x5cRootPEM[0]) < 0) {
      throw new Error("x5c root certificate was not a known root certificate (Android Key)");
    }
  }
  const signatureBase = isoUint8Array_exports.concat([authData, clientDataHash]);
  return verifySignature({
    signature: sig,
    data: signatureBase,
    x509Certificate: x5c[0],
    hashAlgorithm: alg,
  });
}
__name(verifyAttestationAndroidKey, "verifyAttestationAndroidKey");

// node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationApple.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function verifyAttestationApple(options) {
  const { attStmt, authData, clientDataHash, credentialPublicKey, rootCertificates } = options;
  const x5c = attStmt.get("x5c");
  if (!x5c) {
    throw new Error("No attestation certificate provided in attestation statement (Apple)");
  }
  try {
    await validateCertificatePath(x5c.map(convertCertBufferToPEM), rootCertificates);
  } catch (err) {
    const _err = err;
    throw new Error(`${_err.message} (Apple)`);
  }
  const parsedCredCert = AsnParser.parse(x5c[0], Certificate);
  const { extensions, subjectPublicKeyInfo } = parsedCredCert.tbsCertificate;
  if (!extensions) {
    throw new Error("credCert missing extensions (Apple)");
  }
  const extCertNonce = extensions.find((ext) => ext.extnID === "1.2.840.113635.100.8.2");
  if (!extCertNonce) {
    throw new Error('credCert missing "1.2.840.113635.100.8.2" extension (Apple)');
  }
  const nonceToHash = isoUint8Array_exports.concat([authData, clientDataHash]);
  const nonce = await toHash(nonceToHash);
  const extNonce = new Uint8Array(extCertNonce.extnValue.buffer).slice(6);
  if (!isoUint8Array_exports.areEqual(nonce, extNonce)) {
    throw new Error(`credCert nonce was not expected value (Apple)`);
  }
  const credPubKeyPKCS = convertCOSEtoPKCS(credentialPublicKey);
  const credCertSubjectPublicKey = new Uint8Array(subjectPublicKeyInfo.subjectPublicKey);
  if (!isoUint8Array_exports.areEqual(credPubKeyPKCS, credCertSubjectPublicKey)) {
    throw new Error("Credential public key does not equal credCert public key (Apple)");
  }
  return true;
}
__name(verifyAttestationApple, "verifyAttestationApple");

// node_modules/@simplewebauthn/server/esm/registration/verifyRegistrationResponse.js
async function verifyRegistrationResponse(options) {
  const {
    response,
    expectedChallenge,
    expectedOrigin,
    expectedRPID,
    expectedType,
    requireUserPresence = true,
    requireUserVerification = true,
    supportedAlgorithmIDs = supportedCOSEAlgorithmIdentifiers,
    attestationSafetyNetEnforceCTSCheck = true,
  } = options;
  const { id, rawId, type: credentialType, response: attestationResponse } = response;
  if (!id) {
    throw new Error("Missing credential ID");
  }
  if (id !== rawId) {
    throw new Error("Credential ID was not base64url-encoded");
  }
  if (credentialType !== "public-key") {
    throw new Error(`Unexpected credential type ${credentialType}, expected "public-key"`);
  }
  const clientDataJSON = decodeClientDataJSON(attestationResponse.clientDataJSON);
  const { type, origin, challenge, tokenBinding } = clientDataJSON;
  if (Array.isArray(expectedType)) {
    if (!expectedType.includes(type)) {
      const joinedExpectedType = expectedType.join(", ");
      throw new Error(
        `Unexpected registration response type "${type}", expected one of: ${joinedExpectedType}`
      );
    }
  } else if (expectedType) {
    if (type !== expectedType) {
      throw new Error(
        `Unexpected registration response type "${type}", expected "${expectedType}"`
      );
    }
  } else if (type !== "webauthn.create") {
    throw new Error(`Unexpected registration response type: ${type}`);
  }
  if (typeof expectedChallenge === "function") {
    if (!(await expectedChallenge(challenge))) {
      throw new Error(
        `Custom challenge verifier returned false for registration response challenge "${challenge}"`
      );
    }
  } else if (challenge !== expectedChallenge) {
    throw new Error(
      `Unexpected registration response challenge "${challenge}", expected "${expectedChallenge}"`
    );
  }
  if (Array.isArray(expectedOrigin)) {
    if (!expectedOrigin.includes(origin)) {
      throw new Error(
        `Unexpected registration response origin "${origin}", expected one of: ${expectedOrigin.join(", ")}`
      );
    }
  } else {
    if (origin !== expectedOrigin) {
      throw new Error(
        `Unexpected registration response origin "${origin}", expected "${expectedOrigin}"`
      );
    }
  }
  if (tokenBinding) {
    if (typeof tokenBinding !== "object") {
      throw new Error(`Unexpected value for TokenBinding "${tokenBinding}"`);
    }
    if (["present", "supported", "not-supported"].indexOf(tokenBinding.status) < 0) {
      throw new Error(`Unexpected tokenBinding.status value of "${tokenBinding.status}"`);
    }
  }
  const attestationObject = isoBase64URL_exports.toBuffer(attestationResponse.attestationObject);
  const decodedAttestationObject = decodeAttestationObject(attestationObject);
  const fmt = decodedAttestationObject.get("fmt");
  const authData = decodedAttestationObject.get("authData");
  const attStmt = decodedAttestationObject.get("attStmt");
  const parsedAuthData = parseAuthenticatorData(authData);
  const { aaguid, rpIdHash, flags, credentialID, counter, credentialPublicKey, extensionsData } =
    parsedAuthData;
  let matchedRPID;
  if (expectedRPID) {
    let expectedRPIDs = [];
    if (typeof expectedRPID === "string") {
      expectedRPIDs = [expectedRPID];
    } else {
      expectedRPIDs = expectedRPID;
    }
    matchedRPID = await matchExpectedRPID(rpIdHash, expectedRPIDs);
  }
  if (requireUserPresence && !flags.up) {
    throw new Error("User presence was required, but user was not present");
  }
  if (requireUserVerification && !flags.uv) {
    throw new Error("User verification was required, but user could not be verified");
  }
  if (!credentialID) {
    throw new Error("No credential ID was provided by authenticator");
  }
  if (!credentialPublicKey) {
    throw new Error("No public key was provided by authenticator");
  }
  if (!aaguid) {
    throw new Error("No AAGUID was present during registration");
  }
  const decodedPublicKey = decodeCredentialPublicKey(credentialPublicKey);
  const alg = decodedPublicKey.get(COSEKEYS.alg);
  if (typeof alg !== "number") {
    throw new Error("Credential public key was missing numeric alg");
  }
  if (!supportedAlgorithmIDs.includes(alg)) {
    const supported = supportedAlgorithmIDs.join(", ");
    throw new Error(`Unexpected public key alg "${alg}", expected one of "${supported}"`);
  }
  const clientDataHash = await toHash(
    isoBase64URL_exports.toBuffer(attestationResponse.clientDataJSON)
  );
  const rootCertificates = SettingsService.getRootCertificates({
    identifier: fmt,
  });
  const verifierOpts = {
    aaguid,
    attStmt,
    authData,
    clientDataHash,
    credentialID,
    credentialPublicKey,
    rootCertificates,
    rpIdHash,
    attestationSafetyNetEnforceCTSCheck,
  };
  let verified = false;
  if (fmt === "fido-u2f") {
    verified = await verifyAttestationFIDOU2F(verifierOpts);
  } else if (fmt === "packed") {
    verified = await verifyAttestationPacked(verifierOpts);
  } else if (fmt === "android-safetynet") {
    verified = await verifyAttestationAndroidSafetyNet(verifierOpts);
  } else if (fmt === "android-key") {
    verified = await verifyAttestationAndroidKey(verifierOpts);
  } else if (fmt === "tpm") {
    verified = await verifyAttestationTPM(verifierOpts);
  } else if (fmt === "apple") {
    verified = await verifyAttestationApple(verifierOpts);
  } else if (fmt === "none") {
    if (attStmt.size > 0) {
      throw new Error("None attestation had unexpected attestation statement");
    }
    verified = true;
  } else {
    throw new Error(`Unsupported Attestation Format: ${fmt}`);
  }
  if (!verified) {
    return { verified: false };
  }
  const { credentialDeviceType, credentialBackedUp } = parseBackupFlags(flags);
  return {
    verified: true,
    registrationInfo: {
      fmt,
      aaguid: convertAAGUIDToString(aaguid),
      credentialType,
      credential: {
        id: isoBase64URL_exports.fromBuffer(credentialID),
        publicKey: credentialPublicKey,
        counter,
        transports: response.response.transports,
      },
      attestationObject,
      userVerified: flags.uv,
      credentialDeviceType,
      credentialBackedUp,
      origin: clientDataJSON.origin,
      rpID: matchedRPID,
      authenticatorExtensionResults: extensionsData,
    },
  };
}
__name(verifyRegistrationResponse, "verifyRegistrationResponse");

// node_modules/@simplewebauthn/server/esm/authentication/generateAuthenticationOptions.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/authentication/verifyAuthenticationResponse.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function verifyAuthenticationResponse(options) {
  const {
    response,
    expectedChallenge,
    expectedOrigin,
    expectedRPID,
    expectedType,
    credential,
    requireUserVerification = true,
    advancedFIDOConfig,
  } = options;
  const { id, rawId, type: credentialType, response: assertionResponse } = response;
  if (!id) {
    throw new Error("Missing credential ID");
  }
  if (id !== rawId) {
    throw new Error("Credential ID was not base64url-encoded");
  }
  if (credentialType !== "public-key") {
    throw new Error(`Unexpected credential type ${credentialType}, expected "public-key"`);
  }
  if (!response) {
    throw new Error("Credential missing response");
  }
  if (typeof assertionResponse?.clientDataJSON !== "string") {
    throw new Error("Credential response clientDataJSON was not a string");
  }
  const clientDataJSON = decodeClientDataJSON(assertionResponse.clientDataJSON);
  const { type, origin, challenge, tokenBinding } = clientDataJSON;
  if (Array.isArray(expectedType)) {
    if (!expectedType.includes(type)) {
      const joinedExpectedType = expectedType.join(", ");
      throw new Error(
        `Unexpected authentication response type "${type}", expected one of: ${joinedExpectedType}`
      );
    }
  } else if (expectedType) {
    if (type !== expectedType) {
      throw new Error(
        `Unexpected authentication response type "${type}", expected "${expectedType}"`
      );
    }
  } else if (type !== "webauthn.get") {
    throw new Error(`Unexpected authentication response type: ${type}`);
  }
  if (typeof expectedChallenge === "function") {
    if (!(await expectedChallenge(challenge))) {
      throw new Error(
        `Custom challenge verifier returned false for registration response challenge "${challenge}"`
      );
    }
  } else if (challenge !== expectedChallenge) {
    throw new Error(
      `Unexpected authentication response challenge "${challenge}", expected "${expectedChallenge}"`
    );
  }
  if (Array.isArray(expectedOrigin)) {
    if (!expectedOrigin.includes(origin)) {
      const joinedExpectedOrigin = expectedOrigin.join(", ");
      throw new Error(
        `Unexpected authentication response origin "${origin}", expected one of: ${joinedExpectedOrigin}`
      );
    }
  } else {
    if (origin !== expectedOrigin) {
      throw new Error(
        `Unexpected authentication response origin "${origin}", expected "${expectedOrigin}"`
      );
    }
  }
  if (!isoBase64URL_exports.isBase64URL(assertionResponse.authenticatorData)) {
    throw new Error("Credential response authenticatorData was not a base64url string");
  }
  if (!isoBase64URL_exports.isBase64URL(assertionResponse.signature)) {
    throw new Error("Credential response signature was not a base64url string");
  }
  if (assertionResponse.userHandle && typeof assertionResponse.userHandle !== "string") {
    throw new Error("Credential response userHandle was not a string");
  }
  if (tokenBinding) {
    if (typeof tokenBinding !== "object") {
      throw new Error("ClientDataJSON tokenBinding was not an object");
    }
    if (["present", "supported", "notSupported"].indexOf(tokenBinding.status) < 0) {
      throw new Error(`Unexpected tokenBinding status ${tokenBinding.status}`);
    }
  }
  const authDataBuffer = isoBase64URL_exports.toBuffer(assertionResponse.authenticatorData);
  const parsedAuthData = parseAuthenticatorData(authDataBuffer);
  const { rpIdHash, flags, counter, extensionsData } = parsedAuthData;
  let expectedRPIDs = [];
  if (typeof expectedRPID === "string") {
    expectedRPIDs = [expectedRPID];
  } else {
    expectedRPIDs = expectedRPID;
  }
  const matchedRPID = await matchExpectedRPID(rpIdHash, expectedRPIDs);
  if (advancedFIDOConfig !== void 0) {
    const { userVerification: fidoUserVerification } = advancedFIDOConfig;
    if (fidoUserVerification === "required") {
      if (!flags.uv) {
        throw new Error("User verification required, but user could not be verified");
      }
    } else if (fidoUserVerification === "preferred" || fidoUserVerification === "discouraged") {
    }
  } else {
    if (!flags.up) {
      throw new Error("User not present during authentication");
    }
    if (requireUserVerification && !flags.uv) {
      throw new Error("User verification required, but user could not be verified");
    }
  }
  const clientDataHash = await toHash(
    isoBase64URL_exports.toBuffer(assertionResponse.clientDataJSON)
  );
  const signatureBase = isoUint8Array_exports.concat([authDataBuffer, clientDataHash]);
  const signature = isoBase64URL_exports.toBuffer(assertionResponse.signature);
  if ((counter > 0 || credential.counter > 0) && counter <= credential.counter) {
    throw new Error(
      `Response counter value ${counter} was lower than expected ${credential.counter}`
    );
  }
  const { credentialDeviceType, credentialBackedUp } = parseBackupFlags(flags);
  const toReturn = {
    verified: await verifySignature({
      signature,
      data: signatureBase,
      credentialPublicKey: credential.publicKey,
    }),
    authenticationInfo: {
      newCounter: counter,
      credentialID: credential.id,
      userVerified: flags.uv,
      credentialDeviceType,
      credentialBackedUp,
      authenticatorExtensionResults: extensionsData,
      origin: clientDataJSON.origin,
      rpID: matchedRPID,
    },
  };
  return toReturn;
}
__name(verifyAuthenticationResponse, "verifyAuthenticationResponse");

// node_modules/@simplewebauthn/server/esm/metadata/mdsTypes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@simplewebauthn/server/esm/types/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/routes/webauthn.ts
var CHALLENGE_TTL_MS = 5 * 60 * 1e3;
var PASSKEY_SESSION_TTL = 5 * 60;
var ACCESS_TOKEN_TTL = 15 * 60;
var REFRESH_TOKEN_TTL_DAYS = 30;
function getOrigin(request) {
  return request.headers.get("Origin");
}
__name(getOrigin, "getOrigin");
function getRpInfo(request, env2) {
  const requestOrigin = request.headers.get("Origin") ?? env2.CORS_ORIGIN;
  const isAllowed =
    requestOrigin === env2.CORS_ORIGIN ||
    requestOrigin.startsWith("http://localhost:") ||
    requestOrigin.startsWith("http://127.0.0.1:");
  const effectiveOrigin = isAllowed ? requestOrigin : env2.CORS_ORIGIN;
  const rpId = new URL(effectiveOrigin).hostname;
  return { rpId, expectedOrigin: effectiveOrigin };
}
__name(getRpInfo, "getRpInfo");
function uint8ArrayToBase64Url(bytes) {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(uint8ArrayToBase64Url, "uint8ArrayToBase64Url");
function base64UrlToUint8Array(s) {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const b64 = pad === 0 ? padded : padded + "====".slice(pad);
  const raw = atob(b64);
  const buf = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf;
}
__name(base64UrlToUint8Array, "base64UrlToUint8Array");
function corsify(response, origin, corsOrigin) {
  const hdrs = new Headers(response.headers);
  Object.entries(corsHeaders(origin, corsOrigin)).forEach(([k, v]) => hdrs.set(k, v));
  return new Response(response.body, { status: response.status, headers: hdrs });
}
__name(corsify, "corsify");
async function handleRegisterBegin(request, env2) {
  const origin = getOrigin(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) return corsify(authResult, origin, env2.CORS_ORIGIN);
  const proCheck = requirePro(authResult);
  if (proCheck) return corsify(proCheck, origin, env2.CORS_ORIGIN);
  const { userId } = authResult;
  const { rpId } = getRpInfo(request, env2);
  const existing = await env2.DB.prepare("SELECT id FROM webauthn_credentials WHERE user_id = ?")
    .bind(userId)
    .all();
  const excludeCredentials = (existing.results ?? []).map((r) => ({
    id: r.id,
    type: "public-key",
  }));
  const user = await env2.DB.prepare("SELECT email FROM users WHERE id = ?").bind(userId).first();
  const options = await generateRegistrationOptions({
    rpName: "kodawarimap",
    rpID: rpId,
    userID: new TextEncoder().encode(userId),
    userName: user?.email ?? userId,
    attestationType: "none",
    excludeCredentials,
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();
  await env2.DB.prepare("DELETE FROM webauthn_challenges WHERE user_id = ?").bind(userId).run();
  await env2.DB.prepare(
    "INSERT INTO webauthn_challenges (challenge, user_id, expires_at) VALUES (?, ?, ?)"
  )
    .bind(options.challenge, userId, expiresAt)
    .run();
  return jsonResponse(options, 200, origin, env2.CORS_ORIGIN);
}
__name(handleRegisterBegin, "handleRegisterBegin");
async function handleRegisterComplete(request, env2) {
  const origin = getOrigin(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) return corsify(authResult, origin, env2.CORS_ORIGIN);
  const proCheck = requirePro(authResult);
  if (proCheck) return corsify(proCheck, origin, env2.CORS_ORIGIN);
  const { userId } = authResult;
  const { rpId, expectedOrigin } = getRpInfo(request, env2);
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  const challengeRow = await env2.DB.prepare(
    "SELECT challenge, expires_at FROM webauthn_challenges WHERE user_id = ?"
  )
    .bind(userId)
    .first();
  if (!challengeRow || new Date(challengeRow.expires_at) < /* @__PURE__ */ new Date()) {
    console.error("[webauthn] challenge_expired: userId=", userId, "found=", !!challengeRow);
    return jsonResponse({ error: "challenge_expired" }, 400, origin, env2.CORS_ORIGIN);
  }
  console.log(
    "[webauthn] register/complete rpId:",
    rpId,
    "expectedOrigin:",
    expectedOrigin,
    "challenge:",
    challengeRow.challenge
  );
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body.credential,
      expectedChallenge: challengeRow.challenge,
      expectedOrigin,
      expectedRPID: rpId,
      requireUserVerification: false,
    });
  } catch (e) {
    console.error("[webauthn] verifyRegistrationResponse failed:", e);
    return jsonResponse(
      { error: "verification_failed", detail: String(e) },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  if (!verification.verified || !verification.registrationInfo) {
    return jsonResponse({ error: "verification_failed" }, 400, origin, env2.CORS_ORIGIN);
  }
  const { credential: cred } = verification.registrationInfo;
  const credentialId = typeof cred.id === "string" ? cred.id : uint8ArrayToBase64Url(cred.id);
  const publicKey = uint8ArrayToBase64Url(cred.publicKey);
  await env2.DB.prepare("DELETE FROM webauthn_challenges WHERE user_id = ?").bind(userId).run();
  const now = /* @__PURE__ */ new Date().toISOString();
  await env2.DB.prepare(
    `INSERT OR REPLACE INTO webauthn_credentials (id, user_id, public_key, counter, device_name, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(credentialId, userId, publicKey, cred.counter, body.deviceName ?? null, now)
    .run();
  return jsonResponse({ ok: true }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleRegisterComplete, "handleRegisterComplete");
async function handleAuthVerify(request, env2) {
  const origin = getOrigin(request);
  const { rpId, expectedOrigin } = getRpInfo(request, env2);
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  const { passkey_session, assertion } = body;
  const sessionPayload = await verifyJwt(passkey_session, env2.JWT_SECRET);
  if (!sessionPayload || sessionPayload["passkey_pending"] !== true) {
    return jsonResponse({ error: "Invalid session" }, 401, origin, env2.CORS_ORIGIN);
  }
  const userId = sessionPayload["sub"];
  const challenge = sessionPayload["challenge"];
  const plan = sessionPayload["plan"];
  const role = sessionPayload["role"];
  const challengeRow = await env2.DB.prepare(
    "SELECT user_id, expires_at FROM webauthn_challenges WHERE challenge = ?"
  )
    .bind(challenge)
    .first();
  if (
    !challengeRow ||
    challengeRow.user_id !== userId ||
    new Date(challengeRow.expires_at) < /* @__PURE__ */ new Date()
  ) {
    return jsonResponse({ error: "challenge_expired" }, 400, origin, env2.CORS_ORIGIN);
  }
  const credentialId = assertion.id;
  const credRow = await env2.DB.prepare(
    "SELECT public_key, counter FROM webauthn_credentials WHERE id = ? AND user_id = ?"
  )
    .bind(credentialId, userId)
    .first();
  if (!credRow) {
    return jsonResponse({ error: "credential_not_found" }, 404, origin, env2.CORS_ORIGIN);
  }
  const publicKeyBytes = base64UrlToUint8Array(credRow.public_key);
  console.log(
    "[webauthn] auth/verify rpId:",
    rpId,
    "expectedOrigin:",
    expectedOrigin,
    "credentialId:",
    credentialId,
    "counter:",
    credRow.counter
  );
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: assertion,
      expectedChallenge: challenge,
      expectedOrigin,
      expectedRPID: rpId,
      requireUserVerification: false,
      credential: {
        id: credentialId,
        publicKey: publicKeyBytes,
        counter: credRow.counter,
      },
    });
  } catch (e) {
    console.error("[webauthn] verifyAuthenticationResponse failed:", e);
    return jsonResponse(
      { error: "verification_failed", detail: String(e) },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  if (!verification.verified) {
    return jsonResponse({ error: "verification_failed" }, 400, origin, env2.CORS_ORIGIN);
  }
  await env2.DB.prepare("UPDATE webauthn_credentials SET counter = ? WHERE id = ? AND user_id = ?")
    .bind(verification.authenticationInfo.newCounter, credentialId, userId)
    .run();
  await env2.DB.prepare("DELETE FROM webauthn_challenges WHERE challenge = ?")
    .bind(challenge)
    .run();
  const accessToken = await signJwt({ sub: userId, plan, role }, env2.JWT_SECRET, ACCESS_TOKEN_TTL);
  const refreshToken = crypto.randomUUID();
  const refreshExpiry = new Date(
    Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1e3
  ).toISOString();
  await env2.DB.prepare(
    "INSERT INTO refresh_tokens (token, user_id, expires_at, revoked) VALUES (?, ?, ?, 0)"
  )
    .bind(refreshToken, userId, refreshExpiry)
    .run();
  return jsonResponse({ accessToken, refreshToken, plan, role }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleAuthVerify, "handleAuthVerify");
async function handleListCredentials(request, env2) {
  const origin = getOrigin(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) return corsify(authResult, origin, env2.CORS_ORIGIN);
  const proCheck = requirePro(authResult);
  if (proCheck) return corsify(proCheck, origin, env2.CORS_ORIGIN);
  const { userId } = authResult;
  const rows = await env2.DB.prepare(
    "SELECT id, device_name, created_at FROM webauthn_credentials WHERE user_id = ? ORDER BY created_at ASC"
  )
    .bind(userId)
    .all();
  return jsonResponse(
    {
      credentials: (rows.results ?? []).map((r) => ({
        id: r.id,
        deviceName: r.device_name ?? "",
        createdAt: r.created_at,
      })),
    },
    200,
    origin,
    env2.CORS_ORIGIN
  );
}
__name(handleListCredentials, "handleListCredentials");
async function handleDeleteCredential(request, env2, credentialId) {
  const origin = getOrigin(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) return corsify(authResult, origin, env2.CORS_ORIGIN);
  const proCheck = requirePro(authResult);
  if (proCheck) return corsify(proCheck, origin, env2.CORS_ORIGIN);
  const { userId } = authResult;
  await env2.DB.prepare("DELETE FROM webauthn_credentials WHERE id = ? AND user_id = ?")
    .bind(credentialId, userId)
    .run();
  return emptyResponse(204, origin, env2.CORS_ORIGIN);
}
__name(handleDeleteCredential, "handleDeleteCredential");
async function handleWebAuthn(request, env2, path) {
  const method = request.method;
  const origin = getOrigin(request);
  if (path === "/api/webauthn/register/begin" && method === "POST") {
    return handleRegisterBegin(request, env2);
  }
  if (path === "/api/webauthn/register/complete" && method === "POST") {
    return handleRegisterComplete(request, env2);
  }
  if (path === "/api/webauthn/auth/verify" && method === "POST") {
    return handleAuthVerify(request, env2);
  }
  if (path === "/api/webauthn/credentials" && method === "GET") {
    return handleListCredentials(request, env2);
  }
  const deleteMatch = path.match(/^\/api\/webauthn\/credentials\/(.+)$/);
  if (deleteMatch && method === "DELETE") {
    return handleDeleteCredential(request, env2, decodeURIComponent(deleteMatch[1]));
  }
  return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
}
__name(handleWebAuthn, "handleWebAuthn");
async function issuePasskeySession(userId, plan, role, salt, env2, request, origin) {
  const { rpId } = getRpInfo(request, env2);
  const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
  const challenge = uint8ArrayToBase64Url(challengeBytes);
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();
  await env2.DB.prepare("DELETE FROM webauthn_challenges WHERE user_id = ?").bind(userId).run();
  await env2.DB.prepare(
    "INSERT INTO webauthn_challenges (challenge, user_id, expires_at) VALUES (?, ?, ?)"
  )
    .bind(challenge, userId, expiresAt)
    .run();
  const credRows = await env2.DB.prepare("SELECT id FROM webauthn_credentials WHERE user_id = ?")
    .bind(userId)
    .all();
  const credentialIds = (credRows.results ?? []).map((r) => r.id);
  const passkeySession = await signJwt(
    { sub: userId, plan, role, passkey_pending: true, challenge, rpId },
    env2.JWT_SECRET,
    PASSKEY_SESSION_TTL
  );
  return jsonResponse(
    {
      requires_passkey: true,
      passkey_session: passkeySession,
      challenge,
      credential_ids: credentialIds,
      salt,
    },
    200,
    origin,
    env2.CORS_ORIGIN
  );
}
__name(issuePasskeySession, "issuePasskeySession");

// src/routes/auth.ts
var ACCESS_TOKEN_TTL2 = 15 * 60;
var REFRESH_TOKEN_TTL_DAYS2 = 30;
var LOGIN_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1e3;
var LOGIN_RATE_LIMIT_MAX = 5;
function getOrigin2(request) {
  return request.headers.get("Origin");
}
__name(getOrigin2, "getOrigin");
function getIp(request) {
  return request.headers.get("CF-Connecting-IP") ?? "unknown";
}
__name(getIp, "getIp");
async function hashIp(ip) {
  const enc = new TextEncoder();
  const digest2 = await crypto.subtle.digest("SHA-256", enc.encode(ip));
  return Array.from(new Uint8Array(digest2))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
__name(hashIp, "hashIp");
async function handleRegister(request, env2) {
  const origin = getOrigin2(request);
  if (env2.REGISTRATION_OPEN !== "true") {
    return jsonResponse({ error: "registration_closed" }, 403, origin, env2.CORS_ORIGIN);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  if (
    typeof body !== "object" ||
    body === null ||
    typeof body["email"] !== "string" ||
    typeof body["passwordHash"] !== "string" ||
    typeof body["salt"] !== "string"
  ) {
    return jsonResponse(
      { error: "email, passwordHash, salt are required" },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const { email, passwordHash, salt } = body;
  if (!email.includes("@") || email.length > 254) {
    return jsonResponse({ error: "Invalid email address" }, 400, origin, env2.CORS_ORIGIN);
  }
  const existing = await env2.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email.toLowerCase())
    .first();
  if (existing !== null) {
    return jsonResponse({ error: "Email already registered" }, 409, origin, env2.CORS_ORIGIN);
  }
  const userId = crypto.randomUUID();
  const now = /* @__PURE__ */ new Date().toISOString();
  await env2.DB.prepare(
    `INSERT INTO users (id, email, password_hash, salt, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(userId, email.toLowerCase(), passwordHash, salt, now, now)
    .run();
  return jsonResponse({ ok: true }, 201, origin, env2.CORS_ORIGIN);
}
__name(handleRegister, "handleRegister");
async function handleLogin(request, env2) {
  const origin = getOrigin2(request);
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  if (
    typeof body !== "object" ||
    body === null ||
    typeof body["email"] !== "string" ||
    typeof body["passwordHash"] !== "string"
  ) {
    return jsonResponse(
      { error: "email and passwordHash are required" },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const { email, passwordHash } = body;
  const windowStart = new Date(Date.now() - LOGIN_RATE_LIMIT_WINDOW_MS).toISOString();
  const attemptCount = await env2.DB.prepare(
    `SELECT COUNT(*) as cnt FROM login_attempts
     WHERE email = ? AND attempted_at > ?`
  )
    .bind(email.toLowerCase(), windowStart)
    .first();
  if (attemptCount !== null && attemptCount.cnt >= LOGIN_RATE_LIMIT_MAX) {
    return jsonResponse(
      { error: "Too many login attempts. Try again later." },
      429,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const user = await env2.DB.prepare(
    "SELECT id, password_hash, salt, plan, role FROM users WHERE email = ?"
  )
    .bind(email.toLowerCase())
    .first();
  const storedHash = user?.password_hash ?? "dummy-hash-for-timing-safety";
  const isValid = user !== null && timingSafeEqual(storedHash, passwordHash);
  if (!isValid) {
    const ip = getIp(request);
    const ipHash = await hashIp(ip);
    const now2 = /* @__PURE__ */ new Date().toISOString();
    await env2.DB.prepare(
      `INSERT INTO login_attempts (email, attempted_at, ip_hash) VALUES (?, ?, ?)`
    )
      .bind(email.toLowerCase(), now2, ipHash)
      .run();
    return jsonResponse({ error: "Invalid email or password" }, 401, origin, env2.CORS_ORIGIN);
  }
  const plan = user.plan ?? "free";
  const role = user.role ?? "user";
  const passkeyCount = await env2.DB.prepare(
    "SELECT COUNT(*) as cnt FROM webauthn_credentials WHERE user_id = ?"
  )
    .bind(user.id)
    .first();
  if (passkeyCount !== null && passkeyCount.cnt > 0) {
    return issuePasskeySession(user.id, plan, role, user.salt, env2, request, origin);
  }
  const accessToken = await signJwt(
    { sub: user.id, plan, role },
    env2.JWT_SECRET,
    ACCESS_TOKEN_TTL2
  );
  const refreshToken = crypto.randomUUID();
  const refreshExpiry = new Date(
    Date.now() + REFRESH_TOKEN_TTL_DAYS2 * 24 * 60 * 60 * 1e3
  ).toISOString();
  const now = /* @__PURE__ */ new Date().toISOString();
  await env2.DB.prepare(
    `INSERT INTO refresh_tokens (token, user_id, expires_at, revoked)
     VALUES (?, ?, ?, 0)`
  )
    .bind(refreshToken, user.id, refreshExpiry)
    .run();
  return jsonResponse(
    { accessToken, refreshToken, salt: user.salt, plan, role },
    200,
    origin,
    env2.CORS_ORIGIN
  );
}
__name(handleLogin, "handleLogin");
async function handleRefresh(request, env2) {
  const origin = getOrigin2(request);
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  if (typeof body !== "object" || body === null || typeof body["refreshToken"] !== "string") {
    return jsonResponse({ error: "refreshToken is required" }, 400, origin, env2.CORS_ORIGIN);
  }
  const { refreshToken } = body;
  const record = await env2.DB.prepare(
    `SELECT user_id, expires_at, revoked FROM refresh_tokens WHERE token = ?`
  )
    .bind(refreshToken)
    .first();
  if (record === null) {
    return jsonResponse({ error: "Invalid refresh token" }, 401, origin, env2.CORS_ORIGIN);
  }
  if (record.revoked === 1) {
    return jsonResponse({ error: "Refresh token has been revoked" }, 401, origin, env2.CORS_ORIGIN);
  }
  if (new Date(record.expires_at) < /* @__PURE__ */ new Date()) {
    return jsonResponse({ error: "Refresh token has expired" }, 401, origin, env2.CORS_ORIGIN);
  }
  await env2.DB.prepare(`UPDATE refresh_tokens SET revoked = 1 WHERE token = ?`)
    .bind(refreshToken)
    .run();
  const userRecord = await env2.DB.prepare("SELECT plan, role FROM users WHERE id = ?")
    .bind(record.user_id)
    .first();
  const plan = userRecord?.plan ?? "free";
  const role = userRecord?.role ?? "user";
  const newAccessToken = await signJwt(
    { sub: record.user_id, plan, role },
    env2.JWT_SECRET,
    ACCESS_TOKEN_TTL2
  );
  const newRefreshToken = crypto.randomUUID();
  const newExpiry = new Date(
    Date.now() + REFRESH_TOKEN_TTL_DAYS2 * 24 * 60 * 60 * 1e3
  ).toISOString();
  await env2.DB.prepare(
    `INSERT INTO refresh_tokens (token, user_id, expires_at, revoked)
     VALUES (?, ?, ?, 0)`
  )
    .bind(newRefreshToken, record.user_id, newExpiry)
    .run();
  return jsonResponse(
    { accessToken: newAccessToken, refreshToken: newRefreshToken, plan, role },
    200,
    origin,
    env2.CORS_ORIGIN
  );
}
__name(handleRefresh, "handleRefresh");
async function handleLogout(request, env2) {
  const origin = getOrigin2(request);
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  if (typeof body !== "object" || body === null || typeof body["refreshToken"] !== "string") {
    return jsonResponse({ error: "refreshToken is required" }, 400, origin, env2.CORS_ORIGIN);
  }
  const { refreshToken } = body;
  await env2.DB.prepare(`UPDATE refresh_tokens SET revoked = 1 WHERE token = ?`)
    .bind(refreshToken)
    .run();
  return emptyResponse(204, origin, env2.CORS_ORIGIN);
}
__name(handleLogout, "handleLogout");
async function handleDeleteAccount(request, env2) {
  const origin = getOrigin2(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(origin, env2.CORS_ORIGIN),
      },
    });
  }
  const { userId } = authResult;
  let cursor;
  do {
    const list = await env2.PHOTOS.list({
      prefix: `photos/${userId}/`,
      cursor,
    });
    for (const obj of list.objects) {
      await env2.PHOTOS.delete(obj.key);
    }
    cursor = list.truncated ? list.cursor : void 0;
  } while (cursor !== void 0);
  const stmts = [
    env2.DB.prepare(`DELETE FROM photos_sync WHERE user_id = ?`).bind(userId),
    env2.DB.prepare(`DELETE FROM pins_sync WHERE user_id = ?`).bind(userId),
    env2.DB.prepare(`DELETE FROM refresh_tokens WHERE user_id = ?`).bind(userId),
    env2.DB.prepare(
      `DELETE FROM login_attempts WHERE email = (SELECT email FROM users WHERE id = ?)`
    ).bind(userId),
    env2.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(userId),
  ];
  await env2.DB.batch(stmts);
  return emptyResponse(204, origin, env2.CORS_ORIGIN);
}
__name(handleDeleteAccount, "handleDeleteAccount");
async function handleRequestRegistration(request, env2) {
  const origin = getOrigin2(request);
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  if (
    typeof body !== "object" ||
    body === null ||
    typeof body["email"] !== "string" ||
    typeof body["passwordHash"] !== "string" ||
    typeof body["salt"] !== "string"
  ) {
    return jsonResponse(
      { error: "email, passwordHash, salt are required" },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const { email, passwordHash, salt } = body;
  if (!email.includes("@") || email.length > 254) {
    return jsonResponse({ error: "Invalid email address" }, 400, origin, env2.CORS_ORIGIN);
  }
  const existing = await env2.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email.toLowerCase())
    .first();
  if (existing !== null) {
    return jsonResponse({ error: "email_already_registered" }, 409, origin, env2.CORS_ORIGIN);
  }
  const pending = await env2.DB.prepare("SELECT id FROM registration_requests WHERE email = ?")
    .bind(email.toLowerCase())
    .first();
  if (pending !== null) {
    return jsonResponse({ error: "request_already_pending" }, 409, origin, env2.CORS_ORIGIN);
  }
  const id = crypto.randomUUID();
  await env2.DB.prepare(
    `INSERT INTO registration_requests (id, email, password_hash, salt) VALUES (?, ?, ?, ?)`
  )
    .bind(id, email.toLowerCase(), passwordHash, salt)
    .run();
  return jsonResponse({ ok: true }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleRequestRegistration, "handleRequestRegistration");
async function handleAuth(request, env2, path) {
  const method = request.method;
  const origin = getOrigin2(request);
  if (path === "/api/auth/register" && method === "POST") {
    return handleRegister(request, env2);
  }
  if (path === "/api/auth/request-registration" && method === "POST") {
    return handleRequestRegistration(request, env2);
  }
  if (path === "/api/auth/login" && method === "POST") {
    return handleLogin(request, env2);
  }
  if (path === "/api/auth/refresh" && method === "POST") {
    return handleRefresh(request, env2);
  }
  if (path === "/api/auth/logout" && method === "POST") {
    return handleLogout(request, env2);
  }
  if (path === "/api/account" && method === "DELETE") {
    return handleDeleteAccount(request, env2);
  }
  return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
}
__name(handleAuth, "handleAuth");
function timingSafeEqual(a, b) {
  if (a.length !== b.length) {
    let diff2 = 0;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      diff2 |= a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length);
    }
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
__name(timingSafeEqual, "timingSafeEqual");

// src/routes/pins.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/lib/hlc.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function computeServerHlc(clientPhysical, clientLogical) {
  const now = Date.now();
  const physical = Math.max(now, clientPhysical);
  let logical;
  if (clientPhysical === physical) {
    logical = clientLogical + 1;
  } else {
    logical = 0;
  }
  return { physical, logical };
}
__name(computeServerHlc, "computeServerHlc");

// src/routes/pins.ts
function getOrigin3(request) {
  return request.headers.get("Origin");
}
__name(getOrigin3, "getOrigin");
async function handleGetPinsSince(request, env2) {
  const origin = getOrigin3(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;
  const url = new URL(request.url);
  const physicalParam = url.searchParams.get("physical");
  const logicalParam = url.searchParams.get("logical");
  const physical = physicalParam !== null ? Number(physicalParam) : 0;
  const logical = logicalParam !== null ? Number(logicalParam) : 0;
  if (isNaN(physical) || isNaN(logical)) {
    return jsonResponse(
      { error: "physical and logical must be numbers" },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const rows = await env2.DB.prepare(
    `SELECT id, encrypted_payload, iv, hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at
     FROM pins_sync
     WHERE user_id = ?
       AND (hlc_physical > ? OR (hlc_physical = ? AND hlc_logical > ?))
     ORDER BY hlc_physical ASC, hlc_logical ASC
     LIMIT 1000`
  )
    .bind(userId, physical, physical, logical)
    .all();
  const pins = (rows.results ?? []).map((r) => ({
    id: r.id,
    encryptedPayload: r.encrypted_payload,
    iv: r.iv,
    hlcPhysical: r.hlc_physical,
    hlcLogical: r.hlc_logical,
    hlcNodeId: r.hlc_node_id,
    isDeleted: r.is_deleted === 1,
    createdAt: r.created_at,
  }));
  return jsonResponse({ pins }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleGetPinsSince, "handleGetPinsSince");
async function handlePutPin(request, env2, pinId) {
  const origin = getOrigin3(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body2 = await authResult.text();
    return new Response(body2, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  if (
    typeof body !== "object" ||
    body === null ||
    typeof body["encryptedPayload"] !== "string" ||
    typeof body["iv"] !== "string" ||
    typeof body["hlcPhysical"] !== "number" ||
    typeof body["hlcLogical"] !== "number" ||
    typeof body["hlcNodeId"] !== "string"
  ) {
    return jsonResponse(
      { error: "encryptedPayload, iv, hlcPhysical, hlcLogical, hlcNodeId are required" },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const { encryptedPayload, iv, hlcPhysical, hlcLogical, hlcNodeId, isDeleted = false } = body;
  const serverHlc = computeServerHlc(hlcPhysical, hlcLogical);
  const now = /* @__PURE__ */ new Date().toISOString();
  await env2.DB.prepare(
    `INSERT INTO pins_sync (id, user_id, encrypted_payload, iv, hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id, user_id) DO UPDATE SET
       encrypted_payload = excluded.encrypted_payload,
       iv = excluded.iv,
       hlc_physical = excluded.hlc_physical,
       hlc_logical = excluded.hlc_logical,
       hlc_node_id = excluded.hlc_node_id,
       is_deleted = excluded.is_deleted`
  )
    .bind(
      pinId,
      userId,
      encryptedPayload,
      iv,
      serverHlc.physical,
      serverHlc.logical,
      hlcNodeId,
      isDeleted ? 1 : 0,
      now
    )
    .run();
  return jsonResponse(
    { serverHlcPhysical: serverHlc.physical, serverHlcLogical: serverHlc.logical },
    200,
    origin,
    env2.CORS_ORIGIN
  );
}
__name(handlePutPin, "handlePutPin");
async function handleDeletePin(request, env2, pinId) {
  const origin = getOrigin3(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;
  const existing = await env2.DB.prepare(
    `SELECT hlc_physical, hlc_logical FROM pins_sync WHERE id = ? AND user_id = ?`
  )
    .bind(pinId, userId)
    .first();
  if (existing === null) {
    return jsonResponse({ error: "Pin not found" }, 404, origin, env2.CORS_ORIGIN);
  }
  const serverHlc = computeServerHlc(existing.hlc_physical, existing.hlc_logical);
  await env2.DB.prepare(
    `UPDATE pins_sync SET is_deleted = 1, hlc_physical = ?, hlc_logical = ? WHERE id = ? AND user_id = ?`
  )
    .bind(serverHlc.physical, serverHlc.logical, pinId, userId)
    .run();
  return emptyResponse(204, origin, env2.CORS_ORIGIN);
}
__name(handleDeletePin, "handleDeletePin");
async function handlePins(request, env2, path) {
  const method = request.method;
  const origin = getOrigin3(request);
  if (path === "/api/pins/since" && method === "GET") {
    return handleGetPinsSince(request, env2);
  }
  const pinIdMatch = path.match(/^\/api\/pins\/([^/]+)$/);
  if (pinIdMatch && pinIdMatch[1] !== void 0 && method === "PUT") {
    return handlePutPin(request, env2, pinIdMatch[1]);
  }
  if (pinIdMatch && pinIdMatch[1] !== void 0 && method === "DELETE") {
    return handleDeletePin(request, env2, pinIdMatch[1]);
  }
  return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
}
__name(handlePins, "handlePins");
function corsHeadersFrom(response) {
  const result = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("access-control-") || key.toLowerCase() === "vary") {
      result[key] = value;
    }
  });
  return result;
}
__name(corsHeadersFrom, "corsHeadersFrom");

// src/routes/photos.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getOrigin4(request) {
  return request.headers.get("Origin");
}
__name(getOrigin4, "getOrigin");
function corsHeadersFrom2(response) {
  const result = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("access-control-") || key.toLowerCase() === "vary") {
      result[key] = value;
    }
  });
  return result;
}
__name(corsHeadersFrom2, "corsHeadersFrom");
async function handleGetPhotoList(request, env2, pinId) {
  const origin = getOrigin4(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom2(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;
  const rows = await env2.DB.prepare(
    `SELECT id, pin_id, hlc_physical, hlc_logical, is_deleted, encrypted_meta, meta_iv
     FROM photos_sync
     WHERE user_id = ? AND pin_id = ? AND is_deleted = 0
     ORDER BY hlc_physical ASC, hlc_logical ASC`
  )
    .bind(userId, pinId)
    .all();
  const photos = (rows.results ?? []).map((r) => ({
    id: r.id,
    hlcPhysical: r.hlc_physical,
    hlcLogical: r.hlc_logical,
    isDeleted: r.is_deleted === 1,
    encryptedMeta: r.encrypted_meta,
    metaIv: r.meta_iv,
  }));
  return jsonResponse({ photos }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleGetPhotoList, "handleGetPhotoList");
async function handlePutPhoto(request, env2, photoId) {
  const origin = getOrigin4(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom2(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: "Invalid multipart/form-data" }, 400, origin, env2.CORS_ORIGIN);
  }
  const metaField = formData.get("meta");
  const blobField = formData.get("blob");
  if (typeof metaField !== "string") {
    return jsonResponse(
      { error: "meta field (JSON string) is required" },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  if (blobField === null || typeof blobField === "string") {
    return jsonResponse(
      { error: "blob field (binary) is required" },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const blobEntry = blobField;
  let meta;
  try {
    meta = JSON.parse(metaField);
  } catch {
    return jsonResponse({ error: "meta field must be valid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  if (
    typeof meta.encryptedMeta !== "string" ||
    typeof meta.metaIv !== "string" ||
    typeof meta.pinId !== "string" ||
    typeof meta.hlcPhysical !== "number" ||
    typeof meta.hlcLogical !== "number" ||
    typeof meta.hlcNodeId !== "string"
  ) {
    return jsonResponse(
      {
        error: "meta must contain encryptedMeta, metaIv, pinId, hlcPhysical, hlcLogical, hlcNodeId",
      },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const r2Key = `photos/${userId}/${photoId}.enc`;
  const blobArrayBuffer = await blobEntry.arrayBuffer();
  await env2.PHOTOS.put(r2Key, blobArrayBuffer);
  const now = /* @__PURE__ */ new Date().toISOString();
  await env2.DB.prepare(
    `INSERT INTO photos_sync (id, user_id, pin_id, encrypted_meta, meta_iv, r2_key, size_bytes, hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
     ON CONFLICT(id, user_id) DO UPDATE SET
       pin_id = excluded.pin_id,
       encrypted_meta = excluded.encrypted_meta,
       meta_iv = excluded.meta_iv,
       r2_key = excluded.r2_key,
       size_bytes = excluded.size_bytes,
       hlc_physical = excluded.hlc_physical,
       hlc_logical = excluded.hlc_logical,
       hlc_node_id = excluded.hlc_node_id,
       is_deleted = 0`
  )
    .bind(
      photoId,
      userId,
      meta.pinId,
      meta.encryptedMeta,
      meta.metaIv,
      r2Key,
      blobArrayBuffer.byteLength,
      meta.hlcPhysical,
      meta.hlcLogical,
      meta.hlcNodeId,
      now
    )
    .run();
  return jsonResponse({ ok: true }, 200, origin, env2.CORS_ORIGIN);
}
__name(handlePutPhoto, "handlePutPhoto");
async function handleGetPhoto(request, env2, photoId) {
  const origin = getOrigin4(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom2(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;
  const row = await env2.DB.prepare(
    `SELECT r2_key FROM photos_sync WHERE id = ? AND user_id = ? AND is_deleted = 0`
  )
    .bind(photoId, userId)
    .first();
  if (row === null) {
    return jsonResponse({ error: "Photo not found" }, 404, origin, env2.CORS_ORIGIN);
  }
  const r2Key = `photos/${userId}/${photoId}.enc`;
  const obj = await env2.PHOTOS.get(r2Key);
  if (obj === null) {
    return jsonResponse({ error: "Photo not found in storage" }, 404, origin, env2.CORS_ORIGIN);
  }
  const headers = {
    "Content-Type": "application/octet-stream",
    ...corsHeaders(origin, env2.CORS_ORIGIN),
  };
  if (obj.etag) {
    headers["ETag"] = obj.etag;
  }
  return new Response(obj.body, { status: 200, headers });
}
__name(handleGetPhoto, "handleGetPhoto");
async function handleDeletePhoto(request, env2, photoId) {
  const origin = getOrigin4(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom2(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;
  await env2.DB.prepare(`UPDATE photos_sync SET is_deleted = 1 WHERE id = ? AND user_id = ?`)
    .bind(photoId, userId)
    .run();
  const r2Key = `photos/${userId}/${photoId}.enc`;
  await env2.PHOTOS.delete(r2Key);
  return emptyResponse(204, origin, env2.CORS_ORIGIN);
}
__name(handleDeletePhoto, "handleDeletePhoto");
async function handlePhotos(request, env2, path) {
  const method = request.method;
  const origin = getOrigin4(request);
  const listMatch = path.match(/^\/api\/photos\/list\/([^/]+)$/);
  if (listMatch && listMatch[1] !== void 0 && method === "GET") {
    return handleGetPhotoList(request, env2, listMatch[1]);
  }
  const photoIdMatch = path.match(/^\/api\/photos\/([^/]+)$/);
  if (photoIdMatch && photoIdMatch[1] !== void 0) {
    if (method === "PUT") {
      return handlePutPhoto(request, env2, photoIdMatch[1]);
    }
    if (method === "GET") {
      return handleGetPhoto(request, env2, photoIdMatch[1]);
    }
    if (method === "DELETE") {
      return handleDeletePhoto(request, env2, photoIdMatch[1]);
    }
  }
  return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
}
__name(handlePhotos, "handlePhotos");

// src/routes/admin.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getOrigin5(request) {
  return request.headers.get("Origin");
}
__name(getOrigin5, "getOrigin");
function corsHeadersFrom3(response) {
  const result = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("access-control-") || key.toLowerCase() === "vary") {
      result[key] = value;
    }
  });
  return result;
}
__name(corsHeadersFrom3, "corsHeadersFrom");
async function handleListUsers(request, env2) {
  const origin = getOrigin5(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom3(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 200);
  const offset = Number(url.searchParams.get("offset") ?? "0");
  const rows = q
    ? await env2.DB.prepare(
        `SELECT id, email, plan, role, created_at, updated_at
         FROM users
         WHERE email LIKE ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
        .bind(`%${q}%`, limit, offset)
        .all()
    : await env2.DB.prepare(
        `SELECT id, email, plan, role, created_at, updated_at
         FROM users
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
        .bind(limit, offset)
        .all();
  const countRow = q
    ? await env2.DB.prepare(`SELECT COUNT(*) as cnt FROM users WHERE email LIKE ?`)
        .bind(`%${q}%`)
        .first()
    : await env2.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first();
  const users = (rows.results ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    plan: r.plan,
    role: r.role,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
  return jsonResponse(
    { users, total: countRow?.cnt ?? 0, limit, offset },
    200,
    origin,
    env2.CORS_ORIGIN
  );
}
__name(handleListUsers, "handleListUsers");
async function handleUpdateUser(request, env2, userId) {
  const origin = getOrigin5(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body2 = await authResult.text();
    return new Response(body2, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom3(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  const { plan } = body;
  if (plan !== void 0 && plan !== "free" && plan !== "pro") {
    return jsonResponse({ error: "plan must be 'free' or 'pro'" }, 400, origin, env2.CORS_ORIGIN);
  }
  if (plan === void 0) {
    return jsonResponse({ error: "No updatable fields provided" }, 400, origin, env2.CORS_ORIGIN);
  }
  const now = /* @__PURE__ */ new Date().toISOString();
  const result = await env2.DB.prepare(`UPDATE users SET plan = ?, updated_at = ? WHERE id = ?`)
    .bind(plan, now, userId)
    .run();
  if (result.meta.changes === 0) {
    return jsonResponse({ error: "User not found" }, 404, origin, env2.CORS_ORIGIN);
  }
  return jsonResponse({ ok: true, plan }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleUpdateUser, "handleUpdateUser");
async function handleListRegistrations(request, env2) {
  const origin = getOrigin5(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom3(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;
  const rows = await env2.DB.prepare(
    `SELECT id, email, requested_at FROM registration_requests ORDER BY requested_at DESC`
  ).all();
  const requests = (rows.results ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    requestedAt: r.requested_at,
  }));
  return jsonResponse({ requests }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleListRegistrations, "handleListRegistrations");
async function handleApproveRegistration(request, env2, requestId) {
  const origin = getOrigin5(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom3(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;
  const reg = await env2.DB.prepare(
    `SELECT id, email, password_hash, salt FROM registration_requests WHERE id = ?`
  )
    .bind(requestId)
    .first();
  if (reg === null) {
    return jsonResponse({ error: "Request not found" }, 404, origin, env2.CORS_ORIGIN);
  }
  const existingUser = await env2.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(reg.email)
    .first();
  if (existingUser !== null) {
    await env2.DB.prepare(`DELETE FROM registration_requests WHERE id = ?`).bind(requestId).run();
    return jsonResponse({ ok: true }, 200, origin, env2.CORS_ORIGIN);
  }
  const userId = crypto.randomUUID();
  const now = /* @__PURE__ */ new Date().toISOString();
  await env2.DB.batch([
    env2.DB.prepare(
      `INSERT INTO users (id, email, password_hash, salt, plan, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'pro', 'user', ?, ?)`
    ).bind(userId, reg.email, reg.password_hash, reg.salt, now, now),
    env2.DB.prepare(`DELETE FROM registration_requests WHERE id = ?`).bind(requestId),
  ]);
  return jsonResponse({ ok: true }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleApproveRegistration, "handleApproveRegistration");
async function handleRejectRegistration(request, env2, requestId) {
  const origin = getOrigin5(request);
  const authResult = await requireAuth(request, env2);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom3(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;
  await env2.DB.prepare(`DELETE FROM registration_requests WHERE id = ?`).bind(requestId).run();
  return jsonResponse({ ok: true }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleRejectRegistration, "handleRejectRegistration");
async function handleAdmin(request, env2, path) {
  const method = request.method;
  const origin = getOrigin5(request);
  if (path === "/api/admin/users" && method === "GET") {
    return handleListUsers(request, env2);
  }
  const userIdMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (userIdMatch && userIdMatch[1] !== void 0 && method === "PATCH") {
    return handleUpdateUser(request, env2, userIdMatch[1]);
  }
  if (path === "/api/admin/registrations" && method === "GET") {
    return handleListRegistrations(request, env2);
  }
  const approveMatch = path.match(/^\/api\/admin\/registrations\/([^/]+)\/approve$/);
  if (approveMatch && approveMatch[1] !== void 0 && method === "POST") {
    return handleApproveRegistration(request, env2, approveMatch[1]);
  }
  const rejectMatch = path.match(/^\/api\/admin\/registrations\/([^/]+)$/);
  if (rejectMatch && rejectMatch[1] !== void 0 && method === "DELETE") {
    return handleRejectRegistration(request, env2, rejectMatch[1]);
  }
  return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
}
__name(handleAdmin, "handleAdmin");

// src/routes/keys.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function handleKeys(request, env2, path) {
  const origin = request.headers.get("Origin");
  if (request.method === "PUT" && path === "/api/keys/public") {
    const auth = await requireAuth(request, env2);
    if (auth instanceof Response) return auth;
    const denied = requirePro(auth);
    if (denied) return denied;
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
    }
    const { publicKey, fingerprint, wrappedPrivateKey, wrappedPrivateKeyIv } = body;
    if (
      typeof publicKey !== "string" ||
      typeof fingerprint !== "string" ||
      typeof wrappedPrivateKey !== "string" ||
      typeof wrappedPrivateKeyIv !== "string"
    ) {
      return jsonResponse(
        { error: "publicKey, fingerprint, wrappedPrivateKey, wrappedPrivateKeyIv are required" },
        400,
        origin,
        env2.CORS_ORIGIN
      );
    }
    const now = /* @__PURE__ */ new Date().toISOString();
    await env2.DB.prepare(
      `INSERT INTO user_public_keys
         (user_id, public_key, fingerprint, wrapped_private_key, wrapped_private_key_iv, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         public_key = excluded.public_key,
         fingerprint = excluded.fingerprint,
         wrapped_private_key = excluded.wrapped_private_key,
         wrapped_private_key_iv = excluded.wrapped_private_key_iv,
         updated_at = excluded.updated_at`
    )
      .bind(auth.userId, publicKey, fingerprint, wrappedPrivateKey, wrappedPrivateKeyIv, now, now)
      .run();
    return emptyResponse(204, origin, env2.CORS_ORIGIN);
  }
  if (request.method === "GET" && path === "/api/keys/private-backup") {
    const auth = await requireAuth(request, env2);
    if (auth instanceof Response) return auth;
    const row = await env2.DB.prepare(
      `SELECT wrapped_private_key, wrapped_private_key_iv FROM user_public_keys WHERE user_id = ?`
    )
      .bind(auth.userId)
      .first();
    if (!row || !row.wrapped_private_key || !row.wrapped_private_key_iv) {
      return jsonResponse({ error: "not_found" }, 404, origin, env2.CORS_ORIGIN);
    }
    return jsonResponse(
      {
        wrappedPrivateKey: row.wrapped_private_key,
        wrappedPrivateKeyIv: row.wrapped_private_key_iv,
      },
      200,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const publicKeyMatch = path.match(/^\/api\/keys\/public\/([^/]+)$/);
  if (request.method === "GET" && publicKeyMatch) {
    const auth = await requireAuth(request, env2);
    if (auth instanceof Response) return auth;
    const denied = requirePro(auth);
    if (denied) return denied;
    const rawId = publicKeyMatch[1];
    const targetUserId = rawId === "me" ? auth.userId : rawId;
    const row = await env2.DB.prepare(
      `SELECT public_key, fingerprint FROM user_public_keys WHERE user_id = ?`
    )
      .bind(targetUserId)
      .first();
    if (!row) {
      return jsonResponse({ error: "not_found" }, 404, origin, env2.CORS_ORIGIN);
    }
    return jsonResponse(
      { publicKey: row.public_key, fingerprint: row.fingerprint },
      200,
      origin,
      env2.CORS_ORIGIN
    );
  }
  return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
}
__name(handleKeys, "handleKeys");

// src/routes/groups.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/middleware/group-auth.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function requireGroupMember(request, env2, groupId) {
  const auth = await requireAuth(request, env2);
  if (auth instanceof Response) return auth;
  const proErr = requirePro(auth);
  if (proErr) return proErr;
  const membership = await env2.DB.prepare(
    `SELECT role FROM group_memberships
     WHERE group_id = ? AND user_id = ? AND status = 'active'`
  )
    .bind(groupId, auth.userId)
    .first();
  if (!membership) {
    return new Response(JSON.stringify({ error: "not_a_member" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return { ...auth, groupId, groupRole: membership.role };
}
__name(requireGroupMember, "requireGroupMember");

// src/routes/groups.ts
var INVITE_TTL_DAYS = 7;
var MAX_SEATS_DEFAULT = 5;
function getOrigin6(r) {
  return r.headers.get("Origin");
}
__name(getOrigin6, "getOrigin");
async function handleGroups(request, env2, path) {
  const origin = getOrigin6(request);
  const acceptMatch = path.match(/^\/api\/groups\/invites\/([^/]+)\/accept$/);
  if (request.method === "POST" && acceptMatch) {
    return handleAcceptInvite(request, env2, acceptMatch[1]);
  }
  if (request.method === "POST" && path === "/api/groups") {
    const auth = await requireAuth(request, env2);
    if (auth instanceof Response) return auth;
    const famErr = requireFamilyOwner(auth);
    if (famErr) return famErr;
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
    }
    const { encryptedName, nameIv, wrappedGroupKey } = body;
    if (
      typeof encryptedName !== "string" ||
      typeof nameIv !== "string" ||
      typeof wrappedGroupKey !== "string"
    ) {
      return jsonResponse(
        { error: "encryptedName, nameIv, wrappedGroupKey required" },
        400,
        origin,
        env2.CORS_ORIGIN
      );
    }
    const groupId2 = crypto.randomUUID();
    const now = /* @__PURE__ */ new Date().toISOString();
    await env2.DB.batch([
      env2.DB.prepare(
        `INSERT INTO family_groups (id, encrypted_name, name_iv, owner_id, key_version, max_seats, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?, ?)`
      ).bind(groupId2, encryptedName, nameIv, auth.userId, MAX_SEATS_DEFAULT, now, now),
      env2.DB.prepare(
        `INSERT INTO group_memberships (group_id, user_id, role, status, joined_at)
         VALUES (?, ?, 'owner', 'active', ?)`
      ).bind(groupId2, auth.userId, now),
      env2.DB.prepare(
        `INSERT INTO group_member_keys (group_id, user_id, key_version, wrapped_group_key, created_at)
         VALUES (?, ?, 1, ?, ?)`
      ).bind(groupId2, auth.userId, wrappedGroupKey, now),
    ]);
    return jsonResponse({ groupId: groupId2 }, 201, origin, env2.CORS_ORIGIN);
  }
  if (request.method === "GET" && path === "/api/groups") {
    const auth = await requireAuth(request, env2);
    if (auth instanceof Response) return auth;
    const proErr = requirePro(auth);
    if (proErr) return proErr;
    const rows = await env2.DB.prepare(
      `SELECT g.id, g.encrypted_name, g.name_iv, g.key_version, g.max_seats,
              m.role, m.status
       FROM family_groups g
       JOIN group_memberships m ON m.group_id = g.id
       WHERE m.user_id = ? AND m.status = 'active'
       ORDER BY g.created_at DESC`
    )
      .bind(auth.userId)
      .all();
    const groups = (rows.results ?? []).map((r) => ({
      id: r.id,
      encryptedName: r.encrypted_name,
      nameIv: r.name_iv,
      keyVersion: r.key_version,
      maxSeats: r.max_seats,
      role: r.role,
    }));
    return jsonResponse({ groups }, 200, origin, env2.CORS_ORIGIN);
  }
  const groupMatch = path.match(/^\/api\/groups\/([^/]+)(\/.*)?$/);
  if (!groupMatch) return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
  const groupId = groupMatch[1];
  const sub = groupMatch[2] ?? "";
  const memberRevoke = sub.match(/^\/members\/([^/]+)$/);
  if (request.method === "DELETE" && memberRevoke) {
    const targetUserId = memberRevoke[1];
    return handleRevokeMember(request, env2, groupId, targetUserId, origin);
  }
  if (request.method === "GET" && sub === "/active-keys") {
    const auth = await requireGroupMember(request, env2, groupId);
    if (auth instanceof Response) return auth;
    const rows = await env2.DB.prepare(
      `SELECT m.user_id, pk.public_key, pk.fingerprint
       FROM group_memberships m
       JOIN user_public_keys pk ON pk.user_id = m.user_id
       WHERE m.group_id = ? AND m.status = 'active'`
    )
      .bind(groupId)
      .all();
    const keys = (rows.results ?? []).map((r) => ({
      userId: r.user_id,
      publicKey: r.public_key,
      fingerprint: r.fingerprint,
    }));
    return jsonResponse({ keys }, 200, origin, env2.CORS_ORIGIN);
  }
  if (request.method === "POST" && sub === "/rotate-key") {
    return handleRotateKey(request, env2, groupId, origin);
  }
  if (request.method === "POST" && sub === "/invites") {
    const auth = await requireGroupMember(request, env2, groupId);
    if (auth instanceof Response) return auth;
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
    }
    const { inviteeEmail } = body;
    if (typeof inviteeEmail !== "string" || !inviteeEmail.includes("@")) {
      return jsonResponse({ error: "inviteeEmail required" }, 400, origin, env2.CORS_ORIGIN);
    }
    const group3 = await env2.DB.prepare(`SELECT max_seats FROM family_groups WHERE id = ?`)
      .bind(groupId)
      .first();
    const activeCount = await env2.DB.prepare(
      `SELECT COUNT(*) as cnt FROM group_memberships WHERE group_id = ? AND status != 'pending_key'`
    )
      .bind(groupId)
      .first();
    if (group3 && activeCount && activeCount.cnt >= group3.max_seats) {
      return jsonResponse({ error: "seat_limit_reached" }, 422, origin, env2.CORS_ORIGIN);
    }
    const token = crypto.randomUUID();
    const now = /* @__PURE__ */ new Date().toISOString();
    const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 864e5).toISOString();
    await env2.DB.prepare(
      `INSERT INTO group_invites (token, group_id, invitee_email, invited_by, status, created_at, expires_at)
       VALUES (?, ?, ?, ?, 'pending', ?, ?)`
    )
      .bind(token, groupId, inviteeEmail, auth.userId, now, expiresAt)
      .run();
    return jsonResponse({ token }, 201, origin, env2.CORS_ORIGIN);
  }
  if (request.method === "GET" && sub === "/members") {
    const auth = await requireGroupMember(request, env2, groupId);
    if (auth instanceof Response) return auth;
    const rows = await env2.DB.prepare(
      `SELECT m.user_id, m.role, m.status, m.joined_at,
              u.email, pk.fingerprint
       FROM group_memberships m
       JOIN users u ON u.id = m.user_id
       LEFT JOIN user_public_keys pk ON pk.user_id = m.user_id
       WHERE m.group_id = ?
       ORDER BY m.joined_at ASC`
    )
      .bind(groupId)
      .all();
    const members = (rows.results ?? []).map((r) => ({
      userId: r.user_id,
      role: r.role,
      status: r.status,
      joinedAt: r.joined_at,
      email: r.email,
      fingerprint: r.fingerprint,
    }));
    return jsonResponse({ members }, 200, origin, env2.CORS_ORIGIN);
  }
  if (request.method === "GET" && sub === "/pending-keys") {
    const auth = await requireGroupMember(request, env2, groupId);
    if (auth instanceof Response) return auth;
    const rows = await env2.DB.prepare(
      `SELECT m.user_id, pk.public_key, pk.fingerprint
       FROM group_memberships m
       JOIN user_public_keys pk ON pk.user_id = m.user_id
       WHERE m.group_id = ? AND m.status = 'pending_key'`
    )
      .bind(groupId)
      .all();
    const pending = (rows.results ?? []).map((r) => ({
      userId: r.user_id,
      publicKey: r.public_key,
      fingerprint: r.fingerprint,
    }));
    return jsonResponse({ pending }, 200, origin, env2.CORS_ORIGIN);
  }
  if (request.method === "POST" && sub === "/member-keys") {
    const auth = await requireGroupMember(request, env2, groupId);
    if (auth instanceof Response) return auth;
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
    }
    const { userId: targetUserId, wrappedGroupKey } = body;
    if (typeof targetUserId !== "string" || typeof wrappedGroupKey !== "string") {
      return jsonResponse(
        { error: "userId, wrappedGroupKey required" },
        400,
        origin,
        env2.CORS_ORIGIN
      );
    }
    const membership = await env2.DB.prepare(
      `SELECT status FROM group_memberships WHERE group_id = ? AND user_id = ?`
    )
      .bind(groupId, targetUserId)
      .first();
    if (!membership || membership.status !== "pending_key") {
      return jsonResponse({ error: "member_not_pending" }, 422, origin, env2.CORS_ORIGIN);
    }
    const group3 = await env2.DB.prepare(
      `SELECT key_version, owner_id FROM family_groups WHERE id = ?`
    )
      .bind(groupId)
      .first();
    if (!group3) return jsonResponse({ error: "group_not_found" }, 404, origin, env2.CORS_ORIGIN);
    const now = /* @__PURE__ */ new Date().toISOString();
    await env2.DB.batch([
      env2.DB.prepare(
        `INSERT OR REPLACE INTO group_member_keys (group_id, user_id, key_version, wrapped_group_key, created_at)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(groupId, targetUserId, group3.key_version, wrappedGroupKey, now),
      // メンバーを active 化
      env2.DB.prepare(
        `UPDATE group_memberships SET status = 'active' WHERE group_id = ? AND user_id = ?`
      ).bind(groupId, targetUserId),
      // 席付与（オーナーから被招待者へ）
      env2.DB.prepare(
        `INSERT OR IGNORE INTO family_seats (owner_user_id, member_user_id, granted_at)
         VALUES (?, ?, ?)`
      ).bind(group3.owner_id, targetUserId, now),
    ]);
    return emptyResponse(204, origin, env2.CORS_ORIGIN);
  }
  if (request.method === "GET" && sub === "/my-key") {
    const auth = await requireGroupMember(request, env2, groupId);
    if (auth instanceof Response) return auth;
    const group3 = await env2.DB.prepare(`SELECT key_version FROM family_groups WHERE id = ?`)
      .bind(groupId)
      .first();
    if (!group3) return jsonResponse({ error: "group_not_found" }, 404, origin, env2.CORS_ORIGIN);
    const keyRow = await env2.DB.prepare(
      `SELECT wrapped_group_key FROM group_member_keys
       WHERE group_id = ? AND user_id = ? AND key_version = ?`
    )
      .bind(groupId, auth.userId, group3.key_version)
      .first();
    if (!keyRow) return jsonResponse({ error: "not_found" }, 404, origin, env2.CORS_ORIGIN);
    return jsonResponse(
      { wrappedGroupKey: keyRow.wrapped_group_key, keyVersion: group3.key_version },
      200,
      origin,
      env2.CORS_ORIGIN
    );
  }
  return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
}
__name(handleGroups, "handleGroups");
async function handleRevokeMember(request, env2, groupId, targetUserId, origin) {
  const auth = await requireAuth(request, env2);
  if (auth instanceof Response) return auth;
  const proErr = requirePro(auth);
  if (proErr) return proErr;
  const requestorMembership = await env2.DB.prepare(
    `SELECT role FROM group_memberships WHERE group_id = ? AND user_id = ? AND status = 'active'`
  )
    .bind(groupId, auth.userId)
    .first();
  if (!requestorMembership) {
    return jsonResponse({ error: "not_a_member" }, 403, origin, env2.CORS_ORIGIN);
  }
  if (auth.userId !== targetUserId && requestorMembership.role !== "owner") {
    return jsonResponse({ error: "forbidden" }, 403, origin, env2.CORS_ORIGIN);
  }
  if (auth.userId === targetUserId && requestorMembership.role === "owner") {
    return jsonResponse({ error: "owner_cannot_leave" }, 422, origin, env2.CORS_ORIGIN);
  }
  const group3 = await env2.DB.prepare(`SELECT owner_id FROM family_groups WHERE id = ?`)
    .bind(groupId)
    .first();
  if (!group3) return jsonResponse({ error: "group_not_found" }, 404, origin, env2.CORS_ORIGIN);
  await env2.DB.batch([
    env2.DB.prepare(`DELETE FROM group_memberships WHERE group_id = ? AND user_id = ?`).bind(
      groupId,
      targetUserId
    ),
    env2.DB.prepare(`DELETE FROM group_member_keys WHERE group_id = ? AND user_id = ?`).bind(
      groupId,
      targetUserId
    ),
    // Pro 相当席を剥奪（被招待者のみ。オーナー自身の席はない）
    env2.DB.prepare(`DELETE FROM family_seats WHERE owner_user_id = ? AND member_user_id = ?`).bind(
      group3.owner_id,
      targetUserId
    ),
  ]);
  return emptyResponse(204, origin, env2.CORS_ORIGIN);
}
__name(handleRevokeMember, "handleRevokeMember");
async function handleRotateKey(request, env2, groupId, origin) {
  const auth = await requireAuth(request, env2);
  if (auth instanceof Response) return auth;
  const proErr = requirePro(auth);
  if (proErr) return proErr;
  const membership = await env2.DB.prepare(
    `SELECT role FROM group_memberships WHERE group_id = ? AND user_id = ? AND status = 'active'`
  )
    .bind(groupId, auth.userId)
    .first();
  if (!membership || membership.role !== "owner") {
    return jsonResponse({ error: "forbidden" }, 403, origin, env2.CORS_ORIGIN);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  const { newKeyVersion, wrappedKeys } = body;
  if (
    typeof newKeyVersion !== "number" ||
    !Array.isArray(wrappedKeys) ||
    wrappedKeys.some((k) => typeof k.userId !== "string" || typeof k.wrappedGroupKey !== "string")
  ) {
    return jsonResponse(
      { error: "newKeyVersion (number) and wrappedKeys (array) required" },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const group3 = await env2.DB.prepare(`SELECT key_version FROM family_groups WHERE id = ?`)
    .bind(groupId)
    .first();
  if (!group3) return jsonResponse({ error: "group_not_found" }, 404, origin, env2.CORS_ORIGIN);
  if (newKeyVersion !== group3.key_version + 1) {
    return jsonResponse({ error: "invalid_key_version" }, 422, origin, env2.CORS_ORIGIN);
  }
  const now = /* @__PURE__ */ new Date().toISOString();
  const statements = [
    env2.DB.prepare(`UPDATE family_groups SET key_version = ? WHERE id = ?`).bind(
      newKeyVersion,
      groupId
    ),
    ...wrappedKeys.map((k) =>
      env2.DB.prepare(
        `INSERT OR REPLACE INTO group_member_keys (group_id, user_id, key_version, wrapped_group_key, created_at)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(groupId, k.userId, newKeyVersion, k.wrappedGroupKey, now)
    ),
  ];
  await env2.DB.batch(statements);
  return jsonResponse({ keyVersion: newKeyVersion }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleRotateKey, "handleRotateKey");
async function handleAcceptInvite(request, env2, token) {
  const origin = request.headers.get("Origin");
  const auth = await requireAuth(request, env2);
  if (auth instanceof Response) return auth;
  const proErr = requirePro(auth);
  if (proErr) return proErr;
  const invite = await env2.DB.prepare(
    `SELECT group_id, invitee_email, status, expires_at FROM group_invites WHERE token = ?`
  )
    .bind(token)
    .first();
  if (!invite) return jsonResponse({ error: "invite_not_found" }, 404, origin, env2.CORS_ORIGIN);
  if (invite.status !== "pending") {
    return jsonResponse({ error: "invite_already_used" }, 422, origin, env2.CORS_ORIGIN);
  }
  if (new Date(invite.expires_at) < /* @__PURE__ */ new Date()) {
    return jsonResponse({ error: "invite_expired" }, 422, origin, env2.CORS_ORIGIN);
  }
  const hasPubKey = await env2.DB.prepare(`SELECT 1 FROM user_public_keys WHERE user_id = ?`)
    .bind(auth.userId)
    .first();
  if (!hasPubKey) {
    return jsonResponse({ error: "public_key_not_registered" }, 422, origin, env2.CORS_ORIGIN);
  }
  const existing = await env2.DB.prepare(
    `SELECT status FROM group_memberships WHERE group_id = ? AND user_id = ?`
  )
    .bind(invite.group_id, auth.userId)
    .first();
  if (existing) {
    return jsonResponse({ error: "already_a_member" }, 422, origin, env2.CORS_ORIGIN);
  }
  const now = /* @__PURE__ */ new Date().toISOString();
  await env2.DB.batch([
    env2.DB.prepare(
      `INSERT INTO group_memberships (group_id, user_id, role, status, joined_at)
       VALUES (?, ?, 'member', 'pending_key', ?)`
    ).bind(invite.group_id, auth.userId, now),
    env2.DB.prepare(`UPDATE group_invites SET status = 'accepted' WHERE token = ?`).bind(token),
  ]);
  return jsonResponse({ groupId: invite.group_id }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleAcceptInvite, "handleAcceptInvite");

// src/routes/group-pins.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getOrigin7(r) {
  return r.headers.get("Origin");
}
__name(getOrigin7, "getOrigin");
async function handleGroupPins(request, env2, groupId, subPath) {
  const origin = getOrigin7(request);
  if (request.method === "GET" && subPath === "/pins/since") {
    const auth = await requireGroupMember(request, env2, groupId);
    if (auth instanceof Response) return auth;
    const url = new URL(request.url);
    const physical = Number(url.searchParams.get("physical") ?? "0");
    const logical = Number(url.searchParams.get("logical") ?? "0");
    if (isNaN(physical) || isNaN(logical)) {
      return jsonResponse(
        { error: "physical and logical must be numbers" },
        400,
        origin,
        env2.CORS_ORIGIN
      );
    }
    const rows = await env2.DB.prepare(
      `SELECT id, author_id, key_version, encrypted_payload, iv,
              hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at
       FROM group_pins_sync
       WHERE group_id = ?
         AND (hlc_physical > ? OR (hlc_physical = ? AND hlc_logical > ?))
       ORDER BY hlc_physical ASC, hlc_logical ASC
       LIMIT 1000`
    )
      .bind(groupId, physical, physical, logical)
      .all();
    const pins = (rows.results ?? []).map((r) => ({
      id: r.id,
      authorId: r.author_id,
      keyVersion: r.key_version,
      encryptedPayload: r.encrypted_payload,
      iv: r.iv,
      hlcPhysical: r.hlc_physical,
      hlcLogical: r.hlc_logical,
      hlcNodeId: r.hlc_node_id,
      isDeleted: r.is_deleted === 1,
      createdAt: r.created_at,
    }));
    return jsonResponse({ pins }, 200, origin, env2.CORS_ORIGIN);
  }
  const pinPutMatch = subPath.match(/^\/pins\/([^/]+)$/);
  if (request.method === "PUT" && pinPutMatch) {
    const pinId = pinPutMatch[1];
    const auth = await requireGroupMember(request, env2, groupId);
    if (auth instanceof Response) return auth;
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env2.CORS_ORIGIN);
    }
    const { encryptedPayload, iv, hlcPhysical, hlcLogical, hlcNodeId, isDeleted, keyVersion } =
      body;
    if (
      typeof encryptedPayload !== "string" ||
      typeof iv !== "string" ||
      typeof hlcPhysical !== "number" ||
      typeof hlcLogical !== "number" ||
      typeof hlcNodeId !== "string" ||
      typeof keyVersion !== "number"
    ) {
      return jsonResponse({ error: "Invalid body" }, 400, origin, env2.CORS_ORIGIN);
    }
    const group3 = await env2.DB.prepare(`SELECT key_version FROM family_groups WHERE id = ?`)
      .bind(groupId)
      .first();
    if (!group3) return jsonResponse({ error: "group_not_found" }, 404, origin, env2.CORS_ORIGIN);
    const serverHlc = computeServerHlc(hlcPhysical, hlcLogical);
    const now = /* @__PURE__ */ new Date().toISOString();
    await env2.DB.prepare(
      `INSERT INTO group_pins_sync
         (id, group_id, author_id, key_version, encrypted_payload, iv,
          hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id, group_id) DO UPDATE SET
         author_id = excluded.author_id,
         key_version = excluded.key_version,
         encrypted_payload = excluded.encrypted_payload,
         iv = excluded.iv,
         hlc_physical = excluded.hlc_physical,
         hlc_logical = excluded.hlc_logical,
         hlc_node_id = excluded.hlc_node_id,
         is_deleted = excluded.is_deleted`
    )
      .bind(
        pinId,
        groupId,
        auth.userId,
        keyVersion,
        encryptedPayload,
        iv,
        serverHlc.physical,
        serverHlc.logical,
        hlcNodeId,
        isDeleted ? 1 : 0,
        now
      )
      .run();
    return jsonResponse(
      { hlcPhysical: serverHlc.physical, hlcLogical: serverHlc.logical },
      200,
      origin,
      env2.CORS_ORIGIN
    );
  }
  const pinDelMatch = subPath.match(/^\/pins\/([^/]+)$/);
  if (request.method === "DELETE" && pinDelMatch) {
    const pinId = pinDelMatch[1];
    const auth = await requireGroupMember(request, env2, groupId);
    if (auth instanceof Response) return auth;
    const existing = await env2.DB.prepare(
      `SELECT author_id FROM group_pins_sync WHERE id = ? AND group_id = ?`
    )
      .bind(pinId, groupId)
      .first();
    if (!existing) return jsonResponse({ error: "not_found" }, 404, origin, env2.CORS_ORIGIN);
    if (existing.author_id !== auth.userId && auth.groupRole !== "owner") {
      return jsonResponse({ error: "forbidden" }, 403, origin, env2.CORS_ORIGIN);
    }
    await env2.DB.prepare(`UPDATE group_pins_sync SET is_deleted = 1 WHERE id = ? AND group_id = ?`)
      .bind(pinId, groupId)
      .run();
    return emptyResponse(204, origin, env2.CORS_ORIGIN);
  }
  return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
}
__name(handleGroupPins, "handleGroupPins");

// src/routes/group-photos.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getOrigin8(request) {
  return request.headers.get("Origin");
}
__name(getOrigin8, "getOrigin");
async function handleGetPhotoList2(request, env2, groupId, pinId) {
  const origin = getOrigin8(request);
  const auth = await requireGroupMember(request, env2, groupId);
  if (auth instanceof Response) return auth;
  const rows = await env2.DB.prepare(
    `SELECT id, pin_id, hlc_physical, hlc_logical, is_deleted, encrypted_meta, meta_iv, key_version
     FROM group_photos_sync
     WHERE group_id = ? AND pin_id = ? AND is_deleted = 0
     ORDER BY hlc_physical ASC, hlc_logical ASC`
  )
    .bind(groupId, pinId)
    .all();
  const photos = (rows.results ?? []).map((r) => ({
    id: r.id,
    hlcPhysical: r.hlc_physical,
    hlcLogical: r.hlc_logical,
    isDeleted: r.is_deleted === 1,
    encryptedMeta: r.encrypted_meta,
    metaIv: r.meta_iv,
    keyVersion: r.key_version,
  }));
  return jsonResponse({ photos }, 200, origin, env2.CORS_ORIGIN);
}
__name(handleGetPhotoList2, "handleGetPhotoList");
async function handlePutPhoto2(request, env2, groupId, photoId) {
  const origin = getOrigin8(request);
  const auth = await requireGroupMember(request, env2, groupId);
  if (auth instanceof Response) return auth;
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: "Invalid multipart/form-data" }, 400, origin, env2.CORS_ORIGIN);
  }
  const metaField = formData.get("meta");
  const blobField = formData.get("blob");
  if (typeof metaField !== "string") {
    return jsonResponse(
      { error: "meta field (JSON string) required" },
      400,
      origin,
      env2.CORS_ORIGIN
    );
  }
  if (blobField === null || typeof blobField === "string") {
    return jsonResponse({ error: "blob field (binary) required" }, 400, origin, env2.CORS_ORIGIN);
  }
  let meta;
  try {
    meta = JSON.parse(metaField);
  } catch {
    return jsonResponse({ error: "meta must be valid JSON" }, 400, origin, env2.CORS_ORIGIN);
  }
  if (
    typeof meta.encryptedMeta !== "string" ||
    typeof meta.metaIv !== "string" ||
    typeof meta.pinId !== "string" ||
    typeof meta.keyVersion !== "number" ||
    typeof meta.hlcPhysical !== "number" ||
    typeof meta.hlcLogical !== "number" ||
    typeof meta.hlcNodeId !== "string"
  ) {
    return jsonResponse({ error: "meta fields incomplete" }, 400, origin, env2.CORS_ORIGIN);
  }
  const blobEntry = blobField;
  const blobArrayBuffer = await blobEntry.arrayBuffer();
  const r2Key = `group-photos/${groupId}/${photoId}.enc`;
  await env2.PHOTOS.put(r2Key, blobArrayBuffer);
  const now = /* @__PURE__ */ new Date().toISOString();
  await env2.DB.prepare(
    `INSERT INTO group_photos_sync
       (id, group_id, pin_id, author_id, key_version, encrypted_meta, meta_iv, r2_key,
        size_bytes, hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
     ON CONFLICT(id, group_id) DO UPDATE SET
       pin_id = excluded.pin_id,
       encrypted_meta = excluded.encrypted_meta,
       meta_iv = excluded.meta_iv,
       r2_key = excluded.r2_key,
       size_bytes = excluded.size_bytes,
       key_version = excluded.key_version,
       hlc_physical = excluded.hlc_physical,
       hlc_logical = excluded.hlc_logical,
       hlc_node_id = excluded.hlc_node_id,
       is_deleted = 0`
  )
    .bind(
      photoId,
      groupId,
      meta.pinId,
      auth.userId,
      meta.keyVersion,
      meta.encryptedMeta,
      meta.metaIv,
      r2Key,
      blobArrayBuffer.byteLength,
      meta.hlcPhysical,
      meta.hlcLogical,
      meta.hlcNodeId,
      now
    )
    .run();
  return jsonResponse({ ok: true }, 200, origin, env2.CORS_ORIGIN);
}
__name(handlePutPhoto2, "handlePutPhoto");
async function handleGetPhoto2(request, env2, groupId, photoId) {
  const origin = getOrigin8(request);
  const auth = await requireGroupMember(request, env2, groupId);
  if (auth instanceof Response) return auth;
  const row = await env2.DB.prepare(
    `SELECT r2_key FROM group_photos_sync WHERE id = ? AND group_id = ? AND is_deleted = 0`
  )
    .bind(photoId, groupId)
    .first();
  if (!row) return jsonResponse({ error: "Photo not found" }, 404, origin, env2.CORS_ORIGIN);
  const obj = await env2.PHOTOS.get(row.r2_key);
  if (!obj) {
    return jsonResponse({ error: "Photo not found in storage" }, 404, origin, env2.CORS_ORIGIN);
  }
  const headers = {
    "Content-Type": "application/octet-stream",
    ...corsHeaders(origin, env2.CORS_ORIGIN),
  };
  if (obj.etag) headers["ETag"] = obj.etag;
  return new Response(obj.body, { status: 200, headers });
}
__name(handleGetPhoto2, "handleGetPhoto");
async function handleDeletePhoto2(request, env2, groupId, photoId) {
  const origin = getOrigin8(request);
  const auth = await requireGroupMember(request, env2, groupId);
  if (auth instanceof Response) return auth;
  const row = await env2.DB.prepare(
    `SELECT gp.author_id, gm.role
     FROM group_photos_sync gp
     JOIN group_memberships gm ON gm.group_id = gp.group_id AND gm.user_id = ?
     WHERE gp.id = ? AND gp.group_id = ?`
  )
    .bind(auth.userId, photoId, groupId)
    .first();
  if (!row) return jsonResponse({ error: "Photo not found" }, 404, origin, env2.CORS_ORIGIN);
  if (row.author_id !== auth.userId && row.role !== "owner") {
    return jsonResponse({ error: "forbidden" }, 403, origin, env2.CORS_ORIGIN);
  }
  const r2Key = `group-photos/${groupId}/${photoId}.enc`;
  await env2.DB.prepare(`UPDATE group_photos_sync SET is_deleted = 1 WHERE id = ? AND group_id = ?`)
    .bind(photoId, groupId)
    .run();
  await env2.PHOTOS.delete(r2Key);
  return emptyResponse(204, origin, env2.CORS_ORIGIN);
}
__name(handleDeletePhoto2, "handleDeletePhoto");
async function handleGroupPhotos(request, env2, groupId, subPath) {
  const method = request.method;
  const origin = getOrigin8(request);
  const listMatch = subPath.match(/^\/list\/([^/]+)$/);
  if (listMatch && method === "GET") {
    return handleGetPhotoList2(request, env2, groupId, listMatch[1]);
  }
  const photoMatch = subPath.match(/^\/([^/]+)$/);
  if (photoMatch) {
    const photoId = photoMatch[1];
    if (method === "PUT") return handlePutPhoto2(request, env2, groupId, photoId);
    if (method === "GET") return handleGetPhoto2(request, env2, groupId, photoId);
    if (method === "DELETE") return handleDeletePhoto2(request, env2, groupId, photoId);
  }
  return jsonResponse({ error: "Not Found" }, 404, origin, env2.CORS_ORIGIN);
}
__name(handleGroupPhotos, "handleGroupPhotos");

// src/index.ts
var src_default = {
  async fetch(request, env2, _ctx) {
    if (request.method === "OPTIONS") {
      return handleOptions(request, env2.CORS_ORIGIN);
    }
    const origin = request.headers.get("Origin");
    const applyCors = /* @__PURE__ */ __name((res) => {
      const h = new Headers(res.headers);
      for (const [k, v] of Object.entries(corsHeaders(origin, env2.CORS_ORIGIN))) h.set(k, v);
      return new Response(res.body, { status: res.status, headers: h });
    }, "applyCors");
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.startsWith("/api/auth/") || path === "/api/account") {
      return applyCors(await handleAuth(request, env2, path));
    }
    if (path.startsWith("/api/pins")) {
      return applyCors(await handlePins(request, env2, path));
    }
    if (path.startsWith("/api/photos")) {
      return applyCors(await handlePhotos(request, env2, path));
    }
    if (path.startsWith("/api/admin")) {
      return applyCors(await handleAdmin(request, env2, path));
    }
    if (path.startsWith("/api/webauthn")) {
      return applyCors(await handleWebAuthn(request, env2, path));
    }
    if (path.startsWith("/api/keys")) {
      return applyCors(await handleKeys(request, env2, path));
    }
    if (path.startsWith("/api/groups")) {
      const groupPinsMatch = path.match(/^\/api\/groups\/([^/]+)(\/pins.*)$/);
      if (groupPinsMatch) {
        return applyCors(
          await handleGroupPins(request, env2, groupPinsMatch[1], groupPinsMatch[2])
        );
      }
      const groupPhotosMatch = path.match(/^\/api\/groups\/([^/]+)(\/photos.*)$/);
      if (groupPhotosMatch) {
        return applyCors(
          await handleGroupPhotos(request, env2, groupPhotosMatch[1], groupPhotosMatch[2])
        );
      }
      return applyCors(await handleGroups(request, env2, path));
    }
    return applyCors(
      new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );
  },
  async scheduled(_event, env2, _ctx) {
    const now = /* @__PURE__ */ new Date();
    await env2.DB.prepare(`DELETE FROM refresh_tokens WHERE expires_at < ?`)
      .bind(now.toISOString())
      .run();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3).toISOString();
    const expiredPhotos = await env2.DB.prepare(
      `SELECT id, user_id FROM photos_sync WHERE is_deleted = 1 AND created_at < ?`
    )
      .bind(thirtyDaysAgo)
      .all();
    for (const row of expiredPhotos.results ?? []) {
      const r2Key = `photos/${row.user_id}/${row.id}.enc`;
      await env2.PHOTOS.delete(r2Key).catch(() => {});
      await env2.DB.prepare(`DELETE FROM photos_sync WHERE id = ? AND user_id = ?`)
        .bind(row.id, row.user_id)
        .run();
    }
    const expiredGroupPhotos = await env2.DB.prepare(
      `SELECT id, group_id FROM group_photos_sync WHERE is_deleted = 1 AND created_at < ?`
    )
      .bind(thirtyDaysAgo)
      .all();
    for (const row of expiredGroupPhotos.results ?? []) {
      const r2Key = `group-photos/${row.group_id}/${row.id}.enc`;
      await env2.PHOTOS.delete(r2Key).catch(() => {});
      await env2.DB.prepare(`DELETE FROM group_photos_sync WHERE id = ? AND group_id = ?`)
        .bind(row.id, row.group_id)
        .run();
    }
  },
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {}
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause),
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" },
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-jHi9tU/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default,
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail2] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail2);
    },
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware,
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-jHi9tU/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (
    __INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 ||
    __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0
  ) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function (request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function (type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {}
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    },
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (
    __INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 ||
    __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0
  ) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {}
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export { __INTERNAL_WRANGLER_MIDDLEWARE__, middleware_loader_entry_default as default };
/*! Bundled license information:

pvtsutils/build/index.js:
  (*!
   * MIT License
   * 
   * Copyright (c) 2017-2024 Peculiar Ventures, LLC
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   *)

reflect-metadata/Reflect.js:
  (*! *****************************************************************************
  Copyright (C) Microsoft. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** *)

tslib/tslib.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

pvutils/build/utils.es.js:
  (*!
   Copyright (c) Peculiar Ventures, LLC
  *)

asn1js/build/index.es.js:
  (*!
   * Copyright (c) 2014, GMO GlobalSign
   * Copyright (c) 2015-2022, Peculiar Ventures
   * All rights reserved.
   * 
   * Author 2014-2019, Yury Strozhevsky
   * 
   * Redistribution and use in source and binary forms, with or without modification,
   * are permitted provided that the following conditions are met:
   * 
   * * Redistributions of source code must retain the above copyright notice, this
   *   list of conditions and the following disclaimer.
   * 
   * * Redistributions in binary form must reproduce the above copyright notice, this
   *   list of conditions and the following disclaimer in the documentation and/or
   *   other materials provided with the distribution.
   * 
   * * Neither the name of the copyright holder nor the names of its
   *   contributors may be used to endorse or promote products derived from
   *   this software without specific prior written permission.
   * 
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
   * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   * 
   *)

@peculiar/x509/build/x509.es.js:
  (*!
   * MIT License
   * 
   * Copyright (c) Peculiar Ventures. All rights reserved.
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   *)
*/
//# sourceMappingURL=index.js.map
