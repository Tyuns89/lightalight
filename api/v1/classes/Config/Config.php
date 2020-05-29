<?php
namespace Main\Classes\Config;

class Config {
    // Доступы к api сдек (логин и пароль)
    public $sdekAccount = '6006efec7d6a82555d8aa687cd35e6fc';
    public $sdekPassword = 'bbe10ebc70576785e3154720290af42b';

    // Доступы к api Мой склад (логин и пароль)
    public $skladAccount = 'admin@lightalight';
    public $skladPassword = 'LightalightLivoloRu';
    public $skladPathApi = 'https://online.MoySklad.ru/api/remap/1.1/entity/';
    public $skladFieldPriceName = 'Тест (цена продажи)';
    public $skladFieldPriceSaleName = 'Тест (цена продажи со скидкой)';

    // Тарифы сдэк (https://help.megagroup.ru/tarify-sdek)
    public $sdekTariffs = [
        [
            'id' => 136,
            'name' => 'Посылка склад-склад (С-С). До 30 Кг'
        ],
        [
            'id' => 234,
            'name' => 'Экономичная посылка склад-склад (С-С). До 50 Кг'
        ],
        [
            'id' => 62,
            'name' => 'Магистральный экспресс склад-склад (С-С)'
        ],
        [
            'id' => 137,
            'name' => 'Посылка склад-дверь (С-Д). До 30 Кг'
        ],
        [
            'id' => 233,
            'name' => 'Экономичная посылка склад-дверь (С-Д). До 50 Кг'
        ]
    ];

    // Габариты сдэк по умолчанию (в кг и см)
    public $sdekPackage = [
        'weight' => .2,
        'length' => 25,
        'width' => 15,
        'height' => 10
    ];

    // Полный путь
    public $DOCUMENT_ROOT = '/home/l/lightaliru/public_html';

    // Сервер к Geo IP
    public $serverGeoIp = 'https://ru.sxgeo.city/';

    // Ключ к Geo IP
    public $keyGeoIp = 'WmsaR';
}
