/**
 * Backend API Integration Module
 * Handles connection to FastAPI backend and provides API utilities
 */

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000';

class BackendAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.isConnected = false;
    }

    /**
     * Check if backend is running
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                this.isConnected = true;
                return true;
            }
            this.isConnected = false;
            return false;
        } catch (error) {
            this.isConnected = false;
            return false;
        }
    }

    /**
     * Get preset models
     */
    async getPresets() {
        try {
            const response = await fetch(`${this.baseURL}/presets`);
            if (!response.ok) throw new Error('Failed to fetch presets');
            return await response.json();
        } catch (error) {
            console.error('Error fetching presets:', error);
            throw error;
        }
    }

    /**
     * Get all crops
     */
    async getCrops() {
        try {
            const response = await fetch(`${this.baseURL}/crops/`);
            if (!response.ok) throw new Error('Failed to fetch crops');
            return await response.json();
        } catch (error) {
            console.error('Error fetching crops:', error);
            throw error;
        }
    }

    /**
     * Create a new crop
     */
    async createCrop(cropData) {
        try {
            const response = await fetch(`${this.baseURL}/crops/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cropData)
            });
            if (!response.ok) throw new Error('Failed to create crop');
            return await response.json();
        } catch (error) {
            console.error('Error creating crop:', error);
            throw error;
        }
    }

    /**
     * Create a new plot
     */
    async createPlot(plotData) {
        try {
            const response = await fetch(`${this.baseURL}/plots/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(plotData)
            });
            if (!response.ok) throw new Error('Failed to create plot');
            return await response.json();
        } catch (error) {
            console.error('Error creating plot:', error);
            throw error;
        }
    }

    /**
     * Get plot details
     */
    async getPlot(plotId) {
        try {
            const response = await fetch(`${this.baseURL}/plots/${plotId}`);
            if (!response.ok) throw new Error('Failed to fetch plot');
            return await response.json();
        } catch (error) {
            console.error('Error fetching plot:', error);
            throw error;
        }
    }

    /**
     * Analyze plot with AI
     */
    async analyzePlot(plotId) {
        try {
            const response = await fetch(`${this.baseURL}/plots/${plotId}/analyze`);
            if (!response.ok) throw new Error('Failed to analyze plot');
            return await response.json();
        } catch (error) {
            console.error('Error analyzing plot:', error);
            throw error;
        }
    }

    /**
     * Generate AI plan from acres + soil + budget + goal
     */
    async generateAIPlan(planRequest) {
        try {
            const response = await fetch(`${this.baseURL}/ai/plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planRequest)
            });
            if (!response.ok) throw new Error('Failed to generate AI plan');
            return await response.json();
        } catch (error) {
            console.error('Error generating AI plan:', error);
            throw error;
        }
    }

    /**
     * Analyze a raw plot configuration with AI (no DB required)
     */
    async analyzeConfig(config) {
        try {
            const response = await fetch(`${this.baseURL}/ai/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (!response.ok) throw new Error('Failed to analyze config');
            return await response.json();
        } catch (error) {
            console.error('Error analyzing config:', error);
            throw error;
        }
    }

    /**
     * Add crop to plot
     */
    async addCropToPlot(plotId, plotCropData) {
        try {
            const response = await fetch(`${this.baseURL}/plots/${plotId}/crops`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(plotCropData)
            });
            if (!response.ok) throw new Error('Failed to add crop to plot');
            return await response.json();
        } catch (error) {
            console.error('Error adding crop to plot:', error);
            throw error;
        }
    }

    /**
     * Show connection status banner
     */
    showConnectionStatus(isConnected) {
        // Remove existing banner if present
        const existingBanner = document.getElementById('backend-status-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        if (!isConnected) {
            const banner = document.createElement('div');
            banner.id = 'backend-status-banner';
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                padding: 12px 20px;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                font-family: 'Inter', sans-serif;
                font-size: 14px;
            `;
            banner.innerHTML = `
                <strong><span class="material-icons md-18" style="vertical-align: text-bottom; color: #f59e0b;">warning</span> Backend Not Connected</strong> - 
                Some features may not work. Double-click <code style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px;">run.bat</code> to start the application.
            `;
            document.body.prepend(banner);
        }
    }
}

// Create global instance
window.backendAPI = new BackendAPI();

// Auto-check connection on load
window.addEventListener('DOMContentLoaded', async () => {
    const isConnected = await window.backendAPI.healthCheck();
    console.log('Backend connection:', isConnected ? '✅ Connected' : '❌ Disconnected');

    // Only show banner if not connected
    if (!isConnected) {
        window.backendAPI.showConnectionStatus(false);
    }
});
