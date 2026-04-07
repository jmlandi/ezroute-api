import { ILinkRepository } from "./link.repository.interface";
import { insertClick } from "../types/link.types";

export interface ILinkCassandraRepository extends ILinkRepository {
    insertClick(click: insertClick): Promise<void>;
}