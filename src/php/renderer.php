<?php

function render($vnode) {
    if (!is_array($vnode) || !isset($vnode['type'])) {
        return '';
    }

    $type = $vnode['type'];
    $props = isset($vnode['props']) && is_array($vnode['props']) ? $vnode['props'] : [];
    $children = isset($vnode['children']) && is_array($vnode['children']) ? $vnode['children'] : [];

    $html = "<$type";

    foreach ($props as $key => $value) {
        $html .= " $key=\"$value\"";
    }

    $html .= ">";

    foreach ($children as $child) {
        $html .= render($child);
    }

    $html .= "</$type>";

    return $html;
}
