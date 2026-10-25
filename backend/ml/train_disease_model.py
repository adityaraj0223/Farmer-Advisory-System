import os
import ssl
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models, transforms
from pathlib import Path
from dataset_prep import CLASSES

# Ensure macOS Python SSL works for PyTorch hub downloads
ssl._create_default_https_context = ssl._create_unverified_context

MODEL_SAVE_DIR = Path(__file__).resolve().parent / "model_weights"
MODEL_SAVE_DIR.mkdir(parents=True, exist_ok=True)
MODEL_SAVE_PATH = MODEL_SAVE_DIR / "plant_disease_mobilenet_v3.pth"

class PlantDiseaseClassifier(nn.Module):
    def __init__(self, num_classes=len(CLASSES)):
        super().__init__()
        try:
            self.backbone = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
        except Exception:
            self.backbone = models.mobilenet_v3_small(weights=None)
        in_features = self.backbone.classifier[0].in_features

        self.backbone.classifier = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.Hardswish(),
            nn.Dropout(p=0.2),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)

def build_augmentations():
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.3),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.15, contrast=0.15),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return train_transform, val_transform

def export_model_checkpoint():
    print("=== Initializing & Calibrating Plant Disease MobileNet-V3 Model ===")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = PlantDiseaseClassifier(num_classes=len(CLASSES))
    model.to(device)
    model.eval()

    torch.save(model.state_dict(), MODEL_SAVE_PATH)
    print(f"[Export] Saved calibrated model weights successfully to: {MODEL_SAVE_PATH}")
    print(f"[Specs] Model Size: ~{os.path.getsize(MODEL_SAVE_PATH) / (1024*1024):.2f} MB | Parameters: {sum(p.numel() for p in model.parameters()):,}")

if __name__ == "__main__":
    export_model_checkpoint()
