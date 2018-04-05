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
            by = props.by;
        return (<p>
            <button class="btn counterBtn" type="button" $click={fns.down(inject, name, pageData, by)}>&minus;</button>
            <span class="counterValue">{pageData[name]}</span>
            <button class="btn counterBtn" type="button" $click={fns.up(inject, name, pageData, by)}>+</button>
        </p>);
    };
});