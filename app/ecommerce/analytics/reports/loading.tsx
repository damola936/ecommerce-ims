import React from 'react';
import {SkeletonCard} from "@/components/loading/SkeletonCard";
import Container from "@/components/global/container";

function Loading() {
    const skeletons = Array.from({length: 8}, (_, i) => (<SkeletonCard key={i}/>));
    return (
        <Container>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {skeletons.map((skeleton) => (
                    skeleton
                ))}
            </div>
        </Container>
    );
}


export default Loading;