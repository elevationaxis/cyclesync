import AppNavigation from '../AppNavigation';
import { useState } from 'react';

export default function AppNavigationExample() {
  const [isPartner, setIsPartner] = useState(false);
  
  return (
    <div>
      <AppNavigation 
        isPartnerView={isPartner} 
        onTogglePartnerView={() => setIsPartner(!isPartner)} 
      />
      <div className="p-6">
        <p className="text-muted-foreground">Navigation bar is sticky at the top. Try scrolling or changing the view mode.</p>
      </div>
    </div>
  );
}
