script.attachEvent(DIM3_EVENT_CONSTRUCT,'OnConstruct');
script.attachEvent(DIM3_EVENT_ANIMATION_WEAPON,'OnAnimation');
script.attachEvent(DIM3_EVENT_WEAPON_FIRE,'OnFire');

//
// machine gun construction
//

function OnConstruct(weap,subEvent,id,tick)
{
		// weapon model
		
	weap.model.on=true;
	weap.model.name="Shotgun";

		// setup how weapon is held in hand
		
	weap.handPosition.x=-500;
	weap.handPosition.y=-1400;
	weap.handPosition.z=2500;
	
	weap.handAngle.x=0;
	weap.handAngle.y=0;
	weap.handAngle.z=0;
	
		// setup how weapon is changed
		
	weap.hand.raiseTick=450;
	weap.hand.lowerTick=500;
	weap.hand.selectShift=800;
	
		// projectile setup
		
	weap.projectile.repeatOn=false;
	weap.projectile.repeatTick=0;
	
		// ammo and clips
		
	weap.ammo.initCount=10 * 5;
	weap.ammo.maxCount=10 * 5;
	
	weap.ammo.clip=false;
	weap.ammo.initClipCount=0;
	weap.ammo.maxClipCount=0;
	
		// recoil
		
	weap.recoil.minX=-9.0;
	weap.recoil.maxX=1.0;
	weap.recoil.resetX=0.05;
	
	weap.recoil.minY=-5.0;
	weap.recoil.maxY=5.0;
	weap.recoil.resetY=0.1;
	
		// crosshair
		
	weap.crosshair.on=true;
	weap.crosshair.type=DIM3_WEAPON_CROSSHAIR_TYPE_CENTER;
	weap.crosshair.name='xcross';

		// fails under water

	weap.setting.failInLiquid=true;
	
		// the projectiles

	weap.projectile.objectFireBoneName='Fire';
	weap.projectile.objectFirePoseName='Idle1';
		
	weap.projectile.add('ShotgunBullet');

	weap.kickback.size = 10;
}

//
// machine gun animation
//

function OnAnimation(weap,subEvent,id,tick)
{
	switch (subEvent) {
		
		case DIM3_EVENT_ANIMATION_WEAPON_RAISE:
			//weap.model.animation.start('Lift');
			return;
		case DIM3_EVENT_ANIMATION_WEAPON_LOWER:
			//weap.model.animation.start('Drop');
			return;
		default:
			//weap.model.animation.change('Idle');
			return;
	}
}

//
// machine gun fire
//

function machineGunFirePlayer(weap)
{
		
		// out of ammo?
		
	if (!weap.ammo.useAmmo(1)) {
	
			// attempt to change clips
			
		if (!weap.ammo.changeClip()) {
			weap.fire.cancel();
			//iface.text.setText("WeaponInfo", "Shotgun " + weap.ammo.count + "x" + weap.ammo.clipCount)
			return;
		}

		//iface.text.setText("WeaponInfo", "Shotgun " + weap.ammo.count + "x" + weap.ammo.clipCount)
		
			// run change animation
			
		weap.model.animation.startThenChange('Reload','Idle');
		
			// reload makes next fire wait longer
		
		weap.fire.cancel();
		return;
	}
	
		// model animation
		
	weap.model.animation.startThenChange('Shoot','Idle');	
	
		// spawn projectile


	for (var i = 0; i<10; i++)
		weap.projectile.spawnFromCenterSlop('ShotgunBullet', 5);
	

	//weap.projectile.spawnFromCenterSlop('Bullet',1.5);
		// run recoil
	
	//iface.text.setText("WeaponInfo", "Shotgun " + weap.ammo.count + "x" + weap.ammo.clipCount)

	weap.recoil.go();
	weap.kickback.kick();
}

function OnFire(weap,subEvent,id,tick)
{
		// only handle certain events

	if ((subEvent!=DIM3_EVENT_WEAPON_FIRE_DOWN) && (subEvent!=DIM3_EVENT_WEAPON_FIRE_REPEAT) && (subEvent!=DIM3_EVENT_WEAPON_FIRE_SINGLE)) {
		weap.fire.cancel();
		return;
	}

		// check reload

	/*if (!weap.fire.pastLastFire(reloadWait)) {
		weap.fire.cancel();
		return;
	}*/

	if(weap.model.animation.currentAnimationName == "Shoot") {
		weap.fire.cancel();
		return;
	}

	if(weap.model.animation.currentAnimationName == "Reload") {
		weap.fire.cancel();
		return;
	}

		// key down and key repeat are from players
		
	if ((subEvent==DIM3_EVENT_WEAPON_FIRE_DOWN)) {
		machineGunFirePlayer(weap);
		return;
	}

		// cancel all other firings

	weap.fire.cancel();
}

function OnManualReload(weapon)
{
	//iface.console.write("Doing Manual Reload");
	if(weapon.ammo.changeClip()) weapon.model.animation.startThenChange('Reload','Idle');
}
