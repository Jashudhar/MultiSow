from sqlalchemy.orm import Session
from . import models
from typing import Dict, Any, List, Tuple
import math

class AIStratificationAdvisor:
    def __init__(self):
        # In a real scenario, we would initialize the Gemini API client here.
        pass

    def analyze_plot(self, plot_id: int, db: Session):
        plot = db.query(models.Plot).filter(models.Plot.id == plot_id).first()
        if not plot:
            return {"error": "Plot not found"}
        
        # Extract data for the general analyzer
        config = {
            "name": plot.name,
            "crops": [
                {"name": pc.crop.name, "stratum": pc.crop.stratum.name} 
                for pc in plot.plot_crops if pc.crop and pc.crop.stratum
            ]
        }
        return self.analyze_configuration(config)

    def analyze_configuration(self, config: Dict[str, Any]):
        # General analyzer that works with raw JSON config
        crops = config.get("crops", [])
        overstory_count = sum(1 for c in crops if c.get("stratum") == "Overstory")
        middle_count = sum(1 for c in crops if c.get("stratum") == "Middle")
        understory_count = sum(1 for c in crops if c.get("stratum") == "Understory")
        vertical_count = sum(1 for c in crops if c.get("stratum") == "Vertical")
        
        advice = []
        
        if overstory_count > 2:
            advice.append("⚠️ **High Canopy Density**: Multiple Overstory crops detected. Ensure at least 8-10m spacing to prevent excessive shading.")
        
        if understory_count > 0 and overstory_count == 0:
             advice.append("💡 **Missing Overstory**: Many understory crops thrive better with dappled sunlight from a canopy. Consider adding a Coconut or Areca Nut layer.")

        if middle_count == 0 and len(crops) > 0:
            advice.append("🌱 **Fill the Gap**: Your Middle layer is empty. Adding Banana or Papaya can significantly increase your yield per unit area.")
        
        if vertical_count == 0 and overstory_count > 0:
            advice.append("🪜 **Vertical Opportunity**: You have overstory trees but no climbers. Black Pepper or Vanilla can grow on your overstory trees for 'bonus' income.")

        if not advice:
            advice.append("✅ **Excellent Stratification**: Your crop architecture is well-balanced and follows multi-tier best practices.")

        summary = (
            f"AI Analysis Result:\n"
            f"- Architecture: {'Full' if len(crops) >= 4 else 'Partial'} Multi-Tier\n"
            f"- Components: {overstory_count} Overstory, {middle_count} Middle, {understory_count} Understory, {vertical_count} Vertical\n\n"
            "**Strategic Recommendations:**\n" + "\n".join(advice)
        )

        return {
            "status": "success",
            "counts": {
                "overstory": overstory_count,
                "middle": middle_count,
                "understory": understory_count,
                "vertical": vertical_count
            },
            "advice": summary,
            "compatibility_score": 100 - (20 if overstory_count > 2 else 0)
        }

    # ---------------- AI Planner (no external LLM required) ----------------

    def generate_full_plan(self, *, acres: float, soil_type: str, budget_inr: float, goal: str = "maximize_profit") -> Dict[str, Any]:
        """
        Deterministic "AI" planner:
        - Filters candidate preset-style plans by soil fit
        - Scores by goal (profit/yield/risk) and budget feasibility
        - Returns a full plan + budget breakdown + payload compatible with strata 'apply' flow
        """
        soil_type = (soil_type or "").strip().lower()
        if acres <= 0:
            raise ValueError("acres must be > 0")
        if budget_inr <= 0:
            raise ValueError("budget_inr must be > 0")

        candidates = self._preset_candidates()
        # Filter by soil type when available
        filtered = [c for c in candidates if (c.get("soilType") in (None, soil_type))]
        if not filtered:
            filtered = candidates[:]  # fallback: best-effort even if soil mismatch

        scored: List[Tuple[float, Dict[str, Any], Dict[str, float], List[str]]] = []
        for model in filtered:
            breakdown = self._estimate_budget_breakdown(acres=acres, model=model)
            total = breakdown["total"]
            feasibility = min(budget_inr / total, 1.0)
            # Penalty if budget is too low
            budget_penalty = 0.0 if budget_inr >= total else (1.0 - feasibility) * 2.0

            revenue_mid = self._parse_revenue_mid_inr(model.get("estimatedRevenue", ""))
            profit_score = math.log1p(max(revenue_mid, 0.0)) / 20.0  # normalize-ish
            yield_score = self._parse_yield_score(model.get("estimatedYield", ""))
            risk_score = self._difficulty_risk_score(model.get("difficulty", "Intermediate"))

            if goal == "maximize_yield":
                base = yield_score * 1.2 + profit_score * 0.6 + feasibility * 0.8 - budget_penalty
            elif goal == "low_risk":
                base = (1.0 - risk_score) * 1.2 + feasibility * 0.9 + profit_score * 0.5 - budget_penalty
            else:  # maximize_profit
                base = profit_score * 1.2 + yield_score * 0.6 + feasibility * 0.8 - budget_penalty

            why = self._build_why(acres=acres, soil_type=soil_type, budget_inr=budget_inr, model=model, breakdown=breakdown, feasibility=feasibility)
            scored.append((base, model, breakdown, why))

        scored.sort(key=lambda x: x[0], reverse=True)
        best_score, best_model, breakdown, why = scored[0]

        # Scale counts roughly by acres ratio relative to model base acres (if provided)
        apply_payload = self._build_apply_payload(acres=acres, model=best_model)

        tiers = self._tiers_from_model(model=best_model, acres=acres)
        revenue_range = self._revenue_range_inr(best_model.get("estimatedRevenue", ""), acres=acres, base_acres=best_model.get("acres") or acres)

        return {
            "recommended_model_id": best_model["id"],
            "recommended_model_name": best_model["name"],
            "why_this_plan": why,
            "tiers": tiers,
            "budget_breakdown": breakdown,
            "expected_annual_revenue_range_inr": revenue_range,
            "expected_annual_yield_note": f"Yield is estimated from the selected research model ({best_model.get('estimatedYield','N/A')}) and scaled to your acreage.",
            "apply_payload": apply_payload,
        }

    def _preset_candidates(self) -> List[Dict[str, Any]]:
        # Mirrors frontend preset models (kept minimal + stable)
        return [
            {
                "id": "wayanad-classic",
                "name": "Wayanad Classic",
                "soilType": "laterite",
                "difficulty": "Beginner",
                "acres": 2,
                "estimatedYield": "390 Quintals",
                "estimatedRevenue": "₹13.5L/year",
                "cropSchedule": {
                    "overstory": {"crop": "Coconut Palm", "spacing": 8, "plants": 146},
                    "middle": {"crop": "Banana", "spacing": 3, "plants": 900},
                    "understory": {"crop": "Turmeric", "spacing": 50, "plants": 45000},
                    "vertical": {"crop": "Black Pepper", "perTree": 2, "total": 292},
                },
            },
            {
                "id": "karnataka-spice",
                "name": "Karnataka Spice Garden",
                "soilType": "laterite",
                "difficulty": "Intermediate",
                "acres": 3,
                "estimatedYield": "510 Quintals",
                "estimatedRevenue": "₹7.8L/year",
                "cropSchedule": {
                    "overstory": {"crop": "Silver Oak", "spacing": 10, "plants": 140},
                    "middle": {"crop": "Papaya", "spacing": 2.5, "plants": 1940},
                    "understory": {"crop": "Cardamom", "spacing": 40, "plants": 55000},
                    "vertical": {"crop": "Vanilla", "perTree": 3, "total": 420},
                },
            },
            {
                "id": "tamil-nadu-tropical",
                "name": "Tamil Nadu Tropical Mix",
                "soilType": "red",
                "difficulty": "Beginner",
                "acres": 1.5,
                "estimatedYield": "280 Quintals",
                "estimatedRevenue": "₹15.9L/year",
                "cropSchedule": {
                    "overstory": {"crop": "Mango", "spacing": 9, "plants": 87},
                    "middle": {"crop": "Guava", "spacing": 4, "plants": 380},
                    "understory": {"crop": "Ginger", "spacing": 50, "plants": 30000},
                    "vertical": {"crop": "Betel Leaf", "perTree": 2, "total": 174},
                },
            },
            {
                "id": "andhra-commercial",
                "name": "Andhra Commercial Model",
                "soilType": "alluvial",
                "difficulty": "Advanced",
                "acres": 4,
                "estimatedYield": "1,200 Quintals",
                "estimatedRevenue": "₹20.0L/year",
                "cropSchedule": {
                    "overstory": {"crop": "Areca Nut", "spacing": 7, "plants": 381},
                    "middle": {"crop": "Jackfruit", "spacing": 3.5, "plants": 1320},
                    "understory": {"crop": "Pineapple", "spacing": 40, "plants": 70000},
                    "vertical": {"crop": "Passion Fruit", "perTree": 3, "total": 1143},
                },
            },
            {
                "id": "maharashtra-balanced",
                "name": "Maharashtra Coconut-Mango System",
                "soilType": "black",
                "difficulty": "Intermediate",
                "acres": 2.5,
                "estimatedYield": "520 Quintals",
                "estimatedRevenue": "₹26.2L/year",
                "cropSchedule": {
                    "overstory": {"crop": "Coconut Palm", "spacing": 8, "plants": 182},
                    "middle": {"crop": "Mango", "spacing": 3, "plants": 1000},
                    "understory": {"crop": "Turmeric", "spacing": 50, "plants": 55000},
                    "vertical": {"crop": "Black Pepper", "perTree": 2, "total": 364},
                },
            },
            {
                "id": "coconut-cocoa-premium",
                "name": "Coconut-Cocoa Premium Spice",
                "soilType": "laterite",
                "difficulty": "Intermediate",
                "acres": 3,
                "estimatedYield": "132 Quintals",
                "estimatedRevenue": "₹17.5L/year",
                "cropSchedule": {
                    "overstory": {"crop": "Coconut Palm", "spacing": 8, "plants": 219},
                    "middle": {"crop": "Cocoa", "spacing": 3, "plants": 1350},
                    "understory": {"crop": "Cardamom", "spacing": 40, "plants": 55000},
                    "vertical": {"crop": "Black Pepper + Vanilla", "perTree": 2, "total": 438},
                },
            },
        ]

    def _estimate_budget_breakdown(self, *, acres: float, model: Dict[str, Any]) -> Dict[str, float]:
        # Simple parametric budget model (tuneable)
        # Base costs per acre (INR)
        base_saplings = 35000.0
        base_irrigation = 25000.0
        base_labor_tools = 20000.0
        base_soil = 12000.0

        difficulty = (model.get("difficulty") or "Intermediate").lower()
        diff_mult = 1.0
        if "advanced" in difficulty:
            diff_mult = 1.25
        elif "beginner" in difficulty:
            diff_mult = 0.95

        saplings_and_seeds = acres * base_saplings * diff_mult
        irrigation_and_plumbing = acres * base_irrigation * 1.0
        labor_and_tools = acres * base_labor_tools * diff_mult
        soil_amendments = acres * base_soil * 1.0
        contingency = 0.12 * (saplings_and_seeds + irrigation_and_plumbing + labor_and_tools + soil_amendments)
        total = saplings_and_seeds + irrigation_and_plumbing + labor_and_tools + soil_amendments + contingency

        return {
            "saplings_and_seeds": round(saplings_and_seeds, 2),
            "irrigation_and_plumbing": round(irrigation_and_plumbing, 2),
            "labor_and_tools": round(labor_and_tools, 2),
            "soil_amendments": round(soil_amendments, 2),
            "contingency": round(contingency, 2),
            "total": round(total, 2),
        }

    def _parse_revenue_mid_inr(self, revenue_str: str) -> float:
        # Examples: "₹13.5L/year", "₹7.8L/year"
        s = (revenue_str or "").replace("₹", "").lower()
        num = 0.0
        try:
            # keep digits + dot
            cleaned = "".join(ch for ch in s if (ch.isdigit() or ch == "."))
            num = float(cleaned) if cleaned else 0.0
        except Exception:
            num = 0.0
        # If original had 'l', treat as lakhs
        if "l" in s:
            return num * 100000.0
        return num

    def _revenue_range_inr(self, revenue_str: str, *, acres: float, base_acres: float) -> List[float]:
        mid = self._parse_revenue_mid_inr(revenue_str)
        if base_acres <= 0:
            base_acres = acres
        scaled_mid = mid * (acres / base_acres)
        low = scaled_mid * 0.85
        high = scaled_mid * 1.15
        return [round(low, 2), round(high, 2)]

    def _parse_yield_score(self, yield_str: str) -> float:
        # Examples: "390 Quintals", "1,200 Quintals"
        s = (yield_str or "").lower().replace(",", "")
        digits = "".join(ch for ch in s if (ch.isdigit() or ch == "."))
        try:
            val = float(digits) if digits else 0.0
        except Exception:
            val = 0.0
        return math.log1p(val) / 10.0

    def _difficulty_risk_score(self, difficulty: str) -> float:
        d = (difficulty or "").lower()
        if "advanced" in d:
            return 0.9
        if "beginner" in d:
            return 0.3
        return 0.6

    def _build_why(self, *, acres: float, soil_type: str, budget_inr: float, model: Dict[str, Any], breakdown: Dict[str, float], feasibility: float) -> List[str]:
        why = []
        if model.get("soilType") == soil_type:
            why.append(f"Soil match: optimized for {soil_type} soil.")
        else:
            why.append("Best-effort soil fit: no exact soil match found; picked highest overall score.")

        why.append(f"Budget fit: estimated setup cost ₹{breakdown['total']:,.0f} vs your budget ₹{budget_inr:,.0f}.")
        if feasibility < 1.0:
            why.append("Because budget is tight, consider reducing acreage for Year 1, or choosing lower-cost irrigation + phased planting.")
        why.append(f"Goal alignment: tuned for '{model.get('difficulty','')}' difficulty and your goal preference.")
        why.append("Plan output includes an 'Apply to Strata' payload so you can instantly load the plan into the designer.")
        return why

    def _build_apply_payload(self, *, acres: float, model: Dict[str, Any]) -> Dict[str, Any]:
        # Compatible with existing strata.html apply flow: pendingModel with cropSchedule + acres + soilType + name
        payload = {
            "id": model["id"],
            "name": model["name"],
            "soilType": model.get("soilType"),
            "acres": acres,
            "cropSchedule": model.get("cropSchedule"),
        }
        return payload

    def _tiers_from_model(self, *, model: Dict[str, Any], acres: float) -> List[Dict[str, Any]]:
        sched = model.get("cropSchedule") or {}
        base_acres = float(model.get("acres") or acres)
        ratio = acres / base_acres if base_acres > 0 else 1.0

        def scale(n: Any) -> int:
            try:
                return int(round(float(n) * ratio))
            except Exception:
                return 0

        tiers = []
        if sched.get("overstory"):
            tiers.append({"tier": "Overstory", "crop": sched["overstory"]["crop"], "spacing": sched["overstory"].get("spacing"), "spacing_unit": "m", "count": scale(sched["overstory"].get("plants"))})
        if sched.get("middle"):
            tiers.append({"tier": "Middle", "crop": sched["middle"]["crop"], "spacing": sched["middle"].get("spacing"), "spacing_unit": "m", "count": scale(sched["middle"].get("plants"))})
        if sched.get("understory"):
            tiers.append({"tier": "Understory", "crop": sched["understory"]["crop"], "spacing": sched["understory"].get("spacing"), "spacing_unit": "cm", "count": scale(sched["understory"].get("plants"))})
        if sched.get("vertical"):
            vertical_crop = sched["vertical"]["crop"]
            per_tree = sched["vertical"].get("perTree")
            total = sched["vertical"].get("total")
            tiers.append({"tier": "Vertical", "crop": vertical_crop, "spacing": per_tree, "spacing_unit": "per tree", "count": scale(total)})
        return tiers
