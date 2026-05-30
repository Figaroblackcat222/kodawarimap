import type { Pin, PinSpace } from "@domain/entities/pin";

export function isShared(pin: Pick<Pin, "space">): boolean {
  return pin.space?.kind === "group";
}

export function groupIdOf(pin: Pick<Pin, "space">): string | undefined {
  return pin.space?.kind === "group" ? pin.space.groupId : undefined;
}
