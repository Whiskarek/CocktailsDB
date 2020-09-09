import {Component} from './component.js';
import {Router} from '../../router/router.js';

export class Header extends Component {
    static profileNavId = 'header-profile-nav';
    static btnLoginId = 'btn-login';
    static btnFeedId = 'btn-feed';
    static btnAddCocktailId = 'btn-add-coctail';

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

    onRender() {
        super.onRender();

        let profile_nav = document.getElementById(Header.profileNavId);
        if (this._authorized) {
            profile_nav.innerHTML = Header.viewAuthorized;
        } else {
            profile_nav.innerHTML = Header.viewNotAuthorized;
        }
    }

    onPostRender() {
        super.onPostRender();

        let btnFeed = document.getElementById(Header.btnFeedId);
        let btnAddCocktail = document.getElementById(Header.btnAddCocktailId);

        btnFeed.addEventListener('click', () => {
            Router.INSTANCE.loadPage('/');
        });
        btnAddCocktail.addEventListener('click', () => {
            Router.INSTANCE.loadPage('/add');
        });

        if (this._authorized) {
            // TODO
        } else {
            let btnLogin = document.getElementById(Header.btnLoginId);

            btnLogin.addEventListener('click', () => {
                Router.INSTANCE.loadPage('/login');
            });
        }
    }


}