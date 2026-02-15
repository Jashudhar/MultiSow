// Strata Designer with AI Crop Advisor - Consolidated
// Handles crop designer functionality, AI recommendations, soil filtering, and visualizer

// Crop compatibility database
const cropCompatibility = {
    'Coconut Palm': {
        compatible: ['Banana', 'Papaya', 'Ginger', 'Turmeric', 'Black Pepper', 'Vanilla', 'Cardamom'],
        incompatible: [],
        notes: 'Excellent shade provider, deep roots don\'t compete with understory'
    },
    'Areca Nut': {
        compatible: ['Banana', 'Ginger', 'Turmeric', 'Black Pepper', 'Cardamom', 'Pineapple'],
        incompatible: [],
        notes: 'Creates ideal microclimate for shade-loving crops'
    },
    'Teak': {
        compatible: ['Ginger', 'Turmeric', 'Cardamom'],
        incompatible: ['Banana', 'Papaya', 'Black Pepper'],
        notes: 'Heavy feeder, competes for nutrients with fruit trees'
    },
    'Mahogany': {
        compatible: ['Ginger', 'Turmeric'],
        incompatible: ['Banana', 'Papaya', 'Mango'],
        notes: 'Dense canopy may limit fruit tree growth'
    },
    'Banana': {
        compatible: ['Coconut Palm', 'Areca Nut', 'Ginger', 'Turmeric', 'Black Pepper'],
        incompatible: ['Teak', 'Mahogany'],
        notes: 'Fast-growing, benefits from moderate overstory shade'
    },
    'Papaya': {
        compatible: ['Coconut Palm', 'Ginger', 'Turmeric'],
        incompatible: ['Teak', 'Mahogany'],
        notes: 'Needs good sunlight, works well under light canopy'
    },
    'Mango': {
        compatible: ['Coconut Palm', 'Ginger', 'Turmeric'],
        incompatible: ['Mahogany'],
        notes: 'Requires adequate sunlight for fruiting'
    },
    'Ginger': {
        compatible: ['Coconut Palm', 'Areca Nut', 'Banana', 'Papaya', 'Black Pepper', 'Teak', 'Mahogany'],
        incompatible: [],
        notes: 'Thrives in partial shade, minimal competition'
    },
    'Turmeric': {
        compatible: ['Coconut Palm', 'Areca Nut', 'Banana', 'Papaya', 'Black Pepper', 'Teak', 'Mahogany'],
        incompatible: [],
        notes: 'Shade-loving, excellent ground cover'
    },
    'Black Pepper': {
        compatible: ['Coconut Palm', 'Areca Nut', 'Banana', 'Ginger', 'Turmeric'],
        incompatible: ['Teak'],
        notes: 'Needs living support, pairs well with palms'
    },
    'Vanilla': {
        compatible: ['Coconut Palm', 'Areca Nut'],
        incompatible: [],
        notes: 'Premium crop, requires careful management'
    }
};

// Yield predictions (quintals per acre per year)
const yieldData = {
    'Coconut Palm': 40, 'Areca Nut': 15, 'Banana': 25, 'Papaya': 20, 'Mango': 18,
    'Ginger': 35, 'Turmeric': 30, 'Black Pepper': 8, 'Vanilla': 5, 'Cardamom': 12, 'Pineapple': 22
};

let currentSoil = 'alluvial';
let visualizer = null;

// Calculate plants based on spacing and current acres
function calculatePlants() {
    const acreToSqM = 4046.86;
    const acres = window.currentAcres || 2;

    const overSpacing = parseFloat(document.getElementById('overstory-spacing')?.value) || 8;
    const overCount = Math.floor((acreToSqM * acres) / (overSpacing * overSpacing));
    const overCountEl = document.getElementById('overstory-count');
    if (overCountEl) overCountEl.value = overCount;

    const midSpacing = parseFloat(document.getElementById('middle-spacing')?.value) || 3;
    const midCount = Math.floor((acreToSqM * acres) / (midSpacing * midSpacing));
    const midCountEl = document.getElementById('middle-count');
    if (midCountEl) midCountEl.value = midCount;

    const underSpacing = parseFloat(document.getElementById('understory-spacing')?.value) || 30;
    const underSpacingM = underSpacing / 100;
    const underCount = Math.floor((acreToSqM * acres) / (underSpacingM * underSpacingM));
    const underCountEl = document.getElementById('understory-count');
    if (underCountEl) underCountEl.value = underCount;

    const vertPerTree = parseFloat(document.getElementById('vertical-spacing')?.value) || 2;
    const vertCount = overCount * vertPerTree;
    const vertCountEl = document.getElementById('vertical-count');
    if (vertCountEl) vertCountEl.value = vertCount;

    updateModelStats();
}

// Check crop compatibility
function checkCompatibility() {
    const overstory = document.getElementById('overstory-crop')?.value;
    const middle = document.getElementById('middle-crop')?.value;
    const understory = document.getElementById('understory-crop')?.value;
    const vertical = document.getElementById('vertical-crop')?.value;

    const alertBox = document.getElementById('compatibility-alert');
    const message = document.getElementById('compatibility-message');

    if (!alertBox || !message) return;
    if (!overstory || !middle || !understory) {
        alertBox.style.display = 'none';
        return;
    }

    let incompatibilities = [];
    if (cropCompatibility[overstory]) {
        if (middle && cropCompatibility[overstory].incompatible.includes(middle)) {
            incompatibilities.push(`${overstory} is not compatible with ${middle}`);
        }
        if (understory && cropCompatibility[overstory].incompatible.includes(understory)) {
            incompatibilities.push(`${overstory} is not compatible with ${understory}`);
        }
        if (vertical && cropCompatibility[overstory].incompatible.includes(vertical)) {
            incompatibilities.push(`${overstory} is not compatible with ${vertical}`);
        }
    }

    if (incompatibilities.length > 0) {
        alertBox.style.display = 'block';
        message.textContent = incompatibilities.join('. ') + '. Consider choosing alternative crops for better synergy.';
    } else {
        alertBox.style.display = 'none';
    }

    updateModelStats();
}

