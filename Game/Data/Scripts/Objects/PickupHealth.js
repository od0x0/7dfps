script.attachEvent(DIM3_EVENT_PICKUP, "OnPickup");script.attachEvent(DIM3_EVENT_CONSTRUCT, "OnConstruct");function OnConstruct(object, subevent, id, tick){	object.setting.suspend=false;	object.setting.pickUp=true;	//object.model.rotate.y=utility.random.getFloat(0,360);	object.model.on=true;	object.model.name="HealthCrate";	object.model.shadow.on=true;		object.size.x=1000;	object.size.z=1000;	object.size.y=1000;	object.size.weight=50;}function OnPickup(object, subevent, id, tick){	if(object.pickup.objectIsPlayer == false) 	{		object.pickup.cancel();		return;	}		//sound.playAtObject('Click',obj.setting.id,0.8);	object.setting.contact=false;	object.setting.suspend=true;	object.setting.hidden=true;		//var healthString = object.setting.getParameter(0);	var healthAmount = 100;	//try	//{	//	healthAmount = int.parseInt(heathString);	//}	if (object.pickup.addHealth(object.pickup.objectId, healthAmount) == false)	{		object.pickup.cancel();		return;	}}