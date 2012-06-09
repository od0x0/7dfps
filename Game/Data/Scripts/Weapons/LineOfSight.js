script.attachEvent(DIM3_EVENT_CONSTRUCT,'OnConstruct');
script.attachEvent(DIM3_EVENT_WEAPON_FIRE,'OnFire');

function OnConstruct(weap,subEvent,id,tick)
{
	weap.model.on=false;
	weap.model.name="Blank";

	weap.projectile.repeatOn=false;
	weap.projectile.repeatTick=0;
}

function OnFire(weap,subEvent,id,tick)
{
	//beingTargetted

	if(subEvent==DIM3_EVENT_WEAPON_FIRE_SINGLE) 
	{
		//if(weap.target.start() && (weap.target.objectId != -1)) weap.event.callObjectByID(weap.target.objectId, "beingTargetted");
		//weap.target.end();
	}
	else weap.fire.cancel();
}
