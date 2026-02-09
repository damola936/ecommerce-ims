from http.server import BaseHTTPRequestHandler
import json
import os
import pandas as pd
import joblib
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse, parse_qs

def predict_traffic(date_string, model_data):
    model = model_data['model']
    scaler = model_data['scaler']
    feature_columns = model_data['features']

    # 1. Create a single-row dataframe for the date
    input_df = pd.DataFrame({'date': [pd.to_datetime(date_string)]})
    
    # 2. Apply preprocessing
    df = input_df.copy()
    df["month_name"] = df["date"].dt.month_name()
    df["day_name"] = df["date"].dt.day_name()
    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day
    df["year"] = df["date"].dt.year
    df["day_of_week"] = df["date"].dt.dayofweek
    df["is_weekend"] = df["date"].dt.dayofweek.isin([5, 6]).astype(int)
    df["quarter"] = df["date"].dt.quarter
    df = df.drop(["date"], axis=1)
    
    # 3. Align Columns
    df_encoded = pd.get_dummies(df)
    df_final = df_encoded.reindex(columns=feature_columns, fill_value=0)
    
    # 4. Scale and Predict
    df_scaled = scaler.transform(df_final)
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
