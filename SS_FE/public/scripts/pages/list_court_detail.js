const bookingButton = document.querySelector('.booking-button');
const favorButton = document.querySelector('.favorite');

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
        //Khá là cực đoạn này đấy =))

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
        // document.querySelector('.details p:nth-child(3) span').textContent = `${courtDetails.number_of_sub_fields} sân`;
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
      })
      .catch((error) => {
        console.error("Error fetching court details:", error);
      });
}

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
  submitButton.addEventListener('click', function() {
    // Xử lý logic gửi comment
    const commentText = document.querySelector('textarea').value;
    const rating = currentRating;
    // Gửi API comment ở đây
    console.log('Submitting comment:', {text: commentText, rating: rating});
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


document.addEventListener('DOMContentLoaded', async () => {
  console.log("Document loaded, fetching courts...");
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