# Fluid Simulation

This is a bad fluid sim I made after watching some idiot make a fluid sim in 4 months and thought that I could do it better in less than a day. I did do it, in 4 hours, and it looks pretty convincing, while also being kind of slow because I was too lazy to add any special partitioning.

# Changing the settings

-   You can change the physics settings by altering the global constants at the top of the `main.js` and `physics.js`.
-   You can show collision boxes, show displacement by color, add directional indicators, or show the distance calculations for each particle by commenting/uncommenting the labeled code in the `render()` function in `physics.js`.
-   You can change how particles are rendered by altering the `circle()` function in `render.js`. There you will see two constants at the top of the function responsible for controlling how circles are rendered.

![No gravity](https://github.com/Sopur/fluid-sim/blob/main/pictures/no-gravity.png?raw=true)
![Water ball](https://github.com/Sopur/fluid-sim/blob/main/pictures/waterball.png?raw=true)
![Wave](https://github.com/Sopur/fluid-sim/blob/main/pictures/wave.png?raw=true)
