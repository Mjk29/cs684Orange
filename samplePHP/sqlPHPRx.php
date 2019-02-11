<?php
    session_start();

// var_dump($_POST)


$servername = "sql.njit.edu";
$username = "mjk29";
// $password = "KP2wtAdHk";
// $password = "lvbk1jke";
$password = "password";


$dbname = "mjk29";


// print_r($_POST);
// $data = $_POST["csvData"];
// echo "\n\n";
// $arData = json_decode($data);

// var_dump($arData);

// $dataIn = json_decode($_POST);
// echo "vardump decoded $_POST\n";
// var_dump($dataIn);
// echo "echo data in\n";
// echo $dataIn;
// echo "\n";
// echo json_encode($dataIn);



// $dataIn = $_POST;
// echo "Here is echo POST \n";
// echo $dataIn;
// echo "\n\n here is the vardump POST";
// var_dump($dataIn);
// echo "\n\n here is vardump for jsondecode post";

// $decoded = json_decode($_POST);

// $sendback = json_encode($decoded);

// echo $sendback;

// $test =  (json_encode($dataIn));
// echo $test;
// echo json_decode($test);
// echo json_decode(json_decode($test));
// echo "\n\nHERES VARDUMP JSONDECODE POST\n\n";
// var_dump(json_decode($dataIn));


// echo phpinfo();

// echo "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv";
// print_r($_GET);
// print_r($_POST);

// echo $_POST["POSTTYPE"];
 
//     echo "_^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^";
// echo "WHATEver";

$link = new mysqli($servername, $username, $password, $dbname);
if (!$link) {
    die('Could not connect: ' . mysql_error());
}



// $sql = "INSERT INTO Inventory (SKU, Keywords, Description, Consumable, Availability, Price, Link, Name, Image, Location)
//         VALUES ('".rand()."',2,3,4,5,6,7,8,9,0  )";

if ($_POST["POSTTYPE"] == 'item') {
	// echo "ADDING ITEM FROM PHP\n";
   	$filename = "../cap/images/".$_POST["Image"];

	$sql = 
	"INSERT INTO inventory2 
	(SKU, Keywords, Description, Consumable, Availability, Price, Link, Name, Image, Location)
	        VALUES (
	        '".$_POST["SKU"]."',
			'".$_POST["Keywords"]."',
			'".$_POST["Description"]."',
			'".$_POST["Consumable"]."',
			'".$_POST["Availability"]."',
			'".$_POST["Price"]."',
			'".$_POST["Link"]."',
			'".$_POST["Name"]."',
			'".$filename."',
			'".$_POST["Location"]."'
	)";
	if ($link->query($sql) === TRUE) {

		$imgDatab64 = explode( ',', $_POST["ImageData"]);
		$writeImgData = base64_decode($imgDatab64[1]);

		$imageDir = "images/".$_POST["Image"];
	    if (file_put_contents($imageDir, $writeImgData)) {
	    	echo "success";
	    } 


    // echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $link->error;
}
}

if ($_POST["POSTTYPE"] == 'csvItem') {



	$dataString = $_POST['csvData'];

	// echo "\nHere is the keys \n";
	$keyArray = (array_keys($dataString));
	// echo $keyArray;

	// echo "ADDING ITEM FROM PHP\n";
	// echo $_POST["csvData"][0][0];
	// $dataString = $_POST['csvData'];
 //    $data = json_decode($dataString);
 //    // echo sizeof($_POST);
	// $size = (int) $_SERVER['CONTENT_LENGTH'];
	// echo "\nServer size : ".$size."\n";

	// echo("\nDataString Size :". sizeof($dataString)."\n");

	// $exDat = $_POST["extraData"];

	// echo json_decode($exDat);
	// print_r($_POST);


	// var_dump($dataString);
	// var_dump($_POST["csvData"]);


	$sql = "INSERT INTO `".$_POST["tableName"]."` (";
	for ($i=0; $i < sizeof($keyArray); $i++) { 
		if ($i > 0) {
			$sql.=" , ";
		}
		$sql .= $keyArray[$i];
	}

	$sql.=") VALUES ( ";

	for ($i=0; $i < sizeof($dataString); $i++) { 
		if ($i > 0) {
			$sql.=" , ";
		}
		// echo "size : ".sizeof($dataString[$keyArray[$i]])."\n";
		$sql .= "\"".$link->real_escape_string($dataString[$keyArray[$i]])."\"";
	}
	$sql.=")";


	 if ($link->query($sql) === TRUE) {
	    echo "New record created successfully";
	} else {
	    echo "Error: " . $sql . "<br>" . $link->error;
	}

	// echo $_POST["csvData"][1]["Name"];
	// echo sizeof($_POST["csvData"]);
	// for ($i=1; $i < sizeof($_POST["csvData"]); $i++) { 
		// echo $_POST["csvData"][$i]["Name"]."\n";
		// echo $i."\t";
	// }


	// echo sizeof($_POST["csvData"][0]);
	// for ($i=1; $i < sizeof($_POST["csvData"][0]); $i++) { 
	// 		echo $_POST["csvData"][1][$i];
	// 	}


	// echo $sql;


	// .$_POST["tableName"].", ".$_POST["tableName"].", ".$_POST["tableName"].", ".$_POST["tableName"].", ".$_POST["tableName"].", ".$_POST["tableName"].", ".$_POST["tableName"].", ".$_POST["tableName"].", ".$_POST["tableName"].", ".$_POST["tableName"].")

	// VALUES ('".$_POST["SKU"]."','".$_POST["Keywords"]."','".$_POST["Description"]."','".$_POST["Consumable"]."',
	//         '".$_POST["Availability"]."','".$_POST["Price"]."','".$_POST["Link"]."','".$_POST["Name"]."',
 // 	        '".$_POST["Image"]."','".$_POST["Location"]."'
 // 	    )";




// 	    if ($link->query($sql) === TRUE) {
//     echo "New record created successfully";
// } else {
//     echo "Error: " . $sql . "<br>" . $link->error;
// }
}



