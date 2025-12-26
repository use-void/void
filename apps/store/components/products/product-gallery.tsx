export function ProductGallery({ images }: { images: string[] }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="aspect-square overflow-hidden rounded-md bg-muted/20">
                <img 
                    src={images[0]} 
                    alt="Product" 
                    className="h-full w-full object-cover"
                />
            </div>
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.slice(1).map((image, i) => (
                        <div key={i} className="aspect-square overflow-hidden rounded-md bg-muted/20 cursor-pointer">
                            <img src={image} alt={`Product ${i + 2}`} className="h-full w-full object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
