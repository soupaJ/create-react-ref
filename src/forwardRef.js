import React from 'react';
import createRef from './createRef';
import RefForwarder from './RefForwarder';
import warning from 'fbjs/lib/warning';

export default React.forwardRef ||
  function forwardRef(render) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        typeof render === 'function',
        'forwardRef requires a render function but was given %s.',
        render === null ? 'null' : typeof render
      );
    }
    return class extends RefForwarder {
      __render = render;
    };
  };
