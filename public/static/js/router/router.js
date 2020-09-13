import {Header} from '../views/components/header.js';
import {Feed} from '../views/pages/feed.js';
import {render} from '../utils/render.js';

export class Router {
    static INSTANCE = null;

    constructor(routes) {
        this._routes = routes;
        window.addEventListener('popstate', event => this._onPopState(event));
        let headerContainer = document.getElementById('header');
        this.header = new Header(headerContainer);
        this.contentContainer = document.getElementById('content');
    }

    static async init(routes) {
        if (Router.INSTANCE !== null) {
            return Router.INSTANCE;
        }

        const path = window.location.pathname;
        window.history.replaceState({path}, path, path);
        const router = new Router(routes);
        await router._load_initial_url();
        Router.INSTANCE = router;
        firebase.auth().onAuthStateChanged(function(user) {
            router.header.render();
        });
        return Router.INSTANCE;
    }

    navigate(url) {
        if (this._current_page) {
            this._current_page.onDestroy();
        }
        history.pushState({}, "", url);
        let request = this.parseRequestURL();
        this.loadPage(this.parseCurrentURL(request), request).then();
    }

    async loadPage(url, request) {
        this.header.render().then();
        this._current_page = Feed;
        for (const {path, page, require_auth} of this._routes) {
            if (path === url) {
                if (require_auth) {
                    let user = firebase.auth().currentUser;
                    if (!user) {
                        await this.loadPage('/login');
                        return;
                    }
                }
                this._current_page = page;
                break;
            }
        }
        this._current_page = new this._current_page(request);

        await render(this.contentContainer, this._current_page)
    }

    async _onPopState() {
        if (this._current_page) {
            this._current_page.onDestroy();
        }
        let request = this.parseRequestURL();
        await this.loadPage(this.parseCurrentURL(request), request);
    }

    async _load_initial_url() {
        let url = window.location.pathname;
        this.navigate(url);
    }

    parseCurrentURL(request) {
        return (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
    }

    parseRequestURL() {
        let url = window.location.pathname;
        let r = url.split("/")
        let request = {
            resource: null,
            id: null,
            verb: null
        }
        request.resource = r[1]
        request.id = r[2]
        request.verb = r[3]

        return request
    }
}