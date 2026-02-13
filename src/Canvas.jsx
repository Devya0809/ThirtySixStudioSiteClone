import { useEffect, useRef, useState } from "react";
import canvasImages from "./canvasimages";
import gsap from "gsap";

function Canvas({ details }) {
  console.log("🎨 Canvas component STARTED with details:", details);
  
  const { startIndex, numImages, duration, size, top, left, zIndex } = details;
  const [index, setIndex] = useState({ value: startIndex });
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  console.log("🎨 Canvas initialized - startIndex:", startIndex, "numImages:", numImages);

  // GSAP Animation
  useEffect(() => {
    console.log("🎬 Setting up GSAP animation for canvas at startIndex:", startIndex);
    
    try {
      // Create GSAP animation
      animationRef.current = gsap.to(index, {
        value: startIndex + numImages - 1,
        duration: duration,
        repeat: -1,
        ease: "linear",
        onUpdate: () => {
          setIndex({ value: Math.round(index.value) });
        },
      });

      console.log("✅ GSAP animation created successfully");

      // Fade in animation
      if (canvasRef.current) {
        gsap.from(canvasRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        });
        console.log("✅ Fade-in animation applied");
      }
    } catch (error) {
      console.error("❌ Error creating GSAP animation:", error);
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
        console.log("🧹 GSAP animation cleaned up");
      }
    };
  }, [startIndex, numImages, duration]);

  // Canvas Drawing
  useEffect(() => {
    console.log("🖼️ Drawing image to canvas - index:", index.value);
    
    // Add null check
    if (!canvasRef.current) {
      console.warn("⚠️ Canvas ref is null");
      return;
    }

    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    const imageUrl = canvasImages[index.value];
    console.log("📥 Loading image:", imageUrl);
    
    img.src = imageUrl;
    
    img.onload = () => {
      console.log("✅ Image loaded successfully:", imageUrl);
      
      // Add check to ensure canvas still exists
      if (!canvas || !ctx) {
        console.warn("⚠️ Canvas or context is null during image load");
        return;
      }
      
      try {
        canvas.width = canvas.offsetWidth * scale;
        canvas.height = canvas.offsetHeight * scale;
        canvas.style.width = canvas.offsetWidth + "px";
        canvas.style.height = canvas.offsetHeight + "px";
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        console.log("✅ Image drawn to canvas");
      } catch (error) {
        console.error("❌ Error drawing image to canvas:", error);
      }
    };

    img.onerror = (error) => {
      console.error("❌ Failed to load image:", imageUrl, error);
    };

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [index]);

  console.log("🎨 Canvas rendering JSX with size:", size, "position:", {top, left});

  return (
    <canvas
      data-scroll
      data-scroll-speed={Math.random().toFixed(1)}
      ref={canvasRef}
      className="absolute"
      style={{
        width: `${size * 1.8}px`,
        height: `${size * 1.8}px`,
        top: `${top}%`,
        left: `${left}%`,
        zIndex: `${zIndex}`,
      }}
      id="canvas"
    ></canvas>
  );
}

export default Canvas;
