var Mailchimp = require("../"),
    expect = require("expect.js"),
    nock = require("nock"),
    listSubscribeSuccess = require("./fixtures/list-subscribe-success");

describe("mailchimpClient", function (){
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

  describe("client", function (){
    var client = new Mailchimp({apiKey: "xxx"});
    var userDetails = {
      "email_address": "email@example.com",
      "merge_vars": {
        "FNAME": "Fred",
        "LNAME": "Flintstone",
        "double_optin": true,
        "mc_language": "en"
      }
    };
    var listId = "testList";

    it("should have a perform function", function () {
      expect(client).to.have.property("post").and.to.be.a("object");
      expect(client).to.have.property("get").and.to.be.a("object");
      expect(client.post).to.be.a("function");
      expect(client.get).to.be.a("function");
    });

    describe("lists/subscribe", function () {

      beforeEach(function (){
        nock(client.host)
          .filteringPath(function (path){
            if (path.match(/lists/)) {
              return "/3.0/lists/" + listId + "/subscribe";
            }
          })
          .post("/3.0/lists/" + listId + "/subscribe")
          .reply(200, listSubscribeSuccess);
      });

      it("should subscribe and callback", function (done) {
        client.post("lists/" + listId + "/subscribe", {
          body: userDetails
        }, function (err, member) {
          if (err) {
            done(err);
            return;
          }

          expect(member.email).to.equal(listSubscribeSuccess.email);
          expect(member.euid).to.equal(listSubscribeSuccess.euid);
          expect(member.leid).to.equal(listSubscribeSuccess.leid);
          done();
        });
      });

      it("should subscribe and return a promise", function () {
        return client.post("lists/" + listId + "/subscribe", {
          body: userDetails
        }).then(function (member) {
          expect(member.email).to.equal(listSubscribeSuccess.email);
          expect(member.euid).to.equal(listSubscribeSuccess.euid);
          expect(member.leid).to.equal(listSubscribeSuccess.leid);
        });
      });
    });

  });

});
