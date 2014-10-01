ajax-service-helper
===================

Standalone class to ease ajax requests without the need of external library.

Usage
=====

    var service = new Service('http://mydomain.com'); // If empty, then the uri passed to post, get or del function won't ever be modified
    var req = service.get('users'); //Will send a GET request on http://mydomain.com/users or on "users" under the current location if baseUrl is empty
    alert(req.responseText);

To enable asynchronous mode set the second parameter to true

    var req = service.get('users', true);
    req.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200)
          alert(this.responseText);
    };

The third parameter will add url encoded attributes to the request (will only work for post/put and delete methods)

    var req = service.put('users', true, {
      'id': 1
    }); //service.get('users', true, 'id=1') will work too

Success and error callbacks can also be defined.

    var req = service.get('users', true,
      function(req){
        alert(req.responseText);
      },
      function(req){
        alert(req.status);
      }
    );

Prebuild methods are get, post, put and delete

    var xmlHttp = service.post('users/1', true, 'name=toto&gender=male');
    var xmlHttp = service.put('users/1', true, 'name=tata');
    var xmlHttp = service.del('users/1',true);
