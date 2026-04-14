import { useEffect } from 'react';

export default function GoogleAdSense({ 
  adSlot, 
  adFormat = 'auto',
  fullWidth = true 
}) {
  useEffect(() => {
    // Push ads configuration if available
    if (window.adsbygoogle === undefined) {
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        margin: '20px 0',
        minHeight: '250px'
      }}
    >
      <ins 
        className="adsbygoogle"
        style={{
          display: 'block',
          ...(fullWidth ? { width: '100%' } : {}),
        }}
        data-ad-client="ca-pub-5782400203327623"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
