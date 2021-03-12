const $navHome = document.querySelector('.fa-home');
$navHome.addEventListener('click', navHome);

const $navSearch = document.querySelector('.fa-search');
$navSearch.addEventListener('click', navSearch);

const $navLog = document.querySelector('.fa-list');
$navLog.addEventListener('click', navLog);

const $navProgress = document.querySelector('.fa-chart-bar');
$navProgress.addEventListener('click', navProgress);

const $goalForm = document.querySelector('.goal.form');
$goalForm.addEventListener('submit', setGoal);

const $fruitInput = document.querySelector('.fruit-input');
const $vegInput = document.querySelector('.veg-input');

const $searchForm = document.querySelector('.search.form');
$searchForm.addEventListener('submit', submitSearch);

const $searchBar = document.querySelector('.search-bar');
$searchBar.addEventListener('input', delaySearchSuggestions);

let delaySearchSuggestionsID = null;

const $searchBarSuggestions = document.querySelector('.search-bar-suggestions');
$searchBarSuggestions.addEventListener('click', clickSearchSuggestion);

const $results = document.querySelectorAll('.result');
const $imgResults = document.querySelectorAll('.img-result');
const $spinners = document.querySelectorAll('.spinner');
const $textResults = document.querySelectorAll('.text-result');
const $resultsPage = document.querySelector('.results-page');
const $resultsPageTitle = document.querySelector('.search-results');
const $resultListDiv = document.querySelector('.result-list-div');
const $searchHeader = document.querySelector('.result-header');
const $noResults = document.querySelector('.no-results');
const $searchLoader = document.querySelector('.search.loader');
let imagesLoadedCount = 0;

const $resultList = document.querySelector('.result-list');
$resultList.addEventListener('click', clickResultList);

const $addFruitButton = document.querySelector('.add-fruit');
$addFruitButton.addEventListener('click', clickAddFruit);

const $addVegButton = document.querySelector('.add-veg');
$addVegButton.addEventListener('click', clickAddVeg);

const $dailyLogPage = document.querySelector('.daily-log-page');
const $fruitLog = document.querySelector('.fruit-log');
const $vegLog = document.querySelector('.veg-log');
const $noFruit = document.querySelector('.no-fruit');
const $noVeg = document.querySelector('.no-veg');

const $itemDetailsPage = document.querySelector('.item-details-page');
const $itemDetailsImg = document.querySelector('.item-details-img');
const $itemDetailsName = document.querySelector('.item-details-name');
const $detailsLoader = document.querySelector('.details.loader');
const $nutritionTable = document.querySelector('.nutrition-table');
const $nutritionFoodName = document.querySelector('.nutrition-food-name');
const $servingSize = document.querySelector('.serving-size');
const $calories = document.querySelector('.calories');
const $caloriesFat = document.querySelector('.calories-fat');
const $totalFat = document.querySelector('.total-fat');
const $sodium = document.querySelector('.sodium');
const $potassium = document.querySelector('.potassium');
const totalCarbs = document.querySelector('.total-carbs');
const $fiber = document.querySelector('.fiber');
const $sugar = document.querySelector('.sugar');
const $protein = document.querySelector('.protein');
const $totalFatPercent = document.querySelector('.total-fat-percent');
const $sodiumPercent = document.querySelector('.sodium-percent');
const $potassiumPercent = document.querySelector('.potassium-percent');
const $totalCarbsPercent = document.querySelector('.total-carbs-percent');
const $fiberPercent = document.querySelector('.fiber-percent');

const $progressPage = document.querySelector('.progress-page');
const $fruitProgress = document.querySelector('.fruit-progress');
const $fruitBar = document.querySelector('.fruit-bar');
const $vegProgress = document.querySelector('.veg-progress');
const $vegBar = document.querySelector('.veg-bar');

const $overlay = document.querySelector('.overlay');
const $welcomeModal = document.querySelector('.welcome-modal');
const $goalModal = document.querySelector('.goal-modal');
const $searchModal = document.querySelector('.search-modal');
const $searchDiv = document.querySelector('.search-div');
const $logModal = document.querySelector('.log-modal');
const $progressModal = document.querySelector('.progress-modal');

const $welcomeContinue = document.querySelector('.welcome.continue');
$welcomeContinue.addEventListener('click', clickWelcomeContinue);

const $goalContinue = document.querySelector('.goal.continue');
$goalContinue.addEventListener('click', clickGoalContinue);

const $searchContinue = document.querySelector('.search.continue');
$searchContinue.addEventListener('click', clickSearchContinue);

