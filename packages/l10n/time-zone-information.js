import PropTypes from 'prop-types';
import createL10NInjector from './create-l10n-injector';
import getSupportedLanguage from './utils/get-supported-language';
import extractLanguageFromLocale from './utils/extract-language-from-locale';

export const timeZonesShape = PropTypes.objectOf(
  PropTypes.shape({
    label: PropTypes.string,
    abbr: PropTypes.string,
    offset: PropTypes.string,
  })
);

/**
 * If running through webpack, code splitting makes `getTimeZonesForLocale`
 * a function that asynchronously loads the country data.
 */
const getTimeZonesForLocale = (locale, cb) => {
  const languageFromLocale = extractLanguageFromLocale(locale);
  const supportedLocale = getSupportedLanguage(languageFromLocale);
  // Use default webpackMode (lazy) so that we generate one file per locale.
  // The files are named like "time-zone-data-en-json.chunk.js" after compilation
  // https://webpack.js.org/api/module-methods/#import-
  import(/* webpackChunkName: "time-zone-data-[request]" */
  `./data/time-zones/${supportedLocale}.json`)
    .then(timeZones => cb(null, timeZones.default))
    .catch(error => cb(error));
};

export const withTimeZones = createL10NInjector({
  displayName: 'withTimeZones',
  propKey: 'timeZones',
  propLoadingKey: 'isLoadingTimeZones',
  loadLocale: getTimeZonesForLocale,
});