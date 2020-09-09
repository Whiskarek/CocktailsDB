import {render} from '../utils/render.js';

export class View {
    static PAGE = 0;
    static COMPONENT = 1;
    static basePath = '/static/views/';
    static basePagePath = View.basePath + 'pages/';
    static baseComponentPath = View.basePath + 'components/';

    constructor(name, displayedName, viewType) {
        this._viewName = name;
        this._viewDisplayedName = displayedName;
        this._viewType = viewType;
        this._viewPath = null;
        this._view = null;
    }

    async _load() {
        if (this.viewPath == null) {
            return '';
        }
        let response = await fetch(this.viewPath);
        if (!response.ok) {
            throw `ViewNotFound: Name: ${this._viewName} Type: ${this._viewType} Path: ${this.viewPath}`
        }

        return await response.text();
    }

    async onPreRender(element) {
    }

    async onRender(element) {
        if (this._viewType === View.COMPONENT) {
            element.insertAdjacentHTML('beforeend', await this.view());
        } else {
            element.innerHTML = await this.view();
        }
    }

    async onPostRender(element) {
    }

    async view() {
        if (this._view === null) {
            this._view = await this._load();
        }

        return this._view;
    }

    async renderComponent(component, view) {
        await render(component, view);
    }

    get viewPath() {
        if (this._viewName == null || this._viewPath != null) {
            return this._viewPath;
        }

        if (this._viewType === View.PAGE) {
            this._viewPath = View.basePagePath;
        } else if (this._viewType === View.COMPONENT) {
            this._viewPath = View.baseComponentPath;
        } else {
            throw `UnsupportedViewType: View: ${this._viewName} Type: ${this._viewType}`;
        }

        this._viewPath += this._viewName + '.html';
        return this._viewPath;
    }

    get displayedName() {
        return this._viewDisplayedName;
    }
}