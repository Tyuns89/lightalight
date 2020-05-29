<?php
namespace Main\Classes\Router;

use Main\Classes\Bundle\UpdateBundle;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory as App;
use Slim\Middleware\ErrorMiddleware;
use Main\Classes\Delivery\Order as Order;
use Main\Classes\Delivery\PVZ as PVZ;
use Main\Classes\Modx\Podbor as Podbor;
use Main\Classes\Order\Create as CreateOrder;
use Main\Classes\GeoApi\GeoApi as GeoApi;
use Main\Classes\City\CitySDEK as CitySDEK;
use Main\Classes\FormatterArray\FormatterArray;
use Main\Classes\Bundle\ListBundle as ListBundle;

class Router {

    public $app;
    public $modx;

    public function __construct() {
        $this->app = App::create();

        $middleware = new ErrorMiddleware(
            $this->app->getCallableResolver(),
            $this->app->getResponseFactory(),
            true,
            false,
            false
        );

        $this->app->add($middleware);
    }

    public function run () {
        $this->app->run();
    }

    public function sendJSON ($arrField, Response $response) {
        $payload = json_encode($arrField, JSON_UNESCAPED_UNICODE);
        $payload = str_replace('\"', "'", $payload);
        $payload = str_replace("\/", "/", $payload);

        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getDeliveryPrice($path) {
        $this->app->post($path, function (Request $request, Response $response) {
            $fields = FormatterArray::jsonToArray($request->getBody());
            $package = (array_key_exists('package', $fields)) ? $fields['package'] : [];

            $delivery = new Order();
            $result = $delivery->getPrice($fields['cityId'], $package, $fields['exception']);

            return $this->sendJSON($result, $response);
        });
    }

    public function getPVZList ($path) {
        $this->app->get($path, function (Request $request, Response $response) {
            $cityId = $request->getAttribute('cityId');

            $pvz = new PVZ($this->modx);
            $result = $pvz->listPVZ($cityId);

            return $this->sendJSON($result, $response);
        });
    }

    public function getPodborOption ($path) {
        $this->app->get($path, function (Request $request, Response $response) {
            $option = new Podbor();
            $result = $option->getPodborOption($this->modx);

            return $this->sendJSON($result, $response);
        });
    }

    public function creatOrderSklad ($path) {
        $this->app->get($path, function (Request $request, Response $response) {
            $orderId = $request->getAttribute('orderId');

            $sklad = new CreateOrder($orderId, $this->modx);
            $result = $sklad->run();

            return $this->sendJSON($result, $response);
        });
    }

    public function getCurrentCity ($path) {
        $this->app->get($path, function (Request $request, Response $response) {

            $geoApi = new GeoApi();
            $result = $geoApi->currentCity();

            return $this->sendJSON($result, $response);
        });
    }

    public function getCityCDEK ($path) {
        $this->app->get($path, function (Request $request, Response $response) {
            $cityName = $request->getAttribute('cityName');

            $citySdek = new CitySDEK($this->modx);
            $result = $citySdek->getCity($cityName);

            return $this->sendJSON($result, $response);
        });
    }

    public function cronSaveCityPvz ($path) {
        $this->app->get($path, function (Request $request, Response $response) {

            $citySdek = new CitySDEK($this->modx);
            $result = $citySdek->saveCityPvz();

            return $this->sendJSON($result, $response);
        });
    }

    public function getBundle ($path) {
        $this->app->get($path, function (Request $request, Response $response) {
            $offset = $request->getAttribute('offset');

            $bundle = new ListBundle();
            $result = $bundle->list($offset);

            return $this->sendJSON($result, $response);
        });
    }

    public function updateBundle ($path) {
        $this->app->put($path, function (Request $request, Response $response) {
            $fields = FormatterArray::jsonToArray($request->getBody());

            $bundle = new UpdateBundle();
            $result = $bundle->update($fields);

            return $this->sendJSON($result, $response);
        });
    }
}
