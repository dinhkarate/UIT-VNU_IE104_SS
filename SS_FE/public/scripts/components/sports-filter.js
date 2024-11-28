let suggestionsData = {
    all: [
        {
            name: "Sân bóng đá A",
            distance: "Cách đây 2km",
            rating: "★★★★★",
            amenities: ["wifi", "parking", "shower", "utensils"],
            hours: "Mở cửa 6:00 - 22:00",
            image: "https://placehold.co/255x200",
        },
        {
            name: "Sân cầu lông A",
            distance: "Cách đây 2km",
            rating: "★★★★★",
            amenities: ["wifi", "parking", "shower", "utensils"],
            hours: "Mở cửa 6:00 - 22:00",
            image: "https://placehold.co/255x200",
        },
    ],
    football: [
        {
            name: "Sân bóng đá A",
            distance: "Cách đây 2km",
            rating: "★★★★★",
            amenities: ["wifi", "parking", "shower", "utensils"],
            hours: "Mở cửa 6:00 - 22:00",
            image: "https://placehold.co/255x200",
        },
    ],
    basketball: [
        {
            name: "Sân bóng rổ A",
            distance: "Cách đây 2km",
            rating: "★★★★★",
            amenities: ["wifi", "parking", "shower", "utensils"],
            hours: "Mở cửa 6:00 - 22:00",
            image: "https://placehold.co/255x200",
        },
    ],
    badminton: [
        {
            name: "Sân cầu lông A",
            distance: "Cách đây 2km",
            rating: "★★★★★",
            amenities: ["wifi", "parking", "shower", "utensils"],
            hours: "Mở cửa 6:00 - 22:00",
            image: "https://placehold.co/255x200",
        },
    ],
    tableTennis: [
        {
            name: "Sân bóng bàn A",
            distance: "Cách đây 2km",
            rating: "★★★★★",
            amenities: ["wifi", "parking", "shower", "utensils"],
            hours: "Mở cửa 6:00 - 22:00",
            image: "https://placehold.co/255x200",
        },
    ],
    pickleball: [
        {
            name: "Sân pickleball A",
            distance: "Cách đây 2km",
            rating: "★★★★★",
            amenities: ["wifi", "parking", "shower", "utensils"],
            hours: "Mở cửa 6:00 - 22:00",
            image: "https://placehold.co/255x200",
        },
    ],
};


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
