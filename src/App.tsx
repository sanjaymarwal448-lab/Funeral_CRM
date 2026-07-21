import React from 'react';
import { CRMProvider } from './context/CRMContext';
import { AppLayout } from './components/layout/AppLayout';

export function App() {
  return (
    <CRMProvider>
      <AppLayout />
    </CRMProvider>
  );
}

export default App;
