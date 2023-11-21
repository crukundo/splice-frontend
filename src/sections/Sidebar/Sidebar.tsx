import React from 'react';

import { DashboardNav } from '@/components/nav';
import { dashboardConfig } from '@/config';

function Sidebar() {

  return (
    <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
  );
}

export default Sidebar;
