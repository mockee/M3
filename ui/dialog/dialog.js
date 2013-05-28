define('ui/dialog', [
  'jquery'
, 'ui/overlay'
, 'mod/emitter'
], function($, overlay, Emitter) {
  var tmpl =
        '<div id="ark-dialog">'
      + '<div class="dialog-hd">'
      +   '<a href="#" class="k-close">&times;</a>'
      + '</div>'
      + '<div class="dialog-bd">'
      +   '<div class="k-text"></div>'
      +   '<div class="k-buttons"></div>'
      + '</div>'
      + '</div>'

    , tmplBtns =
        '<button class="btn btn-large" '
      +    'data-confirm="1">确定</button>'
      + '<button class="btn btn-minor btn-large" '
      +    'data-confirm="0">取消</button>'

    , doc = $(document)

  function Dialog(opts) {
    Emitter.call(this)

    var self = this
    this.opts = opts
    this.el = $(tmpl)
    this.text = this.el.find('.k-text')
    this.head = this.el.find('.dialog-hd')
    this.buttons = this.el.find('.k-buttons')
    this.btnClose = this.el.find('.k-close')

    this.closable = opts.closable !== void 0 ? !!opts.closable : true
    this.overlay = overlay({ closable: this.closable })

    this.render()

    doc.on('click.close', '.k-close', function() { self.close() })
      .on('click.confirm', '[data-confirm]', function(e) {
        var action = !!$(e.currentTarget).data('confirm')
        self.emit(action ? 'confirm' : 'cancel')
        if (!action) { self.close() }
      })
  }

  $.extend(Dialog.prototype, {
    render: function() {
      var title = this.opts.title
        , foot = this.opts.foot

      this.text.html(this.opts.content)

      if (!this.closable) {
        this.btnClose.remove()
      }

      if (title) { this.setTitle(title) }
      if (foot) { this.setFoot(foot) }

      this.setButtons()
      this.overlay.setBody(this.el)
    }

  , setTitle: function(title) {
      this.head.prepend($('<span>', {
        'class': 'k-title'
      , 'text': title
      }))
      return this
    }

  , setFoot: function(content) {
      this.el.append($('<div>', {
        'class': 'dialog-ft'
      , 'html': content
      }))
      return this
    }

  , setButtons: function(config) {
      config = config || []
      var type = this.opts.type
        , btnText = ['确定', '取消']
        , btnNum = config.length

      if (/confirm|tips/i.test(type)) {
        this.buttons[0].innerHTML = tmplBtns
        var buttons = this.buttons.find('button')

        for (var i = 0; i < btnNum; i++) {
          buttons.eq(i).text(config[i].text || btnText[i])
            .addClass(config[i]['class'] || '')
        }

        if (type === 'tips') {
          buttons[1].remove()
        }
      }

      if (type === 'custom') {
        this.buttons[0].innerHTML = config
      }

      return this
    }

  , addClass: function(name) {
      this.el.addClass(name)
      return this
    }

  , open: function() {
      this.overlay.open()
      this.emit('open')
      return this
    }

  , close: function() {
      this.overlay.close()
      this.emit('close')
      doc.off('.confirm')
      return this
    }
  })

  Emitter(Dialog.prototype)

  function exports(opts) {
    opts = opts || {}
    return new exports.Dialog(opts)
  }

  exports.Dialog = Dialog

  return exports
})
