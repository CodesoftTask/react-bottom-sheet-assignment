import React, { useRef, useEffect, useState } from "react";
import "./BottomSheet.css";

const snapPoints = {
  closed: window.innerHeight,
  half: window.innerHeight / 2,
  full: 80,
};

const BottomSheet = () => {
  const [currentY, setCurrentY] = useState(snapPoints.closed);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(null);
  const startHeightRef = useRef(null);

  useEffect(() => {
    moveTo(snapPoints.half);
  }, []);

  const moveTo = (targetY) => {
    let frame;
    const animate = () => {
      setCurrentY((prevY) => {
        const delta = (targetY - prevY) * 0.35;
        const nextY = prevY + delta;
        if (Math.abs(delta) < 1) {
          cancelAnimationFrame(frame);
          return targetY;
        }
        frame = requestAnimationFrame(animate);
        return nextY;
      });
    };
    frame = requestAnimationFrame(animate);
  };

  const handleTouchStart = (e) => {
    setDragging(true);
    startYRef.current = e.touches[0].clientY;
    startHeightRef.current = currentY;
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    let newY = startHeightRef.current + deltaY;
    newY = Math.max(snapPoints.full, Math.min(newY, snapPoints.closed));
    setCurrentY(newY);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    const nearestSnap = Object.values(snapPoints).reduce((a, b) =>
      Math.abs(b - currentY) < Math.abs(a - currentY) ? b : a
    );
    moveTo(nearestSnap);
  };

  return (
    <>
      <div className="buttons">
        <button onClick={() => moveTo(snapPoints.full)}>🔓 Open Full</button>
        <button onClick={() => moveTo(snapPoints.half)}>🌓 Open Half</button>
        <button onClick={() => moveTo(snapPoints.closed)}>🔒 Close</button>
      </div>

      <div
        className="bottom-sheet"
        style={{
          transform: `translateY(${currentY}px)`,
          transition: 'transform 0.15s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="handle" />
        <div className="content">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>📌</span>
            <h2>Welcome to Smart Bottom Sheet</h2>
          </div>

          <p style={{ fontSize: '16px', color: '#555' }}>
            This bottom sheet smoothly snaps to multiple positions using spring-like animation. Try dragging or pressing the buttons to explore!
          </p>

          <div style={{ marginTop: '20px', background: '#f1f5f9', padding: '10px', borderRadius: '8px' }}>
            <strong>💡 Tip:</strong> Works great on both desktop and mobile. Give it a try!
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
            👆 Try dragging this sheet — it listens to you!
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
