var MENU_ITEM_CONTINUE=0;
var MENU_ITEM_SETUP=1;
var MENU_ITEM_SAVE=2;
var MENU_ITEM_LOAD=3;

var MENU_ITEM_INTERFACE_TITLE=10;
var MENU_ITEM_INTERFACE_CHOOSER=11;
var MENU_ITEM_INTERFACE_CINEMA=12;

var CHOOSER_ITEM_TEST_GRAPHIC_CALLBACK=110;
var CHOOSER_ITEM_TEST_BUTTON_CALLBACK=121;

script.attachEvent(DIM3_EVENT_CONSTRUCT,'gameConstruct');
script.attachEvent(DIM3_EVENT_MENU,'gameMenuSelect');

// start the game

function gameConstruct(obj,subEvent,id,tick){
	
	map.action.setMap('Test','Start')
	
}

// menu events

function gameMenuSelect(game,subEvent,id,tick)
{
	switch (id) {
	
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