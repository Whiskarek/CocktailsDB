import {Page} from './page.js';
import {Glass} from '../components/glass.js';
import {Ingredient} from '../components/ingredient.js';
import {generateError, removeValidation} from '../../validator.js';
import {cocktails} from '../../utils/tmp_cocktails.js';
import {Router} from '../../router/router.js';

export class Constructor extends Page {
    static nameId = '#name';
    static descId = '#desc';
    static imgId = '#img';
    static btnAddIngredientId = '#btn-add-ingredient';

    constructor() {
        super('constructor', 'Add Cocktail');
        this.ingredientsList = [];
    }

    async onRender(element) {
        await super.onRender(element);

        let img = element.querySelector(Constructor.imgId);
        this.glass = new Glass(0, this.ingredientsList, img);
        this.name = element.querySelector(Constructor.nameId);
        this.desc = element.querySelector(Constructor.descId);
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        this.form = element.querySelector('form');
        this.form.addEventListener('submit', this._submit);
        this.ingredientsListForm = element.querySelector('#ingrs');
        this.btnAddIngredient = element.querySelector(Constructor.btnAddIngredientId);
        this.btnAddIngredient.addEventListener('click', this._addIngredient);
    }

    _submit = (event) => {
        event.preventDefault();
        if (!this._prePublishChecks()) {
            return;
        }
        let newId = cocktails.length;
        cocktails[newId] = {
            id: newId,
            name: this.name.value,
            by: "by \"admin\"",
            desc: this.desc.value,
            rating: 0,
            ingredients: this.ingredientsList.map(i => i.json),
            comments: []
        }
        Router.INSTANCE.navigate(`/`);
    }

    _checkFieldsPresence() {
        let status = true;
        status &= this._checkNotBlank(this.name);
        status &= this._checkNotBlank(this.desc);
        if (!this.ingredientsListForm.querySelector('.ingredient')) {
            generateError(this.ingredientsListForm.parentNode);
            status = false;
        }
        for (let ingredient of this.ingredientsList) {
            status &= ingredient.validate();
        }
        return status;
    }

    _checkNotBlank(element) {
        if (!element.value) {
            generateError(element);
            return false;
        }
        return true;
    }

    _prePublishChecks() {
        removeValidation(this.form);
        return this._checkFieldsPresence();
    }

    _addIngredient = () => {
        let id = this.ingredientsList.length;
        let ingredient = new Ingredient(this.ingredientsListForm, id, true);
        ingredient.setOnDestroyListener(() => {
            for (let i = 0; i < this.ingredientsList.length; i++) {
                if (this.ingredientsList[i] === ingredient) {
                    this.ingredientsList.splice(i, 1);
                }
            }
            this.glass.update(this.ingredientsList);
        });
        ingredient.setOnUpdateListener(() => {
            this.glass.update(this.ingredientsList);
        });
        this.ingredientsList.push(ingredient);
    }
}