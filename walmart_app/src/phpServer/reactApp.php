<?php


parseRequest();





function parseRequest(){



	$request = json_decode(file_get_contents('php://input'), true);


	if (sizeof($request) > 0) {
		if ($request["requestType"] == "dispatchTransactionEmail") {
			sendEmail($request["requestData"]);
		}
		
	}
	else{
		$url1 = 'http://afsconnect1.njit.edu:5680';
		$url2 = 'http://afsconnect2.njit.edu:5680';
		$returnedCode1 = checkServerStatus($url1);
		$returnedCode2 = checkServerStatus($url2);
		if ($returnedCode1 == 302) {
			header("Location: ".$url1, true, 301);
		}
		else if($returnedCode2 == 302) {
			header("Location: ".$url2, true, 301);
		}
		else{
			echo "no servers runnning";
		}
		// header("Location: http://afsconnect1.njit.edu:5680", true, 301);
		// exit();
	}
}


function checkServerStatus($serverAddr){
	
	$ch = curl_init($serverAddr);
	curl_setopt($ch, CURLOPT_HEADER, true);    // we want headers
	curl_setopt($ch, CURLOPT_NOBODY, true);    // we don't need body
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch, CURLOPT_TIMEOUT,10);
	$output = curl_exec($ch);
	$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);

	return $httpcode;
}



function sendEmail($request){
	$txNum = $request["txNumber"];

	$result = getTransaction($txNum);

	$totalPrice=0;

	$emailMessage = '<html><body>';
	$emailMessage .= '<style type="text/css">
	.tg  {border-collapse:collapse;border-spacing:0;}
	.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
	.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
	.tg .tg-xr1e{font-weight:bold;background-color:#efefef;color:#036400;border-color:#333333;text-align:left;vertical-align:top}
	.tg .tg-0lax{text-align:left;vertical-align:top}
	</style>
	<table class="tg" style="border-collapse: collapse;border-spacing: 0;">
	  <tr>
	    <th class="tg-xr1e" style="font-family: Arial, sans-serif;font-size: 14px;font-weight: bold;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: #333333;background-color: #efefef;color: #036400;text-align: left;vertical-align: top;">Item<br></th>
	    <th class="tg-xr1e" style="font-family: Arial, sans-serif;font-size: 14px;font-weight: bold;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: #333333;background-color: #efefef;color: #036400;text-align: left;vertical-align: top;">Quantity</th>
	    <th class="tg-xr1e" style="font-family: Arial, sans-serif;font-size: 14px;font-weight: bold;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: #333333;background-color: #efefef;color: #036400;text-align: left;vertical-align: top;">Price</th>
	    <th class="tg-xr1e" style="font-family: Arial, sans-serif;font-size: 14px;font-weight: bold;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: #333333;background-color: #efefef;color: #036400;text-align: left;vertical-align: top;">Total</th>
	  </tr>';


		while($row = $result->fetch_assoc()) {
			$emailMessage .= sprintf('  <tr>
		    <td class="tg-0lax" style="font-family: Arial, sans-serif;font-size: 14px;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: black;text-align: left;vertical-align: top;">%s</td>
		    <td class="tg-0lax" style="font-family: Arial, sans-serif;font-size: 14px;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: black;text-align: left;vertical-align: top;">%s</td>
		    <td class="tg-0lax" style="font-family: Arial, sans-serif;font-size: 14px;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: black;text-align: left;vertical-align: top;">%s</td>
		    <td class="tg-0lax" style="font-family: Arial, sans-serif;font-size: 14px;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: black;text-align: left;vertical-align: top;">$%G</td>
		  </tr>
		', $row["title"], $row["quantity"], $row["itemPrice"], $row["itemPrice"]*$row["quantity"]);
			$totalPrice+= $row["itemPrice"]*$row["quantity"];
		}




	$emailMessage.=	sprintf('<tr>
    <th class="tg-xr1e" colspan=3 style="font-family: Arial, sans-serif;font-size: 14px;font-weight: bold;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: #333333;background-color: #efefef;color: #036400;text-align: left;vertical-align: top;">Subtotal<br></th>
    <th class="tg-0lax" colspan=3 style="font-family: Arial, sans-serif;font-size: 14px;font-weight: normal;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: black;text-align: left;vertical-align: top;">$%G<br></th>
  </tr>
  <tr>
    <td class="tg-xr1e" colspan=3 style="font-family: Arial, sans-serif;font-size: 14px;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: #333333;font-weight: bold;background-color: #efefef;color: #036400;text-align: left;vertical-align: top;">NJ Tax<br></td>
    <td class="tg-0lax" colspan=3 style="font-family: Arial, sans-serif;font-size: 14px;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: black;text-align: left;vertical-align: top;">%s</td>
  </tr>
  <tr>
    <td class="tg-xr1e" colspan=3 style="font-family: Arial, sans-serif;font-size: 14px;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: #333333;font-weight: bold;background-color: #efefef;color: #036400;text-align: left;vertical-align: top;">Total</td>
    <td class="tg-0lax" colspan=3 style="font-family: Arial, sans-serif;font-size: 14px;padding: 10px 5px;border-style: solid;border-width: 1px;overflow: hidden;word-break: normal;border-color: black;text-align: left;vertical-align: top;">$%G</td>
  </tr>
</table>', $totalPrice, "6.625%", round($totalPrice*0.06625, 2));







$emailMessage .= '</body></html>';


		$emailTo      = "mjk29@njit.edu";
		$subject = 'NIT CoAD Electroncis Lab Receipt 2';
		$message = $emailMessage;
		$headers =	'From: CoAD_ElectronicsLab' . "\r\n" .
					'Reply-To:doNotReplyToThisEmail' . "\r\n" .
					'X-Mailer: PHP/' . phpversion()."\r\n".
					'MIME-Version: 1.0'."\r\n".
					'Content-Type: text/html'."\r\n";

		mail($emailTo, $subject, $message, $headers);
}

	
function getTransaction($txNum){
	$servername = "sql.njit.edu";
	$username = "ma995";
	$password = "pickup82";
	$dbname = "ma995";

	$link = new mysqli($servername, $username, $password, $dbname);
	if (!$link) {
		die('Could not connect: ' . mysql_error());
	}

	$sql = sprintf("SELECT  T.itemPrice, quantity, title, imageUrl "
		."FROM ma995.`684Transaction` T JOIN ma995.`684Items` I on T.usItemId = I.usItemId AND T.productId = I.productId "
		."WHERE transactionNumber=%s ;", $txNum);

	$result = $link->query($sql);
	
	if ($result->num_rows == 0) {		
		$link->close(); 
		die('no transactions: ' . mysql_error());
	}

	$link->close(); 
	return $result;

}

	
?>