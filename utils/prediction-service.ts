import { exec } from "child_process";
import path from "path";
import {PredictionResult} from "@/utils/types";

/**
 * Calls the Python inference script to get traffic predictions for a specific date and category.
 * @param dateString Format: "YYYY-MM-DD"
 * @param category Valid values: "orders", "visitors"
 */
export async function getTrafficPrediction(dateString: string, category: string): Promise<PredictionResult> {
    // If running on Vercel, use the Python API endpoint
    if (process.env.VERCEL) {
        const host = process.env.VERCEL_URL || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        const url = `${protocol}://${host}/api/predict?date=${dateString}&category=${category}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Prediction API error (${response.status}): ${errorText}`);
                throw new Error(`Prediction API failed: ${response.status}`);
            }
            return await response.json();
        } catch (err: any) {
            console.error("Failed to fetch from prediction API:", err);
            throw err;
        }
    }

    return new Promise((resolve, reject) => {
        // Path to the python script
        const scriptPath = path.join(process.cwd(), "utils", "predict.py");

        // Command to execute
        const command = `python "${scriptPath}" "${dateString}" "${category}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error: ${error.message}`);
                return reject({ error: error.message });
            }

            if (stderr) {
                console.warn(`Python warning: ${stderr}`);
            }

            try {
                const result: PredictionResult = JSON.parse(stdout);
                resolve(result);
            } catch (parseError) {
                console.error("Failed to parse Python output:", stdout);
                reject({ error: "Invalid response from prediction script" });
            }
        });
    });
}
