define('ui/overlay', [
  'jquery'
, 'mod/emitter'
], function($, Emitter) {
  var tmpl =
        '<div id="ark-overlay" class="hide">'
      + '<div class="k-stick"></div>'
      + '<div class="k-content"></div>'
      + '</div>'

    , doc = $(document)
    , docRoot = $('html')

  function overlay(opts) {
    opts = opts || {}
    return new Overlay(opts)
  }

  function Overlay(opts) {
    Emitter.call(this)

    var self = this
    this.opts = opts
    this.el = $(tmpl).appendTo('body')
    this.anchor = $('<div>', { id: 'k-anchor' })
      .prependTo('body')

    this.body = this.el.find('.k-content')
    this.closable = opts.closable || true
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

  Overlay.prototype.close = function() {
    docRoot.removeClass('ark-overlay')
    this.el.remove()
    this.anchor.remove()
    doc.scrollTop(this.scrollTop)
    doc.off('.close')
    this.emit('close')
    return this
  }

  Overlay.prototype.open = function() {
    this.scrollTop = doc.scrollTop()
    this.anchor.css('margin-top', -this.scrollTop)
    docRoot.addClass('ark-overlay')
    this.el.removeClass('hide')
    this.emit('open')
    return this
  }

  Overlay.prototype.setBody = function() {
    this.body.html(this.opts.body)
    return this
  }

  Emitter(Overlay.prototype)

  return overlay
})
