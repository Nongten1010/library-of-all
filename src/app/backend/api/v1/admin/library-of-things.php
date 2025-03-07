<?php
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../controllers/admin/LibraryOfThingsController.php';

$controller = new LibraryOfThingsController();
$method = $_SERVER['REQUEST_METHOD'];

// แยกตาม HTTP method
switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // ดึงข้อมูลอุปกรณ์ตาม ID
            $controller->getItem($_GET['id']);
        } elseif (isset($_GET['borrowing_id'])) {
            // ดึงข้อมูลการยืมตาม ID
            $controller->getBorrowing($_GET['borrowing_id']);
        } elseif (isset($_GET['borrowings'])) {
            // ดึงรายการยืมทั้งหมด
            $controller->getBorrowings();
        } elseif (isset($_GET['categories'])) {
            // ดึงข้อมูลหมวดหมู่
            $controller->getCategories();
        } elseif (isset($_GET['statuses'])) {
            // ดึงข้อมูลสถานะ
            $controller->getStatuses();
        } else {
            // ดึงรายการอุปกรณ์ทั้งหมด
            $controller->getItems();
        }
        break;
    
    case 'POST':
        // เพิ่มอุปกรณ์ใหม่
        $controller->addItem();
        break;
    
    case 'PUT':
        if (isset($_GET['id'])) {
            // อัพเดตอุปกรณ์
            $controller->updateItem($_GET['id']);
        } else {
            Response::error("ID is required", 400);
        }
        break;
    
    case 'DELETE':
        if (isset($_GET['id'])) {
            // ลบอุปกรณ์
            $controller->deleteItem($_GET['id']);
        } else {
            Response::error("ID is required", 400);
        }
        break;
    
    default:
        Response::error("Method not allowed", 405);
        break;
}
?>