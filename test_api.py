# import requests

# url = 'http://127.0.0.1:5000/optimize-packaging'
# data = {
#     "dimensions": [10, 5, 2]
# }

# response = requests.post(url, json=data)
# print(response.json())
import requests

url = 'http://127.0.0.1:5000/optimize-packaging'
data = {
    "dimensions": [10, 5, 2],
    "material_type": "biodegradable"  # or "recyclable", "traditional"
}

response = requests.post(url, json=data)
print(response.json())


