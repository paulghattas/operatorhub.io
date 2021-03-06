const _ = require('lodash');

const normalizeVersion = version => {
  let normVersion = version.replace(/-beta/gi, 'beta');
  normVersion = normVersion.replace(/-alpha/gi, 'alpha');

  return normVersion;
};

const validMaturityStrings = ['Basic Install', 'Seamless Upgrades', 'Full Lifecycle', 'Deep Insights', 'Auto Pilot'];

const normalizeMaturity = maturity => {
  if (validMaturityStrings.includes(maturity)) {
    return maturity;
  }
  return validMaturityStrings[0];
};

const normalizeOperator = operator => {
  const annotations = _.get(operator, 'metadata.annotations', {});
  const spec = _.get(operator, 'spec', {});
  const iconObj = _.get(spec, 'icon[0]');

  return {
    name: operator.metadata.name,
    displayName: _.get(spec, 'displayName', operator.metadata.name),
    imgUrl: iconObj ? `data:${iconObj.mediatype};base64,${iconObj.base64data}` : '',
    longDescription: _.get(spec, 'description', annotations.description),
    provider: _.get(spec, 'provider.name'),
    version: spec.version,
    versionForCompare: normalizeVersion(spec.version),
    maturity: normalizeMaturity(spec.maturity || ''),
    links: spec.links,
    maintainers: spec.maintainers,
    description: _.get(annotations, 'description'),
    createdAt: annotations.createdAt,
    containerImage: annotations.containerImage
  };
};

const normalizeOperators = operators => _.map(operators, operator => normalizeOperator(operator));

const operatorUtils = {
  normalizeOperator,
  normalizeOperators
};

module.exports = operatorUtils;
