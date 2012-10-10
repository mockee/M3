define('mod/cookie', function() {
  /**
   * Set or get cookie.
   *
   * @param {String} name
   * @param {String} value
   * @param {Object} options
   * @return {Mixed}
   * @api public
   */

  var cookie = function(name, value, options) {
    return arguments.length === 1
      ? get(name) : set(name, value, options);
  };

  function get(name) {
    var value = document.cookie.match(
      new RegExp('(?:\\s|^)' + name + '\\=([^;]*)'));
    return value ? decodeURIComponent(value[1]) : null;
  }

  function set(name, value, options) {
    options = options || {};

    var date, expires, expiresGMTString,
      pair = name + '=' + encodeURIComponent(value),
      path = options.path ? '; path=' + options.path : '',
      domain = options.domain ? '; domain=' + options.domain : '',
      maxage = options['max-age'],
      secure = options.secure ? '; secure' : '';

    if (options.expires) {
      expiresGMTString = options.expires;
    } else if (maxage) {
      date = new Date();
      date.setTime(date.getTime() + maxage * 1000);
      expiresGMTString = date.toGMTString();
    }

    if (expiresGMTString) {
      expires = '; expires=' + expiresGMTString;
    }

    document.cookie = [pair, expires, path, domain, secure].join('');
  }

  return cookie;
});
