# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.0.0] - 2014-08-09
### Added
- Adde example withQueryStore in documentation
### Changed
- BREAKING: the StorageEngine API no longer expects stringified JSON. Instead, the interface should consist of two methods: setStore(store) and getStore()
### Removed
- BREAKING: removed EJSON dependency, which means stringification for withLocalStore and withSessionStore will not support Date objects. Create your own StorageEngine in case you need this feature

## [3.1.5] - TODO

TODO
