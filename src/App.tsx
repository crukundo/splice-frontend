import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Notifications from './sections/Notifications';
import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import Pages from '@/routes/Pages';
import SW from '@/sections/SW';

function App() {
  return (
    <Fragment>
      <Notifications />
      <SW />
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    </Fragment>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
