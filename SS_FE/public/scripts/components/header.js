document.addEventListener('DOMContentLoaded', function() {
    loadHTML('header-placeholder', '/components/header.html', initializeScrollScript);
    loadHTML('footer-placeholder', '/components/footer.html');

    function loadHTML(id, url, callback) {
        fetch(url)
            .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! Status: ${response.status}`))
            .then(data => {
                document.getElementById(id).innerHTML = data;
                if (callback) setTimeout(callback, 100);
            })
            .catch(error => console.error('Fetch error:', error));
    }

    function initializeScrollScript() {
        const header = document.getElementById('header-wrapper');
        if (!header) {
            setTimeout(initializeScrollScript, 100);
            return;
        }

        let lastScrollY = window.scrollY;
        const scrollThreshold = 100;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    
                    if (currentScrollY > scrollThreshold) {
                        if (currentScrollY > lastScrollY) {
                            header.classList.add('header-hidden');
                        } else {
                            header.classList.remove('header-hidden');
                        }
                    } else {
                        header.classList.remove('header-hidden');
                    }
                    
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
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


//Function to validate the jwt token
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
});

function loadHeader() {
    // check jwt validity
    fetch('/api/auth/checkjwt', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        if (!response.ok) {
            // Unauth -> header.html
            // False
            throw new Error('Unauthorized');
        }
        return response.json();
    })
    .then((data) => {
        // Auth -> header-auth.html
        // True
        console.log(data);
        loadHeaderComponent('/components/header-auth.html', data.user.username);
    })
    .catch(() => {
        // Error
        // Unauth -> header.html
        loadHeaderComponent('/components/header.html');
    });
}

// Function to load header
function loadHeaderComponent(componentPath, user) {
    fetch(componentPath)
        .then((response) => response.text())
        .then((html) => {
            const headerContainer = document.getElementById('header-placeholder');
            if (headerContainer) {
                headerContainer.innerHTML = html;

                // Case: auth = true 
                if (user) {
                    document.querySelector('.username').textContent = user;                   
                }
            }
        })
        .catch((error) => {
            console.error('Error loading header component:', error);
        });
}


/*function checkUserSession() {
    fetch('/api/auth/checkjwt', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
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
}*/