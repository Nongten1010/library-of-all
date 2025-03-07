<?php
require_once __DIR__ . '/../config/database.php';

class Equipment {
    private $conn;
    private $table_name = "lot_equipments";
    private $images_table = "lot_equipment_images";
    private $maintenance_table = "lot_maintenance_history";
    private $categories_table = "lot_equipment_categories";
    private $statuses_table = "lot_equipment_statuses";
    
    public $id;
    public $barcode;
    public $serial_number;
    public $name;
    public $category_id;
    public $status_id;
    public $specifications;
    public $price;
    public $purchase_date;
    public $building;
    public $floor;
    public $room;
    public $shelf;
    public $loan_duration;
    public $is_loanable;
    public $daily_fine_rate;
    public $max_fine;
    public $grace_period;
    public $warranty_duration;
    public $warranty_expiry;
    public $warranty_provider;
    public $created_by;
    public $created_at;
    public $updated_at;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    public function getAll($limit = 20, $offset = 0, $search = "", $category = null, $status = null) {
        $query = "SELECT e.*, 
                        ec.name as category_name, 
                        ec.display_name as category_display_name,
                        es.name as status_name
                  FROM " . $this->table_name . " e
                  LEFT JOIN " . $this->categories_table . " ec ON e.category_id = ec.id
                  LEFT JOIN " . $this->statuses_table . " es ON e.status_id = es.id
                  WHERE 1=1";
        
        $params = array();
        
        if (!empty($search)) {
            $query .= " AND (e.name LIKE ? OR e.id LIKE ? OR e.barcode LIKE ? OR e.serial_number LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        
        if ($category !== null && $category !== 'all') {
            $query .= " AND e.category_id = ?";
            $params[] = $category;
        }
        
        if ($status !== null && $status !== 'all') {
            $query .= " AND e.status_id = ?";
            $params[] = $status;
        }
        
        $query .= " ORDER BY e.id DESC LIMIT ?, ?";
        $params[] = (int)$offset;
        $params[] = (int)$limit;
        
        $stmt = $this->conn->prepare($query);
        
        for ($i = 0; $i < count($params); $i++) {
            $stmt->bindParam($i + 1, $params[$i]);
        }
        
        $stmt->execute();
        
        $items = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // แปลง specifications จาก JSON เป็น associative array
            if (isset($row['specifications']) && !empty($row['specifications'])) {
                $row['specifications'] = json_decode($row['specifications'], true);
            }
            
            // ดึงรูปภาพหลัก
            $row['primary_image'] = $this->getPrimaryImage($row['id']);
            
            $items[] = $row;
        }
        
        // ดึงจำนวนรายการทั้งหมด (สำหรับ pagination)
        $countQuery = "SELECT COUNT(*) as total FROM " . $this->table_name . " e WHERE 1=1";
        $countParams = array();
        
        if (!empty($search)) {
            $countQuery .= " AND (e.name LIKE ? OR e.id LIKE ? OR e.barcode LIKE ? OR e.serial_number LIKE ?)";
            $countParams[] = "%$search%";
            $countParams[] = "%$search%";
            $countParams[] = "%$search%";
            $countParams[] = "%$search%";
        }
        
        if ($category !== null && $category !== 'all') {
            $countQuery .= " AND e.category_id = ?";
            $countParams[] = $category;
        }
        
        if ($status !== null && $status !== 'all') {
            $countQuery .= " AND e.status_id = ?";
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
            'items' => $items,
            'total' => $totalItems,
            'limit' => $limit,
            'offset' => $offset
        ];
    }
    
    public function getById($id) {
        $query = "SELECT e.*, 
                        ec.name as category_name,
                        ec.display_name as category_display_name,
                        es.name as status_name
                  FROM " . $this->table_name . " e
                  LEFT JOIN " . $this->categories_table . " ec ON e.category_id = ec.id
                  LEFT JOIN " . $this->statuses_table . " es ON e.status_id = es.id
                  WHERE e.id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($item) {
            // แปลง specifications จาก JSON เป็น associative array
            if (isset($item['specifications']) && !empty($item['specifications'])) {
                $item['specifications'] = json_decode($item['specifications'], true);
            }
        }
        
        return $item;
    }
    
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . "
                 (id, barcode, serial_number, name, category_id, status_id, 
                  specifications, price, purchase_date, building, floor, room, shelf,
                  loan_duration, is_loanable, daily_fine_rate, max_fine, grace_period,
                  warranty_duration, warranty_expiry, warranty_provider, created_by,
                  created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        NOW(), NOW())";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['id']);
        $stmt->bindParam(2, $data['barcode']);
        $stmt->bindParam(3, $data['serial_number']);
        $stmt->bindParam(4, $data['name']);
        $stmt->bindParam(5, $data['category_id']);
        $stmt->bindParam(6, $data['status_id']);
        $stmt->bindParam(7, $data['specifications']);
        $stmt->bindParam(8, $data['price']);
        $stmt->bindParam(9, $data['purchase_date']);
        $stmt->bindParam(10, $data['building']);
        $stmt->bindParam(11, $data['floor']);
        $stmt->bindParam(12, $data['room']);
        $stmt->bindParam(13, $data['shelf']);
        $stmt->bindParam(14, $data['loan_duration']);
        $stmt->bindParam(15, $data['is_loanable']);
        $stmt->bindParam(16, $data['daily_fine_rate']);
        $stmt->bindParam(17, $data['max_fine']);
        $stmt->bindParam(18, $data['grace_period']);
        $stmt->bindParam(19, $data['warranty_duration']);
        $stmt->bindParam(20, $data['warranty_expiry']);
        $stmt->bindParam(21, $data['warranty_provider']);
        $stmt->bindParam(22, $data['created_by']);
        
