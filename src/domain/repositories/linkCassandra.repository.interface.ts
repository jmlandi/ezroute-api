import { ILinkRepository } from "./link.repository.interface";

export interface ILinkCassandraRepository extends ILinkRepository {
    insertClick(click: any): Promise<void>;
}