"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/lib/utils/cropImage";
import { useTranslations } from "@/i18n/client";
import { Crop, RotateCw, X, ZoomIn } from "lucide-react";

interface PhotoCropDialogProps {
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onComplete: (croppedImage: string) => void;
}

export function PhotoCropDialog({ imageSrc, open, onClose, onComplete }: PhotoCropDialogProps) {
  const t = useTranslations("photoCrop");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropShape, setCropShape] = useState<"rect" | "round">("rect");
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onComplete(croppedImage);
    } catch {
      // Error handled by parent
    } finally {
      setIsProcessing(false);
    }
  }, [croppedAreaPixels, imageSrc, rotation, onComplete]);

  const handleReset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-2xl mx-4 bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Crop className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{t("title")}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Crop Area */}
        <div className="relative h-100 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={3 / 4}
            cropShape={cropShape}
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="px-6 py-4 space-y-4 border-t">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium w-16 shrink-0">{t("zoom")}</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-sm text-muted-foreground w-12 text-right">{zoom.toFixed(1)}x</span>
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-3">
            <RotateCw className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium w-16 shrink-0">{t("rotation")}</span>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-sm text-muted-foreground w-12 text-right">{rotation}°</span>
          </div>

          {/* Shape Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{t("shape")}:</span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={cropShape === "rect" ? "default" : "outline"}
                size="sm"
                onClick={() => setCropShape("rect")}
              >
                {t("rect")}
              </Button>
              <Button
                type="button"
                variant={cropShape === "round" ? "default" : "outline"}
                size="sm"
                onClick={() => setCropShape("round")}
              >
                {t("round")}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            {t("reset")}
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="button" onClick={handleCrop} disabled={isProcessing || !croppedAreaPixels} className="gap-2">
              <Crop className="h-4 w-4" />
              {isProcessing ? t("processing") : t("crop")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
