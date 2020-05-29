<?php
namespace Main\Classes\FormatterArray;

class FormatterArray {
    static function jsonToArray ($json) {
        return json_decode($json, true);
    }

    static  function ArrayToJson ($arr) {
        $json = json_encode($arr, JSON_UNESCAPED_UNICODE);
        $json = str_replace('\"', "'", $json);
        $json = str_replace("\/", "/", $json);

        return $json;
    }

    /**
     * Возвращаем ключ многомерного массива
     *
     * @param array $arr
     * @param string $title
     * @param string $value
     * @return false|int
     */
    static function getKeyMultiArray ($arr, $title, $value) {
        return array_search($value, array_column($arr, $title));
    }
}
