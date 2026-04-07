import { createLink, insertClick } from "../types/link.types";

export interface ILinkRepository {
  create(link: createLink): Promise<any>;
  findByShortCode(shortCode: string): Promise<any>;
}
