import { reportErrorFactory } from './sentry';

const createDebugLogger = () => ({
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
});

const mockId = 'mock-id';
const createProductionLogger = () => ({
  captureException: jest.fn(),
  lastEventId: jest.fn(() => mockId),
});

describe('with "production"-environment', () => {
  let debugLogger;
  let error;
  let productionLogger;
  let reportError;

  beforeEach(() => {
    debugLogger = createDebugLogger();
    productionLogger = createProductionLogger();
    reportError = reportErrorFactory(
      'production',
      debugLogger,
      productionLogger
    );

    error = new Error('Boom');
    reportError(error);
  });

  it('it should should call `productionLogger.captureException` once', () => {
    expect(productionLogger.captureException).toHaveBeenCalledTimes(1);
  });

  it('should call `productionLogger.captureException` with the error-object', () => {
    expect(productionLogger.captureException).toHaveBeenCalledWith(error);
  });

  it('should call `debugLogger.error` with the generated `errorId`', () => {
    expect(debugLogger.error).toHaveBeenCalledWith(
      expect.stringContaining(mockId)
    );
  });
});

describe('with "development"-environment', () => {
  let debugLogger;
  let error;
  let productionLogger;
  let reportError;

  beforeEach(() => {
    debugLogger = createDebugLogger();
    productionLogger = createProductionLogger();
    reportError = reportErrorFactory(
      'development',
      debugLogger,
      productionLogger
    );
  });

  describe('with an instance of `Error` as parameter', () => {
    beforeEach(() => {
      error = new Error('Boom');
      reportError(error);
    });

    it('should not call `productionLogger.captureException`', () => {
      expect(productionLogger.captureException).not.toHaveBeenCalled();
    });

    it('should call `debugLogger.error` with `error`', () => {
      expect(debugLogger.error).toHaveBeenCalledWith(error);
    });
  });

  describe('with a non `Error`-Object as parameter', () => {
    beforeEach(() => {
      error = 'Boom';
      reportError(error);
    });

    it('should warn about the parameter', () => {
      expect(debugLogger.warn).toHaveBeenCalled();
    });

    it('should call `debugLogger.error` with `error`', () => {
      expect(debugLogger.error).toHaveBeenCalledWith(error);
    });
  });
});

describe('with "test"-environment', () => {
  let debugLogger;
  let error;
  let productionLogger;
  let reportError;

  beforeEach(() => {
    debugLogger = createDebugLogger();
    productionLogger = createProductionLogger();
    reportError = reportErrorFactory('test', debugLogger, productionLogger);
    error = new Error('Boom');
    reportError(error);
  });

  it('should not call `productionLogger.captureException`', () => {
    expect(productionLogger.captureException).not.toHaveBeenCalled();
  });

  it('should not call `debugLogger.error`', () => {
    expect(debugLogger.error).not.toHaveBeenCalledWith();
  });
});
