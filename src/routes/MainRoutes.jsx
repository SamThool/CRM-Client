import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import PrivateRoute from 'component/PrivateRoute/PrivateRoute';
import NavigateToDashboard from 'component/PrivateRoute/NavigateToDashboard';
import CompanySettings from '../views/CompanySettings/CompanySettings';
import LeadReference from '../views/master/Lead-reference/LeadReference';
import LeadStatus from '../views/master/Lead-status/LeadStatus';
import LeadType from '../views/master/Lead-type/LeadType';
import Staff from '../views/HR/Staff/Staff';
import AddStaff from '../views/HR/Staff/AddStaff';
import EditStaff from '../views/HR/Staff/EditStaff';
import ExStaff from '../views/HR/Ex-Staff/ExStaff';
import Attendance from '../views/HR/Attendance/Attendance';
import Prospects from '../views/Prospects/Company';
import EditProspects from '../views/Prospects/EditCompany';
import AddProspects from '../views/Prospects/AddCompany';
import Contacts from '../views/Contacts/Contacts';
import Company from '../views/Prospects/Company';
import Lead from 'views/LeadManagement/Lead/Lead';
import AddLead from 'views/LeadManagement/Lead/AddLead';
import EditLead from 'views/LeadManagement/Lead/EditLead';
import ParametricReport from 'views/LeadManagement/ParametricReport/ParametricReport';
import AnalyticalReport from 'views/LeadManagement/AnalyticalReport/AnalyticalReport';
import Client from '../views/Client/Client';
import BankDetails from '../views/master/BankDetails/BankDetails';
import ProductOrServiceCategory from '../views/master/ProductOrServiceCategory/ProductOrServiceCategory';
import SubProductCategory from '../views/master/SubProductCategory/SubProductCategory';
import LeaveType from '../views/master/LeaveType/LeaveType';
import CategoryOfOrganisation from 'views/master/CategoryOfOrganisation/CategoryOfOrganisation';
import Profession from 'views/master/Profession/Profession';
import Prefix from 'views/master/Prefix/Prefix';
import Position from 'views/master/Position/Position';
import Department from 'views/master/Department/Department';
import TypeOfClient from 'views/master/TypeOfClient/TypeOfClient';
import AdminStaff from 'views/User/Admin/AdminStaff';
import SalaryIncomeHeads from 'views/master/hr-setup/salaryincomeHeads/SalaryIncomeHeads';
import SalaryIncomeDeduction from 'views/master/hr-setup/salaryIncomeDeduction/SalaryIncomeDeduction';
import AddCompany from '../views/Prospects/AddCompany';
import EditCompany from '../views/Prospects/EditCompany';
import Network from 'views/master/Network/Network';
import LeaveManager from 'views/master/hr-setup/leave-manager/LeaveManager';
import LeaveManagerMain from 'views/HR/Leave-manager/LeaveManagerMain';
import TicketManagement from 'views/TicketManagement/TicketManagement';
import Status from 'views/master/Status/Status';
import AdminExStaff from 'views/User/Admin/AdminExStaff';
import AttendanceList from 'views/HR/Attendance/AttendanceList';
import TaskManager from 'views/TaskManager/TaskManager';
import TestBank from 'component/Master/TestBank';
import ChangePassword from 'views/Login/ChangePassword';
import InvoiceManagement from 'views/Invoice/InvoiceManagement';
import AddInvoice from 'views/Invoice/AddInvoice';
import Add from 'views/Invoice/Add';
import GstEditPage from 'views/Invoice/Edit Pages/GstEditPage';
import NonGstEditPage from 'views/Invoice/Edit Pages/NonGstEditPage';
import AddClient from 'views/Client/AddClient';
import UpdateClient from 'views/Client/UpdateClient';
import UpdateCompanySettings from 'views/CompanySettings/UpdateCompanySettings';
import GstPercentage from 'views/master/GstPercentage/GstPercentage';
import InvoiceDetails from 'views/Invoice/InvoiceDetails';
import TaskDetailView from 'views/TaskManager/TaskDetailView';
import Priority from 'views/master/Priority/Priority';
import Pipeline from 'views/LeadManagement/Pipeline/Pipeline';
import TicketDetailView from 'views/TicketManagement/TicketDetailView';
import LeadStage from '../views/master/Lead-stage/LeadStage';
import TicketStatus from 'views/master/ticketStatus/TicketStatus';
import TaskStatus from 'views/master/taskStatus/TaskStatus';
import CompanyStaffReport from 'views/HR/Staff/company-staff-report';
// const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
// const Prefix = Loadable(lazy(() => import('views/master/general-setup/prefix/Prefix')));
// const Radiology = Loadable(lazy(() => import('views/master/diagnostic-setup/radiology/Radiology')));
// const OtherDiagnostics = Loadable(lazy(() => import('views/master/diagnostic-setup/OtherDiagnostics/OtherDiagnostics')));
//diagnostics pages
// const Pathology = Loadable(lazy(() => import('views/master/diagnostic-setup/Pathology')));
// const OutSourceDiagnostics = Loadable(lazy(() => import('views/master/diagnostic-setup/outsourceDiagnostics/OutSourceDiagnostics')));
// const ConfirmPatient = Loadable(lazy(() => import('views/master/frontOffice-setup/appointment/ConfirmPatient')));
// const [primaryHospital, setPrimaryHospital] = useState('');
// const [HospiData, setHospiData] = useState(JSON.parse(localStorage.getItem('loginData')));
// const [loginHospi, setLoginHospi] = useState(localStorage.getItem('loginName'));

