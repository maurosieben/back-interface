var schedule = require('node-schedule'); 
var str = require('string')
var Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost:27017/lightdna');
var db = Mongoose.connection;
var Lights = require('./models/lightSchema');
var Alarms = require('./models/alarmSchema');

var setAlarm = function(hour, minute, group, dimmer)
{
    var rule = new schedule.RecurrenceRule();
    rule.hour = str(hour).toInt();
    rule.minute = str(minute).toInt();
    var job = schedule.scheduleJob(rule, function(){
	var cursor = Lights.find({'group.groupC1': group}, function(err, res){
	    if (err) return handleError(err);
	    var mqtt    = require('mqtt');
	    var client  = mqtt.connect('mqtt://192.168.0.100');
	    for(var j=0;j<res.length;j++){
		console.log(res[j].deviceAddress);
		client.publish('lights/'+res[j].deviceAddress,'W0001-'+dimmer)
	    }
	    client.end()
	})
    })    
}

// function to adjust hour format 
var adjTime = function(time, hour)
{
    var conv = '12'
    if(time == 'PM'){

	hour = (hour - 0)+(conv - 0);
	hour = str(hour).toString();
	if (hour == '24')
	{
	    hour = '12';
	}
    }else{

	if (hour == '12')
	{
	    hour = '00'
	}
    }
    
    return hour;
}
// function to round dimmer value
var adjDimmer = function(value)
{
    if(value!='100')
    {
	value='0'+value; 
    }
    return value; 
}
var grupo = 'Grupo 1';
var msg = 'W0001-000';

db.on('error', console.error);
db.once('open', function() {
    Alarms.find({}, function(err, doc)
		{
		    for(var i=0;i<doc.length;i++){
			console.log(doc[i].time);
			var number = str(doc[i].time).left(5).s;
			var time = str(doc[i].time).right(2).s;
			var hour = str(number).left(2).s;
			hour = str(doc[i].time).toInt();
			hour = adjTime(time, hour);
			var minute = str(number).right(2).s;
			console.dir(str(hour).toInt());
			console.dir(str(minute).toInt());
			dimmer = str(doc[i].dimmer).toString();
			dimmer = adjDimmer(dimmer);
			group = doc[i].group;
			setAlarm(hour, minute , group , dimmer);
			
		    }
		    
		})
    
});
