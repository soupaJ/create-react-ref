import React from 'react';
import createRef from './createRef';
import warning from 'fbjs/lib/warning';
import { FORWARD_REF } from './symbols';

export default React.forwardRef ||
  function forwardRef(render) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        typeof render === 'function',
        'forwardRef requires a render function but was given %s.',
        render === null ? 'null' : typeof render
      );
    }
    return class ForwardRefPolyfill extends React.Component {
      static displayName = 'ForwardRefPolyfill';
      forwardRefKey = FORWARD_REF;
      __forwardedRef = createRef();

      getRef() {
        // Check for `current` first before `value` since it's the
        // newest property name in React. Probably remove check for
        // `value` in the future since it was an alpha release.
        return this.__forwardedRef.current || this.__forwardedRef.value;
      }

      render() {
        return render(this.props, this.__forwardedRef);
      }
    };
  };
