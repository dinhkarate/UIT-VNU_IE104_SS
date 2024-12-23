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

  // Add new function to handle section display
  function showSection(sectionName) {
    // Hide all sections first
    infoSection.style.display = "none";
    commentSection.style.display = "none";
    passwordSection.style.display = "none";
    bookingSection.style.display = "none";
    favoriteSection.style.display = "none";

    // Show corresponding section and load data
    switch (sectionName) {
      case "bookings":
        bookingSection.style.display = "block";
        fetchReservations();
        break;
      case "comments":
        commentSection.style.display = "block";
        fetchFeedbackHistory();
        break;
      case "password":
        passwordSection.style.display = "block";
        break;
      case "favorites":
        favoriteSection.style.display = "block";
        fetchFavouriteFields();
        break;
      default:
        infoSection.style.display = "block";
        fetchProfile();
        break;
    }
  }

  // Check URL parameters when page loads
  const urlParams = new URLSearchParams(window.location.search);
  const section = urlParams.get("section");
  showSection(section);

  // Modify existing submenu click handler
  submenuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const title = event.target.dataset.title;

      // Map Vietnamese titles to section names
      const sectionMap = {
        "Thông tin tài khoản": "info",
        "Lịch sử bình luận": "comments",
        "Đổi mật khẩu": "password",
        "Lịch đặt sân": "bookings",
        "Sân của bạn": "favorites",
      };

      showSection(sectionMap[title]);
    });
  });

  // Fetch and render user profile
  function fetchProfile() {
    fetch("/api/account/profile")
      .then((response) => response.json())
      .then((data) => {
        // Update username in sidebar
        document.querySelector(
          ".sidebar .username"
        ).textContent = `${data.first_name} ${data.last_name}`;

        // Update profile information
        document.querySelector(
          '[data-field="fullname"]'
        ).textContent = `${data.first_name} ${data.last_name}`;
        document.querySelector('[data-field="email"]').textContent = data.email;
        document.querySelector('[data-field="phone"]').textContent = data.phone;
        document.querySelector('[data-field="date"]').textContent = formatDate(
          data.signup_date
        );
        // Update other fields as needed
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }

  function renderUpdateProfileForm() {
    mainContent.innerHTML = `
    <h2>Cập nhật thông tin</h2>
    <form id="update-profile-form">
      <label>Họ và Tên:</label>
      <input type="text" id="full-name" required placeholder="Nhập Họ và Tên đầy đủ">
      <label>Email:</label>
      <input type="email" id="email" required>
      <label>Số điện thoại:</label>
      <input type="tel" id="phone" required>
      <button type="submit">Cập nhật</button>
    </form>
  `;

    document
      .querySelector("#update-profile-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();

        const fullName = document.querySelector("#full-name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const phone = document.querySelector("#phone").value.trim();

        // Xử lý chuỗi fullName
        const nameParts = fullName.split(" ").filter((part) => part !== "");
        const first_name = nameParts[0] || ""; // Phần đầu tiên làm first_name
        const last_name = nameParts.slice(1).join(" ") || ""; // Phần còn lại làm last_name

        const data = {
          first_name,
          last_name,
          email,
          phone,
        };

        // Gửi request cập nhật
        fetch("/api/account/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((result) => {
            console.log("Profile updated:", result);
            alert("Thông tin đã được cập nhật!");
            fetchProfile(); // Làm mới thông tin hồ sơ sau khi cập nhật thành công
          })
          .catch((err) => {
            console.error("Error updating profile:", err);
            alert("Cập nhật thông tin thất bại!");
          });
      });
  }

  function renderChangePasswordForm() {
    mainContent.innerHTML = `
    <h2>Đổi mật khẩu</h2>
    <form id="change-password-form">
      <label for="old-password">Mật khẩu cũ:</label>
      <input type="password" id="old-password" class="password-input" required>
      <label for="new-password">Mật khẩu mới:</label>
      <input type="password" id="new-password" class="password-input" required>
      <button type="submit" class="password-submit-button">Đổi mật khẩu</button>
      <p id="error-message" style="color: red; display: none;"></p>
      <p id="success-message" style="color: green; display: none;"></p>
    </form>
  `;

    const form = document.querySelector("#change-password-form");
    const errorMessage = document.querySelector("#error-message");
    const successMessage = document.querySelector("#success-message");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const oldPassword = document.querySelector("#old-password").value.trim();
      const newPassword = document.querySelector("#new-password").value.trim();

      // Kiểm tra hợp lệ đầu vào
      if (!oldPassword || !newPassword) {
        errorMessage.textContent = "Vui lòng nhập đầy đủ thông tin!";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        return;
      }

      if (newPassword.length < 6) {
        errorMessage.textContent = "Mật khẩu mới phải có ít nhất 6 ký tự!";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        return;
      }

      try {
        // Gửi yêu cầu tới backend
        const response = await fetch("/api/account/password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Đổi mật khẩu thất bại!");
        }

        // Đổi mật khẩu thành công
        successMessage.textContent = "Mật khẩu đã được thay đổi!";
        successMessage.style.display = "block";
        errorMessage.style.display = "none";
        form.reset();
      } catch (err) {
        console.error("Error changing password:", err);
        errorMessage.textContent = err.message || "Đổi mật khẩu thất bại!";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
      }
    });
  }

  // Fetch and render reservations
  function fetchReservations() {
    fetch("/api/account/reservations")
      .then((response) => response.json())
      .then((data) => {
        const upcomingBookings = data.filter(
          (booking) => new Date(booking.resrv_date) >= new Date()
        );
        const pastBookings = data.filter(
          (booking) => new Date(booking.resrv_date) < new Date()
        );

        // Render upcoming bookings
        // renderBookings(upcomingBookings, "Sắp diễn ra");
        // Render past bookings
        renderBookings(pastBookings, "Danh sách sân đã được đặt");
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
        courtData.forEach((court) => {
          courtMap[court.field_id] = court.field_name;
        });

        const commentContainer = document.querySelector(".comment-container");
        commentContainer.innerHTML = feedbackData
          .map((feedback) => {
            const courtName =
              courtMap[feedback.field_id] || "Sân không xác định";

            return `
            <div class="comment-item">
              <div class="comment-main">
                <div class="comment-left">
                  <div class="comment-date">${formatDate(
                    feedback.created_at
                  )}</div>
                  <img src="images/profile/avatar-court.png" alt="Avatar sân thể thao">
                </div>
                <div class="comment-right">
                  <h3 class="court-name">Bạn đã gửi đánh giá đến ${courtName}</h3>
                  <p class="comment-text">${
                    feedback.description || feedback.content
                  }</p>
                  <div class="rating">
                    ${generateStars(feedback.star || feedback.rating)}
                  </div>
                </div>
              </div>
            </div>
          `;
          })
          .join("");
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
        favoriteContainer.innerHTML = favouriteData
          .map(
            (field) => `
          <a href="/list_court/court_detail?id=${
            field.centre_id
          }" class="favorite-card-link">
            <div class="favorite-card">
              <img class="favorite-img" src="https://foba.vn/wp-content/uploads/2020/09/Hinh-anh-%E2%80%93-2020-San-Bong-Cu-Chi-Sau-01-Nam-Khai-Thac-1.jpg" alt="${
                field.field_name
              }">
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
                  ${formatCurrency(field.price_per_hour || 50.0)}/giờ
                </span></div>
                <div class="favorite-opening">Mở cửa ${field.open_time} ~ ${
              field.close_time
            }</div>
              </div>
            </div>
          </a>
        `
          )
          .join("");
      })
      .catch((err) => {
        console.error("Error fetching favourite fields:", err);
      });
  }

  // Helper functions
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  }

  function formatTime(timeString) {
    // Xử lý chuỗi thời gian từ định dạng "HH:mm:00.000Z"
    return timeString.substring(0, 5);
  }

  function formatCurrency(amount) {
    // Chuyển đổi số thành định dạng tiền tệ Việt Nam
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function generateStars(rating) {
    return "⭐".repeat(rating);
  }

  function renderBookings(bookings, title) {
    // Clear existing content first
    if (title === "Sắp diễn ra") {
      bookingSection.innerHTML = ""; // Clear all content when rendering upcoming bookings
    }

    const bookingHTML = bookings
      .map(
        (booking) => `
      <div class="booking-row">
        <div class="booking-field name">${booking.field_name}</div>
        <div class="booking-field date">${formatDate(booking.resrv_date)}</div>
        <div class="booking-field time">${formatTime(
          booking.time_begin
        )} ~ ${formatTime(booking.time_end)}</div>
        <div class="booking-field price">${formatCurrency(
          booking.renting_price
        )}</div>
        <div class="booking-field status">${booking.resrv_status}</div>
      </div>
      <div class="separator-line-booking"></div>
    `
      )
      .join("");

    const section = document.createElement("div");
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
