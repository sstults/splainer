Version numbers correspond to `package.json` version.  Follows the _major.minor.bugfix_ naming pattern.

# 2.20.1 (2023-08-07)
- Introduce versioning to the Splainer project.  The http://splainer.io website has been around for years, and we've just pushed changes as they arrive.   We are now introducing a changelog process, and labeling the current state as "2.20.1" to match the commit https://github.com/o19s/splainer/commit/46cded05908e5d06ebee03f2cccaf836c60f9438#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519.
- Splainer.io can NOW be deployed into your Solr environment using [Solr Packages](https://solr.apache.org/guide/solr/latest/configuration-guide/package-manager.html).  See the package [README.md](./solr-splainer-package/README.md) for more details.  https://github.com/o19s/splainer/pull/97.

# 2.20.2 (2025-11-10)
- Added comprehensive testing framework with unit, functional, integration, and end-to-end tests
- Created new React frontend in `app/` directory with modern development setup
- Added CONTRIBUTING.md with detailed development and testing instructions
- Updated README.md with React development instructions and testing documentation
- Enhanced documentation for both legacy AngularJS and new React components
- Improved test coverage for SearchResults component and services
- Added Docker and development workflow documentation
