
export default function fetchFromServer(event){
	try{
		fetch('http://afsconnect1.njit.edu:5688', {
				method: 'POST',
				mode: "cors",
				dataType: 'jsonp',
				credentials: "same-origin", 
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					searchType: event.searchObj.searchType,
					query:event.searchObj.query
				}),
			})
			.then(response => response.json(), );
			console.log("FETCHED FROM SDERVER")
			console.log(json)
			console.log("FETCHED FROM SDERVER")
			return ({ type: event.searchObj.yieldAction, items: json, });
	}
	catch(err){
			console.log("fetch from server error")
			return ({ type: "POST_ERROR"});
	}


}