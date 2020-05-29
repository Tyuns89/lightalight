<?php
namespace Main\Classes\Delivery;

use CdekSDK\CdekClient as Client;
use CdekSDK\Requests\PvzListRequest as PVZLIst;
use Main\Classes\Config\Config as Config;
use Main\Classes\Modx\Modx as Modx;

class PVZ {
    public $client;
    public $request;
    private $modx;

    public function __construct ($modx) {
        $config = new Config();
        $this->modx = new Modx($modx);
        $this->client = new Client($config->sdekAccount, $config->sdekPassword);
        $this->request = new PVZLIst();
    }

    private function namePVZSklad ($cityId, $code) {

        $result = $this->modx->select('
            SELECT 
                country,
                region,
                city,
                name,
                street,
                house
            FROM 
                ci_cdek_pvz 
            WHERE
                city_code = :cityId 
                    AND
                code = :code  
            ',
            [
                ':cityId' => $cityId,
                ':code' => $code
            ]
        );

        if (count($result) == 1) {

            return $result[0]['country'] . ', ' . $result[0]['region'] . ', ' . $result[0]['city'] . ', ' . $result[0]['name'] . ', ' . $result[0]['street'] . ', ' . $result[0]['house'];
        } else {
            return  '';
        }
    }

    private function idPVZSklad ($cityId, $code) {

        $result = $this->modx->select('
            SELECT 
               ms_pvz_id
            FROM 
                ci_cdek_pvz 
            WHERE
                city_code = :cityId 
                    AND
                code = :code  
            ',
            [
                ':cityId' => $cityId,
                ':code' => $code
            ]
        );

        if (count($result) == 1) {

            return $result[0]['ms_pvz_id'];
        } else {
            return  '';
        }
    }

    public function listPVZ ($cityId) {
        $this->request->setCityId($cityId);
        $this->request->setCashless(true);
        $this->request->setCodAllowed(true);
        $this->request->setDressingRoom(true);

        $response = $this->client->sendPvzListRequest($this->request);


        $pvzList = [];
        $pvzItem = [];

        if (!$response->hasErrors()) {
            foreach($response as $item) {
                $pvzItem['code'] = $item->Code;
                $pvzItem['name'] = $item->Name;
                $pvzItem['address'] = $item->Address;
                $pvzItem['full_address'] = $item->FullAddress;
                $pvzItem['sklad_address'] = $this->namePVZSklad($cityId, $item->Code);
                $pvzItem['sklad_id_pvz'] = $this->idPVZSklad($cityId, $item->Code);
                $pvzItem['postal_code'] = $item->PostalCode;
                $pvzItem['phone'] = $item->Phone;
                $pvzItem['email'] = $item->Email;
                $pvzItem['coordX'] = $item->coordX;
                $pvzItem['coordY'] = $item->coordY;
                $pvzItem['work_time'] = $item->WorkTime;

                $pvzList[] = $pvzItem;
            }
        }


        return $pvzList;
    }
}
