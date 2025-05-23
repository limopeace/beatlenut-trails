import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faStore, 
  faClipboardCheck, 
  faEnvelope, 
  faUserShield 
} from '@fortawesome/free-solid-svg-icons';

const MobileAdminNav: React.FC = () => {
  const pathname = usePathname();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: faHome 
    },
    { 
      name: 'Sellers', 
      path: '/admin/sellers', 
      icon: faStore 
    },
    { 
      name: 'Approvals', 
      path: '/admin/approvals', 
      icon: faClipboardCheck 
    },
    { 
      name: 'Messages', 
      path: '/admin/messages', 
      icon: faEnvelope 
    },
    { 
      name: 'Account', 
      path: '/admin/account', 
      icon: faUserShield 
    }
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = 
            (item.path === '/admin' && pathname === '/admin') || 
            (item.path !== '/admin' && pathname.startsWith(item.path));
            
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center py-3 px-2 flex-1 ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon 
                icon={item.icon} 
                className="h-5 w-5 mb-1" 
              />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileAdminNav;