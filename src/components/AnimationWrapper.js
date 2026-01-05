"use client";
import Lottie from "lottie-react";

export default function AnimationWrapper({ animationData, className }) {
  return (
    <div className={className}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}