// components/ErrorBoundary.tsx
"use client";

import Page from "@/app/(routes)/notfound/page";
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render the NotFoundPage component as the fallback UI
      return <Page />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
