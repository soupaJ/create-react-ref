import withReact from '../../test-utils/withReact';
const name = 'cjs';

describe(`create-react-ref (${name})`, () => {
  withReact(({ React, ReactDOM, TestUtils, version }) => {
    describe(`react@${version}`, () => {
      let createRef;
      let forwardRef;

      beforeEach(() => {
        jest.resetModules();
        jest.setMock('react', React);
        jest.setMock('react-dom', ReactDOM);
        createRef = require('../createRef');
        forwardRef = require('../forwardRef');
      });
      // Borrowed from React's ref tests
      // https://github.com/facebook/react/blob/bc70441c8b3fa85338283af3eeb47b5d15e9dbfe/packages/react/src/__tests__/forwardRef-test.internal.js
      it('should work without a ref to be forwarded', () => {
        class Child extends React.Component {
          render() {
            expect(this.props.value).toEqual(123);
            return null;
          }
        }

        function Wrapper(props) {
          return <Child {...props} ref={props.forwardedRef} />;
        }

        const RefForwardingComponent = forwardRef((props, ref) => (
          <Wrapper {...props} forwardedRef={ref} />
        ));

        TestUtils.renderIntoDocument(<RefForwardingComponent value={123} />);
      });

      it('should forward a ref for a single child', () => {
        class Child extends React.Component {
          render() {
            expect(this.props.value).toEqual(123);
            return null;
          }
        }

        function Wrapper(props) {
          return <Child {...props} ref={props.forwardedRef} />;
        }

        const RefForwardingComponent = forwardRef((props, ref) => (
          <Wrapper {...props} forwardedRef={ref} />
        ));

        const ref = createRef();
        TestUtils.renderIntoDocument(
          <RefForwardingComponent ref={ref} value={123} />
        );

        expect(ref.current instanceof Child).toBe(true);
      });

      it('should forward a ref for multiple children', () => {
        class Child extends React.Component {
          render() {
            expect(this.props.value).toEqual(123);
            return null;
          }
        }

        function Wrapper(props) {
          return <Child {...props} ref={props.forwardedRef} />;
        }

        const RefForwardingComponent = forwardRef((props, ref) => (
          <Wrapper {...props} forwardedRef={ref} />
        ));

        const ref = createRef();

        TestUtils.renderIntoDocument(
          <div>
            <div />
            <RefForwardingComponent ref={ref} value={123} />
            <div />
          </div>
        );

        expect(ref.current instanceof Child).toBe(true);
      });

      it('should update refs when switching between children', () => {
        function FunctionalComponent({ forwardedRef, setRefOnDiv }) {
          return (
            <section>
              <div ref={setRefOnDiv ? forwardedRef : null}>First</div>
              <span ref={setRefOnDiv ? null : forwardedRef}>Second</span>
            </section>
          );
        }

        const RefForwardingComponent = forwardRef((props, ref) => (
          <FunctionalComponent {...props} forwardedRef={ref} />
        ));

        const ref = createRef();

        TestUtils.renderIntoDocument(
          <RefForwardingComponent ref={ref} setRefOnDiv={true} />
        );
        expect(ref.current.tagName.toLowerCase()).toBe('div');

        TestUtils.renderIntoDocument(
          <RefForwardingComponent ref={ref} setRefOnDiv={false} />
        );
        expect(ref.current.tagName.toLowerCase()).toBe('span');
      });

      it('should maintain child instance and ref through updates', () => {
        // TODO: Make tests work with async rendering
        let passedProp;
        class Child extends React.Component {
          constructor(props) {
            super(props);
          }
          render() {
            passedProp = this.props.value;
            return null;
          }
        }

        function Wrapper(props) {
          return <Child {...props} ref={props.forwardedRef} />;
        }

        const RefForwardingComponent = forwardRef((props, ref) => (
          <Wrapper {...props} forwardedRef={ref} />
        ));

        let setRefCount = 0;
        let _ref;

        const _createRef = createRef();
        const ref = function(r) {
          setRefCount++;

          if (React.createRef) {
            _ref = r;
          } else {
            _createRef(r);
            _ref = _createRef.current;
          }
        };

        const div = document.createElement('div');

        ReactDOM.render(<RefForwardingComponent ref={ref} value={123} />, div);
        expect(passedProp).toEqual(123);
        expect(_ref instanceof Child).toBe(true);
        expect(setRefCount).toBe(1);
        ReactDOM.render(<RefForwardingComponent ref={ref} value={456} />, div);
        expect(passedProp).toEqual(456);
        expect(_ref instanceof Child).toBe(true);
        expect(setRefCount).toBe(1);
      });

      it('should support rendering null', () => {
        const RefForwardingComponent = forwardRef((props, ref) => null);

        const ref = createRef();

        TestUtils.renderIntoDocument(<RefForwardingComponent ref={ref} />);
        expect(ref.current).toBe(null);
      });

      it('should support rendering null for multiple children', () => {
        const RefForwardingComponent = forwardRef((props, ref) => null);

        const ref = createRef();

        TestUtils.renderIntoDocument(
          <div>
            <div />
            <RefForwardingComponent ref={ref} />
            <div />
          </div>
        );
        expect(ref.current).toBe(null);
      });

      it('should warn if not provided a callback during creation', () => {
        const error = console.error;
        console.error = jest.fn();
        //jest.spyOn(console, 'error');
        forwardRef();
        expect(console.error).toHaveBeenLastCalledWith(
          'Warning: forwardRef requires a render function but was given undefined.'
        );
        forwardRef(undefined);
        expect(console.error).toHaveBeenLastCalledWith(
          'Warning: forwardRef requires a render function but was given undefined.'
        );
        forwardRef(null);
        expect(console.error).toHaveBeenLastCalledWith(
          'Warning: forwardRef requires a render function but was given null.'
        );
        forwardRef('foo');
        expect(console.error).toHaveBeenLastCalledWith(
          'Warning: forwardRef requires a render function but was given string.'
        );
        console.error.mockClear();
        console.error = error;
      });

      if (React.forwardRef) {
        it('should use React.forwardRef if found', () => {
          expect(React.forwardRef).toEqual(forwardRef);
        });
      }
    });
  });
});
