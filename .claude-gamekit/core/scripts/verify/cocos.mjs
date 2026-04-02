export function planCocosVerification(capability, workspaceFound) {
  if (!workspaceFound) {
    return {
      result: "blocked",
      blocked_reason: "No Cocos Creator 3.x project markers were found in the current workspace.",
      checks_run: ["static_audit", "project_marker_validation"]
    };
  }

  return {
    result: "ci_required",
    blocked_reason: "Cocos Creator verification may require Editor-assisted or CI-assisted execution beyond this scaffold, even when CLI build planning is available.",
    checks_run: [
      "static_audit",
      "project_marker_validation",
      "build_config_validation",
      "cli_build_plan"
    ]
  };
}
