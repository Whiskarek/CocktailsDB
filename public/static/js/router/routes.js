import {Feed} from '../views/pages/feed.js';
import {View} from '../views/pages/view.js';
import {Constructor} from '../views/pages/constructor.js';
import {Login} from '../views/pages/login.js';

export const routes = [
    {
        path: '/',
        page: Feed,
    },
    {
        path: '/cocktail/:id',
        page: View,
    },
    {
        path: '/add',
        page: Constructor,
        require_auth: true
    },
    {
        path: '/login',
        page: Login,
    }
];