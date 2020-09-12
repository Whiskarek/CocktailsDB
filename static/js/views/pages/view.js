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

    static commentsContainer = '#comments';

    static btnAddComment = `
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

    async _renderData(element) {
        let name = element.querySelector(View.nameId);
        name.innerText = this.name;
        let by = element.querySelector(View.byId);
        by.innerText = this.by;
        let desc = element.querySelector(View.descId);
        desc.innerText = this.desc;
        let rating = element.querySelector(View.ratingId);
        this.ratingComponent = new Rating(false, this.rating);
        await this.renderComponent(rating, this.ratingComponent);

        let commentsContainer = element.querySelector(View.commentsContainer);
        await this._renderComments(commentsContainer);

        let ingredientsContainer = element.querySelector(View.ingredientsId);
        await this._renderIngredients(ingredientsContainer);

        let img = element.querySelector(View.imgId);
        new Glass(this.id, this.ingredients, img);
    }

    async _renderComments(container) {
        for (let i = 0; i < this.comments.length; ++i) {
            await this.renderComponent(container, new Comment(i, this.comments[i]));
        }
    }

    async _renderIngredients(container) {
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
        this.img = cocktail.img;
        this.desc = cocktail.desc;
        this.rating = cocktail.rating;
        this.ingredients = cocktail.ingredients;
        this.comments = cocktail.comments;
    }
}