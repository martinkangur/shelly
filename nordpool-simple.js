let CONFIG = {
  api_endpoint: "https://dashboard.elering.ee/api/nps/price/ee/current",
  switchId: 0,
  price_limit: 200,
  update_time: 60000,
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

      //check price
      if (current_price !== null && current_price >= CONFIG.price_limit) {
        print("price limit reached");
        changeSwitchState(false);
      } else {
        print("price limit not reached");
        changeSwitchState(true);
      }

      print(current_price);
    }
  });
});
