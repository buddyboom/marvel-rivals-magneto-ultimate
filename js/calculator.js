(function (global) {
    function getSpellRadius(time) {
        return time <= 4 ? 5 + (time / 4) * 3 : 8;
    }

    function getFalloffModifier(distance) {
        return distance <= 6 ? 1 - (distance / 6) * 0.5 : 0.5;
    }

    function calculateDamage(time, energy, distance) {
        const radius = getSpellRadius(time);
        const isSelfDestructed = energy >= 100;
        const centerDamage = isSelfDestructed
            ? 0
            : 100 + (time / 5) * 250 + energy * 3;
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
})(window);
