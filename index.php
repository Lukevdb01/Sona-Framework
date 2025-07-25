<?php
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_HOST']));
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

$_SERVER['DOCUMENT_ROOT'] = dirname(__FILE__) . '/php/';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Serve the main HTML page (page.html)
    require_once __DIR__ . '/page.html';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle POST requests for VDOM updates and patching
    require_once __DIR__ . '/php/dom.php';
    exit();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}