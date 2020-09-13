import {Router} from './router/router.js';
import {routes} from './router/routes.js';

document.addEventListener("DOMContentLoaded", () => {
    Router.init(routes).then();
});