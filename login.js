// function login() {
//     var username = document.getElementById("username").value;
//     var password = document.getElementById("password").value;

//     var storedUsername = localStorage.getItem("username");
//     var storedEmail = localStorage.getItem("email");
//     var storedPassword = localStorage.getItem("password");

//     if ((username !== storedUsername && username !== storedEmail) || password !== storedPassword) {
//         alert("Invalid username/email or password");
//     } 
    
//     else {
//         alert("Login successful!");
//         window.location.href = "dashboard.html";
//     }
// }

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Tạo một đối tượng chứa thông tin đăng nhập
    var loginData = {
        username: username,
        password: password
    };

    // Gửi yêu cầu POST đến server để xác thực thông tin đăng nhập
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            // Nếu đăng nhập thành công, chuyển hướng đến trang dashboard.html
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            // Nếu đăng nhập không thành công, hiển thị thông báo lỗi
            alert("Invalid username/email or password");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
