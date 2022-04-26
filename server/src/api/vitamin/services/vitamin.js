'use strict';

/**
 * vitamin service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vitamin.vitamin');
