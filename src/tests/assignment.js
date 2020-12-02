/**
 * Created by ssg0265 on 2/12/20.
 */

const chromeDriver = require("../drivers/chrome");
const assert = require('assert');
const { By } = require('selenium-webdriver');
const chance = require('chance');
const Chance = new chance();

// create account locators
var createAccountButton = '#SubmitCreate > span';
var emailAddress = 'email_create';
var errorMessage = 'ol > li';

// you irnformation locators
let gender = function(sGender) {

    // id for gender radio button id_gender1/2 pass either of 1 or 2 as parameter and concatenate
    return 'id_gender' + sGender;
};
var fName = 'customer_firstname';
var lName = 'customer_lastname';
var password = 'passwd';
let selectDrpDown = function(locator, value) {

    //driver.findElement(By.id(locator)).click().
    //return dropdown.findElement(By.xpath('//option[. = "regexp:"' +value+'"\\s+"]')).click()
    //driver.findElement(By.xpath('//option[. = "regexp:10\\s+"]')).click();
    driver.findElement(By.id(locator));
    return driver.findElement(By.id(locator)).sendKeys(value);

};
var radioNewselter = 'newsletter';
var offerOption = "optin";
var Add1 = "address1";
var city = "city";
var pCode = 'postcode';
var mNumber = 'phone_mobile';
var addressAlias = 'alias';
var register = '#submitAccount > span';
var accountCreationMessage = '.info-account';

let driver;

// basic function
let clickElement= (locator) => driver.findElement(locator).click();

let enterText = function (locator, sData) {

    driver.findElement(locator).clear();
    return driver.findElement(locator).sendKeys(sData);
};

// Random email ID
let makeEmailID = function (domain) {

    var emailID = Chance.email({domain: domain});

    return emailID;
};


// Enter personal info
let personalInfo = async function (email) {
// select gender
    await clickElement(By.id(gender('2')));
    await enterText(By.id(fName), 'test');
    await enterText(By.id(lName), 'QA');
    await enterText(By.id(password), email);
    await selectDrpDown('days', '15');
    await selectDrpDown('months', 'August');
    await selectDrpDown('years', '1995');
    await clickElement(By.id(radioNewselter));
    await clickElement(By.id(offerOption));
};

// enter address details
let addressInfo = async function () {
    await enterText(By.id(Add1), "3768 Line road");
    await enterText(By.id(city), "Hudson");
    await selectDrpDown('id_state', 'Florida');
    await enterText(By.id(pCode), "34669");
    await enterText(By.id(mNumber), "7276972240");
    await enterText(By.id(addressAlias), "MyHome");
    await clickElement(By.css(register));
};

describe("Aura Code Challenge - Create User Account Tests", () => {

    console.log("<<<<<<<<< Negative scenarios for email ID >>>>>>>>>>>>");

    beforeAll(async () => {
        driver = chromeDriver();

        await driver.get(
            "http://automationpractice.com/index.php?controller=authentication&back=my-account");

    });

    afterAll(async () => {
        await driver.quit();
    });


    test("No Email Id", async () => {
        console.log("<<<<<<<<< No email ID is supplied >>>>>>>>>>>>");
        await clickElement(By.css(createAccountButton));
        assert(await driver.findElement(By.css(errorMessage)).getText() == "Invalid email address.");
    });

    test("Existing Email ID", async () => {

        console.log("<<<<<<<<< Enter existing user email ID >>>>>>>>>>>>");
        await enterText(By.id(emailAddress), "test@gmail.com");
        await clickElement(By.css(createAccountButton));
        assert(await driver.findElement(By.css(errorMessage)).getText() == "An account using this email " +
            "address has already been registered. Please enter a valid password or request a new one.")
    });

    test("happy path", async () => {

        console.log("<<<<<<<<< Register fresh user >>>>>>>>>>>>");
        var emailID = makeEmailID('gmail.com');
        console.log("<<<<<<< email id is :::" + emailID +" >>>>>>>>>");
        await enterText(By.id(emailAddress), emailID);
        await clickElement(By.css(createAccountButton));
        await personalInfo(emailID);
        await addressInfo();
        assert(await driver.findElement(By.css(accountCreationMessage)).getText() == "Welcome to your account. Here you can manage all of your personal information and orders.");

    });

});

