(function () {
    var regexp = /(?:\{\{)([a-zA-Z][^\s\}]+)(?:\}\})/g;

    function render(template, data) {
        return template.replace(regexp, function (fullMatch, capture) {
            if (data[capture]) {
                return data[capture];
            } else {
                return fullMatch;
            }
        });
    }

    window.renderTemplate = render;
})();

/*var tpl = document.getElementById('tpl').innerHTML;
 var tpl2 = renderTemplate(tpl, {
 img        : 'img.png',
 title      : 'My Book',
 description: 'My Book Description'
 });*/

(function () {
    var routes = [];

    function addRoute(route, callback, scope) {
        var routeObj = {
            route   : route,
            callback: callback,
            scope   : scope
        };
        routes.push(routeObj);
    }

    function handleRoute(path, noHistory) {
        var len = routes.length,
            routeObj,
            scope;

        for (var i = 0; i < len; i += 1) {
            routeObj = routes[i];
            if (path.match(routeObj.route)) {
                if (routeObj.scope) {
                    scope = routeObj.scope;
                } else {
                    scope = window;
                }
                // if from popstate, shouldn't push again
                if (!noHistory) {
                    history.pushState({}, null, path);
                }
                routeObj.callback.apply(scope, [path]);
                return true;
            }
        }
        return false;
    }

    window.addEventListener('popstate', function () {
        handleRoute(window.location.href, true);
    });

    window.router = {
        handleRoute: handleRoute,
        addRoute   : addRoute
    };

    document.addEventListener('click', function (e) {
        if (e.target.href) {
            if (router.handleRoute(e.target.href)) {
                e.preventDefault();
            }
        }
    })
})();

(function () {
    var pages = {},
        regexp,// = /([a-z0-9_]+\.html)/;
        tpl = document.getElementById('tpl').innerHTML;

    regexp = /\?book=([0-9])/;

    function hidePages() {
        var page;
        for (page in pages) {
            pages[page].style.display = 'none';
        }
    }

    function normalizeLink(path) {
        return path.match(regexp)[1];
    }

    function handlePage(path) {
        var href = normalizeLink(path),
            req;
        hidePages();
        if (pages[href]) {
            hidePages();
            pages[href].style.display = 'inline-block';
        } else {
            req = new XMLHttpRequest();
            req.open('get', 'book' + href + '.json', true);
            req.send();
            req.onload = function () {
                var data = JSON.parse(this.responseText),
                    div = document.createElement('div');
                div.id = 'book-content';
                div.innerHTML = renderTemplate(tpl, data);
                document.querySelector('#app-content').appendChild(div);
                pages[href] = div;
                //debugger
            };
        }
    }

    router.addRoute(regexp, handlePage);
})();

onload = function () {
    router.handleRoute(window.location.href, true);
}