define("build/counter", [
    "jquery",
    "lib/h",
    "js/counterfunctions",
    "js/connect"
], function ($, h, counterFunctions, connect) {
    "use strict";
    var Connector = connect("pageData")(
        null, counterFunctions.mutators, counterFunctions.operations);
    return function (props) {
        var name = props.name,
            by = props.by;
        return (<Connector render={function (values, mutations, operations) {
            // do something
            var value = values[name], down = operations.delayedDown, up = mutations.up;
            return (<p>
                <button class="btn counterBtn" type="button" $click={function () {
                        down(name, by);
                        return false;
                    }}>
                    &minus;
                </button>
                <span class="counterValue">{value}</span>
                <button class="btn counterBtn" type="button" $click={function () {
                        up(name, by);
                        return false;
                    }}>
                    +
                </button>
            </p>);
            }
        }/>);
    };
});