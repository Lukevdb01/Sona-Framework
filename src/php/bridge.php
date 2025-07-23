<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$_SERVER['DOCUMENT_ROOT'] = dirname(__FILE__) . '/../';
require_once 'vnode.php';
require_once 'renderer.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Simuleer backend-logica
    $state = ['count' => 0];

    // Genereer VDOM
    $vnode = h('button', ['onClick' => 'increment()'], 'Count: 0');
    $html = render($vnode);

    echo json_encode([
        'html' => $html,
        'vdom' => $vnode
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
