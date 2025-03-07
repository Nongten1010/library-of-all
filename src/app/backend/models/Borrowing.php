<?php
require_once __DIR__ . '/../config/database.php';

class Borrowing {
    private $conn;
    private $table_name = "lot_borrowings";
    private $equipments_table = "lot_equipments";
    private $statuses_table = "lot_borrow_statuses";
    
    public $id;
    public $equipment_id;
    public $user_id;
    public $borrow_date;
    public $due_date;
    public $return_date;
    public $status_id;
    public $fine_days;
    public $fine_amount;
    public $payment_method;
    public $payment_complete;
    public $notes;
    public $created_at;
    public $updated_at;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    public function getAll($limit = 20, $offset = 0, $status = null, $search = "") {
        $query = "SELECT b.*, 
                        bs.name as status_name,
                        bs.display_name as status_display_name,
                        e.name as equipment_name,
                        e.barcode as equipment_barcode,
                        e.category_id as equipment_category_id,
                        e.daily_fine_rate,
                        u.name as user_name,
                        u.student_id as user_student_id,
                        u.email as user_email,
                        u.contact as user_contact,
                        u.department as user_department
                  FROM " . $this->table_name . " b
                  JOIN " . $this->equipments_table . " e ON b.equipment_id = e.id
                  JOIN users u ON b.user_id = u.id
                  JOIN " . $this->statuses_table . " bs ON b.status_id = bs.id
                  WHERE 1=1";
        
        $params = array();
        
        if (!empty($search)) {
            $query .= " AND (e.name LIKE ? OR u.name LIKE ? OR u.student_id LIKE ? OR u.email LIKE ? OR b.id LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        
        if ($status !== null && $status !== 'all') {
            $query .= " AND bs.name = ?";
            $params[] = $status;
        }
        
        $query .= " ORDER BY 
                    CASE 
                        WHEN bs.name = 'pending' THEN 1 
                        WHEN bs.name = 'overdue' THEN 2
                        WHEN bs.name = 'borrowing' THEN 3
                        WHEN bs.name = 'maintenance' THEN 4
                        WHEN bs.name = 'returned' THEN 5
                        ELSE 6 
                    END, 
                    b.id DESC 
                    LIMIT ?, ?";
        $params[] = (int)$offset;
        $params[] = (int)$limit;
        
        $stmt = $this->conn->prepare($query);
        
        for ($i = 0; $i < count($params); $i++) {
            $stmt->bindParam($i + 1, $params[$i]);
        }
        
        $stmt->execute();
        
        $items = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // คำนวณจำนวนวันที่เกินกำหนดสำหรับรายการที่ยังไม่คืน
            if ($row['status_name'] === 'borrowing' || $row['status_name'] === 'overdue') {
                $today = new DateTime();
                $dueDate = new DateTime($row['due_date']);
                
                if ($today > $dueDate) {
                    $interval = $today->diff($dueDate);
                    $row['overdue_days'] = $interval->days;
                    
                    // คำนวณค่าปรับ
                    $row['current_fine'] = $row['overdue_days'] * $row['daily_fine_rate'];
                    
                    // ถ้ามีการกำหนดค่าปรับสูงสุด
                    if (!empty($row['max_fine']) && $row['current_fine'] > $row['max_fine']) {
                        $row['current_fine'] = $row['max_fine'];
                    }
                } else {
                    $row['overdue_days'] = 0;
                    $row['current_fine'] = 0;
                }
            }
            
            $items[] = $row;
        }
        
        // ดึงจำนวนรายการทั้งหมด (สำหรับ pagination)
        $countQuery = "SELECT COUNT(*) as total 
                      FROM " . $this->table_name . " b
                      JOIN " . $this->equipments_table . " e ON b.equipment_id = e.id
                      JOIN users u ON b.user_id = u.id
                      JOIN " . $this->statuses_table . " bs ON b.status_id = bs.id
                      WHERE 1=1";
        
        $countParams = array();
        
        if (!empty($search)) {
            $countQuery .= " AND (e.name LIKE ? OR u.name LIKE ? OR u.student_id LIKE ? OR u.email LIKE ? OR b.id LIKE ?)";
            $countParams[] = "%$search%";
            $countParams[] = "%$search%";
            $countParams[] = "%$search%";
            $countParams[] = "%$search%";
            $countParams[] = "%$search%";
        }
        
        if ($status !== null && $status !== 'all') {
            $countQuery .= " AND bs.name = ?";
            $countParams[] = $status;
        }
        
        $countStmt = $this->conn->prepare($countQuery);
        
        for ($i = 0; $i < count($countParams); $i++) {
            $countStmt->bindParam($i + 1, $countParams[$i]);
        }
        
        $countStmt->execute();
        $row = $countStmt->fetch(PDO::FETCH_ASSOC);
        $totalItems = $row['total'];
        
        return [
            'borrowings' => $items,
            'total' => $totalItems,
            'limit' => $limit,
            'offset' => $offset
        ];
    }
    
