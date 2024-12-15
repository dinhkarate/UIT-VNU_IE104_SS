// Function to fetch courts from the API
function fetchCourts(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  const apiUrl = `/api/court/courtsList${queryString ? `?${queryString}` : ""}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const gridContainer = document.querySelector('.grid-container');
      if (!gridContainer) {
        console.error("Grid container not found!");
        return;
      }
      gridContainer.innerHTML = '';
      
      const courts = data.rows.slice(0, 9);
      
      if (!Array.isArray(courts) || courts.length === 0) {
        gridContainer.innerHTML = '<p>Không tìm thấy sân phù hợp</p>';
        return;
      }

      courts.forEach(court => {
        const courtHtml = `
          <div class="item-container">
            <div class="item-image">
              <div class="field-image">
                <img src="${court.image_url || '/images/court/soccer.png'}" alt="${court.field_name}">
              </div>
              <div class="banner">
                <img src="${court.banner_url || '/images/court/sportspot-banner.svg'}" alt="Banner">
              </div>
            </div>
            <div class="item-content">
              <h3>
                <a href="/list_court/court_detail?id=${court.field_id}">${court.field_name || 'Không có tên'}</a>
              </h3>
              <div class="location-rating">
                <p class="distance">
                  <img src="/images/court/location-icon.svg" alt="Location" class="location-icon">
                  ${court.distance ? `Cách đây ${court.distance}km` : 'Cách đây 2km'}
                </p>
                <div class="rating">
                  ${generateStarRating(parseFloat(court.average_rating || 0))}
                </div>
              </div>
              
              <div class="tags">
                ${court.coop ? `
                  <span class="tag partner">
                    <img src="/images/court/trophy-icon.svg" alt="Trophy" class="tag-icon">
                    <span>Đối tác SportSpot</span>
                  </span>
                ` : ''}
                <span class="tag quality">
                  <img src="/images/court/check-icon.svg" alt="Check" class="tag-icon">
                  <span>Kiểm định chất lượng</span>
                </span>
              </div>
              
              <h4>Các tiện ích</h4>
              <div class="amenities">
                ${generateAmenityIcons(court.services || '')}
              </div>
              
              <div class="price">
                <span class="price-label">Giá sân: </span>
                <span class="price-value">${formatPrice(court.price_per_hour || 0)}đ/giờ</span>
              </div>
              <p class="hours">Mở cửa ${formatTime(court.open_time || '00:00')} - ${formatTime(court.close_time || '00:00')}</p>
            </div>
          </div>
        `;
        gridContainer.innerHTML += courtHtml;
      });
    })
    .catch((error) => {
      console.error("Error fetching courts:", error);
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer) {
        gridContainer.innerHTML = '<p>Có lỗi xảy ra khi tải dữ liệu</p>';
      }
    });
}

function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '<span class="star-filled">★</span>';
    } else if (i === fullStars && hasHalfStar) {
      stars += '<span class="star-half">★</span>';
    } else {
      stars += '<span class="star-empty">★</span>';
    }
  }
  return stars;
}

function formatPrice(price) {
  return parseInt(price).toLocaleString('vi-VN');
}

function formatTime(time) {
  return time.substring(0, 5);
}

function generateAmenityIcons(services) {
  const servicesList = services.split(', ');
  const iconMapping = {
    'Wifi': 'court/wifi-icon.svg',
    'Cafe': 'court/cafe-icon.svg',
    'Thuê trọng tài': 'court/whistle-icon.svg',
    'Bãi đỗ ô tô': 'court/car-icon.svg',
    'Phòng tắm': 'court/shower-icon.svg'
  };
  
  let icons = '';
  for (const [service, icon] of Object.entries(iconMapping)) {
    if (servicesList.includes(service)) {
      icons += `<img src="/images/court/${icon}" alt="${service}" class="amenity-icon"/>`;
    }
  }
  return icons;
}

document.addEventListener('DOMContentLoaded', () => {
  // console.log("Document loaded, fetching courts...");
  fetchCourts();

  const applyButton = document.querySelector('.apply-button');
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      const selectedSports = Array.from(
        document.querySelectorAll('input[name="sport"]:checked'))
        .map((checkbox) => checkbox.value);

      const selectedFieldTypes = Array.from(
        document.querySelectorAll('input[name="field-type"]:checked')
      ).map((checkbox) => checkbox.value);

      const selectedAmenities = Array.from(
        document.querySelectorAll('input[name="amenities"]:checked')
      ).map((checkbox) => checkbox.value);

      const filters = {
        sport: selectedSports,
        fieldType: selectedFieldTypes,
        amenities: selectedAmenities,
      };

      // console.log("Applying filters:", filters);
      fetchCourts(filters);
    });
  }
});
