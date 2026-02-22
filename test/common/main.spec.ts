const mockApp = {
  setGlobalPrefix: jest.fn(),
  useGlobalFilters: jest.fn(),
  useGlobalPipes: jest.fn(),
  enableCors: jest.fn(),
  listen: jest.fn().mockResolvedValue(undefined),
};


const createMock = jest.fn().mockResolvedValue(mockApp);

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: (...args: any[]) => createMock(...args),
  },
}));



const documentBuilderInstance: any = {
  setTitle: jest.fn().mockReturnThis(),
  setDescription: jest.fn().mockReturnThis(),
  setVersion: jest.fn().mockReturnThis(),
  addBearerAuth: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({ built: true }),
};

const SwaggerModuleMock = {
  createDocument: jest.fn().mockReturnValue({ openapi: '3.0.0' }),
  setup: jest.fn(),
};

const noopDecorator = (..._args: any[]) => {
  return (..._decoratorArgs: any[]) => undefined;
};

jest.mock('@nestjs/swagger', () => {
  const base: any = {
    DocumentBuilder: jest.fn().mockImplementation(() => documentBuilderInstance),
    SwaggerModule: SwaggerModuleMock,

  
    getSchemaPath: jest.fn().mockImplementation((model: any) => {
      const name = typeof model === 'function' ? model.name : 'Object';
      return `#/components/schemas/${name || 'Object'}`;
    }),
  };


  return new Proxy(base, {
    get(target, prop: string | symbol) {
      if (prop in target) return (target)[prop];

      if (typeof prop === 'string' && prop.startsWith('Api')) {
        return noopDecorator;
      }

      return undefined;
    },
  });
});



describe('main bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

   
    process.env.JWT_SECRET = 'test-secret';
    process.env.PORT = '3333';
  });

  it('should bootstrap app with global prefix, filters, pipes, cors and listen', async () => {
    await jest.isolateModulesAsync(async () => {
      await import('../../src/main'); 
    });

    // bootstrap chamado
    expect(createMock).toHaveBeenCalledTimes(1);


    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    expect(mockApp.useGlobalFilters).toHaveBeenCalled();
    expect(mockApp.useGlobalPipes).toHaveBeenCalled();
    expect(mockApp.enableCors).toHaveBeenCalled();


    if (SwaggerModuleMock.setup.mock.calls.length > 0) {
      expect(SwaggerModuleMock.setup).toHaveBeenCalledWith(
        'docs',
        mockApp,
        expect.any(Function),
      );
    }

    expect(mockApp.listen).toHaveBeenCalledWith('3333');
  });
});