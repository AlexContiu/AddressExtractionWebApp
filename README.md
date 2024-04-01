## Description

This application constitutes a prototype for a web application to collect and interpret address data from different websites. It serves the purpose of being able to provide a list of URLs for such websites, and retrieve data in a format that is easier to work with.

## Setup

Requirements: MongoDB, NodeJs.

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

- ```/api/sites``` - It serves basic CRUD operations functionality for the website entities, implementing the GET, POST, PATCH and DELETE methods. GET requests can retrieve a list with all sites, or a specific site, where the URL is provided in the endpoint's parameters (ex: `/api/sites/example.com`). The other methods require the URL to be provided in the request's body. Here is an example:
```json
{
    "url": "example.com"
}
```

- ```/api/sites/extract-address/``` - This endpoint accepts PATCH requests. It takes the URL provided in the request's body and tries to collect the address data from the provided URL, if the URL was previously imported in the application. On success, the response will return the updated website data, containing all the addresses found. If data was already collected, the search won't be initiated. If no data is found, a message is returned accordingly in the response. The request's body must contain the website's URL, as mentioned previously for `/api/sites` endpoint. Here is an example of a response after address data is retrieved:
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

### The problem and the ideal solution

One thing to think of when trying to retrieve data from websites is how it is actually stored, how the website is rendered in the client, and what restrictions can prevent us from accessing the data (authentication, authorization, CAPTCHAs, etc).

### Site rendering

When trying to collect data, we must make sure we have all the data available. First thing to take in consideration is if the webpage is served statically or dynamically. Or if the website can provide any data. Considering this, the best approach could consider the following:
- If the website can not be reached, we don't search for any data.
- We try to use a lightweight browser tool to search for data, ideal for static webpages.
- For webpages that load dynamic page components, a headless browser could provide a great solution for this problem, especially if navigation in the context of the webpage is required to find the data.
- If data could not be retrieved, last option would be to check for it manually, using a headful browser (for example, the data could be embedded as an image instead of text, which could be more difficult to look for).

Due to the early stages of development, the application currently uses a headless browser (using `Puppeteer`) to solve some of these problems. It could be less time efficient when the webpage is served statically, especially if we want to check out multiple URLs.

In the current solution, the application will search only on the webpage of the provided URL, without performing navigation or looking up links and references inside the page. For example, if the provided URL is `example.com` and the address data is only found at `example.com/contact`, the application will not return any data. However, the URL to the contact page can be added as a site entry in the application to perform the search.

### Data format and data collection

The most important aspect about retrieving the address data is how it is served. The main problem comes from having many different URLs, and for each of them the address data can be found anywhere in the context of the webpage's html file. This means that it can be hard to find a repeating pattern to match all the URLs, since there are many ways to expose the address data in the context of the html tags, especially if they are nested.

The application tries to solve this problem by taking the content of the webpage and searching for any piece of text that matches the pattern of an address. There are many formats in which the addresses can be displayed. Currently, the application uses a format similar to the one used by `Google Maps` for most of the addresses: `Street Number`, `Street Name and Type`, `City`, `State` (Two Letter Abbreviation), `Zip Code`, `Country Name`.

More information about the `Google Maps`' address format can be found at https://support.google.com/mapcontentpartners/answer/160409?hl=en

The pattern matching is achieved by using RegEx matching. A better approach could be the use of an AI model to perform the searching task, or to use more address patterns for data validation.

**Observation:** sometimes, the address data provided by the website could be incomplete. For example, the `country` component could be missing. One approach to fill the missing components of the address could be using the `Google Maps` APIs to query existent address data and get the complete location details.

### Data protection

The application only collects the data served by accessing the provided URLs. It does not bypass security measures, such as authentication, authorization rules, CAPTCHAs, etc.

## Possible improvements

- Building the `Frontend` side of the application to visualize, change and collect site and address data. Further development progress could lead to providing a headful browser experience for manually collecting address data.
- Codebase refactoring - due to it's early stages of development, the application is not failproof. Improper use of it's features could lead the application to crash. More validations and error handlings could be added. Scalability could also be improved.
- Exporting data in an easy-to-read format, that can be easily worked with in conjunction with other applications.
