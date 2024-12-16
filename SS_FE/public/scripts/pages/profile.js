// ============== MENU & SUBMENU ==============
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
        let submenu = item.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            if (submenu.style.maxHeight) {
                submenu.style.maxHeight = null;
            } else {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
            }
        }
    });
});

const submenuItems = document.querySelectorAll('.submenu-item');
const breadcrumbTitle = document.querySelector('.breadcrumb-title');

// Khối cũ
const infoTitle = document.getElementById('info-title');
const infoSection = document.getElementById('info-section');
const commentHistorySection = document.getElementById('comment-history-section');
const changePasswordSection = document.getElementById('change-password-section');
const bookingSection = document.getElementById('booking-section');
// Sân yêu thích
const favoriteSection = document.getElementById('favorite-section');

const alertSuccess = document.querySelector('.alert-success');

submenuItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.getAttribute('data-title');
        
        // Trước khi switch, thoát edit mode
        exitEditMode(); 

        // Cập nhật URL và breadcrumb theo từng trường hợp
        if (title === "Thông tin tài khoản") {
            window.history.pushState({}, '', '?section=info');
            breadcrumbTitle.textContent = "Thông tin tài khoản";
            breadcrumbTitle.href = "?section=info";
            infoSection.style.display = 'block';
            infoTitle.style.display = 'block';
            commentHistorySection.style.display = 'none';
            changePasswordSection.style.display = 'none';
            bookingSection.style.display = 'none';
            favoriteSection.style.display = 'none';
        }
        else if (title === "Lịch sử bình luận") {
            window.history.pushState({}, '', '?section=comments');
            breadcrumbTitle.textContent = "Lịch sử bình luận";
            breadcrumbTitle.href = "?section=comments";
            infoSection.style.display = 'none';
            infoTitle.style.display = 'none';
            commentHistorySection.style.display = 'block';
            changePasswordSection.style.display = 'none';
            bookingSection.style.display = 'none';
            favoriteSection.style.display = 'none';
        }
        else if (title === "Đổi mật khẩu") {
            window.history.pushState({}, '', '?section=password');
            breadcrumbTitle.textContent = "Đổi mật khẩu";
            breadcrumbTitle.href = "?section=password";
            infoSection.style.display = 'none';
            infoTitle.style.display = 'none';
            commentHistorySection.style.display = 'none';
            bookingSection.style.display = 'none';
            favoriteSection.style.display = 'none';
            changePasswordSection.style.display = 'block';
        }
        else if (title === "Lịch đặt sân") {
            window.history.pushState({}, '', '?section=bookings');
            breadcrumbTitle.textContent = "Lịch đặt sân";
            breadcrumbTitle.href = "?section=bookings";
            infoSection.style.display = 'none';
            infoTitle.style.display = 'none';
            commentHistorySection.style.display = 'none';
            changePasswordSection.style.display = 'none';
            favoriteSection.style.display = 'none';
            bookingSection.style.display = 'block';
        }
        else if (title === "Sân của bạn") {
            window.history.pushState({}, '', '?section=favorites');
            breadcrumbTitle.textContent = "Sân yêu thích";
            breadcrumbTitle.href = "?section=favorites";
            infoSection.style.display = 'none';
            infoTitle.style.display = 'none';
            commentHistorySection.style.display = 'none';
            changePasswordSection.style.display = 'none';
            bookingSection.style.display = 'none';
            favoriteSection.style.display = 'block';
        }
        else {
            // các submenu khác (nếu có)
            window.history.pushState({}, '', '?section=info');
            breadcrumbTitle.href = "?section=info";
            infoSection.style.display = 'none';
            infoTitle.style.display = 'none';
            commentHistorySection.style.display = 'none';
            changePasswordSection.style.display = 'none';
            bookingSection.style.display = 'none';
            favoriteSection.style.display = 'none';
        }
    });
});

// Thêm xử lý khi người dùng sử dụng nút back/forward của trình duyệt
window.addEventListener('popstate', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section') || 'info';
    
    // Tìm và click vào submenu item tương ứng
    submenuItems.forEach(item => {
        if ((section === 'info' && item.getAttribute('data-title') === "Thông tin tài khoản") ||
            (section === 'comments' && item.getAttribute('data-title') === "Lịch sử bình luận") ||
            (section === 'password' && item.getAttribute('data-title') === "Đổi mật khẩu") ||
            (section === 'bookings' && item.getAttribute('data-title') === "Lịch đặt sân") ||
            (section === 'favorites' && item.getAttribute('data-title') === "Sân của bạn")) {
            item.click();
        }
    });
});

// Kiểm tra URL khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section') || 'info';
    
    // Tìm và click vào submenu item tương ứng
    submenuItems.forEach(item => {
        if ((section === 'info' && item.getAttribute('data-title') === "Thông tin tài khoản") ||
            (section === 'comments' && item.getAttribute('data-title') === "Lịch sử bình luận") ||
            (section === 'password' && item.getAttribute('data-title') === "Đổi mật khẩu") ||
            (section === 'bookings' && item.getAttribute('data-title') === "Lịch đặt sân") ||
            (section === 'favorites' && item.getAttribute('data-title') === "Sân của bạn")) {
            item.click();
        }
    });
});

