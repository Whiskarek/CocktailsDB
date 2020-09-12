import {Component} from './component.js';
import {Rating} from './rating.js';

export class Comment extends Component {
    static CommentClass = '.comment:not([id])';
    static userClass = '.username';
    static textClass = '.text';
    static ratingClass = '.rating';

    constructor(id, data) {
        super('comment');
        this.id = id;
        this.user = data.user;
        this.text = data.text;
        this.rating = data.rating;
    }

    async onRender(element) {
        await super.onRender(element);

        this._element = element.querySelector(Comment.CommentClass);
        this._renderData(this._element);
    }

    _renderData(element) {
        element.id = 'comment-' + this.id.toString();
        let user = element.querySelector(Comment.userClass);
        user.innerText = this.user;
        let text = element.querySelector(Comment.textClass);
        text.innerText = this.text;
        let rating = element.querySelector(Comment.ratingClass);
        this.renderComponent(rating, new Rating(false, this.rating)).then();
    }
}