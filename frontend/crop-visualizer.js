// Crop Visualizer - Interactive Front and Top View Renderer
// Displays crop spacing and heights using HTML5 Canvas

class CropVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.view = 'front'; // 'front' or 'top'
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.acres = 2;
        this.crops = {};
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    setupEventListeners() {
        // Mouse events for pan
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.offsetX;
            this.lastMouseY = e.offsetY;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const dx = e.offsetX - this.lastMouseX;
                const dy = e.offsetY - this.lastMouseY;
                this.panX += dx;
                this.panY += dy;
                this.lastMouseX = e.offsetX;
                this.lastMouseY = e.offsetY;
                this.render();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Mouse wheel for zoom - STRICTLY LIMITED TO 3X
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = this.zoom * zoomFactor;
            // Strict 3x limit: min 0.33 (1/3x), max 3.0 (3x)
            this.zoom = Math.max(0.33, Math.min(3.0, newZoom));
            this.render();
        });
    }

    zoomIn() {
        this.zoom = Math.min(3.0, this.zoom * 1.25);
        this.render();
    }

    zoomOut() {
        this.zoom = Math.max(0.33, this.zoom / 1.25);
        this.render();
    }

    setData(crops, acres) {
        this.crops = crops;
        this.acres = acres;
        this.render();
    }

    setView(view) {
        this.view = view;
        this.panX = 0;
        this.panY = 0;
        this.zoom = 1;
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context for graph transformation (applies to visualization only)
        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoom, this.zoom);

        if (this.view === 'land') {
            this.renderLandView();
        } else {
            this.renderAerialView();
        }

        this.ctx.restore();

        // Draw UI labels OUTSIDE of zoom transform (constant size)
        this.renderLabels();
    }

    renderLabels() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Zoom indicator (top right)
        this.ctx.fillStyle = 'rgba(45, 80, 22, 0.9)';
        this.ctx.fillRect(width - 100, 10, 90, 32);
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 13px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Zoom: ${this.zoom.toFixed(1)}x`, width - 55, 31);

        // View mode indicator (top left)
        this.ctx.fillStyle = 'rgba(45, 80, 22, 0.9)';
        this.ctx.fillRect(10, 10, 120, 32);
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(this.view === 'land' ? 'Land View' : 'Aerial View', 70, 31);

        // Pan hint (bottom left)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.font = '11px Inter';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Drag to pan, scroll to zoom', 10, height - 10);
    }

    renderLandView() {
        const width = this.canvas.width / this.zoom;
        const height = this.canvas.height / this.zoom;
        const margin = 60;
        const plotWidth = width - 2 * margin;
        const plotHeight = height - 2 * margin;

        // Draw background sky
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, height - margin);
        skyGradient.addColorStop(0, '#e0f2fe');
        skyGradient.addColorStop(1, '#f0f9ff');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(margin, margin, plotWidth, plotHeight);

        // Draw ground
        this.ctx.fillStyle = '#d6c8b0';
        this.ctx.fillRect(margin, height - margin - 20, plotWidth, 20);

        // Draw ground line
        this.ctx.strokeStyle = '#8b7355';
        this.ctx.lineWidth = 3 / this.zoom; // Keep line width consistent
        this.ctx.beginPath();
        this.ctx.moveTo(margin, height - margin);
        this.ctx.lineTo(width - margin, height - margin);
        this.ctx.stroke();

        // Height scale (0-25m)
        const maxHeight = 25;
        const heightScale = plotHeight / maxHeight;

        // Crop height data
        const cropHeights = {
            'Coconut Palm': 20, 'Areca Nut': 18, 'Teak': 25, 'Mahogany': 25,
            'Silver Oak': 22, 'Mango': 15,
            'Banana': 6, 'Papaya': 5, 'Jackfruit': 8, 'Guava': 6,
            'Ginger': 0.5, 'Turmeric': 0.6, 'Cardamom': 1.5, 'Pineapple': 1, 'Galangal': 0.8,
            'Black Pepper': 8, 'Vanilla': 4, 'Betel Leaf': 3, 'Passion Fruit': 5
        };

        // Crop colors
        const cropColors = {
            overstory: { fill: '#10b981', stroke: '#059669' },
            middle: { fill: '#f59e0b', stroke: '#d97706' },
            understory: { fill: '#ef4444', stroke: '#dc2626' },
            vertical: { fill: '#8b5cf6', stroke: '#7c3aed' }
        };

        // Draw crops by tier
        const tiers = ['overstory', 'middle', 'understory', 'vertical'];
        let xOffset = margin + 50;
        const spacing = 80;

        tiers.forEach(tier => {
            const crop = this.crops[tier];
            if (!crop || !crop.crop) return;

            const cropName = crop.crop;
            const cropHeight = cropHeights[cropName] || 5;
            const color = cropColors[tier];

            // Draw plant
            const plantY = height - margin - (cropHeight * heightScale);
            const plantWidth = 30;
            const plantHeight = cropHeight * heightScale;

            // Stem
            this.ctx.fillStyle = '#8b7355';
            this.ctx.fillRect(xOffset + plantWidth / 2 - 2, plantY, 4, plantHeight);

            // Canopy
            this.ctx.fillStyle = color.fill;
            this.ctx.strokeStyle = color.stroke;
            this.ctx.lineWidth = 2 / this.zoom;

            if (tier === 'overstory') {
                // Tree canopy
                this.ctx.beginPath();
                this.ctx.ellipse(xOffset + plantWidth / 2, plantY + 10, plantWidth / 2, plantHeight / 3, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } else if (tier === 'middle') {
                // Bushy plant
                this.ctx.beginPath();
                this.ctx.moveTo(xOffset, plantY + plantHeight / 2);
                this.ctx.quadraticCurveTo(xOffset + plantWidth / 2, plantY, xOffset + plantWidth, plantY + plantHeight / 2);
                this.ctx.lineTo(xOffset + plantWidth, plantY + plantHeight);
                this.ctx.lineTo(xOffset, plantY + plantHeight);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            } else if (tier === 'understory') {
                // Ground cover
                this.ctx.beginPath();
                this.ctx.ellipse(xOffset + plantWidth / 2, plantY + plantHeight - 5, plantWidth / 2, 8, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } else if (tier === 'vertical') {
                // Climbing vine
                this.ctx.strokeStyle = color.fill;
                this.ctx.lineWidth = 3 / this.zoom;
                this.ctx.beginPath();
                this.ctx.moveTo(xOffset + plantWidth / 2, height - margin);
                for (let i = 0; i < plantHeight; i += 10) {
                    this.ctx.lineTo(xOffset + plantWidth / 2 + (i % 20 - 10), plantY + plantHeight - i);
                }
                this.ctx.stroke();
            }

            xOffset += spacing;
        });
    }

    renderAerialView() {
        const width = this.canvas.width / this.zoom;
        const height = this.canvas.height / this.zoom;
        const margin = 80;
        const plotWidth = width - 2 * margin;
        const plotHeight = height - 2 * margin;

        // 1. Draw Background (Natural Ground Color)
        this.ctx.fillStyle = '#f5ede3';
        this.ctx.fillRect(margin, margin, plotWidth, plotHeight);

        // 2. Draw plot border
        this.ctx.strokeStyle = 'rgba(45, 80, 22, 0.3)';
        this.ctx.lineWidth = 2 / this.zoom;
        this.ctx.strokeRect(margin, margin, plotWidth, plotHeight);

        // 3. Scale Calculation
        const plotAreaM2 = this.acres * 4046.86;
        const plotSideMeters = Math.sqrt(plotAreaM2);
        const scale = plotWidth / plotSideMeters;

        // 4. Draw Scaled Meter Grid
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        this.ctx.lineWidth = 1 / this.zoom;
        const stepMeters = 10;

        for (let i = 0; i <= plotSideMeters; i += stepMeters) {
            const pos = margin + i * scale;
            if (pos > width - margin + 2) break;

            this.ctx.beginPath();
            this.ctx.moveTo(pos, margin);
            this.ctx.lineTo(pos, height - margin);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(margin, pos);
            this.ctx.lineTo(width - margin, pos);
            this.ctx.stroke();
        }

        // 5. Crop Visual Definitions
        const canopySizes = {
            'Coconut Palm': 6.5, 'Areca Nut': 4, 'Teak': 6, 'Mahogany': 7,
            'Silver Oak': 6, 'Mango': 8.5, 'Jackfruit': 7.5, 'Cocoa': 3.5,
            'Banana': 2.8, 'Papaya': 2.2, 'Guava': 3.5,
            'Ginger': 0.4, 'Turmeric': 0.4, 'Cardamom': 1.0, 'Pineapple': 0.7,
            'Black Pepper': 0.6, 'Vanilla': 0.4, 'Betel Leaf': 0.4
        };

        const cropColors = {
            overstory: '#059669',
            middle: '#d97706',
            understory: '#dc2626',
            vertical: '#7c3aed'
        };

        // 6. Drawing Layers (In specific order for realism)
        const overstoryPos = [];
        const tiers = ['understory', 'middle', 'overstory'];

        tiers.forEach(tier => {
            const crop = this.crops[tier];
            if (!crop || !crop.crop || !crop.spacing) return;

            let spacing = parseFloat(crop.spacing);
            if (tier === 'understory' && spacing > 5) spacing /= 100;

            const spacingPx = spacing * scale;
            const sizePx = (canopySizes[crop.crop] || 1) * scale;

            this.ctx.fillStyle = cropColors[tier] + '88';
            this.ctx.strokeStyle = cropColors[tier];
            this.ctx.lineWidth = 1 / this.zoom;

            if (spacingPx < 4) {
                this.ctx.fillStyle = cropColors[tier] + '66';
                this.ctx.fillRect(margin, margin, plotWidth, plotHeight);
            } else {
                for (let x = margin + spacingPx / 2; x < width - margin; x += spacingPx) {
                    for (let y = margin + spacingPx / 2; y < height - margin; y += spacingPx) {
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, sizePx / 2, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.stroke();

                        this.ctx.fillStyle = cropColors[tier];
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, Math.max(1.5, sizePx / 12), 0, Math.PI * 2);
                        this.ctx.fill();

                        if (tier === 'overstory') overstoryPos.push({ x, y });
                    }
                }
            }
        });

        // 7. Vertical Layer Climbers
        if (this.crops.vertical && this.crops.vertical.crop && overstoryPos.length > 0) {
            this.ctx.fillStyle = cropColors.vertical;
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 1.5 / this.zoom;

            overstoryPos.forEach(p => {
                this.ctx.beginPath();
                this.ctx.arc(p.x + 4, p.y - 4, 3.5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            });
        }
    }


    reset() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.render();
    }

    exportImage() {
        const link = document.createElement('a');
        link.download = `crop-model-${this.view}-view.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.CropVisualizer = CropVisualizer;
}
