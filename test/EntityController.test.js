process.env.NODE_ENV = 'test';
const HttpMock = require('node-mocks-http');
const knex = require('knex');
const KnexMock = require('mock-knex');
const EntityController = require('../controllers/EntityController');
const { omit } = require('../utils/ObjectUtils');
const bcrypt = require('bcryptjs');

describe('EntityController', () => {
  const db = knex({ client: 'pg' });
  let knexTracker = null;
  let entityController = null;
  const entityService = {
    createToken: jest.fn(),
    getAllUsers: jest.fn(),
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

      const expectedEntity = Object.assign({}, inputEntity, {
        id: 1,
        hashedPassword: bcrypt.hashSync('some password', 12)
      });

      knexTracker.on('query', (query, step) => {
        expect(query.method).toBe('select');
        query.response([expectedEntity]);
      });

      const request = HttpMock.createRequest({ body: inputEntity });
      const response = HttpMock.createResponse();
      const next = jest.fn();

      entityService.createToken.mockReturnValueOnce(
        Promise.resolve(expectedEntity)
      );

      await entityController.createToken(request, response, next);

      const actualEntity = JSON.parse(response._getData());

      expect(actualEntity).toEqual(expectedEntity);
      expect(response._isJSON()).toBe(true);
      expect(response._getStatusCode()).toBe(200); //or 201?
    });

    afterEach(() => {
      knexTracker.uninstall();
    });

    afterAll(() => {
      KnexMock.unmock(db);
    });
  });
});
