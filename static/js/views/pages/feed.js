import {Page} from './page.js';
import {CocktailCard} from '../components/cocktail_card.js';
import {cocktails} from '../../utils/tmp_cocktails.js';

export class Feed extends Page {
    static cardContainerId = '#card-container';

    constructor() {
        super('feed', 'Feed');
    }

    async onPreRender(element) {
        await super.onPreRender(element);

        this._cards = this._getCards();
    }

    async onRender(element) {
        await super.onRender(element);

        this.cardContainer = element.querySelector(Feed.cardContainerId);
        for (const card of this._cards) {
            await this.renderComponent(this.cardContainer, card);
        }
    }

    async onPostRender(doc) {
        await super.onPostRender(doc);
    }

    _getCards() {
        return cocktails.map((item) => new CocktailCard(item));
    }
}