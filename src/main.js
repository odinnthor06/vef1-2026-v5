
import { MealApi } from './lib/api.js';
import { el, empty } from './lib/elements.js';
import { MealSearcher } from './lib/meals.js';

/** Grunnslóð á API, `1` er ókeypis prófunarlykill. */
const API_BASE = 'https://www.themealdb.com/api/json/v1/1/';

const mealSearcherDiv = document.querySelector('.meal-searcher');

/**
 * @param {import('./lib/meal.types.js').MealResponse} searchResult
 * @param {Element} mealSearcherDiv
 */
function renderSearchResults(searchResult, mealSearcherDiv) {
  console.log('search results', searchResult, mealSearcherDiv);

  if (mealSearcherDiv.querySelector('.results-list')) {
    mealSearcherDiv.querySelector('.results-list').remove();
  }

  const meals = searchResult.meals ?? [];

  const searchResultsEl = document.createElement('ul');
  searchResultsEl.classList.add('results-list');

  for (const meal of meals) {
    console.log('meal', meal);
    const li = document.createElement('li');

    const syna = '?id=' + meal.idMeal;
    const a = el('a', { href: syna }, meal.strMeal);
    li.appendChild(a);

    const img = el('img', { src: meal.strMealThumb, alt: meal.strMeal });
    li.appendChild(img);

    searchResultsEl.appendChild(li);
  }

  mealSearcherDiv.appendChild(searchResultsEl);
}

/**
 * @param {SubmitEvent} e
 */
async function onSubmit(e) {
  e.preventDefault();
  console.log('e', e);

  if (!e.target) {
    return;
  }

  const formData = new FormData(e.target);
  const input = formData.get('input');
  const value = typeof input === 'string' ? input.trim() : null;

  if (value) {
    sessionStorage.setItem('lastSearch', value);

    await searchMeals(value);
  } else {
    console.log('value is null', input, e.target);
  }
}

/**
 * @param {string} value
 */
async function searchMeals(value) {
  try {
    const results = await api.search(value);

    if (!results.meals || results.meals.length === 0) {
      empty(mealSearcherDiv);
      createSearchForm(mealSearcherDiv);
      mealSearcherDiv.appendChild(
        el('p', {}, 'Engar uppskriftir fundust')
      );
      return;
    }

    empty(mealSearcherDiv);
    createSearchForm(mealSearcherDiv);
    renderSearchResults(results, mealSearcherDiv);
  } catch (err) {
    alert('Villa kom upp við leit');
    console.error(err);
  }
}

/**
 * @param {Element} root
 */
function createSearchForm(root) {
  const form = el(
    'form',
    { submit: onSubmit },
    el('input', { type: 'text', name: 'input' }),
    el('button', { type: 'submit' }, 'Leita'),
  );

  root.appendChild(form);
}

const api = new MealApi(API_BASE);

const mealSearcher = new MealSearcher(api, mealSearcherDiv);

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const search = params.get('search');

if (mealSearcherDiv) {
  if (id) {
    mealSearcher.render(id);
    window.history.replaceState(null, '', window.location.pathname);
  }

  createSearchForm(mealSearcherDiv);

  if (search !== null) {
    sessionStorage.setItem('lastSearch', search);
    searchMeals(search);
    window.history.replaceState(null, '', window.location.pathname);
  }
}
