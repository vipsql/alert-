import React, { Component } from 'react'
import Notification from './notification'

let defaultThreshold = 100 // 上限100条
let defaultPlacement = 'topRight';
let defaultGetContainer
const notificationInstance = {}

function getNotificationInstance(args) {
  if (notificationInstance[defaultPlacement]) {
    return notificationInstance[defaultPlacement];
  }
  notificationInstance[defaultPlacement] = Notification.newInstance(args);
  return notificationInstance[defaultPlacement];
}

const api = {
  // app component open run By set threashold
  config(args) {
    defaultPlacement = args.placement || defaultPlacement
    getNotificationInstance({
      ...args,
      threshold: args.threshold || defaultThreshold,
    })
  },
  // update when have new notices
  update(notices) {
    if (notificationInstance[defaultPlacement]) {
      notificationInstance[defaultPlacement].update(notices)
    }
  },
  // destroy webNotification
  destroy() {
    Object.keys(notificationInstance).forEach(key => {
      notificationInstance[key].destroy();
      delete notificationInstance[key];
    });
  }
}

export default api as NotificationApi;