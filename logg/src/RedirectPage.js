import React from 'react';
import { useParams } from 'react-router-dom';

function RedirectPage() {
  const { shortCode } = useParams();

  // This is a placeholder, ideally you would call your FastAPI backend to get the long URL
  return <div>Redirecting for short code: {shortCode}</div>;
}

export default RedirectPage;
