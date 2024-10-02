import { Analytics } from '@vercel/analytics/react';
import ReactDOMServer from 'react-dom/server';

const analyticsScript = ReactDOMServer.renderToString(<Analytics />);

export default analyticsScript;