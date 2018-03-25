import React from 'react';
import getRef from './getRef';

export default React.createRef ||
  function createRef() {
    function ref(instanceOrNode) {
      ref.current = getRef(instanceOrNode) || null;
    }

    ref.current = null;

    if (process.env.NODE_ENV !== 'production') {
      Object.seal(ref);
    }

    return ref;
  };
