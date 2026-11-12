(function (global) {
    const ability = Object.freeze({
        charge: Object.freeze({
            min: 0,
            max: 5,
            radiusGrowthDuration: 4
        }),
        radius: Object.freeze({
            initial: 5,
            max: 8
        }),
        damage: Object.freeze({
            initialCenter: 100,
            fullyChargedCenter: 350,
            energyPerPoint: 3,
            projectile: 0,
            falloffDistance: 6,
            minimumFalloff: 0.5
        }),
        energy: Object.freeze({
            min: 0,
            overload: 100,
            cost: 3400
        }),
        distance: Object.freeze({
            min: 0
        }),
        absorption: Object.freeze({
            powerPerDamage: 0.125,
            maxProjectileDamage: 800
        })
    });

    global.MagnetoAbility = ability;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ability;
    }
})(typeof window === 'undefined' ? globalThis : window);
