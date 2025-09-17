import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ContactsIcon from '@mui/icons-material/Contacts';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LinkIcon from '@mui/icons-material/Link';
import CategoryIcon from '@mui/icons-material/Category';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ClassIcon from '@mui/icons-material/Class';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon
};

// ==============================|| MENU ITEMS ||============================== //

// eslint-disable-next-line
export default {
  items: [
    {
      id: 'navigation', // ✅ FIXED: meaningful group ID
      type: 'group',
      title: 'Navigation', // ✅ FIXED: visible title
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/'
        },

        {
          id: 'master-group',
          title: 'Masters',
          type: 'collapse',
          icon: GridViewIcon,
          children: [
            {
              id: 'type-of-client',
              title: 'Type Of Client',
              icon: PeopleIcon,
              type: 'item',
              url: '/type-of-client'
            },
            {
              id: 'position',
              title: 'Position',
              type: 'item',
              icon: ManageAccountsIcon,
              url: '/master/position'
            },
            {
              id: 'departments',
              title: 'Department',
              type: 'item',
              icon: AccountTreeIcon,
              url: '/master/departments'
            }
          ]
        },

        // {
        //   id: 'contacts',
        //   title: 'Contacts',
        //   type: 'item',
        //   icon: ContactsIcon,
        //   url: '/contacts'
        // },

        {
          id: 'client',
          title: 'Client',
          type: 'item',
          icon: PersonIcon,
          url: '/super-admin-client'
        }
      ]
    }
  ]
};

// import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
// import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import GridViewIcon from '@mui/icons-material/GridView';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
// import BeachAccessIcon from '@mui/icons-material/BeachAccess';
// import LinkIcon from '@mui/icons-material/Link';
// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import CategoryIcon from '@mui/icons-material/Category';
// import NumbersOutlined from '@mui/icons-material/NumbersOutlined';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import AccountTreeIcon from '@mui/icons-material/AccountTree';
// import NetworkWifiOutlined from '@mui/icons-material/NetworkWifiOutlined';
// import { Money, StackedBarChart } from '@mui/icons-material';
// import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
// import PersonIcon from '@mui/icons-material/Person';
// import ContactsIcon from '@mui/icons-material/Contacts';
// import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import PeopleIcon from '@mui/icons-material/People';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

