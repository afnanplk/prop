document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            loadCategories(data);
        })
        .catch(error => console.error('Error loading JSON:', error));
});

function loadCategories(data) {
    const categoriesContainer = document.getElementById('categories');
    Object.keys(data).forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => loadProperties(category, data[category]));
        categoriesContainer.appendChild(button);
    });
}

function loadProperties(category, properties) {
    const propertiesContainer = document.getElementById('properties');
    propertiesContainer.innerHTML = '';
    const outputContainer = document.getElementById('output-container');
    
    Object.keys(properties).forEach(property => {
        const button = document.createElement('button');
        button.textContent = property;
        button.addEventListener('click', () => loadValues(property, properties[property]));
        propertiesContainer.appendChild(button);
    });
    
    outputContainer.innerHTML = '<p>Select a property to see its example.</p>';
}


function loadValues(property, propertyData) {
    const outputContainer = document.getElementById('output-container');
    outputContainer.innerHTML = `<h3>${property}</h3><p>${propertyData.description}</p>`;
    
    Object.keys(propertyData.values).forEach(value => {
        const valueContainer = document.createElement('div');
        valueContainer.innerHTML = `
            <h4>${value}</h4>
            <p>${propertyData.values[value].description}</p>
            <pre><code>${propertyData.values[value].example}</code></pre>
        `;
        outputContainer.appendChild(valueContainer);
    });
}

// script.js

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const categories = data;
            const searchBar = document.getElementById('searchBar');
            const categoryList = document.getElementById('categoryList');
            const detailsContainer = document.getElementById('detailsContainer');
            const outputContainer = document.getElementById('outputContainer');
            const searchResults = document.getElementById('searchResults');
            
            // Render category list
            function renderCategories() {
                categoryList.innerHTML = '';
                for (const category in categories) {
                    const button = document.createElement('button');
                    button.textContent = category;
                    button.addEventListener('click', () => renderProperties(category));
                    categoryList.appendChild(button);
                }
            }
            
            // Render properties for a category
            function renderProperties(category) {
                detailsContainer.innerHTML = '';
                for (const property in categories[category]) {
                    const propertyDiv = document.createElement('div');
                    propertyDiv.classList.add('property');
                    propertyDiv.innerHTML = `
                        <h3>${property}</h3>
                        <p>${categories[category][property].description}</p>
                    `;
                    const valuesDiv = document.createElement('div');
                    valuesDiv.classList.add('values');
                    for (const value in categories[category][property].values) {
                        const valueDiv = document.createElement('div');
                        valueDiv.classList.add('value');
                        valueDiv.innerHTML = `
                            <strong>${value}</strong>
                            <p>${categories[category][property].values[value].description}</p>
                            <pre>${categories[category][property].values[value].example}</pre>
                        `;
                        valuesDiv.appendChild(valueDiv);
                    }
                    propertyDiv.appendChild(valuesDiv);
                    detailsContainer.appendChild(propertyDiv);
                }
            }

            // Search functionality
            function performSearch(query) {
                searchResults.innerHTML = ''; // Clear previous search results
                if (query.trim() === '') {
                    return; // Exit if search query is empty
                }
                for (const category in categories) {
                    for (const property in categories[category]) {
                        for (const value in categories[category][property].values) {
                            const description = categories[category][property].description;
                            const valueDescription = categories[category][property].values[value].description;
                            if (description.toLowerCase().includes(query) || valueDescription.toLowerCase().includes(query)) {
                                const resultDiv = document.createElement('div');
                                resultDiv.classList.add('search-result-item');
                                resultDiv.innerHTML = `
                                    <strong>${category} > ${property} > ${value}</strong>
                                    <p>${description}</p>
                                `;
                                resultDiv.addEventListener('click', () => {
                                    renderProperties(category);
                                    const valueDivs = document.querySelectorAll('.value');
                                    valueDivs.forEach(vDiv => {
                                        if (vDiv.querySelector('strong').textContent === value) {
                                            vDiv.scrollIntoView();
                                            vDiv.style.backgroundColor = '#ffeb3b'; // Highlight selected value
                                        }
                                    });
                                });
                                searchResults.appendChild(resultDiv);
                            }
                        }
                    }
                }
            }

            searchBar.addEventListener('input', (event) => {
                const query = event.target.value.toLowerCase();
                performSearch(query);
            });

            // Initial render
            renderCategories();
        });
});

