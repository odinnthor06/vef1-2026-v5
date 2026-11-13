
import { el, empty } from './elements.js';

export class MealSearcher {
  constructor(api, baseElement) {
    this.api = api;
    this.baseElement = baseElement;
  }

  /**
   * Birtir ákveðna uppskrift.
   * @param {string|null} id ID uppskriftar.
   */
  async render(id = null) {
    try {
      const result = await this.api.getMeal(id);

      if (!result.meals || result.meals.length === 0) {
        throw new Error('Uppskrift fannst ekki');
      }

      const meal = result.meals[0];
      const div = el('div');

      const img = el('img', { src: meal.strMealThumb });
      div.appendChild(img);

      const texti1 = 'Nafn rétts: ' + meal.strMeal;
      div.appendChild(el('p', {}, texti1));

      const texti2 = 'Týpa rétts: ' + meal.strCategory;
      div.appendChild(el('p', {}, texti2));

      const texti3 = 'Hvaðan rétturinn er: ' + meal.strArea;
      div.appendChild(el('p', {}, texti3));

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
          const blanda = ingredient + ': ' + (measure || '');
          div.appendChild(el('p', {}, blanda));
        }
      }

      if (meal.strYoutube) {
        const YT = el(
          'a',
          { href: meal.strYoutube },
          'Viltu horfa á myndband um hvernig á að gera þetta'
        );
        div.appendChild(YT);
      }

      if (meal.strInstructions) {
        const instructions = meal.strInstructions.split('\r\n');

        for (const instruction of instructions) {
          div.appendChild(el('p', {}, instruction));
        }
      }

      const lastSearch = sessionStorage.getItem('lastSearch');

      const back = el(
        'a',
        { href: `/?search=${encodeURIComponent(lastSearch ?? '')}` },
        'Til baka í leit'
      );

      div.appendChild(back);
      this.baseElement.appendChild(div);

    } catch (err) {
      console.error(err);

      empty(this.baseElement);

      this.baseElement.appendChild(
        el('p', {}, 'Ekki tókst að birta uppskrift')
      );

      const lastSearch = sessionStorage.getItem('lastSearch');

      this.baseElement.appendChild(
        el(
          'a',
          { href: `/?search=${encodeURIComponent(lastSearch ?? '')}` },
          'Til baka í leit'
        )
      );
    }
  }
}

/*

*/