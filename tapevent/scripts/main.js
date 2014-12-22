(function () {

    var touchStart,
        touchEnd;

    // normal touch events
    if (typeof(window.ontouchstart) != 'undefined') {
        touchStart = 'touchstart';
        touchEnd = 'touchend';
    }
    // microsoft touch events
    else if (typeof(window.onmspointerdown) != 'undefined') {
        touchStart = 'MSPointerDown';
        touchEnd = 'MSPointerUp';
    } else {
        touchStart = 'mousedown';
        touchEnd = 'mouseup';
    }

    function NodeFacade(node) {
        this._node = node;
    }

    NodeFacade.prototype.getDomNode = function () {
        return this._node;
    };

    NodeFacade.prototype.on = function (evt, callback) {
        if (evt === 'tap') {
            this._node.addEventListener(touchStart, callback);
        } else if (evt === 'tapend') {
            this._node.addEventListener(touchEnd, callback);
        } else {
            this._node.addEventListener(evt, callback);
        }
        return this;
    };

    NodeFacade.prototype.off = function (evt, callback) {
        if (evt === 'tap') {
            this._node.removeEventListener(touchStart, callback);
        } else if (evt === 'tapend') {
            this._node.removeEventListener(touchEnd, callback);
        } else {
            this._node.removeEventListener(evt, callback);
        }
        return this;
    };

    window.$ = function (selector) {
        var node = document.querySelector(selector);
        if (node) {
            return new NodeFacade(node);
        } else {
            return null;
        }
    };

})();

$('.button').on('tap',function (e) {
    e.preventDefault();
    //togglePicture();
    e.target.className = 'active button';
}).on('tapend', function (e) {
    e.target.className = 'button';
});