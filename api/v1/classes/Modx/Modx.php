<?php
namespace Main\Classes\Modx;

use PDO;

class Modx {
    public $modx;

    public function __construct ($modx) {
        $this->modx = $modx;
    }

    public function select ($sql, $params = []) {
        $statement = $this->modx->prepare($sql);

        if ( $statement->execute($params) ) {
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } else {
            return [
                'result' => false
            ];
        }

    }
}
