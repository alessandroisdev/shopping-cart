<?php

use AlessandroIsDev\ShoppingCart\Config\CurlRequest;
use AlessandroIsDev\ShoppingCart\Models\Produto;

require dirname(__DIR__) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

$request = new CurlRequest('https://fakestoreapi.com/products');
try {
    $produtos = $request->get();
    if ($produtos) {
        foreach ($produtos as $item) {
            $produto = new Produto();
            $produto->nome = $item['title'];
            $produto->valor = $item['price'] * 100;
            $produto->descricao = $item['description'];
            $produto->imagem = $item['image'];
            var_dump($produto->save());flush();sleep(1);
        }
    }
} catch (Exception $e) {
    $httpCode = $e->getCode(); // Obter o código HTTP do erro
    echo 'Erro HTTP ' . $httpCode . ': ' . $e->getMessage();
}