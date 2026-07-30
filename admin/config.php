<?php
declare(strict_types=1);

return [
    'site_name' => '水晶男孩推廣部',
    'db' => [
        'host' => getenv('SECHSKIES_DB_HOST') ?: '127.0.0.1',
        'port' => getenv('SECHSKIES_DB_PORT') ?: '3306',
        'name' => getenv('SECHSKIES_DB_NAME') ?: 'sechskies_cms',
        'user' => getenv('SECHSKIES_DB_USER') ?: 'root',
        'pass' => getenv('SECHSKIES_DB_PASS') ?: '',
    ],
    'upload_dir' => dirname(__DIR__) . '/assets/uploads',
    'upload_url' => '../assets/uploads',
    'max_upload_bytes' => 8 * 1024 * 1024,
];