const $logContinue = document.querySelector('.log.continue');
$logContinue.addEventListener('click', clickLogContinue);

const $getStarted = document.querySelector('.get-started');
$getStarted.addEventListener('click', clickGetStarted);

const $exit = document.querySelectorAll('.exit');
for (let i = 0; i < $exit.length; i++) {
  $exit[i].addEventListener('click', clickExitModal);
}

const $info = document.querySelector('.info');
$info.addEventListener('click', clickInfo);

const $infoModalKnow = document.querySelector('.info-modal.know');
const $infoModalGoal = document.querySelector('.info-modal.goal');

const $infoNext = document.querySelector('.info-next');
$infoNext.addEventListener('click', clickInfoNext);

const $infoExitKnow = document.querySelector('.exit.know');
$infoExitKnow.addEventListener('click', clickInfoExitKnow);

const $infoExitGoal = document.querySelector('.exit.goal');
$infoExitGoal.addEventListener('click', clickInfoExitGoal);

if (data.newUser) {
  $welcomeModal.className = 'welcome-modal';
  $overlay.className = 'overlay';
} else {
  $welcomeModal.className = 'welcome-modal hidden';
  $overlay.className = 'overlay hidden';
}

function navHome(event) {
  hideAllViews();
  data.view = 'home';
  $goalForm.className = 'goal form';
}

function navSearch(event) {
  hideSearchSuggestions();
  hideAllViews();
  data.view = 'search input';
  $searchForm.className = 'search form';
  $searchForm.reset();
  $searchBar.focus();
}

function navLog(event) {
  if (!data.logUpdated) {
    loadDailyLog();
  }
  hideAllViews();
  data.view = 'daily log';
  $dailyLogPage.className = 'daily-log-page';
}

function navProgress(event) {
  if (!data.progressUpdated) {
    loadProgress();
  }
  hideAllViews();
  data.view = 'progress page';
  $progressPage.className = 'progress-page';
}

function setGoal(event) {
  event.preventDefault();
  data.fruitGoal = $goalForm.elements.fruit.value;
  data.veggieGoal = $goalForm.elements.veg.value;
  navSearch();
}

function delaySearchSuggestions() {
  clearTimeout(delaySearchSuggestionsID);
  const input = $searchBar.value;
  if (input.length < 3) {
    hideSearchSuggestions();
    return;
  }
  for (let i = 0; i < 4; i++) {
    $spinners[i].className = 'spinner';
    $imgResults[i].className = 'img-result hidden';
    $results[i].className = 'result';
  }
  delaySearchSuggestionsID = setTimeout(searchInput, 500);
}

function searchInput(event) {
  const input = $searchBar.value;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?branded=false&query=' + input);
  xhr.responseType = 'json';
  xhr.setRequestHeader('x-app-id', 'c1479c3a');
  xhr.setRequestHeader('x-app-key', '2f7f3b0e2a3ffe42df018fc46a4cc852');
  xhr.setRequestHeader('x-remote-user-id', 0);
  // console.log('xhr.status:', xhr.status);
  if (xhr.status !== 200) {
    hideSearchSuggestions();
    // console.log('Poor network connection. Please try again.');
  }
  xhr.addEventListener('load', () => {
    data.results = xhr.response.common;
    if (data.view === 'search input') {
      loadSearchSuggestions();
    } else {
      loadSearchResults(input);
    }
  });
  xhr.send();
}

function loadSearchSuggestions() {
  if (data.results.length < 4) {
    hideSearchSuggestions();
    return;
  }
  for (let i = 0; i < 4; i++) {
    $imgResults[i].setAttribute('src', data.results[i].photo.thumb);
    $imgResults[i].setAttribute('alt', data.results[i].food_name);
    $textResults[i].textContent = data.results[i].food_name;
    $results[i].setAttribute('data-food-name', data.results[i].food_name);
    $results[i].className = 'result';
    $imgResults[i].addEventListener('load', event => {
      $spinners[i].className = 'spinner hidden';
      $imgResults[i].className = 'img-result';
    });
  }
}

function hideSearchSuggestions() {
  for (let i = 0; i < 4; i++) {
    $results[i].className = 'result hidden';
  }
}

function clickSearchSuggestion(event) {
  if (event.target.className === 'search-bar') {
    return;
  }
  const foodResult = event.target.closest('.result');
  const foodName = foodResult.dataset.foodName;
  getNutritionFacts(foodName);
}

