import {fetchFebHiLoOrderCategory, HiLoOrder} from "@/utils/actions";
import {extraBarChartData} from "@/utils/bar-chart-data";

/**
 * Predicts the highest and lowest categories for a given month.
 * This function uses the pre-trained CategoryModel.
 * 
 * @param month - The month name (e.g., "January")
 * @returns The prediction results containing highestCategory, lowestCategory, etc.
 */
export const predictCategoricalData = (month: string) => {
    return categoryModel.predict(month);
};

const fetchDataFromDB = async (): Promise<HiLoOrder[]> => {
    const fetchedData = await fetchFebHiLoOrderCategory()
    return Array.isArray(fetchedData) ? [...fetchedData, ...extraBarChartData] : extraBarChartData;
}

export const predictByMonth = async (month: string): Promise<HiLoOrder | null> => {
    const barChartData = await fetchDataFromDB();
    const data = barChartData.find(d => d.month.toLowerCase() === month.toLowerCase());
    return data || null;
};

export class CategoryModel {
    private readonly data: () => Promise<HiLoOrder[]>;

    constructor() {
        this.data = async ():Promise<HiLoOrder[]> => await fetchDataFromDB();
    }

    public async predict(month: string) {
        const data = await this.data();
        return data.find(d => d.month.toLowerCase() === month.toLowerCase()) || null; // returns the existing month, no prediction model yet as data is too small
    }
}

// Pre-built model instance
export const categoryModel = new CategoryModel();
