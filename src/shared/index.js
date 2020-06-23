const shared = {
  endpoint: process.env.VUE_APP_ENDPOINT_URL,
  apiEndpoint: process.env.VUE_APP_API_ENDPOINT_URL,
  cookieEndpoint: process.env.VUE_APP_COOKIE_ENDPOINT_URL,

  quFields: [
    'avail',
    'price',
    'osale',
    'minlos',
    'maxlos',
    'carr',
    'cdep',
    'grnt',
  ],
};

export default shared;
