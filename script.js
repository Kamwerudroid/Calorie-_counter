// script.js

// 1. HTML elements
const form = document.getElementById('calorie-form');
const foodInput = document.getElementById('food-input');
const calorieInput = document.getElementById('calorie-input');
const foodList = document.getElementById('food-list');
const totalCaloriesDisplay = document.getElementById('total-calories');
const resetBtn = document.getElementById('reset-btn');

// 2. Local Storage
let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];

// 3. Main functions

/**
 * Renders the food items list and updates the total calorie count.
 */
function renderFoodItems() {
    // Clear the current list
    foodList.innerHTML = '';
    
    if (foodItems.length === 0) {
        foodList.innerHTML = `
            <li class="text-center text-gray-500 py-4">
                No food items added yet.
            </li>
        `;
    } else {
        // Loop through the foodItems array and create a list item for each
        foodItems.forEach(item => {
            const li = document.createElement('li');
            li.dataset.id = item.id; // Store ID for removal
            li.className = 'flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm';
            li.innerHTML = `
                <div class="font-medium text-gray-700">${item.name}</div>
                <div class="flex items-center gap-4">
                    <span class="text-lg text-gray-600">${item.calories} calories</span>
                    <button class="remove-btn bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors" title="Remove item">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            `;
            foodList.appendChild(li);
        });
    }

    // Update the total calorie count
    updateTotalCalories();
}

/**
 * Calculates and updates the total calories displayed on the page.
 */
function updateTotalCalories() {
    // Use the `reduce` method to sum up all calories in the array
    const total = foodItems.reduce((sum, item) => sum + item.calories, 0);
    totalCaloriesDisplay.textContent = total;
}

/**
 * Adds a new food item to the state array and saves it to localStorage.
 * @param {string} name - The name of the food.
 * @param {number} calories - The calorie count.
 */
function addFood(name, calories) {
    const newFood = {
        id: Date.now(), 
        name,
        calories: Number(calories)
    };
    foodItems.push(newFood);
    saveFoodItems();
    renderFoodItems();
}

/**
 * Removes a food item from the state array based on its ID.
 * @param {number} id - 
 */
function removeFood(id) {
    // Filter the foodItems array to create a new array without the item to be removed
    foodItems = foodItems.filter(item => item.id !== Number(id));
    saveFoodItems();
    renderFoodItems();
}

/**
 * Saves the current state of the foodItems array to localStorage.
 */
function saveFoodItems() {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
}

/**
 * Resets the calorie counter by clearing the state and localStorage.
 */
function resetTracker() {
    if (confirm("Are you sure you want to reset the calorie tracker? This action cannot be undone.")) {
        foodItems = [];
        localStorage.removeItem('foodItems');
        renderFoodItems();
    }
}

// 4. Set up Event Listeners

// A. Handle form submission to add a new food item
form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const food = foodInput.value.trim();
    const calories = calorieInput.value.trim();

    if (food && calories) {
        addFood(food, calories);
        // Clear the form fields after submission
        foodInput.value = '';
        calorieInput.value = '';
    }
});

// B. Removes items
foodList.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-btn');
    if (removeBtn) {
        const li = removeBtn.closest('li');
        const id = li.dataset.id;
        removeFood(id);
    }
});

// C. Reset button
resetBtn.addEventListener('click', resetTracker);

// 5. Call to render items when the page loads
renderFoodItems();


/*
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const food = foodInput.value.trim();

    if (food) {
        // Here you would make a real API call to get calorie data
        try {
            const response = await fetch(`https://api.example.com/calories?food=${food}`);
            const data = await response.json();
            const calories = data.calories; // Or whatever the API returns
            addFood(food, calories);
            foodInput.value = '';
        } catch (error) {
            console.error('Error fetching calories:', error);
            alert('Failed to get calorie data. Please enter manually.');
        }
    }
});
*/