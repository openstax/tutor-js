import qs from 'qs';
import {
    map, last, omit, pick, partial, remove, invoke, get,
    extend, memoize, compact, isEmpty, forEach, mapValues, cloneDeep,
} from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { matchPath } from 'react-router-dom';


class OXRouter {

    constructor() {
        this.currentMatch = this.currentMatch.bind(this);
        this.currentParams = this.currentParams.bind(this);
        this.currentState = this.currentState.bind(this);
        this.makePathname = this.makePathname.bind(this);
        this.isActive = this.isActive.bind(this);
        this.getRenderableRoutes = this.getRenderableRoutes.bind(this);
    }

    setRoutes(routes) {
        const { routeSettings, renderers } = OXRouter.separateRendersFromRoutes(routes);
        const mappedRoutes = mapRoutes(routeSettings);

        this.getRenderers = () => renderers;
        this.getRoutes = () => routeSettings;
        return this.getRoutesMap = () => mappedRoutes;
    }
    // eslint-disable-next-line
  currentMatch(path = window.location.pathname) {
        return cloneDeep(findRoutePathMemoed(path, this.getRoutesMap()));
    }

    currentQuery(options = {}) {
        return qs.parse((options.window || window).location.search.slice(1));
    }

    currentParams(options = {}) {
        const params = get(this.currentMatch((options.window || window).location.pathname), 'params', {});
        return mapValues(params, (value) => value === 'undefined' ? undefined : value);
    }

    currentState(options = {}) {
        return {
            params: this.currentParams(options),
            query: this.currentQuery(options),
        };
    }

    makePathname(name, params, options = {}) {
        const route = invoke(this.getRoutesMap()[name], 'toPath', params);

        if (!isEmpty(options.query)) {
            return `${route}?${qs.stringify(options.query)}`;
        } else {
            return route;
        }
    }

    isActive(name, params, options = {}) {
        const route = this.getRoutesMap()[name];
        return route && ((options.window || window).location.pathname === this.makePathname(name, params, options));
    }

    getRenderableRoutes() {
        const renderers = this.getRenderers();
        const routes = this.getRoutes();
        const routesMap = this.getRoutesMap();

        return traverseRoutes(routes, function(route) {
            if (renderers[route.name] == null) { return null; }
            route.render = renderers[route.name]();
            route.getParamsForPath = partial(getParamsByPath, routesMap[route.name].path);
            return route;
        });
    }
}

OXRouter.separateRendersFromRoutes = function(routes) {
    const renderers = {};

    const routeSettings = traverseRoutes(routes, function(route) {
        if (route.renderer != null) { renderers[route.name] = route.renderer; }
        return pick(route, 'path', 'name', 'routes', 'settings');
    });

    return { renderers, routeSettings };
};


var getParamsByPath = function(path, pathname = window.location.pathname) {
    const match = matchPath(pathname, { path });
    return (match != null ? match.params : undefined);
};

var traverseRoutes = function(routes, transformRoute) {
    const modifiedRoutes = compact(map(routes, function(route) {
        if (route.routes != null) {
            route = transformRoute(route);
            if (!route) { return null; }

            const nestedRoutes = traverseRoutes(route.routes, transformRoute);
            if (!isEmpty(nestedRoutes)) { route.routes = nestedRoutes; }
            return route;
        } else {
            return transformRoute(route);
        }
    }));
    remove(modifiedRoutes, isEmpty);
    return modifiedRoutes;
};


var mapRoutes = function(routes, paths = {}, parentPath = {}) {

    forEach(routes, function(route) {
        paths[route.name] = buildPathMemoed(route, parentPath);
        if (route.routes != null) { mapRoutes(route.routes, paths, paths[route.name]); }
    });

    return paths;
};

const buildPath = function(route, parent) {
    const path = omit(cloneDeep(parent), 'toPath', 'name');
    extend(
        path,
        pick(route, 'settings', 'name'),
        {
            path: parent.path ? `${parent.path}/${route.path}` : route.path,
        },
    );
    path.toPath = pathToRegexp.compile(path.path);
    return path;
};

var buildPathMemoed = memoize(buildPath);

const findRoutePath = function(pathname, mappedPaths) {
    const matchedEntrys = [];

    const matchedPaths = compact(map(mappedPaths, function(path) {
        const match = matchPath(pathname, { path: path.path });
        if (match) { matchedEntrys.push(path); }
        return match;
    }));

    if (matchedPaths.length) {
    // return deepest matches
        return extend(
            {},
            last(matchedPaths),
            {
                entry: last(matchedEntrys),
            },
        );
    } else {
        return null;
    }
};


var findRoutePathMemoed = memoize(findRoutePath);

export default OXRouter;
