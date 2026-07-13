import { RouterProvider } from 'react-router-dom';
import{router} from './routes/index';  
import {QueryClient,QueryClientProvider  } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useWebSocket from '../shared/hooks/useWebSocket';

let query = new QueryClient()

const WebSocketManager = () => {
  useWebSocket(); 
  return null; 
};

const App = () => {
  return <>
  <QueryClientProvider client={query}>
    <WebSocketManager />
  <RouterProvider router={router} />
  <ReactQueryDevtools/>
  </QueryClientProvider>
  </>
  
}

export default App;