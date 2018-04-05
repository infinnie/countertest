define("build/counter", [
    "jquery",
    "lib/h",
    "js/counterfunctions"
], function ($, h, fns) {
    "use strict";
    return function (props) {
        var inject = props.inject,
            name = props.name,
            pageData = props.pageData,
            value = props.value;
        return (<p>
            <button class="btn counterBtn" type="button" $click={fns.down(inject, name, pageData, value)}>&minus;</button>
            <span class="counterValue">{pageData[name]}</span>
            <button class="btn counterBtn" type="button" $click={fns.up(inject, name, pageData, value)}>+</button>
        </p>);
    };
});