import AuthGate from './AuthGate';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  logoMode?: boolean;
  topBarAction?: React.ReactNode;
  hideNav?: boolean;
}

export default function AppShell({
  children,
  title,
  showBack,
  logoMode,
  topBarAction,
  hideNav,
}: AppShellProps) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-black flex flex-col max-w-lg mx-auto">
        <TopBar
          title={title}
          showBack={showBack}
          logoMode={logoMode}
          action={topBarAction}
        />
        <main className="flex-1 pb-24">{children}</main>
        {!hideNav && <BottomNav />}
      </div>
    </AuthGate>
  );
}
