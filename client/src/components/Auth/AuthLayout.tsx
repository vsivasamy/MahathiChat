import { ThemeSelector } from '@librechat/client';
import { TStartupConfig } from 'librechat-data-provider';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import { hasPublishedPolicies } from '~/utils/policies';
import { TranslationKeys, useLocalize } from '~/hooks';
import SocialLoginRender from './SocialLoginRender';
import { BlinkAnimation } from './BlinkAnimation';
import LegalConsent from './LegalConsent';
import { Banner } from '../Banners';
import Footer from './Footer';
import { cn } from '~/utils';

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: TranslationKeys | null;
}) {
  const localize = useLocalize();

  const hasStartupConfigError = startupConfigError !== null && startupConfigError !== undefined;
  const isRegister = pathname.includes('register');
  const isLogin = !pathname.includes('2fa') && pathname.includes('login');
  const showsSocialLogin = isLogin || isRegister;
  const hasPolicies = hasPublishedPolicies(startupConfig);
  const registrationStatesConsent =
    isRegister && hasPolicies && !hasStartupConfigError && !isFetching;
  const statesConsentBelowProviders = isLogin && hasPolicies;
  const isTwoFactorSetup = pathname === '/login/2fa/setup';

  const DisplayError = () => {
    if (hasStartupConfigError) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize('com_auth_error_login_server')}</ErrorMessage>
        </div>
      );
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>
            {localize('com_auth_error_invalid_reset_token')}{' '}
            <a
              className="text-accent-primary font-semibold hover:underline"
              href="/forgot-password"
            >
              {localize('com_auth_click_here')}
            </a>{' '}
            {localize('com_auth_to_try_again')}
          </ErrorMessage>
        </div>
      );
    } else if (error != null && error) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize(error)}</ErrorMessage>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <Banner />
      <DisplayError />
      <div className="absolute inset-s-0 bottom-0 z-10 md:m-4">
        <ThemeSelector />
      </div>

      {/* Left branding panel */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-green-300 to-transparent" />
        </div>
        <BlinkAnimation active={isFetching}>
          <div className="relative z-10 flex flex-col items-center text-center">
            <img
              src="assets/logo.svg"
              className="h-32 w-auto max-w-[280px] object-contain mb-8"
              alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'Mahathi Infotech' })}
            />
            <h2 className="text-4xl font-bold text-green-800 tracking-tight">Mahathi Infotech</h2>
            <p className="mt-4 text-green-700 text-lg">Innovate. Integrate. Inspire.</p>
          </div>
        </BlinkAnimation>
      </div>

      {/* Right form panel */}
      <main className="flex grow items-center justify-center px-4 py-8 md:w-1/2 bg-white">
        <div
          className={cn(
            'w-full max-w-md',
            isTwoFactorSetup ? 'max-w-lg' : '',
          )}
        >
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center md:hidden">
            <img
              src="assets/logo.svg"
              className="h-20 w-auto max-w-[220px] object-contain"
              alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'Mahathi Infotech' })}
            />
          </div>

          {!hasStartupConfigError && !isFetching && header && (
            <h1 className="text-text-primary mb-6 text-center text-3xl font-semibold select-none">
              {header}
            </h1>
          )}
          {children}
          {showsSocialLogin && (
            <SocialLoginRender startupConfig={startupConfig} showPasskey={isLogin} />
          )}
          {statesConsentBelowProviders && <LegalConsent startupConfig={startupConfig} />}
        </div>
      </main>
      {!registrationStatesConsent && <Footer startupConfig={startupConfig} />}
    </div>
  );
}

export default AuthLayout;
