var Mailchimp = require("../"),
    expect = require("expect.js"),
    nock = require("nock"),
    Bluebird = require("bluebird"),
    listSubscribeSuccess = require("./fixtures/list-subscribe-success");

describe("simpleMailchimp", function(){
  it("should return a constructor", function () {
    expect(Mailchimp);
  });

  it("should throw an error without an options object", function () {
    try {
      new Mailchimp();
    } catch (e) {
      expect(e).not.to.be(undefined);
    }
  });

  describe("client", function(){
    var client = new Mailchimp({apiKey: "xxx"}),
        promiseClient = new Mailchimp({apiKey: "xxx", promise: Bluebird}),
        userDetails = {
          id: "testList",
          email: {
            email: "email@example.com"
          },
          "merge_vars": {
            FNAME: "Fred",
            LNAME: "Flintstone",
            "double_optin": true,
            "mc_language": "en"
          }
        };

    it("should have a perform function", function () {
      expect(client).to.have.property("perform").and.to.be.a("object");
      expect(client.perform).to.be.a("function");
    });

    describe("lists/subscribe", function(){

      beforeEach(function(){
        nock(client.host)
          .filteringPath(function(path){
            if (path.match(/lists\/subscribe/)) {
              return "/2.0/lists/subscribe";
            }
          })
          .post("/2.0/lists/subscribe")
          .reply(200, listSubscribeSuccess);
      });

      it("should make a request and callback", function (done) {
        client.perform("lists/subscribe", userDetails, function(err, res){
          expect(res.body.email).to.equal(listSubscribeSuccess.email);
          expect(res.body.euid).to.equal(listSubscribeSuccess.euid);
          expect(res.body.leid).to.equal(listSubscribeSuccess.leid);
          done(err);
        });
      });

      it("should work with promises", function () {
        return promiseClient.perform("lists/subscribe", userDetails).then(function(res){
          expect(res.body.email).to.equal(listSubscribeSuccess.email);
          expect(res.body.euid).to.equal(listSubscribeSuccess.euid);
          expect(res.body.leid).to.equal(listSubscribeSuccess.leid);
        });
      });
    });

  });

});
