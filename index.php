<?php

require __DIR__ . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

function getFilePHP($folders, &$views, $prefixo = null)
{
    foreach (new DirectoryIterator(implode(DIRECTORY_SEPARATOR, $folders)) as $file) {
        if (!$file->isFile()) {
            continue;
        }
        $key = [$prefixo ?? '', $file->getBasename('.php')];
        $views[implode('/', array_filter($key))] = $file->getPathname();
    }
}

$route = $_GET['route'] ?? "home";
$routes = explode("/", $route);
$views = [];
getFilePHP([__DIR__, "public"], $views);

if (count($routes) > 1) {
    getFilePHP([__DIR__, "public", $routes[0]], $views, $routes[0]);
}

if (key_exists($route, $views)) {
    include $views[$route];
    die;
}

include __DIR__ . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "404.php";