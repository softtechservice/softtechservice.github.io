/* Compatibility with public policy links in existing app versions. */
(() => {
  const destinations = {
    "terms": "terms.html",
    "refund": "refund-policy.html",
    "delete-account": "delete-account.html",
    "permissions": "permissions.html",
    "safety": "data-safety.html"
};
  function followLegacySection() {
    const destination = destinations[window.location.hash.slice(1)];
    if (destination) window.location.replace(destination);
  }
  followLegacySection();
  window.addEventListener('hashchange', followLegacySection);
})();
