<?php
	
	$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
	
 	echo "string";
	

	$serverCounter = 0;

	if ($contentType === "application/json") {
		//Receive the RAW post data.
		$content = trim(file_get_contents("php://input"));
		$decoded = json_decode($content, true);

		if($decoded["sendID"] == "reactAppTeamOrange"){
			
			sendSlaveServer($serverCounter++);
		}
		else{
			$sendObj->error = "sendID not valid";
			echo json_encode($sendObj);
		}

	//If json_decode failed, the JSON is invalid.
	if(! is_array($decoded)) {
		echo json_encode("failed lookup");
	} 
	else {
		// Send error back to user.
	}
}

function sendSlaveServer($serverCounter){
	$sendObj->data = "got a test 23";
	$sendObj->name = $serverCounter;
	echo json_encode($sendObj);
}


?>