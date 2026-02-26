import { ArgumentsHost, HttpException, NotFoundException } from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filters';

describe('AllExceptionsFilter', () => {
  const makeHost = () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const getResponse = jest.fn(() => ({ status }));
    const getRequest = jest.fn(() => ({ url: '/x' }));

    const host = {
      switchToHttp: () => ({ getResponse, getRequest }),
    } as unknown as ArgumentsHost;

    return { host, status, json };
  };

  it('should handle HttpException', () => {
    const { host, status, json } = makeHost();
    const filter = new AllExceptionsFilter();

    const exception = new HttpException({ message: 'Bad request' }, 400);

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        path: '/x',
      }),
    );
  });

  it('should handle NotFoundException as 404', () => {
    const { host, status } = makeHost();
    const filter = new AllExceptionsFilter();

    filter.catch(new NotFoundException('Not found'), host);

    expect(status).toHaveBeenCalledWith(404);
  });

  it('should handle unknown error as 500', () => {
    const { host, status, json } = makeHost();
    const filter = new AllExceptionsFilter();

    filter.catch(new Error('boom'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Erro inesperado, tente novamente mais tarde.',
      }),
    );
  });
});