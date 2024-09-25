// const express = require('express');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Packaging optimization endpoint
// app.post('/optimize-packaging', (req, res) => {
//   try {
//     const { dimensions, material_type } = req.body;

//     // Ensure dimensions are valid
//     if (!Array.isArray(dimensions) || dimensions.length !== 3) {
//       return res.status(400).json({ error: "Invalid dimensions. Provide an array of three numbers." });
//     }

//     const [length, width, height] = dimensions;

//     // Additional checks for positive dimensions
//     if (length <= 0 || width <= 0 || height <= 0) {
//       return res.status(400).json({ error: "All dimensions must be positive numbers." });
//     }

//     // Define reduction percentage based on material type
//     let reductionFactor;
//     switch (material_type) {
//       case 'biodegradable':
//         reductionFactor = 0.85; // Biodegradable packaging can reduce by 15%
//         break;
//       case 'plastic':
//         reductionFactor = 0.95; // Plastic packaging can reduce by 5%
//         break;
//       case 'paper':
//         reductionFactor = 0.90; // Paper packaging can reduce by 10%
//         break;
//       default:
//         reductionFactor = 0.90; // Default to 10% reduction
//         break;
//     }

//     // Apply reduction to the dimensions
//     const optimizedPackaging = {
//       length: length * reductionFactor,
//       width: width * reductionFactor,
//       height: height * reductionFactor,
//     };

//     // Define material cost per square unit based on material type
//     const materialCostPerSquareUnit = {
//       biodegradable: 15.0,
//       plastic: 10.0,
//       paper: 7.0,
//     }[material_type] || 10.0; // Default to 10.0 if the material type is invalid

//     // Calculate surface area of the optimized packaging
//     const surfaceArea = 2 * (
//       optimizedPackaging.length * optimizedPackaging.width +
//       optimizedPackaging.length * optimizedPackaging.height +
//       optimizedPackaging.width * optimizedPackaging.height
//     );

//     // Calculate material cost based on the surface area
//     const materialUsed = surfaceArea * materialCostPerSquareUnit;

//     res.json({
//       optimized_packaging: optimizedPackaging,
//       surfaceArea: surfaceArea,
//       materialUsed: materialUsed,
//     });

//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Internal Server Error. Please try again later." });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });





const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const dotenv = require('dotenv'); // Import dotenv

// Load environment variables from uri.env
dotenv.config({ path: 'config/uri.env' });

const app = express();
// const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the URI from environment variable
const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Schema and Model if you want to store the optimized packaging results
const packagingSchema = new mongoose.Schema({
  dimensions: [Number],
  material_type: String,
  optimized_packaging: {
    newlength: Number,
    newwidth: Number,
    newheight: Number,
  },
  surfaceArea: Number,
  materialUsed: Number,
}, { timestamps: true });

const Packaging = mongoose.model('Packaging', packagingSchema);

// Packaging optimization endpoint
app.post('/optimize-packaging', async (req, res) => {
  try {
    const { dimensions, material_type } = req.body;

    // Ensure dimensions are valid
    if (!Array.isArray(dimensions) || dimensions.length !== 3) {
      return res.status(400).json({ error: "Invalid dimensions. Provide an array of three numbers." });
    }

    const [length, width, height] = dimensions;

    // Additional checks for positive dimensions
    if (length <= 0 || width <= 0 || height <= 0) {
      return res.status(400).json({ error: "All dimensions must be positive numbers." });
    }

    // Define reduction percentage based on material type
    let reductionFactor;
    switch (material_type) {
      case 'biodegradable':
        reductionFactor = 0.85; // Biodegradable packaging can reduce by 15%
        break;
      case 'plastic':
        reductionFactor = 0.95; // Plastic packaging can reduce by 5%
        break;
      case 'paper':
        reductionFactor = 0.90; // Paper packaging can reduce by 10%
        break;
      default:
        reductionFactor = 0.90; // Default to 10% reduction
        break;
    }

    // Apply reduction to the dimensions
    const optimizedPackaging = {
      newlength: length * reductionFactor,
      newwidth: width * reductionFactor,
      newheight: height * reductionFactor,
    };

    // Define material cost per square unit based on material type
    const materialCostPerSquareUnit = {
      biodegradable: 15.0,
      plastic: 10.0,
      paper: 7.0,
    }[material_type] || 10.0; // Default to 10.0 if the material type is invalid

    // Calculate surface area of the optimized packaging
    const surfaceArea = 2 * (
      optimizedPackaging.newlength * optimizedPackaging.newwidth +
      optimizedPackaging.newlength * optimizedPackaging.newheight +
      optimizedPackaging.newwidth * optimizedPackaging.newheight
    );

    // Calculate material cost based on the surface area
    const materialUsed = surfaceArea * materialCostPerSquareUnit;

    // Save optimized packaging data to MongoDB
    const packagingData = new Packaging({
      dimensions,
      material_type,
      optimized_packaging: optimizedPackaging,
      surfaceArea,
      materialUsed,
    });

    await packagingData.save();

    res.json({
      optimized_packaging: optimizedPackaging,
      surfaceArea: surfaceArea,
      materialUsed: materialUsed,
    });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
});

// Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});