(function (global) {
const HEROES = global.MagnetoHeroes;
const ABILITY = global.MagnetoAbility;
const ROLES = ['Vanguard', 'Duelist', 'Strategist'];

function updateShapeControls(sliders, controls, time, energy) {
    const chargeProgress = time / Number(sliders.charge.max);
    const circumference = 2 * Math.PI * 47;
    const chargeAngle = -chargeProgress * 2 * Math.PI - Math.PI / 2;
    controls.chargeProgress.style.strokeDasharray = circumference;
    controls.chargeProgress.style.strokeDashoffset = circumference * (1 - chargeProgress);
    controls.chargeThumb.setAttribute('cx', 60 + 47 * Math.cos(chargeAngle));
    controls.chargeThumb.setAttribute('cy', 60 + 47 * Math.sin(chargeAngle));
    controls.charge.setAttribute('aria-valuenow', time);
    controls.charge.setAttribute('aria-valuetext', `${time.toFixed(1)} seconds`);

    const energyProgress = energy / Number(sliders.energy.max);
    controls.energyFill.setAttribute('x', 100 - 90 * energyProgress);
    controls.energyFill.setAttribute('width', 180 * energyProgress);
    controls.energy.setAttribute('aria-valuenow', energy);
    controls.energy.setAttribute('aria-valuetext', `${energy} energy points`);
}

function updateDamageVisualization(elements, distance, result) {
    const sphereScale = result.radius / ABILITY.radius.max;
    const edgeDamageRatio = result.centerDamage > 0
        ? result.edgeDamage / result.centerDamage
        : 0;
    const inRange = distance <= result.radius && result.centerDamage > 0;
    const distanceOffset = Math.min(distance / ABILITY.radius.max, 1) * 90;
    const markerOpacity = inRange ? '1' : '0.45';
    const halfFalloffOffset = Math.min(ABILITY.damage.falloffDistance / result.radius, 1) * 100;

    elements.damageRange.innerText =
        `Damage across field: ${result.edgeDamage} - ${Math.floor(result.centerDamage)}`;
    elements.sphereBody.setAttribute(
        'transform',
        `translate(100 100) scale(${sphereScale}) translate(-100 -100)`
    );
    elements.sphereFalloffGradient.setAttribute('r', 90);
    elements.sphereFalloffHalf.setAttribute('offset', `${halfFalloffOffset}%`);
    elements.sphereFalloffHalf.setAttribute('stop-opacity', '0.25');
    elements.sphereFalloffEdge.setAttribute('stop-opacity', (edgeDamageRatio * 0.5).toFixed(2));
    elements.sphereDistanceGlowLeft.setAttribute('cx', 100 - distanceOffset);
    elements.sphereDistanceGlowRight.setAttribute('cx', 100 + distanceOffset);
    elements.sphereDistanceDotLeft.setAttribute('cx', 100 - distanceOffset);
    elements.sphereDistanceDotRight.setAttribute('cx', 100 + distanceOffset);
    elements.sphereDistanceGlowLeft.setAttribute('opacity', markerOpacity);
    elements.sphereDistanceGlowRight.setAttribute('opacity', markerOpacity);
    elements.sphereDistanceDotLeft.setAttribute('opacity', markerOpacity);
    elements.sphereDistanceDotRight.setAttribute('opacity', markerOpacity);
    elements.sphereDescription.textContent =
        `Purple spell field with a translucent damage falloff overlay. At ${distance.toFixed(1)} meters, damage is ${result.damage}. Field radius is ${result.radius.toFixed(1)} meters.`;
}

function renderRoster(roster) {
    roster.innerHTML = '';

    ROLES.forEach(role => {
        const roleSection = document.createElement('section');
        roleSection.className = 'role-section';

        const heading = document.createElement('h3');
        heading.id = `role-${role.toLowerCase()}`;
        heading.className = 'role-heading';
        heading.textContent = role;
        roleSection.setAttribute('aria-labelledby', heading.id);

        const heroGrid = document.createElement('ul');
        heroGrid.className = 'roster-grid';

        HEROES
            .filter(hero => hero.role === role)
            .sort((a, b) => a.hp - b.hp || a.name.localeCompare(b.name))
            .forEach(hero => heroGrid.appendChild(createHeroCard(hero)));

        roleSection.append(heading, heroGrid);
        roster.appendChild(roleSection);
    });
}

function createHeroCard(hero) {
    const card = document.createElement('li');
    card.className = 'hero-card';
    card.dataset.heroId = hero.id;
    card.dataset.heroName = hero.name;

    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'hero-avatar-wrap';

    const avatar = document.createElement('div');
    avatar.className = 'hero-avatar';
    avatar.setAttribute('aria-hidden', 'true');

    if (hero.icon) {
        const image = document.createElement('img');
        image.className = 'hero-icon';
        image.src = hero.icon;
        image.alt = '';
        image.addEventListener('error', () => {
            image.hidden = true;
            avatar.querySelector('.hero-avatar-fallback').hidden = false;
        }, { once: true });
        avatar.appendChild(image);
    }

    const fallback = document.createElement('span');
    fallback.className = 'hero-avatar-fallback';
    fallback.textContent = hero.name
        .split(/\s+/)
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    fallback.hidden = Boolean(hero.icon);
    avatar.appendChild(fallback);

    const healthMeter = document.createElement('span');
    healthMeter.className = 'hero-health-meter';
    healthMeter.setAttribute('aria-hidden', 'true');

    const healthRemaining = document.createElement('span');
    healthRemaining.className = 'hero-health-remaining';
    healthMeter.appendChild(healthRemaining);
    avatar.appendChild(healthMeter);

    const hp = document.createElement('span');
    hp.className = 'hero-hp';
    hp.textContent = hero.hp;
    hp.dataset.maxHp = hero.hp;
    hp.setAttribute('aria-hidden', 'true');
    avatar.appendChild(hp);

    const status = document.createElement('span');
    status.className = 'status-badge';
    status.textContent = 'KO';
    status.setAttribute('aria-hidden', 'true');
    avatarWrap.append(avatar, status);

    const details = document.createElement('div');
    details.className = 'hero-details';
    details.setAttribute('aria-hidden', 'true');

    const name = document.createElement('div');
    name.className = 'hero-name';
    name.textContent = hero.name;

    details.append(name);
    card.append(avatarWrap, details);
    return card;
}

function updateRoster(roster, damage) {
    HEROES.forEach(hero => {
        const card = roster.querySelector(`[data-hero-id="${hero.id}"]`);
        const eliminated = damage >= hero.hp && damage > 0;
        const dealtDamage = Math.max(0, Math.min(damage, hero.hp));
        const remainingHp = Math.max(0, hero.hp - dealtDamage);
        const healthPercent = (remainingHp / hero.hp) * 100;
        const hpDisplay = card.querySelector('.hero-hp');

        hpDisplay.textContent = remainingHp === hero.hp
            ? `${remainingHp}`
            : `${remainingHp}/${hero.hp}`;
        hpDisplay.classList.toggle('damaged', remainingHp < hero.hp);
        card.querySelector('.hero-health-remaining').style.width = `${healthPercent}%`;
        card.style.setProperty('--health-remaining', `${healthPercent}%`);

        if (eliminated) {
            card.classList.add('eliminated');
        } else {
            card.classList.remove('eliminated');
        }
        card.setAttribute(
            'aria-label',
            `${hero.name}, ${remainingHp} of ${hero.hp} HP remaining, ${dealtDamage} damage, ${eliminated ? 'eliminated' : 'alive'}`
        );
    });
}

global.MagnetoVisualization = {
    renderRoster,
    updateDamageVisualization,
    updateRoster,
    updateShapeControls
};
})(window);
