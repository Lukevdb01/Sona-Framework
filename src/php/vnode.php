<?php

function normalizeChildren(array $children): array {
    return array_map(function($child) {
        if (is_array($child)) {
            if (isset($child['children']) && is_array($child['children'])) {
                $child['children'] = normalizeChildren($child['children']);
            }
            return $child;
        } elseif (is_string($child)) {
            return [
                'type' => '__text__',
                'text' => $child,
                'props' => [],
                'children' => []
            ];
        }
        return null;
    }, $children);
}

function h($type, $props = [], ...$children) {
    return [
        'type' => $type,
        'props' => $props,
        'children' => normalizeChildren($children),
    ];
}
