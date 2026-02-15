// Consolidated Utilities - Slider, Soil Data, and Helper Functions

// ========== SLIDER UTILITIES ==========
function updateAcresSlider(value) {
    document.getElementById('acres-value').textContent = value;
    const slider = document.getElementById('acre-slider');
    if (slider) {
        const percent = ((value - 0.5) / (10 - 0.5)) * 100;
        slider.style.setProperty('--slider-percent', `${percent}%`);
    }
    selectAcres(parseFloat(value));
}

function selectAcres(value) {
    window.currentAcres = value;
    const currentAcresEl = document.getElementById('current-acres');
    if (currentAcresEl) currentAcresEl.textContent = value;
    if (window.calculatePlants) window.calculatePlants();
    if (window.updateModelStats) window.updateModelStats();
}

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('acre-slider');
    if (slider) updateAcresSlider(slider.value);
});

// ========== SOIL DATA ==========
const indianSoilTypes = {
    'alluvial': {
        name: 'Alluvial Soil', icon: '🌾', color: '#8b7355',
        description: 'Most fertile soil found in river plains and deltas. Rich in nutrients, excellent water retention.',
        regions: ['Punjab', 'UP', 'Bihar', 'West Bengal', 'Coastal areas'],
        ph: '6.0-8.0',
        characteristics: ['High fertility', 'Good drainage', 'Rich in potash', 'Suitable for most crops'],
        bestFor: 'Rice, Wheat, Sugarcane, Cotton, Oilseeds'
    },
    'black': {
        name: 'Black Soil (Regur)', icon: '⚫', color: '#2d2d2d',
        description: 'Cotton-growing soil with excellent moisture retention. Rich in calcium, magnesium, and iron.',
        regions: ['Maharashtra', 'Gujarat', 'Madhya Pradesh', 'Karnataka', 'Andhra Pradesh'],
        ph: '7.2-8.5',
        characteristics: ['High clay content', 'Moisture retentive', 'Self-ploughing', 'Rich in lime'],
        bestFor: 'Cotton, Sorghum, Wheat, Pulses, Oilseeds'
    },
    'red': {
        name: 'Red Soil', icon: '🔴', color: '#cd5c5c',
        description: 'Lateritic soil rich in iron oxide. Moderate fertility, found in areas with good rainfall.',
        regions: ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Odisha', 'Jharkhand'],
        ph: '5.5-7.0',
        characteristics: ['Iron-rich', 'Porous', 'Moderate fertility', 'Good for root crops'],
        bestFor: 'Groundnut, Millets, Tobacco, Pulses, Potatoes'
    },
    'laterite': {
        name: 'Laterite Soil', icon: '🟠', color: '#ff6347',
        description: 'Acidic soil formed in high rainfall areas. Low fertility but good for plantation crops.',
        regions: ['Kerala', 'Karnataka', 'Tamil Nadu', 'Assam', 'Western Ghats'],
        ph: '4.5-6.5',
        characteristics: ['Acidic', 'Low nutrients', 'Good drainage', 'High aluminum/iron'],
        bestFor: 'Cashew, Tea, Coffee, Rubber, Coconut'
    },
    'desert': {
        name: 'Desert Soil (Arid)', icon: '<span class="material-icons md-18">landscape</span>', color: '#deb887',
        description: 'Sandy soil with low organic content. Found in arid regions with minimal rainfall.',
        regions: ['Rajasthan', 'Gujarat', 'Haryana', 'Punjab (parts)'],
        ph: '7.0-8.5',
        characteristics: ['Sandy texture', 'Low moisture', 'High salinity', 'Poor in nitrogen'],
        bestFor: 'Bajra, Pulses, Jowar, with irrigation: Wheat, Cotton'
    },
    'mountain': {
        name: 'Mountain Soil', icon: '<span class="material-icons md-18">terrain</span>', color: '#8b8b7a',
        description: 'Forest soil with high organic content. Varies by altitude and vegetation.',
        regions: ['Himachal Pradesh', 'Uttarakhand', 'J&K', 'Northeast states'],
        ph: '5.0-7.0',
        characteristics: ['Rich in humus', 'Acidic to neutral', 'Varies by altitude', 'Forest cover'],
        bestFor: 'Fruits, Tea, Spices, Wheat, Maize'
    },
    'saline': {
        name: 'Saline/Alkaline Soil', icon: '🧂', color: '#e0e0e0',
        description: 'High salt content soil. Requires special treatment and salt-tolerant crops.',
        regions: ['Gujarat coast', 'Sundarbans', 'Rajasthan (parts)', 'Haryana'],
        ph: '8.5-10.0',
        characteristics: ['High salinity', 'Poor drainage', 'Alkaline', 'Low productivity'],
        bestFor: 'Barley, Mustard, Palmarosa (with reclamation)'
    }
};

