// Dashboard Calendar and Harvest Management - Enhanced with Dynamic Data

// Crop harvest schedules based on Indian agricultural calendar
const cropHarvestSchedule = {
    'Coconut': {
        harvestMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Year-round, peak: Jan-Mar, Jul-Sep
        peakMonths: [0, 1, 2, 6, 7, 8],
        maintenanceMonths: [3, 4, 5, 9, 10, 11],
        cycle: 'continuous',
        daysToHarvest: 365,
        icon: '🥥'
    },
    'Banana': {
        harvestMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Year-round
        peakMonths: [2, 3, 4, 8, 9, 10],
        maintenanceMonths: [5, 6, 7, 11, 0, 1],
        cycle: 'continuous',
        daysToHarvest: 270,
        icon: '🍌'
    },
    'Ginger': {
        harvestMonths: [9, 10, 11, 0, 1], // Oct-Feb
        peakMonths: [10, 11, 0],
        maintenanceMonths: [2, 3, 4, 5, 6, 7, 8],
        cycle: 'annual',
        daysToHarvest: 240,
        icon: '🫚'
    },
    'Turmeric': {
        harvestMonths: [0, 1, 2, 9, 10, 11], // Jan-Mar, Oct-Dec
        peakMonths: [0, 1, 10, 11],
        maintenanceMonths: [3, 4, 5, 6, 7, 8],
        cycle: 'annual',
        daysToHarvest: 270,
        icon: '🟡'
    },
    'Black Pepper': {
        harvestMonths: [0, 1, 2, 11], // Jan-Mar, Dec
        peakMonths: [0, 1],
        maintenanceMonths: [3, 4, 5, 6, 7, 8, 9, 10],
        cycle: 'annual',
        daysToHarvest: 180,
        icon: '⚫'
    },
    'Mango': {
        harvestMonths: [3, 4, 5, 6], // Apr-Jul
        peakMonths: [4, 5],
        maintenanceMonths: [0, 1, 2, 7, 8, 9, 10, 11],
        cycle: 'annual',
        daysToHarvest: 120,
        icon: '🥭'
    },
    'Papaya': {
        harvestMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Year-round
        peakMonths: [2, 3, 4, 8, 9, 10],
        maintenanceMonths: [5, 6, 7, 11, 0, 1],
        cycle: 'continuous',
        daysToHarvest: 180,
        icon: '🍈'
    },
    'Cardamom': {
        harvestMonths: [7, 8, 9, 10], // Aug-Nov
        peakMonths: [8, 9],
        maintenanceMonths: [0, 1, 2, 3, 4, 5, 6, 11],
        cycle: 'annual',
        daysToHarvest: 120,
        icon: '<span class="material-icons">eco</span>'
    }
};

// Get current crop model from localStorage or use default
function getCurrentCropModel() {
    const saved = localStorage.getItem('savedCropModel') || localStorage.getItem('autoSavedModel');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing saved model:', e);
        }
    }
    // Default model
    return {
        overstory: { crop: 'Coconut' },
        middle: { crop: 'Banana' },
        understory: { crop: 'Ginger' },
        vertical: { crop: 'Black Pepper' }
    };
}

