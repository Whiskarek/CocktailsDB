import {Component} from './component.js';
import {Router} from '../../router/router.js';

export class Header extends Component {
    static profileNavId = '#header-profile-nav';
    static btnLoginId = '#btn-login';
    static btnLogoutId = '#btn-logout';
    static btnFeedId = '#btn-feed';
    static btnAddCocktailId = '#btn-add-coctail';

    static viewAuthorized = `
    <nav>
        <span id="username" class="login noedit"></span>
        <a id="btn-logout" class="btn-secondary">Log Out</a>
    </nav>
    `;

    static viewNotAuthorized = `
    <nav>
        <a id="btn-login" class="btn">Sign In</a>
    </nav>
    `;

    constructor(container) {
        super('header', container);
        this._authorized = false;

        this._renderType = 1;
    }

    async onPreRender(element) {
        await super.onPreRender(element);

        let user = firebase.auth().currentUser;
        this._authorized = !!user;
        if (this._authorized) {
            this._username = user.displayName;
        }
    }

    async onRender(element) {
        await super.onRender(element);

        let profile_nav = element.querySelector(Header.profileNavId);
        if (this._authorized) {
            profile_nav.innerHTML = Header.viewAuthorized;
            let username = element.querySelector('#username');
            username.innerText = this._username;
        } else {
            profile_nav.innerHTML = Header.viewNotAuthorized;
        }
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        let btnFeed = element.querySelector(Header.btnFeedId);
        let btnAddCocktail = element.querySelector(Header.btnAddCocktailId);

        btnFeed.addEventListener('click', () => {
            Router.INSTANCE.navigate('/');
        });
        btnAddCocktail.addEventListener('click', () => {
            Router.INSTANCE.navigate('/add');
        });

        if (this._authorized) {
            let btnLogout = element.querySelector(Header.btnLogoutId);

            btnLogout.addEventListener('click', () => {
                firebase.auth().signOut().then(() => {
                    Router.INSTANCE.navigate('/');
                });
            });
        } else {
            let btnLogin = element.querySelector(Header.btnLoginId);

            btnLogin.addEventListener('click', () => {
                Router.INSTANCE.navigate('/login');
            });
        }
    }


}