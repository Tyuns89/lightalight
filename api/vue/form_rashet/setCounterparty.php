<?php
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-type: text/html');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

require_once realpath('../../vendor/autoload.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// функции
function modifirePhone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    $phone = substr($phone, -10, 10);
    $phone = '+7' . $phone;

    return $phone;
}
function getNumberForm ($connection) {
    curl_setopt($connection, CURLOPT_URL, "https://online.MoySklad.ru/api/remap/1.1/entity/counterparty?search=" . urlencode("Фр #") . '&order=created,desc&limit=1' );
    curl_setopt($connection, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($connection);

    $result = json_decode($result);

    if ( $result->rows[0]->name != '' ) {

        $number = explode('#', $result->rows[0]->name);
        return (int) $number[1] + 1;
    } else {
        return 1;
    }
}
function addCounterparty ($connection, $fields, $number) {
    $name = $fields['name'] . ' ' . $fields['long_name'] . '. Фр #' . $number;

    $json_order = [
        'name' => $name,
        'phone' => modifirePhone( $fields['phone'] ),
        'email' => $fields['email'],
        'description' =>$fields['message']
    ];

    $json_order = json_encode($json_order, JSON_UNESCAPED_UNICODE);
    $json_order = str_replace('\/', '/', $json_order);


    curl_setopt($connection, CURLOPT_URL, "https://online.MoySklad.ru/api/remap/1.1/entity/counterparty");
    curl_setopt($connection, CURLOPT_POSTFIELDS, $json_order);
    curl_setopt($connection, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($connection, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($json_order))
    );
    $contragent = curl_exec($connection);
    $contragent = json_decode($contragent);

    return [
        'long_name' => $name,
        'id' => $contragent->id
    ];
}

$loginMySklad = "admin@lightalight";
$passwordMySklad = "LightalightLivoloRu";

$fields = json_decode($_POST['fields'], true);

// Получаем номер следующей формы и создаем контрагента
$connection = curl_init();
curl_setopt($connection, CURLOPT_USERPWD, "$loginMySklad:$passwordMySklad");
$number = getNumberForm($connection);
$new_contragent = addCounterparty($connection, $fields, $number);
$id = $new_contragent['id'];


// Отправляем письмо
$mail = new PHPMailer(true);

$html_fiels = '
    <h2>Данные клиента</h2>
    <div model="fields">
        <div><b>Имя</b>: '.$fields['name'].'</div>
        <div><b>Фамилия</b>: '.$fields['long_name'].'</div>
        <div><b>Телефон</b>: '.modifirePhone( $fields['phone'] ).'</div>
        <div><b>Email</b>: '.$fields['email'].'</div>
        <div><b>Цвет</b>: '.$fields['color'].'</div>
        <div><b>Дополнительная информация</b>: '.$fields['message'].'</div>
        <hr>
        <div><b>Номер формы</b>: '.$number.'</div>
        <div><b><a href="https://online.MoySklad.ru/app/#company/edit?id='.$id.'"  target="_blank">Ссылка на контрагента</a></b></div>
    </div>
';

if ( true ) {
    try {
        $mail->setFrom('shop@lightalight.ru', 'Форма расчета ');
        $mail->addAddress('shop@lightalight.ru');
        $mail->addCC('gektor89.89@yandex.ru');

        $mail->isHTML(true);

        $mail->Subject = 'Форма #' . $number;
        $mail->Body    = $html_fiels;

        foreach ($_FILES['files']['tmp_name'] as $key => $file) {
            $mail->AddAttachment($_FILES['files']['tmp_name'][$key], $_FILES['files']['name'][$key]);
        }

        $mail->send();
        echo true;
    } catch (Exception $e) {
        echo false;
    }
}

