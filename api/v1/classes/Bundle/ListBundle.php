<?php
namespace Main\Classes\Bundle;

use Main\Classes\Config\Config as Config;
use Main\Classes\FormatterArray\FormatterArray as FormatterArray;
use Main\Classes\Sklad\Sklad as Sklad;

class ListBundle {
    private $sklad;
    private $pathBundle;
    private $fieldPriceName;
    private $fieldPriceSaleName;

    public function __construct () {
        $config = new Config();
        $this->pathBundle = $config->skladPathApi.'bundle/';
        $this->fieldPriceName = $config->skladFieldPriceName;
        $this->fieldPriceSaleName = $config->skladFieldPriceSaleName;
        $this->sklad = new Sklad();
    }

    public function list ($offset = 0) {

        $result = ['items' => [], 'count' => 0];
        $bundles = FormatterArray::jsonToArray($this->sklad->query($this->pathBundle."?limit=100&offset=$offset"));

        foreach ($bundles['rows'] as $bundle) {
            $price = $bundle['salePrices'][ FormatterArray::getKeyMultiArray($bundle['salePrices'], 'priceType', $this->fieldPriceName) ]['value'];
            $priceSale = $bundle['salePrices'][ FormatterArray::getKeyMultiArray($bundle['salePrices'], 'priceType', $this->fieldPriceSaleName) ]['value'];
            $components = $this->components($bundle['components']['meta']['href']);

            // Если цены комплекта и комплектующих не совпадают, то добавляем в массив
            if ( ($price !== $components['price']) || (($priceSale !== $components['price_sale'])) ) {
                array_push($result['items'], [
                    'id' => $bundle['id'],
                    'name' => $bundle['name'],
                    'article' => $bundle['code'],
                    'price' => $price,
                    'price_sale' => $priceSale,
                    'components' => $this->components($bundle['components']['meta']['href']),
                    'update' => 0
                ]);
            }
        }

        // Добавляем кол-во комплектов (все, без ограничений)
        $result['count'] = count($bundles['rows']);

        return $result;
    }

    private function components ($pathComponents) {
        $price = 0;
        $priceSale = 0;
        $components = FormatterArray::jsonToArray($this->sklad->query($pathComponents));

        foreach ($components['rows'] as $component) {
            $prices = $this->product($component['assortment']['meta']['href']);
            $price += $prices['price'] * $component['quantity'];
            $priceSale += $prices['price_sale'] * $component['quantity'];
        }

        return [
            'price' => $price,
            'price_sale' => $priceSale
        ];
    }

    private function product ($pathProduct) {
        $product = FormatterArray::jsonToArray($this->sklad->query($pathProduct));
        return [
            'price' => $product['salePrices'][FormatterArray::getKeyMultiArray($product['salePrices'], 'priceType', $this->fieldPriceName)]['value'],
            'price_sale' => $product['salePrices'][FormatterArray::getKeyMultiArray($product['salePrices'], 'priceType', $this->fieldPriceSaleName)]['value'],
        ];
    }
}
