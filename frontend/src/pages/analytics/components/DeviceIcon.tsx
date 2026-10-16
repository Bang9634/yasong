import { Monitor, Smartphone, Tablet } from 'lucide-react';

export const getDeviceIcon = (deviceCategory: string) => {
  switch (deviceCategory.toLowerCase()) {
    case 'desktop':
      return <Monitor className="w-5 h-5" />;
    case 'mobile':
      return <Smartphone className="w-5 h-5" />;
    case 'tablet':
      return <Tablet className="w-5 h-5" />;
    default:
      return <Monitor className="w-5 h-5" />;
  }
};
