class ModelTagService {
  variants = ["badge-primary", "badge-secondary", "badge-accent"];

  getTagVariant(index: number): string {
    return this.variants[index % this.variants.length];
  }
}

export const modelTagService = new ModelTagService();
