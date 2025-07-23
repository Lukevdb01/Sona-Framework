<?php
$_SERVER['DOCUMENT_ROOT'] = dirname(__FILE__) . '/../';
require_once 'vnode.php';
require_once 'renderer.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
file_put_contents('debug.log', print_r($data, true));

if (isset($data['type']) && isset($data['props']) && isset($data['children'])) {
    $vnode = h($data['type'], $data['props'], ...$data['children']);
    $html = render($vnode);
    echo json_encode([
        'html' => $html,
        'message' => 'Virtual DOM PHP Renderer'
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid input',
        'example' => [
            'type' => 'div',
            'props' => ['class' => 'container'],
            'children' => [
                ['type' => 'p', 'props' => [], 'children' => ['Text']]
            ]
        ]
    ]);
}
