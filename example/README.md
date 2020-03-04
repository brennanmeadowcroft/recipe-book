# Recipe Book Example

This contains a basic example of how Recipe Book can be used with UI testing.

To run this example, you need to have Docker installed:

Start the server by running Recipe Book and the example UI in docker:

    npm run example

Run the automated tests:

    npm test

Stop docker-compose after tests complete:

    docker-compose down --rmi all

The test suite uses [TestCafe](https://devexpress.github.io/testcafe/) which may require some additional permissions to run depending on your operating system and security settings.
