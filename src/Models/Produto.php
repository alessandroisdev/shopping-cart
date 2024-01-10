<?php

namespace AlessandroIsDev\ShoppingCart\Models;

use AlessandroIsDev\ShoppingCart\Config\Database\Model;

/**
 * @property string|int $id
 * @property string $nome
 * @property string $descricao
 * @property string $imagem
 * @property int $valor
 */
class Produto extends Model
{
    public function __construct()
    {
        parent::__construct("produto");
    }
}