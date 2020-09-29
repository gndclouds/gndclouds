const response = await fetch("https://slate.host/api/v1/get", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // NOTE: your API key
    Authorization: "Basic SLA234abe41-c235-464f-9f4a-9effbbd3530dTE"
  },

  body: JSON.stringify({
    data: {
      // NOTE: optional, if you want your private slates too.
      private: false
    }
  })
});
const json = await response.json();
console.log(json);
