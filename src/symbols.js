const hasSymbol = typeof Symbol === 'function' && Symbol.for;

export const FORWARD_REF =
  hasSymbol
    ? Symbol.for('reactCreateRef.forwardRef')
    : '__DO_NOT_USE_REACT_CREATE_REF_FORWARD_REF_KEY__';