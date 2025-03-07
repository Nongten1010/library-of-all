<?php
// Router สำหรับ API
$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// ลบ query string ออก
$path = parse_url($request, PHP_URL_PATH);
$path = str_replace('/api/', '', $path);
$segments = explode('/', $path);

// ตรวจสอบ path และเรียก controller ที่เหมาะสม
if (count($segments) >= 2) {
    $version = $segments[0]; // v1
    $module = $segments[1];  // admin, user, etc.
    
    if ($version === 'v1') {
        if ($module === 'admin') {
            if (isset($segments[2])) {
                $resource = $segments[2];
                
                if ($resource === 'library-of-things') {
                    // endpoints สำหรับ library-of-things
                    if (isset($segments[3])) {
                        $action = $segments[3];
                        
                        switch ($action) {
                            case 'approve':
                                include __DIR__ . '/v1/admin/library-of-things/approve.php';
                                break;
                            case 'cancel':
                                include __DIR__ . '/v1/admin/library-of-things/cancel.php';
                                break;
                            case 'return':
                                include __DIR__ . '/v1/admin/library-of-things/return.php';
                                break;
                            case 'maintenance':
                                include __DIR__ . '/v1/admin/library-of-things/maintenance.php';
                                break;
                            case 'categories':
                                include __DIR__ . '/v1/admin/library-of-things/categories.php';
                                break;
                            case 'statuses':
                                include __DIR__ . '/v1/admin/library-of-things/statuses.php';
                                break;
                            case 'borrow-statuses':
                                include __DIR__ . '/v1/admin/library-of-things/borrow-statuses.php';
                                break;
                            default:
                                http_response_code(404);
                                echo json_encode(['error' => 'Endpoint not found']);
                                break;
                        }
                    } else {
                        include __DIR__ . '/v1/admin/library-of-things.php';
                    }
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Resource not found']);
                }
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Resource not specified']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Module not found']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'API version not supported']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Invalid API path']);
}
?>