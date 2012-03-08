define(['zepto', 'proxy'], function ($, proxy) {
    var gestureFn = {
        pinch: function (el, info) {
            var deltaScale = info.startScale - info.finishScale,
                absDeltaScale = Math.abs(deltaScale);

            deltaScale !== 0 && el.trigger('pinch', {
                action: 'pinch' + (deltaScale > 0 ? 'In' : 'Out')
            });
        },
        rotate: function() {}
    };

    var globalGesture = {
        events: ['gesturestart', 'gesturechange', 'gestureend'],
        actions: ['pinch', 'rotate'],
        gestureInfo: {},
        init: function() {
            this.events.forEach(proxy(function (eventName) {
                document.addEventListener(eventName,
                    proxy(this['on' + eventName], this), false);
            }, this));
        },
        ongesturestart: function (e) {
            var node = e.target;
            this.el = $('tagName' in node ?
                node : node.parentNode);

            this.gestureInfo.startScale = e.scale;
        },
        ongesturechange: function (e) {
            this.gestureInfo.finishScale = e.scale;
            this.gestureInfo.rotation = e.rotation;
        },
        ongestureend: function (e) {
            this.actions.forEach(proxy(function (action) {
                gestureFn[action](this.el, this.gestureInfo);
            }, this));
        }
    };

    globalGesture.init();
});