// const primaryHosHandler = (data) => {
//   setPrimaryHospital(data);
// };

// const setHospiDetail = (data) => {
//   setHospiData(data);
// };

// const hospiNameHandler = (data) => {
//   setLoginHospi(data);
// };

//user module routes
const Administrative = Loadable(lazy(() => import('views/HR/User/Administration/AdministrativeMainPage')));
const AdministrativeAddPage = Loadable(lazy(() => import('views/HR/User/Administration/AddPage')));
const AdministrativeUpdatePage = Loadable(lazy(() => import('views/HR/User/Administration/UpdatePage')));

// const Support = Loadable(lazy(() => import('views/HR/User/Support/SupportMainPage')));
// const SupportAddPage = Loadable(lazy(() => import('views/HR/User/Support/AddSupport')));
// const SupportEditPage = Loadable(lazy(() => import('views/HR/User/Support/EditSupport')));

// const NursingAndParamedical = Loadable(lazy(() => import('views/HR/User/NursingAndParamedical/NursingAndParamedicalMainPage')));
// const NursingAndParamedicalAddPage = Loadable(lazy(() => import('views/HR/User/NursingAndParamedical/AddNursingAndParamedical')));
// const NursingAndParamedicalEditPage = Loadable(lazy(() => import('views/HR/User/NursingAndParamedical/EditNursingAndParamedical')));

// const MedicalOfficer = Loadable(lazy(() => import('views/HR/User/MedicalOfficer/MedicalOfficerMainPage')));
// const MedicalOfficerAddPage = Loadable(lazy(() => import('views/HR/User/MedicalOfficer/AddMedicalOfficer')));
// const MedicalOfficerEditPage = Loadable(lazy(() => import('views/HR/User/MedicalOfficer/EditMedicalOfficer')));

// const Consultant = Loadable(lazy(() => import('views/HR/User/Consultant/ConsultantMainPage')));
// const ConsultantAddPage = Loadable(lazy(() => import('views/HR/User/Consultant/AddConsultant')));
// const ConsultantEditPage = Loadable(lazy(() => import('views/HR/User/Consultant/EditConsultant')));

// const OpdDoctorAssessmentForm = Loadable(lazy(() => import('views/OPD/PatientClinicalScreen/Print/Print')));

