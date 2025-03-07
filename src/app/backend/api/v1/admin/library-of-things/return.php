<?php
require_once __DIR__ . '/../../../../config/cors.php';
require_once __DIR__ . '/../../../../controllers/admin/LibraryOfThingsController.php';

$controller = new LibraryOfThingsController();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    Response::error("Method not allowed", 405);
    exit;
}

if (!isset($_GET['id'])) {
    Response::error("Borrowing ID is required", 400);
    exit;
}

$controller->returnBorrowing($_GET['id']);
?>