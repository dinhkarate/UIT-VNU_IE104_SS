const selectedSlots = [];

document.addEventListener('DOMContentLoaded', function() {
    const prevButton = document.getElementById('prevTimeSlots');
    const nextButton = document.getElementById('nextTimeSlots');
    const timeContainer = document.querySelector('.time-slots-container');
    
    const prevDateBtn = document.querySelector('.date-nav.prev');
    const nextDateBtn = document.querySelector('.date-nav.next');
    const dateRangeSpan = document.querySelector('.date-range span');
    
    let currentWeekStart = new Date(2023, 10, 11); 

    function formatDate(date) {
        return `${date.getDate()}/${date.getMonth() + 1}`;
    }

    function updateDates() {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        dateRangeSpan.textContent = `${formatDate(currentWeekStart)} ~ ${formatDate(weekEnd)}`;

        const dates = document.querySelectorAll('.day-label .date');
        dates.forEach((dateSpan, index) => {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + index);
            dateSpan.textContent = formatDate(date);
        });

        const timeSlotRows = document.querySelectorAll('.time-slots-row');
        timeSlotRows.forEach((row, rowIndex) => {
            const rowDate = new Date(currentWeekStart);
            rowDate.setDate(rowDate.getDate() + rowIndex);
            const formattedDate = formatDate(rowDate);
            
            row.querySelectorAll('.time-slot').forEach(slot => {
                slot.dataset.date = formattedDate;
            });
        });
    }

    prevDateBtn.addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateDates();
    });

    nextDateBtn.addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateDates();
    });

    updateDates();

    function scrollToNextGroup() {
        const container = document.querySelector('.time-slots-container');
        const scrollAmount = container.clientWidth;
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    function scrollToPrevGroup() {
        const container = document.querySelector('.time-slots-container');
        const scrollAmount = container.clientWidth;
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }

    


    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            if (this.classList.contains('available')) {
                this.classList.toggle('selected');
                
                const date = this.dataset.date;
                const startTime = this.dataset.start;
                const endTime = this.dataset.end;
                
                console.log('Clicked slot:', {
                    date,
                    startTime,
                    endTime,
                    isSelected: this.classList.contains('selected')
                });
                
                const slotData = {
                    date: date,
                    startTime: startTime,
                    endTime: endTime
                };
                
                if (this.classList.contains('selected')) {
                    selectedSlots.push(slotData);
                    console.log('Added slot:', slotData);
                } else {
                    const index = selectedSlots.findIndex(slot => 
                        slot.date === slotData.date && 
                        slot.startTime === slotData.startTime && 
                        slot.endTime === slotData.endTime
                    );
                    console.log('Found slot at index:', index);
                    if (index > -1) {
                        selectedSlots.splice(index, 1);
                        console.log('Removed slot at index:', index);
                    }
                }
                
                console.log('Current selected slots:', selectedSlots);
            }
        });
    });

    document.querySelector('.booking-button').addEventListener('click', () => {
        console.log('Booking button clicked');
        console.log('Number of selected slots:', selectedSlots.length);
        
        if (selectedSlots.length === 0) {
            console.warn('No slots selected');
            alert('Vui lòng chọn ít nhất một khung giờ');
            return;
        }
        
        const bookingData = {
            fieldId: "BD001",
            slots: selectedSlots.map(slot => ({
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime
            }))
        };

        console.log('Prepared booking data:', bookingData);

        console.log('Booking Data:');
        console.log('Field ID:', bookingData.fieldId);
        console.log('Selected Slots:');
        bookingData.slots.forEach((slot, index) => {
            console.log(`Slot ${index + 1}:`, {
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime
            });
        });

        /*Tạm thời comment phần gửi API
        fetch('/api/court/bookSlots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Có lỗi xảy ra khi đặt sân');
            }
            return response.json();
        })
        .then(data => {
            console.log('Booking successful:', data);
            alert('Đặt sân thành công!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi đặt sân. Vui lòng thử lại!');
        });
        */
    });

    prevButton.addEventListener('click', scrollToPrevGroup);
    nextButton.addEventListener('click', scrollToNextGroup);

    // Thêm khai báo các button
    const bookingButton = document.querySelector('.booking-button');
    const favorButton = document.querySelector('.favor-button');

    // API đặt sân
    bookingButton.addEventListener('click', () => {
        // Log data trước khi gửi request
        console.log('Selected slots before booking:', selectedSlots);
        
        if (selectedSlots.length === 0) {
            alert('Vui lòng chọn ít nhất một khung giờ');
            return;
        }

        // Lấy fieldId từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const fieldId = urlParams.get('id') || "BD001"; // Fallback nếu không có id

        // Format dữ liệu theo cấu trúc API mong đợi
        const bookingRequests = selectedSlots.map(slot => ({
            resrv_id: `RSV${Date.now()}`, // Tạo ID unique
            time_begin: slot.startTime,
            time_end: slot.endTime,
            resrv_date: formatDateForAPI(slot.date), // Thêm hàm format date
            renting_price: 100.0, // Giá có thể lấy từ thông tin sân
            created_date: new Date().toISOString().split('T')[0],
            field_id: fieldId,
            cust_id: "DUMMY", // Có thể lấy từ session user
            resrv_status: "pending"
        }));

        console.log('Formatted booking requests:', bookingRequests);

        // Gửi từng request đặt sân
        Promise.all(bookingRequests.map(bookingData => 
            fetch('/api/court/addResrv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            })
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Error response body:', text);
                        throw new Error(`HTTP error! Status: ${response.status}, Body: ${text}`);
                    });
                }
                return response.json();
            })
        ))
        .then(results => {
            console.log('All bookings successful:', results);
            alert('Đặt sân thành công!');
            // Có thể refresh trang hoặc cập nhật UI
            location.reload();
        })
        .catch(error => {
            console.error('Booking error details:', error);
            alert('Có lỗi xảy ra khi đặt sân. Vui lòng thử lại!');
        });
    });

    // Hàm hỗ trợ format date từ "DD/MM" thành "YYYY-MM-DD"
    function formatDateForAPI(dateStr) {
        const [day, month] = dateStr.split('/');
        const year = new Date().getFullYear();
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Xử lý sân yêu thích
    let isFavorite = false;
    favorButton.addEventListener('click', () => {
        const data = {
            cust_id: "DUMMY",
            field_id: "BD001"
        };

        const endpoint = isFavorite ? '/api/court/delFavor' : '/api/court/addFavor';
        
        fetch(endpoint, {
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
                isFavorite = !isFavorite; // Toggle trạng thái
            })
            .catch(error => {
                console.error('Error:', error); 
            });
    });
}); 