// Generate harvest data for a specific month
function generateHarvestDataForMonth(year, month) {
    const model = getCurrentCropModel();
    const harvestData = {};
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Get all crops from model
    const crops = [
        { name: model.overstory?.crop, tier: 'Overstory' },
        { name: model.middle?.crop, tier: 'Middle Tier' },
        { name: model.understory?.crop, tier: 'Understory' },
        { name: model.vertical?.crop, tier: 'Vertical' }
    ].filter(c => c.name);

    crops.forEach(({ name, tier }) => {
        const schedule = cropHarvestSchedule[name];
        if (!schedule) return;

        const isHarvestMonth = schedule.harvestMonths.includes(month);
        const isPeakMonth = schedule.peakMonths.includes(month);
        const isMaintenanceMonth = schedule.maintenanceMonths.includes(month);

        if (isHarvestMonth) {
            // Distribute harvest days throughout the month
            const harvestDays = isPeakMonth ? [5, 8, 12, 15, 18, 22, 25, 28] : [7, 14, 21, 28];

            harvestDays.forEach(day => {
                if (!harvestData[day]) harvestData[day] = [];

                const isPast = (year < currentYear) || (year === currentYear && month < currentMonth) ||
                    (year === currentYear && month === currentMonth && day < currentDate);
                const isToday = year === currentYear && month === currentMonth && day === currentDate;

                let status;
                if (isPast) {
                    status = 'Completed';
                } else if (isToday) {
                    status = 'Harvesting';
                } else if (day <= currentDate + 3) {
                    status = 'Ready to Harvest';
                } else {
                    status = 'Scheduled';
                }

                harvestData[day].push({
                    crop: name,
                    type: tier,
                    status: status,
                    icon: schedule.icon
                });
            });
        }

        if (isMaintenanceMonth) {
            // Add maintenance tasks
            const maintenanceDays = [6, 13, 20, 27];
            maintenanceDays.forEach(day => {
                if (!harvestData[day]) harvestData[day] = [];
                if (!harvestData[day].some(t => t.crop === name)) {
                    harvestData[day].push({
                        crop: name,
                        type: tier,
                        status: 'Maintenance',
                        icon: schedule.icon
                    });
                }
            });
        }
    });

    return harvestData;
}

// Update harvest preview based on selected date
function updateHarvestPreview(selectedDate) {
    const preview = document.querySelector('.harvest-preview');
    if (!preview) return;

    const model = getCurrentCropModel();
    const crops = [
        { name: model.overstory?.crop, tier: 'Overstory' },
        { name: model.middle?.crop, tier: 'Middle Tier' },
        { name: model.understory?.crop, tier: 'Understory' },
        { name: model.vertical?.crop, tier: 'Vertical' }
    ].filter(c => c.name);

    const today = new Date();
    const upcomingHarvests = [];
    const tasks = [];
    const maintenance = [];

    // Look ahead 30 days
    for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const month = checkDate.getMonth();
        const day = checkDate.getDate();
        const monthData = generateHarvestDataForMonth(checkDate.getFullYear(), month);

        if (monthData[day]) {
            monthData[day].forEach(task => {
                if (task.status.includes('Harvest') || task.status === 'Ready to Harvest') {
                    if (!upcomingHarvests.find(h => h.crop === task.crop && h.date === checkDate.toDateString())) {
                        upcomingHarvests.push({
                            ...task,
                            date: checkDate.toDateString(),
                            day: day,
                            month: month
                        });
                    }
                } else if (task.status === 'Maintenance') {
                    maintenance.push(task);
                } else {
                    tasks.push(task);
                }
            });
        }
    }

    // Update preview
    const harvestList = preview.querySelector('.harvest-list') || document.createElement('div');
    harvestList.className = 'harvest-list';
    harvestList.innerHTML = '';

    if (upcomingHarvests.length > 0) {
        upcomingHarvests.slice(0, 3).forEach(harvest => {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const item = document.createElement('div');
            item.className = 'harvest-item';
            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 1.2rem;">${harvest.icon || '<span class="material-icons md-18">grass</span>'}</span>
                    <div>
                        <div style="font-weight: 600; color: var(--text-main);">${harvest.crop}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${harvest.type} • ${monthNames[harvest.month]} ${harvest.day}</div>
                    </div>
                </div>
                <span class="harvest-status">${harvest.status}</span>
            `;
            harvestList.appendChild(item);
        });
    } else {
        harvestList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 1rem;">No upcoming harvests</div>';
    }

    if (!preview.querySelector('.harvest-list')) {
        preview.insertBefore(harvestList, preview.querySelector('div[style*="display: flex; justify-content: space-between"]'));
    }

    // Update stats
    const statsContainer = preview.querySelector('div[style*="display: flex; justify-content: space-between"]');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div>
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">${upcomingHarvests.length}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Crops Ready</div>
            </div>
            <div>
                <div style="font-size: 1.25rem; font-weight: 700; color: #d97706;">${tasks.length}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Tasks</div>
            </div>
            <div>
                <div style="font-size: 1.25rem; font-weight: 700; color: #2563eb;">${maintenance.length}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Maintenance</div>
            </div>
        `;
    }
}

// Dynamic calendar rendering with harvest data
let currentDisplayDate = new Date();
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

function renderCalendar() {
    const daysContainer = document.getElementById('calendar-days');
    const monthYearEl = document.getElementById('currentMonthYear');

    if (!daysContainer || !monthYearEl) return;

    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();

    // Set Header
    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    // Calculate dates
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDaysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();

    // Get harvest data for this month
    const harvestData = generateHarvestDataForMonth(year, month);

    daysContainer.innerHTML = '';

    // Previous month buffer days
    for (let i = firstDay; i > 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'cal-day';
        dayDiv.style.opacity = '0.3';
        dayDiv.textContent = prevDaysInMonth - i + 1;
        daysContainer.appendChild(dayDiv);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'cal-day';
        dayDiv.textContent = i;

        // Today check
        if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
            dayDiv.classList.add('today');
        }

        // Harvest event highlight
        if (harvestData[i]) {
            const hasHarvest = harvestData[i].some(t => t.status.includes('Harvest') || t.status === 'Ready to Harvest');
            const hasMaintenance = harvestData[i].some(t => t.status === 'Maintenance');

            if (hasHarvest) {
                dayDiv.style.background = '#dcfce7';
                dayDiv.style.border = '2px solid #16a34a';
                dayDiv.style.fontWeight = '700';
            } else if (hasMaintenance) {
                dayDiv.style.background = '#fef3c7';
                dayDiv.style.border = '1px dashed #d97706';
            }

            // Add tooltip
            dayDiv.title = harvestData[i].map(t => `${t.crop}: ${t.status}`).join('\n');
        }

        dayDiv.addEventListener('click', () => {
            document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('active'));
            dayDiv.classList.add('active');

            // Update harvest preview
            if (harvestData[i]) {
                updateHarvestDisplayForDay(i, harvestData[i]);
            } else {
                const preview = document.querySelector('.harvest-preview .harvest-list');
                if (preview) {
                    preview.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1rem;">No tasks scheduled for ${monthNames[month]} ${i}</div>`;
                }
            }
        });

        daysContainer.appendChild(dayDiv);
    }

    // Next month buffer days
    const totalCells = firstDay + daysInMonth;
    const nextDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= nextDays; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'cal-day';
        dayDiv.style.opacity = '0.3';
        dayDiv.textContent = i;
        daysContainer.appendChild(dayDiv);
    }

    // Update harvest preview on calendar render
    updateHarvestPreview(new Date(year, month, 1));
}

