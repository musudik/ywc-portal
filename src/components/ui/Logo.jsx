import React from "react";
import logoGif from "../../assets/YWC.gif";

// Modern YWC Logo using GIF
const Logo = ({ width = 100, height = 100, className = "" }) => (
  <img 
    src={logoGif} 
    alt="YourWealth.Coach Logo" 
    width={width} 
    height={height}
    className={className}
    style={{ objectFit: "contain" }}
  />
);

// Simple version for small spaces
export const LogoIcon = ({ width = 24, height = 24, className = "" }) => (
  <img 
    src={logoGif} 
    alt="YWC Logo" 
    width={width} 
    height={height}
    className={className}
    style={{ objectFit: "contain" }}
  />
);

export default Logo; 