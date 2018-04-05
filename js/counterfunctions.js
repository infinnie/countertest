define("js/counterfunctions", function () {
    "use strict";
    return {
        up: function (inject, name, value) {
            return function () {
                var obj = {};
                obj[name] = value + 1;
                inject(obj);
            };
        }, down: function (inject, name, value) {
            return function () {
                var obj = {};
                obj[name] = value - 1;
                inject(obj);
            };
        }
    }
});