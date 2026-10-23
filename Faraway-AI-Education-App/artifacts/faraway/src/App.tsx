import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Shell } from '@/components/shell';
import { SpectrumDefs } from '@/components/spectrum';
import { useStore } from '@/lib/store';
import NotFound from '@/pages/not-found';
import { Login, Mode, Register } from '@/pages/auth';
import Dashboard from '@/pages/dashboard';
import Pathway from '@/pages/pathway';
import Analysis from '@/pages/analysis';
import JobDetail, { JobsIndex } from '@/pages/job';
import PlanPage from '@/pages/plan';
import Progress from '@/pages/progress';
import Organization from '@/pages/organization';

const queryClient = new QueryClient();

function Router() {
  const [loc] = useLocation();
  const session = useStore((s) => s.session);
  if (loc === '/login' || loc === '/register') {
    if (session) return <Redirect to="/" />;
    return <Switch><Route path="/login" component={Login} /><Route path="/register" component={Register} /></Switch>;
  }
  if (!session) return <Redirect to="/login" />;
  if (loc === '/mode') return <Mode />;
  return (
    <Shell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/pathway" component={Pathway} />
          <Route path="/analysis" component={Analysis} />
          <Route path="/jobs" component={JobsIndex} />
          <Route path="/jobs/:id" component={JobDetail} />
          <Route path="/plan" component={PlanPage} />
          <Route path="/progress" component={Progress} />
          <Route path="/organization" component={Organization} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Shell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SpectrumDefs />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
