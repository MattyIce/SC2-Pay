# SC2 Pay: Integrated STEEM/SBD JavaScript Front-End Payment Add-On for SteemConnect V2

SC2 Pay is an add-on library for SteemConnect V2 to provide a more integrated and seamless STEEM or SBD payment experience for third-party sites and services built on the Steem blockchain.

Currently the process for making STEEM or SBD payments on third-party websites using the SteemConnect V2 library is a little disjointed since it takes the user away from the original site to complete the purchase. They then have to go back to the original site and sometimes wait and/or refresh the page to see if the payment has gone through.

The SC2 Pay plugin allows the payment process to be handled in a popup window without leaving the original site, and providing a client-side callback method when the transaction has been completed so that the website can automatically refresh and show the purchase as soon as it is completed.

## HTML Page Setup
The SC2 Pay library requires the following dependencies:

- [Steem JS Library](https://github.com/steemit/steem-js)
- [SteemConnect V2 JS Library](https://github.com/steemit/sc2-sdk)

Include all of the required libraries in the <head> element of your HTML page as shown below:

```
<!-- Steem JS Library -->
<script src="https://cdn.steemjs.com/lib/latest/steem.min.js"></script>

<!-- SteemConnect V2 JS Library -->
<script src="https://steemit.github.io/example-steemconnect-angular/sc2.min.js"></script>

<!-- SC2 Pay JS Library -->
<script src="sc2-pay.min.js"></script>
```

## Usage

```
// Process payment using SteemConnect
sc2_pay.requestPayment(title, to_account, amount, currency, memo, callback);

// Process payment using Vessel
sc2_pay.requestPaymentVessel(title, to_account, amount, currency, memo, callback);
```

### Parameters:
- **title**: The title text shown on the modal payment dialog.
- **to_account**: The name of the Steem account to which the payment should be sent.
- **amount**: The amount of STEEM or SBD to be paid, this should be a number and not contain the currency name.
- **currency**: The payment currency. Valid values are 'STEEM' or 'SBD'.
- **memo**: The memo to be included with the payment transaction. This should be something that allows your application to uniquely identify this purchase.
- **callback**: This function will be called when the payment is completed or cancelled. On successful payment it will be passed a single parameter which will be a JSON object containing the Steem transaction details.
