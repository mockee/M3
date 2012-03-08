define(['zepto', 'proxy'], function ($, proxy) {

    var thresholds = {
        xSwipe: 35,
        ySwipe: 25,
        singleTap: 250,
        doubleTap: 350,
        holdTap: 850
    },

    touchFn = {
        swipe: function (el, info) {
            var deltaX = info.finishX - info.startX,
                deltaY = info.finishY - info.startY,
                absDeltaX = Math.abs(deltaX),
                absDeltaY = Math.abs(deltaY);

            if (absDeltaX > thresholds.xSwipe ||
                absDeltaY > thresholds.ySwipe) {
                delete info.touchTime;
                el.trigger('swipe', {
                    direction: absDeltaX > absDeltaY ?
                        deltaX < 0 ? 'left' : 'right' :
                        deltaY < 0 ? 'up' : 'down'
                });
            }
        },

        tap: function (el, info) {
            if (info.deltaTime > 0 &&
                info.deltaTime <= thresholds.doubleTap) {
                el.trigger('tap', { action: 'doubleTap' });

            } else if (info.touchTime) {
                this.tapTimer = setTimeout(function() {
                    el.trigger('tap', { action: 'singleTap' });
                    delete info.touchTime;
                }, thresholds.singleTap);
            }

            if (this.holdTimer) {
                clearTimeout(this.holdTimer);
                delete this.holdTimer;
            }
        },

        tapHold: function (el, info) {
            if (this.tapTimer) {
                clearTimeout(this.tapTimer);
            }
            this.holdTimer = setTimeout(function() {
                el.trigger('tap', { action: 'hold' });
                delete info.touchTime;
            }, thresholds.holdTap);
        }
    };

    var globalTouch = {
        // touchcancel is called whenever the system cancels a touch event
        events: ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
        actions: ['swipe', 'tap'],
        touchInfo: {},

        init: function() {
            this.events.forEach(proxy(function (eventName) {
                document.body.addEventListener(eventName,
                    proxy(this['on' + eventName], this), false);
            }, this));
        },

        ontouchstart: function (e) {
            var now = e.timeStamp,
                tc = e.touches[0], node = tc.target,
                deltaTime = now - this.touchInfo.touchTime || now;

            this.el = $('tagName' in node ?
                node : node.parentNode);

            this.touchInfo = {
                startX: tc.pageX,
                startY: tc.pageY,
                deltaTime: deltaTime,
                touchTime: now
            };

            touchFn.tapHold(this.el, this.touchInfo);
        },

        ontouchmove: function (e) {
            var tc = e.touches[0];
            this.touchInfo.finishX = tc.pageX;
            this.touchInfo.finishY = tc.pageY;
        },

        ontouchend: function() {
            this.actions.forEach(proxy(function (action) {
                touchFn[action](this.el, this.touchInfo);
            }, this));
        },

        ontouchcancel: function() {
            this.touchInfo = {};
        }
    };

    globalTouch.init();
});
