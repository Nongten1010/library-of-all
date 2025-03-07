<?php
// หน้าหลักของ backend
header('Content-Type: application/json');
echo json_encode([
    'name' => 'Library of Things API',
    'version' => '1.0.0',
    'status' => 'running',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>