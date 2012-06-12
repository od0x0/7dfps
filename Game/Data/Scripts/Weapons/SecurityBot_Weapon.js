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
		
	weap.projectile.add('SecurityBot_Bullet');
}

function OnFire(weap,subEvent,id,tick) {
    weap.projectile.objectFireBoneName='Fire'+fireBone;
	weap.projectile.spawnFromObjectBoneSlop('SecurityBot_Bullet',5);
	fireBone += 1;
	if (fireBone > 3) fireBone = 1;
}