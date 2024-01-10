<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Carrinho de compras</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Shopping Cart</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>

            </ul>
            <ul class="navbar-nav mb-2 mb-md-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                       aria-expanded="false">
                        <i class="bi bi-cart"></i> <span id="cart-quatity">0</span> / <span id="cart-price">0</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" id="lista-produtos">
                        <li><a class="dropdown-item disabled" aria-disabled="true">Não há produtos</a></li>
                    </ul>
                </li>
                <li class="nav-item clean-cart d-none">
                    <button class="nav-link" id="clean-cart">Limpar carrinho</button>
                </li>
            </ul>
        </div>
    </div>
</nav>

<main class="container my-5 py-5">
    <section class="row g-5 justify-content-center" id="vitrine">
        <div class="col">
            <div class="card text-bg-light">
                <div class="card-body">
                    Não há produtos
                </div>
            </div>
        </div>
    </section>
    <template id="template-produto">
        <div class="col-md-3">
            <div class="card mb-2">
                <img src="..." class="card-img-top" alt="..." loading="lazy">
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">
                        Some quick example text to build on the card title and make up the bulk of the
                        card's content.
                    </p>
                    <h2 class="card-price">R$ 0,00</h2>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center gap-5">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-primary decrease-quantity"><i class="bi bi-dash-circle"></i></button>
                        <input value="0" type="text" class="form-control text-center view-quantity"
                               aria-label="quantidade">
                        <button class="btn btn-primary increase-quantity"><i class="bi bi-plus-circle"></i></button>
                    </div>
                    <button class="btn btn-sm btn-primary text-nowrap add-to-cart"><i class="bi bi-cart-plus"></i>
                        adicionar
                    </button>
                </div>
            </div>
            <button class="btn btn-sm btn-outline-danger remove-product d-none"><i class="bi bi-cart-x"></i> Remover</button>
        </div>
    </template>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="./js/main.js" type="module"></script>
</body>
</html>