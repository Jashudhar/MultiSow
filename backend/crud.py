from sqlalchemy.orm import Session
from . import models, schemas

def get_stratum_by_name(db: Session, name: str):
    return db.query(models.Stratum).filter(models.Stratum.name == name).first()

def create_stratum(db: Session, stratum: schemas.StratumBase):
    db_stratum = models.Stratum(name=stratum.name, description=stratum.description)
    db.add(db_stratum)
    db.commit()
    db.refresh(db_stratum)
    return db_stratum

def get_crops(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Crop).offset(skip).limit(limit).all()

def create_crop(db: Session, crop: schemas.CropCreate):
    db_crop = models.Crop(**crop.dict())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

def create_plot(db: Session, plot: schemas.PlotCreate):
    db_plot = models.Plot(name=plot.name)
    db.add(db_plot)
    db.commit()
    db.refresh(db_plot)
    return db_plot

def get_plot(db: Session, plot_id: int):
    return db.query(models.Plot).filter(models.Plot.id == plot_id).first()

def add_crop_to_plot(db: Session, plot_crop: schemas.PlotCropCreate, plot_id: int):
    db_plot_crop = models.PlotCrop(**plot_crop.dict(), plot_id=plot_id)
    db.add(db_plot_crop)
    db.commit()
    db.refresh(db_plot_crop)
    return db_plot_crop
