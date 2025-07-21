import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [

  {
    id: 1,
    label: "MENUITEMS.DASHBOARD.TEXT",
    icon: "ri-dashboard-2-line",
    link: "/dashboards",
    isCollapsed: false,
    
  },
  {
    id: 2,
    label: 'MENUITEMS.AUTHORIZATION.TEXT',
    icon: ' ri-rotate-lock-line',
    isCollapsed: false,
    subItems: [ 
      {
        id: 1,
        label: 'MENUITEMS.AUTHORIZATION.LIST.USERMANAGEMENT',
        link: '/auths/user-management',
        icon: ' ri-rotate-lock-line',
        parentId: 2
      },
    ]
  },
  {
    id: 3,
    label: 'MENUITEMS.POS.TEXT',
    icon: 'ri-device-fill',
    link: '/devices',
    isCollapsed: false,
  },
  {
    id: 4,
    label: 'MENUITEMS.SCANS.TEXT',
    icon: 'ri-scan-fill',
    link: '/scans',
    isCollapsed: true,
  },
  {
    id: 4,
    label: 'MENUITEMS.REPORTS.TEXT',
    icon: 'ri-article-fill',
    link: '/reports',
    isCollapsed: true,
  },
];
