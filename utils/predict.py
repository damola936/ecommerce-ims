import sys
import json
import pandas as pd
import joblib
import os
from concurrent.futures import ThreadPoolExecutor

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

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No date or category provided"}))
        return

    target_date = sys.argv[1]
    target_category = sys.argv[2]

    if target_category == "visitors":
        mobile_model_path = "mobile_model.joblib"
        desktop_model_path = "desktop_model.joblib"
    elif target_category == "orders":
        mobile_model_path = "mobile_model_orders.joblib"
        desktop_model_path = "desktop_model_orders.joblib"
    else:
        print(json.dumps({"error": "Invalid category provided"}))
        return

    artifacts_dir = os.path.join(os.path.dirname(__file__), "model_artifacts")
    
    try:
        # Load models and predict in parallel
        with ThreadPoolExecutor() as executor:
            # Start loading both models in parallel
            mobile_load_future = executor.submit(joblib.load, os.path.join(artifacts_dir, mobile_model_path))
            desktop_load_future = executor.submit(joblib.load, os.path.join(artifacts_dir, desktop_model_path))
            
            # Wait for models to load
            mobile_data = mobile_load_future.result()
            desktop_data = desktop_load_future.result()

            # Start predictions in parallel
            mobile_pred_future = executor.submit(predict_traffic, target_date, mobile_data)
            desktop_pred_future = executor.submit(predict_traffic, target_date, desktop_data)
            
            # Get results
            p_mobile = mobile_pred_future.result()
            p_desktop = desktop_pred_future.result()

        # Output result as JSON for the website
        result = {
            "date": target_date,
            "mobile": p_mobile,
            "desktop": p_desktop
        }
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
