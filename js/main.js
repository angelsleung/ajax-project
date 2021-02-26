var $goalForm = document.querySelector('.goal.form');
$goalForm.addEventListener('submit', setGoal);

var $navHome = document.querySelector('.fa-home');
$navHome.addEventListener('click', navHome);

var $navSearch = document.querySelector('.fa-search');
$navSearch.addEventListener('click', navSearch);

var $searchBar = document.querySelector('.search-bar');
$searchBar.addEventListener('input', delaySuggestions);

var $results = document.querySelectorAll('.result');
var $imgResults = document.querySelectorAll('.img-result');
var $textResults = document.querySelectorAll('.text-result');

var $searchForm = document.querySelector('.search.form');
$searchForm.addEventListener('submit', submitSearch);

var $searchBarSuggestions = document.querySelector('.search-bar-suggestions');
$searchBarSuggestions.addEventListener('click', clickSuggestion);

var $resultsPage = document.querySelector('.results-page');
var $resultsPageTitle = document.querySelector('.search-results');

var $resultList = document.querySelector('.result-list');
$resultList.addEventListener('click', clickResultList);

var $itemDetailsPage = document.querySelector('.item-details-page');
var $itemDetailsImg = document.querySelector('.item-details-img');
var $itemDetailsName = document.querySelector('.item-details-name');
var $nutritionFoodName = document.querySelector('.nutrition-food-name');
var $servingSize = document.querySelector('.serving-size');
var $calories = document.querySelector('.calories');
var $caloriesFat = document.querySelector('.calories-fat');
var $totalFat = document.querySelector('.total-fat');
var $sodium = document.querySelector('.sodium');
var $potassium = document.querySelector('.potassium');
var totalCarbs = document.querySelector('.total-carbs');
var $fiber = document.querySelector('.fiber');
var $sugar = document.querySelector('.sugar');
var $protein = document.querySelector('.protein');
var $totalFatPercent = document.querySelector('.total-fat-percent');
var $sodiumPercent = document.querySelector('.sodium-percent');
var $potassiumPercent = document.querySelector('.potassium-percent');
var $totalCarbsPercent = document.querySelector('.total-carbs-percent');
var $fiberPercent = document.querySelector('.fiber-percent');

var delaySuggestionsID = null;

function setGoal(event) {
  event.preventDefault();
  navSearch();
}

