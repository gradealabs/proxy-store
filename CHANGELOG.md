# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.1.0] - 2018-11-07
### Added
- Optional getCachedStore and setCachedStore methods on Storage Engines to allow the engine to decide how to manipulate the cached store
### Changed
- Instead of loading all persisted stores immediately, lazy-load them on demand

## [4.0.1] - 2018-11-05
### Changed
- Fixed issue where localStorage and sessionStorage were attempted to be loaded in incompatible environments

## [4.0.0] - 2018-11-01
### Added
- Added example withQueryStore in documentation
### Changed
- BREAKING: the StorageEngine API no longer expects stringified JSON. Instead, the interface should consist of two methods: setStore(store) and getStore()
### Removed
- BREAKING: removed EJSON dependency, which means stringification for withLocalStore and withSessionStore will not support Date objects. Create your own StorageEngine in case you need this feature

## [3.1.5] - TODO

TODO
