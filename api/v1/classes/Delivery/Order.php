<?php
namespace Main\Classes\Delivery;

use Main\Classes\Config\Config as Config;
use CdekSDK\CdekClient as Client;
use CdekSDK\Requests\CalculationWithTariffListAuthorizedRequest as Authorize;
use Main\Classes\FormatterArray\FormatterArray as FormatterArray;

class Order {
    public function getPrice ($cityId, $package = [], $exception = []) {
        $config = new Config();
        $client = new Client($config->sdekAccount, $config->sdekPassword);
        $request = new Authorize();

        // Город Отправитель-приниматель
        $request->setSenderCityId('44')
            ->setReceiverCityId($cityId);

        // Тарифы доставки
        foreach ($config->sdekTariffs as $tariff ) {
            // проверяем, существует ли в исключениях тариф, если да, не используем его
            if (!in_array($tariff['id'], $exception)) {
                $request->addTariffToList($tariff['id']);
            }
        }

        // Габариты
        if (count($package) > 0) {
            $request->addPackage($package);
        } else {
            $request->addPackage($config->sdekPackage);
        }

        $arrDelivery = [];
        $response = $client->sendCalculationWithTariffListRequest($request);
        foreach ($response->getResults() as $result) {

            if ($result->hasErrors()) { continue; }
            if (!$result->getStatus()) { continue; }

            array_push($arrDelivery, [
                'price' => $result->getPrice(),
                'day' => $result->getDeliveryPeriodMin(),
                'id' => $result->getTariffId(),
                'name' => $config->sdekTariffs[ FormatterArray::getKeyMultiArray($config->sdekTariffs, 'id', $result->getTariffId()) ]['name']
            ]);
        }

        return $arrDelivery[ FormatterArray::getKeyMultiArray($arrDelivery, 'price', min(array_column($arrDelivery, 'price'))) ];
    }
}
