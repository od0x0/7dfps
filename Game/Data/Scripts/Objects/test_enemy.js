//
// Test Enemy Script
//


script.implements('enemy_base');
script.attachEvent(DIM3_EVENT_CONSTRUCT,"enemyConstruct");

function enemyConstruct(obj,subEvent,id,tick) {
    script.callParent();
    obj.weapon.add("SecurityBot_Weapon");
    obj.health.maximum = 40;
    obj.health.start = 40;
}

function enemyAttack(obj) {
    iface.console.write("Derp");
    obj.model.animation.start("Attack");
    obj.motionVector.stop();
    obj.motionVector.turnToPlayer();
    obj.weapon.fire("SecurityBot_Weapon",1);
}