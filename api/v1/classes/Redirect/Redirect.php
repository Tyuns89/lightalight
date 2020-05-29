<?php
namespace Main\Classes\Redirect;

class Redirect {

    static function Location301 ($url) {
        $serverName = $_SERVER['SERVER_NAME'];
        $https = 'https://';

        header('HTTP/1.1 301 Moved Permanently');
        header('Location: ' . $https . $serverName . $url);
        exit();
    }
}
