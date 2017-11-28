process.env.NODE_ENV = 'test';
const HttpMock = require('node-mocks-http');
const Boom = require('boom');
const knex = require('knex');
const KnexMock = require('mock-knex');
const EntityController = require('../controllers/EntityController');
const { omit } = require('../utils/ObjectUtils');

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
        userTable: 'User',
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
    it('should create an Entity', async () => {
      const inputEntity = {
        name: 'some name',
        password: 'some password'
      };

      const expectedEntity = Object.assign({}, inputEntity, { id: 1 });

      console.log('expectedEntity-----', expectedEntity);

      knexTracker.on('query', (query, step) => {
        expect(query.method).toBe('insert');
        query.response([expectedEntity]);
      });

      const request = HttpMock.createRequest({ body: inputEntity });
      const response = HttpMock.createResponse();
      const next = jest.fn();

      console.log('request-----', request);
      console.log('response-----', response);
      console.log('next-----', next);

      // entityService.createToken.mockReturnValueOnce(
      //   Promise.resolve(expectedEntity)
      // );

      entityService.createToken.mockReturnValueOnce(
        Promise.reject(new Error('Service.ERROR_INVALID_INPUT'))
      );

      await entityController.createToken(request, response, next);

      const actualEntity = await entityController.createToken(
        request,
        response,
        next
      );

      console.log('actualEntity-----', actualEntity); //undefined

      expect(actualEntity).toEqual(expectedEntity);
      expect(omit(actualEntity, 'id')).toEqual(inputEntity);
      expect(next).toBeCalledWith(
        Boom.badRequest('Service.ERROR_INVALID_INPUT')
      );
    });

    afterEach(() => {
      knexTracker.uninstall();
    });

    afterAll(() => {
      KnexMock.unmock(db);
    });

    //HttpMock
    // describe('createToken', () => {
    //   it('should respond with HTTP status 201 and the created entity', async () => {
    //     const inputEntity = {
    //       name: 'Some name',
    //       password: 'Some password'
    //     };
    //
    //     const expectedEntity = Object.assign({}, inputEntity, { id: 1 });
    //
    //     const request = HttpMock.createRequest({ body: inputEntity });
    //     const response = HttpMock.createResponse();
    //
    //     entityService.createToken.mockReturnValueOnce(
    //       Promise.resolve(expectedEntity)
    //     );
    //
    //     await entityController.createToken(request, response, () => {});
    //
    //     const actualEntity = JSON.parse(response._getData()); //what is _getData()
    //
    //     expect(actualEntity).toEqual(expectedEntity);
    //     expect(response._isJSON()).toBe(true);
    //     expect(response._getStatusCode()).toBe(201);
    //     expect(response._getHeaders().Location).toBe(`/users/1`);
    //   });
    //
    //   it('should respond with HTTP status 400 when underlying service detects invalid input', async () => {
    //     const inputEntity = {
    //       description: 'Some description'
    //     };
    //
    //     const request = HttpMock.createRequest({ body: inputEntity });
    //     const response = HttpMock.createResponse();
    //
    //     const next = jest.fn();
    //
    //     entityService.createToken.mockReturnValueOnce(
    //       Promise.reject(new Error('Service.ERROR_INVALID_INPUT'))
    //     );
    //
    //     await entityController.createToken(request, response, next);
    //
    //     expect(next).toBeCalledWith(
    //       Boom.badRequest('Service.ERROR_INVALID_INPUT')
    //     );
    //   });
    // });
  });
});
