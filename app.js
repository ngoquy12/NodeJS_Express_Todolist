// Khởi tạo server
const express = require("express");
const server = express();
const router = express.Router();
const fs = require("fs");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todos.routes");

server.use(express.static("public"));
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
server.use(bodyParser.json());

// Use Routes: phải khai báo sau cùng
server.use("/api/v1/todos", todoRoutes);
// Đọc file app.html
// __ dirname là được xem như là đường dẫn tại cục bộ (http://localhost:3000)
server.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/app.html");
});

// Cài đặt để server luôn chờ đợi và lắng nghe các request gửi lên từ client
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
