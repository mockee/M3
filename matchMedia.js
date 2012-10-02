/*
 * matchMedia() polyfill
 * forked from paulirish/matchMedia.js
 * written in the RequireJS module format
 */

define('mod/matchmedia', function() {
  var bool, doc = document
    , docElem = doc.documentElement
    , refNode = docElem.firstElementChild || docElem.firstChild
    // fakeBody required for <FF4 when executed in <head>
    , fakeBody = doc.createElement('body')
    , div = doc.createElement('div');

  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none!important";
  fakeBody.appendChild(div);

  var matchMedia = window.matchMedia || function(q) {
    div.innerHTML = '&shy;<style media="'+q+'">#mq-test-1{width:42px;}</style>';
    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth === 42;
    docElem.removeChild(fakeBody);

    return { matches: bool, media: q };
  };

  return matchMedia;
});
