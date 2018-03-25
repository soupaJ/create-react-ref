import withReact from '../../test-utils/withReact';
const name = 'cjs';

describe(`create-react-ref (${name})`, () => {
  withReact(({ React, ReactDOM, TestUtils, version }) => {
    describe(`react@${version}`, () => {
      let createRef;
      let forwardRef;
      let getRef;

      beforeEach(() => {
        jest.resetModules();
        jest.setMock('react', React);
        jest.setMock('react-dom', ReactDOM);
        getRef = require('../getRef');
        createRef = require('../createRef');
        forwardRef = require('../forwardRef');
      });

      it('should do return the ref from the createRef object', () => {
        let ref = createRef();
        const Component = props => <div ref={ref} />;

        TestUtils.renderIntoDocument(<Component />);
        expect(getRef(ref).tagName.toLowerCase()).toBe('div');
      });

      it('should return null if not passed a function or object', () => {
        expect(getRef()).toBe(null);
        expect(getRef(null)).toBe(null);
      });

      it('should return the ref from the ref callback', () => {
        const Component = props => (
          <div
            ref={ref => {
              expect(getRef(ref).tagName.toLowerCase()).toBe('div');
            }}
          />
        );

        TestUtils.renderIntoDocument(<Component />);
      });

      it('should warn if not provided a ref object or inside a ref callback', () => {
        const error = console.error;
        console.error = jest.fn();
        getRef(() => {});
        expect(console.error).toHaveBeenLastCalledWith(
          'Warning: getRef: It looks like you may have passed `getRef` the ref ' +
            'callback as an argument. `getRef` should be used with a ref object ' +
            'created by `createRef` or inside a ref callback.'
        );
        console.error.mockClear();
        const ref = getRef(createRef());
        expect(console.error).not.toBeCalled();
        expect(ref).toEqual(null);
        console.error = error;
      });
    });
  });
});
