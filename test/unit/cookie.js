module('cookie');

test('Set & get cookie without options', function() {
  cookie('test_cookie', 1);

  ok(document.cookie.split('; ').indexOf('test_cookie=1') !== -1, 'Passed!');
  ok(cookie('test_cookie') === '1', 'Passed!');
});

test('Set cookie with `path`', function() {
  cookie('test_path', 1, { path: '/test'});
  cookie('test_error_path', 1, { path: '/test2'});

  ok(cookie('test_path') === '1', 'Passed!');
  ok(cookie('test_error_path') !== '1', 'Passed!');
});

test('Set cookie with `secure`', function() {
  cookie('test_secure', 1, { secure: true });
  ok(cookie('test_secure') !== '1', 'Passed!');
});

asyncTest('Set cookie with `max-age`', function() {
  expect(2);

  cookie('test_maxage', 1, { 'max-age': 2 });
  cookie('test_expires', 1, {
    expires: (new Date(Date.now() + 2000)).toGMTString()
  });

  setTimeout(function() {
    ok(!cookie('test_maxage'), 'Passed!');
    ok(!cookie('test_expires'), 'Passed!');
    start();
  }, 2000);
});

test('Delete cookies', function() {
  cookie('test_cookie', '', { 'max-age': -1 });
  cookie('test_path', '', { 'max-age': -1 });
  cookie('test_secure', '', { 'max-age': -1 });

  ok(!cookie('test_cookie'), 'Passed!');
  ok(!cookie('test_path'), 'Passed!');
  ok(!cookie('test_secure'), 'Passed!');
});
