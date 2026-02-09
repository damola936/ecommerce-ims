import pandas as pd
from sklearn.metrics import mean_squared_error
from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os

def data_preprocessing(df):
    df["date"] = pd.to_datetime(df["date"])
    df["month_name"] = df["date"].dt.month_name()
    df["day_name"] = df["date"].dt.day_name()
    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day
    df["year"] = df["date"].dt.year
    df["day_of_week"] = df["date"].dt.dayofweek
    df["is_weekend"] = df["date"].dt.dayofweek.isin([5, 6]).astype(int)
    df["quarter"] = df["date"].dt.quarter
    return df.drop(["date"], axis=1)

def train_prediction_model(processed_df, target_type):
    # Prevent Data Leakage as both columns(mobile, desktop) seem correlated: Drop BOTH target columns from features
    X = processed_df.drop(["mobile", "desktop"], axis=1)
    y = processed_df[target_type]

    # Encode strings into numbers
    X = pd.get_dummies(X, drop_first=True)
    feature_columns = X.columns.tolist()
    
    # Split and Scale
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    sc = StandardScaler()
    X_train_scaled = sc.fit_transform(X_train)
    X_test_scaled = sc.transform(X_test)

    # Train
    model = Lasso(alpha=1.0)
    model.fit(X_train_scaled, y_train)
    
    # Accuracy Check
    preds = model.predict(X_test_scaled)
    rmse = mean_squared_error(y_test, preds) ** 0.5
    print(f"Model trained for {target_type}. Avg Error: {rmse:.2f} visitors")
    
    return model, sc, feature_columns

def main():
    # Load data
    data_path = os.path.join(os.path.dirname(__file__), "orders-chart-data.json")
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return

    df = pd.read_json(data_path)
    processed_df = data_preprocessing(df)

    # Execute training
    mobile_model, mobile_scaler, mobile_features = train_prediction_model(processed_df, "mobile")
    desktop_model, desktop_scaler, desktop_features = train_prediction_model(processed_df, "desktop")

    # Create artifacts directory
    artifacts_dir = os.path.join(os.path.dirname(__file__), "model_artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    # Save Mobile Model
    joblib.dump({
        'model': mobile_model,
        'scaler': mobile_scaler,
        'features': mobile_features
    }, os.path.join(artifacts_dir, "mobile_model_orders.joblib"))

    # Save Desktop Model
    joblib.dump({
        'model': desktop_model,
        'scaler': desktop_scaler,
        'features': desktop_features
    }, os.path.join(artifacts_dir, "desktop_model_orders.joblib"))

    print(f"Models and scalers saved to {artifacts_dir}")

if __name__ == "__main__":
    main()
