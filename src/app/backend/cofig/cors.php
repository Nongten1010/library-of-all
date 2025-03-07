// config/cors.php
<?php
header("Access-Control-Allow-Origin: *"); // หรือกำหนดโดเมนที่ชัดเจน เช่น http://localhost:4200
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}