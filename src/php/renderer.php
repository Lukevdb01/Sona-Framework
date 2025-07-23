<?php
function render($vnode) {
    // If it's a string, render as text
    if (is_string($vnode)) {
        return htmlspecialchars($vnode);
    }
    if (!is_array($vnode) || !isset($vnode['type'])) return '';

    if ($vnode['type'] === '__text__') {
        return htmlspecialchars($vnode['text']);
    }

    $tag = $vnode['type'];
    $props = $vnode['props'] ?? [];
    $children = $vnode['children'] ?? [];

    $attributes = '';
    foreach ($props as $key => $value) {
        $attributes .= ' ' . htmlspecialchars($key) . '="' . htmlspecialchars($value) . '"';
    }

    $html = "<$tag$attributes>";

    foreach ($children as $child) {
        $html .= render($child);
    }

    $html .= "</$tag>";

    return $html;
}
