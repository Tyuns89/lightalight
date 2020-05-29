<?php
namespace Main\Classes\Order;

use Main\Classes\Sklad\Sklad as Sklad;
use Main\Classes\Modx\Modx as Modx;
use Main\Classes\FormatterArray\FormatterArray as FormatterArray;

class Create {
    private $orderId;
    public $modx;
    public $sklad;
    private $arOrder = [];
    private $pathOrder = 'https://online.moysklad.ru/api/remap/1.1/entity/customerorder';
    private $pathAttributes = 'https://online.moysklad.ru/api/remap/1.1/entity/customerorder/metadata/attributes/';
    private $listPersonFields = [
        'ФИО',
        'Email',
        'Телефон',
        'Адрес доставки',
        'Время Доставки'
    ];
    private $arrSkladPersonFields = [];
    private $arrShopkeeperProductsOrder = [];
    private $pathAgent = 'https://online.moysklad.ru/api/remap/1.1/entity/counterparty/';
    private $pathOrganization = 'https://online.moysklad.ru/api/remap/1.1/entity/organization/';
    private $phoneOrganization = '84993981062';
    private $pathStore = 'https://online.moysklad.ru/api/remap/1.1/entity/store/';
    private $storeId = 'faa68a93-6552-11e5-90a2-8ecb00450c2a';
    private $replaceDelivery = [
        [
            'shopkeeper' => 'Самовывоз',
            'sklad' => 'Самовывоз'
        ],
        [
            'shopkeeper' => 'Почтой России',
            'sklad' => 'Почта России'
        ],
        [
            'shopkeeper' => 'Курьерская доставка',
            'sklad' => 'Курьер'
        ],
        [
            'shopkeeper' => 'Доставка СДЭК до порога',
            'sklad' => 'СДЭК'
        ],
        [
            'shopkeeper' => 'Забрать в ПВЗ СДЭК',
            'sklad' => 'СДЭК'
        ]
    ];
    private $replacePayment = [
        [
            'shopkeeper' => 'Наличные',
            'sklad' => 'Наличными'
        ],
        [
            'shopkeeper' => 'Онлайн оплата',
            'sklad' => 'Яндекс касса'
        ],
        [
            'shopkeeper' => 'Счёт на юр. лицо',
            'sklad' => 'Счёт на юр. лицо'
        ],
        [
            'shopkeeper' => 'При получении',
            'sklad' => 'Наличными'
        ]
    ];

    public function __construct ($orderId, $modx) {
        $this->orderId = $orderId;
        $this->modx = new Modx($modx);
        $this->sklad = new Sklad();

        // получаем список всех доп. полей заказа (для получения id)
        $this->arrSkladPersonFields = $this->sklad->query($this->pathAttributes);
        $this->arrSkladPersonFields = FormatterArray::jsonToArray($this->arrSkladPersonFields);
        $this->arrSkladPersonFields = FormatterArray::jsonToArray( FormatterArray::ArrayToJson($this->arrSkladPersonFields['rows']) );

        // получаем список товаров с shopkeeper
        $this->arrShopkeeperProductsOrder = $this->modifierProductsShopkeeper();
    }

    private function modifierProductsShopkeeper () {

        $result = [];
        $arrProducts = $this->modx->select(
            '
                SELECT 
                    data, 
                    price,  
                    count
                FROM 
	                modx_shopkeeper3_purchases
	            WHERE 
	                order_id = :id
            ',
            [
                ':id' => $this->orderId
            ]
        );

        foreach ($arrProducts as $product) {

            $arDescription = FormatterArray::jsonToArray($product['data']);
            $arDescription = explode(':', $arDescription['description']);

            array_push($result, [
                'price' => ((int) $product['price']) * 100,
                'count' => (int) $product['count'],
                'skladId' => $arDescription[0],
                'skladHref' => ($arDescription[1] == 'complect') ? 'bundle' : 'product'
            ]);
        }

        return $result;
    }

    private function store () {
        return [
            "meta" => array(
                "href" => $this->pathStore . $this->storeId,
                "type" => "store",
                "mediaType" => "application/json"
            )
        ];
    }

