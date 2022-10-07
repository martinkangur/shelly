let CONFIG = {
  api_endpoint: "https://dashboard.elering.ee/api/nps/price/ee/current",
  switchId: 0,             // ID of the switch to control
  price_limit: 200,        // EUR/MWh. Vat not included
  update_time: 60000,      // 1 minute. Price update interval in milliseconds
  reverse_switching: false // If true, switch will be turned on when price is over the limit
};

let current_price = null;
let last_hour = null;
let last_price = null;
let state = null;

function getCurrentPrice() {
  Shelly.call(
    "http.get",
    {
      url: CONFIG.api_endpoint,
    },
    function (response, error_code, error_message) {
      if (error_code !== 0) {
        print(error_message);
        return;
      }
      current_price = JSON.parse(response.body).data[0]["price"];
      print("Updated current price!");
    }
  );
}

function changeSwitchState(state) {
  let state = state;

  if(state === false) {
    print("Switching off!");
  } else if(state === true) {
    print("Switching on!");
  } else {
    print("Unknown state");
  }

  Shelly.call(
    "Switch.Set",
    {
      id: CONFIG.switchId,
      on: state,
    },
    function (response, error_code, error_message) {
      if (error_code !== 0) {
        print(error_message);
        return;
      }
    }
  );
}

Timer.set(CONFIG.update_time, true, function (userdata) {
  Shelly.call("Sys.GetStatus", {}, function (resp, error_code, error_message) {
    if (error_code !== 0) {
      print(error_message);
      return;
    } else {
      let hour = resp.time[0] + resp.time[1];
      //update prices
      if (last_hour !== hour) {
        print("update hour");
        last_hour = hour;
        getCurrentPrice();
      }

      //check if current price is set
      if (current_price !== null) {

        //Normal switching. Turn relay off if price is over the limit
        if(CONFIG.reverse_switching === false) {
          if (current_price >= CONFIG.price_limit) {
            //swith relay off if price is higher than limit
            changeSwitchState(false);
          } else {
            //swith relay on if price is lower than limit
            changeSwitchState(true);
          }
        }

        //Reverse switching. Turn relay on if price is over the limit
        if(CONFIG.reverse_switching === true) {
          if (current_price >= CONFIG.price_limit) {
            //swith relay on if price is higher than limit
            changeSwitchState(true);
          } else {
            //swith relay off if price is lower than limit
            changeSwitchState(false);
          }
        }

      } else {
        print("Current price is null. Waiting for price update!");
      }
      

      print(current_price);
    }
  });
});
