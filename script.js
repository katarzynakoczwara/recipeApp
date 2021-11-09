const apiKey = '84bd93946d2341dd99aa7d098f60db3c';

const input = document.querySelector('.search-recipe');
const categories = document.querySelectorAll('.categories__category');
const recipesArea = document.querySelector('.recipes-area');
const error = document.querySelector('.recipes-area__error');
const shadow = document.querySelector('.shadow');
const recipeContainer = document.querySelector('.recipe-container');
const recipeName = document.querySelector('.recipe-container__name');
const recipeTime = document.querySelector('.recipe-container__time');
const recipeServings = document.querySelector('.recipe-container__servings');
const recipeImage = document.querySelector('.recipe-container__image');
const recipeIngredients = document.querySelector('.recipe-container__ingredients');
const recipeInstructions = document.querySelector('.recipe-container__instructions');
const backToRecipeBtn = document.querySelector('.recipe-container__close-btn');
const popup = document.querySelector('.popup');
const closePopupBtn = document.querySelector('.popup__close-btn');

let recipeIdByCategory= [];
let randomRecipeId = [];
let recipeIdByInput = [];

const getRandomRecipies = async () => {      
    try {
        const url = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=9`);
        const responseJson = await url.json();
        console.log(responseJson)
        for(let i = 0; i < responseJson.recipes.length; i++) {
            console.log(responseJson.recipes[i].image);
            console.log(i)
            if(responseJson.recipes[i].image && !randomRecipeId.includes(responseJson.recipes[i].id)) {
                createRecipeBox(responseJson.recipes[i].image, responseJson.recipes[i].title, responseJson.recipes[i].id);
                randomRecipeId.push(responseJson.recipes[i].id);
            } else {
                i--;
            }
        }

        if(responseJson.recipes.length === 9) {
            const btn = document.querySelector('.recipes-area__load-more-btn');
            if(btn !== null) {
                recipesArea.removeChild(btn);
            }
            createBtn('getRandomRecipies');
        }

        
    } catch(e) {
        console.log(e);
    }
}

const getRecipeByCategory = async categoryName => {
    try {
        const url = await fetch(`https://api.spoonacular.com/recipes/random?tags=${categoryName}&apiKey=${apiKey}&number=9`);
        const responseJson = await url.json();
        for(let i = 0; i < responseJson.recipes.length; i++) {
            if(responseJson.recipes[i].image && !recipeIdByCategory.includes(responseJson.recipes[i].id)) {
                createRecipeBox(responseJson.recipes[i].image, responseJson.recipes[i].title, responseJson.recipes[i].id);   
                recipeIdByCategory.push(responseJson.recipes[i].id);
            } else {
                i--;
            }      
        }
        const btn = document.querySelector('.recipes-area__load-more-btn');
        if(btn !== null) {
            recipesArea.removeChild(btn);
        }
        createBtn('getRecipeByCategory', categoryName);
    } catch(e) {
        console.log(e)
    }    
}

const checkKey = e => {
    const value = input.value;   
    if(e.key === 'Enter' && value !== '') {
        validateInput(value);
    }
}

const validateInput = inputValue => {
    const re = /^[a-zA-Z\s]+$/;
    if(re.test(inputValue)) {
        getRecipeByInput(inputValue);
    } else {
        popup.classList.add('show');
        showShadow();
    }
}

const showShadow = () => {
    shadow.classList.add('show');
}

const removeShadow = () => {
    shadow.classList.remove('show');
}

