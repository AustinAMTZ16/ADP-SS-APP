'use strict';

import React, { Component } from 'react';

class configurationModel {
  constructor( id, version_app, first_time, domain, phone_hwid, phone_device_token, phone_platform, phone_model,
    phone_version, phone_language, phone_region, language, access_token, refresh_token, expires_token,
    grant_type, internet, load_data, setting, app_status, is_connected, user_username, user_plain_password, loginInfoDone, timeZone, 
    apiVersion, warningTypeList, idSector, accountNumber, tenantId, isoCode, currencies, xAppClient, userIp, phoneMask ) {
    this.id = id;
    this.domain = domain;
    this.version_app = version_app;
    this.first_time = first_time;
    this.phone_hwid = phone_hwid;
    this.phone_device_token = phone_device_token;
    this.phone_platform = phone_platform;
    this.phone_model = phone_model;
    this.phone_version = phone_version;
    this.phone_language = phone_language;
    this.phone_region = phone_region;

    this.language = language;
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.expires_token = expires_token;
    this.grant_type = grant_type;
    this.internet = internet;
    this.load_data = load_data;
    this.setting = setting;
    this.app_status = app_status;
    this.is_connected = is_connected;
    this.user_username = user_username;
    this.user_plain_password = user_plain_password;
    this.loginInfoDone = loginInfoDone;
    this.timeZone = timeZone;
    this.apiVersion = apiVersion;
    this.warningTypeList = warningTypeList;
    this.idSector = idSector;
    this.accountNumber = accountNumber;
    this.tenantId = tenantId;
    this.isoCode = isoCode;
    this.currencies = currencies;
    this.xAppClient = xAppClient;
    this.userIp = userIp;
    this.phoneMask = phoneMask;

  }
}

export default configurationModel;
