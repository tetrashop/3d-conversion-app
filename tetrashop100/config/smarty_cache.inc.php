<?php
// تنظیمات کش Smarty برای بهبود عملکرد
define('_PS_SMARTY_CACHE_', true);
define('_PS_SMARTY_FORCE_COMPILE_', false);
define('_PS_SMARTY_CONSOLE_', false);

// تنظیمات پیشرفته کش
$smarty_cache_config = array(
    'caching' => true,
    'cache_lifetime' => 3600,
    'force_compile' => false,
    'compile_check' => false,
    'merge_compiled_includes' => true
);
return $smarty_cache_config;
