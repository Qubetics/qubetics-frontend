"use client";

import React, { useState, useEffect, useCallback } from "react";
import useProviderSearch from "@/hooks/useProviderSearch";
import {
  isValidProviderAddress,
  formatProviderAddress,
} from "@/utils/providerUtils";

/**
 * Reusable Provider Address Search Input Component
 * @param {Object} props - Component props
 * @param {Function} props.onProviderFound - Callback when provider is found
 * @param {Function} props.onProviderNotFound - Callback when provider is not found
 * @param {string} props.placeholder - Input placeholder text
 * @param {boolean} props.autoSearch - Auto search on input change (debounced)
 * @param {boolean} props.showFormatted - Show formatted address in results
 */
export default function ProviderAddressInput({
  onProviderFound,
  onProviderNotFound,
  placeholder = "Enter provider address (qubeticsprov...)",
  autoSearch = false,
  showFormatted = true,
  className = "",
}) {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, providerData, searchProvider, reset } =
    useProviderSearch();

  // Debounce effect for auto-search
  useEffect(() => {
    if (!autoSearch || !inputValue) return;

    const timeoutId = setTimeout(() => {
      if (isValidProviderAddress(inputValue)) {
        setSearchTerm(inputValue);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, autoSearch]);

  // Trigger search when searchTerm changes
  useEffect(() => {
    if (searchTerm && isValidProviderAddress(searchTerm)) {
      handleSearch(searchTerm);
    }
  }, [searchTerm]);

  // Handle provider found/not found callbacks
  useEffect(() => {
    if (providerData && onProviderFound) {
      onProviderFound(providerData);
    }
  }, [providerData, onProviderFound]);

  useEffect(() => {
    if (error && onProviderNotFound) {
      onProviderNotFound(error);
    }
  }, [error, onProviderNotFound]);

  const handleSearch = async (address) => {
    const result = await searchProvider(address || inputValue);
    return result;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Reset state when input changes
    if (error || providerData) {
      reset();
    }
  };

  const handleManualSearch = () => {
    if (inputValue && isValidProviderAddress(inputValue)) {
      handleSearch(inputValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleManualSearch();
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchTerm("");
    reset();
  };

  const isValidInput = inputValue && isValidProviderAddress(inputValue);

  return (
    <div className={`provider-address-input ${className}`}>
      <div
        className="input-wrapper"
        style={{ position: "relative", marginBottom: "10px" }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="provider-input"
          style={{
            width: "100%",
            padding: "12px 80px 12px 12px",
            fontSize: "14px",
            border: `2px solid ${error ? "#dc3545" : providerData ? "#28a745" : "#dee2e6"}`,
            borderRadius: "8px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
        />

        <div
          className="input-actions"
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            gap: "4px",
          }}
        >
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
              style={{
                padding: "6px 12px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}

          {!autoSearch && (
            <button
              type="button"
              onClick={handleManualSearch}
              disabled={loading || !isValidInput}
              className="search-btn"
              style={{
                padding: "6px 12px",
                backgroundColor: loading || !isValidInput ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: loading || !isValidInput ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "..." : "Search"}
            </button>
          )}
        </div>
      </div>

      {/* Validation hint */}
      {inputValue && !isValidInput && (
        <div
          className="validation-hint"
          style={{
            fontSize: "12px",
            color: "#dc3545",
            marginBottom: "8px",
          }}
        >
          ⚠️ Address must start with "qubeticsprov"
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div
          className="loading-indicator"
          style={{
            padding: "8px",
            backgroundColor: "#e7f3ff",
            border: "1px solid #b3d9ff",
            borderRadius: "4px",
            fontSize: "13px",
            color: "#004085",
            marginBottom: "8px",
          }}
        >
          🔍 Searching...
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div
          className="error-message"
          style={{
            padding: "10px",
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
            fontSize: "13px",
            color: "#721c24",
            marginBottom: "8px",
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Success message with provider data */}
      {providerData && !loading && (
        <div
          className="success-message"
          style={{
            padding: "12px",
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
            fontSize: "13px",
            color: "#155724",
          }}
        >
          <div style={{ marginBottom: "6px", fontWeight: "600" }}>
            ✅ Provider Found!
          </div>
          <div style={{ fontSize: "12px", fontFamily: "monospace" }}>
            {showFormatted
              ? formatProviderAddress(providerData.provider || inputValue)
              : providerData.provider || inputValue}
          </div>
        </div>
      )}
    </div>
  );
}
