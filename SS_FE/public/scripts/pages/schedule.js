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

    prevButton.addEventListener('click', scrollToPrevGroup);
    nextButton.addEventListener('click', scrollToNextGroup);
}); 