// //open form
// const OpenForm = Loadable(lazy(() => import('views/openForms/OpenForm')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <PrivateRoute
          allowedRoles={[
            'admin',
            'staff',
            'super-admin',
            'Administrative',
            'NursingAndParamedical',
            'MedicalOfficer',
            'Support',
            'Consultant'
          ]}
        >
          <NavigateToDashboard />
        </PrivateRoute>
      )
    },

    {
      path: '/company-settings/',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <CompanySettings />
        </PrivateRoute>
      )
    },
    {
      path: '/company-settings/:id',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <UpdateCompanySettings />
        </PrivateRoute>
      )
    },

    {
      path: '/master/bank-details',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <BankDetails />
        </PrivateRoute>
      )
    },
    {
      path: '/master/product-or-service-category',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <ProductOrServiceCategory />
        </PrivateRoute>
      )
    },
    {
      path: '/master/sub-product-category',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <SubProductCategory />
        </PrivateRoute>
      )
    },
    {
      path: '/master/leave-type',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <LeaveType />
        </PrivateRoute>
      )
    },
    {
      path: '/master/lead-reference',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <LeadReference />
        </PrivateRoute>
      )
    },
    {
      path: '/master/lead-status',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <LeadStatus />
        </PrivateRoute>
      )
    },
    {
      path: '/master/lead-stage',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <LeadStage />
        </PrivateRoute>
      )
    },
    {
      path: '/master/lead-type',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <LeadType />
        </PrivateRoute>
      )
    },
    {
      path: '/master/category-of-organtion',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'Administrative', 'staff', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <CategoryOfOrganisation />
        </PrivateRoute>
      )
    },
    {
      path: '/master/profession',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'Administrative', 'staff', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Profession />
        </PrivateRoute>
      )
    },
    {
      path: '/master/prefix',
      element: (
        <PrivateRoute
          allowedRoles={[
            'super-admin',
            'admin',
            'staff',
            'Administrative',
            'NursingAndParamedical',
            'MedicalOfficer',
            'Support',
            'Consultant'
          ]}
        >
          <Prefix />
        </PrivateRoute>
      )
    },
    {
      path: '/master/gst-percentage',
      element: (
        <PrivateRoute
          allowedRoles={[
            'super-admin',
            'admin',
            'staff',
            'Administrative',
            'NursingAndParamedical',
            'MedicalOfficer',
            'Support',
            'Consultant'
          ]}
        >
          <GstPercentage />
        </PrivateRoute>
      )
    },
    {
      path: '/master/position',
      element: (
        <PrivateRoute
          allowedRoles={[
            'super-admin',
            'admin',
            'staff',
            'Administrative',
            'NursingAndParamedical',
            'MedicalOfficer',
            'Support',
            'Consultant'
          ]}
        >
          <Position />
        </PrivateRoute>
      )
    },
    {
      path: '/master/departments',
      element: (
        <PrivateRoute
          allowedRoles={[
            'super-admin',
            'admin',
            'staff',
            'Administrative',
            'NursingAndParamedical',
            'MedicalOfficer',
            'Support',
            'Consultant'
          ]}
        >
          <Department />
        </PrivateRoute>
      )
    },
    {
      path: 'master/network',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          ,
          <Network />
        </PrivateRoute>
      )
    },
    {
      path: '/master/salary-income-head',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <SalaryIncomeHeads />
        </PrivateRoute>
      )
    },
    {
      path: '/master/salary-income-deduction',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <SalaryIncomeDeduction />
        </PrivateRoute>
      )
    },
    {
      path: '/master/status',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Status />
        </PrivateRoute>
      )
    },
    {
      path: '/master/ticket-status',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <TicketStatus />
        </PrivateRoute>
      )
    },
    {
      path: '/master/task-status',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <TaskStatus />
        </PrivateRoute>
      )
    },
    {
      path: '/priority',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Priority />
        </PrivateRoute>
      )
    },

    {
      path: '/users/administrative',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Administrative />
        </PrivateRoute>
      )
    },

    {
      path: '/users/administrativeAddPage',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <AdministrativeAddPage />
        </PrivateRoute>
      )
    },

    {
      path: '/users/administrativeUpdatePage/:id',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <AdministrativeUpdatePage />
        </PrivateRoute>
      )
    },
    // {
    //   path: '/hr/staff',
    //   element: (
    //     <PrivateRoute allowedRoles={['admin', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}>
    //       <Staff />
    //     </PrivateRoute>
    //   )
    // },
    // {
    //   path: '/hr/AddStaff',
    //   element: (
    //     <PrivateRoute allowedRoles={['admin', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}>
    //       <AddStaff />
    //     </PrivateRoute>
    //   )
    // },
    // {
    //   path: '/hr/EditStaff/:id',
    //   element: (
    //     <PrivateRoute allowedRoles={['admin', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}>
    //       <EditStaff />
    //     </PrivateRoute>
    //   )
    // },
    // {
    //   path: '/hr/ex-staff',
    //   element: (
    //     <PrivateRoute allowedRoles={['admin', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}>
    //       <ExStaff />
    //     </PrivateRoute>
    //   )
    // },
    {
      path: '/hr/leave-management',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <LeaveManagerMain />
        </PrivateRoute>
      )
    },
    {
      path: '/hr/attendance',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Attendance />
        </PrivateRoute>
      )
    },
    {
      path: '/hr/attendance-list',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <AttendanceList />
        </PrivateRoute>
      )
    },
    {
      path: '/lead-management/lead',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Lead />
        </PrivateRoute>
      )
    },
    {
      path: '/lead-management/AddLead',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <AddLead />
        </PrivateRoute>
      )
    },
    {
      path: '/lead-management/EditLead/:id',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <EditLead />
        </PrivateRoute>
      )
    },
    {
      path: '/lead-management/parametric-report',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <ParametricReport />
        </PrivateRoute>
      )
    },
    {
      path: '/lead-management/analytical-report',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <AnalyticalReport />
        </PrivateRoute>
      )
    },
    {
      path: '/prospects',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Prospects />
        </PrivateRoute>
      )
    },
    {
      path: '/prospects/AddCompany',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <AddCompany />
        </PrivateRoute>
      )
    },
    {
      path: '/prospects/editCompany/:id',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <EditCompany />
        </PrivateRoute>
      )
    },
    {
      path: '/contacts',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Contacts />
        </PrivateRoute>
      )
    },
    {
      path: '/client/',
      element: (
        <PrivateRoute
          allowedRoles={[
            'admin',
            'staff',
            'super-admin',
            'Administrative',
            'NursingAndParamedical',
            'MedicalOfficer',
            'Support',
            'Consultant'
          ]}
        >
          <Client />
        </PrivateRoute>
      )
    },
    {
      path: '/super-admin-client/',
      element: (
        <PrivateRoute
          allowedRoles={['super-admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Client />
        </PrivateRoute>
      )
    },
    {
      path: '/client/AddClient',
      element: (
        <PrivateRoute
          allowedRoles={[
            'admin',
            'staff',
            'super-admin',
            'Administrative',
            'NursingAndParamedical',
            'MedicalOfficer',
            'Support',
            'Consultant'
          ]}
        >
          <AddClient />
        </PrivateRoute>
      )
    },
    {
      path: '/client/editClient/:id',
      element: (
        <PrivateRoute
          allowedRoles={[
            'admin',
            'staff',
            'super-admin',
            'Administrative',
            'NursingAndParamedical',
            'MedicalOfficer',
            'Support',
            'Consultant'
          ]}
        >
          <UpdateClient />
        </PrivateRoute>
      )
    },

    {
      path: '/type-of-client',
      element: (
        <PrivateRoute
          allowedRoles={[
            'admin',
            'staff',
            'super-admin',
            'Administrative',
            'NursingAndParamedical',
            'MedicalOfficer',
            'Support',
            'Consultant'
          ]}
        >
          <TypeOfClient />
        </PrivateRoute>
      )
    },

    {
      path: '/users/company-staff',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <AdminStaff />
        </PrivateRoute>
      )
    },
    {
      path: '/users/company-staff-report',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <CompanyStaffReport />
        </PrivateRoute>
      )
    },
    {
      path: '/users/company-exstaff',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <AdminExStaff />
        </PrivateRoute>
      )
    },
    {
      path: '/invoice-management',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <InvoiceManagement />
        </PrivateRoute>
      )
    },

    {
      path: '/invoice-management/add-invoice',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <AddInvoice />
        </PrivateRoute>
      )
    },

    {
      path: '/invoice-management/addInvoice',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Add />
        </PrivateRoute>
      )
    },
    {
      path: '/invoice-management/update-gst/:id',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <GstEditPage />
        </PrivateRoute>
      )
    },
    {
      path: '/invoice-management/update-non-gst/:id',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <NonGstEditPage />
        </PrivateRoute>
      )
    },
    {
      path: 'invoice-details/:id',
      element: <InvoiceDetails />
    },

    {
      path: '/ticket-management',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <TicketManagement />
        </PrivateRoute>
      )
    },
    {
      path: '/task-manager',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <TaskManager />
        </PrivateRoute>
      )
    },
    {
      path: '/task-details/:id',
      element: (
        <PrivateRoute allowedRoles={['admin', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}>
          <TaskDetailView />
        </PrivateRoute>
      )
    },
    {
      path: '/ticket-details/:id',
      element: (
        <PrivateRoute allowedRoles={['admin', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}>
          <TicketDetailView />
        </PrivateRoute>
      )
    },

    {
      path: '/test-bank',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <TestBank />
        </PrivateRoute>
      )
    },
    {
      path: '/pipeline',
      element: (
        <PrivateRoute
          allowedRoles={['admin', 'staff', 'Administrative', 'NursingAndParamedical', 'MedicalOfficer', 'Support', 'Consultant']}
        >
          <Pipeline />
        </PrivateRoute>
      )
    }
  ]
};

export default MainRoutes;
