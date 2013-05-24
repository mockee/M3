define('mod/emitter', ['mod/lang'], function(_) {

  function Emitter(obj) {
    if (obj) {
      return _.extend(obj, Emitter.prototype)
    }
  }

  Emitter.prototype.on =
  Emitter.prototype.bind = function(e, fn) {
    if (arguments.length === 1) {
      _.each(e, function(fn, event) {
        this.on(event, fn)
      }, this)
      return this
    }

    this._callbacks = this._callbacks || {}
    ;(this._callbacks[e] = this._callbacks[e] || []).push(fn)

    return this
  }

  Emitter.prototype.emit =
  Emitter.prototype.trigger = function(e) {
    this._callbacks = this._callbacks || {}

    var args = [].slice.call(arguments, 1)
      , callbacks = this._callbacks[e]

    if (callbacks) {
      callbacks = callbacks.slice(0)
      var i = 0, len = callbacks.length

      for (; i < len; ++i) {
        callbacks[i].apply(this, args)
      }
    }

    return this
  }

  return Emitter
})