function updateHarvestDisplayForDay(day, tasks) {
    const preview = document.querySelector('.harvest-preview .harvest-list');
    if (!preview) return;

    preview.innerHTML = tasks.map(task => `
        <div class="harvest-item">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.2rem;">${task.icon || '<span class="material-icons md-18">grass</span>'}</span>
                <div>
                    <div style="font-weight: 600; color: var(--text-main);">${task.crop}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${task.type}</div>
                </div>
            </div>
            <span class="harvest-status" style="background: ${getStatusColor(task.status).bg}; color: ${getStatusColor(task.status).text};">
                ${task.status}
            </span>
        </div>
    `).join('');
}

function getStatusColor(status) {
    if (status.includes('Harvest') || status === 'Ready to Harvest') {
        return { bg: '#dcfce7', text: '#16a34a' };
    }
    if (status === 'Completed') {
        return { bg: '#e0e7ff', text: '#6366f1' };
    }
    if (status.includes('Maintenance') || status.includes('Weed')) {
        return { bg: '#fef3c7', text: '#d97706' };
    }
    if (status === 'Scheduled') {
        return { bg: '#dbeafe', text: '#2563eb' };
    }
    return { bg: '#f3f4f6', text: '#6b7280' };
}

function changeMonth(delta) {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + delta);
    renderCalendar();
}

function initDashboard() {
    renderCalendar();
    renderGrowthChart();
}

function renderGrowthChart() {
    const bars = document.querySelectorAll('.growth-bar-fill');
    bars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initDashboard);

// Export functions
window.changeMonth = changeMonth;
window.renderCalendar = renderCalendar;
window.updateHarvestPreview = updateHarvestPreview;
