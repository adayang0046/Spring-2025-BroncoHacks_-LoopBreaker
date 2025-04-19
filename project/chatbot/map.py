import pandas as pd
import geopandas as gpd
import os
from shapely.geometry import Point

# Load your fire CSV
df = pd.read_csv("static/modis_2023_United_States.csv")

# Convert to GeoDataFrame
gdf = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df.longitude, df.latitude),
    crs="EPSG:4326"
)

# Save as GeoJSON for Leaflet

gdf.to_file("chatbot/static/fires.geojson", driver="GeoJSON")
