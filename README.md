# 🌿 MultiSow - Advanced Multi-Tier Crop Management System

[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**MultiSow** is a comprehensive, AI-enhanced web platform designed for modern farmers practicing **Multi-Tier Intercropping**. By optimizing vertical space and resource allocation, MultiSow helps maximize land productivity, resource efficiency, and agricultural sustainability.

---

## ✨ Key Features

### 🏗️ Strata System Designer (Revamped!)
Design complex multi-tier layouts with ease. Our **AI-powered designer** provides real-time compatibility suggestions based on:
- **Vertical Tiers**: Overstory (15-25m), Middle Tier (5-10m), Understory (0.5-2m), and Vertical Layers.
- **Ecological Compatibility**: 100% research-validated combinations. Fixed long-standing issues (e.g., Teak/Pepper incompatibility) to ensure synergistic growth.
- **Real-time Validation**: Mathematical verification of plant counts and yields based on acreage and spacing.

### 🧪 Soil Compatibility Analysis
Optimized for the Indian agricultural landscape, MultiSow includes expert data for:
- **Major Soil Types**: Alluvial, Black, Red, Laterite, Desert, and Mountain soils.
- **Dynamic Recommendations**: Automatically filters compatible crops based on your land's soil profile (pH levels, nutrient density, and drainage characteristics).

### 📊 Interactive Farmer Dashboard
A command center for your farm's operations:
- **Fixed Metrics**: Realistic revenue and yield projections (recalculated from research data).
- **Growth Visualization**: Track crop progress across different tiers.
- **Smart Metrics**: Monitor water conservation (up to 70%), ROI projections, and sunlight capture.

### 🧮 Smart Resource Calculator
Go beyond simple area calculations. The integrated calculator provides:
- **Exact Planting Density**: Precise counts based on validated spacing formulas (offset/triangular planting support).
- **Acre-to-Unit Conversion**: Dynamic calculations for any plot size (0.5 to 10 acres).

### 🛩️ Advanced Aerial Mapping (New!)
The revamped **Crop Model Visualizer** now offers professional-grade mapping:
- **Representative Distribution**: Accurate plant placement across the entire plot acreage.
- **Vertical Markers**: Purple markers indicating vertical climbers on overstory support trees.
- **Smart Density**: Visual optimization for high-density understory crops.
- **UX Controls**: Precision zoom (limited to 3x for usability) and pan controls with high-contrast UI.

### 🚀 Research-Backed Preset Models
Access 6 production-ready crop models optimized for Indian regions:
1. **Wayanad Classic** (Kerala)
2. **Karnataka Spice Garden** (Malnad)
3. **Tamil Nadu Tropical** (Coimbatore/Madurai)
4. **Andhra Commercial** (Godavari)
5. **Maharashtra Coconut-Mango** (Konkan - *Fixed & Optimized*)
6. **Coconut-Cocoa Premium Spice** (New Research Model)

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.8+**
- A modern web browser (Chrome, Firefox, or Edge)

### Installation & Launch

#### **Windows (Easiest)**
1. **Double-click `run.bat`**.
2. The script will automatically verify Python, install dependencies, and launch the server.
3. Browser will open automatically at http://localhost:8000

#### **Mac/Linux**
1. Run `chmod +x run.sh && ./run.sh`
2. Browser will open automatically at http://localhost:8000

#### **Docker (Production Ready)**
```bash
docker-compose up -d
```
Access at: http://localhost:8000

### Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

---

## 📁 Project Architecture

```text
multi_tier_crop_system/
├── backend/               # Python/FastAPI Application
├── frontend/             # Modern UI (HTML5/CSS3/Vanilla JS)
│   ├── home.html         # Symmetric 3-Column Home Layout
│   ├── strata.html       # AI System Designer
│   ├── crop-visualizer.js # Revamped Mapping Logic
│   ├── preset-models.js  # Validated Research Models
│   └── styles.css        # Premium Glassmorphic Design
```

---

## 📈 Research Impact (2026 Data)
- **40-70%** Water conservation via micro-climate management.
- **3.5x - 4.2x** Productivity increase per unit area.
- **₹75K - ₹2.5L** Realistic monthly revenue range for optimized multi-tier systems.
- **100% Compatibility** guarantee across all recommended models.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Happy Farming! 🌾🚜**
