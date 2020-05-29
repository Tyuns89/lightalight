<?php
namespace Main\Classes\Bundle;

use Main\Classes\Sklad\Sklad as Sklad;
use Main\Classes\Config\Config as Config;
use Main\Classes\FormatterArray\FormatterArray as FormatterArray;

class UpdateBundle {
    private $sklad;
    private $fieldPriceName;
    private $fieldPriceSaleName;
    private $pathBundle;

    public function __construct () {
        $config = new Config();
        $this->fieldPriceName = $config->skladFieldPriceName;
        $this->fieldPriceSaleName = $config->skladFieldPriceSaleName;
        $this->pathBundle = $config->skladPathApi.'bundle/';

        $this->sklad = new Sklad();
    }

    public function update ($fields) {
        $this->sklad->query(
            $this->pathBundle.$fields['id'],
            FormatterArray::ArrayToJson(
                [
                    'salePrices' => [
                        [
                            'value' => $fields['price'],
                            'priceType' => $this->fieldPriceName
                        ],
                        [
                            'value' => $fields['price_sale'],
                            'priceType' => $this->fieldPriceSaleName
                        ]
                    ]
                ]
            ),
            'PUT'
        );

        return [
            'key' => $fields['key']
        ];
    }
}
