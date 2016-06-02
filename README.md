[![CircleCI](https://circleci.com/gh/pearlshare/mailchimp-client.svg?style=svg&circle-token=8465700c57b2460ac02813ecc4a7262d495e31b5)](https://circleci.com/gh/pearlshare/mailchimp-client)

# Mailchimp client

The mailchimp API is relatively straight forward so rather than a huge client library this is a simple wrapper which lets you specify the url and simply add the auth and does the request.

Supports Mailchimp API 3.0 or greater

## Usage

First create a client with the appropriate options you require.

```javascript

    var Mailchimp = require('mailchimp-client');

    var client = new Mailchimp(apiKey: 'xxx', version: "3.0");
```

Then perform the action you require. See the Mailchimp documentation for endpoint and param details.

```javascript

    client.post('lists/<listId>/subscribe', {email_address: 'email@example.com', status: 'subscribed'}, function(err, member){
        console.log(member); // {email: "email@example.com", euid: 'yyyyy', leid: 'yyyyyy'}
    });


```

Note: If no callback is passed an A+ promise is returned
