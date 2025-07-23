
<?php
$_SERVER['DOCUMENT_ROOT'] = dirname(__FILE__) . '/../';
require_once 'vnode.php';
require_once 'renderer.php';

header('Content-Type: application/json');

// Start session for per-user VDOM storage
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


// Helper: load server VDOM from session
function loadServerVDOM() {
    return isset($_SESSION['server_vdom']) ? $_SESSION['server_vdom'] : null;
}

// Helper: save server VDOM to session
function saveServerVDOM($vdom) {
    $_SESSION['server_vdom'] = $vdom;
}

// Helper: compute a simple patch (replace if different)
function computePatch($oldVDOM, $newVDOM) {
    // For demo: if not identical, return newVDOM as patch
    if ($oldVDOM === $newVDOM) return null;
    return [ 'op' => 'replace', 'vdom' => $newVDOM ];
}


$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['vdom'])) {
    $clientVDOM = $data['vdom'];

    $serverVDOM = loadServerVDOM();

    // Compute patch from serverVDOM to clientVDOM
    $patch = computePatch($serverVDOM, $clientVDOM);

    // Update serverVDOM to match clientVDOM

    saveServerVDOM($clientVDOM);

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
