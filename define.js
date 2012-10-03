(function(win) {
  var each = function(obj, iterator, context) {
    if (!obj) { return; }
    if (Array.prototype.forEach && obj.forEach) {
      obj.forEach(iterator, context);
    } else {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj) {
          iterator.call(context, obj[i], i, obj);
        }
      }
    }
  },

  isString = function(obj) {
    return Object.prototype.toString.call(obj) == '[object String]';
  };

  function define(name, deps, fn) {
    if (!fn) {
      if (deps) {
        fn = deps;
      } else {
        fn = name;
        name = [];
      }

      // anonymous module
      if (!isString(name)) {
        deps = name;
        name = '';
      } else {
        deps = [];
      }
    }

    var callee = define,
      len = deps.length,
      exports = {},
      mod = callee._global_exports[name] || {},
      current_ns = callee._ns = mod.ns || 'window';

    // collect exports of dependent modules
    deps = ((/^function.*?\(([\w'"\$\/\-\:,\n\r\s]*)\)/
      .exec(fn.toString()) || [])[1] || '')
      .replace(/\s+/g, '').split(',');

    deps.length = len;

    each(deps, function(name, i) {
      // replace exports with corresponding functions
      deps[i] = win[current_ns][name] || win[name];
    });

    // add `require`
    deps.push(function(reqs, cb) {
      if (cb) {
        require(reqs, cb);
      } else {
        return (callee._global_exports[reqs] || {}).exports;
      }
    });

    // add `exports`
    deps.push(exports);

    exports = mod.exports = fn.apply(this, deps) || exports;

    if (mod.alias) {
      each(mod.alias, function(name) {
        name = name.split('.');
        var context = win, i = name[0];
        if (name[1]) {
          context = context[i] = context[i] || {};
          i = name[1];
        }
        context[i] = exports;
      });
    }
  }

  function require(reqs) {
    if (isString(reqs)) {
      reqs = [reqs];
    }
    var args = arguments;
    setTimeout(function(){
      define.apply(this, args);
    }, 0);
  }

  // configuration
  define._global_exports = {};

  // set namespace
  define.ns = function(mid, namespace) {
    // for all modules
    if (!namespace) {
      this._ns = mid;
    } else {
      // for specified module
      var mods = this._global_exports;
      if (!mods[mid]) {
        mods[mid] = {
          alias: []
        };
      }
      mods[mid].ns = namespace;
    }
  };

  // set aliases for exports
  define.config = function(mid, vars) {
    if (mid === Object(mid)) {
      for (var id in mid) {
        this.config(id, mid[id]);
      }
      return;
    }

    var mods = this._global_exports;

    if (!mods[mid]) {
      mods[mid] = {
        ns: this._ns,
        alias: []
      };
    }

    if (isString(vars)) {
      vars = [vars];
    }

    [].push.apply(mods[mid].alias, vars);
  };

  define.amd = { jQuery: true };

  win.define = define;

})(window);
