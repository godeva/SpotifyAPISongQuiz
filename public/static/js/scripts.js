// Add some Javascript code here, to run on the front end.

console.log("Welcome to the final project!")

// HF
function newXHRRequest(method, url, sender, handler) {
	var req = new XMLHttpRequest()
	req.onreadystatechange = function() {
		handleRes(req, handler)
    }
    req.open(method, url, true)
    sender(req)
}


function handleRes(req, handler) {
    if( req.readyState !== XMLHttpRequest.DONE ) {
        return
    }
    if(req.status === 200) {
    	handler (req)
    }
}