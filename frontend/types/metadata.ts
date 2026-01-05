

interface Attribute {
    trait_type: string;
    value: string | number;
}

export interface Metadata {
    name: string;
    description: string;
    image: string;
    attributes: Attribute[];
}
