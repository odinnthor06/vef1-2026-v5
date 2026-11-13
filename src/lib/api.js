
import { sleep, error } from './helpers.js';

/** Hámarksfjöldi hráefna í svari frá API. */
const MAX_INGREDIENTS = 20;

/* TODO útfæra rest */
export class MealApi {
  /**
   * @param {string} baseUrl API base url.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.simulateError = false;
    this.simulateDelay = false;
  }

  /**
   * @param {string} query
   * @returns {Promise<import('./meal.types.js').MealResponse>}
   */
  async search(query) {
    if (this.simulateDelay) await sleep(2);
    if (this.simulateError) error('Villa í leit');

    return myFetch(
      this.baseUrl + 'search.php?s=' + encodeURIComponent(query)
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<import('./meal.types.js').MealResponse>}
   */
  async getMeal(id) {
    if (this.simulateDelay) await sleep(2);
    if (this.simulateError) error('Villa í uppskrift');

    return myFetch(
      this.baseUrl + 'lookup.php?i=' + encodeURIComponent(id)
    );
  }
}


export const searchUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
export const itemUrl = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

/**
 * @param {string} url
 * @returns {Promise<import('./meal.types.js').MealResponse>}
 */
export async function myFetch(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Ekki tókst að sækja gögn');
  }

  const json = await response.json();
  return json;
}
