# Cocos Creator Adapter

This subtree documents the Cocos Creator adapter for GameKit.

## Scope

- Supports Cocos Creator 3.x only.
- Covers 2D, 3D, and mixed projects through a single `cocos` engine adapter.
- Treats publish targets such as web and WeChat Mini Game as capability metadata, not separate engine values.

## Validation Model

GameKit does not claim a full automated Cocos runtime test platform.

The adapter currently focuses on:

- project marker detection
- static audit planning
- build configuration review
- CLI build planning
- explicit `ci_required` output when Editor or GUI-assisted execution is still needed

This matches the current template philosophy used for the other engines: structure the verification path, capture evidence, and degrade explicitly when local runtime execution is not guaranteed.
