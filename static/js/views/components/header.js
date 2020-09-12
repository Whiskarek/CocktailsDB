import {Component} from './component.js';
import {Router} from '../../router/router.js';

export class Header extends Component {
    static profileNavId = '#header-profile-nav';
    static btnLoginId = '#btn-login';
    static btnFeedId = '#btn-feed';
    static btnAddCocktailId = '#btn-add-coctail';

    // TODO: Authorized view
    static viewAuthorized = `
    
    `;

    static viewNotAuthorized = `
    <nav>
        <a id="btn-login" class="btn">Sign In</a>
    </nav>
    `;

    constructor(authorized) {
        super('header');
        this._authorized = authorized;
    }

    async onRender(element) {
        await super.onRender(element);

        let profile_nav = element.querySelector(Header.profileNavId);
        if (this._authorized) {
            profile_nav.innerHTML = Header.viewAuthorized;
        } else {
            profile_nav.innerHTML = Header.viewNotAuthorized;
        }
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        let btnFeed = element.querySelector(Header.btnFeedId);
        let btnAddCocktail = element.querySelector(Header.btnAddCocktailId);

        btnFeed.addEventListener('click', () => {
            Router.INSTANCE.loadPage('/');
        });
        btnAddCocktail.addEventListener('click', () => {
            Router.INSTANCE.loadPage('/add');
        });

        if (this._authorized) {
            // TODO
        } else {
            let btnLogin = element.querySelector(Header.btnLoginId);

            btnLogin.addEventListener('click', () => {
                Router.INSTANCE.loadPage('/login');
            });
        }
    }


}