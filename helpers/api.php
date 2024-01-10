<?php
function response(int $statusCode, string $status, string $message, array $data = null, array $errors = null)
{
    header('Content-Type: application/json');
    http_response_code($statusCode);
    $data = array_filter([
        'statusCode' => $statusCode,
        'status' => $status,
        'message' => $message,
        'errors' => $errors,
        'data' => $data
    ]);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    die;
}

function erro(string $message, array $errors = null, int $statusCode = 400)
{
    response($statusCode, 'error', $message, null, $errors);
}

function sucesso(string $message, array $data = null, int $statusCode = 200)
{
    response($statusCode, 'success', $message, $data);
}