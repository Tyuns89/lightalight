<?php
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
header('Access-Control-Allow-Origin: *');

require 'vendor/autoload.php';

use Main\Classes\Router\Router as Router;

// Подключаем modx
require_once '/home/l/lightaliru/public_html' . '/config.core.php';
require_once MODX_CORE_PATH . 'model/modx/modx.class.php';
$modx = new modX();
$modx->initialize('web');

$router = new Router();
$router->modx = $modx;

// 1.1 Вовращаем стоимость доставки с учетом города отправителя (код города берем в СДЭК), с учетом габаритов
$router->getDeliveryPrice('/api/v1/delivery/order/');

// 1.3. Список pvz с учетом города отправителя (код города берем в СДЭК)
$router->getPVZList('/api/v1/delivery/pvz/{cityId}');

// Блок "Оформленик заказа"
// 2.1 Опции для блока "Подбор"
$router->getPodborOption('/api/v1/podbor/option/');

// 2.2 Возращаем город (по его имени) с id СДЭК
$router->getCityCDEK('/api/v1/cdek/city/{cityName}');

// 3. Создание заказа в "Мой склад"
$router->creatOrderSklad('/api/v1/sklad/order/create/{orderId}/');

// 4. GEO IP, определяем текущий город по ip пользователя
$router->getCurrentCity('/api/v1/geo_ip/current/');

// 5.1 Получить список комплектов (для обновления цен)
$router->getBundle('/api/v1/bundle/list/{offset}');

// 5.2 Обновляем цены комплектов (обновляем тестовые цены)
$router->updateBundle('/api/v1/bundle/update/');

// CRON
// 1. Сохраняем города у которых есть PVZ в файл /media/json/list_city_pvz.json
$router->cronSaveCityPvz('/api/v1/cron/save_city_pvz/');

$router->run();
