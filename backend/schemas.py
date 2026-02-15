from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StratumBase(BaseModel):
    name: str
    description: Optional[str] = None

class Stratum(StratumBase):
    id: int

    class Config:
        orm_mode = True

class CropBase(BaseModel):
    name: str
    stratum_id: int
    light_requirement: str

class CropCreate(CropBase):
    pass

class Crop(CropBase):
    id: int
    created_at: datetime
    stratum: Optional[Stratum] = None

    class Config:
        orm_mode = True

class PlotCropBase(BaseModel):
    crop_id: int
    x_position: float
    y_position: float

class PlotCropCreate(PlotCropBase):
    pass

class PlotCrop(PlotCropBase):
    id: int
    plot_id: int
    crop: Optional[Crop] = None

    class Config:
        orm_mode = True

class PlotBase(BaseModel):
    name: str

class PlotCreate(PlotBase):
    pass

class Plot(PlotBase):
    id: int
    created_at: datetime
    plot_crops: List[PlotCrop] = []

    class Config:
        orm_mode = True

class PresetCrop(BaseModel):
    crop_name: str
    count: int
    stratum: str

class Preset(BaseModel):
    id: str
    name: str
    description: str # e.g. "Coconut-Based Model"
    efficiency_stats: dict # e.g. {"yield_multiplier": 3.8, "est_revenue": "2.8L", "water_saved": "70%"}
    crops: List[PresetCrop]

# ---------- AI Planner (Budget/Soil/Acre → Full Plan) ----------

class AIPlanRequest(BaseModel):
    acres: float
    soil_type: str
    budget_inr: float
    goal: Optional[str] = "maximize_profit"  # maximize_profit | maximize_yield | low_risk
    region: Optional[str] = None

class AITierPlan(BaseModel):
    tier: str  # Overstory | Middle | Understory | Vertical
    crop: str
    spacing: Optional[float] = None
    spacing_unit: Optional[str] = None
    count: Optional[int] = None

class AIBudgetBreakdown(BaseModel):
    saplings_and_seeds: float
    irrigation_and_plumbing: float
    labor_and_tools: float
    soil_amendments: float
    contingency: float
    total: float

class AIPlanResponse(BaseModel):
    recommended_model_id: str
    recommended_model_name: str
    why_this_plan: List[str]
    tiers: List[AITierPlan]
    budget_breakdown: AIBudgetBreakdown
    expected_annual_revenue_range_inr: List[float]
    expected_annual_yield_note: str
    apply_payload: dict  # payload compatible with existing strata apply flow