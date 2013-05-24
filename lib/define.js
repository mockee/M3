;(function(win) {
  function each(obj, iterator, context) {
    if (!obj) { return }
    if (Array.prototype.forEach && obj.forEach) {
      obj.forEach(iterator, context)
    } else {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj) {
          iterator.call(context, obj[i], i, obj)
        }
      }
    }
  }

  function isString(obj) {
    return Object.prototype.toString.call(obj) == '[object String]'
  }

  function isObject(obj) {
    return obj === Object(obj)
  }

  function getDep(name) {
    var mod = define._global_exports[name]
    return mod && mod.exports
  }

  function load(deps, fn) {
    var callee = define
      , exports = {}
      , mod = callee._global_exports[name] || {}
      , current_ns = callee._ns = mod.ns
        || callee._current_ns || callee._ns || 'window'

    // fn's arguments
    var args = []

    each(deps, function(name) {
      args.push(getDep(name))
    })

    exports = fn.apply(this, args) || {}

    return exports
  }

  function define(name, deps, fn) {
    // anonymous module
    if (!isString(name)) {
      throw new Error('Waring: definejs can\'t handle anonymous AMD module')
      return
    }

    if (!fn) {
      fn = deps
      deps = []
    }

    var exports = load(deps, fn)
      , mod = define._global_exports[name]
    if (!mod) {
      throw new Error('Waring: there is no definition of \"'
        + name + '\" in define.config ?')
      return
    }

    mod.exports = exports

    if (mod.alias) {
      each(mod.alias, function(alias) {
        var names = alias.split('.')
          , context = win
          , name = names[0]

        if (names[1]) {
          context = context[name] = context[name] || {}
          name = names[1]
        }

        context[name] = exports
      })
    }
  }

  function require(reqs, fn) {
    var reqsIsString = isString(reqs)
    if (!fn && reqsIsString) {
      return getDep(reqs)
    }
    if (reqsIsString) {
      reqs = [reqs]
    }
    var args = arguments
    setTimeout(function() {
      load.apply(this, args)
    }, 0)
  }

  // configuration
  define._global_exports = {}

  // set namespace
  define.ns = function(mid, namespace) {
    // for all modules
    if (!namespace) {
      this._ns = mid
    } else {
      // for specified module
      var mods = this._global_exports
      if (!mods[mid]) {
        mods[mid] = {
          alias: []
        }
      }
      mods[mid].ns = namespace
    }
  }

  // set aliases for exports
  define.config = function(mid, vars) {
    if (isObject(mid)) {
      for (var id in mid) {
        this.config(id, mid[id])
      }
      return
    }

    var mods = this._global_exports

    if (!mods[mid]) {
      mods[mid] = {
        ns: this._ns
      , alias: []
      }
    }

    if (isString(vars)) {
      vars = [vars]
    }

    [].push.apply(mods[mid].alias, vars)
  }

  define.amd = { jQuery: true }

  win.define = define
  win.require = require

})(window)
