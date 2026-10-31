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
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <Banner />
      <DisplayError />
      <div className="absolute inset-s-0 bottom-0 md:m-4">
        <ThemeSelector />
      </div>

      <main className="flex grow items-center justify-center px-4 py-8">
        <div
          className={cn(
            'bg-white overflow-hidden rounded-2xl px-8 py-10 shadow-lg',
            isTwoFactorSetup ? 'w-11/12 max-w-lg' : 'w-full max-w-md',
          )}
        >
          {/* Logo centered above the form */}
          <BlinkAnimation active={isFetching}>
            <div className="mb-8 flex justify-center">
              <img
                src="assets/logo.svg"
                className="h-20 w-auto max-w-[220px] object-contain"
                style={{ transform: 'translateX(6px)' }}
                alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'LibreChat' })}
              />
            </div>
          </BlinkAnimation>

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
