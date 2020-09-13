import {Page} from './page.js';
import {Rating} from '../components/rating.js';
import {Comment} from '../components/comment.js';
import {Ingredient} from '../components/ingredient.js';
import {Glass} from '../components/glass.js';
import {Router} from '../../router/router.js';
import {insertIdInObj} from '../../utils/map.js';

export class View extends Page {
    static nameId = '#name';
    static byId = '#by';
    static imgId = '#img';
    static ratingId = '#rating';
    static descId = '#desc';
    static ingredientsId = '#ingredients';

    static commentsContainerId = '#comments';

    static btnAddCommentHtml = `
        <a id="add-comment" class="btn">Add Comment</a>
    `;

    constructor(request) {
        super('view', 'View');
        this.id = request.id;
    }

    async onPreRender(element) {
        await super.onPreRender(element);

        await this._loadCocktail();
        this.authernicated = !!firebase.auth().currentUser;
    }

    async onRender(element) {
        await super.onRender(element);

        this._element = element;
        await this._renderData(element)
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        if (this.authernicated) {
            let list = element.querySelector('.list');
            list.insertAdjacentHTML('beforeend', View.btnAddCommentHtml);
            this.btnAddComment = element.querySelector('#add-comment');
            this.btnAddComment.addEventListener('click', this._addComment);
        }
    }

    async _renderData(element) {
        let name = element.querySelector(View.nameId);
        name.innerText = this.name;
        let by = element.querySelector(View.byId);
        by.innerText = this.by;
        let desc = element.querySelector(View.descId);
        desc.innerText = this.desc;
        let rating = element.querySelector(View.ratingId);
        this.ratingField = new Rating(rating, false, this.rating);

        this.commentsContainer = element.querySelector(View.commentsContainerId);
        await this._renderComments(this.commentsContainer);

        let ingredientsContainer = element.querySelector(View.ingredientsId);
        await this._renderIngredients(ingredientsContainer);

        let img = element.querySelector(View.imgId);
        new Glass(this.id, this.ingredients, img);
    }

    async _renderComments(container) {
        container.innerHTML = '';
        for (let i = 0; i < this.comments.length; ++i) {
            new Comment(container, i, false, this.comments[i]);
        }
    }

    async _renderIngredients(container) {
        container.innerHTML = '';
        for (let i = 0; i < this.ingredients.length; ++i) {
            new Ingredient(container, i, false, this.ingredients[i].name, this.ingredients[i].amount);
        }
    }

    async _loadCocktail() {
        const snapshot = await firebase.database().ref('/cocktails/' + this.id).once('value');
        if (snapshot.exists()) {
            let cocktail = snapshot.val();
            this.name = cocktail.name;
            this._viewDisplayedName = this.name;
            this.by = cocktail.by;
            this.desc = cocktail.desc;
            this.rating = cocktail.rating;
            this.ingredients = cocktail.ingredients;
            this.comments = cocktail.comments || [];
            this.comments = insertIdInObj(this.comments);
            console.log(this.comments);
        } else {
            Router.INSTANCE.navigate('/')
        }
    }

    _addComment = () => {
        let comment = new Comment(this.commentsContainer, this.comments.length, true);
        comment.setOnPublishListener(() => {
            this._insertComment(comment.json).then();
            this.btnAddComment.style.display = '';
        });
        this.btnAddComment.style.display = 'none';
    }

    async _insertComment(comment) {
        let refComments = firebase.database().ref("cocktails/" + this.id + "/comments");
        let refCocktail = firebase.database().ref("cocktails/" + this.id);
        refComments.push(comment);
        const snapshot = await refComments.once("value");
        const comments = Object.values(snapshot.val());
        this.comments = comments;
        const ratings = comments.map((comment) => {
            return comment.rating
        });
        let rating = ratings.reduce((a, b) => a + b, 0) / comments.length;
        await refCocktail.update({rating: rating});
        this.ratingField.rating = rating;
        this._renderComments(this.commentsContainer).then();
    }
}