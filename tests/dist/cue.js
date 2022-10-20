var renderer = function (cnode, container) {
    // do tag
    var el = document.createElement(cnode.tag);
    // do props
    for (var key in cnode.props) {
        if (/^on/.test(key)) {
            el.addEventListener(key.substring(2).toLowerCase(), cnode.props[key]);
        }
    }
    // do children
    if (typeof cnode.children == 'string')
        el.appendChild(document.createTextNode(cnode.children));
    else if (Array.isArray(cnode.children))
        cnode.children.forEach(function (item) { return renderer(item, el); });
    // mount
    container.appendChild(el);
};

var testnode = {
    tag: 'div',
    props: {
        onClick: function () { return console.log('click'); },
        testProp: '123asd'
    },
    children: 'testnode'
};
var el = document.getElementById('app');
renderer(testnode, el);
//# sourceMappingURL=cue.js.map
