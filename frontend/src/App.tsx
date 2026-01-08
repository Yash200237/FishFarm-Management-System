import { Routes, Route } from 'react-router-dom';
import {FarmsPage} from './pages/FarmsPage.tsx';
import {WorkersPage} from './pages/WorkersPage.tsx';
import {LoginPage} from './pages/LoginPage.tsx';
import {HomePage} from './pages/HomePage.tsx';
import {FarmPage} from './pages/FarmPage.tsx';
import {WorkerPage} from './pages/WorkerPage.tsx';
import { FarmEditForm } from './components/FarmEditForm.tsx';
import { WorkerEditForm } from './components/WorkerEditForm.tsx';
import { FarmCreatePage } from './pages/FarmCreatePage.tsx';
import { WorkerAssignPage } from './pages/WorkerAssignPage.tsx';
import { WorkerCreateForm } from './components/WorkerCreateForm.tsx';
import { Layout } from './components/Layout.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { OrgsPage } from './pages/Admin Pages/OrgsPage.tsx';
import { OrgPage } from './pages/Admin Pages/OrgPage.tsx';
import { OrgCreatePage } from './pages/Admin Pages/OrgCreateage.tsx';
import { AdminUserCreatePage } from './pages/Admin Pages/AdminUserCreatePage.tsx';
import { UsersPage } from './pages/UsersPage.tsx';
import { UserCreatePage } from './pages/UserCreatePage.tsx';
import { OrgsEditForm } from './components/OrgsEditForm.tsx';
import { UserEditPage } from './pages/UserEditPage.tsx';
import { AdminUserEditPage } from './pages/Admin Pages/AdminUserEditPage.tsx';
import { FarmWorkerAssignPage } from './pages/FarmWorkerAssignPage.tsx';
import { WorkerAssignEditPage } from './pages/WorkerAssignEditPage.tsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/farms" element={<ProtectedRoute allowedRoles={['OrgAdmin', 'OrgUser']}><FarmsPage/></ProtectedRoute>}/>
        <Route path="/farms/create" element={<ProtectedRoute allowedRoles={['OrgAdmin']}><FarmCreatePage/></ProtectedRoute>}/>
        <Route path="/farms/:farmId" element={<ProtectedRoute allowedRoles={['OrgAdmin', 'OrgUser']}><FarmPage/></ProtectedRoute>}/>
        <Route path="/farms/:farmId/edit" element={<ProtectedRoute allowedRoles={['OrgAdmin']}><FarmEditForm/></ProtectedRoute>}/>
        <Route path="/farms/:farmId/workers/assign" element={<ProtectedRoute allowedRoles={['OrgAdmin']}><FarmWorkerAssignPage/></ProtectedRoute>}/>
        <Route path="/farms/:farmId/workers/:workerId/edit" element={<ProtectedRoute allowedRoles={['OrgAdmin']}><WorkerAssignEditPage/></ProtectedRoute>}/>

        <Route path="/workers" element={<ProtectedRoute allowedRoles={['OrgAdmin', 'OrgUser']}><WorkersPage/></ProtectedRoute>}/>
        <Route path="/workers/create" element={<ProtectedRoute allowedRoles={['OrgAdmin', 'OrgUser']}><WorkerCreateForm/></ProtectedRoute>}/>
        <Route path="/workers/:workerId" element={<ProtectedRoute allowedRoles={['OrgAdmin', 'OrgUser']}><WorkerPage/></ProtectedRoute>}/>
        <Route path="/workers/:workerId/edit" element={<ProtectedRoute allowedRoles={['OrgAdmin', 'OrgUser']}><WorkerEditForm/></ProtectedRoute>}/>
        <Route path="/workers/:workerId/assign" element={<ProtectedRoute allowedRoles={['OrgAdmin', 'OrgUser']}><WorkerAssignPage/></ProtectedRoute>}/>

        <Route path="/orgs" element={<ProtectedRoute allowedRoles={['GlobalAdmin']}><OrgsPage/></ProtectedRoute>} />
        <Route path="/orgs/create" element={<ProtectedRoute allowedRoles={['GlobalAdmin']}><OrgCreatePage/></ProtectedRoute>} />
        <Route path="/orgs/:orgId" element={<ProtectedRoute allowedRoles={['GlobalAdmin']}><OrgPage/></ProtectedRoute>} />
        <Route path="/orgs/:orgId/edit" element={<ProtectedRoute allowedRoles={['GlobalAdmin']}><OrgsEditForm/></ProtectedRoute>} />
        <Route path="/orgs/:orgId/users/create" element={<ProtectedRoute allowedRoles={['GlobalAdmin']}><AdminUserCreatePage/></ProtectedRoute>}/>
        <Route path="/orgs/:orgId/users/edit/:userId" element={<ProtectedRoute allowedRoles={['GlobalAdmin']}><AdminUserEditPage/></ProtectedRoute>}/>

        <Route path="users/" element={<ProtectedRoute allowedRoles={[ 'OrgAdmin']}><UsersPage/></ProtectedRoute>}/>
        <Route path="users/create/:orgId" element={<ProtectedRoute allowedRoles={['OrgAdmin']}><UserCreatePage/></ProtectedRoute>}/>
        <Route path="users/:orgId/:userId/edit" element={<ProtectedRoute allowedRoles={['OrgAdmin']}><UserEditPage/></ProtectedRoute>}/>

      </Routes>
    </Layout>
  )
}

export default App
