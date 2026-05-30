"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function EditorTour() {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    // Check if the user has already seen the tour
    const hasSeenTour = localStorage.getItem("hasSeenEditorTour");
    if (hasSeenTour) return;

    // Delay to let React render canvas and components fully
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        allowClose: true,
        steps: [
          { 
            element: '.canvas-workarea-container', 
            popover: { 
              title: 'Welcome to the Editor!', 
              description: 'This is your canvas. You can drag, drop, and edit elements directly here.',
              side: "left", align: 'start'
            } 
          },
          { 
            element: '.left-panel-tabs', 
            popover: { 
              title: 'Assets & Layers', 
              description: 'Switch between pre-made templates and managing your current design layers.',
              side: "right", align: 'start'
            } 
          },
          { 
            element: '.right-panel-properties', 
            popover: { 
              title: 'Properties Panel', 
              description: 'When you select an element on the canvas, its styling options will automatically appear here.',
              side: "left", align: 'start'
            } 
          },
          { 
            element: '.export-btn-tour', 
            popover: { 
              title: 'Export Design', 
              description: 'Once you are happy with your masterpiece, click here to export it as a high-quality image.',
              side: "bottom", align: 'end'
            } 
          },
        ]
      });

      driverObj.drive();
      localStorage.setItem("hasSeenEditorTour", "true");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
