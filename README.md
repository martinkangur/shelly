 
# Add Nordpool price ๐ถ switching to your shelly device
 
This code works if you live in Estonia ๐ช๐ช, Lithuania ๐ฑ๐ป, Latvia ๐ฑ๐น or Finland ๐ซ๐ฎ. Just change the country code in the API endpoint.

# Script setup
Make sure your Shelly device is connected to the Internet and accessible from LAN.
* Login to the cloud โ๏ธ
* Find device
* Click settings
* Device information
* Device IP
This should open in a new browser window with local access to Shelly's device.
 
## Installing Script
 
* Click on **Scripts** button
* Open **Libary** modular
* Push **Configure URL** button
* Paste URL `https://raw.githubusercontent.com/martinkangur/shelly/main/SHELLY_MJS.md`
* Click on desired script
 

## Configure API endpoint
Find `api_endpoint` and change `#COUNTRY_CODE#` ๐ to ee, lv, lt or fi
```
api_endpoint: "https://dashboard.elering.ee/api/nps/price/#COUNTRY_CODE#/current"
```
 
## Set your price point  ๐
Find configuration value `price_limit` will be set when your device turns on or off. Prices donโt include VAT and are measured in EUR/MWh
### Example
```  price_limit: 200 ```
Will set toggling threshold for the device to 200 EUR/MWh
 
## Setting relay to switch.
Most shelly devices have only one output(relay). If you want to change the output channel find `switchId` and set it to the desired output.
 

![alt text](https://i0.wp.com/dimmer.ee/wp-content/uploads/2022/09/09-trim.jpg?resize=223%2C40&ssl=1)
