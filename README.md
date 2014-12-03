# Simple Mailchimp

The mailchimp API is relatively straight forward so rather than a huge client library this is a simple wrapper which lets you specify the url and simply add the auth and does the request.

## Usage

First create a client with the appropriate options you require.

```javascript

    var Mailchimp = require('simple-mailchimp');

    var client = new Mailchimp(apiKey: 'xxx', version: 2);
```

Then perform the action you require. See the Mailchimp documentation for endpoint and param details.

```javascript

    client.perform('lists/subscribe', {id: 'listId', email: {email: 'email@example.com'}}, function(err, res){
        console.log(res.body); // {email: "email@example.com", euid: 'yyyyy', leid: 'yyyyyy'}
    });


```

