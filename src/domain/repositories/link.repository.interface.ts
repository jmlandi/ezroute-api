export interface ILinkRepository {
  create(link: any): Promise<any>;
  findByShortCode(shortCode: string): Promise<any>;
}