// export default {
//   items: [
//     {
//       id: 'navigation',
//       type: 'group',
//       title: 'Navigation',
//       icon: NavigationOutlinedIcon,
//       children: [
//         {
//           id: 'dashboard',
//           title: 'Dashboard',
//           type: 'item',
//           icon: HomeOutlinedIcon,
//           url: '/'
//         },
//         {
//           id: 'master-group',
//           title: 'Masters',
//           type: 'collapse',
//           icon: GridViewIcon,
//           children: [
//             {
//               id: 'product-or-service-category',
//               title: 'Product Category',
//               icon: ShoppingCartIcon,
//               type: 'item',
//               url: '/master/product-or-service-category'
//             },
//             {
//               id: 'sub-product-category',
//               title: 'Sub Product Category',
//               icon: ShoppingCartCheckoutIcon,
//               type: 'item',
//               url: '/master/sub-product-category'
//             },
//             {
//               id: 'leave-type',
//               title: 'Leave Type',
//               icon: BeachAccessIcon,
//               type: 'item',
//               url: '/master/leave-type'
//             },
//             {
//               id: 'lead-reference',
//               title: 'Lead Reference',
//               icon: LinkIcon,
//               type: 'item',
//               url: '/master/lead-reference'
//             },
//             {
//               id: 'lead-stauts',
//               title: 'Lead Status',
//               icon: HourglassEmptyIcon,
//               type: 'item',
//               url: '/master/lead-status'
//             },
//             {
//               id: 'lead-type',
//               title: 'Lead Type',
//               icon: CategoryIcon,
//               type: 'item',
//               url: '/master/lead-type'
//             },
//             {
//               id: 'prefix',
//               title: 'Prefix',
//               type: 'item',
//               icon: NumbersOutlined,
//               url: '/master/prefix'
//             },
//             {
//               id: 'gst-percentage',
//               title: 'GST Percentage',
//               type: 'item',
//               icon: AttachMoneyIcon,
//               url: '/master/gst-percentage'
//             },
//             {
//               id: 'position',
//               title: 'Position',
//               type: 'item',
//               icon: ManageAccountsIcon,
//               url: '/master/position'
//             },
//             {
//               id: 'departments',
//               title: 'Department',
//               type: 'item',
//               icon: AccountTreeIcon,
//               url: '/master/departments'
//             },
//             {
//               id: 'network',
//               title: 'Network',
//               type: 'item',
//               icon: NetworkWifiOutlined,
//               url: '/master/network'
//             },
//             {
//               id: 'salary-income-head',
//               title: 'Salary Income Head',
//               type: 'item',
//               icon: Money,
//               url: '/master/salary-income-head'
//             },
//             {
//               id: 'status',
//               title: 'Status',
//               type: 'item',
//               icon: StackedBarChart,
//               url: '/master/status'
//             }
//           ]
//         },
//         {
//           id: 'company-settings',
//           title: 'Company Settings',
//           type: 'item',
//           icon: RoomPreferencesIcon,
//           url: '/company-settings'
//         },
//         {
//           id: 'client',
//           title: 'Client',
//           type: 'item',
//           icon: PersonIcon,
//           url: '/client'
//         },
//         {
//           id: 'contacts',
//           title: 'Contacts',
//           type: 'item',
//           icon: ContactsIcon,
//           url: '/contacts'
//         },
//         {
//           id: 'prospects',
//           title: 'Company',
//           type: 'item',
//           icon: ManageSearchIcon,
//           url: '/prospects'
//         },
//         {
//           id: 'lead-management-group',
//           title: 'Lead Management',
//           type: 'collapse',
//           icon: PeopleIcon,
//           children: [
//             {
//               id: 'lead',
//               title: 'Lead',
//               type: 'item',
//               url: '/lead-management/lead'
//             },
//             {
//               id: 'parametric-report',
//               title: 'Parametric Report',
//               type: 'item',
//               url: '/lead-management/parametric-report'
//             },
//             {
//               id: 'analytical-report',
//               title: 'Analytical Report',
//               type: 'item',
//               url: '/lead-management/analytical-report'
//             }
//           ]
//         },
//         {
//           id: 'Invoice',
//           title: 'Invoice',
//           icon: ReceiptIcon,
//           type: 'item',
//           url: '/invoice-management'
//         },
//         {
//           id: 'hr-group',
//           title: 'HR',
//           type: 'collapse',
//           icon: AdminPanelSettingsIcon,
//           children: [
//             {
//               id: 'attendance-list',
//               title: 'Attendance',
//               type: 'item',
//               url: '/hr/attendance-list'
//             },
//             {
//               id: 'leave-management',
//               title: 'Leave Manager',
//               type: 'item',
//               url: '/hr/leave-management'
//             },
//             {
//               id: 'users',
//               title: 'Users',
//               type: 'collapse',
//               children: [
//                 {
//                   id: 'company-staff',
//                   title: 'Staff',
//                   type: 'item',
//                   icon: PeopleIcon,
//                   url: '/users/company-staff'
//                 },
//                 {
//                   id: 'company-exstaff',
//                   title: 'Ex Staff',
//                   type: 'item',
//                   icon: PeopleIcon,
//                   url: '/users/company-exstaff'
//                 },
//                 {
//                   id: 'company-staff-report',
//                   title: 'Staff Report',
//                   type: 'item',
//                   icon: PeopleIcon,
//                   url: '/users/company-staff-report'
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           id: 'ticket-management',
//           title: 'Ticket Management',
//           type: 'item',
//           icon: ContactSupportOutlinedIcon,
//           url: '/ticket-management'
//         },
//         {
//           id: 'task-manager',
//           title: 'Task Management',
//           type: 'item',
//           icon: ManageSearchIcon,
//           url: '/task-manager'
//         }
//       ]
//     }
//   ]
// };

