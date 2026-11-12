(function (global) {
    function setSliderValue(input, value) {
        const min = Number(input.min);
        const max = Number(input.max);
        const precision = (input.step.split('.')[1] || '').length;
        input.value = Math.max(min, Math.min(max, Number(value.toFixed(precision)))).toString();
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function setSliderFromProgress(input, progress) {
        const min = Number(input.min);
        const max = Number(input.max);
        const step = Number(input.step) || 1;
        const precision = (input.step.split('.')[1] || '').length;
        const rawValue = min + Math.max(0, Math.min(1, progress)) * (max - min);
        const steppedValue = min + Math.round((rawValue - min) / step) * step;
        setSliderValue(input, steppedValue);
    }

    function attachShapeSlider(control, input, getProgress) {
        function updateFromPointer(event) {
            const rect = control.getBoundingClientRect();
            setSliderFromProgress(input, getProgress(event, rect));
        }

        control.addEventListener('pointerdown', event => {
            control.setPointerCapture(event.pointerId);
            updateFromPointer(event);
        });
        control.addEventListener('pointermove', event => {
            if (control.hasPointerCapture(event.pointerId)) {
                updateFromPointer(event);
            }
        });
        control.addEventListener('keydown', event => {
            const min = Number(input.min);
            const max = Number(input.max);
            const step = Number(input.step) || 1;
            const current = Number(input.value);
            let nextValue;

            if (event.key === 'Home') {
                nextValue = min;
            } else if (event.key === 'End') {
                nextValue = max;
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                nextValue = current + step;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                nextValue = current - step;
            } else if (event.key === 'PageUp') {
                nextValue = current + step * 10;
            } else if (event.key === 'PageDown') {
                nextValue = current - step * 10;
            } else {
                return;
            }

            event.preventDefault();
            setSliderValue(input, nextValue);
        });
    }

    function attachAdjustmentButtons(sliders) {
        document.querySelectorAll('.step-controls button').forEach(button => {
            button.addEventListener('click', () => {
                const input = sliders[button.dataset.slider];
                const nextValue = button.dataset.value === undefined
                    ? Number(input.value) + Number(button.dataset.delta)
                    : Number(button.dataset.value);
                setSliderValue(input, nextValue);
            });
        });
    }

    global.MagnetoControls = {
        attachAdjustmentButtons,
        attachShapeSlider
    };
})(window);