const soilCropCompatibility = {
    'alluvial': {
        overstory: ['Coconut Palm', 'Areca Nut', 'Mango', 'Silver Oak', 'Mahogany', 'Teak'],
        middle: ['Banana', 'Papaya', 'Mango', 'Jackfruit', 'Guava'],
        understory: ['Ginger', 'Turmeric', 'Cardamom', 'Pineapple', 'Galangal'],
        vertical: ['Black Pepper', 'Vanilla', 'Betel Leaf', 'Passion Fruit'],
        notes: 'Excellent for diverse multi-tier systems. Most crops thrive in alluvial soil.'
    },
    'black': {
        overstory: ['Areca Nut', 'Teak', 'Mango', 'Silver Oak'],
        middle: ['Banana', 'Papaya', 'Guava', 'Jackfruit', 'Mango'],
        understory: ['Turmeric', 'Ginger', 'Pineapple'],
        vertical: ['Black Pepper', 'Passion Fruit'],
        notes: 'Good moisture retention supports fruit trees. Avoid crops sensitive to alkalinity.'
    },
    'red': {
        overstory: ['Coconut Palm', 'Areca Nut', 'Cashew', 'Mango'],
        middle: ['Banana', 'Papaya', 'Guava'],
        understory: ['Ginger', 'Turmeric', 'Cardamom', 'Pineapple'],
        vertical: ['Black Pepper', 'Vanilla', 'Passion Fruit', 'Betel Leaf'],
        notes: 'Good for root and spice crops. Add organic matter for better results.'
    },
    'laterite': {
        overstory: ['Coconut Palm', 'Areca Nut', 'Cashew', 'Rubber', 'Silver Oak'],
        middle: ['Banana', 'Papaya'],
        understory: ['Cardamom', 'Ginger', 'Turmeric', 'Pineapple'],
        vertical: ['Black Pepper', 'Vanilla', 'Betel Leaf'],
        notes: 'Ideal for plantation crops. Regular fertilization needed due to low fertility.'
    },
    'desert': {
        overstory: ['Date Palm', 'Acacia'],
        middle: ['Pomegranate', 'Ber'],
        understory: ['Aloe Vera'],
        vertical: [],
        notes: 'Very limited options. Requires irrigation and soil amendments.'
    },
    'mountain': {
        overstory: ['Oak', 'Pine', 'Apple', 'Walnut'],
        middle: ['Apple', 'Pear', 'Plum', 'Apricot'],
        understory: ['Ginger', 'Turmeric', 'Cardamom'],
        vertical: ['Kiwi', 'Grapes'],
        notes: 'Temperate crops preferred. Altitude and climate are key factors.'
    },
    'saline': {
        overstory: ['Date Palm', 'Casuarina'],
        middle: ['Pomegranate', 'Guava (salt-tolerant varieties)'],
        understory: ['Asparagus', 'Kochia'],
        vertical: [],
        notes: 'Limited crop selection. Soil reclamation recommended before multi-tier farming.'
    }
};

function getCompatibleCrops(soilType, tier) {
    if (!soilCropCompatibility[soilType]) return [];
    return soilCropCompatibility[soilType][tier] || [];
}

function isCropCompatibleWithSoil(cropName, soilType, tier) {
    return getCompatibleCrops(soilType, tier).includes(cropName);
}

function getSoilBasedAIAdvice(soilType) {
    const soil = indianSoilTypes[soilType];
    if (!soil) return '';
    let advice = `<strong>${soil.icon} ${soil.name}</strong><br><br>${soil.description}<br><br><strong>Characteristics:</strong><br>`;
    advice += soil.characteristics.map(c => `• ${c}`).join('<br>');
    advice += `<br><br><strong>pH Range:</strong> ${soil.ph}`;
    advice += `<br><strong>Best suited for:</strong> ${soil.bestFor}`;
    advice += `<br><br><strong>💡 Tip:</strong> ${soilCropCompatibility[soilType].notes}`;
    return advice;
}

function getCropEmoji(crop) {
    const emojis = {
        'Coconut Palm': '🥥', 'Areca Nut': '🌴', 'Teak': '🪵', 'Mahogany': '🌳', 'Silver Oak': '🌲',
        'Mango': '🥭', 'Banana': '🍌', 'Papaya': '🍈', 'Jackfruit': '🥭', 'Guava': '🍏',
        'Ginger': '🫚', 'Turmeric': '🟡', 'Cardamom': '🌱', 'Pineapple': '🍍', 'Galangal': '🌿',
        'Black Pepper': '⚫', 'Vanilla': '🌼', 'Betel Leaf': '🍃', 'Passion Fruit': '💜'
    };
    return emojis[crop] || '🌱';
}

// Export to window
if (typeof window !== 'undefined') {
    window.indianSoilTypes = indianSoilTypes;
    window.soilCropCompatibility = soilCropCompatibility;
    window.getCompatibleCrops = getCompatibleCrops;
    window.isCropCompatibleWithSoil = isCropCompatibleWithSoil;
    window.getSoilBasedAIAdvice = getSoilBasedAIAdvice;
    window.getCropEmoji = getCropEmoji;
    window.updateAcresSlider = updateAcresSlider;
    window.selectAcres = selectAcres;
}
