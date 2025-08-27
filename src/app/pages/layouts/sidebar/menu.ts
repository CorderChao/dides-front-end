import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "Dashboard",
    icon: "ri-dashboard-2-line",
    link: "/dashboard",
    isCollapsed: false
  },
  {
    id: 2,
    label: 'User Management',
    icon: 'ri-user-settings-line',
    isCollapsed: false,
    subItems: [
      {
        id: 21,
        label: 'Users',
        link: '/users',
        icon: 'ri-user-line',
        parentId: 2
      },
      {
        id: 22,
        label: 'Roles & Permissions',
        link: '/roles',
        icon: 'ri-shield-keyhole-line',
        parentId: 2
      }
    ]
  },
  {
    id: 3,
    label: 'Academic',
    icon: 'ri-book-2-line',
    isCollapsed: false,
    subItems: [
      {
        id: 31,
        label: 'Programs',
        link: '/academic/programs',
        icon: 'ri-graduation-cap-line',
        parentId: 3
      },
      {
        id: 32,
        label: 'Courses',
        link: '/academic/courses',
        icon: 'ri-book-mark-line',
        parentId: 3
      },
      {
        id: 33,
        label: 'Class Management',
        link: '/academic/classes',
        icon: 'ri-group-line',
        parentId: 3
      }
    ]
  },
  {
    id: 4,
    label: 'Student Lifecycle',
    icon: 'ri-user-voice-line',
    isCollapsed: false,
    subItems: [
      {
        id: 41,
        label: 'Admissions',
        link: '/students/admissions',
        icon: 'ri-clipboard-line',
        parentId: 4
      },
      {
        id: 42,
        label: 'Registration',
        link: '/students/registration',
        icon: 'ri-file-list-3-line',
        parentId: 4
      },
      {
        id: 43,
        label: 'Records',
        link: '/students/records',
        icon: 'ri-profile-line',
        parentId: 4
      }
    ]
  },
  {
    id: 5,
    label: 'Examination',
    icon: 'ri-file-copy-2-line',
    isCollapsed: false,
    subItems: [
      {
        id: 51,
        label: 'Result Submission',
        link: '/exams/results',
        icon: 'ri-edit-box-line',
        parentId: 5
      },
      {
        id: 52,
        label: 'Transcripts',
        link: '/exams/transcripts',
        icon: 'ri-file-paper-2-line',
        parentId: 5
      },
      {
        id: 53,
        label: 'Timetables',
        link: '/exams/timetables',
        icon: 'ri-calendar-todo-line',
        parentId: 5
      }
    ]
  },
  {
    id: 6,
    label: 'Financial',
    icon: 'ri-money-dollar-circle-line',
    isCollapsed: false,
    subItems: [
      {
        id: 61,
        label: 'Fee Structure',
        link: '/finance/fees',
        icon: 'ri-money-euro-circle-line',
        parentId: 6
      },
      {
        id: 62,
        label: 'Payments',
        link: '/finance/payments',
        icon: 'ri-bank-card-line',
        parentId: 6
      },
      {
        id: 63,
        label: 'Financial Aid',
        link: '/finance/aid',
        icon: 'ri-hand-coin-line',
        parentId: 6
      }
    ]
  },
  {
    id: 7,
    label: 'Reports',
    icon: 'ri-bar-chart-2-line',
    isCollapsed: false,
    subItems: [
      {
        id: 71,
        label: 'Academic',
        link: '/reports/academic',
        icon: 'ri-file-chart-line',
        parentId: 7
      },
      {
        id: 72,
        label: 'Financial',
        link: '/reports/financial',
        icon: 'ri-file-chart-2-line',
        parentId: 7
      },
      {
        id: 73,
        label: 'Enrollment',
        link: '/reports/enrollment',
        icon: 'ri-user-heart-line',
        parentId: 7
      }
    ]
  },
  {
    id: 8,
    label: 'Administration',
    icon: 'ri-settings-3-line',
    isCollapsed: false,
    subItems: [
      {
        id: 81,
        label: 'System Settings',
        link: '/admin/settings',
        icon: 'ri-tools-line',
        parentId: 8
      },
      {
        id: 82,
        label: 'Audit Logs',
        link: '/admin/logs',
        icon: 'ri-history-line',
        parentId: 8
      },
      {
        id: 83,
        label: 'Backup',
        link: '/admin/backup',
        icon: 'ri-server-line',
        parentId: 8
      }
    ]
  },
  {
    id: 9,
    label: 'Communication',
    icon: 'ri-message-2-line',
    isCollapsed: false,
    subItems: [
      {
        id: 91,
        label: 'Announcements',
        link: '/comms/announcements',
        icon: 'ri-megaphone-line',
        parentId: 9
      },
      {
        id: 92,
        label: 'Notifications',
        link: '/comms/notifications',
        icon: 'ri-notification-2-line',
        parentId: 9
      }
    ]
  }
];

