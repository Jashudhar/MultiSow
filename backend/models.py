from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Stratum(Base):
    """
    Represents a vertical layer in the crop system (e.g., Overstory, Understory).
    """
    __tablename__ = "strata"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)

    crops = relationship("Crop", back_populates="stratum")

class Crop(Base):
    """
    Represents a crop type compatible with the system.
    """
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    stratum_id = Column(Integer, ForeignKey("strata.id"))
    light_requirement = Column(String)  # e.g., "High", "Medium", "Low"
    created_at = Column(DateTime, default=datetime.utcnow)

    stratum = relationship("Stratum", back_populates="crops")
    plot_crops = relationship("PlotCrop", back_populates="crop")

class Plot(Base):
    """
    Represents a user-defined garden plot.
    """
    __tablename__ = "plots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    plot_crops = relationship("PlotCrop", back_populates="plot")

class PlotCrop(Base):
    """
    Represents a specific instance of a crop placed in a plot.
    """
    __tablename__ = "plot_crops"

    id = Column(Integer, primary_key=True, index=True)
    plot_id = Column(Integer, ForeignKey("plots.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    x_position = Column(Float)
    y_position = Column(Float)

    plot = relationship("Plot", back_populates="plot_crops")
    crop = relationship("Crop", back_populates="plot_crops")
