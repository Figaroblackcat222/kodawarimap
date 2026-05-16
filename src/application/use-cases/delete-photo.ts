import type { PhotoRepository } from "@application/ports/photo-repository";

export async function deletePhoto(repo: PhotoRepository, id: string): Promise<void> {
  await repo.delete(id);
}
