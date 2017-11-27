process.env.NODE_ENV = 'test';
const HttpMock = require('node-mocks-http');
const Boom = require('boom');
const knex = require('knex');
const KnexMock = require('mock-knex');
const EntityController = require('../controllers/EntityController');

describe('EntityController', () => {
  const db = knex({ client: 'pg' });
  let knexTracker = null;
  let entityController = null;
  const entityService = {
    createToken: jest.fn(),
    getAllUser: jest.fn(),
    getUserById: jest.fn()
  };

  beforeAll(() => {
    KnexMock.mock(db);
    entityController = new EntityController(
      {
        entityName: 'User',
        entityService
      },
      db
    );
  });

  beforeEach(() => {
    knexTracker = KnexMock.getTracker();
    knexTracker.install();
  });

  describe('createToken', () => {
    it('should respond with HTTP status 201 and the created entity', async () => {
      const inputEntity = {
        name: 'Some name',
        password: 'Some password',
        description: 'Some description'
      };

      const expectedEntity = Object.assign({}, inputEntity, { id: 1 });

      knexTracker.on('query', (query, step) => {
        expect(query.method).toBe('insert');
        query.response([expectedEntity]);
      });

      const actualEntity = await entityController.createToken(inputEntity);

      expect(actualEntity).toEqual(expectedEntity);
      expect(omit(actualEntity, 'id')).toEqual(inputEntity);

      //
      const request = HttpMock.createRequest({ body: inputEntity });
      const response = HttpMock.createResponse();

      entityService.createToken.mockReturnValueOnce(
        Promise.resolve(expectedEntity)
      );

      await entityController.createToken(request, response, () => {});

      const actualEntityy = JSON.parse(response._getData());

      expect(actualEntityy).toEqual(expectedEntity);
      expect(response._isJSON()).toBe(true);
      expect(response._getStatusCode()).toBe(201);
      expect(response._getHeaders().Location).toBe(`/entities/1`);
    });

    it('should respond with HTTP status 400 when underlying service detects invalid input', async () => {
      const inputEntity = {
        description: 'Some description'
      };

      const request = HttpMock.createRequest({ body: inputEntity });
      const response = HttpMock.createResponse();

      const next = jest.fn();

      entityService.createToken.mockReturnValueOnce(
        Promise.reject(new Error('Service.ERROR_INVALID_INPUT'))
      );

      await entityController.createToken(request, response, next);

      expect(next).toBeCalledWith(
        Boom.badRequest('Service.ERROR_INVALID_INPUT')
      );
    });
  });

  afterEach(() => {
    knexTracker.uninstall();
  });
});
