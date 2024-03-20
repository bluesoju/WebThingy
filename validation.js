// Nếu buộc phải có Database thì phải tự cài nữa mới được
// Tui không chắc ông xài Database gì ? (PostgreSQL hay MongoDB)
// Nên tạm thời tui để Local Storage để "giả bộ" như là đang lưu trên DB hẳn hoi
// Nếu ông cài rồi thì ông có thể tự chỉnh lệnh trong này (tại các dòng có LocalStorage) để request lên DB của ông lên
// để truy vấn cái gì ông cần

function registration()
{

    var name = document.getElementById("name").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("pass").value;
    var email = document.getElementById("email").value;
    var reenter_pass = document.getElementById("re-enter").value;

    var email_reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var pwd_expression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

    //Kiểm tra trong Local Storage xem có user này chưa
    if(localStorage.getItem(username) != null) 
    {
        alert("Username already exist");
    }

    //Kiểm tra xem có nhập đúng là email không
    else if(!email_reg.test(email))
    {
        alert("Please enter email");
    }

    //Kiểm tra trong Local Storage xem có email này chưa
    else if(localStorage.getItem(email) != null) 
    {
        alert("Email already used");
    }

    //Kiểm tra pass nhập có trùng với pass nhập lại, hơi thiếu bảo mật vì không check Hash
    else if(password != reenter_pass)
    {
        alert("Passwords do not match");
    }

    //Kiểm tra pass đủ dài hay không ?
    else if(password.length < 8)
    {
        alert("Password must be longer than 8 characters");
    }

    //Kiểm tra pass đủ mạnh hay chưa ?
    else if(!pwd_expression.test(password))
    {
        alert("Password must contain capitalized words, special characters and numbers");
    }

    //Hoàn tất và lưu lại
    else
    {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);
        alert("Thank you for register");
        window.location.href = "login.html";
    }


}

function login() {
    var storedUsername = localStorage.getItem("username");
    var storedEmail = localStorage.getItem("email");
    var storedPassword = localStorage.getItem("password");

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if ((username !== storedUsername && username !== storedEmail) || password !== storedPassword) {
        alert("Invalid username/email or password");
    } 
    
    else {
        alert("Login successful!");
        window.location.href = "dashboard.html";
    }
}