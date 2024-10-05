export default function keplerTo3D(a, e, i, omega, Omega, nu) {
    /* 
        a: 
        e: 
        i:
        omega:
        Omega:
        nu:
    */
    // Step 1: Calculate the radius
    let r = (a * (1 - e * e)) / (1 + e * Math.cos(nu));
    
    // Step 2: Orbital plane coordinates
    let x_orb = r * Math.cos(nu);
    let y_orb = r * Math.sin(nu);
    let z_orb = 0;

    // Step 3: Rotation matrices
    // Rotation by argument of periapsis (ω)
    let cos_omega = Math.cos(omega);
    let sin_omega = Math.sin(omega);
    let x1 = cos_omega * x_orb - sin_omega * y_orb;
    let y1 = sin_omega * x_orb + cos_omega * y_orb;

    // Rotation by inclination (i)
    let cos_i = Math.cos(i);
    let sin_i = Math.sin(i);
    let x2 = x1;
    let y2 = cos_i * y1;
    let z2 = sin_i * y1;

    // Rotation by longitude of ascending node (Ω)
    let cos_Omega = Math.cos(Omega);
    let sin_Omega = Math.sin(Omega);
    let x3 = cos_Omega * x2 - sin_Omega * y2;
    let y3 = sin_Omega * x2 + cos_Omega * y2;
    let z3 = z2;

    // Step 4: Return the 3D coordinates
    return new THREE.Vector3(x3, y3, z3);
}
