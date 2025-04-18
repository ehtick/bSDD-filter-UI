import '@mantine/core/styles.css';

import ReactDOM from 'react-dom/client';

import AppProvider from './AppProvider';
import BsddSearchLoader from './BsddSearchLoader';

function Main() {
  return (
    <AppProvider>
      <BsddSearchLoader />
    </AppProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Main />);
