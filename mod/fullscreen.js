define('mod/fullscreen', [], function() {
  var doc = document,

  fullscreenAPI = {
    // W3C Proposal
    requestFullscreen: function(){},
    exitFullscreen: function(){},
    fullscreenEnabled: function(){},
    fullscreenElement: function(){},
    events: ['fullscreenchange', 'fullscreenerror'],
    // vendor implemented
    isFullscreen: function(){},
    isNativeSupported: false
  },

  vendorPrefix = ['webkit', 'moz'],
  isUndefined = function(obj) {
    return obj === void 0;
  };

  // W3C uses `exitFullscreen`
  if (!isUndefined(doc.exitFullscreen)) {
    vendorPrefix = '';
    fullscreenAPI.isNativeSupported = true;
  } else {
    for (var i = 0, l = vendorPrefix.length; i < l; i++) {
      if (!isUndefined(doc[vendorPrefix[i] + 'CancelFullScreen'])) {
        vendorPrefix = vendorPrefix[i];
        fullscreenAPI.isNativeSupported = true;
        break;
      }
    }
  }

  if (fullscreenAPI.isNativeSupported) {
    fullscreenAPI.events.forEach(function(name, idx) {
      fullscreenAPI.events[idx] = vendorPrefix + name;
    });

    fullscreenAPI.isFullscreen = function() {
      if (vendorPrefix) {
        return vendorPrefix === 'webkit'
          ? doc.webkitIsFullScreen
          : doc[vendorPrefix + 'FullScreen'];
      }
    };

    fullscreenAPI.fullscreenEnabled = function() {
      return vendorPrefix
        ? doc[vendorPrefix + 'FullscreenEnabled']
        : doc.fullscreenEnabled;
    };

    fullscreenAPI.fullscreenElement = function() {
      if (vendorPrefix) {
        return doc[vendorPrefix + 'FullscreenElement'];
      } else {
        return doc.fullscreenElement;
      }
    };

    fullscreenAPI.exitFullscreen = function() {
      return vendorPrefix
        ? doc[vendorPrefix + 'CancelFullScreen']()
        : doc.exitFullscreen();
    };

    fullscreenAPI.requestFullscreen = function (el) {
      return vendorPrefix
        ? el[vendorPrefix + 'RequestFullscreen'](Element.ALLOW_KEYBOARD_INPUT)
        : el.requestFullscreen();
    };
  }

  return fullscreenAPI;
});
