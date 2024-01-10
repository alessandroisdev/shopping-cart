<?php

namespace AlessandroIsDev\ShoppingCart\Config;

use Exception;

class CurlRequest
{
    private string $url;
    private array $headers = [];
    private $certPath = null;
    private bool $requireSSL = false;
    private ?Exception $error = null;
    /**
     * @var mixed
     */
    private $httpCode = null;

    public function __construct($url)
    {
        $this->url = $url;
    }

    public function setHeaders($headers)
    {
        $this->headers = $headers;
    }

    public function setCertPath($certPath)
    {
        $this->certPath = $certPath;
    }

    public function requireSSL($requireSSL)
    {
        $this->requireSSL = $requireSSL;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function setUrl(string $url): CurlRequest
    {
        $this->url = $url;
        return $this;
    }

    public function isRequireSSL(): bool
    {
        return $this->requireSSL;
    }

    public function setRequireSSL(bool $requireSSL): CurlRequest
    {
        $this->requireSSL = $requireSSL;
        return $this;
    }

    public function getError(): ?Exception
    {
        return $this->error;
    }

    public function setError(?Exception $error): CurlRequest
    {
        $this->error = $error;
        return $this;
    }

    /**
     * @return mixed|null
     */
    public function getHttpCode()
    {
        return $this->httpCode;
    }

    /**
     * @param mixed|null $httpCode
     * @return CurlRequest
     */
    public function setHttpCode($httpCode)
    {
        $this->httpCode = $httpCode;
        return $this;
    }

    public function get(): ?array
    {
        return $this->executeRequest('GET');
    }

    public function post($data): ?array
    {
        return $this->executeRequest('POST', $data);
    }

    public function put($data): ?array
    {
        return $this->executeRequest('PUT', $data);
    }

    public function patch($data): ?array
    {
        return $this->executeRequest('PATCH', $data);
    }

    public function delete(): ?array
    {
        return $this->executeRequest('DELETE');
    }

    private function executeRequest($method, $data = null): ?array
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }

        if (!empty($this->headers)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers);
        }

        if ($this->certPath !== null) {
            curl_setopt($ch, CURLOPT_SSLCERT, $this->certPath);
        }

        if ($this->requireSSL) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        }

        $response = curl_exec($ch);

        if ($response === false) {
            $error = curl_error($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            $this->error = new Exception("cURL Error: $error", $httpCode);
            $this->httpCode = $httpCode;
            return null;
        }

        curl_close($ch);

        return json_decode($response,true);
    }
}