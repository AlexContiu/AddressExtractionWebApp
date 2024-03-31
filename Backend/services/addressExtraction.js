const puppeteer = require("puppeteer")

const addressExtractionService = async (ctx) => {
    const url = ctx.url

    let content, addressList = []

    // google maps format: road_number, road name, city, state (2 letter abreviation) + postcode, country
    const regExp = /(\d+)\s+([\w\s#?.?]+)\s*,?\s*([\w\s]+)\s*,?\s*([A-Z]{2})\s*(\d{5})\s*,?\s*([\w\s]*)/g;

    try { 
		// Specify the URL of the web page 
		const URL = url.includes("https://") ? url : `https://${url}/`
 
		// Launch the headless browser 
		const browser = await puppeteer.launch()
		const page = await browser.newPage()

		// Go to the webpage 
		await page.goto(URL); 
 
        content = await page.content()

        let address
        while (address = regExp.exec(content)) {
            let addressData = {
                raw_address: address[0],
                road_number: address[1],
                road: address[2],
                city: address[3],
                region: address[4],
                postcode: address[5],
                country: address[6], 
            }

            addressList.push(addressData)
        }
 
		// Close the browser 
		await browser.close()
	} catch (error) { 
		console.error(error)
	}

    return addressList
}

module.exports = addressExtractionService