function submitSearch(event) {
  event.preventDefault();
  data.view = 'search results';
  clearTimeout(delaySearchSuggestionsID);
  while ($resultList.firstChild) {
    $resultList.removeChild($resultList.firstChild);
  }
  $searchLoader.className = 'search loader';
  $noResults.className = 'no-results hidden';
  $resultsPageTitle.textContent = 'Search results for "' + $searchBar.value + '"';
  $resultListDiv.className = 'result-list-div hidden';
  $resultsPage.className = 'results-page';
  $searchForm.className = 'search form hidden';
  searchInput();
}

function loadSearchResults(event) {
  if (data.results.length > 0) {
    for (let i = 0; i < data.results.length; i++) {
      const resultDiv = renderResult(data.results[i]);
      $resultList.append(resultDiv);
    }
  } else {
    $searchLoader.className = 'search loader hidden';
    $resultListDiv.className = 'result-list-div';
    $noResults.className = 'no-results';
    $searchHeader.className = 'result-header hidden';
  }
}

function renderResult(foodItem) {
  const $result = document.createElement('div');
  $result.className = 'result-div row pointer';
  $result.setAttribute('data-name', foodItem.food_name);
  const servingSize = foodItem.serving_qty + ' ' + foodItem.serving_unit;
  $result.setAttribute('data-serving-size', servingSize);
  $result.setAttribute('data-image', foodItem.photo.thumb);

  const $imgDiv = document.createElement('div');
  $imgDiv.className = 'img-div';
  $result.append($imgDiv);

  const $imgResult = document.createElement('img');
  $imgResult.className = 'img-result';
  $imgResult.setAttribute('src', foodItem.photo.thumb);
  $imgResult.setAttribute('alt', foodItem.food_name);
  $imgDiv.append($imgResult);

  $imgResult.addEventListener('load', () => {
    imagesLoadedCount++;
    if (imagesLoadedCount === 20) {
      $searchLoader.className = 'search loader hidden';
      $resultListDiv.className = 'result-list-div';
      imagesLoadedCount = 0;
    }
  });

  const $resultText = document.createElement('div');
  $resultText.className = 'result-text';
  $result.append($resultText);

  const $resultName = document.createElement('div');
  $resultName.className = 'result-name';
  $resultName.textContent = foodItem.food_name;
  $resultText.append($resultName);

  const $resultDescription = document.createElement('div');
  $resultDescription.className = 'result-description';
  $resultDescription.textContent = servingSize;
  $resultText.append($resultDescription);

  const $columnFourth = document.createElement('div');
  $columnFourth.className = 'column-one-fourth';
  $result.append($columnFourth);

  const $fruitIconDiv = document.createElement('div');
  $fruitIconDiv.className = 'icon-div fruit';
  $columnFourth.append($fruitIconDiv);

  const $fruitItemIcon = document.createElement('i');
  $fruitItemIcon.className = 'item-icon not-added-icon fas fa-apple-alt';
  $fruitIconDiv.append($fruitItemIcon);

  const $vegIconDiv = document.createElement('div');
  $vegIconDiv.className = 'icon-div veg';
  $columnFourth.append($vegIconDiv);

  const $vegItemIcon = document.createElement('i');
  $vegItemIcon.className = 'item-icon not-added-icon fas fa-carrot';
  $vegIconDiv.append($vegItemIcon);

  return $result;
}

function clickResultList(event) {
  const resultElement = event.target.closest('.result-div');
  if (event.target.matches('.item-icon')) {
    if (event.target.matches('.not-added-icon')) {
      clickResultListAdd(event.target, resultElement);
    } else {
      clickResultListRemove(event.target, resultElement);
    }
  } else {
    getNutritionFacts(resultElement.dataset.name);
  }
}

function clickResultListAdd(target, resultElement) {
  if (target.matches('.fa-apple-alt')) {
    target.className = 'item-icon added-icon fas fa-apple-alt';
    addItem('fruits', resultElement.dataset.name, resultElement.dataset.servingSize, resultElement.dataset.image);
  } else {
    target.className = 'item-icon added-icon fas fa-carrot';
    addItem('veggies', resultElement.dataset.name, resultElement.dataset.servingSize, resultElement.dataset.image);
  }
}

function clickResultListRemove(target, resultElement) {
  if (target.matches('.fa-apple-alt')) {
    target.className = 'item-icon not-added-icon fas fa-apple-alt';
    removeItem('fruits', resultElement.dataset.name);
  } else {
    target.className = 'item-icon not-added-icon fas fa-carrot';
    removeItem('veggies', resultElement.dataset.name);
  }
}

