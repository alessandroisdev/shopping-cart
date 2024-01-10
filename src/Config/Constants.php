<?php

namespace AlessandroIsDev\ShoppingCart\Config;

class Constants
{
    private static bool $isDev = true;

    public static function isDev(): bool
    {
        return self::$isDev;
    }

}