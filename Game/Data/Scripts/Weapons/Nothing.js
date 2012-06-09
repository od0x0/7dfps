script.attachEvent(DIM3_EVENT_CONSTRUCT,'OnConstruct');

function OnConstruct(weap,subEvent,id,tick)
{
	weap.model.on=false;
	weap.model.name="Blank";
}
