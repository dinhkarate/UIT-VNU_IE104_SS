const loginButton = document.querySelector('.login-button');


//Function to Set a Cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//Function to Get a Cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}


function fetchLogin(data) {
    fetch('/api/auth/login', {
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
    .then(data => {
        localStorage.setItem('token', data.token);
    })
    .catch(error => {
        console.error('Login failed:', result.message);
    });
};


// Call the register function
document.addEventListener('DOMContentLoaded', () => {
    // Example usage
    const data = {
    username: 'tuyenj',
    password: 'vietpass', // Nếu sai mật khẩu thì sẽ gửi lại 401 unauthorized
};
    fetchLogin(data);
})