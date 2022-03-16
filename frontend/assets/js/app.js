// Config content (json): this configuration is applied to the particles
// Refer to https://github.com/VincentGarreau/particles.js/ to customize this file
// Background color and other properties are in main.css

particlesJS('particles-js',
  
{
  "particles": {
    "number": {
      // Avoid high values, they cause lags
      "value": 70, 
      "density": {
        "enable": true,
        "value_area": 1000
      }
    },
    "color": {
      // The color changes depending on month
      "value": ["#049A41","#eeeeee"]
    },
    "shape": {
      "type": ["image"],
      "stroke": {
        "width": 12,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 6
      },
      // Not used since it's not in the "type" array above
      "image": { 
        "src": "images/mongo.png",
        "width": 250,
        "height": 350
      }
    },
    "opacity": {
      "value": 1,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0.4,
        "sync": false
      }
    },
    "size": {
      "value": 20,
      "random": true,
    },
    "line_linked": {
      "enable": true,
      "distance": 120,
      "color": "#eeeeee",
      "opacity": 0.5,
      "width": 1.5
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "top",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "attract": {
        "enable": true,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        // Avoid "push": if the user repeatedly clicks, the frame rate starts dropping
        "enable": true,
        "mode": "repulse"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 150,
        "line_linked": {
          "opacity": 0.8
        }
      },
      "bubble": {
        "distance": 300,
        "size": 8,
        "duration": 1,
        "opacity": 6,
        "speed": 6
      },
      "repulse": {
        "distance": 250
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true,
}

);