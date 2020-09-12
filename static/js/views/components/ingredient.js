import {Component} from './component.js';

export class Ingredient extends Component {
    static iconsPath = '/static/images/ingredients/';
    static ingredientClass = '.ingredient:not([id])';
    static iconClass = '.ingredient-icon';
    static nameClass = '.ingredient-name';
    static descClass = '.ingredient-desc';

    constructor(id, name, amount) {
        super('ingredient');
        this.id = id;
        this.name = name;
        this.amount = amount;
    }

    async onRender(element) {
        await super.onRender(element);

        this._element = element.querySelector(Ingredient.ingredientClass);
        this._renderData(this._element);
    }

    _renderData(element) {
        element.id = 'ingredient-' + this.id.toString();
        let name = element.querySelector(Ingredient.nameClass);
        name.innerText = this.name;
        let desc = element.querySelector(Ingredient.descClass);
        desc.innerText = this.amount.toString() + ' ml';
        let icon = element.querySelector(Ingredient.iconClass);
        icon.src = Ingredient.iconsPath + this.name + '.png';
    }
}