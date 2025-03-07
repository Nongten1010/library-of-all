<?php
require_once __DIR__ . '/../../../../config/cors.php';
require_once __DIR__ . '/../../../../controllers/admin/LibraryOfThingsController.php';

$controller = new LibraryOfThingsController();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    Response::error("Method not allowed", 405);
    exit;
}

$controller->getBorrowStatuses();
?>