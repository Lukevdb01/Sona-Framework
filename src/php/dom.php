<?php
$_SERVER['DOCUMENT_ROOT'] = dirname(__FILE__) . '/../';
require_once 'vnode.php';
require_once 'renderer.php';

header('Content-Type: application/json');

// File to persist server VDOM state
$serverVDOMFile = __DIR__ . '/server_vdom.json';

// Helper: load server VDOM from file
function loadServerVDOM($file) {
    if (!file_exists($file)) return null;
    $json = file_get_contents($file);
    return json_decode($json, true);
}

// Helper: save server VDOM to file
function saveServerVDOM($file, $vdom) {
    file_put_contents($file, json_encode($vdom));
}

// Helper: compute a simple patch (replace if different)
function computePatch($oldVDOM, $newVDOM) {
    // For demo: if not identical, return newVDOM as patch
    if ($oldVDOM === $newVDOM) return null;
    return [ 'op' => 'replace', 'vdom' => $newVDOM ];
}

$data = json_decode(file_get_contents('php://input'), true);
file_put_contents('debug.log', print_r($data, true));

if (isset($data['vdom'])) {
    $clientVDOM = $data['vdom'];
    $serverVDOM = loadServerVDOM($serverVDOMFile);

    // Compute patch from serverVDOM to clientVDOM
    $patch = computePatch($serverVDOM, $clientVDOM);

    // Update serverVDOM to match clientVDOM
    saveServerVDOM($serverVDOMFile, $clientVDOM);

    // Always send op='replace' for now, so client always handles as full replace
    if ($patch) {
        $html = render($clientVDOM);
        echo json_encode([
            'patch' => $patch,
            'html' => $html,
            'message' => 'VDOM replaced'
        ]);
    } else {
        echo json_encode([
            'patch' => $patch,
            'message' => 'VDOM patch only'
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid input',
        'example' => [
            'vdom' => [
                'type' => 'div',
                'props' => ['class' => 'container'],
                'children' => [
                    ['type' => 'p', 'props' => [], 'children' => ['Text']]
                ]
            ]
        ]
    ]);
}
