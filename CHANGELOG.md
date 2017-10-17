# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.1.1] - 2017-10-17

### Fixed

  - Fixes the key name used for HTTP context to use `http` instead of `http_context`.

## [3.1.0] - 2017-10-17

### Added

  - Exposes a new `LogEntry` class that can be used to build a structured log directly.

## [3.0.4] - 2017-10-08

### Changed

  - Revert previous content type change, changing HTTPS stream to use application/json instead of text/plain.

## [3.0.3] - 2017-10-08

### Changed

  - HTTPS stream uses a text/plain content type instead of an application/json since it
    receives strings.

## [3.0.2] - 2017-09-28

### Fixed

  - Message no longer is included in metadata object
  - Winston timestamps are now preserved when using the formatter

## [3.0.1] - 2017-09-20

### Fixed

  - Resolves crashing issue when failing to connect to ingestion server

## [3.0.0] - 2017-09-19

### Fixed

  - The built in `console` functions are no longer patched on import

### Changed

  - To append metadata without installing a transport, you must set `timber.config.append_metadata = true`

[Unreleased]: https://github.com/timberio/timber-node/compare/v3.1.1...HEAD
[3.1.1]: https://github.com/timberio/timber-node/compare/v3.0.4...v3.1.1
[3.1.0]: https://github.com/timberio/timber-node/compare/v3.0.4...v3.1.0
[3.0.4]: https://github.com/timberio/timber-node/compare/v3.0.3...v3.0.4
[3.0.3]: https://github.com/timberio/timber-node/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/timberio/timber-node/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/timberio/timber-node/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/timberio/timber-node/compare/v2.1.1...v3.0.0
