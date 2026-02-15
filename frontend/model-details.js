// Model Details Modal System
// Displays comprehensive information about preset models

class ModelDetailsModal {
    constructor() {
        this.modal = null;
        this.currentModel = null;
        this.createModal();
    }

    createModal() {
        const modalHTML = `
            <div id="model-details-modal" class="model-modal">
                <div class="model-modal-content">
                    <div class="model-modal-header">
                        <h2 id="model-title"></h2>
                        <button class="modal-close-btn" onclick="modelDetails.close()">×</button>
                    </div>
                    
                    <div class="model-modal-body">
                        <div class="model-tabs">
                            <button class="tab-btn active" onclick="modelDetails.showTab('overview')"><span class="material-icons md-18" style="vertical-align: text-bottom;">description</span> Overview</button>
                            <button class="tab-btn" onclick="modelDetails.showTab('crops')"><span class="material-icons md-18" style="vertical-align: text-bottom;">eco</span> Crops</button>
                            <button class="tab-btn" onclick="modelDetails.showTab('planting')"><span class="material-icons md-18" style="vertical-align: text-bottom;">agriculture</span> Planting Guide</button>
                            <button class="tab-btn" onclick="modelDetails.showTab('timeline')"><span class="material-icons md-18" style="vertical-align: text-bottom;">calendar_month</span> Timeline</button>
                            <button class="tab-btn" onclick="modelDetails.showTab('financials')"><span class="material-icons md-18" style="vertical-align: text-bottom;">payments</span> Financials</button>
                        </div>

                        <div class="tab-content">
                            <!-- Overview Tab -->
                            <div id="tab-overview" class="tab-pane active">
                                <div class="overview-grid">
                                    <div class="info-card">
                                        <span class="info-icon"><span class="material-icons md-18">location_on</span></span>
                                        <div>
                                            <div class="info-label">Region</div>
                                            <div class="info-value" id="model-region"></div>
                                        </div>
                                    </div>
                                    <div class="info-card">
                                        <span class="info-icon"><span class="material-icons md-18">straighten</span></span>
                                        <div>
                                            <div class="info-label">Plot Size</div>
                                            <div class="info-value" id="model-acres"></div>
                                        </div>
                                    </div>
                                    <div class="info-card">
                                        <span class="info-icon"><span class="material-icons md-18">speed</span></span>
                                        <div>
                                            <div class="info-label">Difficulty</div>
                                            <div class="info-value" id="model-difficulty"></div>
                                        </div>
                                    </div>
                                    <div class="info-card">
                                        <span class="info-icon"><span class="material-icons md-18">payments</span></span>
                                        <div>
                                            <div class="info-label">Est. Revenue</div>
                                            <div class="info-value" id="model-revenue"></div>
                                        </div>
                                    </div>
                                    <div class="info-card">
                                        <span class="info-icon"><span class="material-icons md-18">grass</span></span>
                                        <div>
                                            <div class="info-label">Soil Type</div>
                                            <div class="info-value" id="model-soil"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="model-description" id="model-description"></div>

                                <div class="benefits-section">
                                    <h3><span class="material-icons md-18" style="vertical-align: text-bottom;">stars</span> Key Benefits</h3>
                                    <ul id="model-benefits"></ul>
                                </div>
                            </div>

                            <!-- Crops Tab -->
                            <div id="tab-crops" class="tab-pane">
                                <div class="crops-breakdown">
                                    <div class="tier-detail" id="overstory-detail"></div>
                                    <div class="tier-detail" id="middle-detail"></div>
                                    <div class="tier-detail" id="understory-detail"></div>
                                    <div class="tier-detail" id="vertical-detail"></div>
                                </div>
                            </div>

                            <!-- Planting Guide Tab -->
                            <div id="tab-planting" class="tab-pane">
                                <div id="planting-guide-content"></div>
                            </div>

                            <!-- Timeline Tab -->
                            <div id="tab-timeline" class="tab-pane">
                                <div class="timeline-view" id="planting-timeline"></div>
                            </div>

                            <!-- Financials Tab -->
                            <div id="tab-financials" class="tab-pane">
                                <div class="financials-grid">
                                    <div class="financial-card">
                                        <h4>Initial Investment</h4>
                                        <div class="cost-breakdown" id="initial-costs"></div>
                                    </div>
                                    <div class="financial-card">
                                        <h4>Annual Revenue Projection</h4>
                                        <div class="revenue-chart" id="revenue-projection"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="model-modal-footer">
                        <button class="btn-secondary" onclick="modelDetails.close()">Close</button>
                        <button class="btn-primary btn-apply" onclick="modelDetails.applyModel()">
                            <span class="material-icons md-18" style="vertical-align: text-bottom;">check_circle</span> Apply This Model to Strata System
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('model-details-modal');

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    show(modelId) {
        const model = window.presetModels?.find(m => m.id === modelId);
        if (!model) return;

        this.currentModel = model;
        this.populateModal(model);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showTab(tabName) {
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.getElementById(`tab-${tabName}`).classList.add('active');
        event.target.closest('.tab-btn').classList.add('active');
    }

    populateModal(model) {
        document.getElementById('model-title').textContent = model.name || 'Unnamed Model';

        document.getElementById('model-region').textContent = model.region || 'Any Region';
        document.getElementById('model-acres').textContent = model.acres ? `${model.acres} Acres` : 'Variable Size';
        document.getElementById('model-difficulty').textContent = model.difficulty || 'Intermediate';
        document.getElementById('model-revenue').textContent = model.estimatedRevenue || model.revenue || 'Variable';
        document.getElementById('model-soil').textContent = model.soilType ? (model.soilType.charAt(0).toUpperCase() + model.soilType.slice(1)) : 'Any';
        document.getElementById('model-description').textContent = model.description || 'No description available.';

        const benefitsList = document.getElementById('model-benefits');
        if (model.benefits && Array.isArray(model.benefits)) {
            benefitsList.innerHTML = model.benefits.map(b => `<li>${b}</li>`).join('');
        } else {
            benefitsList.innerHTML = '<li>Universal compatibility</li><li>Optimized resource use</li><li>Research-backed layout</li>';
        }

        this.populateCropsTab(model);
        this.populatePlantingGuideTab(model);
        this.populateTimelineTab(model);
        this.populateFinancialsTab(model);
    }

    populateCropsTab(model) {
        const schedule = model.cropSchedule;

        const tierDetails = [
            { id: 'overstory', name: 'Overstory (15-25m)', icon: '<span class="material-icons">park</span>', tier: schedule.overstory },
            { id: 'middle', name: 'Middle Tier (5-10m)', icon: '<span class="material-icons">nature</span>', tier: schedule.middle },
            { id: 'understory', name: 'Understory (0.5-2m)', icon: '<span class="material-icons">grass</span>', tier: schedule.understory },
            { id: 'vertical', name: 'Vertical Layer', icon: '<span class="material-icons">eco</span>', tier: schedule.vertical }
        ];

        tierDetails.forEach(({ id, name, icon, tier }) => {
            const container = document.getElementById(`${id}-detail`);
            if (tier && tier.crop) {
                container.innerHTML = `
                    <div class="tier-header">
                        <h4>${icon} ${name}</h4>
                    </div>
                    <div class="crop-info">
                        <div class="crop-name-large"><span class="material-icons" style="vertical-align: text-bottom;">${getCropIcon(tier.crop)}</span> ${tier.crop}</div>
                        <div class="crop-specs">
                            <div class="spec-item">
                                <span class="spec-label">Spacing:</span>
                                <span class="spec-value">${tier.spacing}${typeof tier.spacing === 'number' && tier.spacing < 100 ? 'm' : ' per acre'}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Total Plants:</span>
                                <span class="spec-value">${(tier.plants || tier.count || tier.total || 'N/A').toLocaleString?.() || tier.plants || tier.count || tier.total || 'N/A'}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Expected Yield:</span>
                                <span class="spec-value">${tier.yield || 'Variable'}</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                container.innerHTML = `<div class="no-crop">${icon} ${name} - Not used in this model</div>`;
            }
        });
    }

    populatePlantingGuideTab(model) {
        const container = document.getElementById('planting-guide-content');
        const guide = model.plantingGuide;
        const schedule = model.cropSchedule;

        if (!guide || !schedule) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Planting guide not available for this model.</p>';
            return;
        }

        const tiers = [
            { key: 'overstory', label: 'Overstory', crop: schedule.overstory?.crop, guide: guide.overstory, color: '#059669' },
            { key: 'middle', label: 'Middle Tier', crop: schedule.middle?.crop, guide: guide.middle, color: '#d97706' },
            { key: 'understory', label: 'Understory', crop: schedule.understory?.crop, guide: guide.understory, color: '#dc2626' },
            { key: 'vertical', label: 'Vertical', crop: schedule.vertical?.crop, guide: guide.vertical, color: '#7c3aed' }
        ];

        container.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">
                    <span class="material-icons md-18" style="vertical-align: text-bottom;">agriculture</span> Complete Planting Guide
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Detailed spacing, planting instructions, and fertilizer recommendations for ${model.region}</p>
            </div>

            ${tiers.filter(t => t.crop && t.guide).map(tier => `
                <div style="background: #f8f9fa; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; border-left: 4px solid ${tier.color};">
                    <h4 style="font-weight: 700; margin-bottom: 0.75rem; color: ${tier.color};">
                        <span class="material-icons md-18" style="vertical-align: text-bottom;">${getCropIcon(tier.crop)}</span> ${tier.crop} (${tier.label})
                    </h4>
                    
                    <!-- Spacing & Planting -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
                        <div style="background: white; padding: 0.75rem; border-radius: 8px;">
                            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600;">Row Spacing</div>
                            <div style="font-weight: 700; font-size: 1rem;">${tier.guide.rowSpacing}</div>
                        </div>
                        <div style="background: white; padding: 0.75rem; border-radius: 8px;">
                            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600;">Plant Spacing</div>
                            <div style="font-weight: 700; font-size: 1rem;">${tier.guide.plantSpacing}</div>
                        </div>
                        <div style="background: white; padding: 0.75rem; border-radius: 8px;">
                            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600;">Planting Depth</div>
                            <div style="font-weight: 700; font-size: 1rem;">${tier.guide.plantingDepth}</div>
                        </div>
                        <div style="background: white; padding: 0.75rem; border-radius: 8px;">
                            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600;">Best Season</div>
                            <div style="font-weight: 700; font-size: 1rem;">${tier.guide.plantingSeason}</div>
                        </div>
                    </div>

                    <!-- Irrigation -->
                    <div style="background: #eff6ff; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
                        <div style="font-size: 0.75rem; font-weight: 600; color: #1d4ed8; margin-bottom: 0.25rem;">
                            <span class="material-icons md-18" style="vertical-align: text-bottom;">water_drop</span> Irrigation
                        </div>
                        <div style="font-size: 0.85rem;">${tier.guide.irrigation}</div>
                    </div>

                    <!-- Fertilizer Schedule -->
                    <div style="background: #f0fdf4; padding: 0.75rem; border-radius: 8px;">
                        <div style="font-size: 0.75rem; font-weight: 600; color: #15803d; margin-bottom: 0.5rem;">
                            <span class="material-icons md-18" style="vertical-align: text-bottom;">science</span> Fertilizer Schedule (India)
                        </div>
                        <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 1px solid #dcfce7;">
                                    <th style="text-align: left; padding: 0.25rem 0.5rem; font-weight: 600;">Stage</th>
                                    <th style="text-align: left; padding: 0.25rem 0.5rem; font-weight: 600;">Fertilizer</th>
                                    <th style="text-align: left; padding: 0.25rem 0.5rem; font-weight: 600;">Dosage</th>
                                    <th style="text-align: left; padding: 0.25rem 0.5rem; font-weight: 600;">Brand</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tier.guide.fertilizers.map(f => `
                                    <tr style="border-bottom: 1px solid #f0fdf4;">
                                        <td style="padding: 0.35rem 0.5rem;">${f.stage}</td>
                                        <td style="padding: 0.35rem 0.5rem;">${f.type}</td>
                                        <td style="padding: 0.35rem 0.5rem;">${f.dosage}</td>
                                        <td style="padding: 0.35rem 0.5rem; font-weight: 600;">${f.brand}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `).join('')}

            <!-- Organic Alternatives -->
            ${guide.organicOptions ? `
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%); padding: 1.25rem; border-radius: 12px; border-left: 4px solid #d97706;">
                <h4 style="font-weight: 700; margin-bottom: 0.75rem; color: #92400e;">
                    <span class="material-icons md-18" style="vertical-align: text-bottom;">compost</span> Organic Alternatives
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem;">
                    ${guide.organicOptions.map(opt => `
                        <div style="background: white; padding: 0.75rem; border-radius: 8px;">
                            <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.25rem;">${opt.name}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${opt.dosage}</div>
                            <div style="font-size: 0.75rem; color: #92400e; margin-top: 0.25rem;">${opt.benefit}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        `;
    }

    populateTimelineTab(model) {
        const timeline = document.getElementById('planting-timeline');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        timeline.innerHTML = `
            <div class="timeline-intro">
                <h4><span class="material-icons md-18" style="vertical-align: text-bottom;">calendar_month</span> Recommended Planting Schedule</h4>
                <p>Optimal months for planting each tier to maximize success in ${model.region}</p>
            </div>
            <div class="timeline-grid">
                ${months.map((month, idx) => `
                    <div class="timeline-month">
                        <div class="month-name">${month}</div>
                        <div class="month-activities">
                            ${this.getMonthActivities(idx, model)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getMonthActivities(monthIndex, model) {
        const activities = [];

        if (monthIndex >= 5 && monthIndex <= 8) {
            activities.push('<div class="activity plant"><span class="material-icons md-18" style="vertical-align: text-bottom;">eco</span> Planting season</div>');
        }

        if (monthIndex >= 9 && monthIndex <= 10) {
            activities.push('<div class="activity harvest"><span class="material-icons md-18" style="vertical-align: text-bottom;">grass</span> Harvest time</div>');
        }

        return activities.join('') || '<div class="activity-empty">-</div>';
    }

    populateFinancialsTab(model) {
        const costs = document.getElementById('initial-costs');
        const estimatedCosts = this.calculateInitialCosts(model);

        costs.innerHTML = `
            <div class="cost-item">
                <span>Land Preparation</span>
                <span>₹${estimatedCosts.landPrep.toLocaleString()}</span>
            </div>
            <div class="cost-item">
                <span>Seeds & Saplings</span>
                <span>₹${estimatedCosts.seeds.toLocaleString()}</span>
            </div>
            <div class="cost-item">
                <span>Tools & Equipment</span>
                <span>₹${estimatedCosts.tools.toLocaleString()}</span>
            </div>
            <div class="cost-item">
                <span>Initial Labor</span>
                <span>₹${estimatedCosts.labor.toLocaleString()}</span>
            </div>
            <div class="cost-total">
                <span><strong>Total Initial Investment</strong></span>
                <span><strong>₹${estimatedCosts.total.toLocaleString()}</strong></span>
            </div>
        `;

        const revenue = document.getElementById('revenue-projection');
        const revenueStr = model.estimatedRevenue || model.revenue || '5.2L';
        const revenuePerYear = parseFloat(String(revenueStr).replace(/[^0-9.]/g, '') || '5.2');

        revenue.innerHTML = `
            <div class="revenue-bars">
                ${[1, 2, 3, 4, 5].map(year => `
                    <div class="revenue-year">
                        <div class="revenue-bar" style="height: ${year * 20}%; background: linear-gradient(to top, #10b981, #34d399);">
                            ₹${(revenuePerYear * year * 0.7).toFixed(1)}L
                        </div>
                        <div class="year-label">Year ${year}</div>
                    </div>
                `).join('')}
            </div>
            <div class="revenue-note">
                <span class="material-icons md-18" style="vertical-align: text-bottom;">info</span> Revenue typically increases as crops mature and yield improves
            </div>
        `;
    }

    calculateInitialCosts(model) {
        const basePerAcre = 50000;
        const acres = model.acres;

        return {
            landPrep: acres * 15000,
            seeds: acres * 20000,
            tools: acres * 8000,
            labor: acres * 12000,
            total: acres * basePerAcre
        };
    }

    applyModel() {
        if (!this.currentModel) return;

        localStorage.setItem('pendingModel', JSON.stringify(this.currentModel));

        const confirmed = confirm(
            `Apply "${this.currentModel.name}" model to Strata System?\n\n` +
            `This will pre-fill all crop selections based on this preset model.`
        );

        if (confirmed) {
            window.location.href = 'strata.html?apply=true';
        }
    }
}

// Helper function for crop Material Icons (replaces emoji function)
function getCropIcon(crop) {
    const icons = {
        'Coconut Palm': 'park', 'Areca Nut': 'park', 'Teak': 'forest', 'Mahogany': 'forest',
        'Silver Oak': 'forest', 'Mango': 'yard', 'Banana': 'nature', 'Papaya': 'nature',
        'Jackfruit': 'yard', 'Guava': 'yard', 'Ginger': 'grass', 'Turmeric': 'grass',
        'Cardamom': 'grass', 'Pineapple': 'grass', 'Black Pepper': 'eco',
        'Vanilla': 'eco', 'Betel Leaf': 'eco', 'Passion Fruit': 'eco',
        'Cocoa': 'local_cafe', 'Black Pepper + Vanilla': 'eco'
    };
    return icons[crop] || 'eco';
}

// Keep old function name for backward compat
function getCropEmoji(crop) {
    return `<span class="material-icons md-18" style="vertical-align: text-bottom;">${getCropIcon(crop)}</span>`;
}

// Initialize on page load
let modelDetails;
document.addEventListener('DOMContentLoaded', () => {
    modelDetails = new ModelDetailsModal();
    window.modelDetails = modelDetails;
});

if (typeof window !== 'undefined') {
    window.ModelDetailsModal = ModelDetailsModal;
    window._initModelDetails = function () {
        if (!window.modelDetails) {
            window.modelDetails = new ModelDetailsModal();
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window._initModelDetails);
    } else {
        window._initModelDetails();
    }
}
