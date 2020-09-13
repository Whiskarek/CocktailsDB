import {Header} from '../views/components/header.js';
import {render} from '../utils/render.js';
import {Feed} from '../views/pages/feed.js';

export class Router {
    static INSTANCE = null;

    constructor(routes) {
        this._routes = routes;
        this._current_page = null;
        window.addEventListener('popstate', event => this._onPopState(event));
    }

    static async init(routes) {
        if (Router.INSTANCE !== null) {
            return Router.INSTANCE;
        }

        const path = window.location.pathname;
        window.history.replaceState({path}, path, path);
        Router.INSTANCE = new Router(routes);
        await Router.INSTANCE._load_initial_url();
        return Router.INSTANCE;
    }

    async loadPage(url) {
        history.pushState({}, "", url);

        const content = document.getElementById('content');

        this._current_page = Feed;
        for (const {path, page} of this._routes) {
            if (path === url) {
                this._current_page = page;
                break;
            }
        }
        this._current_page = new this._current_page;

        await render(content, this._current_page)
    }

    async _onPopState(event) {
        let url = window.location.pathname;
        await this.loadPage(url);
    }

    async _load_initial_url() {
        const header = document.getElementById('header');
        await render(header, new Header());
        let url = window.location.pathname;
        await this.loadPage(url);
    }
}