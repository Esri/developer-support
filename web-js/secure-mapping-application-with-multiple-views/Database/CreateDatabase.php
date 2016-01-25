<?php
//Open the database mydb
$db = new PDO('sqlite:c:\inetpub\wwwroot\SecureMapApp\Database\Authentication.db');

//drop the table if already exists
$db->exec('DROP TABLE IF EXISTS users');

//Create a basic table
$db->exec('CREATE TABLE users (full_name varchar(50), user_name varchar(20), password varchar(20), user_role(12)))');
echo "Table users has been created \n";

//insert rows
$db->exec('INSERT INTO users (full_name, user_name, password, user_role) VALUES ("Regular Dude","user1","password","tier1")');
echo "Row inserted \n";
$db->exec('INSERT INTO users (full_name, user_name, password, user_role) VALUES ("Regular Girl","user2","password","tier1")');
echo "Row inserted \n";
$db->exec('INSERT INTO users (full_name, user_name, password, user_role) VALUES ("Special Dude","user3","password","tier2")');
echo "Row inserted \n";
$db->exec('INSERT INTO users (full_name, user_name, password, user_role) VALUES ("Lord Admin","user4","password","tier3")');
echo "Row inserted \n";
?>