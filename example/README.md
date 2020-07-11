# Recipe Book Example

This contains a basic example of how Recipe Book can be used with UI testing.

To run this example, you need to have Docker installed:

Start the server by running Recipe Book and the example UI in docker:

    npm run example

The example application is available at: [http://localhost:3000/test](http://localhost:3000/test).
 
⚠️`localhost` may be different if you are using docker machine.  If this is the case, you will need to replace `localhost` with your docker machine ip address.

Run the automated tests:

    npm test

Stop docker-compose after tests complete:

    docker-compose down --rmi all

The test suite uses [TestCafe](https://devexpress.github.io/testcafe/) which may require some additional permissions to run depending on your operating system and security settings.
