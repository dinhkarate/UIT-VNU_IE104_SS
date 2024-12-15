document.addEventListener('DOMContentLoaded', function() {
    loadHTML('header-placeholder', '/components/header.html', initializeScrollScript);
    loadHTML('footer-placeholder', '/components/footer.html');

    function loadHTML(id, url, callback) {
        fetch(url)
            .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! Status: ${response.status}`))
            .then(data => {
                document.getElementById(id).innerHTML = data;
                if (callback) callback();
            })
            .catch(error => console.error('Fetch error:', error));
    }

    function initializeScrollScript() {
        const header = document.getElementById('header-wrapper');
        if (!header) return;

        let lastScrollY = window.scrollY;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                if (currentScrollY > scrollThreshold) {
                    header.classList.toggle('header-hidden', currentScrollY > lastScrollY);
                } else {
                    header.classList.remove('header-hidden');
                }
                lastScrollY = currentScrollY;
            });
        });
    }

    setTimeout(() => {
        new LanguageManager();
    }, 500);
});

class LanguageManager {
    constructor() {
        this.currentLang = 'vi';
        this.translations = {};
        this.initElements();
        this.init();
    }

    initElements() {
        this.elements = {
            languageBtn: document.getElementById('language-btn'),
            languageImg: document.getElementById('language-img'),
            headerWrapper: document.getElementById('header-wrapper')
        };

        if (!this.elements.languageBtn || !this.elements.languageImg || !this.elements.headerWrapper) {
            setTimeout(() => this.initElements(), 100);
            return;
        }

        this.elements.languageBtn.addEventListener('click', () => this.toggleLanguage());
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'vi' ? 'en' : 'vi';
        
        const newFlag = this.currentLang === 'vi' ? 'VietNamFlag.png' : 'UKFlag.png';
        this.elements.languageImg.src = `/images/header/${newFlag}`;
        this.elements.languageImg.alt = this.currentLang === 'vi' ? 'Vietnamese' : 'English';
        this.elements.headerWrapper.setAttribute('data-lang', this.currentLang);
        
        this.updateContent(this.currentLang);
    }

    updateContent(lang) {
        const elements = {
            '#home-link .home-text': 'home',
            '.dropdown > a': 'fieldList',
            '#news-link': 'news',
            '#policy-link': 'policy',
            '#owner-link': 'forOwner',
            '#tournament-link': 'tournament',
            '#login-link': 'login',
            '#register-link': 'register'
        };

        Object.entries(elements).forEach(([selector, key]) => {
            const element = document.querySelector(selector);
            if (element && this.translations[lang]) {
                element.textContent = this.translations[lang][key];
            }
        });

        if (this.translations[lang]?.fields) {
            document.querySelectorAll('.dropdown-content a').forEach((link, index) => {
                const fieldKey = Object.keys(this.translations[lang].fields)[index];
                if (fieldKey) {
                    link.textContent = this.translations[lang].fields[fieldKey];
                }
            });
        }

        const searchInput = document.querySelector('.search-bar input');
        if (searchInput && this.translations[lang]) {
            searchInput.placeholder = this.translations[lang].searchPlaceholder;
        }
    }

    async init() {
        try {
            const response = await fetch('/scripts/components/translations.json');
            this.translations = await response.json();
            this.updateContent(this.currentLang);
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }
}


//Function to check if a cookie exists
function checkCookie(cookieName) {
    const cookies = document.cookie;

    const exists = cookies.split('; ').some((cookie) => cookie.startsWith(`${cookieName}=`));

    if (exists) {
        console.log(`Cookie '${cookieName}' tồn tại.`);
        return true;
    } else {
        console.warn(`Cookie '${cookieName}' không tồn tại.`);
        return false;
    }
}

/*//Cookie name sended from BE is token
if (checkCookie('token')) {
    console.log('Cookie tồn tại! Bạn có thể thực hiện hành động tiếp theo.');
} else {
    console.warn('Cookie không tồn tại. Có thể cần yêu cầu người dùng đăng nhập.');
}*/

//If cookie exists then use this function to call API for User information
function loginUserAPI() {
    const data = {cust_id: "DUMMY"}
    fetch('/api/account/profile', {
        method: 'GET',
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
    });e
}