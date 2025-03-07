<?php
class Database {
    private $host = "localhost";        // โฮสต์ของ MAMP (มักเป็น localhost)
    private $db_name = "library_db";    // ชื่อฐานข้อมูลของคุณ
    private $username = "root";         // username ปกติของ MAMP
    private $password = "root";         // รหัสผ่านปกติของ MAMP
    private $port = 8889;               // พอร์ต MySQL ของ MAMP (มักเป็น 8889)
    private $conn;
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }
        
        return $this->conn;
    }
}
?>