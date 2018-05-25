define("build/main", ["jquery", "lib/h", "lib/app", "import"], function ($, h, app, f) {
    "use strict";
    var loadCounter = function (injectView) {
        f("./counter").then(function (Counter) {
            injectView({
                pageData: {
                    first: 0,
                    second: 0
                }, currentView: function () {
                    return (<div>
                        <h1>Counters</h1>
                        <p>First</p>
                        <Counter name="first" by={1} />
                        <p>Second</p>
                        <Counter name="second" by={1} />
                    </div>);
                }
            });
        });
    };
    app({
        pageData: {},
        currentView: function (state, actions) {
            return (<p>
                <button type="button" class="btn" $click={function () {
                    loadCounter(actions.globalInject);
                }}>
                    Show counters
                </button>
            </p>);
        }
    }, {
        inject: function (callback) {
            /// <summary>reserved for connect()</summary>
            return callback;
        }, globalInject: function (x) {
            return function () {
                return x;
            };
        }
    }, function (state) {
        return state.currentView && state.currentView.apply(null, arguments);
    }, $("#app").get(0)
    );
});