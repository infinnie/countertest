define("js/counterfunctions", function () {
    "use strict";
    return {
        up: function (inject, name, pageData, by) {
            return function () {
                var obj = {};
                obj[name] = pageData[name] + by;
                inject(obj);
            };
        }, down: function (inject, name, pageData, by) {
            return function () {
                var obj = {};
                obj[name] = pageData[name] - by;
                inject(obj);
            };
        }
    }
});