    public function getById($id) {
        $query = "SELECT b.*, 
                        bs.name as status_name,
                        bs.display_name as status_display_name,
                        e.name as equipment_name,
                        e.barcode as equipment_barcode,
                        e.id as equipment_id,
                        e.specifications as equipment_specifications,
                        e.category_id as equipment_category_id,
                        e.daily_fine_rate, 
                        e.max_fine,
                        u.name as user_name,
                        u.student_id as user_student_id,
                        u.email as user_email,
                        u.contact as user_contact,
                        u.department as user_department
                  FROM " . $this->table_name . " b
                  JOIN " . $this->equipments_table . " e ON b.equipment_id = e.id
                  JOIN users u ON b.user_id = u.id
                  JOIN " . $this->statuses_table . " bs ON b.status_id = bs.id
                  WHERE b.id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        $borrowing = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($borrowing) {
            // แปลง specifications จาก JSON เป็น associative array
            if (isset($borrowing['equipment_specifications']) && !empty($borrowing['equipment_specifications'])) {
                $borrowing['equipment_specifications'] = json_decode($borrowing['equipment_specifications'], true);
            }
            
            // คำนวณจำนวนวันที่เกินกำหนดสำหรับรายการที่ยังไม่คืน
            if ($borrowing['status_name'] === 'borrowing' || $borrowing['status_name'] === 'overdue') {
                $today = new DateTime();
                $dueDate = new DateTime($borrowing['due_date']);
                
                if ($today > $dueDate) {
                    $interval = $today->diff($dueDate);
                    $borrowing['overdue_days'] = $interval->days;
                    
                    // คำนวณค่าปรับ
                    $borrowing['current_fine'] = $borrowing['overdue_days'] * $borrowing['daily_fine_rate'];
                    
                    // ถ้ามีการกำหนดค่าปรับสูงสุด
                    if (!empty($borrowing['max_fine']) && $borrowing['current_fine'] > $borrowing['max_fine']) {
                        $borrowing['current_fine'] = $borrowing['max_fine'];
                    }
                } else {
                    $borrowing['overdue_days'] = 0;
                    $borrowing['current_fine'] = 0;
                }
            }
        }
        
        return $borrowing;
    }
    
    public function approve($id) {
        // ดึงข้อมูลการยืม
        $borrowing = $this->getById($id);
        
        if (!$borrowing) {
            return false;
        }
        
        // ดึง ID ของสถานะ 'borrowing'
        $statusQuery = "SELECT id FROM " . $this->statuses_table . " WHERE name = 'borrowing' LIMIT 1";
        $statusStmt = $this->conn->prepare($statusQuery);
        $statusStmt->execute();
        $statusRow = $statusStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$statusRow) {
            return false;
        }
        
        $borrowingStatusId = $statusRow['id'];
        
