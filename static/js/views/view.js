export class View {
    static PAGE = 0;
    static COMPONENT = 1;
    static basePath = './static/views/';
    static basePagePath = View.basePath + 'pages/';
    static baseComponentPath = View.basePath + 'components/';

    constructor(name, displayedName, viewType) {
        this._name = name;
        this._displayedName = displayedName;
        this._type = viewType;
        this._viewPath = null;
        this._view = null;
    }

    async _load() {
        let response = await fetch(this.viewPath);
        if (!response.ok) {
            throw `ViewNotFound: Name: ${this._name} Type: ${this._type} Path: ${this.viewPath}`
        }

        return await response.text();
    }

    onRender() {

    }

    onPostRender() {
    }

    async view() {
        if (this._view === null) {
            this._view = await this._load();
        }

        return this._view;
    }

    get viewPath() {
        if (this._viewPath != null) {
            return this._viewPath;
        }

        if (this._type === View.PAGE) {
            this._viewPath = View.basePagePath;
        } else if (this._type === View.COMPONENT) {
            this._viewPath = View.baseComponentPath;
        } else {
            throw `UnsupportedViewType: View: ${this._name} Type: ${this._type}`;
        }

        this._viewPath += this._name + '.html';
        return this._viewPath;
    }

    get displayedName() {
        return this._displayedName;
    }
}