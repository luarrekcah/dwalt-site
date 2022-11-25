const axios = require("axios");

const placeId = "ChIJ1_EVulmRzJMROevUbnHMVVc",
    apiKey = process.env.googleApi;

module.exports = {
    getReviews: async () => {
        const data = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`)
        .then(request => {return request.data});
        return data;
    }
}