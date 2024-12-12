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

    

    const selectedSlots = [];

    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            if (this.classList.contains('available')) {
                this.classList.toggle('selected');
                
                const date = this.dataset.date;
                const startTime = this.dataset.start;
                const endTime = this.dataset.end;
                
                const slotData = {
                    date: date,
                    startTime: startTime,
                    endTime: endTime
                };
                
                if (this.classList.contains('selected')) {
                    selectedSlots.push(slotData);
                } else {
                    const index = selectedSlots.findIndex(slot => 
                        slot.date === slotData.date && 
                        slot.startTime === slotData.startTime && 
                        slot.endTime === slotData.endTime
                    );
                    if (index > -1) {
                        selectedSlots.splice(index, 1);
                    }
                }
                
                console.log('Selected slots:', selectedSlots);
            }
        });
    });

    document.querySelector('.booking-button').addEventListener('click', () => {
        if (selectedSlots.length === 0) {
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

        /* Tạm thời comment phần gửi API
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
}); 