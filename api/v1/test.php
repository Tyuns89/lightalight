<?php

$loginMySklad = "admin@lightalight";
$passwordMySklad = "LightalightLivoloRu";

$connection = curl_init();
curl_setopt($connection, CURLOPT_USERPWD, "$loginMySklad:$passwordMySklad");

// curl_setopt($connection, CURLOPT_URL, "https://online.moysklad.ru/api/remap/1.1/entity/product/550dd725-a99a-11e7-7a69-93a700101ad3");
// curl_setopt($connection, CURLOPT_URL, "https://online.MoySklad.ru/api/remap/1.1/entity/bundle/03da8f56-b155-11e8-9ff4-34e800000d36/components");
curl_setopt($connection, CURLOPT_URL, "https://online.MoySklad.ru/api/remap/1.1/entity/bundle?limit=1");

curl_setopt($connection, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($connection);

$result = json_decode($result);

echo "<pre>";
print_r($result);
echo "</pre>";

