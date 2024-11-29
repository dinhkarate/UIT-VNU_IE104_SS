fetch("/api")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log("Received data:", data);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });


document.querySelectorAll(".sports-filter button").forEach((button) => {
    button.addEventListener("click", (event) => {
        const filterType = event.target.closest("button").dataset.type;
        updateSuggestions(filterType);
    });
});
    
function updateSuggestions(type) {
    const suggestionsContainer = document.querySelector(".suggestions-content");
    suggestionsContainer.innerHTML = "";
    
    const data = suggestionsData[type] || suggestionsData.all;
    data.forEach((item) => {
        const suggestionHTML = `
            <div class="suggestion-item">
                <img src="${item.image}" alt="Suggestion Image">
                <div class="suggestion-info">
                    <h3>${item.name}</h3>
                    <p>${item.distance}</p>
                    <div class="rating">${item.rating} <span>Xem đánh giá</span></div>
                    <div class="amenities">
                        ${item.amenities
                            .map(
                                (amenity) =>
                                    `<i class="fas fa-${amenity}"></i>`
                            )
                            .join("")}
                    </div>
                    <p class="hours">${item.hours}</p>
                </div>
            </div>
        `;
        suggestionsContainer.innerHTML += suggestionHTML;
    });
}
