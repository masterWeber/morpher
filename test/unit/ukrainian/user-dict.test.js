'use strict';

const assert = require('chai').assert;
const Response = require('node-fetch').Response;
const CommunicatorMock = require('../communicator-mock');
const UserDict = require('../../../src/ukrainian/user-dict');
const MorpherError = require('../../../src/morpher-error');
const CorrectionEntry = require('../../../src/ukrainian/correction-entry');
const CorrectionForms = require('../../../src/ukrainian/correction-forms');

describe('Ukrainian UserDict', function() {

  describe('#addOrUpdate()', async function() {

    const communicatorMock = new CommunicatorMock();

    const userDict = new UserDict(communicatorMock);

    it('should use the correct parameters', async function() {

      const response = true;

      communicatorMock.response = new Response(
          JSON.stringify(response),
          {status: 200},
      );

      await userDict.addOrUpdate({
        singular: {
          nominative: 'Кiшка',
          genitive: 'Пантерi',
        },
      });

      assert.equal(
          userDict.communicator.lastPath,
          '/ukrainian/userdict',
      );
      assert.equal(
          userDict.communicator.lastParams.get('Н'),
          'Кiшка',
      );
      assert.equal(
          userDict.communicator.lastParams.get('Р'),
          'Пантерi',
      );
      assert.equal(
          userDict.communicator.lastHttpMethod,
          CommunicatorMock.METHOD_POST,
      );

    });

    it('should return true', async function() {

      communicatorMock.response = new Response(
          '',
          {status: 200},
      );

      const entry = {
        singular: {
          nominative: 'Кiшка',
          dative: 'Пантерi',
        },
      };

      const result = await userDict.addOrUpdate(entry);

      assert.equal(result, true);
    });

    it('should throw MorpherError', async function() {

      const response = {
        'code': 6,
        'message': 'Не указан обязательный параметр: Н.',
      };

      communicatorMock.response = new Response(
          JSON.stringify(response),
          {status: 400},
      );

      try {
        await userDict.addOrUpdate();
      } catch (err) {
        assert.instanceOf(err, MorpherError);
      }

    });

  });

  describe('#getAll()', async function() {

    const communicatorMock = new CommunicatorMock();

    const userDict = new UserDict(communicatorMock);

    it('should return an array of CorrectionEntry', async function() {

      const response = [
        {
          singular: {
            'Н': 'Кiшка',
            'Д': 'Пантерi',
          }
        },
      ];

      communicatorMock.response = new Response(
          JSON.stringify(response),
          {status: 200},
      );

      const result = await userDict.getAll();

      assert.isArray(result);

      result.forEach(ce => {
        assert.instanceOf(ce, CorrectionEntry);
        assert.instanceOf(ce.singular, CorrectionForms);
      });
    });

    it('should throw MorpherError', async function() {

      const response = {
        'code': 9,
        'message': 'Данный токен не найден.',
      };

      communicatorMock.response = new Response(
          JSON.stringify(response),
          {status: 498},
      );

      try {
        await userDict.getAll();
      } catch (err) {
        assert.instanceOf(err, MorpherError);
      }

    });

  });

  describe('#remove()', async function() {

    const communicatorMock = new CommunicatorMock();

    const userDict = new UserDict(communicatorMock);

    it('should use the correct parameters', async function() {

      const response = true;

      communicatorMock.response = new Response(
          JSON.stringify(response),
          {status: 200},
      );

      await userDict.remove('Кошка');

      assert.equal(
          userDict.communicator.lastPath,
          '/ukrainian/userdict',
      );
      assert.equal(
          userDict.communicator.lastParams.get('s'),
          'Кошка',
      );
      assert.equal(
          userDict.communicator.lastHttpMethod,
          CommunicatorMock.METHOD_DELETE,
      );

    });

    it('should return true', async function() {

      const response = true;

      communicatorMock.response = new Response(
          JSON.stringify(response),
          {status: 200},
      );

      const result = await userDict.remove('Кiшка');

      assert.equal(result, true);

    });

    it('should throw MorpherError', async function() {

      const response = {
        'code': 6,
        'message': 'Не указан обязательный параметр: s.',
      };

      communicatorMock.response = new Response(
          JSON.stringify(response),
          {status: 400},
      );

      try {
        await userDict.addOrUpdate();
      } catch (err) {
        assert.instanceOf(err, MorpherError);
      }

    });

  });

});