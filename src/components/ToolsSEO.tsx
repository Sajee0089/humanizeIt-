import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

export const ToolsSEORedirect: React.FC = () => {
  const { tool } = useParams<{ tool: string }>();

  switch (tool) {
    case 'ai-humanizer':
      return <Navigate to="/humanize" replace />;
    case 'ai-detector':
      return <Navigate to="/detect" replace />;
    case 'plagiarism-checker':
      return <Navigate to="/plagiarism" replace />;
    case 'ai-summarizer':
      return <Navigate to="/summarize" replace />;
    case 'image-detector':
      return <Navigate to="/image-detect" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};
