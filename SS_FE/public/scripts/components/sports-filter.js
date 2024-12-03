let suggestionsData = {
    "all": [],
    "Bóng đá": [],
    "Bóng rổ": [],
    "Cầu lông": [],
    "Bóng bàn": [],
    "Pickleball": []
};

fetch("/api")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        const convertedData = {
            "all": [],
            "Bóng đá": [],
            "Bóng rổ": [],
            "Cầu lông": [],
            "Bóng bàn": [],
            "Pickleball": []
        };

        data.rows.forEach(item => {
            const field = {
                id: item.field_id,
                image: "https://placehold.co/255x200",
                name: item.field_name,
                distance: "2km",
                rating: item.average_rating || "Chưa có đánh giá",
                amenities: item.services.split(", ").map(service => {
                    const iconMap = {
                        "Wifi": "wifi",
                        "Phòng tắm": "shower",
                        "Bãi đỗ ô tô": "parking",
                        "Cafe": "coffee"
                    };
                    return iconMap[service] || "info";
                }),
                hours: `${item.open_time.slice(0,5)} - ${item.close_time.slice(0,5)}`,
                href: `/field/${item.field_id}`
            };
            
            convertedData.all.push(field);
            if (convertedData[item.sport_type]) {
                convertedData[item.sport_type].push(field);
            }
        });

        suggestionsData = convertedData;
        updateSuggestions('all');
    })
    .catch((error) => {
        console.error("Lỗi khi lấy data:", error);
        suggestionsData = {
            "all": [
                {
                    id: 1,
                    image: "https://placehold.co/255x200",
                    name: "Sân bóng đá mẫu",
                    distance: "2km",
                    rating: "4.5",
                    amenities: ["wifi", "parking", "shower", "utensils"],
                    hours: "6:00 - 22:00",
                    href: "/field/1"
                }
            ],
            "Bóng đá": [
                {
                    id: 1,
                    image: "https://placehold.co/255x200",
                    name: "Sân bóng đá mẫu",
                    distance: "2km",
                    rating: "4.5",
                    amenities: ["wifi", "parking", "shower", "utensils"],
                    hours: "6:00 - 22:00",
                    href: "/field/1"
                }
            ],
            "Bóng rổ": [],
            "Cầu lông": [],
            "Bóng bàn": [],
            "Pickleball": []
        };
        updateSuggestions('all');
    });

document.querySelectorAll(".sports-filter button").forEach((button) => {
    button.addEventListener("click", (event) => {
        const filterType = event.target.closest("button").dataset.type;
        updateSuggestions(filterType);
    });
});
    
function updateSuggestions(type) {
    const suggestionsContainer = document.querySelector(".suggestions-content");
    const leftBtn = document.querySelector('.suggestions-slider .left-btn');
    const rightBtn = document.querySelector('.suggestions-slider .right-btn');
    
    const data = suggestionsData[type] || suggestionsData.all;
    let currentIndex = 0;
    const itemsPerPage = 6;
    
    function displayItems(startIndex) {
        suggestionsContainer.innerHTML = "";
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);
        const currentItems = data.slice(startIndex, endIndex);
        
        currentItems.forEach((item) => {
            const suggestionHTML = `
                    <div class="suggestion-item">
                        <img src="${item.image}" alt="Suggestion Image">
                        <div class="suggestion-info">
                            <h3><a href="${item.href}">${item.name}</a></h3>
                            <p>${item.distance}</p>
                            <div class="rating">★★★★★<span>Xem đánh giá</span></div>
                            <div class="amenities">
                                <i class="fas fa-wifi"></i>
                                <i class="fas fa-parking"></i>
                                <i class="fas fa-shower"></i>
                                <i class="fas fa-utensils"></i>
                            </div>
                            <p class="hours">${item.hours}</p>
                        </div>
                    </div>
            `;
            suggestionsContainer.innerHTML += suggestionHTML;
        });
        leftBtn.style.display = startIndex > 0 ? 'flex' : 'none';
        rightBtn.style.display = endIndex < data.length ? 'flex' : 'none';
    }
    
    displayItems(currentIndex);
    leftBtn.onclick = () => {
        currentIndex = Math.max(0, currentIndex - itemsPerPage);
        displayItems(currentIndex);
    };
    
    rightBtn.onclick = () => {
        currentIndex = Math.min(data.length - itemsPerPage, currentIndex + itemsPerPage);
        displayItems(currentIndex);
    };
}
