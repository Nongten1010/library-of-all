<?php
class Validator {
    private static $errors = [];
    
    public static function validate($data, $rules) {
        self::$errors = [];
        
        foreach ($rules as $field => $fieldRules) {
            $rulesArray = explode('|', $fieldRules);
            
            foreach ($rulesArray as $rule) {
                if (strpos($rule, ':') !== false) {
                    list($ruleName, $ruleValue) = explode(':', $rule, 2);
                } else {
                    $ruleName = $rule;
                    $ruleValue = null;
                }
                
                $methodName = 'validate' . ucfirst($ruleName);
                
                if (method_exists(self::class, $methodName)) {
                    self::$methodName($field, $data[$field] ?? null, $ruleValue);
                }
            }
        }
        
        return empty(self::$errors);
    }
    
    public static function getErrors() {
        return self::$errors;
    }
    
    private static function validateRequired($field, $value, $_) {
        if ($value === null || $value === '') {
            self::$errors[$field][] = "The $field field is required.";
        }
    }
    
    private static function validateMin($field, $value, $min) {
        if (strlen($value) < $min) {
            self::$errors[$field][] = "The $field must be at least $min characters.";
        }
    }
    
    private static function validateMax($field, $value, $max) {
        if (strlen($value) > $max) {
            self::$errors[$field][] = "The $field may not be greater than $max characters.";
        }
    }
    
    private static function validateEmail($field, $value, $_) {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            self::$errors[$field][] = "The $field must be a valid email address.";
        }
    }
    
    private static function validateInteger($field, $value, $_) {
        if (!filter_var($value, FILTER_VALIDATE_INT)) {
            self::$errors[$field][] = "The $field must be an integer.";
        }
    }
    
    private static function validateNumeric($field, $value, $_) {
        if (!is_numeric($value)) {
            self::$errors[$field][] = "The $field must be a number.";
        }
    }
}
?>