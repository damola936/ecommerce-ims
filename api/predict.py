from http.server import BaseHTTPRequestHandler
import json
import os
import numpy as np
from datetime import datetime

def predict_traffic(date_string, model_data):
    model = model_data['model']
    scaler = model_data['scaler']
    feature_columns = model_data['features']

    # 1. Parse date
    dt = datetime.strptime(date_string, "%Y-%m-%d")
    
    # 2. Extract features manually (matching the previous pandas logic)
    month = dt.month
    day = dt.day
    year = dt.year
    day_of_week = dt.weekday() # Monday is 0, Sunday is 6
    is_weekend = 1 if day_of_week in [5, 6] else 0
    quarter = (month - 1) // 3 + 1
    
    month_name = dt.strftime("%B")
    day_name = dt.strftime("%A")

    # 3. Create initial feature dictionary
    features = {
        "month": month,
        "day": day,
        "year": year,
        "day_of_week": day_of_week,
        "is_weekend": is_weekend,
        "quarter": quarter,
        f"month_name_{month_name}": 1,
        f"day_name_{day_name}": 1
    }
    
    # 4. Align with expected feature columns (One-Hot Encoding)
    # We create a numpy array of zeros with the length of feature_columns
    input_vector = np.zeros(len(feature_columns))
    
    for i, col in enumerate(feature_columns):
        if col in features:
            input_vector[i] = features[col]
            
    # 5. Scale and Predict
    input_vector = input_vector.reshape(1, -1)
    df_scaled = scaler.transform(input_vector)
    prediction = model.predict(df_scaled)
    
    return max(0, int(prediction[0]))

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        target_date = query.get('date', [None])[0]
        target_category = query.get('category', [None])[0]

        if not target_date or not target_category:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Missing date or category"}).encode())
            return

        # Paths to artifacts
        # Use an absolute path relative to this file to avoid issues with CWD on Vercel
        current_dir = os.path.dirname(os.path.abspath(__file__))
        artifacts_dir = os.path.join(os.path.dirname(current_dir), "utils", "model_artifacts")

        if target_category == "visitors":
            mobile_model_path = "mobile_model.joblib"
            desktop_model_path = "desktop_model.joblib"
        elif target_category == "orders":
            mobile_model_path = "mobile_model_orders.joblib"
            desktop_model_path = "desktop_model_orders.joblib"
        else:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Invalid category"}).encode())
            return

        try:
            # Load models and predict in parallel
            with ThreadPoolExecutor() as executor:
                mobile_load_future = executor.submit(joblib.load, os.path.join(artifacts_dir, mobile_model_path))
                desktop_load_future = executor.submit(joblib.load, os.path.join(artifacts_dir, desktop_model_path))
                
                mobile_data = mobile_load_future.result()
                desktop_data = desktop_load_future.result()

                mobile_pred_future = executor.submit(predict_traffic, target_date, mobile_data)
                desktop_pred_future = executor.submit(predict_traffic, target_date, desktop_data)
                
                p_mobile = mobile_pred_future.result()
                p_desktop = desktop_pred_future.result()

            result = {
                "date": target_date,
                "mobile": p_mobile,
                "desktop": p_desktop
            }
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
