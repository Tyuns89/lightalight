<?php
namespace Main\Classes\City;

use Main\Classes\Config\Config;
use Main\Classes\FormatterArray\FormatterArray;
use Main\Classes\Modx\Modx;

class CitySDEK {
    private $modx;

    public function __construct ($modx) {
        $this->modx = new Modx($modx);
    }

    public function getCity ($cityName) {
        $arCity = $this->modx->select(
            '
            SELECT DISTINCT 
                city, 
                region, 
                city_code 
            FROM 
                ci_cdek_pvz 
            WHERE 
                country = :country
                    AND 
                city = :city
            ',
            [
                ':country' => "Россия",
                ':city' => $cityName
            ]
        );

        if (count($arCity) > 0) {
            return [
                'id' => $arCity[0]['city_code'],
                'full' => $arCity[0]['region'],
                'city' => $arCity[0]['city'],
                'obl' => $arCity[0]['region']
            ];
        }

        return [];
    }

    public function saveCityPvz () {
        $config = new Config();

        $arrCity = [];
        $arCity = $this->modx->select(
            '
            SELECT DISTINCT 
                city, 
                region, 
                city_code 
            FROM 
                ci_cdek_pvz 
            WHERE 
                country = :country
            ORDER BY
                city
            LIMIT 5000    
            ',
            [
                ':country' => "Россия"
            ]
        );

        foreach ($arCity as $city) {
            if ($city['city'] !== '') {
                array_push($arrCity, [
                    'id' => $city['city_code'],
                    'full' => $city['region'],
                    'city' => $city['city'],
                    'obl' => $city['region']
                ]);
            }
        }

        $json = FormatterArray::ArrayToJson($arrCity);

        $fp = fopen($config->DOCUMENT_ROOT . '/media/json/list_city_pvz.json', 'w');
        fwrite($fp, $json);

        return $fp;
    }
}
