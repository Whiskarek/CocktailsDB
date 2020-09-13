import {Component} from './component.js';
import {generateError, removeValidation} from '../../validator.js';

export class Rating extends Component {
    static star = (id) => `
        <svg height="25" width="23" class="star rating" data-rating="${id}">
            <polygon points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill-rule:nonzero;"/>
        </svg>
    `;

    constructor(container, editable, initialRating) {
        super(null, container);
        this._editable = editable;
        this._rating = initialRating;

        this._renderType = 1;
        this.render().then();
    }

    async onRender(element) {
        await super.onRender(element);

        element.insertAdjacentElement('afterbegin', this._generateRating());
        this._element = element;
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        if (this._editable) {
            this.stars = element.querySelector('.stars');
            element.querySelectorAll('.star.rating')
                .forEach(node =>
                    node.addEventListener('click', () => {
                            let rating = node.getAttribute('data-rating');
                            this._rating = Number(rating);
                            this.stars.setAttribute('data-stars', rating);
                        }
                    )
                );
        }
    }

    _generateRating() {
        let div = document.createElement('div');
        div.classList.add('stars');
        if (!this._editable) {
            div.classList.add('noedit');
        }
        div.setAttribute('data-stars', Math.floor(this._rating).toString());
        for (let i = 0; i < 5; i++) {
            div.insertAdjacentHTML('beforeend', Rating.star(i + 1));
        }
        return div;
    }

    validate() {
        if (!this._editable) {
            return true;
        }
        removeValidation(this._element);
        if (this.stars.getAttribute('data-stars') === '0') {
            generateError(this._element);
            return false;
        }
        return true;
    }

    get rating() {
        return this._rating;
    }

    set rating(rating) {
        this._rating = rating
        this._element.querySelector('.stars').setAttribute('data-stars', rating);
        this.render().then();
    }
}