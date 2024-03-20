const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { login, register, validate } = require('./login');
const { registerUser } = require('./register');
const { validateInput } = require('./validation');

// Tạo secret_key
const sessionSecret = require('crypto').randomBytes(64).toString('hex');
// Kết nối Database 
const db = new sqlite3.Database('database.db');

const app = express();

// Sử dụng body-parser để phân tích nội dung của yêu cầu POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sử dụng sessions
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// Thư mục chứa các file tĩnh như HTML, CSS, JS
app.use(express.static(path.join(__dirname)));

// Đường dẫn cho trang đăng nhập
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     const result = login(username, password);
//     if (result.success) {
//         req.session.user = { username: username }; // Lưu thông tin người dùng vào session
//         res.redirect('/dashboard.html');
//     } else {
//         res.send('Đăng nhập không thành công. Vui lòng thử lại.');
//     }
// });
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Truy vấn để kiểm tra thông tin đăng nhập từ cơ sở dữ liệu
    const sql = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.get(sql, [username, username], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }

        // Kiểm tra xem thông tin đăng nhập có hợp lệ hay không
        if (!row || row.password !== password) {
            return res.status(401).send('Invalid username/email or password');
        }

        // Đăng nhập thành công
        return res.status(200).send('Login successful!');
    });
});

// Đường dẫn cho trang đăng ký
// app.post('/register.html', (req, res) => {
//     const { username, password } = req.body;
//     const validation = validateInput(username, password);
//     if (validation.success) {
//         const registration = registerUser(username, password);
//         if (registration.success) {
//             res.send('Đăng ký thành công.');
//         } else {
//             res.send('Đăng ký không thành công. Vui lòng thử lại.');
//         }
//     } else {
//         res.send(validation.message);
//     }
// });
// Endpoint để xử lý đăng ký người dùng
app.post('/register', (req, res) => {
    const {username, password, email } = req.body;

    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.run(query, [username, password, email], (error) => {
        if (error) {
            console.error('Error adding user:', error);
            res.status(500).send('Registration failed');
            return;
        }
        console.log('User added successfully');
        res.status(200).send('Registration successful');
    });
});

// Đường dẫn cho trang dashboard (yêu cầu đăng nhập)
app.get('/dashboard.html', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Middleware để kiểm tra đăng nhập
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login.html');
    }
}
// Middleware để tự động chuyển hướng đến trang đăng nhập
app.use('/', (req, res, next) => {
    // Chuyển hướng nếu không phải là trang đăng nhập
    if (req.path !== '/login.html') {
        return res.redirect('/login.html');
    }
    // Nếu là trang đăng nhập hoặc trang gốc, tiếp tục xử lý yêu cầu
    next();
});
// Đường dẫn cho trang logout
app.get('/logout', (req, res) => {
    // Xóa thông tin đăng nhập của người dùng khỏi session
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        } else {
            console.log("User logged out successfully");
            // Chuyển hướng người dùng về trang đăng nhập hoặc trang chính của ứng dụng
            res.redirect('/login.html');
        }
    });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});