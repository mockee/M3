define('mod/touch', [], function() {

  function trigger(el, event, data) {
    var evt = document.createEvent('Event')
    evt.initEvent(event, true, true)
    evt.data = data
    el.dispatchEvent(evt)
  }

  function proxy(fn, context) {
    var args = [].slice.call(arguments, 2)
    return function() {
      return fn.apply(context,
      args.concat([].slice.call(arguments)))
    }
  }

  var hasTouch = 'ontouchstart' in window

  , thresholds = {
      xSwipe: 35
    , ySwipe: 25
    , singleTap: 10
    , doubleTap: 250
    , hold: 650
    }

  , touchFn = {
      swipe: function(el, info) {
        var deltaX = info.finishX - info.startX
          , deltaY = info.finishY - info.startY
          , absDeltaX = Math.abs(deltaX)
          , absDeltaY = Math.abs(deltaY)

        if (absDeltaX > thresholds.xSwipe
          || absDeltaY > thresholds.ySwipe) {
            delete info.touchTime
            trigger(el, 'swipe', {
              direction: absDeltaX > absDeltaY
                ? deltaX < 0 ? 'left' : 'right'
                : deltaY < 0 ? 'up' : 'down'
            })
        }
      }

    , tap: function(el, info) {
        if (info.deltaTime > 0
          && info.deltaTime <= thresholds.doubleTap) {
            trigger(el, 'doubleTap')
        } else if (info.touchTime) {
          this.tapTimer = setTimeout(function() {
            trigger(el, 'tap')
            ;delete info.touchTime
          }, thresholds.singleTap)
        }

        if (this.holdTimer) {
          clearTimeout(this.holdTimer)
          ;delete this.holdTimer
        }
      }

    , hold: function(el, info) {
        if (this.tapTimer) {
          clearTimeout(this.tapTimer)
        }
        this.holdTimer = setTimeout(function() {
          trigger(el, 'hold')
          ;delete info.touchTime
        }, thresholds.hold)
      }
    }

  , globalTouch = {
      // touchcancel is called whenever the system cancels a touch event
      events: ['touchstart', 'touchmove', 'touchend', 'touchcancel']
    , mouseEvents: ['mousedown', 'mousemove', 'mouseup', '']
    , actions: ['swipe', 'tap']
    , touchInfo: {}

    , init: function() {
        if (!document.addEventListener) { return }
        this.events.forEach(proxy(function(eventName, idx) {
          document.body.addEventListener(
            hasTouch ? eventName : this.mouseEvents[idx]
          , proxy(this['on' + eventName], this), false)
          }, this))
      }

    , ontouchstart: function(e) {
        var now = e.timeStamp
          , tc = hasTouch ? e.touches[0] : e
          , node = tc.target
          , deltaTime = now - this.touchInfo.touchTime || now

        this.el = 'tagName' in node
          ? node : node.parentNode

        this.touchInfo = {
          startX: tc.pageX
        , startY: tc.pageY
        , deltaTime: deltaTime
        , touchTime: now
        }

        touchFn.hold(this.el, this.touchInfo)
      }

    , ontouchmove: function(e) {
        var tc = hasTouch ? e.touches[0] : e
        this.touchInfo.finishX = tc.pageX
        this.touchInfo.finishY = tc.pageY
      }

    , ontouchend: function() {
        this.actions.forEach(proxy(function(action) {
          touchFn[action](this.el, this.touchInfo)
        }, this))
      }

    , ontouchcancel: function() {
        this.touchInfo = {}
      }
    }

  globalTouch.init()
})
