import { exec } from "child_process";
import path from "path";
import {PredictionResult} from "@/utils/types";
import { headers } from "next/headers";

/**
 * Calls the Python inference script to get traffic predictions for a specific date and category.
 * @param dateString Format: "YYYY-MM-DD"
 * @param category Valid values: "orders", "visitors"
 */
export async function getTrafficPrediction(dateString: string, category: string): Promise<PredictionResult> {
    // If running on Vercel, use the Python API endpoint
    if (process.env.VERCEL) {
        let host = process.env.VERCEL_URL;
        
        try {
            const headerList = await headers();
            const hostHeader = headerList.get("host");
            if (hostHeader) {
                host = hostHeader;
            }
        } catch (error) {
            console.error("Failed to get host from headers:", error);
        }

        if (!host) {
            host = "localhost:3000";
        }

        const protocol = host.includes("localhost") ? "http" : "https";
        const url = `${protocol}://${host}/api/predict?date=${encodeURIComponent(dateString)}&category=${encodeURIComponent(category)}`;
        
        console.log(`Fetching prediction from: ${url}`);
        
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Prediction API error (${response.status}) for URL ${url}: ${errorText}`);
                throw new Error(`Prediction API failed: ${response.status}. ${errorText}`);
            }
            return await response.json();
        } catch (err: any) {
            console.error(`Failed to fetch from prediction API (${url}):`, err);
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
