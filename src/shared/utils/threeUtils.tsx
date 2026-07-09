import React from 'react';

// Mouse event handlers
export function onPointerDown(
    modelRef: React.MutableRefObject<boolean>,
    last: React.MutableRefObject<[number, number]>,
    e: React.MouseEvent<HTMLDivElement>
) {
    modelRef.current = true;
    last.current = [e.clientX, e.clientY];
}

export function onPointerUp(modelRef: React.MutableRefObject<boolean>) {
    modelRef.current = false;
}

export function onPointerMove(
    modelRef: React.MutableRefObject<boolean>,
    last: React.MutableRefObject<[number, number]>,
    e: React.MouseEvent<HTMLDivElement>,
    setRotation: React.Dispatch<React.SetStateAction<[number, number, number]>>
) {
    if (!modelRef.current) return;
    const [lx, ly] = last.current;
    const dx = e.clientX - lx;
    const dy = e.clientY - ly;
    setRotation(([rx, ry, rz]) => [Math.max(0, rx + dy * 0.01), ry + dx * 0.01, rz] as [number, number, number]);
    last.current = [e.clientX, e.clientY];
}

export function onWheel(e: React.WheelEvent, setZoom: React.Dispatch<React.SetStateAction<number>>) {
    e.preventDefault();
    setZoom(z => Math.max(1, Math.min(20, z + e.deltaY * 0.01)));
}

// Shared rotation math, reusable by both mouse and touch move handlers
export function computeRotationDelta(
    lastX: number,
    lastY: number,
    currentX: number,
    currentY: number,
    setRotation: React.Dispatch<React.SetStateAction<[number, number, number]>>
) {
    const dx = currentX - lastX;
    const dy = currentY - lastY;
    setRotation(([rx, ry, rz]) => [Math.max(0, rx + dy * 0.01), ry + dx * 0.01, rz] as [number, number, number]);
}