<?php
namespace Main\Classes\Modx;

class Podbor {
    function getPodborOption ($modx) {
        $options = $modx->getObject('modResource', 1);

        $arrOption['podbor_content_c1'] = $options->getTVValue('podbor_content_c1');
        $arrOption['podbor_content_c2'] = $options->getTVValue('podbor_content_c2');
        $arrOption['podbor_content_right_c1'] = $options->getTVValue('podbor_content_right_c1');
        $arrOption['podbor_content_right_c2'] = $options->getTVValue('podbor_content_right_c2');
        $arrOption['podbor_content_right_sr'] = $options->getTVValue('podbor_content_right_sr');
        $arrOption['podbor_content_sr'] = $options->getTVValue('podbor_content_sr');
        $arrOption['podbor_photo_c1'] = 'https://lightalight.ru/' . $options->getTVValue('podbor_photo_c1');
        $arrOption['podbor_photo_c2'] = 'https://lightalight.ru/' . $options->getTVValue('podbor_photo_c2');
        $arrOption['podbor_photo_failure'] = 'https://lightalight.ru/' . $options->getTVValue('podbor_photo_failure');
        $arrOption['podbor_photo_success'] = 'https://lightalight.ru/' . $options->getTVValue('podbor_photo_success');
        $arrOption['podbor_photo_ramka_c1'] = 'https://lightalight.ru/' . $options->getTVValue('podbor_photo_ramka_c1');
        $arrOption['podbor_photo_ramka_c2'] = 'https://lightalight.ru/' . $options->getTVValue('podbor_photo_ramka_c2');
        $arrOption['podbor_photo_ramka_sr'] = 'https://lightalight.ru/' . $options->getTVValue('podbor_photo_ramka_sr');
        $arrOption['podbor_photo_sr'] = 'https://lightalight.ru/' . $options->getTVValue('podbor_photo_sr');

        return $arrOption;
    }
}
