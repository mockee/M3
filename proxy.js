define(function() {
    var proxy = function (fn, context) {
        var args = [].slice.call(arguments, 2);

        return function() {
            return fn.apply(context,
                args.concat([].slice.call(arguments)));
        };
    };

    return proxy;
});
