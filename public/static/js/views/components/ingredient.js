import {Component} from './component.js';
import {ingredients} from '../../ingredients.js';
import {generateError, removeValidation} from '../../validator.js';

export class Ingredient extends Component {
    constructor(element, id, editable, name, amount) {
        if (editable === true) {
            super('ingredient_add', element);
        } else {
            super('ingredient', element);
        }
        this.id = id;
        this.editable = editable;
        this.name = name;
        this.amount = amount;

        this.render().then();
    }

    async onRender(element) {
        await super.onRender(element);

        this._element = element.querySelector('.ingredient:not([id])');
        this._element.id = 'ingredient-' + this.id.toString();
        this.icon = this._element.querySelector('.ingredient-icon');
        if (this.editable) {
            this.amt = this._element.querySelector('.ingredient-amt');
            this._renderEditableData(this._element);
        } else {
            this._renderData(this._element);
        }
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        if (this.editable) {
            let rm = this._element.querySelector('.ingredient-rm');
            rm.addEventListener('click', this._onDestroy);

            this._ingredientSelector = this._element.querySelector('.ingredient-name');
            this._ingredientSelector.addEventListener('input', this._ingredientSelect);
            this._ingredientSelector.addEventListener('input', this._update);
            this.amt.addEventListener('input', this._update);
        }
    }

    _renderData(element) {
        let name = element.querySelector('.ingredient-name');
        name.innerText = ingredients[this.name].name;
        let desc = element.querySelector('.ingredient-desc');
        desc.innerText = this.amount.toString() + ' ml';
        this.icon.src = ingredients[this.name].img_path;
    }

    _renderEditableData(element) {
        this._ingredientList = element.querySelector('#ingredient-list');
        Object.keys(ingredients).forEach((ingredient) => {
            let option = document.createElement('option');
            option.value = ingredients[ingredient].name;
            option.classList.add(ingredient);
            this._ingredientList.appendChild(option);
        });
    }

    _onDestroy = () => {
        this._element.remove();
        if (this.onDestroyListener) {
            this.onDestroyListener();
        }
    }

    _ingredientSelect = () => {
        let val = this._ingredientSelector.value;
        let opts = this._ingredientList.childNodes;
        this.ingr = val;
        this.icon.src = "";
        for (let i = 0; i < opts.length; i++) {
            if (opts[i].value === val) {
                this.icon.src = ingredients[opts[i].classList[0]].img_path;
                this.ingr = opts[i].classList[0];
                break;
            }
        }
    }

    _update = () => {
        if (!this.valid()) {
            return;
        }
        if (this.onUpdateListener) {
            this.onUpdateListener();
        }
    };

    validate() {
        if (!this.editable) {
            return true;
        }
        removeValidation(this._element);

        let status = true;
        if (!this.amt.value) {
            generateError(this.amt);
            status = false;
        }
        if (!this._ingredientSelector.value || !ingredients[this.ingr]) {
            generateError(this._ingredientSelector);
            status = false;
        }
        return status;
    }

    valid() {
        if (!this.amt.value) {
            return false;
        }
        if (!this._ingredientSelector.value || !ingredients[this.ingr]) {
            return false;
        }
        return true;
    }

    setOnDestroyListener(onDestroyListener) {
        this.onDestroyListener = onDestroyListener;
    }

    setOnUpdateListener(onUpdateListener) {
        this.onUpdateListener = onUpdateListener;
    }

    get json() {
        return {
            name: this.ingr,
            amount: Number(this.amt.value)
        };
    }
}