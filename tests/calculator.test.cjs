const assert = require('node:assert/strict');
const test = require('node:test');

require('../data/ability.js');
const { calculateDamage, getFalloffModifier, getSpellRadius } = require('../js/calculator.js');
const ability = globalThis.MagnetoAbility;

test('ability configuration matches the calculator specification', () => {
    assert.deepEqual(ability, {
        charge: { min: 0, max: 5, radiusGrowthDuration: 4 },
        radius: { initial: 5, max: 8 },
        damage: {
            initialCenter: 100,
            fullyChargedCenter: 350,
            energyPerPoint: 3,
            projectile: 0,
            falloffDistance: 6,
            minimumFalloff: 0.5
        },
        energy: { min: 0, overload: 100, cost: 3400 },
        distance: { min: 0 },
        absorption: { powerPerDamage: 0.125, maxProjectileDamage: 800 }
    });
});

test('spell radius grows linearly to its maximum over the growth duration', () => {
    assert.equal(getSpellRadius(0), 5);
    assert.equal(getSpellRadius(2), 6.5);
    assert.equal(getSpellRadius(4), 8);
    assert.equal(getSpellRadius(5), 8);
});

test('center damage increases linearly through maximum charge duration', () => {
    assert.equal(calculateDamage(0, 0, 0).centerDamage, 100);
    assert.equal(calculateDamage(2.5, 0, 0).centerDamage, 225);
    assert.equal(calculateDamage(5, 0, 0).centerDamage, 350);
});

test('each Energy point adds the configured amount of center damage', () => {
    assert.equal(calculateDamage(0, 10, 0).centerDamage, 130);
});

test('damage falloff is full at the center and reaches its minimum at the falloff distance', () => {
    assert.equal(getFalloffModifier(0), 1);
    assert.equal(getFalloffModifier(6), 0.5);
    assert.equal(getFalloffModifier(8), 0.5);
});

test('distance outside the current spell radius deals no damage', () => {
    const result = calculateDamage(0, 0, 5.1);

    assert.equal(result.isOutOfRange, true);
    assert.equal(result.damage, 0);
});

test('damage is reduced at the falloff distance and floored to a whole number', () => {
    const result = calculateDamage(5, 0, 6);

    assert.equal(result.damage, 175);
});

test('field edge damage uses the current radius and configured falloff', () => {
    const result = calculateDamage(0, 0, 0);

    assert.equal(result.edgeDamage, 58);
});

test('reaching the overload threshold self-destructs and deals no damage', () => {
    const result = calculateDamage(5, 100, 0);

    assert.equal(result.isSelfDestructed, true);
    assert.equal(result.centerDamage, 0);
    assert.equal(result.edgeDamage, 0);
    assert.equal(result.damage, 0);
});
