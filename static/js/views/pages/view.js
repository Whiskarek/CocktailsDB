import {Page} from './page.js';
import {cocktails} from '../../utils/tmp_cocktails.js';
import {Rating} from '../components/rating.js';
import {Comment} from '../components/comment.js';
import {Ingredient} from '../components/ingredient.js';
import {Glass} from '../components/glass.js';

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

    constructor(cocktail_id) {
        super('view', 'View');
        this.id = cocktail_id;
    }

    async onPreRender(element) {
        await super.onPreRender(element);

        await this._loadCocktail();
    }

    async onRender(element) {
        await super.onRender(element);

        await this._renderData(element)
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        this.btnAddComment = element.querySelector('#add-comment');
        this.btnAddComment.addEventListener('click', this._addComment);
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
        let cocktail = cocktails[0];
        this.id = cocktail.id;
        this.name = cocktail.name;
        this._viewDisplayedName = this.name;
        this.by = cocktail.by;
        this.desc = cocktail.desc;
        this.rating = cocktail.rating;
        this.ingredients = cocktail.ingredients;
        this.comments = cocktail.comments;
    }

    _addComment = () => {
        let comment = new Comment(this.commentsContainer, this.comments.length, true);
        comment.setOnPublishListener(() => {
            this._insertComment(comment.json);
            this.btnAddComment.style.display = '';
        });
        this.btnAddComment.style.display = 'none';
    }

    _insertComment(comment) {
        cocktails[this.id].comments.push(comment);
        cocktails[this.id].rating =
            cocktails[this.id].comments
                .map(c => c.rating)
                .reduce((a, b) => a + b, 0) / cocktails[this.id].comments.length;
        this.ratingField.rating = cocktails[this.id].rating;
        this._renderComments(this.commentsContainer).then();

    }
}