function clickAddFruit(event) {
  if ($addFruitButton.matches('.not-added')) {
    $addFruitButton.className = 'add-fruit add-button added';
    addItem('fruits', data.nutrition.food_name, data.nutrition.servingSize, data.nutrition.photo.thumb);
  } else {
    $addFruitButton.className = 'add-fruit add-button not-added';
    removeItem('fruits', data.nutrition.food_name);
  }
}

function clickAddVeg(event) {
  if ($addVegButton.matches('.not-added')) {
    $addVegButton.className = 'add-veg add-button added';
    addItem('veggies', data.nutrition.food_name, data.nutrition.servingSize, data.nutrition.photo.thumb);
  } else {
    $addVegButton.className = 'add-veg add-button not-added';
    removeItem('veggies', data.nutrition.food_name);
  }
}

function addItem(foodType, name, servingSize, image) {
  const foodObject = {
    name: name,
    servingSize: servingSize,
    image: image
  };
  data[foodType].push(foodObject);
  data.logUpdated = false;
  data.progressUpdated = false;
}

function removeItem(foodType, name) {
  for (let i = 0; i < data[foodType].length; i++) {
    if (data[foodType][i].name === name) {
      data[foodType].splice(i, 1);
      return;
    }
  }
  data.logUpdated = false;
  data.progressUpdated = false;
}

function getNutritionFacts(foodName) {
  hideAllViews();
  data.view = 'item details';
  $detailsLoader.className = 'details loader';
  $itemDetailsPage.className = 'item-details-page';
  $addFruitButton.className = 'add-fruit add-button not-added';
  $addVegButton.className = 'add-veg add-button not-added';
  $itemDetailsImg.className = 'item-details-img hidden';
  $nutritionTable.className = 'nutrition-table hidden';
  $itemDetailsImg.setAttribute('alt', foodName);
  $itemDetailsName.textContent = foodName;
  $nutritionFoodName.textContent = foodName;
  const body = {
    query: foodName
  };
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://trackapi.nutritionix.com/v2/natural/nutrients');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('x-app-id', 'c1479c3a');
  xhr.setRequestHeader('x-app-key', '2f7f3b0e2a3ffe42df018fc46a4cc852');
  xhr.setRequestHeader('x-remote-user-id', 0);
  xhr.addEventListener('load', () => {
    data.nutrition = xhr.response.foods[0];
    $itemDetailsImg.setAttribute('src', data.nutrition.photo.thumb);
    data.nutrition.servingSize = data.nutrition.serving_qty + ' ' + data.nutrition.serving_unit + ' (' + data.nutrition.serving_weight_grams + 'g)';
    $servingSize.textContent = data.nutrition.servingSize;
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
    $itemDetailsImg.addEventListener('load', event => {
      $detailsLoader.className = 'details loader hidden';
      $itemDetailsImg.className = 'item-details-img';
      $nutritionTable.className = 'nutrition-table';
    });
  });
  xhr.send(JSON.stringify(body));
}

function loadDailyLog() {
  if (data.fruits.length === 0) {
    $noFruit.className = 'no-fruit';
  } else {
    $noFruit.className = 'no-fruit hidden';
  }
  if (data.veggies.length === 0) {
    $noVeg.className = 'no-veg';
  } else {
    $noVeg.className = 'no-veg hidden';
  }
  while ($fruitLog.firstChild) {
    $fruitLog.removeChild($fruitLog.firstChild);
  }
  while ($vegLog.firstChild) {
    $vegLog.removeChild($vegLog.firstChild);
  }
  for (let i = 0; i < data.fruits.length; i++) {
    const renderedEntry = renderLogEntry(data.fruits[i]);
    $fruitLog.append(renderedEntry);
  }
  for (let i = 0; i < data.veggies.length; i++) {
    const renderedEntry = renderLogEntry(data.veggies[i]);
    $vegLog.append(renderedEntry);
  }
  data.isUpdated = true;
}

function renderLogEntry(entry) {
  const $result = document.createElement('div');
  $result.className = 'result-div row';

  const $imgDiv = document.createElement('div');
  $imgDiv.className = 'img-div';
  $result.append($imgDiv);

  const $imgResult = document.createElement('img');
  $imgResult.className = 'img-result';
  $imgResult.setAttribute('src', entry.image);
  $imgResult.setAttribute('alt', entry.name);
  $imgDiv.append($imgResult);

  const $resultText = document.createElement('div');
  $resultText.className = 'result-text';
  $result.append($resultText);

  const $resultName = document.createElement('div');
  $resultName.className = 'result-name';
  $resultName.textContent = entry.name;
  $resultText.append($resultName);

  const $resultDescription = document.createElement('div');
  $resultDescription.className = 'result-description';
  $resultDescription.textContent = entry.servingSize;
  $resultText.append($resultDescription);

  return $result;
}

