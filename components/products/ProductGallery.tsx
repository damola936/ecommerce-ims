"use client"

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {useState} from "react";

interface ProductImage {
  url: string;
  isPrimary: boolean;
}

interface ProductGalleryProps {
  images: ProductImage[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const [imageUrl, setImageUrl] = useState(primaryImage.url)

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-none bg-muted/20">
        <CardContent className="p-0 aspect-square relative">
          {primaryImage ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover p-4"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Primary Image
            </div>
          )}
        </CardContent>
      </Card>
      
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <Card key={i} className="overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all" onClick={() => setImageUrl(img.url)}>
              <CardContent className="p-0 aspect-square relative">
                <Image
                  src={img.url}
                  alt={`${name} gallery ${i}`}
                  fill
                  className="object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
