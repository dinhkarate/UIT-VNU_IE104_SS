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
        //Khá là cực đoạn này đấy =))
        
        // Cập nhật thông tin sân
        document.querySelector('.court-title h1').textContent = courtDetails.field_name;
        document.querySelector('.court-title .address').textContent = courtDetails.address;
        document.querySelector('.rating span').textContent = `Đánh giá: ${courtDetails.average_rating}/5`;
        document.querySelector('.details p:nth-child(2) span').textContent = `${courtDetails.open_time.slice(0,5)} ~ ${courtDetails.close_time.slice(0,5)}`;
        document.querySelector('.details p:nth-child(3) span').textContent = `${courtDetails.number_of_sub_fields} sân`;
        document.querySelector('.details p:nth-child(4) span').textContent = `${parseInt(courtDetails.price_per_hour).toLocaleString('vi-VN')}đ/giờ`;
        
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

document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded, fetching courts...");
    // Get fieldId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const fieldId = urlParams.get('id');
    
    if (fieldId) {
        fetchCourtDetails(fieldId);
    } else {
        console.error("No field ID found in URL");
    }
});