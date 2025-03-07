<?php
require_once __DIR__ . '/../../models/Equipment.php';  // เปลี่ยนจาก LibraryItem.php
require_once __DIR__ . '/../../models/Borrowing.php';  // เปลี่ยนจาก LibraryItemBorrowing.php
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';

class LibraryOfThingsController {
    private $equipmentModel;       // เปลี่ยนชื่อตัวแปร
    private $borrowingModel;       // เปลี่ยนชื่อตัวแปร
    
    public function __construct() {
        $this->equipmentModel = new Equipment();     // เปลี่ยนเป็นคลาสใหม่
        $this->borrowingModel = new Borrowing();     // เปลี่ยนเป็นคลาสใหม่
    }
    
    // ดึงรายการอุปกรณ์ทั้งหมดพร้อม filter และ pagination
    public function getItems() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $search = isset($_GET['search']) ? $_GET['search'] : "";
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        
        $result = $this->equipmentModel->getAll($limit, $offset, $search, $category, $status);  // เปลี่ยนชื่อตัวแปร
        Response::success($result);
    }
    
    // ดึงข้อมูลอุปกรณ์ตาม ID
    public function getItem($id) {
        $item = $this->equipmentModel->getById($id);  // เปลี่ยนชื่อตัวแปร
        
        if (!$item) {
            Response::error("Item not found", 404);
        }
        
        // ดึงรูปภาพของอุปกรณ์
        $images = $this->equipmentModel->getImages($id);  // เปลี่ยนชื่อตัวแปร
        $item['images'] = $images;
        
        // ดึงประวัติการซ่อมบำรุง
        $maintenanceHistory = $this->equipmentModel->getMaintenanceHistory($id);  // เปลี่ยนชื่อตัวแปร
        $item['maintenance_history'] = $maintenanceHistory;
        
        Response::success($item);
    }
    
    // เพิ่มอุปกรณ์ใหม่
    public function addItem() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        // ตรวจสอบข้อมูลที่จำเป็น
        $rules = [
            'id' => 'required',
            'name' => 'required',
            'category_id' => 'required|numeric',
            'status_id' => 'required|numeric',
        ];
        
        if (!Validator::validate($data, $rules)) {
            Response::error("Validation failed", 400, Validator::getErrors());
        }
        
        // จัดเตรียมข้อมูล specifications เป็น JSON ถ้ามี
        if (isset($data['specifications']) && is_array($data['specifications'])) {
            $data['specifications'] = json_encode($data['specifications']);
        }
        
        // เพิ่มอุปกรณ์ใหม่
        $result = $this->equipmentModel->create($data);  // เปลี่ยนชื่อตัวแปร
        
        if (!$result) {
            Response::error("Failed to create item", 500);
        }
        
        // หากมีการอัปโหลดรูปภาพ
        if (isset($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $index => $image) {
                $isPrimary = $index === 0 ? 1 : 0; // รูปแรกเป็นรูปหลัก
                $this->equipmentModel->addImage($data['id'], $image['file_name'], $image['file_path'], $isPrimary);  // เปลี่ยนชื่อตัวแปร
            }
        }
        
        Response::success(['id' => $data['id']], "Item created successfully", 201);
    }
    
    // อัพเดตอุปกรณ์ที่มีอยู่
    public function updateItem($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        // ตรวจสอบว่าอุปกรณ์นี้มีอยู่จริง
        $item = $this->equipmentModel->getById($id);  // เปลี่ยนชื่อตัวแปร
        
        if (!$item) {
            Response::error("Item not found", 404);
        }
        
        // ตรวจสอบข้อมูลที่จำเป็น
        $rules = [
            'name' => 'required',
            'category_id' => 'required|numeric',
            'status_id' => 'required|numeric',
        ];
        
        if (!Validator::validate($data, $rules)) {
            Response::error("Validation failed", 400, Validator::getErrors());
        }
        
        // จัดเตรียมข้อมูล specifications เป็น JSON ถ้ามี
        if (isset($data['specifications']) && is_array($data['specifications'])) {
            $data['specifications'] = json_encode($data['specifications']);
        }
        
        // อัพเดตอุปกรณ์
        $result = $this->equipmentModel->update($id, $data);  // เปลี่ยนชื่อตัวแปร
        
        if (!$result) {
            Response::error("Failed to update item", 500);
        }
        
        Response::success(null, "Item updated successfully");
    }
    
    // ลบอุปกรณ์
    public function deleteItem($id) {
        // ตรวจสอบว่าอุปกรณ์นี้มีอยู่จริง
        $item = $this->equipmentModel->getById($id);  // เปลี่ยนชื่อตัวแปร
        
        if (!$item) {
            Response::error("Item not found", 404);
        }
        
        // ลบรูปภาพที่เกี่ยวข้อง
        $this->equipmentModel->deleteImages($id);  // เปลี่ยนชื่อตัวแปร
        
        // ลบประวัติการซ่อมบำรุง
        $this->equipmentModel->deleteMaintenanceHistory($id);  // เปลี่ยนชื่อตัวแปร
        
        // ลบอุปกรณ์
        $result = $this->equipmentModel->delete($id);  // เปลี่ยนชื่อตัวแปร
        
        if (!$result) {
            Response::error("Failed to delete item", 500);
        }
        
        Response::success(null, "Item deleted successfully");
    }
    
    // ดึงรายการยืมทั้งหมด
    public function getBorrowings() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $search = isset($_GET['search']) ? $_GET['search'] : "";
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        
        $result = $this->borrowingModel->getAll($limit, $offset, $status, $search);
        Response::success($result);
    }
    
    // ดึงข้อมูลการยืมตาม ID
    public function getBorrowing($id) {
        $borrowing = $this->borrowingModel->getById($id);
        
        if (!$borrowing) {
            Response::error("Borrowing record not found", 404);
        }
        
        Response::success($borrowing);
    }
    
    // อนุมัติการยืม
    public function approveBorrowing($id) {
        $borrowing = $this->borrowingModel->getById($id);
        
        if (!$borrowing) {
            Response::error("Borrowing record not found", 404);
        }
        
        if ($borrowing['status_name'] !== 'pending') {
            Response::error("Cannot approve. Status is not pending", 400);
        }
        
        $result = $this->borrowingModel->approve($id);
        
        if (!$result) {
            Response::error("Failed to approve borrowing", 500);
        }
        
        Response::success(null, "Borrowing approved successfully");
    }
    
    // ยกเลิกการยืม
    public function cancelBorrowing($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['reason']) || empty($data['reason'])) {
            Response::error("Reason is required", 400);
        }
        
        $borrowing = $this->borrowingModel->getById($id);
        
        if (!$borrowing) {
            Response::error("Borrowing record not found", 404);
        }
        
        if ($borrowing['status_name'] !== 'pending' && $borrowing['status_name'] !== 'borrowing') {
            Response::error("Cannot cancel. Status must be pending or borrowing", 400);
        }
        
        $result = $this->borrowingModel->cancel($id, $data['reason']);
        
        if (!$result) {
            Response::error("Failed to cancel borrowing", 500);
        }
        
        Response::success(null, "Borrowing cancelled successfully");
    }
    
    // บันทึกการคืน
    public function returnBorrowing($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $notes = isset($data['notes']) ? $data['notes'] : null;
        
        $borrowing = $this->borrowingModel->getById($id);
        
        if (!$borrowing) {
            Response::error("Borrowing record not found", 404);
        }
        
        if ($borrowing['status_name'] !== 'borrowing' && $borrowing['status_name'] !== 'overdue') {
            Response::error("Cannot return. Status must be borrowing or overdue", 400);
        }
        
        // คำนวณค่าปรับ (ถ้ามี)
        $fineData = [];
        if (isset($data['fine_days']) && $data['fine_days'] > 0) {
            $fineData['fine_days'] = $data['fine_days'];
            $fineData['fine_amount'] = $data['fine_amount'] ?? 0;
            $fineData['payment_method'] = $data['payment_method'] ?? null;
            $fineData['payment_complete'] = $data['payment_complete'] ?? 0;
        }
        
        $result = $this->borrowingModel->markAsReturned($id, $notes, $fineData);
        
        if (!$result) {
            Response::error("Failed to mark as returned", 500);
        }
        
        Response::success(null, "Item marked as returned successfully");
    }
    
    // บันทึกการนำเข้าบำรุงรักษา
    public function maintenanceBorrowing($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['reason']) || empty($data['reason'])) {
            Response::error("Reason is required", 400);
        }
        
        $borrowing = $this->borrowingModel->getById($id);
        
        if (!$borrowing) {
            Response::error("Borrowing record not found", 404);
        }
        
        $result = $this->borrowingModel->markAsMaintenance($id, $data['reason']);
        
        if (!$result) {
            Response::error("Failed to mark as maintenance", 500);
        }
        
        // บันทึกประวัติการซ่อมบำรุง
        $maintenanceData = [
            'equipment_id' => $borrowing['equipment_id'],
            'date' => date('Y-m-d'),
            'type' => 'เข้าซ่อมบำรุงจากการยืม',
            'notes' => $data['reason'],
            'performed_by' => isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null
        ];
        
        $this->equipmentModel->addMaintenanceHistory($maintenanceData);  // เปลี่ยนชื่อตัวแปร
        
        Response::success(null, "Item marked for maintenance successfully");
    }
    
    // ดึงข้อมูลหมวดหมู่ทั้งหมด
    public function getCategories() {
        $categories = $this->equipmentModel->getAllCategories();  // เปลี่ยนชื่อตัวแปร
        Response::success($categories);
    }
    
    // ดึงข้อมูลสถานะทั้งหมด
    public function getStatuses() {
        $statuses = $this->equipmentModel->getAllStatuses();  // เปลี่ยนชื่อตัวแปร
        Response::success($statuses);
    }
    
    // ดึงข้อมูลสถานะการยืมทั้งหมด
    public function getBorrowStatuses() {
        $statuses = $this->borrowingModel->getAllBorrowStatuses();
        Response::success($statuses);
    }
}
?>