'use strict';

const businessFactory = require('../app/business');

(async () => await businessFactory().getSubscriptionManager().syncAll())();
