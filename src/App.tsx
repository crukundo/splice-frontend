import { BrowserRouter } from 'react-router-dom';
import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import Pages from '@/routes/Pages';
import SW from '@/sections/SW';
import { Fragment } from 'react';

function App() {

  return (
    <Fragment>
      <SW />
      <BrowserRouter>
      <Pages />
      </BrowserRouter>
    </Fragment>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
