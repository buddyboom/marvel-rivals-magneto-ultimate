(function () {
const ABILITY = window.MagnetoAbility;
const { calculateDamage } = window.MagnetoCalculator;
const { attachAdjustmentButtons, attachShapeSlider } = window.MagnetoControls;
const { renderRoster, updateDamageVisualization, updateRoster, updateShapeControls } = window.MagnetoVisualization;

const sliders = {
    charge: document.getElementById('chargeTime'),
    energy: document.getElementById('energy'),
    distance: document.getElementById('distance')
};

const sliderLimits = {
    charge: { min: ABILITY.charge.min, max: ABILITY.charge.max },
    energy: { min: ABILITY.energy.min, max: ABILITY.energy.overload },
    distance: { min: ABILITY.distance.min, max: ABILITY.radius.max }
};

Object.entries(sliderLimits).forEach(([name, limits]) => {
    const slider = sliders[name];
    slider.min = limits.min;
    slider.max = limits.max;
    if (name !== 'distance') {
        const control = document.getElementById(name === 'charge' ? 'chargeControl' : 'energyControl');
        control.setAttribute('aria-valuemin', limits.min);
        control.setAttribute('aria-valuemax', limits.max);
    }
});

const safeEnergyPreset = document.querySelector('.energy-presets [data-preset="safe-max"]');
safeEnergyPreset.dataset.value = String(ABILITY.energy.overload - 1);
safeEnergyPreset.textContent = safeEnergyPreset.dataset.value;

const abilityText = {
    abilityMaxDuration: `${ABILITY.charge.max} seconds`,
    abilityInitialRadius: ABILITY.radius.initial,
    abilityMaxRadius: ABILITY.radius.max,
    abilityRadiusGrowthDuration: ABILITY.charge.radiusGrowthDuration,
    abilityProjectileDamage: ABILITY.damage.projectile,
    abilityInitialDamage: ABILITY.damage.initialCenter,
    abilityFullyChargedDamage: ABILITY.damage.fullyChargedCenter,
    abilityEnergyDamage: ABILITY.damage.energyPerPoint,
    abilityMinimumFalloff: ABILITY.damage.minimumFalloff * 100,
    abilityFalloffDistance: ABILITY.damage.falloffDistance,
    abilityEnergyCost: ABILITY.energy.cost,
    abilityAbsorptionRate: ABILITY.absorption.powerPerDamage,
    abilityMaxAbsorption: ABILITY.absorption.maxProjectileDamage,
    chargeTooltipInitialRadius: ABILITY.radius.initial,
    chargeTooltipMaxRadius: ABILITY.radius.max,
    chargeTooltipGrowthDuration: ABILITY.charge.radiusGrowthDuration,
    chargeTooltipMaxDuration: ABILITY.charge.max,
    energyTooltipDamage: ABILITY.damage.energyPerPoint,
    energyTooltipInitialDamage: ABILITY.damage.initialCenter,
    energyTooltipFullyChargedDamage: ABILITY.damage.fullyChargedCenter,
    energyTooltipChargeDuration: ABILITY.charge.max,
    energyTooltipAbsorptionRate: ABILITY.absorption.powerPerDamage,
    energyTooltipMaxAbsorption: ABILITY.absorption.maxProjectileDamage,
    distanceTooltipMinimumFalloff: ABILITY.damage.minimumFalloff * 100,
    distanceTooltipFalloffDistance: ABILITY.damage.falloffDistance,
    distanceTooltipInitialRadius: ABILITY.radius.initial,
    distanceTooltipMaxRadius: ABILITY.radius.max,
    distanceTooltipGrowthDuration: ABILITY.charge.radiusGrowthDuration
};

Object.entries(abilityText).forEach(([id, value]) => {
    document.getElementById(id).textContent = value;
});

const shapeControls = {
    charge: document.getElementById('chargeControl'),
    chargeProgress: document.getElementById('chargeProgress'),
    chargeThumb: document.getElementById('chargeThumb'),
    energy: document.getElementById('energyControl'),
    energyFill: document.getElementById('energyFill')
};

const elements = {
    chargeDisplay: document.getElementById('chargeTimeVal'),
    energyDisplay: document.getElementById('energyVal'),
    distanceDisplay: document.getElementById('distanceVal'),
    distanceSlider: document.getElementById('distance'),
    distanceSliderWrap: document.querySelector('.distance-slider-wrap'),
    damageDisplay: document.getElementById('damageDisplay'),
    damageRange: document.getElementById('damageRange'),
    radiusInfo: document.getElementById('radiusInfo'),
    calculationAnnouncement: document.getElementById('calculationAnnouncement'),
    roster: document.getElementById('rosterGrid'),
    sphereBody: document.getElementById('sphereBody'),
    sphereFalloffGradient: document.getElementById('sphereFalloffGradient'),
    sphereFalloffHalf: document.getElementById('sphereFalloffHalf'),
    sphereFalloffEdge: document.getElementById('sphereFalloffEdge'),
    sphereDistanceGlowLeft: document.getElementById('sphereDistanceGlowLeft'),
    sphereDistanceGlowRight: document.getElementById('sphereDistanceGlowRight'),
    sphereDistanceDotLeft: document.getElementById('sphereDistanceDotLeft'),
    sphereDistanceDotRight: document.getElementById('sphereDistanceDotRight'),
    sphereDescription: document.getElementById('sphereDescription')
};

const heroNamesToggle = document.getElementById('heroNamesToggle');
heroNamesToggle.addEventListener('change', () => {
    elements.roster.closest('.roster-section').classList.toggle(
        'show-hero-names',
        heroNamesToggle.checked
    );
});

const heroHpToggle = document.getElementById('heroHpToggle');
heroHpToggle.addEventListener('change', () => {
    elements.roster.closest('.roster-section').classList.toggle(
        'hide-hero-hp',
        !heroHpToggle.checked
    );
});

function renderCalculator() {
    const time = Number(sliders.charge.value);
    const energy = Number(sliders.energy.value);
    const distance = Number(sliders.distance.value);
    const result = calculateDamage(time, energy, distance);

    elements.chargeDisplay.innerText = `${time.toFixed(1)}s`;
    elements.energyDisplay.innerText = energy;
    elements.distanceDisplay.innerText = `${distance.toFixed(1)}m`;
    elements.radiusInfo.innerText = `Current Spell Radius: ${result.radius.toFixed(1)}m`;
    elements.distanceSlider.setAttribute(
        'aria-valuetext',
        `${distance.toFixed(1)} meters from center; spell radius ${result.radius.toFixed(1)} meters`
    );
    const distanceMin = Number(sliders.distance.min);
    const distanceRange = Number(sliders.distance.max) - distanceMin;
    const radiusPosition = Math.max(0, Math.min(1, (result.radius - distanceMin) / distanceRange));
    elements.distanceSliderWrap.style.setProperty('--radius-percent', `${radiusPosition * 100}%`);
    elements.distanceSliderWrap.style.setProperty('--radius-thumb-offset', `${radiusPosition * 16}px`);
    elements.damageDisplay.innerText = result.damage;
    const outcome = result.isSelfDestructed
        ? 'The ultimate self-destructs.'
        : result.isOutOfRange
            ? 'The selected distance is outside the spell field.'
            : '';
    elements.calculationAnnouncement.textContent =
        `${result.damage} damage at ${distance.toFixed(1)} meters. ` +
        `Damage across field: ${result.edgeDamage} to ${Math.floor(result.centerDamage)}. ` +
        `Spell radius: ${result.radius.toFixed(1)} meters. ${outcome}`;

    elements.damageDisplay.style.color = result.isSelfDestructed
        ? 'var(--text-muted)'
        : 'var(--accent-color)';
    elements.damageDisplay.style.textShadow = result.isSelfDestructed
        ? 'none'
        : '0 0 20px var(--accent-glow)';

    updateShapeControls(sliders, shapeControls, time, energy);
    updateDamageVisualization(elements, distance, result);
    updateRoster(elements.roster, result.damage);
}

attachShapeSlider(shapeControls.charge, sliders.charge, (event, rect) => {
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const angle = -Math.PI / 2 - Math.atan2(y, x);
    return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (2 * Math.PI);
});

attachShapeSlider(shapeControls.energy, sliders.energy, (event, rect) => {
    const horizontalPosition = (event.clientX - rect.left) / rect.width;
    return Math.abs(horizontalPosition - 0.5) * 2;
});

Object.values(sliders).forEach(slider => slider.addEventListener('input', renderCalculator));
attachAdjustmentButtons(sliders);
renderRoster(elements.roster);
renderCalculator();
})();
