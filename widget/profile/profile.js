define('widget/profile', [
  'jquery'
, 'mod/cookie'
, 'mod/template'
], function($, cookie, template) {
  $ = $ || window.$;
  cookie = cookie || Ark.cookie;
  template = template || Ark.template;

  var body = $('body')
    , base = $('#ark-console')
    , header = $('.profile-hd')
    , dataContainer = $('.profile-bd')
    , statusBar = $('.profile-ft')
    , mainSection = $('.profile-hd, .profile-bd')
    , tmplItem = $('#tmpl-console-item').html()
    , docElement = document.documentElement
    , loc = location
    , profile = {}

  profile.add = function(res) {
    var host = res.uri.split('?')[0]
      , uriArr = host.split('/')
      , name = uriArr.slice(-1)
      , path = uriArr.slice(0, -1).join('/')

    dataContainer.find('tbody')
      .append(template(tmplItem, {
        name: name || 'page'
      , path: path || '/'
      , time: res.time
      , method: res.type.toUpperCase()
      , stdout: res.stdout
      }))

    statusBar.find('.req-num')
      .text($('.data-item').length)
  }

  header.dblclick(function() {
    var isMax = /height:+/gi.test(base.attr('style'))
    base.height(isMax ? '' : docElement.clientHeight)
    dataContainer.css('max-height', isMax ? '300px' : '100%')
  })

  statusBar.on('click', function(e) {
    var self = $(this)
      , switcher = self.find('.switcher')
      , isOff = switcher.hasClass('off')

    mainSection.toggle()
    switcher.toggleClass('on off')
    self.toggleClass('mini').find('.apc')
      .text(isOff ? 'Ark Profiling Console' : 'APC')
  })

  base.on('click', '.data-item', function() {
    var self = $(this)
      , stdout = self.find('.stdout')
      , data = self.find('.stdout-data')

    if ($.trim(stdout.text()).length) {
      return stdout.empty()
    }

    stdout.html(data.html()).show()
      .end().find('pre').width(body.width())
    })

  // Add shire profile
  if (/profile=shire/gi.test(loc.search) || cookie('profile')) {
    var sp = $('#shire-profile')
    if (!sp) { return }
    profile.add({
      uri: loc.href
    , time: sp.data('pt')
    , stdout: sp.html()
    , type: 'GET'
    })
  }

  return profile
})
