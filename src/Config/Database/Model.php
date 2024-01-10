<?php

namespace AlessandroIsDev\ShoppingCart\Config\Database;

use AlessandroIsDev\ShoppingCart\Config\Constants;
use Exception;
use PDO;
use SleekDB\Exceptions\IdNotAllowedException;
use SleekDB\Exceptions\InvalidArgumentException;
use SleekDB\Exceptions\InvalidConfigurationException;
use SleekDB\Exceptions\IOException;
use SleekDB\Exceptions\JsonException;
use SleekDB\Query;
use SleekDB\Store;

/**
 *
 */
class Model
{
    /** @var Store|PDO|null */
    private $conn;
    /**
     * @var string|null
     */
    private ?string $table = null;
    /**
     * @var array|null
     */
    private ?array $attributes = [];

    /**
     * @throws InvalidConfigurationException
     * @throws InvalidArgumentException
     * @throws IOException
     * @throws Exception
     */
    public function __construct(?string $table)
    {
        $this->setTable($table);
        if (Constants::isDev()) {
            if (empty($this->getTable())) {
                throw new Exception('Informe o nome da tabela');
            }
            $databaseDirectory = __DIR__ . DIRECTORY_SEPARATOR . "db";
            $this->conn = new Store($this->getTable(), $databaseDirectory, [
                "auto_cache" => true,
                "cache_lifetime" => null,
                "timeout" => false,
                "primary_key" => "_id",
                "search" => [
                    "min_length" => 2,
                    "mode" => "or",
                    "score_key" => "scoreKey",
                    "algorithm" => Query::SEARCH_ALGORITHM["hits"]
                ],
                "folder_permissions" => 0777
            ]);
        }
        //Logica PDO
    }

    /**
     * @param $name
     * @return mixed|null
     */
    public function __get($name)
    {
        if (key_exists($name, $this->attributes)) {
            return $this->attributes[$name];
        }
        return null;
    }

    /**
     * @param $name
     * @param $value
     * @return void
     */
    public function __set($name, $value)
    {
        $this->attributes[$name] = $value;
    }

    /**
     * @return false|string
     */
    public function __toString()
    {
        return $this->toJson();
    }

    /**
     * @return false|string
     */
    public function toJson()
    {
        return json_encode($this->attributes ?? [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return $this->attributes ?? [];
    }

    /**
     * @return string|null
     */
    public function getTable(): ?string
    {
        return $this->table;
    }

    /**
     * @param string|null $table
     * @return static
     */
    public function setTable(?string $table): Model
    {
        $this->table = $table;
        return $this;
    }

    /**
     * @throws IOException
     * @throws JsonException
     * @throws IdNotAllowedException
     * @throws InvalidArgumentException
     */
    public function create($data)
    {
        if (Constants::isDev()) {
            $data = $this->createDev($data);
            return $this->arrayToModel($data);
        }

        // Lógica para PDO
        return null;
    }

    /**
     * @throws IOException
     * @throws InvalidArgumentException
     */
    public function read(array $orderBy = null, int $limit = null, int $offset = null): ?array
    {
        if (Constants::isDev()) {
            return $this->readDev($orderBy, $limit, $offset);
        }

        // Lógica para PDO
        return null;
    }

    /**
     * @throws IOException
     * @throws JsonException
     * @throws InvalidArgumentException
     */
    public function update($id, $data)
    {
        if (Constants::isDev()) {
            $updated = $this->updateDev($id, $data);
            if ($updated) {
                return $this->arrayToModel($updated);
            }
            return null;
        }

        // Lógica para PDO
        return null;
    }

    /**
     * @throws InvalidArgumentException
     * @throws IOException
     */
    public function delete($id)
    {
        if (Constants::isDev()) {
            return $this->deleteDev($id);
        }

        // Lógica para PDO
        return null;
    }

    /**
     * @throws IOException
     * @throws JsonException
     * @throws IdNotAllowedException
     * @throws InvalidArgumentException
     */
    public function save()
    {
        if (isset($this->id)) {
            if (key_exists('id', $this->attributes)) {
                unset($this->attributes['id']);
            }
            if (key_exists('_id', $this->attributes)) {
                unset($this->attributes['_id']);
            }
            return $this->update($this->id, $this->attributes);
        } else {
            return $this->create($this->attributes);
        }
    }

    /**
     * @param array $data
     * @return $this|null
     */
    public function arrayToModel(array $data)
    {
        foreach ($data as $key => $value) {
            if ($key == '_id') {
                $key = 'id';
            }
            $this->$key = $value;
        }
        return $this;
    }

    /**
     * @throws IOException
     * @throws JsonException
     * @throws InvalidArgumentException
     * @throws IdNotAllowedException
     */
    private function createDev(array $data): array
    {
        return $this->conn->insert($data);
    }

    /**
     * @throws InvalidArgumentException
     * @throws IOException
     */
    private function readDev(array $orderBy = null, int $limit = null, int $offset = null): array
    {
        return $this->conn->findAll($orderBy, $limit, $offset);
    }

    /**
     * @param $id
     * @param $data
     * @return array|false
     * @throws IOException
     * @throws InvalidArgumentException
     * @throws JsonException
     */
    private function updateDev($id, $data)
    {
        return $this->conn->updateById($id, $data);
    }

    /**
     * @throws InvalidArgumentException
     * @throws IOException
     */
    private function deleteDev($id)
    {
        return $this->conn->deleteBy(["_id", "=", $id]);
    }

}