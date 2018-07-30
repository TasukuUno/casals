import {protocol} from 'electron';
const scheme = 'casals';

export default function registerProtocol() {
  protocol.registerBufferProtocol(scheme, (request) => {
    const {method, url, uploadData} = request;
    const path = url.replace(`${scheme}://`, '');
    console.log(`[${method}]`, path, uploadData ? '[uploadData]' : '');

    if (method === 'POST') {
      if (path === 'aaa') {
        return;
      }
    }
  });
}
