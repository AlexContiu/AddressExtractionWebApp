## Description

This application constitutes a prototype for a web application to collect and interpret address data from different websites. It serves the purpose of being able to provide a list of URLs for such websites, and retrieve data in a format that is easier to work with.

## Setup

Requirements: MongoDB, NodeJs

Open a terminal in the `Backend` folder and do the following:

- Install the required packages
```
npm install
```
Make sure NodeJs is installed, to be able to use `npm` (Node Package Manager). You can check your NodeJs installation by running the following command:
```
node -v
```
The result should be the current node version installed on the device.

- Create a `.env` file, containing the environment variables required to run the project. Here is a template:
```
SERVER_PORT =
MONGO_URI =
```
Make sure you can connect to the database when providing the MongoDB URI.

- Lastly, you can start the application by executing the following command:
```
npm start
```

## Usage

Currently, the application only provides backend services to process the address data. Requests can be sent to the server to retrieve and modify necessary data. The following endpoints are exposed for usage:

- ```/api/sites/import``` - Allows website URLs to be imported in the application. Currently, only parquet files are accepted and the entries need to respect the following format:
```
{ domain: 'example.com' }
```
The endpoint accepts a POST request. The content type must be set to `multipart/form-data` in the request's headers, and the body needs to respect the following format:
```
{
    file: file.parquet
}
```
where  `file.parquet` is the file containing the entries to be imported.

- ```/api/sites``` - It serves basic CRUD operations functionality for the website entities, implementing the GET, POST, PATCH and DELETE methods. GET requests can retrieve a list with all sites, or a specific site, where the url is provided in the endpoint's parameters (ex: `/api/sites/example.com`). The other methods require the URL to be provided in the request's body. Here is an example:
```json
{
    "url": "example.com"
}
```

- ```/api/sites/extract-adress/``` - This endpoint accepts PATCH requests. It takes the URL provided in the request's body and tries to collect the address data from the provided URL, if the URL was previously imported in the application. On success, the response will return the updated website data, containing all the addresses found. If data was already collected, the search won't be initiated. If no data is found, a message is returned accordingly in the response. The request's body must contain the website's URL, as mentioned previously for `/api/sites` endpoint. Here is an example of a response after address data is retrieved:
```json
{
    "_id": "6609b24df7ef14f51e687d60",
    "url": "example.com",
    "status": "Complete",
    "addresses": [
        {
            "country": "",
            "region": "AB",
            "city": "Somecity",
            "postcode": "123456",
            "road": "My Street",
            "road_number": "123",
            "raw_address": "123 My Street, Somecity, AB 12345",
            "_id": "6609cc29221f24bae261b63d"
        },
        {
            "country": "",
            "region": "CD",
            "city": "Another City",
            "postcode": "77777",
            "road": "Land Of Luck",
            "road_number": "4567",
            "raw_address": "4567 Land Of Luck, Another City, CD 77777",
            "_id": "6609cc29221f24bae261b63e"
        }
    ],
    "__v": 1
}
```

## Development Approach and Observations

In the development of the current solution, the main problem consisted in retrieving the address data and making sure it is parsed correctly, and that it is also complete. 