// Detailed crop knowledge database for AI advice
const cropKnowledge = {
    'Coconut Palm': {
        marketPrice: '₹25-35/nut', annualRevenue: '₹40,000-60,000/acre',
        waterNeed: '40-50L/day/tree', growthPeriod: '5-7 years to bearing',
        idealPH: '5.5-8.0', lightNeed: 'Full sun (100%)',
        rootDepth: 'Deep (3-5m)', canopyDensity: 'Medium (40-50% shade)',
        bestCompanions: ['Banana', 'Black Pepper', 'Ginger', 'Turmeric'],
        fertilizer: 'IFFCO NPK 14:14:14 (500g/palm, quarterly) + IFFCO Sagarika seaweed extract',
        spacing: { min: 7.5, max: 10, optimal: 8, unit: 'm' },
        keyTip: 'Start intercropping from Year 2. Coconut reaches full production by Year 8-10.'
    },
    'Areca Nut': {
        marketPrice: '₹400-500/kg', annualRevenue: '₹45,000-75,000/acre',
        waterNeed: '15-25L/day/palm', growthPeriod: '6-8 years to bearing',
        idealPH: '5.0-6.5', lightNeed: 'Full sun (90-100%)',
        rootDepth: 'Medium (2-3m)', canopyDensity: 'Dense (55-65% shade)',
        bestCompanions: ['Banana', 'Cardamom', 'Black Pepper', 'Ginger'],
        fertilizer: 'RCF Suphala 10:26:26 (200g/palm, 3x/year) + Neem cake for pest control',
        spacing: { min: 2.5, max: 3, optimal: 2.7, unit: 'm' },
        keyTip: 'Dense canopy makes it ideal for shade-loving crops like Cardamom underneath.'
    },
    'Teak': {
        marketPrice: '₹2,000-3,500/cu.ft (timber)', annualRevenue: '₹25,000-40,000/acre (long-term)',
        waterNeed: '10-15L/day/tree', growthPeriod: '15-25 years for timber',
        idealPH: '6.0-8.0', lightNeed: 'Full sun (100%)',
        rootDepth: 'Deep (4-6m)', canopyDensity: 'Very Dense (70-80% shade)',
        bestCompanions: ['Ginger', 'Turmeric', 'Cardamom'],
        fertilizer: 'IFFCO Urea (300g/tree, annually) + FYM for organic matter',
        spacing: { min: 3, max: 5, optimal: 4, unit: 'm' },
        keyTip: 'Heavy canopy limits middle-tier options. Best combined with shade-tolerant understory only.'
    },
    'Mahogany': {
        marketPrice: '₹3,000-5,000/cu.ft (timber)', annualRevenue: '₹30,000-50,000/acre (long-term)',
        waterNeed: '10-20L/day/tree', growthPeriod: '20-30 years for timber',
        idealPH: '6.0-7.5', lightNeed: 'Full sun (100%)',
        rootDepth: 'Very Deep (5-8m)', canopyDensity: 'Very Dense (75-85% shade)',
        bestCompanions: ['Ginger', 'Turmeric'],
        fertilizer: 'FYM (20kg/tree/year) + Bone meal for phosphorus',
        spacing: { min: 4, max: 6, optimal: 5, unit: 'm' },
        keyTip: 'Extremely dense canopy and deep roots. Only shade-tolerant rhizome crops suitable underneath.'
    },
    'Banana': {
        marketPrice: '₹10-25/kg', annualRevenue: '₹60,000-1,00,000/acre',
        waterNeed: '15-20L/day/plant', growthPeriod: '9-12 months to first harvest',
        idealPH: '5.5-7.0', lightNeed: 'Partial shade OK (60-80%)',
        rootDepth: 'Shallow (0.5-1m)', canopyDensity: 'Light (20-30% shade)',
        bestCompanions: ['Coconut Palm', 'Areca Nut', 'Ginger', 'Black Pepper'],
        fertilizer: 'IFFCO Urea (200g/plant monthly) + MOP (300g at bunching)',
        spacing: { min: 2.5, max: 3.5, optimal: 3, unit: 'm' },
        keyTip: 'Fast returns within 10-12 months. Ratoon crops give 2-3 more harvests without replanting.'
    },
    'Papaya': {
        marketPrice: '₹15-30/kg', annualRevenue: '₹80,000-1,20,000/acre',
        waterNeed: '8-12L/day/plant', growthPeriod: '8-10 months to first harvest',
        idealPH: '6.0-7.0', lightNeed: 'Needs good light (70-90%)',
        rootDepth: 'Shallow (0.5-1m)', canopyDensity: 'Very Light (10-15% shade)',
        bestCompanions: ['Coconut Palm', 'Ginger', 'Turmeric'],
        fertilizer: 'Coromandel NPK 00:52:34 (100g/plant at fruiting) + DAP (200g/pit at planting)',
        spacing: { min: 2, max: 3, optimal: 2.5, unit: 'm' },
        keyTip: 'Sensitive to waterlogging. Raised beds recommended. Short lifespan (3-4 years) but very high revenue.'
    },
    'Mango': {
        marketPrice: '₹30-80/kg (variety-dependent)', annualRevenue: '₹50,000-1,50,000/acre',
        waterNeed: '20-30L/day/tree (summer)', growthPeriod: '4-6 years to bearing',
        idealPH: '5.5-7.5', lightNeed: 'Full sun preferred (80-100%)',
        rootDepth: 'Deep (3-5m)', canopyDensity: 'Dense (60-70% shade at maturity)',
        bestCompanions: ['Coconut Palm', 'Ginger', 'Turmeric', 'Betel Leaf'],
        fertilizer: 'Coromandel NPK 13:00:45 (1.5kg/tree) + RCF Microla Zinc spray for fruiting',
        spacing: { min: 8, max: 10, optimal: 9, unit: 'm' },
        keyTip: 'Income seasonal (Apr-Jul). Combine with year-round crops. Avoid Mahogany nearby — competition for nutrients.'
    },
    'Ginger': {
        marketPrice: '₹40-120/kg (dry: ₹150-300/kg)', annualRevenue: '₹1,00,000-2,50,000/acre',
        waterNeed: '5-8L/day/sq.m', growthPeriod: '8-9 months (plant May, harvest Jan-Feb)',
        idealPH: '5.5-6.5', lightNeed: 'Partial shade ideal (40-60%)',
        rootDepth: 'Very Shallow (15-30cm)', canopyDensity: 'None (ground cover)',
        bestCompanions: ['Coconut Palm', 'Areca Nut', 'Banana', 'Black Pepper'],
        fertilizer: 'IFFCO Urea (30kg/ha at 30 DAP) + RCF Suphala 10:26:26 (60kg/ha at 60 DAP) + Neem Cake basal',
        spacing: { min: 20, max: 30, optimal: 25, unit: 'cm' },
        keyTip: 'Highest revenue understory crop. Needs 40-60% shade — perfect under Coconut or Areca. Mulch with dry leaves.'
    },
    'Turmeric': {
        marketPrice: '₹60-150/kg (dry: ₹100-250/kg)', annualRevenue: '₹80,000-2,00,000/acre',
        waterNeed: '4-6L/day/sq.m', growthPeriod: '7-9 months (plant May-Jun, harvest Jan-Mar)',
        idealPH: '5.0-7.5', lightNeed: 'Partial shade ideal (40-60%)',
        rootDepth: 'Very Shallow (20-40cm)', canopyDensity: 'None (ground cover)',
        bestCompanions: ['Coconut Palm', 'Areca Nut', 'Banana', 'Black Pepper'],
        fertilizer: 'IFFCO Complex 17:17:17 (50kg/ha at 60 DAP) + FYM (30 tonnes/ha basal)',
        spacing: { min: 15, max: 25, optimal: 20, unit: 'cm' },
        keyTip: 'Turmeric adds curcumin value. Consider Lakadong variety (7-12% curcumin) for premium markets.'
    },
    'Black Pepper': {
        marketPrice: '₹400-700/kg', annualRevenue: '₹50,000-1,00,000/acre',
        waterNeed: '2-3L/day/vine', growthPeriod: '3-4 years to first harvest',
        idealPH: '5.5-6.5', lightNeed: 'Partial shade (50-60%)',
        rootDepth: 'Shallow (0.5-1m)', canopyDensity: 'None (climber)',
        bestCompanions: ['Coconut Palm', 'Areca Nut', 'Banana', 'Ginger'],
        fertilizer: 'RCF Suphala 10:26:26 (200g/vine, post-monsoon) + Coromandel NPK 13:00:45 (pre-flowering)',
        spacing: { min: 2, max: 3, optimal: 2, unit: 'vines/tree' },
        keyTip: 'India\'s "Black Gold". Grows on living supports (Coconut/Areca trunks). Very high value per kg.'
    },
    'Vanilla': {
        marketPrice: '₹25,000-45,000/kg (cured)', annualRevenue: '₹2,00,000-5,00,000/acre',
        waterNeed: '2-3L/day/vine', growthPeriod: '3-4 years to first flowering',
        idealPH: '6.0-7.0', lightNeed: 'Filtered shade (50-70%)',
        rootDepth: 'Very Shallow (epiphytic)', canopyDensity: 'None (climber)',
        bestCompanions: ['Coconut Palm', 'Areca Nut', 'Silver Oak'],
        fertilizer: 'Vermicompost (3kg/vine) + Multiplex Boron spray (2g/L at flowering)',
        spacing: { min: 1, max: 2, optimal: 1, unit: 'vines/tree' },
        keyTip: 'World\'s most expensive spice after Saffron. Requires hand-pollination. High expertise but exceptional revenue.'
    },
    'Cardamom': {
        marketPrice: '₹1,200-2,500/kg', annualRevenue: '₹1,00,000-3,00,000/acre',
        waterNeed: '3-5L/day/sq.m', growthPeriod: '2-3 years to bearing',
        idealPH: '5.0-6.5', lightNeed: 'Heavy shade required (60-70%)',
        rootDepth: 'Shallow (30-50cm)', canopyDensity: 'None (ground level)',
        bestCompanions: ['Areca Nut', 'Silver Oak', 'Coconut Palm'],
        fertilizer: 'IFFCO Complex 17:17:17 (40kg/ha at 45 DAP) + IFFCO Sagarika micronutrient spray',
        spacing: { min: 50, max: 70, optimal: 60, unit: 'cm' },
        keyTip: '"Queen of Spices". Needs 60-70% shade — Areca Nut provides the perfect canopy density.'
    },
    'Pineapple': {
        marketPrice: '₹15-40/kg', annualRevenue: '₹70,000-1,50,000/acre',
        waterNeed: '3-5L/day/sq.m', growthPeriod: '15-18 months to first fruit',
        idealPH: '5.0-6.5', lightNeed: 'Partial sun OK (50-80%)',
        rootDepth: 'Very Shallow (15-30cm)', canopyDensity: 'None (ground level)',
        bestCompanions: ['Coconut Palm', 'Areca Nut'],
        fertilizer: 'IFFCO Urea (65kg/ha at 2 months) + Paradeep SSP (500kg/ha basal)',
        spacing: { min: 25, max: 40, optimal: 30, unit: 'cm' },
        keyTip: 'Excellent ground cover. Tolerates acidic soil well. Can be planted at high density for maximum land use.'
    },
    'Guava': {
        marketPrice: '₹20-60/kg', annualRevenue: '₹60,000-1,20,000/acre',
        waterNeed: '15-25L/day/tree', growthPeriod: '2-3 years to bearing',
        idealPH: '6.0-7.5', lightNeed: 'Good light needed (70-90%)',
        rootDepth: 'Medium (1-2m)', canopyDensity: 'Medium (30-40% shade)',
        bestCompanions: ['Coconut Palm', 'Ginger', 'Turmeric'],
        fertilizer: 'RCF Suphala 10:26:26 (200g/tree quarterly) + FYM (15kg/tree post-harvest)',
        spacing: { min: 3, max: 5, optimal: 4, unit: 'm' },
        keyTip: 'Hardy fruit tree. Produces fruits twice a year (monsoon + winter). Excellent ROI for small farms.'
    },
    'Jackfruit': {
        marketPrice: '₹20-50/kg (raw: ₹30-80/kg)', annualRevenue: '₹40,000-80,000/acre',
        waterNeed: '20-40L/day/tree', growthPeriod: '4-6 years to bearing',
        idealPH: '6.0-7.5', lightNeed: 'Partial shade OK (60-80%)',
        rootDepth: 'Deep (3-5m)', canopyDensity: 'Dense (60-70% shade)',
        bestCompanions: ['Areca Nut', 'Pineapple', 'Ginger'],
        fertilizer: 'IFFCO DAP (1kg/tree) + MOP (500g/tree) at bearing stage',
        spacing: { min: 3, max: 4, optimal: 3.5, unit: 'm' },
        keyTip: 'World\'s largest tree fruit. Growing demand for raw jackfruit as meat substitute. Long productive life (80+ yrs).'
    },
    'Betel Leaf': {
        marketPrice: '₹100-300/100 leaves', annualRevenue: '₹80,000-2,00,000/acre',
        waterNeed: '3-5L/day/vine', growthPeriod: '6-8 months to first harvest',
        idealPH: '5.5-7.0', lightNeed: 'Heavy shade (60-80%)',
        rootDepth: 'Very Shallow (epiphytic)', canopyDensity: 'None (climber)',
        bestCompanions: ['Mango', 'Coconut Palm', 'Areca Nut'],
        fertilizer: 'IFFCO Urea (25g/vine monthly) + IFFCO NPK 19:19:19 (30g/vine quarterly)',
        spacing: { min: 1, max: 2, optimal: 2, unit: 'vines/tree' },
        keyTip: 'Continuous harvest (every 15 days). Very labor-intensive but consistent daily income.'
    },
    'Passion Fruit': {
        marketPrice: '₹60-150/kg', annualRevenue: '₹1,00,000-2,50,000/acre',
        waterNeed: '4-6L/day/vine', growthPeriod: '12-18 months to bearing',
        idealPH: '6.0-7.0', lightNeed: 'Good light needed (70-90%)',
        rootDepth: 'Medium (1-2m)', canopyDensity: 'Light (15-25% on trellis)',
        bestCompanions: ['Areca Nut', 'Coconut Palm'],
        fertilizer: 'IFFCO NPK 19:19:19 (100g/vine monthly) + Coromandel MKP 00:52:34 at flowering',
        spacing: { min: 2, max: 3, optimal: 3, unit: 'vines/support' },
        keyTip: 'Trellis system needed. Excellent for juice & pulp market. Growing demand in urban India.'
    },
    'Silver Oak': {
        marketPrice: '₹500-1,000/cu.ft (timber)', annualRevenue: '₹15,000-30,000/acre (shade value)',
        waterNeed: '10-15L/day/tree', growthPeriod: '10-15 years for timber',
        idealPH: '5.5-7.0', lightNeed: 'Full sun (100%)',
        rootDepth: 'Deep (3-5m)', canopyDensity: 'Medium-Light (35-45% filtered shade)',
        bestCompanions: ['Cardamom', 'Vanilla', 'Black Pepper'],
        fertilizer: 'IFFCO NPK 19:19:19 (200g/tree quarterly) + Green leaf manure mulch',
        spacing: { min: 8, max: 12, optimal: 10, unit: 'm' },
        keyTip: 'Premium shade tree for spice gardens. Filtered shade ideal for Vanilla and Cardamom cultivation.'
    }
};