// ============== CHỨC NĂNG ĐỔI MẬT KHẨU ==============
const changePasswordEyeIcons = changePasswordSection.querySelectorAll('.eye-icon');
changePasswordEyeIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.parentElement.querySelector('.password-input');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('eye-hide');
            icon.classList.add('eye-show');
        } else {
            input.type = 'password';
            icon.classList.remove('eye-show');
            icon.classList.add('eye-hide');
        }
    });
});

const passwordSubmitButton = document.querySelector('.password-submit-button');
passwordSubmitButton.addEventListener('click', () => {
    alertSuccess.textContent = "Đổi mật khẩu thành công";
    alertSuccess.style.display = 'block';
    alertSuccess.classList.remove('fade-out');
    setTimeout(() => {
        alertSuccess.classList.add('fade-out');
        setTimeout(() => {
            alertSuccess.style.display = 'none';
        }, 1000);
    }, 5000);
});

// ============== CHỈNH SỬA THÔNG TIN TÀI KHOẢN ==============
const editButton = document.querySelector('.edit-button');
const saveButton = document.querySelector('.save-button');
const chooseImageButton = document.querySelector('.choose-image-button');
const fileInput = document.querySelector('.file-input');

// Các trường cũ
const fullnameField   = document.querySelector('[data-field="fullname"]');
const emailField      = document.querySelector('[data-field="email"]');
const birthdayField   = document.querySelector('[data-field="birthday"]');
const genderField     = document.querySelector('[data-field="gender"]');
const phoneField      = document.querySelector('[data-field="phone"]');
const dateField       = document.querySelector('[data-field="date"]');
const customerIdField = document.querySelector('[data-field="customerid"]');

let editing = false;

function enterEditMode() {
    editing = true;
    document.querySelector('.content').classList.add('editing');
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
    chooseImageButton.style.display = 'inline-block';
    alertSuccess.style.display = 'none';

    convertToInput(fullnameField, false, "Họ và tên");
    convertToInput(emailField, true, "Email");
    convertToInput(birthdayField, false, "Ngày sinh");
    convertToInput(genderField, false, "Giới tính");
    convertToInput(phoneField, false, "Số điện thoại");
    convertToInput(dateField, true, "Ngày đăng ký");
    convertToInput(customerIdField, true, "Mã khách hàng");
}

function exitEditMode() {
    editing = false;
    document.querySelector('.content').classList.remove('editing');
    editButton.style.display = 'inline-block';
    saveButton.style.display = 'none';
    chooseImageButton.style.display = 'none';

    restoreFromInput(fullnameField);
    restoreFromInput(emailField);
    restoreFromInput(birthdayField);
    restoreFromInput(genderField);
    restoreFromInput(phoneField);
    restoreFromInput(dateField);
    restoreFromInput(customerIdField);
}

function convertToInput(element, disabled, labelText) {
    const oldValue = element.textContent.trim();
    element.innerHTML = '';

    const floatLabel = document.createElement('label');
    floatLabel.classList.add('floating-label');
    floatLabel.textContent = labelText;

    const fieldName = element.getAttribute('data-field');
    let input;

    if (fieldName === 'birthday') {
        input = document.createElement('input');
        input.type = 'date';
        const [dd, mm, yyyy] = oldValue.split('/');
        if (dd && mm && yyyy) {
            input.value = `${yyyy}-${mm}-${dd}`;
        }
    }
    else if (fieldName === 'gender') {
        input = document.createElement('select');
        const optionNam = document.createElement('option');
        optionNam.value = "Nam";
        optionNam.textContent = "Nam";

        const optionNu = document.createElement('option');
        optionNu.value = "Nữ";
        optionNu.textContent = "Nữ";

        input.appendChild(optionNam);
        input.appendChild(optionNu);
        input.value = oldValue;
    }
    else {
        input = document.createElement('input');
        input.type = 'text';
        input.value = oldValue;
    }

    if (disabled) {
        input.disabled = true;
        input.classList.add('editing-disabled');
    }

    element.appendChild(input);
    element.appendChild(floatLabel);
}

function restoreFromInput(element) {
    const fieldName = element.getAttribute('data-field');
    const input = element.querySelector('input, select');
    if (input) {
        let newVal = input.value.trim();
        if (fieldName === 'birthday' && input.type === 'date') {
            const [yyyy, mm, dd] = newVal.split('-');
            if (yyyy && mm && dd) {
                newVal = `${dd}/${mm}/${yyyy}`;
            }
        }
        element.innerHTML = newVal;
    }
}

// Nút Chỉnh sửa
editButton.addEventListener('click', () => {
    enterEditMode();
});

// Nút Lưu lại
saveButton.addEventListener('click', () => {
    exitEditMode();
    alertSuccess.textContent = "Cập nhật hồ sơ thành công";
    alertSuccess.style.display = 'block';
    alertSuccess.classList.remove('fade-out');
    setTimeout(() => {
        alertSuccess.classList.add('fade-out');
        setTimeout(() => {
            alertSuccess.style.display = 'none';
        }, 1000);
    }, 5000);
});

// Upload avatar
chooseImageButton.addEventListener('click', () => {
    fileInput.click();
});
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        console.log("User đã chọn file:", e.target.files[0]);
    }
});
