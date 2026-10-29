<?php
class Product {
    public function __construct(
        public ?int $id,
        public string $name,
        public string $price,
        public string $size
    ) {}

    public function toArray(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'size' => $this->size
        ];
    }
}