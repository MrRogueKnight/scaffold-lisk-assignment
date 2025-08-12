"use client";

import { useEffect } from "react";

export default function MinimalPage() {
  useEffect(() => {
    console.log("Minimal test page mounted");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center p-8 bg-base-100 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Minimal Test Page</h1>
        <p className="mb-4">This is a minimal test page for debugging purposes.</p>
      </div>
    </div>
  );
}
