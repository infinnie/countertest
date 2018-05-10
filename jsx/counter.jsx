define("build/counter", [
    "jquery",
    "lib/h",
    "js/counterfunctions",
    "js/connect"
], function ($, h, counterFunctions, connect) {
    "use strict";
    return function (props) {
        var name = props.name,
            by = props.by,
            Connector = connect({
                value: function (state) {
                    return state.pageData[name];
                }
            }, counterFunctions);
        return (<Connector render={function (obj) {
            // do something
            var value = obj.value, down = obj.down, up = obj.up;
            return (<p>
                <button class="btn counterBtn" type="button" $click={down(name, by) }>&minus;</button>
                <span class="counterValue">{value}</span>
                <button class="btn counterBtn" type="button" $click={up(name, by) }>+</button>
            </p>);
            }
        }/>);
    };
});