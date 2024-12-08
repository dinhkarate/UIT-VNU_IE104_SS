// File: account.js

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    const mainContent = document.querySelector("#main-content");
  
    // Event listener for sidebar links
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = event.target.dataset.target;
  
        // Clear existing content
        mainContent.innerHTML = "";
  
        // Load corresponding section
        switch (target) {
          case "profile":
            fetchProfile();
            break;
          case "updateProfile":
            renderUpdateProfileForm();
            break;
          case "changePassword":
            renderChangePasswordForm();
            break;
          case "reservations":
            fetchReservations();
            break;
          case "feedbacks":
            fetchFeedbackHistory();
            break;
          case "favourites":
            fetchFavouriteFields();
            break;
          default:
            mainContent.innerHTML = "<p>Chức năng chưa được triển khai.</p>";
        }
      });
    });
  
    // Fetch and render user profile
    function fetchProfile() {
      fetch("/api/account/profile")
        .then((response) => response.json())
        .then((data) => {
          mainContent.innerHTML = `
            <h2>Thông tin tài khoản</h2>
            <p><strong>Họ và tên:</strong> ${data.first_name} ${data.last_name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Số điện thoại:</strong> ${data.phone}</p>
            <p><strong>Ngày đăng ký:</strong> ${data.signup_date}</p>
          `;
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          mainContent.innerHTML = "<p>Có lỗi xảy ra khi tải thông tin tài khoản.</p>";
        });
    }
  
    // Fetch and render reservations
    function fetchReservations() {
      fetch("/api/account/reservations")
        .then((response) => response.json())
        .then((data) => {
          let tableHtml = `
            <h2>Lịch đặt sân</h2>
            <table>
              <thead>
                <tr>
                  <th>Tên sân</th>
                  <th>Ngày</th>
                  <th>Bắt đầu</th>
                  <th>Kết thúc</th>
                  <th>Giá thuê</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
          `;
  
          data.forEach((res) => {
            tableHtml += `
              <tr>
                <td>${res.field_name}</td>
                <td>${res.resrv_date}</td>
                <td>${res.time_begin}</td>
                <td>${res.time_end}</td>
                <td>${res.renting_price}đ</td>
                <td>${res.resrv_status}</td>
              </tr>
            `;
          });
  
          tableHtml += "</tbody></table>";
          mainContent.innerHTML = tableHtml;
        })
        .catch((err) => {
          console.error("Error fetching reservations:", err);
          mainContent.innerHTML = "<p>Có lỗi xảy ra khi tải lịch đặt sân.</p>";
        });
    }
  
    // Fetch and render feedback history
    function fetchFeedbackHistory() {
      fetch("/api/account/feedbacks")
        .then((response) => response.json())
        .then((data) => {
          let feedbackHtml = "<h2>Lịch sử bình luận</h2>";
  
          data.forEach((feedback) => {
            feedbackHtml += `
              <div class="feedback">
                <p><strong>Số sao:</strong> ${feedback.star}</p>
                <p><strong>Ngày:</strong> ${feedback.created_at}</p>
                <p><strong>Nội dung:</strong> ${feedback.description}</p>
              </div>
            `;
          });
  
          mainContent.innerHTML = feedbackHtml;
        })
        .catch((err) => {
          console.error("Error fetching feedback history:", err);
          mainContent.innerHTML = "<p>Có lỗi xảy ra khi tải lịch sử bình luận.</p>";
        });
    }
  
    // Fetch and render favourite fields
    function fetchFavouriteFields() {
      fetch("/api/account/favourites")
        .then((response) => response.json())
        .then((data) => {
          let favouriteHtml = "<h2>Sân yêu thích</h2>";
  
          data.forEach((field) => {
            favouriteHtml += `
              <div class="card">
                <h3>${field.field_name}</h3>
                <p><strong>Đối tác:</strong> ${field.coop ? "Có" : "Không"}</p>
                <p><strong>Giờ mở cửa:</strong> ${field.open_time}</p>
                <p><strong>Giờ đóng cửa:</strong> ${field.close_time}</p>
              </div>
            `;
          });
  
          mainContent.innerHTML = favouriteHtml;
        })
        .catch((err) => {
          console.error("Error fetching favourite fields:", err);
          mainContent.innerHTML = "<p>Có lỗi xảy ra khi tải sân yêu thích.</p>";
        });
    }
  
    // Render update profile form
    function renderUpdateProfileForm() {
      mainContent.innerHTML = `
        <h2>Cập nhật thông tin</h2>
        <form id="update-profile-form">
          <label>Họ:</label>
          <input type="text" id="first-name" required>
          <label>Tên:</label>
          <input type="text" id="last-name" required>
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
  
          const data = {
            first_name: document.querySelector("#first-name").value,
            last_name: document.querySelector("#last-name").value,
            email: document.querySelector("#email").value,
            phone: document.querySelector("#phone").value,
          };
  
          fetch("/api/account/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((result) => {
              console.log("Profile updated:", result);
              alert("Thông tin đã được cập nhật!");
              fetchProfile();
            })
            .catch((err) => {
              console.error("Error updating profile:", err);
              alert("Cập nhật thông tin thất bại!");
            });
        });
    }
  
    // Render change password form
    function renderChangePasswordForm() {
      mainContent.innerHTML = `
        <h2>Đổi mật khẩu</h2>
        <form id="change-password-form">
          <label>Mật khẩu cũ:</label>
          <input type="password" id="old-password" required>
          <label>Mật khẩu mới:</label>
          <input type="password" id="new-password" required>
          <button type="submit">Đổi mật khẩu</button>
        </form>
      `;
  
      document
        .querySelector("#change-password-form")
        .addEventListener("submit", (event) => {
          event.preventDefault();
  
          const data = {
            oldPassword: document.querySelector("#old-password").value,
            newPassword: document.querySelector("#new-password").value,
          };
  
          fetch("/api/account/password", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((result) => {
              console.log("Password changed:", result);
              alert("Mật khẩu đã được thay đổi!");
            })
            .catch((err) => {
              console.error("Error changing password:", err);
              alert("Thay đổi mật khẩu thất bại!");
            });
        });
    }
  });
  