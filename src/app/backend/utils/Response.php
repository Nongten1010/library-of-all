<?php
class Response {
    public static function json($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
    
    public static function success($data = null, $message = "Success", $status = 200) {
        self::json([
            'status' => true,
            'message' => $message,
            'data' => $data
        ], $status);
    }
    
    public static function error($message = "Error", $status = 400, $errors = null) {
        self::json([
            'status' => false,
            'message' => $message,
            'errors' => $errors
        ], $status);
    }
}
?>