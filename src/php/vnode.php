<?php

function h($type, $props = [], ...$children) {
    $flatChildren = [];
    foreach ($children as $child) {
        if (is_array($child) && isset($child['type'])) {
            $flatChildren[] = $child;
        } else {
            $flatChildren[] = createTextElement($child);
        }
    }

    return [
        'type' => $type,
        'props' => $props,
        'children' => $flatChildren
    ];
}

function createTextElement($text) {
    return [
        'type' => "TEXT_ELEMENT",
        'props' => ['nodeValue' => $text],
        'children' => []
    ];
}
