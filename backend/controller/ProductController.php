<?php
require_once __DIR__ . '/../classes/ProductManager.php';

class ProductController {
    private ProductManager $manager;

    public function __construct() {
        $this->manager = new ProductManager();
    }

    public function handleRequest(): void {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === "POST") {
            $data = json_decode(file_get_contents('php://input'), true);
            $name = $data['name'] ?? '';
            $price = $data['price'] ?? '';
            $size = $data['size'] ?? '';

            if (!empty($name) && !empty($price) && !empty($size)) {
                $newItem = $this->manager->add($name, $price, $size);
                echo json_encode(['success' => true, 'data' => $newItem, 'message' => 'Product added successfully!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Please fill all fields.']);
            }
        } else {
            echo json_encode($this->manager->getAll());
        }
    }
}