        // อัพเดตสถานะการยืม
        $query = "UPDATE " . $this->table_name . "
                 SET status_id = ?, updated_at = NOW()
                 WHERE id = ? AND status_id = (SELECT id FROM " . $this->statuses_table . " WHERE name = 'pending')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $borrowingStatusId);
        $stmt->bindParam(2, $id);
        
        if (!$stmt->execute()) {
            return false;
        }
        
        // อัพเดตสถานะอุปกรณ์เป็น "ถูกยืม"
        $equipmentStatusQuery = "UPDATE " . $this->equipments_table . "
                               SET status_id = (SELECT id FROM lot_equipment_statuses WHERE name = 'ถูกยืม'), 
                                   updated_at = NOW() 
                               WHERE id = ?";
        
        $equipmentStatusStmt = $this->conn->prepare($equipmentStatusQuery);
        $equipmentStatusStmt->bindParam(1, $borrowing['equipment_id']);
        
        return $equipmentStatusStmt->execute();
    }
    
    public function cancel($id, $reason) {
        // ดึงข้อมูลการยืม
        $borrowing = $this->getById($id);
        
        if (!$borrowing) {
            return false;
        }
        
        // ดึง ID ของสถานะ 'cancelled'
        $statusQuery = "SELECT id FROM " . $this->statuses_table . " WHERE name = 'cancelled' LIMIT 1";
        $statusStmt = $this->conn->prepare($statusQuery);
        $statusStmt->execute();
        $statusRow = $statusStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$statusRow) {
            return false;
        }
        
        $cancelledStatusId = $statusRow['id'];
        
        // อัพเดตสถานะการยืม
        $query = "UPDATE " . $this->table_name . "
                 SET status_id = ?, notes = CONCAT(IFNULL(notes,''), ' Cancel reason: ', ?), updated_at = NOW()
                 WHERE id = ? AND (status_id = (SELECT id FROM " . $this->statuses_table . " WHERE name = 'pending') 
                               OR status_id = (SELECT id FROM " . $this->statuses_table . " WHERE name = 'borrowing'))";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $cancelledStatusId);
        $stmt->bindParam(2, $reason);
        $stmt->bindParam(3, $id);
        
        if (!$stmt->execute()) {
            return false;
        }
        
        // อัพเดตสถานะอุปกรณ์เป็น "ว่าง"
        $equipmentStatusQuery = "UPDATE " . $this->equipments_table . "
                               SET status_id = (SELECT id FROM lot_equipment_statuses WHERE name = 'ว่าง'), 
                                   updated_at = NOW() 
                               WHERE id = ?";
        
        $equipmentStatusStmt = $this->conn->prepare($equipmentStatusQuery);
        $equipmentStatusStmt->bindParam(1, $borrowing['equipment_id']);
        
        return $equipmentStatusStmt->execute();
    }
    
    public function markAsReturned($id, $notes = null, $fineData = []) {
        // ดึงข้อมูลการยืม
        $borrowing = $this->getById($id);
        
        if (!$borrowing) {
            return false;
        }
        
        // ดึง ID ของสถานะ 'returned'
        $statusQuery = "SELECT id FROM " . $this->statuses_table . " WHERE name = 'returned' LIMIT 1";
        $statusStmt = $this->conn->prepare($statusQuery);
        $statusStmt->execute();
        $statusRow = $statusStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$statusRow) {
            return false;
        }
        
        $returnedStatusId = $statusRow['id'];
        
        // สร้างคำสั่ง SQL สำหรับอัพเดตสถานะการยืม
        $query = "UPDATE " . $this->table_name . "
                 SET status_id = ?, 
                     return_date = NOW(), 
                     notes = CONCAT(IFNULL(notes,''), ' ', ?), 
                     updated_at = NOW()";
        
        // ถ้ามีข้อมูลค่าปรับ
        if (!empty($fineData)) {
            $query .= ", fine_days = ?, fine_amount = ?, payment_method = ?, payment_complete = ?";
        }
        
        $query .= " WHERE id = ? AND (status_id = (SELECT id FROM " . $this->statuses_table . " WHERE name = 'borrowing')
                               OR status_id = (SELECT id FROM " . $this->statuses_table . " WHERE name = 'overdue'))";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $returnedStatusId);
        $stmt->bindParam(2, $notes);
        
        $paramIndex = 3;
        
        // ถ้ามีข้อมูลค่าปรับ
        if (!empty($fineData)) {
            $stmt->bindParam($paramIndex++, $fineData['fine_days']);
            $stmt->bindParam($paramIndex++, $fineData['fine_amount']);
            $stmt->bindParam($paramIndex++, $fineData['payment_method']);
            $stmt->bindParam($paramIndex++, $fineData['payment_complete']);
        }
        
        $stmt->bindParam($paramIndex, $id);
        
        if (!$stmt->execute()) {
            return false;
        }
        
        // อัพเดตสถานะอุปกรณ์เป็น "ว่าง"
        $equipmentStatusQuery = "UPDATE " . $this->equipments_table . "
                               SET status_id = (SELECT id FROM lot_equipment_statuses WHERE name = 'ว่าง'), 
                                   updated_at = NOW() 
                               WHERE id = ?";
        
        $equipmentStatusStmt = $this->conn->prepare($equipmentStatusQuery);
        $equipmentStatusStmt->bindParam(1, $borrowing['equipment_id']);
        
        return $equipmentStatusStmt->execute();
    }
    
    public function markAsMaintenance($id, $reason) {
        // ดึงข้อมูลการยืม
        $borrowing = $this->getById($id);
        
        if (!$borrowing) {
            return false;
        }
        
        // ดึง ID ของสถานะ 'maintenance'
        $statusQuery = "SELECT id FROM " . $this->statuses_table . " WHERE name = 'maintenance' LIMIT 1";
        $statusStmt = $this->conn->prepare($statusQuery);
        $statusStmt->execute();
        $statusRow = $statusStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$statusRow) {
            return false;
        }
        
        $maintenanceStatusId = $statusRow['id'];
        
        // อัพเดตสถานะการยืม
        $query = "UPDATE " . $this->table_name . "
                 SET status_id = ?, notes = CONCAT(IFNULL(notes,''), ' Maintenance: ', ?), updated_at = NOW()
                 WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $maintenanceStatusId);
        $stmt->bindParam(2, $reason);
        $stmt->bindParam(3, $id);
        
        if (!$stmt->execute()) {
            return false;
        }
        
        // อัพเดตสถานะอุปกรณ์เป็น "ซ่อม"
        $equipmentStatusQuery = "UPDATE " . $this->equipments_table . "
                               SET status_id = (SELECT id FROM lot_equipment_statuses WHERE name = 'ซ่อม'), 
                                   updated_at = NOW() 
                               WHERE id = ?";
        
        $equipmentStatusStmt = $this->conn->prepare($equipmentStatusQuery);
        $equipmentStatusStmt->bindParam(1, $borrowing['equipment_id']);
        
        return $equipmentStatusStmt->execute();
    }
    
    public function create($data) {
        // ดึง ID ของสถานะ 'pending'
        $statusQuery = "SELECT id FROM " . $this->statuses_table . " WHERE name = 'pending' LIMIT 1";
        $statusStmt = $this->conn->prepare($statusQuery);
        $statusStmt->execute();
        $statusRow = $statusStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$statusRow) {
            return false;
        }
        
        $pendingStatusId = $statusRow['id'];
        
        $query = "INSERT INTO " . $this->table_name . "
                 (id, equipment_id, user_id, borrow_date, due_date, status_id, notes, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['id']);
        $stmt->bindParam(2, $data['equipment_id']);
        $stmt->bindParam(3, $data['user_id']);
        $stmt->bindParam(4, $data['borrow_date']);
        $stmt->bindParam(5, $data['due_date']);
        $stmt->bindParam(6, $pendingStatusId);
        $stmt->bindParam(7, $data['notes']);
        
        return $stmt->execute();
    }
    
    public function checkOverdueBorrowings() {
        // ดึง ID ของสถานะ 'borrowing' และ 'overdue'
        $borrowingStatusQuery = "SELECT id FROM " . $this->statuses_table . " WHERE name = 'borrowing' LIMIT 1";
        $borrowingStatusStmt = $this->conn->prepare($borrowingStatusQuery);
        $borrowingStatusStmt->execute();
        $borrowingStatusRow = $borrowingStatusStmt->fetch(PDO::FETCH_ASSOC);
        
        $overdueStatusQuery = "SELECT id FROM " . $this->statuses_table . " WHERE name = 'overdue' LIMIT 1";
        $overdueStatusStmt = $this->conn->prepare($overdueStatusQuery);
        $overdueStatusStmt->execute();
        $overdueStatusRow = $overdueStatusStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$borrowingStatusRow || !$overdueStatusRow) {
            return false;
        }
        
        $borrowingStatusId = $borrowingStatusRow['id'];
        $overdueStatusId = $overdueStatusRow['id'];
        
        // อัพเดตสถานะสำหรับรายการที่เกินกำหนด
        $query = "UPDATE " . $this->table_name . "
                 SET status_id = ?, updated_at = NOW()
                 WHERE status_id = ? AND due_date < CURDATE() AND return_date IS NULL";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $overdueStatusId);
        $stmt->bindParam(2, $borrowingStatusId);
        
        return $stmt->execute();
    }
    
    public function getAllBorrowStatuses() {
        $query = "SELECT * FROM " . $this->statuses_table . " ORDER BY id ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $statuses = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $statuses[] = $row;
        }
        
        return $statuses;
    }
}
?>