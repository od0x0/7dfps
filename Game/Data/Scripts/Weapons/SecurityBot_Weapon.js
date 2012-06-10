script.attachEvent(DIM3_EVENT_CONSTRUCT,'OnConstruct');
script.attachEvent(DIM3_EVENT_WEAPON_FIRE,'OnFire');

//
// machine gun construction
//

function OnConstruct(weap,subEvent,id,tick)
{
		// weapon model
		
	weap.model.on=false;
	
		// projectile setup
		


	weap.setting.failInLiquid=true;
	
		// the projectiles

	weap.projectile.objectFireBoneName='Fire_Origin';
	weap.projectile.objectFirePoseName='Idle1';
		
	weap.projectile.add('AssaultRifleBullet');
}

function OnFire(weap,subEvent,id,tick)
{
	iface.console.write("PEW");
	weap.projectile.spawnFromObjectBone('AssaultRifleBullet');
}