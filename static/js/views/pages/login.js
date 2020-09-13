import {Page} from './page.js';
import {checkEmail} from '../../utils/strings.js';
import {generateError, removeValidation} from '../../validator.js';
import {Router} from '../../router/router.js';

export class Login extends Page {

    constructor() {
        super('login', 'Login');
    }

    async onRender(element) {
        await super.onRender(element);

        this.signInHtml = element.querySelector('.sign-in-htm');
        this.btnSignIn = element.querySelector('#btn-sign-in');
        this.emailSignIn = element.querySelector('#sign-in-email');
        this.passSignIn = element.querySelector('#sign-in-pass');

        this.signUpHtml = element.querySelector('.sign-up-htm');
        this.btnSignUp = element.querySelector('#btn-sign-up');
        this.userSignUp = element.querySelector('#sign-up-user');
        this.emailSignUp = element.querySelector('#sign-up-email');
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

        if (!this.emailSignIn.value || !checkEmail(this.emailSignIn.value)) {
            generateError(this.emailSignIn);
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

        if (!this.emailSignUp.value || !checkEmail(this.emailSignUp.value)) {
            generateError(this.emailSignUp);
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
        let email = this.emailSignIn.value;
        let password = this.passSignIn.value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => Router.INSTANCE.navigate('/'))
            .catch((error) => alert(error));
    }

    _signUp = (event) => {
        event.preventDefault();
        if (!this.validateSignUp()) {
            return;
        }
        let username = this.userSignUp.value;
        let email = this.emailSignUp.value;
        let password = this.passSignUp.value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(result => {
                return result.user.updateProfile({
                    displayName: username
                }).then(() => {
                    Router.INSTANCE.navigate('/');
                });
            }).catch(error => {
            alert(error);
        });
    }
}