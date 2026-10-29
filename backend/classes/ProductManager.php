<?php
require_once __DIR__ . '/Product.php';

class ProductManager {
    private string $file;

    public function __construct() {
        $this->file = __DIR__ . '/../data/products.json';
        if (!file_exists($this->file)) {
            file_put_contents($this->file, json_encode([], JSON_PRETTY_PRINT));
        }
    }

    public function getAll(): array {
        $content = file_get_contents($this->file);
        $data = json_decode($content, true);
        return is_array($data) ? $data : [];
    }

    public function add(string $name, string $price, string $size): array {
        $items = $this->getAll();
        $id = count($items) ? max(array_column($items, 'id')) + 1 : 1;
        
        $product = new Product(
            $id,
            htmlspecialchars(trim($name)),
            htmlspecialchars(trim($price)),
            htmlspecialchars(trim($size))
        );

        $items[] = $product->toArray();
        file_put_contents($this->file, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        return $product->toArray();
    }
}