// Get AI advice for specific tier — dynamic, detailed analysis
function getAIAdvice(tier) {
    const chatContainer = document.getElementById('ai-chat-container');
    if (!chatContainer) return;

    const tierNames = { overstory: 'Overstory', middle: 'Middle Tier', understory: 'Understory', vertical: 'Vertical Layer' };
    addMessage('user', `Advise me on the ${tierNames[tier]}`);

    setTimeout(() => {
        const currentCrop = document.getElementById(`${tier}-crop`)?.value;
        const overstory = document.getElementById('overstory-crop')?.value;
        const middle = document.getElementById('middle-crop')?.value;
        const understory = document.getElementById('understory-crop')?.value;
        const vertical = document.getElementById('vertical-crop')?.value;
        const acres = window.currentAcres || 2;
        const soil = window.indianSoilTypes?.[currentSoil];
        const soilName = soil?.name || 'your soil';
        const soilPH = soil?.ph || '6.0-7.0';
        const mi = (icon) => `<span class="material-icons md-18" style="vertical-align: text-bottom;">${icon}</span>`;

        let advice = '';

        if (!currentCrop) {
            // No crop selected — give detailed recommendation based on context
            const compatible = window.soilCropCompatibility?.[currentSoil]?.[tier] || [];
            if (compatible.length === 0) {
                advice = `${mi('warning')} <strong>${soilName}</strong> (pH ${soilPH}) has limited options for the ${tierNames[tier]}. Consider soil amendments to expand crop choices, or select a different soil type that better suits your available crops.`;
            } else {
                // Rank compatible crops by context
                let recommendations = [];
                compatible.forEach(crop => {
                    const info = cropKnowledge[crop];
                    if (!info) return;
                    let score = 0;
                    let reasons = [];

                    // Check compatibility with existing selections
                    const existingCrops = [overstory, middle, understory, vertical].filter(c => c && c !== crop);
                    const compData = cropCompatibility[crop];
                    const compatCount = existingCrops.filter(c => compData?.compatible?.includes(c)).length;
                    const incompatCount = existingCrops.filter(c => compData?.incompatible?.includes(c)).length;
                    score += compatCount * 20 - incompatCount * 40;
                    if (compatCount > 0) reasons.push(`compatible with ${existingCrops.filter(c => compData?.compatible?.includes(c)).join(', ')}`);
                    if (incompatCount > 0) reasons.push(`⚠ conflicts with ${existingCrops.filter(c => compData?.incompatible?.includes(c)).join(', ')}`);

                    // Check light compatibility
                    if (tier === 'understory' || tier === 'middle') {
                        const canopyCrop = cropKnowledge[overstory];
                        if (canopyCrop && info.lightNeed.includes('shade')) {
                            score += 15;
                            reasons.push('shade-tolerant under your canopy');
                        }
                    }

                    // Revenue factor
                    score += (yieldData[crop] || 0) / 5;
                    recommendations.push({ crop, score, reasons, info });
                });

                recommendations.sort((a, b) => b.score - a.score);
                const top3 = recommendations.slice(0, 3);

                advice = `${mi('lightbulb')} <strong>Top picks for ${tierNames[tier]} on ${soilName}:</strong><br><br>`;
                top3.forEach((rec, i) => {
                    const medal = ['🥇', '🥈', '🥉'][i];
                    advice += `${medal} <strong>${rec.crop}</strong> — ${rec.info.marketPrice}<br>`;
                    advice += `&nbsp;&nbsp;Revenue: ${rec.info.annualRevenue} · Yield: ${yieldData[rec.crop] || '?'} q/acre<br>`;
                    if (rec.reasons.length > 0) advice += `&nbsp;&nbsp;${rec.reasons.join(' · ')}<br>`;
                    advice += `&nbsp;&nbsp;<em>${rec.info.keyTip}</em><br><br>`;
                });

                if (tier === 'understory' && overstory) {
                    const canopyInfo = cropKnowledge[overstory];
                    if (canopyInfo) {
                        advice += `${mi('info')} <strong>Note:</strong> ${overstory} provides ${canopyInfo.canopyDensity} shade. Choose understory crops matching this light level.`;
                    }
                }
            }
        } else {
            // Crop IS selected — give detailed analysis of the specific choice
            const info = cropKnowledge[currentCrop];
            const compData = cropCompatibility[currentCrop];
            const existingCrops = { overstory, middle, understory, vertical };
            delete existingCrops[tier]; // remove self
            const otherCrops = Object.values(existingCrops).filter(c => c);

            advice = `${mi('analytics')} <strong>Analysis: ${currentCrop} as ${tierNames[tier]}</strong><br><br>`;

            if (info) {
                advice += `<strong>Market & Revenue:</strong><br>`;
                advice += `• Price: <strong>${info.marketPrice}</strong><br>`;
                advice += `• Annual revenue potential: <strong>${info.annualRevenue}</strong> on ${acres} acres<br>`;
                advice += `• Growth period: ${info.growthPeriod}<br><br>`;

                advice += `<strong>Growing Requirements:</strong><br>`;
                advice += `• Light: ${info.lightNeed}<br>`;
                advice += `• Water: ${info.waterNeed}<br>`;
                advice += `• pH range: ${info.idealPH} (${soilName}: pH ${soilPH})<br>`;
                advice += `• Root depth: ${info.rootDepth}<br><br>`;

                // Compatibility analysis with other selected crops
                if (otherCrops.length > 0) {
                    advice += `<strong>Compatibility with your selections:</strong><br>`;
                    otherCrops.forEach(other => {
                        const isCompat = compData?.compatible?.includes(other);
                        const isIncompat = compData?.incompatible?.includes(other);
                        if (isIncompat) {
                            advice += `${mi('cancel')} <span style="color:#dc2626"><strong>${other}</strong> — INCOMPATIBLE</span>`;
                            // Give reason
                            const otherInfo = cropKnowledge[other];
                            if (otherInfo && info) {
                                if (info.rootDepth.includes('Deep') && otherInfo.rootDepth.includes('Deep')) {
                                    advice += ` — both have deep roots, will compete for nutrients`;
                                } else if (info.canopyDensity.includes('Dense') && otherInfo.lightNeed.includes('sun')) {
                                    advice += ` — canopy too dense for ${other}'s light needs`;
                                } else {
                                    advice += ` — nutrient competition or allelopathic effects`;
                                }
                            }
                            advice += `<br>`;
                        } else if (isCompat) {
                            advice += `${mi('check_circle')} <span style="color:#16a34a"><strong>${other}</strong> — Excellent match!</span>`;
                            const otherInfo = cropKnowledge[other];
                            if (otherInfo) {
                                if (info.rootDepth !== otherInfo.rootDepth) {
                                    advice += ` — different root zones, no competition`;
                                }
                            }
                            advice += `<br>`;
                        } else {
                            advice += `${mi('help')} <strong>${other}</strong> — Neutral (no known conflicts)<br>`;
                        }
                    });
                    advice += `<br>`;
                }

                advice += `<strong>Fertilizer (India):</strong><br>`;
                advice += `• ${info.fertilizer}<br><br>`;

                advice += `${mi('tips_and_updates')} <strong>Expert Tip:</strong> ${info.keyTip}`;
            } else {
                // Fallback for crops not in knowledge database
                if (compData) {
                    advice += `Compatible with: ${compData.compatible.join(', ')}<br>`;
                    if (compData.incompatible.length > 0) {
                        advice += `${mi('warning')} Avoid with: ${compData.incompatible.join(', ')}<br>`;
                    }
                    advice += `<br>${compData.notes}`;
                } else {
                    advice += `Limited data available for ${currentCrop}. Ensure it suits ${soilName} conditions and complements your other selections.`;
                }
            }
        }

        addMessage('ai', advice);
    }, 800);
}

