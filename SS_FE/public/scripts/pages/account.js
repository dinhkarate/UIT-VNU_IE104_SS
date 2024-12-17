// File: account.js

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const mainContent = document.querySelector(".content");
  const infoSection = document.querySelector("#info-section");
  const commentSection = document.querySelector("#comment-history-section");
  const passwordSection = document.querySelector("#change-password-section");
  const bookingSection = document.querySelector("#booking-section");
  const favoriteSection = document.querySelector("#favorite-section");
  const submenuItems = document.querySelectorAll(".submenu-item");

  // Event listener for submenu items
  submenuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const title = event.target.dataset.title;
      
      // Hide all sections first
      infoSection.style.display = "none";
      commentSection.style.display = "none";
      passwordSection.style.display = "none";
      bookingSection.style.display = "none";
      favoriteSection.style.display = "none";

      // Show corresponding section and load data
      switch (title) {
        case "Thông tin tài khoản":
          infoSection.style.display = "block";
          fetchProfile();
          break;
        case "Lịch sử bình luận":
          commentSection.style.display = "block";
          fetchFeedbackHistory();
          break;
        case "Đổi mật khẩu":
          passwordSection.style.display = "block";
          break;
        case "Lịch đặt sân":
          bookingSection.style.display = "block";
          fetchReservations();
          break;
        case "Sân của bạn":
          favoriteSection.style.display = "block";
          fetchFavouriteFields();
          break;
      }
    });
  });

  // Fetch and render user profile
  function fetchProfile() {
    fetch("/api/account/profile")
      .then((response) => response.json())
      .then((data) => {
        // Update username in sidebar
        document.querySelector('.sidebar .username').textContent = 
          `${data.first_name} ${data.last_name}`;
        
        // Update profile information
        document.querySelector('[data-field="fullname"]').textContent = 
          `${data.first_name} ${data.last_name}`;
        document.querySelector('[data-field="email"]').textContent = data.email;
        document.querySelector('[data-field="phone"]').textContent = data.phone;
        document.querySelector('[data-field="date"]').textContent = formatDate(data.signup_date);
        // Update other fields as needed
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }

  // Fetch and render reservations
  function fetchReservations() {
    fetch("/api/account/reservations")
      .then((response) => response.json())
      .then((data) => {
        const upcomingBookings = data.filter(booking => 
          new Date(booking.resrv_date) >= new Date());
        const pastBookings = data.filter(booking => 
          new Date(booking.resrv_date) < new Date());

        // Render upcoming bookings
        renderBookings(upcomingBookings, "Sắp diễn ra");
        // Render past bookings
        renderBookings(pastBookings, "Đã kết thúc");
      })
      .catch((err) => {
        console.error("Error fetching reservations:", err);
      });
  }

  // Fetch and render feedback history
  function fetchFeedbackHistory() {
    // Fetch feedbacks first
    fetch("/api/account/feedbacks")
      .then((response) => response.json())
      .then(async (feedbackData) => {
        console.log("Feedback data:", feedbackData);
        
        // Fetch court data
        const courtResponse = await fetch("/api/account/favourites");
        const courtData = await courtResponse.json();
        
        // Create a map of court IDs to court names
        const courtMap = {};
        courtData.forEach(court => {
          courtMap[court.field_id] = court.field_name;
        });
        
        const commentContainer = document.querySelector(".comment-container");
        commentContainer.innerHTML = feedbackData.map(feedback => {
          const courtName = courtMap[feedback.field_id] || "Sân không xác định";
          
          return `
            <div class="comment-item">
              <div class="comment-main">
                <div class="comment-left">
                  <div class="comment-date">${formatDate(feedback.created_at)}</div>
                  <img src="images/profile/avatar-court.png" alt="Avatar sân thể thao">
                </div>
                <div class="comment-right">
                  <h3 class="court-name">Bạn đã gửi đánh giá đến ${courtName}</h3>
                  <p class="comment-text">${feedback.description || feedback.content}</p>
                  <div class="rating">
                    ${generateStars(feedback.star || feedback.rating)}
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      })
      .catch((err) => {
        console.error("Error fetching feedbacks:", err);
      });
  }

  // Fetch and render favourite fields
  function fetchFavouriteFields() {
    fetch("/api/account/favourites")
      .then((response) => response.json())
      .then((favouriteData) => {
        console.log("Favourite fields data:", favouriteData);
        
        const favoriteContainer = document.querySelector(".favorite-container");
        favoriteContainer.innerHTML = favouriteData.map(field => `
          <a href="/list_court/court_detail?id=${field.centre_id}" class="favorite-card-link">
            <div class="favorite-card">
              <img class="favorite-img" src="https://foba.vn/wp-content/uploads/2020/09/Hinh-anh-%E2%80%93-2020-San-Bong-Cu-Chi-Sau-01-Nam-Khai-Thac-1.jpg" alt="${field.field_name}">
              <div class="favorite-info">
                <div class="favorite-name">${field.field_name}</div>
                <div class="favorite-stars">⭐⭐⭐⭐⭐</div>
                <div class="tags">
                  <span class="tag partner">
                    <img src="/images/court/trophy-icon.svg" alt="Trophy" class="tag-icon">
                    <span>Đối tác SportSpot</span>
                  </span>
                  <span class="tag quality">
                    <img src="/images/court/check-icon.svg" alt="Check" class="tag-icon">
                    <span>Kiểm định chất lượng</span>
                  </span>
                </div>
                <div class="favorite-utilities">Các tiện ích</div>
                <div class="favorite-utilities-icons">
                  <img src="/images/court/wifi-icon.svg" alt="Wifi" class="amenity-icon">
                  <img src="/images/court/cafe-icon.svg" alt="Cafe" class="amenity-icon">
                  <img src="/images/court/whistle-icon.svg" alt="Trọng tài" class="amenity-icon">
                  <img src="/images/court/car-icon.svg" alt="Bãi đỗ xe" class="amenity-icon">
                  <img src="/images/court/shower-icon.svg" alt="Phòng tắm" class="amenity-icon">
                </div>
                <div class="favorite-price">Giá sân: <span class="price-value">
                  ${formatCurrency(field.price_per_hour || 50.000)}/giờ
                </span></div>
                <div class="favorite-opening">Mở cửa ${field.open_time} ~ ${field.close_time}</div>
              </div>
            </div>
          </a>
        `).join('');
      })
      .catch((err) => {
        console.error("Error fetching favourite fields:", err);
      });
  }

  // Helper functions
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  }

  function formatTime(timeString) {
    // Xử lý chuỗi thời gian từ định dạng "HH:mm:00.000Z"
    return timeString.substring(0, 5);
  }

  function formatCurrency(amount) {
    // Chuyển đổi số thành định dạng tiền tệ Việt Nam
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function generateStars(rating) {
    return '⭐'.repeat(rating);
  }

  function renderBookings(bookings, title) {
    // Clear existing content first
    if (title === "Sắp diễn ra") {
      bookingSection.innerHTML = ''; // Clear all content when rendering upcoming bookings
    }

    const bookingHTML = bookings.map(booking => `
      <div class="booking-row">
        <div class="booking-field name">${booking.field_name}</div>
        <div class="booking-field date">${formatDate(booking.resrv_date)}</div>
        <div class="booking-field time">${formatTime(booking.time_begin)} ~ ${formatTime(booking.time_end)}</div>
        <div class="booking-field price">${formatCurrency(booking.renting_price)}</div>
        <div class="booking-field status">${booking.resrv_status}</div>
      </div>
      <div class="separator-line-booking"></div>
    `).join('');

    const section = document.createElement('div');
    section.innerHTML = `
      <h2 class="booking-subtitle">${title}</h2>
      <div class="booking-scroll">
        <div class="booking-header-row">
          <div class="booking-header-field">Tên sân</div>
          <div class="booking-header-field">Ngày</div>
          <div class="booking-header-field">Khung giờ</div>
          <div class="booking-header-field">Giá</div>
          <div class="booking-header-field">Trạng thái</div>
        </div>
        <div class="separator-line-booking"></div>
        ${bookingHTML}
      </div>
    `;

    bookingSection.appendChild(section);
  }

  function getLatestPrice(fieldId, priceMap) {
    return priceMap[fieldId]?.price || 0;
  }

  // Load initial profile data
  fetchProfile();
});
  