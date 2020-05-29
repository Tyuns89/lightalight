<?php
namespace Main\Classes\Sklad;

use Main\Classes\Config\Config as Config;

class Sklad {
    private $skladAccount;
    private $skladPassword;
    private $connection;

    public function __construct () {
        $config = new Config();
        $this->skladAccount = $config->skladAccount;
        $this->skladPassword = $config->skladPassword;
    }

    public function connection () {
        $this->connection = curl_init();
        curl_setopt($this->connection, CURLOPT_USERPWD, "$this->skladAccount:$this->skladPassword");
    }
    public function disconnection () {
        curl_close($this->connection);
    }

    /**
     * @param string $path
     * @param null|string $json
     * @param bool|string $method
     * @return string
     */
    public function query ($path, $json = null, $method = false) {
        $this->connection();
        curl_setopt($this->connection, CURLOPT_URL, $path);
        curl_setopt($this->connection, CURLOPT_RETURNTRANSFER, 1);

        if ($method) {
            curl_setopt($this->connection,CURLOPT_CUSTOMREQUEST,$method);
        }

        if ($json) {
            curl_setopt($this->connection, CURLOPT_POSTFIELDS, $json);
            curl_setopt($this->connection, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($json))
            );
        }

        $result = curl_exec($this->connection);
        $this->disconnection();

        return $result;
    }
}
