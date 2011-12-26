<?php

// Copy-pasting the table from http://www.uesp.net/wiki/Skyrim:Ingredients
// gives you a tab-separated table with these columns:
// Name, ID, Effect 1, Effect 2, Effect 3, Effect 4, Weight, Value
// This script converts that table to json

$source_file = 'uesp-ingredients-list.txt';
$target_file = 'skyrim-ingredients.js';
$rows = array();

$raw = file_get_contents($source_file);
$raw = str_replace("\r", '', $raw);
$rows = explode("\n", $raw);

foreach($rows as $key => $var)
{
	$temp = explode("\t", $var);
	// Convert weight and value to numeric types
	$temp[6] = floatval($temp[6]);
	$temp[7] = floatval($temp[7]);
	
	$rows[$key] = $temp;
}

file_put_contents($target_file, json_encode($rows));