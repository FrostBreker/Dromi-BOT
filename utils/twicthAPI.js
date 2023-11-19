const axios = require('axios');
const { EventEmitter } = require('events');

class TwicthAPI extends EventEmitter {
    constructor(client) {
        super()
        this.timestampParser = client.timestampParser;
        this.initialized = false;
        this.getToken().then((data) => {
            this.tokenData = data
            this.initialized = true;
            this.emit("ready")
        });
    }

    async getToken() {
        const configAxios = {
            method: 'post',
            url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return await axios(configAxios)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
                return null
            });
    }

    async getStreamData(channelName) {
        if (this.tokenData === null) this.tokenData = await this.getToken();
        const configAxios = {
            method: 'get',
            url: `https://api.twitch.tv/helix/streams?user_login=${channelName}`,
            headers: {
                'Authorization': `Bearer ${this.tokenData.access_token}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        };
        return await axios(configAxios)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
                return null
            });
    };

    async getChannelData(channelName) {
        if (this.tokenData === null) this.tokenData = await this.getToken();
        const configAxios = {
            method: 'get',
            url: `https://api.twitch.tv/helix/users?login=${channelName}`,
            headers: {
                'Authorization': `Bearer ${this.tokenData.access_token}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        };
        return await axios(configAxios)
            .then(function (response) {
                return response.data.data[0];
            })
            .catch(function (error) {
                console.log(error);
                return null
            });
    };
}

module.exports = TwicthAPI;