    /**
     * @return array
     */
    private function organization () {
        $organization = $this->sklad->query($this->pathOrganization . '?search=' . $this->phoneOrganization);
        $organization = FormatterArray::jsonToArray($organization);
        $organizationId = $organization['rows'][0]['id'];

        return [
            "meta" => array(
                "href" => "https://online.moysklad.ru/api/remap/1.1/entity/organization/$organizationId",
                "type" => "organization",
                "mediaType" => "application/json"
            )
        ];
    }

    /**
     * @param string $phone
     * @param array $arrContacts
     * @return array
     */
    private function agent ($phone, $arrContacts) {

        // ищем агента по номеру телефона
        $phoneFilter = urlencode($phone);
        $agent = $this->sklad->query($this->pathAgent . '?filter=phone=' . $phoneFilter);
        $agent = FormatterArray::jsonToArray($agent);

        if ( (int) $agent['meta']['size'] >= 1 ) {
            $agentId = $agent['rows'][0]['id'];
        } else {

            // создаем нового контрагента
            $newAgent = [];
            $newAgent['name'] = $arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', $this->listPersonFields[0]) ]['value'] . ' #' . $this->orderId . 'i';
            $newAgent['description'] = "Покупатель с сайта";
            $newAgent['email'] = $arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', $this->listPersonFields[1]) ]['value'];
            $newAgent['phone'] = $phone;
            $newAgent['actualAddress'] = $arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', $this->listPersonFields[3]) ]['value'];
            $newAgent['priceType'] = "Цена продажи со скидкой";
            $newAgent['tags'][0] = "розничный покупатель";

            $resultNewAgent = $this->sklad->query($this->pathAgent, FormatterArray::ArrayToJson($newAgent));
            $resultNewAgent = FormatterArray::jsonToArray($resultNewAgent);
            $agentId = $resultNewAgent['id'];
        }

        return [
            "meta" => array(
                "href" => "https://online.moysklad.ru/api/remap/1.1/entity/counterparty/$agentId",
                "type" => "counterparty",
                "mediaType" => "application/json"
            )
        ];
    }

    /**
     * @param array $personFields
     * @return array
     */
    private function attributes ($personFields) {

        $result = [];
        foreach ($this->listPersonFields as $personField) {
            $value = $personFields[ FormatterArray::getKeyMultiArray($personFields, 'label', $personField) ]['value'];

            if ($value) {
                array_push($result, [
                    'id' => $this->arrSkladPersonFields[ FormatterArray::getKeyMultiArray($this->arrSkladPersonFields, 'name', $personField) ]['id'],
                    'value' => $value
                ]);
            }
        }


        return $result;
    }

    /**
     * @param string $value
     * @return array
     */
    private function delivery ($value) {

        return [
            'id' => $this->arrSkladPersonFields[ FormatterArray::getKeyMultiArray($this->arrSkladPersonFields, 'name', 'Способ доставки') ]['id'],
            "value" => array(
                "name" => $this->replaceDelivery[ FormatterArray::getKeyMultiArray($this->replaceDelivery, 'shopkeeper', $value) ]['sklad']
            )
        ];
    }

    /**
     * @param string $value
     * @return array
     */
    private function payment ($value) {
        return [
            'id' => $this->arrSkladPersonFields[ FormatterArray::getKeyMultiArray($this->arrSkladPersonFields, 'name', 'Способ оплаты') ]['id'],
            "value" => array(
                "name" => $this->replacePayment[ FormatterArray::getKeyMultiArray($this->replacePayment, 'shopkeeper', $value) ]['sklad']
            )
        ];
    }

    /**
     * @param string $value
     * @return array
     */
    private function tariffName ($value) {
        return [
            'id' => $this->arrSkladPersonFields[ FormatterArray::getKeyMultiArray($this->arrSkladPersonFields, 'name', 'Тариф СДЭК') ]['id'],
            'value' => [
                'name' => $value
            ]
        ];
    }

    private function pvz ($value, $code, $id) {

        if ($id != '') {
            return [
                'id' => $this->arrSkladPersonFields[ FormatterArray::getKeyMultiArray($this->arrSkladPersonFields, 'name', 'ПВЗ СДЭК') ]['id'],
                'value' => [
                    'meta' => [
                        'href' => 'https://online.moysklad.ru/api/remap/1.2/entity/customentity/929fb99a-e513-11e9-0a80-066e0010a7e7/' . $id,
                        'type' => 'customentity',
                        'mediaType' => 'application/json'
                    ]
                ]
            ];
        } else {
            return [
                'id' => $this->arrSkladPersonFields[ FormatterArray::getKeyMultiArray($this->arrSkladPersonFields, 'name', 'ПВЗ СДЭК') ]['id'],
                'value' => [
                    'name' => $value,
                    'code' => $code
                ]
            ];
        }
    }