        return $stmt->execute();
    }
    
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                 SET 
                    barcode = :barcode,
                    serial_number = :serial_number,
                    name = :name,
                    category_id = :category_id,
                    status_id = :status_id,
                    specifications = :specifications,
                    price = :price,
                    purchase_date = :purchase_date,
                    building = :building,
                    floor = :floor,
                    room = :room,
                    shelf = :shelf,
                    loan_duration = :loan_duration,
                    is_loanable = :is_loanable,
                    daily_fine_rate = :daily_fine_rate,
                    max_fine = :max_fine,
                    grace_period = :grace_period,
                    warranty_duration = :warranty_duration,
                    warranty_expiry = :warranty_expiry,
                    warranty_provider = :warranty_provider,
                    updated_at = NOW()
                 WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':barcode', $data['barcode']);
        $stmt->bindParam(':serial_number', $data['serial_number']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':status_id', $data['status_id']);
        $stmt->bindParam(':specifications', $data['specifications']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':purchase_date', $data['purchase_date']);
        $stmt->bindParam(':building', $data['building']);
        $stmt->bindParam(':floor', $data['floor']);
        $stmt->bindParam(':room', $data['room']);
        $stmt->bindParam(':shelf', $data['shelf']);
        $stmt->bindParam(':loan_duration', $data['loan_duration']);
        $stmt->bindParam(':is_loanable', $data['is_loanable']);
        $stmt->bindParam(':daily_fine_rate', $data['daily_fine_rate']);
        $stmt->bindParam(':max_fine', $data['max_fine']);
        $stmt->bindParam(':grace_period', $data['grace_period']);
        $stmt->bindParam(':warranty_duration', $data['warranty_duration']);
        $stmt->bindParam(':warranty_expiry', $data['warranty_expiry']);
        $stmt->bindParam(':warranty_provider', $data['warranty_provider']);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        
        return $stmt->execute();
    }
    
    public function updateStatus($id, $status_id) {
        $query = "UPDATE " . $this->table_name . "
                 SET status_id = :status_id, updated_at = NOW()
                 WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':status_id', $status_id);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    public function getImages($equipment_id) {
        $query = "SELECT * FROM " . $this->images_table . " WHERE equipment_id = ? ORDER BY is_primary DESC, id ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $equipment_id);
        $stmt->execute();
        
        $images = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $images[] = $row;
        }
        
        return $images;
    }
    
    public function getPrimaryImage($equipment_id) {
        $query = "SELECT file_path FROM " . $this->images_table . " WHERE equipment_id = ? AND is_primary = 1 LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $equipment_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $row ? $row['file_path'] : null;
    }
    
    public function addImage($equipment_id, $file_name, $file_path, $is_primary = 0) {
        // ถ้าตั้งเป็นรูปหลัก ให้ยกเลิกรูปหลักเดิมก่อน
        if ($is_primary) {
            $updateQuery = "UPDATE " . $this->images_table . " SET is_primary = 0 WHERE equipment_id = ?";
            $updateStmt = $this->conn->prepare($updateQuery);
            $updateStmt->bindParam(1, $equipment_id);
            $updateStmt->execute();
        }
        
        $query = "INSERT INTO " . $this->images_table . "
                 (equipment_id, file_name, file_path, is_primary, created_at)
                 VALUES (?, ?, ?, ?, NOW())";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $equipment_id);
        $stmt->bindParam(2, $file_name);
        $stmt->bindParam(3, $file_path);
        $stmt->bindParam(4, $is_primary);
        
        return $stmt->execute();
    }
    
    public function deleteImages($equipment_id) {
        $query = "DELETE FROM " . $this->images_table . " WHERE equipment_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $equipment_id);
        
        return $stmt->execute();
    }
    
    public function getMaintenanceHistory($equipment_id) {
        $query = "SELECT m.*, u.name as performed_by_name 
                  FROM " . $this->maintenance_table . " m
                  LEFT JOIN users u ON m.performed_by = u.id
                  WHERE m.equipment_id = ? 
                  ORDER BY m.date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $equipment_id);
        $stmt->execute();
        
        $history = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $history[] = $row;
        }
        
        return $history;
    }
    
    public function addMaintenanceHistory($data) {
        $query = "INSERT INTO " . $this->maintenance_table . "
                 (equipment_id, date, type, notes, performed_by, created_at)
                 VALUES (?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $data['equipment_id']);
        $stmt->bindParam(2, $data['date']);
        $stmt->bindParam(3, $data['type']);
        $stmt->bindParam(4, $data['notes']);
        $stmt->bindParam(5, $data['performed_by']);
        
        return $stmt->execute();
    }
    
    public function deleteMaintenanceHistory($equipment_id) {
        $query = "DELETE FROM " . $this->maintenance_table . " WHERE equipment_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $equipment_id);
        
        return $stmt->execute();
    }
    
    public function getAllCategories() {
        $query = "SELECT * FROM " . $this->categories_table . " ORDER BY id ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $categories = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $categories[] = $row;
        }
        
        return $categories;
    }
    
    public function getAllStatuses() {
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