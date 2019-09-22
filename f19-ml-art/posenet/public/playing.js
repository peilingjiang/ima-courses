function playViolin() {
  // All points discussed are on bow-hand side
  // Old
  let old_v_shoulder = createVector(allPoints['rightShoulder'].getpX(), allPoints['rightShoulder'].getpY());
  let old_v_elbow = createVector(allPoints['rightElbow'].getpX(), allPoints['rightElbow'].getpY());
  let old_v_wrist = createVector(allPoints['rightWrist'].getpX(), allPoints['rightWrist'].getpY());
  let old_e_to_s = old_v_shoulder.sub(old_v_elbow);
  let old_e_to_w = old_v_wrist.sub(old_v_elbow);
  let old_angle = degrees(old_e_to_s.angleBetween(old_e_to_w)).toFixed(2);

  // New
  let v_shoulder = createVector(allPoints['rightShoulder'].getX(), allPoints['rightShoulder'].getY());
  let v_elbow = createVector(allPoints['rightElbow'].getX(), allPoints['rightElbow'].getY());
  let v_wrist = createVector(allPoints['rightWrist'].getX(), allPoints['rightWrist'].getY());
  let e_to_s = v_shoulder.sub(v_elbow);
  let e_to_w = v_wrist.sub(v_elbow);
  let angle = degrees(e_to_s.angleBetween(e_to_w)).toFixed(2);

  if (abs(angle - old_angle) > 12) {
    console.log('playing...');
  }
}
