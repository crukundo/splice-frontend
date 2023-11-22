import { BrowserRouter } from 'react-router-dom';
import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import Pages from '@/routes/Pages';
import Header from '@/sections/Header';
import Notifications from '@/sections/Notifications';
import SW from '@/sections/SW';
import Sidebar from '@/sections/Sidebar';
import { SiteFooter } from './components/site-footer';

const isAuth = true;

function App() {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <Notifications />
      <SW />
      <BrowserRouter>
        <Header />
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <Sidebar />
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <Pages />
        </main>
        </div>
        <SiteFooter className="border-t" />
      </BrowserRouter>
    </div>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
