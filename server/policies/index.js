'use strict';

const buildPluginConfig = require('../utils/buildPluginConfig');
const FALLBACK_ROLES_VALUES = require('../utils/fallbackRoles');
const getPluginConfig = require('../utils/getPluginConfig');
const { PolicyError } = require('@strapi/utils').errors;

module.exports = {
  checkConfigRoles: (ctx, ø, { strapi }) => {
    var hasPermission = false;
    var configRoles = getPluginConfig(strapi)('roles', FALLBACK_ROLES_VALUES);
    var adminRoles = ctx.state.user.roles;

    for (let adminRole of adminRoles) {
      hasPermission = configRoles.some((configRole) => {
        return configRole == adminRole.code;
      });
    }

    if (!hasPermission) {
      throw new PolicyError('ACCESS_DENIED', { type: 'ROLES_AND_PERMISSIONS' });
    }

    return hasPermission;
  },
  validatePluginConfig: (ø1, ø2, { strapi }) => {
    var pluginConfig = buildPluginConfig(strapi);

    for (const key in pluginConfig) {
      let value = pluginConfig[key];
      if (!key || !value) {
        throw new PolicyError('MISSING_CONFIG', {
          type: `${key.toLowerCase()}`,
        });
      }
    }

    return true;
  },
};
