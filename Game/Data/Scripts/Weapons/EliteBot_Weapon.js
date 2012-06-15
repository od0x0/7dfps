script.attachEvent(DIM3_EVENT_CONSTRUCT,'OnConstruct');
script.attachEvent(DIM3_EVENT_WEAPON_FIRE,'OnFire');

var fireBone = 1;

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

	weap.projectile.objectFireBoneName='Fire1';
	weap.projectile.objectFirePoseName='Idle';
		
	weap.projectile.add('EliteBot_Grenade');
}

function OnFire(weap,subEvent,id,tick) {
    weap.projectile.objectFireBoneName='Grenade'+fireBone;
    iface.console.write(weap.projectile.objectFireBoneName);
	weap.projectile.spawnFromObjectBone('EliteBot_Grenade');
	fireBone += 1;
	if (fireBone > 4) fireBone = 1;
}