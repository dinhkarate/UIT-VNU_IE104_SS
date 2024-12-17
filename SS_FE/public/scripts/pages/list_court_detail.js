// Thêm hàm formatDate
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        // Nếu là today
        return 'Hôm nay';
    } else if (diffDays === 1) {
        // Nếu là yesterday
        return 'Hôm qua';
    } else if (diffDays < 7) {
        // Nếu trong tuần này
        return `${diffDays} ngày trước`;
    } else {
        // Format date dạng dd/mm/yyyy
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

const bookingButton = document.querySelector('.booking-button');
const favorButton = document.querySelector('.favorite');
let price;

//Hàm lấy thông tin sân
function fetchCourtDetails(fieldId) {
    const apiUrl = `/api/court/courtDetails?fieldId=${fieldId}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
      })
      .then((data) => {
        console.log('API Response:', data);

        
        const courtDetails = data.courtDetails.rows[0];
        const centreDetails = data.centreDetails.rows[0];
        price = courtDetails.price_per_hour*0.5;
        console.log(price);
        
        //Khá là cực đoạn này đấy =))
        console.log("Feedbacks data:", feedbacks);

        document.querySelector('.breadcrumb .court-name').textContent = courtDetails.field_name;
        
        // Cập nhật thông tin sân
        document.querySelector('.court-title h1').textContent = courtDetails.field_name;
        const addressElement = document.querySelector('.court-title .address');
        addressElement.innerHTML = `
            <img src="../../images/components/court/icons_location.png" alt="Location" class="icon" />
            ${centreDetails.address}
        `;
        document.querySelector('.rating span').textContent = `Đánh giá: ${Number(courtDetails.average_rating).toFixed(1)}/5`;
        document.querySelector('.details p:nth-child(2) span').textContent = `${courtDetails.open_time.slice(0,5)} ~ ${courtDetails.close_time.slice(0,5)}`;
        document.querySelector('.details p:nth-child(3) span').textContent = 
          `${courtDetails.price_per_hour ? parseInt(courtDetails.price_per_hour).toLocaleString('vi-VN') : '0'}đ/giờ`;
        
        /* // Cập nhật dịch vụ tiện ích
        const servicesList = courtDetails.services.split(', ');
        const servicesContainer = document.querySelector('.service-list');
        servicesContainer.innerHTML = servicesList
          .map(service => `
            <div class="service-item">
              <img src="../../public/images/${service.toLowerCase()}-icon.svg" alt="${service}" class="amenity-icon" />
              <span>${service}</span>
            </div>
          `)
          .join(''); */

        // Cập nhật phần feedback
        const commentsSection = document.querySelector('.comments-section');
        if (!commentsSection) {
            console.error("Comments section not found!");
            return;
        }

        // Xóa các comment mẫu cũ
        commentsSection.innerHTML = '<h2>Bình luận</h2>';
        
        // Kiểm tra nếu không có feedback
        if (!feedbacks || feedbacks.length === 0) {
            commentsSection.innerHTML += '<p>Chưa có bình luận nào.</p>';
            return;
        }
        
        // Thêm các feedback mới
        feedbacks.forEach(feedback => {
            // Kiểm tra dữ liệu feedback trước khi sử dụng
            if (!feedback || typeof feedback.star === 'undefined') {
                console.error('Invalid feedback data:', feedback);
                return;
            }

            const commentHTML = `
                <div class="comment">
                    <div class="comment-header">
                        <div class="comment-author">
                            <img src="https://antimatter.vn/wp-content/uploads/2022/11/anh-avatar-trang-fb-mac-dinh.jpg" alt="User" />
                            <span>${feedback.username || 'Anonymous'}</span>
                        </div>
                        <div class="stars">${'★'.repeat(feedback.star)}${'☆'.repeat(5-feedback.star)}</div>
                    </div>
                    <p>${feedback.description || ''}</p>
                    <span class="time">${formatDate(feedback.created_at)}</span>
                </div>
            `;
            commentsSection.innerHTML += commentHTML;
        });

        // Thêm nút "Tải thêm" nếu có nhiều feedback
        if (feedbacks.length >= 5) {
            commentsSection.innerHTML += `
                <div class="load-more">
                    <button>Tải thêm</button>
                </div>
            `;
        }
      })
      .catch((error) => {
        console.error("Error fetching court details:", error);
      });
}

module.exports = {price};

// API đặt sân
bookingButton.addEventListener('click', async () => {
  // Kiểm tra xem user đã đăng nhập chưa bằng loadUser()
  const authStatus = await loadUser();
  
  if (authStatus.isLoggedIn) {
    // Lấy các time slots đã được chọn
    const selectedSlots = document.querySelectorAll('.time-slot.selected');
    const bookingData = Array.from(selectedSlots).map(slot => ({
      date: slot.dataset.date,
      startTime: slot.dataset.start,
      endTime: slot.dataset.end
    }));

    // Chuyển data sang dạng query string
    const queryString = encodeURIComponent(JSON.stringify(bookingData));
    
    // Chuyển hướng đến trang payment với data
    window.location.href = `/payment?bookingData=${queryString}`;
  } else {
    // Hiển thị thông báo chưa đăng nhập
    showLoginAlert();
  }
});

function showLoginAlert() {
  // Tạo và hiển thị alert box
  const alertBox = document.createElement('div');
  alertBox.className = 'login-alert';
  alertBox.innerHTML = `
    <div class="alert-content">
      <p>Bạn cần đăng nhập để đặt sân</p>
      <a href="/login" class="login-link">Đăng nhập ngay</a>
    </div>
  `;

  document.body.appendChild(alertBox);

  // Tự động đóng alert sau 3 giây
  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}

//fetch API cho thêm sân yêu thích
favorButton.addEventListener('click', () => {
  // Dữ liệu gửi về mẫu
  const data = {
    cust_id: "DUMMY",
    field_id: "BD001"
  }

  fetch('/api/court/addFavor', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); 
      })
      .then(result => {
          console.log('Success:', result); 
      })
      .catch(error => {
          console.error('Error:', error); 
      });
});

//Xóa sân yêu thích
favorButton.addEventListener('click', () => {
    // Dữ liệu gửi về mẫu
    const data = {
      cust_id: "DUMMY",
      field_id: "BD001"
    }
});


// Sửa lại hàm loadUser để return Promise
async function loadUser() {
  const token = localStorage.getItem('token');
  console.log('Token:', token);

  try {
    const response = await fetch('/api/auth/checkjwt', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      return {
        isLoggedIn: false,
        username: null
      };
    }

    const data = await response.json();
    return {
      isLoggedIn: true,
      username: data.user.username
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      isLoggedIn: false, 
      username: null
    };
  }
}

function setupAuthUserComment(username) {
  // Hiển thị thông tin user
  const authUser = document.querySelector('.auth-user');
  const unauthMessage = document.querySelector('.unauth-message');
  const submitButton = document.querySelector('.submit-button');
  
  authUser.style.display = 'flex';
  unauthMessage.style.display = 'none';
  authUser.querySelector('.username').textContent = username;
  
  // Enable submit button
  submitButton.disabled = false;
  
  // Thêm event listener cho submit button
  submitButton.addEventListener('click', async function() {
    const commentText = document.querySelector('textarea').value;
    
    // Validate input
    if (!commentText.trim() || !currentRating) {
      alert('Vui lòng nhập đầy đủ đánh giá và bình luận!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/login';
        return;
      }

      // Get field ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const fieldId = urlParams.get('id') || "BD002";

      // Log request data for debugging
      const requestData = {
        field_id: fieldId,
        description: commentText,
        star: Math.min(Math.max(Math.round(currentRating), 1), 5)
      };
      console.log('Request data before sending:', {
        field_id: requestData.field_id,
        description: requestData.description,
        star: requestData.star
      });

      const response = await fetch('/api/court/addFeedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      // Log response for debugging
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        // Thêm logging cho response error
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        
        if (response.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Add new comment to the UI
      const commentsSection = document.querySelector('.comments-section');
      const newComment = `
        <div class="comment">
          <div class="comment-header">
            <div class="comment-author">
              <img src="https://antimatter.vn/wp-content/uploads/2022/11/anh-avatar-trang-fb-mac-dinh.jpg" alt="User" />
              <span>${username}</span>
            </div>
            <div class="stars">${'★'.repeat(Math.round(currentRating))}${'☆'.repeat(5-Math.round(currentRating))}</div>
          </div>
          <p>${commentText}</p>
          <span class="time">Hôm nay</span>
        </div>
      `;
      
      // Insert new comment after the h2 title
      const h2Element = commentsSection.querySelector('h2');
      h2Element.insertAdjacentHTML('afterend', newComment);

      // Clear the textarea and reset rating
      document.querySelector('textarea').value = '';
      resetRating();
      
      // Refresh court details to update ratings
      fetchCourtDetails(fieldId);
      
      alert('Bình luận đã được gửi thành công!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      if (error.message.includes('JSON')) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/login';
      } else {
        alert('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại sau!');
      }
    }
  });
}

function setupUnauthUserComment() {
  // Hiển thị message yêu cầu đăng nhập
  const authUser = document.querySelector('.auth-user');
  const unauthMessage = document.querySelector('.unauth-message');
  const submitButton = document.querySelector('.submit-button');
  
  authUser.style.display = 'none';
  unauthMessage.style.display = 'block';
  
  // Disable submit button
  submitButton.disabled = true;
  
  // Thêm event listener để hiện popup khi click vào button
  submitButton.addEventListener('click', function() {
    alert('Vui lòng đăng nhập để bình luận!');
    window.location.href = '/login';
  });
}

// Thêm biến global để theo dõi rating
let currentRating = 0;
let isClicked = false;

// Thêm hàm khởi tạo rating stars
function initializeRatingStars() {
  const ratingContainer = document.getElementById('ratingStars');
  if (!ratingContainer) return;
  
  const stars = ratingContainer.getElementsByClassName('star');

  function calculateRating(e, element) {
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const x = e.clientX - rect.left;
    return x < width/2 ? 0.5 : 1;
  }

  function updateStars(rating, isHover = false) {
    Array.from(stars).forEach((star) => {
      const starValue = parseInt(star.dataset.rating);
      star.classList.remove('active', 'hover', 'half');
      
      if (rating >= starValue) {
        star.classList.add(isHover ? 'hover' : 'active');
      } else if (rating + 0.5 === starValue) {
        star.classList.add(isHover ? 'hover' : 'active', 'half');
      }
    });
  }

  ratingContainer.addEventListener('mousemove', function(e) {
    if (isClicked) return;
    
    const target = e.target;
    if (target.classList.contains('star')) {
      const baseRating = parseInt(target.dataset.rating);
      const partialRating = calculateRating(e, target);
      const rating = baseRating - 1 + partialRating;
      updateStars(rating, true);
    }
  });

  ratingContainer.addEventListener('mouseleave', function() {
    if (!isClicked) {
      updateStars(currentRating);
    }
  });

  ratingContainer.addEventListener('click', function(e) {
    const target = e.target;
    if (target.classList.contains('star')) {
      const baseRating = parseInt(target.dataset.rating);
      const partialRating = calculateRating(e, target);
      currentRating = baseRating - 1 + partialRating;
      isClicked = true;
      updateStars(currentRating);
      console.log('Rating:', currentRating);
    }
  });
}

// Cập nhật hàm resetRating
function resetRating() {
  currentRating = 0;
  isClicked = false;
  const ratingContainer = document.getElementById('ratingStars');
  if (ratingContainer) {
    const stars = ratingContainer.getElementsByClassName('star');
    Array.from(stars).forEach(star => {
      star.classList.remove('active', 'hover', 'half');
    });
  }
}

// Cập nhật event listener DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log("Document loaded, fetching courts...");
  
  // Khởi tạo rating stars
  initializeRatingStars();
  
  const urlParams = new URLSearchParams(window.location.search);
  const fieldId = urlParams.get('id');
  
  if (fieldId) {
    fetchCourtDetails(fieldId);
  } else {
    console.error("No field ID found in URL");
    fetchCourtDetails("BD002");
  }

  // Kiểm tra trạng thái đăng nhập
  const authStatus = await loadUser();
  if (authStatus.isLoggedIn) {
    setupAuthUserComment(authStatus.username);
  } else {
    setupUnauthUserComment();
  }
});