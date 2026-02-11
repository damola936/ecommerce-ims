import { createClient } from '@supabase/supabase-js'

const bucket = "ecommerce-ims-bucket"

export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)


export const uploadImagesToBucket = async (images: File[]) => {
    const imageUrls = []
    for (const image of images) {
        const timeStamp = Date.now()
        const newName = `${timeStamp}-${image.name}`
        const {data, error} = await supabaseClient.storage.from(bucket).upload(newName, image, {cacheControl: "3600"})
        if(error) {
            console.error("Supabase upload error:", error)
            throw new Error(`Could not upload image: ${error.message}`)
        }
        if(!data) throw new Error("Could not upload image: No data returned")
        imageUrls.push(supabaseClient.storage.from(bucket).getPublicUrl(newName).data.publicUrl)
    }
    return imageUrls
}

export const uploadImageToBucket = async (image: File) => {
    const timeStamp = Date.now();
    const newName = `${timeStamp}-${image.name}`;
    const { data } = await supabaseClient.storage
        .from(bucket)
        .upload(newName, image, { cacheControl: "3600" });
    if (!data) throw new Error("Could not upload image");
    return supabaseClient.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};