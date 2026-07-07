import { createBrowserRouter } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CatalogManagementPage } from '../pages/CatalogManagementPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { QuestionBankPage } from '../pages/QuestionBankPage';
import { RegisterPage } from '../pages/RegisterPage';
import { StudentDashboardPage } from '../pages/StudentDashboardPage';
import { TestBuilderPage } from '../pages/TestBuilderPage';
import { TeacherDashboardPage } from '../pages/TeacherDashboardPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import { RequireAuth } from './RequireAuth';
import { RequireRole } from './RequireRole';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Shell />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: 'login', element: <LoginPage /> },
			{ path: 'register', element: <RegisterPage /> },
			{ path: 'forgot-password', element: <ForgotPasswordPage /> },
			{ path: 'reset-password', element: <ResetPasswordPage /> },
			{ path: 'verify-email', element: <VerifyEmailPage /> },
			{
				path: 'dashboard',
				element: (
					<RequireAuth>
						<DashboardPage />
					</RequireAuth>
				),
			},
			{
				path: 'admin',
				element: (
					<RequireRole roles={['admin']}>
						<AdminDashboardPage />
					</RequireRole>
				),
			},
			{
				path: 'teacher',
				element: (
					<RequireRole roles={['teacher']}>
						<TeacherDashboardPage />
					</RequireRole>
				),
			},
			{
				path: 'manage/catalog',
				element: (
					<RequireRole roles={['admin', 'teacher']}>
						<CatalogManagementPage />
					</RequireRole>
				),
			},
			{
				path: 'manage/questions',
				element: (
					<RequireRole roles={['admin', 'teacher']}>
						<QuestionBankPage />
					</RequireRole>
				),
			},
			{
				path: 'manage/tests',
				element: (
					<RequireRole roles={['admin', 'teacher']}>
						<TestBuilderPage />
					</RequireRole>
				),
			},
			{
				path: 'student',
				element: (
					<RequireRole roles={['student']}>
						<StudentDashboardPage />
					</RequireRole>
				),
			},
		],
	},
]);
