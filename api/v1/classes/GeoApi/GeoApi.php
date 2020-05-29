<?php
namespace Main\Classes\GeoApi;

use Main\Classes\Config\Config as Config;

class GeoApi {
    private $host = '';

    public function __construct () {
        $config = new Config();
        $this->host = $config->serverGeoIp . $config->keyGeoIp . '/json/';
    }

    private function getIp () {
        $client  = @$_SERVER['HTTP_CLIENT_IP'];
        $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
        $remote  = @$_SERVER['REMOTE_ADDR'];

        if (filter_var($client, FILTER_VALIDATE_IP)) {
            $ip = $client;
        } elseif(filter_var($forward, FILTER_VALIDATE_IP)) {
            $ip = $forward;
        } else {
            $ip = $remote;
        }

        return $ip;
    }

    public function currentCity () {

        $isBot = preg_match(
            "~(Google|Yahoo|Rambler|Bot|Yandex|Spider|Snoopy|Crawler|Finder|Mail|curl)~i",
            $_SERVER['HTTP_USER_AGENT']
        );

        if (!$isBot) {
            $ip = $this->getIp();
            $geo = json_decode(file_get_contents($this->host . $ip), true);

            return [
                'id' => $geo['city']['id'],
                'name' => $geo['city']['name_ru']
            ];
        } else {
            return [];
        }
    }
}
