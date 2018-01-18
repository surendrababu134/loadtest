var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var loadtest = require('loadtest');
var requestTime = [];
var requestnumber = [];

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json())

app.use(cookieParser())
app.use(express.static(__dirname + '/public')); //__dir and not _dir
var port = 8000; // you can use any port
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/loadtest', function(req, res) {
	var obj = req.body;
    console.log(obj);
    var requestNumber = parseInt(obj.requestCount);
    var options = {
        url: obj.httpRequest+obj.url,
        maxRequests: requestNumber,
        method:obj.urlmethod,
        statusCallback: statusCallback
    };

    loadtest.loadTest(options, function(error) {
        if (error) {
            return console.error('Got an error: %s', error);
        }
        console.log('Tests run successfully');
        var timeTaken = 0;
        var timefor_100_requests=0;
        for (var i = 0; i < requestTime.length; i++) {
            timeTaken = timeTaken + requestTime[i];
            if(i%1000==0){
            	timefor_100_requests = timefor_100_requests+requestTime[i];
            	requestnumber.push({'request':i+'-'+(i+1000),'timeTaken':timefor_100_requests/1000});
            	console.log('for 50 request:'+timefor_100_requests/1000);
            	console.log(requestnumber);
            	console.log(requestnumber.length);
            	console.log('---------------------------------------');
            	timefor_100_requests=0;
            }
            if(i%1000!=0){
            	timefor_100_requests = timefor_100_requests+requestTime[i];
            }
        }
        var requestObj = {};
        requestObj.requestValue = requestnumber;
        requestObj.averageTime = timeTaken/1000;
        requestnumber=[];
        requestTime=[];
        //console.log('total time elapsed:'+timeTaken/1000);
        res.send(requestObj);
    });
    
    /*if(req.body.username=='admin' && req.body.password=="admin"){
    	res.send({message:'Successfully logged.',status:200});
    }else{
    	res.send({message:'Authentication failed.',status:500});
    }*/
});

function statusCallback(error, result, latency) {
        //console.log('Current latency %j, result %j, error %j', latency, result, error);
        /*console.log('-----------------------------------------------------');
        console.log('Request elapsed milliseconds: ', result.requestElapsed);
        console.log('Request index: ', result.requestIndex);
        console.log('Request loadtest() instance index: ', result.instanceIndex);
        console.log('-----------------------------------------------------');*/
        requestTime.push(result.requestElapsed);
}
app.listen(port);
console.log('server on ' + port);