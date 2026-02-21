import { ArgumentsHost, BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filters';

function createMockHost(url = '/api/v1/test') {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });

  const getResponse = jest.fn().mockReturnValue({ status });
  const getRequest = jest.fn().mockReturnValue({ url });

  const switchToHttp = jest.fn().mockReturnValue({ getResponse, getRequest });

  const host = {
    switchToHttp,
  } as unknown as ArgumentsHost;

  return { host, status, json };
}

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle NotFoundException with 404', () => {
    const { host, status, json } = createMockHost('/api/v1/anything');

    filter.catch(new NotFoundException('Not found'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: expect.anything(),
      timestamp: expect.any(String),
      path: '/api/v1/anything',
    });
  });

  it('should handle HttpException (BadRequestException) using its status/response', () => {
    const { host, status, json } = createMockHost('/api/v1/validation');
    const ex = new BadRequestException(['field is required']);

    filter.catch(ex, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ex.getResponse(),
      timestamp: expect.any(String),
      path: '/api/v1/validation',
    });
  });

  it('should handle unknown errors with 500 and log them', () => {
    const { host, status, json } = createMockHost('/api/v1/boom');
    const loggerErrorSpy = jest
      .spyOn((filter as any).logger, 'error')
      .mockImplementation(() => undefined);

    const unknown = { message: 'boom', stack: 'stacktrace' };

    filter.catch(unknown as any, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro inesperado, tente novamente mais tarde.',
      timestamp: expect.any(String),
      path: '/api/v1/boom',
    });

    expect(loggerErrorSpy).toHaveBeenCalled();
  });
});