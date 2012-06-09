var MENU_ITEM_CONTINUE=0;
var MENU_ITEM_SETUP=1;
var MENU_ITEM_SAVE=2;
var MENU_ITEM_LOAD=3;

script.attachEvent(DIM3_EVENT_CONSTRUCT,'OnConstruct');
script.attachEvent(DIM3_EVENT_MENU,'OnSelect');

function OnConstruct(obj,subEvent,id,tick){
	
	map.action.setMap('Test','Start')
	
}

function OnSelect(game,subEvent,id,tick)
{
	switch (id) 
	{
	
		case MENU_ITEM_CONTINUE:
			return;
			
		case MENU_ITEM_SETUP:
			iface.interaction.startSetup();
			return;
			
		case MENU_ITEM_SAVE:
			iface.interaction.startSave();
			return;
			
		case MENU_ITEM_LOAD:
			iface.interaction.startLoad();
			return;
			
	}
}