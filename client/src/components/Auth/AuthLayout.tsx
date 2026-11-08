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
      <div className="hidden md:flex md:w-[46%] flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 px-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-green-200 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-200 blur-3xl" />
        </div>
        <BlinkAnimation active={isFetching}>
          <div className="relative z-10 flex flex-col items-center text-center max-w-md">
            <img
              src="assets/logo.svg"
              className="w-72 h-auto object-contain"
              alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'Mahathi Infotech' })}
            />
            <p className="mt-6 text-green-700 text-base tracking-wide">
              Innovate. Integrate. Inspire.
            </p>
          </div>
        </BlinkAnimation>
      </div>

      {/* Right form panel */}
      <main className="flex flex-1 items-center justify-center px-6 py-10 md:px-12 bg-white">
        <div
          className={cn(
            'w-full max-w-sm',
            isTwoFactorSetup ? 'max-w-md' : '',
          )}
        >
          {/* Mobile logo */}
          <div className="mb-10 flex justify-center md:hidden">
            <img
              src="assets/logo.svg"
              className="w-56 h-auto object-contain"
              alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'Mahathi Infotech' })}
            />
          </div>

          {!hasStartupConfigError && !isFetching && header && (
            <h1 className="text-text-primary mb-8 text-center text-3xl font-semibold select-none">
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
