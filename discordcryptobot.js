const Discord = require('discord.js');
const client = new Discord.Client();
const COINMARKETCAP_API_KEY = "YOUR_COINMARKETCAP_API_KEY";
const COINMARKETCAP_API_URL = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH&convert=USD&CMC_PRO_API_KEY=${COINMARKETCAP_API_KEY}`;
const CHANNEL_ID = "YOUR_CHANNEL_ID";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set a timer to check for price changes every 10 minutes
  setInterval(checkPriceChanges, 10 * 60 * 1000);
});

function checkPriceChanges() {
  // Get the current prices from CoinMarketCap
  const request = require('request');
  request(COINMARKETCAP_API_URL, { json: true }, (err, res, body) => {
    if (err) {
      console.log(err);
      return;
    }

    // Get the BTC and ETH prices
    const btcPrice = body.data.BTC.quote.USD.price;
    const ethPrice = body.data.ETH.quote.USD.price;

    // Check for significant price changes
    if (btcPrice > PRICE_ALERT_THRESHOLD || ethPrice > PRICE_ALERT_THRESHOLD) {
      // Construct the alert message
      let alertMessage = "**Price Alert:**\n";
      if (btcPrice > PRICE_ALERT_THRESHOLD) {
        alertMessage += `\nBitcoin price is $${btcPrice}`;
      }
      if (ethPrice > PRICE_ALERT_THRESHOLD) {
        alertMessage += `\nEthereum price is $${ethPrice}`;
      }

      // Get the specified Discord channel
      const channel = client.channels.cache.get(CHANNEL_ID);

      // Send the alert message to the Discord channel
      channel.send(alertMessage);
    }
  });
}

client.login('YOUR_DISCORD_BOT_TOKEN');
