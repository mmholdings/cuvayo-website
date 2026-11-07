# Cuvayo website

Static GitHub Pages site for Cuvayo. The iOS source lives in the private mmholdings/cuvayo repository.

Site: https://mmholdings.github.io/cuvayo-website/
Privacy: https://mmholdings.github.io/cuvayo-website/privacy/

Edit config.js to set the real App Store URL when released. Buttons then open the listing instead of the early-access dialog. The website contains public configuration only; all provider and signing keys belong in Railway Variables.

Public forms are hosted by the Cuvayo API on Railway. Configure WEB_ORIGINS when adding a custom domain. Signup consent is explicit, support requests are separate, and no launch email is sent automatically. Maintain a working support response process and review policy accuracy whenever the app's data handling changes.

GitHub Pages: main branch, root folder. No build tool is needed.
