'use strict';
describe("Connecting", function () {
  before(function() {
    return resetDb("loader");
  });

  it("connects with a connectionString", function* () {
    const db = yield massive({
      connectionString: connectionString,
      scripts: `${__dirname}/db`,
      noWarnings: true
    });

    assert.isOk(db);
    assert.isOk(db.t1);
  });

  it("builds a connectionString if given a database name", function* () {
    const db = yield massive({
      db: "massive",
      scripts: `${__dirname}/db`,
      noWarnings: true
    });

    assert.isOk(db);
    assert.isOk(db.t1);
  });

  it("connects with pool configuration", function* () {
    const db = yield massive({
      user: "postgres",
      database: "massive",
      host: "localhost",
      port: 5432,
      poolSize: 5,
      scripts: `${__dirname}/db`,
      noWarnings: true
    });

    assert.isOk(db);
    assert.isOk(db.t1);
  });

  it("rejects with connection errors", function () {
    return massive({
      database: 'doesntexist',
      scripts: `${__dirname}/db`,
      noWarnings: true
    }).then(
      () => { assert.fail(); },
      err => {
        assert.equal(err.code, '3D000');
        return Promise.resolve();
      }
    );
  });

  it("allows undefined scripts directories", function () {
    return massive({
      db: "massive",
      noWarnings: true
    });
  });

  it("overrides and applies defaults", function* () {
    const db = yield massive({
      connectionString: connectionString,
      scripts: `${__dirname}/db`,
      defaults: {
        parseInt8: true
      },
      noWarnings: true
    });

    return assert.eventually.strictEqual(db.t1.count(), 0);
  });

  it("rejects connection blocks without a connstr or db", function () {
    assert.isRejected(massive({}), 'No connection information specified.');
  });
});
