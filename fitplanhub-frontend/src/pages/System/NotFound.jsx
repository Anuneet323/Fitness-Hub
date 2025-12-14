// src/pages/System/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="max-w-md w-full px-6 py-8 rounded-2xl bg-white border border-orange-100 shadow-md text-center">
        <p className="text-xs font-semibold tracking-[0.25em] text-orange-500 mb-2 uppercase">
          404 error
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 shadow-md"
          >
            <Home className="w-4 h-4" />
            Go to homepage
          </button>
        </div>
      </div>
    </div>
  );
}
