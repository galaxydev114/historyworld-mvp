<?php

/**
 * Sanitize Helpers
 */

if (!function_exists('sanitize_html')) {
    function sanitize_html($string)
    {
        $string = strip_tags($string, '<a><strong><em><hr><br><p><u><i>');
        return $string;
    }
}

if (!function_exists('sanitize_url')) {
    function sanitize_url($url)
    {
        return filter_var($url, FILTER_SANITIZE_URL);
    }
}

if (!function_exists('sanitize_slug')) {
    function sanitize_slug($string)
    {
        $string = str_slug($string);
        return filter_var($string, FILTER_SANITIZE_URL);
    }
}

if (!function_exists('sanitize_email')) {
    function sanitize_email($string)
    {
        return filter_var($string, FILTER_SANITIZE_EMAIL);
    }
}

if (!function_exists('sanitize_number')) {
    function sanitize_number($number)
    {
        return filter_var($number, FILTER_SANITIZE_NUMBER_INT);
    }
}

if (!function_exists('sanitize_decimal')) {
    function sanitize_decimal($decimal)
    {
        return filter_var($decimal, FILTER_SANITIZE_NUMBER_FLOAT);
    }
}