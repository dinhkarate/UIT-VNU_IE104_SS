let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');

const maxSlides = 3;
const totalSlides = Math.min(slides.length, maxSlides);

function showSlide(index) {
    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;

    document.querySelector('.carousel-slide').style.transform = `translateX(-${currentSlide * 100}%)`;

    indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === currentSlide);
    });
}

setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

document.querySelector('.left-nav').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('.right-nav').addEventListener('click', () => showSlide(currentSlide + 1));

indicators.forEach((indicator, idx) => {
    if (idx < totalSlides) {
        indicator.addEventListener('click', () => showSlide(idx));
    }
});
