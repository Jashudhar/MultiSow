

const modelsGrid = document.getElementById('models-grid');

// Model-specific visual configs (gradient + Material Icon)
const modelVisuals = {
    'wayanad-classic': { gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)', icon: 'park', label: 'Coconut · Banana · Turmeric' },
    'karnataka-spice': { gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fbbf24 100%)', icon: 'local_cafe', label: 'Silver Oak · Papaya · Cardamom' },
    'tamil-nadu-tropical': { gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)', icon: 'yard', label: 'Mango · Guava · Ginger' },
    'andhra-commercial': { gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)', icon: 'agriculture', label: 'Areca · Jackfruit · Pineapple' },
    'maharashtra-balanced': { gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)', icon: 'forest', label: 'Coconut · Mango · Turmeric' },
    'coconut-cocoa-premium': { gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)', icon: 'emoji_nature', label: 'Coconut · Cocoa · Cardamom' }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPresets();
    if (window.initializeVisualizer) {
        window.initializeVisualizer();
    }
});

async function loadPresets() {
    console.log("Connecting to backend for presets...");
    let combinedPresets = window.presetModels || [];

    try {
        const backendPresets = await window.backendAPI.getPresets();
        if (backendPresets && backendPresets.length > 0) {
            console.log("Loaded presets from backend");
            const backendIds = new Set(backendPresets.map(p => p.id));
            combinedPresets = [
                ...backendPresets,
                ...(window.presetModels || []).filter(p => !backendIds.has(p.id))
            ];
        }
    } catch (error) {
        console.warn("Falling back to local presets:", error);
    }

    if (combinedPresets.length > 0) {
        renderPresets(combinedPresets);
        window.presetModels = combinedPresets;
    } else {
        console.error("No presets available");
        modelsGrid.innerHTML = '<p>Failed to load preset models.</p>';
    }
}

function renderPresets(presets) {
    const presetModels = presets.filter(p => !p.isCustom);

    modelsGrid.innerHTML = presetModels.map(preset => {
        const visual = modelVisuals[preset.id] || { gradient: `linear-gradient(135deg, ${preset.color}88 0%, ${preset.color} 100%)`, icon: 'eco', label: '' };
        return `
        <div class="model-card" onclick="selectPreset('${preset.id}')" style="border-left: 4px solid ${preset.color}; --model-color: ${preset.color};">
            <div class="model-image" style="background: ${visual.gradient}; display: flex; align-items: center; justify-content: center; height: 140px; position: relative; overflow: hidden;">
                <span class="material-icons" style="font-size: 4rem; color: rgba(255,255,255,0.3); position: absolute; right: 12px; bottom: 8px;">${visual.icon}</span>
                <div style="position: relative; z-index: 1; text-align: center; color: white;">
                    <span class="material-icons" style="font-size: 2.5rem; margin-bottom: 0.25rem; display: block;">${visual.icon}</span>
                    <span style="font-size: 0.75rem; font-weight: 600; opacity: 0.9; letter-spacing: 0.5px;">${visual.label}</span>
                </div>
            </div>
            <div class="model-content">
                <h3 class="model-title">${preset.name}</h3>
                <p class="model-desc">${preset.description}</p>
                <div style="margin: 1rem 0; padding: 0.75rem; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-muted);"><span class="material-icons" style="font-size: 14px; vertical-align: text-bottom; margin-right: 2px;">location_on</span> Region:</span>
                        <span style="font-weight: 600; color: var(--text-main);">${preset.region}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-muted);"><span class="material-icons" style="font-size: 14px; vertical-align: text-bottom; margin-right: 2px;">speed</span> Difficulty:</span>
                        <span style="font-weight: 600; color: var(--text-main);">${preset.difficulty}</span>
                    </div>
                    ${preset.acres ? `
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                        <span style="color: var(--text-muted);"><span class="material-icons" style="font-size: 14px; vertical-align: text-bottom; margin-right: 2px;">straighten</span> Acres:</span>
                        <span style="font-weight: 600; color: var(--text-main);">${preset.acres}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="model-stats">
                    <div class="model-stat">
                        <span class="stat-micro-label">Yield</span>
                        <span class="stat-micro-val">${preset.estimatedYield}</span>
                    </div>
                    <div class="model-stat">
                        <span class="stat-micro-label">Revenue</span>
                        <span class="stat-micro-val">${preset.estimatedRevenue}</span>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');

    window.presets = presets;
}

function selectPreset(presetId) {
    const preset = window.presetModels?.find(p => p.id === presetId);

    if (preset && preset.isCustom) {
        window.location.href = 'strata.html?mode=custom';
        return;
    }

    if (window.modelDetails) {
        window.modelDetails.show(presetId);
    } else if (window.applyPresetModel) {
        window.applyPresetModel(presetId);
    }
}
