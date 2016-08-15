<?php
/**
 * Contact Form Processing Script
 * 
 * @author Ralfe Poisson <ralfepoisson@gmail.com>
 *
 * SQL for Database Creation
 * ------------------------------------------------
 * CREATE DATABASE `website`;
 * GRANT ALL PRIVILEGES ON `website`.* TO 'website'@'localhost' IDENTIFIED BY 'w3b51T31221';
 * USE `website`;
 * CREATE TABLE `contact_requests` (
 *   `id` int(11) auto_increment,
 *   `name` varchar(255),
 *   `email` varchar(255),
 *   `message` text,
 *   PRIMARY KEY (`id`)
 * );
 */
 
// Get GET Data
$name = $_GET['name'];
$email = $_GET['email'];
$message = $_GET['message'];

// Store in database
$link = mysql_connect("localhost", "website", "w3b51T31221");
mysql_select_db("website", $link);
mysql_query("INSERT INTO `contact_requests` (`name`, `email`, `message`) VALUES(\"{$name}\", \"{$email}\", \"{$message}\");");
print mysql_error();
