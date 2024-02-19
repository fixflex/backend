import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import env from '../config/validateEnv';

export interface NotificationOptions {
  headings?: { [key: string]: string };
  contents?: { [key: string]: string };
  external_ids?: string[];
  target_channel?: 'push' | 'email' | 'sms';
  data?: { [key: string]: any };
  // isAndroid?: boolean;
  // isIos?: boolean;
}

class OneSignalApiHandler {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api.onesignal.com/';
  }

  private getHeaders(): AxiosRequestConfig['headers'] {
    return {
      accept: 'application/json',
      Authorization: `Basic ${env.API_KEY}`,
      'content-type': 'application/json',
    };
  }

  private async makeRequest<T = any>(url: string, method: AxiosRequestConfig['method'], options?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        url,
        method,
        headers: this.getHeaders(),
        ...options,
      });
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      // console.error(`Error making request to ${url}`, error);
      throw error;
    }
  }

  async createNotification(options: NotificationOptions): Promise<any> {
    const notification = {
      headings: options.headings || { en: 'Default Notification Heading' },
      contents: options.contents || { en: 'Default Notification Content' },
      data: options.data || {},
      included_segments: options.external_ids ? undefined : ['All'],
      include_aliases: options.external_ids ? { external_id: options.external_ids } : undefined,
      target_channel: options.target_channel || 'push',
      // external_id: '5e88fb40-0e3b-442e-90d7-5c9df898addd',
      // more options:  send_after, delayed_option, delivery_time_of_day, throttle_rate_per_minute, etc.
      app_id: env.APP_ID,
    };

    try {
      const data = await this.makeRequest(`${this.baseUrl}notifications`, 'POST', { data: JSON.stringify(notification) });
      // console.log(data);
      return data;
    } catch (error) {
      // console.error('Error creating OneSignal notification:', error);
      // throw error;
    }
  }

  async viewListOfNotifications(): Promise<void> {
    const url = `${this.baseUrl}notifications?app_id=${env.APP_ID}`;
    try {
      const data = await this.makeRequest<void>(url, 'GET');
      console.log(data);
    } catch (error) {
      console.error('Error viewing list of notifications:', error);
      throw error;
    }
  }

  async sendNotification(userId: string, options: NotificationOptions): Promise<void> {
    const url = `${this.baseUrl}notifications`;
    const notification = {
      headings: options.headings || { en: 'Default Notification Heading' },
      contents: options.contents || { en: 'Default Notification Content' },
      include_player_ids: [userId],
      data: options.data || {},
      app_id: env.APP_ID,
    };

    try {
      const data = await this.makeRequest<void>(url, 'POST', { data: JSON.stringify(notification) });
      console.log(data);
    } catch (error) {
      console.error('Error sending OneSignal notification:', error);
      throw error;
    }
  }

  async getNotificationDetails(notificationId: string): Promise<void> {
    const url = `${this.baseUrl}notifications/${notificationId}?app_id=${env.APP_ID}`;
    try {
      const data = await this.makeRequest<void>(url, 'GET');
      console.log(data);
    } catch (error) {
      console.error('Error getting notification details:', error);
      throw error;
    }
  }

  async updateNotification(notificationId: string, options: NotificationOptions): Promise<void> {
    const url = `${this.baseUrl}notifications/${notificationId}?app_id=${env.APP_ID}`;
    const notification = {
      headings: options.headings || {},
      contents: options.contents || {},
      data: options.data || {},
    };

    try {
      const data = await this.makeRequest<void>(url, 'PUT', { data: JSON.stringify(notification) });
      console.log(data);
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const url = `${this.baseUrl}notifications/${notificationId}?app_id=${env.APP_ID}`;
    try {
      const data = await this.makeRequest<void>(url, 'DELETE');
      console.log(data);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Add more methods for other OneSignal REST API operations as needed
}

export { OneSignalApiHandler };

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// // const fetch = require('node-fetch');
// // @ts-ignore
// import fetch from 'node-fetch';

// import env from '../config/validateEnv';

// // Uncomment this line if you are using Node.js
// interface NotificationOptions {
//   headings?: { [key: string]: string };
//   contents?: { [key: string]: string };
//   data?: { [key: string]: any };
// }

// class OneSignalApiHandler {
//   private apiUrl: string;

//   constructor() {
//     this.apiUrl = 'https://api.onesignal.com/';
//   }

//   private getHeaders(): { [key: string]: string } {
//     return {
//       accept: 'application/json',
//       Authorization: `Basic ${env.API_KEY}`,
//       'content-type': 'application/json',
//     };
//   }

//   async createNotification(options: NotificationOptions): Promise<void> {
//     const notification = {
//       headings: options.headings || { en: 'Default Notification Heading' },
//       contents: options.contents || { en: 'Default Notification Content' },
//       data: options.data || {},
//       app_id: env.APP_ID,
//     };

//     const requestOptions = {
//       method: 'POST',
//       headers: this.getHeaders(),
//       body: JSON.stringify(notification),
//     };

//     try {
//       const response = await fetch(this.apiUrl, requestOptions);
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error('Error creating OneSignal notification:', error);
//       throw error;
//     }
//   }

//   async viewListOfNotifications(): Promise<void> {
//     const url = `${this.apiUrl}notifications?app_id=${env.APP_ID}`;
//     const options = { method: 'GET', headers: this.getHeaders() };

//     try {
//       const response = await fetch(url, options);
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error('Error viewing list of notifications:', error);
//       throw error;
//     }
//   }

//   async viewNotification(notificationId: string): Promise<void> {
//     const url = `${this.apiUrl}/${notificationId}?app_id=${env.APP_ID}`;
//     const options = { method: 'GET', headers: this.getHeaders() };

//     try {
//       const response = await fetch(url, options);
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error('Error viewing notification:', error);
//       throw error;
//     }
//   }

//   async sendNotification(userId: string, options: NotificationOptions): Promise<void> {
//     const notification = {
//       headings: options.headings || { en: 'Default Notification Heading' },
//       contents: options.contents || { en: 'Default Notification Content' },
//       include_player_ids: [userId],
//       data: options.data || {},
//       app_id: env.APP_ID,
//     };

//     const requestOptions = {
//       method: 'POST',
//       headers: this.getHeaders(),
//       body: JSON.stringify(notification),
//     };

//     try {
//       const response = await fetch(this.apiUrl, requestOptions);
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error('Error sending OneSignal notification:', error);
//       throw error;
//     }
//   }

//   async updateNotification(notificationId: string, options: NotificationOptions): Promise<void> {
//     const url = `${this.apiUrl}/${notificationId}?app_id=${env.APP_ID}`;
//     const notification = {
//       headings: options.headings || { en: 'Updated Heading' },
//       contents: options.contents || { en: 'Updated Content' },
//       data: options.data || {},
//     };

//     const requestOptions = {
//       method: 'PUT',
//       headers: this.getHeaders(),
//       body: JSON.stringify(notification),
//     };

//     try {
//       const response = await fetch(url, requestOptions);
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error('Error updating notification:', error);
//       throw error;
//     }
//   }

//   async deleteNotification(notificationId: string): Promise<void> {
//     const url = `${this.apiUrl}/${notificationId}?app_id=${env.APP_ID}`;
//     const options = { method: 'DELETE', headers: this.getHeaders() };

//     try {
//       const response = await fetch(url, options);
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//       throw error;
//     }
//   }

//   async viewDevices(): Promise<void> {
//     const url = 'https://onesignal.com/api/v1/players';
//     const options = { method: 'GET', headers: this.getHeaders() };

//     try {
//       const response = await fetch(url, options);
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error('Error viewing devices:', error);
//       throw error;
//     }
//   }

//   async viewDevice(deviceId: string): Promise<void> {
//     const url = `https://onesignal.com/api/v1/players/${deviceId}`;
//     const options = { method: 'GET', headers: this.getHeaders() };

//     try {
//       const response = await fetch(url, options);
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error('Error viewing device:', error);
//       throw error;
//     }
//   }

//   // Add more methods for other OneSignal REST API operations as needed
// }

// export { OneSignalApiHandler };

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// function pushNotificationT() {
//     const fetch = require('node-fetch');

//     const url = 'https://api.onesignal.com/notifications';
//     const options = {
//         method: 'POST',
//         headers: {
//             accept: 'application/json',
//             'Authorization': `Basic ${ONE_SIGNAL_CONFIG.API_KEY}`,
//             'content-type': 'application/json'
//         },
//         body: JSON.stringify({
//             app_id: ONE_SIGNAL_CONFIG.APP_ID,
//             name: 'fix_flex',
//             // included_segments: ["All"],
//             // data: { foo: "bar", this: "that" },

//             // send_after: 'string',
//             // delayed_option: 'string',
//             // delivery_time_of_day: 'string',
//             // throttle_rate_per_minute: 0,
//             // custom_data: {
//             //     "foo": "bar",
//             //     "this": "that"
//             // },
//             // external_id: 'string'

//             //             curl --include \
//             //      --request POST \
//             //      --header "Content-Type: application/json; charset=utf-8" \
//             //      --header "Authorization: Basic YOUR_REST_API_KEY" \
//             //      --data-binary "{\"app_id\": \"5eb5a37e-b458-11e3-ac11-000c2940e62c\",
//             // \"contents\": {\"en\": \"English Message\"},
//             // \"headings\": {\"en\": \"English Title\"},
//             // \"target_channel\": \"push\",
//             // \"include_aliases\": { \"external_id\": [\"custom-external_id-assigned-by-api-1\", \"custom-external_id-assigned-by-api-2\", \"custom-external_id-assigned-by-api-3\"]}}" \
//             //      https://onesignal.com/api/v1/notifications
//             // , isIos: true

//             // external_id: '6531fb0c4b050167705db4a6', // not work
//             // include_aliases: { "external_id": ["6531fb0c4b050167705db4a6"], target_channel: "push" }// not work

//             // include_external_user_ids: ["6531fb0c4b050167705db4a6"],// work
//             contents: { en: 'English Message', ar: 'Arabic Message' },
//             headings: { en: 'English Title' },
//             custom_data: { "order_id": 123, "currency": "USD", "amount": 25 },
//             "include_aliases": {
//                 "external_id": ["6531fb0c4b050167705db4a6"]
//             },
//             "target_channel": "push",
//             "isAndroid": true

//         })
//     };
//     fetch(url, options)
//         .then(res => res.json())
//         .then(json => console.log(json))
//         .catch(err => console.error('error:' + err));
// }
// // pushNotificationT();