//!old data
// export default {
//   items: [
//     {
//       id: 'navigation',
//       type: 'group',
//       title: 'Navigation',
//       icon: NavigationOutlinedIcon,
//       children: [
//         {
//           id: 'dashboard',
//           title: 'Dashboard',
//           type: 'item',
//           icon: HomeOutlinedIcon,
//           url: '/'
//         },
//         {
//           id: 'master-group',
//           title: 'Masters',
//           type: 'collapse',
//           icon: GridViewIcon,
//           children: [
//             {
//               id: 'product-or-service-category',
//               title: 'Product Category',
//               icon: ShoppingCartIcon,
//               type: 'item',
//               url: '/master/product-or-service-category'
//             },
//             {
//               id: 'sub-product-category',
//               title: 'Sub Product Category',
//               icon: ShoppingCartCheckoutIcon,
//               type: 'item',
//               url: '/master/sub-product-category'
//             },
//             {
//               id: 'leave-type',
//               title: 'Leave Type',
//               icon: BeachAccessIcon,
//               type: 'item',
//               url: '/master/leave-type'
//             },
//             {
//               id: 'lead-reference',
//               title: 'Lead Reference',
//               icon: LinkIcon,
//               type: 'item',
//               url: '/master/lead-reference'
//             },
//             {
//               id: 'lead-stauts',
//               title: 'Lead Status',
//               icon: HourglassEmptyIcon,
//               type: 'item',
//               url: '/master/lead-status'
//             },
//             {
//               id: 'lead-type',
//               title: 'Lead Type',
//               icon: CategoryIcon,
//               type: 'item',
//               url: '/master/lead-type'
//             },
//             {
//               id: 'prefix',
//               title: 'Prefix',
//               icon: NumbersOutlined,
//               type: 'item',
//               url: '/master/prefix'
//             },
//             {
//               id: 'gst-percentage',
//               title: 'GST Percentage',
//               icon: AttachMoneyIcon,
//               type: 'item',
//               url: '/master/gst-percentage'
//             },
//             {
//               id: 'position',
//               title: 'Position',
//               icon: ManageAccountsIcon,
//               type: 'item',
//               url: '/master/position'
//             },
//             {
//               id: 'departments',
//               title: 'Department',
//               icon: AccountTreeIcon,
//               type: 'item',
//               url: '/master/departments'
//             },
//             {
//               id: 'network',
//               title: 'Network',
//               icon: NetworkWifiOutlined,
//               type: 'item',
//               url: '/master/network'
//             },
//             {
//               id: 'salary-income-head',
//               title: 'Salary Income Head',
//               icon: Money,
//               type: 'item',
//               url: '/master/salary-income-head'
//             },
//             {
//               id: 'status',
//               title: 'Status',
//               icon: StackedBarChart,
//               type: 'item',
//               url: '/master/status'
//             }
//           ]
//         },
//         {
//           id: 'company-settings',
//           title: 'Company Settings',
//           type: 'item',
//           icon: RoomPreferencesIcon,
//           url: '/company-settings'
//         },
//         {
//           id: 'client',
//           title: 'Client',
//           type: 'item',
//           icon: PersonIcon,
//           url: '/client'
//         },
//         {
//           id: 'contacts',
//           title: 'Contacts',
//           type: 'item',
//           icon: ContactsIcon,
//           url: '/contacts'
//         },
//         {
//           id: 'lead-management-group',
//           title: 'Lead Management',
//           type: 'collapse',
//           icon: PeopleIcon,
//           children: [
//             {
//               id: 'lead',
//               title: 'Lead',
//               type: 'item',
//               url: '/lead-management/lead'
//             },
//             {
//               id: 'parametric-report',
//               title: 'Parametric Report',
//               type: 'item',
//               url: '/lead-management/parametric-report'
//             },
//             {
//               id: 'analytical-report',
//               title: 'Analytical Report',
//               type: 'item',
//               url: '/lead-management/analytical-report'
//             }
//           ]
//         },
//         {
//           id: 'Invoice',
//           title: 'Invoice',
//           icon: ReceiptIcon,
//           type: 'item',
//           url: '/invoice-management'
//         },
//         {
//           id: 'hr-group',
//           title: 'HR',
//           type: 'collapse',
//           icon: AdminPanelSettingsIcon,
//           children: [
//             {
//               id: 'attendance-list',
//               title: 'Attendance',
//               type: 'item',
//               url: '/hr/attendance-list'
//             },
//             {
//               id: 'leave-management',
//               title: 'Leave Manager',
//               type: 'item',
//               url: '/hr/leave-management'
//             }
//           ]
//         }
//       ]
//     }
//   ]
// };
