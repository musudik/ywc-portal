import React, { useRef, useState, useEffect } from "react";
import { Button } from "./button";

/**
 * SignatureCanvas component for capturing signatures via mouse or touch
 * @param {Object} props - Component props
 * @param {Function} props.onSignatureChange - Callback when signature changes, receives data URL
 * @param {number} props.width - Canvas width (default: 400)
 * @param {number} props.height - Canvas height (default: 150)
 * @param {string} props.clearButtonText - Text for clear button (default: "Clear Signature")
 */
const SignatureCanvas = ({ 
  onSignatureChange, 
  width = 400, 
  height = 150, 
  clearButtonText = "Clear Signature" 
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  
  // Initialize canvas once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Match canvas internal dimensions to its display size to prevent scaling issues
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "black";
    context.lineWidth = 2.5;
    
    // Store context in ref for easy access
    contextRef.current = context;
    
  }, []);
  
  // Add window resize handler to adjust canvas size when parent container changes
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      
      // Save current drawing
      const currentDrawing = canvas.toDataURL();
      
      // Update canvas dimensions
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Restore context properties
      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "black";
      context.lineWidth = 2.5;
      
      // Restore drawing if there was content
      if (hasContent) {
        const img = new Image();
        img.onload = () => {
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = currentDrawing;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasContent]);
  
  // Notify parent of changes
  const notifyChange = () => {
    if (onSignatureChange && canvasRef.current) {
      onSignatureChange(canvasRef.current.toDataURL());
    }
  };

  // Get precise coordinates from event
  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // For touch events
    if (event.touches && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }
    
    // For mouse events
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  // Start drawing
  const startDrawing = (event) => {
    event.preventDefault();
    const coords = getCoordinates(event);
    
    const context = contextRef.current;
    context.beginPath();
    context.moveTo(coords.x, coords.y);
    
    setIsDrawing(true);
    setHasContent(true);
  };

  // Draw while moving
  const draw = (event) => {
    if (!isDrawing) return;
    event.preventDefault();
    
    const coords = getCoordinates(event);
    
    const context = contextRef.current;
    context.lineTo(coords.x, coords.y);
    context.stroke();
    
    // Start a new path for the next segment
    context.beginPath();
    context.moveTo(coords.x, coords.y);
    
    notifyChange();
  };

  // Stop drawing
  const stopDrawing = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
      notifyChange();
    }
  };

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
    
    if (onSignatureChange) {
      onSignatureChange("");
    }
  };

  return (
    <div className="signature-canvas-container">
      <div className="border border-gray-300 rounded-md mb-2">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          style={{ 
            touchAction: "none",
            cursor: "pen",
            width: "100%",
            height: "150px",
            display: "block"
          }}
        />
      </div>
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={clearCanvas}
          className="text-sm"
          disabled={!hasContent}
        >
          {clearButtonText}
        </Button>
        {hasContent && (
          <span className="text-xs text-gray-500 italic self-center">
            You can continue drawing at any time
          </span>
        )}
      </div>
    </div>
  );
};

export default SignatureCanvas; 