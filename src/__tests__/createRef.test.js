import withReact from '../../test-utils/withReact';

const name = 'cjs';

describe(`create-react-ref (${name})`, () => {
  withReact(({ React, ReactDOM, TestUtils, version }) => {
    describe(`react@${version}`, () => {
      let createRef;

      beforeEach(() => {
        jest.resetModules();
        jest.setMock('react', React);
        jest.setMock('react-dom', ReactDOM);
        createRef = require('../createRef');
      });

      it('should create a function with a current property if polyfilled', () => {
        const ref = createRef();

        if (React.createRef) {
          expect(typeof ref).toEqual('object');
        } else {
          expect(typeof ref).toEqual('function');
        }
        expect(ref.current).toEqual(null);
      });

      // Borrowed from React's tests
      it('should support object-style refs', () => {
        const innerObj = {};
        const outerObj = {};

        class Wrapper extends React.Component {
          getObject = () => {
            return this.props.object;
          };

          render() {
            return <div>{this.props.children}</div>;
          }
        }

        let mounted = false;

        class Component extends React.Component {
          constructor() {
            super();
            this.innerRef = createRef();
            this.outerRef = createRef();
          }
          render() {
            const inner = <Wrapper object={innerObj} ref={this.innerRef} />;
            const outer = (
              <Wrapper object={outerObj} ref={this.outerRef}>
                {inner}
              </Wrapper>
            );
            return outer;
          }

          componentDidMount() {
            expect(this.innerRef.current.getObject()).toEqual(innerObj);
            expect(this.outerRef.current.getObject()).toEqual(outerObj);
            mounted = true;
          }
        }

        TestUtils.renderIntoDocument(<Component />);
        expect(mounted).toBe(true);
      });
    });
  });
});
