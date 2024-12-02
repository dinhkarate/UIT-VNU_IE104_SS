const bookingButton = document.querySelector('.booking-button');


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
        console.log("Court Details:", data);
  
        // Handle the combined response
        const { courtDetails, feedbacks, centreDetails } = data;
  
        console.log("Court Details:", courtDetails);
        console.log("Feedbacks:", feedbacks);
        console.log("Centre Details:", centreDetails);
        }
    )   
    .catch((error) => {
        console.error("Error fetching court details:", error);
      });
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded, fetching courts...");
    //Example
    fetchCourtDetails("BD002");
})

// API đặt sân
bookingButton.addEventListener('click', () => {
  // Dữ liệu gửi về mẫu
  const details = {
    resrv_id: "RSV11", //về sau để tự động nhập không cần thêm trường này
    time_begin: "10:00", 
    time_end: "12:00",
    resrv_date: "2024-12-01", 
    renting_price: 100.0,
    created_date: "2024-11-30", 
    field_id: "BD001", 
    cust_id: "CUS01", 
    resrv_status: "confirmed" 
  }

  fetch('/api/court/addResrv', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(details), 
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