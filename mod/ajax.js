define('mod/ajax', [
  'jquery'
, 'mod/cookie'
], function($, cookie) {
  function ajax() {
    var args = arguments
      , options = args[args.length - 1] || {}

    if (options.arkWithDocReferer) {
      cookie('prev_referer', document.referrer, {
        path: '/', 'max-age': 2
      })
    }

    if (options.type
      && options.type.toUpperCase() !== 'GET') {
      options.data = $.extend({}, options.data, {
        ck: cookie('ck')
      })
    }

    if (cookie('profile')) {
      var userFilter = null

      $.each(options, function(key, val) {
        if (key === 'dataFilter') {
          userFilter = val
          ;delete args[key]
        }
      })

      options = $.extend(options, {
        dataFilter: function(data, type) {
          try { data = $.parseJSON(data) }
          catch (e) { data = data }

          require('widget/profile', function(profile) {
            profile = profile || Ark.profile
            profile.add({
              time: data.pt,
              uri: data.uri,
              type: options.type,
              stdout: data.profile
            });
          })

          return userFilter === null
            ? data.rawData : userFilter(data.rawData)
        }
      })
    }

    return $.ajax.apply($, args)
  }

  ajax.post = function(url, data, callback, dataType) {
    if ($.isFunction(data)) {
      dataType = dataType || callback
      callback = data
      data = undefined
    }

    return ajax(url, {
      type: 'POST'
    , data: data
    , success: callback
    , dataType: dataType || 'json'
    })
  }

  ajax.get = function(url, callback, dataType) {
    return ajax(url, {
      type: 'GET'
    , success: callback
    , dataType: dataType || 'json'
    })
  }

  ajax.methodMap = {
    read: 'GET'
  , create: 'POST'
  , update: 'PUT'
  , patch:  'PATCH'
  , 'delete': 'DELETE'
  }

  ajax.request = function(method, url, data, options, dataType) {
    if ($.isFunction(data)) {
      dataType = options
      options = data
      data = {}
    }

    return ajax(url, $.extend({
      type: method
    , data: data
    , dataType: dataType || 'text'
    }, options))
  }

  return ajax
})
