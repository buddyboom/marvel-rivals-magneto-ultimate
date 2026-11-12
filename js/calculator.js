(function (global) {
    const ability = global.MagnetoAbility;

    function getSpellRadius(time) {
        const { initial, max } = ability.radius;
        const growthDuration = ability.charge.radiusGrowthDuration;
        return time <= growthDuration
            ? initial + (time / growthDuration) * (max - initial)
            : max;
    }

    function getFalloffModifier(distance) {
        const { falloffDistance, minimumFalloff } = ability.damage;
        return distance <= falloffDistance
            ? 1 - (distance / falloffDistance) * (1 - minimumFalloff)
            : minimumFalloff;
    }

    function calculateDamage(time, energy, distance) {
        const radius = getSpellRadius(time);
        const isSelfDestructed = energy >= ability.energy.overload;
        const chargeProgress = time / ability.charge.max;
        const centerDamage = isSelfDestructed
            ? 0
            : ability.damage.initialCenter +
                chargeProgress * (ability.damage.fullyChargedCenter - ability.damage.initialCenter) +
                energy * ability.damage.energyPerPoint;
        const edgeDamage = centerDamage > 0
            ? Math.floor(centerDamage * getFalloffModifier(radius))
            : 0;
        const isOutOfRange = distance > radius;
        const damage = isSelfDestructed || isOutOfRange
            ? 0
            : Math.max(0, Math.floor(centerDamage * getFalloffModifier(distance)));

        return {
            radius,
            centerDamage,
            edgeDamage,
            damage,
            isOutOfRange,
            isSelfDestructed
        };
    }

    global.MagnetoCalculator = {
        calculateDamage,
        getFalloffModifier,
        getSpellRadius
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = global.MagnetoCalculator;
    }
})(typeof window === 'undefined' ? globalThis : window);
