import {Component} from './component.js';

export class Rating extends Component {
    static star = `
        <svg height="25" width="23" class="star rating" data-rating="1">
            <polygon points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill-rule:nonzero;"/>
        </svg>
    `;

    constructor(editable, initialRating) {
        super();
        this._editable = editable;
        this._rating = initialRating;
    }

    async onRender(element) {
        await super.onRender(element);

        element.insertAdjacentElement('afterbegin', this._generateRating());
    }

    _generateRating() {
        let div = document.createElement('div');
        div.classList.add('stars');
        if (!this._editable) {
            div.classList.add('noedit');
        }
        div.setAttribute('data-stars', Math.floor(this._rating).toString());
        for (let i = 0; i < 5; i++) {
            div.insertAdjacentHTML('afterbegin', Rating.star);
        }
        return div;
    }
}