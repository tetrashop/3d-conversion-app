<?php
// تنظیمات تولید - غیرفعال کردن حالت توسعه
define('_PS_MODE_DEV_', false);
define('_PS_DEBUG_SQL_', false);
define('_PS_DISPLAY_COMPATIBILITY_WARNING_', false);
define('_PS_DEBUG_PROFILING_', false);
define('_PS_ENABLE_LOG_', false);

// افزایش سطح خطا برای تولید
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', 'Off');
ini_set('log_errors', 'On');
ini_set('error_log', '/data/data/com.termux/files/home/apps/3d-conversion-app/3d-conversion-app/tetrashop100/log/php_errors.log');