const getRecipeByInput = async value => {
    try {
        const url = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${value}&number=9&apiKey=${apiKey}`);
        const responseJson = await url.json();
        console.log(responseJson)
        recipesArea.innerHTML = '';
        if(responseJson.results.length !== 0) {
            for(let i = 0; i < responseJson.results.length; i++ ) {
                if(responseJson.results[i].image && !recipeIdByInput.includes(responseJson.results[i].id)) {
                    createRecipeBox(responseJson.results[i].image, responseJson.results[i].title, responseJson.results[i].id);
                    recipeIdByInput.push(responseJson.results[i].id); 
                } 
            }          
            if(responseJson.results.length === 9) {
                const btn = document.querySelector('.recipes-area__load-more-btn');
                if(btn !== null) {
                    recipesArea.removeChild(btn);
                }
                createBtn('getRecipeByCategory', value);
            } 
        } else {
            const error = document.createElement('p');
            error.textContent = 'No recipe found :(';
            error.classList.add('recipes-area__error');
            recipesArea.appendChild(error);
        }        
    } catch(e) {
        console.log(e);
    }   
}

const createRecipeBox = (image, title, id) => {
    const recipe = document.createElement('div');
    recipe.classList.add('recipes-area__recipe');
    recipe.innerHTML = `<img src=${image} alt="recipe image"  class="recipes-area__img">
    <p class="recipes-area__name">${title}</p>`;  
    recipesArea.appendChild(recipe);   
    recipe.addEventListener('click', () => {
        getRecipe(id);
    });     
}

const createBtn = (fun, arg) => {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.classList.add('recipes-area__load-more-btn');
    loadMoreBtn.setAttribute('onclick', `${fun}('${arg}')`);
    loadMoreBtn.textContent = 'Load More Recipes';
    recipesArea.appendChild(loadMoreBtn);
}

const getRecipe = async id => {    
    try {
        const url = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
        const responseJson = await url.json();
        showShadow();
        recipeContainer.style.display = 'grid';
        recipeIngredients.innerHTML = '';
        recipeInstructions.innerHTML = '';
        const titleListIngredients = document.createElement('h4');
        titleListIngredients.textContent = 'Ingredients';
        titleListIngredients.classList.add('recipe-container__title-list');
        recipeIngredients.appendChild(titleListIngredients);
        const titleListInstructions = document.createElement('h4');
        titleListInstructions.textContent = 'Instructions';
        titleListInstructions.classList.add('recipe-container__title-list');
        recipeInstructions.appendChild(titleListInstructions);
        
        for(let i = 0; i < responseJson.extendedIngredients.length; i++) {
            const listItem = document.createElement('li');
            if(responseJson.extendedIngredients[i].consistency === 'solid') {
                listItem.textContent = `${responseJson.extendedIngredients[i].name} - ${responseJson.extendedIngredients[i].measures.us.amount}
                ${responseJson.extendedIngredients[i].measures.us.unitShort}`;
            } else {
                listItem.textContent = `${responseJson.extendedIngredients[i].name} - ${parseInt(responseJson.extendedIngredients[i].measures.metric.amount)}
                ${responseJson.extendedIngredients[i].measures.metric.unitShort}`;
            }
            
            recipeIngredients.appendChild(listItem);
        }
        for(let i = 0; i < responseJson.analyzedInstructions[0].steps.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = responseJson.analyzedInstructions[0].steps[i].step;
            recipeInstructions.appendChild(listItem);
        }
        recipeImage.setAttribute('src', responseJson.image)
        recipeName.textContent = responseJson.title;
        recipeTime.innerHTML = `${responseJson.readyInMinutes} min<i class="far fa-clock"></i>`;
        recipeServings.innerHTML = `${responseJson.servings}<i class="fas fa-user">`;
    } catch(e) {
        console.log(e)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

input.addEventListener('keyup', e => {
    checkKey(e);
});

categories.forEach(category => {
    category.addEventListener('click', () => {  
        recipesArea.innerHTML = '';     
        if(category.textContent === 'breakfast') {           
            getRecipeByCategory('breakfast');            
        } else if (category.textContent === 'main course') {           
            getRecipeByCategory('main course');            
        } else if (category.textContent === 'dessert') {
            getRecipeByCategory('dessert');            
        } else if (category.textContent === 'snack') {
            getRecipeByCategory('snack');
        }        
    })
});

backToRecipeBtn.addEventListener('click', () => {
    recipeContainer.style.display = 'none';
    removeShadow();
});

closePopupBtn.addEventListener('click', () => {
    popup.classList.remove('show'); removeShadow();
})

getRandomRecipies();