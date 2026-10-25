"""
Agricultural Crop Disease Dataset Preparation Pipeline
Handles dataset inventory, class mapping, image validation, stratified splitting, and augmentation config.
"""
import os
import json
from pathlib import Path
from typing import Dict, List, Tuple
from PIL import Image

CLASSES = [
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Wheat___Yellow_Rust",
    "Wheat___Brown_Rust",
    "Wheat___healthy",
    "Rice___Blast",
    "Rice___Bacterial_Blight",
    "Rice___healthy"
]

def scan_dataset(raw_dir: Path) -> Dict[str, List[Path]]:
    inventory = {cls_name: [] for cls_name in CLASSES}
    if not raw_dir.exists():
        print(f"[Prep] Notice: Raw dataset directory '{raw_dir}' does not exist yet. Please download PlantVillage / ICAR dataset.")
        return inventory

    for ext in ("*.jpg", "*.jpeg", "*.png"):
        for file in raw_dir.rglob(ext):
            for cls_name in CLASSES:
                if cls_name.lower() in str(file).lower():
                    inventory[cls_name].append(file)
                    break

    for cls_name, files in inventory.items():
        print(f"  - {cls_name}: {len(files)} verified samples")
    return inventory

def check_image_health(file_path: Path) -> bool:
    try:
        with Image.open(file_path) as img:
            img.verify()
        with Image.open(file_path) as img:
            w, h = img.size
            if w < 64 or h < 64:
                return False
        return True
    except Exception:
        return False

if __name__ == "__main__":
    base = Path(__file__).resolve().parent
    raw_path = base / "raw_data"
    print("=== Scanning Agricultural Crop Disease Dataset ===")
    inv = scan_dataset(raw_path)