function loadProgress() {
  const fruitPercent = 100 * data.fruits.length / data.fruitGoal;
  const vegPercent = 100 * data.veggies.length / data.veggieGoal;
  const reachedFruitGoal = fruitPercent >= 100;
  const reachedVegGoal = vegPercent >= 100;
  $fruitProgress.textContent = data.fruits.length + '/' + data.fruitGoal + ' completed (' + Math.floor(fruitPercent) + '%)';
  $vegProgress.textContent = data.veggies.length + '/' + data.veggieGoal + ' completed (' + Math.floor(vegPercent) + '%)';
  if (reachedFruitGoal) {
    $fruitBar.style.width = '100%';
    $fruitBar.style.backgroundColor = 'lightgreen';
    $fruitBar.textContent = 'You made it!';
  } else {
    $fruitBar.style.width = fruitPercent + '%';
  }
  if (reachedVegGoal) {
    $vegBar.style.width = '100%';
    $vegBar.style.backgroundColor = 'lightgreen';
    $vegBar.textContent = 'You made it!';
  } else {
    $vegBar.style.width = vegPercent + '%';
  }
}

function hideAllViews() {
  $goalForm.className = 'goal form hidden';
  $searchForm.className = 'search form hidden';
  $resultsPage.className = 'results-page hidden';
  $itemDetailsPage.className = 'item-details-page hidden';
  $dailyLogPage.className = 'daily-log-page hidden';
  $progressPage.className = 'progress-page hidden';
}

function clickExitModal(event) {
  modalReset();
  $welcomeModal.className = 'welcome-modal hidden';
  $goalModal.className = 'goal-modal hidden';
  $overlay.className = 'overlay hidden';
  $searchModal.className = 'search-modal hidden';
  $logModal.className = 'log-modal hidden';
  $progressModal.className = 'progress-modal hidden';
}

function clickWelcomeContinue(event) {
  $welcomeModal.className = 'welcome-modal hidden';
  $goalModal.className = 'goal-modal';
  $fruitInput.className = 'fruit-input highlight';
  $vegInput.className = 'veg-input highlight';
  $navHome.style.color = 'green';
}

function clickGoalContinue(event) {
  $goalModal.className = 'goal-modal hidden';
  $searchModal.className = 'search-modal';
  $goalForm.className = 'goal form hidden';
  $searchForm.className = 'search form';
  $navHome.style.color = 'white';
  $navSearch.style.color = 'green';
  $searchDiv.className = 'search-div row highlight';
}

function clickSearchContinue(event) {
  $searchModal.className = 'search-modal hidden';
  $logModal.className = 'log-modal';
  $searchForm.className = 'search form hidden';
  $dailyLogPage.className = 'daily-log-page';
  $navSearch.style.color = 'white';
  $navLog.style.color = 'green';
}

function clickLogContinue(event) {
  $logModal.className = 'log-modal hidden';
  $progressModal.className = 'progress-modal';
  $dailyLogPage.className = 'daily-log-page hidden';
  loadProgress();
  navProgress();
  $navLog.style.color = 'white';
  $navProgress.style.color = 'green';
}

function clickGetStarted(event) {
  clickExitModal();
  $goalForm.className = 'goal form';
  $progressPage.className = 'progres-page hidden';
  $navProgress.style.color = 'white';
}

function modalReset() {
  $navHome.style.color = 'white';
  $navLog.style.color = 'white';
  $navLog.style.color = 'white';
  $navProgress.style.color = 'white';
  $fruitInput.className = 'fruit-input';
  $vegInput.className = 'veg-input';
  $searchDiv.className = 'search-div row';
}

function clickInfo(event) {
  $infoModalKnow.className = 'info-modal know';
  $overlay.className = 'overlay';
}

function clickInfoNext(event) {
  $infoModalKnow.className = 'info-modal know hidden';
  $infoModalGoal.className = 'info-modal goal';
}

function clickInfoExitKnow(event) {
  $infoModalKnow.className = 'info-modal know hidden';
  $overlay.className = 'overlay hidden';
}

function clickInfoExitGoal(event) {
  $infoModalGoal.className = 'info-modal goal hidden';
  $overlay.className = 'overlay hidden';
}

// function networkError() {

// }
