from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the app

def packaging_optimization(product_dimensions, material_type):
    length, width, height = product_dimensions
    
    # Simple padding of 5% for safe packaging
    padding = 0.05 * max(length, width, height)
    
    # Optimized packaging dimensions
    packaging_length = length + padding
    packaging_width = width + padding
    packaging_height = height + padding
    
    # Calculate surface area for material usage
    material_used = 2 * (packaging_length * packaging_width + 
                         packaging_length * packaging_height + 
                         packaging_width * packaging_height)

    # Environmental impact calculation based on material type
    impact_factor = {"biodegradable": 0.5, "recyclable": 0.3, "traditional": 1.0}
    environmental_impact = material_used * impact_factor.get(material_type, 1.0)

    return (packaging_length, packaging_width, packaging_height), material_used, environmental_impact

@app.route("/optimize-packaging", methods=['POST'])
def optimize_packaging():
    try:
        data = request.json  # Parse the incoming JSON data
        dimensions = data.get('dimensions')  # Expecting an array [length, width, height]
        material_type = data.get('material_type')  # Expecting a string for material type

        if not dimensions or not material_type:
            return jsonify({"error": "Invalid input data."}), 400  # Bad Request if input is invalid

        optimized_packaging, material_used, environmental_impact = packaging_optimization(dimensions, material_type)

        return jsonify({
            "optimized_packaging": {
                "length": optimized_packaging[0],
                "width": optimized_packaging[1],
                "height": optimized_packaging[2]
            },
            "material_used": material_used,
            "environmental_impact": environmental_impact
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Internal Server Error for unexpected issues

if __name__ == '__main__':
    app.run(debug=True)
