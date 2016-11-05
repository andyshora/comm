/**
 * Various helper functions involving Trigonometry.
 * This is a class with static methods, allowing methods to call eachother.
 */
class Trig {
  /**
   * Converts Degrees to Radians
   * @param  {number} degs Number of degrees
   * @return {number}      Radians conversion
   */
  static d2r(degs) {
    return degs * (Math.PI / 180);
  }

  /**
   * Get the radial position around a circle, based on the radius and angle
   * @param  {object} params The radius and angle, in degrees
   * @return {object}        The x, y position
   */
  static getRadialPosition(params) {

    const { angle, radius } = params;

    const thetaDegrees = angle;
    const thetaRadians = this.d2r(thetaDegrees);

    const x = Math.sin(thetaRadians) * radius;
    const y = -Math.cos(thetaRadians) * radius;

    return { x, y };
  }

  /**
   * Create path data using SVG mini-language representing a sector shape
   * @param  {number} x          The start x position (the origin)
   * @param  {number} y          The start y position (the origin)
   * @param  {number} r          The sector radius
   * @param  {number} startAngle The degrees of the start angle
   * @param  {number} endAngle   The degrees of the end angle
   * @return {string}            The path data
   */
  static createCurvedPathData(x, y, r, startAngle, endAngle) {

    // are we drawing a large arc, sweeping > 180 degrees?
    // the rendered needs to know, so it doesn't take a shortcut round the shorter path
    let largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    // is arc to be drawn in positive direction?
    const sweepFlag = 1;
    
    // edge case, if we're sweeping round through 0 degree line
    if (endAngle < startAngle && ((360 - startAngle) + endAngle >= 180)) {
      largeArc = 1;
    }

    // convert angles to Radians for Math functions
    const startAngleRadians = this.d2r(startAngle);
    const endAngleRadians = this.d2r(endAngle);

    // we need to move the cursor (M),
    // draw a line (L)
    // draw an arc (A)
    // then a line back to the start point (Z)
    return [
      'M', x + Math.sin(startAngleRadians) * r, y - (Math.cos(startAngleRadians) * r),
      'A', r, r, 0, largeArc, sweepFlag, x + Math.sin(endAngleRadians) * r, y - (Math.cos(endAngleRadians) * r)
    ].join(' ');
  }

  /**
   * Interpolate SVG path data for a sector, from a start angle to an end angle
   * @param  {number} x          The start x position (the origin)
   * @param  {number} y          The start y position (the origin)
   * @param  {number} r          The sector radius
   * @param  {number} startAngle The degrees of the start angle
   * @param  {number} endAngle   The degrees of the end angle
   * @return {function}          The interpolator function
   */
  static interpolateSVGSector(x, y, r, startAngle, endAngle) {
    return t => this.generateSVGSector(x, y, r, startAngle, startAngle + (endAngle - startAngle) * t);
  }

  /**
   * Generate SVG path data for a sector
   * @param  {number} x          The start x position (the origin)
   * @param  {number} y          The start y position (the origin)
   * @param  {number} r          The sector radius
   * @param  {number} startAngle The degrees of the start angle
   * @param  {number} endAngle   The degrees of the end angle
   * @return {string}            The path data
   */
  static generateSVGSector(x, y, r, startAngle, endAngle) {
    let arcStr = this.generateSVGArc(x, y, r, startAngle, endAngle);
    return arcStr + `L ${ x } ${ y } L ${ x } ${ y }`;
  }

  /**
   * Generate SVG path data for an arc around a circle
   * @param  {number} x          The start x position (the origin)
   * @param  {number} y          The start y position (the origin)
   * @param  {number} r          The sector radius
   * @param  {number} startAngle The degrees of the start angle
   * @param  {number} endAngle   The degrees of the end angle
   * @return {string}            The path data
   */
  static generateSVGArc(x, y, r, startAngle, endAngle) {

    // convert angles to Radians
    startAngle = this.d2r(startAngle);
    endAngle = this.d2r(endAngle);

    if (startAngle > endAngle) {
      [startAngle, endAngle] = [endAngle, startAngle];
    }

    // if arc is > 180 degrees, we must set a large arc flag
    // so the path isnt drawn via shortest path.
    // in other words we use a large arc if we want the line rendered around more than half of a circle
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    // path command, start by moving cursor
    let arr = ['M', x + Math.sin(startAngle) * r, y - (Math.cos(startAngle) * r)];

    const rx = r;
    const ry = r;

    // is arc to be drawn in positive direction?
    const sweepFlag = 1;

    // arc command
    arr = arr.concat(['A', rx, ry, 0, +largeArcFlag, sweepFlag]);

    // arc end position
    arr = arr.concat([x + Math.sin(endAngle) * r, y - (Math.cos(endAngle) * r)]);

    return arr.join(' ');
  }

  /**
   * Create path data using SVG mini-language representing a sector shape
   * @param  {number} x          The start x position (the origin)
   * @param  {number} y          The start y position (the origin)
   * @param  {number} r          The sector radius
   * @param  {number} startAngle The degrees of the start angle
   * @param  {number} endAngle   The degrees of the end angle
   * @return {string}            The path data
   */
  static createSectorPathData(x, y, r, startAngle, endAngle) {

    // are we drawing a large arc, sweeping > 180 degrees?
    // the rendered needs to know, so it doesn't take a shortcut round the shorter path
    let largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    // is arc to be drawn in positive direction?
    const sweepFlag = 1;
    
    // edge case, if we're sweeping round through 0 degree line
    if (endAngle < startAngle && ((360 - startAngle) + endAngle >= 180)) {
      largeArc = 1;
    }

    // convert angles to Radians for Math functions
    const startAngleRadians = this.d2r(startAngle);
    const endAngleRadians = this.d2r(endAngle);

    // we need to move the cursor (M),
    // draw a line (L)
    // draw an arc (A)
    // then a line back to the start point (Z)
    return [
      'M', x, y,
      'L', x + Math.sin(startAngleRadians) * r, y - (Math.cos(startAngleRadians) * r),
      'A', r, r, 0, largeArc, sweepFlag, x + Math.sin(endAngleRadians) * r, y - (Math.cos(endAngleRadians) * r),
      'Z'].join(' ');
  }

  /**
   * Get the radial position of a Satellite, taking into account its sector bounds
   * its sibling index, its progress value, and potentially its weight
   * @param  {object} params Various params needed to calculate position
   * @return {object}        x and y position
   */
  static getRadialPositionWithinBounds(params) {
    const { index, totalItems, minProgress, maxProgress, radius, centreRadius, startAngle, endAngle, weight, weightUsed } = params;
    let { progressValue } = params;

    progressValue *= 1 - (centreRadius / radius);

    const avgSliceDegrees = (endAngle - startAngle) / totalItems;

    const orbitScale = 1 - (progressValue / (maxProgress - minProgress));
    const thetaDegrees = weight
      ? startAngle + (((weight / 2) + weightUsed) * (endAngle - startAngle))
      : startAngle + ((index + 0.5) * avgSliceDegrees);

    const thetaRadians = this.d2r(thetaDegrees);

    const x = Math.sin(thetaRadians) * orbitScale * radius;
    const y = -Math.cos(thetaRadians) * orbitScale * radius;

    return { x, y };
  }
};

export default Trig;
