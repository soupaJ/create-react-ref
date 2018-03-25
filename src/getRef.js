import { FORWARD_REF_KEY } from './forwardRef';
import RefForwarder from './RefForwarder';
import warning from 'fbjs/lib/warning';

export default function getRef(refObject) {
  if (!refObject) {
    return null;
  }

  let ref = refObject;

  if (typeof ref === 'function' && process.env.NODE_ENV !== 'production') {
    warning(
      ref.hasOwnProperty('current'),
      'getRef: It looks like you may have passed `getRef` the ref callback as ' +
        'an argument. `getRef` should be used with a ref object created by ' +
        '`createRef` or inside a ref callback.'
    );
  }

  if (Object.keys(ref).length === 1) {
    if (ref.hasOwnProperty('current')) {
      ref = ref.current;
      // We probably don't have to support this route since it was only
      // in one version of React and it was an alpha release (16.3.0-alpha.1).
    } else if (ref.hasOwnProperty('value')) {
      ref = ref.value;
    }
  }

  // Get polyfilled forwardedRef, if it exists
  if (ref instanceof RefForwarder) {
    ref = ref.getRef();
  }

  return ref;
}