else if ($_POST["POSTTYPE"] == 'user') {
echo "ADDING ITEM FROM PHP\n";
	$sql = "INSERT INTO user (UCID, Name, Address)
	        VALUES ('".$_POST["UCID"]."','".$_POST["Name"]."','".$_POST["Address"]."')";

}


else if ($_POST["POSTTYPE"] == 'tx') {
	echo "ADDING TX FROM PHP\n";
	$sql = "INSERT INTO transactions (transactionID, UCID, Name, Total, Item)
	        VALUES ('".$_POST["transactionID"]."','".$_POST["UCID"]."','".$_POST["Name"]."','".$_POST["Total"]."','".$_POST["Item"]."')";
}


else if ($_POST["POSTTYPE"] == 'get') {
// echo "GET UNCTION";
	// echo "GETTING TABLE DATA : ".$_POST["tableName"]."\n\n";	
	$sendArray = [];
	$multiArray = [];

	$qString = "SELECT ";
	if ($_POST["distinct"]) {
		$qString .= " DISTINCT ";
	}
	if ($_POST["query"]) {
		$qString .= "".$_POST["query"]."";
	}
	if ($_POST["tableName"]) {
		$qString .= " FROM `".$_POST["tableName"]."`";
	}

	if (sizeof($_POST["where"]) > 1) {
		if ($_POST["andor"] == 0) {	
			$andor = " OR ";
		}
		else{
			$andor = " AND ";
		}
			$qString .= ' WHERE (';
			for ($i=0; $i < sizeof($_POST["where"]); $i++) { 
				$qString.= $_POST["column"]." LIKE '%".$_POST["where"][$i]."%'";
				if ($i+1 < sizeof($_POST["where"])) {
					$qString.=$andor;
				}
			}
			$qString.= ")";
	}
	else if (sizeof($_POST["where"]) == 1){
		$qString .= " WHERE `".$_POST["column"]."` = '".$_POST["where"][0]."'";
	}
	// echo $qString;
		if ($result = $link->multi_query($qString)) {
		do {
			if ($result = $link->use_result()) {
				$indexer = 0;
				// get the column names for the send array
				$colNames = $result->fetch_fields();

				// While there are results, loop throuigh them
				while ($row = $result->fetch_row()) {
					

					// For getting all results
					// Adds them to a 2d array then sends the array
					if (strcmp($_POST["query"],"*") == 0) {
						// for ($j=0; $j < 10; $j++) { 
						for ($j=0; $j < mysqli_field_count($link); $j++) { 
							// Original statement for sending non assocatiave array
							// $multiArray[$indexer][$j] = $row[$j];
							// New statement for sending assoaciative array
				        	$multiArray[$indexer][$colNames[$j]->name] = $row[$j];
						} 
						$indexer +=1;	
					}

					// If not requesting * from the db
					// Will need to be updated if front wants to select
					// more than one column of data
					else{
						array_push($sendArray, $row[0]);
					}
				}
				if (strcmp($_POST["query"],"*") == 0) {
					echo json_encode($multiArray);
				}
				else{
					echo json_encode($sendArray);
				}
				$result->close();	
			}
			if ($link->more_results()) {
			}
		} while ($link->next_result());
	}
}


else if ($_POST["POSTTYPE"] == 'test') {

	$testarray = [];

	// echo "TESTING TYPE IS TEST";
	$qString = "SELECT * FROM `Inventory`";
	if ($result = $link->query($qString)) {
	    // printf("Select returned %d rows.\n", $result->num_rows);
        $colNames = $result->fetch_fields();

        for ($i=0; $i < sizeof($colNames) ; $i++) { 
        	// echo $colNames[$i]->name;
        	// echo "\n";
        	$testarray[$colNames[$i]->name] = "test";
        }
		echo json_encode($testarray);
        // var_dump($colNames);
	    /* free result set */
	    $result->close();
	}

}


else if ($_POST["POSTTYPE"] == 'login') {
	$returnedPassHash = "";
	$hash = password_hash($_POST["plainText"], PASSWORD_DEFAULT);
	$qString =" SELECT * FROM `users` WHERE `uname` = '".$_POST["uname"]."'";
	$sendArray = [];

	$result = $link->query($qString);
	while ($row = mysqli_fetch_assoc($result)) {
	    $returnedPassHash = $row['pass'];
	}

	if (password_verify($_POST["plainText"], $returnedPassHash)) {
	    session_start();
		$_SESSION['uname'] = $_POST["uname"];
		echo json_encode("valid");

	} else {
		echo json_encode("notValid");
	}

// njitwifi
}


else if ($_POST["POSTTYPE"] == 'logout') {
	   session_destroy();
	   echo "destroyed";
}

else if ($_POST["POSTTYPE"] == 'getPrice') {
	   echo $_POST["SKU"];
}

else if ($_POST["POSTTYPE"] == 'cartdata') {
	   print_r($_POST);
}

$link->close();


?>