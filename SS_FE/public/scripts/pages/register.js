const registerButton = document.querySelector('.register-button');

const registerUser = (data) => {
    try {
        const response = fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), 
        });

        const result = response.json();

        if (response.ok) {
            console.log('Registration successful:', result.message);
            // Redirect or handle successful registration here
        } else {
            console.error('Registration failed:', result.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
};

/*
// Call the register function
document.addEventListener('DOMContentLoaded', () => {
    // Example usage
    const data = {
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    password: '123456',
    phone: '1234567890',
    email: 'john.tuyen@gmail.comoe@example.com', // Nếu trùng với Email đã có trong DB thì trả về là 400 Bad request
    signup_date: new Date().toISOString(),
};
    registerUser(data);
})*/
