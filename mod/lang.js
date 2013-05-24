// Added as needed
define('mod/lang', [], function() {
  var lang = {}

  var ArrayProto = Array.prototype
    , slice = ArrayProto.slice
    , nativeForEach = ArrayProto.forEach

  var each = lang.each = function(obj, iterator, context) {
    if (!obj) { return }

    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context)
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        iterator.call(context, obj[i], i, obj)
      }
    } else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj)
        }
      }
    }
  }

  lang.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop]
      }
    })
    return obj
  }

  lang.escape = function(str) {
    str = '' + str || ''
    var xmlchar = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , "'": "&#39;"
    , '"': "&quot;"
    }

    return str.replace(/[<>&'"]/g, function($1) {
      return xmlchar[$1]
    })
  }

  return lang
})