function searchInput(event) {
  var input = $searchBar.value;
  if (input.length < 2) {
    input = '';
    for (var i = 0; i < 4; i++) {
      $results[i].className = 'result hidden';
    }
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?branded=false&query=' + input);
  xhr.responseType = 'json';
  xhr.setRequestHeader('x-app-id', 'c1479c3a');
  xhr.setRequestHeader('x-app-key', '2f7f3b0e2a3ffe42df018fc46a4cc852');
  xhr.setRequestHeader('x-remote-user-id', 0);
  xhr.addEventListener('load', function () {
    data.results = xhr.response.common;
    if (data.view === 'search-input') {
      for (i = 0; i < 4; i++) {
        $results[i].className = 'result';
        $textResults[i].textContent = data.results[i].food_name;
        $imgResults[i].setAttribute('src', data.results[i].photo.thumb);
        $imgResults[i].setAttribute('alt', data.results[i].food_name);
      }
    } else {
      $resultsPageTitle.textContent = 'Search results for "' + input + '"';
      for (i = 0; i < data.results.length; i++) {
        var resultDiv = renderResult(data.results[i]);
        $resultList.append(resultDiv);
      }
    }
  });
  xhr.send();
}

function getNutritionFacts(foodName) {
  // console.log('foodName: ', foodName);
  var body = {
    query: foodName
  };
  // console.log('body:', body);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://trackapi.nutritionix.com/v2/natural/nutrients');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('x-app-id', 'c1479c3a');
  xhr.setRequestHeader('x-app-key', '2f7f3b0e2a3ffe42df018fc46a4cc852');
  xhr.setRequestHeader('x-remote-user-id', 0);
  xhr.addEventListener('load', function () {
    data.nutrition = xhr.response.foods[0];
    $itemDetailsImg.setAttribute('src', data.nutrition.photo.highres);
    $itemDetailsImg.setAttribute('alt', data.nutrition.food_name);
    $itemDetailsName.textContent = data.nutrition.food_name;
    $nutritionFoodName.textContent = data.nutrition.food_name;
    $servingSize.textContent = data.nutrition.serving_qty + ' ' + data.nutrition.serving_unit + ' (' + data.nutrition.serving_weight_grams + 'g)';
    $calories.textContent = Math.floor(data.nutrition.nf_calories);
    $caloriesFat.textContent = Math.floor(data.nutrition.nf_total_fat * 90) / 10;
    $totalFat.textContent = Math.floor(data.nutrition.nf_total_fat * 10) / 10 + 'g';
    $sodium.textContent = Math.floor(data.nutrition.nf_sodium) + 'mg';
    $potassium.textContent = Math.floor(data.nutrition.nf_potassium) + 'mg';
    totalCarbs.textContent = Math.floor(data.nutrition.nf_total_carbohydrate * 10) / 10 + 'g';
    $fiber.textContent = Math.floor(data.nutrition.nf_dietary_fiber * 10) / 10 + 'g';
    $sugar.textContent = Math.floor(data.nutrition.nf_sugars * 10) / 10 + 'g';
    $protein.textContent = Math.floor(data.nutrition.nf_protein * 10) / 10 + 'g';
    $totalFatPercent.textContent = Math.floor(data.nutrition.nf_total_fat * 100 / 78) + '%';
    $sodiumPercent.textContent = Math.floor(data.nutrition.nf_sodium * 100 / 2300) + '%';
    $potassiumPercent.textContent = Math.floor(data.nutrition.nf_potassium * 100 / 4700) + '%';
    $totalCarbsPercent.textContent = Math.floor(data.nutrition.nf_total_carbohydrate * 100 / 275) + '%';
    $fiberPercent.textContent = Math.floor(data.nutrition.nf_dietary_fiber * 100 / 28) + '%';
    $resultsPage.className = 'results-page hidden';
    $itemDetailsPage.className = 'item-details-page';
  });
  xhr.send(JSON.stringify(body));

  // return data.nutrition;
}

function delaySuggestions() {
  clearTimeout(delaySuggestionsID);
  delaySuggestionsID = setTimeout(searchInput, 500);
}

function clickSuggestion(event) {
  if (event.target.className === 'search-bar') {
    return;
  }
  getNutritionFacts();
}

function submitSearch(event) {
  event.preventDefault();
  data.view = 'search-results';
  clearTimeout(delaySuggestionsID);
  while ($resultList.firstChild) {
    $resultList.removeChild($resultList.firstChild);
  }
  searchInput();
  $searchForm.reset();
  for (var i = 0; i < 4; i++) {
    $results[i].className = 'result hidden';
  }
  $resultsPage.className = 'results-page';
  $searchForm.className = 'search form hidden';
}

function navHome(event) {
  data.view = 'home';
  hideAllViews();
  $goalForm.className = 'goal form';
}

function navSearch(event) {
  data.view = 'search-input';
  hideAllViews();
  $searchForm.className = 'search form';
  $searchBar.focus();
}

function renderResult(foodItem) {
  var result = document.createElement('div');
  result.className = 'result-div row';
  result.setAttribute('data-food-name', foodItem.food_name);

  var imgDiv = document.createElement('div');
  imgDiv.className = 'img-div';
  result.append(imgDiv);

  var imgResult = document.createElement('img');
  imgResult.className = 'img-result';
  imgResult.setAttribute('src', foodItem.photo.thumb);
  imgResult.setAttribute('alt', foodItem.food_name);
  imgDiv.append(imgResult);

  var resultText = document.createElement('div');
  resultText.className = 'result-text';
  result.append(resultText);

  var resultName = document.createElement('div');
  resultName.className = 'result-name';
  resultName.textContent = foodItem.food_name;
  resultText.append(resultName);

  var resultDescription = document.createElement('div');
  resultDescription.className = 'result-description';
  resultDescription.textContent = foodItem.serving_qty + ' ' + foodItem.serving_unit;
  resultText.append(resultDescription);

  var columnFourth = document.createElement('div');
  columnFourth.className = 'column-one-fourth';
  result.append(columnFourth);

  var fruitIconDiv = document.createElement('div');
  fruitIconDiv.className = 'icon-div fruit';
  columnFourth.append(fruitIconDiv);

  var fruitItemIcon = document.createElement('i');
  fruitItemIcon.className = 'item-icon fas fa-apple-alt';
  fruitIconDiv.append(fruitItemIcon);

  var vegIconDiv = document.createElement('div');
  vegIconDiv.className = 'icon-div veg';
  columnFourth.append(vegIconDiv);

  var vegItemIcon = document.createElement('i');
  vegItemIcon.className = 'item-icon fas fa-carrot';
  vegIconDiv.append(vegItemIcon);

  return result;
}

function clickResultList(event) {
  var resultElement = event.target.closest('.result-div');
  var foodName = resultElement.dataset.foodName;
  if (event.target.matches('.item-icon')) {
    event.target.style.color = 'lightgreen';
    if (event.target.matches('.fa-apple-alt')) {
      data.fruits.push(foodName);
    } else {
      data.veggies.push(foodName);
    }
  } else {
    getNutritionFacts(foodName);
  }
}

function hideAllViews() {
  $goalForm.className = 'goal form hidden';
  $searchForm.className = 'search form hidden';
  $resultsPage.className = 'results-page hidden';
  $itemDetailsPage.className = 'item-details-page hidden';
}