// Get full model analysis — comprehensive multi-section report
async function getFullAnalysis() {
    const overstory = document.getElementById('overstory-crop')?.value;
    const middle = document.getElementById('middle-crop')?.value;
    const understory = document.getElementById('understory-crop')?.value;
    const vertical = document.getElementById('vertical-crop')?.value;

    if (!overstory && !middle && !understory) {
        addMessage('ai', '<span class="material-icons md-18" style="vertical-align: text-bottom; color: #f59e0b;">warning</span> Please select at least one crop before requesting analysis.');
        return;
    }

    addMessage('user', 'Give me a complete analysis of my crop model');

    // Prepare config for backend
    const config = {
        acres: window.currentAcres || 2,
        crops: [
            { name: overstory, stratum: 'Overstory' },
            { name: middle, stratum: 'Middle' },
            { name: understory, stratum: 'Understory' },
            { name: vertical, stratum: 'Vertical' }
        ].filter(c => c.name)
    };

    try {
        if (window.backendAPI && window.backendAPI.isConnected) {
            const result = await window.backendAPI.analyzeConfig(config);
            setTimeout(() => {
                addMessage('ai', result.advice.replace(/\n/g, '<br>'));
            }, 600);
            return;
        }
    } catch (e) {
        console.warn("Backend analysis failed, using local fallback", e);
    }

    const acres = window.currentAcres || 2;
    const soil = window.indianSoilTypes?.[currentSoil];
    const soilName = soil?.name || 'Unknown';
    const mi = (icon) => `<span class="material-icons md-18" style="vertical-align: text-bottom;">${icon}</span>`;

    setTimeout(() => {
        const crops = [
            { name: overstory, tier: 'Overstory', icon: 'park' },
            { name: middle, tier: 'Middle', icon: 'nature' },
            { name: understory, tier: 'Understory', icon: 'grass' },
            { name: vertical, tier: 'Vertical', icon: 'eco' }
        ].filter(c => c.name);

        // Calculate totals
        let totalYield = 0, totalWater = 0, totalRevMin = 0, totalRevMax = 0;
        crops.forEach(c => {
            totalYield += (yieldData[c.name] || 0);
            const info = cropKnowledge[c.name];
            if (info) {
                const waterMatch = info.waterNeed.match(/(\d+)-?(\d+)?/);
                if (waterMatch) totalWater += parseInt(waterMatch[2] || waterMatch[1]);
                const revMatch = info.annualRevenue.match(/₹([\d,]+)-?([\d,]+)?/);
                if (revMatch) {
                    totalRevMin += parseInt(revMatch[1].replace(/,/g, ''));
                    totalRevMax += parseInt((revMatch[2] || revMatch[1]).replace(/,/g, ''));
                }
            }
        });

        const compScore = getCompatibilityScore();
        const filledTiers = crops.length;
        const spaceUtil = Math.min(100, Math.round((filledTiers / 4) * 85 + (compScore > 80 ? 15 : compScore > 60 ? 8 : 0)));

        let analysis = `<div style="line-height: 1.8;">`;

        // Header
        analysis += `<strong>${mi('analytics')} Comprehensive Model Analysis</strong><br>`;
        analysis += `<span style="color: var(--text-muted); font-size: 0.85rem;">${soilName} · ${acres} Acres · ${filledTiers}/4 tiers configured</span><br><br>`;

        // 1. Configuration Summary
        analysis += `<strong>${mi('layers')} Configuration:</strong><br>`;
        crops.forEach(c => {
            const info = cropKnowledge[c.name];
            analysis += `${mi(c.icon)} <strong>${c.tier}:</strong> ${c.name}`;
            if (info) analysis += ` <span style="color: var(--text-muted);">(${info.marketPrice})</span>`;
            analysis += `<br>`;
        });
        analysis += `<br>`;

        // 2. Compatibility Matrix
        analysis += `<strong>${mi('sync')} Compatibility Analysis:</strong><br>`;
        let compatIssues = [];
        let compatStrengths = [];
        for (let i = 0; i < crops.length; i++) {
            for (let j = i + 1; j < crops.length; j++) {
                const a = crops[i], b = crops[j];
                const compA = cropCompatibility[a.name];
                if (compA?.incompatible?.includes(b.name)) {
                    const infoA = cropKnowledge[a.name], infoB = cropKnowledge[b.name];
                    let reason = 'nutrient or light competition';
                    if (infoA && infoB) {
                        if (infoA.rootDepth.includes('Deep') && infoB.rootDepth.includes('Deep')) reason = 'both compete for deep root nutrients';
                        else if (infoA.canopyDensity.includes('Dense')) reason = `${a.name}'s dense canopy blocks light for ${b.name}`;
                    }
                    compatIssues.push(`${mi('cancel')} <span style="color:#dc2626">${a.name} + ${b.name}: ${reason}</span>`);
                } else if (compA?.compatible?.includes(b.name)) {
                    const infoA = cropKnowledge[a.name], infoB = cropKnowledge[b.name];
                    let reason = 'proven combination';
                    if (infoA && infoB) {
                        if (infoA.rootDepth !== infoB.rootDepth) reason = 'different root zones — no competition';
                        else if (a.tier === 'Overstory' && infoB.lightNeed.includes('shade')) reason = `${a.name}'s canopy provides ideal shade for ${b.name}`;
                    }
                    compatStrengths.push(`${mi('check_circle')} <span style="color:#16a34a">${a.name} + ${b.name}: ${reason}</span>`);
                }
            }
        }
        if (compatStrengths.length > 0) analysis += compatStrengths.join('<br>') + '<br>';
        if (compatIssues.length > 0) analysis += compatIssues.join('<br>') + '<br>';
        if (compatStrengths.length === 0 && compatIssues.length === 0) analysis += `${mi('info')} No specific compatibility data between selected crops.<br>`;
        analysis += `• Overall score: <strong>${compScore}%</strong><br><br>`;

        // 3. Light & Shade Analysis
        if (overstory) {
            const canopyInfo = cropKnowledge[overstory];
            if (canopyInfo) {
                analysis += `<strong>${mi('wb_sunny')} Light & Shade:</strong><br>`;
                analysis += `• ${overstory} canopy: ${canopyInfo.canopyDensity}<br>`;
                crops.filter(c => c.tier !== 'Overstory').forEach(c => {
                    const info = cropKnowledge[c.name];
                    if (info) {
                        const needsShade = info.lightNeed.includes('shade');
                        const needsFullSun = info.lightNeed.includes('Full sun') || info.lightNeed.includes('100%');
                        const canopyDense = canopyInfo.canopyDensity.includes('Dense') || canopyInfo.canopyDensity.includes('Very Dense');
                        if (needsShade && canopyDense) {
                            analysis += `• ${mi('check_circle')} ${c.name}: shade-loving — perfect under dense canopy<br>`;
                        } else if (needsFullSun && canopyDense) {
                            analysis += `• ${mi('warning')} ${c.name}: needs full sun but canopy is dense — may underperform<br>`;
                        } else {
                            analysis += `• ${mi('info')} ${c.name}: ${info.lightNeed} — adequate under this canopy<br>`;
                        }
                    }
                });
                analysis += `<br>`;
            }
        }

        // 4. Revenue Projection
        analysis += `<strong>${mi('payments')} Revenue Projection (${acres} acres):</strong><br>`;
        analysis += `• Combined yield: <strong>${totalYield * acres} quintals/year</strong><br>`;
        analysis += `• Revenue range: <strong>₹${(totalRevMin * acres / 100000).toFixed(1)}L - ₹${(totalRevMax * acres / 100000).toFixed(1)}L/year</strong><br>`;
        analysis += `• Space utilization: <strong>${spaceUtil}%</strong><br>`;
        if (filledTiers < 4) {
            const missing = ['Overstory', 'Middle', 'Understory', 'Vertical'].filter(t => {
                const id = t.toLowerCase().replace(' ', '-');
                return !crops.find(c => c.tier === t);
            });
            analysis += `${mi('add_circle')} Add ${missing.join(', ')} to increase utilization and revenue<br>`;
        }
        analysis += `<br>`;

        // 5. Soil-Specific Advice
        if (soil) {
            analysis += `<strong>${mi('landscape')} Soil: ${soilName} (pH ${soil.ph}):</strong><br>`;
            let phIssues = [];
            crops.forEach(c => {
                const info = cropKnowledge[c.name];
                if (info) {
                    const cropPH = info.idealPH.split('-').map(Number);
                    const soilPHVals = soil.ph.split('-').map(Number);
                    if (soilPHVals[1] < cropPH[0]) {
                        phIssues.push(`${mi('warning')} ${c.name} prefers pH ${info.idealPH} — your soil may be too acidic. Apply lime.`);
                    } else if (soilPHVals[0] > cropPH[1]) {
                        phIssues.push(`${mi('warning')} ${c.name} prefers pH ${info.idealPH} — your soil may be too alkaline. Apply gypsum.`);
                    }
                }
            });
            if (phIssues.length > 0) {
                analysis += phIssues.join('<br>') + '<br>';
            } else {
                analysis += `${mi('check_circle')} All crops are within acceptable pH range for ${soilName}.<br>`;
            }
            analysis += `<br>`;
        }

        // 6. Recommendations
        analysis += `<strong>${mi('tips_and_updates')} Recommendations:</strong><br>`;
        analysis += getRecommendations();
        analysis += `</div>`;

        addMessage('ai', analysis);
    }, 1500);
}

