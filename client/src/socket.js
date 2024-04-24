import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
export default io(import.meta.env.VITE_BASE_URL + '?id='+location.pathname.split('/')[1]);