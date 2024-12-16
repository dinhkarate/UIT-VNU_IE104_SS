const registerButton = document.querySelector('.register-button');

function registerUser(data) {
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

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect the form data
    //const data = Array.from(document.querySelectorAll('#registerForm input')).reduce((acc, input) => ({...acc, [input.id]: input.value}), {});
    const data = Array.from(document.querySelectorAll('#registerForm input')).reduce(
        (acc, input) => ({ ...acc, [input.id]: input.type === 'checkbox' ? input.checked : input.value }),
        {}
      );
  
      // Check if the passwords match
      if (data.password !== data.confirmpassword) {
        alert('Mật khẩu và Xác nhận mật khẩu không khớp!');
        return; // Stop form submission if passwords don't match
      }
  
      // Debugging: Log form data to the console
      console.log('Collected Form Data:', data);
    data.signup_date = new Date().toISOString();
    data.cust_id = 'CUS11';// Dòng này lúc sau làm theo DB đã được cập nhật thì xóa vì cái này sẽ tự tạo tăng dần trong DB(tui để đây là do DB của tui  chưa cập nhật)
    // Send the data to the backend using fetch
    registerUser(data);
  });
