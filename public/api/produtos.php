<?php

use AlessandroIsDev\ShoppingCart\Models\Produto;
use SleekDB\Exceptions\IOException;
use SleekDB\Exceptions\InvalidArgumentException;

switch (strtoupper($_SERVER['REQUEST_METHOD'])) {
    case "GET":
        try {
            $produtoModel = new Produto();
            sucesso('', $produtoModel->read());
        } catch (IOException|InvalidArgumentException $e) {
            erro($e->getMessage());
        }
        break;
    default:
        erro('Método inválido', null, 405);
        break;
}