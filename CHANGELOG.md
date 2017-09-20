# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.1] - 2017-09-20

### Fixed

  - Resolves crashing issue when failing to connect to ingestion server

## [3.0.0] - 2017-09-19

### Fixed

  - The built in `console` functions are no longer patched on import

### Changed

  - To append metadata without installing a transport, you must set `timber.config.append_metadata = true`

[Unreleased]: https://github.com/timberio/timber-node/compare/v3.0.1...HEAD
[3.0.1]: https://github.com/timberio/timber-node/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/timberio/timber-node/compare/v2.1.1...v3.0.0
