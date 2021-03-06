import {Component} from './component.js';
import {Rating} from './rating.js';
import {Router} from '../../router/router.js';
import {Glass} from './glass.js';

export class CocktailCard extends Component {
    static CardClass = '.coctail-card:not([id])';
    static NameClass = '.coctail-name';
    static ImageClass = '.coctail-img';
    static DescClass = '.coctail-desc';
    static RatingClass = '.coctail-rating';

    constructor(data) {
        super('cocktail_card');
        this._id = data.id;
        this._name = data.name;
        this._desc = data.desc;
        this._rating = data.rating;
        this._ingredients = data.ingredients;

        if (this._desc.length > 200) {
            this._desc = this._desc.substring(0, 200) + '...';
        }
    }

    async onRender(element) {
        await super.onRender(element);

        this._element = element.querySelector(CocktailCard.CardClass);
        this._renderData(this._element);
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        this._element.addEventListener('click', () => {
            Router.INSTANCE.navigate(`/cocktail/${this._id.toString()}`);
        });
    }

    _renderData(element) {
        element.id = this._id.toString();
        let name = element.querySelector(CocktailCard.NameClass);
        name.innerText = this._name;
        let desc = element.querySelector(CocktailCard.DescClass);
        desc.innerText = this._desc;
        let rating = element.querySelector(CocktailCard.RatingClass);
        new Rating(rating, false, this._rating);
        let icon = element.querySelector(CocktailCard.ImageClass);
        new Glass(this._id, this._ingredients, icon);
    }

    get cocktailName() {
        return this._name;
    }

    get cocktailDescription() {
        return this._desc;
    }
}