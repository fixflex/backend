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
      app_id: env.APP_ID,
    };

    try {
      const data = await this.makeRequest(`${this.baseUrl}notifications`, 'POST', { data: JSON.stringify(notification) });
      return data;
    } catch (error) {}
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
}

export { OneSignalApiHandler };
