# Contributing to Dart Training Tracker

Thank you for your interest in this project! Please note that this repository is **closed to external contributions**.

---

## 🚫 No External Pull Requests

We do **not** accept external pull requests or code contributions. Any opened pull requests will be closed automatically without merge.

If you have:

* **Bug Reports**: Please open a GitHub Issue describing the bug, including steps to reproduce and your device/browser.
* **Feature Ideas**: You are welcome to open a GitHub Issue with your ideas or suggestions.
* **Personal Customizations**: This project is licensed under the **MIT License**, so you are free to fork the repository, modify the code, and run or publish your own version.

---

## 📋 Quality Checklist (For Internal Maintenance)

All updates must satisfy:

- [ ] Unit tests pass (`node --test 'tests/*.test.js'`)
- [ ] HTML validates (`npx html-validate index.html stats.html data.html`)
- [ ] Change verified in the browser (mobile viewport)
- [ ] For releases: `CACHE_VERSION` in `sw.js` matches the new tag
