define('ui/overlay', [
  'jquery'
, 'mod/emitter'
], function($, Emitter) {
  var tmpl =
        '<div id="ark-overlay" class="hide">'
      +   '<div class="k-stick"></div>'
      +   '<div class="k-content">'
      +     '<div class="k-slave"></div>'
      +   '</div>'
      + '</div>'

    , doc = $(document)
    , docRoot = $('html')

  function Overlay(opts) {
    Emitter.call(this)

    var self = this
    this.opts = opts
    this.el = $(tmpl).appendTo('body')
    this.anchor = $('<div>', { id: 'k-anchor' })
      .prependTo('body')

    this.body = this.el.find('.k-slave')
    this.closable = opts.closable !== void 0
      ? !!opts.closable : true
    this.setBody()

    if (!this.closable) { return }

    doc.on('click.close', '#ark-overlay', function(e) {
      if (e.target !== e.currentTarget) { return }
      self.close()
    })
    .on('keyup.close', function(e) {
      if (!(/input|textarea/i.test(e.target.tagName))
        && e.keyCode === 27) {
          self.close()
      }
    })
  }

  $.extend(Overlay.prototype, {
    close: function() {
      docRoot.removeClass('ark-overlay')
      this.el.remove()
      this.anchor.remove()
      doc.scrollTop(this.scrollTop)
      doc.off('.close')
      this.emit('close')
      return this
    }

  , open: function() {
      this.scrollTop = doc.scrollTop()
      this.anchor.css('margin-top', -this.scrollTop)
      docRoot.addClass('ark-overlay')
      this.el.removeClass('hide')
      this.emit('open')
      return this
    }

  , setBody: function(body) {
      body = body || this.opts.body
      this.body.html(body)
      return this
    }
  })

  Emitter(Overlay.prototype)

  function exports(opts) {
    opts = opts || {}
    return new exports.Overlay(opts)
  }

  exports.Overlay = Overlay

  return exports
})
