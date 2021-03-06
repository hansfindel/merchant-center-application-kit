import React from 'react';
import { shallow } from 'enzyme';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import ApplicationLoader from '../application-loader';
import ErrorApologizer from '../error-apologizer';
import AsyncChunkLoader from './async-chunk-loader';

jest.mock('@commercetools-frontend/sentry');

const createTestProps = props => ({
  pastDelay: true,
  ...props,
});

describe('rendering', () => {
  let wrapper;
  let props;
  describe('if there is an error', () => {
    beforeEach(() => {
      props = createTestProps({ error: new Error('Oops') });
      wrapper = shallow(<AsyncChunkLoader {...props} />);
    });
    it('should render <ErrorApologizer>', () => {
      expect(wrapper).toRender(ErrorApologizer);
    });
  });
  describe('if there is no error and the delay is already exceeded', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AsyncChunkLoader {...props} />);
    });
    it('should render <ApplicationLoader>', () => {
      expect(wrapper).toRender(ApplicationLoader);
    });
    describe('when component is mounted', () => {
      beforeEach(() => {
        reportErrorToSentry.mockClear();
        wrapper.instance().componentDidMount();
      });
      it('should not report the error to sentry', () => {
        expect(reportErrorToSentry).not.toHaveBeenCalled();
      });
    });
  });
  describe('if there is no error and the delay is not being exceded', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AsyncChunkLoader pastDelay={false} />);
    });
    it('should render null', () => {
      expect(wrapper.type()).toBe(null);
    });
    describe('when component is mounted', () => {
      beforeEach(() => {
        reportErrorToSentry.mockClear();
        wrapper.instance().componentDidMount();
      });
      it('should not report the error to sentry', () => {
        expect(reportErrorToSentry).not.toHaveBeenCalled();
      });
    });
  });
});

describe('lifecycle', () => {
  let props;
  let wrapper;

  describe('componentDidMount', () => {
    beforeEach(() => {
      reportErrorToSentry.mockClear();
    });
    describe('with `error`', () => {
      beforeEach(() => {
        props = createTestProps({
          error: new Error('Oops'),
        });
        wrapper = shallow(<AsyncChunkLoader {...props} />);

        wrapper.instance().componentDidMount();
      });

      it('should report the error to sentry', () => {
        expect(reportErrorToSentry).toHaveBeenCalledWith(props.error, {});
      });
    });

    describe('without `error`', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<AsyncChunkLoader {...props} />);

        wrapper.instance().componentDidMount();
      });

      it('should not report to sentry', () => {
        expect(reportErrorToSentry).not.toHaveBeenCalledWith();
      });
    });
  });

  describe('componentDidUpdate', () => {
    let prevProps;
    beforeEach(() => {
      reportErrorToSentry.mockClear();
    });
    describe('with different `error`', () => {
      beforeEach(() => {
        props = createTestProps({
          error: new Error('Oops'),
        });
        prevProps = createTestProps({
          error: new Error('Oopssaaa'),
        });
        wrapper = shallow(<AsyncChunkLoader {...props} />);

        wrapper.instance().componentDidUpdate(prevProps);
      });

      it('should report the error to sentry', () => {
        expect(reportErrorToSentry).toHaveBeenCalledWith(props.error, {});
      });
    });

    describe('with same `error`', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<AsyncChunkLoader {...props} />);

        wrapper.instance().componentDidUpdate(props);
      });

      it('should not report to sentry', () => {
        expect(reportErrorToSentry).not.toHaveBeenCalledWith();
      });
    });
  });
});
