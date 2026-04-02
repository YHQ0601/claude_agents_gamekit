# Engine Capabilities

Capability artifacts are the structured source of truth:

- `.claude-gamekit/project/artifacts/capabilities/unity.json`
- `.claude-gamekit/project/artifacts/capabilities/godot.json`
- `.claude-gamekit/project/artifacts/capabilities/web.json`
- `.claude-gamekit/project/artifacts/capabilities/wechat-minigame.json`
- `.claude-gamekit/project/artifacts/capabilities/cocos.json`

Use these artifacts to decide whether validation can run locally, headlessly, or only in CI.

Cocos Creator support is limited to 3.x. Use `cocos.json` to declare whether a project is 2D, 3D, or mixed, plus its active publish targets.