// Helper to add chat messages
function addMessage(type, content) {
    const chatContainer = document.getElementById('ai-chat-container');
    if (!chatContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;

    if (type === 'user') {
        messageDiv.innerHTML = `
            <div style="background: #e9f5db; padding: 0.75rem 1rem; border-radius: 12px; margin-bottom: 1rem; margin-left: 2rem; text-align: right;">
                <p style="margin: 0; color: var(--text-main); font-size: 0.9rem;">${content}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; gap: 0.75rem;">
                    <span class="material-icons" style="font-size: 1.2rem; color: var(--primary-color);">smart_toy</span>
                    <div style="flex: 1;">
                        <p style="margin: 0; color: var(--text-main); font-size: 0.9rem; line-height: 1.6;">${content}</p>
                    </div>
                </div>
            </div>
        `;
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Update model statistics
function updateModelStats() {
    const overstoryCount = parseInt(document.getElementById('overstory-count')?.value) || 0;
    const middleCount = parseInt(document.getElementById('middle-count')?.value) || 0;
    const understoryCount = parseInt(document.getElementById('understory-count')?.value) || 0;
    const verticalCount = parseInt(document.getElementById('vertical-count')?.value) || 0;

    const totalPlants = overstoryCount + middleCount + understoryCount + verticalCount;
    const totalPlantsEl = document.getElementById('total-plants');
    if (totalPlantsEl) totalPlantsEl.textContent = totalPlants.toLocaleString();

    const overstory = document.getElementById('overstory-crop')?.value;
    const middle = document.getElementById('middle-crop')?.value;
    const understory = document.getElementById('understory-crop')?.value;
    const vertical = document.getElementById('vertical-crop')?.value;

    let completeness = 0;
    if (overstory) completeness += 25;
    if (middle) completeness += 25;
    if (understory) completeness += 25;
    if (vertical) completeness += 25;

    const completenessEl = document.getElementById('completeness');
    if (completenessEl) completenessEl.textContent = completeness + '%';

    const estYieldEl = document.getElementById('est-yield');
    if (estYieldEl) {
        if (completeness === 100) {
            const totalYield = (yieldData[overstory] || 0) + (yieldData[middle] || 0) +
                (yieldData[understory] || 0) + (yieldData[vertical] || 0);
            estYieldEl.textContent = totalYield + ' quintals';
        } else {
            estYieldEl.textContent = '--';
        }
    }
}

// Get compatibility score
function getCompatibilityScore() {
    const overstory = document.getElementById('overstory-crop')?.value;
    const middle = document.getElementById('middle-crop')?.value;
    const understory = document.getElementById('understory-crop')?.value;
    const vertical = document.getElementById('vertical-crop')?.value;

    let score = 100;
    const crops = [overstory, middle, understory, vertical].filter(c => c);

    for (let i = 0; i < crops.length; i++) {
        for (let j = i + 1; j < crops.length; j++) {
            if (cropCompatibility[crops[i]]?.incompatible.includes(crops[j])) {
                score -= 20;
            }
        }
    }

    return Math.max(score, 0);
}

// Get personalized recommendations — context-aware, detailed
function getRecommendations() {
    const mi = (icon, color) => `<span class="material-icons md-18" style="vertical-align: text-bottom; color: ${color || 'inherit'};">${icon}</span>`;
    const score = getCompatibilityScore();
    const overstory = document.getElementById('overstory-crop')?.value;
    const middle = document.getElementById('middle-crop')?.value;
    const understory = document.getElementById('understory-crop')?.value;
    const vertical = document.getElementById('vertical-crop')?.value;
    const soil = window.indianSoilTypes?.[currentSoil];
    const acres = window.currentAcres || 2;

    let recs = [];

    // 1. Compatibility verdict
    if (score >= 90) {
        recs.push(`${mi('check_circle', '#16a34a')} Excellent crop compatibility (${score}%) — all tiers complement each other well`);
    } else if (score >= 70) {
        recs.push(`${mi('warning', '#f59e0b')} Moderate compatibility (${score}%) — some crops may compete for resources. Monitor growth closely and ensure adequate fertilization`);
    } else {
        recs.push(`${mi('cancel', '#dc2626')} Low compatibility (${score}%) — consider swapping crops. Check incompatible pairs listed above`);
    }

    // 2. Missing tiers — specific suggestions
    if (!vertical && overstory) {
        const vertInfo = cropKnowledge['Black Pepper'];
        recs.push(`${mi('add_circle', '#7c3aed')} Your vertical layer is empty — add <strong>Black Pepper</strong> (₹400-700/kg) or <strong>Vanilla</strong> (₹25,000-45,000/kg) to your ${overstory} trunks`);
    }
    if (!understory && overstory) {
        recs.push(`${mi('add_circle', '#059669')} No understory crop — <strong>Ginger</strong> (₹1-2.5L/acre revenue) or <strong>Turmeric</strong> thrive as ground cover under ${overstory}`);
    }
    if (!middle && overstory) {
        recs.push(`${mi('add_circle', '#d97706')} Middle tier is vacant — <strong>Banana</strong> gives rapid returns (9 months) while your overstory matures`);
    }

    // 3. Proven combination recognition
    if (overstory === 'Coconut Palm' && middle === 'Banana' && understory === 'Ginger') {
        recs.push(`${mi('emoji_events', '#ca8a04')} <strong>Classic Kerala Multi-Tier!</strong> This is a research-proven, high-revenue combination`);
    } else if (overstory === 'Coconut Palm' && middle === 'Banana') {
        recs.push(`${mi('thumb_up', '#16a34a')} Coconut + Banana is a proven Kerala staple — excellent income synergy`);
    } else if (overstory === 'Areca Nut' && understory === 'Cardamom') {
        recs.push(`${mi('emoji_events', '#ca8a04')} <strong>Karnataka Spice Garden!</strong> Areca + Cardamom is a premium, export-grade combination`);
    } else if (overstory === 'Silver Oak' && vertical === 'Vanilla') {
        recs.push(`${mi('diamond', '#7c3aed')} Silver Oak + Vanilla — ultra-premium combination. Vanilla revenue can exceed ₹5L/acre`);
    }

    // 4. Shade analysis tip
    if (overstory) {
        const canopyInfo = cropKnowledge[overstory];
        if (canopyInfo?.canopyDensity?.includes('Very Dense') && middle) {
            const middleInfo = cropKnowledge[middle];
            if (middleInfo && !middleInfo.lightNeed.includes('shade')) {
                recs.push(`${mi('wb_sunny', '#f59e0b')} ${overstory}'s dense canopy may limit ${middle}'s growth. Consider pruning lower branches or choosing shade-tolerant middle crops`);
            }
        }
    }

    // 5. Water management
    const selectedCrops = [overstory, middle, understory, vertical].filter(c => c);
    const highWaterCrops = selectedCrops.filter(c => {
        const info = cropKnowledge[c];
        const waterMatch = info?.waterNeed?.match(/(\d+)/);
        return waterMatch && parseInt(waterMatch[1]) >= 15;
    });
    if (highWaterCrops.length >= 2) {
        recs.push(`${mi('water_drop', '#0891b2')} Multiple high-water crops (${highWaterCrops.join(', ')}). Install drip irrigation to reduce water usage by 40-60%`);
    }

    // 6. Seasonal advice
    const month = new Date().getMonth();
    if (month >= 4 && month <= 6) { // May-Jul
        recs.push(`${mi('calendar_today', '#7c3aed')} Monsoon planting season! Ideal time to plant Ginger, Turmeric, and new saplings. Act within 2-3 weeks`);
    } else if (month >= 11 || month <= 1) { // Dec-Feb
        recs.push(`${mi('calendar_today', '#7c3aed')} Harvest season for Ginger/Turmeric. Plan post-harvest soil amendment with FYM and green manure`);
    } else if (month >= 2 && month <= 3) { // Mar-Apr
        recs.push(`${mi('calendar_today', '#7c3aed')} Pre-monsoon prep: clear weeds, prepare planting pits, order fertilizers (IFFCO NPK/RCF Suphala)`);
    }

    // 7. Value-add processing tip
    if (understory === 'Turmeric') {
        recs.push(`${mi('tips_and_updates', '#92400e')} Process Turmeric into powder (₹250-400/kg) for 3x the raw rhizome value. Lakadong variety commands premium prices`);
    } else if (understory === 'Ginger') {
        recs.push(`${mi('tips_and_updates', '#92400e')} Dry Ginger (Sonth) sells at ₹150-300/kg — significantly higher than fresh. Consider solar drying for small batches`);
    }

    return recs.map(r => `• ${r}`).join('<br>');
}

// Save model
function saveModel() {
    const model = {
        overstory: {
            crop: document.getElementById('overstory-crop')?.value,
            spacing: document.getElementById('overstory-spacing')?.value,
            count: document.getElementById('overstory-count')?.value
        },
        middle: {
            crop: document.getElementById('middle-crop')?.value,
            spacing: document.getElementById('middle-spacing')?.value,
            count: document.getElementById('middle-count')?.value
        },
        understory: {
            crop: document.getElementById('understory-crop')?.value,
            spacing: document.getElementById('understory-spacing')?.value,
            count: document.getElementById('understory-count')?.value
        },
        vertical: {
            crop: document.getElementById('vertical-crop')?.value,
            spacing: document.getElementById('vertical-spacing')?.value,
            count: document.getElementById('vertical-count')?.value
        },
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('savedCropModel', JSON.stringify(model));
    addMessage('ai', '<span class="material-icons md-18" style="vertical-align: text-bottom; color: #16a34a;">check_circle</span> Model saved successfully! You can access it anytime from your dashboard.');
    alert('Your crop model has been saved successfully!');
}

// Reset model
function resetModel() {
    if (confirm('Are you sure you want to reset? This will clear all selections.')) {
        ['overstory', 'middle', 'understory', 'vertical'].forEach(tier => {
            const cropEl = document.getElementById(`${tier}-crop`);
            if (cropEl) cropEl.value = '';
        });

        document.getElementById('overstory-spacing').value = '8';
        document.getElementById('middle-spacing').value = '3';
        document.getElementById('understory-spacing').value = '30';
        document.getElementById('vertical-spacing').value = '2';

        calculatePlants();
        checkCompatibility();
        addMessage('ai', '<span class="material-icons md-18" style="vertical-align: text-bottom;">refresh</span> Model reset. Start fresh with your new design!');
    }
}

// Optimize model for yield
function optimizeModel() {
    addMessage('user', 'Optimize my model for maximum yield');

    setTimeout(() => {
        document.getElementById('overstory-crop').value = 'Coconut Palm';
        document.getElementById('middle-crop').value = 'Banana';
        document.getElementById('understory-crop').value = 'Ginger';
        document.getElementById('vertical-crop').value = 'Black Pepper';

        document.getElementById('overstory-spacing').value = '8';
        document.getElementById('middle-spacing').value = '3';
        document.getElementById('understory-spacing').value = '30';
        document.getElementById('vertical-spacing').value = '2';

        calculatePlants();
        checkCompatibility();

        addMessage('ai', `<span class="material-icons md-18" style="vertical-align: text-bottom; color: #16a34a;">rocket_launch</span> <strong>Model Optimized!</strong><br><br>
            I've configured the highest-yielding combination for Kerala climate:<br><br>
            • Coconut Palm (Overstory) - 40 quintals<br>
            • Banana (Middle) - 25 quintals<br>
            • Ginger (Understory) - 35 quintals<br>
            • Black Pepper (Vertical) - 8 quintals<br><br>
            <strong>Total: 108 quintals/acre/year</strong><br>
            Est. Revenue: <strong>₹3,78,000/year</strong><br><br>
            This combination has excellent compatibility and proven track record in multi-tier farming!`);
    }, 1000);
}

// Select soil type
function selectSoil(soilType) {
    currentSoil = soilType;
    const dropdown = document.getElementById('soil-dropdown');
    if (dropdown && dropdown.value !== soilType) dropdown.value = soilType;

    const soilData = window.indianSoilTypes?.[soilType];
    const currentSoilEl = document.getElementById('current-soil');
    if (currentSoilEl && soilData) currentSoilEl.textContent = soilData.name;

    updateSoilInfo();
    buildTierSections();

    if (window.getSoilBasedAIAdvice) {
        const advice = window.getSoilBasedAIAdvice(soilType);
        addMessage('ai', advice);
    }
}

// Update soil information display
function updateSoilInfo() {
    const soil = window.indianSoilTypes?.[currentSoil];
    const infoDiv = document.getElementById('soil-info');
    if (!soil || !infoDiv) {
        if (infoDiv) infoDiv.style.display = 'none';
        return;
    }

    infoDiv.style.display = 'block';
    infoDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
                <strong style="color: #92400e; font-size: 1.1rem;">${soil.icon} ${soil.name}</strong><br>
                <div style="color: #78350f; font-size: 0.85rem; margin-top: 0.25rem;">${soil.description}</div>
            </div>
            <div style="text-align: right; min-width: 120px;">
                <div style="font-size: 0.75rem; color: #a16207; margin-bottom: 0.25rem;"><strong>pH:</strong> ${soil.ph}</div>
                <div style="font-size: 0.75rem; color: #a16207;"><strong>Best for:</strong> ${soil.bestFor}</div>
            </div>
        </div>
    `;
}

// Build tier builder sections with filtered crops
function buildTierSections() {
    const container = document.getElementById('tier-builders');
    if (!container) return;

    const compatibility = window.soilCropCompatibility?.[currentSoil];
    if (!compatibility) return;

    const tiers = [
        { id: 'overstory', name: 'Overstory (15-25m)', icon: '<span class="material-icons">park</span>', color: 'linear-gradient(135deg, #e6f4ea 0%, #d4e7dd 100%)', textColor: '#1a472a', crops: compatibility.overstory, spacingLabel: 'Spacing (m)', spacingUnit: 'm', defaultSpacing: 8, countLabel: 'Plants/acre' },
        { id: 'middle', name: 'Middle Tier (5-10m)', icon: '<span class="material-icons">nature</span>', color: 'linear-gradient(135deg, #fef7e0 0%, #f9eec7 100%)', textColor: '#92400e', crops: compatibility.middle, spacingLabel: 'Spacing (m)', spacingUnit: 'm', defaultSpacing: 3, countLabel: 'Plants/acre' },
        { id: 'understory', name: 'Understory (0.5-2m)', icon: '<span class="material-icons">grass</span>', color: 'linear-gradient(135deg, #fef3e7 0%, #fae5cd 100%)', textColor: '#78350f', crops: compatibility.understory, spacingLabel: 'Spacing (cm)', spacingUnit: 'cm', defaultSpacing: 30, countLabel: 'Plants/acre' },
        { id: 'vertical', name: 'Vertical Layer (Climbing)', icon: '<span class="material-icons">eco</span>', color: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', textColor: '#581c87', crops: compatibility.vertical, spacingLabel: 'Per Tree', spacingUnit: 'per tree', defaultSpacing: 2, countLabel: 'Total Vines' }
    ];

    container.innerHTML = tiers.map(tier => `
        <div class="tier-builder" data-tier="${tier.id}">
            <div style="background: ${tier.color}; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: ${tier.textColor};">
                        ${tier.icon} ${tier.name}
                    </h3>
                    <button class="btn-secondary" onclick="getAIAdvice('${tier.id}')" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                        <span class="material-icons md-18" style="vertical-align: text-bottom;">auto_awesome</span> AI Advice
                    </button>
                </div>
                <div style="display: grid; grid-template-columns: 2.2fr 1fr 1fr; gap: 1.2rem;">
                    <div>
                        <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">
                            Select Crop ${tier.crops.length === 0 ? '<span class="material-icons md-18" style="vertical-align: text-bottom; color: #dc2626;">block</span> Not suitable for this soil' : ''}
                        </label>
                        <select id="${tier.id}-crop" class="form-input" style="width: 100%;" onchange="checkCompatibility()" ${tier.crops.length === 0 ? 'disabled' : ''}>
                            <option value="">Choose...</option>
                            ${tier.crops.map(crop => `<option value="${crop}">${crop}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">
                            ${tier.spacingLabel}
                        </label>
                        <input type="number" id="${tier.id}-spacing" class="form-input" value="${tier.defaultSpacing}" min="${tier.defaultSpacing / 2}" max="${tier.defaultSpacing * 2}" onchange="calculatePlants()">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">
                            ${tier.countLabel}
                        </label>
                        <input type="text" id="${tier.id}-count" class="form-input" readonly value="0">
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    if (window.calculatePlants) window.calculatePlants();
}

// Open visualizer
function openVisualizer() {
    const crops = {
        overstory: {
            crop: document.getElementById('overstory-crop')?.value || '',
            spacing: document.getElementById('overstory-spacing')?.value || 0,
            count: document.getElementById('overstory-count')?.value || 0
        },
        middle: {
            crop: document.getElementById('middle-crop')?.value || '',
            spacing: document.getElementById('middle-spacing')?.value || 0,
            count: document.getElementById('middle-count')?.value || 0
        },
        understory: {
            crop: document.getElementById('understory-crop')?.value || '',
            spacing: document.getElementById('understory-spacing')?.value || 0,
            count: document.getElementById('understory-count')?.value || 0
        },
        vertical: {
            crop: document.getElementById('vertical-crop')?.value || '',
            spacing: document.getElementById('vertical-spacing')?.value || 0,
            count: document.getElementById('vertical-count')?.value || 0
        }
    };

    if (!crops.overstory.crop && !crops.middle.crop && !crops.understory.crop) {
        addMessage('ai', '<span class="material-icons md-18" style="vertical-align: text-bottom; color: #f59e0b;">warning</span> Please select at least some crops before visualizing!');
        return;
    }

    const modal = document.getElementById('visualizer-modal');
    if (modal) modal.classList.add('active');

    if (visualizer) visualizer.setData(crops, window.currentAcres || 2);
}

// Close visualizer
function closeVisualizer() {
    const modal = document.getElementById('visualizer-modal');
    if (modal) modal.classList.remove('active');
}

// Switch visualizer view
function switchView(view) {
    if (visualizer) visualizer.setView(view);
    document.getElementById('land-view-btn')?.classList.toggle('active', view === 'land');
    document.getElementById('aerial-view-btn')?.classList.toggle('active', view === 'aerial');
}

// Visualizer zoom controls
function zoomVisualizerIn() {
    if (visualizer && visualizer.zoom < 3.0) visualizer.zoomIn();
}

function zoomVisualizerOut() {
    if (visualizer && visualizer.zoom > 0.33) visualizer.zoomOut();
}

function resetVisualizer() {
    if (visualizer) visualizer.reset();
}

function exportVisualization() {
    if (visualizer) {
        visualizer.exportImage();
        addMessage('ai', '<span class="material-icons md-18" style="vertical-align: text-bottom; color: #16a34a;">check_circle</span> Your crop visualization has been exported as an image!');
    }
}

// Auto-save functionality
function autoSave() {
    const overstory = document.getElementById('overstory-crop')?.value;
    const middle = document.getElementById('middle-crop')?.value;
    const understory = document.getElementById('understory-crop')?.value;

    if (overstory || middle || understory) {
        const model = {
            soil: currentSoil,
            acres: window.currentAcres || 2,
            overstory: {
                crop: overstory,
                spacing: document.getElementById('overstory-spacing')?.value,
                count: document.getElementById('overstory-count')?.value
            },
            middle: {
                crop: middle,
                spacing: document.getElementById('middle-spacing')?.value,
                count: document.getElementById('middle-count')?.value
            },
            understory: {
                crop: understory,
                spacing: document.getElementById('understory-spacing')?.value,
                count: document.getElementById('understory-count')?.value
            },
            vertical: {
                crop: document.getElementById('vertical-crop')?.value,
                spacing: document.getElementById('vertical-spacing')?.value,
                count: document.getElementById('vertical-count')?.value
            },
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('autoSavedModel', JSON.stringify(model));
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Strata Designer initializing...');

    const urlParams = new URLSearchParams(window.location.search);
    const applyMode = urlParams.get('apply') === 'true';
    const presetId = urlParams.get('preset');

    let modelToLoad = null;

    // Check for pending model from localStorage (from model-details.js applyModel)
    if (applyMode) {
        try {
            const pendingModel = JSON.parse(localStorage.getItem('pendingModel'));
            console.log('Found pendingModel in localStorage:', pendingModel);
            if (pendingModel) {
                modelToLoad = pendingModel;
            }
        } catch (e) {
            console.error('Error parsing pendingModel:', e);
        }
    }

    // Check for preset parameter (from preset-models.js applyPresetModel)
    if (presetId && window.presetModels) {
        const presetModel = window.presetModels.find(m => m.id === presetId);
        console.log('Found preset model:', presetModel);
        if (presetModel && presetModel.cropSchedule) {
            modelToLoad = presetModel;
        }
    }

    // Also check for selectedPresetModel in localStorage
    if (!modelToLoad) {
        try {
            const selectedPreset = JSON.parse(localStorage.getItem('selectedPresetModel'));
            if (selectedPreset && selectedPreset.cropSchedule) {
                console.log('Found selectedPresetModel in localStorage:', selectedPreset);
                modelToLoad = selectedPreset;
                localStorage.removeItem('selectedPresetModel');
            }
        } catch (e) {
            console.error('Error parsing selectedPresetModel:', e);
        }
    }

    // If we have a model to load, set it up
    if (modelToLoad) {
        console.log('Loading model:', modelToLoad.name);

        // Set soil type first
        if (modelToLoad.soilType) {
            currentSoil = modelToLoad.soilType;
            const dropdown = document.getElementById('soil-dropdown');
            if (dropdown) dropdown.value = modelToLoad.soilType;
            updateSoilInfo();
        }

        // Set acres
        if (modelToLoad.acres) {
            window.currentAcres = modelToLoad.acres;
            const slider = document.getElementById('acre-slider');
            const acresValue = document.getElementById('acres-value');
            if (slider) slider.value = modelToLoad.acres;
            if (acresValue) acresValue.textContent = modelToLoad.acres;
        }

        // Build tier sections with current soil (creates the dropdowns)
        buildTierSections();

        // Now set the crop values after a delay to ensure DOM is ready
        setTimeout(() => {
            const schedule = modelToLoad.cropSchedule;
            console.log('Setting crop schedule:', schedule);

            if (schedule) {
                // Apply overstory
                if (schedule.overstory && schedule.overstory.crop) {
                    setTierValue('overstory', schedule.overstory.crop, schedule.overstory.spacing);
                }
                // Apply middle
                if (schedule.middle && schedule.middle.crop) {
                    setTierValue('middle', schedule.middle.crop, schedule.middle.spacing);
                }
                // Apply understory
                if (schedule.understory && schedule.understory.crop) {
                    setTierValue('understory', schedule.understory.crop, schedule.understory.spacing);
                }
                // Apply vertical
                if (schedule.vertical && schedule.vertical.crop) {
                    setTierValue('vertical', schedule.vertical.crop, schedule.vertical.perTree || schedule.vertical.spacing);
                }
            }

            // Recalculate everything
            setTimeout(() => {
                calculatePlants();
                checkCompatibility();
                updateModelStats();
                addMessage('ai', `<span class="material-icons md-18" style="vertical-align: text-bottom; color: #16a34a;">check_circle</span> <strong>${modelToLoad.name || 'Model'}</strong> applied successfully! I've set up the soil type (${modelToLoad.soilType || 'alluvial'}), plot size (${modelToLoad.acres || 2} acres), and all crops for you.`);

                // Cleanup
                localStorage.removeItem('pendingModel');
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 200);
        }, 500);

    } else {
        // Normal initialization without a preset
        updateSoilInfo();
        buildTierSections();
        addMessage('ai', `Welcome! I'll help you design the perfect crop system for your ${window.indianSoilTypes?.[currentSoil]?.name || 'soil'}. Let's start by selecting crops for each tier.`);
    }

    // Initialize visualizer
    visualizer = new CropVisualizer('crop-canvas');

    // Setup autosave
    setInterval(autoSave, 30000);

    // Initial calculations
    setTimeout(() => {
        calculatePlants();
        updateModelStats();
    }, 100);
});

// Helper function to set a tier's crop value
function setTierValue(tierId, cropName, spacing) {
    console.log(`Setting ${tierId}: crop=${cropName}, spacing=${spacing}`);

    const cropSelect = document.getElementById(`${tierId}-crop`);
    const spacingInput = document.getElementById(`${tierId}-spacing`);

    if (!cropSelect) {
        console.error(`Crop select for ${tierId} not found!`);
        return;
    }

    // Check if crop option exists
    let optionExists = false;
    for (let i = 0; i < cropSelect.options.length; i++) {
        if (cropSelect.options[i].value === cropName) {
            optionExists = true;
            break;
        }
    }

    // Add option if it doesn't exist
    if (!optionExists) {
        console.log(`Adding option ${cropName} to ${tierId}`);
        const newOption = document.createElement('option');
        newOption.value = cropName;
        newOption.textContent = (window.getCropEmoji?.(cropName) || '🌱') + ' ' + cropName;
        cropSelect.appendChild(newOption);
    }

    // Set the value
    cropSelect.value = cropName;

    // Set spacing if provided
    if (spacingInput && spacing) {
        spacingInput.value = spacing;
    }

    console.log(`${tierId} set to: ${cropSelect.value}`);
}

// Close visualizer on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVisualizer();
});

// Export functions to window
window.calculatePlants = calculatePlants;
window.checkCompatibility = checkCompatibility;
window.getAIAdvice = getAIAdvice;
window.getFullAnalysis = getFullAnalysis;
window.updateModelStats = updateModelStats;
window.saveModel = saveModel;
window.resetModel = resetModel;
window.optimizeModel = optimizeModel;
window.selectSoil = selectSoil;
window.buildTierSections = buildTierSections;
window.openVisualizer = openVisualizer;
window.closeVisualizer = closeVisualizer;
window.switchView = switchView;
window.zoomVisualizerIn = zoomVisualizerIn;
window.zoomVisualizerOut = zoomVisualizerOut;
window.resetVisualizer = resetVisualizer;
window.exportVisualization = exportVisualization;
window.setTierValue = setTierValue;

