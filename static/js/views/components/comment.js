import {Component} from './component.js';
import {Rating} from './rating.js';
import {generateError, removeValidation} from '../../validator.js';

export class Comment extends Component {
    static CommentClass = '.comment:not([id])';
    static userClass = '.username';
    static textClass = '.text';
    static ratingClass = '.rating';

    constructor(container, id, editable, data) {
        if (editable === true) {
            super('comment_add', container);
        } else {
            super('comment', container);
            this.user = data.user;
            this.text = data.text;
            this.rating = data.rating;
        }
        this.id = id;
        this.editable = editable;

        this.render().then();
    }

    async onPreRender(element) {
        await super.onPreRender(element);

        if (this.editable) {
            // TODO: load username
            this.user = 'admin';
            this.rating = 0;
        }
    }

    async onRender(element) {
        await super.onRender(element);

        this._element = element.querySelector(Comment.CommentClass);
        this._element.id = 'comment-' + this.id.toString();
        this.username = this._element.querySelector(Comment.userClass);
        this.username.innerText = this.user;
        let rating = this._element.querySelector(Comment.ratingClass);
        this.ratingField = new Rating(rating, this.editable, this.rating);
        this.textfield = this._element.querySelector(Comment.textClass);
        if (!this.editable) {
            this.textfield.innerText = this.text;
        }
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        if (this.editable) {
            this.btnPublish = element.querySelector('#publish');
            this.btnPublish.addEventListener('click', this._submit);
        }
    }

    validate() {
        if (!this.editable) {
            return true;
        }
        removeValidation(this._element);

        let status = true;
        if (!this.textfield.value) {
            generateError(this.textfield);
            status = false;
        }

        status &= this.ratingField.validate();

        return status;
    }

    _submit = (event) => {
        event.preventDefault();
        this.validate();
        if (this.onPublishListener) {
            this.onPublishListener();
        }

        this._element.remove();
    }

    setOnPublishListener(onPublishListener) {
        this.onPublishListener = onPublishListener;
    }

    get json() {
        return {
            user: this.user,
            text: this.textfield.value,
            rating: this.ratingField.rating
        };
    }
}