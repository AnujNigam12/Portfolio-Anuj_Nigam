import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Move, Check } from 'lucide-react';

const ImageCropperModal = ({ isOpen, onClose, imageSrc, onCropComplete }) => {
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageSrc) {
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imageRef.current = img;
        drawPreview();
      };
    }
  }, [imageSrc]);

  useEffect(() => {
    drawPreview();
  }, [zoom, offsetX, offsetY]);

  const drawPreview = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Save context state
    ctx.save();

    // Draw background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, size, size);

    // Calculate dimensions
    const scale = Math.max(size / img.width, size / img.height) * zoom;
    const width = img.width * scale;
    const height = img.height * scale;

    const x = (size - width) / 2 + offsetX;
    const y = (size - height) / 2 + offsetY;

    ctx.drawImage(img, x, y, width, height);

    // Draw dark overlay outside circular crop area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw circular border ring
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const outputCanvas = document.createElement('canvas');
    const outputSize = 400;
    outputCanvas.width = outputSize;
    outputCanvas.height = outputSize;
    const ctx = outputCanvas.getContext('2d');

    // Make output circular clip
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.clip();

    const scale = Math.max(outputSize / img.width, outputSize / img.height) * zoom;
    const width = img.width * scale;
    const height = img.height * scale;

    const x = (outputSize - width) / 2 + (offsetX * (outputSize / 300));
    const y = (outputSize - height) / 2 + (offsetY * (outputSize / 300));

    ctx.drawImage(img, x, y, width, height);

    const croppedDataUrl = outputCanvas.toDataURL('image/png');
    onCropComplete(croppedDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Move className="w-5 h-5 text-blue-500" />
            <span>Adjust & Frame Photo</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Drag the photo or use the zoom & position controls below to center your face inside the circle.
        </p>

        {/* Canvas Cropper Preview */}
        <div className="flex justify-center items-center py-2">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="rounded-2xl cursor-grab active:cursor-grabbing shadow-inner border border-gray-700 select-none touch-none"
          />
        </div>

        {/* Controls */}
        <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800">
          {/* Zoom Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5 text-blue-500" />
                <span>Zoom Level</span>
              </span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Position Sliders */}
          <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-700 dark:text-gray-300">
            <div>
              <label className="block mb-1">Pan Left / Right</label>
              <input
                type="range"
                min="-120"
                max="120"
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <label className="block mb-1">Pan Up / Down</label>
              <input
                type="range"
                min="-120"
                max="120"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <Check className="w-4 h-4" />
            <span>Apply Photo Crop</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
