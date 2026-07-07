import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { api } from '../lib/api';
import { clearSession, setAuthStatus, setSession } from '../store/authSlice';
import { store } from '../store';

const queryClient = new QueryClient();

function AuthBootstrap({ children }) {
	const dispatch = useDispatch();
	const accessToken = useSelector((state) => state.auth.accessToken);
	const bootstrapped = useRef(false);

	useEffect(() => {
		if (bootstrapped.current) {
			return undefined;
		}

		bootstrapped.current = true;
		let cancelled = false;
		let authenticated = false;

		async function bootstrap() {
			try {
				const { data } = await api.post('/auth/refresh');

				if (!cancelled) {
					dispatch(setSession(data.data));
					authenticated = true;
				}

				return;
			} catch {
				if (accessToken) {
					try {
						const { data } = await api.get('/auth/me');

						if (!cancelled) {
							dispatch(setSession({ user: data.data.user, accessToken }));
							authenticated = true;
						}

						return;
					} catch {
						// Fall through to clear the session below.
					}
				}
			}

			if (!cancelled) {
				dispatch(clearSession());
			}
		}

		bootstrap().finally(() => {
			if (!cancelled) {
				dispatch(setAuthStatus(authenticated ? 'authenticated' : 'anonymous'));
			}
		});

		return () => {
			cancelled = true;
		};
	}, [accessToken, dispatch]);

	return children;
}

export function AppProviders({ children }) {
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<AuthBootstrap>{children}</AuthBootstrap>
			</QueryClientProvider>
		</Provider>
	);
}
