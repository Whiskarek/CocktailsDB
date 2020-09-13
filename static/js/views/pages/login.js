import {Page} from './page.js';
import {md5} from '../../utils/strings.js';
import {generateError, removeValidation} from '../../validator.js';

export class Login extends Page {

    constructor() {
        super('login', 'Login');
    }

    async onRender(element) {
        await super.onRender(element);

        this.signInHtml = element.querySelector('.sign-in-htm');
        this.btnSignIn = element.querySelector('#btn-sign-in');
        this.userSignIn = element.querySelector('#sign-in-user');
        this.passSignIn = element.querySelector('#sign-in-pass');

        this.signUpHtml = element.querySelector('.sign-up-htm');
        this.btnSignUp = element.querySelector('#btn-sign-up');
        this.userSignUp = element.querySelector('#sign-up-user');
        this.passSignUp = element.querySelector('#sign-up-pass');
        this.passRepSignUp = element.querySelector('#sign-up-pass-rep');
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        this.btnSignIn.addEventListener('click', this._signIn);
        this.btnSignUp.addEventListener('click', this._signUp);
    }

    validateSignIn() {
        removeValidation(this.signInHtml);
        let status = true;

        if (!this.userSignIn.value) {
            generateError(this.userSignIn);
            status = false;
        }

        if (!this.passSignIn.value) {
            generateError(this.passSignIn);
            status = false;
        }
        return status;
    }

    validateSignUp() {
        removeValidation(this.signUpHtml);
        let status = true;

        if (!this.userSignUp.value) {
            generateError(this.userSignUp);
            status = false;
        }

        if (!this.passSignUp.value) {
            generateError(this.passSignUp);
            status = false;
        }

        if (!this.passRepSignUp.value) {
            generateError(this.passRepSignUp);
            status = false;
        }

        if (this.passSignUp.value !== this.passRepSignUp.value) {
            generateError(this.passSignUp);
            generateError(this.passRepSignUp);
            status = false;
        }

        return status;
    }

    _signIn = (event) => {
        event.preventDefault();
        if (!this.validateSignIn()) {
            return;
        }
        // TODO: Sign In
    }

    _signUp = (event) => {
        event.preventDefault();
        if (!this.validateSignUp()) {
            return;
        }
        // TODO: Sign Up
    }
}