const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
// Viewing one stock: GET request to /api/stock-prices/
    suite("5 functional tests", function() {
        test("Viewing one stock: GET request to /api/stock-prices/", function(done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .query({stock: "goog"})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData.stock, "GOOG");
                    assert.exists(res.body.stockData.price, "GOOG has a price");
                    done();
                });
        });
        test("Viewing one stock and liking it: GET request to /api/stock-prices/", function(done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .query({stock: "goog", like: "true"})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData.stock, "GOOG");
                    assert.exists(res.body.stockData.price,"GOOG has a price");
                    assert.equal(res.body.stockData.likes,1);
                    done();
                });
        });
        test("Viewing one stock and liking it: GET request to /api/stock-prices/", function(done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .query({stock: "goog", like: "true"})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData.stock, "GOOG");
                    assert.exists(res.body.stockData.price,"GOOG has a price");
                    assert.equal(res.body.stockData.likes,1);
                    done();
                });
        });
        test("Viewing two stocks: GET request to /api/stock-prices/", function(done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .query({stock: ["goog","msft"]})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData[0].stock, "GOOG");
                    assert.exists(res.body.stockData[0].price,"GOOG has a price");
                    assert.equal(res.body.stockData[1].stock, "MSFT");
                    assert.exists(res.body.stockData[1].price,"MSFT has a price");
                    done();
                });
        });
        test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function(done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .query({stock: ["goog","msft"], like: "true"})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData[0].stock, "GOOG");
                    assert.exists(res.body.stockData[0].price,"GOOG has a price");
                    assert.exists(res.body.stockData[0].rel_likes,"has rel_likes");
                    assert.equal(res.body.stockData[1].stock, "MSFT");
                    assert.exists(res.body.stockData[1].price,"MSFT has a price");
                    assert.exists(res.body.stockData[1].rel_likes,"has rel_likes");
                    done();
                });
        });
// Viewing one stock and liking it: GET request to /api/stock-prices/
// Viewing the same stock and liking it again: GET request to /api/stock-prices/
// Viewing two stocks: GET request to /api/stock-prices/
// Viewing two stocks and liking them: GET request to /api/stock-prices/
    });
});
