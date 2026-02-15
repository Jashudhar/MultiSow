from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import List
from pathlib import Path
import os

from . import models, schemas, crud, database, ai_advisor

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Multi-Tier Crop Management System",
    description="AI-enhanced platform for multi-tier intercropping optimization",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Simplified for the integrated environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (frontend)
frontend_path = Path(__file__).parent.parent / "frontend"
app.mount("/frontend", StaticFiles(directory=str(frontend_path), html=True), name="frontend")

# Root redirect to frontend
@app.get("/")
def root():
    return RedirectResponse(url="/frontend/home.html")

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running", "version": "1.0.0"}

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# AI Advisor Instance
advisor = ai_advisor.AIStratificationAdvisor()

@app.on_event("startup")
def startup_event():
    # Seed Strata
    db = database.SessionLocal()
    try:
        strata_names = ["Overstory", "Middle", "Understory", "Vertical"]
        for name in strata_names:
            if not crud.get_stratum_by_name(db, name):
                crud.create_stratum(db, schemas.StratumBase(name=name, description=f"{name} layer"))
    finally:
        db.close()

@app.post("/crops/", response_model=schemas.Crop)
def create_crop(crop: schemas.CropCreate, db: Session = Depends(get_db)):
    return crud.create_crop(db=db, crop=crop)

@app.get("/crops/", response_model=List[schemas.Crop])
def read_crops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_crops(db, skip=skip, limit=limit)

@app.post("/plots/", response_model=schemas.Plot)
def create_plot(plot: schemas.PlotCreate, db: Session = Depends(get_db)):
    return crud.create_plot(db=db, plot=plot)

@app.get("/plots/{plot_id}", response_model=schemas.Plot)
def read_plot(plot_id: int, db: Session = Depends(get_db)):
    db_plot = crud.get_plot(db, plot_id=plot_id)
    if db_plot is None:
        raise HTTPException(status_code=404, detail="Plot not found")
    return db_plot

@app.post("/plots/{plot_id}/crops", response_model=schemas.PlotCrop)
def add_crop_to_plot(plot_id: int, plot_crop: schemas.PlotCropCreate, db: Session = Depends(get_db)):
    return crud.add_crop_to_plot(db=db, plot_crop=plot_crop, plot_id=plot_id)

@app.get("/plots/{plot_id}/analyze")
def analyze_plot(plot_id: int, db: Session = Depends(get_db)):
    return advisor.analyze_plot(plot_id, db)

@app.get("/presets", response_model=List[dict])
def get_presets():
    return [
        {
            "id": "wayanad-classic",
            "name": "Wayanad Classic",
            "description": "Traditional Kerala multi-tier system optimized for tropical climate.",
            "region": "Wayanad, Kerala",
            "soilType": "laterite",
            "difficulty": "Beginner",
            "acres": 2,
            "estimatedYield": "390 Quintals",
            "estimatedRevenue": "₹13.5L/year",
            "color": "#10b981",
            "cropSchedule": {
                "overstory": {"crop": "Coconut Palm", "spacing": 8, "plants": 146},
                "middle": {"crop": "Banana", "spacing": 3, "plants": 900},
                "understory": {"crop": "Turmeric", "spacing": 50, "plants": 45000},
                "vertical": {"crop": "Black Pepper", "perTree": 2, "total": 292}
            }
        },
        {
            "id": "karnataka-spice",
            "name": "Karnataka Spice Garden",
            "description": "High-value spice-focused model ideal for coffee-growing regions.",
            "region": "Coorg, Karnataka",
            "soilType": "laterite",
            "difficulty": "Intermediate",
            "acres": 3,
            "estimatedYield": "510 Quintals",
            "estimatedRevenue": "₹7.8L/year",
            "color": "#f59e0b",
            "cropSchedule": {
                "overstory": {"crop": "Silver Oak", "spacing": 10, "plants": 140},
                "middle": {"crop": "Papaya", "spacing": 2.5, "plants": 1940},
                "understory": {"crop": "Cardamom", "spacing": 40, "plants": 55000},
                "vertical": {"crop": "Vanilla", "perTree": 3, "total": 420}
            }
        },
        {
            "id": "maharashtra-balanced",
            "name": "Maharashtra Coconut-Mango",
            "description": "Balanced system with coconut palms and premium fruits.",
            "region": "Konkan, Maharashtra",
            "soilType": "black",
            "difficulty": "Intermediate",
            "acres": 2.5,
            "estimatedYield": "520 Quintals",
            "estimatedRevenue": "₹26.2L/year",
            "color": "#06b6d4",
            "cropSchedule": {
                "overstory": {"crop": "Coconut Palm", "spacing": 8, "plants": 182},
                "middle": {"crop": "Mango", "spacing": 3, "plants": 1000},
                "understory": {"crop": "Turmeric", "spacing": 50, "plants": 55000},
                "vertical": {"crop": "Black Pepper", "perTree": 2, "total": 364}
            }
        }
    ]

@app.post("/ai/plan", response_model=schemas.AIPlanResponse)
def ai_plan(req: schemas.AIPlanRequest):
    try:
        plan = advisor.generate_full_plan(
            acres=req.acres,
            soil_type=req.soil_type,
            budget_inr=req.budget_inr,
            goal=req.goal or "maximize_profit",
        )
        return plan
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/ai/analyze")
def ai_analyze(config: dict):
    return advisor.analyze_configuration(config)