    private function positions () {

        $result = [];

        foreach ($this->arrShopkeeperProductsOrder as $product) {
            array_push($result, [
                'quantity' => $product['count'],
                'discount' => 0,
                'price' => $product['price'],
                'vat' => 0,
                'assortment' => [
                    'meta' => [
                        'href' => 'https://online.moysklad.ru/api/remap/1.1/entity/' . $product['skladHref'] . '/' . $product['skladId'],
                        'type' => 'product',
                        'mediaType' => 'application/json'
                    ]
                ]
            ]);
        }

        return $result;
    }

    public function run () {

        // Получаем данные о заказе с shopkeeper
        $shopkeeperOrder = $this->modx->select(
            '
                SELECT 
                    id, 
                    contacts, 
                    price, 
                    delivery, 
                    delivery_price, 
                    payment
                FROM 
	                modx_shopkeeper3_orders
	            WHERE 
	                id = :id
            ',
            [
                ':id' => $this->orderId
            ]
        );
        $shopkeeperOrder = $shopkeeperOrder[0];
        $arrContacts = FormatterArray::jsonToArray($shopkeeperOrder['contacts']);

        // Основные данные
        $this->arOrder['name'] = $this->orderId . 'i';
        // Это не "Внутренний Комментарий", а основной
        $this->arOrder['description'] = str_replace(array("\r","\n"),"", $arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', 'Внутренний Комментарий') ]['value']);
        $this->arOrder['vatEnabled'] = false;
        $this->arOrder['vatIncluded'] = false;

        // Добаляем склад
        $this->arOrder['store'] = $this->store();

        // Добавляем организацию
        $this->arOrder['organization'] = $this->organization();

        // Добавляем/создаем контрагента
        $this->arOrder['agent'] = $this->agent($arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', $this->listPersonFields[2]) ]['value'], $arrContacts);

        // Добавляем персональные данные клиента
        $this->arOrder['attributes'] = $this->attributes($arrContacts);

        // Добавляем доставку
        array_push($this->arOrder['attributes'], $this->delivery($shopkeeperOrder['delivery']));

        // Добавляем способ оплаты
        array_push($this->arOrder['attributes'], $this->payment($shopkeeperOrder['payment']));

        // Добавляем "Тариф СДЭК"
        $tariffValue = $arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', 'Тариф СДЭК') ]['value'];
        if ($tariffValue) {
            array_push($this->arOrder['attributes'], $this->tariffName($tariffValue));
        }

        // Добавляем "ПВЗ СДЭК"
        $pvzValue = $arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', 'ПВЗ СДЭК') ]['value'];
        $pvzCode = $arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', 'ПВЗ СДЭК (код)') ]['value'];
        $pvzId = $arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', 'ПВЗ СДЭК (id)') ]['value'];
        if (($pvzValue && ($pvzValue != 'undefined')) && ($pvzCode && ($pvzCode != 'undefined'))) {
            array_push($this->arOrder['attributes'], $this->pvz($pvzValue, $pvzCode, $pvzId));
        }

        // Добавляем товары
        $this->arOrder['positions'] = $this->positions();

        // Добавляем услугу "Доставка СДЭК", если доставка > 0
        $deliverPrice = (int) $arrContacts[ FormatterArray::getKeyMultiArray($arrContacts, 'label', 'Стоимость доставки') ]['value'];
        if ($deliverPrice > 0) {
            array_push($this->arOrder['positions'], [
                'quantity' => 1,
                'discount' => 0,
                'price' => $deliverPrice * 100,
                'vat' => 0,
                'assortment' => [
                    'meta' => [
                        'href' => "https://online.moysklad.ru/api/remap/1.1/entity/service/177835cb-aff7-11e7-6b01-4b1d0005b2ee",
                        'type' => 'service',
                        'mediaType' => 'application/json'
                    ]
                ]
            ]);
        }


        // Отправляем заказа в "Мой склад"
        $result = $this->sklad->query($this->pathOrder, FormatterArray::ArrayToJson($this->arOrder));

        // return $this->arOrder;
        return $result;
        // return $arrContacts;
    }
}
